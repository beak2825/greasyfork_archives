// ==UserScript==
// @name  Change store name | Business FB
// @namespace  PvP Nguyen Phat
// @description  Thay đổi tên cửa hàng trên Business FB
// @version  1.0.0
// @author  PvP Nguyen Phat
// @match  https://business.facebook.com/business_locations*
// @require https://code.jquery.com/jquery-latest.js
// @run-at  document-idle
// @downloadURL https://update.greasyfork.org/scripts/399647/Change%20store%20name%20%7C%20Business%20FB.user.js
// @updateURL https://update.greasyfork.org/scripts/399647/Change%20store%20name%20%7C%20Business%20FB.meta.js
// ==/UserScript==


var $ = window.jQuery;
//console.log('Test jQuery loaded 1: ', $('head meta'));
async function auto_change_storeName() {
	function wait(ms) { return new Promise(r => setTimeout(r, ms)); } // Chờ đợi.
	setInterval(async function () {
		if (document.getElementsByClassName('_4t2a').length) {
			document.getElementsByClassName('_58al _2gnb')[0].disabled = false;
			document.getElementsByClassName('_2gn0')[0].style.backgroundColor = 'white';
		}
		await wait(200);
	});
}

//var jquery_ = document.createElement('script');
//jquery_.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js';
//(document.body || document.head || document.documentElement).appendChild(jquery_);
//var script_ = document.createElement('script');
//script_.appendChild(document.createTextNode(`atob(${abc});`));
//(document.body || document.head || document.documentElement).appendChild(script_);
var script = document.createElement('script');
script.appendChild(document.createTextNode('!' + auto_change_storeName + '();'));
(document.body || document.head || document.documentElement).appendChild(script);