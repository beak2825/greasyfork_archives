// ==UserScript==
// @name        Instagram Larger Video Popup
// @namespace   Violentmonkey Scripts
// @include     *instagram.com*
// @version     0.12
// @description Makes the Instagram video popup LARGER
// @author      goldnick7
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/416303/Instagram%20Larger%20Video%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/416303/Instagram%20Larger%20Video%20Popup.meta.js
// ==/UserScript==


// NOTE: this only works for videos

(function () {
    'use strict';

    function videoFixer() {
        var player = document.querySelector('video:not([fixed])')
        if(!player)
            return
        document.getElementsByClassName("PdwC2 fXiEu s2MYR")[0].style="max-width: 1200px;margin-top: -37px;" //adjust this value for your resolution
        document.getElementsByClassName("kPFhm B1JlO OAXCp   ")[0].style="padding-bottom: calc(100% - 1px);"
        document.getElementsByClassName(" _65Bje  coreSpriteRightPaginationArrow")[0].style="left: 1100px;" //right arrow
        document.getElementsByClassName("ITLxV  coreSpriteLeftPaginationArrow ")[0].style="left: -210px;" //left arrow
    }

    setInterval(videoFixer, 10);
})();