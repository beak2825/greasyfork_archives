// ==UserScript==
// @name         RemoveGrayScale
// @namespace    http://tummedia.com/
// @version      0.2
// @description  force remove grayscale!
// @author       BonesBoom
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23968/RemoveGrayScale.user.js
// @updateURL https://update.greasyfork.org/scripts/23968/RemoveGrayScale.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    var x = document.createElement("style");
    var t = document.createTextNode("* {filter: grayscale(0%)!important;}");
    x.appendChild(t);
    document.head.appendChild(x);
})();