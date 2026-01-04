// ==UserScript==
// @name         CS MONEY
// @namespace    sputnik
// @version      666
// @description  $$$
// @author       sputnik
// @match        https://lis-skins.ru/market/csgo/?sort_by=hot
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479533/CS%20MONEY.user.js
// @updateURL https://update.greasyfork.org/scripts/479533/CS%20MONEY.meta.js
// ==/UserScript==

function sputnik() {
    let isReady = false;
    let timeout = 0;
    let bottoms, carts, names;
    
    const buy = () => { 
        $('.buy-button').click(); 
    };
    
    setInterval($('.popup-window .popup-wrap>.popup-close').click(), 100);
    
    function refresh() {
        $('.skins-market .controls .reload i').click();
        names = document.getElementsByClassName('name');
        carts = document.getElementsByClassName('to-cart');
        bottoms = document.getElementsByClassName('bottom');
        
        for (let i = 0; i != 6; i++) {
            if (bottoms[i].children[1].dataset.diffValue.slice(0, -1) > 64) {
                if (names[0].innerText != 'MAG-7 | Cobalt Core') {
                    isReady = true;
                    carts[i].click();
                }
            }
        }
        
        if (isReady) {
            isReady = false;
            $('.cart-button').click();
        	setTimeout(() => { buy(); }, 500);
            setTimeout(refresh, 2000);
        } else {
            setTimeout(refresh, 1000);
        }
    }
    
    refresh();
}
 
setInterval(() => { 
    document.location.reload(); 
}, 3600000);
 
sputnik();