// ==UserScript==
// @name         Turn off Halloween mode
// @namespace    http://www.mattmorrison.co.uk/
// @version      0.1.1
// @description  Turn off disgusting Halloween mode
// @author       Matt Morrison
// @match        https://www.apterous.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391810/Turn%20off%20Halloween%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/391810/Turn%20off%20Halloween%20mode.meta.js
// ==/UserScript==

var sheets = document.getElementsByTagName("link");

for(i=0; i < sheets.length; i++){
    var s = sheets[i];
    if(s.getAttribute("rel").indexOf("style") >= 0 && s.getAttribute("href").indexOf("bloody") >= 0){
        s.disabled = true;
    }
}