// ==UserScript==
// @name         Customize Zeit Online
// @namespace    https://greasyfork.org/en/users/689160-georg-vogt
// @version      4.13
// @description  Entferne unerwünschte Artikel/Abschnitte aus Zeit Online
// @author       Georg Vogt
// @match        https://www.zeit.de/*
// @icon         https://icons.duckduckgo.com/ip2/zeit.de.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/411611/Customize%20Zeit%20Online.user.js
// @updateURL https://update.greasyfork.org/scripts/411611/Customize%20Zeit%20Online.meta.js
// ==/UserScript==

"use strict";

function hideNode(node) {
    if (node) {
        node.style.display = "none";
        //  node.style.background = "red"; //  debug
    }
}

function clearMainPage() {
    // bad single nodes
    const queries = new Map([
        ["div.cp-region.cp-region--kpi-table", "div"], // Beliebte Artikel
        ["div.cp-region.cp-region--kpi-accordion", "div"], // Beliebte Artikel mobile
        ["section[data-ct-context='shop']", "div.cp-region"], // Shop
        ["section[data-ct-context='headed-spiele']", "div.cp-region"], // Spiele
        ["section[data-ct-context='newsticker']", "div.cp-region"], // Newsticker
        ["section>div.zg-wiegehtesihnen", "div"], // Stimmungsumfrage
        ["a[href*='die-49']", "div"], // Die 49
    ]);
    const main = document.querySelector("main");
    queries.forEach((node, query) => hideNode(main.querySelector(query)?.closest(node)));

    // remove zeit+
    if (GM_getValue("tm_czo_zeitplus", true)) {
        const zplusArticles = main.querySelectorAll("article svg.svg-symbol.zplus-logo:not(.invisible)");
        zplusArticles.forEach(node => hideNode(node.closest("article")));
    }

    // remove wochenmarkt
    if (GM_getValue("tm_czo_wochenmarkt", true)) {
        const wochenmarkt = main.querySelectorAll(
            "article[data-unique-id^='http://xml.zeit.de/zeit-magazin/wochenmarkt'], article.zon-teaser-wochenmarkt"
        );
        wochenmarkt.forEach(node => hideNode(node));
    }

    // remove zett
    if (GM_getValue("tm_czo_zett", true)) {
        const zettArticles = main.querySelectorAll("article>[href^='https://www.zeit.de/zett']");
        zettArticles.forEach(node => hideNode(node.closest("article")));
    }

    // remove Verlagsangebot
    if (GM_getValue("tm_czo_verlag", true)) {
        const verlagsangebotArticles = main.querySelectorAll(":scope>div>*>article.zon-teaser-standard.zon-teaser-standard--ad");
        verlagsangebotArticles.forEach(node => hideNode(node));
        const veranstaltungen = main.querySelectorAll(":scope>div>*>article>a[href^='https://z2x.zeit.de']");
        veranstaltungen.forEach(node => hideNode(node.parentElement));
    }

    // remove podcasts
    if (GM_getValue("tm_czo_podcast", true)) {
        const podcasts = main.querySelectorAll([
            "article.zon-teaser-standard.zon-teaser-standard--podcast",
            "article.teaser-podcast-lead",
            "article.zon-teaser-wide.zon-teaser-wide--podcast"
        ]);
        podcasts.forEach(node => hideNode(node));
    }

    // remove videos
    if (GM_getValue("tm_czo_video", true)) {
        const videos = main.querySelectorAll(":scope>div>*>article[data-video-id]");
        videos.forEach(node => hideNode(node));
    }

    // remove newsletter
    if (GM_getValue("tm_czo_newsletter", true)) {
        const newsletters = main.querySelectorAll(":scope>div>*>article>a[href^='https://www.zeit.de/newsletter']");
        newsletters.forEach(node => hideNode(node.parentElement));
        main.querySelectorAll(":scope>div>div>aside.newsletter-signup").forEach(node => hideNode(node));
    }

    // remove Känguru Comic
    if (GM_getValue("tm_czo_comic", true)) {
        const comic = main.querySelector("figure [href^='https://www.zeit.de/serie/die-kaenguru-comics'], figure [src^='https://img.zeit.de/administratives/kaenguru-comics']");
        hideNode(comic?.closest("div.scrollable-wrapper, div.collapsible-wrapper"));
    }

    // remove Quiz region
    if (GM_getValue("tm_czo_quiz", true)) {
        const quiz = main.querySelector(":scope>div>div>section.frame.frame--quiz");
        hideNode(quiz?.closest("div.cp-region"));
    }

    // remove Spiele
    if (GM_getValue("tm_czo_spiele", true)) {
        const quiz = main.querySelector("article a[href*='spiele.zeit.de'], article a[href*='soduko.zeit.de']");
        hideNode(quiz?.closest("div.cp-region"));
    }

    // remove offline angebote
    if (GM_getValue("tm_czo_offline", true)) {
        hideNode(main.querySelector(":scope>div>section[data-ct-context='printkiosk']")?.closest("div.cp-region")); // Jetzt für sie am Kiosk
        hideNode(main.querySelector(":scope>div>div>section.zon-teaser-printbox")?.closest("div.cp-region")); // Diese Woche in der ZEIT
    }

    // remove regions without articles
    const wantedContent = [
        "article:not([style*='display: none'])",
        ":scope>div>aside>div.zg-corona-dashboard",
        ":scope>div>section>iframe", // Quiz
        ":scope>div[class='czo-settings']",
    ]
    main.querySelectorAll(":scope>div").forEach(node => node.querySelector(wantedContent)? "": hideNode(node));
}

function clearArticle() {
    // bad single nodes
    const queries = new Map([
        ["aside.jobbox-ticker", "aside"], // Jobbörse
    ]);
    queries.forEach((node, query) => hideNode(document.querySelector(query)?.closest(node)));

    // remove sidebar Zeit+
    if (GM_getValue("tm_czo_zeitplus", true)) {
        const possibleHeadings = ["DAS BESTE AUS Z+", "Z+"];
        const sideBoxes = document.querySelectorAll("article aside.topicbox");
        for (const sideBox of sideBoxes) {
            if (possibleHeadings.includes(sideBox.firstElementChild?.firstElementChild?.innerText)) {
                hideNode(sideBox);
            }
        }
    }

    // remove videos
    if (GM_getValue("tm_czo_video", true)) {
        const videos = document.querySelectorAll("figure>div.js-videoplayer");
        videos.forEach(node => hideNode(node.parentElement));
    }

    // remove newsletter
    if (GM_getValue("tm_czo_newsletter", true)) {
        hideNode(document.querySelector("aside.newsletter-signup"));
        hideNode(document.querySelector("[action*='community.zeit.de/newsletter']")?.closest("form")); // Newsletter inline
    }

    // offline angebote
    if (GM_getValue("tm_czo_offline", true)) {
        hideNode(document.querySelectorAll("aside.volume-teaser"));
    }

    // Anzeige
    const nextRead = document.querySelector("span.nextread-note__label")
    if (nextRead?.innerText == "ANZEIGE") {
        hideNode(nextRead?.closest("article"));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector("div.cp-region")) {
        clearMainPage();
        setTimeout(clearMainPage, 2000);
    } else {
        clearArticle();
    };

    // Create Settings on bottom
    function createCheckbox(text, id, defaultValue=true) {
        const div = document.createElement("div");
        div.innerHTML = `
            <input type="checkbox" id="${id}+" name="${id}+" ${GM_getValue(id, defaultValue)? "checked": ""}>
            <label for="${id}+">${text}</label>
        `;
        div.onclick = function () {
            GM_setValue(id, div.firstElementChild.checked);
        };
        return div;
    }
    const main = document.querySelector("main");
    const settings = document.createElement("div");
    settings.innerHTML = "<h3>Customize Zeit Online Einstellungen: Blocke</h3>";
    const boxes = document.createElement("div");
    boxes.className = "czo-settings";
    boxes.style = "display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 175px));";
    boxes.appendChild(createCheckbox("Zeit+", "tm_czo_zeitplus"));
    boxes.appendChild(createCheckbox("Zett", "tm_czo_zett"));
    boxes.appendChild(createCheckbox("Verlagsangebote", "tm_czo_verlag"));
    boxes.appendChild(createCheckbox("Podcasts", "tm_czo_podcast"));
    boxes.appendChild(createCheckbox("Videos", "tm_czo_video"));
    boxes.appendChild(createCheckbox("Newsletter", "tm_czo_newsletter"));
    boxes.appendChild(createCheckbox("Känguru Comic", "tm_czo_comic"));
    boxes.appendChild(createCheckbox("Offline Angebot", "tm_czo_offline"));
    boxes.appendChild(createCheckbox("Wochenmarkt", "tm_czo_wochenmarkt"));
    boxes.appendChild(createCheckbox("Quiz + Nachbarartikel", "tm_czo_quiz"));
    boxes.appendChild(createCheckbox("Spiele", "tm_czo_spiele"));
    settings.appendChild(boxes);
    main.appendChild(settings);
});

// remove paywall footer
const callback = function(mutationsList, observer) {
    for(const mutation of mutationsList) {
        for (const node of mutation.addedNodes) {
            if (node.className?.startsWith("paywall-footer")) {
                hideNode(node);
                observer.disconnect();
            }
        }
    }
};

const observerFooter = new MutationObserver(callback);
observerFooter.observe(document.body, {childList: true});