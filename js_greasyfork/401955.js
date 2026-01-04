// ==UserScript==
// @name         Remove Brainless
// @namespace    https://adnmb2.com/
// @version      0.2.4
// @description  Remove blank quotations from adnmb
// @author       Toka-MK
// @match        https://adnmb2.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/401955/Remove%20Brainless.user.js
// @updateURL https://update.greasyfork.org/scripts/401955/Remove%20Brainless.meta.js
// ==/UserScript==

(function() {
    "use strict";
    var htmlCollection = document.getElementsByClassName("h-threads-content");
    var array = [].slice.call(htmlCollection);
    for (var i = 0; i < array.length; i++) {
        if (array[i].parentElement.childElementCount < 3 && array[i].textContent.trim().replace(/>>No.[1-9][0-9]{0,9}/, "").length == 0) {
            array[i].parentElement.parentElement.remove();
        }
    }
})();