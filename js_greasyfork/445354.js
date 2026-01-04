// ==UserScript==
// @name        Search for anime titles on Nyaa.si from Anilist.co
// @description Adds a button under the title of anime/manga on Anilist.co, this button sends you to search results on the torrent site Nyaa.si
// @version 0.01
// @license MIT
// @match       *://anilist.co/anime/*
// @match       *://anilist.co/manga/*
// @grant       GM_addStyle
// @namespace https://greasyfork.org/users/916662
// @downloadURL https://update.greasyfork.org/scripts/445354/Search%20for%20anime%20titles%20on%20Nyaasi%20from%20Anilistco.user.js
// @updateURL https://update.greasyfork.org/scripts/445354/Search%20for%20anime%20titles%20on%20Nyaasi%20from%20Anilistco.meta.js
// ==/UserScript==

var header;
function waitForElement(){
    if(typeof header != "undefined"){
        var title = header.innerText;
        let button = document.createElement("a");
        button.setAttribute("href", `https://nyaa.si/?f=0&c=0_0&q=${title}&s=seeders&o=desc`);
        button.setAttribute("class", "search_button");
        button.textContent = "Nyaa Search";
        document.getElementsByClassName('actions')[0].appendChild(button);

    } else {
        header = document.getElementsByTagName("h1")[0];
        setTimeout(waitForElement, 250);
    }
}
waitForElement();

GM_addStyle ( `
    .search_button {
        align-items: center;
        background: #1f1f1f;
        border-radius: 3px;
        color: #fff !important;
        display: flex;
        font-size: 1.4rem;
        height: 35px;
        justify-content: center;
        line-height: 1.3rem;
    }
    .search_button:hover {
        background: #3d3d3d;
    }
` )
