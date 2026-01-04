// ==UserScript==
// @name     Novelupdates External Links
// @include  http://www.novelupdates.com/series/*
// @include  https://www.novelupdates.com/series/*
// @icon     https://www.google.com/s2/favicons?domain=novelupdates.com
// @grant    none
// @author   kpossibles
// @description    Adds external link search to NovelUpdates. Based on quin15 scripts.
// @version 0.0.1.20220330081420
// @namespace https://greasyfork.org/users/787696
// @downloadURL https://update.greasyfork.org/scripts/442342/Novelupdates%20External%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/442342/Novelupdates%20External%20Links.meta.js
// ==/UserScript==

var appendButtons = function() {
    var btnCont = document.createElement('div');
    btnCont.className = "comicInfo__btns";
    // Pick class location where buttons show up
    document.querySelector('.serieseditimg').appendChild(btnCont);
    // Search query = title (class name search query)
    var title = document.querySelector('div.seriestitlenu').innerText;

    var searchAP = document.createElement('a')
    searchAP.className = "comicInfo__btnView";
    searchAP.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchAP.innerHTML = `<img src="https://www.anime-planet.com/favicon.ico" style="float:left;height:30px;margin-top:6px">`;
    btnCont.appendChild(searchAP);
    searchAP.addEventListener("click", function() {open(encodeURI("https://www.anime-planet.com/manga/all?name=" + title), "")});

    var searchAnilist = document.createElement('a')
    searchAnilist.className = "comicInfo__btnView";
    searchAnilist.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchAnilist.innerHTML = `<img src="https://anilist.co/favicon.ico" style="float:left;height:30px;margin-top:6px">`;
    btnCont.appendChild(searchAnilist);
    searchAnilist.addEventListener("click", function() {open(encodeURI("https://anilist.co/search/manga?search=" + title), "")});

    var searchMAL = document.createElement('a')
    searchMAL.className = "comicInfo__btnView";
    searchMAL.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchMAL.innerHTML = `<img src="https://myanimelist.net/favicon.ico" style="float:left;height:30px;margin-top:6px">`;
    btnCont.appendChild(searchMAL);
    searchMAL.addEventListener("click", function() {open(encodeURI("https://myanimelist.net/manga.php?q=" + title), "&cat=manga")});

    var searchAnisearch = document.createElement('a')
    searchAnisearch.className = "comicInfo__btnView";
    searchAnisearch.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchAnisearch.innerHTML = `<img src="https://www.anisearch.com/favicon.ico" style="float:left;height:30px;margin-top:6px">`;
    btnCont.appendChild(searchAnisearch);
    searchAnisearch.addEventListener("click", function() {open(encodeURI("https://www.anisearch.com/manga/index?text=" + title), "")});
}

appendButtons();