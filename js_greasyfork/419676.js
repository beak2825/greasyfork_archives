// ==UserScript==
// @name         OnlyFans Full-Sized Profile Picture & Header
// @namespace    https://tesomayn.com/
// @version      1.0.0
// @description  View full-sized OnlyFans profile picture and header
// @icon         https://www.google.com/s2/favicons?domain=onlyfans.com
// @author       TesoMayn
// @match        https://onlyfans.com/*
// @grant        none
// @license      MIT, https://www.mit.edu/~amini/LICENSE.md
// @run-at       document-idle
// @copyright    2021, TesoMayn (https://TesoMayn.com)
// @downloadURL https://update.greasyfork.org/scripts/419676/OnlyFans%20Full-Sized%20Profile%20Picture%20%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/419676/OnlyFans%20Full-Sized%20Profile%20Picture%20%20Header.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('click', function (event) {
        if (event.target.matches('.g-avatar > img')) {
            window.open(event.target.src.replace(/thumbs\/[a-z0-9]+\//, ''), '_blank');
        } else if (event.target.matches('.b-profile__header__cover-img')) {
            window.open(event.target.src.replace(/thumbs\/[a-z0-9]+\//, ''), '_blank');
        } else {
            return false;
        }
    }, false);

})();