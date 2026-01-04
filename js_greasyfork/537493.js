// ==UserScript==
// @name        Old School Idle - Scripts
// @description OSRS Idle Changes
// @namespace   Violentmonkey Scripts
// @version     1.9
// @author      DevSwitch
// @license     CC-BY-NC-SA-4.0
// @match       *://*/OldSchoolIdle.html*
// @grant       GM.xmlHttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @homepageURL https://greasyfork.org/en/scripts/537493-old-school-idle-scripts
// @downloadURL https://update.greasyfork.org/scripts/537493/Old%20School%20Idle%20-%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/537493/Old%20School%20Idle%20-%20Scripts.meta.js
// ==/UserScript==

const runUIChk = setInterval(checkUI, 5000);
var vLastUpdate = new Date('2025-01-01T01:01:01');
var vFirstRun = 0;

window.addEventListener('load', function() {
  main();
}, false);

function main() {
  setTimeout(function() {
    userCheck(vLastUpdate);
  }, 15000);
  setInterval(function() {
    userCheck(vLastUpdate);
  }, 300000);
  setInterval(function() {
    var settingDiv = document.querySelector("#popup");
    if (settingDiv != null) {
      if (document.querySelector("#sP_C5").checked) {
        doBoost();
      }
      if (document.querySelector("#sP_C2").checked) {
        doCombatQuit();
      }
      if (document.querySelector("#sP_C3").checked) {
        doCombatHide();
      }
      if (document.querySelector("#sP_C4").checked) {
        doSlayerCheck();
      }
      if (document.querySelector("#sP_C6").checked) {
        doFarmingCheck();
      }
    }
  }, 2500);
  setInterval(function() {
    var settingDiv = document.querySelector("#popup");
    if (settingDiv != null) {
      doPrayerCheck();
    }
  }, 500);
}

function addListener() {
  const divElement = document.getElementById('myDiv');
  var userSelect = document.querySelector("#sP1 > select");
  if (userSelect != null) {
    if (userSelect.value != 'N/A') {
      var userData = localStorage.getItem(userSelect.value);
      divElement.addEventListener('click', function(event) {
        GM.xmlHttpRequest({
          method: "POST",
          url: "https://mwi.switch.love:5001/proccessProfile",
          data: userData,
          headers: {
            "Content-Type": "application/json",
            "Selected-User": userSelect.value
          },
        });
      });
    }
  }
}

/*
 * User Stats
 */

function userCheck(vLastUpdate) {
  var userChecked = document.querySelector("#sP_C1");
  if (userChecked != null) {
    if (userChecked.checked) {
      var vCurUpdate = Date.now();
      if (vFirstRun == 0) {
        vFirstRun = 1;
        getUser();
        vLastUpdate = Date.now();
      } else {
        var doUpdate = areDatesMoreThanFiveMinutesApart(vLastUpdate);
        if ( doUpdate == true ) {
          getUser();
          vLastUpdate = Date.now();
        }
      }
    }
  }
}

function getUser() {
  var userSelect = document.querySelector("#sP1 > select");
  if (userSelect != null) {
    if (userSelect.value != 'N/A') {
      var userData = localStorage.getItem(userSelect.value);
      var requestDetails = {
        method: "POST",
        url: "https://mwi.switch.love:5001/proccessProfile",
        data: userData,
        headers: {
          "Content-Type": "application/json",
          "Selected-User": userSelect.value
        },
      }
      GM.xmlHttpRequest(requestDetails);
      lastUpdate = Date.now();
    }
  }
}

/*
 * Boost
 */

function doBoost() {
  if (window.location.href.includes('OldSchoolIdle.html#/combat')) {
    var cBoost = document.querySelector("#test > div.flex.flex-col.gap-2.mt-2 > div.containerWithCorners.relative.undefined > div > div.flex.flex-col.lg\\:flex-row > div.grid.h-fit.grid-cols-12.p-2.pb-0 > div.lg\\:col-span-4.col-span-full.grid.place-items-center > div.flex.lg\\:gap-2.gap-\\[1px\\].col-span-1.h-full.justify-start.relative > div > div > div > div.flex.flex-col.self-center.my-3.w-full.h-full > div.grid.place-items-center.relative > div.absolute.right-0.-top-2 > div.z-30.rounded-sm.false.bg-selectColor.\\!rounded.container-shadow-small.absolute.top-0.right-0.false > button");
    if (cBoost != null) {
      cBoost.click();
    }
  } else if (window.location.href.includes('#/skills')) {
    var sBoost = document.getElementsByClassName("h-full w-full text-shadow-small text-xs text-center text-white")[0];
    if (sBoost != null) {
      sBoost.click();
    }
  }
}

/*
 * Combat
 */

function doCombatHide() {
  if (window.location.href.includes('OldSchoolIdle.html#/combat')) {
    var firstMonK = document.querySelector("#test > div.flex.flex-col.gap-2.mt-2 > div.containerWithCorners.relative.flex-col > div.grid.lg\\:p-3.px-3.lg\\:grid-cols-5.sm\\:grid-cols-3.grid-cols-1.w-full.place-items-center.md\\:gap-2.gap-2.container-padding.h-fit > div:nth-child(1) > div > div:nth-child(4) > div > div.flex.gap-0\\.5.pt-1.text-sm > div:nth-child(7)");
    var secondMonK = document.querySelector("#test > div.flex.flex-col.gap-2.mt-2 > div.containerWithCorners.relative.flex-col > div.grid.lg\\:p-3.px-3.lg\\:grid-cols-5.sm\\:grid-cols-3.grid-cols-1.w-full.place-items-center.md\\:gap-2.gap-2.container-padding.h-fit > div:nth-child(2) > div > div:nth-child(4) > div > div.flex.gap-0\\.5.pt-1.text-sm > div:nth-child(7)");
    var hideCheck = document.querySelector("#test > div.flex.flex-col.gap-2.mt-2 > div.containerWithCorners.relative.flex-col > div.grid.lg\\:grid-cols-4.grid-cols-1.w-full.lg\\:place-items-start.place-items-center.items-center.p-2.gap-2 > label > input");

    if (firstMonK != null && secondMonK != null) {
      if (firstMonK.style.backgroundColor == 'rgb(109, 21, 13)' || secondMonK.style.backgroundColor == 'rgb(109, 21, 13)') {
        if (hideCheck.checked == true) {
          hideCheck.click();
          hideCheck.click();
        } else if (hideCheck.checked != true) {
          hideCheck.click();
        }
      }
    } else if (firstMonK != null) {
      if (firstMonK.style.backgroundColor == 'rgb(109, 21, 13)') {
        if (hideCheck.checked == true) {
          hideCheck.click();
          hideCheck.click();
        } else if (hideCheck.checked != true) {
          hideCheck.click();
        }
      }
    }
  }
}

async function doCombatQuit() {
  if (window.location.href.includes('OldSchoolIdle.html#/combat')) {
    var activeK = document.querySelector("#test > div.flex.flex-col.gap-2.mt-2 > div.containerWithCorners.relative.undefined > div > div.flex.flex-col.lg\\:flex-row > div.grid.h-fit.grid-cols-12.p-2.pb-0 > div.lg\\:col-span-4.col-span-full.items-center.flex.relative.flex-col > div > div.p-2.w-full.rounded-md.bg-itemColor.space-y-2 > div:nth-child(1) > div.flex.gap-0\\.5.pt-1.text-sm > div:nth-child(7)");
    var activeI = document.querySelector("#test > div.flex.flex-col.gap-2.mt-2 > div.containerWithCorners.relative.undefined > div > div.flex.flex-col.lg\\:flex-row > div.grid.h-fit.grid-cols-12.p-2.pb-0 > div.lg\\:col-span-4.col-span-full.items-center.flex.relative.flex-col > div > div.p-2.w-full.rounded-md.bg-itemColor.space-y-2 > div.flex.gap-1 > div.flex.red-redirect-small.pressable.justify-center.h-fit.p-1.bg-borderColor.rounded-md.flex-col.text-white.text-shadow-small.text-center.text-sm.items-center.leading-none.w-full.z-30.cursor-pointer > div > div.flex-1 > div > div.transition-all.duration-150.h-full.relative.progress-bar-shadow-x-small");
    var quitButton = document.querySelector("#test > div.flex.flex-col.gap-2.mt-2 > div.containerWithCorners.relative.undefined > div > div.flex.flex-col.lg\\:flex-row > div.grid.h-fit.grid-cols-12.p-2.pb-0 > div.flex.flex-col.relative.self-center.h-full.py-1.lg\\:py-6.gap-2.w-full.lg\\:col-span-4.col-span-full.text-shadow.place-items-center > div.lg\\:mt-auto.flex.flex-col.gap-2.justify-center.items-center > button");

    if (activeK  != null) {
      if (activeK.style.backgroundColor == 'rgb(109, 21, 13)' && activeI.style.background == 'green') {
        quitButton.click();
        await combatDelete();
        await doCombatNext();
      }
    }
  }
}

async function doCombatNext() {
  if (window.location.href.includes('OldSchoolIdle.html#/combat')) {
    var monsterList = document.querySelector("#test > div.flex.flex-col.gap-2.mt-2 > div.containerWithCorners.relative.flex-col > div.grid.lg\\:p-3.px-3.lg\\:grid-cols-5.sm\\:grid-cols-3.grid-cols-1.w-full.place-items-center.md\\:gap-2.gap-2.container-padding.h-fit").children;
    for (var i = 0; i < monsterList.length; i++) {
      if (monsterList[i].firstChild.className.includes("bg-black") != true) {
        i = i + 1;
        var nextMonster = document.querySelector("#test > div.flex.flex-col.gap-2.mt-2 > div.containerWithCorners.relative.flex-col > div.grid.lg\\:p-3.px-3.lg\\:grid-cols-5.sm\\:grid-cols-3.grid-cols-1.w-full.place-items-center.md\\:gap-2.gap-2.container-padding.h-fit > div:nth-child(" + i + ") > div.pt-1.relative.w-full.h-fit.flex.items-center.flex-col > div.flex.gap-2.items-center.w-full.px-2.my-2 > button");
        nextMonster.click();
        break;
      }
    }
  }

  /*var nextMon = document.querySelector("#test > div.flex.flex-col.gap-2.mt-2 > div.containerWithCorners.relative.flex-col > div.grid.lg\\:p-3.px-3.lg\\:grid-cols-5.sm\\:grid-cols-3.grid-cols-1.w-full.place-items-center.md\\:gap-2.gap-2.container-padding.h-fit > div:nth-child(1) > div > div.flex.gap-2.items-center.w-full.px-2.my-2 > button");
  nextMon.click();*/
}

function combatDelete() {
  if (window.location.href.includes('OldSchoolIdle.html#/combat')) {
    var deleteButton = document.querySelector("#test > div.flex.flex-col.gap-2.mt-2 > div.containerWithCorners.relative.undefined > div > div.flex.flex-col.lg\\:flex-row > div.shopContainer.h-auto.text-shadow.m-2.mb-0.lg\\:ml-0.w-auto.lg\\:\\!w-\\[240px\\].flex-grow > div.h-auto.border-t-4.px-0\\.5.pr-1.relative.border-borderColor.flex.justify-between.items-center.text-center > div.red-redirect-small > label > input");
    deleteButton.click();
    var itemList = document.querySelector("#test > div.flex.flex-col.gap-2.mt-2 > div.containerWithCorners.relative.undefined > div > div.flex.flex-col.lg\\:flex-row > div.shopContainer.h-auto.text-shadow.m-2.mb-0.lg\\:ml-0.w-auto.lg\\:\\!w-\\[240px\\].flex-grow > div.h-fit.w-full.p-0\\.5.px-1 > div.flex-grow.grid.lg\\:grid-cols-5.place-items-center.sm\\:grid-cols-10.grid-cols-5").getElementsByClassName("bg-red-500");
    for (let i = 0; i < itemList.length; i++) {
        itemList[i].click();
    }
    deleteButton.click();
  }
}

/*
 * Slayer
 */

function doSlayerCheck() {
  var urlCombat = "OldSchoolIdle.html#/combat";
  var urlSlayer = "OldSchoolIdle.html#/skills/Slayer";
  var curSlayerTask = document.querySelector("#root > div.overflow-x-hidden.select-none.w-screen.h-\\[100dvh\\].backgroundImage > div.fixed.top-1.right-0.z-\\[100000\\].h-0 > div > div.relative > div.z-40.lg\\:space-y-1.space-y-1.pointer-events-auto.lg\\:w-40.w-32.text-shadow > div.w-full.cursor-pointer.relative > div > div > div > div > p.whitespace-nowrap");

  if (window.location.href.includes(urlCombat) || window.location.href.includes(urlSlayer)) {
    if (curSlayerTask == null) {
      doSlayerNext();
    } else {
      doSlayerFight();
    }
  }
}

async function doSlayerNext() {
  var inFight = document.querySelector("#root > div.overflow-x-hidden.select-none.w-screen.h-\\[100dvh\\].backgroundImage > div.fixed.top-1.right-0.z-\\[100000\\].h-0 > div > div.relative > div.z-40.lg\\:space-y-1.space-y-1.pointer-events-auto.lg\\:w-40.w-32.text-shadow > div.w-full.cursor-pointer.relative > div:nth-child(1) > div > div > div > div.flex.justify-between.gap-1.text-center.items-center > div:nth-child(1) > img");

  if (inFight != null && window.location.href.includes("OldSchoolIdle.html#/skills/Slayer")) {
    var goToCombat = document.querySelector("#root > div.overflow-x-hidden.select-none.w-screen.h-\\[100dvh\\].backgroundImage > aside > nav > div > div:nth-child(2) > a:nth-child(2)");
    goToCombat.click();
  } else if (inFight != null && window.location.href.includes("OldSchoolIdle.html#/combat")) {
    var runButton = document.querySelector("#test > div.flex.flex-col.gap-2.mt-2 > div.containerWithCorners.relative.undefined > div > div.flex.flex-col.lg\\:flex-row > div.grid.h-fit.grid-cols-12.p-2.pb-0 > div.flex.flex-col.relative.self-center.h-full.py-1.lg\\:py-6.gap-2.w-full.lg\\:col-span-4.col-span-full.text-shadow.place-items-center > div.lg\\:mt-auto.flex.flex-col.gap-2.justify-center.items-center > button");
    runButton.click();
    await combatDelete();
  } else if (inFight == null) {
    var slayerButton = document.querySelector("#root > div.overflow-x-hidden.select-none.w-screen.h-\\[100dvh\\].backgroundImage > aside > nav > div > div:nth-child(3) > a");
    if (window.location.href.includes("OldSchoolIdle.html#/skills/Slayer")) {
      var nextTaskButton = document.querySelector("#root > div.overflow-x-hidden.select-none.w-screen.h-\\[100dvh\\].backgroundImage > div.overflow-x-hidden.select-none.w-screen.h-full > div.lg\\:max-w-5xl.mx-auto.px-2.sm\\:max-w-2xl.min-h-screen.lg\\:pb-6.pb-24.max-w-sm.w-full.flex.flex-col > div > div.text-shadow.flex.flex-col.gap-2.h-full.flex-grow > div.flex.flex-grow.flex-col.lg\\:flex-row.gap-2.relative > div.lg\\:w-56.w-full.max-h-\\[450px\\].items-center.box-shadow-xsmall.flex.flex-col.border-borderColor.border-4.bg-bgColor > div > div:nth-child(4) > button");
      if (nextTaskButton.disabled != true) {
        nextTaskButton.click();
      }
    } else {
      slayerButton.click();
    }
  }
}

function doSlayerFight() {
  var inFight = document.querySelector("#root > div.overflow-x-hidden.select-none.w-screen.h-\\[100dvh\\].backgroundImage > div.fixed.top-1.right-0.z-\\[100000\\].h-0 > div > div.relative > div.z-40.lg\\:space-y-1.space-y-1.pointer-events-auto.lg\\:w-40.w-32.text-shadow > div.w-full.cursor-pointer.relative > div:nth-child(1) > div > div > div > div.flex.justify-between.gap-1.text-center.items-center > div:nth-child(1) > img");
  if (inFight == null && window.location.href.includes("OldSchoolIdle.html#/skills/Slayer")) {
    var nextMonster = document.querySelector("#root > div.overflow-x-hidden.select-none.w-screen.h-\\[100dvh\\].backgroundImage > div.overflow-x-hidden.select-none.w-screen.h-full > div.lg\\:max-w-5xl.mx-auto.px-2.sm\\:max-w-2xl.min-h-screen.lg\\:pb-6.pb-24.max-w-sm.w-full.flex.flex-col > div > div.text-shadow.flex.flex-col.gap-2.h-full.flex-grow > div.w-full.items-center.flex.justify-center > div > div.bg-bgColor.relative.border-4.px-2.box-shadow-xsmall.border-borderColor.text-white.p-1.w-56.flex.flex-col.items-center > div > div > img");
    nextMonster.click();
  } else if (inFight == null && window.location.href.includes("OldSchoolIdle.html#/combat")) {
    var firstMonFight = document.querySelector("#test > div.flex.flex-col.gap-2.mt-2 > div.containerWithCorners.relative.flex-col > div.grid.lg\\:p-3.px-3.lg\\:grid-cols-5.sm\\:grid-cols-3.grid-cols-1.w-full.place-items-center.md\\:gap-2.gap-2.container-padding.h-fit > div:nth-child(1) > div > div.flex.gap-2.items-center.w-full.px-2.my-2 > button");
    firstMonFight.click();
  } else if (inFight != null && window.location.href.includes("OldSchoolIdle.html#/combat")) {
    var mainName = document.querySelector("#test > div.flex.flex-col.gap-2.mt-2 > div.containerWithCorners.relative.undefined > div > div.flex.flex-col.lg\\:flex-row > div.grid.h-fit.grid-cols-12.p-2.pb-0 > div.lg\\:col-span-4.col-span-full.items-center.flex.relative.flex-col > div > div.text-2xl.text-white.text-shadow > div");
    var listName = document.querySelector("#test > div.flex.flex-col.gap-2.mt-2 > div.containerWithCorners.relative.flex-col > div.grid.lg\\:p-3.px-3.lg\\:grid-cols-5.sm\\:grid-cols-3.grid-cols-1.w-full.place-items-center.md\\:gap-2.gap-2.container-padding.h-fit > div > div > div.text-xl.flex.gap-1.text-white.text-shadow-small > div");
    if (mainName.innerText.split('\n')[0] != listName.innerText.split('\n')[0]) {
      var firstMonFight = document.querySelector("#test > div.flex.flex-col.gap-2.mt-2 > div.containerWithCorners.relative.flex-col > div.grid.lg\\:p-3.px-3.lg\\:grid-cols-5.sm\\:grid-cols-3.grid-cols-1.w-full.place-items-center.md\\:gap-2.gap-2.container-padding.h-fit > div:nth-child(1) > div > div.flex.gap-2.items-center.w-full.px-2.my-2 > button");
      firstMonFight.click();
    }
  }
}

/*
 * Farming
 */
function doFarmingCheck() {
  var myCrops = document.querySelector("#root > div.overflow-x-hidden.select-none.w-screen.h-\\[100dvh\\].backgroundImage > div.fixed.top-1.right-0.z-\\[100000\\].h-0 > div > div.relative > div.z-40.lg\\:space-y-1.space-y-1.pointer-events-auto.lg\\:w-40.w-32.text-shadow").getElementsByClassName("containerWithCorners")
  var cropRes = 0;
  for (let i = 0; i < myCrops.length; i++) {
    var getCrops = myCrops[i].innerText.split('\n').filter(Boolean);
    if (getCrops[0] == "Herb Runs") {
      cropRes++;
    }
  }
  if(cropRes == 0) {
    plantCrops();
  } else if (cropRes > 0) {
    var numCrops = getCrops;
    numCrops.shift();
    numCrops = numCrops.length;
    checkHarvest(getCrops, numCrops);
  }
}

function checkHarvest(getCrops, numCrops) {
  if (numCrops == 12) {
    var lastCrop = getCrops[getCrops.length - 1];
    if (lastCrop == "Done") {
      if (!window.location.href.includes('skills/Farming')) {
        document.querySelector("#root > div.overflow-x-hidden.select-none.w-screen.h-\\[100dvh\\].backgroundImage > aside > nav > div > div:nth-child(1) > a:nth-child(16)").click();
      } else {
        document.querySelector("#root > div.overflow-x-hidden.select-none.w-screen.h-\\[100dvh\\].backgroundImage > div.overflow-x-hidden.select-none.w-screen.h-full > div.lg\\:max-w-5xl.mx-auto.px-2.sm\\:max-w-2xl.min-h-screen.lg\\:pb-6.pb-24.max-w-sm.w-full.flex.flex-col > div > div.flex.flex-col.justify-between.lg\\:flex-row.gap-4.relative > div.select-none.w-full.lg\\:min-w-\\[600px\\] > div.flex.justify-center.w-full > div > div.relative.bg-bgColorTertiary.container-shadow-small-no-hover.p-2.w-28.h-28.rounded-md > button > div > button").click();
      }
    }
  } else {
    document.querySelector("#Guam > div.absolute.top-14.right-1.w-fit.z-30.flex.bg-bgColor.container-shadow-small.rounded > div > div.relative.group.transition.duration-150.w-\\[48px\\].flex.items-center.justify-center.h-\\[37px\\].\\!w-10.\\!h-8.object-contain.\\!text-xs > div.relative.group.px-2.max-w-6.max-h-7.w-full.h-full.grid.place-items-center > img").click();
  }
}

function plantCrops() {
  if (!window.location.href.includes('skills/Farming')) {
    document.querySelector("#root > div.overflow-x-hidden.select-none.w-screen.h-\\[100dvh\\].backgroundImage > aside > nav > div > div:nth-child(1) > a:nth-child(16)").click();
  } else {
    document.querySelector("#Guam > div.absolute.top-14.right-1.w-fit.z-30.flex.bg-bgColor.container-shadow-small.rounded > div > div.relative.group.transition.duration-150.w-\\[48px\\].flex.items-center.justify-center.h-\\[37px\\].\\!w-10.\\!h-8.object-contain.\\!text-xs > div.relative.group.px-2.max-w-6.max-h-7.w-full.h-full.grid.place-items-center > img").click();
  }
}

/*
 * Prayer
 */

function doPrayerCheck() {
  var prayerLevel = Number(document.querySelector("#root > div.overflow-x-hidden.select-none.w-screen.h-\\[100dvh\\].backgroundImage > aside > nav > div > div:nth-child(2) > a:nth-child(8) > div.false > div > p.absolute.-bottom-\\[3px\\].right-\\[4px\\].false").innerText);
  if (prayerLevel >= 43) {
    document.querySelector("#sP_C7").disabled = false;
    if (document.querySelector("#sP_C7").checked) {
      managePrayer();
    }
  }
}

function managePrayer() {
  var pTab = document.querySelector("#root > div.overflow-x-hidden.select-none.w-screen.h-\\[100dvh\\].backgroundImage > div.flex.flex-col.w-fit.fixed.bottom-0.right-0.z-\\[10000\\].transition-all.delay-1000.duration-1000.duration-1000 > div.w-full.h-full.relative > div.flex.justify-center.relative > button:nth-child(7) > img");
  var pTabS = "data:image/png;base64,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";
  if (pTab.src != pTabS) {
    pTab.click()
  }
  var nextAtt = document.querySelector("#test > div.flex.flex-col.gap-2.mt-2 > div.containerWithCorners.relative.undefined > div > div.flex.flex-col.lg\\:flex-row > div.grid.h-fit.grid-cols-12.p-2.pb-0 > div.flex.flex-col.relative.self-center.h-full.py-1.lg\\:py-6.gap-2.w-full.lg\\:col-span-4.col-span-full.text-shadow.place-items-center > div.lg\\:absolute.lg\\:-translate-x-1\\/2.left-1\\/2.z-10.lg\\:-translate-y-1\\/2.lg\\:top-1\\/2.flex.items-center.justify-center.w-full.gap-4 > div > div.flex.lg\\:flex-col.gap-2 > div.flex.flex-col.\\!w-24.gap-1.justify-center.items-center.text-shadow-small > img");
  var nextAttType = "";
  if (nextAtt.src == "data:image/webp;base64,UklGRsgBAABXRUJQVlA4TLwBAAAvLUALEG+gJpKk6J7oBPyHBYQTE6MGFUTYUBRJUrOvM5AjL/ybwBICFEeSAa2bHMQk/1B4mf8AAIAuvAPQW3YzDnjqgo58d8+arP4bYxok19aeRtKvDPSamRPABLoqg+Ylc697mMdnGNLgmR3zzIp5VZ2M9P+/KoSI/jNw2zaOskC7jxj7hBAkVSRXEFsRdJcWnqL6ZS71agBCRch9JddLgkMvtq9c6SVx715i5ZnqzVTVlWdJPDyBRKovr1MDrCSFyNEhkvT/hm6orvTCr2+n1B3fH2zqByY9g6M+88QGdpbVM+5+RiG878cMr+piuR0z4KRg4O68GnFBdCQniiKbJhSzX0JR2eevvCzIOCdSkPJKTqSgbJuIKzUrlUgX4ikP1iTiELV1IlccBCeFAiqFJtB3cfD9i1AASM6J+ERMZA2CC8MjU7PtSJZBeWRmcppgEolU2+p24/Wp2UlsgHHlShfWNWyArFzpCOb45BhilI9kavXkEWyA9gjMTtYTRumIYbo204IY6SNqZWyCIEYHV3DItmpg8xkjiFh9c2hFxFHlfAjBQf3FwSAuK8/c+/mbLx0K6kCaE0GaEwI=") {
    nextAttType = "Ranged";
  } else if (nextAtt.src == "data:image/webp;base64,UklGRmABAABXRUJQVlA4TFMBAAAvGkAHEN/BIJKkRuQMLuDfv7w0a0NB20bOSb8Xkqfw/Nk8gZUyaBvJUe6+82fwMFsy/2EMxsZ7pfRLLvAB62LPVcoYYxU8nENKiHHlHZxDivAOzsE7xLBwDs7BO8SA2ibt23MeSO97Sfr/DyTySyKY+JIihCQCQoKIgEBShEBIEL6kgIRAoO//4DC2bdN5J7ZtJw/f/r//xsKTDiL6z8Bt20YuiO7b9wnBFgi+BQm6ZckryJb3dAAl8ix1PW7BsV/WIMS+rW7H3XqF35LA0Y/rab/d4KcsdI1S6q2BH/LXmFIfDXxVpO+1sgMAP2SRZ0kpjfc290PsO1oq24egGGkcECfMoqe7cSE4+qZZtrwqcDzrcZEQhGHo6vtZcu+/0R3dTgqCSq3e7o8huJTKleaETblaaczA6S8rAKkzXdBfdLM/nNBpdQfTPzKa8+mB/7H+aAkA" || nextAtt.src == "data:image/webp;base64,UklGRuIAAABXRUJQVlA4TNYAAAAvFIAHEPfAIJKkOEjAHlIx9f/ZY2JDbSOpESVQHv1HOHL2HSxS1LaR5GWwAG6Cy//RWc1/OMNZG89gRd/lewAM3/sAQOIfHsUEAEgAUrwG0OcTdOiTVlix8grxeO/gsI0kRZo6Zr572r3843ya1n8CEf1X2LZto1bo3r3ClICUIyLkzujD+TQiKBHfcNUQ1duxv6aYiytSygRKuk0dwm3d1rGr/dkf12XsqgIvuV+Woa2KjO+EcMzPmOIY2OcBN8UAMzcVPpOuQJMoaZsrrn0plQd+9LkN" || nextAtt.src == "data:image/webp;base64,UklGRiYBAABXRUJQVlA4TBkBAAAvFQAHEI+hqG0jaes58Cz/x5JbEgratpEu6R5eh/ooHQsGbRtJar3vcTysR+3mP8+Jc/re38yjK7qjOqpjOlR0x+5UFV+i/0vYWSJdExFQhJAICSWwAImEIiQWC5BYIBJKeO8Dh20kKdL2Md/zHzPz5Z/dw+6EENF/tW3bMEovU/IF+xcAjCA4thUgsG/LNAJi1mUa+hYQ1vM4dE1dAhDVfdtURZ4mENR/5Bym9c+VeVxzWOvqQ/chznsOY5e88g91GlUzbzG2dOWRtHmYdWAcbEOVbkEZRxUYD0uTg/OZvlMwQQRwD0PBTU1Nhvhh8HTl/4GCuUSCGF0VjIIpk+KFGG2Zhk4znza/2jTzdFDMd0jRdyzaNijGAAA=") {
    nextAttType = "Melee";
  } else if (nextAtt.src == "data:image/webp;base64,UklGRogBAABXRUJQVlA4THwBAAAvLcAKEE+gNpINOv0+yOUykQ4oaiMFWh/LjQAs4N8QPM00QAJd6EoNwjF/AzjnPwAAuHDgoR+31nx/slPTC5Jra4vDBjrg0+Bh+1MB+miAo88FOIkKyKQWUoLtpXdxvSBQCRH9nwB3DXh3JwD4GwKSATcgxWjwQwHczKYxpBjNJowEcDMzG0KKMVZ+hNu2WbRpIICR5DaWuJGMNqEPiU2zEbbjTbsZfE9IjV3RprFdyiNI5K6lkCOkBOQKHQGUgFJZV9oFFLHhO8oCFOXG1ANcxS4HOOgKHc712H2+J1zQbOorku5AlUnGKgAXasxINsEB8C7Ah4b0+fXMEwBnOAB4PU9Jy9f7/5/nikRDgIDj73me58MH3n4eR2Y0oEjScRyt1xeSZoCkLOnHcawf/95KJuOFyF2SPt+fSNJsa0msZxQymtlU7ZJU1dHMbPYoypSk3LCa8KFImXW09kbABUhSRTbIGd45QJJy1Qa8cy4AUCdqVweMencZerxrAw==") {
    nextAttType = "Magic";
  } else if (nextAtt.src == "data:image/webp;base64,UklGRvYAAABXRUJQVlA4TOkAAAAvIUAIECdAIEARBpjpuU0K2rZherGV/ViMh4CE8Ejmezf/AZBjp3/WwUEjW2H0goNHEAAvdcAZILf+TUGphYj+T4D2Hn1ObhJJPbkqkpJyMVKkjFzUpPQ4eelxkuqRnBQ7sT2Sl4pt7JEcegUb7JFyyAIvsEekIm3NgJ2iSDHgBXhEKf2AgeaoJ9ULaAtwSk9sAzSgjaLYePE6olTTLhz1eOFtTmiRUhdtwZxzQqReDYvf9j/E0K4UL2AeT/VTr/6Um2dTvOC3/Z9yqH7LoccLNqJjqoE5eV56qgGelJOSuuBJ9J6zbg+SBAA=" || nextAtt.src == "data:image/webp;base64,UklGRvIAAABXRUJQVlA4TOYAAAAvIUAIECdAkG0bG8OEdqITZhvHJjGenc8RZNvGZjSEXeHzHwD1f9tU4CAA2rAhDsqmoNRBuYPHv6nT3kJE/xm2bRtGUSFs/gQAMIi/x6vkL1fJitSFhwXwuYSTrEFdfg2K5NRzkRIp3eS0JN8c05YcVg7b1k6BArjtJdsSCwQoZ6yHYI3Asr1EDHJq214R1iClyLK9ngIla/u4h+CU14UYtB2f3fYiwLkj3d02gTFlb3+7uz8BZa8roLbtjkvmH2L4C2+8xDl8u7s/bwVTJwxGpM8lkrNj+SX1y8IRzm2/PBqSvL3weA==") {
    console.log("Dragon!");
  } else {
    console.log("Other!");
  }

  var pMagic = document.querySelector("#root > div.overflow-x-hidden.select-none.w-screen.h-\\[100dvh\\].backgroundImage > div.flex.flex-col.w-fit.fixed.bottom-0.right-0.z-\\[10000\\].transition-all.delay-1000.duration-1000.duration-1000 > div.w-\\[204px\\].self-center.h-\\[275px\\].relative > div > div.grid.grid-cols-5.p-3.pb-1.pt-4.gap-x-1.gap-y-2 > button:nth-child(16) > img");
  var pMagicB = document.querySelector("#root > div.overflow-x-hidden.select-none.w-screen.h-\\[100dvh\\].backgroundImage > div.flex.flex-col.w-fit.fixed.bottom-0.right-0.z-\\[10000\\].transition-all.delay-1000.duration-1000.duration-1000 > div.w-\\[204px\\].self-center.h-\\[275px\\].relative > div > div.grid.grid-cols-5.p-3.pb-1.pt-4.gap-x-1.gap-y-2 > button:nth-child(16) > div:nth-child(1) > div > img");
  var pRanged = document.querySelector("#root > div.overflow-x-hidden.select-none.w-screen.h-\\[100dvh\\].backgroundImage > div.flex.flex-col.w-fit.fixed.bottom-0.right-0.z-\\[10000\\].transition-all.delay-1000.duration-1000.duration-1000 > div.w-\\[204px\\].self-center.h-\\[275px\\].relative > div > div.grid.grid-cols-5.p-3.pb-1.pt-4.gap-x-1.gap-y-2 > button:nth-child(17) > img");
  var pRangedB = document.querySelector("#root > div.overflow-x-hidden.select-none.w-screen.h-\\[100dvh\\].backgroundImage > div.flex.flex-col.w-fit.fixed.bottom-0.right-0.z-\\[10000\\].transition-all.delay-1000.duration-1000.duration-1000 > div.w-\\[204px\\].self-center.h-\\[275px\\].relative > div > div.grid.grid-cols-5.p-3.pb-1.pt-4.gap-x-1.gap-y-2 > button:nth-child(17) > div:nth-child(1) > div > img");
  var pMelee = document.querySelector("#root > div.overflow-x-hidden.select-none.w-screen.h-\\[100dvh\\].backgroundImage > div.flex.flex-col.w-fit.fixed.bottom-0.right-0.z-\\[10000\\].transition-all.delay-1000.duration-1000.duration-1000 > div.w-\\[204px\\].self-center.h-\\[275px\\].relative > div > div.grid.grid-cols-5.p-3.pb-1.pt-4.gap-x-1.gap-y-2 > button:nth-child(18) > img");
  var pMeleeB = document.querySelector("#root > div.overflow-x-hidden.select-none.w-screen.h-\\[100dvh\\].backgroundImage > div.flex.flex-col.w-fit.fixed.bottom-0.right-0.z-\\[10000\\].transition-all.delay-1000.duration-1000.duration-1000 > div.w-\\[204px\\].self-center.h-\\[275px\\].relative > div > div.grid.grid-cols-5.p-3.pb-1.pt-4.gap-x-1.gap-y-2 > button:nth-child(18) > div:nth-child(1) > div > img");

  switch (nextAttType) {
    case "Magic":
      if (pMagic == null) pMagicB.click();
      break;
    case "Ranged":
      if (pRanged == null) pRangedB.click();
      break;
    case "Melee":
      if (pMelee == null) pMeleeB.click();
      break;
  }
}

/*
 * General Helpers
 */

function areDatesMoreThanFiveMinutesApart(date1) {
  const diff = Math.abs(Date.now() - date1.getTime()); // Get the difference in milliseconds
  const minutes = diff / 60000; // Convert the difference to minutes
  return minutes > 5;
}

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

/*
 * UI
 */

window.onclick = function(event) {
  if (event.target === document.getElementById("popup")) {
    document.getElementById("popup").style.display = "none";
  }
};

function checkUI() {
  var mainBtn = document.querySelector("#root > div.overflow-x-hidden.select-none.w-screen.h-\\[100dvh\\].backgroundImage > div.overflow-x-hidden.select-none.w-screen.h-full > div.fixed.top-2.left-24.z-50.\\32 xl\\:\\!flex > div.flex.flex-col.items-center.gap-2.text-center > div.grid.grid-cols-2.h-12.gap-1 > div:nth-child(1)");
  if (mainBtn != undefined && mainBtn != null) {
    clearInterval(runUIChk);
    addUI();
  }
}

function addUI() {
  var mainRow = document.querySelector("#root > div.overflow-x-hidden.select-none.w-screen.h-\\[100dvh\\].backgroundImage > div.overflow-x-hidden.select-none.w-screen.h-full > div.fixed.top-2.left-24.z-50.\\32 xl\\:\\!flex > div.flex.flex-col.items-center.gap-2.text-center > div.grid.grid-cols-2.h-12.gap-1");

  var div = document.createElement("div");
  div.className = "containerWithCornersButton !border !border-borderColor w-12 grid place-content-center &quot; h-12 justify-center";
  div.id = "myDiv";
  mainRow.appendChild(div);

  var img1 = document.createElement("img");
  img1.style.width = "6px";
  img1.style.height = "auto";
  img1.style.position = "absolute";
  img1.style.transform = "none";
  img1.style.left = "0px";
  img1.style.top = "0px";
  img1.alt = "";
  img1.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAB2SURBVBhXY2QAggkT6v//+f0XxEQBjCCJH99/MXz69BkqhABMIB0gCRUVJQZJSWmGV6/fMrx7945h1/ZdDExQRQzbd+xmWDhvPgMLMyPDmZNnGM5cuMUIl+TnF2AwMDGGS4DE4JIgcOHMWbgECMAl0SUYGBgYAAXdNHu6SjpVAAAAAElFTkSuQmCC";
  document.getElementById("myDiv").appendChild(img1);

  var img2 = document.createElement("img");
  img2.style.width = "6px";
  img2.style.height = "auto";
  img2.style.position = "absolute";
  img2.style.transform = "rotate(90deg)";
  img2.style.right = "0px";
  img2.style.top = "0px";
  img2.alt = "";
  img2.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAB2SURBVBhXY2QAggkT6v//+f0XxEQBjCCJH99/MXz69BkqhABMIB0gCRUVJQZJSWmGV6/fMrx7945h1/ZdDExQRQzbd+xmWDhvPgMLMyPDmZNnGM5cuMUIl+TnF2AwMDGGS4DE4JIgcOHMWbgECMAl0SUYGBgYAAXdNHu6SjpVAAAAAElFTkSuQmCC";
  document.getElementById("myDiv").appendChild(img2);

  var img3 = document.createElement("img");
  img3.style.width = "6px";
  img3.style.height = "auto";
  img3.style.position = "absolute";
  img3.style.transform = "rotate(-90deg)";
  img3.style.left = "0px";
  img3.style.bottom = "0px";
  img3.alt = "";
  img3.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAB2SURBVBhXY2QAggkT6v//+f0XxEQBjCCJH99/MXz69BkqhABMIB0gCRUVJQZJSWmGV6/fMrx7945h1/ZdDExQRQzbd+xmWDhvPgMLMyPDmZNnGM5cuMUIl+TnF2AwMDGGS4DE4JIgcOHMWbgECMAl0SUYGBgYAAXdNHu6SjpVAAAAAElFTkSuQmCC";
  document.getElementById("myDiv").appendChild(img3);

  var img4 = document.createElement("img");
  img4.style.width = "6px";
  img4.style.height = "auto";
  img4.style.position = "absolute";
  img4.style.transform = "rotate(180deg)";
  img4.style.right = "0px";
  img4.style.bottom = "0px";
  img4.alt = "";
  img4.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAB2SURBVBhXY2QAggkT6v//+f0XxEQBjCCJH99/MXz69BkqhABMIB0gCRUVJQZJSWmGV6/fMrx7945h1/ZdDExQRQzbd+xmWDhvPgMLMyPDmZNnGM5cuMUIl+TnF2AwMDGGS4DE4JIgcOHMWbgECMAl0SUYGBgYAAXdNHu6SjpVAAAAAElFTkSuQmCC";
  document.getElementById("myDiv").appendChild(img4);

  var imgL = document.createElement("img");
  imgL.addEventListener('click', function handleClick(event) {
    getUser();
  });
  imgL.className = "w-10 pt-1 object-contain cursor-pointer";
  imgL.alt = "logo";
  imgL.src = "data:image/png;base64,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";
  document.getElementById("myDiv").appendChild(imgL);

  addListener();

  var aboveRow = document.querySelector("#root > div.overflow-x-hidden.select-none.w-screen.h-\\[100dvh\\].backgroundImage > div.overflow-x-hidden.select-none.w-screen.h-full > div.fixed.top-2.left-24.z-50.\\32 xl\\:\\!flex > div.flex.flex-col.items-center.gap-2.text-center > div.grid.grid-cols-2.h-12.gap-1");

  var divB = document.createElement("div");
  divB.className = "containerWithCornersButton w-fit px-4 justify-center";
  divB.id = "mySettings";
  divB.addEventListener('click', function handleClick(event) {
    document.getElementById("popup").style.display = "block";
  });
  insertAfter(aboveRow, divB);

  var img1b = document.createElement("img");
  img1b.style.width = "9px";
  img1b.style.height = "auto";
  img1b.style.position = "absolute";
  img1b.style.transform = "none";
  img1b.style.left = "0px";
  img1b.style.top = "0px";
  img1b.alt = "";
  img1b.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAB2SURBVBhXY2QAggkT6v//+f0XxEQBjCCJH99/MXz69BkqhABMIB0gCRUVJQZJSWmGV6/fMrx7945h1/ZdDExQRQzbd+xmWDhvPgMLMyPDmZNnGM5cuMUIl+TnF2AwMDGGS4DE4JIgcOHMWbgECMAl0SUYGBgYAAXdNHu6SjpVAAAAAElFTkSuQmCC";
  document.getElementById("mySettings").appendChild(img1b);

  var img2b = document.createElement("img");
  img2b.style.width = "9px";
  img2b.style.height = "auto";
  img2b.style.position = "absolute";
  img2b.style.transform = "rotate(90deg)";
  img2b.style.right = "0px";
  img2b.style.top = "0px";
  img2b.alt = "";
  img2b.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAB2SURBVBhXY2QAggkT6v//+f0XxEQBjCCJH99/MXz69BkqhABMIB0gCRUVJQZJSWmGV6/fMrx7945h1/ZdDExQRQzbd+xmWDhvPgMLMyPDmZNnGM5cuMUIl+TnF2AwMDGGS4DE4JIgcOHMWbgECMAl0SUYGBgYAAXdNHu6SjpVAAAAAElFTkSuQmCC";
  document.getElementById("mySettings").appendChild(img2b);

  var img3b = document.createElement("img");
  img3b.style.width = "9px";
  img3b.style.height = "auto";
  img3b.style.position = "absolute";
  img3b.style.transform = "rotate(-90deg)";
  img3b.style.left = "0px";
  img3b.style.bottom = "0px";
  img3b.alt = "";
  img3b.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAB2SURBVBhXY2QAggkT6v//+f0XxEQBjCCJH99/MXz69BkqhABMIB0gCRUVJQZJSWmGV6/fMrx7945h1/ZdDExQRQzbd+xmWDhvPgMLMyPDmZNnGM5cuMUIl+TnF2AwMDGGS4DE4JIgcOHMWbgECMAl0SUYGBgYAAXdNHu6SjpVAAAAAElFTkSuQmCC";
  document.getElementById("mySettings").appendChild(img3b);

  var img4b = document.createElement("img");
  img4b.style.width = "9px";
  img4b.style.height = "auto";
  img4b.style.position = "absolute";
  img4b.style.transform = "rotate(180deg)";
  img4b.style.right = "0px";
  img4b.style.bottom = "0px";
  img4b.alt = "";
  img4b.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAB2SURBVBhXY2QAggkT6v//+f0XxEQBjCCJH99/MXz69BkqhABMIB0gCRUVJQZJSWmGV6/fMrx7945h1/ZdDExQRQzbd+xmWDhvPgMLMyPDmZNnGM5cuMUIl+TnF2AwMDGGS4DE4JIgcOHMWbgECMAl0SUYGBgYAAXdNHu6SjpVAAAAAElFTkSuQmCC";
  document.getElementById("mySettings").appendChild(img4b);

  var imgLb = document.createElement("img");
  imgLb.className = "w-8 h-8 object-contain";
  imgLb.alt = "";
  imgLb.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAUySURBVFiFpZdLbFRlFMd/55vbeZSZFqYPBYOWmBgi4oOFu6qF+EyKC1NCUIxNF0ReQjRloYuyEazGV6HowgdojUkjiSXgI6lVMcaVRqPBKCGIBey004czbefO3LnHRWm9nc69JXp29/v/5/z/3/ke5xvhKqL9hY8T0+HoRtAWV1gtIbP+0K77Lnk5m9vfWiGW9YXCryraO10o9vV1tmUWyy1B4PbDA3Ep2DsE2oGkB/rBrYjc1b2jKQvQ3PFm5ZJ8dAC405M4o9AdDbsH3+1oHffTsIIMmLz9DcJtZaA7xMl9sOOlk7vSY0Ou5s1hrziAQgLYlyuYB4Db/5MBhKIvpNKMFWpGQ8FlBCcINIE/VR0Jzr14qBKYI9iAyP82IJD+TwZ2dn22Cmgsm9QYYpVRqpfGSVTFiVVGMcZ3IRpbnju2KsDgzDGbikS+RsijMiKqaRXuBq73kqOxMHV1SeLVMYzMeE/9NVMk13WZzEwyPDyKnbNLdS4gfKVQI0qtQnjace7q62zLWADTkcgu4HYUQNGSyQhC/fIktXXV+J1cYwyJ6gSJ6jjp4TGGUyOozsHXo2yVuXxQGbJ2Ac/L9sMDcVOwzwM15UskrGy4hkTVkrLCsxUojUwmy8ULl7wmSiNdDMcaLOPYG/3EAeqXJ8uJpwX9yFU5B0wBa4FH8FxWiUScuvpaUkO++7gmlM9ttFBa/BjRaPhK2b2hR00x9NS2e2+c8I52vDPQLuHI64hsnR1L1iaZGM9g2wv2xEwm3BYLWONnoK4+yfw116NPrr/piXLcjtamceDx/T3fMmtCBGrrk1z883LZ/IKsMWLc9Sg/LgCNIV4d8w6lTTH0lJ/ZOYt5ezcwNvsdT8QRKbNxhR9DTmi96dr90GBl3m5EOOnFY9Hw3FG7EsdLy14uOlqbxhGOz34bI0RjkVL1k1MFp7Gn87FBA9C57+GMUyxs81KsilDJ1OSnxcTn0sM8rmXNbzlF0W2zrTr4Kp6X1b16ruo8ruJ/Fg3AMy9+tiQUso54gUKhpBGqrL1afRczj+uU5DKqR7Y+c2wJgOzs+nwFRfcEsM5LEmNYfXOD944fzYl1496mVb6PC4ADPaeX5aXiHOhSANdVfjtzFl1wI+n3OMVmQ9HtLxUHUNclk5n0DiVjrtMVJK6qYmMdmhWHmRtxoTiArMOy+g3IGb+EI6nxeeunwmNv9P/+XvfpP5aVcg/0nF62/4Pv3hdhy7+GIJ0aDfJ8Rna+9ukWlB4/xrXLa6ipW1o6PKZwXNU9m06NTincisoj3pkDpEdGfXvFTMijlmtF+kzBTuPTD4Yuj1IRsaiqinuHlwm0iRhPs5lf5szfWYb9+wBAuhiO9pnuHU1ZgZf9WIoyeD7FyPB44HGa4yuMDI8yeOFyUCcE5eXejk1ZCyBm211TkUgLUBQYdkXTotLIlQeJogxdTjM+lqGufimJqviCF1DRdclmJkmnRss1nwuicloNNaB1qoSmizMb2vcdteeVTxoc5EuEG0oxI0IkFiZcUUHqryEKjkPetnHdslP+A9e958ODrefLgb6326t7Hzwv8HU5zFVlespmYiJLJpMlN53zE0eQr/zEAw0AqFAbhF9NuKKBOQINCP/fgGhwjuAKBOJySoy7Ese5ToVT/jRCvthiBqIFuRthDzBUAv2Sz5ktXbsfGvyws+3SdMHZjCx41KSB/UUntyFIY5G/dTOx/fBAPJTPNauYFtBb3KJs6H76/j+9nM3Pvr0SDfUDP4tor1NReaK3Y1N2sdz/AKi2EDDvPdMNAAAAAElFTkSuQmCC";
  document.getElementById("mySettings").appendChild(imgLb);

  const newParagraph = document.createElement('p');
  newParagraph.textContent = 'Bot';
  document.getElementById('mySettings').appendChild(newParagraph);

  var settingPopup = document.createElement("div");
  settingPopup.className = "modal";
  settingPopup.id = "popup";
  settingPopup.style.display = "none";
  settingPopup.style.position = "fixed";
  settingPopup.style.zIndex = 1;
  settingPopup.style.left = 0;
  settingPopup.style.top = 0;
  settingPopup.style.width = "100%";
  settingPopup.style.height = "100%";
  settingPopup.style.overflow = "auto";
  settingPopup.style.backgroundColor = "rgba(0,0,0,0.5)";
  document.body.appendChild(settingPopup);

  var sP1 = document.createElement("div");
  sP1.className = "modal-content";
  sP1.id = "sP1";
  sP1.style.backgroundColor = "#fff";
  sP1.style.margin = "15% auto";
  sP1.style.padding = "20px";
  sP1.style.borderRadius = "8px";
  sP1.style.width = "300px";
  document.getElementById("popup").appendChild(sP1);

  //Gheet Updater and User Selector
  var sP1a = document.createElement("h3");
  sP1a.textContent = 'User Options:';
  document.getElementById("sP1").appendChild(sP1a);

  var sP_C1 = document.createElement("input");
  sP_C1.id = "sP_C1";
  sP_C1.type = "checkbox";
  var sP_L1 = document.createElement('label');
  sP_L1.id = "sP_L1";
  document.getElementById("sP1").appendChild(sP_L1);
  document.getElementById("sP_L1").appendChild(sP_C1);
  sP_L1.appendChild(document.createTextNode(" Refresh User"));
  document.getElementById("sP1").appendChild(document.createElement("br"));

  var sP_D1 = document.createElement("select");
  sP_D1.options.add(new Option("N/A"));
  sP_D1.options.add(new Option("Switch"));
  sP_D1.options.add(new Option("IronSwitch"));
  sP_D1.options.add(new Option("Malin"));
  sP_D1.options.add(new Option("Zunio"));
  document.getElementById("sP1").appendChild(sP_D1);
  document.getElementById("sP1").appendChild(document.createElement("br"));
  document.getElementById("sP1").appendChild(document.createElement("br"));

  //Skill Settings
  var sP1d = document.createElement("h3");
  sP1d.textContent = 'Skill Options:';
  document.getElementById("sP1").appendChild(sP1d);

  var sP_C5 = document.createElement("input");
  sP_C5.id = "sP_C5";
  sP_C5.type = "checkbox";
  var sP_L5 = document.createElement('label');
  sP_L5.id = "sP_L5";
  document.getElementById("sP1").appendChild(sP_L5);
  document.getElementById("sP_L5").appendChild(sP_C5);
  sP_L5.appendChild(document.createTextNode(" Auto Boost"));
  document.getElementById("sP1").appendChild(document.createElement("br"));
  document.getElementById("sP1").appendChild(document.createElement("br"));

  //Combat Settings
  var sP1b = document.createElement("h3");
  sP1b.textContent = 'Combat Options:';
  document.getElementById("sP1").appendChild(sP1b);

  var sP_C2 = document.createElement("input");
  sP_C2.id = "sP_C2";
  sP_C2.type = "checkbox";
  var sP_L2 = document.createElement('label');
  sP_L2.id = "sP_L2";
  document.getElementById("sP1").appendChild(sP_L2);
  document.getElementById("sP_L2").appendChild(sP_C2);
  sP_L2.appendChild(document.createTextNode(" Auto Combat"));
  document.getElementById("sP1").appendChild(document.createElement("br"));

  var sP_C7 = document.createElement("input");
  sP_C7.id = "sP_C7";
  sP_C7.type = "checkbox";
  sP_C7.disabled = true;
  var sP_L7 = document.createElement('label');
  sP_L7.id = "sP_L7";
  document.getElementById("sP1").appendChild(sP_L7);
  document.getElementById("sP_L7").appendChild(sP_C7);
  sP_L7.appendChild(document.createTextNode(" Auto Prayer"));
  document.getElementById("sP1").appendChild(document.createElement("br"));

  var sP_C3 = document.createElement("input");
  sP_C3.id = "sP_C3";
  sP_C3.type = "checkbox";
  var sP_L3 = document.createElement('label');
  sP_L3.id = "sP_L3";
  document.getElementById("sP1").appendChild(sP_L3);
  document.getElementById("sP_L3").appendChild(sP_C3);
  sP_L3.appendChild(document.createTextNode(" Combat Hide"));
  document.getElementById("sP1").appendChild(document.createElement("br"));
  document.getElementById("sP1").appendChild(document.createElement("br"));

  // Slayer Settings
  var sP1c = document.createElement("h3");
  sP1c.textContent = 'Slayer Options:';
  document.getElementById("sP1").appendChild(sP1c);

  var sP_C4 = document.createElement("input");
  sP_C4.id = "sP_C4";
  sP_C4.type = "checkbox";
  var sP_L4 = document.createElement('label');
  sP_L4.id = "sP_L4";
  document.getElementById("sP1").appendChild(sP_L4);
  document.getElementById("sP_L4").appendChild(sP_C4);
  sP_L4.appendChild(document.createTextNode(" Auto Slayer"));
  document.getElementById("sP1").appendChild(document.createElement("br"));
  document.getElementById("sP1").appendChild(document.createElement("br"));

  // Farming Settings
  var sP1d = document.createElement("h3");
  sP1d.textContent = 'Farming Options:';
  document.getElementById("sP1").appendChild(sP1d);

  var sP_C6 = document.createElement("input");
  sP_C6.id = "sP_C6";
  sP_C6.type = "checkbox";
  var sP_L6 = document.createElement('label');
  sP_L6.id = "sP_L6";
  document.getElementById("sP1").appendChild(sP_L6);
  document.getElementById("sP_L6").appendChild(sP_C6);
  sP_L6.appendChild(document.createTextNode(" Auto Farmer"));
  document.getElementById("sP1").appendChild(document.createElement("br"));
}
