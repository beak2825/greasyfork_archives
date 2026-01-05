// ==UserScript==
// @name         Imgclick.net
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically skips to the image
// @author       Yksok
// @match        http://imgclick.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30257/Imgclicknet.user.js
// @updateURL https://update.greasyfork.org/scripts/30257/Imgclicknet.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("#form-captcha").submit();
})();