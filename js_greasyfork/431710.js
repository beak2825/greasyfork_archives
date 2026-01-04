// ==UserScript==
// @name            Genshin Impact & Honkai Impact & Honkai: Star Rail & ZZZ Auto Daily Check-In
// @namespace       Genshin
// @description     Genshin Impact & Honkai Impact & Honkai: Star Rail & Zenless Zone Zero Auto Daily Check-In. Pin daily tab and collect rewards every day you open your browser.
// @author          NightLancerX
// @match           https://webstatic-sea.mihoyo.com/ys/event/signin-*
// @match           https://webstatic-sea.hoyolab.com/ys/event/signin-*
// @match           https://act.hoyolab.com/ys/event/signin-sea-*
// @match           https://act.hoyolab.com/bbs/event/signin-bh3*
// @match           https://act.hoyolab.com/bbs/event/signin/hkrpg*
// @match           https://act.hoyolab.com/bbs/event/signin/zzz*
// @icon            https://webstatic-sea.mihoyo.com/favicon.ico
// @version         2.4
// @license         MIT License
// @grant           none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/431710/Genshin%20Impact%20%20Honkai%20Impact%20%20Honkai%3A%20Star%20Rail%20%20ZZZ%20Auto%20Daily%20Check-In.user.js
// @updateURL https://update.greasyfork.org/scripts/431710/Genshin%20Impact%20%20Honkai%20Impact%20%20Honkai%3A%20Star%20Rail%20%20ZZZ%20Auto%20Daily%20Check-In.meta.js
// ==/UserScript==

(function(){
    'use strict';
    const REDUCE_OUTPUT = true; //this may help reduce captcha frequency

    let badge;
    setTimeout(function(){
        badge = document.querySelector('[class*=actived-day') ||
                document.querySelector('[class*=signday]') ||
                [...document.querySelector('[class*=components-pc-assets-__prize-list]')?.firstChild.childNodes||[]].filter(e => e.style.backgroundImage.match(/\d+(?=.png)/g) == '6285576485616685271')?.[0]||
					      [...document.querySelector('[class*=components-pc-assets-__prize-list]')?.firstChild.childNodes||[]].filter(e => e.style.backgroundImage.match(/\d+(?=.png)/g) == '3353871917298254056')?.[0];
        if (badge){
          badge.click();
          setTimeout(checkCloseButton, 5000 + Math.random()*2000);
          checkLogin() || setTimeout(checkCaptcha, 2000);
        }
        else if (!REDUCE_OUTPUT) console.log('No badge item');

    }, 12000 + Math.random()*6000);

    function checkCloseButton(){
      let closeBtn = document.querySelector('[class*=---dialog-close]');
      if (closeBtn){
        closeBtn.click();
        if (!REDUCE_OUTPUT) console.log('Checked');
      }
      else{
        if (!REDUCE_OUTPUT) console.log('No close button');
        //let notification = new Notification('Genshin Auto Daily Check-In: can`t verify redeeming, probable delayed captcha');
      }
    }

    function checkLogin(){
      if (document.querySelector('.mhy-account-flow-login')){
        //request initial permission if not granted
        if (Notification.permission != 'granted'){
          document.querySelector('.login-btn').onclick = function(){Notification.requestPermission()};
        }

        //notify afterwards [if granted]
        if (Notification.permission != 'denied'){
          let notification = new Notification('Genshin Auto Daily Check-In: logging required')
        }
        else console.info('Notifications are disabled');

        return true;
      }
    }

    function checkCaptcha(){
      if (document.querySelector('[class^=geetest')){
        let notification = new Notification('Genshin Auto Daily Check-In: completing captcha required')
      }
    }
})();