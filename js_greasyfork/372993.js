// ==UserScript==
// @name         xHamster USA Flag
// @namespace    https://greasyfork.org/en/scripts/372993-xhamster-usa-flag
// @version      0.1
// @description  Replaces the Union flag with a proper American flag!
// @author       Phlegomatic
// @match        https://xhamster.com/*
// @include      https://*.xhamster.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372993/xHamster%20USA%20Flag.user.js
// @updateURL https://update.greasyfork.org/scripts/372993/xHamster%20USA%20Flag.meta.js
// ==/UserScript==

var css = document.createElement('style');
css.type = "text/css";
css.innerHTML = ".iconFlag_en { height: 11px; width: 16px; background: #B3B3B3 url(https://static-cl.xhcdn.com/images/flag/v3/US.png) no-repeat; }";
document.getElementsByTagName('head')[0].appendChild(css);
