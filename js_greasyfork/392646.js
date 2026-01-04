// ==UserScript==
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @name         Jbzd
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @grant        none
// @include      https://jbzd.com.pl/*
// @downloadURL https://update.greasyfork.org/scripts/392646/Jbzd.user.js
// @updateURL https://update.greasyfork.org/scripts/392646/Jbzd.meta.js
// ==/UserScript==



(function() {
    'use strict';

    document.getElementById('vue-default-module').remove();
    var checkExist = setInterval(function() {
        if (document.getElementById("content-wrapper").classList.contains("blur")) {
            document.getElementById("content-wrapper").classList.remove("blur");
        }
    }, 1000);

 })();