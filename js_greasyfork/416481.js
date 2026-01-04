// ==UserScript==
// @name         Autoclick Download Button journaldupirate.net
// @namespace    https://greasyfork.org/fr/users/11667-hoax017
// @version      0.1
// @description  try to take over the world!
// @author       Hoax017
// @match        https://www.journaldupirate.net/go_to/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416481/Autoclick%20Download%20Button%20journaldupiratenet.user.js
// @updateURL https://update.greasyfork.org/scripts/416481/Autoclick%20Download%20Button%20journaldupiratenet.meta.js
// ==/UserScript==

(function() {
    'use strict';
	if(document.querySelector('input[value="Continuer pour voir le lien"]')) {
	    document.querySelector('input[value="Continuer pour voir le lien"]').click()
	}

	if (document.querySelector('div.alert a')) {
		var link = document.querySelector('div.alert a')
		link.href = link.href.replace(/(\?|&)af=\d+/,'').replace(/(\?|&)aff_id=\d+/,'')
	}
})();