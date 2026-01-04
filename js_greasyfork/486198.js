// ==UserScript==
// @name         Trader shortcuts
// @namespace    http://tampermonkey.net/
// @version      2024-01-29
// @description  Simple auction timer and shortcuts
// @license      MIT
// @author       You
// @match        https://*.ogame.gameforge.com/game/index.php?page=ingame&component=traderOverview*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gameforge.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486198/Trader%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/486198/Trader%20shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const KEY_J = 74;
    const KEY_K = 75;
    const KEY_N = 78;
    const KEY_M = 77;
    const KEY_SPACE = 32;

    let last_time = 0;
    let last_time_updated = new Date();

    let auction_info = null;
    let auction_timer = null;

    //parseInt(temp1.textContent.replace(/[^\d]+/g, ''))

    const diff = () => {
        const d = last_time*60 - parseInt((new Date() - last_time_updated) / 1_000);
        return Math.max(0, d);
    }

    const getTime = () => {
        if(auction_info) {
              const d = parseInt(auction_info.textContent.replace(/[^\d]+/g, ''))
              if(d > 60) {
                 return 0;
              }
              return d;
        }
        return 0;
    }

    setInterval(() => {
       if(auction_info) {
           const n = getTime();
           if(n != last_time) {
               last_time = n;
               last_time_updated = new Date();
           }
       }
       if(auction_timer) {
          auction_timer.innerHTML = diff();
       }
    }, 1000);

    const setAuctionTimer = () => {
       if(!auction_timer) {
           auction_timer = document.createElement('div');
           auction_info.after(auction_timer);
       }
    }

    const findAutionInfo = () => {
        auction_info = document.querySelector('.auction_info');
        if(!auction_info) {
            setTimeout(findAutionInfo, 1000);
        } else {
             setAuctionTimer();
        }
    };

    findAutionInfo();



    document.addEventListener('keydown', e => {

        const DeuteriumMore = document.querySelector('.js_sliderDeuteriumMore');
        const DeuteriumMax = document.querySelector('.js_sliderDeuteriumMax');
        const HonorMore = document.querySelector('.js_sliderHonorMore');
        const HonorMax = document.querySelector('.js_sliderHonorMax');

        const pay = document.querySelector('.pay');

        switch(e.keyCode) {
          case KEY_J: e.preventDefault(); DeuteriumMore.click(); break;
          case KEY_K: e.preventDefault(); DeuteriumMax.click(); break;
          case KEY_N: e.preventDefault(); HonorMore.click(); break;
          case KEY_M: e.preventDefault(); HonorMax.click(); break;
          case KEY_SPACE: e.preventDefault(); pay.click(); break;
        };
    });

})();