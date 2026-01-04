// ==UserScript==
// @name         GY Soil Element Remover
// @version      0.1
// @description  remove soil elements
// @author       XMAnon
// @match        *://music.163.com/*
// @grant        none
// @namespace https://greasyfork.org/users/666548
// @downloadURL https://update.greasyfork.org/scripts/410744/GY%20Soil%20Element%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/410744/GY%20Soil%20Element%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //var getDoku = document;
    var realDoku = '';
    if (!document) {//document nodes  not found
        console.warn("Iframe exist!?");
        realDoku = document.querySelector('#g_iframe').contentDocument;//.querySelectorAll("div[class='soil']");
        if (!realDoku) {
            console.warn("No doku found!! ");//should be impossible
            return;
        }
    }
    else{
        realDoku = document;
        if (!realDoku) {
            console.warn("No doku found!! ");//should be impossible
            return;
        }
    }
    var soilNodes = realDoku.querySelectorAll("div[class='soil']");
    if (!soilNodes) {
        console.log("No soil found! Nice! ");
        return;
    }
    for (var i = 0; i < soilNodes.length; i += 1) {
        soilNodes[i].remove();
    }
})();