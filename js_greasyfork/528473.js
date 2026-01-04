// ==UserScript==
// @name         PornHub Improved (Senza UI e Logo)figuccio
// @namespace    https://greasyfork.org/users/237458
// @version      0.2
// @license      MIT
// @description  Scorrimento infinito.accetta cookie
// @author       figuccio
// @match        https://*.pornhub.com/*
// @exclude      https://*.pornhub.com/embed/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornhub.com
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/528473/PornHub%20Improved%20%28Senza%20UI%20e%20Logo%29figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/528473/PornHub%20Improved%20%28Senza%20UI%20e%20Logo%29figuccio.meta.js
// ==/UserScript==
/* globals $ DataManager PaginationManager */
(function() {
    'use strict';

setTimeout(function(){document.querySelector("#modalWrapMTubes > div > div > button").click();}, 4000);//18anni consenso
setTimeout(function(){document.querySelector("#cookieBannerWrapper > button.cbPrimaryCTA.cbButton.gtm-event-cookie-banner") .click();}, 5000);//accetta tutti cookie

$(window).scroll(function() {
     if($(window).scrollTop() + $(window).height() == $(document).height()) {
       /////////////////////////////////////////////////////li:nth-last-child(1) > a ///
document.querySelector("body > div.wrapper > div.container > div.pagination3.paginationGated > ul > li.page_next.omega > a").click();//funziona nuova home page
         }
});

    })();
    