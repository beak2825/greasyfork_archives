// ==UserScript==
// @name         Histo Message Remove
// @namespace    Histo Message Remove
// @version      34.6.8
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
const stylecss = document.createElement('style');
stylecss.setAttribute('id', 'hst-erase-css');
stylecss.textContent = `

    /* profil */

    .icon-link-profil {
        font-size: 0.6em;
        background: transparent;
        border: none;
    }
    .icon-link-profil::before {
        content: "🔗";
    }

    .icon-strike {
        background: transparent;
        border: none;
    }

    .icon-link-msg {
         background-color: transparent;
         border: none;
         float: right;
    }
    .icon-link-msg::before {
        content: "🔗";
    }
    .bloc-message-forum:not(.msg-supprime):not(.msg-supprime-gta) .icon-link-msg {
        display : none;
    }


    /* page message */

   .strike-url-msg {
       background-color: transparent;
       border-radius: 10px;
       color: var(--jv-text-color);
    }

   .check-link-url,
   .hist-btn-url {
       border-radius: 10px;
       line-height: 1.3;
   }

    html.bd-shut .hist-btn-url::after {
        content: "✔";
    }

    /* NO LINK
    .hist-btn-url {
        width : 200px ;
    }

    .check-link-url,
    .icon-link-profil,
    .icon-link-msg {
        display : none ! important;
    }
    NO LINK */

`;



function main() {
    if (window.location.href.indexOf('?mode=historique_forum') > -1) {
        if (!document.querySelector('.bloc-message-forum')) return;

        //INJECTION_CSS
        document.head.appendChild(stylecss);

        // //// GLOBAL //// //
        let pseudoar = window.location.href.split("/").pop()?.split('?')[0];

        //BOUTON_VIEW_HISTO
        let histomessage = document.querySelector('.titre-head-bloc .titre-bloc');
        histomessage.insertAdjacentHTML('beforeend', `<button class="icon-link-profil"></button>`); //🔗
        histomessage.querySelector('.icon-link-profil').addEventListener('click', () => {
            window.open(`${optLink}/profil/${pseudoar}`, '_blank', 'noopener,noreferrer');
        });

        //FONCTION_EFFACEMENT_BOUCLE_(Tableau)
        async function lotSuppressionMsgFantomes() {
            let groupSendPost = confirm("Envoyer une seule requete ?");
            cleanstatut.querySelector('.icon-strike').innerText = "⏳";
            if (groupSendPost) {
                // Envoie groupée
                await fetch("/forums/modal_del_message.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: `${messageListBuilkDelete.map(id => `tab_message[]=${id}`).join("&")}&type=delete&ajax_hash=${ajaxHashElementValue}`
                });
            } else {
                // Envois individuels
                for (let messageId of messageListBuilkDelete) {
                    await fetch("/forums/modal_del_message.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: `tab_message[]=${messageId}&type=delete&ajax_hash=${ajaxHashElementValue}`
                    });
                }
            }
            cleanstatut.querySelector('.icon-strike').innerText = "❌";
            alert("Tous les messages ont été supprimés");
        }

        //BOUTON_CLEAN
        let cleanstatut = document.querySelector('.titre-head-bloc .bloc-on-right');
        cleanstatut.insertAdjacentHTML('beforeend', `<button class="icon-strike">❌</button>`);
        cleanstatut.querySelector('.icon-strike').addEventListener('click', () => lotSuppressionMsgFantomes());


        //recuperer_hash
        let ajaxHashElementValue = document.querySelector("#ajax_hash_moderation_forum").value;

        // #OFFALTX:REMOVE-START
        const channelBraod = new BroadcastChannel("jvc-capt-channel");

        channelBraod.postMessage(ajaxHashElementValue);
        channelBraod.onmessage = (callListener) => {
            if (callListener.data === null) channelBraod.postMessage(ajaxHashElementValue);
        };
        // #OFFALTX:REMOVE-END

        // //// LISTING BLOCS //// //

        // Sélectionnez tous les BLOCS
        var blocsMessages = document.querySelectorAll('.bloc-message-forum');

        const messageListBuilkDelete = [];
        // Parcourez chaque bloc
        blocsMessages.forEach(function(bloc) {
            var contenuBloc = bloc.querySelector('.bloc-contenu');
            const messageId = bloc.getAttribute('data-id');

            //MESSAGE SUPPRIME OU NON
            const messageStriked = bloc.matches('.msg-supprime, .msg-supprime-gta');

            //ADD MSG SUPPRIMES dans un tableau POUR BUILD DELETE (lotSuppressionMsgFantomes)
            if (messageStriked) messageListBuilkDelete.push(messageId);

            // Créez le bouton
            contenuBloc.insertAdjacentHTML('beforeend', `<button class="icon-strike">${messageStriked ? '❌' : '❎'}</button>`);
            contenuBloc.querySelector('.icon-strike').addEventListener('click', async function() {
                await fetch("/forums/modal_del_message.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: `tab_message[]=${messageId}&type=delete&ajax_hash=${ajaxHashElementValue}`
                });
                messageStriked ? alert(`Message ${messageId} supprimé`) : location.reload();
            });

            //* LINK MSG LINK
            contenuBloc.insertAdjacentHTML('beforeend', `<button class="icon-link-msg"></button>`); //🔗
            contenuBloc.querySelector('.icon-link-msg').addEventListener('click', () => {
                window.open(`${optLink}/forums/message/${messageId}`, '_blank', 'noopener,noreferrer');
            });
            //*/
        });
    }

    else if (window.location.href.indexOf('?mode=infos') > -1) {

        //injection css
        document.head.appendChild(stylecss);

        // SÉLECTIONNE TOUS LES LIGNES MSG
        var listeMsgs = document.querySelectorAll('.col-lg-6:last-of-type .body.last-messages .text-cell.line-ellipsis');
        // Parcours chaque lien
        listeMsgs.forEach(function(listeMsg) {
            // Sélectionne le lien dans le liens :hap:
            let messageId = listeMsg.querySelector('a').href.split('/').pop(); //Get ID

            //AJOUT STRIKE BTN
            listeMsg.insertAdjacentHTML('beforeend', `<button class="icon-strike">❎</button>`);
            listeMsg.querySelector('.icon-strike').addEventListener('click', async function() {
                //FETCH_HASH
                let ajaxHashElementValue = await fetchGetHash(`/forums/message/${messageId}`);

                await fetch("/forums/modal_del_message.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: `tab_message[]=${messageId}&type=delete&ajax_hash=${ajaxHashElementValue}`
                });
                location.reload();
            });
        });
    }



    else if (window.location.href.indexOf('/message/') > -1) {
        if (document.querySelector('.bloc-message-forum')) return;

        //INJECTION_CSS
        document.head.appendChild(stylecss);

        //URL_PSEUDO
        let spanpseudo = document.querySelector('.headerAccount__pseudo');
        let pseudoco = spanpseudo.textContent.toLowerCase();


        let ajaxHashElementValue;
        let channelBraod;
        //IF_FORUM
        if (window.location.href.includes('/forums/message/')) {
            //changer icone si message déjà supprimé
            let getDivError = document.querySelectorAll('.col-md-12.text-center')[0], jvcFavicon = document.querySelector("link[rel~='icon']");
            if (!getDivError.textContent.includes('topic')) jvcFavicon.href = 'https://images.emojiterra.com/google/noto-emoji/unicode-15.1/color/128px/274e.png';

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

        let messageId = window.location.href.split("/").pop()?.split('?')[0];

        const getDiv1 = document.querySelectorAll('.col-md-12.text-center')[0];
        getDiv1.insertAdjacentHTML('beforeend', `
          <br><br>
          <button class="strike-url-msg">
              ❌ Supprimer le message ❌
          </button>
          <br><br>
        `);

        //Logique JS suppression
        getDiv1.querySelector('.strike-url-msg').addEventListener('click', async () => {
            if (window.location.href.includes('/forums/message/')) {
                // #OFFALTX:REMOVE-START
                if (!ajaxHashElementValue) {
                    ajaxHashElementValue = await fetchGetHash(`/profil/${pseudoco}?mode=historique_forum`);
                }
                channelBraod.postMessage(ajaxHashElementValue);
                // #OFFALTX:REMOVE-END

                /* #ALTX:UNCOMMENT
                //FETCH_HASH
                ajaxHashElementValue = await fetchGetHash(`/profil/${pseudoco}?mode=historique_forum`);
                #ALTX:UNCOMMENT */

                await fetch("/forums/modal_del_message.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: `tab_message[]=${messageId}&type=delete&ajax_hash=${ajaxHashElementValue}`
                });

                location.reload();
            } else {
                //FETCH_HASH
                let ajaxHashCommentaireValue = await fetchGetHash(`/profil/${pseudoco}?mode=historique_commentaire`);

                await fetch("/commentaire/ajax_delete_commentaire.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: `tab_commentaire[]=${messageId}&ajax_hash=${ajaxHashCommentaireValue}`
                });

                location.reload();
            }
        });

        if (!window.location.href.includes('/forums/message/')) return;

        const getDiv2 = document.querySelectorAll('.col-md-12.text-center')[2];
        getDiv2.insertAdjacentHTML('beforeend', `
            <br><br>
            <button class="btn btn-danger check-link-url">
                Check JV
            </button>
            <a class="btn btn-secondary hist-btn-url" href="/profil/${pseudoco}?mode=historique_forum">
                Historique
            </a>
        `);

        //LISTENER JS
        getDiv2.querySelector('.check-link-url').addEventListener('click', () => {
            window.location.href = `${optLink}/forums/message/${messageId}`;
            /* window.open(`${optLink}/forums/message/${messageId}`, '_blank', 'noopener,noreferrer'); */
        });
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
//const optLink = "https://jvarchive.top"


main();
