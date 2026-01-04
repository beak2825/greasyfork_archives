// ==UserScript==
// @name         Zhiyin Manke Show Chapter Date
// @namespace    https://greasyfork.org/en/users/689482-quin15
// @version      1.0.2
// @description  Fetches and displays the chapter dates for Weibo manhua
// @author       Quin15
// @match        https://www.zymk.cn/*
// @icon         https://www.google.com/s2/favicons?domain=zymk.cn
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow

// @downloadURL https://update.greasyfork.org/scripts/425252/Zhiyin%20Manke%20Show%20Chapter%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/425252/Zhiyin%20Manke%20Show%20Chapter%20Date.meta.js
// ==/UserScript==

GM_xmlhttpRequest ({
    method:     'GET',
    url:        "https://getcomicinfo-globalapi.zymk.cn/app_api/v5/getcomicinfo/?comic_id=" + location.pathname.slice(1, -1) + "&client-channel=store_tencent&loglevel=3&client-version=4.7.9&client-type=android",
    onload:     function (responseDetails) {
        var data = JSON.parse(responseDetails.responseText);
        if (data.data !== null) { injectDates(data.data) }
    }
});

var injectDates = function (data) {
    console.log(data);
    var DOMchaps = document.querySelectorAll('ul[class^="chapter-list clearfix"] li')
    for (var i = 0; i < data.chapter_list.length; i++) {
        var dateElem = document.createElement('div');
        dateElem.className = "chapterDate";
        dateElem.style = "width: 100%; color: #888; font-size: 12px; line-height: normal";
        dateElem.innerText = (new Intl.DateTimeFormat('en-GB', {timeZone: "Asia/Hong_Kong"}).format(new Date(parseInt(data.chapter_list[i].create_time)))).split('/').reverse().join('-');
        DOMchaps[i].style.height = "50px";
        DOMchaps[i].firstElementChild.style.height = "25px";
        DOMchaps[i].appendChild(dateElem);
    };
    setTimeout(addButtons, 500);
}

var addButtons = function() {
    var searchAP = document.createElement('li')
    searchAP.className = "item";
    searchAP.innerHTML = `<img src="https://www.anime-planet.com/favicon.ico" style="float: left;height: 30px;top: 5px; position: relative; margin-left: 5px"><p style="margin:5px 0px 0px 30px; text-align: center; font-size: 14px">Search on AP</p>`;
    document.querySelector('.comic-operate ul').appendChild(searchAP)
    searchAP.addEventListener("click", function() {open(encodeURI("https://www.anime-planet.com/manga/all?name=" + document.querySelector('h1[class="title"]').innerText), "")});

    var coverImg = document.createElement('li')
    coverImg.className = "item";
    coverImg.innerHTML = `<img src="` + document.querySelector('div[class="comic-cover"] img[src*="space.gif"]').style.background.split('"')[1] + `" style="float: left;height: 30px;top: 5px; position: relative; margin-left: 5px"><p style="margin:5px 0px 0px 30px; text-align: center; font-size: 14px">Open Cover Image</p>`;
    document.querySelector('.comic-operate ul').appendChild(coverImg)
    coverImg.addEventListener("click", function() {open(document.querySelector('div[class="comic-cover"] img[src*="space.gif"]').style.background.split('"')[1].split('-')[0], "")});
}
