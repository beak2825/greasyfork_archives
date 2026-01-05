// ==UserScript==
// @name          TINYpulse transparent
// @namespace     http://userscripts.org/users/20715
// @description   Makes the TINYpulse cheer box transparent
// @include       https://www.tinypulse.com/api/cheers*
// @version       1.0
// @downloadURL https://update.greasyfork.org/scripts/3474/TINYpulse%20transparent.user.js
// @updateURL https://update.greasyfork.org/scripts/3474/TINYpulse%20transparent.meta.js
// ==/UserScript==

GM_addStyle('body { background: none transparent; }');
GM_addStyle('#mini-header { display: none; }');
GM_addStyle('#cheers-wall { font-size: 15px; }');
GM_addStyle('#cheers-wall .recipient, #cheers-wall .praise { margin-bottom: 15px; }');
GM_addStyle('#cheers-wall .recipient img.gravatar { width: 60px; height: 60px; }');
GM_addStyle('#cheers-wall .recipient .info { margin-left: 75px; }');
GM_addStyle('#cheers-wall .recipient { line-height: 3px; }');
GM_addStyle('.container .well { background-color: rgba(255, 255, 255, 0.6) !important; }');
