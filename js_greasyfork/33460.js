// ==UserScript==
// @name         skyscrapercity.com large images fix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fix the layout problem caused by large images on skyscrapercity.com
// @author       Anonymous
// @match        http://www.skyscrapercity.com/showthread.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/33460/skyscrapercitycom%20large%20images%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/33460/skyscrapercitycom%20large%20images%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle('.alt1 img { max-width: 99%; max-height: 720px; }');
})();