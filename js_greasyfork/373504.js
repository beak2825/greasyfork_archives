// ==UserScript==
// @name         MAL -> AniList
// @namespace    https://waifu.me
// @version      1.0.1
// @description  Adds a button to MAL entries that links to the AL entry.
// @author       TehNut
// @match        https://myanimelist.net/anime/*
// @match        https://myanimelist.net/manga/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/373504/MAL%20-%3E%20AniList.user.js
// @updateURL https://update.greasyfork.org/scripts/373504/MAL%20-%3E%20AniList.meta.js
// ==/UserScript==

const embeddedHtml = '<div><a href="${anilistLink}" class="js-favorite-button" style="font-weight: normal;"><span>View on AniList</span></a></div>';
const anilistQuery = `
query($mal_id: Int, $type: MediaType) {
  Media(idMal: $mal_id, type: $type){
    siteUrl
  }
}
`;
const anilistCall = (query, variables) =>
  fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

// Entrypoint
(() => {
    'use strict';
    const path = window.location.pathname;
    if (path.startsWith("/anime") || path.startsWith("/manga")) {
        const pathSplit = path.split("/");
        let link = GM_getValue(pathSplit[2], null);
        if (link) {
            document.getElementById("profileRows").insertAdjacentHTML('beforeend', embeddedHtml.replace("${anilistLink}", link));
        } else {
            console.log("Media of ID " + pathSplit[2] + " has not been queried before");
            anilistCall(anilistQuery, { mal_id: pathSplit[2], type: pathSplit[1].toUpperCase() })
                .then(res => res.json())
                .then(res => res.data)
                .then(res => {
                    GM_setValue(pathSplit[2], res.Media.siteUrl);
                    document.getElementById("profileRows").insertAdjacentHTML('beforeend', embeddedHtml.replace("${anilistLink}", res.Media.siteUrl))
                });
        }
    }
})();