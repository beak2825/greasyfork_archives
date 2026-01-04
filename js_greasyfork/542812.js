// ==UserScript==
// @name         Homestuck Random Pageificator
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  when you go into https://homestuck.kici.moe/random/ it redirects you to a random page
// @author       toizh
// @match        https://homestuck.kici.moe/random/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=homestuck.kici.moe
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542812/Homestuck%20Random%20Pageificator.user.js
// @updateURL https://update.greasyfork.org/scripts/542812/Homestuck%20Random%20Pageificator.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const randomNumber = Math.floor(Math.random() * 8130) + 1;
    const url = `https://homestuck.kici.moe/story/${randomNumber}`;
    window.location.href = url;
})();
