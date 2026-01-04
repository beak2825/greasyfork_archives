// ==UserScript==
// @name         SMLWiki - Always Logan
// @version      1.1
// @description  Sets lilloganClicked to false and calls checklillogan() when you're on the index.
// @author       deathofserenity
// @match        https://smlwiki.com/index
// @match        https://smlwiki.com/index.html
// @match        https://smlwiki.com/
// @match        https://smlwiki.com
// @grant        none
// @icon         data:image/png;base64,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
// @namespace https://greasyfork.org/users/1353485
// @downloadURL https://update.greasyfork.org/scripts/503989/SMLWiki%20-%20Always%20Logan.user.js
// @updateURL https://update.greasyfork.org/scripts/503989/SMLWiki%20-%20Always%20Logan.meta.js
// ==/UserScript==

(function() { 'use strict';
 localStorage.setItem('lloganclicked', 'false'); console.log('%c(userscript: lloganclicked set false)', 'color: blue;');
 checklillogan();
})();