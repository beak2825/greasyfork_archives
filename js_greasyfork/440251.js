// ==UserScript==
// @name         Blu-Ray.com search shortcut
// @namespace    yay
// @version      1
// @description  Add a "[Blu-ray.com search]" button to find the movie page easily on there
// @author       Sapphire
// @match        https://passthepopcorn.me/torrents.php?id=*
// @icon         https://www.google.com/s2/favicons?domain=passthepopcorn.me
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/440251/Blu-Raycom%20search%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/440251/Blu-Raycom%20search%20shortcut.meta.js
// ==/UserScript==

/* global $ */
'use strict'

function getIMDbID() {
    var id
    if (document.getElementById("imdb-title-link")) {
        id = $("#imdb-title-link").attr("href").split("/title/")[1].replace("/", "")
    } else {
        id = "noid"
    }
    return id
}

function fetchSearchResults(imdbid) {
    GM.xmlHttpRequest({
        method: "GET",
        url: `https://www.blu-ray.com/search/?quicksearch=1&quicksearch_country=all&quicksearch_keyword=${imdbid}&section=theatrical`,
        responseType: "json",
        onload: function (response) {
            let doc = new DOMParser().parseFromString(response.responseText, 'text/html')
            let el = doc.querySelector("a[data-productid]")
            if (el && el.hasAttribute("href")) {
                window.open(el.getAttribute("href") + "#Releases", '_blank')
            } else {
                alert("No search results for this IMDb ID.")
            }
        }
    })
    return false
}

(function() {
    $("#content > div > div.linkbox").append('<a href="#" id="bluraycom_linkbox" class="brackets">[Blu-ray.com search]</a>')
    $("#bluraycom_linkbox").on("click", function() {
        let movieId = getIMDbID()
        if (movieId === "noid") {
            alert("No search results for this IMDb ID.")
            return false
        } else {
            fetchSearchResults(movieId)
            return false
        }
    })
})();