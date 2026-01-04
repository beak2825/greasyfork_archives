// ==UserScript==
// @name         E书刊 & 万维学术 搜索增强套件
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  搜索框增强 + 结果列表上下键选择 + 回车跳转 + ESC回搜索框(清空) + 左右键翻页 + 匹配站点全站解除禁止复制 + 403自动跳转
// @match        http://www.eshukan.com/*
// @match        https://www.eshukan.com/*
// @match        https://www.wanweixueshu.com/*
// @grant        GM_xmlhttpRequest
// @connect      eshukan.com
// @author       Fomo
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545269/E%E4%B9%A6%E5%88%8A%20%20%E4%B8%87%E7%BB%B4%E5%AD%A6%E6%9C%AF%20%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA%E5%A5%97%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/545269/E%E4%B9%A6%E5%88%8A%20%20%E4%B8%87%E7%BB%B4%E5%AD%A6%E6%9C%AF%20%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA%E5%A5%97%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 如果在 eshukan.com，先检测是否403
    if (location.hostname.includes("eshukan.com")) {
        GM_xmlhttpRequest({
            method: "GET",
            url: window.location.href,
            onload: function(response) {
                if (response.status === 403) {
                    console.warn("⚠️ E书刊403禁止访问，跳转到万维学术");
                    window.location.href = "https://www.wanweixueshu.com/index.html";
                }
            },
            onerror: function() {
                console.error("❌ 请求失败，可能无法检测403");
            }
        });
    }

    // 全站解除禁止复制
    function unlockCopy() {
        document.querySelectorAll('[onselectstart],[oncopy],[oncontextmenu]').forEach(el => {
            el.onselectstart = null;
            el.oncopy = null;
            el.oncontextmenu = null;
        });
        ['onselectstart', 'oncopy', 'oncontextmenu'].forEach(evt => {
            document.body[evt] = null;
        });
        console.log("✅ 已解除复制限制");
    }
    unlockCopy();

    // 以下为原来的功能
    function enhanceSearchBox() {
        let input = null, button = null;

        if (location.hostname.includes('eshukan.com')) {
            input = document.querySelector('#search input.text');
            button = document.querySelector('#search input.btn');
            if (!input) {
                input = document.querySelector('#Top1_search_TextBox1');
                button = document.querySelector('#Top1_search_ImageButton1');
            }
        } else if (location.hostname.includes('wanweixueshu.com')) {
            input = document.querySelector('#SearchForm input[name="keyword"]');
            button = document.querySelector('#SearchForm input.key-btn');
        }

        if (input && button) {
            input.focus();

            input.addEventListener('focus', function() {
                if (input.placeholder) {
                    input.setAttribute('data-old-placeholder', input.placeholder);
                    input.placeholder = '';
                }
            });

            input.addEventListener('click', function() {
                if (input.value) {
                    input.select();
                }
            });

            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    button.click();
                }
                if (e.key === 'Escape') {
                    e.preventDefault();
                    input.value = '';
                }
            });
        }
        return input;
    }

    function enableListKeyboardNav(searchInput) {
        const items = Array.from(document.querySelectorAll('#allclass .onejinfo'));
        if (items.length === 0) return;

        let selectedIndex = -1;

        const style = document.createElement('style');
        style.textContent = `
            .onejinfo.selected {
                background-color: #ffeeba !important;
                border-left: 4px solid #ff9900 !important;
            }
        `;
        document.head.appendChild(style);

        function updateSelection(newIndex) {
            if (selectedIndex >= 0 && items[selectedIndex]) {
                items[selectedIndex].classList.remove('selected');
            }
            selectedIndex = newIndex;
            if (selectedIndex >= 0 && selectedIndex < items.length) {
                items[selectedIndex].classList.add('selected');
                items[selectedIndex].scrollIntoView({behavior: 'smooth', block: 'center'});
            }
        }

        function findPaginationLink(rel) {
            let pageDiv = document.querySelector('#pageinfo');
            if (pageDiv) {
                const links = Array.from(pageDiv.querySelectorAll('a'));
                const current = pageDiv.querySelector('a.active');
                if (!current) {
                    if (rel === 'prev') {
                        const prevLink = links.find(a => a.textContent.includes('上一页'));
                        return prevLink ? prevLink.href : null;
                    } else if (rel === 'next') {
                        const nextLink = links.find(a => a.textContent.includes('下一页'));
                        return nextLink ? nextLink.href : null;
                    }
                    return null;
                }
                const currentIndex = links.indexOf(current);
                if (rel === 'prev') {
                    for (let i = currentIndex - 1; i >= 0; i--) {
                        if (links[i] && !links[i].classList.contains('active')) return links[i].href;
                    }
                    const prevLink = links.find(a => a.textContent.includes('上一页'));
                    return prevLink ? prevLink.href : null;
                } else if (rel === 'next') {
                    for (let i = currentIndex + 1; i < links.length; i++) {
                        if (links[i] && !links[i].classList.contains('active')) return links[i].href;
                    }
                    const nextLink = links.find(a => a.textContent.includes('下一页'));
                    return nextLink ? nextLink.href : null;
                }
                return null;
            }

            pageDiv = document.querySelector('.pageinfo');
            if (pageDiv) {
                const links = Array.from(pageDiv.querySelectorAll('a'));
                const current = pageDiv.querySelector('a.active');
                if (!current) return null;
                const currentIndex = links.indexOf(current);

                if (rel === 'prev') {
                    for (let i = currentIndex - 1; i >= 0; i--) {
                        if (links[i] && !links[i].classList.contains('active')) return links[i].href;
                    }
                    const leftArrowLink = links.find(a => a.querySelector('i.iconfont.icon-xzjt'));
                    if (leftArrowLink) return leftArrowLink.href;

                } else if (rel === 'next') {
                    for (let i = currentIndex + 1; i < links.length; i++) {
                        if (links[i] && !links[i].classList.contains('active')) return links[i].href;
                    }
                    const rightArrowLink = links.find(a => a.querySelector('i.iconfont.icon-xyjt'));
                    if (rightArrowLink) return rightArrowLink.href;
                }
                return null;
            }

            return null;
        }

        window.addEventListener('keydown', function(e) {
            const activeEl = document.activeElement;

            if (e.key === 'Enter' && selectedIndex >= 0) {
                e.preventDefault();
                const link = items[selectedIndex].querySelector('a[target="_blank"], a');
                if (link) {
                    if (link.target === '_blank') {
                        window.open(link.href, '_blank');
                    } else {
                        window.location.href = link.href;
                    }
                }
                return;
            }

            if (activeEl === searchInput) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    searchInput.blur();
                    updateSelection(0);
                }
                return;
            }

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                let nextIndex = selectedIndex + 1;
                if (nextIndex >= items.length) nextIndex = 0;
                updateSelection(nextIndex);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                let prevIndex = selectedIndex - 1;
                if (prevIndex < 0) prevIndex = items.length - 1;
                updateSelection(prevIndex);
            }

            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                const rel = e.key === 'ArrowLeft' ? 'prev' : 'next';
                const url = findPaginationLink(rel);
                if (url) {
                    e.preventDefault();
                    window.location.href = url;
                }
            }
        });
    }

    window.addEventListener('load', function() {
        const searchInput = enhanceSearchBox();
        enableListKeyboardNav(searchInput);

        // ESC 清空搜索框
        window.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                let input = searchInput;
                if (!input || !document.body.contains(input)) {
                    input = (function(){
                        if (location.hostname.includes('eshukan.com')) {
                            return document.querySelector('#search input.text') || document.querySelector('#Top1_search_TextBox1');
                        } else if (location.hostname.includes('wanweixueshu.com')) {
                            return document.querySelector('#SearchForm input[name="keyword"]');
                        }
                        return null;
                    })();
                }
                if (input) {
                    e.preventDefault();
                    input.value = '';
                    input.focus();
                    const selected = document.querySelector('.onejinfo.selected');
                    if (selected) selected.classList.remove('selected');
                }
            }
        }, true);
    });
})();
