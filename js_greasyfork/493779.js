// ==UserScript==
// @name         去掉vidhub的广告
// @namespace    http://tampermonkey.net/
// @version      2024-04-29
// @description  去掉vidhub的广告v1
// @author       imzhi <yxz_blue@126.com>
// @match        https://vidhub.me/vodplay/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vidhub.me
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/493779/%E5%8E%BB%E6%8E%89vidhub%E7%9A%84%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/493779/%E5%8E%BB%E6%8E%89vidhub%E7%9A%84%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        GM_addStyle('@charset utf-8; #beitoudata ~ div {display: none !important;} #beitoudata + script ~ div {display: none !important;}');
    }, 1500);
})();