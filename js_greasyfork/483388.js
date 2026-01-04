// ==UserScript==
// @name            Beautiful DarkiBox API - File List
// @namespace       https://greasyfork.org/fr/users/868328-invincible812
// @match           https://darkibox.com/api/file/list*
// @grant           none
// @version         2.0
// @author          Invincible812
// @description     Good API
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/483388/Beautiful%20DarkiBox%20API%20-%20File%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/483388/Beautiful%20DarkiBox%20API%20-%20File%20List.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function main() {
        const jsonElement = document.body.children[0];
        if (jsonElement) {
            const jsonData = JSON.parse(jsonElement.textContent);
            console.log(jsonData)
            jsonElement.textContent = '';

            const sortedData = jsonData.result.files;
            console.log(sortedData);
            const filesCount = sortedData.length;
            const files = jsonData.result;
            let count = "";

            const countDiv = document.createElement('div');
            const countDiv1 = document.createElement('div');
            countDiv.textContent = `Nombre de fichiers : ${filesCount}`;
            countDiv.style.fontWeight = 'bold';
            countDiv.style.marginBottom = '10px';
            document.body.appendChild(countDiv);
            document.body.appendChild(countDiv1);

            const textarea = document.createElement('textarea');
            textarea.style.width = '100%';
            textarea.style.height = '100px';
            textarea.style.display = 'none';
            textarea.placeholder = 'Liens des fichiers sélectionnés apparaîtront ici';
            document.body.appendChild(textarea);

            const table = document.createElement('table');
            table.className = 'table';

            const thead = document.createElement('thead');
            const trHeader = document.createElement('tr');

            const thTitle = document.createElement('th');
            thTitle.textContent = 'Titre';
            trHeader.appendChild(thTitle);

            const thLink = document.createElement('th');
            thLink.textContent = 'Lien';
            trHeader.appendChild(thLink);

            const thFileCode = document.createElement('th');
            thFileCode.textContent = 'Code de Fichier';
            trHeader.appendChild(thFileCode);

            const thLength = document.createElement('th');
            thLength.textContent = 'Durée';
            trHeader.appendChild(thLength);

            const thViews = document.createElement('th');
            thViews.textContent = 'Vues';
            trHeader.appendChild(thViews);

            const thUploaded = document.createElement('th');
            thUploaded.textContent = 'Date de Publication';
            trHeader.appendChild(thUploaded);

            const thPublic = document.createElement('th');
            thPublic.textContent = 'Public';
            trHeader.appendChild(thPublic);

            thead.appendChild(trHeader);
            table.appendChild(thead);

            const tbody = document.createElement('tbody');

            const selectedFileLinks = new Set();

            sortedData.forEach(file => {
                const tr = document.createElement('tr');
                tr.style.cursor = 'pointer';

                tr.addEventListener('click', () => {
                    if (selectedFileLinks.has(file.link)) {
                        selectedFileLinks.delete(file.link);
                        tr.classList.remove('selected');
                    } else {
                        selectedFileLinks.add(file.link);
                        tr.classList.add('selected');
                    }
                });

                const tdTitle = document.createElement('td');
                tdTitle.textContent = file.title;
                tr.appendChild(tdTitle);

                const tdLink = document.createElement('td');
                const link = document.createElement('a');
                link.href = file.link;
                link.textContent = 'Lien';
                link.target = '_blank';
                tdLink.appendChild(link);
                tr.appendChild(tdLink);

                const tdFileCode = document.createElement('td');
                tdFileCode.textContent = file.file_code;
                tr.appendChild(tdFileCode);

                const tdLength = document.createElement('td');
                tdLength.textContent = file.length;
                tr.appendChild(tdLength);

                const tdViews = document.createElement('td');
                tdViews.textContent = file.views;
                tr.appendChild(tdViews);

                const tdUploaded = document.createElement('td');
                tdUploaded.textContent = file.uploaded;
                tr.appendChild(tdUploaded);

                const tdPublic = document.createElement('td');
                tdPublic.textContent = file.public;
                tr.appendChild(tdPublic);

                tbody.appendChild(tr);
            });

            table.appendChild(tbody);

            const style = document.createElement('style');
            style.textContent = `
                .table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .table th,
                .table td {
                    border: 1px solid #ccc;
                    padding: 8px;
                    text-align: left;
                }
                .table th {
                    background-color: #f2f2f2;
                }
                .table tbody tr:hover {
                    background-color: #e0e0e0;
                    cursor: pointer;
                }
                .selected {
                    background-color: #c5e2ff;
                }
            `;

            const copyButton = document.createElement('button');
            copyButton.textContent = 'Copier les liens sélectionnés';
            copyButton.className = 'btn btn-primary';

            copyButton.addEventListener('click', () => {

              // Sort selected links by file title
            const sortedLinks = Array.from(selectedFileLinks).sort((a, b) => {
                const fileA = sortedData.find(file => file.link === a);
                const fileB = sortedData.find(file => file.link === b);
                return fileA.title.localeCompare(fileB.title);
            });
              console.log(selectedFileLinks.size)
                countDiv1.textContent = `Sélectionné : ${selectedFileLinks.size}`;
                textarea.value = sortedLinks.join('\n');
                textarea.style.display = 'block';
            });

            document.head.appendChild(style);
            document.body.appendChild(copyButton);
            document.body.appendChild(table);
        } else {
            console.error('Élément JSON non trouvé sur la page.');
        }
    }

    main();
})();
