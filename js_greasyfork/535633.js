// ==UserScript==
// @name         猜盐多板块每日谜题日期选择器
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license MIT
// @description  支持猜原、猜萌、猜病板块的每日谜题自由切换与随机
// @match        https://xiaoce.fun/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/535633/%E7%8C%9C%E7%9B%90%E5%A4%9A%E6%9D%BF%E5%9D%97%E6%AF%8F%E6%97%A5%E8%B0%9C%E9%A2%98%E6%97%A5%E6%9C%9F%E9%80%89%E6%8B%A9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/535633/%E7%8C%9C%E7%9B%90%E5%A4%9A%E6%9D%BF%E5%9D%97%E6%AF%8F%E6%97%A5%E8%B0%9C%E9%A2%98%E6%97%A5%E6%9C%9F%E9%80%89%E6%8B%A9%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 识别当前板块
    const pathname = location.pathname;
    let currentType = null;
    if (pathname.startsWith('/genshin')) currentType = 'genshin';
    else if (pathname.startsWith('/guesscute')) currentType = 'guess_cute';
    else if (pathname.startsWith('/guessdisease')) currentType = 'guess_disease';
    if (!currentType) return;

    const STORAGE_KEY = `xiaoce-date-${currentType}`;
    let selectedDate = localStorage.getItem(STORAGE_KEY) || null;

    // 拦截 fetch，注入 date 参数
    const rawFetch = window.fetch;
    window.fetch = async function (input, init) {
        const url = typeof input === 'string' ? input : input.url;

        if (currentType === 'genshin' && url.includes('/api/v0/quiz/daily/genshin/get')) {
            if (selectedDate) {
                const u = new URL(url, location.origin);
                u.searchParams.set('date', selectedDate);
                const newInput = typeof input === 'string' ? u.href : new Request(u.href, input);
                const newInit = Object.assign({}, init, {
                    headers: Object.assign({}, init?.headers, { 'fun-device': 'web' }),
                });
                return rawFetch.call(this, newInput, newInit);
            }
        }

        if ((currentType === 'guess_cute' && url.includes('/guessCute/guess')) ||
            (currentType === 'guess_disease' && url.includes('/sendMessage'))) {
            if (init?.body) {
                let bodyStr;
                if (typeof init.body === 'string') {
                    bodyStr = init.body;
                } else {
                    try {
                        bodyStr = await new Response(init.body).text();
                    } catch {
                        bodyStr = '';
                    }
                }
                const newBody = bodyStr.replace(/date=\d+/, `date=${selectedDate}`);
                const newInit = Object.assign({}, init, {
                    body: newBody,
                    headers: Object.assign({}, init.headers, {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    })
                });
                return rawFetch.call(this, input, newInit);
            }
        }

        return rawFetch.apply(this, arguments);
    };

    // 获取可用日期
    const fetchAvailableDates = async () => {
        const url = `https://xiaoce.fun/api/v0/quiz/daily/general/fetchActive?type=${currentType}`;
        try {
            const res = await fetch(url, {
                headers: { 'fun-device': 'web' },
                credentials: 'include'
            });
            const json = await res.json();
            if (json.success && Array.isArray(json.data)) {
                return json.data.sort().reverse();
            }
        } catch (e) {
            console.error('[脚本] 获取日期失败', e);
        }
        return [];
    };

    // 注入 UI
    const injectUI = (dates) => {
        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '10px';
        panel.style.left = '10px';
        panel.style.zIndex = '9999';
        panel.style.background = 'white';
        panel.style.border = '1px solid #aaa';
        panel.style.padding = '6px';
        panel.style.borderRadius = '6px';
        panel.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
        panel.style.fontSize = '14px';

        const select = document.createElement('select');
        for (const date of dates) {
            const option = document.createElement('option');
            option.value = date;
            option.textContent = `${date.slice(0,4)}-${date.slice(4,6)}-${date.slice(6)}`;
            if (date === selectedDate) option.selected = true;
            select.appendChild(option);
        }
        select.onchange = () => {
            localStorage.setItem(STORAGE_KEY, select.value);
            location.reload();
        };

        const randomBtn = document.createElement('button');
        randomBtn.textContent = '🎲随机';
        randomBtn.style.marginLeft = '6px';
        randomBtn.onclick = () => {
            const random = dates[Math.floor(Math.random() * dates.length)];
            localStorage.setItem(STORAGE_KEY, random);
            location.reload();
        };

        panel.appendChild(select);
        panel.appendChild(randomBtn);
        document.body.appendChild(panel);
    };

    // 初始化流程
    window.addEventListener('load', async () => {
        const dates = await fetchAvailableDates();
        if (dates.length === 0) return;

        if (!selectedDate) {
            selectedDate = dates[0];
            localStorage.setItem(STORAGE_KEY, selectedDate);
        }

        injectUI(dates);
    });
})();
