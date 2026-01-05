// ==UserScript==
// @name         [Ned] Copy All Advisor Name
// @namespace    localhost
// @version      2.1
// @description  Copy All Advisor Name
// @author       Ned (Ned@Autoloop.com)
// @include      *autoloop.us/DMS/App/Schedule/Settings/ServiceAdvisors.aspx*
// @grant        none
// @icon         
// @downloadURL https://update.greasyfork.org/scripts/16134/%5BNed%5D%20Copy%20All%20Advisor%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/16134/%5BNed%5D%20Copy%20All%20Advisor%20Name.meta.js
// ==/UserScript==

//Add Button
$('#RightContent > fieldset').append('<a id="copyNames" class="btn-default">Copy Names</a>');

$('#copyNames').click(function() {
	var optVals=[];
	$('#RightContent > fieldset > select option').each(function(){
		optVals.push( $(this).text());
	});
	optVals.shift(); //Removes 1st blank element
	prompt("Advisors:", optVals.join(' ¦ '))
});