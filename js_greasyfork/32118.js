// ==UserScript==
// @name         Neptun K Edition
// @namespace    http://infocpp.ddns.me/
// @version      0.00004
// @description  Neptun K Épület Edition
// @author       Dóka Balázs
// @match        https://*.neptun.bme.hu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32118/Neptun%20K%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/32118/Neptun%20K%20Edition.meta.js
// ==/UserScript==

(function() {
	'use strict';
	document.getElementById('div_login_right_side').style.backgroundImage = "url('http://infocpp.ddns.me/c++/img/neptun/bme.png')";
	document.getElementById('tableMain').style.backgroundImage = "url('http://infocpp.ddns.me/c++/img/neptun/grad.png')";
	document.getElementById('td_Logo').style.backgroundImage = "url('http://infocpp.ddns.me/c++/img/neptun/logo.png')";
	document.getElementById('btnSubmit').style.backgroundImage = "url('http://infocpp.ddns.me/c++/img/neptun/button.png')";
	document.getElementById('td_LeftImage').style.backgroundImage = "url('http://infocpp.ddns.me/c++/img/neptun/left.png')";
	document.getElementById('td_LeftImage').style.backgroundPosition = "0px -3.7px";
	document.getElementById('lblModuleType').style.color = "#b44658";
	document.getElementById('lblInstitute').style.color = "grey";
	document.getElementById('lblVersion').innerHTML += "<br>K épület Edition © Dóka Balázs 2017";
	var elements = document.querySelectorAll('a');
	[].slice.call(elements).forEach(function(elem) {
	    elem.style.color = '#b44658';
	});
})();