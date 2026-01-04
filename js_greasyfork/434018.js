// ==UserScript==
// @name         jvc message history
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  add user message history in jvc
// @author       Yhria
// @match        https://www.jeuxvideo.com/profil/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/434018/jvc%20message%20history.user.js
// @updateURL https://update.greasyfork.org/scripts/434018/jvc%20message%20history.meta.js
// ==/UserScript==

var result;
var status;

function parseHeaders(headersString) {
  class Headers {
    get(key) {
      return this[key.toLowerCase()];
    }
  }
  const headers = new Headers();
  for (const line of headersString.split("\n")) {
    const [key, ...valueParts] = line.split(":"); // last-modified: Fri, 21 May 2021 14:46:56 GMT
    if (key) {
        headers[key.trim().toLowerCase()] = valueParts.join(":").trim();
    }
  }
  return headers;
}

async function topic_history(){
    let x;
    let to_add;
    let d;
    to_add = `<div class="bloc-default-profil">
                                <div class="header">
                                    <h2>Derniers topics</h2>
                                </div>
                                <div class="body last-messages">
                                    <table class="profil-display-tab">`
    await get_topics(username)
    status = status.items
    let is_deleted;
    for (x in status){
        if (isNaN(x)){
            continue
        }
        console.log(x)
        d = new Date(status[x].date_creation)
        is_deleted = ''
        if (status[x].date_suppression != null){
            is_deleted = `<span style="font-size: .6rem; text-transform: uppercase; margin-left: .25rem!important; color: #f80031; background-color: #fdd1da; display: inline-block; padding: .35rem .375rem; font-weight: 600; line-height: 1; text-align: center; white-space: nowrap; vertical-align: initial; border-radius: .375rem; transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;">Supprimé</span>`
        }
        to_add += `<tbody><tr>
                                        <td class="text-cell line-ellipsis">` + is_deleted + `<a href="https://jvarchive.com/forums/42-51-` + status[x].id + `-1-0-1-0-archive" class="xXx ">  ` + status[x].titre
            + `</a></td><td class="date-cell"> le ` + d.getDate() + `/` + d.getMonth() + `/` + d.getUTCFullYear() + ' à ' + d.getHours() + `h` + d.getMinutes() + `</td></tr></tbody>`
    }
    to_add += `</table></div></div></div>`
    document.getElementsByClassName("col-md-6")[0].innerHTML += to_add
}

function last_5messages(username){
    GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://jvarchive.com/api/auteurs/' + username + '/last5messages',
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
        add_message_history()
    }
});
}

async function get_topics(username){
    return new Promise( (resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://jvarchive.com/api/topics/search?page=1&itemsPerPage=40&search=' + username + '&searchType=auteur_topic_exact',
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
                status = JSON.parse(responseDetails.responseText);
                resolve(JSON.parse(responseDetails.responseText));
            }
        });})
}

async function add_message_history(){
    let node = document.getElementsByClassName("bloc-default-profil");
    let x;
    let child;
    let to_add;
    let d;
    let th = 0
    for (x in node) {
        if (!isNaN(x)) {
            if (node[x].childElementCount > 0) {
                for (child in node[x].children) {
                    if (node[x].children[child].className == 'header') {
                        if (node[x].children[child].children[0].localName == 'h2') {
                            if (node[x].children[0].children[0].textContent == 'Derniers messages forums') {
                                if (th == 0){
                                    await topic_history()
                                }
                                th = 1
                                return 0
                            }
                        }
                    }
                }
            }
        }
    }

    if (result.statusCode === undefined){
        to_add = `<div class="bloc-default-profil">
                                <div class="header">
                                    <h2>Derniers messages forums</h2>
                                </div>
                                <div class="body last-messages">
                                    <table class="profil-display-tab">`
        for (x in result){
            if (isNaN(x)){
                continue;
            }
            d = new Date(result[x].date_post)
            to_add += `<tbody><tr>
                                        <td class="text-cell line-ellipsis"><a href="https://jvarchive.com/forums/message/` + result[x].id + `" class="xXx ">` + result[x].topic.titre
                + `</a></td><td class="date-cell"> le ` + d.getDate() + `/` + d.getMonth() + `/` + d.getUTCFullYear() + ' à ' + d.getHours() + `h` + d.getMinutes() + `</td></tr></tbody>`
        }
        to_add += `</table></div></div></div>`
    }
    document.getElementsByClassName("col-md-6")[0].innerHTML += to_add
    if (th == 0) {
        await topic_history()
        th = 1
    }
}
var username = document.getElementsByClassName("infos-pseudo")[0].children[0].outerText
last_5messages(username)