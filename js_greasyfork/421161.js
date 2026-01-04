// ==UserScript==
// @name         immobilienscout24 - find new offers
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  immo alert
// @author       Peter Aba
// @match        https://www.immobilienscout24.de/Suche/*
// @grant        window.focus
// @grant        unsafeWindow
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/421161/immobilienscout24%20-%20find%20new%20offers.user.js
// @updateURL https://update.greasyfork.org/scripts/421161/immobilienscout24%20-%20find%20new%20offers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const time = () => {
        const dt = new Date(), hh = ("0" + dt.getHours()).slice(-2), mm = ("0" + dt.getMinutes()).slice(-2);

        return hh + ":" + mm;
    };

    const getCurrentTitles = () => {
        let currentTitles = [];

        const elements = document.querySelectorAll('.result-list-entry__brand-title');
        for (let i in elements) {
            let t = elements[i].innerText;

            if (t == undefined) {
                continue;
            }

            if (t.substr(0, 3) == "NEU") {
                currentTitles.push(t.substr(3).trim());
            } else {
                currentTitles.push(t);
            }
        }

        return currentTitles;
    };

    const getPreviousTitles = () => {
        const payload = localStorage.getItem("previous_titles");

        return JSON.parse(payload) || [];
    };

    const storePreviousTitles = (titles) => {
        if (!titles || titles.length == 0) {
            return;
        }

        localStorage.setItem("previous_titles", JSON.stringify(titles));
    };

    const getNewSince = () => {
        const ns = localStorage.getItem('new_since');

        if (typeof ns != "string") {
            return "";
        }

        return ns;
    };

    const setNewSince = () => {
        if (getNewSince() !== "") {
            return;
        }

        localStorage.setItem("new_since", time());
    };

    const unsetNewSince = () => {
        localStorage.removeItem("new_since");
    };

    const hasTitle = (currentTitle, previousTitles) => {
        if (previousTitles.length == 0) {
            console.log("empty previousTitles", previousTitles);
            return false;
        }

        for (let i in previousTitles) {
            if (currentTitle === previousTitles[i]) {
                return true;
            }
        }

        return false;
    };

    let markNewInterval = null;
    const markNew = (title, done) => {
        let count = 1, t0 = "New immo @ " + getNewSince();

        markNewInterval = window.setInterval(() => {
            const n = count % 5, t = "!".repeat(n) + " " + t0;

            count++;

            document.title = t;
        }, 300);

        GM_notification({highlight: true, title: t0, text: title, timeout: 0}, done);
    };

    let markOKSet = false;
    const markOK = () => {
        if (markOKSet) {
            return;
        }

        if (markNewInterval !== null) {
            clearInterval(markNewInterval);
            markNewInterval = null;
            markOKSet = true;
        }

        document.title = 'OK - ' + time();
    };

    const refresh = () => {
        window.setTimeout(() => {location.reload(true);}, 3 * 60 * 1000);
    }

    const main = () => {
        const currentTitles = getCurrentTitles(), previousTitles = getPreviousTitles();

        //console.log(currentTitles[0], previousTitles);

        if (currentTitles.length < 1) {
            console.error("invalid currentTitles", currentTitles);
        }

        const done = () => {
            markOK();
            unsetNewSince();
        };

        if (previousTitles && !hasTitle(currentTitles[0], previousTitles)) {
            //console.log("new");
            setNewSince();
            markNew(currentTitles[0], done);
        } if (getNewSince() !== "") {
            //console.log("unchecked");
            markNew(currentTitles[0], done);
        } else {
            //console.log("ok");
            unsetNewSince();
            markOK();
        }

        window.addEventListener('focus', done);
        document.addEventListener('click', done);
        document.addEventListener("scroll", done);

        storePreviousTitles(currentTitles);

        refresh();
    }

    main();
})();