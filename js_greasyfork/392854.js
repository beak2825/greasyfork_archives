// ==UserScript==
// @name         psjp for sp
// @namespace    http://twitter.com/udop_
// @version      0.2.1
// @description  set viewport
// @author       udop_
// @match        http://puzsq.sakura.ne.jp/main/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392854/psjp%20for%20sp.user.js
// @updateURL https://update.greasyfork.org/scripts/392854/psjp%20for%20sp.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let meta = document.createElement("meta")
    meta.name = "viewport"
    meta.content = "width=device-width,initial-scale=1.0,minimum-scale=1.0"
    document.getElementsByTagName("head")[0].appendChild(meta)
    document.body.style.zoom = "100%"
    // Your code here...
})();