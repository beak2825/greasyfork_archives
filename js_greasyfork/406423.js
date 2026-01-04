// ==UserScript==
// @name        ニコニコ動画のヘッダーにマイページとランキングを付けるスクリプト
// @description ニコニコ動画のヘッダーにマイページとランキングを付けます
// @namespace   https://greasyfork.org/ja/users/662133
// @include     https://www.nicovideo.jp/*
// @version     1.1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/406423/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%E3%81%AE%E3%83%98%E3%83%83%E3%83%80%E3%83%BC%E3%81%AB%E3%83%9E%E3%82%A4%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%A8%E3%83%A9%E3%83%B3%E3%82%AD%E3%83%B3%E3%82%B0%E3%82%92%E4%BB%98%E3%81%91%E3%82%8B%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/406423/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%E3%81%AE%E3%83%98%E3%83%83%E3%83%80%E3%83%BC%E3%81%AB%E3%83%9E%E3%82%A4%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%A8%E3%83%A9%E3%83%B3%E3%82%AD%E3%83%B3%E3%82%B0%E3%82%92%E4%BB%98%E3%81%91%E3%82%8B%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==
(function() {
    var target = document.getElementById('CommonHeader');

    function example() {

        var newElement = document.createElement("a");
        var newContent = document.createTextNode("マイページ");/* 必要に応じてここを変える*/
        newElement.appendChild(newContent);
        newElement.setAttribute("class","common-header-b4zojx");
        newElement.setAttribute("href","https://www.nicovideo.jp/my/top");/* 必要に応じてここを変える*/
        newElement.setAttribute("style", "position: relative!important; display: block!important; width: auto!important; height: 36px!important;left: 0px!important;z-index: auto!important;margin-top: 0px!important; padding: 0px 6px!important;color:#ffffff;");
        var parenta = document.getElementsByClassName("common-header-wb7b82")[0];

        var newElement1 = document.createElement("a");
        var newContent1 = document.createTextNode("ランキング");/* 必要に応じてここを変える*/
        newElement1.appendChild(newContent1);
        newElement1.setAttribute("class","common-header-b4zojx");
        newElement1.setAttribute("href","https://www.nicovideo.jp/ranking");/* 必要に応じてここを変える*/
        newElement1.setAttribute("style", "position: relative!important; display: block!important; width: auto!important; height: 36px!important;left: 0px!important;z-index: auto!important;margin-top: 0px!important; padding: 0px 6px!important;color:#ffffff;");

        var newElement2 = document.createElement("a");
        newElement2.setAttribute("class","common-header-b4zojx");
        newElement2.setAttribute("style", "position: relative!important; display: block!important; width: auto!important; height: 36px!important;left: 0px!important;z-index: auto!important;margin-top: 0px!important; padding: 0px 6px!important;color:#ffffff;");

        var url = location.href;
        var url_s = url.split("/");
        var citrus = url_s.slice(3,4);
        if (citrus == "user"){
            var newContent2 = document.createTextNode("静画ページ");/* 必要に応じてここを変える*/
            newElement2.appendChild(newContent2);
            var citrus1 = url_s.slice(4,5);
            var seigaurl = "https://seiga.nicovideo.jp/user/illust/" + citrus1;/* 必要に応じてここを変える*/
            newElement2.setAttribute("href",seigaurl);
        }else{
            var newContent2_1 = document.createTextNode("動画投稿");/* 必要に応じてここを変える*/
            newElement2.appendChild(newContent2_1);
            newElement2.setAttribute("href","https://www.upload.nicovideo.jp/upload");/* 必要に応じてここを変える*/
        }
        parenta.insertBefore(newElement2, parenta.firstChild);
        parenta.insertBefore(newElement1, parenta.firstChild);
        parenta.insertBefore(newElement, parenta.firstChild);
        mo.disconnect();
    }
    var mo = new MutationObserver(example);
    mo.observe(target, {childList: true});

})();



(window.onload = function() {

    var element = document.getElementsByClassName("common-header-wb7b82")[0];
    var childCount = element.childElementCount

    while (childCount < 4 ) {
        var newElement = document.createElement("a");
        var newContent = document.createTextNode("マイページ");/* 必要に応じてここを変える*/
        newElement.appendChild(newContent);
        newElement.setAttribute("class","common-header-b4zojx");
        newElement.setAttribute("href","https://www.nicovideo.jp/my/top");/* 必要に応じてここを変える*/
        newElement.setAttribute("style", "position: relative!important; display: block!important; width: auto!important; height: 36px!important;left: 0px!important;z-index: auto!important;margin-top: 0px!important; padding: 0px 6px!important;color:#ffffff;");

        var parenta = document.getElementsByClassName("common-header-wb7b82")[0];
        var newElement1 = document.createElement("a");
        var newContent1 = document.createTextNode("ランキング");/* 必要に応じてここを変える*/
        newElement1.appendChild(newContent1);
        newElement1.setAttribute("class","common-header-b4zojx");
        newElement1.setAttribute("href","https://www.nicovideo.jp/ranking");/* 必要に応じてここを変える*/
        newElement1.setAttribute("style", "position: relative!important; display: block!important; width: auto!important; height: 36px!important;left: 0px!important;z-index: auto!important;margin-top: 0px!important; padding: 0px 6px!important;color:#ffffff;");

        var newElement2 = document.createElement("a");
        newElement2.setAttribute("class","common-header-b4zojx");
        newElement2.setAttribute("style", "position: relative!important; display: block!important; width: auto!important; height: 36px!important;left: 0px!important;z-index: auto!important;margin-top: 0px!important; padding: 0px 6px!important;color:#ffffff;");

        var url = location.href;
        var url_s = url.split("/");
        var citrus = url_s.slice(3,4);
        if (citrus == "user"){
            var newContent2 = document.createTextNode("静画ページ");/* 必要に応じてここを変える*/
            newElement2.appendChild(newContent2);
            var citrus1 = url_s.slice(4,5);
            var seigaurl = "https://seiga.nicovideo.jp/user/illust/" + citrus1;/* 必要に応じてここを変える*/
            newElement2.setAttribute("href",seigaurl);
        }else{
            var newContent2_1 = document.createTextNode("動画投稿");/* 必要に応じてここを変える*/
            newElement2.appendChild(newContent2_1);
            newElement2.setAttribute("href","https://www.upload.nicovideo.jp/upload");/* 必要に応じてここを変える*/
        }

        parenta.insertBefore(newElement2, parenta.firstChild);
        parenta.insertBefore(newElement1, parenta.firstChild);
        parenta.insertBefore(newElement, parenta.firstChild);

        var childCount1 = element.childElementCount
        childCount = childCount1
    }

})();