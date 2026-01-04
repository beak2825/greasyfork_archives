// ==UserScript==
// @name         JvAlt
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Script facilitant la gestion des double-comptes JVC.
// @author       PneuTueur
// @match        *://*.jeuxvideo.com/forums*
// @icon         https://jvflux.fr/images/3/3b/icon2.png
// @license      MIT
// @grant        GM_info
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/495483/JvAlt.user.js
// @updateURL https://update.greasyfork.org/scripts/495483/JvAlt.meta.js
// ==/UserScript==

const UPDATE_DELAY = 50;
const CHECKS_PER_DAY = 10;
const SCRIPT_CHECKS_PER_DAY = 2;
const MAX_ACCOUNTS = 256;
const STATUS_TO_INFO = {"available": "est disponible", "not-found": "n'existe pas", "banned": "est banni", "checking": "est en cours de traitement"};
const BEFORE_TRANSITION = 400;
const SCRIPT_URL = "https://greasyfork.org/fr/scripts/495483-jvalt";
const PROXY_URL = "https://corsproxy.io/?";

async function checkScriptUpdate() {
    const ms = Date.now();
    const toCheck = (ms - GM_getValue('lastScriptCheck', 0)) / (1000 * 60 * 60 * 24) >= 1/SCRIPT_CHECKS_PER_DAY;
    if (!toCheck) return false;
    const res = await fetch(PROXY_URL + encodeURIComponent(SCRIPT_URL) + "?dummy=" + ms);

    const pageContent = await res.text();
    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(pageContent, "text/html");
    const latestVersion = htmlDocument.querySelector('dd.script-show-version span').textContent;
    const currentVersion = GM_info.script.version;

    if (latestVersion != currentVersion && GM_getValue('lastIgnoredJvAltVersion', null) != latestVersion) {
        if (confirm("Nouvelle version de JV Alt disponible. Souhaitez-vous l'installer ?")) {
            window.open(SCRIPT_URL, '_blank');
        } else {
            GM_setValue('lastIgnoredJvAltVersion', latestVersion);
        }
    }

    GM_setValue('lastScriptCheck', ms);
}

function toCheck(account) {
    if (account.lastCheck === 0 || account.status === 'failed' || account.status === 'checking') return true;
    if (account.lastCheck) {
        const today = new Date();
        const lastCheckDate = new Date(account.lastCheck);
        const diff = today.getTime() - lastCheckDate.getTime();
        const days = diff / (1000 * 60 * 60 * 24);
        return days >= 1/CHECKS_PER_DAY
    }
    return true;
};

async function checkAccount(account) {
    let getAccountPage = await fetch(`https://www.jeuxvideo.com/profil/${account.name.toLowerCase()}?mode=infos`);
    let i = 0;
    while (getAccountPage.status === 503) {
        await new Promise(resolve => setTimeout(resolve, UPDATE_DELAY*(i+1)));
        getAccountPage = await fetch(getAccountPage);
        i++;

        if (i >= 2) {
            account.status = "failed";
            account.level = 0;
            return account;
        }
    }

    account.lastCheck = Date.now();

    if (getAccountPage.status===404) {
        account.status = "not-found";
        account.level = -1;
        return account;
    }

    const pageContent = await getAccountPage.text();
    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(pageContent, "text/html");
    const bannedBanner = htmlDocument.querySelector(".alert.alert-danger");
    const errorImage = htmlDocument.querySelector("img.img-erreur");

    if (bannedBanner) {
        account.status = "banned";
        account.level = 0;
        account.name = htmlDocument.querySelector('title').textContent.trim().replace('Informations personnelles sur le profil ', '').replace(' - jeuxvideo.com', '');
    } else {
        account.status = "available";
        account.level = parseInt(htmlDocument.querySelector('span.JvCare.ladder-link').textContent.trim().replace('Niveau ', ''));
        account.name = htmlDocument.querySelector('title').textContent.trim().replace('Informations personnelles sur le profil ', '').replace(' - jeuxvideo.com', '');
    }

    return account;
};

(function() {
    'use strict';

    const container = document.querySelector("#forum-right-col");
    if (!container) return;

    var totalAccounts;
    const savedAccounts = GM_getValue("totalAccounts", localStorage.getItem("totalAccounts"));
    if (savedAccounts && savedAccounts !== '' && savedAccounts.length !== 0) {
        totalAccounts = JSON.parse(savedAccounts);
    } else {
        totalAccounts = [];
    }

    const buildContainer = () => {
        const templateCSS = `
          <style>
            #jvalt-lists-container {
                padding-left: 10px;
                position: relative;
                max-height: 20rem;
                overflow: auto;
            }

            .jvalt-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: relative;
            }

            .jvalt-accounts-list li {
                width: 105%;
                align-items: center;
                display: flex;
            }

            ul.jvalt-accounts-list {
                list-style-type: none;
                vertical-align: top;
                display: inline-block;
                margin-bottom: 0;
            }

            ul.jvalt-accounts-list#list1 {
                padding-left: .2rem;
            }

            ul.jvalt-accounts-list#list2 {
                position: absolute;
                right: 0;
                margin-right: 2.5em;
                padding-left: 0;
            }

            li.jvalt-account-item a {
                font-weight: bold;
            }

            li.jvalt-account-item.checking a {
                opacity: 0.3;
            }

            li.jvalt-account-item.banned a, span.banned {
                color: red!important;
            }

            li.jvalt-account-item.available a, span.available {
                color: lawngreen!important;
            }

            li.jvalt-account-item.not-found a, span.not-found {
                color: yellow!important;
            }

            li.jvalt-account-item.not-found, p.jvalt-form-info {
                opacity: 1;
                transition: opacity .5s ease-out;
            }

            li.jvalt-account-item.to-remove, p.jvalt-form-info.to-remove {
                opacity: 0 !important;
            }

            li.jvalt-account-item.failed a {
                color: orange!important;
            }

            li.jvalt-account-item .jvalt-list-refresh {
                margin-right: 6px;
                margin-left: auto;
            }

            li.jvalt-account-item .jvalt-list-clickable-span {
                font-weight: bold;
            }

            li.jvalt-account-item .jvalt-list-clickable-span:hover {
                cursor: pointer;
                color: var(--jv-text-hover-secondary);
            }

            li.jvalt-account-item sup.jvalt-account-level {
                margin-right: 7px;
            }

            .bloc-forums-preferes .jvalt-add-account {
                padding: 7px 12px 7px 12px;
                border-color: var(--jv-input-border-color);
                background-color: var(--jv-input-bg-color);
                border-radius: 0.25rem;
            }

            .form-group {
                  position: relative;
            }

            .form-group-span {
                  position: absolute;
                  left: 10px;
                  top: 50%;
                  transform: translateY(-50%);
            }

            .jvalt-header {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: .0625rem solid var(--jv-border-color);
                margin-bottom: .5rem;
            }

            .jvalt-header-options {
                padding-bottom: .4rem;
                display: flex;
            }

            .jvalt-header-file {
                display: flex;
            }

            .jvalt-header-clickable {
                color: var(--jv-blue-gray-color);
                text-transform: none;
                font-size: .8125rem;
                margin-left: 5px;
                cursor: pointer;
            }

            .jvalt-import-input {
                display: none;
            }

            .jvalt-header-remove {
                margin-left: .9rem;
                margin-top: .1rem;
                opacity: .7;
                cursor: pointer;
            }

            .jvalt-header-remove:hover {
                opacity: 1;
            }

            .jvalt-form {
                margin-top: 9px;
            }

            .jvalt-form-info {
                margin-bottom: .2rem;
                margin-top: .2rem;
                text-align: center;
            }

            .jvalt-iterate-form-group {
                margin-top: 10px;
            }

            .jvalt-iterate-inputs-group {
                display: flex;
                gap: 10px;
            }

            .jvalt-radical-input {
                width: 350%;
            }

            .jvalt-submit-iterate {
                margin-top: 10px;
            }
          </style>
        `
        const templateHTML = `
            <div class="card card-jv-forum card-forum-margin jvalt-root">
                <div class="card-header">JV Alt</div>
                <div class="card-body">
                    <div class="bloc-forums-preferes">
                        <div class="jvalt-header">
                            <h4 style="border-bottom: none; margin-bottom: 0; padding-bottom: .4rem;" class="jvalt-account-subtitle titre-info-fofo">Comptes</h4>
                            <div class="jvalt-header-options">
                                <div class="jvalt-header-file">
                                    <a class="jvalt-header-clickable jvalt-header-import">Importer<input class="jvalt-import-input" type="file" accept=".json"></input></a>
                                    <a href="#" class="jvalt-header-clickable jvalt-header-export">Exporter</a>
                                </div>
                                <span class="picto-msg-croix jvalt-header-remove" title="Supprimer toute la liste"><span>Supprimer</span></span>
                            </div>
                        </div>
                        <div id="jvalt-lists-container">
                            <ul class="jvalt-accounts-list" id="list1"></ul>
                            <ul class="jvalt-accounts-list" id="list2"></ul>
                        </div>
                        <div class="jvalt-form">
                            <h4 class="titre-info-fofo">Ajouter un compte</h4>
                            <input maxlength="15" class="txt-search form-control jvalt-add-account" type="text" placeholder="Ajouter un compte (Entrée pour valider)" autocomplete="off" value="">
                        </div>
                        <div class="jvalt-form">
                            <h4 class="titre-info-fofo">Ajouter une série</h4>
                            <div class="jvalt-iterate-form-group">
                                <form class="jvalt-iterate-form" onsubmit="return false;">
                                    <div class="jvalt-iterate-inputs-group">
                                       <input maxlength="13" required class="txt-search form-control jvalt-add-account jvalt-radical-input" placeholder="Entrez un radical" type="text"</input><input required min="1" class="txt-search form-control jvalt-iterate-input" id="jvalt-iterate1" type="number" placeholder="01"></input><input required class="txt-search form-control jvalt-iterate-input" id="jvalt-iterate2" type="number" placeholder="10"></input>
                                    </div>
                                    <button type="submit" class="jvalt-submit-iterate btn btn-actu-new-list-forum">Valider</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', templateCSS);
        container.insertAdjacentHTML('beforeend', templateHTML);
    };

    buildContainer();

    const bannedAccountContainer = document.querySelector("div.jvalt-root");
    const listsContainer = document.querySelector('#jvalt-lists-container');
    const htmlList1 = bannedAccountContainer.querySelector("ul.jvalt-accounts-list#list1");
    const htmlList2 = bannedAccountContainer.querySelector("ul.jvalt-accounts-list#list2");
    const exportButton = document.querySelector('a.jvalt-header-export');
    const importInput = document.querySelector('input.jvalt-import-input');
    const addAccountInput = document.querySelector("input.jvalt-add-account");
    const headerRemove = document.querySelector('span.jvalt-header-remove');
    const importLink = document.querySelector('a.jvalt-header-import');
    const exportLink = document.querySelector('a.jvalt-header-export');
    const radicalInput = document.querySelector('input.jvalt-radical-input');
    const iterate1 = document.querySelector('input#jvalt-iterate1');
    const iterate2 = document.querySelector('input#jvalt-iterate2');
    const submitIterateBtn = document.querySelector('button.jvalt-submit-iterate');

    const updateAccount = (account) => {
        checkAccount(account).then(async (accountRes) => {
            const accountIndex = totalAccounts.findIndex(a => a.name === account.name);
            totalAccounts[accountIndex] = accountRes;
            updateWholeContainer(totalAccounts);
            if (accountRes.status === 'not-found') {
                setTimeout(() => removeAccount(accountRes), BEFORE_TRANSITION);
            }
        });
    }

    const updateAccounts = async (accounts, check = true) => {
          const accountsToUpdate = check ? accounts.filter(a => toCheck(a)) : accounts;
          for (const a of accountsToUpdate) {
              await updateAccount(a);
              await new Promise(resolve => setTimeout(resolve, UPDATE_DELAY));
          }
    }

    const importFile = () => {
        if (importInput.value=='') { return -1; }
        var file = importInput.files[0];
        var invalidFormatString = 'ERREUR : Format invalide (voir exemple de format valide dans un fichier exporté).';
        var currentAccounts = totalAccounts.map(a => a.name.toLowerCase());

        var reader = new FileReader();
        reader.onload = (event) => {
            var jsonString = event.target.result;
            try {
                var accountsList = JSON.parse(jsonString);
                var addableAccounts = [];
                for (let account of accountsList) {
                    if (!("name" in account) || !("lastCheck" in account) || !("status" in account) || !("level" in account)) {
                        alert(invalidFormatString);
                        return -2;
                    }
                    if (!currentAccounts.includes(account.name.toLowerCase())) {
                        addableAccounts.push(account);
                    }
                }
                if (addableAccounts.length===0) return -2;
                addableAccounts = addableAccounts.slice(0, MAX_ACCOUNTS - totalAccounts.length);
                totalAccounts = totalAccounts.concat(addableAccounts);
                updateWholeContainer(totalAccounts);
                updateAccounts(addableAccounts, true);
            } catch(SyntaxError) {
                alert(invalidFormatString);
                return -2;
            }
        };

        reader.readAsText(file);
        importInput.value = '';
    }

    const createExport = (data, filename = 'jvalt_list') => {
        const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
        exportButton.href = URL.createObjectURL(blob);
        exportButton.download = filename + ".json";
    }

   const removeAccount = async (account, tempAccount = false) => {
        if (tempAccount) {
            totalAccounts = totalAccounts.filter(a => a.name !== account.name);
            updateWholeContainer(totalAccounts, true, false);
            const accountEl = document.querySelector(`li.jvalt-account-item[name="${account.name}"`);
            accountEl.addEventListener('transitionend', () => {
                accountEl.remove();
            });
            accountEl.classList.add('to-remove');
        } else {
            totalAccounts = totalAccounts.filter(a => a.name !== account.name);
            updateWholeContainer(totalAccounts);
        }
    }

    const removeAll = () => {
        htmlList1.innerHTML = '';
        htmlList2.innerHTML = '';
        totalAccounts = [];
        GM_setValue('totalAccounts', []);
    }

    const addTempAccounts = (accounts, updateList = true) => {
        if (updateList) {
            totalAccounts = totalAccounts.concat(accounts);
        }
        accounts.forEach(a => {
            const list = (htmlList1.querySelectorAll('li').length === htmlList2.querySelectorAll('li').length) ? htmlList1 : htmlList2;
            const htmlStr = `<li name="${a.name}" class="jvalt-account-item ${a.status}"><a style="pointer-events: none;">${a.name}</a>`;
            list.insertAdjacentHTML('beforeend', htmlStr);
        });
    }

    const addFormInfo = (account) => {
        const previousForm = document.querySelector('.jvalt-form-info');
        if (previousForm) {
            previousForm.remove();
        }
        const formInfo = document.createElement('p');
        formInfo.setAttribute('class','jvalt-form-info');
        formInfo.innerHTML = `${account.name} ${account.status!=='not-found' ? `<span class="${account.status}">${STATUS_TO_INFO[account.status]}</span>` : `<span class="${account.status}">${STATUS_TO_INFO[account.status]}</span>`}`;
        listsContainer.appendChild(formInfo);

        return formInfo
    }

    const removeFormInfo = (formInfo) => {
        formInfo.classList.add('to-remove');
        formInfo.addEventListener('transitionend', (event) => {
            formInfo.remove();
        });
    }

    const updateWholeContainer = (accounts, saveUpdate = true, rewriteHTML = true) => {
        if (rewriteHTML) {
            accounts.sort((a, b) => b.level - a.level);
            htmlList1.innerHTML = '';
            htmlList2.innerHTML = '';
            accounts.forEach((a, index) => {
                const list = (index%2==0) ? htmlList1 : htmlList2;
                const htmlStr = `<li name="${a.name}" class="jvalt-account-item ${a.status}"><a title="Ce pseudo ${STATUS_TO_INFO[a.status]}"${a.status==='not-found' ? 'style="pointer-events: none;"' : ""} target="_blank" href="https://www.jeuxvideo.com/profil/${a.name.toLowerCase()}?mode=infos">${a.name}</a><span><sup class="jvalt-account-level">${a.level > 0 ? a.level : ""}</sup></span><span name="${a.name}" class="jvalt-list-clickable-span jvalt-list-refresh" title="Rafraîchir">&#128472;</span><span name="${a.name}" class="jvalt-list-clickable-span jvalt-list-remove" title="Supprimer">×</span></li>`;
                list.insertAdjacentHTML('beforeend', htmlStr);
            });
        }
        if (saveUpdate) {
            GM_setValue('totalAccounts', JSON.stringify(accounts));
            createExport(totalAccounts);
        }
    };

    const submitIterate = (event) => {
        if (radicalInput.checkValidity() && iterate1.checkValidity() && iterate2.checkValidity()) {
            event.preventDefault();
            const accountsToAdd = [];
            for (let i = parseInt(iterate1.value); i <= parseInt(iterate2.value); i++) {
                let nb = i < 10 ? '0' + i : i;
                let pseudo = radicalInput.value + nb;
                if (totalAccounts.findIndex(a => a.name.toLowerCase() === pseudo.toLowerCase()) < 0) {
                    accountsToAdd.push({ name: pseudo, lastCheck: 0, status: "checking", level: 0 });
                }
            }
            radicalInput.value = '';
            iterate1.value = '';
            iterate2.value = '';
            if (totalAccounts.length + accountsToAdd.length >= MAX_ACCOUNTS) {
                alert('[ERREUR] Nombre maximal de comptes atteint.');
                return -1;
            }
            if (accountsToAdd.length === 0) return -1;
            addTempAccounts(accountsToAdd);
            updateAccounts(accountsToAdd, false);
        }
    }

    addAccountInput.addEventListener("keypress", (event) => {
        if (event.keyCode === 13) {
            const value = event.target.value;
            const canAdd = value !== "" && totalAccounts.findIndex(a => a.name.toLowerCase() === value.toLowerCase()) < 0;
            if (totalAccounts.length >= MAX_ACCOUNTS) {
                alert('[ERREUR] Nombre maximal de comptes atteint.');
                return -1;
            }
            if (canAdd) {
                const account = { name: value, lastCheck: 0, status: "checking", level: 0 };
                addTempAccounts([account], false);
                checkAccount(account).then(async accountRes => {
                    const formInfo = await addFormInfo(accountRes);
                    setTimeout(() => removeFormInfo(formInfo), BEFORE_TRANSITION);
                    if (accountRes.status === 'not-found') {
                        updateWholeContainer(totalAccounts.concat([accountRes]), false);
                        setTimeout(() => removeAccount(accountRes, true), BEFORE_TRANSITION);
                    } else {
                        totalAccounts.push(accountRes);
                        updateWholeContainer(totalAccounts);
                    }
                });
            }
            event.target.value = '';
        }
    });

    headerRemove.onclick = removeAll;
    importInput.onchange = importFile;

    bannedAccountContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("jvalt-list-remove")) {
            const account = totalAccounts.find(a => a.name === event.target.parentNode.getAttribute("name"));
            removeAccount(account);
        } else if (event.target.classList.contains("jvalt-list-refresh")) {
            let accountIndex = totalAccounts.findIndex(a => a.name === event.target.parentNode.getAttribute("name"));
            let account = totalAccounts[accountIndex];
            let accountLink = event.target.parentNode.querySelector('a');

            event.target.parentNode.className = 'jvalt-account-item';
            event.target.parentNode.classList.add('checking');
            checkAccount(account).then(accountRes => {
                totalAccounts[accountIndex] = accountRes;
                updateWholeContainer(totalAccounts);

                if (accountRes.status === 'not-found') {
                    setTimeout(() => removeAccount(accountRes, true), 500);
                }
            });
        }
    });

    exportLink.addEventListener('click', (event) => {
        if (!totalAccounts || totalAccounts.length===0) {
            event.preventDefault();
            alert("Il n'y a rien à exporter.");
            return;
        }
    });

    importLink.addEventListener('click', (event) => {
        importInput.click();
    });

    radicalInput.addEventListener('change', (event) => {
        const exponent = 15 - radicalInput.value.length;
        const maxValue = 10**exponent - 1;
        iterate2.setAttribute('max', maxValue);
    });

    iterate1.addEventListener('change', (event) => {
        const minInput = iterate1.getAttribute('min');
        const minPossible = minInput ? parseInt(minInput) : parseInt(iterate1.value);
        const minVal = Math.max(parseInt(iterate1.value), minPossible);
        var toDisplay = (0 <= minVal && minVal < 10) ? '0' + minVal : minVal;
        iterate1.value = toDisplay;
        iterate2.setAttribute('max', minVal + MAX_ACCOUNTS - 1);
    });

    iterate2.addEventListener('change', (event) => {
        const maxInput = iterate2.getAttribute('max');
        const maxPossible = maxInput ? parseInt(maxInput) : parseInt(iterate2.value);
        const maxVal = Math.min(parseInt(iterate2.value), maxPossible);
        var toDisplay = (0 <= maxVal && maxVal < 10) ? '0' + maxVal : maxVal;
        iterate2.value = toDisplay;
        iterate1.setAttribute('min', Math.max(1, maxVal - MAX_ACCOUNTS));
    });

    submitIterateBtn.onclick = submitIterate;

    if (totalAccounts.length > 0) {
        updateWholeContainer(totalAccounts);
        updateAccounts(totalAccounts, true);
    }

    checkScriptUpdate();

    console.log('JvAlt is ready');
})();
