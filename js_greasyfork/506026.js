// ==UserScript==
// @name               自研 - 油叉 - 隐藏广告脚本
// @name:en_US         Self-made - GreasyFork - Hidden Advertising Scripts
// @description        隐藏掉特定的广告用途脚本。
// @description:en_US  Hide specific ad-related scripts.
// @version            1.0.0
// @author             CPlayerCHN
// @license            MulanPSL-2.0
// @namespace          https://www.gitlink.org.cn/CPlayerCHN
// @match              https://greasyfork.org/zh-CN/scripts*
// @match              https://greasyfork.org/en/scripts*
// @run-at             document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/506026/%E8%87%AA%E7%A0%94%20-%20%E6%B2%B9%E5%8F%89%20-%20%E9%9A%90%E8%97%8F%E5%B9%BF%E5%91%8A%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/506026/%E8%87%AA%E7%A0%94%20-%20%E6%B2%B9%E5%8F%89%20-%20%E9%9A%90%E8%97%8F%E5%B9%BF%E5%91%8A%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 遍历脚本列表中的内容，如果发型脚本名中包含特定字符就从页面中移除。
    document.querySelectorAll("#browse-script-list li").forEach((elm) => {

        if(/海角社区/.test(elm.dataset.scriptName)) {

            elm.remove();

        }

    });

})();