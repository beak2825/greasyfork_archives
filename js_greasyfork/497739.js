// ==UserScript==
// @name           YggTorrent Plus
// @match          https://www.ygg.re/*
// @version        1.25.1
// @author         J.H / clemente / Binouchette
// @license        MIT
// @description    Connexion automatique, boutons de téléchargement dans les résultats de recherche, prévisualisation des images de torrent, et bien d'autres améliorations.
// @run-at         document-end
// @noframes
// @grant          GM.getValue
// @grant          GM.setValue
// @grant          GM.deleteValue
// @grant          GM_addStyle
// @grant          GM_getResourceURL
// @grant          GM_xmlhttpRequest
// @namespace      https://greasyfork.org/fr/scripts/497739
// @icon           https://www.google.com/s2/favicons?sz=64&domain=ygg.re
// @downloadURL https://update.greasyfork.org/scripts/497739/YggTorrent%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/497739/YggTorrent%20Plus.meta.js
// ==/UserScript==

(async function() {
    const CONFIG = {
        HOVER_TABLE: true, // Change la couleur de fond du torrent au survol dans les résultats de recherche
        LOGIN_AUTOMATICALLY: true, // Se connecte automatiquement (première connexion manuel obligatoire)
        PREVIEWS_IMAGES_ON_HOVER: true, // Affiche une prévisualisation de l'image du torrent au survol
        PREVIEWS_IMAGES_SIZE: 400, // Taille des images de prévisualisation (en pixels)
        DOWNLOAD_BUTTONS_IN_RESULTS: true, // Ajoute un bouton de téléchargement dans les résultats de recherche
        HIDE_SIDEBAR: false, // Masque la barre latérale
        LARGER_NFO: true, // Agrandit la fenêtre de prévisualisation du NFO
        SEARCH_BY_LATEST_FIRST: true, // Affiche les résultats de recherche par date de publication (du plus récent au plus ancien)
        KEEP_SEARCH_WHEN_CLICKING_ON_SUBCATEGORY_ICON: true, // Garde les critères de recherche lorsqu'on clique sur une catégorie
    };

    const SELECTORS = {
        HOVER_TABLE_LIGNE: '.table-responsive',
        REGISTER_BUTTON: '.register',
        TORRENT_NAME_LINK: 'a[id="torrent_name"]',
        RESULTS_TABLE_ROW: '.results table tbody tr',
        INPUT_USERNAME: 'input[name="id"]',
        INPUT_PASSWORD: 'input[name="pass"]',
        INPUT_SUBMIT: 'button[type="submit"]',
        LOGOUT_LINK: 'a[href="https://www.ygg.re/user/logout"]',
        NFO_MODAL: 'nfoModal',
        SEARCH_FORM: 'form.search',
        LOGIN_FORM: '.login-form',
    };

    const CONSTANTS = {
        IMAGE_MODAL_STYLE: `min-width: ${CONFIG.PREVIEWS_IMAGES_SIZE}px; max-width: ${CONFIG.PREVIEWS_IMAGES_SIZE}px;`,
        COOKIES_STORAGE_KEY: 'yggtorrent_credentials',
        MOUSEENTER_DELAY: 100,
    };

    CONFIG.HOVER_TABLE && hoverTable();
    CONFIG.DOWNLOAD_BUTTONS_IN_RESULTS && addDownloadButtonToTorrents();
    CONFIG.HIDE_SIDEBAR && hideSidebar();
    CONFIG.LARGER_NFO && displayLargerNfo();
    CONFIG.SEARCH_BY_LATEST_FIRST && searchByLatestFirst();
    CONFIG.KEEP_SEARCH_WHEN_CLICKING_ON_SUBCATEGORY_ICON && keepSearchWhenClickingOnSubcategoryIcon();
    CONFIG.PREVIEWS_IMAGES_ON_HOVER && displayImageHandler();
    CONFIG.LOGIN_AUTOMATICALLY && await handleLogin();


    async function hoverTable() {
        const style = document.createElement('style');
        const lignes = document.querySelector(SELECTORS.HOVER_TABLE_LIGNE);

        if(lignes) {
            style.textContent = `
                .table td {
                    padding: .35rem !important;
                }

                .table td:hover {
                    background-color: rgba(246, 246, 246, 0.5) !important;
                }

                .table tr:hover {
                    background-color: rgba(246, 246, 246, 0.5) !important;
                    opacity: .8 !important;
                }
            `;

            document.head.appendChild(style);
        }
    }

    async function handleLogin() {
        const isNotLoggedIn = document.querySelector(SELECTORS.REGISTER_BUTTON);
        const savedCredentials = await GM.getValue(CONSTANTS.COOKIES_STORAGE_KEY);

        if (isNotLoggedIn && !savedCredentials) {
            await getCredentials();
        } else if (isNotLoggedIn && savedCredentials) {
            await autoLogin(savedCredentials);
        }
    }

    async function getCredentials() {
        try {
            const loginForm = document.querySelector(SELECTORS.LOGIN_FORM);

            if (loginForm) {
                loginForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const usernameInput = loginForm.querySelector(SELECTORS.INPUT_USERNAME);
                    const passwordInput = loginForm.querySelector(SELECTORS.INPUT_PASSWORD);
                    await saveCredentials(usernameInput.value, passwordInput.value);
                });
            }
        } catch (error) {
            console.error('Error getting credentials:', error);
        }
    }

    async function autoLogin(credentials) {
        try {
            const loginForm = document.querySelector(SELECTORS.LOGIN_FORM);

            if (loginForm) {
                const usernameInput = loginForm.querySelector(SELECTORS.INPUT_USERNAME);
                const passwordInput = loginForm.querySelector(SELECTORS.INPUT_PASSWORD);
                const submitButton = loginForm.querySelector(SELECTORS.INPUT_SUBMIT);

                if (usernameInput && passwordInput && submitButton) {
                    usernameInput.value = credentials.username;
                    passwordInput.value = credentials.password;

                    submitButton.click();
                }
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    }

    const logoutLink = document.querySelector(SELECTORS.LOGOUT_LINK);
    if (logoutLink) {
        logoutLink.addEventListener('click', deleteCredentials);
    }

    async function deleteCredentials() {
        try {
            await GM.deleteValue(CONSTANTS.COOKIES_STORAGE_KEY);
        } catch (error) {
            console.error('Error deleting credentials:', error);
        }
    }

    async function saveCredentials(username, password) {
        try {
            await GM.setValue(CONSTANTS.COOKIES_STORAGE_KEY, {
                username,
                password
            });
        } catch (error) {
            console.error('Error saving credentials:', error);
        }
    }

    function fetchImageSize(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({
                width: img.width,
                height: img.height,
                url
            });
            img.onerror = reject;
            img.src = url;
        });
    }

    function makeGetRequest(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                onload: function(response) {
                    resolve(response.responseText);
                },
                onerror: function(error) {
                    reject(error);
                },
            });
        });
    }

    async function getImages(url) {
        const imageRet = [];
        try {
            const response = await makeGetRequest(url);
            const parser = new DOMParser();
            const doc = parser.parseFromString(response, 'text/html');
            if (doc.title.includes('Just a moment...')) {
                imageRet.push({
                    width: 250,
                    height: 250,
                    url: 'https://i.ibb.co/DQb8WVj/cflr.jpg',
                });
                return imageRet;
            }
            const imgElements = doc.getElementsByTagName('img');
            for (const imgElement of imgElements) {
                if (imgElement.src.includes('summer_icon') || imgElement.src.includes('yggtorrent') || imgElement.src.includes('avatars') || imgElement.src.startsWith('data:image/png;base64')) {
                    continue;
                }
                const image = await fetchImageSize(imgElement.src);
                if (image.width > 250 && image.height > 250) {
                    imageRet.push(image);
                    break;
                }
            }
        } catch (error) {
            console.error('Error fetching images:', error);
        }
        return imageRet;
    }

    function displayImageHandler() {
        createImageModal();
        let timeout = null;
        let canDisplay = false;
        const torrents = document.querySelectorAll(SELECTORS.RESULTS_TABLE_ROW);

        if (!torrents) return;

        torrents.forEach((torrent) => {
            const torrentNameLink = torrent.querySelector(SELECTORS.TORRENT_NAME_LINK);
            if (!torrentNameLink) return;

            torrentNameLink.addEventListener('mouseenter', async (e) => {
                timeout = setTimeout(async () => {
                    if (e.target.id !== 'torrent_name') return;
                    canDisplay = true;
                    const images = await getImages(e.target.href);
                    if (canDisplay) {
                        displayImageModal(e, images[0]);
                    }
                }, CONSTANTS.MOUSEENTER_DELAY);
            });

            torrentNameLink.addEventListener('mousemove', (e) => {
                const modal = document.getElementById('imageModal');
                if (modal) {
                    const mouseY = e.clientY - 25;
                    const outOfScreen =
                        mouseY + document.getElementById('imageModalImage').offsetHeight - window.innerHeight;
                    modal.style.top =
                        outOfScreen > -25 ? mouseY - outOfScreen - 25 + 'px' : mouseY + 'px';
                    modal.style.left = e.clientX + 125 + 'px';
                }
            });

            torrentNameLink.addEventListener('mouseout', () => {
                document.getElementById('imageModal').style.display = 'none';
                canDisplay = false;
                clearTimeout(timeout);
            });
        });
    }

    function createImageModal() {
        const modal = document.createElement('div');
        modal.id = 'imageModal';
        modal.classList.add('modal');
        modal.style.display = 'none';

        const modalImage = document.createElement('img');
        modalImage.id = 'imageModalImage';
        modalImage.classList.add('modal-content');
        modalImage.style = CONSTANTS.IMAGE_MODAL_STYLE;

        modal.appendChild(modalImage);
        document.body.append(modal);
    }

    function displayImageModal(event, image) {
        const modal = document.getElementById('imageModal');
        if (modal) {
            const mouseY = event.clientY - 25;
            const modalImage = document.getElementById('imageModalImage');
            modalImage.src = image.url;
            modal.style.left = event.clientX + 125 + 'px';
            modal.style.display = 'block';
            const outOfScreen =
                mouseY + modalImage.offsetHeight - window.innerHeight;
            modal.style.top =
                outOfScreen > -25 ? mouseY - outOfScreen - 25 + 'px' : mouseY + 'px';
        }
    }

    function addDownloadButtonToTorrents() {
        const torrents = document.querySelectorAll(SELECTORS.RESULTS_TABLE_ROW);
        torrents.forEach((torrent) => {
            const torrentId = torrent.querySelector('a[target]')?.target;
            if (!torrentId) return;

            const downloadIcon = document.createElement('span');
            downloadIcon.classList.add('ico_download');
            downloadIcon.classList.add('custom_ygg');

            const downloadButton = document.createElement('a');
            downloadButton.href = `/engine/download_torrent?id=${torrentId}`;
            downloadButton.append(downloadIcon);
            downloadButton.style = 'color: rgb(98, 219, 168); vertical-align: middle; margin-right: 10px;';

            const nameLink = torrent.querySelector('td:nth-child(3) a');
            if (nameLink) {
                nameLink.parentNode.insertBefore(downloadButton, nameLink);
            }
        });
    }

    function hideSidebar() {
        const sidebar = document.getElementById('cat');
        if (sidebar && sidebar.classList.contains('active')) {
            sidebar.querySelector('.open').click();
        }
    }

	function displayLargerNfo() {
        const modal = document.getElementById(SELECTORS.NFO_MODAL);
        if (!modal) return;

		const modalDialog = modal.querySelector('.modal-dialog');

        modalDialog.classList.remove('modal-sm');
        modalDialog.classList.add('modal-lg');

        const nfoDiv = document.querySelector('#nfo');

        if (nfoDiv) {
        	GM_addStyle(`
                @import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap&display=swap');
        	`);

            GM_addStyle(`
                #nfo {
                    padding: 0 !important;
                }

                #nfo pre {
                    font-family: 'Source Code Pro', monospace !important;
                    font-optical-sizing: auto !important;
                    font-weight: 500 !important;
                    font-style: normal !important;
                    background-color: #fff !important;
                    color: #4d4d4d !important;
                    margin: 0 !important;
                    padding: 2rem !important;
                    text-align: center !important;
                }
            `);

            /*
            nfoDiv.style.background = '#ffffff !important';
            nfoDiv.style.color = '#4d4d4d !important';
            nfoDiv.style.margin = 'auto !important';
            */
        }
	}

    function searchByLatestFirst() {
        const searchForm = document.querySelector(SELECTORS.SEARCH_FORM);
        if (!searchForm) return;

        const orderInput = document.createElement('input');
        orderInput.name = 'order';
        orderInput.value = 'desc';
        orderInput.style = 'display: none';

        const sortInput = document.createElement('input');
        sortInput.name = 'sort';
        sortInput.value = 'publish_date';
        sortInput.style = 'display: none';

        searchForm.append(orderInput);
        searchForm.append(sortInput);
    }

    function keepSearchWhenClickingOnSubcategoryIcon() {
        document.querySelectorAll('[class^="tag_subcat_"]').forEach((node) => {
            const subcategoryId = node.className.split('tag_subcat_')[1];
            node.parentNode.href = `${document.URL}&sub_category=${subcategoryId}`;
        });
    }
})();