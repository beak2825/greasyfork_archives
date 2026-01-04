// ==UserScript==
// @name     Anilist External Links
// @include  http://anilist.co/manga/*
// @include  https://anilist.co/manga/*
// @icon     https://www.google.com/s2/favicons?domain=anilist.co
// @grant    none
// @author   kpossibles
// @version  1.0.3
// @description    Adds external link section to Anilist manga pages, with Anime-Planet, MyAnimeList, MangaUpdates, MangaDex, and AniSearch.
// @namespace https://greasyfork.org/users/787696
// @downloadURL https://update.greasyfork.org/scripts/442599/Anilist%20External%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/442599/Anilist%20External%20Links.meta.js
// ==/UserScript==

var appendButtons = function() {
    var btnCont = document.createElement('div');
    btnCont.className = "comicInfo__btns";

    // Pick class location where buttons show up
    document.querySelector("div.content h1").appendChild(btnCont);
    // Search query = title (class name search query)
    var title = findNative();

    var searchAP = document.createElement('a')
    searchAP.className = "comicInfo__btnView";
    searchAP.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchAP.innerHTML = `<img src="https://www.anime-planet.com/favicon.ico" style="float:left;height:30px;margin-top:6px;margin:2px;">`;
    btnCont.appendChild(searchAP);
    searchAP.addEventListener("click", function() {open(encodeURI("https://www.anime-planet.com/manga/all?name=" + title), "")});

    var searchMAL = document.createElement('a')
    searchMAL.className = "comicInfo__btnView";
    searchMAL.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchMAL.innerHTML = `<img src="https://myanimelist.net/favicon.ico" style="float:left;height:30px;margin-top:6px;margin:2px;">`;
    btnCont.appendChild(searchMAL);
    searchMAL.addEventListener("click", function() {open(encodeURI("https://myanimelist.net/manga.php?q=" + title+ "&cat=manga"), "")});

    var searchMU = document.createElement('a')
    searchMU.className = "comicInfo__btnView";
    searchMU.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchMU.innerHTML = `<img src="https://www.mangaupdates.com/images/manga-updates.svg" style="float:left;height:30px;margin-top:6px;margin:2px;">`;
    btnCont.appendChild(searchMU);
    searchMU.addEventListener("click", function() {
        open(encodeURI("https://www.mangaupdates.com/site/search/result?search=" + title), "")
    });

    var searchMD = document.createElement('a')
    searchMD.className = "comicInfo__btnView";
    searchMD.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchMD.innerHTML = `<img src="https://mangadex.org/favicon.ico" style="float:left;height:30px;margin-top:6px;margin:2px;">`;
    btnCont.appendChild(searchMD);
    searchMD.addEventListener("click", function() {open(encodeURI("https://mangadex.org/titles?q=" + title), "")});


    var searchAnisearch = document.createElement('a')
    searchAnisearch.className = "comicInfo__btnView";
    searchAnisearch.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchAnisearch.innerHTML = `<img src="https://www.anisearch.com/favicon.ico" style="float:left;height:30px;margin-top:6px;margin:2px;">`;
    btnCont.appendChild(searchAnisearch);
    searchAnisearch.addEventListener("click", function() {open(encodeURI("https://www.anisearch.com/manga/index?text=" + title), "")});

}

var findNative = function() {
    // find dataset = native, get value
    var elements = document.getElementsByClassName('data-set'); // get the elements
    var nativeTitle = "";
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].getElementsByClassName('type')[0].innerText == 'Native') {
            nativeTitle = elements[i].getElementsByClassName('value')[0].innerText;
            if(!!nativeTitle){
                return nativeTitle;
            }
            else {
                //Use main title if empty
                return document.querySelector("div.content h1").innerText;
            }
        }
    }
    console.log("Native title not found.");
    return document.querySelector("div.content h1").innerText;
}

var checkElems = function() {
    if (document.querySelector('div.content')) {
        setTimeout(appendButtons, 1000);
    } else {
        setTimeout(checkElems, 100);
    };
};

checkElems();