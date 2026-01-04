// ==UserScript==
// @name         iQiyi Get Chapter Date V2
// @namespace    https://greasyfork.org/en/users/689482-quin15
// @version      1.1.12
// @description  Fetches and displays the chapter dates for iqiyi manhua
// @author       Quin15
// @match        https://www.iqiyi.com/manhua/detai*
// @icon         https://www.google.com/s2/favicons?domain=iqiyi.com
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/425444/iQiyi%20Get%20Chapter%20Date%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/425444/iQiyi%20Get%20Chapter%20Date%20V2.meta.js
// ==/UserScript==

GM_xmlhttpRequest ({
    method:     'GET',
    url:        "https://www.iqiyi.com/manhua/catalog/" + location.pathname.split('detail_')[1].split('.')[0],
    onload:     function(responseDetails) {
        unsafeWindow.episodeList = JSON.parse(responseDetails.responseText).data.episodes;
        var checkElems = function() {if (document.querySelector('.chapter-container ol li')) {unsafeWindow.injectDates()} else {setTimeout(checkElems, 100);}};
        checkElems();
    }
});

unsafeWindow.injectDates = function() {
    var DOMEpisodeList = document.querySelectorAll('.chapter-fixhei li')
    for (var i = 0; i < DOMEpisodeList.length; i++) {
        var episodeNum = parseInt(DOMEpisodeList[i].querySelector('.itemcata-order').innerText);
        for (var e = 0; e < episodeList.length; e++) {
            if (episodeList[e].episodeOrder == episodeNum) {
                var episodeDate = (new Intl.DateTimeFormat('en-GB', {timeZone: "Asia/Hong_Kong"}).format(new Date(parseInt(episodeList[e].lastUpdateTime)))).split('/').reverse().join('-');
                if (!(DOMEpisodeList[i].querySelector('.DateElem'))) {
                    var dateElem = document.createElement('div');
                    dateElem.className = "DateElem";
                    dateElem.style = "width: 100%; color: #888; font-size: 12px; margin-top: 20px; position:absolute;";
                    dateElem.innerText = episodeDate;
                    DOMEpisodeList[i].appendChild(dateElem)
                }
            };
        };
    };
};

var comicTitle = document.querySelector('.detail-info .detail-tit h1').innerText;

var searchAP = document.createElement('div');
searchAP.className = "btn-detail detail-read J_readFromStart";
searchAP.style = "margin-left: 30px; position: absolute; cursor: pointer;"
searchAP.innerHTML = `<img src="https://www.anime-planet.com/favicon.ico" style="float: left;height: 30px;top: 8px; position: relative; margin-left: 20px"><p style="font-size: 16px">Search on AP</p>`;
document.querySelector('.detail-info').insertBefore(searchAP, document.querySelector('.detail-info').lastElementChild);
searchAP.addEventListener("click", function() {open(encodeURI("https://www.anime-planet.com/manga/all?name=" + comicTitle), "")});

var coverImg = document.createElement('div');
coverImg.className = "btn-detail detail-read J_readFromStart";
coverImg.style = "margin-left: 260px; position: absolute; cursor: pointer;"
coverImg.innerHTML = `<img src="` + document.querySelector('.detail-cover img').src + `" style="float: left;height: 30px;top: 8px; position: relative; margin-left: 20px"><p style="font-size: 16px">Open Cover Image</p>`;
document.querySelector('.detail-info').insertBefore(coverImg, document.querySelector('.detail-info').lastElementChild);
coverImg.addEventListener("click", function() {open(document.querySelector('.detail-cover img').src, "")});

document.querySelector('.catalogPageList.clearfix').addEventListener("click", function() {{setTimeout(injectDates, 50)}}, true);
document.querySelector('.chapter-page-more').addEventListener("click", function() {{setTimeout(injectDates, 50)}}, true);