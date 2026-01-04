// ==UserScript==
// @name         DI.FM - I am still here!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.di.fm/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389191/DIFM%20-%20I%20am%20still%20here%21.user.js
// @updateURL https://update.greasyfork.org/scripts/389191/DIFM%20-%20I%20am%20still%20here%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        var modal = document.querySelector("#modal-region .modal-content");
	if (typeof(modal) !== 'undefined' && modal !== null && modal.children.length !== 0) {
	   document.querySelector("#modal-region > div > div > div.modal-header > button.close").click()
	}
}, 10000);
})();