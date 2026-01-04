// ==UserScript==
// @name         Webtoon Factory Get Chapter Date
// @namespace    https://greasyfork.org/en/users/689482-quin15
// @version      2.0
// @description  Fetches and displays the chapter dates for Webtoon Factory comics
// @author       Quin15
// @match        https://www.webtoonfactory.com/en/serie/*
// @icon         https://www.google.com/s2/favicons?domain=webtoonfactory.com
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/431040/Webtoon%20Factory%20Get%20Chapter%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/431040/Webtoon%20Factory%20Get%20Chapter%20Date.meta.js
// ==/UserScript==

GM_xmlhttpRequest ({
    method:     'GET',
    url:        "https://api.ns178-33-29-7.lcss.be/api/v2/serie/" + document.querySelector('div.actions button').dataset['ser'],
    onload:     function(responseDetails) {
        var episodeListS1 = JSON.parse(responseDetails.responseText).summary[0].episodes;
        unsafeWindow.seasons = JSON.parse(responseDetails.responseText).summary;

        var episodeElems = document.querySelectorAll('div.item._episode');
        for (var i = 0; i < episodeElems.length; i++) {
            var dateElem = document.createElement('div');
            dateElem.className = "DateElem";
            dateElem.innerText = episodeListS1[i].startDate.substr(0,10);
            episodeElems[i].firstElementChild.nextElementSibling.appendChild(dateElem);
        }

        if (document.querySelector('div.serie__episodes--list-seasons div.choices__item.choices__item--selectable')) {
            setInterval(function() {
                if (!(document.querySelector('div.DateElem'))) {
                    webfactoryUserFunct.injectDates();
                }
            }, 200)
        }
    }
});

webfactoryUserFunct = {
    injectDates: function() {
        var selectedSeasonID = document.querySelector('div.serie__episodes--list-seasons div.choices__item.choices__item--selectable').dataset.value;
        console.log(selectedSeasonID);
        console.log(seasons);
        for (var e = 0; e < seasons.length; e++) {
            if (seasons[e].seasonId == selectedSeasonID) {
                var episodeElems = document.querySelectorAll('div.item._episode');
                for (var i = 0; i < episodeElems.length; i++) {
                    var dateElem = document.createElement('div');
                    dateElem.className = "DateElem";
                    dateElem.innerText = seasons[e].episodes[i].startDate.substr(0,10);
                    episodeElems[i].firstElementChild.nextElementSibling.appendChild(dateElem);
                }
            }
        }
    }
}
