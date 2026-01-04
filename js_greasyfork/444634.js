// ==UserScript==
// @name         Pocket Comics AP Features
// @namespace    https://greasyfork.org/en/users/787696-kpossibles
// @version      1.0.3
// @description  Adds search on AP and grabbing vertical cover for Pocket Comics series (via Search). Based on Quin15 scripts.
// @author       kpossibles
// @match        https://www.pocketcomics.com/comic/*
// @match        https://www.pocketcomics.com/search/*
// @icon         https://www.google.com/s2/favicons?domain=pocketcomics.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444634/Pocket%20Comics%20AP%20Features.user.js
// @updateURL https://update.greasyfork.org/scripts/444634/Pocket%20Comics%20AP%20Features.meta.js
// ==/UserScript==

var appendButtons = function() {
    var btnCont = document.createElement('div');
    // use button container class from website
    btnCont.className = "add_product";
    btnCont.style = "margin-top:10px";
    // where you want the buttons to appear
    if (location.href.match(/search/)) {
        document.querySelector('.list_comic').appendChild(btnCont);
    } else {
        document.querySelector('.info_product').appendChild(btnCont);
    }
    
    var searchAP = document.createElement('a')
    // use button class style from website
    searchAP.className = "btn_info";
    searchAP.style = "height: 50px;overflow-wrap: normal;overflow: auto;white-space: pre-wrap;cursor: pointer;background-color:#FC5342;";
    searchAP.innerHTML = `<img src="https://www.anime-planet.com/favicon.ico" style="float:left;height:30px;margin:10px 10px 0px 0px;"><p style="font-size: 14px;white-space: break-spaces;vertical-align: middle;display: inline-block;">Search On AP</p>`;
    btnCont.appendChild(searchAP);
    var ENtitle = "";
    if (location.href.match(/search/)) {
        ENtitle = document.querySelector('strong.tit_comic').innerText;
    } else {
        ENtitle = document.querySelector('strong.tit_product').innerText;
    }
    searchAP.addEventListener("click", function() {open(encodeURI("https://www.anime-planet.com/manga/all?name=" + ENtitle), "")});

    var coverImg = document.createElement('a')
    // use button class style from website
    coverImg.className = "btn_info";
    var imgSrc = "";
    if (location.href.match(/search/)) {
        imgSrc = document.querySelectorAll(".img_thumb")[0].src;
    } else {
        imgSrc = document.querySelector('div.thumb_comic.thumb_keyvisual img').src;
    }
    coverImg.style = "height: 50px;overflow-wrap: normal;overflow: auto;white-space: pre-wrap;cursor: pointer;background-color:#193767;'";
    coverImg.innerHTML = `<img src="` + imgSrc + `" style="float:left;height:30px;margin:10px 10px 0px 0px;"><p style="font-size: 14px;white-space: break-spaces;line-height: 15px;vertical-align: middle;display: inline-block;">Open Cover Image</p>`;
    btnCont.appendChild(coverImg);
    coverImg.addEventListener("click", function() {open(imgSrc, "")});

    var searchMU = document.createElement('a')
    searchMU.className = "link_first";
    searchMU.style = "height: 50px;overflow-wrap: normal;overflow: auto;white-space: pre-wrap;cursor: pointer; border:1px solid gray;";
    searchMU.innerHTML = `<img src="https://www.mangaupdates.com/images/manga-updates.svg" style="float:left;height:30px;margin:10px 10px 0px 0px;"><p style="font-size: 14px;white-space: break-spaces;vertical-align: middle;display: inline-block;">Search On MU</p>`;
    btnCont.appendChild(searchMU);
    searchMU.addEventListener("click", function() {
        open(encodeURI("https://www.mangaupdates.com/site/search/result?search=" + ENtitle), "")
    });
}

var checkElems = function() {
    if (document.querySelector('.txt_info')) {
        setTimeout(appendButtons, 1000);
    } else if (document.querySelector('div.thumb_comic.thumb_keyvisual')) {
        setTimeout(appendButtons, 1000);
    } else {
        setTimeout(checkElems, 100);
    };
};

checkElems();