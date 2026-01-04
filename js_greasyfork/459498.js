// ==UserScript==
// @namespace       https://greasyfork.org/fr/users/868328-invincible812
// @name            Copy hash for YGG
// @name:fr         Copieur de hash pour YGG
// @include         https://*.yggtorrent.*/*
// @include         https://yggtorrent.*/*
// @include         https://*.yggtorrent.*
// @include         https://yggtorrent.*
// @include         https://*.ygg.*/*
// @include         https://ygg.*/*
// @include         https://*.ygg.*
// @include         https://ygg.*
// @grant           GM.xmlHttpRequest
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue
// @grant           GM_registerMenuCommand
// @grant           GM_addStyle
// @compatible      firefox Violentmonkey
// @compatible      chrome Violentmonkey
// @compatible      brave Violentmonkey
// @compatible      opera Violentmonkey
// @version         3.2
// @author          Invincible812
// @license         Free
// @icon            https://i.ibb.co/nzW3KXp/Copy-hash.png
// @description     Copy easly the hash from a torrent on YGG in one click and more...
// @description:fr  Copier facilement le hash d'un torrent sur YGG en un clique et bien plus...
// @supportURL      https://www3.ygg.re/profile/9385666-invincible813
// @run-at          document-end
// @require         https://code.jquery.com/jquery-3.6.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/459498/Copy%20hash%20for%20YGG.user.js
// @updateURL https://update.greasyfork.org/scripts/459498/Copy%20hash%20for%20YGG.meta.js
// ==/UserScript==


window.addEventListener('load', function() {
  console.log('[COPY HASH FOR YGG] Lancement du script');

  const version = `3.2`;
  const date_maj = `17/05/2024`
  const nouveauté = `<p><b><u>Nouveautés de la version ${version} :</u></b></p>
  <div class="nouveaute-list-container" style="font-size: 12x; line-height: 1.2">
    <ul style="margin-top: 10px;">
        <li>• <u>[MÀJ]</u> <b>v3.2 : Changement d'adresse + passage de YGG en privé</b>
        <br>Concernant cela, actuellement vous avez malheureusement besoin d'un compte YGG pour pouvoir continuer à utiliser YGG et également le script (qui continuera d'être maintenu aussi longtemps que possible vous inquiétez pas ;). <br><b>Faites attention aux arnaques aux comptes et autres magouilles pour avoir un compte YGG<b>.</li>
    </ul>
  </div>`;


  function showUpdateNotification() {
    const isClosed = GM_getValue(`updateNotificationClosed_v${version}`, false);
    if (isClosed) {
      return;
    }

    const isNewInstallation = !GM_getValue("scriptInstalled", false);
    GM_setValue("scriptInstalled", true);

    const notificationDiv = document.createElement("div");
    notificationDiv.innerHTML = `
    <div
    style="position: fixed; top: 30px; left: 50%; transform: translateX(-50%); background-color: #fff; padding: 20px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5); z-index: 9999;">
    <div style="display: flex; align-items: center; margin-bottom: 20px;">
        <img src="https://i.ibb.co/nzW3KXp/Copy-hash.png" alt="Logo Copieur de Hash pour YGG"
            style="width: 80px; height: 80px; margin-right: 30px;">
        <p style="font-weight: bold; font-size: 17px; margin: 0;">Copieur de Hash pour YGG (Version ${version} - <i>${date_maj}</i>)</p>
    </div>
    <p style="font-weight: bold; color: green;">Nouvelle mise à jour installée !</p>
    ${isNewInstallation
                ? `<p>Bienvenue ! Merci à toi d'avoir installé mon script.</p>
    <p>Utilisez le script pour copier les hashs de torrents sur YGGTorrent et les envoyer sur Alldebrid pour un débridage facile !</p>
    <br>
    ${nouveauté}
    <br>
    <p>À bientôt, </p>
    <p><i>Le créateur du script</i></p>
    <a href="https://greasyfork.org/fr/scripts/459498-copy-hash-for-ygg/versions" target="_blank"
        style="text-decoration: none; margin-right: 10px;">
        <button id="readPatchNote"
            style="padding: 10px 20px; border: none; background-color: #4CAF50; color: white; cursor: pointer; transition: background-color 0.3s; font-weight: bold; text-decoration: underline;">Lire le Patch Note complet</button>
    </a>
    <button id="closeNotification"
        style="padding: 10px 20px; border: none; background-color: #ccc; color: #333; cursor: pointer; transition: background-color 0.3s; font-weight: bold; text-decoration: underline;">Commencer à s'amuser :\u0029</button>`
                : `<p>Rebienvenue ! Merci à toi de continuer à utiliser mon script.</p>
    <p>Tu viens d'installer la version ${version} du script.</p><br>
    ${nouveauté}
    <br>
    <p>À bientôt, </p>
    <p><i>Le créateur du script</i></p>
    <a href="https://greasyfork.org/fr/scripts/459498-copy-hash-for-ygg/versions" target="_blank"
        style="text-decoration: none; margin-right: 10px;">
        <button id="readPatchNote"
            style="padding: 10px 20px; border: none; background-color: #4CAF50; color: white; cursor: pointer; transition: background-color 0.3s; font-weight: bold; text-decoration: underline;">Lire le Patch Note complet</button>
    </a>
    <button id="closeNotification"
        style="padding: 10px 20px; border: none; background-color: #ccc; color: #333; cursor: pointer; transition: background-color 0.3s; font-weight: bold; text-decoration: underline;">Compris !</button>`}
    </div>`;

    document.body.appendChild(notificationDiv);

    const closeNotificationButton = document.getElementById("closeNotification");
    closeNotificationButton.addEventListener("click", function() {
      notificationDiv.remove();
      GM_setValue(`updateNotificationClosed_v${version}`, true);
    });

    notificationDiv.addEventListener("click", function(event) {
      if (event.target === notificationDiv) {
        notificationDiv.remove();
        GM_setValue(`updateNotificationClosed_v${version}`, true);
      }
    });

    const readPatchNoteButton = document.getElementById("readPatchNote");
    readPatchNoteButton.addEventListener("mouseover", function() {
      this.style.backgroundColor = "#45A049";
    });
    readPatchNoteButton.addEventListener("mouseout", function() {
      this.style.backgroundColor = "#4CAF50";
    });

    closeNotificationButton.addEventListener("mouseover", function() {
      this.style.backgroundColor = "#999";
      this.style.color = "#fff";
    });
    closeNotificationButton.addEventListener("mouseout", function() {
      this.style.backgroundColor = "#ccc";
      this.style.color = "#333";
    });
  }

  showUpdateNotification();

  const panelMenuList = document.getElementsByClassName('panel-menu-list')[0];

  if (panelMenuList) {
      panelMenuList.insertAdjacentHTML('beforeend', '<li><a href="#" id="menu_settings">Options Copy Hash</a></li>');
  } else if(document.getElementsByClassName('ct')[0]) {
      //console.log("La classe panel-menu-list n'existe pas dans le document.");
      document.getElementsByClassName('ct')[0].children[0].insertAdjacentHTML('beforeend', '<li><a href="#" id="menu_settings">Options Copy Hash</a></li>');
  }

  const sett = document.querySelector('#menu_settings');
    sett.addEventListener('click', function(event) {
      event.preventDefault();
      cfg.open();
    });

  let Alldebrid_API;
  const oldConfigKey = "_MonkeyConfig_Options___Script_Copieur_de_hash_pour_YGG___v1_6_cfg";
  const oldConfig = GM_getValue(oldConfigKey, null);
  const newConfigKey = "_MonkeyConfig_Options___Copieur_de_hash_pour_YGG_cfg";

  if (oldConfig !== null) {
    GM_setValue(newConfigKey, oldConfig);
    GM_deleteValue(oldConfigKey);
  }

  const newConfig = {
    Bouton_Copier_le_Hash: {
      type: 'select',
      choices: ['Oui', 'Non'],
      default: 'Oui'
    },
    Ajouter_URL_Magnet: {
      type: 'select',
      choices: ['Oui', 'Non'],
      default: 'Oui'
    },
    Bouton_Envoyer_sur_Alldebrid: {
      type: 'select',
      choices: ['Oui', 'Non'],
      default: 'Oui'
    },
    Bouton_Envoyer_Torrent: {
      type: 'select',
      choices: ['Oui', 'Non'],
      default: 'Oui'
    },
    API_Alldebrid: {
      type: 'text'
    },
  };

  const cfg = new MonkeyConfig({
    title: 'Options - Copieur de hash pour YGG',
    menuCommand: true,
    params: newConfig,
  });

  Alldebrid_API = cfg.get('API_Alldebrid');

  // --------------------------------------------------------------------------- //

  function isPremium(callback) {
    GM.xmlHttpRequest({
      method: "GET",
      url: `https://api.alldebrid.com/v4/user?agent=ScriptYGGHash&apikey=${Alldebrid_API}`,
      onload: (response) => {
        const userData = JSON.parse(response.responseText);
        const isUserPremium = userData?.data?.user?.isPremium || false;
        callback(isUserPremium);
      },
    });
  }

  //

  function deleteMagnet(magnetId) {
    GM.xmlHttpRequest({
      method: "GET",
      url: `https://api.alldebrid.com/v4/magnet/delete?agent=ScriptYGGHash&apikey=${Alldebrid_API}&id=${magnetId}`,
      onload: (response) => {
        const responseData = JSON.parse(response.responseText);
        if (responseData && responseData.status === "success") {
          //console.log("[COPY HASH FOR YGG] Le magnet a été supprimé avec succès.");
        } else {
          console.error("Erreur lors de la suppression du magnet.");
        }
      },
      onerror: () => {
        console.error("Erreur lors de la suppression du magnet.");
      }
    });
  }

  // --------------------------------------------------------------------------- //

  if (location.pathname.includes('/torrent/')) {

    document.getElementsByTagName('tbody')[0].children[0].children[1].insertAdjacentHTML('afterbegin', `\n<a style="max-width:100%;color:#555555;top:-1px;font-size:11px;font-weight:700;text-transform:uppercase;border:3px solid #555555;border-radius:25px;padding:5px 10px;transition: all 0.3s ease; cursor:pointer;"
    class="butt-settings" onmouseover="this.style.background='#999999';this.style.color='#ffffff';"
    onmouseout="this.style.background='transparent';this.style.color='#555555';">Options <span
        class="ico_gear"></span></a>`);
    const sett = document.querySelector('a.butt-settings');
    sett.addEventListener('click', function(event) {
      event.preventDefault();
      cfg.open();
    });

    let boutons1 = cfg.get('Bouton_Copier_le_Hash');
    let boutons2 = cfg.get('Bouton_Envoyer_sur_Alldebrid');
    let boutons3 = cfg.get('Bouton_Envoyer_Torrent');
    let boutons4 = cfg.get('Ajouter_URL_Magnets');
    Alldebrid_API = cfg.get('API_Alldebrid');
    boutons1 = boutons1 == "Oui" ? true : false;
    boutons2 = boutons2 == "Oui" ? true : false;
    boutons3 = boutons3 == "Oui" ? true : false;
    boutons4 = boutons4 == "Oui" ? true : false;

    let hash = boutons4 ? 'magnet:?xt=urn:btih:' + document.getElementsByClassName('informations')[0].childNodes[1].childNodes[9].childNodes[3].textContent.replace('Tester', '') : document.getElementsByClassName('informations')[0].childNodes[1].childNodes[9].childNodes[3].textContent.replace('Tester', '');

    //

    function uploadMagnet(apikey, magnetHash, callback) {
      const apiUrl = `https://api.alldebrid.com/v4/magnet/upload?agent=ScriptYGGHash&apikey=${apikey}&magnets[]=${magnetHash}`;

      GM.xmlHttpRequest({
        method: "GET",
        url: apiUrl,
        onload: (response) => {
          const responseData = JSON.parse(response.responseText);
          if (responseData && responseData.status === "success" && responseData.data && responseData.data.magnets) {
            callback(responseData.data.magnets[0]);
          } else {
            callback(null);
          }
        },
        onerror: () => {
          callback(null);
        }
      });
    }

    async function uploadTorrent(apikey, agent, downloadLink, callback) {
        // Télécharger le fichier à partir du lien de téléchargement
        const response = await fetch(downloadLink);
        if (!response.ok) {
            alert('Connectez vous à votre compte YGG.');
            return;
        }

        //console.log(response)

        const fileBlob = await response.blob();

        //console.log('fileBlob', fileBlob);
        // Créer un objet FormData et ajouter le fichier
        const formData = new FormData();
        //console.log('formData', formData);

        const file = new File([fileBlob], 'downloadedFile.torrent');
        //console.log('file', file);
        formData.append('files[0]', file);

        // Ajouter les paramètres de requête à l'URL
        const queryParams = new URLSearchParams({
            agent: agent,
            apikey: apikey,
        });

        const apiUrl = 'https://api.alldebrid.com/v4/magnet/upload/file';
        const url = `${apiUrl}?${queryParams.toString()}`;

        try {
            // Envoyer la requête POST avec le fichier
            const uploadResponse = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            if (!uploadResponse.ok) {
                console.error('Failed to upload the file. Status:', uploadResponse.status);
                callback(null);
            }

            const result = await uploadResponse.json();
            //console.log('File upload successful:', result);
            if(result.data.files[0].error){
                alert('Connectez vous à votre compte YGG.');
                return
            }

            callback(true)
        } catch (error) {
            console.error('Error during file upload:', error.message);
        }
    }

    function formatSize(size) {
      if (size < 1024) {
        return size + " B";
      } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + " Ko";
      } else if (size < 1024 * 1024 * 1024) {
        return (size / (1024 * 1024)).toFixed(2) + " Mo";
      } else {
        return (size / (1024 * 1024 * 1024)).toFixed(2) + " Go";
      }
    }

    if (boutons1) {
      document.getElementsByTagName('tbody')[0].children[0].children[1].insertAdjacentHTML('beforeend', `\n<a
    style="max-width:100%;color:#d9a65a;top:-1px;font-size:11px;font-weight:700;text-transform:uppercase;border:3px solid #d9a65a;border-radius:25px;padding:5px 10px;transition: all 0.3s ease; cursor:pointer;"
    onclick="this.textContent='Copié !'" class="butt-hash"
    onmouseover="this.style.background='#d9a85a';this.style.color='#ffffff';"
    onmouseout="this.style.background='transparent';this.style.color='#d9ad5a';">Copier le hash <span class="ico_copy"></span>`);
      document.getElementsByClassName('butt-hash')[0].addEventListener('click', function() {
        navigator.clipboard.writeText(hash);
      });
    }
    if (boutons2) {
      document.getElementsByTagName('tbody')[0].children[0].children[1].insertAdjacentHTML('beforeend', `\n<a
        style="max-width:100%;color:#ffae42;top:-1px;font-size:11px;font-weight:700;text-transform:uppercase;border:3px solid #ffae42;border-radius:25px;padding:5px 10px;transition: all 0.3s ease; cursor:pointer;"
        class="butt-alledebrid" onmouseover="this.style.background='#ffc658';this.style.color='#ffffff';"
        onmouseout="this.style.background='transparent';this.style.color='#ffae42';">Hash vers Alldebrid <span class="ico_link"></span></a>
    `);
      const alldebridButton = document.getElementsByClassName('butt-alledebrid')[0];
      alldebridButton.addEventListener('click', function() {
        if (boutons2) {
          isPremium((userIsPremium) => {
            if (userIsPremium) {
              uploadMagnet(Alldebrid_API, hash, (responseMagnet) => {
                //console.log(responseMagnet);
                if (responseMagnet !== null) {
                  alldebridButton.textContent = "Envoyé !";
                } else {
                  alldebridButton.textContent = "Erreur Magnet :/";
                }
              });
            } else {
              alert("L'utilisateur de cette API n'est pas premium.");
            }
          });
        }
      });
    }
    if (boutons3) {
      document.getElementsByTagName('tbody')[0].children[0].children[1].insertAdjacentHTML('beforeend', `\n<a
        style="max-width:100%;color:#ffae42;top:-1px;font-size:11px;font-weight:700;text-transform:uppercase;border:3px solid #ffae42;border-radius:25px;padding:5px 10px;transition: all 0.3s ease; cursor:pointer;"
        class="butt-torrent" onmouseover="this.style.background='#ffc658';this.style.color='#ffffff';"
        onmouseout="this.style.background='transparent';this.style.color='#ffae42';">Fichier Torrent vers Alldebrid <span class="ico_file"></span></a>
    `);
      const torrentButton = document.getElementsByClassName('butt-torrent')[0];
      const link = "https://www.ygg.re/engine/download_torrent?id="+document.getElementById('saveFav').attributes[2].value.match(/id=(\d+)/)[1];
      torrentButton.addEventListener('click', function() {
        if (boutons2) {
          isPremium((userIsPremium) => {
            if (userIsPremium) {
              uploadTorrent(Alldebrid_API, "ScriptHashYGG", link, (responseMagnet) => {
                //console.log('responseMagnet', responseMagnet);
                if (responseMagnet !== null) {
                  //console.log('ODDDD');
                  torrentButton.textContent = "Envoyé !";
                } else {
                  //console.log('GGGGGGGG');
                  torrentButton.textContent = "Erreur Torrent :/";
                }
              });
            } else {
              alert("L'utilisateur de cette API n'est pas premium.");
            }
          });
        }
      });
    }

    const hash0 = document.getElementsByClassName('informations')[0].children[0].children[4].children[1].textContent.replace('Tester', '');

    const newRow = document.createElement('tr');

    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar'); // Ajoutez la classe de barre de progression de Bootstrap
    progressBar.setAttribute('role', 'progressbar');
    progressBar.style.width = '0%'; // Initialisez la largeur de la barre de progression à 0%
    progressBar.style.display = 'none';

    const statusCell = document.createElement('td');
    statusCell.style.verticalAlign = 'top';
    statusCell.insertAdjacentText('beforeend', 'Alldebrid');

    const progressBarStyle = document.createElement('style');
    progressBarStyle.textContent = `
        .progress-bar {
            position: relative;
            background: linear-gradient(to right, rgb(255, 237, 165) 100%, white 0px) 0% 0% / 28.2% no-repeat white;
            transition: all 1.6s linear 0s;
            display: none; /* Par défaut, la barre de progression est cachée */
            width: 0%; /* Largeur initiale à 0% */
        }
    `;
    // Ajout du style au header du document
    document.head.appendChild(progressBarStyle);

    const infoCell = document.createElement('td');
    infoCell.colSpan = 5;
    infoCell.style.position = 'relative'; // Ajoutez un style pour positionner les éléments de la barre de progression
    infoCell.classList.add('alldebrid-container');

    const statusElement = document.createElement('p');
    const downloadSpeedElement = document.createElement('p');
    const downloadedSizeElement = document.createElement('p');
    const progressElement = document.createElement('p');
    const totalSizeElement = document.createElement('p');
    const linkElement = document.createElement('p');
    const remainingTimeElement = document.createElement('p');

    statusElement.textContent = "Statut du torrent : N/A";
    downloadSpeedElement.textContent = "";
    downloadedSizeElement.textContent = "";
    progressElement.textContent = "";
    totalSizeElement.textContent = "";
    linkElement.textContent = "";
    remainingTimeElement.textContent = "";

    infoCell.appendChild(statusElement);
    infoCell.appendChild(downloadSpeedElement);
    infoCell.appendChild(progressBar);
    infoCell.appendChild(progressElement);
    infoCell.appendChild(downloadedSizeElement);
    infoCell.appendChild(totalSizeElement);
    infoCell.appendChild(remainingTimeElement);
    infoCell.appendChild(linkElement);

    newRow.appendChild(statusCell);
    newRow.appendChild(infoCell);

    const table = document.querySelector('.infos-torrent');
    table.querySelector('tbody').appendChild(newRow);

    const buttAllButton = document.getElementsByClassName('butt-alledebrid')[0];
    const torrentAll = document.getElementsByClassName('butt-torrent')[0];
    let intervalId;

    let isButtonClicked = false;

    //

    function updateProgressBar(progress) {
        const container = document.getElementsByClassName('alldebrid-container')[0];
        if (!container) return; // Sortir de la fonction si aucun conteneur n'est trouvé

        const progressBar = container.querySelector('.progress-bar');
        if (!progressBar) return; // Sortir de la fonction si aucune barre de progression n'est trouvée dans le conteneur

        if (progress === undefined) {
            // Si aucun argument n'est fourni, masquer la barre de progression
            progressBar.style.display = 'none';
        } else {
            // Sinon, mettre à jour la barre de progression avec la valeur fournie et le style donné
            //container.style.display = 'block';
            //container.style.position = 'relative';
            container.style.background = 'linear-gradient(to right, rgb(255, 237, 165) 100%, white 0px) 0% 0% / '+progress+'% no-repeat white';
            container.style.transition = 'all 1.6s linear 0s';
            //container.style.width = progress + '%';
            //container.textContent = progress + '%';
        }
    }


    function onClickHandler() {
      if (!isButtonClicked) {
        isButtonClicked = true;

        function getMagnetStatusAndUnlockLinks(magnetHash) {
          GM.xmlHttpRequest({
            method: "GET",
            url: `https://api.alldebrid.com/v4/magnet/status?agent=ScriptYGGHash&apikey=${Alldebrid_API}`,
            onload: function(response) {
              try {
                const torrentData = JSON.parse(response.responseText);
                const magnets = torrentData.data.magnets;
                const matchingMagnet = magnets.find((magnet) => magnet.hash === magnetHash);

                if (!matchingMagnet) {
                  console.error("Aucun magnet correspondant trouvé.");
                  return;
                }

                const status = matchingMagnet.status;

                const viewLinksElement = document.createElement('a');
                viewLinksElement.id = 'viewLinks';
                viewLinksElement.classList.add('noselect');
                viewLinksElement.textContent = 'Voir les liens';
                viewLinksElement.style.display = 'block';

                const linksContainer = document.createElement('div');
                linksContainer.id = 'linksContainer';
                linksContainer.style.display = 'none';

                infoCell.appendChild(viewLinksElement);
                infoCell.appendChild(linksContainer);

                if (status === "Ready") {
                  viewLinksElement.addEventListener('click', async () => {
                    linksContainer.innerHTML = '';

                    const links = matchingMagnet.links;
                    if (links && links.length > 0) {
                      const unlockedLinkPromises = [];

                      function unlockLink(linkData) {
                        const filename = linkData.filename || "Inconnu";
                        const extension = filename.split('.').pop();

                        if (![".nfo", ".NFO"].includes(`.${extension}`)) {
                          const unlockPromise = new Promise((resolve, reject) => {
                            GM.xmlHttpRequest({
                              method: "GET",
                              url: `https://api.alldebrid.com/v4/link/unlock?agent=ScriptYGGHash&apikey=${Alldebrid_API}&link=${linkData.link}`,
                              onload: function(unlockResponse) {
                                try {
                                  const unlockData = JSON.parse(unlockResponse.responseText);
                                  const unlockedLink = unlockData.data.link;

                                  if (unlockedLink) {
                                    resolve({
                                      filename,
                                      link: unlockedLink
                                    });
                                  } else {
                                    console.error(`Échec du débridage du lien: ${linkData.link}`);
                                    reject(`Échec du débridage du lien: ${linkData.link}`);
                                  }
                                } catch (error) {
                                  console.error("Une erreur s'est produite lors du débridage du lien.", error);
                                  reject(error);
                                }
                              },
                              onerror: () => {
                                console.error("Une erreur s'est produite lors du débridage du lien.");
                                reject("Une erreur s'est produite lors du débridage du lien.");
                              },
                            });
                          });

                          unlockedLinkPromises.push(unlockPromise);
                        }
                      }

                      links.forEach(unlockLink);

                      try {
                        const unlockedLinks = await Promise.all(unlockedLinkPromises);

                        unlockedLinks.forEach((link) => {
                          const unlockedLinkElement = document.createElement('a');
                          const lineBreakElement = document.createElement('br');
                          unlockedLinkElement.href = link.link;
                          unlockedLinkElement.textContent = link.filename;
                          linksContainer.appendChild(unlockedLinkElement);
                          linksContainer.appendChild(lineBreakElement);
                        });

                        linksContainer.style.maxHeight = "0px";
                        linksContainer.style.transition = "max-height 0.8s ease-in-out";
                        linksContainer.style.display = 'block';
                        linksContainer.style.maxHeight = linksContainer.scrollHeight + 18 + "px";

                        const copyAllButton = document.createElement('a');
                        copyAllButton.textContent = 'Copier tous les liens';
                        const strongElement = document.createElement('strong');
                        const underlineElement = document.createElement('u');
                        underlineElement.appendChild(copyAllButton);
                        strongElement.appendChild(underlineElement);
                        copyAllButton.addEventListener('click', () => {
                          const allLinks = unlockedLinks.map((link) => link.link).join('\n');
                          const tempTextArea = document.createElement('textarea');
                          tempTextArea.value = allLinks;
                          document.body.appendChild(tempTextArea);
                          tempTextArea.select();
                          document.execCommand('copy');
                          document.body.removeChild(tempTextArea);
                          alert('Tous les liens ont été copiés dans le presse-papiers.');
                        });
                        linksContainer.appendChild(copyAllButton);
                      } catch (error) {
                        console.error("Une erreur s'est produite lors du débridage des liens.", error);
                      }
                    } else {
                      console.error("Aucun lien trouvé pour le magnet prêt.");
                    }
                  });
                } else {
                  console.error(`Le magnet n'est pas prêt (Statut: ${status})`);
                }
              } catch (error) {
                console.error("Une erreur s'est produite lors de la récupération du statut du magnet.", error);
              }
            },
            onerror: () => {
              console.error("Une erreur s'est produite lors de la récupération du statut du magnet.");
            },
          });
        }

        function calculateRemainingTime(downloadSpeed, downloadedSize, totalSize) {
          if (downloadSpeed === "N/A" || downloadedSize === "N/A" || totalSize === "N/A" || isNaN(downloadSpeed) || downloadSpeed <= 0 || isNaN(downloadedSize) || downloadedSize <= 0 || isNaN(totalSize) || totalSize <= 0) {
            return "N/A";
          }

          const remainingSeconds = (totalSize - downloadedSize) / downloadSpeed;
          const hours = Math.floor(remainingSeconds / 3600);
          const minutes = Math.floor((remainingSeconds % 3600) / 60);
          const seconds = Math.floor(remainingSeconds % 60);

          return `${hours}h ${minutes}m ${seconds}s`;
        }

        function getMagnetStatus() {
          GM.xmlHttpRequest({
            method: "GET",
            url: `https://api.alldebrid.com/v4/magnet/status?agent=ScriptYGGHash&apikey=${Alldebrid_API}`,
            onload: (response) => {
              const torrentData = JSON.parse(response.responseText);
              const magnets = torrentData.data.magnets;
              const matchingMagnet = magnets.find((magnet) => magnet.hash === hash0);
              const nondeb = `Non débridable via le hash, veuillez attendre un peu si c'est un torrent récent, sinon faites via le fichier torrent`;

              if (matchingMagnet) {
                const torrentStatus = matchingMagnet.status || "N/A";
                statusElement.textContent = `Statut du torrent : ${torrentStatus}`;

                if (torrentStatus === "In Queue") {
                  if (matchingMagnet.filename == "noname") {
                    statusElement.textContent = `Statut du torrent : ${nondeb}`;
                  } else {
                    statusElement.textContent = `Statut du torrent : En attente`;
                  }
                } else if (torrentStatus === "Uploading") {
                  if (matchingMagnet.filename == "noname") {
                    statusElement.textContent = `Statut du torrent : ${nondeb}`;
                  } else {
                    statusElement.textContent = `Statut du torrent : Upload en cours`;
                    const uploadedSpeed = matchingMagnet.uploadSpeed ? `${formatSize(matchingMagnet.uploadSpeed)} /s` : "N/A";
                    const uploadedSize = matchingMagnet.uploaded ? formatSize(matchingMagnet.uploaded) : "N/A";
                    const totalSize = matchingMagnet.size ? formatSize(matchingMagnet.size) : "N/A";
                    const progress = uploadedSize !== "N/A" && totalSize !== "N/A" ? ((matchingMagnet.uploaded / matchingMagnet.size) *
                      100).toFixed(2) + "%" : "N/A";
                    const remainingTime = calculateRemainingTime(matchingMagnet.uploadSpeed, matchingMagnet.uploaded, matchingMagnet.size);
                    downloadSpeedElement.textContent = `Vitesse d'upload : ${uploadedSpeed}`;
                    progressElement.textContent = `Progression : ${progress}`;
                    updateProgressBar(progress.replace('%',''));
                    downloadedSizeElement.textContent = `Taille de l'upload : ${uploadedSize}`;
                    totalSizeElement.textContent = `Taille totale : ${totalSize}`;
                    remainingTimeElement.textContent = `Temps restant : ${remainingTime}`;
                  }
                } else if (torrentStatus === "Downloading") {
                  if (matchingMagnet.filename == "noname") {
                    statusElement.textContent = `Statut du torrent : ${nondeb}`;
                  } else {
                    statusElement.textContent = `Statut du torrent : Téléchargement en cours`;
                    const downloadSpeed = matchingMagnet.downloadSpeed ? `${formatSize(matchingMagnet.downloadSpeed)} /s` : "N/A";
                    const downloadedSize = matchingMagnet.downloaded ? formatSize(matchingMagnet.downloaded) : "N/A";
                    const totalSize = matchingMagnet.size ? formatSize(matchingMagnet.size) : "N/A";
                    const progress = downloadedSize !== "N/A" && totalSize !== "N/A" ? ((matchingMagnet.downloaded /
                      matchingMagnet.size) * 100).toFixed(2) + "%" : "N/A";
                    const remainingTime = calculateRemainingTime(matchingMagnet.downloadSpeed, matchingMagnet.downloaded, matchingMagnet.size);

                    downloadSpeedElement.textContent = `Vitesse de téléchargement : ${downloadSpeed}`;
                    updateProgressBar(progress.replace('%',''));
                    progressElement.textContent = `Progression : ${progress}`;
                    downloadedSizeElement.textContent = `Taille du téléchargement : ${downloadedSize}`;
                    totalSizeElement.textContent = `Taille totale : ${totalSize}`;
                    remainingTimeElement.textContent = `Temps restant : ${remainingTime}`;
                  }
                } else if (torrentStatus === "Ready") {
                  getMagnetStatusAndUnlockLinks(matchingMagnet.hash);
                  downloadSpeedElement.textContent = ``;
                  updateProgressBar();
                  downloadedSizeElement.textContent = ``;
                  remainingTimeElement.textContent = "";
                  statusElement.textContent = `Statut du torrent : Prêt`;
                  const totalSize = matchingMagnet.size ? formatSize(matchingMagnet.size) : "N/A";
                  totalSizeElement.textContent = `Taille totale : ${totalSize}`;
                  linkElement.innerHTML = ``;
                } else if (torrentStatus === "Proccessing failed (bad torrent ?)") {
                  if (matchingMagnet.filename == "noname") {
                    statusElement.textContent = `Statut du torrent : ${nondeb}`;
                  } else {
                    statusElement.textContent = `Débridage du torrent échoué`;
                  }
                } else {
                  downloadSpeedElement.textContent = "";
                  updateProgressBar();
                  downloadedSizeElement.textContent = "";
                  totalSizeElement.textContent = "";
                  linkElement.textContent = "";
                }
                if (matchingMagnet.status == "Ready" || matchingMagnet.filename == "noname") {
                  clearInterval(intervalId);
                }
                if (matchingMagnet.filename == "noname") {
                  deleteMagnet(matchingMagnet.id);
                }
              }
            },
            onerror: () => {
              console.error("Erreur de requête à l'API Alldebrid.");
            }
          });
        }

        if (buttAllButton.getAttribute('data-clicked') !== 'true') {
          buttAllButton.setAttribute('data-clicked', 'true');
          intervalId = setInterval(getMagnetStatus, 1000);
        }
      }
    };

    buttAllButton.addEventListener('click', onClickHandler);
    torrentAll.addEventListener('click', onClickHandler);


    function doesMagnetExist(magnetHash) {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                  method: "GET",
                  url: `https://api.alldebrid.com/v4/magnet/status?agent=ScriptYGGHash&apikey=${Alldebrid_API}`,
                  onload: (statusResponse) => {
                    try {
                      const torrentData = JSON.parse(statusResponse.responseText);
                      const magnets = torrentData.data.magnets;
                      const matchingMagnet = magnets.find((magnet) => magnet.hash === magnetHash);

                      if (matchingMagnet) {
                        const magnetExists = false;
                        resolve(magnetExists);
                      }else{
                        const magnetExists = true;
                        resolve(magnetExists);
                      }
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: (error) => {
                    reject(error);
                }
            });
        });
    }

    function isTorrentDebridable(magnetHash) {
      const nondeb = `Non débridable via le hash, veuillez attendre un peu si c'est un torrent récent, sinon faites via le fichier torrent`;
      return new Promise((resolve, reject) => {
        statusElement.textContent = "Statut du torrent : Vérification du torrent en cours";

        const intervalId = setInterval(() => {
          statusElement.textContent += ".";
        }, 1000);

        let deleteTheMagnet;

        doesMagnetExist(magnetHash)
          .then((exists) => {
            if (exists) {
              deleteTheMagnet=true;
            } else {
              deleteTheMagnet=false;
            }
          })
          .catch((error) => {
            console.error("Une erreur s'est produite lors de la vérification du magnet:", error);
          });

        GM.xmlHttpRequest({
          method: "GET",
          url: `https://api.alldebrid.com/v4/magnet/upload?agent=ScriptYGGHash&apikey=${Alldebrid_API}&magnets[]=${magnetHash}`,
          onload: (uploadResponse) => {
            clearInterval(intervalId);
            try {
              const uploadData = JSON.parse(uploadResponse.responseText);
              const magnetId = uploadData?.data?.magnets[0]?.id || null;

              if (!magnetId) {
                resolve({
                  debriable: false,
                  status: "Upload failed"
                });
              } else {
                GM.xmlHttpRequest({
                  method: "GET",
                  url: `https://api.alldebrid.com/v4/magnet/status?agent=ScriptYGGHash&apikey=${Alldebrid_API}`,
                  onload: (statusResponse) => {
                    try {
                      const torrentData = JSON.parse(statusResponse.responseText);
                      const magnets = torrentData.data.magnets;
                      const matchingMagnet = magnets.find((magnet) => magnet.id === magnetId);

                      if (matchingMagnet) {
                        const torrentStatus = matchingMagnet.status || "N/A";
                        //console.log(matchingMagnet);

                        if (
                          (torrentStatus === "In Queue" && matchingMagnet.filename === "noname") ||
                          (torrentStatus === "Uploading" && matchingMagnet.filename === "noname") ||
                          (torrentStatus === "Downloading" && matchingMagnet.filename === "noname") ||
                          (torrentStatus === "N/A" && matchingMagnet.filename === "noname")
                        ) {
                          resolve({
                            debriable: false,
                            status: nondeb
                          });
                          deleteMagnet(magnetId);
                        } else {
                          resolve({
                            debriable: true,
                            status: `Débridable`
                          });
                          deleteTheMagnet === true ? deleteMagnet(magnetId) : '';
                        }
                      } else {
                        resolve({
                          debriable: false,
                          status: "N/A"
                        });
                      }
                    } catch (error) {
                      resolve({
                        debriable: false,
                        status: "N/A"
                      });
                    }
                  },
                  onerror: () => {
                    resolve({
                      debriable: false,
                      status: "N/A"
                    });
                  },
                });
              }
            } catch (error) {
              resolve({
                debriable: false,
                status: "Upload failed"
              });
            }
          },
          onerror: () => {
            clearInterval(intervalId);
            resolve({
              debriable: false,
              status: "Upload failed"
            });
          },
        });
      });
    }

    isTorrentDebridable(hash)
      .then((result) => {
        if (result.debriable) {
          statusElement.innerHTML = `Statut du torrent : <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" style="vertical-align: middle; margin-right: 5px;"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>Torrent débridable via hash.`;
        } else {
          statusElement.innerHTML = `Statut du torrent : <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512" style="vertical-align: middle; margin-right: 5px;"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>${result.status}`;
        }

      })
      .catch((error) => {
        statusElement.textContent = "Une erreur s'est produite lors de la vérification du torrent.";
        console.error("Une erreur s'est produite lors de la vérification du torrent.", error);
      });

  }

  function copyTorrentHash(event) {
    event.preventDefault();

    const torrentLink = this.getAttribute('href');

    GM.xmlHttpRequest({
      method: "GET",
      url: torrentLink,
      onload: function(response) {
        //console.log(response.responseText);
        const parser = new DOMParser();
        const temp = parser.parseFromString(response.responseText, "text/html");
        const hash = temp.querySelector('#informationsContainer > div > table > tbody > tr:nth-child(5) > td:nth-child(2)').textContent.replace('Tester', '').trim();

        const dummyElement = document.createElement('textarea');
        dummyElement.value = hash;
        document.body.appendChild(dummyElement);
        dummyElement.select();
        document.execCommand('copy');
        document.body.removeChild(dummyElement);
      }
    });
    this.textContent = 'Copié !';
  }

  async function sendHashtoAllederid(event) {
    event.preventDefault();

    function getHash(torrentLink) {
      return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
          method: "GET",
          url: torrentLink,
          onload: function(response) {
            const parser = new DOMParser();
            const temp = parser.parseFromString(response.responseText, "text/html");
            const hash_ygg = temp.querySelector('#informationsContainer > div > table > tbody > tr:nth-child(5) > td:nth-child(2)').textContent.replace('Tester', '').trim();
            resolve(hash_ygg);
          },
          onerror: function(error) {
            reject(error);
          }
        });
      });
    }

    function isTorrentDebridable(magnetHash, event) {
      const nondeb = `Non débridable`;
      return new Promise((resolve, reject) => {

        GM.xmlHttpRequest({
          method: "GET",
          url: `https://api.alldebrid.com/v4/magnet/upload?agent=ScriptYGGHash&apikey=${Alldebrid_API}&magnets[]=${magnetHash}`,
          onload: (uploadResponse) => {
            clearInterval(intervalId);
            try {
              const uploadData = JSON.parse(uploadResponse.responseText);
              const magnetId = uploadData?.data?.magnets[0]?.id || null;

              if (!magnetId) {
                resolve({
                  debriable: false,
                  status: "Upload failed"
                });
              } else {
                GM.xmlHttpRequest({
                  method: "GET",
                  url: `https://api.alldebrid.com/v4/magnet/status?agent=ScriptYGGHash&apikey=${Alldebrid_API}`,
                  onload: (statusResponse) => {
                    try {
                      const torrentData = JSON.parse(statusResponse.responseText);
                      const magnets = torrentData.data.magnets;
                      const matchingMagnet = magnets.find((magnet) => magnet.id === magnetId);

                      if (matchingMagnet) {
                        const torrentStatus = matchingMagnet.status || "N/A";

                        console.log(matchingMagnet);

                        if (
                          (torrentStatus === "In Queue" && matchingMagnet.filename === "noname" || matchingMagnet.filename === matchingMagnet.hash) ||
                          (torrentStatus === "Uploading" && matchingMagnet.filename === "noname" || matchingMagnet.filename === matchingMagnet.hash) ||
                          (torrentStatus === "Downloading" && matchingMagnet.filename === "noname" || matchingMagnet.filename === matchingMagnet.hash) ||
                          (torrentStatus === "N/A" && matchingMagnet.filename === "noname" || matchingMagnet.filename === matchingMagnet.hash)
                        ) {
                          resolve({
                            debriable: false,
                            status: nondeb
                          });
                        } else {
                          resolve({
                            debriable: true,
                            status: `Débridable`
                          });
                        }
                      } else {
                        resolve({
                          debriable: false,
                          status: "N/A"
                        });
                      }
                    } catch (error) {
                      resolve({
                        debriable: false,
                        status: "N/A"
                      });
                    }
                  },
                  onerror: () => {
                    resolve({
                      debriable: false,
                      status: "N/A"
                    });
                  },
                });
              }
            } catch (error) {
              resolve({
                debriable: false,
                status: "Upload failed"
              });
            }
          },
          onerror: () => {
            resolve({
              debriable: false,
              status: "Upload failed"
            });
          },
        });
      });
    }

    const torrentLink = this.getAttribute('href');
    console.log(torrentLink)
    let intervalId;
    if (Alldebrid_API != "") {
      isPremium((userIsPremium) => {
        if (userIsPremium) {
          getHash(torrentLink)
            .then((hashh) => {
              this.textContent = "Vérification en cours";
              intervalId = setInterval(() => {
                this.textContent += ".";
              }, 1000);
              isTorrentDebridable(hashh)
                .then((result) => {
                  clearInterval(intervalId);
                  if (result.debriable) {
                    this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" style="vertical-align: middle; margin-right: 5px;"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>${result.status}`;
                  } else {
                    this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512" style="vertical-align: middle; margin-right: 5px;"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>Non débridable`;
                  }
                })
                .catch((error) => {
                  clearInterval(intervalId);
                  this.textContent = "Erreur";
                  console.error("Une erreur s'est produite lors de la vérification du torrent.", error);
                });
            })
            .catch((error) => {
              console.error('Une erreur s\'est produite :', error);
            });
        } else {
          alert("L'utilisateur de cette API n'est pas premium.");
        }
      });
    } else {
      this.textContent = 'API non renseignée';
      cfg.open();
    }
  }

  if (location.pathname.includes('/engine/search') || location.pathname.includes('/top') || location.pathname.includes('/engine/mostseededs')) {
    for (let i = 0; i < 30; i++) {
      const functionName = `start_hash_${i}`;
      window[functionName] = function() {
        const tableId = `DataTables_Table_${i}`;
        const table = document.getElementById(tableId);
        if (table) {
          const torrentLinks = table.querySelectorAll('tbody tr td:nth-child(2) a');
          torrentLinks.forEach(function(link) {
            const copyButton = document.createElement('a');
            copyButton.setAttribute('href', link.href);
            const imgElement0 = document.createElement('img');
            imgElement0.setAttribute('src', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6YglfyfbNmrFWRZSkwUegLc_YRW6zWDGR1D6uPCuxSYHEUvRzPYpIQy27E2BREn22C5I&usqp=CAU');
            imgElement0.setAttribute('alt', 'Copy Hash');
            imgElement0.style.width = '20px';
            imgElement0.style.height = '20px';
            copyButton.appendChild(imgElement0);
            copyButton.style.marginLeft = '10px';
            copyButton.addEventListener('click', copyTorrentHash);
            link.parentNode.appendChild(copyButton);

           const sendButton = document.createElement('a');
           sendButton.setAttribute('href', link.href);
           const imgElement = document.createElement('img');
           imgElement.setAttribute('src', 'https://cdn-icons-png.flaticon.com/512/561/561226.png');
           imgElement.setAttribute('alt', 'Send Alldebrid');
           imgElement.style.width = '20px';
           imgElement.style.height = '20px';
           sendButton.appendChild(imgElement);
           sendButton.style.marginLeft = '10px';
           sendButton.addEventListener('click', sendHashtoAllederid);
           link.parentNode.appendChild(sendButton);
          });
        };
      }
      setTimeout(window[functionName], 1000);
    }
  } else if(location.pathname.includes('/torrents/exclus')) {
      function exclus() {
        const tableId = `table`;
        const table = document.getElementsByClassName(tableId)[0];
        if (table) {
          const torrentLinks = table.querySelectorAll('tbody tr td:nth-child(2) a');
          torrentLinks.forEach(function(link) {
            const copyButton = document.createElement('a');
            copyButton.setAttribute('href', link.href);
            const imgElement0 = document.createElement('img');
            imgElement0.setAttribute('src', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6YglfyfbNmrFWRZSkwUegLc_YRW6zWDGR1D6uPCuxSYHEUvRzPYpIQy27E2BREn22C5I&usqp=CAU');
            imgElement0.setAttribute('alt', 'Copy Hash');
            imgElement0.style.width = '20px';
            imgElement0.style.height = '20px';
            copyButton.appendChild(imgElement0);
            copyButton.style.marginLeft = '10px';
            copyButton.addEventListener('click', copyTorrentHash);
            link.parentNode.appendChild(copyButton);

           const sendButton = document.createElement('a');
           sendButton.setAttribute('href', link.href);
           const imgElement = document.createElement('img');
           imgElement.setAttribute('src', 'https://cdn-icons-png.flaticon.com/512/561/561226.png');
           imgElement.setAttribute('alt', 'Send Alldebrid');
           imgElement.style.width = '20px';
           imgElement.style.height = '20px';
           sendButton.appendChild(imgElement);
           sendButton.style.marginLeft = '10px';
           sendButton.addEventListener('click', sendHashtoAllederid);
           link.parentNode.appendChild(sendButton);
          });
        };
      }
      setTimeout(exclus, 1000);
  };

});




// POUR OPTIONS
function MonkeyConfig() {
    var cfg = this,
        /* Data object passed to the constructor */
        data,
        /* Configuration parameters (data.parameters or data.params) */
        params,
        /* Current values of configuration parameters */
        values = {},
        /* Identifier used to store/retrieve configuration */
        storageKey,
        /* Is the configuration dialog displayed? */
        displayed,
        /* Currently displayed window/layer */
        openWin, openLayer,
        /* DOM element wrapping the configuration form */
        container,
        /* Darkened overlay used in the layer display mode */
        overlay;

    /**
     * Initialize configuration
     *
     * @param newData New data object
     */
    function init(newData) {
        data = newData;

        if (data) {
            params = data.parameters || data.params;

            if (data.buttons === undefined)
                /* Set default buttons */
                data.buttons = [ 'save', 'defaults', 'cancel' ];

            if (data.title === undefined)
                /*
                 * If GM_getMetadata is available, get the name of the script
                 * and use it in the dialog title
                 */
                if (typeof GM_getMetadata == 'function') {
                    var scriptName = GM_getMetadata('name');
                    data.title = scriptName + ' Configuration';
                }
                else
                    data.title = 'Configuration';
        }

        /* Make a safe version of title to be used as stored value identifier */
        var safeTitle = data && data.title ?
                data.title.replace(/[^a-zA-Z0-9]/g, '_') : '';

        storageKey = '_MonkeyConfig_' + safeTitle + '_cfg';

        var storedValues;

        /* Load stored values (if present) */
        if (GM_getValue(storageKey))
            storedValues = JSON.parse(GM_getValue(storageKey));

        for (var name in params) {
            /* If there's a value defined in the passed data object, use it */
            if (params[name]['value'] !== undefined)
                set(name, params[name].value);
            /* Check if there's a stored value for this parameter */
            else if (storedValues && storedValues[name] !== undefined)
                set(name, storedValues[name]);
            /* Otherwise, set the default value (if defined) */
            else if (params[name]['default'] !== undefined)
                set(name, params[name]['default']);
            else
                set(name, '');
        }

        if (data.menuCommand) {
            /* Add an item to the User Script Commands menu */
            var caption = data.menuCommand !== true ? data.menuCommand :
                data.title;

            GM_registerMenuCommand(caption, function () { cfg.open(); });
        }

        /* Expose public methods */
        cfg.open = open;
        cfg.close = close;
        cfg.get = get;
        cfg.set = function (name, value) {
            set(name, value);
            update();
        };
    }

    /**
     * Get the value of a configuration parameter
     *
     * @param name Name of the configuration parameter
     * @returns Value of the configuration parameter
     */
    function get(name) {
        return values[name];
    }

    /**
     * Set the value of a configuration parameter
     *
     * @param name Name of the configuration parameter
     * @param value New value of the configuration parameter
     */
    function set(name, value) {
        values[name] = value;
    }

    /**
     * Reset configuration parameters to default values
     */
    function setDefaults() {
        for (var name in params) {
            if (typeof params[name]['default'] !== 'undefined') {
                set(name, params[name]['default']);
            }
        }
    }

    /**
     * Render the configuration dialog
     */
    function render() {
        var html = '<div class="__MonkeyConfig_container">' +
            '<h1>' + data.title + '</h1>' +
            '<table>';

        for (var name in params) {
            html += MonkeyConfig.formatters['tr'](name, params[name]);}

        html += '<tr><td colspan="2" class="__MonkeyConfig_buttons">' +
                '<table><tr>';

        /* Render buttons */
        for (var button in data.buttons) {
            html += '<td>';

            switch (data.buttons[button]) {
            case 'cancel':
                html += '<button type="button" ' +
                    'id="__MonkeyConfig_button_cancel">' +
                    '<img src="data:image/png;base64,' +
                        MonkeyConfig.res.icons.cancel + '" />&nbsp;' +
                    'Annuler</button>';
                break;
            case 'defaults':
                html += '<button type="button" ' +
                    'id="__MonkeyConfig_button_defaults">' +
                    '<img src="data:image/png;base64,' +
                        MonkeyConfig.res.icons.arrow_undo + '" />&nbsp;' +
                    'Par&nbsp;Défaut</button>';
                break;
            case 'save':
                html += '<button type="button" ' +
                    'id="__MonkeyConfig_button_save">' +
                    '<img src="data:image/png;base64,' +
                        MonkeyConfig.res.icons.tick + '" />&nbsp;' +
                    'Sauvegarder</button>';
                break;
            }

            html += '</td>';
        }

        html += '</tr></table></td></tr>';

        html += "</table><div>";

        return html;
    }

    /**
     * Update the fields in the dialog to reflect current values
     */
    function update() {
        /* Do nothing if the dialog is not currently displayed */
        if (!displayed)
            return;

        for (var name in params) {
            var value = values[name];

            switch (params[name].type) {
            case 'checkbox':
                var elem = container.querySelector('[name="' + name + '"]');
                elem.checked = !!value;
                break;
            case 'custom':
                params[name].set(value, container
                        .querySelector('#__MonkeyConfig_parent_' + name));
                break;
            case 'number': case 'text':
                var elem = container.querySelector('[name="' + name + '"]');
                elem.value = value;
                break;
            case 'select':
                var elem = container.querySelector('[name="' + name + '"]');

                if (elem.tagName.toLowerCase() == 'input') {
                    if (elem.type && elem.type == 'radio') {
                        /* Single selection with radio buttons */
                        elem = container.querySelector(
                            '[name="' + name + '"][value="' + value + '"]');
                        elem.checked = true;
                    }
                    else if (elem.type && elem.type == 'checkbox') {
                        /* Multiple selection with checkboxes */
                        var checkboxes = container.querySelectorAll(
                            'input[name="' + name + '"]');

                        for (var i = 0; i < checkboxes.length; i++)
                            checkboxes[i].checked =
                                (value.indexOf(checkboxes[i].value) > -1);
                    }
                }
                else if (elem.tagName.toLowerCase() == 'select')
                    if (elem.multiple) {
                        /* Multiple selection element */
                        var options = container.querySelectorAll(
                            'select[name="' + name + '"] option');

                        for (var i = 0; i < options.length; i++)
                            options[i].selected =
                                (value.indexOf(options[i].value) > -1);
                    }
                    else
                        /* Single selection element */
                        elem.value = value;
                break;
            }
        }
    }

    /**
     * Save button click event handler
     */
    function saveClick() {
        for (name in params) {
            switch (params[name].type) {
            case 'checkbox':
                var elem = container.querySelector('[name="' + name + '"]');
                values[name] = elem.checked;
                break;
            case 'custom':
                values[name] = params[name].get(container
                        .querySelector('#__MonkeyConfig_parent_' + name));
                break;
            case 'number': case 'text':
                var elem = container.querySelector('[name="' + name + '"]');
                values[name] = elem.value;
                break;
            case 'select':
                var elem = container.querySelector('[name="' + name + '"]');

                if (elem.tagName.toLowerCase() == 'input') {
                    if (elem.type && elem.type == 'radio')
                        /* Single selection with radio buttons */
                        values[name] = container.querySelector(
                            '[name="' + name + '"]:checked').value;
                    else if (elem.type && elem.type == 'checkbox') {
                        /* Multiple selection with checkboxes */
                        values[name] = [];
                        var inputs = container.querySelectorAll(
                            'input[name="' + name + '"]');

                        for (var i = 0; i < inputs.length; i++)
                            if (inputs[i].checked)
                                values[name].push(inputs[i].value);
                    }
                }
                else if (elem.tagName.toLowerCase() == 'select' && elem.multiple) {
                    /* Multiple selection element */
                    values[name] = [];
                    var options = container.querySelectorAll(
                        'select[name="' + name + '"] option');

                    for (var i = 0; i < options.length; i++)
                        if (options[i].selected)
                            values[name].push(options[i].value);
                }
                else
                    values[name] = elem.value;
                break;
            }
        }

        GM_setValue(storageKey, JSON.stringify(values));

        close();

        location.reload(true);

        if (data.onSave)
            data.onSave(values);
    }

    /**
     * Cancel button click event handler
     */
    function cancelClick() {
        close();
    }

    /**
     * Set Defaults button click event handler
     */
    function defaultsClick() {
        setDefaults();
        update();
    }

    /**
     * Open configuration dialog
     *
     * @param mode
     *            Display mode ("iframe", "layer", or "window", defaults to
     *            "iframe")
     * @param options
     *            Display mode options
     */
    function open(mode, options) {
        function openDone() {
            /* Attach button event handlers */
            var button;

            if (button = container.querySelector('#__MonkeyConfig_button_save'))
                button.addEventListener('click', saveClick, true);
            if (button = container.querySelector('#__MonkeyConfig_button_cancel'))
                button.addEventListener('click', cancelClick, true);
            if (button = container.querySelector('#__MonkeyConfig_button_defaults'))
                button.addEventListener('click', defaultsClick, true);

            displayed = true;
            update();
        }

        switch (mode) {
        case 'window':
            var windowFeatures = {
                location: 'no',
                status: 'no',
                left: window.screenX,
                top: window.screenY,
                width: 100,
                height: 100
            };

            /* Additional features may be specified as an option */
            if (options && options.windowFeatures)
                for (var name in options.windowFeatures)
                    windowFeatures[name] = options.windowFeatures[name];

            var featuresArray = [];

            for (var name in windowFeatures)
                featuresArray.push(name + '=' + windowFeatures[name]);

            var win = window.open('', data.title, featuresArray.join(','));

            /* Find head and body (then call the blood spatter analyst) */
            var head = win.document.getElementsByTagName('head')[0],
                body = win.document.getElementsByTagName('body')[0];

            head.innerHTML = '<title>' + data.title + '</title>' +
                '<style type="text/css">' +
                MonkeyConfig.res.stylesheets.main + '</style>';

            body.className = '__MonkeyConfig_window';
            /* Place the rendered configuration dialog inside the window body */
            body.innerHTML = render();

            /* Find the container (CBAN-3489) */
            container = win.document.querySelector('.__MonkeyConfig_container');

            /* Resize window to the dimensions of the container div */
            win.innerWidth = container.clientWidth;
            win.resizeBy(0, -win.innerHeight + container.clientHeight);

            /* Place the window centered relative to the parent */
            win.moveBy(Math.round((window.outerWidth - win.outerWidth) / 2),
                Math.round((window.outerHeight - win.outerHeight) / 2));

            openWin = win;

            openDone();

            break;
        case 'layer':
            if (!MonkeyConfig.styleAdded) {
                GM_addStyle(MonkeyConfig.res.stylesheets.main);
                MonkeyConfig.styleAdded = true;
            }

            var body = document.querySelector('body');

            /* Create the layer element */
            openLayer = document.createElement('div');
            openLayer.className = '__MonkeyConfig_layer';

            /* Create the overlay */
            overlay = document.createElement('div');
            overlay.className = '__MonkeyConfig_overlay';
            overlay.style.left = 0;
            overlay.style.top = 0;
            overlay.style.width = window.innerWidth + 'px';
            overlay.style.height = window.innerHeight + 'px';
            overlay.style.zIndex = 9999;

            body.appendChild(overlay);
            body.appendChild(openLayer);

            /*
             * Place the rendered configuration dialog inside the layer element
             */
            openLayer.innerHTML = render();

            /* Position the layer in the center of the viewport */
            openLayer.style.left = Math.round((window.innerWidth -
                    openLayer.clientWidth) / 2) + 'px';
            openLayer.style.top = Math.round((window.innerHeight -
                    openLayer.clientHeight) / 2) + 'px';
            openLayer.style.zIndex = 9999;

            container = document.querySelector('.__MonkeyConfig_container');

            openDone();

            break;
        case 'iframe':
        default:
            if (!MonkeyConfig.styleAdded) {
                GM_addStyle(MonkeyConfig.res.stylesheets.main);
                MonkeyConfig.styleAdded = true;
            }

            var body = document.querySelector('body');
            var iframe = document.createElement('iframe');

            /* Create the layer element */
            openLayer = document.createElement('div');
            openLayer.className = '__MonkeyConfig_layer';

            /* Create the overlay */
            overlay = document.createElement('div');
            overlay.className = '__MonkeyConfig_overlay';
            overlay.style.left = 0;
            overlay.style.top = 0;
            overlay.style.width = window.innerWidth + 'px';
            overlay.style.height = window.innerHeight + 'px';
            overlay.style.zIndex = 9999;

            iframe.id = '__MonkeyConfig_frame';
            /*
             * Make the iframe transparent so that it remains invisible until
             * the document inside it is ready
             */
            iframe.style.opacity = 0;
            iframe.src = 'about:blank';

            /* Make the iframe seamless with no border and no scrollbars */
            if (undefined !== iframe.frameborder)
                iframe.frameBorder = '0';
            if (undefined !== iframe.scrolling)
                iframe.scrolling = 'no';
            if (undefined !== iframe.seamless)
                iframe.seamless = true;

            /* Do the rest in the load event handler */
            iframe.addEventListener('load', function () {
                iframe.contentDocument.body.innerHTML = render();
                iframe.style.opacity = 1;

                /* Append the style to the head */
                var head = iframe.contentDocument.querySelector('head'),
                    style = iframe.contentDocument.createElement('style');
                style.setAttribute('type', 'text/css');
                style.appendChild(iframe.contentDocument.createTextNode(
                        MonkeyConfig.res.stylesheets.main));
                head.appendChild(style);

                var body = iframe.contentDocument.querySelector('body');
                body.className = '__MonkeyConfig_body';

                container = iframe.contentDocument
                    .querySelector('.__MonkeyConfig_container');

                iframe.width = container.clientWidth;
                iframe.height = container.clientHeight;

                /* Position the layer in the center of the viewport */
                openLayer.style.left = Math.round((window.innerWidth -
                        openLayer.clientWidth) / 2.45) + 'px';
                openLayer.style.top = Math.round((window.innerHeight -
                        openLayer.clientHeight) / 2) + 'px';
                openLayer.style.zIndex = 9999;

                openDone();
            }, false);

            setTimeout(function () {
                iframe.width = container.clientWidth;
                iframe.height = container.clientHeight;

                /* Position the layer in the center of the viewport */
                openLayer.style.left = Math.round((window.innerWidth -
                        openLayer.clientWidth) / 2) + 'px';
                openLayer.style.top = Math.round((window.innerHeight -
                        openLayer.clientHeight) / 2) + 'px';
                openLayer.style.zIndex = 9999;
            }, 0);

            body.appendChild(overlay);
            body.appendChild(openLayer);
            openLayer.appendChild(iframe);

            break;
        }
    }

    /**
     * Close configuration dialog
     */
    function close() {
        if (openWin) {
            openWin.close();
            openWin = undefined;
        }
        else if (openLayer) {
            openLayer.parentNode.removeChild(openLayer);
            openLayer = undefined;

            if (overlay) {
                overlay.parentNode.removeChild(overlay);
                overlay = undefined;
            }
        }

        displayed = false;
    }

    init(arguments[0]);
}

/**
 * Replace double quotes with entities so that the string can be safely used
 * in a HTML attribute
 *
 * @param string A string
 * @returns String with double quotes replaced with entities
 */
MonkeyConfig.esc = function (string) {
    return string.replace(/"/g, '&quot;');
};

MonkeyConfig.HTML = {
    '_field': function (name, options, data) {
        var html;

        if (options.type && MonkeyConfig.HTML[options.type])
            html = MonkeyConfig.HTML[options.type](name, options, data);
        else
            return;

        if (/\[FIELD\]/.test(options.html)) {
            html = options.html.replace(/\[FIELD\]/, html);
        }

        return html;
    },
    '_label': function (name, options, data) {
        var label = options['label'] ||
            name.substring(0, 1).toUpperCase() + name.substring(1)
                .replace(/_/g, '&nbsp;')
                .replace(/é/g, "\u002F")
                .replace(/0/g, "...")
                .replace(/1/g, "'");

        return '<label for="__MonkeyConfig_field_' + name + '">' + label +
          '</label>';
    },
    'checkbox': function (name, options, data) {
        return '<input id="__MonkeyConfig_field_' + name +
            '" type="checkbox" name="' + name + '" />';
    },
    'custom': function (name, options, data) {
        return options.html;
    },
    'number': function (name, options, data) {
        return '<input id="__MonkeyConfig_field_' + name + '" ' +
            'type="text" class="__MonkeyConfig_field_number" ' +
            'name="' + name + '" />';
    },
    'select': function (name, options, data) {
        var choices = {}, html = '';

        if (options.choices.constructor == Array) {
            /* options.choices is an array -- build key/value pairs */
            for (var i = 0; i < options.choices.length; i++)
                choices[options.choices[i]] = options.choices[i];
        }
        else
            /* options.choices is an object -- use it as it is */
            choices = options.choices;

        if (!options.multiple) {
            /* Single selection */
            if (!/^radio/.test(options.variant)) {
                /* Select element */
                html += '<select id="__MonkeyConfig_field_' + name + '" ' +
                    'class="__MonkeyConfig_field_select" ' +
                    'name="' + name + '">';

                for (var value in choices)
                    html += '<option value="' + MonkeyConfig.esc(value) + '">' +
                        choices[value] + '</option>';

                html += '</select>';
            }
            else {
                /* Radio buttons */
                for (var value in choices) {
                    html += '<label><input type="radio" name="' + name + '" ' +
                        'value="' + MonkeyConfig.esc(value) + '" />&nbsp;' +
                        choices[value] + '</label>' +
                        (/ column/.test(options.variant) ? '<br />' : '');
                }
            }
        }
        else {
            /* Multiple selection */
            if (!/^checkbox/.test(options.variant)) {
                /* Checkboxes */
                html += '<select id="__MonkeyConfig_field_' + name + '" ' +
                    'class="__MonkeyConfig_field_select" ' +
                    'multiple="multiple" ' +
                    'name="' + name + '">';

                for (var value in choices)
                    html += '<option value="' + MonkeyConfig.esc(value) + '">' +
                        choices[value] + '</option>';

                html += '</select>';
            }
            else {
                /* Select element */
                for (var value in choices) {
                    html += '<label><input type="checkbox" ' +
                        'name="' + name + '" ' +
                        'value="' + MonkeyConfig.esc(value) + '" />&nbsp;' +
                        choices[value] + '</label>' +
                        (/ column/.test(options.variant) ? '<br />' : '');
                }
            }
        }

        return html;
    },
    'text': function (name, options, data) {
        if (options.long)
            return '<textarea id="__MonkeyConfig_field_' + name + '" ' +
                'class="__MonkeyConfig_field_text" ' +
                (!isNaN(options.long) ? 'rows="' + options.long + '" ' : '') +
                'name="' + name + '"></textarea>';
        else
            return '<input id="__MonkeyConfig_field_' + name + '" ' +
                'type="text" class="__MonkeyConfig_field_text" ' +
                'name="' + name + '" />';
    }

};

MonkeyConfig.formatters = {
    'tr': function (name, options, data) {
        var html = '<tr>';

        switch (options.type) {
        case 'checkbox':
            /* Checkboxes get special treatment */
            html += '<td id="__MonkeyConfig_parent_' + name + '" colspan="2">';
            html += MonkeyConfig.HTML['_field'](name, options, data) + ' ';
            html += MonkeyConfig.HTML['_label'](name, options, data);
            html += '</td>';
            break;
        default:
            html += '<td>';
            html += MonkeyConfig.HTML['_label'](name, options, data);
            html += '</td><td id="__MonkeyConfig_parent_' + name + '">';
            html += MonkeyConfig.HTML['_field'](name, options, data);
            html += '</td>';
            break;
        }

        html += '</tr>';

        return html;
    }
};

/* Has the stylesheet been added? */
MonkeyConfig.styleAdded = false;

/* Resources */
MonkeyConfig.res = {};

/* Icons */
MonkeyConfig.res.icons = {
    'arrow_undo': 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0\
U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIJSURBVDjLpVM9aJNRFD35GsRSoUKKzQ/B\
0NJJF3EQlKrVgijSCBmC4NBFKihIcXBwEZdSHVoUwUInFUEkQ1DQ4CKiFsQsTrb5xNpgaZHw2Uog\
5t5zn0NJNFaw0guX97hwzuPcc17IOYfNlIdNVrhxufR6xJkZjAbSQGXjNAorqixSWFDV3KPhJ+UG\
LtSQMPryrDscPwLnAHOEOQc6gkbUpIagGmApWIb/pZRX4fjj889nWiSQtgYyBZ1BTUEj6AjPa0P7\
1nb0Jfqwa+futIheHrzRn2yRQCUK/lOQhApBJVQJChHfnkCqOwWEQ+iORJHckUyX5ksvAEyGNuJC\
+s6xCRXNHNxzKMmQ4luwgjfvZp69uvr2+IZcyJ8rjIporrxURggetnV0QET3rrPxzMNM2+n7p678\
jUTrCiWhphAjVHR9DlR0WkSzf4IHxg5MSF0zXZEuVKWKSlCBCostS8zeG7oV64wPqxInbw86lbVX\
KEQ8mkAqmUJ4SxieeVhcnANFC02C7N2h69HO2IXeWC8MDj2JnqaFNAMd8f3HKjx6+LxQRmnOz1OZ\
axKIaF1VISYwB9ARZoQaYY6o1WpYCVYxt+zDn/XzVBv/MOWXW5J44ubRyVgkelFpmF/4BJVfOVDl\
VyqLVBZI5manPjajDOdcswfG9k/3X9v3/vfZv7rFBanriIo++J/f+BMT+YWS6hXl7QAAAABJRU5E\
rkJggg==',
    'cancel': 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0\
U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHdSURBVDjLpZNraxpBFIb3a0ggISmmNISW\
XmOboKihxpgUNGWNSpvaS6RpKL3Ry//Mh1wgf6PElaCyzq67O09nVjdVlJbSDy8Lw77PmfecMwZg\
/I/GDw3DCo8HCkZl/RlgGA0e3Yfv7+DbAfLrW+SXOvLTG+SHV/gPbuMZRnsyIDL/OASziMxkkKkU\
QTJJsLaGn8/iHz6nd+8mQv87Ahg2H9Th/BxZqxEkEgSrq/iVCvLsDK9awtvfxb2zjD2ARID+lVVl\
babTgWYTv1rFL5fBUtHbbeTJCb3EQ3ovCnRC6xAgzJtOE+ztheYIEkqbFaS3vY2zuIj77AmtYYDu\
sPy8/zuvunJkDKXM7tYWTiyGWFjAqeQnAD6+7ueNx/FLpRGAru7mcoj5ebqzszil7DggeF/DX1nB\
N82rzPqrzbRayIsLhJqMPT2N83Sdy2GApwFqRN7jFPL0tF+10cDd3MTZ2AjNUkGCoyO6y9cRxfQo\
wFUbpufr1ct4ZoHg+Dg067zduTmEbq4yi/UkYidDe+kaTcP4ObJIajksPd/eyx3c+N2rvPbMDPbU\
FPZSLKzcGjKPrbJaDsu+dQO3msfZzeGY2TCvKGYQhdSYeeJjUt21dIcjXQ7U7Kv599f4j/oF55W4\
g/2e3b8AAAAASUVORK5CYII=',
    'tick': 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0\
U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGrSURBVDjLvZPZLkNhFIV75zjvYm7VGFNC\
qoZUJ+roKUUpjRuqp61Wq0NKDMelGGqOxBSUIBKXWtWGZxAvobr8lWjChRgSF//dv9be+9trCwAI\
/vIE/26gXmviW5bqnb8yUK028qZjPfoPWEj4Ku5HBspgAz941IXZeze8N1bottSo8BTZviVWrEh5\
46EO03EXpuJOdG63otJbjBKHkEp/Ml6yNYYzpuezWL4s5VMtT8acCMQcb5XL3eJE8VgBlR7BeMGW\
9Z4yT9y1CeyucuhdTGDxfftaBO7G4L+zg91UocxVmCiy51NpiP3n2treUPujL8xhOjYOzZYsQWAN\
yRYlU4Y9Br6oHd5bDh0bCpSOixJiWx71YY09J5pM/WEbzFcDmHvwwBu2wnikg+lEj4mwBe5bC5h1\
OUqcwpdC60dxegRmR06TyjCF9G9z+qM2uCJmuMJmaNZaUrCSIi6X+jJIBBYtW5Cge7cd7sgoHDfD\
aAvKQGAlRZYc6ltJlMxX03UzlaRlBdQrzSCwksLRbOpHUSb7pcsnxCCwngvM2Rm/ugUCi84fycr4\
l2t8Bb6iqTxSCgNIAAAAAElFTkSuQmCC'
};

/* Stylesheets */
MonkeyConfig.res.stylesheets = {
    'main': '\
body.__MonkeyConfig_window {\
    appearance: window !important;\
    -moz-appearance: window !important;\
    background: auto;\
    font-family: sans-serif !important;\
    height: 100% !important;\
    margin: 0 !important;\
    padding: 0 !important;\
    width: 100% !important;\
}\
\
div.__MonkeyConfig_container {\
    display: table !important;\
    font-family: sans-serif !important;\
    padding: 0.3em !important;\
}\
\
body.__MonkeyConfig_window div.__MonkeyConfig_container {\
    appearance: window !important;\
    -moz-appearance: window !important;\
    height: 100%;\
    width: 100%;\
}\
\
div.__MonkeyConfig_container h1 {\
    border-bottom: solid 1px #999 !important;\
    font-family: sans-serif !important;\
    font-size: 120% !important;\
    margin: 0 !important;\
    padding: 0 0 0.3em 0 !important;\
}\
\
div.__MonkeyConfig_container table {\
    border-spacing: 0 !important;\
    margin: 0 !important;\
}\
\
div.__MonkeyConfig_container table td {\
    border: none !important;\
    line-height: 100% !important;\
    padding: 0.3em !important;\
    text-align: left !important;\
    vertical-align: top !important;\
    white-space: nowrap !important;\
}\
\
div.__MonkeyConfig_container table td.__MonkeyConfig_buttons {\
    padding: 0.2em 0 !important;\
}\
\
.__MonkeyConfig_field_number {\
    width: 5em !important;\
}\
\
div.__MonkeyConfig_container td.__MonkeyConfig_buttons table {\
    border-top: solid 1px #999 !important;\
    width: 100% !important;\
}\
\
div.__MonkeyConfig_container td.__MonkeyConfig_buttons td {\
    padding: 0.6em 0.3em 0.1em 0.3em !important;\
    text-align: center !important;\
    vertical-align: top;\
}\
\
div.__MonkeyConfig_container td.__MonkeyConfig_buttons button {\
    appearance: button !important;\
    -moz-appearance: button !important;\
    background-position: 8px 50% !important;\
    background-repeat: no-repeat !important;\
    padding: 3px 8px 3px 24px !important;\
    padding: 3px 8px !important;\
    white-space: nowrap !important;\
}\
\
div.__MonkeyConfig_container td.__MonkeyConfig_buttons button img {\
    vertical-align: middle !important;\
}\
\
div.__MonkeyConfig_layer {\
    display: table !important;\
    position: fixed !important;\
}\
\
div.__MonkeyConfig_layer div.__MonkeyConfig_container,\
body.__MonkeyConfig_body > div.__MonkeyConfig_container {\
    background: #eee linear-gradient(180deg,\
        #f8f8f8 0, #ddd 100%) !important;\
    border-radius: 0.5em !important;\
    box-shadow: 2px 2px 16px #000 !important;\
    color: #000 !important;\
    font-family: sans-serif !important;\
    font-size: 11pt !important;\
    padding: 1em 1em 0.4em 1em !important;\
}\
\
div.__MonkeyConfig_layer div.__MonkeyConfig_container td,\
div.__MonkeyConfig_layer div.__MonkeyConfig_container label,\
div.__MonkeyConfig_layer div.__MonkeyConfig_container input,\
div.__MonkeyConfig_layer div.__MonkeyConfig_container select,\
div.__MonkeyConfig_layer div.__MonkeyConfig_container textarea,\
div.__MonkeyConfig_layer div.__MonkeyConfig_container button {\
    color: #000 !important;\
    font-family: sans-serif !important;\
    font-size: 11pt !important;\
    line-height: 100% !important;\
    margin: 0 !important;\
    vertical-align: baseline !important;\
}\
\
div.__MonkeyConfig_container label {\
    line-height: 120% !important;\
    vertical-align: baseline !important;\
}\
\
div.__MonkeyConfig_container textarea {\
    vertical-align: text-top !important;\
    width: 100%;\
}\
\
div.__MonkeyConfig_layer div.__MonkeyConfig_container input[type="text"] {\
    appearance: textfield !important;\
    -moz-appearance: textfield !important;\
    background: #fff !important;\
}\
\
div.__MonkeyConfig_layer div.__MonkeyConfig_container h1 {\
    font-weight: bold !important;\
    text-align: left !important;\
}\
\
div.__MonkeyConfig_layer div.__MonkeyConfig_container td.__MonkeyConfig_buttons button,\
body > div.__MonkeyConfig_container td.__MonkeyConfig_buttons button {\
    appearance: button !important;\
    -moz-appearance: button !important;\
    background: #ccc linear-gradient(180deg,\
        #ddd 0, #ccc 45%, #bbb 50%, #aaa 100%) !important;\
    border-style: solid !important;\
    border-width: 1px !important;\
    border-radius: 0.5em !important;\
    box-shadow: 0 0 1px #000 !important;\
    color: #000 !important;\
    font-size: 11pt !important;\
}\
\
div.__MonkeyConfig_layer div.__MonkeyConfig_container td.__MonkeyConfig_buttons button:hover,\
body > div.__MonkeyConfig_container td.__MonkeyConfig_buttons button:hover {\
    background: #d2d2d2 linear-gradient(180deg,\
        #e2e2e2 0, #d2d2d2 45%, #c2c2c2 50%, #b2b2b2 100%) !important;\
}\
\
div.__MonkeyConfig_overlay {\
    background-color: #000 !important;\
    opacity: 0.6 !important;\
    position: fixed !important;\
}\
\
iframe#__MonkeyConfig_frame {\
    border: none !important;\
    box-shadow: 2px 2px 16px #000 !important;\
}\
\
body.__MonkeyConfig_body {\
    margin: 0 !important;\
    padding: 0 !important;\
}\
\
embed, iframe, object {\
    max-width: 200% !important;\
    width: 167% !important;\
}\
'
};