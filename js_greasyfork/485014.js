// ==UserScript==
// @name         Bypass sphinxanime.com link shortener
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bypass sphinxanime.com link shortener or short-link. It's a simple base64 decode of a parameter in the URL
// @author       Rust1667
// @match        https://sphinxanime.com/short/?anonym=*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485014/Bypass%20sphinxanimecom%20link%20shortener.user.js
// @updateURL https://update.greasyfork.org/scripts/485014/Bypass%20sphinxanimecom%20link%20shortener.meta.js
// ==/UserScript==

const currentURL = window.location.href;
const base64EncodedURL = currentURL.split('anonym=')[1];
const decodedURL = atob(base64EncodedURL);
window.location.href = decodedURL;
