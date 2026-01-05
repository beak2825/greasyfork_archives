// ==UserScript==
// @name        Always Mobile xHamster
// @namespace   robin.india@gmail.com
// @description Switches to Mobile Version
// @include     https://xhamster.com/*
// @version     1
// @grant       none
// @icon        https://static-ec.xhcdn.com/images/favicon/favicon-128x128.png
// @downloadURL https://update.greasyfork.org/scripts/25099/Always%20Mobile%20xHamster.user.js
// @updateURL https://update.greasyfork.org/scripts/25099/Always%20Mobile%20xHamster.meta.js
// ==/UserScript==
'use strict';

var m = /^(https?:\/\/)(\xhamster\.com\/.*)/.exec(location.href);
if (m) { window.location = m[1] + "m." + m[2] };