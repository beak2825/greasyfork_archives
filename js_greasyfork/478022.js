// ==UserScript==
// @name         自动窗口化HV
// @name:en      Automatic windowing of HV
// @name:zh-TW   自動窗口化HV
// @name:ja      自動ウィンドウ化HV
// @namespace    hentaiverse.org/popup
// @version      0.1
// @author       FeiZhaixiage
// @description         打开 hentaiverse.org/popup 时自动跳转窗口版HV
// @description:en      Automatically switch to the window version of HV when opening hentaiverse.org/popup.
// @description:zh-tw   打開 hentaiverse.org/popup 時自動跳轉窗口版HV 
// @description:ja      サイト「hentaiverse.org/popup」を開くと、自動的にウィンドウ版のHVにリダイレクトされます。
// @match        https://hentaiverse.org/popup
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478022/%E8%87%AA%E5%8A%A8%E7%AA%97%E5%8F%A3%E5%8C%96HV.user.js
// @updateURL https://update.greasyfork.org/scripts/478022/%E8%87%AA%E5%8A%A8%E7%AA%97%E5%8F%A3%E5%8C%96HV.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function popUp(URL,w,h) {
	window.open(URL,"_pu"+(Math.random()+"").replace(/0\./,""),"toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width="+w+",height="+h+",left="+((screen.width-w)/2)+",top="+((screen.height-h)/2));
	return false;
    }
    popUp('https://hentaiverse.org/',1250,720);
    window.close();
})();