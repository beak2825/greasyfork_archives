  // ==UserScript==
  // @name         A-bot
  // @version      2.04
  // @description  Nice script for edomi
  // @author       Ahi
  // @match        https://www.edominations.com/*
  // @grant        GM_xmlhttpRequest
  // @grant        GM_setValue
  // @grant        GM_getValue
  // @grant        GM_addValueChangeListener
  // @require      http://code.jquery.com/jquery-2.1.0.min.js
  // @require      http://code.jquery.com/jquery-1.11.3.min.js
  // @run-at       document-end
  // @namespace    https://greasyfork.org/en/users/7368-dalibor-g
// @downloadURL https://update.greasyfork.org/scripts/432616/A-bot.user.js
// @updateURL https://update.greasyfork.org/scripts/432616/A-bot.meta.js
  // ==/UserScript==

/*
Script is active on edominations battle page where you type how many hits you wanna do (or press ok then 200 is choosed) and then it's auto selected weapons
regarding which round it is and start fighting. You can manualy assist and press energy restore and ADs and scripts keeps fighting. Saving your finger from
pressing milion times on fight button. Also you can bellow choose to auto load ADs or load another wep (falcons, mortars, rockets).
- when in battle page asks you to auto fight where you input number of hits, then script auto fights
- when in main page then collects mortars and energy from production page if possible in regular intervals (30 min)
- autofight mode >> automaticaly cycling through renew energy, collecting rewards every 30 minutes and fighting in battles
*/

  (function () {
    'use strict';

    // CHANGE YOUR OPTIONS HERE:
    var numberOfShoots = 200; //200 = standard
    var usingADquality = 0; // AD quality (1-5), if no AD to used then set 0
    var hideBattleOverlayLayer = 'true'; // true, false
    var sendingActivityToForm = 'true'; // true, false
    var waitBeforeFight = 2000; //5000 miliseconds = 5sec etc.
    var waitingTimeGeneralMin = 43; // in minutes
    var EnergyMinimalForFighting = 1000;
    var myCountry = 'Germany'; // define your country
    var waitBetweenShoots = 2500; //2000 miliseconds = 2sec
    var wepType = 'auto'; // auto, falcon, mortar, rocket
    var constantautofightmode = 'autofight'; // autofight, normal

    //global vars
    var currentHref = location.href.split("/")[4];
    var welcomeTxt = document.querySelector("#welcometext");
    var waitingTimeGeneral = (waitingTimeGeneralMin*60000);
    var kills = 1;
    var roundNo = 0;

    function init() {
      if (currentHref === 'index') {
        if(sendingActivityToForm==='true') {getProfile();}
        document.querySelector('#energyButton').click(); console.log("Recovering energy...");
        let edomDay = document.querySelector("#vs219-1").innerText; let edomTime = document.querySelector("#game-time").innerText; let eDom_datetime = `${edomDay} ${edomTime}`;
        console.log(`${eDom_datetime}`);
        console.log(`Waiting for ${waitingTimeGeneralMin} minutes...`);
        setTimeout(() => {
          // try to collect AC rewards+
          document.querySelector("#loadWeeklyEvents").click(); console.log("Opened AC window");
          let btn1 = document.querySelector("#eOpen1");
          let btn2 = document.querySelector("#eOpen2");
          let btn3 = document.querySelector("#eOpen3");
          let btn4 = document.querySelector("#eOpen");
          if (btn1 != null) {btn1.click(); console.log("Collected AC #1");}
          else if (btn2 != null) {btn2.click(); console.log("Collected AC #2");}
          else if (btn3 != null) {btn3.click(); console.log("Collected AC #3");}
          else if (btn4 != null) {btn4.click(); console.log("Collected AC #main");}
          else {document.querySelector("#exampleModal_Events > div > div > div > div.evs005").click(); console.log("Close AC window");}
          location.href="https://www.edominations.com/en/productions";
        }, waitingTimeGeneral); // 1.800.000 milisec = 30 min
      }
      if (currentHref === 'companies') {
        console.log("@companies page")
        let dailyRountine = prompt("Do you wanna start daily routine?", "YES");
        if (dailyRountine === "YES") {
          console.log("Daily routine started!");
          setTimeout(() => {
              let workButton = document.querySelector("#workTable > table > tbody > tr > td:nth-child(6) > form > button");
              if (workButton) {
                  if (workButton.innerText.includes("WORK")) {workButton.click(); console.log("Worked!")}
                  else if (workButton.innerText.includes("REST")) {workButton.click(); console.log("Rested!")}
                  else {console.log("Already worked! "+workButton); location.href = 'https://edominations.com/en/training-grounds';}
              }
              else {console.log("NO BUTTON!"); location.href = 'https://edominations.com/en/training-grounds';}
        }, 2000);
      }}
      if (currentHref === 'training-grounds') {
        console.log("@training-grounds page")
          setTimeout(() => {
              let trainButton = document.querySelector("#train_button > form > button");
              if (trainButton) {
                  if (trainButton.innerText.includes("WORKOUT")) {trainButton.click(); console.log("Trained!")}
                  else {console.log("Already trained! "+trainButton); location.href = 'https://edominations.com/en/ability';}
              }
              else {console.log("NO BUTTON!"); location.href = 'https://edominations.com/en/ability';}
        }, 2000);
      }
      if (currentHref === 'ability') {
        console.log("@ability page")
          setTimeout(() => {
              let abilityButton = document.querySelector("#panel-1 > div > table > tbody > tr > td:nth-child(6) > form > button");
              if (abilityButton) {
                  if (abilityButton.innerText.includes("EDUCATE")) {abilityButton.click(); console.log("Educated!")}
                  else {console.log("Already done! "+abilityButton); location.href = 'https://edominations.com/en/strategic-buildings';}
              }
              else {console.log("NO BUTTON!"); location.href = 'https://edominations.com/en/strategic-buildings';}
        }, 2000);
      }
      if (currentHref === 'strategic-buildings') {
        console.log("@strategic-buildings page")
          setTimeout(() => {
              let strategicButton = document.querySelector("#panel-1 > div > table > tbody > tr > td.text-center > form > button");
              if (strategicButton) {
                  if (strategicButton.innerText.includes("BUILD")) {strategicButton.click(); console.log("Strategic done!")}
                  else {console.log("Already done! "+strategicButton); location.href = 'https://edominations.com/en/index';}
              }
              else {console.log("NO BUTTON!"); location.href = 'https://edominations.com/en/index';}
        }, 2000);
      }
      if (currentHref === 'country') {
        console.log("@country page")
      }
      if (currentHref === 'productions') {
        console.log("@productions page")
        setTimeout(() => {
          console.log("Checking rewards...");
          checkRewards();
        }, 5000);
      }
      if (currentHref === 'profile') {
        setTimeout(() => {
          console.log("@profile page");
        }, 1000);
      }
      if (currentHref === 'special-items') {
        console.log("@special-items page")
      }
      if (currentHref === 'battlefield') {
        if (constantautofightmode === 'autofight')
        {
            console.log("@battlefield page - Autofight")
            setTimeout(() => {
                selectingWeapons();
                fightInBattle_autofight();
            }, waitBeforeFight);
        }
        else {
            console.log("@battlefield page")
            setTimeout(() => {
                selectingWeapons();
                fightInBattle();
            }, waitBeforeFight);
        }
      }
      if (currentHref === 'war' && constantautofightmode === 'autofight') {
        console.log("Picking fight in resistance battle - Autofight")
        let button1 = document.querySelector("#container-content > div > div > div > div > div.panel-body.vs502.panel-full > div.vs150.text-center > div:nth-child(2) > div > div > a:nth-child(3) > div").innerText;
        let flag1 = document.querySelector("#container-content > div > div > div > div > div.panel-body.vs502.panel-full > div.vs150.text-center > div:nth-child(2) > div > div > div > div:nth-child(2)").innerText;
        let href1 = document.querySelector("#container-content > div > div > div > div > div.panel-body.vs502.panel-full > div.vs150.text-center > div:nth-child(2) > div > div > a:nth-child(3)");
        let button2 = document.querySelector("#container-content > div > div > div > div > div.panel-body.vs502.panel-full > div.vs150.text-center > div:nth-child(3) > div > div > a:nth-child(3) > div").innerText;
        let flag2 = document.querySelector("#container-content > div > div > div > div > div.panel-body.vs502.panel-full > div.vs150.text-center > div:nth-child(3) > div > div > div > div:nth-child(2)").innerText;
        let href2 = document.querySelector("#container-content > div > div > div > div > div.panel-body.vs502.panel-full > div.vs150.text-center > div:nth-child(3) > div > div > a:nth-child(3)");
        if (button1.includes("Join Resistance") && flag1.includes(myCountry)) {console.log("1"); location.href=href1;}
        else if (button1.includes(`Fight for ${myCountry}`) && flag1.includes(myCountry)) {console.log("2"); location.href=href1;}
        else if (button2.includes(`Join Resistance`) && flag2.includes(myCountry)) {console.log("3"); location.href=href2;}
        else if (button2.includes(`Fight for ${myCountry}`) && flag2.includes(myCountry)) {console.log("4"); location.href=href2;}
      }
      if (currentHref === 'wars' && constantautofightmode === 'autofight') {
        setTimeout(() => {
          console.log("Picking up a battle - Autofight")
          pickUpBattle();
        }, 3000);
      }
    }

    function fightInBattle() {
        console.log("@FightInBattle");
        let roundNoRaw = document.querySelector("#battleEpic > div.vs901-4").innerText;
        if (roundNoRaw.includes("URBAN COMBAT")) {roundNo = 1}
        else if (roundNoRaw.includes("LAND COMBAT")) {roundNo = 2}
        else if (roundNoRaw.includes("AIR COMBAT")) {roundNo = 3}
        else (roundNo = 3);
        var path = window.location.pathname.split("/")
        var currentBattleAndSide = path[3] + "/" + path[4];
        //console.log(currentBattleAndSide);
        let wepTypeName = 0;
        if(wepType==='auto') {
            if(roundNo===1) {wepTypeName = "guns q5";}
            if(roundNo===2) {wepTypeName = "tanks q5";}
            if(roundNo===3) {wepTypeName = "airs q5";}
        } else {wepTypeName = wepType;}
        console.log(`Start fighting in round ${roundNo} with ${wepTypeName} and AD ${usingADquality}`);
        let currentEnergy = document.getElementById("energyBarT").innerText.split("/")[0]; currentEnergy = parseToInt(currentEnergy);
        let maxEnergy = document.getElementById("energyBarT").innerText.split("/")[1]; maxEnergy = parseToInt(maxEnergy);
        let restoreEnergy = document.querySelector("#energyButtonT").innerText; restoreEnergy = parseToInt(restoreEnergy);
        document.querySelector('#energyButton').click(); console.log("Recovered energy...");
        console.log(`Energy: ${currentEnergy}/${maxEnergy} (+${restoreEnergy})`);

        let regionName = document.querySelector("#battleEpic > div.vs907 > div.vs907-1 > p > a").innerText;
        let totalDMGinBattle = document.querySelector("#loadItems > div > div.vs912-1 > strong").innerText.replace(/,/g, "");
        if(totalDMGinBattle>=1000000000) {totalDMGinBattle = totalDMGinBattle/1000000000; totalDMGinBattle = totalDMGinBattle.toFixed(2); totalDMGinBattle = `${totalDMGinBattle} B`}
        else if(totalDMGinBattle>=1000000) {totalDMGinBattle = totalDMGinBattle/1000000; totalDMGinBattle = totalDMGinBattle.toFixed(2); totalDMGinBattle = `${totalDMGinBattle} M`}
        else if(totalDMGinBattle>=1000) {totalDMGinBattle = totalDMGinBattle/1000; totalDMGinBattle = totalDMGinBattle.toFixed(2); totalDMGinBattle = `${totalDMGinBattle} k`}

        console.log(`My damage in battle for ${regionName}: ${totalDMGinBattle}`);
        selectingWeapons();

         // show damage difference
      var differenceDamage = `<br/><br/><br/><br/><br/><br/><span id="dmgdif" style="color:red; font:normal 17px Tahoma; opacity: inherit" class="odometer odometer-auto-theme"></span>`;
      $(differenceDamage).insertAfter("#odohitcounter");
      let battleID = document.querySelector("#captchingit").action.replace("https://www.edominations.com/en/battlefield/","").replace("/1", "").replace("/2", "");
      setInterval(() => {
          let Time = document.querySelector(`#countdown-${battleID} > span`).innerText;
          var a = Time.split(':'); let Minutes = (+a[0]) * 60 + (+a[1]);
          let LeftSideDmg = document.querySelector("#valatttotal").innerText.replace(/,/g, "");
          let RightSideDmg = document.querySelector("#valdefftotal").innerText.replace(/,/g, "");
          let TotalDmgAbs = Math.abs(LeftSideDmg-RightSideDmg); let TotalDmg = (LeftSideDmg-RightSideDmg);
          if(TotalDmgAbs>=1000000000) {TotalDmg = TotalDmg/1000000000; TotalDmg = TotalDmg.toFixed(2); TotalDmg = `${TotalDmg} B`}
          else if(TotalDmgAbs>=1000000) {TotalDmg = TotalDmg/1000000; TotalDmg = TotalDmg.toFixed(2); TotalDmg = `${TotalDmg} M`}
          else if(TotalDmgAbs>=1000) {TotalDmg = TotalDmg/1000; TotalDmg = TotalDmg.toFixed(2); TotalDmg = `${TotalDmg} k`}
          console.log(Time + ": " +TotalDmg);
          //var differenceDamage = `<br/><br/><br/><br/><br/><br/><span id="dmgdif" style="opacity: inherit" class="odometer odometer-auto-theme">${TotalDmg}</span>`;
          document.querySelector("#dmgdif").innerHTML = `${TotalDmg} [<span style="font-size:12px;">T-${Minutes}</span>]`;
      }, 5000);

        // hide overlay layer when fighting
        if (hideBattleOverlayLayer === 'true') {
            document.querySelector("#battleLog").style.display = 'none';
            document.querySelector("#battleLog").style.visibility = "hidden"; //document.getElementById("myP2").style.visibility = "hidden";
            document.querySelector("#battleBlack").style.visibility = "hidden"; // document.querySelector("#battleBlack").style.display = "none";
        }

        //alert("FIGHT NOW IN ROUND " +roundNo +" !");
        let numberHits = prompt("How much hits you want to do?", numberOfShoots);
        //let usingADquality2 = prompt("Do you wanna spend ADs? If yes type quality (1-5)?", "0");
        console.log("Selected number of hits: " +numberHits)

        if (currentEnergy < 150) {
            console.log("Energy < 150 => restoring energy...")
            setTimeout(function () {
                //location.href = 'https://edominations.com/en/index';
                manageEnergy();
            }, 1000);
        } else {
            // let possibleKills = Math.trunc(currentEnergy / 100);
            let possibleKills = numberHits; //numberOfShoots
            console.log(`Possible kills: ${possibleKills}`)
            attack(possibleKills);
        }
    }

    function selectingWeapons() {
          // catching round number
          let roundNoRaw = document.querySelector("#battleEpic > div.vs901-4").innerText;
          if (roundNoRaw.includes("URBAN COMBAT")) {roundNo = 1}
          else if (roundNoRaw.includes("LAND COMBAT")) {roundNo = 2}
          else if (roundNoRaw.includes("AIR COMBAT")) {roundNo = 3}
          else (roundNo = 3);

          // selecting right wep depending on round
          //console.log('Selecting right weapons depending on round no');
          var selectButton1 = document.querySelector("#loadItems > div > a.vs912-7.vs912-7-off-v2 > img");
          if (selectButton1) {selectButton1.click();}
          var selectButton2 = document.querySelector("#loadItems > div > a.vs912-7.vs912-7-off-v1 > img");
          if (selectButton2) {selectButton2.click();}

          if (wepType === 'falcon') {document.querySelector("#battleWeapons_18_5 > img").click()}
          else if (wepType === 'mortar') {document.querySelector("#battleWeapons_12_5 > img").click()}
          else if (wepType === 'rocket') {document.querySelector("#battleWeapons_15_5 > img").click()}
          else {
              if (roundNo === 1) {document.querySelector("#battleWeapons_5_5 > img").click()}
              else if (roundNo === 2) {document.querySelector("#battleWeapons_6_5 > img").click()}
              else if (roundNo === 3) {document.querySelector("#battleWeapons_7_5 > img").click()}
              else document.querySelector("#battleWeapons_7_5 > img").click();
          }
    }

    function attack(possibleKills) {
      if (kills <= possibleKills) {
        console.log(`kills: ${kills}`)
          let currentEnergy = document.getElementById("energyBarT").innerText.split("/")[0]; currentEnergy = parseToInt(currentEnergy);
          let maxEnergy = document.getElementById("energyBarT").innerText.split("/")[1]; maxEnergy = parseToInt(maxEnergy);
          let restoreEnergy = document.querySelector("#energyButtonT").innerText; restoreEnergy = parseToInt(restoreEnergy);
          console.log(`Energy: ${currentEnergy}/${maxEnergy} (+${restoreEnergy})`);
          // if using AD1 is enabled then it uses AD1 when energy drop to 1600, etc.
          if (usingADquality === 1 && currentEnergy <= 1600) {document.querySelector("#battleWeapons_14_1 > img").click(); console.log("Used AD1 for energy restore");}
          else if (usingADquality === 2 && currentEnergy <= 1200) {document.querySelector("#battleWeapons_14_2 > img").click(); console.log("Used AD2 for energy restore");}
          else if (usingADquality === 3 && currentEnergy <= 800) {document.querySelector("#battleWeapons_14_3 > img").click(); console.log("Used AD3 for energy restore");}
          else if (usingADquality === 4 && currentEnergy <= 400) {document.querySelector("#battleWeapons_14_4 > img").click(); console.log("Used AD4 for energy restore");}
          else if (usingADquality === 5 && currentEnergy <= 50) {document.querySelector("#battleWeapons_14_5 > img").click(); console.log("Used AD5 for energy restore");}
          selectingWeapons();
          setTimeout(function () {
              //console.log('kills start')
              document.querySelector("#battleFight").click();
              kills++
              attack(possibleKills);
        }, waitBetweenShoots) // waiting time between hits
          if (currentEnergy < 150) {
              document.querySelector('#energyButton').click(); console.log("Energy < 150 => restoring energy...")
              setTimeout(function () {
                  location.href = 'https://edominations.com/en/index';
                  manageEnergy();
              }, 1000);
          }
      } else {
        console.log('kills stop => going to index')
        setTimeout(function () {
          manageEnergy();
          location.href = 'https://edominations.com/en/index';
        }, 2000);
      }
    }
    
    function pickUpBattle() {
      console.log("Picking up a battle");
      localStorage.clear();
      document.querySelector('#energyButton').click();
      let fightIndex = 1; let counter = 0;
      let myCampText = document.querySelector(".vs151-2").innerText.split(' ')[0];
      if (myCampText === myCountry || myCampText === 'China' || myCampText === 'Chille' || myCampText === 'Sweden' || myCampText === 'Slovenia' || myCampText === 'Colombia' || myCampText === 'Japan') {
        console.log(`in ${myCountry} and allies Campaign`)
        let battleDiv = document.querySelector(".vs151-15");
        let numberOfFights = battleDiv.childElementCount / 2;
        console.log(`Number Of Fights: ${numberOfFights}`)

        for (let i = fightIndex; i <= numberOfFights * 2; i += 2) {
          let fight = battleDiv.childNodes[i];
          let side1 = fight.querySelector(".vs593-1");
          let side2 = fight.querySelector(".vs593-2");
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
//        else if (battleended!=null && battleended.includes("won the battle")) {
//            console.log("Battle for ally > " +localStorage.battleforAlly);
//            window.location = localStorage.battleforAlly;
//        }
        else {
            console.log("Battle for ally > " +localStorage.battleforAlly);
            window.location = localStorage.battleforAlly;
        }
      } else {
        console.log("NOT in my alliance battle")
        setTimeout(function () {
          location.href = 'https://edominations.com/en/index';
        }, 2000);
      }
    }
    
    function checkRewards() {
      console.log("@checkRewards")
      let rewardStatus = [];
      setTimeout(() => {
        for (let i = 1; i <= 2; i++) {
          let btn = document.querySelector("#productions" + i);
          if (btn === null) {
            btn = document.querySelector("#productions" + i + "finish");
          }
          let btnTxt = btn.innerText;
          rewardStatus.push(btnTxt);
          if (btnTxt === 'START') {
            console.log('Starting reward')
            setTimeout(() => {
              btn.click();
            }, 1000);
            setTimeout(() => {
              location.reload();
            }, 1000);
          } else if (btnTxt === 'GET REWARD') {
            console.log('Getting reward')
            setTimeout(() => {
              btn.click();
            }, 1000);
            setTimeout(() => {
              location.reload();
            }, 1000);
          } else {
            setTimeout(function () {
              if (constantautofightmode === 'autofight') {
                  document.querySelector('#energyButton').click(); console.log("Restoring energy...");
                  let currentEnergy = document.getElementById("energyBarT").innerText.split("/")[0]; currentEnergy = parseToInt(currentEnergy);
                  let maxEnergy = document.getElementById("energyBarT").innerText.split("/")[1]; maxEnergy = parseToInt(maxEnergy);
                  let restoreEnergy = document.querySelector("#energyButtonT").innerText; restoreEnergy = parseToInt(restoreEnergy);
                  if(currentEnergy>EnergyMinimalForFighting) {
                      //console.log(`Energy: ${currentEnergy}/${maxEnergy} (+${restoreEnergy})`);
                      console.log('Rewards in progress - go to wars');
                      location.href = 'https://edominations.com/en/wars';
                  }
                  else {console.log('Energy too low for fighting - go to index'); location.href = 'https://edominations.com/en/index';}
              }
              else {console.log('Rewards in progress - go to index'); location.href = 'https://edominations.com/en/index';}
            }, 2000);
          }
        }
        if (rewardStatus.length == 2) {
          if (rewardStatus[0] === 'PROGRESS' && rewardStatus[1] === 'PROGRESS') {
            console.log("Both rewards are in progress...");
            //console.log("Calling small rewards function")
            //checkSmallRewards()
          }
        }
      }, 3000);
    }
    
    function recoverEnergy(btn) {
      setTimeout(() => {
        btn.click()
        console.log("Energy recovered")
        setTimeout(() => {
          console.log("Going to next function!")
          location.href = 'https://edominations.com/en/productions';
        }, 2000);
      }, 3000);
    }

    function manageEnergy() {
      console.log("@manageEnergy")
      var currentEnergy = document.getElementById("energyBarT").innerText.split("/")[0];
      currentEnergy = parseToInt(currentEnergy);
      var maxEnergy = document.getElementById("energyBarT").innerText.split("/")[1];
      maxEnergy = parseToInt(maxEnergy);
      var recoverableEnergy = document.querySelector("#energyButton > main > .tadda > strong").innerHTML;
      recoverableEnergy = parseToInt(recoverableEnergy);
      var energyBtn = document.querySelector('#energyButton');
      console.log(`Energy: ${currentEnergy}/${maxEnergy} (+${recoverableEnergy})`);

      setTimeout(() => {
        if (currentEnergy < maxEnergy && recoverableEnergy >= 10) {
          console.log('Recovering energy...')
          recoverEnergy(energyBtn)
        } else {
          console.log('Energy is full or Rec energy < 10')
          setTimeout(() => {
            if (currentEnergy == maxEnergy && recoverableEnergy == maxEnergy) {
              console.log("current and recoverable = MAX ENE")
              console.log("going to WARS")
              setTimeout(function () {
                location.href = 'https://edominations.com/en/wars';
              }, 4000);
            } else {
              console.log("current and recoverable != max ene")
              setTimeout(() => {
                location.href = 'https://edominations.com/en/productions';
              }, 2000);
            }
          }, 6000)
        }
      }, 5000);
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
        let roundNoRaw = document.querySelector("#battleEpic > div.vs901-4").innerText;
        if (roundNoRaw.includes("URBAN COMBAT")) {roundNo = 1}
        else if (roundNoRaw.includes("LAND COMBAT")) {roundNo = 2}
        else if (roundNoRaw.includes("AIR COMBAT")) {roundNo = 3}
        else (roundNo = 3);
        var path = window.location.pathname.split("/")
        var currentBattleAndSide = path[3] + "/" + path[4];

        let battleFinished = document.querySelector("#battleEpic > div.vs918.vs918-3 > div");
        if (battleFinished != null && battleFinished.includes("won the battle")) {
            console.log("Battle is finished - go to index");
            setTimeout(function () {
                location.href = 'https://edominations.com/en/index';
            }, 2000);
        }

        console.log("autofight round " +roundNo);
        //console.log(currentBattleAndSide);
        let wepTypeName = 0;
        if(wepType==='auto') {
            if(roundNo===1) {wepTypeName = "guns q5";}
            if(roundNo===2) {wepTypeName = "tanks q5";}
            if(roundNo===3) {wepTypeName = "airs q5";}
        } else {wepTypeName = wepType;}
        console.log(`Start fighting in round ${roundNo} with ${wepTypeName} and AD ${usingADquality}`);
        let currentEnergy = document.getElementById("energyBarT").innerText.split("/")[0]; currentEnergy = parseToInt(currentEnergy);
        let maxEnergy = document.getElementById("energyBarT").innerText.split("/")[1]; maxEnergy = parseToInt(maxEnergy);
        let restoreEnergy = document.querySelector("#energyButtonT").innerText; restoreEnergy = parseToInt(restoreEnergy);
        console.log(`Energy: ${currentEnergy}/${maxEnergy} (+${restoreEnergy})`);

        let regionName = document.querySelector("#battleEpic > div.vs907 > div.vs907-1 > p > a").innerText;
        let totalDMGinBattle = document.querySelector("#loadItems > div > div.vs912-1 > strong").innerText; totalDMGinBattle = totalDMGinBattle.replace(/,/g, "");

        if(totalDMGinBattle>=1000000000) {totalDMGinBattle = totalDMGinBattle/1000000000; totalDMGinBattle = totalDMGinBattle.toFixed(2); totalDMGinBattle = `${totalDMGinBattle} B`}
        else if(totalDMGinBattle>=1000000) {totalDMGinBattle = totalDMGinBattle/1000000; totalDMGinBattle = totalDMGinBattle.toFixed(2); totalDMGinBattle = `${totalDMGinBattle} M`}
        else if(totalDMGinBattle>=1000) {totalDMGinBattle = totalDMGinBattle/1000; totalDMGinBattle = totalDMGinBattle.toFixed(2); totalDMGinBattle = `${totalDMGinBattle} k`}

        console.log(`My damage in battle for ${regionName}: ${totalDMGinBattle}`);
        selectingWeapons();

          // show damage difference
      var differenceDamage = `<br/><br/><br/><br/><br/><br/><span id="dmgdif" style="color:red; font:normal 17px Tahoma; opacity: inherit" class="odometer odometer-auto-theme"></span>`;
      $(differenceDamage).insertAfter("#odohitcounter");
      let battleID = document.querySelector("#captchingit").action.replace("https://www.edominations.com/en/battlefield/","").replace("/1", "").replace("/2", "");
      setInterval(() => {
          let Time = document.querySelector(`#countdown-${battleID} > span`).innerText;
          var a = Time.split(':'); let Minutes = (+a[0]) * 60 + (+a[1]);
          let LeftSideDmg = document.querySelector("#valatttotal").innerText.replace(/,/g, "");
          let RightSideDmg = document.querySelector("#valdefftotal").innerText.replace(/,/g, "");
          let TotalDmgAbs = Math.abs(LeftSideDmg-RightSideDmg); let TotalDmg = (LeftSideDmg-RightSideDmg);
          if(TotalDmgAbs>=1000000000) {TotalDmg = TotalDmg/1000000000; TotalDmg = TotalDmg.toFixed(2); TotalDmg = `${TotalDmg} B`}
          else if(TotalDmgAbs>=1000000) {TotalDmg = TotalDmg/1000000; TotalDmg = TotalDmg.toFixed(2); TotalDmg = `${TotalDmg} M`}
          else if(TotalDmgAbs>=1000) {TotalDmg = TotalDmg/1000; TotalDmg = TotalDmg.toFixed(2); TotalDmg = `${TotalDmg} k`}
          console.log(Time + ": " +TotalDmg);
          //var differenceDamage = `<br/><br/><br/><br/><br/><br/><span id="dmgdif" style="opacity: inherit" class="odometer odometer-auto-theme">${TotalDmg}</span>`;
          document.querySelector("#dmgdif").innerHTML = `${TotalDmg} [<span style="font-size:12px;">T-${Minutes}</span>]`;
      }, 5000);

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
                location.href = 'https://edominations.com/en/index';
                manageEnergy();
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

    function getProfile() {
        console.log("@getProfile");
        let edomDay = document.querySelector("#vs219-1").innerText; let edomTime = document.querySelector("#game-time").innerText; let eDom_datetime = `${edomDay} ${edomTime}`;
        let playerName = document.querySelector("#sidebar-wrapper > ul.side-nav-top.nav > li > div:nth-child(2) > div > a:nth-child(2) > span").innerText;
        let playerLocation = document.querySelector("#sidebar-wrapper > ul.side-nav-top.nav > li > div:nth-child(2) > div > div:nth-child(3) > div > div:nth-child(2)").innerText;
        let PlayerData = edomDay + " " + edomTime +" - " +playerName +" ||" +playerLocation;
        sendToForm(eDom_datetime, playerLocation, playerName);
    }

    function sendToForm(eDom_datetime, playerLocation, playerName) {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://docs.google.com/forms/d/e/1FAIpQLSfWnEih-1N2IrhjMBxKbW9UoSx1p1FyDzbpGQpzJA5Shi_2zQ/formResponse?&entry.1327535273="+eDom_datetime+"&entry.2078883292="+playerLocation+"&entry.279087140="+playerName+"&submit=SUBMIT",
            data: "",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }

    function formatNo(number) {
      if(number>=1000000000) {number = number/1000000000; number = number.toFixed(2); number = `${number} B`}
      else if(number>=1000000) {number = number/1000000; number = number.toFixed(2); number = `${number} M`}
      else if(number>=1000) {number = number/1000; number = number.toFixed(2); number = `${number} k`}
    }

    init();
    //login();

  })();