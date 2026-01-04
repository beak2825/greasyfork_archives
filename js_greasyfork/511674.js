// ==UserScript==
// @name         add axios
// @namespace    http://tampermonkey.net/
// @version      2024-04-22-16-10
// @description  test
// @author       Adequm
// @match        */*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=axios-http.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511674/add%20axios.user.js
// @updateURL https://update.greasyfork.org/scripts/511674/add%20axios.meta.js
// ==/UserScript==

(function() {
    console.log(12412412);
    if (window.axios) return;
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.8/axios.min.js';
    document.body.append(script);
})();