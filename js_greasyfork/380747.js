// ==UserScript==
// @name         ANON.TO ※ FORWARD FIX
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Workaround for anon.to no longer forwarding the page to the URL requested.
// @author       Oscar Kameoka — kitsuneDEV — www.kitsune.work
// @match        http://*.anon.to/*
// @match        https://*.anon.to/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/380747/ANONTO%20%E2%80%BB%20FORWARD%20FIX.user.js
// @updateURL https://update.greasyfork.org/scripts/380747/ANONTO%20%E2%80%BB%20FORWARD%20FIX.meta.js
// ==/UserScript==

(function() {
  'use strict';
    $( document ).ready(function() {
        window.location = $('a').text();
    });
})();