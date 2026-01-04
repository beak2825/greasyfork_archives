// ==UserScript==
// @name         Good News CSS fix
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  fixes several css issues (hover / ads)
// @author       bot@gmx.com
// @match        https://goodnews.click*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/427894/Good%20News%20CSS%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/427894/Good%20News%20CSS%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('.feeditem .blog { margin:0; border: 0; outline: 1px dotted #888;}');
    GM_addStyle('.feeditem .blog:hover { background: #e0e1ff; margin:0; border: 0; }');
    GM_addStyle('.blog.aditem { display:none; }');

    // visited links
    GM_addStyle('.blog .grey { position: relative; float: left; }');
    GM_addStyle('.blog .grey:before { content: ""; display: block; position: absolute; top: 0; bottom: 0; left: 0; right: 0; background: rgb(26 141 30 / 50%); }');

})();