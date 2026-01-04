// ==UserScript==
// @name         Bilibili完整弹幕下载器(WBI认证版)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  下载B站视频完整弹幕(携带WBI认证)
// @author       weiye
// @match        https://www.bilibili.com/video/*
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/protobufjs@7.2.4/dist/protobuf.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/517450/Bilibili%E5%AE%8C%E6%95%B4%E5%BC%B9%E5%B9%95%E4%B8%8B%E8%BD%BD%E5%99%A8%28WBI%E8%AE%A4%E8%AF%81%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/517450/Bilibili%E5%AE%8C%E6%95%B4%E5%BC%B9%E5%B9%95%E4%B8%8B%E8%BD%BD%E5%99%A8%28WBI%E8%AE%A4%E8%AF%81%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // WBI签名相关配置
    const mixinKeyEncTab = [
        46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
        33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
        61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
        36, 20, 34, 44, 52
    ];

    // 对 imgKey 和 subKey 进行字符顺序打乱编码
    const getMixinKey = (orig) => mixinKeyEncTab.map(n => orig[n]).join('').slice(0, 32);

    // 为请求参数进行 wbi 签名
    function encWbi(params, img_key, sub_key) {
        console.log('开始WBI签名, 参数:', params);
        const mixin_key = getMixinKey(img_key + sub_key);
        const curr_time = Math.round(Date.now() / 1000);
        const chr_filter = /[!'()*]/g;

        // 确保所有参数都是字符串
        const safeParams = {};
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== null) {
                // 先转换为字符串，再过滤特殊字符
                safeParams[key] = String(value).replace(chr_filter, '');
            }
        }
        
        // 添加 wts 字段
        safeParams.wts = curr_time;
        
        // 按照 key 重排参数
        const query = Object.keys(safeParams)
            .sort()
            .map(key => {
                return `${encodeURIComponent(key)}=${encodeURIComponent(safeParams[key])}`;
            })
            .join('&');

        // 使用 CryptoJS 计算 MD5
        const wbi_sign = CryptoJS.MD5(query + mixin_key).toString();
        console.log('WBI签名完成:', query + '&w_rid=' + wbi_sign);
        return query + '&w_rid=' + wbi_sign;
    }

    // 获取最新的 img_key 和 sub_key
    async function getWbiKeys() {
        console.log('开始获取WBI Keys...');
        const response = await fetch('https://api.bilibili.com/x/web-interface/nav', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                'Referer': 'https://www.bilibili.com/'
            }
        });
        
        const data = await response.json();
        if (!data.data?.wbi_img) {
            throw new Error('无法获取WBI Keys');
        }

        const { img_url, sub_url } = data.data.wbi_img;
        const img_key = img_url.slice(img_url.lastIndexOf('/') + 1, img_url.lastIndexOf('.'));
        const sub_key = sub_url.slice(sub_url.lastIndexOf('/') + 1, sub_url.lastIndexOf('.'));
        
        console.log('成功获取WBI Keys:', { img_key, sub_key });
        return { img_key, sub_key };
    }

    // 弹幕 protobuf 消息结构
    const danmakuProto = {
        nested: {
            DmSegMobileReply: {
                fields: {
                    elems: {
                        rule: "repeated",
                        type: "DanmakuElem",
                        id: 1
                    }
                }
            },
            DanmakuElem: {
                fields: {
                    id: { type: "int64", id: 1 },
                    progress: { type: "int32", id: 2 },
                    mode: { type: "int32", id: 3 },
                    fontsize: { type: "int32", id: 4 },
                    color: { type: "uint32", id: 5 },
                    midHash: { type: "string", id: 6 },
                    content: { type: "string", id: 7 },
                    ctime: { type: "int64", id: 8 },
                    weight: { type: "int32", id: 9 },
                    idStr: { type: "string", id: 10 },
                    attr: { type: "int32", id: 11 },
                    action: { type: "string", id: 12 }
                }
            }
        }
    };

    /**
     * 获取视频信息
     */
    async function getVideoInfo() {
        console.log('开始获取视频信息...');
        
        // 1. 从URL获取bvid
        const bvid = window.location.pathname.split('/')[2];
        if (!bvid) throw new Error('无法获取视频BV号');
        console.log('获取到BV号:', bvid);

        // 2. 从页面全局变量获取信息
        const initialState = window.__INITIAL_STATE__;
        if (initialState?.aid && initialState?.cid) {
            console.log('从页面变量获取视频信息:', {
                aid: initialState.aid,
                cid: initialState.cid,
                duration: initialState.duration
            });
            return {
                aid: initialState.aid,
                cid: initialState.cid,
                duration: initialState.duration || 0
            };
        }

        // 3. 如果页面变量获取失败，则通过API获取
        console.log('从API获取视频信息...');
        const response = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`);
        const data = await response.json();
        
        if (data.code !== 0) throw new Error(`获取视频信息失败: ${data.message}`);
        if (!data.data?.aid || !data.data?.cid) throw new Error('无法获取视频信息');
        
        const result = {
            aid: data.data.aid,
            cid: data.data.cid,
            duration: data.data.duration
        };
        
        console.log('成功获取视频信息:', result);
        return result;
    }

    /**
     * 获取单个分段的弹幕
     */
    async function getSegmentDanmaku(cid, aid, segmentIndex, wbiKeys) {
        console.log(`获取第 ${segmentIndex} 段弹幕...`);
        
        // 准备参数
        const params = {
            type: 1,
            oid: cid,
            segment_index: segmentIndex,
            pid: aid,
            web_location: 1315873,
            wts: Math.round(Date.now() / 1000)
        };
        
        // WBI签名
        const query = encWbi(params, wbiKeys.img_key, wbiKeys.sub_key);
        const url = `https://api.bilibili.com/x/v2/dm/wbi/web/seg.so?${query}`;
        
        console.log('请求URL:', url);
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const buffer = await response.arrayBuffer();
        
        // 使用protobuf解析
        const root = protobuf.Root.fromJSON(danmakuProto);
        const DmSegMobileReply = root.lookupType("DmSegMobileReply");
        
        try {
            const message = DmSegMobileReply.decode(new Uint8Array(buffer));
            const danmakus = DmSegMobileReply.toObject(message, {
                longs: String,
                enums: String,
                bytes: String,
            }).elems || [];
            
            console.log(`第 ${segmentIndex} 段弹幕获取成功, 数量:`, danmakus.length);
            return danmakus;
        } catch (error) {
            console.error('Protobuf解析错误:', error);
            console.log('原始数据:', new Uint8Array(buffer));
            throw new Error('弹幕数据解析失败');
        }
    }

    /**
     * 下载弹幕
     */
    async function downloadDanmaku() {
        try {
            // 1. 获取WBI Keys
            const wbiKeys = await getWbiKeys();
            
            // 2. 获取视频信息
            const { cid, duration, aid } = await getVideoInfo();
            console.log('视频信息:', { cid, duration, aid });

            // 3. 计算分段数（每段6分钟）
            const segmentCount = Math.ceil(duration / 360);
            console.log(`需要获取 ${segmentCount} 个分段的弹幕`);

            // 4. 获取所有分段的弹幕
            const allDanmakus = new Set();
            for(let i = 1; i <= segmentCount; i++) {
                const danmakus = await getSegmentDanmaku(cid, aid, i, wbiKeys);
                danmakus.forEach(d => {
                    const time = (d.progress/1000).toFixed(2);
                    allDanmakus.add(`[${time}s] ${d.content}`);
                });
                if(i < segmentCount) {
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
            }

            // 5. 按时间排序并下载
            const content = Array.from(allDanmakus)
                .sort((a, b) => {
                    const timeA = parseFloat(a.match(/\[(.*?)s\]/)[1]);
                    const timeB = parseFloat(b.match(/\[(.*?)s\]/)[1]);
                    return timeA - timeB;
                })
                .join('\n');

            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `danmaku_${cid}_full.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            console.log(`成功下载 ${allDanmakus.size} 条弹幕`);

        } catch (error) {
            console.error('获取弹幕失败:', error);
            alert('获取弹幕失败: ' + error.message);
        }
    }

    // 添加下载按钮
    const button = document.createElement('button');
    button.textContent = '下载完整弹幕(WBI)';
    button.style.cssText = 'position: fixed; right: 20px; top: 100px; z-index: 9999; padding: 8px 16px;';
    button.onclick = downloadDanmaku;
    document.body.appendChild(button);

})();