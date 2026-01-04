// ==UserScript==
// @name         MyDealz
// @namespace    http://tampermonkey.net/
// @version      0.1.7 Added tg notification and get deer name
// @description  deer grabber. You need to add botid and chatid to use telegram notification feature.
// @author       You
// @match        https://www.mydealz.de/*
// @run-at document-body
// @grant       window.focus
// @downloadURL https://update.greasyfork.org/scripts/391534/MyDealz.user.js
// @updateURL https://update.greasyfork.org/scripts/391534/MyDealz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.keyPress = true;
    window.URL = "https://www.mydealz.de/";
    scan();
    findDeals();
    //doScroll();

    async function detectDeer() {
    const notifi = document.querySelector('.mc-notification.zIndex--fixed');
    if (notifi) {
      console.log('GOTCHA NOTIFI', notifi);
      const spans = notifi.querySelectorAll('span');
      for (let i = 0; i < spans.length; i++) {
        const e = spans[i];
        const text = e.innerText.toLowerCase();
        if (text.includes('fange') && text.includes('mich')) {
          e.click();
          window.keyPress = false;
          await Sleep(2000);
          let msg = document.querySelector('.mc-notification.zIndex--fixed .size--all-l') ? document.querySelector('.mc-notification.zIndex--fixed .size--all-l').innerText + '.' : 'Gotcha!';
          console.log('%cGOTCHA', 'font-size:42px; color:green;', msg);
          console.log('%c'+msg, 'font-size:30px; color:green;');
          var notification = new Notification(msg);
          const tgChatId = null;
          const botId = null;
          if ((tgChatId !== null) && (botId !==null)) {
            fetch(`https://api.telegram.org/${botId}/sendMessage?chat_id=${tgChatId}&text=${encodeURI(msg)}`).then((val) => {
              console.log('Send to TG')
            });
          }
          var today = new Date();
          var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
          console.log(time);
          await Sleep(5700);
          window.keyPress = true;
          backToHomeScreen();
        }
      }
    }
  }

    async function findDeals() {
        await Sleep(40000);
        const deals = [...document.querySelectorAll('a')].filter(e => e.href.includes('mydealz.de/deals/'));
        console.log(window.location.href);
        if(window.location.href != window.URL) {
            backToHomeScreen();
        } else {
            if (deals.length == 0) {
                backToHomeScreen();
            } else {
                var rand = deals[Math.floor(Math.random() * deals.length)];
                rand.click();
                console.log('Picked', rand);
            }
        }
    }

    async function scan() {
        var i= 0;
    while(window.keyPress) {
            await Sleep(500);
            if((++i % 10) == 0) {
                console.log('Still scanning',i)
            };
            detectDeer();
        }
    }

    async function doScroll() {
        while(window.keyPress) {
            window.scrollBy({
                top: window.innerHeight,
                left: 0,
                behavior: 'smooth'
            });
            await Sleep(2000);
        }
    }

    // key down
    document.addEventListener('keydown', logKey);

    function logKey(e) {
        console.log('logKeyFunction',e.code);
        if (e.which == 27) {
            window.keyPress = !window.keyPress;
            scan();
        }
    }

    function Sleep(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    function backToHomeScreen() {
        //var a = document.createElement('a');
        //a.href = window.URL;
        //a.click();
        window.location.href = window.URL;
        console.log('%cBack to home screen', 'font-size:20px; color:red;');
    }

})();