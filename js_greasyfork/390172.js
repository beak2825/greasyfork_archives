// ==UserScript==
// @name changeNumberToSearch
// @namespace changeNumberToSearch
// @description for LK
// @match https://lk.mango-office.ru/*/stats/calls
// @grant none
// @version 0.0.1.20190916094344
// @downloadURL https://update.greasyfork.org/scripts/390172/changeNumberToSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/390172/changeNumberToSearch.meta.js
// ==/UserScript==

$('#filter-client-number, #abonent-autocomplete').change(function() {
	$(this).val($(this).val().replace(/[^0-9]/gim,''))
	if (($(this).val().length == 11)&&($(this).val()[0] == 8)) {
		$(this).val('7'+$(this).val().substr(1));
	}
});
