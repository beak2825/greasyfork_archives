// ==UserScript==
// @name        Redirect Google CN
// @namespace   https://github.com/darkatse
// @version     0.12
// @description Redirect Google CN to Google Global!
// @author      techstay
// @match       *://*.google.cn/*
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/408581/Redirect%20Google%20CN.user.js
// @updateURL https://update.greasyfork.org/scripts/408581/Redirect%20Google%20CN.meta.js
// ==/UserScript==


var newHost     = window.location.host.replace (/\.cn$/, ".com");
var newURL      = window.location.protocol + "//" +
    newHost                         +
    window.location.pathname        +
    window.location.search          +
    window.location.hash
;
window.location.replace (newURL);