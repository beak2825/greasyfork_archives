// ==UserScript==
// @name         Sankaku Beta no image fix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fixes the issue of images not displaying when opening posts on another tab.
// @author       Pwalpac
// @match        https://beta.sankakucomplex.com/post/show/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417310/Sankaku%20Beta%20no%20image%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/417310/Sankaku%20Beta%20no%20image%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    'esversion: 6';
    // The issue happens when you open a post on a new tab and you are using tag search.
    // To fix it, it simply redirects the page to the version without the tags (removing everything after the "?" from the url).
    const currentUrl = window.location.href;
    const questionMarkIndex = currentUrl.indexOf("?");

    if (questionMarkIndex !== -1){
        const urlWithoutTags = currentUrl.substring(0, questionMarkIndex);
        window.location.href = urlWithoutTags;
    }
})();