// ==UserScript==
// @name               自研 - Pixiv(予素) - 排行榜移除非首次登场作品
// @name:en_US         Self-made - Pixiv - Ranking remove non-debut artworks
// @description        按下菜单中得选项后，自动加载排行榜所有作品并移除非首次登场作品。
// @description:en_US  After selecting option from the menu, automatically load all works from the leaderboard and remove those that are not debut appearances.
// @version            1.0.2
// @author             CPlayerCHN
// @license            MulanPSL-2.0
// @namespace          https://www.gitlink.org.cn/CPlayerCHN
// @match              https://www.pixiv.net/ranking.php
// @icon               https://pixiv.net/favicon.ico
// @grant              GM_registerMenuCommand
// @grant              GM_unregisterMenuCommand
// @run-at             document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/484202/%E8%87%AA%E7%A0%94%20-%20Pixiv%28%E4%BA%88%E7%B4%A0%29%20-%20%E6%8E%92%E8%A1%8C%E6%A6%9C%E7%A7%BB%E9%99%A4%E9%9D%9E%E9%A6%96%E6%AC%A1%E7%99%BB%E5%9C%BA%E4%BD%9C%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/484202/%E8%87%AA%E7%A0%94%20-%20Pixiv%28%E4%BA%88%E7%B4%A0%29%20-%20%E6%8E%92%E8%A1%8C%E6%A6%9C%E7%A7%BB%E9%99%A4%E9%9D%9E%E9%A6%96%E6%AC%A1%E7%99%BB%E5%9C%BA%E4%BD%9C%E5%93%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义「等待元素」「前往页尾」「移除」函数。
    function waitForElm(selector) {
        // https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    };
    function toEnd(slowly = false) {
        // 如果第五百名作品被加载，就停止
        if(document.querySelector('[href="#500"]')) { return };

        // 定义「移动」非立即初始化读写变量；如果「慢速移动」参数启用，就移动 100 像素，否则就直接到底
        let move = document.documentElement.scrollHeight;
        if(slowly) { move = 100 };
        console.log(move)

        // 滚动到页尾
        document.documentElement.scrollTop += move;

        // 每 0.1 秒循环一次本函数
        setTimeout(() => {
            toEnd(slowly);
        }, 100);
    }
    function remove() {
        // 卸载所有菜单命令
        GM_unregisterMenuCommand(menu_fastRemove);
        GM_unregisterMenuCommand(menu_remove);

        // 等待第 500 名作品被加载
        waitForElm('[href="#500"]').then((elm) => {
            // 移除所有非首次登场作品并移动至页首
            document.querySelectorAll('.rank p:nth-child(2) a').forEach((elm) => {
                elm.parentElement.parentElement.parentElement.remove();
            });
            document.documentElement.scrollTop = 0;
        });
    }

    // 定义「快速获取所有作品基础信息并隐藏非首次登场作品」「加载所有作品并隐藏非首次登场作品。」菜单命令
    let menu_fastRemove = GM_registerMenuCommand("快速获取所有作品基础信息并隐藏非首次登场作品。", () => {
            // 执行「前往页尾」「移除」函数
            toEnd();
            remove();
        }),
        menu_remove = GM_registerMenuCommand("加载所有作品并隐藏非首次登场作品。", () => {
            // 执行「前往页尾」「移除」函数
            toEnd(true);
            remove();
        });

})();