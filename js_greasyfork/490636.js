// ==UserScript==
// @name           Download Icon Adder for Suno.ai
// @name:en        Download Icon Adder for Suno.ai
// @name:zh-CN     为Suno.ai添加下载图标
// @name:zh-TW     為Suno.ai新增下載圖示
// @name:ja        Suno.aiのダウンロードアイコンを追加
// @name:ko        Suno.ai용 다운로드 아이콘 추가
// @name:fr        Ajout d'icônes de téléchargement pour Suno.ai
// @name:de        Download-Icons für Suno.ai hinzufügen
// @name:es        Agregador de iconos de descarga para Suno.ai
// @name:ru        Добавление значков загрузки для Suno.ai
// @name:ar        إضافة أيقونات التنزيل لـ Suno.ai
// @name:pt        Adicionador de ícones de download para Suno.ai
// @name:it        Aggiunta di icone di download per Suno.ai
// @description    Add download icons for songs on Suno.ai
// @description:en Add download icons for songs on Suno.ai
// @description:zh-CN 在Suno.ai上为歌曲添加下载图标
// @description:zh-TW 在Suno.ai上為歌曲新增下載圖示
// @description:ja Suno.aiの曲にダウンロードアイコンを追加
// @description:ko Suno.ai의 노래에 다운로드 아이콘 추가
// @description:fr Ajouter des icônes de téléchargement pour les chansons sur Suno.ai
// @description:de Download-Icons für Lieder auf Suno.ai hinzufügen
// @description:es Agregar iconos de descarga para canciones en Suno.ai
// @description:ru Добавление значков загрузки для песен на Suno.ai
// @description:ar إضافة أيقونات التنزيل للأغاني على Suno.ai
// @description:pt Adicionar ícones de download para músicas no Suno.ai
// @description:it Aggiungere icone di download per le canzoni su Suno.ai
// @namespace      http://tampermonkey.net/
// @version        0.1.6.1
// @author         aspen138
// @match          *://*.suno.ai/*
// @match          *://*.suno.com/*
// @grant          none
// @icon           https://www.google.com/s2/favicons?sz=64&domain=suno.ai
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/490636/Download%20Icon%20Adder%20for%20Sunoai.user.js
// @updateURL https://update.greasyfork.org/scripts/490636/Download%20Icon%20Adder%20for%20Sunoai.meta.js
// ==/UserScript==






(function() {
    'use strict';

    // Function to create a download button
    function createDownloadButton(downloadURL, fileType) {
        let button = document.createElement('button');
        button.innerText = fileType.toUpperCase();
        button.onclick = function() { window.open(downloadURL, '_blank').focus(); };
        button.style.marginLeft = '5px';
        button.style.fontSize = '12px';
        button.style.padding = '5px 10px'; // Adjust horizontal padding
        button.style.whiteSpace = 'nowrap'; // Prevent text from wrapping
        button.style.display = 'inline-block'; // Crucial: shrink-wraps the button
        button.style.backgroundColor = '#f9f7f5'; // Set the background color
        button.style.color = '#0d0808'; // Corrected property: fontColor -> color
        return button;
    }

    // Function to extract song ID and add download buttons
    function addDownloadButtons() {
        // Updated regex pattern to correct the domain name and match the song ID
        const regexPattern = /https:\/\/suno\.com\/song\/([a-zA-Z0-9-]+)/;
        // Select the button with unique classes and then get its parent div
        const buttons = document.querySelectorAll('div.flex.flex-row.items-center.justify-end.gap-2');
        buttons.forEach(function(button) {
            let parentDiv = button.parentElement;
            if (!parentDiv.dataset.downloadsAdded) {
                let match = regexPattern.exec(window.location.href);
                if (match && match[1]) {
                    let songId = match[1];
                    let mp3DownloadURL = `https://cdn1.suno.ai/${songId}.mp3`;
                    let mp4DownloadURL = `https://cdn1.suno.ai/${songId}.mp4`;

                    console.log("mp3DownloadURL=", mp3DownloadURL);
                    console.log("mp4DownloadURL=", mp4DownloadURL);

                    let mp3Button = createDownloadButton(mp3DownloadURL, 'mp3');
                    let mp4Button = createDownloadButton(mp4DownloadURL, 'mp4');

                    // parentDiv.insertAdjacentElement('afterend', mp3Button);
                    // parentDiv.insertAdjacentElement('afterend', mp4Button);
                    parentDiv.insertAdjacentElement('beforebegin', mp3Button);
                    parentDiv.insertAdjacentElement('beforebegin', mp4Button);
                    parentDiv.dataset.downloadsAdded = true; // Mark the element to prevent duplicate buttons
                }
            }
        });
    }

    // MutationObserver to handle dynamic content loading
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                addDownloadButtons(); // Re-run when DOM changes are detected
            }
        });
    });

    // Specify what to observe
    const config = { childList: true, subtree: true };

    // Start observing the body for changes
    observer.observe(document.body, config);

    // Initial invocation
    addDownloadButtons();
})();

