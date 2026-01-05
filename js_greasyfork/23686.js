// ==UserScript==
// @name		     SH Teamcity fixer
// @namespace    sh_teamcityfixer
// @description  Teamcity design and usability fixer for SH
// @include	     https://ci.smarthead.ru/*
// @version	     1.1.0
// @author       SARFEX
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/23686/SH%20Teamcity%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/23686/SH%20Teamcity%20fixer.meta.js
// ==/UserScript==

(function (window, undefined) {
	"use strict";
	var w;
	w = window;
	if (w.self != w.top) {
		return;
	}
	var body = document.body;
	
	var resultLinks = document.getElementsByClassName("resultsLink");
	for (var i = 0; i < resultLinks.length; i++) {
		var href = resultLinks[i].getAttribute("href");
		resultLinks[i].setAttribute("href", href.replace("&tab=buildResultsDiv", "&tab=report_project56_Links"));
		resultLinks[i].innerHTML = resultLinks[i].innerHTML.replace("Success", "<b>Success</b>");
	}
	
	var st = createStyle();
	var styleString = "";
	
	add(".headerLogoImg { width: 121px; height: 38px; background-image: url('data:image/png;base64,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') }");
	add("#list { height: 120px !important }");
	
	add(".artifactsLink { display: none; }");
	add("#properties-tab table tbody:first-child { display: none; }");
	
	//projectName
	add(".projectName { font-size: 18px; font-weight: 600; }");
	
	//add("#customConfigParams, #configurationParametersHeader { display: none; }");
	//add("#customConfigParams tr { display: none }");
	//add("#customConfigParams tr:nth-child(4), #customConfigParams tr:nth-child(12) { display:table-row }");
	
	//btn-mini
	add(".btn-group button:nth-child(1) { visibility: hidden } .btn_mini { padding: 4px 10px; font-weight: 600 } .btn_append { padding: 4px; width: 28px } ");
	
	// GulpList
	add("#customBuildEnvVars tr:nth-child(3){ display:none }");
	
	//general-tab
	//add("#tab-0 { display:none }");
	
	var buttonsDiv = document.getElementsByClassName("btn-group");
	
	console.log(buttonsDiv.length);
	for (i = 0; i < buttonsDiv.length; i++) {
		var appendButton = buttonsDiv[i].children[1];
		var clickEvent = appendButton.getAttribute("onclick");
		appendButton.setAttribute("onclick", clickEvent + "; appendBtnClick();");
		
		var runButton = buttonsDiv[i].children[0];
		runButton.style.visibility = "visible";
		runButton.setAttribute("onclick", clickEvent + "; runBtnClick();");
	}
	
	var generalTabTimer, targetTab;
	window.runBtnClick = function(){
		targetTab = "changes-tab";
		generalTabTimer = setInterval(checkGeneralTab, 20);
	}
	window.appendBtnClick = function(){
		targetTab = "properties-tab";
		generalTabTimer = setInterval(checkGeneralTab, 20);
	}
	function checkGeneralTab(){
		generalTab = document.getElementById('general-tab');
		if (generalTab !== null || generalTab !== undefined){
			if (generalTab.style.display === "block" || generalTab.style.display === ""){
				BS.RunBuildDialog.showTab(targetTab);
				clearInterval(generalTabTimer);
			}
		}
	}
	
	function createStyle() {
		var style = document.createElement("style");
		style.setAttribute("id", "gm-hacks")
		style.innerHTML = "";
		body.appendChild(document.createTextNode("\t"));
		body.appendChild(style);
		body.appendChild(document.createTextNode("\n"));
		return style;
	}
	function add(str){
		styleString += "\n" + str; 
	}
	st.innerHTML = styleString;
	
	
})(window);