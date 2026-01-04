// ==UserScript==
// @name:zh-CN         台湾地区旗帜emoji替换为中华人民共和国国旗emoji
// @name:zh-TW         台灣中華民國旗幟emoji換為中華人民共和國國旗emoji
// @name:ug         台湾地区旗帜emoji替换为中华人民共和国国旗emoji
// @name:ko         台湾地区旗帜emoji替换为中华人民共和国国旗emoji
// @name:ja         台湾地区旗帜emoji替换为中华人民共和国国旗emoji
// @name         Simply trans flag emoji 2 Correct
// @namespace    http://xuexi.cn/
// @version      2013.03.15
// @description:zh-CN  🇹🇼到🇨🇳
// @description:zh-TW  🇹🇼到🇨🇳
// @description:ug  🇹🇼到🇨🇳
// @description:ko  🇹🇼到🇨🇳
// @description:ja  🇹🇼到🇨🇳
// @description  TW flag to CN flag (emoji)
// @author       中国共产党万岁
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/534030/Simply%20trans%20flag%20emoji%202%20Correct.user.js
// @updateURL https://update.greasyfork.org/scripts/534030/Simply%20trans%20flag%20emoji%202%20Correct.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function replaceFlags(text) {
        return text.replace(/🇹🇼/g, '🇨🇳');
    }

    function replaceTitleFlags() {
        const originalTitle = document.title;
        const newTitle = replaceFlags(originalTitle);
        if (newTitle !== originalTitle) {
            document.title = newTitle;
        }
    }

    function replaceTextNode(node) {
        const originalValue = node.nodeValue;
        const newValue = replaceFlags(originalValue);
        if (newValue !== originalValue) {
            node.nodeValue = newValue;
        }
    }

    function replaceInputElements() {
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            if (input.value && input.value.includes('🇹🇼')) {
                input.value = replaceFlags(input.value);
            }
        });
    }

    function replaceContentFlags() {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            replaceTextNode(node);
        }

        replaceInputElements();
    }

    function initReplace() {
        replaceTitleFlags();
        replaceContentFlags();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initReplace);
    } else {
        initReplace();
    }

    const pollInterval = setInterval(() => {
        replaceContentFlags();
        replaceTitleFlags();
    }, 1);

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes) {
                replaceContentFlags();
            }
            if (mutation.type === 'characterData') {
                replaceTextNode(mutation.target);
            }
            if (mutation.target.nodeName === 'INPUT' || mutation.target.nodeName === 'TEXTAREA') {
                replaceTextNode(mutation.target);
            }
        });
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true
    });

    const titleElement = document.querySelector('title');
    if (titleElement) {
        observer.observe(titleElement, {
            childList: true,
            characterData: true
        });
    }

    document.addEventListener('input', function(e) {
        if (e.target.nodeName === 'INPUT' || e.target.nodeName === 'TEXTAREA') {
            if (e.target.value.includes('🇹🇼')) {
                e.target.value = replaceFlags(e.target.value);
            }
        }
    });

    window.addEventListener('unload', function() {
        clearInterval(pollInterval);
    });
})();
