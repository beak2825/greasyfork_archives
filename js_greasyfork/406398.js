// ==UserScript==
// @name Auto Merge Request Title
// @name:es Auto Merge Request Title
// @description Compatible gitlab
// @description:es Compatible gitlab
// @date 2020-06-10
// @compatible chrome
// @compatible firefox
// @compatible opera
// @compatible safari
// @license CC BY-NC-ND 4.0 International. https://creativecommons.org/licenses/by-nc-nd/4.0/
// @match *://*.gitlab.com/*
// @match *://gitlab.*.com.*/*
// @version 0.0.1.20200702174508
// @namespace https://greasyfork.org/users/662624
// @downloadURL https://update.greasyfork.org/scripts/406398/Auto%20Merge%20Request%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/406398/Auto%20Merge%20Request%20Title.meta.js
// ==/UserScript==
document.addEventListener("DOMContentLoaded", function(event) {
   var branchSelector = document.getElementsByClassName("branch-selector");

	for (var i = 0; i < branchSelector.length; i++) {
  	var texto = branchSelector[i].innerText;
	}
  
	var textoToInput = texto.split(' ');

	var textToInsert = textoToInput[1] +'=>'+ textoToInput[3];
	document.getElementById("merge_request_title").value = textToInsert;
});