// ==UserScript==
// @name         hackshort.me (auto)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  autoclick in Hack Short.me
// @author       You
// @match        https://hackshort.me/*
// @icon         https://www.google.com/s2/favicons?domain=hackshort.me
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430120/hackshortme%20%28auto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/430120/hackshortme%20%28auto%29.meta.js
// ==/UserScript==

(function() {
'use strict';

setTimeout(function (){
parent.parent.document.getElementById("contador").click();
parent.document.getElementById("contador").click();
document.getElementById("contador").click();
}
,1200);

})();