// ==UserScript==
// @name         MangaDex Feed Filter
// @version      1
// @description  Filter groups from latest updates feed
// @license      WTFPL; https://spdx.org/licenses/WTFPL.html
// @grant        none
// @run-at       document-start
// @match        https://mangadex.org/*
// @namespace https://greasyfork.org/users/808460
// @downloadURL https://update.greasyfork.org/scripts/431346/MangaDex%20Feed%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/431346/MangaDex%20Feed%20Filter.meta.js
// ==/UserScript==

function main() {
    const GROUPS_TO_FILTER = new Set([
        "06a9fecb-b608-4f19-b93c-7caab06b7f44" // Bilibili
    ]);

    const realXHROpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function () {
        const url = arguments[1];
        if (typeof url === "string") {
            if (url.match(/https:\/\/api\.mangadex\.org\/manga\?limit=20/)) {
                arguments[1] = url + "&originalLanguage[]=ja";
            } else if (url.match(/https:\/\/api\.mangadex\.org\/chapter\?/)) {
                this.patchChapter = true;
            }
        }
        return realXHROpen.apply(this, arguments);
    };

    const realXHRSend = window.XMLHttpRequest.prototype.send;
    window.XMLHttpRequest.prototype.send = function () {
        if (this.patchChapter) {
            const origOnreadystatechange = this.onreadystatechange;
            this.onreadystatechange = function () {
                if (this.readyState === this.DONE) {
                    const data = JSON.parse(this.responseText);
                    if ("results" in data) {
                        data.results = data.results.filter(x => {
                            return !x.relationships.some(y => {
                                return GROUPS_TO_FILTER.has(y.id);
                            });
                        });
                    }
                    Object.defineProperty(this, "responseText", { writable: true });
                    this.responseText = JSON.stringify(data);
                }
                origOnreadystatechange.apply(this, arguments);
            }
        }
        return realXHRSend.apply(this, arguments);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const elem = document.body || document.head || document.documentElement;
    const script = document.createElement("script");
    script.appendChild(document.createTextNode("(" + main + ")();"));
    elem.appendChild(script);
});
