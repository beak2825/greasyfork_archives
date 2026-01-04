// ==UserScript==
// @name         zhi-hu
// @namespace    https://www.xyz.com/
// @version      0.0.2
// @description  知知乎乎
// @author       Song
// @match        *://*.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373961/zhi-hu.user.js
// @updateURL https://update.greasyfork.org/scripts/373961/zhi-hu.meta.js
// ==/UserScript==
(function () {
    /**
     * 插入样式表
     */
    function insertCSS() {
        let styleSheet = document.styleSheets[document.styleSheets.length - 1];
        /*收藏栏的样式，变成双列*/
        styleSheet.insertRule('.Modal--large.FavlistsModal {width: 600px;}');
        styleSheet.insertRule('.Favlists-content .Favlists-item {width: 230px; float: left;}');
        styleSheet.insertRule(' .Favlists-content .Favlists-item:nth-child(even){margin-left: 60px;}');
    }

    insertCSS();
})();
