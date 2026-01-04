// ==UserScript==
// @name         xHamster Female Symbol User Icon
// @namespace    https://greasyfork.org/en/scripts/372996-xhamster-female-symbol-user-icon
// @version      0.1
// @description  Replaces the user icon with a female sign
// @author       Phlegomatic
// @match        https://xhamster.com/*
// @include      https://*.xhamster.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372996/xHamster%20Female%20Symbol%20User%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/372996/xHamster%20Female%20Symbol%20User%20Icon.meta.js
// ==/UserScript==

var css = document.createElement('style');
css.type = "text/css";
css.innerHTML = ".iconUser, .iconUserOver, .iconUserGray { background-position: -170px -3px; height: 15px; width: 14px;}";
document.getElementsByTagName('head')[0].appendChild(css);