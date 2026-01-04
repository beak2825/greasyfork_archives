// ==UserScript==
// @name         Reveal drupal modules
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Sctipt that shows what module type the bands are using
// @author       André Sousa
// @match        https://www.ibm.com/*
// @match        https://cms.ibm.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409183/Reveal%20drupal%20modules.user.js
// @updateURL https://update.greasyfork.org/scripts/409183/Reveal%20drupal%20modules.meta.js
// ==/UserScript==

jQuery("section.ibm-duo-band").each(function(){
	var thisElement = jQuery(this);
	jQuery(this).css("position","relative");
	var getClass = thisElement.attr("class");
	getClass = getClass.substr(getClass.indexOf("ibm-duo-module"));
	getClass = getClass.slice(0, getClass.indexOf(" "));
	var getModule = getClass.replace("ibm-duo-","").replace("-"," ");
	getModule = getModule.charAt(0).toUpperCase() + getModule.slice(1);
	getModule = getModule.slice(0,getModule.length-1) + getModule.charAt(getModule.length-1).toUpperCase();
	var getBackground = thisElement.attr("class");
	getBackground = getBackground.substr(getBackground.indexOf("ibm-background-"));
	getBackground = getBackground.slice(getBackground.lastIndexOf("-")+1, getBackground.length);
	console.log(getBackground);

	var backgroundColor = "217,219,223,1";
	//if(parseInt(getBackground) >= 50) { backgroundColor = "255,255,255,0.9"; }

	thisElement.append("<span style='position: absolute;top: 2px;left: 2px;background: rgba("+backgroundColor+");padding: 10px 15px;text-shadow: 1px 1px 0px #fff; z-index:101'>"+getModule+"</span>");
});