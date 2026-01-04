// ==UserScript==
// @name           Hacker News (ycombinator) more readable
// @description    Forcing width to 30%
// @version        1.1
// @include        https://news.ycombinator.com/*
// @namespace https://greasyfork.org/users/153157
// @downloadURL https://update.greasyfork.org/scripts/397613/Hacker%20News%20%28ycombinator%29%20more%20readable.user.js
// @updateURL https://update.greasyfork.org/scripts/397613/Hacker%20News%20%28ycombinator%29%20more%20readable.meta.js
// ==/UserScript==

document.getElementById('hnmain').style.width = '30%';
document.getElementById('hnmain').style.minWidth = '0px';