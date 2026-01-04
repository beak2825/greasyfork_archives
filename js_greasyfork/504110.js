// ==UserScript==
// @name         隐藏Bilibili直播马赛克遮罩
// @namespace    https://github.com/AliubYiero/TamperMonkeyScripts
// @version      1.1.0
// @description  隐藏Bilibili直播某些分区会自带的马赛克遮罩, 如无畏契约, apex, mc...
// @author       Yiero
// @grant        GM_addStyle
// @license      GPL-3
// @match        https://live.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/504110/%E9%9A%90%E8%97%8FBilibili%E7%9B%B4%E6%92%AD%E9%A9%AC%E8%B5%9B%E5%85%8B%E9%81%AE%E7%BD%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/504110/%E9%9A%90%E8%97%8FBilibili%E7%9B%B4%E6%92%AD%E9%A9%AC%E8%B5%9B%E5%85%8B%E9%81%AE%E7%BD%A9.meta.js
// ==/UserScript==

// ---------------------------------更新日志----------------------------------------

/* 
1.1.0:
    现在"Bilibili直播"的标识也会被隐藏. 
1.0.0:
    屏蔽直播分区自带的马赛克遮罩, 比如apex分区, 虚拟apex分区, 无畏契约分区, 我的世界分区等...
*/

// ---------------------------------主函数----------------------------------------
;(() => {
    GM_addStyle(
        `#web-player-module-area-mask-panel, .web-player-icon-roomStatus {
            z-index: -1 !important;
        }`
    )
})();
