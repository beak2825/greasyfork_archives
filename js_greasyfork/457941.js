// ==UserScript==
// @name         Hide AIO Sidebar
// @version      0.1
// @description  Hide AIO Sidebar on gallery pages
// @author       Rowan
// @match        https://www.grundos.cafe/gallery/view/?username=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @namespace https://greasyfork.org/users/937427
// @downloadURL https://update.greasyfork.org/scripts/457941/Hide%20AIO%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/457941/Hide%20AIO%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.getElementById("aio_sidebar_placeholder")) {

const addCSS = css => document.head.appendChild(document.createElement("style")).innerHTML=css;

addCSS("#aio_sidebar_placeholder {display: none;}")
    }

})();