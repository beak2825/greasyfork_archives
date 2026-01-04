// ==UserScript==
// @name         DarkiBox Folder Creator
// @namespace    DarkiBox Tools
// @version      1.0
// @description  Créez des dossiers via l'API DarkiBox
// @author       Invincible812
// @match        https://darkibox.com/?op=my_files*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/476808/DarkiBox%20Folder%20Creator.user.js
// @updateURL https://update.greasyfork.org/scripts/476808/DarkiBox%20Folder%20Creator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractApiKey(callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://darkibox.com/?op=my_account',
            onload: function(response) {
                if (response.status === 200) {
                    const parser = new DOMParser();
                    const temp = parser.parseFromString(response.responseText, "text/html");
                    const apiKey = temp.querySelector('#details > div > div > div:nth-child(3) > div > div > div.col-auto.flex-grow-1 > input').value;
                    console.log(apiKey)
                    callback(apiKey);
                } else {
                    alert('Error fetching my_account page');
                }
            },
            onerror: function(error) {
                alert('Error fetching my_account page');
            }
        });
    }

    function createFolder(name, parentId, apiKey) {
        const url = `https://darkibox.com/api/folder/create?key=${apiKey}&name=${encodeURIComponent(name)}&parent_id=${parentId}`;

        console.log(url)
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                const jsonResponse = JSON.parse(response.responseText);
                console.log(jsonResponse)
                if (jsonResponse.msg === 'OK') {
                    alert(`Dossier "${name}" créé avec succès ! Veuillez attendre quelques minutes avant de le voir apparaitre`);
                    closeModal();
                    location.reload();
                } else {
                    alert('Une erreur s\'est produite lors de la création du dossier.');
                }
            },
            onerror: function() {
                alert('Erreur lors de la requête HTTP.');
            }
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    let currentFolderId = urlParams.get('fld_id');
    console.log(currentFolderId)
    if (!currentFolderId) {
        currentFolderId = 0;
    }

    const openModalButton = document.createElement('button');
    openModalButton.textContent = 'Créer un dossier';
    openModalButton.style.marginBottom = '10px';
    openModalButton.style.backgroundColor = '#0074D9';
    openModalButton.style.color = 'white';
    openModalButton.style.border = 'none';
    openModalButton.style.padding = '5px 10px';
    openModalButton.style.cursor = 'pointer';
    openModalButton.addEventListener('click', openModal);

    const folderCreateForm = document.createElement('form');
    folderCreateForm.style.display = 'none';
    folderCreateForm.style.backgroundColor = 'white';
    folderCreateForm.style.padding = '20px';
    folderCreateForm.style.borderRadius = '5px';
    folderCreateForm.innerHTML = `
        <input type="text" id="folderName" placeholder="Nom du dossier" required>
        <button type="submit">Créer un dossier</button>
    `;

    folderCreateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const folderName = document.getElementById('folderName').value;
        extractApiKey(function(apiKey) {
          console.log(apiKey)
            createFolder(folderName, currentFolderId, apiKey);
        });
    });

    function openModal() {
        folderCreateForm.style.display = 'block';
        openModalButton.style.display = 'none';
    }

    function closeModal() {
        folderCreateForm.style.display = 'none';
        openModalButton.style.display = 'block';
    }

    const myFilesPage = document.querySelector('body');
    myFilesPage.insertBefore(openModalButton, myFilesPage.firstChild);
    myFilesPage.insertBefore(folderCreateForm, myFilesPage.firstChild);
})();
