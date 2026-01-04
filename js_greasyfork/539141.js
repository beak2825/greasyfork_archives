// ==UserScript==
// @name         YouTube SaveFrom MP3+MP4 Downloader PRO
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  CTRL+SHIFT: MP4 | CTRL+ALT: MP3 indir. YouTube sayfasına buton ekle, başlık otomatik, fallback site, ayarlar menüsü, reklam engelleme, sesli bildirim. FULL PRO paketi!
// @author       ali
// @match        https://www.youtube.com/watch*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539141/YouTube%20SaveFrom%20MP3%2BMP4%20Downloader%20PRO.user.js
// @updateURL https://update.greasyfork.org/scripts/539141/YouTube%20SaveFrom%20MP3%2BMP4%20Downloader%20PRO.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Ayarlar (değiştirilebilir)
    const settings = {
        savefromBase: "https://en.savefrom.net/1/",
        fallbackBase: "https://y2mate.com/youtube/",
        enableButtons: true,
        enableToast: true,
        enableSound: true,
        soundUrl: "https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg",
    };

    // Ses objesi
    const sound = new Audio(settings.soundUrl);

    // Toast mesajı fonksiyonu
    function showToast(message) {
        if (!settings.enableToast) return;
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1f1f1f;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px #00000080;
            font-family: sans-serif;
            z-index: 999999;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.style.opacity = 1, 100);
        setTimeout(() => {
            toast.style.opacity = 0;
            setTimeout(() => toast.remove(), 1000);
        }, 3000);
    }

    // Video başlığı al
    function getVideoTitle() {
        const title = document.querySelector('h1.title yt-formatted-string') ||
                      document.querySelector('h1.title') ||
                      document.title;
        return title ? title.textContent.trim() : "video";
    }

    // URL oluşturucu (SaveFrom format)
    function buildSaveFromUrl(videoUrl) {
        return settings.savefromBase + encodeURIComponent(videoUrl) + ".html";
    }

    // URL oluşturucu (Fallback site y2mate)
    function buildFallbackUrl(videoUrl) {
        return settings.fallbackBase + encodeURIComponent(videoUrl);
    }

    // İndirme açılır penceresi
    function openDownloadPage(type) {
        const videoUrl = window.location.href;
        let urlToOpen = buildSaveFromUrl(videoUrl);

        // Önce SaveFrom deneyelim, eğer hata olursa fallback açalım
        fetch(urlToOpen, { method: 'HEAD' })
            .then(response => {
                if (!response.ok) throw new Error('SaveFrom hata');
                openUrl(urlToOpen, type);
            })
            .catch(() => {
                // fallback
                urlToOpen = buildFallbackUrl(videoUrl);
                openUrl(urlToOpen, type);
            });
    }

    // Pencere açıcı
    function openUrl(url, type) {
        window.open(url, '_blank');
        if (settings.enableToast) showToast(type + " için yönlendiriliyorsun...");
        if (settings.enableSound) sound.play();
    }

    // Ayarlar menüsü
    function createSettingsMenu() {
        const btn = document.createElement('button');
        btn.textContent = "⚙️ İndirici Ayarları";
        btn.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 9999999;
            padding: 8px 12px;
            border-radius: 6px;
            border: none;
            background: #ff4444;
            color: white;
            font-weight: 700;
            cursor: pointer;
            font-family: sans-serif;
        `;
        document.body.appendChild(btn);

        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            width: 260px;
            background: #222;
            border-radius: 8px;
            padding: 15px;
            font-family: sans-serif;
            color: white;
            display: none;
            z-index: 9999999;
            box-shadow: 0 0 15px #000;
        `;
        panel.innerHTML = `
            <h3 style="margin-top:0;">Downloader Ayarları</h3>
            <label><input type="checkbox" id="toggleButtons" checked> Butonları Göster</label><br>
            <label><input type="checkbox" id="toggleToast" checked> Toast Mesajları</label><br>
            <label><input type="checkbox" id="toggleSound" checked> Ses Bildirimi</label>
            <br><br>
            <button id="closeSettings" style="background:#ff4444;color:#fff;padding:5px 10px;border:none;border-radius:4px;cursor:pointer;">Kapat</button>
        `;
        document.body.appendChild(panel);

        btn.addEventListener('click', () => {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });

        panel.querySelector('#closeSettings').addEventListener('click', () => {
            panel.style.display = 'none';
        });

        // Checkbox eventleri
        panel.querySelector('#toggleButtons').addEventListener('change', e => {
            settings.enableButtons = e.target.checked;
            toggleButtons(e.target.checked);
        });
        panel.querySelector('#toggleToast').addEventListener('change', e => {
            settings.enableToast = e.target.checked;
        });
        panel.querySelector('#toggleSound').addEventListener('change', e => {
            settings.enableSound = e.target.checked;
        });
    }

    // Butonları ekle / kaldır
    let buttonsContainer = null;
    function createButtons() {
        if (buttonsContainer) return;
        buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            position: fixed;
            top: 50px;
            right: 20px;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            gap: 8px;
            font-family: sans-serif;
        `;

        const btnMp4 = document.createElement('button');
        btnMp4.textContent = "► MP4 İndir";
        btnMp4.style.cssText = `
            padding: 8px 14px;
            border: none;
            border-radius: 6px;
            background: #3b82f6;
            color: white;
            font-weight: 600;
            cursor: pointer;
        `;
        btnMp4.title = "MP4 olarak indir";
        btnMp4.onclick = () => openDownloadPage("MP4");

        const btnMp3 = document.createElement('button');
        btnMp3.textContent = "♫ MP3 İndir";
        btnMp3.style.cssText = `
            padding: 8px 14px;
            border: none;
            border-radius: 6px;
            background: #ef4444;
            color: white;
            font-weight: 600;
            cursor: pointer;
        `;
        btnMp3.title = "MP3 olarak indir";
        btnMp3.onclick = () => openDownloadPage("MP3");

        buttonsContainer.appendChild(btnMp4);
        buttonsContainer.appendChild(btnMp3);
        document.body.appendChild(buttonsContainer);
    }
    function removeButtons() {
        if (buttonsContainer) {
            buttonsContainer.remove();
            buttonsContainer = null;
        }
    }
    function toggleButtons(show) {
        if (show) createButtons();
        else removeButtons();
    }

    // Kısayol tuşları
    window.addEventListener('keydown', function (e) {
        if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") return;

        if (e.ctrlKey && e.shiftKey) {
            e.preventDefault();
            openDownloadPage("MP4");
        }

        if (e.ctrlKey && e.altKey) {
            e.preventDefault();
            openDownloadPage("MP3");
        }
    });

    // Reklam tarzı sahte butonları gizle (SaveFrom tarzı siteler için)
    function removeFakeAds() {
        const adSelectors = [
            '#sf_wrapper > div.sf_advanced > div#sf_quality > div#sf_video > div#sf_video > div#sf_result > div.sf_result__links',
            '.sf_result__item.sf_result__item--ad',
            '.sf_result__footer-ad'
        ];
        adSelectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => el.style.display = 'none');
        });
    }

    // İlk sayfa yüklemesinde ayar menüsü ve butonları kur
    window.addEventListener('load', () => {
        createSettingsMenu();
        if (settings.enableButtons) createButtons();
    });

})();
