// ==UserScript==
// @name    AutoConfirm Haggle
// @author  Tyler Durden
// @match   http://www.neopets.com/objects.phtml*
// @description  confirms the popup
// @locale none
// @version 0.0.1.20200418104352
// @namespace https://greasyfork.org/users/521385
// @downloadURL https://update.greasyfork.org/scripts/401314/AutoConfirm%20Haggle.user.js
// @updateURL https://update.greasyfork.org/scripts/401314/AutoConfirm%20Haggle.meta.js
// ==/UserScript==

unsafeWindow.confirm = function() {
    return true;
};