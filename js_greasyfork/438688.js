// ==UserScript==
// @name         Instagram Dark Theme
// @namespace    https://www.instagram.com/
// @version      3.11
// @description  Redirects to /?theme=dark which is an official dark theme for instagram
// @author       drakewild
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://instagram.com&size=256
// @grant        none
// @include      *://*instagram.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/438688/Instagram%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/438688/Instagram%20Dark%20Theme.meta.js
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