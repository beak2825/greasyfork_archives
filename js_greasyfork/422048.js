// ==UserScript==
// @name         Hahalouisomg KRUNKER MOD CSS
// @version      3.5
// @description  NEW CSS of KRUNKER.IO
// @author       Hahalouisomg
// @match        *://krunker.io/*
// @exclude      *://krunker.io/editor*
// @exclude      *://krunker.io/social*
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/739207
// @downloadURL https://update.greasyfork.org/scripts/422048/Hahalouisomg%20KRUNKER%20MOD%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/422048/Hahalouisomg%20KRUNKER%20MOD%20CSS.meta.js
// ==/UserScript==

let cssUrl = "https://hahalouisomgkrunkeryt.000webhostapp.com/kpal.css"
new Array(...document.styleSheets).map(css => {
    if (css.href && css.href.includes("main_custom.css")) {
        if (cssUrl.startsWith("http") && cssUrl.endsWith(".css")) {
            css.ownerNode.href = cssUrl;
        }
    }
})