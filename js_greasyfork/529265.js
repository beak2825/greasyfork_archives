// ==UserScript==
// @name         Kikoeru checker for ASMROne UpdateVer
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Check if ASMR elements exist in the library
// @author       Your Name
// @match        *://asmr-300.com/*
// @match        *://asmr-200.com/*
// @match        *://asmr-100.com/*
// @match        *://www.asmr.one/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529265/Kikoeru%20checker%20for%20ASMROne%20UpdateVer.user.js
// @updateURL https://update.greasyfork.org/scripts/529265/Kikoeru%20checker%20for%20ASMROne%20UpdateVer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 固定常量用于存储JWT令牌
    //if you dont need to login your kikoeru,change next line to  //const Token... and delate '&token=${TOKEN}' in function 'kikoeruCheck's first url
const TOKEN = "TOKEN";
   const BASE_URL = "http://your url:port";
    const processedRJNumbers = new Set();

    // 观察DOM变化
    const observer = new MutationObserver((mutations, obs) => {
    const divs = document.querySelectorAll('div[id^="RJ"]');
    divs.forEach(div => {
        const rjNumber = div.id;
        if (!processedRJNumbers.has(rjNumber)) {
            console.log(`检查RJ号: ${rjNumber}`);
            processedRJNumbers.add(rjNumber);
            getAllRJNumbers(rjNumber).then(rjInfoArray => {
                rjInfoArray.forEach(rjInfo => {
                    kikoeruCheck(rjInfo.rj, rjInfo.language, div);
                });
            }).catch(error => {
                console.error(`获取RJ号信息失败: ${rjNumber}`, error);
                // 出错时使用原始RJ号进行检查
                kikoeruCheck(rjNumber, rjNumber, div);
            });
        }
    });
});

    observer.observe(document, {
        childList: true,
        subtree: true
    });

    // 缓存管理功能
const RJ_CACHE_KEY = "dlsite_rj_language_cache";
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 缓存7天

// 获取缓存数据
function getCache() {
    try {
        const cachedData = localStorage.getItem(RJ_CACHE_KEY);
        if (!cachedData) return {};

        const parsedCache = JSON.parse(cachedData);
        // 清理过期缓存
        const now = Date.now();
        let hasExpired = false;

        Object.keys(parsedCache).forEach(key => {
            if (parsedCache[key].timestamp && (now - parsedCache[key].timestamp) > CACHE_EXPIRY) {
                delete parsedCache[key];
                hasExpired = true;
            }
        });

        if (hasExpired) {
            saveCache(parsedCache);
        }

        return parsedCache;
    } catch (error) {
        console.error("读取缓存失败:", error);
        return {};
    }
}

// 保存缓存数据
function saveCache(data) {
    try {
        localStorage.setItem(RJ_CACHE_KEY, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error("保存缓存失败:", error);
        return false;
    }
}

// 获取RJ号的缓存信息
function getCachedRJInfo(rjNumber) {
    const cache = getCache();
    return cache[rjNumber] || null;
}

// 保存RJ号信息到缓存
function saveRJInfoToCache(rjNumber, rjInfoArray) {
    const cache = getCache();
    cache[rjNumber] = {
        data: rjInfoArray,
        timestamp: Date.now()
    };
    return saveCache(cache);
}

function getAllRJNumbers(rjNumber) {
    return new Promise((resolve, reject) => {
        // 首先检查缓存
        const cachedInfo = getCachedRJInfo(rjNumber);
        if (cachedInfo && cachedInfo.data) {
            console.log(`使用缓存的RJ信息: ${rjNumber}`);
            return resolve(cachedInfo.data);
        }

        // 缓存未命中，请求API
        const url = `https://www.dlsite.com/maniax/work/=/product_id/${rjNumber}.html`;

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');

                const links = doc.querySelectorAll('.work_edition_linklist.type_trans a');
                const rjInfoArray = Array.from(links).map(link => {
                    const match = link.href.match(/RJ\d{6,8}/);
                    const rj = match ? match[0] : null;
                    // 获取语言版本信息
                    const language = link.textContent.trim();
                    return rj ? { rj, language } : null;
                }).filter(Boolean);

                const uniqueRJInfoArray = [...new Map(rjInfoArray.map(item => [item.rj, item])).values()];

                if (uniqueRJInfoArray.length === 0) {
                    console.log(`未找到新的RJ号，使用输入值: ${rjNumber}`);
                    const result = [{ rj: rjNumber, language: "日文" }];
                    // 保存到缓存
                    saveRJInfoToCache(rjNumber, result);
                    resolve(result);
                } else {
                    console.log(`找到带语言的RJ号:`, uniqueRJInfoArray);
                    // 保存到缓存
                    saveRJInfoToCache(rjNumber, uniqueRJInfoArray);
                    resolve(uniqueRJInfoArray);
                }
            },
            onerror: function(error) {
                console.error("请求失败:", error);
                reject(error);
            }
        });
    });
}

// 全局变量 - 用于存储已经创建的容器
let buttonContainerCreated = false;
let globalButtonContainer = null;

async function kikoeruCheck(rj, language, item) {
    const url = `${BASE_URL}/api/search?page=1&sort=desc&order=created_at&nsfw=0&lyric=&seed=50&isAdvance=0&keyword=${rj}&token=${TOKEN}`;
    console.log("检查RJ号:", rj, "语言:", language);

    try {
        const response = await fetchData(url);
        const data = JSON.parse(response.responseText);

        // 创建按钮
        const button = document.createElement('button');
        button.textContent = language || rj; // 使用语言信息作为按钮文本
        button.style.margin = '0 5px';
        button.style.padding = '4px 10px';
        button.style.borderRadius = '4px';
        button.style.border = 'none';
        button.style.color = 'white';
        button.style.fontWeight = 'bold';
        button.style.cursor = 'pointer';
        button.style.display = 'inline-block';  // 使按钮内联显示

        // 设置按钮颜色和点击事件
       if (data && data.works) {
            const works = data.works;
            if (works.length > 1) {
                button.style.backgroundColor = 'green';
                button.onclick = () => window.open(`${BASE_URL}/works?keyword=${rj}`);
            } else if (works.length === 1) {
                const asmroneItemId = works[0].id;
                const isMatch = ["RJ0", "RJ"].some(prefix => [asmroneItemId + 1, asmroneItemId - 1, asmroneItemId].some(id => `${prefix}${id}` === rj));
                if (isMatch) {
                    button.style.backgroundColor = 'green';
                    button.onclick = () => window.open(`${BASE_URL}/work/${asmroneItemId}`);
                } else {
                    button.style.backgroundColor = 'red';
                    button.onclick = () => window.open(`${BASE_URL}/works?keyword=${rj}`);
                }
            } else {
                button.style.backgroundColor = 'red';
                button.onclick = () => window.open(`${BASE_URL}/works?keyword=${rj}`);
            }
        } else {
            console.error("无效的响应结构:", data);
            button.style.backgroundColor = 'red';
        }


        // 使用延迟确保DOM已完成渲染
        setTimeout(() => {
            try {
                const titleElement = item.querySelector('.q-mx-sm.text-h6.text-weight-regular.ellipsis-2-lines');
                const authorElement = item.querySelector('.q-ml-sm.q-mb-xs.text-subtitle1.text-weight-regular');

                if (titleElement && authorElement) {
                    // 检查是否已经创建了按钮容器
                    let buttonContainer = item.querySelector('.kikoeru-btn-container');

                    // 如果没有容器，则创建一个新容器
                    if (!buttonContainer) {
                        buttonContainer = document.createElement('div');
                        buttonContainer.className = 'kikoeru-btn-container';

                        // 设置容器样式 - 横向排列
                        buttonContainer.style.display = 'block';
                        buttonContainer.style.textAlign = 'left';
                        buttonContainer.style.width = '100%';
                        buttonContainer.style.margin = '5px 0';
                        buttonContainer.style.padding = '0 10px';

                        // 将容器插入到DOM
                        titleElement.parentNode.insertBefore(buttonContainer, authorElement);
                        console.log("创建了新的按钮容器");
                    } else {
                        console.log("使用已存在的按钮容器");
                    }

                    // 将按钮添加到容器中
                    buttonContainer.appendChild(button);
                    console.log(`成功将按钮添加到按钮容器`);
                } else {
                    console.error("找不到标题或作者元素");
                }
            } catch (error) {
                console.error("插入按钮时发生错误:", error);
            }
        }, 200);
    } catch (error) {
        console.error("获取数据时出错:", error);
    }
}

    function fetchData(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: (response) => resolve(response),
                onerror: (error) => reject(error),
            });
        });
    }
})();