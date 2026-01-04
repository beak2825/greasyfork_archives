// ==UserScript==
// @name        České noviny bez reklam
// @version     1.0
// @namespace   XcomeX
// @author      XcomeX
// @license     Copyleft (Ɔ) GPLv3
// @description Skryje reklamní bloky v přehledu zpráv
// @include     https://www.ceskenoviny.cz/*
// @run-at      document-idel
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/410237/%C4%8Cesk%C3%A9%20noviny%20bez%20reklam.user.js
// @updateURL https://update.greasyfork.org/scripts/410237/%C4%8Cesk%C3%A9%20noviny%20bez%20reklam.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("span:contains(Reklama).info").closest("li").hide();
    $(".cc_banner-wrapper").remove();
    $("#branding").remove();
    $("#ahead").remove();
})();
