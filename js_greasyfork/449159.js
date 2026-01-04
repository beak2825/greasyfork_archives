// ==UserScript==
// @name         enrtyNo
// @namespace    https://eksisozluk.com/biri/bagcivan
// @version      0.6
// @description  ekşi sözlük entrylerine sıra numarası verme aracı
// @author       Tevfik Bagcivan
// @match        https://eksisozluk.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eksisozluk.com
// @grant        nones
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449159/enrtyNo.user.js
// @updateURL https://update.greasyfork.org/scripts/449159/enrtyNo.meta.js
// ==/UserScript==

(function() {
      'use strict';
    const entrylerElementi = document.getElementById("entry-item-list");
    const entryler = Array.from(entrylerElementi.querySelectorAll("#entry-item"));
    const currentPage = document.querySelector('.pager')?.dataset?.currentpage ?? '1';
    const pagerElementi = document.querySelector(".pager");
    const sonSayfa = parseInt(pagerElementi?.dataset?.pagecount ?? '1');
    const entrylerSayisi = entryler.length;
    const sonSayfadakiEntrySayisi = entrylerSayisi % 25 || 25;
    const sonSayfadakiIlkEntry = (sonSayfa - 1) * 25 + 1;
    const sonSayfadakiSonEntry = (sonSayfa - 1) * 25 + sonSayfadakiEntrySayisi;

    const toastMessage = document.createElement("div");
    Object.assign(toastMessage, {
        id: "entry-link-toast",
        style: "position: fixed; bottom: 30px; right: 30px; padding: 10px; background-color: rgba(0,0,0,0.7); color: #fff; border-radius: 5px; display: none; z-index: 1000;"
    });
    document.querySelector("footer").appendChild(toastMessage);

    const promises = entryler.map((entry, index) => {
        const entryNo = (currentPage - 1) * 25 + (index + 1);
        if (currentPage === sonSayfa && index >= sonSayfadakiEntrySayisi) return Promise.resolve();
        const entryNoElementi = document.createElement("a");
        Object.assign(entryNoElementi.style, {
            "font-weight": "bold",
            "margin-right": "1px",
            "color": "#43A245"
        });
        Object.assign(entryNoElementi, {
            textContent: `${entryNo}.`,
            className: "entryNo"
        });

        entryNoElementi.addEventListener("click", function(event) {
            event.preventDefault();

            const entryLink = entry.querySelector('.entry-date.permalink').href;
            navigator.clipboard.writeText(entryLink)
                .then(() => {
                toastMessage.textContent = "Link kopyalandı: " + entryLink;
                toastMessage.style.display = "block";

                setTimeout(() => {
                    toastMessage.style.display = "none";
                }, 1000);
            })
                .catch((error) => {
                console.error("Link kopyalanamadı: " + error);
            });
        });

        const content = entry.querySelector("#entry-item > div.content");
        content.insertAdjacentElement("afterbegin", entryNoElementi);

        const yazarNick = entry.dataset.author;
        const profilURL = `https://eksisozluk.com/biri/${yazarNick}`;

        return fetch(profilURL)
            .then(response => response.text())
            .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            try {
                const puanBilgisi = doc.querySelector("#content-body > div.profile-top-container > p").textContent;
                const puanElementi = document.createElement("div");
                Object.assign(puanElementi, {
                    className: "puan",
                    style: "font-size: 80%;",
                    textContent: puanBilgisi
                });
                const yazarBilgisi = entry.querySelector("#entry-author");
                yazarBilgisi.appendChild(puanElementi);
            } catch (e) {
                const puanElementi = document.createElement("div");
                Object.assign(puanElementi, {
                    className: "puan",
                    style: "font-size: 80%;",
                    textContent: "karmasız (0)"
                });
                const yazarBilgisi = entry.querySelector("#entry-author");
                yazarBilgisi.appendChild(puanElementi);
            }
        })
            .catch(console.error);
    });
    Promise.all(promises).catch(console.error);

})();