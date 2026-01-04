// ==UserScript==
// @name         iwara 一键搜索
// @name:en      iwara one-click search
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  一键在mmdfans.net中搜索MMD
// @description:en  one-click search MMD in mmdfans.net
// @author       XiChan
// @match        *://www.iwara.tv/*
// @match        *://www.iwara.tv
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iwara.tv
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462282/iwara%20%E4%B8%80%E9%94%AE%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/462282/iwara%20%E4%B8%80%E9%94%AE%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var addSearchButtonTask = null;

    function tryAddSearchButton() {
        console.log("iwara 一键搜索 启动");
        // Get element by class name is page-video__details
        // var videoDetails = document.getElementsByClassName("page-video__details")[0];
        // need wait for the element to be loaded
        if (addSearchButtonTask) {
            addSearchButtonTask.cancel();
        }

        addSearchButtonTask = new Promise((resolve, reject) => {
            (function wait() {
                var videoDetails = document.getElementsByClassName("page-video__details")[0];
                if (videoDetails) {
                    resolve(videoDetails);
                } else {
                    setTimeout(wait, 100);
                }
            })();
        }).then((videoDetails) => {
            // The first div in page-video__details is the title
            var videoTitle = videoDetails.getElementsByTagName("div")[0].innerText;

            // Create a new button, append it after the title
            var searchButton = document.createElement("button");
            searchButton.innerText = "在MMDFans搜索";
            searchButton.style = "margin-left: 10px; background-color: #4CAF50; border: none; color: white; padding: 5px 10px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;";
            videoDetails.appendChild(searchButton);

            // Click event, open link https://mmdfans.net/?query=title:{url_encoded_title}&order_by=time
            searchButton.onclick = function () {
                var url = "https://mmdfans.net/?query=title:" + encodeURIComponent(videoTitle) + "&order_by=time";
                window.open(url);
            }
        });
    }

    function maybeLoadSearchButton() {
        // check url is start with www.iwara.tv/video/
        if (window.location.href.startsWith("https://www.iwara.tv/video/") || window.location.href.startsWith("http://www.iwara.tv/video/")) {
            tryAddSearchButton();
        }
    }

    // Listening url change
    var oldUrl = "";
    setInterval(function () {
        if (oldUrl != window.location.href) {
            oldUrl = window.location.href;
            maybeLoadSearchButton();
        }
    }, 1000);

})();
