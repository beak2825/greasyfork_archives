// ==UserScript==
// @name         Twitter Close Media Warning
// @name:ja      Twitter Close Media Warning
// @name:zh-cn   Twitter 关闭媒体警告
// @name:zh-tw   Twitter 關閉媒體警告
// @description         Automatic closure of Twitter webpage's media warning.
// @description:ja      Twitter ウェブページのメディア警告を自動的に閉じる
// @description:zh-cn   关闭 Twitter 网页上的媒体警告
// @description:zh-tw   關閉 Twitter 網頁上的媒體警告
// @namespace    none
// @version      0.1.5
// @author       ShanksSU
// @match        https://x.com/*
// @match        https://mobile.x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        GM_setValue
// @grant        GM_getValue
// @compatible   Chrome
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492370/Twitter%20Close%20Media%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/492370/Twitter%20Close%20Media%20Warning.meta.js
// ==/UserScript==
const ButtonAutoClicker = (function () {
    const showSensitiveCss = `
        /* show sensitive in media tab */
        li[role="listitem"]>div>div>div>div:not(:last-child) {filter: none;}
        li[role="listitem"]>div>div>div>div+div:last-child {display: none;}
    `;

    function checkButtons(targetNode) {
        const article = targetNode.closest('article');
        if (!article) return;

        const btn_show = article.querySelector('div[aria-labelledby] div[role="button"][tabindex="0"]:not([aria-label]).r-173mn98.r-1s2bzr4');
        if (btn_show && isVisible(btn_show) && !isClicked(btn_show)) { //
            btn_show.click();
            // console.log(btn_show.textContent.trim());
        }
    }

    function isVisible(element) {
        return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
    }

    const clickedButtons = new Set();
    function isClicked(button) {
        if (clickedButtons.has(button)) {
            return true;
        }
        clickedButtons.add(button);
        return false;
    }

    function init() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                checkButtons(mutation.target);
            });
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function initStyles() {
        GM_setValue('show_sensitive', true);
        const show_sensitive = GM_getValue('show_sensitive', false);
        document.head.insertAdjacentHTML('beforeend', `<style>${show_sensitive ? showSensitiveCss : ''}</style>`);
    }

    initStyles();
    init();

    return {
        init: init
    };
})();
