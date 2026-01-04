// ==UserScript==
// @name                YouTube Shorts URL Conversion Button
// @name:zh-TW          YouTube Shorts URL 轉換按鈕
// @name:zh-HK          YouTube Shorts URL 轉換按鈕
// @name:ja             YouTube Shorts URL コンバーター
// @name:zh-CN          YouTube Shorts URL 转换按钮
// @name:ko             YouTube Shorts URL 변환 버튼
// @name:ru             Кнопка преобразования URL YouTube Shorts
// @name:de             YouTube Shorts URL Konvertierungstaste
// @name:es             Botón de conversión de URL de YouTube Shorts
// @name:fr             Bouton de conversion d'URL YouTube Shorts
// @name:it             Pulsante di conversione URL YouTube Shorts
// @name:pt             Botão de conversão de URL do YouTube Shorts
// @name:ar             زر تحويل URL من YouTube Shorts
// @name:nl             YouTube Shorts URL Conversieknop
// @name:tr             YouTube Shorts URL Dönüştürme Butonu
// @name:pl             Przycisk konwersji URL YouTube Shorts
// @namespace           http://tampermonkey.net/
// @version             1.13
// @description         Convert YouTube Shorts URL to regular YouTube video URL.
// @description:zh-TW   將 YouTube Shorts 網址轉換為常規的 YouTube 影片網址。
// @description:zh-HK   將 YouTube Shorts 網址轉換為常規的 YouTube 影片網址。
// @description:ja      YouTube Shorts URLを通常のYouTubeビデオURLに変換します。
// @description:zh-CN   将 YouTube Shorts 网址转换为常规的 YouTube 视频网址。
// @description:ko      YouTube Shorts URL을 일반 YouTube 비디오 URL로 변환합니다.
// @description:ru      Преобразование URL YouTube Shorts в обычный URL видео YouTube.
// @description:de      Konvertiere YouTube Shorts URL in reguläre YouTube Video URL.
// @description:es      Convierte la URL de YouTube Shorts en una URL de video de YouTube normal.
// @description:fr      Convertir l'URL YouTube Shorts en URL vidéo YouTube classique.
// @description:it      Converti l'URL YouTube Shorts in URL video YouTube normale.
// @description:pt      Converte a URL do YouTube Shorts para URL normal do YouTube.
// @description:ar      تحويل رابط YouTube Shorts إلى رابط فيديو YouTube عادي.
// @description:nl      Converteer YouTube Shorts URL naar reguliere YouTube video URL.
// @description:tr      YouTube Shorts URL'sini normal YouTube video URL'sine dönüştür.
// @description:pl      Konwertuj URL YouTube Shorts na regularny URL wideo YouTube.
// @author              鮪魚大師
// @match               https://www.youtube.com/*
// @grant               none
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/477704/YouTube%20Shorts%20URL%20Conversion%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/477704/YouTube%20Shorts%20URL%20Conversion%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const debug = false;

    let convertButton;
    let resizeButton;
    let isButtonDown = false;
    let buttonSize = "medium"; // 預設大小 目前只有"medium"跟"small"

    const lang = document.documentElement.lang || navigator.language;
    const langData = [
        {
            name: "English",
            match: ["en", "en-US", "en-GB", "en-CA", "en-AU"],
            lang: {
                buttonText: "Convert Shorts",
                buttonTitle: "Convert Shorts URL to regular video URL",
                resizeButtonTitle: "Resize the buttons",
            },
        },
        {
            name: "Chinese (Traditional)",
            match: ["zh-TW", "zh-HK", "zh-Hant", "zh-Hant-TW"],
            lang: {
                buttonText: "Shorts轉換",
                buttonTitle: "將Shorts網址轉換成一般影片網址",
                resizeButtonTitle: "調整按鈕大小",
            },
        },
        {
            name: "Japanese",
            match: ["ja"],
            lang: {
                buttonText: "Shorts変換",
                buttonTitle: "YouTube Shorts URLを通常のYouTubeビデオURLに変換します",
                resizeButtonTitle: "ボタンサイズを変更する",
            },
        },
        {
            name: "Chinese (Simplified)",
            match: ["zh-CN", "zh-SG", "zh-Hans", "zh-Hans_CN"],
            lang: {
                buttonText: "Shorts转换",
                buttonTitle: "将 YouTube Shorts 网址转换为常规的 YouTube 视频网址",
                resizeButtonTitle: "调整按钮大小",
            },
        },
        {
            name: "Korean",
            match: ["ko"],
            lang: {
                buttonText: "Shorts변환",
                buttonTitle: "YouTube Shorts URL을 일반 YouTube 비디오 URL로 변환합니다",
                resizeButtonTitle: "버튼 크기 조정",
            },
        },
        {
            name: "Russian",
            match: ["ru"],
            lang: {
                buttonText: "Shorts конвертация",
                buttonTitle: "Преобразование URL YouTube Shorts в обычный URL видео YouTube",
                resizeButtonTitle: "Изменить размер кнопок",
            },
        },
        {
            name: "German",
            match: ["de"],
            lang: {
                buttonText: "Shorts konvertieren",
                buttonTitle: "Konvertiere YouTube Shorts URL in reguläre YouTube Video URL",
                resizeButtonTitle: "Größe der Schaltflächen ändern",
            },
        },
        {
            name: "Spanish",
            match: ["es", "es-ES", "es-MX", "es-AR", "es-CO"],
            lang: {
                buttonText: "Convertir Shorts",
                buttonTitle: "Convierte la URL de YouTube Shorts en una URL de video de YouTube normal",
                resizeButtonTitle: "Cambiar el tamaño de los botones",
            },
        },
        {
            name: "French",
            match: ["fr", "fr-FR", "fr-CA", "fr-BE", "fr-CH"],
            lang: {
                buttonText: "Convertir Shorts",
                buttonTitle: "Convertir l'URL YouTube Shorts en URL vidéo YouTube classique",
                resizeButtonTitle: "Redimensionner les boutons",
            },
        },
        {
            name: "Italian",
            match: ["it"],
            lang: {
                buttonText: "Converti Shorts",
                buttonTitle: "Converti l'URL YouTube Shorts in URL video YouTube normale",
                resizeButtonTitle: "Ridimensiona i pulsanti",
            },
        },
        {
            name: "Portuguese",
            match: ["pt", "pt-PT", "pt-BR"],
            lang: {
                buttonText: "Converter Shorts",
                buttonTitle: "Converter a URL do YouTube Shorts para a URL normal do vídeo do YouTube",
                resizeButtonTitle: "Alterar o tamanho dos botões",
            },
        },
        {
            name: "Arabic",
            match: ["ar"],
            lang: {
                buttonText: "تحويل Shorts",
                buttonTitle: "تحويل رابط YouTube Shorts إلى رابط فيديو YouTube عادي",
                resizeButtonTitle: "تغيير حجم الأزرار",
            },
        },
        {
            name: "Dutch",
            match: ["nl", "nl-NL", "nl-BE"],
            lang: {
                buttonText: "Shorts converteren",
                buttonTitle: "Converteer YouTube Shorts URL naar reguliere YouTube video URL",
                resizeButtonTitle: "Verander de grootte van de knoppen",
            },
        },
        {
            name: "Turkish",
            match: ["tr"],
            lang: {
                buttonText: "Shorts dönüştür",
                buttonTitle: "YouTube Shorts URL'sini normal YouTube video URL'sine dönüştür",
                resizeButtonTitle: "Düğme boyutunu değiştir",
            },
        },
        {
            name: "Polish",
            match: ["pl"],
            lang: {
                buttonText: "Konwertuj Shorts",
                buttonTitle: "Konwertuj URL YouTube Shorts na regularny URL wideo YouTube",
                resizeButtonTitle: "Zmień rozmiar przycisków",
            },
        },
        {
            name: "Hebrew",
            match: ["he"],
            lang: {
                buttonText: "המיר Shorts",
                buttonTitle: "המיר את כתובת ה-URL של YouTube Shorts לכתובת URL רגילה של סרטון YouTube",
                resizeButtonTitle: "שנה את גודל הכפתורים",
            },
        },
        {
            name: "Vietnamese",
            match: ["vi"],
            lang: {
                buttonText: "Chuyển đổi Shorts",
                buttonTitle: "Chuyển đổi URL YouTube Shorts thành URL video YouTube thông thường",
                resizeButtonTitle: "Thay đổi kích thước các nút",
            },
        },
    ];

    function debugLog(message) {
        if (debug) {
            console.log("[DEBUG] " + message);
        }
    }

    function getLanguageData() {
        if (debug) {
            debugLog("偵測到的語言: " + lang);
        }
        for (const data of langData) {
            if (data.match.some(match => lang.startsWith(match))) {
                if (debug) {
                    debugLog(`匹配到語言: ${data.name}`);
                }
                return data.lang;
            }
        }

        if (debug) {
            debugLog(`找不到匹配的語言，使用預設語言: ${langData[0].name}`);
        }
        return langData[0].lang;
    }

    const languageData = getLanguageData();

    // 根據 'buttonSize' 變數更新按鈕大小
    function updateButtonSize() {
        if (convertButton) {
            convertButton.style.fontSize = buttonSize === "small" ? "14px" : "24px";
            convertButton.style.padding = buttonSize === "small" ? "5px 10px" : "10px 20px";
        }
    }

    // 建立 Convert Button 和 Resize Button
    function createButtons() {
        // Convert 按鈕
        if (!convertButton) {
            debugLog("正在創建 Convert 按鈕...");
            convertButton = document.createElement('button');
            convertButton.textContent = languageData.buttonText;
            convertButton.style.position = 'fixed';
            convertButton.style.top = '150px';
            convertButton.style.right = '10px';
            convertButton.style.zIndex = '9999';
            convertButton.style.backgroundColor = '#FF0000';
            convertButton.style.color = '#FFFFFF';
            convertButton.style.fontSize = '24px';
            convertButton.style.padding = '10px 20px';
            convertButton.style.border = 'none';
            convertButton.style.borderRadius = '5px';
            convertButton.title = languageData.buttonTitle;
            document.body.appendChild(convertButton);
            updateButtonSize();

            convertButton.addEventListener('click', convertURL);
            convertButton.addEventListener('auxclick', convertURL);

            convertButton.addEventListener('mousedown', function() {
                convertButton.style.backgroundColor = '#D80000';
                isButtonDown = true;
            });

            convertButton.addEventListener('mouseup', function() {
                convertButton.style.backgroundColor = '#FF0000';
                isButtonDown = false;
            });

            convertButton.addEventListener('mouseout', function() {
                if (!isButtonDown) {
                    convertButton.style.backgroundColor = '#FF0000';
                }
            });

            convertButton.addEventListener('mouseenter', function() {
                convertButton.style.backgroundColor = '#FF3333';
            });

            convertButton.addEventListener('mouseleave', function() {
                convertButton.style.backgroundColor = '#FF0000';
            });

            debugLog("按鈕創建成功");
        }

        // Resize 按鈕
        if (!resizeButton) {
            debugLog("正在創建 Resize 按鈕...");
            resizeButton = document.createElement('button');
            resizeButton.textContent = "◱";
            resizeButton.style.position = 'fixed';
            resizeButton.style.right = '10px';
            resizeButton.style.top = (convertButton.getBoundingClientRect().bottom + 5) + 'px';
            resizeButton.style.zIndex = '9999';
            resizeButton.style.backgroundColor = '#008CBA';
            resizeButton.style.color = '#FFFFFF';
            resizeButton.style.fontSize = '18px';
            resizeButton.style.width = '25px';
            resizeButton.style.height = '25px';
            resizeButton.style.display = 'flex';
            resizeButton.style.justifyContent = 'center';
            resizeButton.style.alignItems = 'center';
            resizeButton.style.border = 'none';
            resizeButton.style.borderRadius = '5px';
            resizeButton.title = languageData.resizeButtonTitle;
            document.body.appendChild(resizeButton);

            resizeButton.addEventListener('click', () => {
                buttonSize = buttonSize === "small" ? "medium" : "small";
                updateButtonSize();
                resizeButton.style.top = (convertButton.getBoundingClientRect().bottom + 5) + 'px';
            });

            resizeButton.addEventListener('mouseenter', function() {
                resizeButton.style.backgroundColor = '#00bcd4';
            });

            resizeButton.addEventListener('mouseleave', function() {
                resizeButton.style.backgroundColor = '#008CBA';
            });
        }
    }

    //主要功能
    function convertURL(event) {
        const currentURL = window.location.href;
        debugLog("當前網址: " + currentURL);

        if (currentURL.includes("youtube.com/shorts/")) {
            const match = currentURL.match(/https:\/\/www\.youtube\.com\/shorts\/([A-Za-z0-9_-]+)/);
            if (match) {
                const videoID = match[1];
                const videoURL = `https://www.youtube.com/watch?v=${videoID}`;
                debugLog(`匹配到的影片ID: ${videoID}`);
                debugLog(`轉換後的網址: ${videoURL}`);

                if (event && event.button === 2) {
                    debugLog("檢測到右鍵點擊（未執行任何操作）");
                } else if (event && event.button === 1) {
                    debugLog("檢測到中鍵點擊（開啟新標籤）");
                    window.open(videoURL, '_blank');
                } else {
                    debugLog("正在導航至轉換後的網址");
                    window.location.href = videoURL;
                }
            } else {
                debugLog("網址中沒有匹配到影片ID");
            }
        } else {
            debugLog("不是 YouTube Shorts 網址");
        }
    }

    function removeConvertButton() {
        if (convertButton) {
            debugLog("正在移除 Convert 按鈕...");
            convertButton.remove();
            convertButton = null;
            debugLog("Convert 按鈕已移除");
        }

        if (resizeButton) {
            debugLog("正在移除 Resize 按鈕...");
            resizeButton.remove();
            resizeButton = null;
            debugLog("Resize 按鈕已移除");
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const checkAndCreateButton = debounce(function() {
        debugLog("檢查是否應該創建/移除按鈕...");
        if (window.location.href.includes("youtube.com/shorts/")) {
            createButtons();
        } else {
            removeConvertButton();
        }
    }, 200); // 防抖200ms

    window.addEventListener('popstate', checkAndCreateButton);

    const observer = new MutationObserver(function(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                checkAndCreateButton();
                break;
            }
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
    checkAndCreateButton();

})();
