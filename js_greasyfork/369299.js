// ==UserScript==
// @name         Reddit old. redirect
// @namespace    https://kmcgurty.com
// @version      1
// @description  redirects from www. to old.
// @author       You
// @match        *://*.reddit.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/369299/Reddit%20old%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/369299/Reddit%20old%20redirect.meta.js
// ==/UserScript==

var loc = window.location.toString();

if(!loc.includes("old.")){
    console.log(loc.split("."));
    var split = loc.split(".");
    split[0] = "https://old";
    var joined = split.join(".");

    window.stop();
    window.location.replace(joined);
}