// ==UserScript==
// @name         Reddit Robin Autoclick
// @namespace    http://idonthaveone/
// @version      1.0
// @description  autoclick grow
// @author       m1k3245
// @match        *.reddit.com/robin*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18445/Reddit%20Robin%20Autoclick.user.js
// @updateURL https://update.greasyfork.org/scripts/18445/Reddit%20Robin%20Autoclick.meta.js
// ==/UserScript==
/* jshint -W097 */
var jq = document.createElement('script');
jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);

autoenter = setInterval(
	function(){
		if ($('.robin-home--thebutton').length > 0) {
			$('#joinRobinContainer').click()

			setTimeout(
				function(){
					$('.robin-home--thebutton').click()
					setTimeout(
						function(){
							location.reload();
						},
						2000)
				},
			2000);

			console.log('join')
		}
		else if (!$('.robin-chat--vote-increase.robin--vote-class--increase').hasClass("robin--active")) {
			$('.robin-chat--vote-increase.robin--vote-class--increase').click()
			console.log('grow')
		}
		else{
			console.log('null')
		}
	},
60000);