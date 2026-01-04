// ==UserScript==
// @name     Renta External Links
// @match  https://www.ebookrenta.com/renta/sc/frm/item/*
// @icon     https://www.google.com/s2/favicons?domain=ebookrenta.com
// @grant    none
// @author   kpossibles
// @description    Adds external link search to Renta! Based on quin15 scripts.
// @version 1.0.7
// @namespace https://greasyfork.org/users/787696
// @downloadURL https://update.greasyfork.org/scripts/461920/Renta%20External%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/461920/Renta%20External%20Links.meta.js
// ==/UserScript==

var appendButtons = function() {
    var btnCont = document.createElement('div');
    btnCont.className = ".snsShare";
    var title = "";
    // Pick class location where buttons show up
    if(document.querySelector('.fvTitile-desc-titleWrap')!=null){
      document.querySelector('.fvTitile-desc-titleWrap').appendChild(btnCont);
      // Search query = title (class name search query)
      title = document.querySelector('h1.fvTitile-desc-title').innerText;
    }
    else if(document.querySelector('.fvSeries-desc-titleWrap')==null){
      console.log("ERROR: Title query does not exist.");
    }
    else{
      document.querySelector('.fvSeries-desc-titleWrap').appendChild(btnCont);
      // Search query = title (class name search query)
      title = document.querySelector('h1.fvSeries-desc-title').innerText;
    }
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
        open(encodeURI("https://www.mangaupdates.com/site/search/result?search=" + title), "")
    });

    var searchHarlequin = document.createElement('a')
    searchHarlequin.className = "dropdown_link";
    searchHarlequin.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchHarlequin.innerHTML = `<img src="https://www.harlequin-library.jp/favicon.ico" style="float:left;height:30px;margin-top:6px">`;
    btnCont.appendChild(searchHarlequin);
    searchHarlequin.addEventListener("click", function() {
        open(encodeURI("https://www.harlequin-library.jp/book/search?keyword=&title=" + title + "&writer=&label=&category=&style=&query=detail"), "")
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

    var searchAnisearch = document.createElement('a')
    searchAnisearch.className = "dropdown_link";
    searchAnisearch.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchAnisearch.innerHTML = `<img src="https://www.anisearch.com/favicon.ico" style="float:left;height:30px;margin-top:6px">`;
    btnCont.appendChild(searchAnisearch);
    searchAnisearch.addEventListener("click", function() {open(encodeURI("https://www.anisearch.com/manga/index?text=" + title), "")});

}

appendButtons();