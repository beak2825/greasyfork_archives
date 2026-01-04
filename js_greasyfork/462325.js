// ==UserScript==
// @name         干掉百度首页推荐标签
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  仅保留导航标签
// @author       sitorhy
// @match        https://www.baidu.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462325/%E5%B9%B2%E6%8E%89%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/462325/%E5%B9%B2%E6%8E%89%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 定义要保留的标签关键字
    const allFavTabText = ['关注'];
    const removeAiWrapper = true;

    const s_menus_wrapper = document.querySelector('#s_menus_wrapper');
    const favTabs = Array.from(s_menus_wrapper.childNodes).filter(i => allFavTabText.some(j => i.innerText.indexOf(j) >= 0));

    const style = document.createElement('style');
    style.setAttribute('style', 'text/css');
    style.innerText = `
    .ai_app_wrapper_1ZRN3 { display: none }
    #s_menus_wrapper > span:nth-child(2) { display: none }
    `
    document.head.appendChild(style);

    function createClickTask(t) {
        return new Promise((resolve) => {
            const mine_tab = document.querySelector('#s_menu_mine');
            mine_tab.click();
            setTimeout(() => {
                if (mine_tab.classList.contains('current')) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            }, t);
        });
    }

    // 可选的清除操作
    function clearOther() {
        setTimeout(() => {
            const hotNewDOM = document.querySelector('.hot-news-wrapper');
            if (hotNewDOM) {
                // 干掉热搜
                hotNewDOM.parentNode.removeChild(hotNewDOM);
            }

            const newListDOM = document.querySelector('.s-news-list-wrapper');
            if (newListDOM) {
                // 干掉推荐
                newListDOM.parentNode.removeChild(newListDOM);
            }

            // 干掉不感兴趣的标签
            Array.from(s_menus_wrapper.childNodes).filter(i => !favTabs.includes(i)).forEach(j => j.parentNode.removeChild(j));

            let observer;
            function removeTargets() {
                const ai_wrapper = document.querySelector('[class^="ai_app_wrapper"]');
                if (removeAiWrapper && ai_wrapper) {
                    ai_wrapper.parentNode.removeChild(ai_wrapper);
                }
            }
            let removeDOMExists = false;
            let ai_wrapper_found;
            observer = new MutationObserver((mutationsList, observer) => {
                for (let mutation of mutationsList) {
                    const classList = Array.from(mutation.target.classList);
                    if (classList.findIndex((i) => i.indexOf('ai_app_wrapper') >= 0)) {
                        ai_wrapper_found = true;
                    }
                }

                removeDOMExists = ai_wrapper_found; /* && xx_found */

                setTimeout(function () {
                    if (removeDOMExists) {
                        removeTargets();
                    }
                }, 0);
            });
            const targetNode = document.querySelector('.san-card');
            const config = { attributes: true, childList: true, subtree: true };
            observer.observe(targetNode, config);
        });
    }

    // 尝试点击10次 不行拉倒（一般不会超过3次）
    function* tryClick() {
        for (const i of [50, 100, 100, 100, 100, 200, 200, 300, 300, 300]) {
            const success = yield createClickTask(i);
            if (success) {
                clearOther();
                break;
            }
        }
    }

    function checkClick(g, success) {
        const { value, done } = success === undefined ? g.next() : g.next(success);
        if (!done) {
            value.then(success => {
                checkClick(g, success);
            });
        }
    }

    const mine_tab = document.querySelector('#s_menu_mine');
    if (mine_tab.classList.contains('current')) {
        clearOther();
    }
    else {
        checkClick(tryClick(), undefined);
    }
})();