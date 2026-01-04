// ==UserScript==
// @name Bugaw Crow v1.7
// @namespace Script Runner Pro
// @match https://marketplace.plantvsundead.com/*
// @grant none
// @description PVU tool
// @version 1.7
// @downloadURL https://update.greasyfork.org/scripts/432392/Bugaw%20Crow%20v17.user.js
// @updateURL https://update.greasyfork.org/scripts/432392/Bugaw%20Crow%20v17.meta.js
// ==/UserScript==

(function () {
  let loopCount = 0;
  let pvuAddress1 = "0x1B711fc8b1512EC9000B2333d2170B0BFdE7D767";
  let pvuAddress2 = "0x78828CbDC600ad774533BDC8D90D942769562481";

  let ayiiAddress1 = "0x5c992c938B9c1aCC19C16bd0bA62E81bF5a9428a";
  let ayiiAddress2 = "0x8d263e41B52Ffde7e74F39cF75ea5483F7F6274d";
  let ayiiAddress3 = "0xfE87288A9395d9E3375Cfc389B4e787C4143cf0A";
  let ayiiAddress4 = "0x98450cB40390C399d2D02a74271930b616a3886F";
  let ayiiAddress5 = "0xBd30e599400197189Dd2cBE7C4F1115812B62CbA";
  let ayiiAddress6 = "0x919e245dbAeB1641994F8943383fa644C8f96CA8";
  let ayiiAddress7 = "0xC114C91865C4F95af05da5931838715511c7D4ea";
  let ayiiAddress8 = "0x9b3B3E6338dF40E80856a7013F05E807dd037548";

  let josephAddress1 = "0xd826A6BbffD2517D3c20115418A7cf4c80FD2c32";
  let josephAddress2 = "0x0a9395d50E4c6df33e4fb94b2a42c7c0A93E7D6b";

  let accountConfig = [{"account_name":"PVU",
                        "audio_water":"https://v3-fastupload.s3-accelerate.amazonaws.com/1631261300-inbound5536131931256258941.mp3",
                        "audio_harvest":"https://v3-fastupload.s3-accelerate.amazonaws.com/1631322033-inbound3231320407696914066.mp3",
                        "public_addresses":[pvuAddress1]},
                      {"account_name":"PVU_Ryan",
                        "audio_water":"https://v3-fastupload.s3-accelerate.amazonaws.com/1631261300-inbound5536131931256258941.mp3",
                        "audio_harvest":"https://v3-fastupload.s3-accelerate.amazonaws.com/1631322033-inbound3231320407696914066.mp3",
                        "public_addresses":[pvuAddress2]},
                      {"account_name": "Ayii",
                       "audio_water": "https://v3-fastupload.s3-accelerate.amazonaws.com/1631261300-inbound5536131931256258941.mp3",
                       "audio_harvest": "https://v3-fastupload.s3-accelerate.amazonaws.com/1632449367-inbound6601521123306626137.mp3",
                       "public_addresses": [ayiiAddress1, ayiiAddress2, ayiiAddress3, ayiiAddress4, ayiiAddress5, ayiiAddress6, ayiiAddress7, ayiiAddress8]},
                      {"account_name": "Joseph",
                       "audio_water": "https://v3-fastupload.s3-accelerate.amazonaws.com/1631261300-inbound5536131931256258941.mp3",
                       "audio_harvest": "https://v3-fastupload.s3-accelerate.amazonaws.com/1632448379-inbound5325175864147564888.mp3",
                       "public_addresses": [josephAddress1, josephAddress2]}];
  
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
        let useCrow = document.querySelector("#__layout > div > div:nth-child(2) > div > div > div.sidebar.tw-hidden.sm\\:tw-flex.sm\\:tw-flex-col.tw-flex-grow-0.tw-flex-shrink-0.tw-w-48.tw-pt-4 > div:nth-child(2) > div > div:nth-child(5) > div.tw-hidden.sm\\:tw-flex > button");
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
