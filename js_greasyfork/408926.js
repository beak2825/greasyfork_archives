// ==UserScript==
// @name         Twitter DM Remover
// @namespace    http://twitter.com/kokkiemouse
// @version      0.1
// @description  Twitter DM Remove
// @author       You
// @match        https://twitter.com/*
// @downloadURL https://update.greasyfork.org/scripts/408926/Twitter%20DM%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/408926/Twitter%20DM%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function main(e) {
        const jsInitCheckTimer = setInterval(jsLoaded, 1000);
        function jsLoaded() {
            if (document.querySelector("#layers") != null){
                clearInterval(jsInitCheckTimer);
                var nodekun=document.getElementById("layers")
                nodekun.innerHTML="";
            }
        }
    };
    window.addEventListener("load", main, false);
})();