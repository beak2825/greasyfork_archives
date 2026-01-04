// ==UserScript==
// @name        Make Google Speak
// @description Makes all Google queries act as if they were asked with your voice, and so answers them with its own voice.
// @include     *://*.google.com*/search*
// @exclude     *#tts=1
// @exclude     *#tts=0
// @exclude     https://www.google.com.au/search?gs_ivs*
// @run-at      document-start
// @grant       none
// @namespace https://greasyfork.org/users/153812
// @version 0.0.1.20170924063542
// @downloadURL https://update.greasyfork.org/scripts/33451/Make%20Google%20Speak.user.js
// @updateURL https://update.greasyfork.org/scripts/33451/Make%20Google%20Speak.meta.js
// ==/UserScript==

var test_str  = window.location.href;
var start_pos = test_str.indexOf('=') + 1;
var end_pos = test_str.indexOf('&',start_pos);
var text_to_get = test_str.substring(start_pos,end_pos);
window.location.replace ('https://www.google.com.au/search?gs_ivs=1&q=' + text_to_get + '#tts=1');