// ==UserScript==
// @name         Auto Kuisioner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Arson Marianus
// @match        https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385072/Auto%20Kuisioner.user.js
// @updateURL https://update.greasyfork.org/scripts/385072/Auto%20Kuisioner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var frm = document.querySelector("form-control");
    var btn = document.querySelector("col-lg-12 center btn btn-primary btn-lg");
    var i;
    for (i = 0; i < frm.length; i++) {
        frm[i].selectedIndex = 3;
    }
    btn.click();
})();
