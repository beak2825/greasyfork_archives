// ==UserScript==
// @namespace       https://greasyfork.org/fr/users/868328-invincible812
// @name:fr         Ultimate Remote
// @name            Ultimate Remote
// @match           https://darkibox.com/?op=upload_url
// @match           https://darkibox.com/
// @grant           none
// @version         1.6
// @author          Invincible812
// @run-at          document-end
// @grant           GM_xmlhttpRequest
// @description Script de remote Ultime
// @downloadURL https://update.greasyfork.org/scripts/481051/Ultimate%20Remote.user.js
// @updateURL https://update.greasyfork.org/scripts/481051/Ultimate%20Remote.meta.js
// ==/UserScript==


(function () {
    'use strict';

   // ----------- A COMPLETER ICI ---------------------- //

    const unfichier_id = "";  // SID 1FICHIER          | Exemple :  2lSkazzeeeeeeKRezeazzqezzqt8fZiqV
    const turbobit_api = "";  // API TURBOBIT          | Exemple :  zezeree7rt41e4zze485e48ze7z85ez
    const darkibox_api = "";  // API DARKIBOX          | Exemple :  aerkrre6re4sers41err
    const unfichier_api = ""; // API 1FICHIER          | Exemple :  aerkrre6re4sers41err
    const sendcm_api = "";    // API SENDCM            | Exemple :  aerkrre6re4sers41err

    const styles = `
        <style>
            #upload-form {
                padding: 20px;
                background-color: #f0f0f0;
                border: 1px solid #ccc;
                border-radius: 5px;
                margin-top: 20px;
            }
            #upload-form h1 {
                font-size: 18px;
                margin-bottom: 10px;
            }
            #upload-form textarea {
                width: 100%;
                height: 150px;
                margin-bottom: 10px;
            }
            #upload-form button {
                background-color: #007bff;
                color: #fff;
                border: none;
                padding: 10px 20px;
                cursor: pointer;
            }
            #statusTable {
                width: 100%;
                border-collapse: collapse;
            }
            #statusTable th, #statusTable td {
                border: 1px solid #ccc;
                padding: 8px;
                text-align: left;
            }
            #statusTable th {
                background-color: #007bff;
                color: #fff;
            }
        </style>
    `;


    function debridLink(link, callback) {
        const apiUrl = 'https://api.1fichier.com/v1/download/get_token.cgi';

        GM_xmlhttpRequest({
            method: 'POST',
            url: apiUrl,
            headers: {
               "Authorization": 'Bearer '+ unfichier_api,
               "Content-Type": "application/json",
            },
            data: JSON.stringify({ "url": link, "pretty": 1 }),
            onload: function (response) {
                const result = JSON.parse(response.responseText);
                console.log(result)
                if (response.status === 200) {
                 const responseData = JSON.parse(response.responseText);
                  callback(responseData.url)
                } else {
                    callback(null);
                }
            }
        });
    }

    function uploadTo1Fichier(link, callback) {
        const apiUrl = 'https://1fichier.com/console/remote.pl';
        const headers = {
            'authority': '1fichier.com',
            'accept': '*/*',
            'accept-language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'cookie': `show_cm=no; SID=${unfichier_id}`,
            'origin': 'https://1fichier.com',
            'referer': 'https://1fichier.com/console/remote.pl',
            'sec-ch-ua': '^\^"Chromium^\^";v=^\^"116^\^", ^\^"Not)A;Brand^\^";v=^\^"24^\^", ^\^"Opera GX^\^";v=^\^"102^\^"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '^\\^"Windows^\\^"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 OPR/102.0.0.0',
            'x-requested-with': 'XMLHttpRequest'
        };
        const data = `links=${encodeURIComponent(link)}&did=0`;

        GM_xmlhttpRequest({
            method: 'POST',
            url: apiUrl,
            headers: headers,
            data: data,
            onload: function (response) {
                const status = response.responseText;
                console.log(response)
                if (status === "T&eacute;l&eacute;chargement HTTP/FTP<br/>1 liens enregistr&eacute;s. Vous serez notifi&eacute;s lorsque les fichiers seront t&eacute;l&eacute;charg&eacute;s") {
                    callback("Envoie Réussi");
                }
                else if (status === "T&eacute;l&eacute;chargement HTTP/FTP<br/>Sans Premium, vous ne pouvez pas avoir plus de 10 demandes de t&eacute;l&eacute;chargement simultan&eacute;es") {
                    callback("Limite 10 fichier");
                } else {
                    callback(status);
                }
            }
        });
    }

   function extractDarkiBoxFileId(link) {
    const regex = /darkibox\.com\/([a-zA-Z0-9_]+)/;
    const match = link.match(regex);
    if (match && match.length > 1) {
        return match[1];
    }
    return null;
}

    function uploadDarkiBoxTo1Fichier(link, callback) {
        const fileId = extractDarkiBoxFileId(link);
        if (!fileId) {
            callback('Invalid DarkiBox link');
            return;
        }

        if (darkibox_api==="") {
            callback('Pas d\'API DarkiBox');
            return;
        }

        if (unfichier_id==="") {
            callback('Pas d\'SID 1Fichier');
            return;
        }

        const apiUrl = `https://darkibox.com/api/file/direct_link?key=${darkibox_api}&file_code=${fileId}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            onload: function (response) {
                const result = JSON.parse(response.responseText);
                if (result.status === 200) {
                    const directLink = result.result.versions[0].url;
                    uploadTo1Fichier(directLink, callback);
                } else {
                    callback('DarkiBox API request failed');
                }
            },
            onerror: function (error) {
                callback('DarkiBox API request failed');
            }
        });
    }


    function uploadToDarkiBox(link, callback) {
        const apiUrl = `https://darkibox.com/api/upload/url?key=${darkibox_api}`;
        const params = `url=${encodeURIComponent(link)}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: `${apiUrl}&${params}`,
            onload: function (response) {
                const status = JSON.parse(response.responseText);
                const { msg, status: statusCode } = status;
                callback(msg + ' ' + statusCode);
            }
        });
    }



    function uploadToTurbobit(link, callback) {
        var data = 'url=' + encodeURIComponent(link) +
                   '&service=http' +
                   '&login=none' +
                   '&password=none';

        GM_xmlhttpRequest({
          method: 'POST',
          url: `https://turbobit.net/v001/remote_upload`,
          headers: {
            'X-API-KEY': turbobit_api,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data: data,
          onload: function(response) {
            console.log(response)
            if (response.status === 200) {
              var jsonResponse = JSON.parse(response.responseText);
              if (jsonResponse.result === true) {
                var message = jsonResponse.message[0];
                console.log(message.msg);
                const responseBody = response.responseText;
                      if (responseBody.includes("A remote upload task has been added to the queue and will be started soon. Go to the 'Remote uploads' section and view the progress.")) {
                          callback("Envoyé");
                      } else {
                          callback(responseBody);
                      }
              } else {
                console.error('La demande a échoué.');
              }
            } else {
              console.error('Erreur lors de la demande POST. Statut :', response.status);
            }
          },
          onerror: function(error) {
            callback(error.message);
          }
        });
      }

  function uploadDarkiBoxToTurbobit(link, callback) {
        const fileId = extractDarkiBoxFileId(link);
        if (!fileId) {
            callback('Invalid DarkiBox link');
            return;
        }

        if (darkibox_api==="") {
            callback('Pas d\'API DarkiBox');
            return;
        }

        if (turbobit_api==="") {
            callback('Pas d\'API DarkiBox');
            return;
        }

        const apiUrl = `https://darkibox.com/api/file/direct_link?key=${darkibox_api}&file_code=${fileId}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            onload: function (response) {
                const result = JSON.parse(response.responseText);
                if (result.status === 200) {
                    const directLink = result.result.versions[0].url;
                    uploadToTurbobit(directLink, callback);
                } else {
                    callback('DarkiBox API request failed');
                }
            },
            onerror: function (error) {
                callback('DarkiBox API request failed');
            }
        });
    }


    async function uploadToSendcm(uploadUrl, callback) {
          GM_xmlhttpRequest({
            method: 'GET',
            url: `https://send.cm/api/upload/url?key=${sendcm_api}&url=${encodeURIComponent(uploadUrl)}`,
            onload: function (response) {
              const result = JSON.parse(response.responseText);
              console.log(result)
              if (response.status === 200 && result.result.filecode) {
                callback(`Upload successful`);
              } else {
                callback(`Upload ERROR`);
              }
            }
          })
    }

    function createForm() {
        const form = document.createElement('div');
        form.id = 'upload-form';
        form.innerHTML = `
        <h1>ULTIMATE REMOTE</h1>
        <textarea id="links" rows="5" cols="50" placeholder="Collez vos liens ici"></textarea>
        <button id="uploadButtonmulti">Multi Remote Upload</button>
        <button id="uploadButton">DarkiBox Remote Upload</button>
        <button id="uploadButton1f">1Fichier Remote Upload</button>
        <button id="uploadButtonTurbo">Turbobit Remote Upload</button>
        <button id="uploadButtonSendcm">Sendcm Remote Upload</button>
        <div>
            <h2>Statut des liens :</h2>
            <table id="statusTable">
                <thead>
                    <tr>
                        <th>Lien</th>
                        <th>1fichier</th>
                        <th>DarkiBox</th>
                        <th>Turbobit</th>
                        <th>Sendcm</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
        `;

        document.body.appendChild(form);

        document.getElementById('uploadButton').addEventListener('click', () => {
            handleUpload('DarkiBox');
        });

        document.getElementById('uploadButtonmulti').addEventListener('click', () => {
            handleUpload('Multi');
        });

        document.getElementById('uploadButton1f').addEventListener('click', () => {
            handleUpload('1Fichier');
        });

        document.getElementById('uploadButtonTurbo').addEventListener('click', () => {
            handleUpload('Turbobit');
        });

        document.getElementById('uploadButtonSendcm').addEventListener('click', () => {
            handleUpload('Sendcm');
        });
    }

    function handleUpload(service) {
        const linksTextarea = document.getElementById('links');
        const links = linksTextarea.value.split('\n').filter(link => link.trim() !== '');
        const statusTable = document.getElementById('statusTable').getElementsByTagName('tbody')[0];

        statusTable.innerHTML = '';

        links.forEach(link => {
            const row = statusTable.insertRow();
            const linkCell = row.insertCell(0);
            linkCell.textContent = link;

            const statusCell1Fichier = row.insertCell(1);
            const statusCellDarkiBox = row.insertCell(2);
            const statusCellTurbobit = row.insertCell(3);
            const statusCellSendcm = row.insertCell(4);

            if (service === '1Fichier') {
              if (link.includes('darkibox.com')) {
                uploadDarkiBoxTo1Fichier(link, statusDarkiBox => {
                    statusCell1Fichier.textContent = statusDarkiBox;
                });
                statusCellDarkiBox.textContent = 'X';
                statusCellTurbobit.textContent = 'X';
            }
                // uploadTo1Fichier(link, status1Fichier => {
                //     statusCell1Fichier.textContent = status1Fichier;
                // });
                // statusCellDarkiBox.textContent = 'X';
                // statusCellTurbobit.textContent = 'X';
            } else if (service === 'DarkiBox') {
                uploadToDarkiBox(link, statusDarkiBox => {
                    statusCellDarkiBox.textContent = statusDarkiBox;
                });
                statusCell1Fichier.textContent = 'X';
                statusCellTurbobit.textContent = 'X';
            } else if (service === 'Turbobit') {
                uploadDarkiBoxToTurbobit(link, statusTurbo => {
                    statusCellTurbobit.textContent = statusTurbo;
                });
                statusCell1Fichier.textContent = 'X';
                statusCellDarkiBox.textContent = 'X';
            } else if (service === 'Multi') {
                uploadDarkiBoxTo1Fichier(link, status1Fichier => {
                    statusCell1Fichier.textContent = status1Fichier;
                });
                uploadDarkiBoxToTurbobit(link, statusTurbo => {
                    statusCellTurbobit.textContent = statusTurbo;
                });
                statusCellDarkiBox.textContent = 'X';
            } else if (service === 'Sendcm' && link.includes('1fichier.com')) {
                debridLink(link.replace(/&af=\d+$/, ""), debridUrl => {
                      if (debridUrl) {
                          uploadToSendcm(debridUrl, statusDebrid => {
                              statusCellSendcm.textContent = statusDebrid;
                          });
                      } else {
                          statusCellSendcm.textContent = 'Échec du débridage';
                      }
                  });
                  statusCellDarkiBox.textContent = 'X';
                  statusCell1Fichier.textContent = 'X';
                  statusCellTurbobit.textContent = 'X';
            }
        });
    }

    document.head.insertAdjacentHTML('beforeend', styles);
    window.addEventListener('load', createForm);
})();