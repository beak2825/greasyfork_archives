// ==UserScript==
// @name        Change AO3 "Kudos" button text to "Screaming"
// @description Change the button text from "Kudos" to "Screaming"; inspired by tumblr post https://ao3commentoftheday.tumblr.com/post/186719948024/fuckyeahrichardiii-terpsikeraunos-friendly
// @namespace   ao3
// @author      AlectoPerdita
// @include     http*://archiveofourown.org/*works*
// @grant       none
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/483066/Change%20AO3%20%22Kudos%22%20button%20text%20to%20%22Screaming%22.user.js
// @updateURL https://update.greasyfork.org/scripts/483066/Change%20AO3%20%22Kudos%22%20button%20text%20to%20%22Screaming%22.meta.js
// ==/UserScript==

const newButtonText = 'Screaming ♥';

(function () {
    'use strict';
    const kudosBtn = document.querySelector('#kudo_submit');
    kudosBtn.value = newButtonText;
})();