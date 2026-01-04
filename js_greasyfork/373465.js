// ==UserScript==
// @name          AntiBnpCancer
// @author        Fokse
// @description   No more bnp cancer
// @namespace     BNPCancer
// @include https://forums.d2jsp.org/forum.php?f=104
// @include https://forums.d2jsp.org/forum.php?f=104&o=*
// @include       https://forums.d2jsp.org/topic.php?t=*&f=104*
// @include	      https://forums.d2jsp.org/topic.php?t=*
// @require https://code.jquery.com/jquery-latest.js
// @version 1.00

// @downloadURL https://update.greasyfork.org/scripts/373465/AntiBnpCancer.user.js
// @updateURL https://update.greasyfork.org/scripts/373465/AntiBnpCancer.meta.js
// ==/UserScript==
(function() {
	'use strict';
	var trash_user_personnal = [603646];


	var checkUser = function(user){
		var _this = this;
		if (~trash_user_personnal.indexOf(user)){
			console.log(`Removing ${$('td:nth-child(3) > a', this).text()} (Reason: Personnal Blacklist)`)
			this.remove();
		}
	}

	if (window.location.href.match(/\/topic\.php/)){
		$('body > form > dl').each(function(){
			if (typeof $('dt > a', this).attr('href') !== 'undefined' && ~$('dt > a', this).attr('href').indexOf('user.php')){
				// body > form > dl:nth-child(11) > dd
				checkUser.call(this, parseInt($('dt > a', this).attr('href').split('=')[1]));
			}
		})
	}
	else if (window.location.href.match(/\/forum\.php\?f\=104/)){

		$('body dl dd table.ftb tbody tr').each(function(){
			var userid = $('td:nth-child(3) > a', this).attr('href')
			if (typeof userid !== 'undefined'){
				checkUser.call(this, parseInt(userid.split("=")[1]))
			}
		});
	}

})();