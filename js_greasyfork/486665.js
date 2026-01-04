// ==UserScript==
// @name         Coolmic AP Features
// @namespace    https://greasyfork.org/en/users/787696-kpossibles
// @version      1.0.3
// @description  Adds search on AP and grabbing vertical cover for Coolmic. Based on Quin15 scripts.
// @author       kpossibles
// @match        https://coolmic.me/titles/*
// @icon         https://www.google.com/s2/favicons?domain=coolmic.me
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486665/Coolmic%20AP%20Features.user.js
// @updateURL https://update.greasyfork.org/scripts/486665/Coolmic%20AP%20Features.meta.js
// ==/UserScript==

var appendButtons = function() {
    var btnCont = document.createElement('div');
    // use button container class from website
    btnCont.className = "sns-container sns-button-box";
    btnCont.style = "margin:10px;";
    // where you want the buttons to appear
    document.querySelector('.thumbnail-header').appendChild(btnCont);
    
    var searchAP = document.createElement('a')
    // use button class style from website
    searchAP.className = "sns-button";
    searchAP.style = "overflow-wrap: normal;overflow: auto;white-space: pre-wrap;cursor: pointer;background-color:#FC5342;padding:10px;margin-right:10px;border-radius:5px;";
    searchAP.innerHTML = `<img src="https://www.anime-planet.com/favicon.ico" style="height:15px; vertical-align:middle; margin:0px 5px 0px 0px;">Search`;
    btnCont.appendChild(searchAP);
    var title = document.querySelector('.title-text').innerText;

    searchAP.addEventListener("click", function() {open(encodeURI("https://www.anime-planet.com/manga/all?name=" + title), "")});

    var coverImg = document.createElement('a')
    // use button class style from website
    coverImg.className = "sns-button";
    var imgSrc = document.querySelectorAll(".title-thumbnail-image")[0].src;

    coverImg.style = "height: 50px;overflow-wrap: normal;overflow: auto;white-space: pre-wrap;cursor: pointer;border: 1px solid #515170;padding:10px;margin-right:10px;border-radius:5px;";
    coverImg.innerHTML = `<img src="` + imgSrc + `" style="height:15px;vertical-align:middle; margin:0px 5px 0px 0px;">Open Cover Image`;
    btnCont.appendChild(coverImg);
    coverImg.addEventListener("click", function() {open(imgSrc, "")});

    var searchMU = document.createElement('a')
    searchMU.className = "titlepage-button";
    searchMU.style = "overflow-wrap: normal;overflow: auto;white-space: pre-wrap;cursor: pointer;padding:10px;border: 1px solid #515170;margin-right:10px;border-radius:5px;";
    searchMU.innerHTML = `<img src="https://www.mangaupdates.com/images/manga-updates.svg" style="height:15px;vertical-align:middle;">`;
    btnCont.appendChild(searchMU);
    searchMU.addEventListener("click", function() {
        open(encodeURI("https://www.mangaupdates.com/site/search/result?search=" + title), "")
    });

    var searchMAL = document.createElement('a')
    searchMAL.className = "titlepage-button";
    searchMAL.style = "overflow-wrap: normal;overflow: auto;white-space: pre-wrap;cursor: pointer;padding:10px;border: 1px solid #515170;margin-right:10px;border-radius:5px;";
    searchMAL.innerHTML = `<img src="https://myanimelist.net/favicon.ico" style="height:15px;vertical-align:middle;">`;
    btnCont.appendChild(searchMAL);
    searchMAL.addEventListener("click", function() {open(encodeURI("https://myanimelist.net/manga.php?q=" + title), "&cat=manga")});

    var searchAnilist = document.createElement('a')
    searchAnilist.className = "titlepage-button";
    searchAnilist.style = "overflow-wrap: normal;overflow: auto;white-space: pre-wrap;cursor: pointer;padding:10px;border: 1px solid #515170;margin-right:10px;border-radius:5px;";
    searchAnilist.innerHTML = `<img src="https://anilist.co/favicon.ico" style="height:15px;vertical-align:middle;">`;
    btnCont.appendChild(searchAnilist);
    searchAnilist.addEventListener("click", function() {open(encodeURI("https://anilist.co/search/manga?search=" + title), "")});
 
}

var checkElems = function() {
    if (document.querySelector('.title-thumbnail-image')) {
        setTimeout(appendButtons, 1000);
    } else {
        setTimeout(checkElems, 100);
    };
};

checkElems();