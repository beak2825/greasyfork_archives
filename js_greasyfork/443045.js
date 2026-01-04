// ==UserScript==
// @name         Yahoo! - 掲載元検索
// @namespace    https://github.com/y-muen
// @license      MIT
// @version      1.1.0
// @description  Yahoo!ニュースで記事の掲載元でのページを検索する。SNSリンクの横の検索ボタンを押すと、新しいタブでGoogle検索して、最初の結果に遷移する。
// @author       Yoiduki <y-muen>
// @match        *://news.yahoo.co.jp/articles/*
// @match        *://www.google.com/search*-yahoo-news-search-original.js
// @icon         https://www.google.com/s2/favicons?domain=yahoo.co.jp
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource     MaterialIcons https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Round
// @supportURL   https://gist.github.com/y-muen/72438b451b4bfc980d34fb04d2db6e9e
// @downloadURL https://update.greasyfork.org/scripts/443045/Yahoo%21%20-%20%E6%8E%B2%E8%BC%89%E5%85%83%E6%A4%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/443045/Yahoo%21%20-%20%E6%8E%B2%E8%BC%89%E5%85%83%E6%A4%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const flag = 'yahoo-news-search-original.js';

    var parser = new URL(location.href)
    if (parser.host == 'news.yahoo.co.jp') {
        GM_addStyle(GM_getResourceText('MaterialIcons'));
        const div = $("#uamods>header>div>div");

        const el = document.createElement("div");
        el.setAttribute("title", "記事の掲載元を検索")
        var target = div[0]
        var child = undefined;
        var cand = undefined;
        if (target.children.length > 0){
            cand = target.children[target.children.length-1]
            if (cand.tagName == "DIV") {
                child = cand
            }
        }
        if (child.children.length > 0){
            cand = child.children[child.children.length-1]
            if (cand.tagName != "DIV") {
                cand = undefined
            }
        }
        console.log(cand)

        while (child && cand) {
            target = child;
            child = cand;
            cand = undefined;
            if (child.children.length > 0){
                cand = child.children[child.children.length-1]
                if (cand.tagName != "DIV") {
                    cand = undefined
                }
            }
            console.log(target);
        }
        console.log(target);
        el.className = child.className;
        target.appendChild(el);

        const a = document.createElement("a");
        const a_ref = div[div.length-1].getElementsByTagName("a")[0];
        const href = new URL(a_ref.href).origin;
        const title = document.getElementsByTagName("h1")[1].textContent;
        const hrefSearch = "https://www.google.com/search?q=" + href.replace(/https?/, "site").replace(/this.kiji.is/, "nordot.app") + " intitle:" + title + " -" + flag;
        a.setAttribute("href", hrefSearch);
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
        el.appendChild(a);

        const icon = document.createElement("span");
        icon.classList.add("material-icons-round");
        icon.innerText = "search";
        a.appendChild(icon);
    } else if (parser.host == 'www.google.com') {
        window.addEventListener('load', function () {
            var res = document.getElementsByClassName("yuRUbf")
            if (res.length > 0) {
                var url = res[0].getElementsByTagName('a')[0].href;
                location.href = url;
            }
        })
    }
})();