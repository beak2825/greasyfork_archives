// ==UserScript==
// @name         Accruals List (personal)
// @namespace    http://rubenmartinez.net/
// @version      0.1
// @description  try to take over the world!
// @author       Ruben Martinez
// @match        https://corporateservices.docomodigital.com/ACCRUALS/Lists/ACCRUAL_DETAIL/NewForm.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38942/Accruals%20List%20%28personal%29.user.js
// @updateURL https://update.greasyfork.org/scripts/38942/Accruals%20List%20%28personal%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

function selectOption(title, option) {
	var element = $("select[title='"+title+"'] option:contains('"+option+"')");
	element.trigger('click');
	element.prop('selected',true).trigger('change');
}

selectOption("BUSINESS_LINE","PAYMENTS");
selectOption("SUPPLIER","AT SISTEMAS");
selectOption("COUNTRY","SPAIN");
selectOption("PROJECT","E-DCB PLATFORM EVOLUTION 2018");
//selectOption("SBU","GTD_PSU_IT1_CORE");
selectOption("SBU","PA_PDDCB_TDPTF_IT1");

$("select[title='CONSULTANT'] option").each(function(index, element) {
	var name = $(this).text();

	console.log(name);

	if (name != "Andrés Oliver Solis Oliver Solis" &&
		name != "Carlos David  Castillo Di Giacinto" &&
		name != "Juan Manso López" &&
		name != "Pedro Jesús Marín Estevez") {
		$(this).remove();
	}
});
$("select[title='CONSULTANT']").prepend("<option value='-' selected='selected'>Filtered list, choose one...</option>");


})();