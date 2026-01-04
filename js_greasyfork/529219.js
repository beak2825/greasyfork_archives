// ==UserScript==
// @name         自用传送门
// @namespace    https://tampermonkey.net/
// @version      0.0.1
// @description  常用链接存储地
// @author       sjx01
// @match        https://keylol.com/*
// @icon         https://avatars.cdn.queniuqe.com/4bef364761737e84a561c97740064d53d8ba3d36_full.jpg
// @grant    GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529219/%E8%87%AA%E7%94%A8%E4%BC%A0%E9%80%81%E9%97%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/529219/%E8%87%AA%E7%94%A8%E4%BC%A0%E9%80%81%E9%97%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //库存手动同步链接
    GM_registerMenuCommand('更新Steam库存', () => { window.open('https://steamdb.keylol.com/sync', '_blank') });
    //买卖饰品&计算买入价格/卖出价格*0.85(steam钱包实际收款)
    GM_registerMenuCommand('打开挂刀行情站', () => { window.open('https://www.csgola.com/calc/', '_blank'), window.open('https://www.iflow.work', '_blank') });
    //SteamDB促销界面
    GM_registerMenuCommand('打开SteamDB促销界面', () => { window.open('https://steamdb.info/sales', '_blank') });

})();
