// ==UserScript==
// @name         Animepahe custom bookmark URL
// @namespace    https://greasyfork.org/users/828421
// @match        https://animepahe.com/*
// @version      0.1
// @author       digzol
// @description  Custom Animepahe bookmark URLs using henrik9999's Animepahe id tracker. (See github.com/henrik9999/animepahe-ids)
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_xmlhttpRequest
// @connect      githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/434418/Animepahe%20custom%20bookmark%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/434418/Animepahe%20custom%20bookmark%20URL.meta.js
// ==/UserScript==

const animepahe = "https://animepahe.com";
const urlParts = window.location.href.split("/");

if (urlParts[3] === "bookmark" && urlParts[4]) {
    let id = urlParts[4];
    redirectBookmark(id)
} else if (urlParts[3] === "anime") {
    let oldBookmarkLink = $(".modal-body a");
    let id = oldBookmarkLink.attr("href").split("/")[4];
    let name = oldBookmarkLink.attr("title");
    $(".title-wrapper h1").append(`<a class="fa fa-star" href="${animepahe}/bookmark/${id}"><span style="display:none;">${name}</span></a>`);
}

async function redirectBookmark(id) {
    let name = await getAnimeName(id);
    let session = await getAnimeSession(name);
    window.location = `${animepahe}/anime/${session}`;
}

async function getAnimeName(id) {
    let data = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://raw.githubusercontent.com/henrik9999/animepahe-ids/main/data.json",
            onload: function(response) {
                if (response.status === 200 && response.responseText) {
                    resolve(JSON.parse(response.responseText));
                } else {
                    resolve({});
                }
            }
        });
    });
    return data[id].title;
}

async function getAnimeSession(name) {
    let response = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: `${animepahe}/api?m=search&q=${encodeURIComponent(name)}`,
            onload: function(response) {
                if (response.status === 200 && response.responseText) {
                    resolve(JSON.parse(response.responseText));
                } else {
                    resolve({});
                }
            }
        });
    });
    return response.data[0].session;
}
