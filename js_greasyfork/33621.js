// ==UserScript==
// @name          Custom_ServiceConsole_UI_CaseDetails
// @namespace     https://greasyfork.org/en/scripts/33175-custom-serviceconsole-ui
// @description	  Changes the Service Console Page Layouts
// @author        VatzU
// @include       https://*.salesforce.com/*
// @grant   	  none
// @version       1.1
// @downloadURL https://update.greasyfork.org/scripts/33621/Custom_ServiceConsole_UI_CaseDetails.user.js
// @updateURL https://update.greasyfork.org/scripts/33621/Custom_ServiceConsole_UI_CaseDetails.meta.js
// ==/UserScript==

(function(){
	var css = '';
	var txt = '';
	var mo_timeout;
	var pbHead = document.getElementsByClassName('pbSubheader');
	
 	//-----------move Case Details Quick Action---------------
	var CaseID = window.location.pathname.slice(1);
	if(document.getElementById("efpPublishers_" + CaseID +  "_option4") != null){
		var LD_QA = document.getElementById("efpPublishers_" + CaseID +  "_option4").parentNode;
		//var msg = LD_QA.childNodes[1].childNodes[3].innerHTML;
		
		if(LD_QA.childNodes[1].childNodes[3].innerHTML == "Case Details" ){
			var LD_next_QA = LD_QA.nextSibling;
			var CT_QA = document.getElementById("efpPublishers_" + CaseID +  "_option0").parentNode;
			CT_QA.parentNode.insertBefore(LD_QA,CT_QA);
			LD_next_QA.parentNode.insertBefore(CT_QA,LD_next_QA);
		}

	} 
	//-----------move Case Details Quick Action---------------
	
	
	//-----------small primary bar and quick actions---------------
	css+=".sd_primary_tabstrip .x-tab-strip-top .x-tab-left, .sd_secondary_tabstrip .x-tab-strip-top .x-tab-left {padding: 0 5px;} .x-tab-strip-wrap .x-tab-strip-top span.x-tab-strip-text {top: 0px;} .x-tab-strip span.x-tab-strip-text {padding: 2px 0;} li span.tabIcon, li img.tabIcon {padding-right: 5px;} .sd_primary_tabstrip .x-tab-strip-wrap ul.x-tab-strip li span.tabText {max-width: 110px;}";
	css+=".sd_primary_tabstrip li.x-tab-strip-active span.tabText, .sd_primary_tabstrip li span.tabText, .sd_primary_tabstrip li.x-tab-strip-over span.tabText, .sd_primary_tabstrip.darkBackground li.x-tab-strip-over span.tabText, .sd_primary_tabstrip.darkBackground .x-tab-strip-wrap .x-tab-strip-top .x-tab-strip-over span.x-tab-strip-text, .sd_primary_tabstrip.darkBackground .x-tab-strip-wrap .x-tab-strip-top .x-tab-strip-active span.x-tab-strip-text, .x-menu-item.sd-nav-menu-item, .support-servicedesk-navigator .x-btn-mc em .x-btn-text span, .x-tab-strip span.x-tab-strip-text, body.ServiceDeskPage #navigator-sbmenu, .sd_secondary_tabstrip .x-tab-strip-active .tabText, .x-tab-strip-text, body.ServiceDeskPage .builtinSidebarComponent .eMilestones .eCurrentMilestoneName, body.ServiceDeskPage .builtinSidebarComponent .eMilestones .eMilestoneName, body.ConsoleWorkspaceTabPanelPage #navigator-sbmenu, body.ConsoleWorkspaceTabPanelPage .builtinSidebarComponent .eMilestones .eCurrentMilestoneName, body.ConsoleWorkspaceTabPanelPage .builtinSidebarComponent .eMilestones .eMilestoneName, body.ServiceDeskPage div#servicedesk .x-plain-body .x-mask-loading div {font-size: 12px;}";
	css+=".x-tab-strip .x-tab-strip-closable a.x-tab-strip-close {top: 0px;}"
	css+=".sd_primary_tabstrip .x-tab-strip-top .x-tab-strip-inner {    height: 21px;}";
	css+=".x-tab-strip .x-tab-strip-closable > a.x-tab-right, .sd_secondary_tabstrip .x-tab-strip .x-tab-strip-closable > a.x-tab-right, .sd_secondary_tabstrip .x-tab-strip .x-tab-strip-closable.x-tab-strip-active > .x-tab-right, .x-tab-strip .x-tab-strip-pinned > a.x-tab-right, .sd_secondary_tabstrip .x-tab-strip .x-tab-strip-pinned > a.x-tab-right, .sd_secondary_tabstrip .x-tab-strip .x-tab-strip-pinned.x-tab-strip-active > .x-tab-right {height: 21px;}"
	css+="	.sd_primary_tabstrip .x-tab-strip-wrap ul.x-tab-strip li {    height: 21px;}";	
	css+=".sd_nav_tabpanel ul.x-tab-strip-top {    height: 21px;}";
	css+=".sd_primary_tabstrip {    height: 21px;}";	
	css+=".support-servicedesk-navigator .x-btn-mc em.x-btn-split button div {    margin-top: 0px;}";	
	css+=".support-servicedesk-navigator .x-btn-mc em .x-btn-text span {    height: 20px; margin-top: 0px;}";
	css+="	.support-servicedesk-navigator .x-btn-mc em.x-btn-split {    height: 21px;}";
	css+="	.support-servicedesk-navigator .x-btn-mc em .x-btn-text span {    height: 12px;    }";
	css+="	.support-servicedesk-navigator .x-btn-mc em.x-btn-split::after {    padding-top: 3px;}";
	css+="	.x-tab-tabmenu-right {    height: 21px;}";
	css+="	.x-tab-tabmenu-right::after {    top: 3px;}";

	
	if(document.getElementById("ext-comp-1006") != null){
		document.getElementById("ext-comp-1006").setAttribute("height", "21px");
	}
	
	css+=".sfxConsole .efpPanelSelect.efpChatterTabs > .optionContainer > li > .optionItem, .sfxConsole .efpPanelSelect.efpChatterTabs > .optionContainer > li > .dropdownOptionItem {padding: 5px 10px 5px 10px;}";
	css+=".entityFeedLayout .centerContent {    padding-top: 5px;}";
	css+=".entityFeedLayout.eflConsoleFrameStyle.emptyRightContent.compactLayout:not(.headerPageTools) .fullWidth .efpViewTools {top: 8px;}";
	
	//-----------small primary bar and quick actions---------------	
	
	
	if(typeof GM_addStyle != "undefined") {
		GM_addStyle(css);
	}else if(typeof PRO_addStyle != "undefined") {
		PRO_addStyle(css);
	}else if(typeof addStyle != "undefined") {
		addStyle(css);
	}else{
		var heads = document.getElementsByTagName("head");
		if (heads.length > 0) {
			var node = document.createElement("style");
			node.type = "text/css";
			node.appendChild(document.createTextNode(css));
			heads[0].appendChild(node); 

		}
	}
		
	
})();