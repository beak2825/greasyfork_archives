// ==UserScript==
// @name         灰机wiki隐藏广告和错误信息
// @namespace    http://tampermonkey.net/
// @version      0.28
// @description  隐藏广告和错误信息
// @author       J-sz
// @license      MIT
// @match        *.huijiwiki.com/*
// @icon         huiji-public.huijistatic.com/fnd/uploads/c/cc/Fnd_17c_ad.jpg
// @grant        unsafeWindow
// @grant        GM_addStyle
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/435533/%E7%81%B0%E6%9C%BAwiki%E9%9A%90%E8%97%8F%E5%B9%BF%E5%91%8A%E5%92%8C%E9%94%99%E8%AF%AF%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/435533/%E7%81%B0%E6%9C%BAwiki%E9%9A%90%E8%97%8F%E5%B9%BF%E5%91%8A%E5%92%8C%E9%94%99%E8%AF%AF%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

GM_addStyle('.tbui-popupdialog{display:none !important}')
GM_addStyle('.posterContainer{display:none !important}')
GM_addStyle('.MediaTransformError{display:none !important}')
GM_addStyle('.scribunto-error{display:none !important}')
GM_addStyle('.n-notification-container{display:none !important}')

(function() {
    document.querySelector('.__button-dark-7wwpt4-dlmmd').click();
    document.querySelector('.n-modal-mask').click();
})();

/*
当事人细说“warframe中文维基”弹窗背后的事件:www.bilibili.com/video/BV1N94y1V7bN
*/