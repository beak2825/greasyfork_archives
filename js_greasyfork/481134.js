/* eslint-disable no-multi-spaces */
    var buttonSet = [
        { url: "https://gog-games.to/?q=",           title: "GOG Games" },
    ];
    var siteSet = [
    { url: "https://www.gog.com/game/*",               title: "GOG" },
    { url: /^https:\/\/www\.gog\.com\/[a-z]{2}\/game\/.*/, title: "GOG" },
];

    /*
    All Credit for this userscript goes to Kozinc. I simply removed the unsafe sites from his version. And now I'm adding buttons for other sites based on the r/PiratedGames Megathread.
    */
    // ==UserScript==
    // @name         GOG to Free Download Site
    // @namespace    AnimeIsMyWaifu
    // @author       AnimeIsMyWaifu
    // @version      0.5
    // @description  Simply adds a pirate link to all games on the GOG store
    // @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
    // @include      /^https:\/\/www\.gog\.com\/[a-z]{2}\/game\/.*/
    // @match        https://www.gog.com/game/*
    // @grant        none
    // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481134/GOG%20to%20Free%20Download%20Site.user.js
// @updateURL https://update.greasyfork.org/scripts/481134/GOG%20to%20Free%20Download%20Site.meta.js
    // ==/UserScript==

    var siteSetResult = "";

    siteSet.forEach((el) => {
        if(!!document.URL.match(el.url)) siteSetResult = el.title;
    })

    console.log("Games Links: ", siteSetResult);
    var appName = "";
    switch(siteSetResult) {
        case "GOG":
            appName = document.getElementsByClassName("productcard-basics__title")[0].textContent;
            appName = appName.trim();
            buttonSet.forEach((el) => {
                $("button.cart-button")[0].parentElement.parentElement.append(furnishGOG(el.url+appName, el.title))
            })
            break;
    }

    function furnishGOG(href, innerHTML) {
        let element = document.createElement("a");
        element.target= "_blank";
        element.style = "margin: 5px 0 5px 0 !important; padding: 5px 10px 5px 10px;";
        element.classList.add("button");
        //element.classList.add("button--small");
        element.classList.add("button--big");
        element.classList.add("cart-button");
        element.classList.add("ng-scope");
        element.href = href;
        element.innerHTML= innerHTML;
        return element;
    }