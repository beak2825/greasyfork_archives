// ==UserScript==
// @name         Bot Guclendirici
// @version      1.0
// @description  Sorun Giderici, Bot Güçlendirici Menü!
// @match        https://pixelplace.io/*
// @exclude      https://pixelplace.io/forums*
// @exclude      https://pixelplace.io/blog*
// @exclude      https://pixelplace.io/api*
// @exclude      https://pixelplace.io/gold-chart.php
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.js
// @require      https://greasyfork.org/scripts/461063-mxo-li-brary/code/MXO%20L%C4%B0BRARY.js
// @require      https://greasyfork.org/scripts/461221-mxobot-hacktimer-js-by-turuslan/code/MxoBot%20HackTimerjs%20By%20Turuslan.js
// @namespace    https://i.imgur.com/gLazoQg.png
// @downloadURL https://update.greasyfork.org/scripts/485760/Bot%20Guclendirici.user.js
// @updateURL https://update.greasyfork.org/scripts/485760/Bot%20Guclendirici.meta.js
// ==/UserScript==

/* globals $, toastr */

// Fonksiyon: Menüyü oluştur
function createMenu() {
    var menuContainer = document.createElement('div');
    menuContainer.style.position = 'fixed';
    menuContainer.style.top = '10px';
    menuContainer.style.right = '10px';
    menuContainer.style.padding = '10px';
    menuContainer.style.background = 'linear-gradient(#f4f4f4, #d4d4d4)';
    menuContainer.style.borderRadius = '10px';
    menuContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    menuContainer.style.display = 'none';

    var buttonStyle = 'background: linear-gradient(#fff, #e0e0e0);' +
                      'border: 1px solid #ccc;' +
                      'border-radius: 5px;' +
                      'padding: 8px 12px;' +
                      'margin: 5px;' +
                      'cursor: pointer;' +
                      'font-weight: bold;' +
                      'outline: 2px solid black;';

    var button1 = document.createElement('button');
    button1.textContent = 'Bot Güçlendirme';
    button1.setAttribute('style', buttonStyle);
    button1.addEventListener('click', function() {
        // Bot Güçlendirme butonuna tıklandığında yapılacak işlemler
        alert('Bot Güçlendirme seçildi.');
    });

    var button2 = document.createElement('button');
    button2.textContent = 'Sorun Giderici';
    button2.setAttribute('style', buttonStyle);
    button2.addEventListener('click', function() {
        // Sorun Giderici butonuna tıklandığında yapılacak işlemler
        alert('Sorun Giderici seçildi.');
    });

    // Menü konteynırına butonları ekle
    menuContainer.appendChild(button1);
    menuContainer.appendChild(button2);
    document.body.appendChild(menuContainer);

    // Belirli bir site açıldığında menüyü göster
    if (window.location.href.includes('https://pixelplace.io/')) {
        menuContainer.style.display = 'block';
    }
}

// Sayfa yüklendiğinde menüyü oluştur
createMenu();
