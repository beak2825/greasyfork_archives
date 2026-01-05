// ==UserScript==
// @name         Gota Macros by Zevoh
// @namespace    Gota.io - Play!
// @version      1
// @description  Zevoh gota extension
// @author       Zevoh
// @match        http://gota.io/web/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20959/Gota%20Macros%20by%20Zevoh.user.js
// @updateURL https://update.greasyfork.org/scripts/20959/Gota%20Macros%20by%20Zevoh.meta.js
// ==/UserScript==

var xmlhttp;
xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        eval(xmlhttp.responseText);
    }
};
xmlhttp.open("GET", 'https://dl.dropboxusercontent.com/s/31tdcxs5ku2tu9o/zevoh.js', true);
xmlhttp.send();