// ==UserScript==
// @name            Mob Wars Tool Suite
// @version         1.09
// @description     Loads GuessXs' "Mob Wars Tool Suite" into Mob Wars
// @include   	    /^https?:\/\/apps.facebook.com/mobwars/*/
// @include   	    /^https?:\/\/mobwars-prod-ssl.metamoki.com*/
// @include   	    /^https?:\/\/www.mobwars.com*/
// @grant     			none
// @namespace https://greasyfork.org/users/89831
// @downloadURL https://update.greasyfork.org/scripts/35162/Mob%20Wars%20Tool%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/35162/Mob%20Wars%20Tool%20Suite.meta.js
// ==/UserScript==

(function(){
	function loadContent(file){
		var head = document.getElementsByTagName('head').item(0);
		var scriptTag = document.getElementById('loadScript');
		if(scriptTag){
			head.removeChild(scriptTag);
		}
		script = document.createElement('script');
		script.src = file;
		script.type = 'text/javascript';
		script.id = 'loadScript';
		head.appendChild(script);
	}

	var wait_for_jQuery = setInterval(function(){
		if(window.jQuery){
			clearInterval(wait_for_jQuery);
			loadContent('https://code.jquery.com/ui/1.7.1/jquery-ui.min.js');
			var wait_for_jQueryUI = setInterval(function(){
				if(window.jQuery.ui.version){
					clearInterval(wait_for_jQueryUI);
					loadContent('https://dl.dropboxusercontent.com/s/cgtpdjvb9qs7c5z/tt.js');
				}
			},250)
		}
	},250)
})();
