// ==UserScript==
// @name         Weibo Show Chapter Date
// @namespace    https://greasyfork.org/en/users/689482-quin15
// @version      1.0.2
// @description  Fetches and displays the chapter dates for Weibo manhua
// @author       Quin15
// @include      https://manhua.weibo.com/c/*
// @include      manhua.weibo.com/c/*
// @include      http://manhua.weibo.com/c/*
// @icon         https://www.google.com/s2/favicons?domain=weibo.com
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-idle

// @downloadURL https://update.greasyfork.org/scripts/425240/Weibo%20Show%20Chapter%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/425240/Weibo%20Show%20Chapter%20Date.meta.js
// ==/UserScript==

GM_xmlhttpRequest ({
    method:     'GET',
    url:        "https://apiwap.vcomic.com/wbcomic/comic/comic_show?comic_id=" + location.pathname.split('/').reverse()[0] + "&_request_from=pc",
    headers:    {"accept": "application/json, text/plain, */*", "accept-language": "en-GB,en-US;q=0.9,en;q=0.8", "content-type": "application/json;charset=UTF-8"},
    onload:     function (responseDetails) {
        var data = JSON.parse(responseDetails.responseText);
        unsafeWindow.comicData = data;
        var checkElems = function() {if (document.querySelector('.nav-item.active') && document.querySelector('.catelog-item')) {weiboFuncts.injectEvents()} else {setTimeout(checkElems, 100);}};
        checkElems();
    }
});

weiboFuncts = {
    injectEvents: function() {
        var navPages = document.querySelectorAll('div[class^="nav-item"]');
        document.querySelector('.nav-bar').addEventListener("click", function() {{setTimeout(function() {weiboFuncts.injectDates()}, 200)}}, true);
        weiboFuncts.injectDates();
    },
    injectDates:  function() {
        if (!(document.querySelector('.chapterDate'))) {
            var populationIndex = document.querySelector('.nav-item.active').innerText.replace('话', '').split('-');
            populationIndex[0] = parseInt(populationIndex[0]) - 1;
            populationIndex[1] = parseInt(populationIndex[1]) - 1;
            var chaps = comicData.data.chapter_list;
            var chapDom = document.querySelectorAll('.catelog-item');

            for (var i = populationIndex[0]; i <= populationIndex[1]; i++) {
                var idom = i - populationIndex[0];
                var dateElem = document.createElement('div');
                dateElem.className = "chapterDate";
                dateElem.style = "width: 100%; color: #888; font-size: 12px; display: flex";
                dateElem.innerText = (new Intl.DateTimeFormat('en-GB', {timeZone: "Asia/Hong_Kong"}).format(new Date(parseInt(chaps[i].create_time) * 1000))).split('/').reverse().join('-');
                chapDom[idom].style = "height: 50px; line-height: inherit;"
                chapDom[idom].firstElementChild.style = "height: 30px; vertical-align: top;"
                chapDom[idom].appendChild(dateElem);
            }
        }
    }
}

