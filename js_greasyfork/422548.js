// ==UserScript==
// @name         Auto Login Myclass
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://myclass.apps.binus.ac.id/Auth
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422548/Auto%20Login%20Myclass.user.js
// @updateURL https://update.greasyfork.org/scripts/422548/Auto%20Login%20Myclass.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("#Username").val(localStorage.getItem('usernameBimay'));
    $("#Password").val(localStorage.getItem('passwordBimay'));
    $("#btnSubmit").click();
    // Your code here...
})();