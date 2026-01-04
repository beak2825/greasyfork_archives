// ==UserScript==
// @name         IMASBBS Favs
// @namespace    https://github.com/sakuro/
// @version      1.1.0
// @description  IMASBBSのスレをふぁぼる機能を追加します。
// @author       sakuro
// @match        http://imasbbs.com/
// @match        http://imasbbs.com/patio.cgi*
// @match        https://imasbbs.com/
// @match        https://imasbbs.com/patio.cgi*
// @icon         https://www.google.com/s2/favicons?domain=imasbbs.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453065/IMASBBS%20Favs.user.js
// @updateURL https://update.greasyfork.org/scripts/453065/IMASBBS%20Favs.meta.js
// ==/UserScript==

// jshint esversion: 6
(function () {
    'use strict';

    const styles = document.styleSheets[0];
    styles.insertRule(".starred { color: #fc0; text-shadow: 1px 1px 1px #666; }");
    styles.insertRule(".star { color: #000; cursor: pointer }");

    class Stars {
        constructor() {
            this.load();
        }

        add(thread) {
            this.stars.set(thread, new Date());
            this.save();
        }

        updateTimeStamp(thread) {
            this.stars.set(thread, new Date());
            this.save();
        }

        remove(thread) {
            this.stars.delete(thread);
            this.save();
        }

        isStarred(thread) {
            return this.stars.has(thread);
        }

        load() {
            const data = localStorage.getItem("stars");
            this.stars = data ? new Map(JSON.parse(data).map((e) => [e[0], new Date(e[1])])) : new Map();
        }

        save() {
            if (this.stars.size == 0) {
                localStorage.removeItem("stars");
            } else {
                localStorage.setItem("stars", JSON.stringify([...this.stars]));
            }
        }

        clear() {
            this.stars = new Map();
            this.save();
        }
    }

    const stars = new Stars();

    class Star {
        constructor(thread, starred) {
            this.thread = thread;
            this.starred = starred;
            this.element = document.createElement("span");
            this.element.classList.add("star");
            this.element.addEventListener("click", (e) => {
                if (stars.isStarred(thread)) {
                    this.unstar();
                } else {
                    this.star();
                }
            });
            if (starred) {
                this.star();
            } else {
                this.unstar();
            }
        }

        star() {
            this.starred = true;
            this.element.classList.add("starred");
            this.element.textContent = "★";
            stars.add(this.thread);
        }

        unstar() {
            this.starred = false;
            this.element.classList.remove("starred");
            this.element.textContent = "☆";
            stars.remove(this.thread);
        }
    }

    const threadList = document.querySelector("table.bbs-item");
    const thread = new URLSearchParams(location.search).get("read");

    const rowId = (row) => {
        const link = row.querySelector("td:nth-child(2) a");
        const params = new URLSearchParams(new URL(link.href, location).search);
        return params.get("read");
    };

    const compare = (a, b) => {
        const aid = rowId(a);
        const bid = rowId(b);

        const aStar = stars.isStarred(aid);
        const bStar = stars.isStarred(bid);

        const aText = a.querySelector('td.w14e').textContent;
        const bText = b.querySelector('td.w14e').textContent;
        if (aStar < bStar) { return 1; }
        if (aStar > bStar) { return -1; }
        return bText.localeCompare(aText);
    };

    if (threadList) { // 一覧ページ
        const [head, ...rows] = threadList.querySelectorAll("tr");
        const title = head.querySelector("th:nth-child(1)");

        const array = Array.from(rows);
        const sortedRows = array.slice(1).sort((a, b) => compare(a, b));

        threadList.innerHTML = '';
        threadList.appendChild(head);
        sortedRows.forEach((row) => {
            threadList.appendChild(row);
            const title = row.querySelector("td:nth-child(2)");
            const link = title.querySelector("a");
            const tid = new URLSearchParams(new URL(link.attributes.getNamedItem("href").value, location).search).get("read");
            const star = new Star(tid, stars.isStarred(tid));

            title.insertAdjacentElement("afterbegin", star.element);
            link.addEventListener('click', (e) => {
                if (stars.isStarred(tid)) {
                    stars.updateTimeStamp(tid);
                }
            });
        });
    } else if (thread) { // スレページ
        const title = document.querySelector("#tr-ttl");
        const star = new Star(thread, stars.isStarred(thread));
        title.insertAdjacentElement("afterbegin", star.element);
    }
})();