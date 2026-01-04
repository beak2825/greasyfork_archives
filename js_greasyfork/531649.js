// ==UserScript==
// @name         Kitleleri Uyutma Aracı Engelleyici (drsn vers)
// @namespace    http://x.com/operagxturkiye
// @version      1.10
// @description  Bu eklenti, gündemi değiştirmek isteyen ve kitleleri uyutmak için ortaya çıkan gönderileri engellemek için tasarlanmıştır.
// @author       Opera GX Türkiye / dursunator
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Opera_GX_Icon.svg/2048px-Opera_GX_Icon.svg.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/531649/Kitleleri%20Uyutma%20Arac%C4%B1%20Engelleyici%20%28drsn%20vers%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531649/Kitleleri%20Uyutma%20Arac%C4%B1%20Engelleyici%20%28drsn%20vers%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #uaSettingsPanel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #1e1e2e;
            border: 1px solid #ff5555;
            border-radius: 12px;
            padding: 24px;
            z-index: 10001;
            width: 450px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
            color: #f8f8f2;
            display: none;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        #uaSettingsPanel h2 {
            text-align: center;
            margin-bottom: 20px;
            color: #ff5555;
            font-size: 24px;
            font-weight: 700;
        }

        #uaSettingsPanel label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #f8f8f2;
        }

        #uaSettingsPanel select, #uaSettingsPanel textarea {
            width: 100%;
            padding: 10px 12px;
            border-radius: 8px;
            border: 1px solid #44475a;
            background-color: #282a36;
            color: #f8f8f2;
            font-size: 14px;
            margin-bottom: 15px;
            transition: all 0.3s ease;
        }

        #uaSettingsPanel select:focus, #uaSettingsPanel textarea:focus {
            border-color: #ff5555;
            outline: none;
            box-shadow: 0 0 0 2px rgba(255, 85, 85, 0.3);
        }

        #uaSettingsPanel textarea {
            height: 120px;
            resize: vertical;
        }

        .ua-buttons-container {
            display: flex;
            justify-content: space-between;
            margin-top: 24px;
        }

        .ua-button {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s ease;
        }

        .ua-button-primary {
            background-color: #ff5555;
            color: #f8f8f2;
        }

        .ua-button-primary:hover {
            background-color: #ff6e6e;
            transform: translateY(-2px);
        }

        .ua-button-secondary {
            background-color: #44475a;
            color: #f8f8f2;
        }

        .ua-button-secondary:hover {
            background-color: #6272a4;
            transform: translateY(-2px);
        }

        .ua-shortcut-box {
            background-color: #282a36;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .ua-shortcut-title {
            font-weight: 600;
            color: #f8f8f2;
            margin-bottom: 8px;
        }

        .ua-shortcut-list {
            margin: 0;
            padding-left: 20px;
            color: #f8f8f2;
        }

        .ua-shortcut-list li {
            margin-bottom: 6px;
        }

        .ua-kbd {
            background-color: #44475a;
            color: #f8f8f2;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 12px;
            margin: 0 2px;
        }

        .ua-info {
            font-size: 12px;
            color: #bd93f9;
            margin-top: 5px;
            margin-bottom: 15px;
        }

        .ua-notification {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #50fa7b;
            color: #282a36;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10002;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            font-weight: 600;
            animation: fadeInOut 3s ease forwards;
        }

        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -20px); }
            10% { opacity: 1; transform: translate(-50%, 0); }
            90% { opacity: 1; transform: translate(-50%, 0); }
            100% { opacity: 0; transform: translate(-50%, -20px); }
        }

        .ua-section {
            margin-bottom: 20px;
        }

        .ua-section-title {
            font-weight: 600;
            margin-bottom: 10px;
            color: #8be9fd;
        }
    `);

    const defaultSettings = {
        filterMode: 'blur',
        customKeywords: '',
        isEnabled: true,
        shortcutsEnabled: true
    };

    let settings = GM_getValue('uaSettings', defaultSettings);

    const defaultKeywords = [
        "futbol", "maç", "morinyo", "mourinho", "#GSvFB", "#FBvGS",
        "derbi", "fener", "fenerbahçe", "galatasaray", "gs", "fb",
        "okan buruk", "osimhhen", "bjk"
    ];

    function getAllKeywords() {
        const customKeywords = settings.customKeywords
            .split(',')
            .map(keyword => keyword.trim().toLowerCase())
            .filter(keyword => keyword !== '');

        return [...defaultKeywords, ...customKeywords];
    }

    function redirectToOperaGX(event) {
        if (!settings.shortcutsEnabled) return;

        if (event.altKey && event.shiftKey && event.key === 'O') {
            window.open('https://www.opera.com/tr/gx', '_blank');
        } else if (event.altKey && event.shiftKey && event.key === 'I') {
            window.open('https://x.com/operagxturkiye', '_blank');
        } else if (event.altKey && event.shiftKey && event.key === 'K') {
            toggleSettingsPanel();
        }
    }

    document.addEventListener('keydown', redirectToOperaGX);

    const observer = new MutationObserver(() => {
        if (!settings.isEnabled) return;

        const keywords = getAllKeywords();
        document.querySelectorAll('article').forEach(article => {
            if (article.getAttribute('data-processed')) return;

            const tweetTextElement = article.querySelector('[data-testid="tweetText"]');
            if (!tweetTextElement) return;

            const textContent = tweetTextElement.innerText.toLowerCase();
            if (keywords.some(word => textContent.includes(word))) {
                if (settings.filterMode === 'blur') {
                    blurContent(article);
                } else {
                    hideContent(article);
                }

                article.setAttribute('data-processed', 'true');
            }
        });
    });

    function blurContent(article) {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';
        wrapper.style.width = '100%';

        const parent = article.parentNode;
        parent.replaceChild(wrapper, article);
        wrapper.appendChild(article);

        article.style.filter = 'blur(8px)';

        const overlay = document.createElement('div');
        overlay.innerText = '🚫 KİTLELERİ UYUTMA ARACI';
        overlay.style.position = 'absolute';
        overlay.style.top = '50%';
        overlay.style.left = '50%';
        overlay.style.transform = 'translate(-50%, -50%)';
        overlay.style.backgroundColor = 'rgba(255, 85, 85, 0.9)';
        overlay.style.color = 'white';
        overlay.style.padding = '10px 20px';
        overlay.style.fontSize = '16px';
        overlay.style.fontWeight = 'bold';
        overlay.style.zIndex = '10000';
        overlay.style.borderRadius = '8px';
        overlay.style.pointerEvents = 'none';
        overlay.style.textAlign = 'center';
        overlay.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        wrapper.appendChild(overlay);

        const clickOverlay = document.createElement('div');
        clickOverlay.style.position = 'absolute';
        clickOverlay.style.top = '0';
        clickOverlay.style.left = '0';
        clickOverlay.style.width = '100%';
        clickOverlay.style.height = '100%';
        clickOverlay.style.zIndex = '9999';
        clickOverlay.style.cursor = 'pointer';
        clickOverlay.title = 'İçeriği görmek için tıkla';

        clickOverlay.addEventListener('click', function(e) {
            e.stopPropagation();
            wrapper.removeChild(overlay);
            wrapper.removeChild(clickOverlay);
            article.style.filter = 'none';
        });

        wrapper.appendChild(clickOverlay);
    }

    function hideContent(article) {
        article.style.display = 'none';
    }

    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'uaSettingsPanel';

        panel.innerHTML = `
            <h2>Kitleleri Uyutma Aracı Ayarları</h2>

            <div class="ua-section">
                <div class="ua-section-title">Genel Ayarlar</div>
                <label for="uaEnabled">Eklenti Durumu:</label>
                <select id="uaEnabled">
                    <option value="true" ${settings.isEnabled ? 'selected' : ''}>Aktif</option>
                    <option value="false" ${!settings.isEnabled ? 'selected' : ''}>Pasif</option>
                </select>

                <label for="uaFilterMode">Filtreleme Modu:</label>
                <select id="uaFilterMode">
                    <option value="blur" ${settings.filterMode === 'blur' ? 'selected' : ''}>Bulanıklaştır</option>
                    <option value="hide" ${settings.filterMode === 'hide' ? 'selected' : ''}>Tamamen Gizle</option>
                </select>

                <label for="uaShortcutsEnabled">Klavye Kısayolları Aktif:</label>
                <select id="uaShortcutsEnabled">
                    <option value="true" ${settings.shortcutsEnabled ? 'selected' : ''}>Aktif</option>
                    <option value="false" ${!settings.shortcutsEnabled ? 'selected' : ''}>Pasif</option>
                </select>
            </div>

            <div class="ua-section">
                <div class="ua-section-title">Anahtar Kelimeler</div>
                <label for="uaCustomKeywords">Özel Anahtar Kelimeler (virgülle ayırın):</label>
                <textarea id="uaCustomKeywords">${settings.customKeywords}</textarea>
                <div class="ua-info">Not: Eklentide zaten bulunan anahtar kelimeler: ${defaultKeywords.join(', ')}</div>
            </div>

            <div class="ua-shortcut-box">
                <div class="ua-shortcut-title">Klavye Kısayolları:</div>
                <ul class="ua-shortcut-list">
                    <li><span class="ua-kbd">Alt</span> + <span class="ua-kbd">Shift</span> + <span class="ua-kbd">K</span>: Ayarlar panelini aç/kapat</li>
                    <li><span class="ua-kbd">Alt</span> + <span class="ua-kbd">Shift</span> + <span class="ua-kbd">O</span>: Opera GX sayfasını aç</li>
                    <li><span class="ua-kbd">Alt</span> + <span class="ua-kbd">Shift</span> + <span class="ua-kbd">I</span>: Opera GX Türkiye sayfasını aç</li>
                </ul>
            </div>

            <div class="ua-buttons-container">
                <button id="uaSaveButton" class="ua-button ua-button-primary">Kaydet</button>
                <button id="uaCloseButton" class="ua-button ua-button-secondary">Kapat</button>
            </div>
        `;

        document.body.appendChild(panel);

        document.getElementById('uaSaveButton').addEventListener('click', saveSettings);
        document.getElementById('uaCloseButton').addEventListener('click', function() {
            document.body.removeChild(panel);
        });

        return panel;
    }

    function saveSettings() {
        const newSettings = {
            filterMode: document.getElementById('uaFilterMode').value,
            customKeywords: document.getElementById('uaCustomKeywords').value,
            isEnabled: document.getElementById('uaEnabled').value === 'true',
            shortcutsEnabled: document.getElementById('uaShortcutsEnabled').value === 'true'
        };

        settings = newSettings;
        GM_setValue('uaSettings', settings);

        document.querySelectorAll('[data-processed]').forEach(el => {
            el.removeAttribute('data-processed');

            if (el.style.filter) {
                el.style.filter = 'none';

                const parent = el.parentNode;
                if (parent && parent.parentNode && parent.tagName === 'DIV') {
                    const grandParent = parent.parentNode;
                    grandParent.replaceChild(el, parent);
                }
            }

            if (el.style.display === 'none') {
                el.style.display = '';
            }
        });

        showNotification('Ayarlar kaydedildi ve uygulandı!');

        const panel = document.getElementById('uaSettingsPanel');
        if (panel) {
            document.body.removeChild(panel);
        }

        observer.disconnect();
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function toggleSettingsPanel() {
        let panel = document.getElementById('uaSettingsPanel');

        if (panel) {
            document.body.removeChild(panel);
        } else {
            panel = createSettingsPanel();
            panel.style.display = 'block';
        }
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'ua-notification';
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(function() {
            document.body.removeChild(notification);
        }, 3000);
    }

    GM_registerMenuCommand('⚙️ Ayarları Aç', toggleSettingsPanel);
    GM_registerMenuCommand('🔄 Yenile', function() {
        location.reload();
    });
    GM_registerMenuCommand('🌐 Opera GX Sayfasına Git', function() {
        window.open('https://www.opera.com/tr/gx', '_blank');
    });
    GM_registerMenuCommand('🐦 Opera GX Türkiye X Hesabı', function() {
        window.open('https://x.com/operagxturkiye', '_blank');
    });
    GM_registerMenuCommand('🐦 Dursunator Profiline Git', function() {
        window.open('https://x.com/dursunator', '_blank');
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();