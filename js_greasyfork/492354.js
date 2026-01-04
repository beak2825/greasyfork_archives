// ==UserScript==
// @name         CookieClicker-Hack
// @namespace    http://tampermonkey.net/
// @version      2024-04-11 v.1
// @description  Any X Global Cookie Gain | Cookies Never Drop
// @author       OrangeInk
// @match        https://orteil.dashnet.org/cookieclicker/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/492354/CookieClicker-Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/492354/CookieClicker-Hack.meta.js
// ==/UserScript==

setTimeout(()=> {
(function() {
function Inject() {
    let mult = parseInt(prompt("How Much Times More Cookies Do You Want To Gain? Don't enter anything other than a positive integer", 10))
    let minutesInHour = parseInt(prompt("How Many Minutes Is A Hour? 1 means that lumps grow 60 times quicker, values below 1 breaks.", 60))
        Game.Earn=function(howmuch)
		{
			Game.cookies+=howmuch*mult;
			Game.cookiesEarned+=howmuch*mult;
		}
        	Game.Spend=function(howmuch)
		{
			Game.cookies-=0;
		}
    	Game.spendLump=function(n,str,func,free)
		{
			//ask if we want to spend N lumps (unless free)
			return function()
			{
				if (!free && Game.lumps<n) return false;
				if (!free && Game.prefs.askLumps)
				{
					PlaySound('snd/tick.mp3');
					Game.promptConfirmFunc=func;//bit dumb
					Game.Prompt('<id SpendLump><div class="icon" style="background:url('+Game.resPath+'img/icons.png?v='+Game.version+');float:left;margin-left:-8px;margin-top:-8px;background-position:'+(-29*48)+'px '+(-14*48)+'px;"></div><div style="margin:16px 8px;">'+loc("Do you want to spend %1 to %2?",['<b>'+loc("%1 sugar lump",LBeautify(n))+'</b>',str])+'</div>',[[loc("Yes"),'Game.lumps-='+n+';Game.promptConfirmFunc();Game.promptConfirmFunc=0;Game.recalculateGains=1;Game.ClosePrompt();'],loc("No")]);
					return false;
				}
				else
				{
					if (!free) Game.lumps-=0;
					func();
					Game.recalculateGains=1;
				}
			}
		}
    	Game.computeLumpTimes=function()
		{
			var hour=1000*60*60*(minutesInHour/60);
			Game.lumpMatureAge=hour*20;
			Game.lumpRipeAge=hour*23;
			if (Game.Has('Stevia Caelestis')) Game.lumpRipeAge-=hour;
			if (Game.Has('Diabetica Daemonicus')) Game.lumpMatureAge-=hour;
			if (Game.Has('Ichor syrup')) Game.lumpMatureAge-=1000*60*7;
			if (Game.Has('Sugar aging process')) Game.lumpRipeAge-=6000*Math.min(600,Game.Objects['Grandma'].amount);//capped at 600 grandmas
			if (Game.hasGod && Game.BuildingsOwned%10==0)
			{
				var godLvl=Game.hasGod('order');
				if (godLvl==1) Game.lumpRipeAge-=hour;
				else if (godLvl==2) Game.lumpRipeAge-=(hour/3)*2;
				else if (godLvl==3) Game.lumpRipeAge-=(hour/3);
			}
			//if (Game.hasAura('Dragon\'s Curve')) {Game.lumpMatureAge/=1.05;Game.lumpRipeAge/=1.05;}
			Game.lumpMatureAge/=1+Game.auraMult('Dragon\'s Curve')*0.05;Game.lumpRipeAge/=1+Game.auraMult('Dragon\'s Curve')*0.05;
			Game.lumpOverripeAge=Game.lumpRipeAge+hour;
			if (Game.Has('Glucose-charged air')) {Game.lumpMatureAge/=2000;Game.lumpRipeAge/=2000;Game.lumpOverripeAge/=2000;}
		}
    console.log("Script Injected")
}
var script = document.createElement('script');
script.type = "text/javascript";
script.innerHTML = Inject.toString() + "Inject()";
document.body.appendChild(script);
})()
},1000)