// ==UserScript==
// @name               自研 - 多个站点 - 隐藏悬浮球
// @name:en_US         Self-made - Multi-site - Hidden float-ball
// @description        按下`\`后展示或隐藏悬浮球。目前已适配云·原神、云·星穹铁道和移动云手机。
// @description:en_US  Press the `\` key, the floating button will be displayed or hidden. Currently adapted for Genshin Impact · Cloud, Star Rail · Cloud, and Mobile Cloud Phone.
// @version            1.0.3
// @author             CPlayerCHN
// @license            MulanPSL-2.0
// @namespace          https://www.gitlink.org.cn/CPlayerCHN
// @match              https://ys.mihoyo.com/cloud/
// @match              https://sr.mihoyo.com/cloud/
// @match              https://cloudphoneh5.buy.139.com/
// @exclude            http://*/*
// @icon               https://ys.mihoyo.com/cloud/ico/favicon_128.4.3.0.ico
// @grant              GM_addStyle
// @run-at             document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/484094/%E8%87%AA%E7%A0%94%20-%20%E5%A4%9A%E4%B8%AA%E7%AB%99%E7%82%B9%20-%20%E9%9A%90%E8%97%8F%E6%82%AC%E6%B5%AE%E7%90%83.user.js
// @updateURL https://update.greasyfork.org/scripts/484094/%E8%87%AA%E7%A0%94%20-%20%E5%A4%9A%E4%B8%AA%E7%AB%99%E7%82%B9%20-%20%E9%9A%90%E8%97%8F%E6%82%AC%E6%B5%AE%E7%90%83.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 调整样式
    GM_addStyle('.game-menu-fab__btn, .drag-ball { transition: opacity .1s cubic-bezier(0.00, 0.00, 0.00, 1.00) }');

    // 监听按键按下
    addEventListener('keydown', (e) => {
        // 定义当前按下的按键和悬浮球变量
        let Key = e.key,
            floatBall = document.querySelector('.game-menu-fab__btn, .drag-ball');

        // 如果按下斜杠 为了节省资源先判断按下的按键
        if(Key === '\\') {
            // 悬浮球存在且悬浮球被隐藏
            if(floatBall && floatBall.style.opacity === '0') {
                // 就展示悬浮球
                floatBall.setAttribute('style', 'opacity: 1');
            // 不然如果按下斜杠且悬浮球存在
            } else if(floatBall) {
                // 就隐藏悬浮球
                floatBall.setAttribute('style', 'opacity: 0');
            };
        }
    });

})();