// ==UserScript==
// @name         Sites da Moon (Pescador de Cripto)
// @namespace    https://pescadordecripto.com/
// @version      0.1
// @description  Auto Roll
// @author       Jadson Tavares
// @match        *://moonbitcoin.cash/faucet
// @match        *://moonbit.co.in/faucet
// @match        *://moonliteco.in/faucet
// @match        *://moondoge.co.in/faucet
// @match        *://moondash.co.in/faucet
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412103/Sites%20da%20Moon%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/412103/Sites%20da%20Moon%20%28Pescador%20de%20Cripto%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

// MoonCash, MoonDash
$(document).ready(function(){
    setTimeout(function(){
        if ($('.btn.btn-coin.btn-lg').is(':visible')) {
            $('.btn.btn-coin.btn-lg').trigger('click');

            setTimeout(function(){
                $('.d-none').trigger('click');
            },25000);

            setTimeout(function(){
                if ($('.btn.btn-coin').is(':visible')) {
                    $('.btn.btn-coin').trigger('click');
                }
            },28000);
        }

        // Reload Page MoonCash, MoonDash
        setInterval(function() {
            if (window.location.href.indexOf("moonbitcoin.cash") > -1) {
                window.history.go(0);
            }
            if (window.location.href.indexOf("moondash.co.in") > -1) {
                window.history.go(0);
            }
        }, 3000000); //50 min


    },1000);
});

// MoonBitcoin, MoonGogecoin, MoonLitecoin
$(document).ready(function(){
    setTimeout(function(){
        if ($('#SubmitButton').is(':visible')) {
            $('#SubmitButton').trigger('click');

            // MoonBitcoin
            setTimeout(function(){
                if ($('#Xd33222Hl').is(':hidden')) {
                    $('#Xd33222Hl').trigger('click');
                }
            },25000);

            // MoonDoge
            setTimeout(function(){
                if ($('#Pook6HBN').is(':visible')) {
                    $('#Pook6HBN').trigger('click');
                }
            },25000);

            // MoonLite
            setTimeout(function(){
                if ($('#OHnn4FFjV').is(':visible')) {
                    $('#OHnn4FFjV').trigger('click');
                }
            },25000);


        }
    },1000);

    // Reload Page MoonLite
    setInterval(function(){
        if (window.location.href.indexOf("moonliteco.in") > -1) {
            window.history.go(0);
        }
    }, 1200000); //20 min

    // Reload Page MoonDoge
    setInterval(function(){
        if (window.location.href.indexOf("moondoge.co.in") > -1) {
            window.history.go(0);
        }
    }, 1800000); //30 min

    // Reload Page MoonBitcoin
    setInterval(function(){
        if (window.location.href.indexOf("moonbit.co.in") > -1) {
            window.history.go(0);
        }
    }, 3600000); //60 min
});
})();