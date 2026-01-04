// ==UserScript==
// @name         Advanced Download Manager
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Gerenciador de downloads avançado com progresso e organização.
// @author       Saimen Nemias
// @match        *://*/*
// @grant        GM_download
// @grant        GM_getResourceText
// @run-at       document-end
// @icon         https://example.com/icon.png
// @license      None
// @downloadURL https://update.greasyfork.org/scripts/508548/Advanced%20Download%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/508548/Advanced%20Download%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para criar o botão de download
    function createDownloadButton(link) {
        const button = document.createElement('button');
        button.textContent = 'Download';
        button.style.marginLeft = '10px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '5px 10px';
        button.style.textAlign = 'center';
        button.style.textDecoration = 'none';
        button.style.display = 'inline-block';
        button.style.fontSize = '14px';
        button.style.margin = '4px 2px';
        button.style.cursor = 'pointer';
        button.onclick = () => {
            const url = link.href;
            const fileName = url.split('/').pop();
            const fileNameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
            const downloadFolder = 'Downloads/'; // Ajuste conforme necessário
            const downloadUrl = url;

            // Adiciona o botão de progresso
            const progress = document.createElement('div');
            progress.textContent = 'Download in progress...';
            progress.style.marginLeft = '10px';
            link.parentNode.insertBefore(progress, link.nextSibling);

            // Função para iniciar o download
            GM_download({
                url: downloadUrl,
                name: `${downloadFolder}${fileName}`,
                onprogress: (e) => {
                    if (e.lengthComputable) {
                        const percent = (e.loaded / e.total) * 100;
                        progress.textContent = `Download progress: ${Math.round(percent)}%`;
                    }
                },
                onload: () => {
                    progress.textContent = 'Download completed!';
                },
                onerror: () => {
                    progress.textContent = 'Error downloading file.';
                }
            });
        };
        return button;
    }

    // Função para adicionar botões de download
    function addDownloadButtons() {
        const links = document.querySelectorAll('a[href$=".pdf"], a[href$=".zip"], a[href$=".rar"]');
        links.forEach(link => {
            if (!link.classList.contains('download-button-added')) {
                const button = createDownloadButton(link);
                link.parentNode.insertBefore(button, link.nextSibling);
                link.classList.add('download-button-added');
            }
        });
    }

    // Adiciona os botões ao carregar a página
    window.addEventListener('load', addDownloadButtons);

    // Observa mudanças na página para adicionar botões a novos links
    const observer = new MutationObserver(() => {
        addDownloadButtons();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
