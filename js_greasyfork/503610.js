// ==UserScript==
// @name         Histo Message Remove
// @namespace    Histo Message Remove
// @version      38.5.6
// @description  Strike des msg depuis l'histo et/ou sur des topics supprimes
// @author       Atlantis
// @icon         https://images.emojiterra.com/google/noto-emoji/unicode-15.1/color/128px/274e.png
// @match        *://www.jeuxvideo.com/profil/*?mode=historique_forum*
// @match        *://www.jeuxvideo.com/profil/*?mode=infos
// @match        *://www.jeuxvideo.com/forums/message/*
// @match        *://www.jeuxvideo.com/commentaire/message/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503610/Histo%20Message%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/503610/Histo%20Message%20Remove.meta.js
// ==/UserScript==


//CSS petit bouton
const hstSkinCSS = document.createElement('style');
hstSkinCSS.setAttribute('id', 'hst-erase-css');
hstSkinCSS.textContent = `

    /* profil */

    .icon__link--profil {
        font-size: 0.6em;
        background: transparent;
        border: none;
    }
    .icon__link--profil::before {
        content: "🔗";
    }

    .icon__strike {
        background: transparent;
        border: none;
    }

    .icon__strike--green::before,
    .icon__strike--auto::before {
        content: "❎";
    }
    .icon__strike--red::before,
    .msg-supprime     .icon__strike--auto::before,
    .msg-supprime-gta .icon__strike--auto::before {
        content: "❌";
    }
    .icon__strike--wait::before {
        content: "⏳";
    }

    .icon__link--msg {
        background-color: transparent;
        border: none;
        float: right;
    }
    .bloc-message-forum:not(.msg-supprime):not(.msg-supprime-gta) .icon__link--msg {
        display: none;
    }
    .icon__link--msg::before {
        content: "🔗";
    }


    /* PAGE MESSAGE */

   .action-btn--strike {
       background-color: transparent;
       border-radius: 10px;
       color: var(--jv-text-color);
    }

   .action-btn--check,
   .action-btn--history {
       border-radius: 10px;
       line-height: 1.3;
   }

    html.bd-shut .action-btn--history::after {
        content: "✔";
    }

    /* NO LINK
    .action-btn--history {
        width : 200px ;
    }

    .action-btn--check,
    .icon__link--profil,
    .icon__link--msg {
        display : none ! important;
    }
    NO LINK */

`;



function main() {
    if (location.href.includes('?mode=historique_forum')) {
        if (!document.querySelector('.bloc-message-forum')) return;

        //INJECTION_CSS
        document.head.appendChild(hstSkinCSS);

        // //// GLOBAL //// //
        const currentPseudo = location.href.split("/").pop()?.split('?')[0];

        //BOUTON_VIEW_HISTO
        const histoMessage = document.querySelector('.titre-head-bloc .titre-bloc');
        histoMessage.insertAdjacentHTML('beforeend', `<button class="icon__link--profil"></button>`); //🔗
        histoMessage.querySelector('.icon__link--profil').onclick = () => {
            window.open(`${optLink}/profil/${currentPseudo}`, '_blank', 'noopener,noreferrer');
        };

        //FONCTION_EFFACEMENT_BOUCLE_(Tableau)
        async function lotSuppressionMsgFantomes() {
            const groupSendPost = confirm("Envoyer une seule requete ?");
            cleanStatut.querySelector('.icon__strike').classList.replace('icon__strike--red', 'icon__strike--wait'); // ⏳
            if (groupSendPost) {
                // Envoie groupée
                await fetch("/forums/modal_del_message.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: `${messageListDelete.map(id => `tab_message[]=${id}`).join("&")}&type=delete&ajax_hash=${ajaxHashElementValue}`
                });
            } else {
                // Envois individuels
                for (let messageId of messageListDelete) {
                    await fetch("/forums/modal_del_message.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: `tab_message[]=${messageId}&type=delete&ajax_hash=${ajaxHashElementValue}`
                    });
                }
            }
            cleanStatut.querySelector('.icon__strike').classList.replace('icon__strike--wait', 'icon__strike--red'); //❌
            alert("Tous les messages ont été supprimés");
        }

        //BOUTON_CLEAN
        const cleanStatut = document.querySelector('.titre-head-bloc .bloc-on-right');
        cleanStatut.insertAdjacentHTML('beforeend', `<button class="icon__strike icon__strike--red"></button>`); //❌
        cleanStatut.querySelector('.icon__strike').onclick = lotSuppressionMsgFantomes;


        //recuperer_hash
        const ajaxHashElementValue = document.querySelector("#ajax_hash_moderation_forum").value;

        // #OFFALTX:REMOVE-START
        let channelBraod = new BroadcastChannel("jvc-capt-channel");

        channelBraod.postMessage(ajaxHashElementValue);
        channelBraod.onmessage = (callListener) => {
            if (callListener.data === null) channelBraod.postMessage(ajaxHashElementValue);
        };
        // #OFFALTX:REMOVE-END

        // //// LISTING BLOCS //// //
        const blocsMessages = document.querySelectorAll('.bloc-message-forum');

        const cssClassStrike = '.msg-supprime, .msg-supprime-gta';
        const messageListDelete = [];
        for (const bloc of blocsMessages) {
            if (bloc.matches(cssClassStrike)) messageListDelete.push(bloc.dataset.id);
        }

        // Parcourez chaque bloc
        for (const bloc of blocsMessages) {
            const messageId = bloc.dataset.id;

            // Créez le bouton
            const contenuBloc = bloc.querySelector('.bloc-contenu');
            contenuBloc.insertAdjacentHTML('beforeend', `<button class="icon__strike icon__strike--auto"></button>`); //❎❌
            contenuBloc.querySelector('.icon__strike').onclick = async () => {
                await fetch("/forums/modal_del_message.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: `tab_message[]=${messageId}&type=delete&ajax_hash=${ajaxHashElementValue}`
                });
                if (bloc.matches(cssClassStrike)) alert(`Message ${messageId} supprimé`);
                else location.reload();
            };

            //* LINK MSG LINK
            contenuBloc.insertAdjacentHTML('beforeend', `<button class="icon__link--msg"></button>`); //🔗
            contenuBloc.querySelector('.icon__link--msg').onclick = () => {
                window.open(`${optLink}/forums/message/${messageId}`, '_blank', 'noopener,noreferrer');
            };
            //*/
        }
    }

    else if (location.href.includes('?mode=infos')) {

        //injection css
        document.head.appendChild(hstSkinCSS);

        // SÉLECTIONNE TOUS LES LIGNES MSG
        const listeMsgs = document.querySelectorAll('.col-lg-6:last-of-type .body.last-messages .text-cell.line-ellipsis');
        // Parcours chaque lien
        for (const listeMsg of listeMsgs) {
            // Sélectionne le lien dans le liens :hap:
            const messageId = listeMsg.querySelector('a').href.split('/').pop(); //Get ID

            //AJOUT STRIKE BTN
            listeMsg.insertAdjacentHTML('beforeend', `<button class="icon__strike icon__strike--green"></button>`); //❎
            listeMsg.querySelector('.icon__strike').onclick = async () => {
                //FETCH_HASH
                let ajaxHashElementValue = await fetchGetHash(`/forums/message/${messageId}`);

                await fetch("/forums/modal_del_message.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: `tab_message[]=${messageId}&type=delete&ajax_hash=${ajaxHashElementValue}`
                });
                location.reload();
            };
        }
    }



    else if (location.href.includes('/message/')) {
        if (document.querySelector('.bloc-message-forum')) return;

        //INJECTION_CSS
        document.head.appendChild(hstSkinCSS);

        //URL_PSEUDO
        const currentPseudoEl = document.querySelector('.headerAccount__pseudo');
        const currentPseudo = currentPseudoEl.textContent.toLowerCase();


        let ajaxHashElementValue;
        let channelBraod;
        //IF_FORUM
        if (window.location.href.includes('/forums/message/')) {
            //changer icone si message déjà supprimé
            const jvcFavicon = document.querySelector("link[rel~='icon']");
            const statusDiv = document.querySelectorAll('.col-md-12.text-center')[0];
            if (statusDiv.textContent.includes('topic') === false) jvcFavicon.href = 'https://images.emojiterra.com/google/noto-emoji/unicode-15.1/color/128px/274e.png';

            // #OFFALTX:REMOVE-START
            channelBraod = new BroadcastChannel("jvc-capt-channel");
            channelBraod.postMessage(null); // DEMANDE
            channelBraod.onmessage = (callListener) => {
                if (!callListener.data) return;
                ajaxHashElementValue = callListener.data;
                console.log("Fresh");
                /* mise à classe css ✔ */
                document.documentElement.classList.add("bd-shut");
            };
            // #OFFALTX:REMOVE-END
        }

        const messageId = window.location.href.split("/").pop()?.split('?')[0];

        const getDiv1 = document.querySelectorAll('.col-md-12.text-center')[0];
        getDiv1.insertAdjacentHTML('beforeend', `
          <br><br>
          <button class="action-btn--strike">
              ❌ Supprimer le message ❌
          </button>
          <br><br>
        `);

        //Logique JS suppression
        getDiv1.querySelector('.action-btn--strike').onclick = async () => {
            if (location.href.includes('/forums/message/')) {
                // #OFFALTX:REMOVE-START
                if (!ajaxHashElementValue) ajaxHashElementValue = await fetchGetHash(`/profil/${currentPseudo}?mode=historique_forum`);
                channelBraod.postMessage(ajaxHashElementValue);
                // #OFFALTX:REMOVE-END

                /* #ALTX:UNCOMMENT
                //FETCH_HASH
                ajaxHashElementValue = await fetchGetHash(`/profil/${currentPseudo}?mode=historique_forum`);
                #ALTX:UNCOMMENT */

                await fetch("/forums/modal_del_message.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: `tab_message[]=${messageId}&type=delete&ajax_hash=${ajaxHashElementValue}`
                });

                location.reload();
            } else {
                //FETCH_HASH
                let ajaxHashCommentaireValue = await fetchGetHash(`/profil/${currentPseudo}?mode=historique_commentaire`);

                await fetch("/commentaire/ajax_delete_commentaire.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: `tab_commentaire[]=${messageId}&ajax_hash=${ajaxHashCommentaireValue}`
                });

                location.reload();
            }
        };

        if (!window.location.href.includes('/forums/message/')) return;

        const getDiv2 = document.querySelectorAll('.col-md-12.text-center')[2];
        getDiv2.insertAdjacentHTML('beforeend', `
            <br><br>
            <button class="btn btn-danger action-btn--check">
                Check JV
            </button>
            <a class="btn btn-secondary action-btn--history" href="/profil/${currentPseudo}?mode=historique_forum">
                Historique
            </a>
        `);

        //LISTENER JS
        getDiv2.querySelector('.action-btn--check').onclick = () => {
            window.location.href = `${optLink}/forums/message/${messageId}`;
            /* window.open(`${optLink}/forums/message/${messageId}`, '_blank', 'noopener,noreferrer'); */
        };
    }
}

//RECUP LE HASH EN FETCH VIA LIEN
async function fetchGetHash(url) {
    const response = await fetch(url);
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.querySelector('#ajax_hash_moderation_forum, #ajax_hash_liste_commentaire')?.value || null;
}

const optLink = "https://jvarchive.net"
//const optLink = ""


main();
