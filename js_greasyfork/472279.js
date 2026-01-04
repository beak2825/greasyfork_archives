// ==UserScript==
// @name         Flight Rising: Swap achievements link back to lair in profile section
// @author       https://greasyfork.org/en/users/547396
// @description  If the change to achievements also annoys you and you find yourself clicking it... welp, no more
// @namespace    https://greasyfork.org/users/547396
// @match        *://*.flightrising.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flightrising.com
// @grant        none
// @version      0.2
// @downloadURL https://update.greasyfork.org/scripts/472279/Flight%20Rising%3A%20Swap%20achievements%20link%20back%20to%20lair%20in%20profile%20section.user.js
// @updateURL https://update.greasyfork.org/scripts/472279/Flight%20Rising%3A%20Swap%20achievements%20link%20back%20to%20lair%20in%20profile%20section.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ach = document.querySelector('#usertab a[href="https://www1.flightrising.com/achievements"');
    var wing_icon = 'https://www1.flightrising.com/static/cms/icons/48.png';

    ach.setAttribute('href', 'https://www1.flightrising.com/lair/');
    ach.innerHTML = '<img src="'+ wing_icon +'"/> Lair';
})();