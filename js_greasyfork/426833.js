// ==UserScript==
// @name         Repartidor
// @namespace    http://tampermonkey.net/
// @version      0.26
// @description  repartidor para RFQA
// @author       DanielG
// @match        https://tester.rainforestqa.com/tester/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426833/Repartidor.user.js
// @updateURL https://update.greasyfork.org/scripts/426833/Repartidor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...


    var minG = 0; var segG = 0; var minL = 0; var segL = 0; var page; var previnst = ''; var tim; var wObserver

     function updateChrono(){
         var stepNumbers = document.querySelectorAll('div[class*="steps_stepHolder"] > div');
         var lastNumber = stepNumbers[stepNumbers.length - 1].innerHTML;
         var stpwrapper = page.querySelector('#stepHolder');
         var instxt = stpwrapper.querySelector('#currentStep');
         var iunderstandbtn = document.querySelector(".buttons_primary_1Kiei.buttons_default_3R_Eb.buttons_wide_2eMjB")
         var audio = new Audio('https://notificationsounds.com/storage/sounds/file-sounds-1093-hold-on.mp3');

         segG++; segL++;
         if(segG == 59){
             minG++;
             segG = 0;
         }

         if(iunderstandbtn){
             iunderstandbtn.click()
         }

         var screenShotBtn = document.getElementsByClassName("actions_takeScreenshot_27qBr buttons_primary_1Kiei buttons_default_3R_Eb")[0];
         if((screenShotBtn && previnst >= '1') || (minL>='3' && screenShotBtn && segL <= 5)){
             audio.play();
         }

         if(minL>='4' && instxt.textContent != lastNumber) {
             var yesBtn = document.getElementsByClassName("flagStep_yesWithSIBtn_3gWGG buttons_success_1B-Tw buttons_default_3R_Eb buttons_wide_2eMjB")[0]
             yesBtn.click()
         }
         if(instxt.textContent == lastNumber && minL>='4'){
             window.onbeforeunload = undefined;
             var loc = window.location; window.location=loc;
         }

         if(segL == 59){
             minL++;
             segL = 0;
         }
    }


    function wrapperobs(){
        var stpwrapper = page.querySelector('#stepHolder');
        var instxt = stpwrapper.querySelector('#currentStep');
      if(instxt){
        if(instxt.textContent != previnst){
          previnst = instxt.textContent;
          minL = 0;
          segL = 0;
        }
      }
      else console.log('No se encontro el paso...')
    }

    setTimeout(function(){
      page = document.querySelector('#page');
        if(page){
          const pobs = new MutationObserver(function(){
            var stpwrapper = page.querySelector('#stepHolder');
            if(stpwrapper){
              console.log('Step Holder found and listening.');
              wrapperobs();
              wObserver = new MutationObserver(wrapperobs);
              wObserver.observe(stpwrapper, {subtree: true, childList: true, characterData: true});
              tim = setInterval(updateChrono, 1000);
              this.disconnect();
            }
            else console.log("didn't find the step holder.");
          });
          pobs.observe(page, {subtree: true, childList: true});
          console.log('page found and listening.');
        }
        else console.log('Something weird happened.');
       }
     , 1000);

})();