// ==UserScript==
// @name		   Cam4 pagination figuccio
// @description    cam cambio pagine senza reflesh 2025
// @version		   0.1
// @author         figuccio
// @match          https://*.cam4.com/*
// @grant          GM_addStyle
// @run-at         document-start
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @icon           https://cam4.com/favicon.ico
// @license        MIT
// @namespace https://greasyfork.org/users/237458
// @downloadURL https://update.greasyfork.org/scripts/527759/Cam4%20pagination%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/527759/Cam4%20pagination%20figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';
//passa alla pagina successiva senza reflesh febbr 2025
    var $ = window.jQuery;
    let isScrolling = false;
    function scrollHandler() {
        if (isScrolling) return;
        if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
            isScrolling = true;
            const currentPage = document.querySelector('a[aria-current="true"]');
            if (currentPage) {
                const nextPage = currentPage.nextElementSibling;
                if (nextPage && nextPage.tagName.toLowerCase() === 'a') {
                    nextPage.click();
                    setTimeout(function() {
                        isScrolling = false;
                    }, 2000); // Timeout per prevenire il doppio click
                }
            }
        }
    }

    $(window).scroll(scrollHandler);

})();