// ==UserScript==
// @name         SA - Wyświetl notatkę zwrotu na karcie zamówienia
// @namespace    http://your.namespace.example
// @version      1.1
// @description  Jeśli na stronie zamówienia pojawia się informacja o zgłoszonym zwrocie, skrypt pobiera stronę zwrotów, wyszukuje rekord zawierający dany numer zamówienia i wyświetla komentarz kupującego (z atrybutu title ikony) wstawiając go pod sekcją, która zawiera "Imię i nazwisko".
// @match        https://premiumtechpanel.sellasist.pl/admin/orders/edit/*
// @grant        none
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/533031/SA%20-%20Wy%C5%9Bwietl%20notatk%C4%99%20zwrotu%20na%20karcie%20zam%C3%B3wienia.user.js
// @updateURL https://update.greasyfork.org/scripts/533031/SA%20-%20Wy%C5%9Bwietl%20notatk%C4%99%20zwrotu%20na%20karcie%20zam%C3%B3wienia.meta.js
// ==/UserScript==

console.log("[SA-Return] Skrypt ViolentMonkey został uruchomiony.");

(async function() {
    'use strict';

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    async function fetchPage(url) {
        console.log("[SA-Return] Fetch:", url);
        const r = await fetch(url, { credentials: "include" });
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
    }

    function extractCommentFromIcon(doc, orderNumber) {
        const iconDivs = Array.from(doc.querySelectorAll("div.order-info-ico"));
        console.log("[SA-Return] Ikon znaleziono:", iconDivs.length);
        for (const div of iconDivs) {
            let c = div.parentElement, ok = false;
            for (let i=0; i<3; i++) {
                if (c && c.innerText.includes(orderNumber)) { ok = true; break; }
                c = c.parentElement;
            }
            if (ok) {
                const img = div.querySelector("img");
                if (img && img.src.includes("comment.png")) {
                    return img.title.trim();
                }
            }
        }
        return null;
    }

    function extractReturnLinkFromDOM(doc, orderNumber) {
        const iconDivs = Array.from(doc.querySelectorAll("div.order-info-ico"));
        for (const div of iconDivs) {
            let c = div.parentElement, ok = false;
            for (let i=0; i<3; i++) {
                if (c && c.innerText.includes(orderNumber)) { ok = true; break; }
                c = c.parentElement;
            }
            if (!ok) continue;
            const row = div.closest("tr");
            if (!row) continue;
            const a = row.querySelector("a[href*='/admin/returns/edit/']");
            if (a) return a.href;
        }
        return null;
    }

    async function initReturnNote() {
        if (!document.body.innerText.includes("Zamówienie zawiera zgłoszony zwrot lub reklamację")) {
            console.log("[SA-Return] Brak info o zwrocie.");
            return;
        }
        const orderNumber = location.pathname.split("/").pop();
        console.log("[SA-Return] Numer zamówienia:", orderNumber);

        const baseUrl = "https://premiumtechpanel.sellasist.pl/admin/returns/edit?status_id=24";
        let listHtml = await fetchPage(baseUrl);
        await sleep(3000);
        listHtml = await fetchPage(baseUrl + "&search=" + encodeURIComponent(orderNumber));

        const listDoc = new DOMParser().parseFromString(listHtml, "text/html");

        const detailsUrl = extractReturnLinkFromDOM(listDoc, orderNumber);
        if (!detailsUrl) {
            return console.warn("[SA-Return] Nie znalazłem linku do zwrotu.");
        }
        console.log("[SA-Return] Details URL:", detailsUrl);

        const detailsHtml = await fetchPage(detailsUrl);
        const detailsDoc = new DOMParser().parseFromString(detailsHtml, "text/html");

        const reasonEl = detailsDoc.querySelector("div[data-type='reason-text']");
        const reason   = reasonEl ? reasonEl.innerText.trim() : "Brak powodu";
        console.log("[SA-Return] Powód zwrotu:", reason);

        const comment = extractCommentFromIcon(listDoc, orderNumber) || "Brak komentarza";
        console.log("[SA-Return] Komentarz:", comment);

        displayReturnNote(reason, comment);
    }

    function displayReturnNote(reason, comment) {
        console.log("[SA-Return] Wyświetlam powód i komentarz");
        const box = document.createElement("div");
        box.style = `
            margin: 10px 0;
            padding: 10px;
            background: #00c8f8;
            border-radius: 4px;
            color: white;
            font-family: sans-serif;
            font-size: 14px;
        `;
        box.innerHTML = `
            <div><strong>Powód zwrotu:</strong> ${reason}</div>
            <div style="margin-top:6px;"><strong>Komentarz do zwrotu:</strong> ${comment}</div>
        `;

        const clientSection = Array.from(document.querySelectorAll("div.m-order-panel-section"))
            .find(div => div.innerText.includes("Imię i nazwisko"));
        if (clientSection && clientSection.parentNode) {
            clientSection.parentNode.insertBefore(box, clientSection.nextSibling);
        } else {
            document.body.insertBefore(box, document.body.firstChild);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initReturnNote);
    } else {
        initReturnNote();
    }

})();