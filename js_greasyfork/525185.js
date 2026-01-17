// ==UserScript==
// @name         Full_Black_List
// @namespace    Full_Black_List
// @version      0.46.5
// @description  Supprime totalement les sujets des pseudo blacklistés depuis la blacklist JVC.
// @author       Atlantis
// @match        *://www.jeuxvideo.com/recherche/forums/0-*
// @match        *://www.jeuxvideo.com/forums/0-*
// @match        *://www.jeuxvideo.com/forums/42-*
// @match        *://www.jeuxvideo.com/forums/1-*
// @match        *://www.jeuxvideo.com/forums/message*
// @match        *://www.jeuxvideo.com/messages-prives/message.php*
// @match        *://www.jeuxvideo.com/messages-prives/indesirables.php
// @match        *://www.jeuxvideo.com/sso/blacklist.php
// @match        *://www.jeuxvideo.com/login*
// @run-at       document-end
// @icon         https://images.emojiterra.com/microsoft/fluent-emoji/15.1/128px/1f6ab_color.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525185/Full_Black_List.user.js
// @updateURL https://update.greasyfork.org/scripts/525185/Full_Black_List.meta.js
// ==/UserScript==


// === SOMMAIRE RAPIDE DU SCRIPT ===
// FONCTIONS RESEAU FETCH :
//   [1] fonctionSynchBLForums() : blacklist.php => LocalStorage
//   [2] getBLListMP() : Check BlackList MP
//   [2] deleteBlacklistMP() : BlackListForum => Strike BlackListForumMP
//
// CODE PAR PAGE :
//   [3] /login                            => Page Login reinitialise la BlackList du LocalStorage
//   [5] /forums/0-* (liste sujets)        => Masque sujets via BlackList dans local storage
//   [6] /forums/1- /42-                   => Masque messages BL / Synch BL Fofo => localStorage
//   [7] /messages-prives/message.php      => masque messages BL MP + Synch : localStorage <=> BL MP <=> BL Fofo
//   [8] /messages-prives/indesirables.php => Suppression Storage MP + Synch Fofo
//   [9] /sso/blacklist.php                => Gestion BL Forum - MP + Boutons Import / Export / Reset



///// FONTIONS RESEAU FETCH //////
async function fetchParseDom(url) {
    const res = await fetch(url);
    const html = await res.text();
    return new DOMParser().parseFromString(html, 'text/html');
}

//1___FETCH___SYNCH__BL___(FETCH_FORUM_LIST_PAGE)_
//PUSH — blacklist.php => LocStorage
async function fonctionSynchBLForums() {
    let docFetched = await fetchParseDom('/sso/blacklist.php');
    let pseudos = docFetched.querySelectorAll('#blacklist span');

    // /SSO/BLACKLIST.PHP => VERS_LOCAL_STORAGE
    let pseudoList = [...pseudos].map(span => span.textContent.trim().toLowerCase());
    localStorage.setItem('fullblacklistJVC', JSON.stringify(pseudoList));
}



//2___Fetch_MP_LIST_______(FETCH_MP_LIST_PAGE)___
// GET — ID et Hash Blacklist /indesirables.php
let idListFetch = [];
let hashListFetch = [];

async function getBLListMP() {
    let docFetched = await fetchParseDom('/messages-prives/indesirables.php');
    let listItems = docFetched.querySelectorAll('#blacklist .mp_delete_blacklist');

    //recupere pour chaque id
    listItems.forEach(user => {
        let idAlias = user.getAttribute('data-id');
        let hashTempo = user.getAttribute('data-hash');
        idListFetch.push(idAlias); // Get ID en liste
        hashListFetch.push(hashTempo); // Get hash temp (necessaire pour suppression)
    });
}

//2A___CLEAN_MP___
// POST — Delete User MP
function deleteBlacklistMP(idAlias) {
    const index = idListFetch.indexOf(idAlias);
    if (index === -1) return; // No index
    const hashTempo = hashListFetch[index];
    // Effectuer la fetch de suppression (EN MP)
    fetch('/messages-prives/ajax/ajax_mp_blacklist_delete.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id=${idAlias}&hash=${hashTempo}`
    });
}


//2B___CLEAN_MP_ALL_____
// POST_LOT — Delete All Users MP
async function deleteBlacklistMPALL(onProgress) {
    for (const [index, idAlias] of idListFetch.entries()) {
        const hashTempo = hashListFetch[index];
        // Effectuer la fetch de suppression (EN MP)
        await fetch('/messages-prives/ajax/ajax_mp_blacklist_delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${idAlias}&hash=${hashTempo}`
        });
        onProgress(); // Call Back avancement.
    }
}


///// PAGES GEREES //////
//3_______PAGE_DE______CONNEXION___(Login)___
if (location.href.includes('jeuxvideo.com/login')) {
    localStorage.removeItem('fullblacklistJVC'); // Efface LocalStorage => EN CAS DE DECONNEXION
}



//5______BLACKLIST____LISTE_SUJETS___(Liste_Sujet_et_Recherche)___
if (location.href.includes('jeuxvideo.com/forums/0-') || location.href.includes('jeuxvideo.com/recherche/forums/0-')) {

    let listeLocalStorage = localStorage.getItem('fullblacklistJVC');
    // Si aucune blacklist locale, on synchronise depuis le serveur JVC et on recharge la page
    if (!listeLocalStorage) {
      fonctionSynchBLForums().then(() => location.reload());
    } else {
        // Recupere pseudos blacklistés
        const blacklistStorage = JSON.parse(listeLocalStorage);
        // Supprime sujet avec pseudo blacklisté (includes)
        document.querySelectorAll('.topic-author').forEach(authorEl => {
            const pseudo = authorEl.textContent.trim().toLowerCase();
            if (blacklistStorage.includes(pseudo)) authorEl.closest('li')?.remove();
        });
    }
}

//5B_______BOUTON_____BLACKLIST___LISTE_SUJET_(Liste_Sujet)_____
if (location.href.includes('jeuxvideo.com/forums/0-')) {

    document.querySelector('.bloc-pagi-default .pagi-before-list-topic')?.insertAdjacentHTML('afterend', `
        <div class="cust-btn-container">
            <span id="bl-refresh" class="btn btn-actu-new-list-forum icon-refresh"
                  title="Actualiser la blacklist des Sujets"
                  style="border-radius:6px; min-width:5rem;">
                Actu BL
            </span>&nbsp;
            <a href="/sso/blacklist.php" style="outline:none;" target="_blank">
                <span class="btn btn-actu-new-list-forum"
                      title="Voir/Editer/Exporter la BlackList"
                      style="border-radius:6px; min-width:4rem;">
                    Voir BL
                </span>
            </a>
        </div>
    `);


    document.querySelector('.cust-btn-container #bl-refresh').addEventListener('click', async () => {
        await fonctionSynchBLForums();
        alert('Filtrage des topics actualisés avec la blacklist JVC ✅');
        location.reload();
    });

}

//6______MASQUAGE_____BLOC____MESSAGE____FORUM__(Topic_1_42)____
if (location.href.includes('jeuxvideo.com/forums/1-') || location.href.includes('jeuxvideo.com/forums/42-') || location.href.includes('jeuxvideo.com/forums/message/')) {

    //Masquage_Message_avec_.msg-pseudo-blacklist
    const style = document.createElement('style');
    style.textContent = `.msg-pseudo-blacklist { display: none !important; } `;
    document.head.appendChild(style);
    document.querySelectorAll('.msg-pseudo-blacklist').forEach(block => block.remove());

    //ajout dun event au bouton blacklist
    const scopeForumBlocs = document.querySelector('.conteneur-messages-pagi');
    scopeForumBlocs.addEventListener('click', async(e) => {
        let btnPicto;
        if (e.target.closest('#jvchat-main')) return; //dont touche if jvchat
        if (btnPicto = e.target.closest('.picto-msg-tronche')) sessionStorage.setItem('fullblacklistJVCAwait', 'true');
        /* TOPIC LIVE PATCH
        e.preventDefault(); e.stopImmediatePropagation();
        const hash = document.getElementById('ajax_hash_preference_user').value;
        await fetch(`/forums/ajax_forum_blacklist.php?id_alias_msg=${btn.dataset.idAlias}&action=add&ajax_hash=${hash}`);
        location.reload();
        */
    }, { capture: true });

    //Masquage_Citations
    function hidePseudoQuotes() {
        const blacklistStorage = JSON.parse(localStorage.getItem("fullblacklistJVC") || "[]");
        document.querySelectorAll(".blockquote-jv > p:first-of-type").forEach(p => {
            const pseudoIRC = p.textContent.startsWith("[") && p.textContent.split("<")[1]?.split(">")[0]?.toLowerCase(); //IRC
            const pseudo = p.textContent.replace(/\s+/g, ' ').split(" a écrit")[0]?.split(" ")?.pop()?.trim()?.toLowerCase(); //FOFO
            if (blacklistStorage.includes(pseudo) || blacklistStorage.includes(pseudoIRC)) {
                p.closest(".blockquote-jv").hidden = true;
            }
        });
    }
    hidePseudoQuotes();

    // Mise à jour de la Blacklist du script APRES actualisation
    if (sessionStorage.getItem('fullblacklistJVCAwait') === 'true') {
        fonctionSynchBLForums().then(hidePseudoQuotes);
        sessionStorage.removeItem('fullblacklistJVCAwait');
    }

}

//7______________MASQUAGE____BLOC__MESSAGE_MP__(Message_MP)____
if (location.href.includes('jeuxvideo.com/messages-prives/message.php')) {

    // [1] Ajout d'un event sur les boutons "blacklist MP" pour quils agissent aussi sur la blacklist forum
    document.querySelectorAll('.picto-msg-tronche').forEach(btn => {
        btn.addEventListener('click', () => {
            const idAlias = btn.getAttribute('data-url').match(/add_blacklist=(\d+)/)[1];
            sessionStorage.setItem('fullblacklistJVCidAlias', idAlias);
        });
    });

    // [2] localStorage => simulation de clic sur bouton "blacklist MP"
    let listeLocalStorage = localStorage.getItem('fullblacklistJVC');
    // Si aucune blacklist locale, on synchronise depuis le serveur JVC et on recharge la page
    if (!listeLocalStorage) {
        fonctionSynchBLForums().then(() => location.reload());
    } else {
        // Liste pseudos en minuscules
        const blacklistStorage = JSON.parse(listeLocalStorage);
        const messageBlocks = document.querySelectorAll('.bloc-message-forum')
        messageBlocks.forEach(block => {
            const pseudoBloc = block.querySelector('.bloc-pseudo-msg')?.textContent.trim().toLowerCase();
            const blacklistButton = block.querySelector('.picto-msg-tronche');
            if (blacklistStorage.includes(pseudoBloc) && blacklistButton) blacklistButton.click();
        });
    }

    // [3] Appel black list MP => Synch Fofo
    let idAlias = sessionStorage.getItem('fullblacklistJVCidAlias');
    if (idAlias) {
      (async () => {
        // Fetch recuperer hash preference forum
        let docFetched = await fetchParseDom('/forums/0-36-0-1-0-1-0-guerre-des-consoles.htm');
        let hashValue = docFetched.querySelector('#ajax_hash_preference_user')?.value;

        // AjoutBL_Forum
        await fetch(`/forums/ajax_forum_blacklist.php?id_alias_msg=${idAlias}&action=add&ajax_hash=${hashValue}`);
        await fonctionSynchBLForums();
        //Clean
        sessionStorage.removeItem('fullblacklistJVCidAlias'); // Supprime ID => Il vient d'etre traité.
      })();
    }


    // [4] Cacher les messages déjà blacklistés
    document.querySelectorAll('.msg-pseudo-blacklist').forEach(block => block.remove());

}


//8________________Suppression_combine_BL___(Page_BlackList_MP)____
if (location.href.includes('jeuxvideo.com/messages-prives/indesirables.php')) {

    // Une suppression dans la BlackList MP => Suppression BL Forum + Suppression LocalStorage
    document.querySelectorAll('.mp_delete_blacklist').forEach(button => {
        button.addEventListener('click', () => {
            const userId = button.getAttribute('data-id');
            fetch(`/sso/ajax_delete_blacklist.php?id_alias_unblacklist=${userId}`);
            localStorage.removeItem('fullblacklistJVC');
        });
    });
}

//9________________MISE_A_JOUR_PAGE_BLACK_LISTE__(Page_BlackList_Forums)____
if (location.href.includes('jeuxvideo.com/sso/blacklist.php')) {

    fonctionSynchBLForumsNoFetch(); // Liste Page vers LocalStorage (on est sur la page => PAS de fetch)

    let hashMPListed;
    // Suppression par pseudo
    document.querySelectorAll('.icon-cross-entypo').forEach(cross => {
        cross.addEventListener('click', async () => {
            let idAlias = cross.closest('li')?.getAttribute('data-id-alias'); // Récupérer l'id
            if (typeof hashMPListed === 'undefined') {
                await getBLListMP(); //Get_MP_BL
                hashMPListed = true;
            }
            deleteBlacklistMP(idAlias); // Supprime PSEUDO EN MP
            fonctionSynchBLForumsNoFetch(); // Liste Page vers LocalStorage
        });
    });


    async function fonctionSynchBLForumsNoFetch() { //lit les pseudo visible sur la page
        await new Promise(resolve => setTimeout(resolve, 1000)); //delais pour capturer la page à jour

        let pseudos = document.querySelectorAll('#blacklist span');
        let pseudoList = [...pseudos].map(span => span.textContent.trim().toLowerCase());
        localStorage.setItem('fullblacklistJVC', JSON.stringify(pseudoList));
    }
}

//9b_______________BOUTON_SCRIPT_PAGE__BLACKLIST___(Page_BlackList_Forums)____
if (location.href.includes('jeuxvideo.com/sso/blacklist.php')) {

    //SUPPRESSION TOTALE BL LOT FOFO + MP
    async function deleteAllBlacklist() {
        document.querySelector('#bl-clear').textContent = 'Loading...';
        let listItems = document.querySelectorAll('#blacklist li');

        // Nettoyage de TOUT pseudo blacklistes
        let count = 1;
        for (const liItem of listItems) {
            const idAlias = liItem.getAttribute('data-id-alias');
            await fetch(`/sso/ajax_delete_blacklist.php?id_alias_unblacklist=${idAlias}`);
            document.querySelector('#bl-clear').textContent = `Loading (${count})`;
            count++;
        } 

        // Nettoyage de TOUT pseudo blacklistes en MP
        let countMP = 1
        await getBLListMP(); // récupère sa propre liste depuis la messagerie
        await deleteBlacklistMPALL(() => { // supprime côté MP
            document.querySelector('#bl-clear').textContent = `Loading (OK) (MP : ${countMP})`;
            countMP++;
        });
        window.location.reload();
    }


    //IMPORTATION BLACKLIST fichier JSON
    async function importBlacklist(blJson) {
        const fileJson = blJson.target.files[0];
        if (!fileJson) return;

        let blacklistjson;
        try {
            // Lecture + parsing du fichier JSON
            blacklistjson = JSON.parse(await fileJson.text());
        } catch {
            alert("Fichier JSON invalide.");
            return;
        }

        document.querySelector('#bl-import').textContent = 'Load...';

        // Récupération du hash AJAX
        let docFetched = await fetchParseDom('/forums/0-36-0-1-0-1-0-guerre-des-consoles.htm');
        let hash = docFetched.querySelector('#ajax_hash_preference_user')?.value;

        // REQUÊTES D’AJOUT UN À UNE FOFO
        let count = 1;
        for (const obj of blacklistjson) {
            await fetch(`/forums/ajax_forum_blacklist.php?id_alias_msg=${obj.id}&action=add&ajax_hash=${hash}`);
            document.querySelector('#bl-import').textContent = `Load (${count})`;
            count++;
        }

        window.location.reload();
    }

    //EXPORT BLACKLIST fichier JSON
    function exportBlacklist() {
        const blacklistItems = [...document.querySelectorAll('#blacklist li')];
        const idList = blacklistItems.map(li => ({
            id: li.getAttribute('data-id-alias'),
            pseudo: li.querySelector('span')?.textContent.trim()
        }));

        const blob = new Blob([JSON.stringify(idList, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Blacklist_JVC.json';
        link.click();
        URL.revokeObjectURL(url); // LIBERE LA MEMOIRE apres telechargement
    }

    // CREATION_HTML_BOUTON
    let container = document.querySelector('.layout__row.layout__content.layout__row--gutter.mb-5');
    container.insertAdjacentHTML('beforeend', `
        <ul>
            <button id="bl-import" title="Importer BlackList depuis un Fichier" class="btn btn-secondary" style="border-radius:6px;">
                Importer
            </button>&nbsp;
            <button id="bl-export" title="Exporter BlackList JVC en Fichier" class="btn btn-secondary" style="border-radius:6px;">
                Exporter
            </button>
        </ul>
        <ul>
            <button id="bl-clear" title="Vider toute la blacklist JVC + MP + Script" class="btn btn-danger" style="border-radius:6px;">
                Vider BL Forum et MP
            </button>
        </ul>
    `);

    // ATTACH_LISTENER_IMPORT
    container.querySelector('#bl-import').addEventListener('click', () => {
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.addEventListener('change', importBlacklist);
        input.click();
    });

    // ATTACH_LISTENER_EXPORT
    container.querySelector('#bl-export').addEventListener('click', exportBlacklist);

    // ATTACH_LISTENER_SUPPRESSION
    container.querySelector('#bl-clear').addEventListener('click', () => {
        if (!window.confirm('⚠️ Supprimer toute la blacklist (JVC + MP + Script) ??⚠️')) return;
        deleteAllBlacklist();
    });
}


/*
MIT License

Copyright (c) 2025 Atlantis (https://github.com/Lantea-Git)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/