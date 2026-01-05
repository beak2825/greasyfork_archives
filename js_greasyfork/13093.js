// ==UserScript==
// @name        Show Password
// @namespace   http://script.b9mx.com/show-password-tool-tip.user.js
// @description Rollover any password field to see the password as tooltip pop up.
// @include     *
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13093/Show%20Password.user.js
// @updateURL https://update.greasyfork.org/scripts/13093/Show%20Password.meta.js
// ==/UserScript==

window.set_password_title_functions = function(){
	var input = document.getElementsByTagName("input");
	for(i in input){
		var no_listeners = true;
		for(l in window.inputs_with_listeners){
			if(l === input[i]) no_listeners = false;
		}
		if(input[i].type === "password" && no_listeners){
			input[i].oninput = function(){
				this.title = this.value;
			}
			input[i].title = input[i].value;
			window.inputs_with_listeners.push(input[i]);
		}
	}
}
window.inputs_with_listeners = [];
window.timerid_inputs_listeners = 0;
window.addEventListener("load", function(){
	window.timerid_inputs_listeners = setInterval(
		window.set_password_title_functions, 5000);
	window.set_password_title_functions();
}, false);