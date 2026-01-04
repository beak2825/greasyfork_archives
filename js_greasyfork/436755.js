// ==UserScript==
// @name         onekeycliamV2
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  onekeycliamV2 help you enjoy it!
// @author       You
// @match        https://thecryptoyou.io/game/daily-mining*
// @icon         https://www.google.com/s2/favicons?domain=thecryptoyou.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436755/onekeycliamV2.user.js
// @updateURL https://update.greasyfork.org/scripts/436755/onekeycliamV2.meta.js
// ==/UserScript==

(function() {
    'use strict';

var PageTurningTimerID=0;
var ArrowRight = null;
var PageNumDiv = null;
var PageNumText_curr = '';


function getAll(){
    let buttons = document.querySelectorAll('button:not(button[disabled])');
	for(let i=0;i<buttons.length;i++){
		if(buttons[i].innerText=="领取工资" && buttons[i].style.color!='gray'){
			//buttons[i].style.color='gray';
			buttons[i].click();
			//buttons[i].disabled=true;
		}
	}
}



function init(){
	let ArrowBtns = document.querySelectorAll('svg[width="50"]');
	if(ArrowBtns.length == 4){
		ArrowRight = ArrowBtns[3];
		PageNumDiv = ArrowBtns[2].parentNode.nextSibling;
		PageNumDiv.style.color = 'red';
		//alert(PageNumDiv.innerText);
	}
}

function TurnAndCliam(){
	document.title='TurnAndCliaming...'
	if(ArrowRight && PageNumDiv){
		if(PageNumDiv.innerText.indexOf('/')>-1 && PageNumDiv.innerText != PageNumText_curr){//ArrowRight.getAttribute('color')=='#FFC85D' &&

			getAll();
			PageNumText_curr = PageNumDiv.innerText;
			ArrowRight.parentNode.click();

		}else if(ArrowRight.getAttribute('color')=='#B2B2B2' || PageNumDiv.innerText == PageNumText_curr){
			clearInterval(PageTurningTimerID); document.title='Finished.';//alert('killself--gray || pageNum_nochange');//killself
		}else{;};
	}else{
		clearInterval(PageTurningTimerID); document.title='Finished-';//alert('killself--unkonow') //killself
	}
}







 function main(){
	window.onkeyup = function(evn){
		let e = evn||window.event;
		if(e.keyCode == 120){
		//--------------------------------------120=F9

			init();
			PageTurningTimerID = setInterval(TurnAndCliam,1000);

		//-------------------------------------
		}
	}
}

//-------------------------------------
 main();


})();


