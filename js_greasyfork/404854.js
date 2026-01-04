// ==UserScript==
// @name         DoubanRating
// @namespace    http://tampermonkey.net/
// @version      0.6.3
// @description  在胖子/多瑙上显示豆瓣分数.
// @author       YXB
// @match        https://*.pangzitv.com/*
// @match        https://*.ifvod.tv/*
// @grant        GM.xmlHttpRequest
// @connect      mv-rating.club
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=19641
// @downloadURL https://update.greasyfork.org/scripts/404854/DoubanRating.user.js
// @updateURL https://update.greasyfork.org/scripts/404854/DoubanRating.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const douban_search_url = "https://www.douban.com/search?&q=";
    const douban_icon_url = "https://www.douban.com/favicon.ico";
    const db_batch_url = "https://mv-rating.club/movies/";


    function getRating(title_text, callback) {
        title_text = JSON.stringify({"titles":title_text});
        GM.xmlHttpRequest({
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            url: db_batch_url,
            data: title_text,
            onload: function(response) {
                var responseRating = JSON.parse(response.responseText);
                callback(responseRating);
            }
        });
    }


    function createAnchor(queryURL) {
        const newIcon = document.createElement("a");
        newIcon.href = queryURL;
        newIcon.target = "_blank";
        const newImg = document.createElement("img");
        newImg.src = douban_icon_url;
        newImg.style.height = "16px";
        newImg.style.paddingLeft = "2px";
        newIcon.appendChild(newImg);
        return [newIcon, newImg];
    }


    function getPangzi() {
        var titles = document.querySelectorAll(".name");
        var title_text = [];
        titles.forEach(element => {title_text.push(element.innerText)});
        console.log(title_text);
        getRating(title_text, function (titles, responseArray) {
            for (var i = 0; i < responseArray.length; i++) {
                var element = titles[i];
                var responseText = responseArray[i].rating;
                let t = createAnchor(douban_search_url + element.innerText);
                let newIcon = t[0], newImg = t[1];
                element.style.display = "initial";
                newIcon.style.display = "initial";
                newIcon.style.verticalAlign = "middle";
                element.innerHTML = element.innerHTML + " " + responseText;
                element.parentNode.insertBefore(newIcon, element.nextSibling);
            }
        }.bind(null, titles));
    }


    function getIfvod() {
        var titles = document.querySelectorAll(".title");
        var title_text = [];
        titles.forEach(element => {title_text.push(element.innerText)});
        getRating(title_text, function (titles, responseArray) {
            for (var i = 0; i < responseArray.length; i++) {
                var element = titles[i];
                var responseText = responseArray[i].rating;
                let t = createAnchor(douban_search_url + element.innerText);
                let newIcon = t[0], newImg = t[1];
                newIcon.style.verticalAlign = "text-bottom";
                element.innerHTML = element.innerHTML + " " + responseText;
                element.appendChild(newIcon);
            }
        }.bind(null, titles));
    }


    if (window.location.href.includes("pangzitv")) {
        waitForKeyElements (".imgListWrp", getPangzi);
    } else if (window.location.href.includes("ifvod")) {
        waitForKeyElements (".search-results", getIfvod);
        waitForKeyElements (".outer", function() {
            setTimeout(getIfvod, 1500);
        });
    }
})();
