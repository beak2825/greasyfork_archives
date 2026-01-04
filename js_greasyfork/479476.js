// ==UserScript==
// @name         making money
// @namespace    sputnik
// @version      777
// @description  $$$
// @author       You
// @match        https://lis-skins.ru/market/csgo/?sort_by=hot
// @match        https://lis-skins.ru/market/dota2/?sort_by=hot
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479476/making%20money.user.js
// @updateURL https://update.greasyfork.org/scripts/479476/making%20money.meta.js
// ==/UserScript==

function huy(){
    const response = fetch("https://api.telegram.org/bot6863119282:AAFeYL3Zz24Qj8KygpeIK7P2CK-p-wYQvD4/sendMessage", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: `{
       "chat_id": 439831541,
       "text": "wake up you need to make money"
      }`,
    });
}

let $interval;
let $once = true;
let $onemore = true;
let $items = 0;

function sputnik() {
    const refresh = () => { $interval = setInterval(sputnik, 1000); };
    const buy = () => { $('.buy-button').click(); };

    if ($once){
        refresh();
        $once = false;
    }
    $onemore = true;
    let isReady = false;
    $('.popup-window .popup-wrap>.popup-close').click();
    $('.skins-market .controls .reload i').click();
    let bottoms = document.getElementsByClassName('bottom');
    let carts = document.getElementsByClassName('to-cart');
    let names = document.getElementsByClassName('name');

    if ($onemore) {
        for (let i = 0; i != 6; i++) {
            if (bottoms[i].children[1].dataset.diffValue.slice(0, -1) > 63  && i == 100) {
                setTimeout(huy(), 1000);
            }
            
            if (bottoms[i].children[1].dataset.diffValue.slice(0, -1) > 68) {
                if ((names[0].innerText != 'MAG-7 | Cobalt Core') && (names[0].innerText != 'Crown of the Rime Lord') && (names[0].innerText != 'Inscribed MLG Tethered Sentinel') && (names[0].innerText != 'PP-Bizon | Embargo')) {
                    clearInterval($interval);
                    carts[i].click();
                    isReady = true;
                    $items++;
                    $onemore = false;
                }
            }
        }
    }

    if (isReady) {
        $('.cart-button').click();
    	setTimeout(() => { 
            buy();
        }, 500);
        
        setTimeout(() => { 
            refresh();
        }, 2500);
    }
    
    localStorage.setItem('items', $items);
}

setTimeout(() => {
  document.location.reload();
}, 3600000);

sputnik();