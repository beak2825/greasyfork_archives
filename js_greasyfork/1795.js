// ==UserScript==
// @name        Howrse Foal Games
// @namespace   myHowrse
// @description Foal games for Howrse in script form.
// @include     http://*.howrse.com/elevage/chevaux/cheval?id=*
// @author      daexion
// @version     3
// @downloadURL https://update.greasyfork.org/scripts/1795/Howrse%20Foal%20Games.user.js
// @updateURL https://update.greasyfork.org/scripts/1795/Howrse%20Foal%20Games.meta.js
// ==/UserScript==
scipts = document.getElementsByTagName("script");
i=0;
while(scipts[i].text.indexOf("chevalDouche") < 0 && i < scipts.length) ++i;
horseVars = scipts[i].text;
horseVars = horseVars.substring(horseVars.indexOf("chevalDouche"),horseVars.length);
chevalShower = horseVars.substring(horseVars.indexOf("=")+2,horseVars.indexOf(";"));
horseVars = horseVars.substring(horseVars.indexOf("chevalAge"),horseVars.length);
chevalAge = parseInt(horseVars.substring(horseVars.indexOf("=")+2,horseVars.indexOf(";")));
if(chevalAge < 17 && chevalAge > 7)
{
	feedMe = document.getElementById("feeding");
	feedAmount = feedMe.getElementsByClassName("nowrap");
	if(feedAmount[0].textContent == "4.4") feedInstead = "8";
	else if(feedAmount[0].textContent == "6.6") feedInstead = "10";
	else if(feedAmount[0].textContent == "8.8" || feedAmount[0].textContent == "11") feedInstead = "12";
	else feedInstead = "0";
	if(chevalShower == "false")
	{
		if(feedInstead == "0")
		 iHTML = "=-=-=-=-=-=-=-=-=<br>=- Foal Games -=<br>" + chevalAge + " m<br>=-=-=-=-=-=-=-=-=<br>Groom<br>Play 1 hr<br>Turnip<br>Play until not enough to play more<br>Stroke, Carrot, Drink<br>You can make up lost time at 1y 4m.";
		else if(chevalAge == 8) iHTML = "=-=-=-=-=-=-=-=-=<br>=- Foal Games -=<br>8 m<br>=-=-=-=-=-=-=-=-=<br>Drink<br>Box 2 hrs<br>Groom<br>Play .5 hr<br>Feed " + feedInstead + "lbs<br>Play 7.5 hrs<br>Stroke, Carrot, Turnip<br>Play 1 hr<br>";
		else if(chevalAge == 10) iHTML = "=-=-=-=-=-=-=-=-=<br>=- Foal Games -=<br>10m<br>=-=-=-=-=-=-=-=-=<br>Drink<br>Box 1 hr<br>Groom<br>Play .5 hr<br>Feed " + feedInstead + "lbs<br>Play 8 hrs<br>Stroke, Carrot, Turnip<br>Play 1 hr<br>";
		else if(chevalAge == 12) iHTML = "=-=-=-=-=-=-=-=-=<br>=- Foal Games -=<br>1y<br>=-=-=-=-=-=-=-=-=<br>Drink<br>Box 1 hr<br>Groom<br>Play .5 hr<br>Feed " + feedInstead + "lbs<br>Play 9 hrs<br>Stroke, Carrot, Turnip<br>Play 1 hr<br>";
		else if(chevalAge == 14)
		{
			if(feedInstead == "12") iHTML = "=-=-=-=-=-=-=-=-=<br>=- Foal Games -=<br>1y 2m<br>=-=-=-=-=-=-=-=-=<br>Drink, Groom<br>Play .5 hr<br>Feed " + feedInstead + "lbs<br>Play 10 hrs<br>Stroke, Carrot, Turnip<br>Play 1 hr<br>";
			else iHTML = "=-=-=-=-=-=-=-=-=<br>=- Foal Games -=<br>1y 2m<br>=-=-=-=-=-=-=-=-=<br>Drink, Groom<br>Play .5 hr<br>Feed " + feedInstead + "lbs<br>Play 9.5 hrs<br>Stroke, Carrot, Turnip<br>Play 1 hr<br>"
		}
		else if(chevalAge == 16) iHTML = "=-=-=-=-=-=-=-=-=<br>=- Foal Games -=<br>1y 4m<br>=-=-=-=-=-=-=-=-=<br>Drink, Groom<br>Play .5 hr<br>Feed " + feedInstead + "lbs<br>Play 9.5 hrs<br>If the foal has more skills to gain, do that here<br>Stroke<br>Carrot (If stroke doesn't bring the foal up to 20energy)<br>";
		
		newDiv = document.createElement("div");
		trainingBox = document.getElementById("training-head-title");
		trainingBox.innerHTML = iHTML + "=-=-=-=-=-=-=-=-=<br><br>" + trainingBox.innerHTML;
	}
	else
	{
		if(feedInstead == "0")
		 iHTML = "=-=-=-=-=-=-=-=-=<br>=- Foal Games -=<br>" + chevalAge + " m<br>=-=-=-=-=-=-=-=-=<br>Groom<br>Play 1 hr<br>Turnip<br>Play until not enough to play more<br>Stroke, Carrot, Drink<br>You can make up lost time at 1y 4m.";
		else if(chevalAge == 8) iHTML = "=-=-=-=-=-=-=-=-=<br>=- Foal Games -=<br>8 m<br>=-=-=-=-=-=-=-=-=<br>Drink<br>Box 2 hrs<br>Groom<br>Play .5 hr<br>Feed " + feedInstead + "lbs<br>Play 8.5 hrs<br>Stroke, Carrot<br>";
		else if(chevalAge == 10) iHTML = "=-=-=-=-=-=-=-=-=<br>=- Foal Games -=<br>10m<br>=-=-=-=-=-=-=-=-=<br>Groom<br>Play .5 hr<br>Feed " + feedInstead + "lbs<br>Play 9 hrs<br>Stroke, Carrot<br>Drink<br>";
		else if(chevalAge == 12) iHTML = "=-=-=-=-=-=-=-=-=<br>=- Foal Games -=<br>1y<br>=-=-=-=-=-=-=-=-=<br>Groom<br>Play .5 hr<br>Feed " + feedInstead + "lbs<br>Play 9.5 hrs<br>Stroke, Carrot<br>Drink<br>";
		else if(chevalAge == 14)
		{
			iHTML = "=-=-=-=-=-=-=-=-=<br>=- Foal Games -=<br>1y 2m<br>=-=-=-=-=-=-=-=-=<br>Groom<br>Play .5 hr<br>Feed " + feedInstead + "lbs<br>Play 10.5 hrs<br>Stroke, Carrot<br>Drink (if needed)<br>";
		}
		else if(chevalAge == 16) iHTML = "=-=-=-=-=-=-=-=-=<br>=- Foal Games -=<br>1y 4m<br>=-=-=-=-=-=-=-=-=<br>Groom<br>Play .5 hr<br>Feed " + feedInstead + "lbs<br>Play 10 hrs<br>If the foal has more skills to gain, do that here<br>Stroke<br>Carrot (If stroke doesn't bring the foal up to 20energy)<br>";
		
		newDiv = document.createElement("div");
		trainingBox = document.getElementById("training-head-title");
		trainingBox.innerHTML = iHTML + "=-=-=-=-=-=-=-=-=<br><br>" + trainingBox.innerHTML;
	}
}