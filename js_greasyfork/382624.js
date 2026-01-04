// ==UserScript==
// @name         Remove Reddit Collection Sidebar and Header
// @description  Removes the collection sidebar and the hovering title from reddit.com
// @include      *reddit.com/*
// @grant        none
// @version 0.0.1.20190505002334
// @namespace https://greasyfork.org/users/4252
// @downloadURL https://update.greasyfork.org/scripts/382624/Remove%20Reddit%20Collection%20Sidebar%20and%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/382624/Remove%20Reddit%20Collection%20Sidebar%20and%20Header.meta.js
// ==/UserScript==

(function() {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = ' ._10IcBRrmressbhblq2bqiU {display:none !important;} ._2T_gfh-4AolUQ4rcgj8LV3 {display:none !important;} ';
    document.getElementsByTagName('head')[0].appendChild(style);
})();