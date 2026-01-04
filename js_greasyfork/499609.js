// ==UserScript==
// @name         Battledudes.io Ads Remover
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Removes ads when click in game body
// @author       trịnh HƯng
// @match        https://battledudes.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499609/Battledudesio%20Ads%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/499609/Battledudesio%20Ads%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function RemoveAds() {
      const elementRight = document.getElementById('battledudes-io_300x250');
      const elementBottom = document.getElementById('battledudes-io_728x90');

setInterval(() => {
	elementBottom.remove();
	elementRight.remove();
}, 1);

    }
    document.body.addEventListener('click', RemoveAds);

})();
