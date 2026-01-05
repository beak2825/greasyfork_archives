	// ==UserScript==
	// @name       General Autologin 1000ms
	// @namespace  http://use.i.E.your.homepage/
	// @version    0.1
	// @description  enter something useful
	// @match      https://www.amazon.de/ap/signin*
	// @match      https://banking.dkb.de/dkb/-*
	// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/12515/General%20Autologin%201000ms.user.js
// @updateURL https://update.greasyfork.org/scripts/12515/General%20Autologin%201000ms.meta.js
	// ==/UserScript==
	var success=0;
	var $;

	function autosubmit() {
		var t=setInterval(trysubmit,500); 
	}

	function trysubmit(){
		if (success==0){
			if ($('input[type="password"]').val()){
				$('input[type="submit"],button[type="submit"],input.submit,#submit,#login').trigger("click");
				//el = document.getElementById('button_login');
				//el.click();
				success = 1;
			}
		}
	}

	// Add jQuery
		(function(){
			if (typeof unsafeWindow.jQuery == 'undefined') {
				var GM_Head = document.getElementsByTagName('head')[0] || document.documentElement,
					GM_JQ = document.createElement('script');
		
				GM_JQ.src = 'http:////ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js';
				GM_JQ.type = 'text/javascript';
				GM_JQ.async = true;
		
				GM_Head.insertBefore(GM_JQ, GM_Head.firstChild);
			}
			GM_wait();
		})();

	// Check if jQuery's loaded
		function GM_wait() {
			if (typeof unsafeWindow.jQuery == 'undefined') {
				window.setTimeout(GM_wait, 100);
			} else {
				$ = unsafeWindow.jQuery.noConflict(true);
				autosubmit();
			}
		}