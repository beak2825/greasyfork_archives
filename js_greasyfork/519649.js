// ==UserScript==
// @name         Bangumi 隐藏NSFW条目
// @version      3.3
// @description  隐藏 Bangumi 上的 NSFW 条目
// @author       墨云
// @match        https://bangumi.tv/*
// @match        https://chii.in/*
// @match        https://bgm.tv/*
// @grant        none
// @namespace    https://greasyfork.org/users/1354622
// @downloadURL https://update.greasyfork.org/scripts/519649/Bangumi%20%E9%9A%90%E8%97%8FNSFW%E6%9D%A1%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/519649/Bangumi%20%E9%9A%90%E8%97%8FNSFW%E6%9D%A1%E7%9B%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.pathname.startsWith('/subject/')) {
        return;
    }

    const SETTING_KEY = 'bangumi_hide_nsfw_mode';
    const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000;

    async function isSubjectChecked(subjectId) {
        const cacheKey = `nsfw_cache_${subjectId}`;
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
            try {
                const data = JSON.parse(cachedData);
                if (Date.now() < data.timestamp + CACHE_EXPIRY) {
                    return data.value;
                }
            } catch (e) {
                localStorage.removeItem(cacheKey);
            }
        }

        try {
            const response = await fetch(`/subject/${subjectId}`);
            const text = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            const isChecked = !!doc.querySelector('a[href*="/tag/R18"]');

            if (!isChecked) {
                console.warn(`R18 tag not found on page for subjectId: ${subjectId}`);
            }

            const dataToCache = {
                value: isChecked,
                timestamp: Date.now()
            };
            localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
            return isChecked;
        } catch (error) {
            console.error('Failed to fetch subject detail:', error, 'for subjectId:', subjectId);
            const dataToCache = {
                value: false,
                timestamp: Date.now()
            };
            localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
            return false;
        }
    }

    function getSubjectIdFromLink(link) {
        const url = link.href;
        const match = url.match(/\/subject\/(\d+)/);
        return match ? match[1] : null;
    }

    async function applyMode(mode, rootElement = document) {
        const links = rootElement.querySelectorAll('a[href*="/subject/"]');
        const promises = [];

        for (const link of links) {
            const subjectId = getSubjectIdFromLink(link);
            if (subjectId) {
                promises.push(isSubjectChecked(subjectId).then(isChecked => {
                    if (isChecked) {

                        let containerToHide = link.closest('.mainItem, .subject_grid_list > li, .item, .subject-item, .clearit, .info_item, li.line_list, li.clearit, .home_subject_list > li, .list > li, .grid > li');
                        if (!containerToHide) {
                             containerToHide = link.closest('[id^="item_"]');
                        }
                        if (!containerToHide) {
                            containerToHide = link.closest('li');
                        }
                        
                        if (!containerToHide) {
                            console.warn('Could not find a container to hide for the link:', link.href);
                        }

                        if (containerToHide) {
                            containerToHide.style.display = (mode === 'hide') ? 'none' : '';
                        }
                    }
                }));
            }
        }
        await Promise.all(promises);
    }

    function addNSFWSetting() {
        if (typeof chiiLib === 'undefined' || typeof chiiLib.ukagaka === 'undefined') {
            return;
        }
        
        chiiLib.ukagaka.addGeneralConfig({
            title: 'NSFW',
            name: 'nsfwMode',
            type: 'radio',
            defaultValue: 'off',
            getCurrentValue: function() { return $.cookie(SETTING_KEY) || 'off'; },
            onChange: function(value) {
                $.cookie(SETTING_KEY, value, {expires: 30, path: '/'});
                applyMode(value);
            },
            options: [
                { value: 'off', label: '显示' },
                { value: 'hide', label: '隐藏' }
            ]
        });
    }

    async function init() {

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                addNSFWSetting();
                const currentMode = $.cookie(SETTING_KEY) || 'off';
                applyMode(currentMode);
            });
        } else {
            addNSFWSetting();
            const currentMode = $.cookie(SETTING_KEY) || 'off';
            applyMode(currentMode);
        }

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {

                        if (node.nodeType === Node.ELEMENT_NODE && node.querySelector('a[href*="/subject/"]')) {
                            console.log('Detected new entries being loaded. Applying settings...');

                            applyMode($.cookie(SETTING_KEY) || 'off', node);
                        }
                    });
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    init();
})();