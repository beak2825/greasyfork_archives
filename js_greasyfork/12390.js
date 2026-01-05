// ==UserScript==
// @name         Kongregate RCM Auto-Racer + Scroll Fixes!
// @namespace    RCM
// @version      0.3
// @description  [Works in FF and Chrome!] Auto-Racing + Scroll Fixes!
// @author       William H
// @contributor  wOxxOm (https://greasyfork.org/en/forum/profile/323/wOxxOm) //for fixing my script so it worked in Firefox! Huge thank you.
// @include      *racing-clicker.github.io/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @downloadURL https://update.greasyfork.org/scripts/12390/Kongregate%20RCM%20Auto-Racer%20%2B%20Scroll%20Fixes%21.user.js
// @updateURL https://update.greasyfork.org/scripts/12390/Kongregate%20RCM%20Auto-Racer%20%2B%20Scroll%20Fixes%21.meta.js
// ==/UserScript==

window.addEventListener("load", StartMyAutoClicker(), false);

function StartMyAutoClicker(elemArray) {
	if(!localStorage.autoClickInterval){
		localStorage.autoClickInterval = prompt('Please enter the number of miliseconds you would like it to click at\n *Note: 1000ms = 1 second, it\'s not recommended to do less than 10ms', '25');
	}
	$($('.dropdown')[0]).before('<li class="ng-scope"><a href=""><div class="fa fa-play" style="width:30px;" onclick="toggleAuto(this)" id="autoToggle"></div><input type="text" size="3" onblur="updateInterval(this)" style="height:20px;width:30px;background-color:#000000;border:0;text-align:center;" placeholder="'+ localStorage.autoClickInterval +'"></a></li>');
	$('head').append("<script>function toggleAuto(elem){\n\tif(elem.className.search('fa-pause') > 0){\n\t\telem.className = elem.className.replace('pause', 'play');\n\t\tclearInterval(autoClicker);\n\t}else{\n\t\telem.className = elem.className.replace('play','pause');\n\t\tautoClicker = setInterval((function(){$($('.btn.btn-primary.btn-lg.ng-scope')[0]).click();}), localStorage.autoClickInterval);\n\t}\n}\nfunction updateInterval(elem){\n\tlocalStorage.autoClickInterval = elem.value;\n\tif(document.getElementById('autoToggle').className.search('play') == -1){\n\t\tclearInterval(autoClicker);\n\t\tautoClicker = setInterval((function(){$($('.btn.btn-primary.btn-lg.ng-scope')[0]).click();}), localStorage.autoClickInterval);\n\t}\n}</script>");
	fixMyBloodyGame();
	setMutationHandler(document, '.dropdown', function(observer, nodes) {
		$('<li class="ng-scope"><a href=""><div class="fa fa-play" style="width:30px;" onclick="toggleAuto(this)" id="autoToggle"></div><input type="text" size="3" onblur="updateInterval(this)" style="height:20px;width:30px;background-color:#000000;border:0;text-align:center;" placeholder="'+ localStorage.autoClickInterval +'"></a></li>').insertBefore($('.dropdown')[0]);
		fixMyBloodyGame();
		observer.disconnect();
	});
}

function fixMyBloodyGame(){
	$.each($('div.panel-body.ps-container'), function() {
		$(this).replaceWith(function() {
		  return $('<' + this.nodeName + '>').attr('class', 'panel-body ps-container ps-active-y').attr('style', 'overflow:scroll;').append($(this).contents());
		});
	});
	$("[class^='ps-scrollbar-']").remove();
}