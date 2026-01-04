// ==UserScript==
// @name         YouTube Dark Theme
// @namespace    Dark Theme
// @license      MIT
// @match        https://www.youtube.com/*
// @version      3.11
// @description  Redirects to /?theme=dark which is an official dark theme for instagram
// @author       huang-wei-lun
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/546142/YouTube%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/546142/YouTube%20Dark%20Theme.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', () => {
    document.body.style = "background-color: #000000";
});

function main(){
    let url = new URL(window.location.href);
    if(!url.searchParams.get("theme")){
        url.searchParams.append("theme", "dark");
        window.location.replace(url);
    }
}

(function() {
    'use strict';
    main();
})();