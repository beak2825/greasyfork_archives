// ==UserScript==
// @name        youtube formatting fix
// @namespace   whatever
// @description fixes whatever employee at google just did that messed up the formatting
// @include     https://www.youtube.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/371258/youtube%20formatting%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/371258/youtube%20formatting%20fix.meta.js
// ==/UserScript==
var content = document.getElementById ("content");
content.classList.add ("content-alignment");