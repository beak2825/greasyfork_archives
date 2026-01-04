// ==UserScript==
// @name         nhentai to exhentai and e-hentai
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Capture the title from nhentai and search for it on exhentai and e-hentai
// @run-at       document-end
// @match        *://nhentai.net/g/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517363/nhentai%20to%20exhentai%20and%20e-hentai.user.js
// @updateURL https://update.greasyfork.org/scripts/517363/nhentai%20to%20exhentai%20and%20e-hentai.meta.js
// ==/UserScript==

function createSearchUrl(site, cleanTitle) {
    return `https://${site}/?f_search=` + encodeURIComponent(`"${cleanTitle}"`);
}

function Url(site) {
    var html = document.getElementById("info");

    if (!html) {
        alert("Gallery info not found.");
        return;
    }

    var title = html.querySelector("h1");

    if (!title) {
        alert("Gallery title not found.");
        return;
    }

    var title2 = title.textContent.trim();

    var cleanTitle = title2.replace(/(\[.*?\]|\(.*?\))/g, '').trim();

    if (cleanTitle === "") {
        alert("Invalid title after removing brackets.");
        return;
    }

    window.location.href = createSearchUrl(site, cleanTitle);
}

function createButton(site, label) {
    var button = document.createElement("button");
    button.innerHTML = label;
    button.style.margin = "10px";
    button.style.padding = "10px 20px";
    button.style.backgroundColor = "#f0f0f0";
    button.style.border = "1px solid #ccc";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
    button.style.transition = "background-color 0.3s";

    button.addEventListener("mouseover", function() {
        button.style.backgroundColor = "#e0e0e0";
    });

    button.addEventListener("mouseout", function() {
        button.style.backgroundColor = "#f0f0f0";
    });

    button.addEventListener("click", function() {
        Url(site);
    });

    return button;
}

function addButtons() {
    var infoElement = document.getElementById("info");
    if (infoElement) {
        var exhButton = createButton("exhentai.org", "Exhentai");
        var ehButton = createButton("e-hentai.org", "E-Hentai");

        infoElement.appendChild(exhButton);
        infoElement.appendChild(ehButton);
    }
}

addButtons();
