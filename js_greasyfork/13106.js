// ==UserScript==
// @name        Quizlet 'Learn' Mode Global Input Stopper
// @description Disable page click from going to the next question without permission. Additionally, "Enter" key will submit answers, and "space" will override incorrect answers. Only accept 'enter', 'space' keys and 'click' events.
// @author      Kai Krause <kaikrause95@gmail.com>
// @match       http://quizlet.com/*/write*
// @match       https://quizlet.com/*/write*
// @version     1.3.4
// @grant       none
// @namespace QZLT_LearnKBMode
// @downloadURL https://update.greasyfork.org/scripts/13106/Quizlet%20%27Learn%27%20Mode%20Global%20Input%20Stopper.user.js
// @updateURL https://update.greasyfork.org/scripts/13106/Quizlet%20%27Learn%27%20Mode%20Global%20Input%20Stopper.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
	Element.NativeEvents={click:2,dblclick:0,mouseup:0,mousedown:0,contextmenu:0,mousewheel:0,DOMMouseScroll:0,mouseover:0,mouseout:0,mousemove:0,selectstart:1,selectend:0,keydown:0,keypress:0,keyup:0,input:0,orientationchange:2,touchstart:2,touchmove:2,touchend:2,touchcancel:2,gesturestart:2,gesturechange:2,gestureend:2,focus:2,blur:2,change:2,reset:2,select:2,submit:2,paste:2,oninput:2,load:2,unload:1,beforeunload:2,resize:1,move:1,DOMContentLoaded:1,readystatechange:1,error:1,abort:1,scroll:1};

	window.addEventListener("keydown", enter, true);
	
	function enter(charE) {
		var answerBtn = document.getElementById("js-learnModeAnswerButton");
		var checkBtn = document.getElementsByClassName("LearnModeMain-anyKey");
		var overrideBtn = document.getElementsByClassName("LearnModeGradeAnswerView-overrideLink");
		if (charE.keyCode == "13") {
			if (answerBtn){
				answerBtn.click();
			} else if (checkBtn) {
				checkBtn[0].click();
			}
		}
		if (charE.keyCode == "32") {
			if (overrideBtn){
				overrideBtn[0].click();
			}
		}
	}
}, false);