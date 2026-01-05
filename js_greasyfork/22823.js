// ==UserScript==
// @name         Rblogbar
// @namespace    http://github.com/cswarth
// @version      0.3
// @description  remove sidebars from r-bloggers.com
// @author       Chris Warth
// @include http://*r-bloggers.com/*
// @include https://*r-bloggers.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.5/jquery.min.js 
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/22823/Rblogbar.user.js
// @updateURL https://update.greasyfork.org/scripts/22823/Rblogbar.meta.js
// ==/UserScript==

$(function () {
    "use strict";

    $("#sidebar").remove();
    $("#secondsidebar").remove();
    $("#leftcontent").attr("id","old-leftcontent");
});
