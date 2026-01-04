// ==UserScript==
// @name     Harlequin External Links
// @include  https://www.harlequin-library.jp/book/comic/id/*
// @icon     https://www.harlequin-library.jp/favicon.ico
// @grant    none
// @author   kpossibles
// @description    Adds external link search to Harlequin JP. Based on quin15 scripts.
// @version 1.0.1
// @namespace https://greasyfork.org/users/787696
// @downloadURL https://update.greasyfork.org/scripts/461339/Harlequin%20External%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/461339/Harlequin%20External%20Links.meta.js
// ==/UserScript==
 
var appendButtons = function() {
    var btnCont = document.createElement('div');
    btnCont.className = "btns_area";
    // Pick class location where buttons show up
    document.querySelector('.author').appendChild(btnCont);
    // Search query = title (class name search query)
    var title = document.querySelector('[itemprop=name]').innerText;
 
    var searchAP = document.createElement('a')
    searchAP.className = "ajaxToggleMyPage";
    searchAP.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchAP.innerHTML = `<img src="https://www.anime-planet.com/favicon.ico" style="float:left;height:30px;margin-top:6px">`;
    btnCont.appendChild(searchAP);
    searchAP.addEventListener("click", function() {open(encodeURI("https://www.anime-planet.com/manga/all?name=" + title), "")});
 
    var searchAnilist = document.createElement('a')
    searchAnilist.className = "ajaxToggleMyPage";
    searchAnilist.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchAnilist.innerHTML = `<img src="https://anilist.co/favicon.ico" style="float:left;height:30px;margin-top:6px">`;
    btnCont.appendChild(searchAnilist);
    searchAnilist.addEventListener("click", function() {open(encodeURI("https://anilist.co/search/manga?search=" + title), "")});
 
    var searchMAL = document.createElement('a')
    searchMAL.className = "ajaxToggleMyPage";
    searchMAL.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchMAL.innerHTML = `<img src="https://myanimelist.net/favicon.ico" style="float:left;height:30px;margin-top:6px">`;
    btnCont.appendChild(searchMAL);
    searchMAL.addEventListener("click", function() {open(encodeURI("https://myanimelist.net/manga.php?q=" + title), "&cat=manga")});
 
    var searchAnisearch = document.createElement('a')
    searchAnisearch.className = "ajaxToggleMyPage";
    searchAnisearch.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchAnisearch.innerHTML = `<img src="https://www.anisearch.com/favicon.ico" style="float:left;height:30px;margin-top:6px">`;
    btnCont.appendChild(searchAnisearch);
    searchAnisearch.addEventListener("click", function() {open(encodeURI("https://www.anisearch.com/manga/index?text=" + title), "")});
 
    var searchMU = document.createElement('a')
    searchMU.className = "ajaxToggleMyPage";
    searchMU.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchMU.innerHTML = `<img src="https://www.mangaupdates.com/favicon.ico" style="float:left;height:30px;margin-top:6px">`;
    btnCont.appendChild(searchMU);
    searchMU.addEventListener("click", function() {
        open(encodeURI("https://www.mangaupdates.com/site/search/result?search=" + title), "")
    });
 
    var searchAmazon = document.createElement('a')
    searchAmazon.className = "ajaxToggleMyPage";
    searchAmazon.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchAmazon.innerHTML = `<img src="https://www.amazon.com/favicon.ico" style="float:left;height:30px;margin-top:6px">`;
    btnCont.appendChild(searchAmazon);
    searchAmazon.addEventListener("click", function() {
        open(encodeURI("https://www.amazon.co.jp/s?k=" + title), "")
    });
}
 
appendButtons();