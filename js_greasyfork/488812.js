// ==UserScript==
// @name         IMDB_TRAKT_LINK
// @description  Adds trakt link to IMDB site
// @author       Bladito
// @version      1.0.1
// @homepageURL  https://greasyfork.org/en/users/55159-bladito
// @match        https://www.imdb.com/title/*
// @namespace    Bladito/imdb-trakt-link
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/488812/IMDB_TRAKT_LINK.user.js
// @updateURL https://update.greasyfork.org/scripts/488812/IMDB_TRAKT_LINK.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    var traktIcon = '<svg fill="#ff0000" width="32px" height="32px" viewBox="0 0 32.00 32.00" xmlns="http://www.w3.org/2000/svg" stroke="#ff0000" stroke-width="0.00032"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 32c-8.817 0-16-7.183-16-16s7.183-16 16-16c8.817 0 16 7.183 16 16s-7.183 16-16 16zM16 1.615c-7.932 0-14.385 6.453-14.385 14.385s6.453 14.385 14.385 14.385c7.932 0 14.385-6.453 14.385-14.385s-6.453-14.385-14.385-14.385zM6.521 24.708c2.339 2.557 5.724 4.152 9.479 4.152 1.917 0 3.735-0.417 5.369-1.167l-8.932-8.907zM25.573 24.62c2.052-2.281 3.307-5.323 3.307-8.625 0-5.177-3.047-9.62-7.421-11.677l-8.12 8.099 12.219 12.204zM12.401 13.38l-6.765 6.74-0.907-0.907 15.421-15.416c-1.301-0.437-2.692-0.677-4.151-0.677-7.115-0.005-12.885 5.765-12.885 12.88 0 2.896 0.953 5.573 2.588 7.735l6.74-6.74 0.479 0.437 9.663 9.661c0.197-0.109 0.38-0.219 0.556-0.353l-10.703-10.672-6.468 6.473-0.907-0.905 7.38-7.381 0.479 0.443 11.281 11.251c0.177-0.136 0.339-0.292 0.5-0.421l-12.181-12.157-0.109 0.021zM16.464 14.749l-0.901-0.9 6.38-6.385 0.907 0.916-6.385 6.38zM22.521 5.979l-7.36 7.36-0.907-0.907 7.36-7.359 0.907 0.911z"></path> </g></svg>';
    var traktSearchIcon = '<svg id="bitl-search" width="40px" height="40px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#34e2e5"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.096"></g><g id="SVGRepo_iconCarrier"> <path d="M17.5556 3C19.4579 3 21 4.54213 21 6.44444V17.5556C21 19.4579 19.4579 21 17.5556 21H6.44444C4.54213 21 3 19.4579 3 17.5556V6.44444C3 4.54213 4.54213 3 6.44444 3H17.5556Z" stroke="#34e2e5" stroke-width="0.6"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5067 7.01392C9.02527 7.01392 7.01367 9.02551 7.01367 11.5069C7.01367 13.9884 9.02527 16 11.5067 16C12.3853 16 13.205 15.7478 13.8973 15.3119L15.1658 16.5803C15.5563 16.9709 16.1895 16.9709 16.58 16.5803C16.9705 16.1898 16.9705 15.5566 16.58 15.1661L15.3116 13.8977C15.7475 13.2053 15.9997 12.3856 15.9997 11.5069C15.9997 9.02551 13.9881 7.01392 11.5067 7.01392ZM9.01367 11.5069C9.01367 10.1301 10.1298 9.01392 11.5067 9.01392C12.8836 9.01392 13.9997 10.1301 13.9997 11.5069C13.9997 12.8838 12.8836 14 11.5067 14C10.1298 14 9.01367 12.8838 9.01367 11.5069Z" fill="#34e2e5"></path> </g></svg>';

    var $titleElement = $('[data-testid="hero__pageTitle"]');
    var imdbId = document.URL.match('.*/title/(tt[0-9]+)')[1];
    var movieName = $titleElement.text();
    var year = $titleElement.parent().find('.ipc-inline-list__item:first-child').text();
    var traktUrl = `https://trakt.tv/search/imdb?q=${imdbId}`;
    var traktSearchUrl = `https://trakt.tv/search?query=${movieName.replace(/[ ]+/g,'+')}+${year}`;

    $titleElement.append($(`<a target="_blank" href="${traktUrl}">${traktIcon}</a>`));
    $titleElement.append($(`<a target="_blank" href="${traktSearchUrl}">${traktSearchIcon}</a>`));

    addStyles();

    //---------------------------------------------------------------------------------

    function addStyles() {
        GM_addStyle(`
          #bitl-search {
            vertical-align: bottom;
            margin-bottom: 5px;
          }
        `);
    }

})(jQuery);
