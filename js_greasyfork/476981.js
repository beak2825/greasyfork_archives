// ==UserScript==
// @name         Enka.中文字体修改为游戏字体
// @version      1.0.0
// @namespace    https://greasyfork.org/users/325815
// @description  请按照安装界面的指引操作
// @author       monat151
// @match        https://enka.network/u/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476981/Enka%E4%B8%AD%E6%96%87%E5%AD%97%E4%BD%93%E4%BF%AE%E6%94%B9%E4%B8%BA%E6%B8%B8%E6%88%8F%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/476981/Enka%E4%B8%AD%E6%96%87%E5%AD%97%E4%BD%93%E4%BF%AE%E6%94%B9%E4%B8%BA%E6%B8%B8%E6%88%8F%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => {
        const styleSheetCount = document.styleSheets.length;
        document.styleSheets[styleSheetCount-1].insertRule(`b { font-family: 'SDK_SC_Web 85W'; font-weight: normal; }`)
        document.styleSheets[styleSheetCount-1].insertRule(`.sub { font-family: 'SDK_SC_Web 85W'; }`)
    }, 500);
})();