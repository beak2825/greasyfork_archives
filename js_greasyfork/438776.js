// ==UserScript==
// @name         Remove-Wiki-Notice
// @namespace    https://wikipedia.org/
// @version      0.1
// @description  remove wiki notice
// @author       You
// @match        https://wikipedia.org/
// @icon         https://www.google.com/s2/favicons?domain=wikipedia.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438776/Remove-Wiki-Notice.user.js
// @updateURL https://update.greasyfork.org/scripts/438776/Remove-Wiki-Notice.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById('siteNotice').remove();
})();