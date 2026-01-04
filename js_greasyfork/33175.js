// ==UserScript==
// @name          Custom_ServiceConsole_UI
// @namespace     https://greasyfork.org/en/scripts/33175-custom-serviceconsole-ui
// @description	  Changes the Service Console Page Layouts
// @author        VatzU
// @include       https://*.salesforce.com/*
// @grant   	  none
// @version       1
// @downloadURL https://update.greasyfork.org/scripts/33175/Custom_ServiceConsole_UI.user.js
// @updateURL https://update.greasyfork.org/scripts/33175/Custom_ServiceConsole_UI.meta.js
// ==/UserScript==

(function(){
	var css = '';
	var txt = '';
	var mo_timeout;
	var pbHead = document.getElementsByClassName('pbSubheader');
	
 	//-----------move LATF Details Quick Action---------------
	var CaseID = window.location.pathname.slice(1);
	if(document.getElementById("efpPublishers_" + CaseID +  "_option6") != null){
		var LD_QA = document.getElementById("efpPublishers_" + CaseID +  "_option6").parentNode;
		//var msg = LD_QA.childNodes[1].childNodes[3].innerHTML;
		
		if(LD_QA.childNodes[1].childNodes[3].innerHTML == "LATF Details" ){
			var LD_next_QA = LD_QA.nextSibling;
			var CT_QA = document.getElementById("efpPublishers_" + CaseID +  "_option3").parentNode;
			CT_QA.parentNode.insertBefore(LD_QA,CT_QA);
			LD_next_QA.parentNode.insertBefore(CT_QA,LD_next_QA);
		}

	} 
		
	
})();