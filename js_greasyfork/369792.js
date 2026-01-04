// ==UserScript==
// @name MALtoANI
// @namespace Morimasa
// @author Morimasa
// @description Adds AniList link to myanimelist anime and manga pages
// @match https://myanimelist.net/manga/*
// @match https://myanimelist.net/anime/*
// @grant GM_xmlhttpRequest
// @version 1
// @downloadURL https://update.greasyfork.org/scripts/369792/MALtoANI.user.js
// @updateURL https://update.greasyfork.org/scripts/369792/MALtoANI.meta.js
// ==/UserScript==
GM_xmlhttpRequest({
    method: "POST",
    url: "https://graphql.anilist.co",
    data: JSON.stringify({
          query: `query($id:Int,$type:MediaType){
            Media(idMal:$id,type:$type){
                siteUrl
            }
          }`,
          variables: {
            "id": window.location.pathname.split("/")[2],
            "type": window.location.pathname.split("/")[1].toUpperCase()
          }
      }),
    headers: {
        "Content-Type": "application/json"
    },
    onload: function(response) {
        var anilistURL=JSON.parse(response.responseText)["data"]["Media"]["siteUrl"]
        document.getElementById("horiznav_nav").getElementsByTagName("ul")[0].innerHTML+=`<li><a rel="noopener noreferrer" href="${anilistURL}"><img src="https://anilist.co/img/icons/favicon-32x32.png" height=13>AniList</a></li>`
    }
});