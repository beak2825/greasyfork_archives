// ==UserScript==
// @description             removes some of the gamification of stackoverflow.com
// @name     				betteroverflow
// @namespace               https://gitlab.com/cronoik/gamificationmyass/
// @version  				1.1
// @grant    				none
// @include  				http*://stackoverflow.com/*
// @author 	 			    cronoik
// @downloadURL https://update.greasyfork.org/scripts/418566/betteroverflow.user.js
// @updateURL https://update.greasyfork.org/scripts/418566/betteroverflow.meta.js
// ==/UserScript==

function turnOff(className) {
		let ele = document.getElementsByClassName(className);
		let n = ele.length;
		
  	for (var i = 0; i < n; i++) {
				ele[i].style.display = 'none';
		}
}

//own badge & reputation
turnOff('s-user-card--info');
//achievement notification
turnOff('fc-success');
//reputation of others
turnOff('reputation-score');
//badges of others
turnOff('-flair');
