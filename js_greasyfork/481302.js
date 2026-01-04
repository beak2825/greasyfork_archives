// ==UserScript==
// @name         Faster bypass
// @version      1.0
// @description  Bypasses the 5s shortlink in [Bypass All ShortLinks](https://greasyfork.org/en/scripts/431691)
// @match        https://rotator.nurul-huda.sch.id/*?BypassResults=*
// @match        https://free4u.nurul-huda.or.id/?BypassResults=*
// @run-at       document-start
// @namespace    https://greasyfork.org/en/scripts/481302
// @downloadURL https://update.greasyfork.org/scripts/481302/Faster%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/481302/Faster%20bypass.meta.js
// ==/UserScript==

const currentURL = window.location.href;
const destinationURL = currentURL.split('?BypassResults=')[1];
if (destinationURL) {
    window.location.href = decodeURIComponent(destinationURL);
}
