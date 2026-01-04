// ==UserScript==
// @name         NYTimes - Prevent cookies
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Prevents cookies from being set from NYTimes
// @author       You
// @match        https://*.nytimes.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415760/NYTimes%20-%20Prevent%20cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/415760/NYTimes%20-%20Prevent%20cookies.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const getCummulative = (str, delim, reverse = false) => {
        const parts = str.split(delim);
        return parts
            .map((_, i) => parts.slice(reverse ? 0 : i, reverse ? parts.length - i : parts.length).join(delim) || delim);
    }
    const clearCookies = () => {
        const cookies = document.cookie.split('; ')
        .map(cookie => cookie.match(/([^=;]+)/))
        .filter(cookie => cookie)
        .map(([_, cookie]) => encodeURIComponent(cookie));
        const subdomains = getCummulative(location.hostname, '.');
        const paths = getCummulative(location.pathname, '/', true)

        const nextCookies = cookies
        .map(cookie => subdomains
             .map(domain => paths
                  .map(path =>
                       cookie +'=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + domain + ' ;path=' + path
                      )))
        .flat(3);
        nextCookies.forEach(cookie => document.cookie = cookie);
    }

    clearCookies();

    setInterval(() => {
        clearCookies();
    }, 5000);

})();