// ==UserScript==
// @name         bilispace
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  good
// @match        *://space.bilibili.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547062/bilispace.user.js
// @updateURL https://update.greasyfork.org/scripts/547062/bilispace.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    
    const originalFetch = window.fetch;
    const userCardCache = new Map();
    const requestCounter = new Map();
    function safeGet(obj, path, defaultValue = undefined) {
        return path.split('.').reduce((current, key) => {
            return (current && current[key] !== undefined) ? current[key] : defaultValue;
        }, obj);
    }
 
    async function fetchUserCard(mid) {
        // 检查缓存
        if (userCardCache.has(mid)) {
            console.log(`[SpaceTweaks] 使用缓存数据 mid: ${mid}`);
            return userCardCache.get(mid);
        }
 
        const now = Date.now();
        const userRequests = requestCounter.get(mid) || [];
        const recentRequests = userRequests.filter(time => now - time < 60000);
        
        if (recentRequests.length >= 3) {
            console.warn(`[SpaceTweaks] 用户 ${mid} 请求过于频繁，已限制`);
            return null;
        }
        
        try {
            console.log(`[SpaceTweaks] 获取用户卡片信息 mid: ${mid}`);
            
            const cardResponse = await originalFetch(`https://api.bilibili.com/x/web-interface/card?mid=${mid}`);
            
            if (!cardResponse.ok) {
                console.error(`[SpaceTweaks] 卡片接口请求失败: ${cardResponse.status}`);
                return null;
            }
            
            const cardData = await cardResponse.json();
            
            if (cardData.code !== 0) {
                console.warn(`[SpaceTweaks] 卡片接口返回错误: code=${cardData.code}, message=${cardData.message}`);
                return null;
            }
            if (!cardData.data?.card) {
                console.warn('[SpaceTweaks] 卡片数据结构异常');
                return null;
            }
            
            recentRequests.push(now);
            requestCounter.set(mid, recentRequests);
       
            const cacheData = {
                data: cardData.data.card,
                expiry: now + 300000
            };
            userCardCache.set(mid, cacheData);
            setTimeout(() => {
                userCardCache.delete(mid);
            }, 300000);
            
            return cacheData;
            
        } catch (error) {
            console.error(`[SpaceTweaks] 获取用户卡片时发生错误:`, error);
            return null;
        }
    }
    
    function createSafeResponse(cardData, mid) {
        const card = cardData.data;
        
        const official = {
            type: safeGet(card, 'Official.type', -1),
            desc: safeGet(card, 'Official.desc', ''),
            title: safeGet(card, 'Official.title', '')
        };
        
        return {
            code: 0,
            message: "0",
            ttl: 1,
            data: {
                attestation: {
                    type: official.type,
                    desc: official.desc,
                    splice_info: {
                        title: official.title
                    },
                    common_info: {
                        title: official.title
                    }
                },
                birthday: '01-01',
                certificate_show: 0,
                coins: 0,
                contract: {
                    is_display: false,
                    is_follow_display: false
                },
                elec: {
                    show_info: {
                        show: false
                    }
                },
                face: safeGet(card, 'face', 'https://i0.hdslb.com/bfs/face/member/noface.jpg'),
                face_nft: safeGet(card, 'face_nft', 0),
                face_nft_type: safeGet(card, 'face_nft_type', 0),
                fans_badge: true,
                fans_medal: {
                    show: false
                },
                gaia_data: null,
                gaia_res_type: 0,
                is_followed: false,
                is_risk: false,
                is_senior_member: false,
                level: safeGet(card, 'level_info.current_level', 0),
                mid: parseInt(mid, 10),
                name: safeGet(card, 'name', '未知用户'),
                offical: official, 
                sex: safeGet(card, 'sex', '保密'),
                sign: safeGet(card, 'sign', ''),
                tags: [],
                top_photo_v2: {
                    l_img: safeGet(card, 'l_img', '')
                },
                _spacetweaks_processed: true,
                _spacetweaks_timestamp: Date.now()
            }
        };
    }
    
    window.fetch = async function(...args) {
        const response = await originalFetch.apply(this, args);
 
        if (!args[0] || !args[0].includes('x/space/wbi/acc/info')) {
            return response;
        }
        
        try {
            const clone = response.clone();
            let json;
            
            try {
                json = await clone.json();
            } catch (parseError) {
                console.error('[SpaceTweaks] JSON解析失败:', parseError);
                return response;
            }
 
            if (json.code !== -404) {
                return response;
            }
 
            let mid;
            try {
                const fullUrl = args[0].startsWith('http') ? args[0] : `https://api.bilibili.com${args[0]}`;
                mid = (new URL(fullUrl)).searchParams.get('mid');
                
                if (!mid || !/^\d+$/.test(mid)) {
                    console.warn('[SpaceTweaks] 无效的mid参数:', mid);
                    return response;
                }
            } catch (urlError) {
                console.error('[SpaceTweaks] URL解析失败:', urlError);
                return response;
            }
            
            console.log(`[SpaceTweaks] 检测到用户不存在或被封禁 mid: ${mid}, 尝试获取基本信息`);
 
            const cardData = await fetchUserCard(mid);
            if (!cardData) {
                console.log('[SpaceTweaks] 无法获取用户信息，返回原响应');
                return response;
            }
 
            if (Date.now() > cardData.expiry) {
                console.log('[SpaceTweaks] 缓存已过期，返回原响应');
                return response;
            }
            
            // 构造新的响应
            const newJson = createSafeResponse(cardData, mid);
            
            const newResponse = new Response(JSON.stringify(newJson), {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
            });
            
            console.log(`[SpaceTweaks] 成功为用户 ${mid} 构造响应`);
            return newResponse;
            
        } catch (error) {
            console.error('[SpaceTweaks] 处理响应时发生错误:', error);
            return response;
        }
    };
    
    setInterval(() => {
        const now = Date.now();
        for (const [mid, data] of userCardCache.entries()) {
            if (now > data.expiry) {
                userCardCache.delete(mid);
            }
        }
 
        for (const [mid, requests] of requestCounter.entries()) {
            const recent = requests.filter(time => now - time < 60000);
            if (recent.length === 0) {
                requestCounter.delete(mid);
            } else {
                requestCounter.set(mid, recent);
            }
        }
    }, 60000);
    
    console.log('[SpaceTweaks ');
})();