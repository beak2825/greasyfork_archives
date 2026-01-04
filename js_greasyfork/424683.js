// ==UserScript==
// @name         Bilibili Show Chapter Date
// @namespace    https://greasyfork.org/en/users/689482-quin15
// @version      2.1.4
// @description  Fetches and displays the chapter dates for Bilibili manhua
// @author       Quin15
// @match        https://manga.bilibili.com/detail*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/424683/Bilibili%20Show%20Chapter%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/424683/Bilibili%20Show%20Chapter%20Date.meta.js
// ==/UserScript==

GM_xmlhttpRequest ({
    method:     'POST',
    url:        "https://manga.bilibili.com/twirp/comic.v1.Comic/ComicDetail?device=pc&platform=web",
    headers:    {"accept": "application/json, text/plain, */*", "accept-language": "en-GB,en-US;q=0.9,en;q=0.8", "content-type": "application/json;charset=UTF-8"},
    data:       "{\"comic_id\":" + document.location.href.split('/').reverse()[0].split('?')[0].replace('mc', '') + "}",
    onload:     function (responseDetails) {
        var data = JSON.parse(responseDetails.responseText)
        var checkElems = function() {if (document.querySelector(".list-item.app-button")) {injectDates(data)} else if (data.data.ep_list.length == 0) {addButtons()} else {setTimeout(checkElems, 100);}};
        checkElems();
    }
});

var injectDates = function(data) {
    console.log(data)
    var elemDates = data.data.ep_list.reverse();
    var episodes = document.querySelectorAll('.list-data button');
    for (var i = 0; i < episodes.length; i++) {
        var dateElem = document.createElement('div');
        dateElem.style = "width: 100%; color: #888; font-size: 12px";
        dateElem.innerText = elemDates[i].pub_time.slice(0,10);
        episodes[i].style.height = "";
        episodes[i].style.flexFlow = "wrap";
        episodes[i].appendChild(dateElem);
    };
    addButtons();
};

var addButtons = function() {
    var searchAP = document.createElement('button');
    searchAP.className = 'manga-button continue-read-btn v-middle primary';
    searchAP.style = "margin-left:16px;padding:0px 10px 0px 10px";
    searchAP.setAttribute("data-v-b8e7c12a", "");
    searchAP.setAttribute("data-v-5575b1e0", "");
    searchAP.innerHTML = `<img src="https://www.anime-planet.com/favicon.ico" style="float: left;height: 30px;top: -5px;"><p style="margin-top:6px;">Search on AP</p>`;
    document.querySelector('div[class^="action-buttons"]').appendChild(searchAP);
    searchAP.addEventListener("click", function() {open(encodeURI("https://www.anime-planet.com/manga/all?name=" + document.querySelector('h1[class^="manga-title t"]').innerText), "")});

    var coverImg = document.createElement('button');
    coverImg.className = 'manga-button continue-read-btn v-middle primary';
    coverImg.style = "padding:0px 10px 0px 10px";
    coverImg.setAttribute("data-v-b8e7c12a", "");
    coverImg.setAttribute("data-v-5575b1e0", "");
    coverImg.innerHTML = `<img src="` + document.querySelector('div[role="img"] img').src.split('@')[0] + `@30w.jpg" style="float: left;height: 30px;top: -5px;"><p style="margin-top:6px;">Open Cover Image</p>`;
    document.querySelector('div[class^="action-buttons"]').appendChild(coverImg);
    coverImg.addEventListener("click", function() {open(document.querySelector('div[role="img"] img').src.split('@')[0], "")});
}