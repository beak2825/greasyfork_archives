// ==UserScript==
// @name         WarBot by Whispers
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  WarBot Panel
// @author       whispers
// @match        *://m.rivalregions.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530696/WarBot%20by%20Whispers.user.js
// @updateURL https://update.greasyfork.org/scripts/530696/WarBot%20by%20Whispers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // @version bilgisini al
    var scriptVersion = '1.5';  // Bu değeri @version kısmından manuel olarak al

    // Panel için gerekli stil ve HTML yapısı
    var panelHTML = `
    <div id="drag-panel" style="position: absolute; top: 100px; left: 100px; width: 250px; height: 250px; background: rgba(0, 0, 0, 0.5); border-radius: 15px; padding: 0; cursor: move; z-index: 9999; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2); backdrop-filter: blur(10px); transition: height 1s ease, opacity 1s ease;">
        <div id="panel-header" style="cursor: move; background-color: rgba(128, 128, 128, 0.8); padding: 10px; border-radius: 15px 15px 0 0; display: flex; justify-content: space-between; align-items: center; animation: colorChange 20s infinite;">
            <h3 style="margin: 0; font-family: 'Roboto', sans-serif; color: white;">WarBot ${scriptVersion}</h3>
            <button id="toggle-btn" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 0 10px; transition: transform 0.2s;">
                −
            </button>
        </div>
        <div id="panel-content" style="display: block; margin-top: 15px; font-family: 'Roboto', sans-serif; font-size: 14px; opacity: 1; height: auto; overflow: hidden; transition: opacity 1s ease, height 1s ease; padding: 10px; max-height: 150px; overflow-y: scroll;">
        </div>
    </div>
    `;

    // Google Fonts'tan Roboto fontunu sayfaya ekler
    var fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    document.body.insertAdjacentHTML('beforeend', panelHTML);

    var dragPanel = document.getElementById('drag-panel');
    var panelContent = document.getElementById('panel-content');
    var toggleBtn = document.getElementById('toggle-btn');
    var isDragging = false;
    var offsetX, offsetY;

    // Panel sekmesi
    toggleBtn.addEventListener('click', function() {
        if (panelContent.style.opacity === '1' && panelContent.style.height !== '0px') {
            // Paneli küçültme
            panelContent.style.opacity = '0'; // İçeriği kaybet
            panelContent.style.height = '0px'; // Yüksekliği sıfırla
            toggleBtn.textContent = '+';
            dragPanel.style.height = '50px'; // Panelin tamamını küçült
        } else {
            // Paneli genişletme
            panelContent.style.opacity = '1'; // İçeriği göster
            panelContent.style.height = 'auto'; // İçeriğin yüksekliğini eski haline getir
            toggleBtn.textContent = '−';
            dragPanel.style.height = '250px'; // Panelin tam yüksekliğini geri getir
        }
    });

    // Paneli sadece başlık kısmından sürüklemek
    var panelHeader = document.getElementById('panel-header');
    var mobMenu = document.getElementById('mob_menu');

    panelHeader.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - dragPanel.getBoundingClientRect().left;
        offsetY = e.clientY - dragPanel.getBoundingClientRect().top;
        dragPanel.style.cursor = 'grabbing';
        dragPanel.style.transition = 'none'; // Sürükleme sırasında geçişi kaldır
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            var newX = e.clientX - offsetX;
            var newY = e.clientY - offsetY;
            
            // Sayfa sınırlarını hesaba kat
            var maxX = window.innerWidth - dragPanel.offsetWidth;
            var maxY = window.innerHeight - dragPanel.offsetHeight;
            
            // Panelin ekran dışına çıkmaması için sınırları ayarla
            newX = Math.min(Math.max(0, newX), maxX);
            newY = Math.min(Math.max(0, newY), maxY);

            // mob_menu sınırlarını kontrol et
            var mobMenuRect = mobMenu.getBoundingClientRect();
            if (
                newX + dragPanel.offsetWidth > mobMenuRect.left &&
                newX < mobMenuRect.right &&
                newY + dragPanel.offsetHeight > mobMenuRect.top &&
                newY < mobMenuRect.bottom
            ) {
                return; // Eğer mob_menu sınırlarına çarptıysa sürüklemeyi durdur
            }
            
            dragPanel.style.left = newX + 'px';
            dragPanel.style.top = newY + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        dragPanel.style.cursor = 'move';
        dragPanel.style.transition = 'transform 0.3s ease'; // Sürükleme bittiğinde geçişi tekrar ekle
    });

    // Mobil uyumluluk için dokunmatik
    panelHeader.addEventListener('touchstart', function(e) {
        isDragging = true;
        offsetX = e.touches[0].clientX - dragPanel.getBoundingClientRect().left;
        offsetY = e.touches[0].clientY - dragPanel.getBoundingClientRect().top;
        dragPanel.style.cursor = 'grabbing';
        dragPanel.style.transition = 'none';
    });

    document.addEventListener('touchmove', function(e) {
        if (isDragging) {
            var newX = e.touches[0].clientX - offsetX;
            var newY = e.touches[0].clientY - offsetY;

            // Sayfa sınırlarını hesaba kat
            var maxX = window.innerWidth - dragPanel.offsetWidth;
            var maxY = window.innerHeight - dragPanel.offsetHeight;

            // Panelin ekran dışına çıkmaması için sınırları ayarla
            newX = Math.min(Math.max(0, newX), maxX);
            newY = Math.min(Math.max(0, newY), maxY);

            // mob_menu sınırlarını kontrol et
            var mobMenuRect = mobMenu.getBoundingClientRect();
            if (
                newX + dragPanel.offsetWidth > mobMenuRect.left &&
                newX < mobMenuRect.right &&
                newY + dragPanel.offsetHeight > mobMenuRect.top &&
                newY < mobMenuRect.bottom
            ) {
                return; // Eğer mob_menu sınırlarına çarptıysa sürüklemeyi durdur
            }

            dragPanel.style.left = newX + 'px';
            dragPanel.style.top = newY + 'px';
        }
    });

    document.addEventListener('touchend', function() {
        isDragging = false;
        dragPanel.style.cursor = 'move';
        dragPanel.style.transition = 'transform 0.3s ease';
    });

})();

// CSS RGB Animasyonu
var style = document.createElement('style');
style.innerHTML = `
@keyframes colorChange {
    0% { color: rgb(255, 0, 0); }
    25% { color: rgb(0, 255, 0); }
    50% { color: rgb(0, 0, 255); }
    75% { color: rgb(255, 255, 0); }
    100% { color: rgb(255, 0, 255); }
}

#panel-header h3 {
    animation: colorChange 20s infinite; /* Hızı burada 20 saniyeye çıkardık */
}
`;
document.head.appendChild(style);