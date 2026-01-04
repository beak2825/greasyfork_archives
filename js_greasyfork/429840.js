// ==UserScript==
// @name         pdawiki 清理discuz论坛乱码元素
// @namespace    clean_discuz
// @version      0.1
// @description  清理影响复制的乱码元素
// @author       Shae
// @match        https://www.pdawiki.com/forum/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429840/pdawiki%20%E6%B8%85%E7%90%86discuz%E8%AE%BA%E5%9D%9B%E4%B9%B1%E7%A0%81%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/429840/pdawiki%20%E6%B8%85%E7%90%86discuz%E8%AE%BA%E5%9D%9B%E4%B9%B1%E7%A0%81%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==

function remove_elements(eles) {
    for (var i = 0; i < eles.length; i++) {
        eles[i].outerHTML = "";
    }
}

(function() {
    'use strict';
    var divs = document.getElementsByTagName("div");
    var dls = document.getElementsByTagName("dl");
    var div, dl, i;
    var p_div = /^tardis_visibletext_\d+/;
    var p_dl = /^ratelog_\d+/;
    for (i = 0; i < divs.length; i++) {
        div = divs[i];
        if (div.id.match(p_div)) {
            div.parentNode.removeChild(div);
        }
    }
    for (i = 0; i < dls.length; i++) {
        dl = dls[i];
        if (dl.id.match(p_dl)) {
            dl.parentNode.removeChild(dl);
        }
    }
    // hide
    remove_elements(document.querySelectorAll("td[class='plc plm']"));
    // rate
    remove_elements(document.querySelectorAll("h3[class='psth xs1']"));
    // jammer
    remove_elements(document.querySelectorAll("font.jammer"));
    remove_elements(document.querySelectorAll("span[style='display:none']"));
    // user
    remove_elements(document.querySelectorAll("div.qdsmile"));
    // float
    remove_elements(document.querySelectorAll("div#scrolltop"));
    remove_elements(document.querySelectorAll("div#floatPanel"));
})();
