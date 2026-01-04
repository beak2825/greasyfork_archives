// ==UserScript==
// @name         eagle tagger | 区分不同浏览器身份，添加不同的 tag
// @namespace    http://leizingyiu.net/
// @version      20250511
// @description  hover 和按键追加 eagle-tags，英文逗号隔开，去重添加，标签配置持久化存储，支持Alt键批量添加+节流防抖
// @author       leizingyiu
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      GNU AGPLv3 

// @downloadURL https://update.greasyfork.org/scripts/535634/eagle%20tagger%20%7C%20%E5%8C%BA%E5%88%86%E4%B8%8D%E5%90%8C%E6%B5%8F%E8%A7%88%E5%99%A8%E8%BA%AB%E4%BB%BD%EF%BC%8C%E6%B7%BB%E5%8A%A0%E4%B8%8D%E5%90%8C%E7%9A%84%20tag.user.js
// @updateURL https://update.greasyfork.org/scripts/535634/eagle%20tagger%20%7C%20%E5%8C%BA%E5%88%86%E4%B8%8D%E5%90%8C%E6%B5%8F%E8%A7%88%E5%99%A8%E8%BA%AB%E4%BB%BD%EF%BC%8C%E6%B7%BB%E5%8A%A0%E4%B8%8D%E5%90%8C%E7%9A%84%20tag.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultBrowserTags = "browser-A,browser-B,browser-C";
    const defaultTagsDict = {
        a: "tagA",
        b: "tagB",
        c: "tagC"
    };

    function getBrowserTags() {
        let tags = GM_getValue('thisBrowserTags', defaultBrowserTags);
        return tags.replace(/，/g, ',');
    }

    function getTagsDict() {
        let dictStr = GM_getValue('tagsDict', JSON.stringify(defaultTagsDict));
        try {
            let dict = JSON.parse(dictStr);
            return dict;
        } catch (e) {
            console.error('tagsDict 格式错误，已重置默认值');
            GM_setValue('tagsDict', JSON.stringify(defaultTagsDict));
            return defaultTagsDict;
        }
    }

    function addTagsToItem(item, tags) {
        if (!item) return;

        let oriTag = item.getAttribute('eagle-tags') || '';

        let oriTagList = oriTag.split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        let addTagList = Array.isArray(tags)
            ? tags
            : tags.replace(/，/g, ',')
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);

        addTagList.forEach(tag => {
            if (!oriTagList.includes(tag)) {
                oriTagList.push(tag);
            }
        });

        item.setAttribute('eagle-tags', oriTagList.join(', '));
        console.log('已更新 eagle-tags:', item.getAttribute('eagle-tags'));
    }

     function debounce(func, delay) {
        let timer;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

     function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    let currentHoverItem = null;

    function addHoverListeners() {
        document.querySelectorAll('img, video').forEach(item => {
            if (item.hasAttribute('data-hover-tagged')) return;
            item.setAttribute('data-hover-tagged', 'true');

            item.addEventListener('mouseenter', debounce(function() {
                currentHoverItem = item;
                addTagsToItem(item, getBrowserTags());
            }, 200));

            item.addEventListener('mouseleave', function() {
                if (currentHoverItem === item) {
                    currentHoverItem = null;
                }
            });
        });
    }

    addHoverListeners();

    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                addHoverListeners();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

     window.addEventListener('keydown', throttle(function(e) {
        const key = e.code.replace('Key','').toLowerCase();
        const tagsDict = getTagsDict();

        if (tagsDict[key] && currentHoverItem) {
            addTagsToItem(currentHoverItem, tagsDict[key]);
        }

        if (e.altKey && tagsDict[key]) {
            document.querySelectorAll('img, video').forEach(item => {
                addTagsToItem(item, tagsDict[key]);
            });
        }
    }, 200));

})();
