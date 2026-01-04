// ==UserScript==
// @name         Vlad'sScript
// @version      0.1.14
// @description  try to take over the world!
// @author       Vlad
// @match        https://www.edominations.com/*
// @grant        none
// @namespace https://greasyfork.org/users/716749
// @downloadURL https://update.greasyfork.org/scripts/418763/Vlad%27sScript.user.js
// @updateURL https://update.greasyfork.org/scripts/418763/Vlad%27sScript.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var currentHref = location.href.split("/")[4];
  var welcome = document.getElementById("welcometext")
  var kills = 1;
  var recoverableEnergy = 1;



  if (welcome != null && currentHref === 'index') {
    console.log('not logged /index')
    setTimeout(function () {
      location.href = 'https://edominations.com/en/login';
    }, 2000);
  } else if (currentHref === 'login') {
    console.log('In /login')
    window.onload = () => {
        console.log("in onload login")
      let pwchange = false
      let usrchange = false
      var loginForm = document.querySelector("#login-box-inner > form");
      document.querySelector("*[name=password]").onchange = () => {
        if (usrchange) {
          loginForm.submit();
        } else {
          pwchange = true
        }
      };
      document.querySelector("*[name=email]").onchange = () => {
        if (pwchange) {
          loginForm.submit();
        } else {
          usrchange = true
        }
      };
    }
  } else {
    console.log('logged')
      if (currentHref === 'login') {
          console.log('logged but stay in /login => redirect to index')
          let loginBtn = document.querySelector("#login")
          setTimeout(function () {
              loginBtn.click();
        }, 4000);
      }
    if (currentHref === 'index') {
      manageEnergy();
    }

    if (currentHref === 'productions') {
      rewards();
    }
    if (currentHref === 'wars') {
      console.log("in Wars if")
      pickUpBattle();
    }

    if (currentHref === 'war') {
      console.log("picking fight in resistance battle")
      let resDiv = document.querySelector(".vs150").children;
      let resBtnHref = resDiv.item(2).href;
      setTimeout(function () {
        location.href = resBtnHref;
      }, 4000);


    }

    if (currentHref === 'battlefield') {
      console.log("ïn Battlefields if")
      fightInBattle();
    }
  }

  function fightInBattle() {
    console.log("Start fighting...")
    window.onload = () => {
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
    window.onload = () => {
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
        console.log("NOT in Greece Campaign")
        rewards()
      }
    }
  }

  function manageEnergy() {
    window.onload = () => {
      console.log('manage energy')
      let currentEnergy = document.getElementById("energyBarT").innerText.split("/")[0];
      currentEnergy = parseToInt(currentEnergy)
      let maxEnergy = document.getElementById("energyBarT").innerText.split("/")[1];
      maxEnergy = parseToInt(maxEnergy)
      let energyBtn = document.querySelector('#energyButton');
      setTimeout(() => {
        var recEne = document.querySelector("#energyButton > main > .tadda > strong").innerHTML;
        console.log(`Rec ene: ${recEne}`)
        recoverableEnergy = parseToInt(recEne);
        console.log(`rec ene: ${recoverableEnergy}`);
      }, 5000)




      setTimeout(() => {
        console.log(`current ene: ${currentEnergy}`);
        console.log(`max ene: ${maxEnergy}`);
        if (currentEnergy < maxEnergy && recoverableEnergy >= 10) {
          console.log('recovering energy...')
          setTimeout(() => {
            energyBtn.click();
            console.log('Energy recovered')
            setTimeout(() => {
              rewards()
            }, 6000)
          }, 4000);
        } else {
          console.log('energy full or not enough recoverable energy')
          setTimeout(() => {
            if (currentEnergy == maxEnergy && recoverableEnergy == maxEnergy) {
              console.log("current and recoverable = MAX ENE")
              console.log("going to WARS")
              setTimeout(function () {
                location.href = 'https://edominations.com/en/wars';
              }, 4000);
            } else {
              console.log("current and recoverable != max ene")
              rewards()
            }
          }, 6000)
        }
      }, 5000)
    }
  }

  function parseToInt(num) {
    return Number.parseInt(num)
  }

  function rewards() {
    if (currentHref != 'productions') {
      console.log('in  href rewards function')
      setTimeout(function () {
        location.href = 'https://edominations.com/en/productions';
      }, 2000);
    } else {
      console.log('in rewards function')
      window.onload = () => {
        console.log("in reward vliza v onloada")

        let bigBonus1__btn = document.querySelector("#productions1finish");
        let bigBonus2__btn = document.querySelector("#productions2finish");

        if (bigBonus1__btn === null) {
          bigBonus1__btn = document.querySelector("#productions1");
        }
        setTimeout(function () {
          console.log('1st reward')
          getProductionReward(bigBonus1__btn);
        }, 6000);
        if (bigBonus2__btn === null) {
          bigBonus2__btn = document.querySelector("#productions2");

        }
        setTimeout(function () {
          console.log('2nd reward')
          getProductionReward(bigBonus2__btn);
        }, 8000);


        let small__timer1 = document.querySelector("#countdowncollector1");
        let small__timer2 = document.querySelector("#countdowncollector2");
        let small__timer3 = document.querySelector("#countdowncollector3");
        let small__timer4 = document.querySelector("#countdowncollector4");
        let small__timer5 = document.querySelector("#countdowncollector5");
        let small__btn1 = document.querySelector("#farmimage_1");
        let small__btn2 = document.querySelector("#farmimage_2");
        let small__btn3 = document.querySelector("#farmimage_3");
        let small__btn4 = document.querySelector("#farmimage_4");
        let small__btn5 = document.querySelector("#farmimage_5");

        setTimeout(function () {
          console.log('SMALL REWARDS')
          setTimeout(() => {
            getCollectorsReward(small__timer1, small__btn1);
          }, 2000)
          setTimeout(() => {
            getCollectorsReward(small__timer2, small__btn2);
          }, 2000)
          setTimeout(() => {
            getCollectorsReward(small__timer3, small__btn3);
          }, 2000)
          setTimeout(() => {
            getCollectorsReward(small__timer4, small__btn4);
          }, 2000)
          setTimeout(() => {
            getCollectorsReward(small__timer5, small__btn5);
          }, 2000)
        }, 6000);

        setTimeout(function () {
          console.log('restart')
          location.href = 'https://edominations.com/en/index';
        }, 300000);
      }
    }
  }

  function getProductionReward(btn) {
    let currentBtnText = btn.innerText;
    console.log(`CurrentBtnText: ${currentBtnText}`)
    setTimeout(() => {
      if (currentBtnText === 'GET REWARD') {
        console.log('get reward')
        setTimeout(function () {
          btn.click();
          location.reload();
        }, 4000);
      } else if (currentBtnText === 'PROGRESS') {
        console.log('production reward in PROGRESS')
      } else {
        console.log('start reward')
        setTimeout(() => {
          btn.click();
        }, 3000)
      }
    }, 4000)
  }

  function getCollectorsReward(cooldown, farmbutton) {
    let timer = cooldown.firstElementChild.innerText;
    if (timer == '00:00') {
      setTimeout(() => {
        farmbutton.click()
        console.log('farmbutton clicked!')
      }, 5000)
    }
  }
})();