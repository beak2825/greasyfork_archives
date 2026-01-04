// ==UserScript==
// @name         New Userscript Reinicia
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  É um script especifico de ab60ac47cf
// @author       You
// @match        https://freebitco.in/
// @icon         https://www.google.com/s2/favicons?domain=freebitco.in
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438088/New%20Userscript%20Reinicia.user.js
// @updateURL https://update.greasyfork.org/scripts/438088/New%20Userscript%20Reinicia.meta.js
// ==/UserScript==

(function() {
    'use strict';

setInterval(function(){
	document.getElementById("free_play_form_button").click();

	setInterval(function(){
		document.location.reload(true);
	},5000);

},145000);

})();