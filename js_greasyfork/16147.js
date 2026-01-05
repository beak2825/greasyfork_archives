// ==UserScript==
// @name         [Ned] Window Title Changer
// @namespace    localhost
// @version      2.1
// @description  Window Title Changer
// @author       Ned (Ned@Autoloop.com)
// @include      *www.autoloop.us*
// @grant        none
// @icon         
// @downloadURL https://update.greasyfork.org/scripts/16147/%5BNed%5D%20Window%20Title%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/16147/%5BNed%5D%20Window%20Title%20Changer.meta.js
// ==/UserScript==

document.title = $('span.truncate').text();