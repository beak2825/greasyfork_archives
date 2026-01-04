// ==UserScript==
// @name         Okoun - Živé identity
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  try to take over the world!
// @author       cestujicivnoci
// @match        https://www.okoun.cz/*
// @include      *.okoun.cz/*
// @icon         https://opu.peklo.biz/p/23/07/24/1690208260-9b0c4.png

// @icon         https://www.google.com/s2/favicons?sz=64&domain=okoun.cz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497546/Okoun%20-%20%C5%BDiv%C3%A9%20identity.user.js
// @updateURL https://update.greasyfork.org/scripts/497546/Okoun%20-%20%C5%BDiv%C3%A9%20identity.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const localStorageKey = 'zive_identity';
const localStorageTimestampKey = 'zive_identity_timestamp';

function getWhitelistFromLocalStorage() {
    const data = localStorage.getItem(localStorageKey);
    return data ? data.split(',') : [];
}

function setWhitelistToLocalStorage(identities) {
    localStorage.setItem(localStorageKey, identities.join(','));
    localStorage.setItem(localStorageTimestampKey, new Date().getTime());
}

function fetchWhitelistFromServer() {
    return fetch('/boards/zive_identity')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const dataUzivatele = doc.querySelector('.data_uzivatele').textContent.trim();
            return dataUzivatele ? dataUzivatele.split(/\s*,\s*/) : [];
        });
}

function updateWhitelistIfNeeded() {
    const timestamp = localStorage.getItem(localStorageTimestampKey);
    const now = new Date().getTime();

    if (!timestamp || (now - timestamp > 10 * 60 * 1000)) { // 10 minut
        return fetchWhitelistFromServer().then(function (identities) {
            setWhitelistToLocalStorage(identities);
            return identities;
        });
    } else {
        return Promise.resolve(getWhitelistFromLocalStorage());
    }
}

function hideContentForWhitelistedUsers() {
    const whitelist = getWhitelistFromLocalStorage();

    document.querySelectorAll('.item').forEach(function (item) {
        const user = item.querySelector('span.user').textContent.trim();

        if (!whitelist.includes(user)) {
            const content = item.querySelector('.content');
            if (content) {
                const reportOkUrl = `/boards/zive_identity?wl_report_user=${user}`;
                const reportParazitaUrl = `/boards/ryba_bez_parazitu?report_user=${user}`;

                // Vytvoření odkazu "Reportuj ok uživatele"
                const reportOkLink = document.createElement('a');
                reportOkLink.href = reportOkUrl;
                reportOkLink.style.background = 'green';
                reportOkLink.style.color = 'white';

                reportOkLink.style.fontSize = '15px';
                reportOkLink.textContent = 'Reportuj ok uživatele';

                // Vytvoření odkazu "Náhled"
                const previewLink = document.createElement('a');
                previewLink.href = '#';
                previewLink.style.background = 'lightblue';
                previewLink.style.fontSize = '15px';
                previewLink.style.marginLeft = '10px';
                previewLink.textContent = 'Náhled';
                previewLink.addEventListener('click', function (event) {
                    event.preventDefault();
                    content.style.position = 'relative';
                    const overlay = document.createElement('div');
                    overlay.style.position = 'absolute';
                    overlay.style.top = '0';
                    overlay.style.left = '0';
                    overlay.style.width = '100%';
                    overlay.style.height = '100%';
                    overlay.style.backgroundColor = 'transparent' // Poloprůhledný filtr
                    overlay.style.pointerEvents = 'none';
                    content.appendChild(overlay);
                    content.style.display = 'block';
                });

                // Vytvoření odkazu "Reportuj parazita"
                const reportParazitaLink = document.createElement('a');
                reportParazitaLink.href = reportParazitaUrl;
                reportParazitaLink.style.background = 'red';
                reportParazitaLink.style.color = 'white';
                reportParazitaLink.style.fontSize = '15px';
                reportParazitaLink.style.marginLeft = '10px';
                reportParazitaLink.textContent = 'Reportuj parazita';

                content.style.display = 'none';
                item.querySelector('.meta').appendChild(reportOkLink);
                item.querySelector('.meta').appendChild(previewLink);
                item.querySelector('.meta').appendChild(reportParazitaLink);
            }
        }
    });
}

function getParameterFromURL(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

updateWhitelistIfNeeded().then(hideContentForWhitelistedUsers);

if (window.location.pathname === "/boards/zive_identity") {
    var wl_report_user = getParameterFromURL("wl_report_user", window.location.search);

    if (wl_report_user) {
        document.querySelectorAll("div.content.post").forEach(function (postContent) {
            postContent.style.display = 'block';
        });

        var postBody = document.getElementById("post-body");
        if (postBody) {
            postBody.focus();
            postBody.textContent = "existuje: " + wl_report_user;
            document.querySelector('select[name="bodyType"]').value = "html";
        }
    }
}

})();