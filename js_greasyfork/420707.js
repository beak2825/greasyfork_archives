// ==UserScript==
// @name        UnDuckButton
// @name:zh-CN  鸭子倒悬！
// @namespace   Violentmonkey Scripts
// @match       https://duckduckgo.com/*
// @grant       none
// @version     0.3.1
// @author      noarch
// @description Buttons that redirect DuckDuckGo searches to other search engines
// @description:zh-cn 在 DuckDuckGo 的搜索结果中添加几个按钮，快速在其它搜索引擎重新搜索。
// @license     WTFPL
    
// @downloadURL https://update.greasyfork.org/scripts/420707/UnDuckButton.user.js
// @updateURL https://update.greasyfork.org/scripts/420707/UnDuckButton.meta.js
// ==/UserScript==
    
    
// Searx instances from https://searx.neocities.org/nojs.html
// Updated 2021-01-15
var searxes = [
    "https://searx.ir/?q=",
    "https://search.stinpriza.org/?q=",
    "https://search.privacytools.io/searx/?q=",
    "https://search.azkware.net/?q=",
    "https://searx.openpandora.org/?q=",
    "https://trovu.komun.org/?q=",
    "https://searx.nakhan.net/?q=",
    "https://searx.nixnet.services/?q=",
    "https://searx.libmail.eu/?q=",
    "https://searx.elukerio.org/?q=",
    "https://searx.info/?q=",
    "https://searx.foo.li/?q="
];
var randomSearx = searxes[Math.floor(Math.random() * searxes.length)];
    
// Add more search engines here
var searchEngines = {
    //"Bing": "https://www.bing.com/search?q=", // Bing sucks, disabled by default
    "Google": "https://www.google.com/search?q=",
    "Searx": randomSearx,
    "Startpage": "https://startpage.com/sp/search?query="
};
    
function getSearchQuery() {
    var input = document.getElementById("search_form_input").value;
    var inputEncoded = encodeURIComponent(input);
    
    return inputEncoded;
}
    
function newButton(text, href) {
    var a = document.createElement("a"); // allow opening in a new tab
    var btn = document.createElement("button");

    a.href = href;
    btn.innerHTML = text;
    a.appendChild(btn);

    return a;
}
    
function main() {
    searchQuery = getSearchQuery(); // Failing here is fine, just exit if we can't find the search terms
    
    // Create styles for the <div> containing the buttons
    var styles = ".redirectors {display: block; margin: 60px auto auto auto;  right: 4px; position: absolute; bottom: 0; top: 0;}";
    var styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    
    var div = document.createElement("div");
    div.classList.add("redirectors");
    
    for (var searchEngine in searchEngines) {
        href = searchEngines[searchEngine] + searchQuery;
        div.appendChild(newButton(searchEngine, href));
    }
    
    document.head.appendChild(styleSheet);
    document.getElementById("header_wrapper").appendChild(div);
}
    
main();
