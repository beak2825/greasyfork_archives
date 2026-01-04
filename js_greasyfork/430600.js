// ==UserScript==
// @name           Greasy Fork autoclick pagine
// @namespace      https://greasyfork.org/users/237458
// @description    Greasy Fork pagine avanzamento automatico anche sui profili degli autori
// @match          https://greasyfork.org/*
// @match          https://sleazyfork.org/*
// @version        0.3
// @noframes
// @author         figuccio
// @run-at         document-start
// @grant          GM_addStyle
// @icon           https://www.google.com/s2/favicons?domain=greasyfork.org
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/430600/Greasy%20Fork%20autoclick%20pagine.user.js
// @updateURL https://update.greasyfork.org/scripts/430600/Greasy%20Fork%20autoclick%20pagine.meta.js
// ==/UserScript==
(function() {
    'use strict';

var $ = window.jQuery;//risolve molti errori triangolo giallo
$(window).scroll(function() {
if($(window).scrollTop() + $(window).height() == $(document).height()) {
document.querySelector("#user-script-list-section > div > a.next_page,body > div.width-constraint > div > div.sidebarred-main-content > div.pagination > a.next_page").click();
         }
});

})();
