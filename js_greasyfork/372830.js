// ==UserScript==
// @name         Revolution General
// @namespace    http://revolutionmmo.com/
// @version      1.5
// @description  Revolution
// @author       Unknown
// @match        http://revolutionmmo.com/*
// @match        https://revolutionmmo.com/*
// @match        http://google.com/*
// @match        https://google.com/*
// @grant        none
// @include      *
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/372830/Revolution%20General.user.js
// @updateURL https://update.greasyfork.org/scripts/372830/Revolution%20General.meta.js
// ==/UserScript==

var urlBase = "https://revolutionmmo.com/";

function login() {
  $("input[value='Login']").click();
}
function macro() {
  $("input[name='captcha']").val(Math.floor(Math.random() * 10));
  $("form[action='macro2.php']").submit();
}
function streets(returnPage) {
  if($("body").text().indexOf("Sorry, you are too exhausted. Come back when you've had a rest.") > -1) {
    window.location.href = urlBase + returnPage;
  }
  else {
		window.location.href = urlBase + "streets.php?act=search";
	}
}
function skillPoints(skillPointOption, returnPage) {
  if($("body").text().indexOf("You have 0 skill points to use.") > -1 || $("body").text().indexOf("You traded 1 skill point for") > -1) {
		window.location.href = urlBase + returnPage;
	}
	else {
		if (skillPointOption == "energy") {
			$("input[value='2 Extra Energy']").parent().submit();
		}
		else if (skillPointOption == "action point") {
			$("input[value='1 Extra Action Point']").parent().submit();
		}
  }
}
function hourly(returnPage) {
  console.log("hourly");
  if($("body").text().indexOf("You have earned") > -1 || $("body").text().indexOf("You must wait") > -1) {
		window.location.href = urlBase + returnPage;
	}
	else {
    console.log("hourly claim");
		$("input[value='Claim Your Reward']").click();
	}
}
function lucky(returnPage) {
  if($("body").text().indexOf("Come back tomorrow") > -1) {
    window.location.href = urlBase + returnPage;
  }
  else {
    window.location.href = urlBase + "lucky.php?open=1";
  }
}
function vote(returnPage) {
  if (window.location.href.indexOf("name") < 0 && $("a[href*='vote.php?name']").length == 0) {
    window.location.href = urlBase + returnPage;
  }
  else {
    if (window.location.href.indexOf("name=BBOGD") > -1){
		window.location.href = urlBase + "vote.php?name=gtop100";
	}
  else if (window.location.href.indexOf("name=gtop100") > -1){
		window.location.href = urlBase + "vote.php?name=MMORPG 100";
	}
  else if (window.location.href.indexOf("name=MMORPG") > -1 && window.location.href.indexOf("MMORPG100") < 0 && window.location.href.indexOf("MMORPG50") < 0){
		window.location.href = urlBase + "vote.php?name=MMORPG100";
	}
	else if (window.location.href.indexOf("name=MMORPG100") > -1){
		window.location.href = urlBase + "vote.php?name=MMORPG50";
	}
	else if (window.location.href.indexOf("name=MMORPG50") > -1){
  	window.location.href = urlBase + "vote.php?name=mmTop 200";
  }
  else if (window.location.href.indexOf("200") > -1){
  	window.location.href = urlBase + "vote.php?name=MPOGTop";
  }
  else if (window.location.href.indexOf("name=MPOGTop") > -1){
  	window.location.href = urlBase + "vote.php?name=Top 100 Arena";
  }
  else if (window.location.href.indexOf("Arena") > -1){
    window.location.href = urlBase + "vote.php?name=Top Web Games";
  }
  else if (window.location.href.indexOf("Web") > -1){
  	window.location.href = urlBase + "vote.php?name=Top500";
  }
  else if (window.location.href.indexOf("name=Top500") > -1){
    window.location.href = urlBase + "vote.php?name=TopG";
  }
  else if (window.location.href.indexOf("name=TopG") > -1 && window.location.href.indexOf("TopGameSites") < 0){
    window.location.href = urlBase + "vote.php?name=TopGameSites";
  }
  else if (window.location.href.indexOf("name=TopGameSites") > -1){
    window.location.href = urlBase + "vote.php?name=TopOnline";
  }
  else if (window.location.href.indexOf("name=TopOnline") > -1){
    window.location.href = urlBase + returnPage;
  }
  else {
   	window.location.href = urlBase + "vote.php?name=BBOGD";
  }
  }
}
function gym(energyPerc, gymStat, returnPage) {
  if(energyPerc < 1) {
		window.location.href = urlBase + returnPage;
  }
	else {
		if (gymStat == "strength") {
			$("form[action='gym.php']").first().submit();
		}
		else if (gymStat == "agility") {
			$("form[action='gym.php']").eq(1).submit();
		}
		else if (gymStat == "defense") {
			$("form[action='gym.php']").last().submit();
		}
	}
}
function crime(actionPoints, crimeActionPoints, crimeId, saveActionPoints, returnPage) {
  if(actionPoints < crimeActionPoints || actionPoints <= saveActionPoints) {
		window.location.href = urlBase + returnPage;
 	}
  else {
   	window.location.href = urlBase + "docrime.php?c=" + crimeId;
	}
}
function coinexchange(returnPage) {
  window.location.href = urlBase + returnPage;
}
function jail(actionPoints, returnPage) {
  var busts = $("a[href*='jailbust']");
  var bustUrl = busts.first().attr("href");
  if (busts.length > 0 && actionPoints >= 10) {
    window.location.href = urlBase + bustUrl;
  }
  else {
    window.location.href = urlBase + returnPage;
  }
}
function jailbust(returnPage) {
  window.location.href = urlBase + returnPage;
}
function shouldAfk() {
  var hour = new Date().getHours();
  var minute = new Date().getMinutes();
  if (minute >= 30) {
    hour += 0.5;
  }
  var afks = [16.5, 17.5, 18, 19, 20, 20.5, 21.5, 22, 22.5, 23, 1, 1.5, 2.5, 3.5, 5, 6];
  return (hour >= 7 && hour <= 15) || afks.includes(hour);
}
function google(returnPage) {
  if (shouldAfk()) {
    window.location.href = "https://google.com";
  }
  else {
    window.location.href = urlBase + returnPage;
  }
}



// window.onload = function () {
$(document).ready(function() {
  console.log("Loaded");
  
  var returnPage = "index.php";
  var randomTime = Math.floor(Math.random() * 2500) + 2500;
  
  if (window.location.href.indexOf("login.php") > -1){
    console.log("login");
    setTimeout(function(){
        login();
      }, randomTime * 2);
  }
  else if(window.location.href.indexOf("google.com") > -1){
      setTimeout(function(){
        google(returnPage);
      }, randomTime * 5);
    }
  else {
  var skillPointOption = "action point";
  
  var gymStat = "defense";
  var gymMinEnergyPerc = 50;

  var crimeMinActionPointsPerc = 50;
  // 40 - 5 - Robbery Skill
  // 44 - 5 - Assassination Skill
  // 43 - 5 - Arson Skill
  // 42 - 5 - Theft Skill
  // 41 - 5 - Hacking Skill
  // 59 - 23 - Steal from a House
  var crimeId = 59;
  var crimeActionPoints = 23;
    var saveActionPoints = 0;
    
    // var bankMinMoney = 250000;

    var money = $("span:contains('Money')").parent().children("font").text().replace(/[^0-9.-]+/g, "");
  var barsText = $(".energypart").clone().children().remove().end().text();
  var barsArray = barsText.match(/[^\r\n]+/g);
  var energyPerc = parseInt(barsArray[0].trim());
  var willPerc = parseInt(barsArray[1].trim());
  var actionPoints = parseInt(barsArray[2].trim().split("/")[0]);
  var actionPointsPerc = 100 * actionPoints / parseInt(barsArray[2].trim().split("/")[1]);
  var experiencePerc = parseInt(barsArray[3].trim());
  console.log("Money: " + money + ", energy perc: " + energyPerc + ", will: " + willPerc + ", action points: " + actionPoints + ", experience perc: " + experiencePerc);

    var hour = new Date().getHours();
    var minute = new Date().getMinutes();
    console.log("Hour is " + hour + ", minute is " + minute);
    
    
    
    if(window.location.href.indexOf("macro1.php") > -1){
      setTimeout(function(){
        macro();
      }, randomTime);
    }
    else if(window.location.href.indexOf("streets.php") > -1){
      setTimeout(function(){
        streets(returnPage);
      }, randomTime);
    }
    /*else if(window.location.href.indexOf("skillpoints.php") > -1){
      setTimeout(function(){
        skillPoints(skillPointOption);
      }, randomTime);
    }*/
    else if(window.location.href.indexOf("hourly.php") > -1){
      setTimeout(function(){
        hourly(returnPage);
      }, randomTime);
    }
  else if(window.location.href.indexOf("lucky.php") > -1){
      setTimeout(function(){
        lucky(returnPage);
      }, randomTime);
    }
    else if(window.location.href.indexOf("vote.php") > -1){
      setTimeout(function(){
        vote(returnPage);
      }, randomTime * 0.5);
    }
    else if(window.location.href.indexOf("coinexchange.php") > -1){
      setTimeout(function(){
        coinexchange(returnPage);
      }, randomTime);
    }
    else if(window.location.href.indexOf("gym.php") > -1){
      setTimeout(function(){
        gym(energyPerc, gymStat, returnPage);
      }, randomTime);
    }
    else if(window.location.href.indexOf("docrime.php") > -1){
      setTimeout(function(){
        crime(actionPoints, crimeActionPoints, crimeId, saveActionPoints, returnPage);
      }, randomTime);
    }
    else if(window.location.href.indexOf("jail.php") > -1){
      setTimeout(function(){
        jail(actionPoints, returnPage);
      }, randomTime);
    }
    else if(window.location.href.indexOf("jailbust.php") > -1){
      setTimeout(function(){
        jailbust("jail.php");
      }, randomTime);
    }
    else if(window.location.href.indexOf(returnPage) > -1){
      setTimeout(function(){
        // var skillPoints = $("b:contains('Skill Points:')").first().text().split(":")[1].split("[")[0].trim();
        
        var busts = $("a[href='jail.php']").first().children("span").text();
        busts = busts.substring(2, busts.length - 2);
        
        /*if(skillPoints >= 1) {
          window.location.href = urlBase + "skillpoints.php";
        }*/
        /*if($("a[href='hourly.php']").length >= 1) {
          window.location.href = urlBase + "hourly.php";
        }*/
        if(energyPerc >= gymMinEnergyPerc) {
          window.location.href = urlBase + "gym.php";
        }
        else if(energyPerc == 0 && willPerc >= 90) {
          window.location.href = urlBase + "coinexchange.php?spend=refill";
      	}
        else if(busts >= 1) {
          window.location.href = urlBase + "jail.php";
        }
        // else if(actionPoints >= crimeActionPoints && actionPointsPerc >= crimeMinActionPointsPerc) {
        else if(actionPoints >= crimeActionPoints) {
          window.location.href = urlBase + "docrime.php?c=" + crimeId;
        }
        else if(actionPoints < 10) {
          window.location.href = urlBase + "coinexchange.php?spend=apr";
        }
        else {
          if (shouldAfk()) {
            window.location.href = "https://google.com";
          }
          else {
            var rand = Math.floor(Math.random() * 10) + 1;
            if (rand == 1) {
              window.location.href = urlBase + "vote.php";
            }
            else if (rand == 2) {
              window.location.href = urlBase + "streets.php";
            }
            else {
              window.location.href = urlBase + returnPage;
            }
          }
        }
      }, randomTime * 2);
    }
  }
});

/*if (mode == "train") {
    var returnPage = "index.php";
    var willMaxRefillPerc = 90;
    
    if(window.location.href.indexOf("macro1.php") > -1){
      setTimeout(function(){
        macro();
      }, randomTime);
    }
    else if(window.location.href.indexOf("coinexchange.php") > -1){
      setTimeout(function(){
        coinexchange(returnPage);
      }, randomTime);
    }
    else if(window.location.href.indexOf("gym.php") > -1){
      setTimeout(function(){
        gym(energyPerc, gymStat, returnPage);
      }, randomTime);
    }
    else if(window.location.href.indexOf("docrime.php") > -1){
      setTimeout(function(){
        crime(actionPoints, crimeActionPoints, crimeId, returnPage);
      }, randomTime);
    }
    else if(window.location.href.indexOf(returnPage) > -1){
      setTimeout(function(){
        if(actionPointsPerc == 100) {
          window.location.href = urlBase + "docrime.php?c=" + crimeId;
        }
        else if(willPerc <= willMaxRefillPerc) {
          window.location.href = urlBase + "coinexchange.php?spend=awake";
        }
        else if(energyPerc > 0) {
          window.location.href = urlBase + "gym.php";
        }
        else {
          window.location.href = urlBase + "coinexchange.php?spend=refill";
        }
      }, randomTime);
    }
  }
  
  
  
  else if (mode == "bust") {
    var returnPage = "jail.php";
    if(window.location.href.indexOf("macro1.php") > -1){
      setTimeout(function(){
        macro();
      }, randomTime);
    }
    else if(window.location.href.indexOf("gym.php") > -1){
      setTimeout(function(){
        gym(energyPerc, gymStat, returnPage);
      }, randomTime);
    }
    else if(window.location.href.indexOf("jailbust.php") > -1){
      setTimeout(function(){
        jailbust(returnPage);
      }, randomTime);
    }
    else if(window.location.href.indexOf(returnPage) > -1){
      setTimeout(function(){
        var busts = $("a[href*='jailbust']");
        var bustUrl = busts.first().attr("href");
        if(energyPerc == 100) {
          window.location.href = urlBase + "gym.php";
        }
        else if (busts.length > 0 && actionPoints >= 10) {
          window.location.href = urlBase + bustUrl;
        }
        else {
          window.location.href = urlBase + returnPage;
        }
      }, randomTime * 3);
    }
  }
  
  
  
  else if (mode == "attack") {
    var returnPage = "attacklist.php";
    if(window.location.href.indexOf("macro1.php") > -1){
      setTimeout(function(){
        macro();
      }, randomTime);
    }
    else if(window.location.href.indexOf("jailbust.php") > -1){
      setTimeout(function(){
        jailbust(returnPage);
      }, randomTime);
    }
    else if(window.location.href.indexOf("docrime.php") > -1){
      setTimeout(function(){
        crime(actionPoints, crimeActionPoints, crimeId, returnPage);
      }, randomTime);
    }
    else if(window.location.href.indexOf(returnPage) > -1){
      setTimeout(function(){
        var attacks = $("div.generalinfo_simple").find("table").find("tbody");
        var attackUrl = "";
        attacks.children().each(function() {
          
        });
        if(actionPointsPerc == 100) {
          window.location.href = urlBase + "docrime.php?c=" + crimeId;
        }
        else if (busts.length > 0 && actionPoints >= 10) {
          window.location.href = urlBase + attackUrl;
        }
        else {
          window.location.href = urlBase + returnPage;
        }
      }, randomTime * 3);
    }
  }*/