// ==UserScript==
// @name         RPC OPERATOR
// @namespace    https://github.com/SuperPommeDeTerre
// @version      1.3 
// @description  faster
// @author       Raul Canoy
// @match        https://my.alifelong.biz/dashboard/youclicksession/2011
// @grant        sniper
// @downloadURL https://update.greasyfork.org/scripts/36243/RPC%20OPERATOR.user.js
// @updateURL https://update.greasyfork.org/scripts/36243/RPC%20OPERATOR.meta.js
// ==/UserScript==

function f(){
	$('#btnYouclick').click()
	if (clicks.value<200) {
		setTimeout(f,1000, 5000); // 1-5 seconds
	}
}
f();