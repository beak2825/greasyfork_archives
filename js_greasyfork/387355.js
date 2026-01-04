// ==UserScript==
// @name           Deezer Skip Unlimited
// @namespace      Steve2955
// @description    Skip an unlimited amount of songs with your free deezer account
// @include        http://*.deezer.*/*
// @run-at         document-start
// @version		   1.0
// @downloadURL https://update.greasyfork.org/scripts/387355/Deezer%20Skip%20Unlimited.user.js
// @updateURL https://update.greasyfork.org/scripts/387355/Deezer%20Skip%20Unlimited.meta.js
// ==/UserScript==

window.addEventListener("load", function() {
    var buttonSkip = document.querySelector('#page_player > div.player-bottom > div.player-controls > ul > li:nth-child(5) > div > button');
    buttonSkip.addEventListener("click", function(e) {
        dzPlayer.radioSkipCounter=1;
    }, false);
}, true);