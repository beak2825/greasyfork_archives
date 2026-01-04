// ==UserScript==
// @name         JVC - Restauration des messages
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ré-affiche les messages supprimés d'un topic
// @author       Yhria
// @match        https://www.jeuxvideo.com/forums/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/434043/JVC%20-%20Restauration%20des%20messages.user.js
// @updateURL https://update.greasyfork.org/scripts/434043/JVC%20-%20Restauration%20des%20messages.meta.js
// ==/UserScript==

var result;

function fetch_topic_id(){
    let url = window.location.href;
    let regex = "(?:https:\/\/){0,1}(?:www\.){0,1}(?:jeuxvideo\.com\/forums\/){1}(?:[0-9]+)-(?:[0-9]+)-([0-9]+)-([0-9]+).*"
    return [url.match(regex)[1], url.match(regex)[2]]
}

async function fetch_messages_from_topic(topic_id, page){
    return new Promise( (resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://jvarchive.com/api/topics/' + topic_id + '/messages?page=' + page + '&itemsPerPage=20',
            headers: {
                "accept": "application/json",
                "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7,ko;q=0.6,ja;q=0.5",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "sec-ch-ua": "\"Chromium\";v=\"94\", \"Google Chrome\";v=\"94\", \";Not A Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            onload: function(responseDetails) {
                result = JSON.parse(responseDetails.responseText);
                resolve(JSON.parse(responseDetails.responseText));
            }
        });})
}

async function restore_messages(){
    let topic_id = fetch_topic_id()
    let current_messages = document.getElementsByClassName("bloc-message-forum-anchor")
    let x, z, b, id, y, d, to_add, avatar;

    await fetch_messages_from_topic(topic_id[0], topic_id[1])
    for (x in result.messages){
        if (isNaN(x)){
                break
        }
        for (y in current_messages){
            if (isNaN(y)){
                break
            }
            id = current_messages[y].id.slice(5)
            if (result.messages[x].id == id.toString().toLowerCase()){
                break
            }
            if (result.messages[x].id < id.toString().toLowerCase())
            {
                avatar = 'https://image.jeuxvideo.com/avatar-sm/default.jpg'
                if (result.messages[x].auteur.avatar < null){
                    avatar = result.messages[x].auteur.avatar
                }
                d = new Date(result.messages[x].date_post)
                to_add = '<span id="post_' + result.messages[x].id + '" class="bloc-message-forum-anchor"></span>'
                to_add += `<div class="bloc-message-forum " data-id="`+ result.messages[x].id +`">
                        <div class="conteneur-message">
                            <div class="bloc-avatar-msg">
                    <div class="back-img-msg">
                        <div>
                                                            <a href="https://www.jeuxvideo.com/profil/` + result.messages[x].auteur.pseudo.toString().toLowerCase() + `?mode=infos" target="_blank" class="xXx ">
                                    <img src="` + avatar + `" class="user-avatar-msg" alt="` + result.messages[x].auteur.pseudo + `" style="border-radius: 0%;">
                                </a>
                                                    </div>
                    </div>
                </div>
                        <div class="inner-head-content">
                <div class="bloc-header">
                                            <a href="https://www.jeuxvideo.com/profil/` + result.messages[x].auteur.pseudo.toString().toLowerCase() + `?mode=infos" target="_blank" class="xXx bloc-pseudo-msg text-user">
                            ` + result.messages[x].auteur.pseudo.toString().toLowerCase() + `
                        </a><a style="font-size: .6rem;text-transform: uppercase;margin-left: .25rem!important;color: #f80031;background-color: #fdd1da;display: inline-block;padding: .35rem .375rem;font-weight: 600; line-height: 1; top: .75rem;text-align: center;white-space: nowrap;vertical-align: initial;border-radius: .375rem;transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;">Message supprimé</a>
                                                    <div class="bloc-mp-pseudo">
                                <a href="https://www.jeuxvideo.com/messages-prives/nouveau.php?all_dest=` + result.messages[x].auteur.pseudo + `" target="_blank" class="xXx ">
                                    <span class="picto-msg-lettre" title="Envoyer un message privé"><span>MP</span></span>
                                </a>
                            </div>
                                                                <div class="bloc-options-msg"><span class="picto-msg-quote" title="Citer"><span>Citer</span></span></span></span></div>                    <div class="bloc-date-msg">
                                                    <a href="/forums/message/`+ result.messages[x].id +`" target="_blank" class="xXx lien-jv">` + d.toLocaleDateString('fr-FR', {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) + `</a>
                                            </div>
                </div>
                                <div class="bloc-contenu">
                    <div class="txt-msg  text-enrichi-forum ">
                                                    <p>`+ result.messages[x].texte +`</p>
                                            </div>
                                                                                                <div class="signature-msg  text-enrichi-forum ">
                            </div>
                                                            </div>
                                            </div>
        </div>
    </div>`
                current_messages[y].outerHTML = to_add + current_messages[y].outerHTML
                b = document.querySelectorAll("[ data-id='" + result.messages[x].id + "']")[0].getElementsByTagName("blockquote")
                for (z in b){
                    b[z].className = "blockquote-jv"
                    b[z].setAttribute("data-visible", 1)
                }
                break
            }
        }
    }
}
restore_messages()