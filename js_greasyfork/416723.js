// ==UserScript==
// @name myfav.es custom background
// @namespace http://tampermonkey.net/
// @version 0.4
// @description custom background for myfav.es 
// @author Stijn Bousard | boossy
// @match https://www.myfav.es/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/416723/myfaves%20custom%20background.user.js
// @updateURL https://update.greasyfork.org/scripts/416723/myfaves%20custom%20background.meta.js
// ==/UserScript==
function addGlobalStyle(css) {
 var head, style;
 head = document.getElementsByTagName('head')[0];
 if (!head) { return; }
 style = document.createElement('style');
 style.type = 'text/css';
 style.innerHTML = css;
 head.appendChild(style);
}
addGlobalStyle('#upload-form.subtle-carbon-fibre #content, body.subtle-carbon-fibre { background-image: url(https://bsy.boossy.be/img/myBackground.jpg); background-size: cover; } ');