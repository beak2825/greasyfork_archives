// ==UserScript==
// @name         zerion
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://zerion.cc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403071/zerion.user.js
// @updateURL https://update.greasyfork.org/scripts/403071/zerion.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function() {
        const url = document.getElementsByTagName("iframe")[0].src;
        if(url !== window.location.href){
            window.location.href = url;
        }
    }, 1000);

})();