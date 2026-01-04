  // ==UserScript==
  // @name         A-bot erev2
  // @version      1.25
  // @description  Nice script for erev2
  // @author       Ahi
  // @match        https://www.erev2.com/*
  // @grant        GM_xmlhttpRequest
  // @grant        GM_setValue
  // @grant        GM_getValue
  // @grant        GM_addValueChangeListener
  // @require      http://code.jquery.com/jquery-2.1.0.min.js
  // @require      http://code.jquery.com/jquery-1.11.3.min.js
  // @license MIT
  // @run-at       document-end
  // @namespace    https://greasyfork.org/en/users/7368-dalibor-g
// @downloadURL https://update.greasyfork.org/scripts/468137/A-bot%20erev2.user.js
// @updateURL https://update.greasyfork.org/scripts/468137/A-bot%20erev2.meta.js
  // ==/UserScript==
 
/*
Script is active on erev2 battle page where you type how many hits you wanna do (or press ok then 200 is choosed) and then it's auto selected weapons
regarding which round it is and start fighting. You can manually assist and press energy restore and ADs and scripts keeps fighting. Saving your finger from
pressing million times on fight button. Also you can bellow choose to auto load ADs or load another wep (falcons, mortars, rockets).
- when in battle page asks you to auto fight where you input number of hits, then script auto fights
- when in main page then collects mortars and energy from production page if possible in regular intervals (30 min)
- autofight mode >> automatically cycling through renew energy, collecting rewards every 30 minutes and fighting in battles
*/
 
  (function () {
    'use strict';
 
    // CHANGE YOUR OPTIONS HERE:
    var numberOfShoots = 200; //200 = standard
    var usingADquality = 0; // AD quality (1-5), if no AD to used then set 0
    var hideBattleOverlayLayer = 'true'; // true, false
    var sendingActivityToForm = 'true'; // true, false
    var waitBeforeFight = 2000; //5000 miliseconds = 5sec etc.
    var waitingTimeGeneralMin = 15; // in minutes
    var EnergyMinimalForFighting = 1000;
    var myCountry = 'Japan'; // define your country
    var waitBetweenShoots = 2500; //2000 miliseconds = 2sec
    var constantautofightmode = 'normal'; // autofight, normal
 
    //global vars
    var currentHref = location.href.split("/")[4];
    var welcomeTxt = document.querySelector("#welcometext");
    var waitingTimeGeneral = (waitingTimeGeneralMin*60000);
    var kills = 1;
    var roundNo = 0;
 
    function init() {
      if (currentHref === 'index') {
        document.querySelector('#energyButton').click(); console.log("Recovering energy...");
        let edomDay = document.querySelector("#header-navbar > div > div > div.nav-no-collapse.navbar-left.pull-left.hidden-sm.hidden-xs > ul > li:nth-child(4) > a").innerText;
        let edomTime = document.querySelector("#game-time").innerText; let eDom_datetime = `${edomDay} ${edomTime}`;
        console.log(`${eDom_datetime}`);
        console.log(`Waiting for ${waitingTimeGeneralMin} minutes...`);
        setTimeout(() => {
          location.href="https://www.erev2.com/en/companies";
        }, waitingTimeGeneral); // 1.800.000 milisec = 30 min
      }
      if (currentHref === 'companies') {
        console.log("@companies page")
        setTimeout(() => {
            let Button = document.querySelector("#content-wrapper > div > div > div > div > div.vsPanel-body > div > table > tbody > tr > td.text-center > form > button > div");
            if(Button!=null) {Button.click();} else console.log("Already worked!");
//            location.href = 'https://www.erev2.com/en/training-grounds';
        }, 4000);
      }
      if (currentHref === 'training-grounds') {
        console.log("@training-grounds page")
//        setTimeout(() => {
//            let Button = document.querySelector("#panel-1 > div > table > tbody > tr.vs302 > td:nth-child(5) > button > div");
//            if(Button!=null) {Button.click();} else console.log("Already trained!");
//            location.href = 'https://www.erev2.com/en/wars';
//        }, 4000);
      }
      if (currentHref === 'battlefield') {
        if (constantautofightmode === 'autofight')
        {
            console.log("@battlefield page - Autofight")
            setTimeout(() => {
                fightInBattle_autofight();
            }, waitBeforeFight);
        }
        else {
            console.log("@battlefield page")
            setTimeout(() => {
                fightInBattle();
            }, waitBeforeFight);
        }
      }
      if (currentHref === 'war' && constantautofightmode === 'autofight') {
        console.log("Picking fight in resistance battle - Autofight")
        let button1 = document.querySelector("#content-wrapper > div > div > div > div > div.row.vs150 > div:nth-child(1) > a").innerText;
        let flag1 = document.querySelector("#content-wrapper > div > div > div > div > div.row.vs150 > div:nth-child(1) > a").innerText;
        let href1 = document.querySelector("#content-wrapper > div > div > div > div > div.row.vs150 > div:nth-child(1) > a");
        let button2 = document.querySelector("#content-wrapper > div > div > div > div > div.row.vs150 > div:nth-child(3) > a").innerText;
        let flag2 = document.querySelector("#content-wrapper > div > div > div > div > div.row.vs150 > div:nth-child(3) > a").innerText;
        let href2 = document.querySelector("#content-wrapper > div > div > div > div > div.row.vs150 > div:nth-child(3) > a");
        if (button1.includes("Join Resistance") && flag1.includes(myCountry)) {console.log("1"); location.href=href1;}
        else if (button1.includes(`Fight for ${myCountry}`) && flag1.includes(myCountry)) {console.log("2"); location.href=href1;}
        else if (button2.includes(`Join Resistance`) && flag2.includes(myCountry)) {console.log("3"); location.href=href2;}
        else if (button2.includes(`Fight for ${myCountry}`) && flag2.includes(myCountry)) {console.log("4"); location.href=href2;}
        /*
        let resDiv = document.querySelector(".vs150").children;
        let resBtnHref = resDiv.item(2).href;
        setTimeout(function () {
          location.href = resBtnHref;
        }, 4000);
        */
      }
      if (currentHref === 'wars' && constantautofightmode === 'autofight') {
        setTimeout(() => {
          console.log("Picking up a battle - Autofight")
          pickUpBattle();
        }, 3000);
      }
//*/
    }
 
    function fightInBattle() {
        console.log("@FightInBattle");
        var path = window.location.pathname.split("/")
        var currentBattleAndSide = path[3] + "/" + path[4];
        //console.log(currentBattleAndSide);
        let currentEnergy = document.getElementById("energyBarT").innerText.split("/")[0]; currentEnergy = parseToInt(currentEnergy);
        let maxEnergy = document.getElementById("energyBarT").innerText.split("/")[1]; maxEnergy = parseToInt(maxEnergy);
        let restoreEnergy = document.querySelector("#energyButtonT").innerText; restoreEnergy = parseToInt(restoreEnergy);
        document.querySelector('#energyButton').click(); console.log("Recovered energy...");
        console.log(`Energy: ${currentEnergy}/${maxEnergy} (+${restoreEnergy})`);
 
        //let regionName = document.querySelector("#screenBattle > div.vs900.vs900-0 > div.vs907 > div.vs907-1 > p > a").innerText;
        let totalDMGinBattle = document.querySelector("#loadItems > div > div.vs912-1 > strong").innerText; totalDMGinBattle = totalDMGinBattle.replace(/,/g, "");
 
        if(totalDMGinBattle>=1000000000) {totalDMGinBattle = totalDMGinBattle/1000000000; totalDMGinBattle = totalDMGinBattle.toFixed(2); totalDMGinBattle = `${totalDMGinBattle} B`}
        else if(totalDMGinBattle>=1000000) {totalDMGinBattle = totalDMGinBattle/1000000; totalDMGinBattle = totalDMGinBattle.toFixed(2); totalDMGinBattle = `${totalDMGinBattle} M`}
        else if(totalDMGinBattle>=1000) {totalDMGinBattle = totalDMGinBattle/1000; totalDMGinBattle = totalDMGinBattle.toFixed(2); totalDMGinBattle = `${totalDMGinBattle} k`}
 
        console.log(`My damage in battle: ${totalDMGinBattle}`);
 
        // hide overlay layer when fighting
        if (hideBattleOverlayLayer === 'true') {
            document.querySelector("#battleLog").style.display = 'none';
            document.querySelector("#battleLog").style.visibility = "hidden"; //document.getElementById("myP2").style.visibility = "hidden";
            document.querySelector("#battleBlack").style.visibility = "hidden"; // document.querySelector("#battleBlack").style.display = "none";
        }
 
        let numberHits = prompt("How much hits you want to do?", numberOfShoots);
        //let usingADquality2 = prompt("Do you wanna spend ADs? If yes type quality (1-5)?", "0");
        console.log("Selected number of hits: " +numberHits)
 
        if (currentEnergy < 150) {
            console.log("Energy < 150 => restoring energy...")
            setTimeout(function () {
                //location.href = 'https://edominations.com/en/index';
               document.querySelector('#energyButton').click(); console.log("Recovered energy...");
            }, 1000);
        } else {
            // let possibleKills = Math.trunc(currentEnergy / 100);
            let possibleKills = numberHits; //numberOfShoots
            console.log(`Possible kills: ${possibleKills}`)
            attack(possibleKills);
        }
    }
 
    function attack(possibleKills) {
      if (kills <= possibleKills) {
        console.log(`kills: ${kills}`)
          let currentEnergy = document.getElementById("energyBarT").innerText.split("/")[0]; currentEnergy = parseToInt(currentEnergy);
          let maxEnergy = document.getElementById("energyBarT").innerText.split("/")[1]; maxEnergy = parseToInt(maxEnergy);
          let restoreEnergy = document.querySelector("#energyButtonT").innerText; restoreEnergy = parseToInt(restoreEnergy);
          console.log(`Energy: ${currentEnergy}/${maxEnergy} (+${restoreEnergy})`);
          setTimeout(function () {
              //console.log('kills start')
              document.querySelector("#battleFight").click();
              kills++
              attack(possibleKills);
        }, waitBetweenShoots) // waiting time between hits
          if (currentEnergy < 150) {
              document.querySelector('#energyButton').click(); console.log("Energy < 150 => restoring energy...")
              setTimeout(function () {
              //    location.href = 'https://erev2.com/en/index';
                  document.querySelector('#energyButton').click(); console.log("Recovered energy...");
              }, 1000);
          }
      } else {
        console.log('kills stop => going to index')
        setTimeout(function () {
          document.querySelector('#energyButton').click(); console.log("Recovering energy...");
          //location.href = 'https://erev2.com/en/index';
        }, 2000);
      }
    }
//*
    function pickUpBattle() {
      console.log("Picking up a battle");
      localStorage.clear();
      document.querySelector('#energyButton').click();
      let fightIndex = 1; let counter = 0;
      let myCampText = document.querySelector(".vs151-2").innerText.split(' ')[0];
      if (myCampText === myCountry || myCampText === 'Germany' || myCampText === 'Croatia') {
        console.log(`in ${myCountry} and allies Campaign`)
        let battleDiv = document.querySelector(".vs151-15");
        let numberOfFights = battleDiv.childElementCount / 2;
        console.log(`Number Of Fights: ${numberOfFights}`)
 
        for (let i = fightIndex; i <= numberOfFights * 2; i += 2) {
          let fight = battleDiv.childNodes[i];
          let side1 = fight.querySelector(".vs151-3");
          let side2 = fight.querySelector(".vs151-8");
          let side1__elCount = side1.childElementCount; let sideName1 = side1.querySelector("strong").innerText;
          let side2__elCount = side2.childElementCount; let sideName2 = side2.querySelector("strong").innerText;
          //let regionName = document.querySelector(".vs151-11 > a > span")[counter].innerText;
          let countSum = side1__elCount + side2__elCount;
          //  console.log(side1__elCount+ " + " +side2__elCount);
            console.log(sideName1 + " vs " + sideName2);
          //if (countSum != 7) {
          let fightHref = fight.getElementsByTagName("a")[1].href;
          if(sideName1 === myCountry || sideName2 === myCountry) {localStorage.battleforCountry=fightHref;} // sačuvaj link bitke za svoju zemlju
          else {localStorage.battleforAlly=fightHref;}
          //  console.log("LS battle for country: " +localStorage.battleforCountry); console.log("LS battle for ally: " +localStorage.battleforAlly);
          //} else {
            //console.log("countsum = 7 ... go next fight")
          //}
          counter++;
        }
        //let battleended = document.querySelector("#battleEpic > div.vs918-2");
 
        if (localStorage.battleforCountry && localStorage.battleforCountry!=null) {
            console.log("Battle for country > " +localStorage.battleforCountry);
            window.location = localStorage.battleforCountry;
        }
        else {
            console.log("Battle for ally > " +localStorage.battleforAlly);
            window.location = localStorage.battleforAlly;
        }
      } else {
        console.log("NOT in my alliance battle")
        setTimeout(function () {
          location.href = 'https://erev2.com/en/index';
        }, 2000);
      }
    }
 
    function parseToInt(num) {
      return Number.parseInt(num)
    }
 
    function loggingin() {
      window.onload = () => {
        console.log("in onload login")
        var pwchange = false
        var usrchange = false
        var loginForm = document.querySelector("#login-box-inner > form");
        document.querySelector("*[name=password]").onchange = () => {
          if (usrchange) {
            console.log("Logging in...")
            setTimeout(() => {
              loginForm.submit();
            }, 2000);
          } else {
            pwchange = true
          }
        };
        document.querySelector("*[name=email]").onchange = () => {
          if (pwchange) {
            console.log("Logging in...")
            setTimeout(() => {
              loginForm.submit();
            }, 2000);
          } else {
            usrchange = true
          }
        };
      }
    }
 
    function fightInBattle_autofight() {
        console.log("@Fight in battle - autofight");
        var currentPage = location.href;
        localStorage[currentPage] = JSON.stringify(currentPage); // save to local storage
        var path = window.location.pathname.split("/")
        var currentBattleAndSide = path[3] + "/" + path[4];
 
        let battleFinished = document.querySelector("#battleEpic > div.vs918.vs918-3 > div");
        if (battleFinished != null && battleFinished.includes("won the battle")) {
            console.log("Battle is finished - go to index");
            setTimeout(function () {
            //    location.href = 'https://erev2.com/en/index';
            }, 2000);
        }
 
        console.log("autofight round " +roundNo);
        //console.log(currentBattleAndSide);
        console.log(`Start fighting...}`);
        let currentEnergy = document.getElementById("energyBarT").innerText.split("/")[0]; currentEnergy = parseToInt(currentEnergy);
        let maxEnergy = document.getElementById("energyBarT").innerText.split("/")[1]; maxEnergy = parseToInt(maxEnergy);
        let restoreEnergy = document.querySelector("#energyButtonT").innerText; restoreEnergy = parseToInt(restoreEnergy);
        console.log(`Energy: ${currentEnergy}/${maxEnergy} (+${restoreEnergy})`);
 
        let regionName = document.querySelector("#screenBattle > div.vs900.vs900-0 > div.vs907 > div.vs907-1 > p > a").innerText;
        let totalDMGinBattle = document.querySelector("#loadItems > div > div.vs912-1 > strong").innerText; totalDMGinBattle = totalDMGinBattle.replace(/,/g, "");
 
        if(totalDMGinBattle>=1000000000) {totalDMGinBattle = totalDMGinBattle/1000000000; totalDMGinBattle = totalDMGinBattle.toFixed(2); totalDMGinBattle = `${totalDMGinBattle} B`}
        else if(totalDMGinBattle>=1000000) {totalDMGinBattle = totalDMGinBattle/1000000; totalDMGinBattle = totalDMGinBattle.toFixed(2); totalDMGinBattle = `${totalDMGinBattle} M`}
        else if(totalDMGinBattle>=1000) {totalDMGinBattle = totalDMGinBattle/1000; totalDMGinBattle = totalDMGinBattle.toFixed(2); totalDMGinBattle = `${totalDMGinBattle} k`}
 
        console.log(`My damage in battle for ${regionName}: ${totalDMGinBattle}`);
 
        // hide overlay layer when fighting
        if (hideBattleOverlayLayer === 'true') {
            document.querySelector("#battleLog").style.display = 'none';
            document.querySelector("#battleLog").style.visibility = "hidden"; //document.getElementById("myP2").style.visibility = "hidden";
            document.querySelector("#battleBlack").style.visibility = "hidden"; // document.querySelector("#battleBlack").style.display = "none";
        }
        //alert("FIGHT NOW IN ROUND " +roundNo +" !");
        let numberHits = 50;
        //let usingADquality2 = prompt("Do you wanna spend ADs? If yes type quality (1-5)?", "0");
        console.log("Selected number of hits: " +numberHits)
 
        if (currentEnergy < 150) {
            document.querySelector('#energyButton').click(); console.log("Recovering energy...");
            setTimeout(function () {
                location.href = 'https://erev2.com/en/index';
                document.querySelector('#energyButton').click(); console.log("Recovering energy...");
            }, 1000);
        } else {
            // let possibleKills = Math.trunc(currentEnergy / 100);
            let possibleKills = numberHits; //numberOfShoots
            console.log(`Possible kills: ${possibleKills}`)
            attack(possibleKills);
        }
        var battlePage = JSON.parse(localStorage[currentPage]); // retreive from local storage
        console.log("Url from local storage: " +battlePage);
    }
 
 
    function formatNo(number) {
      if(number>=1000000000) {number = number/1000000000; number = number.toFixed(2); number = `${number} B`}
      else if(number>=1000000) {number = number/1000000; number = number.toFixed(2); number = `${number} M`}
      else if(number>=1000) {number = number/1000; number = number.toFixed(2); number = `${number} k`}
    }

      // VISUAL STUFF
      var agencynotfound =
          "<div id='hydra'>"+
          //"<h2>All hail HYDRA!</h2>" +
          " - <a href='https://www.erev2.com/en/newspaper/1239'>Ahi news</a>"+
          " - <a href='https://www.erev2.com/en/inventory'>Storage</a>"+
          " - <a href='https://www.erev2.com/en/strategic-buildings'>Strategic</a>"+
          " - <a href='https://create.piktochart.com/teams/23710781/dashboard'>Piktochart</a>"+
          " - <a href='https://imgur.com/upload'>Imgur</a>"+
          " - <a href='https://pastebin.com/psgKyM4z'>Pastebin</a><br/>"+
          " - <a href='https://www.erev2.com/en/country/region/26/Germany/161/Schleswig-Holstein'>DE region</a>"+
          " - <a href='https://www.erev2.com/en/country/region/36/Japan/236/Kansai'>JPN region</a>"+
          "</div><br/>";

      // umetni samo na početnu stranicu
      if(location.toString().match(/^https:\/\/www\.erev2\.com\/(?:$|\w{2}\/index)/)) {
          $(agencynotfound).insertBefore(".vs173:last");
      };

      // umetni storage u lijevi menu
	  var leftmenu_addition =
          "<li><a href='https://www.erev2.com/en/inventory'><i class='fa'></i><span>Storage</span></a></li>"+
          "<li><a href='https://www.erev2.com/en/strategic-buildings'><i class='fa'></i><span>Strategic buildings</span></a></li>";
      $(leftmenu_addition).insertAfter('li.active:first');

      // collect pirate ship prize
      if(location.toString().match(/^https:\/\/www\.erev2\.com\/(?:$|\w{2}\/index)/)) {
        document.querySelector('.vs167').click();
        document.querySelector('#ePiratesI').click();
        //document.querySelector('#ePiratesI > span').click();
      console.log("Checking pirate prize...");
      };
/*
      // Add icons at top
      var topmenu_storage =
          "<a class='topMenuButtonClass btn btn-l' href='https://www.edominations.com/en/inventory'>"+
          "<span id='inventory' class='fa fa-shopping-cart-o' title='Storage'>In</span>"+
          "</a>";
      $(topmenu_storage).insertAfter('a.topMenuButtonClass:last');
      var topmenu_market =
          "<a class='topMenuButtonClass btn btn-l' href='https://www.edominations.com/en/market/30/5/0/1'>"+
          "<span id='market' class='fa fa-shopping-cart-o' title='Market'>M</span>"+
          "</a>";
      $(topmenu_market).insertAfter('a.topMenuButtonClass:last');
*/
      // Expand My buildings
      //$('a.dropdown-toggle').trigger('click');
    init();
    //login();
 
  })();