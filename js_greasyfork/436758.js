// ==UserScript==
// @name         sendBabyOneKey
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hello
// @author       You
// @match        https://thecryptoyou.io/game/mybaby*
// @icon         https://www.google.com/s2/favicons?domain=thecryptoyou.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436758/sendBabyOneKey.user.js
// @updateURL https://update.greasyfork.org/scripts/436758/sendBabyOneKey.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
 var vvvTarADDR = '0';
 
//-------------------------------
function openifrm(idx,TarADDR){
var ifm = document.createElement('iframe');
document.body.appendChild(ifm);

    ifm.style.border='3px solid red';
    ifm.style.width = '1000px';
    ifm.style.heigh = '1000px';


ifm.style.display = 'none';//hidden---zzzzzzzzzzzzzzzzzz


ifm.src = document.location.href;




    let h=setTimeout(function(){
		ifm.contentDocument.querySelectorAll('img[style="cursor: pointer; width: 120px;"]')[idx].click();
       // alert('ifm loaded!');

    },7000);

	let cc=setTimeout(function(){

            let btns = ifm.contentDocument.querySelectorAll('button[scale="md"]');
            for(let i=0;i<btns.length;i++){
                if(btns[i].innerText=='转移') btns[i].click();
            }
    },10000);

    let ddcc=setTimeout(function(){
        //ifm.contentDocument.querySelector('input[placeholder="Input your to address"]').value=TarADDR;
		
		    let inputbox = ifm.contentDocument.querySelector('input[placeholder="Input your to address"]');
			//inputbox.focus();
			inputbox.setAttribute('value', TarADDR);
			let evt = document.createEvent('HTMLEvents');
			evt.initEvent('input', true, true);
			evt.eventType = 'message';
			inputbox.dispatchEvent(evt);
		

			  let btns = ifm.contentDocument.querySelectorAll('button[scale="md"]');
				for(let i=0;i<btns.length;i++){
					if(btns[i].innerText=='确认') btns[i].click();
				}

            },13000);




}

    //---------------------

  function main(){
	window.onkeyup = function(evn){
		let e = evn||window.event;
		if(e.keyCode == 120){
		//--------------------------------------120=F9
		vvvTarADDR = prompt('Wallet Address：');
		let headers = document.querySelectorAll('img[style="cursor: pointer; width: 120px;"]');
		for(let i=0;i<headers.length;i++){
			openifrm(i,vvvTarADDR);
		};


		//-------------------------------------
		}
	}
}

//---------
 main();






})();