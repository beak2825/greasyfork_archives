// ==UserScript==
// @name         ::GOG Links::
// @namespace    masterofobzene
// @author       masterofobzene
// @version      1.9
// @description  Adds links for GOG store to gameplay videos without youtubers comments and direct search on Gog-games for free clean download.
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @match        *://www.gog.com/*/game/*
// @homepage     https://github.com/masterofobzene/UserScriptRepo
// @icon         https://www.gog.com/favicon.ico
// @run-at       document-end
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/489970/%3A%3AGOG%20Links%3A%3A.user.js
// @updateURL https://update.greasyfork.org/scripts/489970/%3A%3AGOG%20Links%3A%3A.meta.js
// ==/UserScript==

var pirateLinks = [
    {
        url: "https://gog-games.to/?search=",
        urlSpecial: "",
        title: "Search on GoG-Games"
    },
    {
        url: "https://www.youtube.com/results?search_query=",
        urlSpecial: " gameplay no commentary",
        title: "Gameplay Video"
    }
];

var storePages = [
    {
        // Matches any two-letter language code in the URL
        url: /^https:\/\/www\.gog\.com\/[a-z]{2}\/game\//,
        title: "GOG"
    }
];

var storePageResult = "";

storePages.forEach((e) => {
    if (e.url.test(document.URL)) {
        storePageResult = e.title;
    }
});

console.log("Domain Match: ", storePageResult);

var appName = "";

switch (storePageResult) {
    case "GOG":
        appName = document.getElementsByClassName("productcard-basics__title")[0].textContent;
        pirateLinks.forEach((e) => {
            $("button.cart-button")[0].parentElement.parentElement.append(
                rigGOG(e.url + encodeURIComponent(appName) + e.urlSpecial, e.title)
            );
        });
        break;
}

function rigGOG(href, innerHTML) {
    let element = document.createElement("a");
    element.target = "_blank";
    element.style = "margin: 5px 0 5px 0 !important; padding: 5px 10px 5px 10px;";
    element.classList.add("button", "button--big", "cart-button", "ng-scope");
    element.href = href;
    element.innerHTML = innerHTML;
    return element;
}
