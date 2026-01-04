// ==UserScript==
// @name         Zoopla view more
// @author       Rolandas Valantinas
// @description  Click view more on Zoopla listing
// @include      *zoopla.co.uk/for-sale/details*
// @namespace    https://greasyfork.org/users/157178
// @supportURL   https://github.com/rolandas-valantinas/gists/issues
// @version      1.1
// @downloadURL https://update.greasyfork.org/scripts/412274/Zoopla%20view%20more.user.js
// @updateURL https://update.greasyfork.org/scripts/412274/Zoopla%20view%20more.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('load', (event) => {
        document.querySelector("[data-trigger='desc-expanded']").click();
    });
})();
