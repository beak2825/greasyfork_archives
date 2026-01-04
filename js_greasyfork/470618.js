// ==UserScript==
// @name         FireDeluxe
// @version      2.23
// @description  Userscript para o site https://animefire.plus/
// @author       Mikill (discord: mikill9150)
// @match        *://*.animefire.*/*
// @match        *://animefire.*/*
// @include      *://*animefire*
// @icon         data:image/webp;base64,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
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/470618/FireDeluxe.user.js
// @updateURL https://update.greasyfork.org/scripts/470618/FireDeluxe.meta.js
// ==/UserScript==

(function() {
    'use strict';
const versao = "2.23";
document.cookie = "firedeluxe_versao=" + versao + "; path=/; expires=Tue, 07 Jul 2099 00:00:00 GMT";
})();
(function() {
    'use strict';
    const versao = "2.23";
    document.cookie = "firedeluxe_versao=" + versao + "; path=/; expires=Tue, 07 Jul 2099 00:00:00 GMT";
    
    const dbName = 'FireDeluxeDB';
    const dbVersion = 1;
    const storeName = 'scripts';
    
    const openDB = () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, dbVersion);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName);
                }
            };
        });
    };
    
    const getFromDB = async (key) => {
        try {
            const db = await openDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([storeName], 'readonly');
                const store = transaction.objectStore(storeName);
                const request = store.get(key);
                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve(request.result);
            });
        } catch (error) {
            return null;
        }
    };
    
    const setInDB = async (key, value) => {
        try {
            const db = await openDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([storeName], 'readwrite');
                const store = transaction.objectStore(storeName);
                const request = store.put(value, key);
                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve();
            });
        } catch (error) {}
    };
    
    const showModal = (title, content, isError = false, actionUrl = null) => {
        const existingModal = document.querySelector('.modal-overlay');
        if (existingModal) existingModal.remove();
        const modal = document.createElement('div');
        modal.className = 'modal-panel';
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        const themeColor = getThemeColor();
        modal.innerHTML = `
            <div class="modal-header">
                <h3>${title}</h3>
            </div>
            <div class="modal-content">
                <p>${content}</p>
            </div>
            <div class="modal-buttons">
                ${actionUrl ? `
                    <a href="${actionUrl}" target="_blank" class="update-button">
                        Atualizar
                    </a>` : ''}
                <button class="close-button">
                    OK
                </button>
            </div>
        `;
        const style = document.createElement('style');
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0,0,0,0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            }
            .modal-panel {
                background-color: #222;
                border: 1px solid ${isError ? '#FF4444' : themeColor};
                border-radius: 8px;
                width: 90%;
                max-width: 400px;
                color: #EEE;
            }
            .modal-header {
                padding: 15px;
                border-bottom: 1px solid #333;
            }
            .modal-header h3 {
                margin: 0;
                color: ${isError ? '#FF4444' : themeColor};
                text-align: center;
                font-size: 1.2em;
            }
            .modal-content {
                padding: 20px;
                text-align: center;
                line-height: 1.6;
            }
            .modal-content p {
                margin: 0;
                color: #EEE;
            }
            .modal-buttons {
                display: flex;
                justify-content: center;
                gap: 10px;
                padding: 15px;
                border-top: 1px solid #333;
            }
            .update-button, .close-button {
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                border: none;
                transition: all 0.2s;
                font-size: 0.9em;
            }
            .update-button {
                background-color: ${themeColor};
                color: #000 !important;
                text-decoration: none;
            }
            .update-button:hover {
                background-color: ${adjustColor(themeColor, 20)};
            }
            .close-button {
                background-color: #444;
                color: #FFF !important;
            }
            .close-button:hover {
                background-color: #555;
            }
        `;
        overlay.appendChild(modal);
        document.body.appendChild(style);
        document.body.appendChild(overlay);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target.classList.contains('close-button')) {
                overlay.remove();
            }
        });
    };
    
    const getThemeColor = () => {
        const savedSettings = localStorage.getItem('firedeluxe_configuracoes');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            return settings.themeColor || '#FFA500';
        }
        return '#FFA500';
    };
    
    const adjustColor = (color, amount) => {
        return '#' + color.replace(/^#/, '').replace(/../g, color => {
            const newColor = Math.min(255, Math.max(0, parseInt(color, 16) + amount));
            return ('0' + newColor.toString(16)).slice(-2);
        });
    };
    
    const getOrangeColors = () => {
        return ['#FFA500', '#fb7f40', 'rgb(255, 165, 0)', 'rgba(255, 165, 0'];
    };
    
    const imageHasOrange = async (imageUrl) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const img = await createImageBitmap(blob);
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 40) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                if ((r > 200 && g > 100 && g < 180 && b < 50) ||
                    (r > 240 && g > 100 && g < 140 && b > 50 && b < 90)) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            return false;
        }
    };
    
    const recolorImage = async (imageUrl, newColor) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = imageUrl;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                ctx.globalCompositeOperation = 'source-in';
                ctx.fillStyle = newColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.globalCompositeOperation = 'source-over';
                resolve(canvas.toDataURL());
            };
            img.onerror = () => resolve(imageUrl);
        });
    };
    
    const escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };
    
    const hexToRgbValues = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r}, ${g}, ${b}`;
    };
    
    const processImageUrls = async (code) => {
        const themeColor = getThemeColor();
        const imageRegex = /(https?:\/\/[^'"\s]+\.(png|jpg|jpeg|webp|gif))|(data:image\/[^;]+;base64,[^'"\s]+)/gi;
        let matches;
        const processedUrls = {};
        while ((matches = imageRegex.exec(code)) !== null) {
            const imageUrl = matches[0];
            if (!processedUrls[imageUrl]) {
                try {
                    const hasOrange = await imageHasOrange(imageUrl);
                    if (hasOrange) {
                        const recoloredUrl = await recolorImage(imageUrl, themeColor);
                        code = code.replace(new RegExp(escapeRegExp(imageUrl), 'g'), recoloredUrl);
                        processedUrls[imageUrl] = recoloredUrl;
                    }
                } catch (error) {}
            } else {
                code = code.replace(new RegExp(escapeRegExp(imageUrl), 'g'), processedUrls[imageUrl]);
            }
        }
        return code;
    };
    
    const replaceThemeColors = async (code) => {
        const themeColor = getThemeColor();
        const orangeColors = getOrangeColors();
        orangeColors.forEach(orangeColor => {
            if (orangeColor.startsWith('rgb')) {
                const rgbValues = orangeColor.includes('rgba') ?
                    orangeColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),/) :
                    orangeColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                if (rgbValues) {
                    const rgbString = `rgb(${rgbValues[1]}, ${rgbValues[2]}, ${rgbValues[3]})`;
                    const rgbaPartialString = `rgba(${rgbValues[1]}, ${rgbValues[2]}, ${rgbValues[3]},`;
                    code = code.replace(new RegExp(escapeRegExp(rgbString), 'g'), `rgb(${hexToRgbValues(themeColor)})`);
                    code = code.replace(new RegExp(escapeRegExp(rgbaPartialString), 'g'), `rgba(${hexToRgbValues(themeColor)},`);
                }
            } else {
                code = code.replace(new RegExp(escapeRegExp(orangeColor), 'g'), themeColor);
            }
        });
        code = await processImageUrls(code);
        return code;
    };
    
    const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgb(${r}, ${g}, ${b})`;
    };
    
    const applyThemeToExistingElements = () => {
        const themeColor = getThemeColor();
        const orangeColors = getOrangeColors();
        document.querySelectorAll('*').forEach(element => {
            const style = getComputedStyle(element);
            orangeColors.forEach(orangeColor => {
                if (orangeColor.startsWith('rgb')) {
                    if (style.color === orangeColor) {
                        element.style.color = themeColor;
                    }
                    if (style.backgroundColor === orangeColor) {
                        element.style.backgroundColor = themeColor;
                    }
                    if (style.borderColor === orangeColor) {
                        element.style.borderColor = themeColor;
                    }
                } else {
                    if (style.color === hexToRgb(orangeColor)) {
                        element.style.color = themeColor;
                    }
                    if (style.backgroundColor === hexToRgb(orangeColor)) {
                        element.style.backgroundColor = themeColor;
                    }
                    if (style.borderColor === hexToRgb(orangeColor)) {
                        element.style.borderColor = themeColor;
                    }
                }
            });
        });
    };
    
    const processElementImages = async () => {
        const themeColor = getThemeColor();
        const elementsToProcess = ['#PCimgShare', '#PCytShare', '#btnEnviarPchat', '.navbar-brand img', 'div#button-manager-container'];
        for (const selector of elementsToProcess) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                if (!element) continue;
                if (element.src && !element.dataset.processed) {
                    try {
                        const hasOrange = await imageHasOrange(element.src);
                        if (hasOrange) {
                            const recoloredUrl = await recolorImage(element.src, themeColor);
                            element.src = recoloredUrl;
                            element.dataset.processed = 'true';
                        }
                    } catch {}
                }
                const bgImage = getComputedStyle(element).backgroundImage;
                if (bgImage && bgImage !== 'none') {
                    const url = bgImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                    try {
                        const hasOrange = await imageHasOrange(url);
                        if (hasOrange) {
                            const recoloredUrl = await recolorImage(url, themeColor);
                            element.style.backgroundImage = `url(${recoloredUrl})`;
                        }
                    } catch {}
                }
                if (element.innerHTML.includes('<svg')) {
                    const svgContent = element.innerHTML;
                    const updatedSvg = await replaceThemeColors(svgContent);
                    if (updatedSvg !== svgContent) {
                        element.innerHTML = updatedSvg;
                    }
                }
            }
        }
        const btnManager = document.querySelector('#button-manager-container');
        if (btnManager) {
            const imgs = btnManager.querySelectorAll('img');
            for (const img of imgs) {
                if (img.src.startsWith('data:image') && !img.dataset.processed) {
                    pintarImagemBase64(img);
                }
            }
        }
    };
    
    const pintarImagem = (url, callback) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = url + '?' + Date.now();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            ctx.globalCompositeOperation = 'source-in';
            ctx.fillStyle = getThemeColor();
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            callback(canvas.toDataURL('image/png'));
        };
    };
    
    const pintarImagemBase64 = (imgElement) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            ctx.globalCompositeOperation = 'source-in';
            ctx.fillStyle = getThemeColor();
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            imgElement.src = canvas.toDataURL('image/png');
            imgElement.dataset.processed = 'true';
        };
        img.src = imgElement.src;
    };
    
    const pintarImagensBase64Extras = () => {
        document.querySelectorAll('img.mr-1.pb-1').forEach(img => {
            if (!img.dataset.processed) pintarImagemBase64(img);
        });
    };
    
    const pintarImagemDoBotao = (id) => {
        const btn = document.getElementById(id);
        if (!btn) return;
        const bg = getComputedStyle(btn).backgroundImage;
        const match = bg.match(/url\(["']?(.*?)["']?\)/);
        if (!match) return;
        const url = match[1];
        pintarImagem(url, novaImg => {
            btn.style.backgroundImage = `url(${novaImg})`;
        });
    };
    
    const pintarLogo = () => {
        const logo = document.querySelector('.navbar-brand img');
        if (!logo || !logo.src) return;
        pintarImagem(logo.src, novaImg => {
            logo.src = novaImg;
        });
    };
    
    const verifyAndExecute = async (profileLink) => {
        const scriptKey = 'firedeluxe_userscript';
        let code = await getFromDB(scriptKey);

        if (code) {
            try {
                const script = document.createElement('script');
                script.textContent = code;
                document.body.appendChild(script);
                applyThemeToExistingElements();
            } catch (e) {}
        }

        try {
            const scriptResponse = await fetch('https://raw.githubusercontent.com/Mikill73/FireDeluxe/main/Mod/Userscript.js');
            if (scriptResponse.ok) {
                let newCode = await scriptResponse.text();
                newCode = await replaceThemeColors(newCode);
                await setInDB(scriptKey, newCode);
            }
        } catch (e) {}
    };
    
    const checkProfileAndExecute = () => {
        const profileLink = document.querySelector('a.meu-perfil[href^="/users/"]');
        verifyAndExecute(profileLink || { getAttribute: () => null });
    };
    
    checkProfileAndExecute();
    ['btnEnviarPchat', 'PCimgShare', 'PCytShare'].forEach(pintarImagemDoBotao);
    pintarLogo();
    pintarImagensBase64Extras();
})();