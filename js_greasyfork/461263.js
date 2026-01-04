// ==UserScript==
// @name     Manga CLUB External Links
// @include  https://www.manga.club/book/title/*
// @icon     https://www.google.com/s2/favicons?domain=manga.club
// @grant    none
// @author   kpossibles
// @description    Adds external link search to Manga CLUB. Based on quin15 scripts.
// @version 1.0.4
// @namespace https://greasyfork.org/users/787696
// @downloadURL https://update.greasyfork.org/scripts/461263/Manga%20CLUB%20External%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/461263/Manga%20CLUB%20External%20Links.meta.js
// ==/UserScript==
 
var appendButtons = function() {
    var btnCont = document.createElement('div');
    btnCont.className = ".btn";
    // Pick class location where buttons show up
    document.querySelector('.d-none').appendChild(btnCont);
    // Search query = title (class name search query)
    var title = document.querySelector('h1.translated').innerText;
 
    var searchAP = document.createElement('a')
    searchAP.className = "btn-outliine-dark";
    searchAP.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchAP.innerHTML = `<img src="https://www.anime-planet.com/favicon.ico" style="float:left;height:30px;margin-top:6px">`;
    btnCont.appendChild(searchAP);
    searchAP.addEventListener("click", function() {open(encodeURI("https://www.anime-planet.com/manga/all?name=" + title), "")});
    
    var searchMU = document.createElement('a')
    searchMU.className = "btn-outliine-dark";
    searchMU.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchMU.innerHTML = `<img src="https://www.mangaupdates.com/images/manga-updates.svg" style="float:left;height:30px;margin-top:6px">`;
    btnCont.appendChild(searchMU);
    searchMU.addEventListener("click", function() {
        open(encodeURI("https://www.mangaupdates.com/site/search/result?search=" + title), "")
    });

    var searchHarlequin = document.createElement('a')
    searchHarlequin.className = "btn-outliine-dark";
    searchHarlequin.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchHarlequin.innerHTML = `<img src="https://www.harlequin-library.jp/favicon.ico" style="float:left;height:30px;margin-top:6px">`;
    btnCont.appendChild(searchHarlequin);
    searchHarlequin.addEventListener("click", function() {
        open(encodeURI("https://www.harlequin-library.jp/book/search?keyword=&title=" + title + "&writer=&label=&category=&style=&query=detail"), "")
    });

    var searchMAL = document.createElement('a')
    searchMAL.className = "btn-outliine-dark";
    searchMAL.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchMAL.innerHTML = `<img src="https://myanimelist.net/favicon.ico" style="float:left;height:30px;margin-top:6px">`;
    btnCont.appendChild(searchMAL);
    searchMAL.addEventListener("click", function() {open(encodeURI("https://myanimelist.net/manga.php?q=" + title), "&cat=manga")});

    var searchAnilist = document.createElement('a')
    searchAnilist.className = "btn-outliine-dark";
    searchAnilist.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchAnilist.innerHTML = `<img src="https://anilist.co/favicon.ico" style="float:left;height:30px;margin-top:6px">`;
    btnCont.appendChild(searchAnilist);
    searchAnilist.addEventListener("click", function() {open(encodeURI("https://anilist.co/search/manga?search=" + title), "")});
 
    var searchAnisearch = document.createElement('a')
    searchAnisearch.className = "btn-outliine-dark";
    searchAnisearch.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchAnisearch.innerHTML = `<img src="https://www.anisearch.com/favicon.ico" style="float:left;height:30px;margin-top:6px">`;
    btnCont.appendChild(searchAnisearch);
    searchAnisearch.addEventListener("click", function() {open(encodeURI("https://www.anisearch.com/manga/index?text=" + title), "")});

}
 
appendButtons();