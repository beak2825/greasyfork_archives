// ==UserScript==
// @name         Minimal DuckDuckGo HTML Search
// @namespace    http://tampermonkey.net/
// @version      2024-10-27
// @description  Minimal DDG HTML
// @match        https://html.duckduckgo.com/html/*
// @grant        none
// @run-at       document-start
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520534/Minimal%20DuckDuckGo%20HTML%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/520534/Minimal%20DuckDuckGo%20HTML%20Search.meta.js
// ==/UserScript==

(function() {
    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

        * {
            font-family: 'Roboto', sans-serif !important;
        }

        .header__logo-wrap {
            opacity: 25%;
            transition: opacity 1s ease-in-out; /* Transition length */
        }

        .gray-out {
            filter: grayscale(10%) contrast(1.02);
            transition: filter 1s ease-in-out; /* Transition effect for filter */
        }

        .search.search--header{
          border-radius:30px
        }

        #search_button_homepage{
          border-top-right-radius: 30px;
          border-bottom-right-radius: 30px;
        }

    `);
})();
