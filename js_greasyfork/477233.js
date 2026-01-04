// ==UserScript==
// @name        Redirect Google CN quickly
// @version     0.14
// @description Redirect Google CN to Google Global quickly!
// @author      bevis
// @match       *://*.google.cn/*
// @grant       none
// @run-at      document-start
// @namespace https://github.com/darkatse
// @downloadURL https://update.greasyfork.org/scripts/477233/Redirect%20Google%20CN%20quickly.user.js
// @updateURL https://update.greasyfork.org/scripts/477233/Redirect%20Google%20CN%20quickly.meta.js
// ==/UserScript==

document.querySelector('style').remove();
document.body.innerHTML = '<div style="min-height: 99999999px; width: 100%;border: 0px;"></div>';
document.body.style.backgroundColor="black";

var newHost     = window.location.host.replace (/\.cn$/, ".com");
var newURL      = window.location.protocol + "//" +
    newHost                         +
    window.location.pathname        +
    window.location.search          +
    window.location.hash
;
window.location.replace (newURL);