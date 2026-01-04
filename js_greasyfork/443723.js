// ==UserScript==
// @name        Yet Another Cookie AutoClicker
// @namespace   Violentmonkey Scripts
// @match       https://orteil.dashnet.org/cookieclicker
// @grant       none
// @version     1.0
// @author      minus
// @description 4/2/2022, 11:41:51 AM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443723/Yet%20Another%20Cookie%20AutoClicker.user.js
// @updateURL https://update.greasyfork.org/scripts/443723/Yet%20Another%20Cookie%20AutoClicker.meta.js
// ==/UserScript==

/// CONSTANTS

const sectionLeft = document.getElementById("sectionLeft");

const buttonStateText = {
  false: "OFF",
  true: "ON"
}

const buttonCSS = "position: absolute; z-index: 999;";

// Copy of the Game.ClickCookie function, just without the things following mouse cursor (it's annoying)
function AutoClickCookie(e,amount) {
  var now = Date.now();
	if (e) e.preventDefault();
	if (Game.OnAscend || Game.AscendTimer>0 || Game.T<3 || now-Game.lastClick<1000/((e?e.detail:1)===0?3:50)) {}
	else {
		if (now-Game.lastClick<(1000/15))	{
			Game.autoclickerDetected+=Game.fps;
			if (Game.autoclickerDetected>=Game.fps*5) Game.Win('Uncanny clicker');
		}
    
		Game.loseShimmeringVeil('click');
    
		var amount=amount?amount:Game.computedMouseCps;
		Game.Earn(amount);
		Game.handmadeCookies+=amount;
    
    var px = (sectionLeft.offsetWidth/2);
    var py = (sectionLeft.offsetHeight/ 2.25)
    
		if (Game.prefs.particles)
		{
			Game.particleAdd();
			Game.particleAdd(px,py,Math.random()*4-2,Math.random()*-2-2,Math.random()*0.5+0.75,1,2);
		}
		if (Game.prefs.numbers) Game.particleAdd(px+Math.random()*8-4,py-8+Math.random()*8-4,0,-2,1,4,2,'','+'+Beautify(amount,1));
		
		Game.runModHook('click');
		
		Game.playCookieClickSound();
		Game.cookieClicks++;
		
		if (Game.clicksThisSession==0) PlayCue('preplay');
		Game.clicksThisSession++;
		Game.lastClick=now;
	}
	
  Game.Click=0;
}

/// END CONSTANTS

/// AUTOCLICK 

var delay = 0;
var doLoop = false;

// Autoclick function
function clickLoop(){
  AutoClickCookie(null, null);
  if(doLoop)
    setTimeout(clickLoop, delay);
}

function shimmerLoop() {
  Game.shimmers.forEach(shimmer => {shimmer.l.click();});
  if(doLoop)
    setTimeout(shimmerLoop, 50);
}

/// END AUTOCLICK

/// BUTTON

var autoClickButton = document.createElement("button");
autoClickButton.innerText = "Autoclicker: " + buttonStateText[doLoop];
autoClickButton.setAttribute("style", buttonCSS);

autoClickButton.onclick = function(){
  doLoop = !doLoop;
  autoClickButton.innerText = "Autoclicker: " + buttonStateText[doLoop];
  clickLoop();
  shimmerLoop();
}

sectionLeft.appendChild(autoClickButton);

/// END BUTTON