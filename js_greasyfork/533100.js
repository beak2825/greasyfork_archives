// ==UserScript==
// @name         原價屋 商品篩選 + 追蹤清單 + Awesomplete 下拉提示 + 手勢修正
// @namespace    https://www.coolpc.com.tw/
// @version      2.6
// @description  Awesomplete 篩選提示 + 快速刪除歷史紀錄 + 複合數字篩選 + 追蹤清單 + 手勢修正 + 篩選數量顯示整合版
// @author       GPT
// @match        https://www.coolpc.com.tw/eachview.php?IGrp=*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/awesomplete/1.1.5/awesomplete.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533100/%E5%8E%9F%E5%83%B9%E5%B1%8B%20%E5%95%86%E5%93%81%E7%AF%A9%E9%81%B8%20%2B%20%E8%BF%BD%E8%B9%A4%E6%B8%85%E5%96%AE%20%2B%20Awesomplete%20%E4%B8%8B%E6%8B%89%E6%8F%90%E7%A4%BA%20%2B%20%E6%89%8B%E5%8B%A2%E4%BF%AE%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/533100/%E5%8E%9F%E5%83%B9%E5%B1%8B%20%E5%95%86%E5%93%81%E7%AF%A9%E9%81%B8%20%2B%20%E8%BF%BD%E8%B9%A4%E6%B8%85%E5%96%AE%20%2B%20Awesomplete%20%E4%B8%8B%E6%8B%89%E6%8F%90%E7%A4%BA%20%2B%20%E6%89%8B%E5%8B%A2%E4%BF%AE%E6%AD%A3.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ✅ 用 link 標籤載入 Awesomplete CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/awesomplete/1.1.5/awesomplete.min.css';
    document.head.appendChild(link);

    const COOKIE_TRACK = 'coolpc_track_list';
    const COOKIE_SEARCH = 'coolpc_search_history';
    const MAX_HISTORY = 30;

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

    const trackList = getCookie(COOKIE_TRACK);
    const searchHistory = getCookie(COOKIE_SEARCH);

    function saveTrackList() {
        setCookie(COOKIE_TRACK, trackList);
    }

    function saveSearchHistory(historyList) {
        const trimmed = historyList.slice(-MAX_HISTORY);
        setCookie(COOKIE_SEARCH, trimmed);
    }

    function refreshAwesompleteList(awesompleteInstance) {
        awesompleteInstance.list = searchHistory.slice().reverse();
    }

    function updateSearchHistory(newKeyword, aw) {
        const keyword = newKeyword.trim();
        if (!keyword) return;

        const existingIndex = searchHistory.findIndex(x => x.toLowerCase() === keyword.toLowerCase());
        if (existingIndex !== -1) {
            searchHistory.splice(existingIndex, 1);
        }
        searchHistory.push(keyword);
        saveSearchHistory(searchHistory);
        refreshAwesompleteList(aw);
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

    function parseRangeToken(token) {
        const match = token.match(/^([+-])([^\d:]+):(\d+)~(\d+)$/i);
        if (!match) return null;
        const [, type, marker, min, max] = match;
        return {
            type,
            marker: marker.toLowerCase(),
            min: parseInt(min),
            max: parseInt(max)
        };
    }

    function checkRangeInText(text, marker, min, max) {
        const escapedMarker = marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const patterns = [
            new RegExp(`(\\d{2,5})\\s*${escapedMarker}`, 'gi'),
            new RegExp(`${escapedMarker}\\s*(\\d{2,5})`, 'gi')
        ];

        for (const regex of patterns) {
            let result;
            while ((result = regex.exec(text)) !== null) {
                const num = parseInt(result[1]);
                if (!isNaN(num) && num >= min && num <= max) return true;
            }
        }
        return false;
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
        keywordInput.placeholder = '關鍵字: +RGB -Mini +W:200~800';
        keywordInput.style.marginRight = '10px';
        keywordInput.style.width = '400px';
        keywordInput.classList.add('awesomplete');

        const filterBtn = document.createElement('button');
        filterBtn.textContent = '篩選';
        filterBtn.style.marginRight = '10px';

        const resetBtn = document.createElement('button');
        resetBtn.textContent = '重置';
        resetBtn.style.marginRight = '10px';

        const countSpan = document.createElement('span');
        countSpan.id = 'result-count';
        countSpan.textContent = '尚未篩選';
        countSpan.style.fontWeight = 'bold';

        container.appendChild(minInput);
        container.appendChild(maxInput);
        container.appendChild(keywordInput);
        container.appendChild(filterBtn);
        container.appendChild(resetBtn);
        container.appendChild(countSpan);
        document.body.insertBefore(container, document.body.firstChild);

        const aw = new Awesomplete(keywordInput, {
            list: searchHistory.slice().reverse(),
            minChars: 0,
            autoFirst: true
        });

        let selectedSuggestion = '';
        let selectedIndexHighlight = -1;
        let selectedIndexDelete = -1;

        function handleHighlight(e) {
            selectedSuggestion = e.text.label || e.text.value || e.text;
            const currentText = selectedSuggestion.toLowerCase();
            const idx = searchHistory.findIndex(x => x.toLowerCase() === currentText);
            selectedIndexHighlight = idx;
        }
        keywordInput.addEventListener('awesomplete-highlight', handleHighlight);

        keywordInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' && keywordInput.value.trim() === '') {
                if (!aw.opened) aw.evaluate();
            }

            if (e.key === 'Delete') {
                // ✅ 改為用 index 找，而不是用 value 比對
                const idx = selectedIndexHighlight;

                if (idx >= 0 && idx < searchHistory.length) {
                    const deleted = searchHistory.splice(idx, 1)[0];

                    // ✅ 儲存刪除前的 index，避免被 highlight 覆蓋
                    selectedIndexDelete = idx;

                    saveSearchHistory(searchHistory);
                    refreshAwesompleteList(aw);
                    showToast(`🗑️ 已刪除：${deleted}`);
                    keywordInput.value = '';
                    selectedSuggestion = '';
                    selectedIndexHighlight = -1;

                    // 暫停 highlight 監聽器
                    keywordInput.removeEventListener('awesomplete-highlight', handleHighlight);

                    aw.evaluate();

                    requestAnimationFrame(() => {
                        const nextList = aw._list || [];
                        const restoreIndex = Math.min(selectedIndexDelete, nextList.length - 1);

                        if (nextList.length > 0 && restoreIndex >= 0) {
                            aw.goto(restoreIndex);
                            selectedSuggestion = nextList[restoreIndex]?.text || nextList[restoreIndex] || '';
                            selectedIndexHighlight = restoreIndex;
                        } else {
                            selectedSuggestion = '';
                            selectedIndexHighlight = -1;
                        }

                        // 恢復 highlight 監聽器
                        keywordInput.addEventListener('awesomplete-highlight', handleHighlight);
                    });
                }
            }
        });

        keywordInput.addEventListener('dblclick', () => {
            if (keywordInput.value.trim() === '') {
                aw.evaluate();
            }
        });

        filterBtn.onclick = () => {
            const min = parseInt(minInput.value) || 0;
            const max = parseInt(maxInput.value) || Infinity;
            const keywordRaw = keywordInput.value.trim();

            if (keywordRaw) updateSearchHistory(keywordRaw, aw);

            const includeWords = [], excludeWords = [], rangeFilters = [];

            keywordRaw.split(/\s+/).forEach(token => {
                const range = parseRangeToken(token);
                if (range) {
                    rangeFilters.push(range);
                } else if (token.startsWith('+')) {
                    includeWords.push(token.slice(1).toLowerCase());
                } else if (token.startsWith('-')) {
                    excludeWords.push(token.slice(1).toLowerCase());
                }
            });

            const products = document.querySelectorAll("span[onclick^='Show']");
            let visibleCount = 0;

            products.forEach(span => {
                const textContent = span.textContent.toLowerCase();
                const priceDiv = span.querySelector('.x');
                const priceMatch = priceDiv?.textContent.match(/NT(\d+)/);
                const price = priceMatch ? parseInt(priceMatch[1]) : null;

                const includeOk = includeWords.every(w => textContent.includes(w));
                const excludeOk = excludeWords.every(w => !textContent.includes(w));
                const rangeOk = rangeFilters.every(filter =>
                                                   filter.type === '+' ?
                                                   checkRangeInText(textContent, filter.marker, filter.min, filter.max) :
                                                   !checkRangeInText(textContent, filter.marker, filter.min, filter.max)
                                                  );
                const priceOk = price !== null && price >= min && price <= max;

                const show = (includeOk && excludeOk && rangeOk && priceOk);
                span.style.display = show ? '' : 'none';
                if (show) visibleCount++;
            });

            countSpan.textContent = `已篩選 ${visibleCount} 項商品`;
        };

        resetBtn.onclick = () => {
            minInput.value = '';
            maxInput.value = '';
            keywordInput.value = '';
            const products = document.querySelectorAll("span[onclick^='Show']");
            products.forEach(span => {
                span.style.display = '';
            });
            countSpan.textContent = `已顯示全部 ${products.length} 項商品`;
        };
    }

    function addTrackingButton(span, titleRaw) {
        const cleanTitle = titleRaw.replace(/\s+/g, ' ').trim();
        span.setAttribute('data-title', cleanTitle);

        const btn = document.createElement('button');

        function updateButtonState(isTracked) {
            btn.textContent = isTracked ? '已追蹤' : '加入追蹤';
            btn.style.backgroundColor = isTracked ? '#d44' : '#ffcc00';
            btn.style.cursor = 'pointer';
            btn.disabled = false;
        }

        function isTrackedNow() {
            return trackList.some(item => item.title === cleanTitle);
        }

        updateButtonState(isTrackedNow());

        btn.style.position = 'absolute';
        btn.style.right = '5px';
        btn.style.zIndex = 100;
        btn.style.padding = '2px 5px';
        btn.style.border = '1px solid #888';
        btn.style.color = '#fff';

        const titleDiv = span.querySelector('.t');
        let offsetTop = 30;
        if (titleDiv) {
            const rect = titleDiv.getBoundingClientRect();
            offsetTop = rect.height + 8;
        }
        btn.style.top = `${offsetTop}px`;

        btn.onclick = (e) => {
            e.stopPropagation();
            const trackedIndex = trackList.findIndex(item => item.title === cleanTitle);

            if (trackedIndex === -1) {
                const url = span.querySelector('a')?.href || '';
                trackList.push({ title: cleanTitle, url });
                saveTrackList();
                showToast(`✅ 已加入追蹤：${cleanTitle}`);
            } else {
                trackList.splice(trackedIndex, 1);
                saveTrackList();
                showToast(`🗑️ 已取消追蹤：${cleanTitle}`);
            }

            updateButtonState(trackedIndex === -1);

            const listUI = document.getElementById('track-ui');
            const listUL = listUI?.querySelector('ul');
            if (listUI && listUL && typeof window.renderTrackList === 'function') {
                window.renderTrackList(listUL);
            }
        };

        span.style.position = 'relative';
        span.appendChild(btn);
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
                        const btn = document.querySelector(`span[data-title="${item.title}"] button`);
                        if (btn) {
                            btn.textContent = '加入追蹤';
                            btn.style.backgroundColor = '#ffcc00';
                            btn.disabled = false;
                            btn.style.cursor = 'pointer';
                        }
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

                document.querySelectorAll("span[onclick^='Show']").forEach(span => {
                    const btn = span.querySelector('button');
                    if (btn) {
                        btn.textContent = '加入追蹤';
                        btn.style.backgroundColor = '#ffcc00';
                        btn.disabled = false;
                        btn.style.cursor = 'pointer';
                    }
                });
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

        console.log('✅ 使用 fixed 滿版容器修正滾動行為');
    }

    // 🚀 初始化所有功能
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
