// ==UserScript==
// @name         NB化学分子模型
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       AN drew
// @match        https://huaxue_model.nobook.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410875/NB%E5%8C%96%E5%AD%A6%E5%88%86%E5%AD%90%E6%A8%A1%E5%9E%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/410875/NB%E5%8C%96%E5%AD%A6%E5%88%86%E5%AD%90%E6%A8%A1%E5%9E%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var css='#molecularHeader{'+
        'height:6%!important;'+
        '}'+
        '.switchBorder{'+
        'margin-top:0px!important;'+
        '}'+
        '.switchName{'+
        'font-size:16px;'+
        '}'+
        '#itemsMenuBorder{'+
        'top:calc(50% - 400);'+
        'left:calc(50% + 300);'+
        '}'

    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        let styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode(css));
        (document.querySelector("head") || document.documentElement).appendChild(styleNode);
    }
})();