// ==UserScript==
// @name         Mettre en valeur les abonnements
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  colore en couleure vive les gens à qui vous êtes abonnés
// @author       Yhria
// @match        https://www.jeuxvideo.com/forums/0-*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/434046/Mettre%20en%20valeur%20les%20abonnements.user.js
// @updateURL https://update.greasyfork.org/scripts/434046/Mettre%20en%20valeur%20les%20abonnements.meta.js
// ==/UserScript==

var result;

async function fetch_subscribers(username){
    return new Promise( (resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://www.jeuxvideo.com/profil/' + username.toString().toLowerCase() + '?mode=abonnements',
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7,ko;q=0.6,ja;q=0.5",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "sec-ch-ua": "\"Chromium\";v=\"94\", \"Google Chrome\";v=\"94\", \";Not A Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1"
            },
            referrer: "https://www.jeuxvideo.com",
            referrerPolicy: "strict-origin-when-cross-origin",
            body: null,
            method: "GET",
            mode: "cors",
            credentials: "include",
            onload: function(responseDetails) {
                result = responseDetails.response;
                resolve(responseDetails.response);
            }
        });})
}

async function highlight_usernames(){
    let x, y;
    let subscribers = [];
    let list_users;

    console.log(document.getElementsByClassName("account-pseudo")[0].textContent)
    await fetch_subscribers(document.getElementsByClassName("account-pseudo")[0].textContent)
    result = new DOMParser().parseFromString(result, "text/html");
    console.log(result)
    result = result.getElementsByClassName("liste-abonnement")[0].getElementsByTagName("a")
    for (x in result){
        if (isNaN(x)){
            break
        }
        subscribers.push(result[x].title.toString().toLowerCase())
    }
    console.log(subscribers)
    list_users = document.getElementsByClassName("xXx text-user topic-author")
    for (y in list_users){
        if (subscribers.indexOf(list_users[y].innerText.toString().toLowerCase()) > -1){
            list_users[y].style.color = '#ffbcde'
            list_users[y].style['font-weight'] = 600
            list_users[y].parentNode.style.background = "#81791d14"
        }
    }
}

highlight_usernames()