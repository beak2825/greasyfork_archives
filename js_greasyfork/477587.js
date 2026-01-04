// ==UserScript==
// @name         jussstin
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  YouTube reklamlarını otomatik olarak atlar.
// @author       Asosyal
// @match        https://freebitco.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=omerbozdi.com.tr
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477587/jussstin.user.js
// @updateURL https://update.greasyfork.org/scripts/477587/jussstin.meta.js
// ==/UserScript==
// İstenilen düğmeye tıklanınca bu fonksiyon çağrılır
function clickBetLoButton() {
    // Rastgele sayı üret (0 ile 4749 arasında)
    const randomNumber = Math.floor(Math.random() * 4750);

    // Sonucu göster
    console.log("Üretilen rastgele sayı: " + randomNumber);

    // Eğer rastgele sayı 4750'den küçükse, tıklanan düğmeye bas
    if (randomNumber < 4750) {
        const betLoButton = document.getElementById('double_your_btc_bet_lo_button');
        if (betLoButton) {
            betLoButton.click();
        }
    }
}

// İstenilen düğme bulunur ve tıklama olayı dinlenir
const betLoButton = document.getElementById('double_your_btc_bet_lo_button');
if (betLoButton) {
    betLoButton.addEventListener('click', clickBetLoButton);
}
