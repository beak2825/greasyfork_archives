// ==UserScript==
// @name           CodeForces_submit_keyboard_shortcut
// @version        1.0
// @description    CodeForcesにおいてCtrl+Enterで提出ができるようになります
// @author         Osmium_1008
// @license        MIT
// @include        https://codeforces.com/contest/*/problem/*
// @include        https://codeforces.com/contest/*/submit*
// @include        https://codeforces.com/problemset/submit*
// @include        https://codeforces.com/problemset/problem/*
// @supportURL     https://twitter.com/Osmium_1008
// @namespace https://greasyfork.org/users/251827
// @downloadURL https://update.greasyfork.org/scripts/404476/CodeForces_submit_keyboard_shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/404476/CodeForces_submit_keyboard_shortcut.meta.js
// ==/UserScript==
(function() {
    document.addEventListener('keydown', function (event) {
        if ((event.ctrlKey||event.metaKey)&&event.keyCode==13){
            $(".submit")[0].click();
        }
    }, false);
})();