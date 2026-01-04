// ==UserScript==
// @name         FB Gaming Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enhances FB gaming view. Right now just removes LIVE counter as first function.
// @author       kuldeeppatel1296@gmail.com
// @match        https://www.facebook.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448817/FB%20Gaming%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/448817/FB%20Gaming%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var divs = document.getElementsByTagName("div");
    for(var i = 0; i < divs.length; i++){
        if (divs[i].childNodes.length == 3) {
            var child = divs[i].childNodes;
            if (child[0].tagName == 'A' && child[1].tagName == 'DIV' && child[2].tagName == 'DIV') {
                if(child[1].innerText == 'LIVE') {
                    if (child[2].ariaLabel.includes('people currently watching this video.')) {
                        divs[i].remove();
                    }
                }
            }
        }
    }
})();