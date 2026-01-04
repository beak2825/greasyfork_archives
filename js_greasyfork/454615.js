// ==UserScript==
// @name         Shanbay Word Hide Word
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide word when recognizing it, memorize by listening.
// @author       You
// @match        https://web.shanbay.com/wordsweb/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shanbay.com
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/454615/Shanbay%20Word%20Hide%20Word.user.js
// @updateURL https://update.greasyfork.org/scripts/454615/Shanbay%20Word%20Hide%20Word.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector('div[class*=index_wordBox]').childNodes[0].style.display = 'none'
})();