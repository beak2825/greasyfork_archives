// ==UserScript==
// @name Bugaw Crow v3.0
// @namespace Script Runner Pro
// @match https://marketplace.plantvsundead.com/*
// @grant none
// @description PVU tool
// @version 3.0
// @downloadURL https://update.greasyfork.org/scripts/432091/Bugaw%20Crow%20v30.user.js
// @updateURL https://update.greasyfork.org/scripts/432091/Bugaw%20Crow%20v30.meta.js
// ==/UserScript==

(function () {
  let loopCount = 0;
  let accountConfig = [{"account_name":"PVU",
                        "audio_water":"https://v3-fastupload.s3-accelerate.amazonaws.com/1631261300-inbound5536131931256258941.mp3",
                        "audio_harvest":"https://v3-fastupload.s3-accelerate.amazonaws.com/1631322033-inbound3231320407696914066.mp3",
                        "public_addresses":["0x1B711fc8b1512EC9000B2333d2170B0BFdE7D767"]}];
  
  if (!window.accountConfig) {
    window.accountConfig = accountConfig;
  }
  function checkForCrow() {
    let plantCrow = document.querySelectorAll('img.tw-absolute.crow-icon');
    let uwakCount = 0;
    let uwakLocation = '';
    plantCrow.forEach((kruk) => {
         if (kruk.style.display == "") {
             uwakCount += 1;
             uwakLocation = kruk;
         }
     });
    if (uwakCount > 0) {
      return uwakLocation;
    }
    return uwakCount;
  }
  
  function getAudio(type) {
    let selectedAccount = {};
    accountConfig.some((account) => {
      let match = account.public_addresses.filter(address => address.toLowerCase() == getCurrentUser());
        if (!!match && match.length > 0) {
          selectedAccount = account;
          return !!match;
        }
    });

    if (!!selectedAccount && selectedAccount.hasOwnProperty(type)) {
        let audio = new Audio(selectedAccount[type]);
        return audio;
    }
  }
  
  function checkHarvest() {
    if(!document.querySelector("div.tw-flex.tw-flex-row.tw-flex-1.tw-gap-4.tw-justify-end > button").disabled) {
      // call harvest audio
      let harvestAudio = getAudio("audio_harvest");
      harvestAudio.play();
    }
  }
  
  function notifyDryWater() {
    let plantWaterCounts = document.querySelectorAll("span.small");
    for (let plantWaterCount in plantWaterCounts) {
      if (plantWaterCounts[plantWaterCount].innerHTML == "0") {
        // call water audio
        let waterAudio = getAudio("audio_water");
        waterAudio.play();
      }
    }
  }
   
  function getCurrentUser() {
    if (!!window.ethereum) {
      return ethereum.selectedAddress;
    } else {
      console.log(`%c No Metamask Installed`);
      return;
    }
  }
  
  setTimeout(() => {
    let crowLoop = setInterval(() => {
        let useCrow = document.querySelector("#__layout > div > div:nth-child(1) > div:nth-child(2) > div > div > div.sidebar.tw-hidden.sm\\:tw-flex.sm\\:tw-flex-col.tw-flex-grow-0.tw-flex-shrink-0.tw-w-48.tw-pt-4 > div:nth-child(2) > div > div:nth-child(5) > div.tw-hidden.sm\\:tw-flex > button");
        let crowLocation = checkForCrow();
        notifyDryWater();
        checkHarvest();
         if(crowLocation !== 0) {
          console.log(`%c Naay uwak`,'color:green');
          //bugawon
          crowLocation.click();
          setTimeout(() => {
            useCrow.click();
            clearInterval(crowLoop);
          }, 1000);
          setTimeout(() => {
            window.location.reload();
          }, 30000);
        } else {
          if (loopCount == 6) {
            window.location.reload();
          }
          console.log(`loop count: %c${loopCount}`, 'color:green');
        }
        loopCount++;
    }, 10000);
  }, 5000);
})()