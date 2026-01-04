// ==UserScript==
// @name         u17 Display Chapter Dates
// @namespace    https://greasyfork.org/en/users/689482-quin15
// @version      1.0.3
// @description  Fetches and displays the chapter dates for u17 manhua
// @author       Quin15
// @match        https://www.u17.com/comic/*
// @icon         https://www.google.com/s2/favicons?domain=u17.com
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/425041/u17%20Display%20Chapter%20Dates.user.js
// @updateURL https://update.greasyfork.org/scripts/425041/u17%20Display%20Chapter%20Dates.meta.js
// ==/UserScript==

GM_xmlhttpRequest ({
    method:     'GET',
    url:        "https://app.u17.com/v3/appV3_3/android/phone/comic/detail_static_new?v=5700100&comicid=" + location.pathname.split('/').reverse()[0].replace('.html', ''),
    headers:    {"accept": "*/*", "accept-language": "en-GB,en-US;q=0.9,en;q=0.8", "content-Encoding": "gzip, deflate, br"},
    onload:     function (responseDetails) {
        var data = JSON.parse(responseDetails.responseText);
        var checkElems = function() {if (document.querySelector(".cf")) {injectDates(data)} else {setTimeout(checkElems, 100);}};
        checkElems();
    }
});

var injectDates = function(data) {
    var elemDates = data.data.returnData.chapter_list;
    var episodes = document.querySelectorAll('li[id^="cpt_read"]');
    for (var i = 0; i < episodes.length; i++) {
        var dateElem = document.createElement('div');
        dateElem.style = "width:100%;color: #888;font-size: 12px;top:15px;position:absolute;height:0px;";
        dateElem.innerText = new Date(elemDates[i].publish_time * 1000).toISOString().substr(0,10);
        episodes[i].appendChild(dateElem);
    };
    addButtons(data.data.returnData.comic.name, data.data.returnData.comic.cover);
};

var addButtons = function(name, cover) {
    var searchAP = document.createElement('a');
    searchAP.className = "btn_start";
    searchAP.style.cursor = "pointer";
    searchAP.innerHTML = `<img src="https://www.anime-planet.com/favicon.ico" style="float:left;height:30px;margin:10px 0px 0px 10px;"><p style="margin-top:12px;font-size:14px;">Search on AP</p>`;
    document.querySelector('#btn_big').appendChild(searchAP);
    searchAP.addEventListener("click", function() {open(encodeURI("https://www.anime-planet.com/manga/all?name=" + name), "")});

    var coverImg = document.createElement('a');
    coverImg.className = "btn_start";
    coverImg.style.cursor = "pointer";
    coverImg.innerHTML = `<img src="` + cover.replace(/s?big/, 'small') + `" style="float:left;height:30px;margin:10px 0px 0px 10px;"><p style="margin-top:12px;font-size:14px;">Open Cover Image</p>`;
    document.querySelector('#btn_big').appendChild(coverImg);
    coverImg.addEventListener("click", function() {open(cover, "")});
};