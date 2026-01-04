// ==UserScript==
// @name         大学模拟器助手
// @namespace    https://github.com/SihenZhang
// @license      MIT
// @version      1.0.0
// @description  对大学模拟器添加额外功能，目前只能保存历史最佳记录
// @author       SihenZhang
// @match        https://blog.inari.site/bijiazukf/
// @icon         https://inari.site/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499470/%E5%A4%A7%E5%AD%A6%E6%A8%A1%E6%8B%9F%E5%99%A8%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/499470/%E5%A4%A7%E5%AD%A6%E6%A8%A1%E6%8B%9F%E5%99%A8%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    bestRecord = localStorage.getItem('bestRecord') ? Number(localStorage.getItem('bestRecord')) : 0;

    const originalSetEnddataPage = setEnddataPage;
    setEnddataPage = function (player, endflag) {
        originalSetEnddataPage.call(this, player, endflag);
        localStorage.setItem("bestRecord", bestRecord);
    }
})();