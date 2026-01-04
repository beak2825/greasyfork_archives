// ==UserScript==
// @name     Bookwalker EN External Links
// @include  https://global.bookwalker.jp/*
// @icon     https://www.google.com/s2/favicons?domain=global.bookwalker.jp
// @grant    none
// @author   kpossibles
// @version  1.0.4
// @description    Adds external link section to Bookwalker manga pages, with Anime-Planet, MyAnimeList, MangaUpdates, and MangaDex. MU is a custom Google search since their site doesn't allow direct search.
// @namespace https://greasyfork.org/users/787696
// @downloadURL https://update.greasyfork.org/scripts/478115/Bookwalker%20EN%20External%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/478115/Bookwalker%20EN%20External%20Links.meta.js
// ==/UserScript==

var appendButtons = function() {
    var btnCont = document.createElement('div');
    btnCont.className = "m-tile-btn-box";

    // Pick class location where buttons show up
    document.querySelector("div.detail-book-title").appendChild(btnCont);
    // Search query = title (class name search query)
    var title = findNative();

    var searchAP = document.createElement('a')
    searchAP.className = "m-tile-btn";
    searchAP.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchAP.innerHTML = `<img src="https://www.anime-planet.com/favicon.ico" style="float:left;height:30px;margin-top:6px;margin:2px;">`;
    btnCont.appendChild(searchAP);
    searchAP.addEventListener("click", function() {open(encodeURI("https://www.anime-planet.com/manga/all?name=" + title), "")});

    var searchAnilist = document.createElement('a')
    searchAnilist.className = "m-tile-btn";
    searchAnilist.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchAnilist.innerHTML = `<img src="https://anilist.co/favicon.ico" style="float:left;height:30px;margin-top:6px;margin:2px;">`;
    btnCont.appendChild(searchAnilist);
    searchAnilist.addEventListener("click", function() {open(encodeURI("https://anilist.co/search/manga?search=" + title), "")});
 
    var searchMAL = document.createElement('a')
    searchMAL.className = "m-tile-btn";
    searchMAL.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchMAL.innerHTML = `<img src="https://myanimelist.net/favicon.ico" style="float:left;height:30px;margin-top:6px;margin:2px;">`;
    btnCont.appendChild(searchMAL);
    searchMAL.addEventListener("click", function() {open(encodeURI("https://myanimelist.net/manga.php?q=" + title+ "&cat=manga"), "")});

    var searchMU = document.createElement('a')
    searchMU.className = "m-tile-btn";
    searchMU.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchMU.innerHTML = `<img src="https://www.mangaupdates.com/images/manga-updates.svg" style="float:left;height:30px;margin-top:6px;margin:2px;">`;
    btnCont.appendChild(searchMU);
    searchMU.addEventListener("click", function() {
        open(encodeURI("https://www.mangaupdates.com/site/search/result?search=" + title), "")
    });

    var searchMD = document.createElement('a')
    searchMD.className = "m-tile-btn";
    searchMD.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchMD.innerHTML = `<img src="https://mangadex.org/favicon.ico" style="float:left;height:30px;margin-top:6px;margin:2px;">`;
    btnCont.appendChild(searchMD);
    searchMD.addEventListener("click", function() {open(encodeURI("https://mangadex.org/titles?q=" + title), "")});

    var coverImg = document.createElement('a')
    // use button class style from website
    coverImg.className = "a-see-more-btn";
    var imgSrc = "";
    imgSrc = findCover();
    coverImg.style = "height: 50px;overflow-wrap: normal;overflow: auto;white-space: pre-wrap;cursor: pointer;background-color:#193767;'";
    coverImg.innerHTML = `<p style="font-size: 14px;white-space: break-spaces;line-height: 15px;vertical-align: middle;display: inline-block;">Open Cover Image</p>`;
    document.querySelector("div.detail-book-img-inner").appendChild(coverImg);
    coverImg.addEventListener("click", function() {open(imgSrc, "")});

}

var findCover = function() {
    var b="https://c.bookwalker.jp/coverImage_" + 
    (parseInt($('meta[property="og:image"]').attr('content').split("/")[3].split("").reverse().join(""))-1) + 
    ".jpg";
    return b;
}

var findNative = function() {
    // find dataset = native, get value
    var elements = document.getElementsByClassName('product-detail'); // get the elements

    var nativeTitle = "";
    for (var i = 0; i < elements.length; i++) {
        nativeTitle = elements[i].querySelector('[itemprop=name]').innerText;
        if(!!nativeTitle){
            if(nativeTitle.includes(" (Manga)")){
                return nativeTitle.replace(" (Manga)",'');
            }
            return nativeTitle.trim();
        }
        else {
            //Use main title if empty
            return document.querySelector("div.detail-book-title h1").innerText;
        }
    }
    console.log("Native title not found.");
    return document.querySelector("div.detail-book-title h1").innerText;
}

var checkElems = function() {
    if (document.querySelector('div.product-detail-area')) {
        setTimeout(appendButtons, 1000);
    } else {
        setTimeout(checkElems, 100);
    };
};

checkElems();