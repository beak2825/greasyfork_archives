// ==UserScript==
// @name         All images minimized, restored on hover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Minimize the size of all images on a web page and restore them when the mouse hovers over them
// @author       Yearly
// @match        http://*/*
// @match        https://*/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3OC41ODIiIGhlaWdodD0iNzguNTgyIiB2aWV3Qm94PSIwIDAgNzguNTgyIDc4LjU4MiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZD0iTTIzLjU4MiAyMy4wMDloNTV2NTVoLTU1eiIvPjxwYXRoIGQ9Ik00Ny40MTYgMTIuMzQxaC0zNnYzNmg4LjU1M1YyMC44NDJoMjcuNDQ3eiIvPjxwYXRoIGQ9Ik0zNiAuNTczSDB2MzZoOC41NTFWOS4wNzRIMzZ6Ii8+PC9zdmc+
// @license      AGPL-v3.0
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/499974/All%20images%20minimized%2C%20restored%20on%20hover.user.js
// @updateURL https://update.greasyfork.org/scripts/499974/All%20images%20minimized%2C%20restored%20on%20hover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let size = "200px";

    GM_addStyle(`
    img {
       transition: max-width 0.4s ease-in-out, max-height 0.4s ease-in-out;
       max-width : ${size};
       max-height : ${size};
       object-fit: contain;
    }
    img:hover{
       max-width : 100%;
       max-height : 100%;
    }
    `)

})();