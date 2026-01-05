// ==UserScript==
// @name         AGF Enhancements
// @namespace    http://voakie.com/
// @version      1
// @description  Enhance AGF
// @author       Voakie
// @match        http://agarioforums.net/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/22870/AGF%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/22870/AGF%20Enhancements.meta.js
// ==/UserScript==

$(".menu.bottom_links").append("<li><a style='float: right; cursor: pointer' onclick=\"$('body,html').animate({scrollTop : 0}, 500)\">Back to Top</a></li>");