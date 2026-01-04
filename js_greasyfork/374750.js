// ==UserScript==
// @name         Randstuff.ru
// @version      0.2
// @match        *://randstuff.ru/*
// @run-at       document-end
// @grant        none
// @description  Predictable number generation for Randstuff.ru (https://randstuff.ru/number/)
// @author       Kaimi
// @homepage     https://kaimi.io/2016/01/tampering-vk-contest-results/
// @namespace    https://greasyfork.org/users/228137
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/374750/Randstuffru.user.js
// @updateURL https://update.greasyfork.org/scripts/374750/Randstuffru.meta.js
// ==/UserScript==

// Number which will be generated on target click
var desired_number = 31337;
var desired_click_number = 3;

var click_ctr = 0;

$.ajaxPrefilter
(
	function(options, originalOptions, jqXHR)
	{
		var originalSuccess = options.success;

		options.success = function (data)
		{
			click_ctr++;
 
			if(click_ctr == desired_click_number)
				data.number = desired_number;
 
			originalSuccess(data);
		};
	}
);