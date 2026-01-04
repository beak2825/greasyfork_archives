// ==UserScript==
// @name         AniWave Redirector
// @namespace    https://greasyfork.org/en/users/1298622-kayfir
// @version      final
// @description  Redirects https://aniwave.to/ to https://aniwave.to/home
// @author       kayfir
// @license      MIT
// @match        https://aniwave.to/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aniwave.to
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494426/AniWave%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/494426/AniWave%20Redirector.meta.js
// ==/UserScript==
 
    (function() {
    'use strict';
 
    window.location.href = '/home';
})();