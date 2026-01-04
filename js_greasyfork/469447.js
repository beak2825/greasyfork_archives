// ==UserScript==
// @name         Clicks Coin
// @namespace    http://tampermonkey.net/
// @version      0.101
// @description  Clickscoin BTC
// @author       Crypto Invest
// @match        https://clickscoin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=clickscoin.com
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.close
// @grant        GM_openInTab
// @grant        window.onurlchange
// @grant        GM_xmlhttpRequest
// @license Crypto BR
// @downloadURL https://update.greasyfork.org/scripts/469447/Clicks%20Coin.user.js
// @updateURL https://update.greasyfork.org/scripts/469447/Clicks%20Coin.meta.js
// ==/UserScript==
//FAZ LOGIN
let botaoClicado = false; // define uma variável para controlar se o botão foi clicado ou não
let botaoClicadoclick = false; // define uma variável para controlar se o botão foi clicado ou não
//FAZ FAUCET
const interval1o6 = setInterval(() => {
    if (document.querySelector('button[data-bs-target="#claimModal"]') && !botaoClicado) {
        document.querySelector('button[data-bs-target="#claimModal"]').click()
        botaoClicado = true; // atualiza a variável para indicar que o botão foi clicado
        clearInterval(interval1o6); // interrompe o intervalo
    }
}, 2000);
const interval1o7 = setInterval(() => {
    if (document.querySelector('.modal-footer button.cmn-btn') && !botaoClicadoclick) {
        if (unsafeWindow.grecaptcha && unsafeWindow.grecaptcha.getResponse().length > 0 || document.querySelector(".h-captcha > iframe") && document.querySelector(".h-captcha > iframe").getAttribute("data-hcaptcha-response").length > 0)
         {document.querySelector('.modal-footer button.cmn-btn[type="submit"]').click()
          botaoClicadoclick = true; // atualiza a variável para indicar que o botão foi clicado
          clearInterval(interval1o7); // interrompe o intervalo
         }
    }
}, 2000);
//Redirecionamento
setInterval (() => {
    if (window.location.href.includes("https://clickscoin.com/faucet") && document.getElementById('clock'))
    {
        location.reload(true);
    }},50000)
setInterval(() => {
        location.reload(true);
    }, 160000);
setInterval (() => {
    if (document.body.innerHTML.includes("You reached the maximum daily claims")) {
       window.close()
    }
}, 5000);

setInterval (() => {
const rows = document.querySelectorAll('.col-xl-3');
const rowsToRemove = Array.from(rows).filter(row => {
 const searchText = ['EARNNOW',
                     'SHORTSFLY',
                     'LINKS FLY.INC',
                     'COINSPARTY',
                     'LINKSLY',
                     'SHORTANO',
                     'PROMO-VISITS',
                     '1SHORT',
                     'FIRE-LINK'
                    ];
  return searchText.some(text => row.textContent.includes(text));
});

rowsToRemove.forEach(row => {
  row.remove();
});

},10)