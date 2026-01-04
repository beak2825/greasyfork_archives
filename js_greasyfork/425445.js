// ==UserScript==
// @name         iQiyi Get Chapter Date V1
// @namespace    https://greasyfork.org/en/users/689482-quin15
// @version      2.2.1
// @description  Fetches and displays the chapter dates for iQiyi manhua
// @author       Quin15
// @match        https://www.iqiyi.com/manhua/detai*
// @icon         https://www.google.com/s2/favicons?domain=iqiyi.com
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @require      https://cdn.bootcdn.net/ajax/libs/blueimp-md5/2.18.0/js/md5.js
// @downloadURL https://update.greasyfork.org/scripts/425445/iQiyi%20Get%20Chapter%20Date%20V1.user.js
// @updateURL https://update.greasyfork.org/scripts/425445/iQiyi%20Get%20Chapter%20Date%20V1.meta.js
// ==/UserScript==

var searchComicID = function(comicTitle) {
    var searchAPIURL = new URL("https://lightning.iqiyi.com/books/acnKeyword?platform=IOS&keyword=" + encodeURI(comicTitle) + "&page=1&size=10&category=4&targetX=app&appVer=100.0.0&srcPlatform=23&timeStamp=" + Date.now());
    var searchAPIunhashed = searchAPIURL.pathname + searchAPIURL.search.toString().slice(1) + "0n9wdzm8pcyl1obxe0n9qdzm2pcyf1ob";
    var comicAPImd5 = md5(searchAPIunhashed);

    GM_xmlhttpRequest ({
        method:     'GET',
        url:        searchAPIURL,
        headers:    {"md5": comicAPImd5},
        onload:     function(responseDetails) {
            var responseList = JSON.parse(responseDetails.responseText).data.elements;
            //console.log(JSON.parse(responseDetails.responseText));
            for (var i = 0; i < responseList.length; i++) {
                if (responseList[i].title == comicTitle) {
                    getComicInfo(responseList[i].bookId);
                };
            };
        }
    });
};

var getComicInfo = function(bookId) {
    var comicAPIURL = new URL("https://comic.iqiyi.com/views/comicCatalog?comicId=" + bookId + "&episodeId=0&episodeIndex=0&order=0&size=10000&qiyiId=65d8bac9cd631d6cb075bc494350ab5f&timeStamp=" + Date.now() + "&srcPlatform=23&appVer=100.0.0&agentVersion=h5")
    var comicAPIunhashed = comicAPIURL.pathname + comicAPIURL.search.toString().slice(1) + "0n9wdzm8pcyl1obxe0n9qdzm2pcyf1ob";
    var comicAPImd5 = md5(comicAPIunhashed);

    GM_xmlhttpRequest ({
        method:     'GET',
        url:        comicAPIURL,
        headers:    {"md5": comicAPImd5},
        onload:     function(responseDetails) {
            unsafeWindow.episodeList = JSON.parse(responseDetails.responseText).data.allCatalog.comicEpisodes;
            //console.log(JSON.parse(responseDetails.responseText));
            unsafeWindow.injectDates();
        }
    });
};

unsafeWindow.injectDates = function() {
    var DOMEpisodeList = document.querySelectorAll('.chapter-fixhei li')
    for (var i = 0; i < DOMEpisodeList.length; i++) {
        var episodeNum = parseInt(DOMEpisodeList[i].querySelector('.itemcata-order').innerText);
        for (var e = 0; e < episodeList.length; e++) {
            if (episodeList[e].episodeOrder == episodeNum) {
                var episodeDate = (new Intl.DateTimeFormat('en-GB', {timeZone: "Asia/Hong_Kong"}).format(new Date(parseInt(episodeList[e].lastUpdateTime)))).split('/').reverse().join('-');
                //console.log(episodeNum + "   " + episodeDate);
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

searchComicID(comicTitle);
document.querySelector('.catalogPageList.clearfix').addEventListener("click", function() {{setTimeout(function() {unsafeWindow.injectDates()}, 50)}}, true);
document.querySelector('.chapter-page-more').addEventListener("click", function() {{setTimeout(function() {unsafeWindow.injectDates()}, 50)}}, true);
