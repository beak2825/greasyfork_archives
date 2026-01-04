// ==UserScript==
// @name         原價屋 商品篩選 + 追蹤清單 + 手勢修正
// @namespace    https://www.coolpc.com.tw/
// @version      2.1
// @description  商品篩選、關鍵字搜尋（標題與整體內容）、追蹤清單（加入/刪除/清空）+ 氣泡提示 + 移動到功能 + cookie 儲存 + 使用 fixed 主容器修正滑鼠手勢滾動問題 + UI 調整
// @author       GPT
// @match        https://www.coolpc.com.tw/eachview.php?IGrp=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532974/%E5%8E%9F%E5%83%B9%E5%B1%8B%20%E5%95%86%E5%93%81%E7%AF%A9%E9%81%B8%20%2B%20%E8%BF%BD%E8%B9%A4%E6%B8%85%E5%96%AE%20%2B%20%E6%89%8B%E5%8B%A2%E4%BF%AE%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/532974/%E5%8E%9F%E5%83%B9%E5%B1%8B%20%E5%95%86%E5%93%81%E7%AF%A9%E9%81%B8%20%2B%20%E8%BF%BD%E8%B9%A4%E6%B8%85%E5%96%AE%20%2B%20%E6%89%8B%E5%8B%A2%E4%BF%AE%E6%AD%A3.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const COOKIE_NAME = 'coolpc_track_list';

    function setCookie(name, value, days = 30) {
        const d = new Date();
        d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))};expires=${d.toUTCString()};path=/`;
    }

    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) {
            try {
                return JSON.parse(decodeURIComponent(match[2]));
            } catch (e) {
                return [];
            }
        }
        return [];
    }

    const trackList = getCookie(COOKIE_NAME);

    function saveTrackList() {
        setCookie(COOKIE_NAME, trackList);
    }

    function showToast(message, duration = 2000) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '30px';
        toast.style.right = '30px';
        toast.style.background = 'rgba(0,0,0,0.8)';
        toast.style.color = '#fff';
        toast.style.padding = '10px 15px';
        toast.style.borderRadius = '5px';
        toast.style.zIndex = 9999;
        toast.style.fontSize = '14px';
        toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), duration);
    }

    function addTrackingButton(span, titleRaw) {
        const cleanTitle = titleRaw.replace(/\s+/g, ' ').trim();
        span.setAttribute('data-title', cleanTitle);

        const btn = document.createElement('button');
        btn.textContent = '加入追蹤';
        btn.style.position = 'absolute';
        btn.style.right = '5px';
        btn.style.zIndex = 100;
        btn.style.padding = '2px 5px';
        btn.style.backgroundColor = '#ffcc00';
        btn.style.border = '1px solid #888';
        btn.style.cursor = 'pointer';

        // ⬇️ 根據 .t 標題高度動態決定 top
        const titleDiv = span.querySelector('.t');
        let offsetTop = 30; // fallback 預設高度
        if (titleDiv) {
            const rect = titleDiv.getBoundingClientRect();
            offsetTop = rect.height + 8; // 加一些 margin 避免緊貼
        }
        btn.style.top = `${offsetTop}px`;

        btn.onclick = (e) => {
            e.stopPropagation();
            if (!trackList.find(item => item.title === cleanTitle)) {
                const url = span.querySelector('a')?.href || '';
                trackList.push({ title: cleanTitle, url });
                saveTrackList();
                showToast(`✅ 已加入追蹤：${cleanTitle}`);

                const listUI = document.getElementById('track-ui');
                const listUL = listUI?.querySelector('ul');
                if (listUI && listUL && typeof window.renderTrackList === 'function') {
                    window.renderTrackList(listUL);
                }
            } else {
                showToast(`⚠️ 已存在：${cleanTitle}`);
            }
        };

        span.style.position = 'relative';
        span.appendChild(btn);
    }

    function createFilterUI() {
        const container = document.createElement('div');
        container.id = 'filter-ui';
        container.style.padding = '10px';
        container.style.background = '#f0f0f0';
        container.style.border = '1px solid #ccc';
        container.style.margin = '10px 0';

        const minInput = document.createElement('input');
        minInput.type = 'number';
        minInput.placeholder = '最低價格';
        minInput.style.marginRight = '10px';

        const maxInput = document.createElement('input');
        maxInput.type = 'number';
        maxInput.placeholder = '最高價格';
        maxInput.style.marginRight = '10px';

        const keywordInput = document.createElement('input');
        keywordInput.type = 'text';
        keywordInput.placeholder = '關鍵字: +包含 -排除 (ex: +RGB -Mini)';
        keywordInput.style.marginRight = '10px';
        keywordInput.style.width = '300px';

        const filterBtn = document.createElement('button');
        filterBtn.textContent = '篩選';
        filterBtn.style.marginRight = '10px';

        const resetBtn = document.createElement('button');
        resetBtn.textContent = '重置';

        container.appendChild(minInput);
        container.appendChild(maxInput);
        container.appendChild(keywordInput);
        container.appendChild(filterBtn);
        container.appendChild(resetBtn);
        document.body.insertBefore(container, document.body.firstChild);

        filterBtn.onclick = () => {
            const min = parseInt(minInput.value) || 0;
            const max = parseInt(maxInput.value) || Infinity;
            const keywordRaw = keywordInput.value.trim();
            const includeWords = [], excludeWords = [];

            keywordRaw.split(/\s+/).forEach(token => {
                if (token.startsWith('+')) includeWords.push(token.slice(1).toLowerCase());
                else if (token.startsWith('-')) excludeWords.push(token.slice(1).toLowerCase());
            });

            const products = document.querySelectorAll("span[onclick^='Show']");
            products.forEach(span => {
                const textContent = span.textContent.toLowerCase();
                const priceDiv = span.querySelector('.x');
                const priceMatch = priceDiv?.textContent.match(/NT(\d+)/);
                const price = priceMatch ? parseInt(priceMatch[1]) : null;

                const includeOk = includeWords.every(w => textContent.includes(w));
                const excludeOk = excludeWords.every(w => !textContent.includes(w));
                const priceOk = price !== null && price >= min && price <= max;

                span.style.display = (includeOk && excludeOk && priceOk) ? '' : 'none';
            });
        };

        resetBtn.onclick = () => {
            minInput.value = '';
            maxInput.value = '';
            keywordInput.value = '';
            document.querySelectorAll("span[onclick^='Show']").forEach(span => {
                span.style.display = '';
            });
        };
    }

    function createTrackListUI() {
        const listUI = document.createElement('div');
        listUI.id = 'track-ui';
        listUI.style.display = 'none';
        listUI.style.padding = '10px';
        listUI.style.background = '#e8f7ff';
        listUI.style.border = '1px solid #88c';
        listUI.style.margin = '10px 0';

        const title = document.createElement('h3');
        title.textContent = '📌 我的追蹤清單';
        listUI.appendChild(title);

        const list = document.createElement('ul');
        list.style.paddingLeft = '20px';
        listUI.appendChild(list);

        window.renderTrackList = function (listElement) {
            listElement.innerHTML = '';
            trackList.forEach(item => {
                const li = document.createElement('li');
                const moveBtn = document.createElement('button');
                moveBtn.textContent = '移動到';
                moveBtn.style.marginRight = '5px';
                moveBtn.onclick = () => {
                    const target = [...document.querySelectorAll("span[onclick^='Show']")]
                        .find(span => span.getAttribute('data-title') === item.title);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        target.style.boxShadow = '0 0 10px red';
                        setTimeout(() => target.style.boxShadow = '', 2000);
                    }
                };

                const link = document.createElement('a');
                link.href = item.url;
                link.textContent = item.title;
                link.target = '_blank';

                const del = document.createElement('button');
                del.textContent = '刪除';
                del.style.marginLeft = '5px';
                del.onclick = () => {
                    const idx = trackList.findIndex(p => p.title === item.title);
                    if (idx !== -1) {
                        trackList.splice(idx, 1);
                        saveTrackList();
                        window.renderTrackList(listElement);
                    }
                };

                li.appendChild(moveBtn);
                li.appendChild(link);
                li.appendChild(del);
                listElement.appendChild(li);
            });
        };

        window.renderTrackList(list);

        const clearBtn = document.createElement('button');
        clearBtn.textContent = '清空清單';
        clearBtn.style.marginTop = '10px';
        clearBtn.onclick = () => {
            if (confirm('確定要清空所有追蹤商品嗎？')) {
                trackList.length = 0;
                saveTrackList();
                window.renderTrackList(list);
            }
        };

        listUI.appendChild(clearBtn);
        document.body.insertBefore(listUI, document.body.firstChild);
    }

    function createToggleButton() {
        const btn = document.createElement('button');
        btn.textContent = '🔀 切換篩選/清單';
        btn.style.position = 'fixed';
        btn.style.top = '10px';
        btn.style.right = '10px';
        btn.style.zIndex = 9999;
        btn.style.background = '#66c';
        btn.style.color = '#fff';
        btn.style.padding = '5px 10px';
        btn.style.border = 'none';
        btn.style.cursor = 'pointer';

        btn.onclick = () => {
            const filter = document.getElementById('filter-ui');
            const track = document.getElementById('track-ui');
            if (filter.style.display === 'none') {
                filter.style.display = '';
                track.style.display = 'none';
            } else {
                filter.style.display = 'none';
                track.style.display = '';
            }
        };

        document.body.appendChild(btn);
    }

    function wrapPageFixed() {
        if (document.getElementById('main-scroll-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.id = 'main-scroll-wrapper';
        wrapper.style.position = 'fixed';
        wrapper.style.top = '0';
        wrapper.style.left = '0';
        wrapper.style.right = '0';
        wrapper.style.bottom = '0';
        wrapper.style.overflowY = 'auto';
        wrapper.style.zIndex = '9999';
        wrapper.style.background = 'white';

        while (document.body.firstChild) {
            wrapper.appendChild(document.body.firstChild);
        }

        document.body.appendChild(wrapper);
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        console.log('✅ 已使用 fixed 滿版方式將頁面包入 #main-scroll-wrapper，無額外捲動條');
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            createFilterUI();
            createTrackListUI();
            createToggleButton();

            document.querySelectorAll("span[onclick^='Show']").forEach(span => {
                const title = span.querySelector('.t')?.textContent.trim();
                if (title) {
                    addTrackingButton(span, title);
                }
            });

            wrapPageFixed();
        }, 800);
    });
})();
