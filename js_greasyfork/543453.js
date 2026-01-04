// ==UserScript==
// @name         Old Reddit fix video controls
// @namespace    https://www.reddit.com
//
// @match        https://old.reddit.com/*
// @icon         https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png
//
// @grant       none
// @version     1.0.2
// @author      mif
// @license     MIT
// @description 2025-07-23 - Remove the randomly overlayed garbage that blocks video controls on old.reddit.com
// @downloadURL https://update.greasyfork.org/scripts/543453/Old%20Reddit%20fix%20video%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/543453/Old%20Reddit%20fix%20video%20controls.meta.js
// ==/UserScript==


function css_overwrite (cssStr) {
    var D               = document;
    var newNode         = D.createElement ('style');
    newNode.textContent = cssStr;

    var targ    = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (newNode);
}

css_overwrite('[id^="video-"] > div.vsc-controller { display: none !important; }');
// Reddit broke this after 1 week somehow ...
// css_overwrite('[id^="video-"] > div.vsc-controller.vcs-show   { display: None; }');
// since something like this doesn't work
// css_overwrite('#video-* > div.vsc-controller.vcs-show   { display: None; }');

