// ==UserScript==
// @name         Lezhin AP Features
// @namespace    https://greasyfork.org/en/users/689482-quin15
// @version      1.2.0
// @description  Adds search on AP and grabbing vertical cover for Lezhin manhwa
// @author       Quin15
// @match        https://www.lezhin.com/ko/comic/*
// @match        https://www.lezhin.com/en/comic/*
// @match        https://www.lezhinus.com/en/comic/*
// @icon         https://www.google.com/s2/favicons?domain=lezhin.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425499/Lezhin%20AP%20Features.user.js
// @updateURL https://update.greasyfork.org/scripts/425499/Lezhin%20AP%20Features.meta.js
// ==/UserScript==

var appendButtons = function() {
    var btnCont = document.createElement('div');
    btnCont.className = "comicInfo__btns";
    document.querySelector('.comicInfo__detail').appendChild(btnCont);

    var searchAP = document.createElement('a')
    searchAP.className = "comicInfo__btnView";
    searchAP.style = "margin-left: 0px;flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    searchAP.innerHTML = `<img src="https://www.anime-planet.com/favicon.ico" style="float:left;height:30px;margin-top:6px"><p style="font-size: 14px;white-space: break-spaces;line-height: 15px;vertical-align: middle;display: inline-block;width: calc(100% - 30px);">Search On AP</p>`;
    btnCont.appendChild(searchAP);
    searchAP.addEventListener("click", function() {open(encodeURI("https://www.anime-planet.com/manga/all?name=" + document.querySelector('h2.comicInfo__title').innerText), "")});

    var coverImg = document.createElement('a')
    coverImg.className = "comicInfo__btnView";
    coverImg.style = "flex: 0 0 auto;width: 48.7%;padding: 0px 8px;cursor: pointer;line-height: 42px;";
    coverImg.innerHTML = `<img src="` + document.querySelector('picture img').srcset.replace(" 2x", '') + `" style="float:left;height:30px;margin-top:6px"><p style="font-size: 14px;white-space: break-spaces;line-height: 15px;vertical-align: middle;display: inline-block;width: calc(100% - 30px);">Open Cover Image</p>`;
    btnCont.appendChild(coverImg);
    coverImg.addEventListener("click", function() {open(document.querySelector('picture img').srcset.replace(" 2x", '').replace(/\&width\=.*/, ""), "")});
}

var checkElems = function() {
    if (document.querySelector('.episode__img')) {
        setTimeout(appendButtons, 1000);
    } else {
        setTimeout(checkElems, 100);
    };
};

checkElems();