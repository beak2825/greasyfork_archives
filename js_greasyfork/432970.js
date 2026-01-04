// ==UserScript==
// @name         Remove [] Wikipedia Text Citations
// @namespace    mailto:JZersche@gmail.com
// @version      1
// @description  Remove Wikipedia Citations
// @author       JZersche
// @match        https://en.wikipedia.org/wiki/*
// @icon         https://www.google.com/s2/favicons?domain=wikipedia.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432970/Remove%20%5B%5D%20Wikipedia%20Text%20Citations.user.js
// @updateURL https://update.greasyfork.org/scripts/432970/Remove%20%5B%5D%20Wikipedia%20Text%20Citations.meta.js
// ==/UserScript==

(function() {
    'use strict';


for(var i = 0;i<document.getElementsByTagName('p').length;i++){
document.getElementsByTagName('p')[i].outerHTML = document.getElementsByTagName('p')[i].outerHTML.replaceAll(/(\[\d+\])|(\[page\sneeded\])/g,'')
}
})();