// ==UserScript==
// @name         ÖBA videolarını otomatik arkaplanda izle
// @namespace    https://greasyfork.org/tr/users/7610-boombooktr
// @version      6.2
// @description  ÖBA Videolarını, Bilgisayara Dokunmadan, Arka Arkaya, Arkaplanda İzlemenizi Sağlar
// @author       BoomBookTR
// @homepage     https://greasyfork.org/tr/scripts/479764
// @supportURL   https://greasyfork.org/tr/scripts/479764/feedback
// @match        https://www.oba.gov.tr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.tr
// @grant        none
// @license      GPL-2.0-only
// @downloadURL https://update.greasyfork.org/scripts/479764/%C3%96BA%20videolar%C4%B1n%C4%B1%20otomatik%20arkaplanda%20izle.user.js
// @updateURL https://update.greasyfork.org/scripts/479764/%C3%96BA%20videolar%C4%B1n%C4%B1%20otomatik%20arkaplanda%20izle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Sekme değiştiğinde
    window.onblur = () => {};
    // Sekme odaklandığında
    window.onfocus = () => {};

    var video = document.getElementById("video_html5_api");

// Video başlangıcında sesi minimuma indir
video.volume = 0.001;

// vjs-volume-panel öğesini bul ve kaldır
var volumePanel = document.querySelector('.vjs-volume-panel');
if (volumePanel) {
    volumePanel.parentNode.removeChild(volumePanel);
}



// Stil oluştur
var style = document.createElement('style');
style.innerHTML = `
    #muteButton {
        position: fixed;
        bottom: 10px; /* Sağ altta göstermek için bottom kullanın */
        right: 10px;
        padding: 5px;
        background-color: orange; /* Turuncu arka plan */
        cursor: pointer;
        color: #ffffff; /* Beyaz yazı rengi */
        display: flex;
        align-items: center;
        gap: 5px;
    }

    #popupContainer {
        position: fixed;
        bottom: 50px; /* Butonun hemen üstünde konumlandırmak için bottom değerini ayarlayın */
        right: 10px;
        background-color: orange; /* Turuncu arka plan */;
        color: #ffffff; /* Beyaz yazı rengi */
        padding: 5px;
        display: none;
        border: 1px solid #ddd;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2); /* Hafif gölge */
    }
`;

document.head.appendChild(style);

// Mute butonunu oluştur
var muteButton = document.createElement('div');
muteButton.id = 'muteButton';
muteButton.innerHTML = '🔇 Sesi aç';

// Sağ altta gösterilecek popup container'ı oluştur
var popupContainer = document.createElement('div');
popupContainer.id = 'popupContainer';

// Popup container'a uyarı mesajını iki satır halinde ekleyin
var popupMessage = document.createElement('div');
popupMessage.innerHTML = 'Player\'daki ses butonu kaldırıldı.<br>Ses açıp kapatmak için bu butonu kullanınız.';
popupContainer.appendChild(popupMessage);

// Sayfaya butonu ve popup container'ı ekle
document.body.appendChild(muteButton);
document.body.appendChild(popupContainer);

// Sayfa yüklendikten 2 saniye sonra baloncuk göster
setTimeout(function() {
    popupContainer.style.display = 'block';
}, 2000);

// Mute butonuna tıklanınca
muteButton.onclick = function() {
    // Video şu anda muted ise, unmute yap
    if (video.volume === 0.001) {
        video.volume = 1; // Sesi maksimuma çıkar
        muteButton.innerHTML = '🔊 Sessiz'; // Sessiz simgesi ve metin
    } else { // Video muted değilse, mute yap
        video.volume = 0.001; // Sesi minimuma indir
        muteButton.innerHTML = '🔇 Sesi aç'; // Sesli simgesi ve metin
    }

    // Popup container'ı göster
    popupContainer.style.display = 'block';
};

    // Sayfa yüklendikten 2 saniye sonra videoyu başlat.
    setTimeout(function() {
        video.play();
    }, 2000);

video.onended = function() {
    console.log("Video bitti, bir sonraki videoya geçiş kontrol ediliyor...");

    const icons = document.querySelectorAll('.material-icons');
    let shouldRedirect = false;

    icons.forEach(icon => {
        const text = icon.textContent.trim();
        const playableIcons = [
            'remove_circle_outline',
            'play_circle_outline',
            'timelapse',
            'radio_button_unchecked'
        ];

        if (playableIcons.includes(text)) {
            shouldRedirect = true;
        }
    });

        // Yönlendirme koşulu
        if (shouldRedirect) {
            // `"/egitim/detay/"` linkini `"/egitim/oynatma/"` olarak değiştirip yönlendirme
            const pageDepthLinks = document.querySelectorAll('.page-depth a');
            for (let link of pageDepthLinks) {
                const href = link.getAttribute('href');
                if (href.startsWith('/egitim/detay/')) {
                    const playURL = href.replace('/egitim/detay/', '/egitim/oynatma/');
                    setTimeout(function() {
                        window.location.href = playURL;
                    }, 5000); // 5 saniye sonra yönlendirme
                    break;
                }
            }
        } else {
            console.log("Tüm videolar tamamlandı, sayfa yenilenmeyecek.");
        }
    };

    // Sayfa 25 dakikadan uzunsa yenileyerek tazele
    setTimeout(function() {
        location.reload();
    }, 25 * 60 * 1000);
})();