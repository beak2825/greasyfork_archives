// ==UserScript==
// @name         Move Mangadex "Reading Hitory" tab to top
// @namespace    https://greasyfork.org/en/users/158832
// @version      0.2
// @description  Mangadex move Reading History Tab to top
// @author       Riztard
// @match        https://mangadex.org/
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393640/Move%20Mangadex%20%22Reading%20Hitory%22%20tab%20to%20top.user.js
// @updateURL https://update.greasyfork.org/scripts/393640/Move%20Mangadex%20%22Reading%20Hitory%22%20tab%20to%20top.meta.js
// ==/UserScript==

(function() {
    'use strict';

	if (document.getElementsByClassName("card mb-3")[3].textContent.indexOf("News") > -1){ //if 1 top chapter
		var a = document.getElementsByClassName("card mb-3")[4];
		var b = document.getElementsByClassName("col-lg-4")[0];
		b.insertAdjacentElement('afterbegin', a);
	}
	else{ //if 1 need support
		var c = document.getElementsByClassName("card mb-3")[5];
		var d = document.getElementsByClassName("col-lg-4")[0];
		d.insertAdjacentElement('afterbegin', c);
	}

})();