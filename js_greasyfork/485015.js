// ==UserScript==
// @name         Bypass japan-paw.net link shortener
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bypass japan-paw.net link shortener or short-link. It's a simple base64 decode of a parameter in the URL
// @author       Rust1667
// @match        https://japan-paw.net/out/?*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485015/Bypass%20japan-pawnet%20link%20shortener.user.js
// @updateURL https://update.greasyfork.org/scripts/485015/Bypass%20japan-pawnet%20link%20shortener.meta.js
// ==/UserScript==

const currentURL = window.location.href;
const base64EncodedURL = currentURL.split('out/?')[1];
const decodedURL = atob(base64EncodedURL);
window.location.href = decodedURL;
