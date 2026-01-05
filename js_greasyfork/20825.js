// ==UserScript==
// @name remove deal shorcut
// @version 1.0
// @include *.dealabs.com/*
// @description have fun
// @run-at document-end
// @namespace https://greasyfork.org/users/33719
// @downloadURL https://update.greasyfork.org/scripts/20825/remove%20deal%20shorcut.user.js
// @updateURL https://update.greasyfork.org/scripts/20825/remove%20deal%20shorcut.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';
function removeKeyDown(){
    document.removeEventListener('keydown', handle_keydown_vote, false);
    document.removeEventListener('keydown', handle_keydown , false);
    a = document.getElementsByClassName('gesture');
    a0 = a[0];
    a0.parentElement.removeChild(a0);
}
var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ removeKeyDown +')();'));
(document.body || document.head || document.documentElement).appendChild(script);
})();