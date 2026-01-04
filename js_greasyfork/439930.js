// ==UserScript==
// @name         站酷移动端网页美化搜索增强
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  站酷移动端网页美化&搜索增强
// @author      voidlhf
// @match       https://m.zcool.com.cn/*
// @match       https://mobile.zcool.com.cn/*
// @match       https://www.zcool.com.cn/special/*
// @icon        https://static.zcool.cn/z/site/favicon.ico
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/439930/%E7%AB%99%E9%85%B7%E7%A7%BB%E5%8A%A8%E7%AB%AF%E7%BD%91%E9%A1%B5%E7%BE%8E%E5%8C%96%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/439930/%E7%AB%99%E9%85%B7%E7%A7%BB%E5%8A%A8%E7%AB%AF%E7%BD%91%E9%A1%B5%E7%BE%8E%E5%8C%96%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    setInterval(function () {
        try {

            if (location.href.startsWith("https://m.zcool.com.cn/search")) {

                if (!document.querySelector("#newSearchButton")) {

                    var searchButton = document.createElement("button");

                    searchButton.setAttribute("id", "newSearchButton");

                    searchButton.innerText = "增强版搜索";

                    searchButton.style.cssText = "width:30%;height:0.72rem;margin:0.5rem auto;display:block;";

                    document.querySelector("#__next > div > main > div").appendChild(searchButton);

                    searchButton.onclick = function () {

                        var searchWord = document.querySelector("#__next > div > main > div > div > form > div.jsx-2463898947.m-search > input").value;

                        if (searchWord) {

                            //                             location.href = "https://www.zcool.com.cn/search/content?word=" + searchWord;

                            window.open("https://www.zcool.com.cn/search/content?word=" + searchWord);

                        }

                    }

                }

            }

        } catch (err) { }

        try {

            var insertStyle = document.createElement('style');

            insertStyle.innerHTML = "header.jsx-3062881542 {background-color: white;} header {background-color: white;}";

            document.head.appendChild(insertStyle);

        } catch (err) { }

        try {

            document.querySelector("#__next > div > main > div > div.am-drawer-content > div > div.jsx-3761314967 > a").remove();

        } catch (err) { }

        try {

            document.querySelector("#__next > div > main > header > section > div > a").remove();

        } catch (err) { }

        try {

            document.querySelector("#__next > div > main > div > div.am-drawer-content > section.jsx-1560820686").remove();

        } catch (err) { }

        try {

            document.querySelector("#__next > div > main > div > div.am-drawer-content > div > div:nth-child(3) > div.jsx-3040807745 > a").remove();

        } catch (err) { }

        try {

            document.querySelector("#__next > div > main > div > div.am-drawer-content > div > div.jsx-3204379161 > div > div.jsx-3204379161 > a").remove();

        } catch (err) { }

        try {

            document.querySelector("#__next > div > main > div > div.am-drawer-content > a").remove();

        } catch (err) { }

        try {

            document.querySelector("#__next > div > main > div > div.am-drawer-content > div.jsx-3763966338.flex-container > div").remove();

        } catch (err) { }

        try {

            document.querySelector("#__next > div > main > div > div.am-drawer-content > div > div.jsx-3204379161 > div > div.swiper-container.swiper-container-initialized.swiper-container-horizontal.swiper-container-free-mode.swiper-container-android > div > div.swiper-slide.jsx-3204379161.demo-slide.slide-more.swiper-slide-next").remove();

        } catch (err) { }

        try {

            document.querySelector("#__next > div > main > div:nth-child(4) > section").remove();

        } catch (err) { }

        try {

            document.querySelector("body > section").remove();

        } catch (err) { }

        try {

            document.querySelector("#mobileNavBar > section > div > a").remove();

        } catch (err) { }



        try {

            document.querySelector("head > meta[name=\"theme-color\"]").setAttribute("content", "white")
        } catch (err) { }

    }, 100);

})();