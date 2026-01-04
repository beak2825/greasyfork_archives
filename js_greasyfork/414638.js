// ==UserScript==
// @name         Randstuff.ru
// @version      0.2.2
// @match        *://randstuff.ru/*
// @run-at       document-end
// @grant        none
// @description  Predictable number generation for Randstuff.ru (https://randstuff.ru/number/)
// @author       dazzzed
// @namespace https://greasyfork.org/users/228137
// @downloadURL https://update.greasyfork.org/scripts/414638/Randstuffru.user.js
// @updateURL https://update.greasyfork.org/scripts/414638/Randstuffru.meta.js
// ==/UserScript==

let desired = [17, 32, 48]; // target numbers
var click = 0; // current click

$.ajaxPrefilter
(
	function(options, originalOptions, jqXHR)
	{
		var originalSuccess = options.success;

		options.success = function (data)
		{ 
			data.number = desired[click];
			
            if (click < desired.length-1)
            {
            	click++;
            }	
            else
            {	
            	click = 0;
            }
                        
                        
 
			originalSuccess(data);
		};
	}
);