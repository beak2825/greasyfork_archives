// ==UserScript==
// @name         LiveTV.canaldigitaal.nl
// @namespace    http://LiveTV.canaldigitaal.nl/
// @version      0.1
// @description  LiveTV with either inie minie tiny screen or full screen.... moronic!
// @author       You
// @match        https://livetv.canaldigitaal.nl/program.aspx
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/376405/LiveTVcanaldigitaalnl.user.js
// @updateURL https://update.greasyfork.org/scripts/376405/LiveTVcanaldigitaalnl.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('.column { float:none !important;}');
    GM_addStyle('.main { width: 100% !important;}');
    GM_addStyle('.pageContent { width:100% !important; }');
    GM_addStyle('#player { width:100% !important; height:100% !important; }');
})();