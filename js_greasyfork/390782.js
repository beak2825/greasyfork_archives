// ==UserScript==
// @name         open search from XLS
// @namespace    http://tampermonkey.net/
// @version      0.24
// @description  try to take over the world!
// @author       You
// @match        https://cms.sletat.ru/LinkHotels.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390782/open%20search%20from%20XLS.user.js
// @updateURL https://update.greasyfork.org/scripts/390782/open%20search%20from%20XLS.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var string = document.URL.replace('https://cms.sletat.ru/LinkHotels.aspx?', '')
	string = string.replace(/_/g, ' ');
	string = decodeURI(string);
	var arrParam = string.split('&', 6);
	// 0 - проверка
	// 1 - страна
	// 2 - название отеля
	// 3 - курорт
	// 4 - ТО
	var userId = body_countryLink.getAttribute('onclick');
	userId = userId.replace("showChoseCountry('", '');
	userId = userId.replace("'); return false;", '');

	if (arrParam[0] == 'showWindow=true') {
		showLinkDialog(arrParam[1], arrParam[2], userId, '', '', '', 'body_li_tr_0'); 
		document.querySelector("#submitter").click();
	}
SLT_container.style.top = '100px';
})();
