// ==UserScript==
// @name         Anti New Song Page (Genius)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Redirect to the old song page on Genius
// @author       Madbrad200
// @match        https://genius.com/*lyrics
// @match        https://genius.com/*annotated
// @icon         https://www.google.com/s2/favicons?sz=64&domain=genius.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443365/Anti%20New%20Song%20Page%20%28Genius%29.user.js
// @updateURL https://update.greasyfork.org/scripts/443365/Anti%20New%20Song%20Page%20%28Genius%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
// ==UserScript==
// @name       fix the terror of the genius new song page
// @version    1.02
// @description  Adds parameter to visit the great old song page
// @include      https://genius.com/*lyrics
// @include      https://genius.com/*annotated
// @run-at document-start
// ==/UserScript==
const { href } = window.location;
if (href.slice(-1) !== '?bagon=1') {
  window.location.replace(href + '?bagon=1');
}