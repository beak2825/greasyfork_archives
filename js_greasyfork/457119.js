// ==UserScript==
// @name         天津中考树字体美化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将天津中考树的字体改为Hanzipen SC
// @author       yuyanMC
// @match        https://gityxs.github.io/tian-jin-zhong-kao-tree/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457119/%E5%A4%A9%E6%B4%A5%E4%B8%AD%E8%80%83%E6%A0%91%E5%AD%97%E4%BD%93%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/457119/%E5%A4%A9%E6%B4%A5%E4%B8%AD%E8%80%83%E6%A0%91%E5%AD%97%E4%BD%93%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = [
        "* {",
        "font-family: 'Hanzipen SC' !important;",
        "},",
        "",
        "h1, h2, h3, b, input, .nodeLabel {",
        "font-family: 'Hanzipen SC' !important;",
        "}"
    ].join("\n");
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else if (typeof PRO_addStyle != "undefined") {
        PRO_addStyle(css);
    } else if (typeof addStyle != "undefined") {
        addStyle(css);
    } else {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            heads[0].appendChild(node);
        } else {
            document.documentElement.appendChild(node);
        }
    }
})();