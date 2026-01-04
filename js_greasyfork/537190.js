// ==UserScript==
// @name                NZB-Loader by LordBex
// @description         Automatically downloads NZB files from nzbindex.nl when links with the "nzblnk:" scheme are clicked.
// @description:de_DE   Lädt NZB-Dateien automatisch von nzbindex.nl herunter, wenn auf Links mit dem Schema "nzblnk:" geklickt wird.
// @author              LordBex
// @version             v1.0.2
// @match               *://*/*
// @grant               GM_xmlhttpRequest
// @connect             nzbindex.com
// @connect             www.nzbking.com
// @connect             localhost
// @icon                https://i.imgur.com/O1ao7fL.png
// @license             MIT
// @namespace           LordBex/UserScripts/NZB-Loader
// @downloadURL https://update.greasyfork.org/scripts/537190/NZB-Loader%20by%20LordBex.user.js
// @updateURL https://update.greasyfork.org/scripts/537190/NZB-Loader%20by%20LordBex.meta.js
// ==/UserScript==

// ------------------------------------------------------------
//- Default Config:

const AUSGABE = 'download'
// mögliche Werte:
// - download
// - menu
// - URLtoSABnzb
// - NZBtoSABnzb (nicht kompatible mit Safari)
// - custom (um deinen eigenen Handler `customHandler()` zu verwenden)

const DISABLE_SUCCESS_ALERT = false; // default: false

// ------------------------------------------------------------
//- SabNzbd Config:

const SAB_API_KEY = '....';
const SAB_URL = 'http://localhost:8080/api'; // z.B. 'http://localhost:8080/sabnzbd/api'

// Für Output im Menu notwendig:
const SAB_CATEGORIES = [] // leer lassen, um sie direkt von SABnzbd zu holen / hierzu den api-key und nicht den nzb-key verwenden!
// Für URLtoSABnzb und NZBtoSABnzb
const SAB_DEFAULT_CATEGORY = '*' // default: *
// Sab Buttons als Untermenü
const SAB_SUB_MENU = false // default: false


// ------------------------------------------------------------
// menu buttons

async function openMenu(parameters) {
    const sabButtons = await getCategoriesButtons(parameters)

    const buttons = [
        {
            name: 'Download',
            f: () => {
                downloadAndSave(parameters)
            },
            bgColor: '#0D4715',
            icon: 'https://raw.githubusercontent.com/sabnzbd/sabnzbd/refs/heads/develop/icons/nzb.ico'
        }
    ]

    if (SAB_SUB_MENU) {
        buttons.push({
            name: 'Zu Sabnzbd',
            f: () => {
                modal.showModal([
                    {
                        name: 'Zurück',
                        bgColor: '#4F959D',
                        f: () => {
                            modal.showModal(buttons)
                        }
                    },
                    ...sabButtons
                ])
            },
            icon: 'https://raw.githubusercontent.com/sabnzbd/sabnzbd/refs/heads/develop/icons/sabnzbd.ico'
        })
    } else {
        buttons.push(...sabButtons)
    }

    infoModal.closeModal()
    modal.showModal(buttons)
}

function customHandler({downloadLink, fileName, password}) {
    // wird ausgeführt, wenn AUSGABE auf 'custom' gesetzt ist
    alert("Custom Handler") // Hier kann eigener Code eingefügt werden
}

// ------------------------------------------------------------
// sab-code

function successAlert(message) {
    if (!DISABLE_SUCCESS_ALERT) {
        alert(message)
    }
}

function addNZBtoSABnzbd({downloadLink, fileName, password, category = SAB_DEFAULT_CATEGORY}) {
    const mode = 'addurl';
    const name = encodeURIComponent(downloadLink);
    const eu_name = encodeURIComponent(fileName);
    const eu_pass = encodeURIComponent(password);
    const requestURL = `${SAB_URL}?output=json&mode=${mode}&name=${name}&nzbname=${eu_name}&cat=${category}&password=${eu_pass}&apikey=${SAB_API_KEY}`;
    console.log('Link to Sab:', requestURL);
    infoModal.print("Sende Link zu Sab ...")

    GM_xmlhttpRequest({
        method: "GET",
        url: requestURL,
        headers: {
            "User-Agent": "Mozilla/5.0",
            "Accept": "application/json"
        },
        onload: function (response) {
            console.log(response.responseText);
            let result = JSON.parse(response.responseText);

            if (result.status === true) {
                infoModal.print("Erfolg! NZB hinzugefügt. ID: " + result.nzo_ids.join(', '))
                infoModal.closeIn(3000)
            } else {
                infoModal.showModal()
                infoModal.error('Fehler beim Hinzufügen der NZB-Datei zu SABnzbd.\n' + result.error);
            }
        },
        onerror: function (response) {
            console.error('Anfrage fehlgeschlagen', response);
            alert("Anfrage an SABnzb schlug fail ! (mehr im Log)")
        }
    });
}

function uploadNZBtoSABnzbd({responseText, fileName, password, category = SAB_DEFAULT_CATEGORY}) {

    let formData = new FormData();
    let blob = new Blob([responseText], {type: "text/xml"});
    formData.append('name', blob, fileName);
    formData.append('mode', 'addfile');
    formData.append('nzbname', fileName);
    formData.append('password', password);
    formData.append('output', 'json');
    formData.append('cat', category);
    formData.append('apikey', SAB_API_KEY);
    console.log('Upload Nzb to Sab:', formData);
    infoModal.print("Lade Nzb zu SABnzbd hoch ...")

    GM_xmlhttpRequest({
        method: "POST",
        url: SAB_URL,
        data: formData,
        onload: function (response) {
            console.log('Upload response', response.status, response.statusText);
            console.log('Response body', response.responseText);
            let result = JSON.parse(response.responseText);
            if (result.status === true) {
                successAlert('Success! NZB added. ID: ' + result.nzo_ids.join(', '));
            } else {
                alert('Error adding NZB file to SABnzbd.\n' + (result.error || 'Unknown error'));
            }
        },
        onerror: function (response) {
            console.error('Error during file upload', response.status, response.statusText);
            alert("Could not upload NZB! (more in log)");
        }
    });
}

function getCatSabButton(parameters, category) {
    return {
        name: category.charAt(0).toUpperCase() + category.slice(1),
        value: category,
        f: () => {
            parameters.category = category
            addNZBtoSABnzbd(parameters)
        }
    }
}

async function getCategoriesButtons(parameters) {

    if (SAB_CATEGORIES.length > 0) {
        return SAB_CATEGORIES.map(item => {
            return getCatSabButton(parameters, item);
        })
    }

    const mode = 'get_cats'
    const requestURL = new URL(SAB_URL);
    requestURL.searchParams.append('output', 'json');
    requestURL.searchParams.append('mode', mode);
    requestURL.searchParams.append('apikey', SAB_API_KEY);

    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: requestURL.toString(),
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json"
            },
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                const categories = data.categories;
                resolve(categories.map(item => {
                    return getCatSabButton(parameters, item);
                }));
            },
            onerror: function(error) {
                console.error('Error during file upload', error);
                alert("Could not get Categories from SAB! (more in log)");
                reject(error);
            }
        });
    });
}


// ------------------------------------------------------------
// download file-code

function saveFile({responseText, fileName}) {
    let blob = new Blob([responseText], {type: "application/x-nzb"});
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName // Dateiname ändern
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function downloadFile({downloadLink, fileName, password, callback}) {
    if (!fileName.endsWith('.nzb')) {
        fileName = fileName + '.nzb'
    }
    console.log("Download Nzb von " + downloadLink)
    GM_xmlhttpRequest({
        method: "GET",
        url: downloadLink,
        onload: function (nzbResponse) {
            callback({
                responseText: nzbResponse.responseText,
                fileName,
                password
            })
        },
        onerror: function () {
            console.error("Failed Download for  " + downloadLink)
            alert("Nzb könnte nicht geladen werden !")
        }
    });
}

function downloadAndSave({downloadLink, fileName, password}) {
    fileName = `${fileName}{{${password}}}.nzb`
    downloadFile({
        downloadLink, fileName, password, callback: (args) => {
            saveFile(args)
            infoModal.print("Nzb gespeichert.")

            setTimeout(() => {
                infoModal.closeModal()
            }, 3000)
        }
    })
}

function downloadAndSab({downloadLink, fileName, password, category = SAB_DEFAULT_CATEGORY}) {
    downloadFile({
        downloadLink,
        fileName,
        password,
        callback: (parameter) => {
            parameter.category = category
            uploadNZBtoSABnzbd(parameter)
        }
    })
}

// ------------------------------------------------------------
// handle menu

customElements.define('menu-select-modal', class MenuSelectModal extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Create a shadow root
        const shadow = this.attachShadow({mode: "open"});
        shadow.innerHTML = `
             <style>
                .btn {
                    --_bg-color: var(--bg-color, #06f);
                    align-items: center;
                    background-color: var(--_bg-color);
                    border: 2px solid var(--_bg-color);
                    box-sizing: border-box;
                    color: #fff;
                    cursor: pointer;
                    display: inline-flex;
                    fill: #000;
                    font-size: 24px;
                    font-weight: 400;
                    height: 48px;
                    justify-content: center;
                    line-height: 24px;
                    width: 100%;
                    outline: 0;
                    padding: 0 17px;
                    text-align: center;
                    text-decoration: none;
                    transition: all .3s;
                    user-select: none;
                    -webkit-user-select: none;
                    touch-action: manipulation;
                    border-radius: 5px;
                    gap: 5px;
                }

                .btn:hover {
                    filter: brightness(70%);
                }

                dialog {
                    border: none !important;
                    border-radius: calc(5px * 3.74);
                    box-shadow: 0 0 #0000, 0 0 #0000, 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    background-color: rgb(33, 37, 41);
                    padding: 1.6rem;
                    max-height: 70%;
                    max-width: max(400px, 100vw);
                }

                .dialog-header {
                    color: white;
                    font-family: Inter, sans-serif;
                    font-size: 20px;
                    font-weight: 600;
                    display: flex;
                    justify-content: space-between;
                    padding-bottom: 10px;
                }

                .buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    min-width: 400px;
                }

                .close {
                    all: initial;
                    background: unset;
                    padding: 5px;
                    margin: 0;
                    border: unset;
                }

                .close:not(:hover) {
                    opacity: 0.3; /* Leichte Transparenz bei Hover */
                }

                @media screen and (max-width: 450px) {
                    .buttons {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                        min-width: 300px;
                    }
                }

                @media screen and (max-width: 350px) {
                    .buttons {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                        min-width: 150px;
                    }
                }


            </style>

            <div data-bs-theme="dark">
                 <dialog id="dialog-1">
                    <form method="dialog">
                        <div class="dialog-header">
                            <span>Wähle ...</span>
                            <button class="close">
                                <svg xmlns='http://www.w3.org/2000/svg' width="16" height="16" viewBox='0 0 16 16' fill='#CCC'>
                                    <path d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/>
                                </svg>
                            </button>
                        </div>

                        <div class="buttons buttons-here">
                            <p>...</p>
                        </div>
                    </form>
                </dialog>
            </div>
        `

        this.dialog = shadow.querySelector('dialog')
    }

    showModal(items) {
        this.dialog.showModal()

        const modalContent = this.shadowRoot.querySelector('.buttons-here');
        modalContent.innerHTML = '';

        items.forEach(item => {
            const button = document.createElement('button');
            button.className = 'btn';

            if (item.innerHTML) {
                button.innerHTML = item.innerHTML;
            }

            if (item.icon) {
                const img = document.createElement('img');
                img.src = item.icon;
                img.style.marginRight = '8px';
                img.style.width = '24px';
                img.style.height = '24px';
                button.appendChild(img);
            }

            button.appendChild(document.createTextNode(item.name));

            if (item.bgColor) {
                button.style.setProperty('--bg-color', item.bgColor);
            }

            button.onclick = () => {
                item.f(); // call function
            };
            modalContent.appendChild(button);
        });
    }

    closeModal() {
        this.dialog.close()
    }
});

const modal = document.createElement('menu-select-modal');
document.body.appendChild(modal);

// ------------------------------------------------------------
// info dialog handler

customElements.define('nzblnk-info-modal', class NzbInfoModal extends HTMLElement {
    constructor() {
        super();
        this.createModal()
        this.closeTimer = null
    }

    createModal() {
        // Create a shadow root
        const shadow = this.attachShadow({mode: "open"});
        // language=HTML
        shadow.innerHTML = `
            <style>

                .btn {
                    align-items: center;
                    background-color: #06f;
                    border: 2px solid #06f;
                    box-sizing: border-box;
                    color: #fff;
                    cursor: pointer;
                    display: inline-flex;
                    fill: #000;
                    font-size: 24px;
                    font-weight: 400;
                    height: 48px;
                    justify-content: center;
                    line-height: 24px;
                    width: 100%;
                    outline: 0;
                    padding: 0 17px;
                    text-align: center;
                    text-decoration: none;
                    transition: all .3s;
                    user-select: none;
                    -webkit-user-select: none;
                    touch-action: manipulation;
                    border-radius: 5px;
                }

                .btn:hover {
                    background-color: #3385ff;
                    border-color: #3385ff;
                    fill: #06f;
                }

                dialog {
                    border: none !important;
                    border-radius: calc(5px * 3.74);
                    box-shadow: 0 0 #0000, 0 0 #0000, 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    background-color: rgb(33, 37, 41);
                    max-width: max(400px, 100vw);
                    padding: 1.6rem;
                    width: min(400px, 90vw);
                }

                .dialog-header {
                    color: white;
                    font-family: Inter, sans-serif;
                    font-size: 20px;
                    font-weight: 600;
                    display: flex;
                    justify-content: space-between;
                    padding-bottom: 10px;
                }

                .close {
                    all: initial;
                    background: unset;
                    padding: 5px;
                    margin: 0;
                    border: unset;
                }

                .close:not(:hover) {
                    opacity: 0.3; /* Leichte Transparenz bei Hover */
                }

                .dialog-content {
                    color: whitesmoke;
                }

            </style>

            <div data-bs-theme="dark">
                <dialog id="dialog-2">
                    <form method="dialog">
                        <div class="dialog-header">
                            <span>Info</span>
                            <button class="close">
                                <svg xmlns='http://www.w3.org/2000/svg' width="16" height="16" viewBox='0 0 16 16'
                                     fill='#CCC'>
                                    <path d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/>
                                </svg>
                            </button>
                        </div>

                        <div class="dialog-content">

                        </div>
                    </form>
                </dialog>
            </div>
        `

        this.dialog = shadow.querySelector('dialog')
        this.modalContent = shadow.querySelector('.dialog-content')
    }

    showModal(callback) {
        this.dialog.showModal()
    }

    resetModal() {
        this.modalContent.innerHTML = '';
    }

    print(message) {
        let p = document.createElement('p');
        console.log("Info:", message)
        p.innerHTML = message
        this.modalContent.appendChild(p)
    }

    error(message) {
        let p = document.createElement('p');
        p.style.color = 'red'
        console.error("Error:", message)
        p.innerHTML = message
        this.modalContent.appendChild(p)
    }

    closeModal() {
        this.dialog.close()
        clearTimeout(this.closeTimer)
    }

    closeIn(time) {
        this.closeTimer = setTimeout(() => {
            this.closeModal()
        }, time)
    }
});

const infoModal = document.createElement('nzblnk-info-modal');
document.body.appendChild(infoModal);

// ------------------------------------------------------------
// nzb handler

function handleNzb(downloadLink, fileName, password) {

    infoModal.print(`Nzb wurde gefunden: <a href='${downloadLink}'>Link</a> (Fallback)`)

    const actions = {
        download: () => {
            downloadAndSave({downloadLink, fileName, password})
        },
        menu: () => {
            openMenu({downloadLink, fileName, password}).then(
                () => {
                    console.log('menu opened')
                }
            )
        },
        URLtoSABnzb: () => {
            addNZBtoSABnzbd({downloadLink, fileName, password})
        },
        NZBtoSABnzb: () => {
            downloadAndSab({downloadLink, fileName, password})
        },
        custom: () => {
            customHandler({downloadLink, fileName, password})
        }
    }

    let selected_action = actions[AUSGABE]
    if (!selected_action) {
        console.error("Ungültige AUSGABE Konfiguration")
        alert("Ungültige AUSGABE Konfiguration")
        return;
    }
    selected_action()
}

function parseNzblnkUrl(url) {
    // Entferne 'nzblnk:?' vom Anfang der URL
    let paramsString = url.slice(url.indexOf("?") + 1);

    // Analysiere die Parameter
    const params = new URLSearchParams(paramsString);

    // Füge die Parameter zu einem Objekt hinzu
    let result = {};
    for (let param of params) {
        result[param[0]] = param[1];
    }

    return result;
}

// ------------------------------------------------------------
// load from ...

function loadFromNzbKing(nzb_info, when_failed) {
    console.log("Suche auf nzbking.com")
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://www.nzbking.com/?q=" + nzb_info.h,
        onload: function (response) {
            console.log("King:", response)
            let parser = new DOMParser();
            let doc = parser.parseFromString(response.responseText, 'text/html');

            const nzbLink = doc.querySelector('a[href^="/nzb:"]');
            if (nzbLink) {
                console.log("Auf nzbking gefunden");
                handleNzb("https://www.nzbking.com" + nzbLink.getAttribute('href'), nzb_info.t, nzb_info.p)
                return;
            }

            return when_failed()
        },
        onerror: function () {
            console.error("Request zu NzbKing fehlgeschlagen")
            when_failed()
        }
    });
}

function loadFromNzbIndex(nzb_info, when_failed) {
    console.log("Suche auf nzbindex.com")
    let url = `https://nzbindex.com/api/search?q=${nzb_info.h}&max=5&sort=agedesc`

    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function (response) {
            console.log("betaindex:", response)
            let data = JSON.parse(response.responseText);

            if (!data?.data) {
                console.error("Irgengendwas ist komisch bei nzbindex.com")
                console.log(data)
                return when_failed()
            }

            data = data.data

            if (data.page.totalElements === 0) {
                console.log("Nichts auf nzbindex.com gefunden")
                return when_failed()
            }

            if (data.content === undefined) {
                console.log("Keine Ergebnisse auf nzbindex.com gefunden - result is undefined")
                return when_failed()
            }

            if (data.content.length === 0) {
                console.log("Keine Ergebnisse auf nzbindex.com gefunden - result is empty")
                return when_failed()
            }

            if (!data.content[0]?.id) {
                console.log("Id ist nicht gesetzt bei nzbindex.com")
                return when_failed()
            }

            let ids = data.content.map(item => item.id).join('%2C');
            console.log("Auf nzbindex.com gefunden")
            handleNzb("https://nzbindex.com/download?ids=" + ids, nzb_info.t, nzb_info.p)
        },
        onerror: function (response) {
            console.log("Request zu nzbindex.com fehlgeschlagen")
            console.error(response)
            return when_failed()
        }
    });
}

function loadNzb(nzblnk) {
    let nzb_info = parseNzblnkUrl(nzblnk)

    infoModal.resetModal()
    infoModal.showModal()

    const loadFunctions = [
        {
            info: "NzbIndex",
            func: loadFromNzbIndex,
        },
        {
            info: "NzbKing",
            func: loadFromNzbKing,
        }
    ]

    let load = function () {
        infoModal.print(`Keine Nzb gefunden :( `)
        setTimeout(() => {
            infoModal.closeModal()
        }, 6000)
    };

    Array.from(loadFunctions).reverse().forEach(function (f) {
        const old_load = load
        load = function () {
            infoModal.print(`Versuche ${f.info} ....`)

            return f.func(nzb_info, old_load)
        }
    })

    load()
}

// ------------------------------------------------------------
// svg-icons

const downloadIcon = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" style="width: 20px; height: 20px;">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
</svg>
`

const regexIcon = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" style="width: 20px; height: 20px;">
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z" />
</svg>
`

// ------------------------------------------------------------
// trigger

// Event-Delegation für alle nzblnk-Links
document.body.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="nzblnk"]');
    if (link) {
        event.preventDefault();
        loadNzb(link.href);
    }
});

// Findet bereits vorhandene Links
function processExistingLinks() {
    document.querySelectorAll('a[href^="nzblnk"]').forEach((link) => {
        // Optional: Link-Styling oder andere Anpassungen
        link.setAttribute('title', 'NZB herunterladen');
    });
}

// Überwacht DOM-Änderungen für dynamisch hinzugefügte Links
function observeSiteChanges() {
    const observer = new MutationObserver((mutationsList) => {
        const hasNewContent = mutationsList.some(mutation =>
            mutation.type === 'childList' && mutation.addedNodes.length > 0);

        if (hasNewContent) {
            // Nur bei tatsächlichen Änderungen Links verarbeiten
            processExistingLinks();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

processExistingLinks();
observeSiteChanges();
