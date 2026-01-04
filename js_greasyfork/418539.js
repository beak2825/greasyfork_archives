// ==UserScript==
// @name         IMDb跳转Rarbg
// @namespace    https://gist.github.com/LandonLi
// @version      2.2
// @description  在IMDb影片页面上添加Rarbg的搜索结果地址
// @author       Landon Li
// @icon         https://ia.media-imdb.com/images/G/01/imdb/images/favicon-2165806970
// @match        *://www.imdb.com/title/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418539/IMDb%E8%B7%B3%E8%BD%ACRarbg.user.js
// @updateURL https://update.greasyfork.org/scripts/418539/IMDb%E8%B7%B3%E8%BD%ACRarbg.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    // 从当前页面url中获取imdbID
    var parts = window.location.href.split('/');
    var imdbID = parts[parts.length-2];
    console.log("imdbID:" + imdbID);

    // 拼接Rarbg的搜索地址
    var rarbgUrl = "https://rarbg.to/torrents.php?search=" + imdbID;
    // 在页面添加一键链接
    var rarbgLink = htmlToElement('<li role="presentation" class="ipc-inline-list__item"><a href="' + rarbgUrl + '" target="_blank" tabindex="0" class="ipc-link ipc-link--baseAlt ipc-link--inherit-color">Rarbg</a></li>');
    var ul = document.evaluate('//div[@data-testid="hero-subnav-bar-right-block"]/ul', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    ul.appendChild(rarbgLink);
    console.log("已添加Rarbg跳转");
})();