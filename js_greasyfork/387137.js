// ==UserScript==
// @name         91pu_91吉他譜_VIP
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include        /https?://www\.91pu\.com\.tw/song/*/
// @include        /https?://www\.91pu\.com\.tw/member/*/
// @include        /https?://www\.91pu\.com\.tw/*/
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @run-at        document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387137/91pu_91%E5%90%89%E4%BB%96%E8%AD%9C_VIP.user.js
// @updateURL https://update.greasyfork.org/scripts/387137/91pu_91%E5%90%89%E4%BB%96%E8%AD%9C_VIP.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //移除廣告
    if(typeof closeAdvertise !== "undefined")
        closeAdvertise();
    //等到登出按鈕出現
    waitForKeyElements ("a.b", SetVariable);



})();

function SetVariable(){
    uinfo.level = 3;
    uinfo.cfg.st = 9999;//能轉調的次數
    uinfo.cfg.tn = 3;
    uinfo.cfg.bt = 3;
    uinfo.cfg.sts = 3;
    uinfo.cfg.sus = 3;
    uinfo.cfg.ut = 3;
    uinfo.cfg.uc = 3;
    uinfo.cfg.fs = 9999;//能建立的分類數
}