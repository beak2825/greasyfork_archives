// ==UserScript==
// @name         Capture Discord User IDs (with Floating Window)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Capture all user IDs from Discord avatar URLs, allow selecting and copying them, and provide a close button.
// @author       You
// @match        https://discord.com/channels/*
// @grant        GM_notification
// @run-at       document-start
// @license All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/530511/Capture%20Discord%20User%20IDs%20%28with%20Floating%20Window%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530511/Capture%20Discord%20User%20IDs%20%28with%20Floating%20Window%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Empurrar o site para o lado
    document.documentElement.style.transform = 'translateX(300px)';
    document.documentElement.style.transition = 'transform 0.3s ease-in-out';

    // Array para armazenar os IDs dos usuários
    let userIds = [];

    // Criar a janela flutuante para exibir os IDs
    const floatingWindow = document.createElement('div');
    floatingWindow.style.position = 'fixed';
    floatingWindow.style.top = '20px';
    floatingWindow.style.right = '20px';
    floatingWindow.style.width = '350px';
    floatingWindow.style.height = '400px';
    floatingWindow.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    floatingWindow.style.color = 'white';
    floatingWindow.style.overflowY = 'auto';
    floatingWindow.style.padding = '10px';
    floatingWindow.style.borderRadius = '8px';
    floatingWindow.style.boxShadow = '0px 0px 15px rgba(0, 0, 0, 0.5)';
    floatingWindow.style.zIndex = '9999';
    floatingWindow.style.fontFamily = 'Arial, sans-serif';
    floatingWindow.innerHTML = `<h3>Captured User IDs</h3>
                                <button id="select-all-btn" style="margin-bottom: 10px;">Select All</button>
                                <table id="user-id-table" style="width: 100%; border-collapse: collapse;">
                                    <thead>
                                        <tr>
                                            <th>Select</th>
                                            <th>Avatar</th>
                                            <th>ID</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                                <button id="copy-btn" style="margin-top: 10px;">Copy Selected</button>
                                <button id="close-btn" style="margin-top: 10px;">Close</button>`;
    document.body.appendChild(floatingWindow);

    // Função para capturar e extrair o ID dos avatares
    function captureUserId(url) {
        // Expressão regular para extrair o ID do usuário da URL
        const match = url.match(/avatars\/(\d+)\//);
        if (match && match[1]) {
            const userId = match[1];
            if (!userIds.includes(userId)) {
                userIds.push(userId);

                // Criar uma nova linha na tabela
                const tableRow = document.createElement('tr');
                tableRow.innerHTML = `
                    <td><input type="checkbox" class="user-checkbox" value="${userId}"></td>
                    <td><img src="${url}?size=25" alt="Avatar" style="width: 25px; height: 25px;"></td>
                    <td>${userId}</td>
                `;
                document.querySelector('#user-id-table tbody').appendChild(tableRow);
                console.log("User ID captured: ", userId);
            }
        }
    }

    // Função para monitorar a adição de novas imagens de avatares no DOM
    function monitorAvatarTags() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.src && img.src.includes('https://cdn.discordapp.com/avatars/')) {
                captureUserId(img.src);
            }
        });
    }

    // Monitorar avatares a cada 2 segundos
    setInterval(monitorAvatarTags, 2000);

    // Função para exibir uma mensagem se nenhum avatar for encontrado
    function displayUserIds() {
        if (userIds.length === 0) {
            const noIdsMessage = document.createElement('p');
            noIdsMessage.innerText = 'No user IDs found.';
            floatingWindow.appendChild(noIdsMessage);
        }
    }

    // Função para copiar os IDs selecionados para a área de transferência
    document.getElementById('copy-btn').addEventListener('click', () => {
        const selectedIds = [];
        document.querySelectorAll('.user-checkbox:checked').forEach(checkbox => {
            selectedIds.push(checkbox.value);
        });

        if (selectedIds.length > 0) {
            const textToCopy = selectedIds.join('\n');
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Selected IDs copied to clipboard!');
        } else {
            alert('No IDs selected!');
        }
    });

    // Função para fechar a janela flutuante
    document.getElementById('close-btn').addEventListener('click', () => {
        floatingWindow.style.display = 'none';
    });

    // Função para selecionar/desmarcar todos os checkboxes
    document.getElementById('select-all-btn').addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('.user-checkbox');
        const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);

        checkboxes.forEach(checkbox => {
            checkbox.checked = !allChecked;
        });
    });

    // Exibir os IDs após o carregamento inicial
    setTimeout(displayUserIds, 5000);
})();
