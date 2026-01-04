// ==UserScript==
// @name     Hide Duolingo 'SEND CONGRATS' 
// @version  1
// @grant    none
// @match duolingo.com
// @description This is a simple script to get rid of a little annoyance on the Duolingo website, without compromising the site usability. The page uses the same container for both a useless "SEND CONGRATS" message and the access to the test that allows us to complete a unit without having to do every single exercise.
// @namespace https://greasyfork.org/users/772826
// @downloadURL https://update.greasyfork.org/scripts/426586/Hide%20Duolingo%20%27SEND%20CONGRATS%27.user.js
// @updateURL https://update.greasyfork.org/scripts/426586/Hide%20Duolingo%20%27SEND%20CONGRATS%27.meta.js
// ==/UserScript==

if (window.location.href=='https://www.duolingo.com/learn') {
	function checkThing() {
		var x = document.getElementsByClassName('_3gK3K _2At32 _1szh4');
		if (x.length>0) {
      console.log(x[0].innerText);
      if (x[0].innerHTML.indexOf('SEND CONGRATS') != -1) {
				console.log('v: ' + x[0].style.visibility);
				if (x[0].style.visibility=='hidden') {
					clearInterval(duoCheck);
					}
				x[0].style.visibility = "hidden";
				}
			}
		}
	const duoCheck = setInterval(checkThing, 1000);
	}
