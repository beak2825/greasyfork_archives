// ==UserScript==
// @name         Disponibilité BM Lyon
// @namespace    https://catalogue.bm-lyon.fr/
// @version      2024.12.30-1
// @description  Affiche la disponibilité des livres dans une liste de la BM Lyon
// @author       Eldeberen
// @match        https://catalogue.bm-lyon.fr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bm-lyon.fr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522287/Disponibilit%C3%A9%20BM%20Lyon.user.js
// @updateURL https://update.greasyfork.org/scripts/522287/Disponibilit%C3%A9%20BM%20Lyon.meta.js
// ==/UserScript==

function icon(desc) {
    // Icônes en fonction du statut
    switch(desc) {
        case "En rayon": return "✅";
        case "En prêt": return "❌";
        case "Réservé": return "🔒";
        case "En retard": return "⏰";
        default: return "";
    }
}

async function checkAvailability(link) {
    const id = link.href.match(/id=(.+?)&/)[1];
    const span = link.querySelector("h6 span");

    // Équivalence entre ID de liste et nom de bibliothèque
    const library_code = {
        "fde0bc1d-ae98-4080-a550-88289795d981": "2e arrdt",
        "5271f024-ba79-4fb0-bcaa-1da32a52a495": "Part-Dieu",
        "e0024cc2-339d-4c6c-bcef-10276985530d": "7e arrdt - J. Macé",
    }[window.location.href.split("/").reverse()[0]];

    console.log("Checking " + link.title);
    console.log(span);

    span.innerHTML = "🔄️" + link.title;

    const response = await fetch(`https://catalogue.bm-lyon.fr/in/rest/api/notice?id=${id}&locale=fr&aspect=Stock&opac=true`, {
        "referrer": "https://catalogue.bm-lyon.fr/",
    });
    const data = await response.json();

    for (const library of data.monographicCopies) {
        if (library.data.branch_desc == library_code) {
            let states = "";
            for (const book of library.children) {
                states += icon(book.data.stat_desc);
            }
            span.innerHTML = states + link.title;
            return;
        }
    }
    span.innerHTML = "" + link.title;
}

function addObserver(selector, callback) {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                node.querySelectorAll(selector).forEach(e => callback(e));
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

(function() {
    'use strict';

    addObserver("a[href^='/notice?id=']", async (element) => {
        checkAvailability(element);
    });
})();
