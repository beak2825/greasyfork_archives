// ==UserScript==
// @name       Daily Craver
// @version    0.3
// @description  enter something useful
// @match      http://ab.entertainmentcrave.com/promo*
// @match	   http://go.sportly.tv/*
// @copyright  2014+, Tjololo
// @namespace https://greasyfork.org/users/710
// @downloadURL https://update.greasyfork.org/scripts/2201/Daily%20Craver.user.js
// @updateURL https://update.greasyfork.org/scripts/2201/Daily%20Craver.meta.js
// ==/UserScript==

var timer = 0;

setInterval(reloadTimer,1000);
document.getElementById("hello_guide").style.display = "none";

function reloadTimer(){
    if(document.getElementById("crave_on"))
        document.getElementById("crave_on").click();
	timer++;
	if (timer%5==0)
        console.log(timer);
    if (timer < 70)
		randomNum = Math.floor(Math.random()*15 + 50);
    else
        timer = 50;

	if (timer == randomNum){
        console.log("MATCH");
        if (document.getElementsByClassName("keepCraving")[0].offsetLeft > 0){
            document.getElementsByClassName("keepCraving")[0].click();
            console.log(document.getElementsByClassName("keepCraving")[0].offsetLeft);
        }
        	if (randomNum % 2 == 0)
                document.getElementById("link_up").click();
            else
                document.getElementById("link_down").click();
            timer = 0;
        }
            
	}