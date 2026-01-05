// ==UserScript==
// @name         Wowhead Expand Site
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Expands wowhead Site to take full width
// @author       Twitter: @AcademicoMDP
// @match        *://*.wowhead.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27211/Wowhead%20Expand%20Site.user.js
// @updateURL https://update.greasyfork.org/scripts/27211/Wowhead%20Expand%20Site.meta.js
// ==/UserScript==

var expandSite = function(){
    var el = document.getElementsByClassName('header-expand-site-tab');
    for (var i=0;i<el.length; i++) {
        el[i].click();
    }
};

window.onload = function() {
    expandSite();
    setTimeout(function(){
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }, 0);
};