// ==UserScript==
// @name         DzPremium
// @name:fr      DzPremium
// @namespace    https://redstom.eu
// @version      1.0
// @description  Enables deezer premium!
// @description:fr Active deezer premium !
// @author       RedsTom
// @match        https://www.deezer.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deezer.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450743/DzPremium.user.js
// @updateURL https://update.greasyfork.org/scripts/450743/DzPremium.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => {
        dzPlayer.radioSkipCounter = 2;
    }, 1000)
})();