// ==UserScript==
// @name         Renshuu NHK news buttons
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  add NHK news articles with a single click
// @author       Ikuto
// @match        https://www.renshuu.org/index.php?page=quiz/breakit
// @icon         https://www.google.com/s2/favicons?sz=64&domain=renshuu.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459614/Renshuu%20NHK%20news%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/459614/Renshuu%20NHK%20news%20buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function submitText(text) {
        document.querySelector("#ta_form_pusher").click();
        document.querySelector("#atext").value = text;
        document.querySelector("#analyze_button").click();
    }

    function getHtml(url, handler) {
        const req = new XMLHttpRequest();
        req.open("GET", url);
        req.responseType = 'document';
        req.overrideMimeType("text/html");
        req.onload = function() {
            if (req.readyState == this.DONE && req.status == 200) {
                var resp = req.responseXML
                if (resp != null) {
                    handler(resp);
                }
            }
        };
        req.send();
    }

    function addButton(value, onClick, savedTextNode) {
        var node = document.createElement("input");
        node.type = "button";
        node.value = value;
        node.addEventListener("click", onClick);
        savedTextNode.parentNode.insertBefore(node, savedTextNode);
        savedTextNode.parentNode.insertBefore(document.createElement("br"), savedTextNode);
    }

    function addArticleButtons(url, headingTitle, getRespArticles, getArticleTitle, addArticle) {
        const req = new XMLHttpRequest();
        req.open("GET", url);
        req.onload = function() {
            if (req.readyState == req.DONE && req.status == 200) {
                var resp = JSON.parse(req.responseText);
                var savedTextNode = document.querySelector("#ta_saved_texts");

                var heading = document.createElement("h3");
                heading.innerText = headingTitle;
                savedTextNode.parentNode.insertBefore(heading, savedTextNode);

                getRespArticles(resp).forEach(element => {
                    addButton(
                        getArticleTitle(element),
                        function() {
                            addArticle(element);
                            this.disabled = true;
                        },
                        savedTextNode
                    );
                });
                savedTextNode.parentNode.insertBefore(document.createElement("br"), savedTextNode);
            }
        };
        req.send();
    }

    function addNhkEasyButtons() {
        addArticleButtons(
            "https://www3.nhk.or.jp/news/easy/top-list.json",
            "latest NHK easy news articles:",
            function(resp) { return resp; },
            function(element) { return element.news_prearranged_time + ": " + element.title; },
            function(element) {
                const articleUrl = "https://www3.nhk.or.jp/news/easy/" + element.news_id + "/" + element.news_id + ".html";
                getHtml(articleUrl, function(resp) {
                    resp.querySelectorAll("rt").forEach(function(val) {val.remove()});
                    const title = resp.querySelector("h1.article-main__title").textContent.trim();
                    const content = resp.querySelector("#js-article-body").textContent.trim();

                    submitText(title + "\n\n" + content);
                })}
        );
    }

    function addNhkButtons() {
        addArticleButtons(
            "https://www3.nhk.or.jp/news/json16/new_001.json",
            "latest NHK news articles:",
            function(resp) { return resp.channel.item; },
            function(element) { return element.pubDate + ": " + element.title; },
            function(element) {
                const articleUrl = "https://www3.nhk.or.jp/news/" + element.link;
                getHtml(articleUrl, function(resp) {
                    const title = resp.querySelector("h1.content--title").innerText.trim();
                    const content = resp.querySelector("section.content--detail-main").innerText.trim();
                    submitText(title + "\n\n" + content);
                })}
        );
    }

    var savedTextNode = document.querySelector("#ta_saved_texts");
    addButton("get latest NHK easy articles", addNhkEasyButtons, savedTextNode);
    addButton("get latest NHK articles", addNhkButtons, savedTextNode);
})();