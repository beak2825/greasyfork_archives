// ==UserScript==
  // @name         Ahi tools for edominacy
  // @namespace    https://www.edominacy.com
  // @description  Ahi tools
  // @author       Ahi
  // @match        https://www.edominacy.com/*
  // @require      http://code.jquery.com/jquery-2.1.0.min.js
  // @run-at       document-end
  // @namespace    https://greasyfork.org/en/users/7368-dalibor-g
  // @license MIT
  // @version 1.1
// @downloadURL https://update.greasyfork.org/scripts/499173/Ahi%20tools%20for%20edominacy.user.js
// @updateURL https://update.greasyfork.org/scripts/499173/Ahi%20tools%20for%20edominacy.meta.js
// ==/UserScript==

  (function () {
    'use strict';

    // CHANGE YOUR OPTIONS HERE:
    var numberOfShoots = 200; //200 = standard
    var usingADquality = 0; // AD quality (1-5), if no AD to used then set 0
    var hideBattleOverlayLayer = 'true'; // true, false
    var sendingActivityToForm = 'false'; // true, false
    var waitBeforeFight = 2000; //5000 miliseconds = 5sec etc.
    var waitingTimeGeneralMin = 15; // in minutes
    var EnergyMinimalForFighting = 1000;
    var myCountry = 'Croatia'; // define your country
    var waitBetweenShoots = 3000; //2000 miliseconds = 2sec
    var constantautofightmode = 'normal'; // autofight, normal

    //global vars
    var currentHref = location.href.split("/")[4];
    var welcomeTxt = document.querySelector("#welcometext");
    var waitingTimeGeneral = (waitingTimeGeneralMin*60000);
    var kills = 1;
    var roundNo = 0;
    var energyRestoreButton = document.getElementById("energyButton"); // Energy restore button

      var quicklinks =
          "<br><h2>Quick links:</h2>" +
          "<a href='https://www.edominacy.com/en/profile/2781'>Lesley</a> - "+
          "<a href='https://www.edominacy.com/en/profile/4461'>Shauma</a> - "+
          "<a href='https://www.edominacy.com/en/profile/4684'>Ahileus</a> - "+       
          "<a href='https://www.edominacy.com/en/profile/871'>Kaveh</a> - "+
          "<a href='https://www.edominacy.com/en/newspaper/559'>Area51</a>";
      var leftmenu =
          "<li class='active'><a href='https://www.edominacy.com/en/index'><i class='fa fa-home'></i><span>Home</span></a></li>"+
          "<li class=''><a href='https://www.edominacy.com/en/inventory'><i class='fa fa-flag-o'></i><span>Storage</span></a></li>"+
          "<li class=''><a href='https://www.edominacy.com/en/companies'><i class='fa fa-flag-o'></i><span>Companies</span></a></li>"+
          "<li class=''><a href='https://www.edominacy.com/en/training-grounds'><i class='fa fa-flag-o'></i><span>Training grounds</span></a></li>"+
          "<li class=''><a href='https://www.edominacy.com/en/party'><i class='fa fa-flag-o'></i><span>Party</span></a></li>"+
          "<li class=''><a href='https://www.edominacy.com/en/military-unit'><i class='fa fa-flag-o'></i><span>Military unit</span></a></li>"+
          "<li class=''><a href='https://www.edominacy.com/en/newspaper'><i class='fa fa-flag-o'></i><span>Newspaper</span></a></li>"+
          "<li class=''>&nbsp;</li>";
      $(quicklinks).insertBefore(".vs169:last"); // custom top right links
      $(leftmenu).insertBefore("li.active:first"); // custom left menu

      window.onload = function() { // to prevent using script functions before page completely load
//      document.querySelector("#sidebar-nav > ul > li > ul.submenu").style.display="block"; // dropdown menu always open
      if (currentHref === 'index') {
          console.log("@main page")
          if(energyRestoreButton!=null) {sleep(3000); energyRestoreButton.click(); console.log("Energy restored!")} else console.log("Can't restore energy!");
          let DailyAssigments = document.querySelector("#content-wrapper > div > div > div > div.vs323-1 > div.vs170.vs170-14 > form > button");
          let DailyAssigmentsOK = document.querySelector("body > div.swal2-container > div.swal2-modal.show-swal2.visible > button.swal2-confirm.styled");
          let DailyOrderOK = document.querySelector("#content-wrapper > div > div > div > div.vs323-1 > div.vs170-10 > form > button");
          //if(DailyAssigments!=null) {DailyAssigments.click(); console.log("Daily assigments reward collected!"); DailyAssigments.click();};
          //if(DailyAssigmentsOK!=null) {DailyAssigmentsOK.click(); console.log("OKd!"); DailyAssigmentsOK.click();};
          //if(DailyOrderOK!=null) {DailyOrderOK.click(); console.log("Daily reward collected!"); DailyOrderOK.click();};
          //energyRestoreButton.click(); console.log("Recovering energy...");
          let edomDay = document.querySelector("#header-navbar > div > div > div.nav-no-collapse.navbar-left.pull-left.hidden-sm.hidden-xs > ul > li:nth-child(4) > a").innerText;
          let edomTime = document.querySelector("#game-time").innerText; let eDom_datetime = `${edomDay} ${edomTime}`;
          console.log(`${eDom_datetime}`);
          //let Button = document.querySelector("#content-wrapper > div > div > div > div.vs323-1 > div.vs170.vs170-14 > form > button > span");
          //if(Button!=null) {Button.click();} else console.log("OKed!");
          console.log(`Waiting for ${waitingTimeGeneralMin} minutes...`);
      }
      if (currentHref === 'companies') {
          console.log("@companies page")
          energyRestoreButton.click();
          setTimeout(() => {
              let WorkButton = document.querySelector("#content-wrapper > div > div > div > div > div.vsPanel-body > div > table > tbody > tr > td.text-center > form > button > div"); // Work button
              let WorkAsManagerButton = document.getElementById("compButton"); // work as manager button
              //let OKbuttonAfterWork = document.querySelector("body > div.swal2-container > div.swal2-modal.show-swal2.visible > button.swal2-confirm.styled"); // OK button after work
              if(WorkButton!=null) {WorkButton.click(); console.log("Succesfully worked!");} else console.log("Already worked!");
              document.getElementById("todo-0").click(); // work as manager, checkbox
              if(WorkAsManagerButton!=null) {WorkAsManagerButton.click(); console.log("Succesfully worked as Manager!");} else console.log("Already worked as Manager!");
              //OKbuttonAfterWork.click();
              //location.href = 'https://www.edominacy.com/en/training-grounds';
          }, 4000);
      }
      if (currentHref === 'training-grounds') {
          console.log("@training-grounds page")
          setTimeout(() => {
              let TrainButton = document.querySelector("#panel-1 > div > table > tbody > tr.vs302 > td.text-center > button > div");
              //let OKbuttonAfterTrain = document.querySelector("body > div.swal2-container > div.swal2-modal > button.swal2-confirm");
              if(TrainButton!=null) {TrainButton.click();} else console.log("Already trained!");
              //if(OKbuttonAfterTrain!=null) {OKbuttonAfterTrain.click();}
          }, 4000);
      }
      if (currentHref === 'battlefield') {
          console.log("@battlefield page")
          energyRestoreButton.click();

          // hide overlay layer when fighting
          if (hideBattleOverlayLayer === 'true') {
              document.querySelector("#battleLog").style.display = 'none';
              document.querySelector("#battleLog").style.visibility = "hidden"; //document.getElementById("myP2").style.visibility = "hidden";
              document.querySelector("#battleBlack").style.visibility = "hidden"; // document.querySelector("#battleBlack").style.display = "none";
          }
          const CurrentURL = getCurrentURL();
          setTimeout(function () {
              let NumberofHits = prompt("How much hits you want to do?", numberOfShoots);
              //let WepSelect = document.querySelector("#loadItems > div > a.vs912-7.vs912-7-off-v1"); WepSelect.click();
              //let Wep = document.querySelector("#battleWeapons_0_0"); Wep.click();
              let FightButton = document.querySelector("#battleFight");
              attack(NumberofHits);
              //let NumberofHits = 2; console.log("Auto fight mode is ON!");
              energyRestoreButton.click();
          }, 5000);
      }
//*/
    }

      function getCurrentURL () {
          return window.location.href
      }
      function formatNo(number) {
          if(number>=1000000000) {number = number/1000000000; number = number.toFixed(2); number = `${number} B`}
          else if(number>=1000000) {number = number/1000000; number = number.toFixed(2); number = `${number} M`}
          else if(number>=1000) {number = number/1000; number = number.toFixed(2); number = `${number} k`}
      }
      function parseToInt(num) {
          return Number.parseInt(num)
      }
      function sleep(milliseconds) {
          const date = Date.now();
          let currentDate = null;
          do {
              currentDate = Date.now();
          } while (currentDate - date < milliseconds);
      }
      function attack(possibleKills) {
          energyRestoreButton.click(); let currentEnergy = document.getElementById("energyBarT").innerText.split("/")[0]; currentEnergy = parseToInt(currentEnergy);
          if (currentEnergy < 500) {
              console.log(`Your energy is too low for fighting!`);
          }
          else if (kills <= possibleKills) {
              console.log(`kills: ${kills}`)
              let currentEnergy = document.getElementById("energyBarT").innerText.split("/")[0]; currentEnergy = parseToInt(currentEnergy);
              let maxEnergy = document.getElementById("energyBarT").innerText.split("/")[1]; maxEnergy = parseToInt(maxEnergy);
              let restoreEnergy = document.getElementById("energyButtonT").innerText;
              let regionName = document.querySelector("#screenBattle > div > div > div.vs907-1 > p > a").innerText;
              let totalDMGinBattle = document.querySelector("#loadItems > div > div.vs912-1 > strong").innerText; totalDMGinBattle = totalDMGinBattle.replace(/,/g, "");
              if(totalDMGinBattle>=1000000000) {totalDMGinBattle = totalDMGinBattle/1000000000; totalDMGinBattle = totalDMGinBattle.toFixed(2); totalDMGinBattle = `${totalDMGinBattle} B`}
              else if(totalDMGinBattle>=1000000) {totalDMGinBattle = totalDMGinBattle/1000000; totalDMGinBattle = totalDMGinBattle.toFixed(2); totalDMGinBattle = `${totalDMGinBattle} M`}
              else if(totalDMGinBattle>=1000) {totalDMGinBattle = totalDMGinBattle/1000; totalDMGinBattle = totalDMGinBattle.toFixed(2); totalDMGinBattle = `${totalDMGinBattle} k`}
              setTimeout(function () {
                  //console.log('kills start')
                  document.querySelector("#battleFight").click();
                  kills++
                  attack(possibleKills);
              }, waitBetweenShoots); // waiting time between hits
              console.log(`My damage in battle for ${regionName}: ${totalDMGinBattle}`);
              console.log(`Energy: ${currentEnergy}/${maxEnergy} (+${restoreEnergy})`);
          }
      }
//    init();
    //login();

  })();
