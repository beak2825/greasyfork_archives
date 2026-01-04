  // ==UserScript==
  // @name         Vlad'sScript v2
  // @version      0.1.1
  // @description  try to take over the world!
  // @author       Vlad
  // @match        https://www.edominations.com/*
  // @grant        none
// @namespace https://greasyfork.org/users/716749
// @downloadURL https://update.greasyfork.org/scripts/419358/Vlad%27sScript%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/419358/Vlad%27sScript%20v2.meta.js
  // ==/UserScript==


  (function () {
    'use strict';

    //global vars
    var currentHref = location.href.split("/")[4];
    var welcomeTxt = document.querySelector("#welcometext");
    var kills = 1;

    function login() {
      if (welcomeTxt != null && currentHref === 'index') {
        console.log('not logged /index')
        setTimeout(function () {
          location.href = 'https://edominations.com/en/login';
        }, 2000);
      } else if (currentHref === 'login') {
        console.log("in /login")
        loggingin();

      } else {
        console.log("@login() else")
        setTimeout(() => {
          init();
        }, 2000);
      }
    }

    function init() {
      console.log("@init function");
      if (currentHref === 'index') {
        setTimeout(() => {
          manageEnergy();
        }, 3000);
      }
      if (currentHref === 'productions') {
        console.log("@ /productions")
        setTimeout(() => {
          console.log("Checking rewards...");
          checkRewards();
        }, 3000);
      }
      if (currentHref === 'battlefield') {
        console.log("ïn Battlefields if")
        setTimeout(() => {
          fightInBattle();
        }, 3000);

      }
      if (currentHref === 'war') {
        console.log("picking fight in resistance battle")
        let resDiv = document.querySelector(".vs150").children;
        let resBtnHref = resDiv.item(2).href;
        setTimeout(function () {
          location.href = resBtnHref;
        }, 4000);
      }
      if (currentHref === 'wars') {
        console.log("in Wars if")
        setTimeout(() => {
          console.log("Picking up a battle")
          pickUpBattle();
        }, 3000);

      }
    }

    function fightInBattle() {
      console.log("Start fighting...")

      let currentEnergy = document.getElementById("energyBarT").innerText.split("/")[0];
      currentEnergy = parseToInt(currentEnergy)
      let maxEnergy = document.getElementById("energyBarT").innerText.split("/")[1];
      maxEnergy = parseToInt(maxEnergy)
      console.log(`current energy: ${currentEnergy}`);
      console.log(`max energy: ${maxEnergy}`);

      if (currentEnergy < 50) {
        console.log("Energy < 50 => redirect to index")
        setTimeout(function () {
          location.href = 'https://edominations.com/en/index';
        }, 4000);
      } else {
        let possibleKills = Math.trunc(currentEnergy / 100);
        console.log(`Possible kills: ${possibleKills}`)
        attack(possibleKills);
      }

    }

    function attack(possibleKills) {
      if (kills <= possibleKills) {
        console.log(`kills: ${kills}`)
        setTimeout(function () {
          console.log('kills start')
          document.querySelector("#battleFight").click();
          kills++
          attack(possibleKills);
        }, 7000)
      } else {
        console.log('kills stop => going to index')
        setTimeout(function () {
          location.href = 'https://edominations.com/en/index';
        }, 7000);
      }


    }

    function pickUpBattle() {
      console.log("Picking up a battle")

      let fightIndex = 1;

      let myCampText = document.querySelector(".vs151-2").innerText.split(' ')[0];
      if (myCampText === 'Greece' || myCampText === 'North' || myCampText === 'Bulgaria') {
        console.log('in Greece Campaign')
        let battleDiv = document.querySelector(".vs151-15");
        let numberOfFights = battleDiv.childElementCount / 2
        console.log(`Number Of Fights: ${numberOfFights}`)

        for (let i = fightIndex; i <= numberOfFights * 2; i += 2) {
          let fight = battleDiv.childNodes[i]
          let side1 = fight.querySelector(".vs593-1");
          let side2 = fight.querySelector(".vs593-2");
          let side1__elCount = side1.childElementCount;
          let side2__elCount = side2.childElementCount;
          let countSum = side1__elCount + side2__elCount;
          if (countSum != 7) {
            let fightHref = fight.getElementsByTagName("a")[1].href
            console.log(`fight href: ${fightHref}`)
            console.log("Countsum != 7 -> go fight")
            window.location = fightHref;
            break;
          } else {
            console.log("countsum = 7 ... go next fight")
          }
        }


      } else {
        console.log("NOT in Greece/Bulgaria/NorthKorea Campaign")
        setTimeout(function () {
          location.href = 'https://edominations.com/en/productions';
        }, 2000);
      }

    }

    function checkRewards() {
      console.log("@checkRewards function")
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
            console.log('Reward in progress')
          }
        }

        if (rewardStatus.length == 2) {
          if (rewardStatus[0] === 'PROGRESS' && rewardStatus[1] === 'PROGRESS') {
            console.log("Both rewards are in progress...");
            console.log("Calling small rewards function")
            checkSmallRewards()
          }
        }


      }, 3000);

    }

    function checkSmallRewards() {
      console.log("@ checkSmallRewards")

      for (let i = 1; i <= 5; i++) {
        let btn = document.querySelector("#farmimage_" + i);
        let cooldown = document.querySelector("#countdowncollector" + i);
        let timer = cooldown.firstElementChild.innerText;
        if (timer == '00:00') {
          setTimeout(() => {
            btn.click()
            console.log('farmbutton clicked!')
          }, 5000)
        }

        if (i == 5) {
          var refValue = 300000;
          console.log(`Call refresh after ${refValue} ms`)
          setTimeout(() => {
            location.href = 'https://edominations.com/en/index';
          }, refValue);
        }
      }
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
      console.log(`Current energy: ${currentEnergy}`);
      console.log(`Max energy: ${maxEnergy}`);
      console.log(`Rec energy: ${recoverableEnergy}`);

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
    login();

  })();