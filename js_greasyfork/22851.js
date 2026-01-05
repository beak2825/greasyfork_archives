// ==UserScript==
// @name         Redirect to Bigfile.to from Uploadable.ch
// @namespace    http://plg4u.blog.fc2.com/
// @version      0.1
// @description  Test version
// @author       hk
// @match        *://uploadable.ch/*
// @match        *://www.uploadable.ch/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22851/Redirect%20to%20Bigfileto%20from%20Uploadablech.user.js
// @updateURL https://update.greasyfork.org/scripts/22851/Redirect%20to%20Bigfileto%20from%20Uploadablech.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.location.replace((document.location + "").replace("uploadable.ch", "bigfile.to"));
})();