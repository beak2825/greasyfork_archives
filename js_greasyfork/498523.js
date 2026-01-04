// ==UserScript==
// @name               自研 - 找色差小游戏 - 自动点击
// @name:en_US         Self-made - Color Difference Finder - Auto Clicker
// @description        自己写得一个功能类似于 https://greasyfork.org/zh-CN/scripts/498502 的脚本。相较于那个，这个效率更高。
// @description:en_US  I wrote a script that has functionality similar to https://greasyfork.org/zh-CN/scripts/498502. Compared to that one, this script boasts higher efficiency.
// @version            1.0.0
// @author             CPlayerCHN
// @license            MulanPSL-2.0
// @namespace          https://www.gitlink.org.cn/CPlayerCHN
// @match              https://www.shj.work/tools/secha/
// @icon               https://www.shj.work/favicon.ico
// @grant              GM_addStyle
// @run-at             document-body
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/498523/%E8%87%AA%E7%A0%94%20-%20%E6%89%BE%E8%89%B2%E5%B7%AE%E5%B0%8F%E6%B8%B8%E6%88%8F%20-%20%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/498523/%E8%87%AA%E7%A0%94%20-%20%E6%89%BE%E8%89%B2%E5%B7%AE%E5%B0%8F%E6%B8%B8%E6%88%8F%20-%20%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 隐藏方块，防止高频闪烁。
    GM_addStyle("#box { background-color: #FFA1A1 } #box span { visibility: hidden }");


    // 定义「点击器」函数。
    function clicker() {

        // 定义「方块颜色数组」变量。
        const colorMap = new Map();

        // 遍历所有方块。
        document.querySelectorAll("#box span").forEach((elm, index) => {

            // 定义「方块背景色」变量。
            const bgColor = elm.style.backgroundColor;

            // 如果这颜色没有记录过就加入数组。
            if (!colorMap.has(bgColor)) {

                colorMap.set(bgColor, []);

            }

            // 将当前元素添加到对应数组。
            colorMap.get(bgColor).push(elm);

        });

        // 遍历「方块颜色数组」找出只有一个匹配项的点击它。
        colorMap.forEach((elm, color) => {

            if(colorMap.get(color).length === 1) {

                elm[0].click();

            }

        });

    };


    // 定义「侦测器」变量。
    const observer = new MutationObserver(() => {

        // 如果「对话框」元素被隐藏，就在 .01 秒后执行「点击器」函数。
        if(document.querySelector("#dialog").style.display === "none") {

            setTimeout(clicker, 10);

        }

    });

    // 配置「侦测器」侦测目标节点。
    observer.observe(document.body, {
        "subtree": true,
        "childList": true
    });

})();