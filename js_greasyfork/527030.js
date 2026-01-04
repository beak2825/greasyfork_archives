// ==UserScript==
// @name     ANN External Links
// @match  https://www.animenewsnetwork.com/encyclopedia/*
// @icon     https://www.google.com/s2/favicons?domain=animenewsnetwork.com
// @grant    none
// @author   kpossibles
// @description    Adds external link search to Anime News Network. Based on quin15 scripts.
// @version 1.0.1
// @namespace https://greasyfork.org/users/787696
// @downloadURL https://update.greasyfork.org/scripts/527030/ANN%20External%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/527030/ANN%20External%20Links.meta.js
// ==/UserScript==

var appendButtons = function() {
    var btnCont = document.createElement('div');
    btnCont.className = ".snsShare";
    // Pick class location where buttons show up
    document.querySelector('#page-title').appendChild(btnCont);
    // Search query = title (class name search query)
    var title = document.querySelector('h1#page_header').innerText;
    title = title.replace(/ *\([^)]*\) */g,"");

    var searchAP = document.createElement('a')
    searchAP.className = "dropdown_link";
    searchAP.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchAP.innerHTML = `<img src="https://www.anime-planet.com/favicon.ico" style="float:left;height:30px;margin-top:6px">`;
    btnCont.appendChild(searchAP);
    searchAP.addEventListener("click", function() {open(encodeURI("https://www.anime-planet.com/manga/all?name=" + title), "")});

    var searchMU = document.createElement('a')
    searchMU.className = "dropdown_link";
    searchMU.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchMU.innerHTML = `<img src="https://www.mangaupdates.com/images/manga-updates.svg" style="float:left;height:30px;margin-top:6px">`;
    btnCont.appendChild(searchMU);
    searchMU.addEventListener("click", function() {
        open(encodeURI("https://www.mangaupdates.com/search.html?search=" + title), "")
    });

    var searchMAL = document.createElement('a')
    searchMAL.className = "dropdown_link";
    searchMAL.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchMAL.innerHTML = `<img src="https://myanimelist.net/favicon.ico" style="float:left;height:30px;margin-top:6px">`;
    btnCont.appendChild(searchMAL);
    searchMAL.addEventListener("click", function() {open(encodeURI("https://myanimelist.net/manga.php?q=" + title), "&cat=manga")});

    var searchAnilist = document.createElement('a')
    searchAnilist.className = "dropdown_link";
    searchAnilist.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchAnilist.innerHTML = `<img src="https://anilist.co/favicon.ico" style="float:left;height:30px;margin-top:6px">`;
    btnCont.appendChild(searchAnilist);
    searchAnilist.addEventListener("click", function() {open(encodeURI("https://anilist.co/search/manga?search=" + title), "")});

}

appendButtons();