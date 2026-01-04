// ==UserScript==
// @name         BS.TO Favs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fav's for BS.to
// @author       You
// @match        https://bs.to/*
// @icon         https://www.google.com/s2/favicons?domain=bs.to
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433745/BSTO%20Favs.user.js
// @updateURL https://update.greasyfork.org/scripts/433745/BSTO%20Favs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const starFill =
          `
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="24" height="24" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>
          `
    const starEmpty =
          `
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="24" height="24" fill-rule="evenodd" clip-rule="evenodd"><path d="M15.668 8.626l8.332 1.159-6.065 5.874 1.48 8.341-7.416-3.997-7.416 3.997 1.481-8.341-6.064-5.874 8.331-1.159 3.668-7.626 3.669 7.626zm-6.67.925l-6.818.948 4.963 4.807-1.212 6.825 6.068-3.271 6.069 3.271-1.212-6.826 4.964-4.806-6.819-.948-3.002-6.241-3.001 6.241z"/></svg>
          `

    var thisSerie = null
    var isFav = false
    const starA = document.createElement("a");
    starA.style.color = "#f4df37"
    starA.style.cursor = "pointer"

    if (location.pathname.split("/").length > 2) {
        thisSerie = location.pathname.split("/")[2]

        starA.onclick = triggerFav
        document.getElementById("sp_left").children[0].prepend(starA)

        emptyStar()
    }

    var favs = localStorage.favs

    if (!favs) {
        favs = []
    } else {
        favs = favs.split(",")
        renderFavList()
    }


    function triggerFav() {
        if (isFav) {
            favs.splice(favs.indexOf(thisSerie),1)
            isFav = false
            emptyStar()
        } else {
            favs.push(thisSerie)
            fillStar()
        }
        localStorage.favs = favs
        renderFavList()
    }

    function fillStar() {
        starA.innerHTML = starFill
    }

    function emptyStar() {
        starA.innerHTML = starEmpty
    }

    function renderFavList() {
        if (document.getElementById("favListUl")) document.getElementById("favListUl").remove()
        const menuPunkt = document.getElementById("menu").children[1];
        const favListUl = document.createElement("ul");
        favListUl.id = "favListUl"
        menuPunkt.appendChild(favListUl)

        for (var i=favs.length-1;i>=0;i--) {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.innerText = favs[i]
            a.href = "/serie/"+favs[i]
            li.appendChild(a)
            favListUl.appendChild(li)

            if (thisSerie = favs[i]) {
                isFav = true
                fillStar()
            }
        }
    }

})();