// ==UserScript==
// @name         MWICore
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  mwicore已弃用，不再更新，请安装mooket
// @author       IOMisaka
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/532609/MWICore.user.js
// @updateURL https://update.greasyfork.org/scripts/532609/MWICore.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.error('mwicore已弃用，不再更新，请安装mooket');
    setTimeout(()=>{mwi?.game?.updateNotifications("error",'mwicore已弃用，请安装mooket');},10000);
    //防止冲突，删掉了
})();