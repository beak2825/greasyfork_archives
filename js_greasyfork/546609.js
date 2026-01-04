// ==UserScript==
// @name         Remove links on artist's profile image if it is not a release
// @namespace    http://tampermonkey.net/
// @version      V1.1
// @description  Removes the link to the artist's profile image if it is not a release.
// @author       AnotherBubblebath
// @match        https://rateyourmusic.com/artist/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rateyourmusic.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546609/Remove%20links%20on%20artist%27s%20profile%20image%20if%20it%20is%20not%20a%20release.user.js
// @updateURL https://update.greasyfork.org/scripts/546609/Remove%20links%20on%20artist%27s%20profile%20image%20if%20it%20is%20not%20a%20release.meta.js
// ==/UserScript==

'use strict';
const link = document.querySelectorAll("[class^='coverart_'] > a")[1];

if (link.getAttribute('href').indexOf('e.snmc.io') > -1){
    link.removeAttribute('href');
    console.log('removed');
    link.style.pointerEvents = 'none';
}