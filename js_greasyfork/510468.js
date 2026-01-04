// ==UserScript==
// @icon https://app-cdn.clickup.com/pt-BR/favicon-32x32.2ff057acd7b1fa8ebcbfd22667a640b9.png
// @name            ClickUp mods
// @version         1.0
// @author          R4wwd0G
// @description     Add customized features to the clickup environment
// @include			https://app.clickup.com/*
// @namespace https://greasyfork.org/users/700468
// @downloadURL https://update.greasyfork.org/scripts/510468/ClickUp%20mods.user.js
// @updateURL https://update.greasyfork.org/scripts/510468/ClickUp%20mods.meta.js
// ==/UserScript==

                 
// Definir o SVG do ícone de pasta amarelo com ajustes no tamanho e z-index
let folderIconSvg = `<svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="folder" class="svg-inline--fa fa-folder replaced-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="position: absolute; width: 17px; height: 17px; z-index: 10;"><path fill="rgb(249, 190, 51)" d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z"></path></svg>`;

// Função para sobrepor os ícones apenas quando for o status "pasta"
function overlayIcons() {
    // Seleciona todos os elementos <cu-task-row-status>
    document.querySelectorAll('cu-task-row-status').forEach(taskStatus => {
        // Verifica se o elemento contém o status "pasta"
        const statusText = taskStatus.querySelector('.cdk-visually-hidden');
        
        if (statusText && statusText.textContent.toLowerCase().includes('pasta')) {
            console.log('Encontrado status "pasta"');  // Log para depuração
            const iconContainer = taskStatus.querySelector('cu-status-indicator .cu-status-indicator-wrapper');
            
            // Verifica se o container do ícone foi encontrado e se o ícone já não foi substituído
            if (iconContainer && !iconContainer.querySelector('.custom-folder-icon')) {
                const overlay = document.createElement('div');
                overlay.innerHTML = folderIconSvg;
                overlay.style.position = 'relative'; // Posicionar o container corretamente
                iconContainer.style.position = 'relative'; // Certifique-se que o container está posicionado relativamente
                iconContainer.appendChild(overlay.firstChild);
            }
        }
    });
}

window.addEventListener('DOMContentLoaded', overlayIcons);

setInterval(overlayIcons, 20000);
