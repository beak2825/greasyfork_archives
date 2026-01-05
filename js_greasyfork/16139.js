// ==UserScript==
// @name         [Ned] Portal Page URL Changer
// @namespace    localhost
// @version      2.1
// @description  Portal Page URL Changer
// @author       Ned (Ned@Autoloop.com)
// @include      *autoloop.us/DMS/App/DealershipSettings/Portal.aspx*
// @grant        none
// @icon         
// @downloadURL https://update.greasyfork.org/scripts/16139/%5BNed%5D%20Portal%20Page%20URL%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/16139/%5BNed%5D%20Portal%20Page%20URL%20Changer.meta.js
// ==/UserScript==

var address = $('#ctl00_ctl00_Main_Main_txtNewSubdomain').val();
address = address.split('.');
if(address[1]=='portal') {
	address[1] = '.myvehiclesite.com'
	$('#ctl00_ctl00_Main_Main_txtNewSubdomain').val(address[0]+address[1]);
	$('#ctl00_ctl00_Main_Main_pnlCreate > div').append('Fixed URL!');
}