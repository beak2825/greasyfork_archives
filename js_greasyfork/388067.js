// ==UserScript==
// @name        Enable Focus (by Coder)
// @namespace   https://userscripts-mirror.org/users/670670
// @match     *.tvglee.tv/*
// @match     *adserver.entertainow.com/*
// @match     *.tvglee.com/*
// @match     *video.tvglee.tv/*
// @match     *.miimd.tv/*
// @match     *.miimd.com/*
// @match     *.ratinghealth.com/*
// @match     *.tvminutes.tv/*
// @match     *.matchedcars.tv/*
// @match     *.autopairs.com/*
// @match     *.furryflix.com/*
// @match     *.mooviemania.com/*
// @match     *.1800mysuv.com/*
// @match     *.travelsavvy.tv/*
// @match     *.sunnygardens.com*
// @match     *.earnhoney.com/en/premium/offer/*
// @match     *.sunnygardens.com/*
// @match 	http://sunnygardens.com/
// @version     1.3
// @run-at   document-start
// @grant       none
// @description Enabling focus and restart bot
// @downloadURL https://update.greasyfork.org/scripts/388067/Enable%20Focus%20%28by%20Coder%29.user.js
// @updateURL https://update.greasyfork.org/scripts/388067/Enable%20Focus%20%28by%20Coder%29.meta.js
// ==/UserScript==
setInterval(function() {
    window.focus();
    try{
        document.getElementsByClassName('vjs-paused')[1].click();
    }
    catch(e){}

    try{
        document.getElementsByClassName('btn-success')[0].click();
    }
    catch(e){}

    try{
        document.querySelector('#reload').click();
        console.log("click Touch to start button");
    }
	catch(e){}
	try{
    	var unmute = document.getElementsByClassName('btn-danger')[0];
		if(unmute.innerText=='Unmute'){unmute.click()}
	}
    catch(e){}
}, 1000);
document.hasFocus = function () {return true;};