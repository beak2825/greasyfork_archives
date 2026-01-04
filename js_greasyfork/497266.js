// ==UserScript==
// @name         VNDB JAST USA Enhancer
// @namespace    https://vndb.org/
// @version      1.3
// @description  Enhances JAST app pages with data from VNDB.
// @author       darklinkpower
// @match        https://jastusa.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jastusa.com
// @grant        GM_xmlhttpRequest
// @connect      api.vndb.org
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497266/VNDB%20JAST%20USA%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/497266/VNDB%20JAST%20USA%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const VN_LENGTH = {
        0: { txt: 'Unknown',    time: '',                   low: 0,       high: 0 },
        1: { txt: 'Very short', time: 'Less than 2 hours',  low: 1,       high: 2 * 60 },
        2: { txt: 'Short',      time: '2 - 10 hours',       low: 2 * 60,  high: 10 * 60 },
        3: { txt: 'Medium',     time: '10 - 30 hours',      low: 10 * 60, high: 30 * 60 },
        4: { txt: 'Long',       time: '30 - 50 hours',      low: 30 * 60, high: 50 * 60 },
        5: { txt: 'Very long',  time: 'More than 50 hours', low: 50 * 60, high: 32767 }
    };
 
    function formatMinutes(minutes) {
        if (minutes < 60) {
            return "" + minutes + "m";
        }
 
        return "" + Math.floor(minutes / 60) + "h" + (minutes % 60) + "m";
    }
 
    function getMinutesMatchingLength(minutes) {
        for (let key in VN_LENGTH) {
            const vnLenght = VN_LENGTH[key];
            if (minutes >= vnLenght.low && minutes < vnLenght.high) {
                return vnLenght;
            }
        }
 
        return VN_LENGTH[0];
    }

    var CurrentAppID;
    function GetAppIDFromUrl() {
        var currentURL = window.location.href;
        var idPattern = /\/games\/([^/]+)/;
        var match = currentURL.match(idPattern);

        if (match && match.length > 1) {
            return match[1];
        } else {
            console.log("Id not found from url");
            return null;
        }
    }

    function GetCurrentAppID() {
        if (!CurrentAppID) {
            CurrentAppID = GetAppIDFromUrl();
        }

        return CurrentAppID;
    }

    function makeRow(rowClass, subtitle, linkText, linkUrl) {
        const row = document.createElement("div");
        row.className = "info-row";

        const label = document.createElement("span");
        label.className = "info-row__label";
        label.textContent = subtitle;

        const value = document.createElement("div");
        value.className = "info-row__value";

        let linkEl;
        if (linkUrl) {
            linkEl = document.createElement("a");
            linkEl.className = "info-row__link";
            linkEl.textContent = linkText;
            linkEl.href = linkUrl;
        } else {
            linkEl = document.createElement("span");
            linkEl.className = "info-row__text";
            linkEl.textContent = linkText;
        }

        value.appendChild(linkEl);
        row.appendChild(label);
        row.appendChild(value);

        return row;
    }

    function insertPanel(result) {
        let item = result.results[0];

        const vndbIdRow = makeRow(
            "vndb_id",
            "Id",
            item.id,
            "https://vndb.org/" + item.id
        );

        const rows = [
            vndbIdRow,
        ];

        if (item.rating) {
            rows.push(makeRow(
                "vndb_rating",
                "Rating",
                "" + item.rating + " (" + item.votecount + ")"
            ));
        }

        let lengthText = ""
        if (item.length_minutes && item.length_votes)
        {
            const timeDescription = getMinutesMatchingLength(item.length_minutes).txt
            const formattedMinutes = formatMinutes(item.length_minutes)
            lengthText = `${timeDescription} (${formattedMinutes} from ${item.length_votes} votes)`;
        }
        else if (item.length) {
            const mappedLength = VN_LENGTH[item.length];
            lengthText = mappedLength.txt;
            if (item.length != 0)
            {
                lengthText += ` (${mappedLength.time})`;
            }
        }

        if (lengthText != "")
        {
            rows.push(makeRow(
                "vndb_length",
                "Play time",
                lengthText
            ));
        }

        let vndbInfoContainer = document.createElement("div");
        vndbInfoContainer.className = "game-info vndb-infos";

        let panelTitle = document.createElement('h3');
        panelTitle.classList.add('game-info__title');
        panelTitle.textContent = 'VNDB';
        vndbInfoContainer.appendChild(panelTitle);

        let panelContent = document.createElement('div');
        panelContent.classList.add('game-info__content');
        vndbInfoContainer.appendChild(panelContent);

        rows.forEach(function(row) {
            panelContent.appendChild(row);
        });

        let gameInfoPanel = document.querySelector('.game-info.game-info--basic');
        if (gameInfoPanel) {
            gameInfoPanel.parentNode.insertBefore(vndbInfoContainer, gameInfoPanel);
        } else {
            console.log("Game info panel not found");
        }
    }

    function fetchVNDBData() {
        let appId = GetCurrentAppID();
        if (appId == null) {
            return;
        }

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.vndb.org/kana/vn",
            data: JSON.stringify({
                "filters": ["release", "=", ["extlink", "=", ["jastusa", appId]]],
                "fields": "length,length_votes,length_minutes,rating,votecount"
            }),
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                let result = JSON.parse(response.responseText);
                if (!result.results || result.results.length == 0) {
                    console.log("VNDB search did not yield results");
                    return;
                }

                insertPanel(result);
            }
        });
    }

    function observeUrlChanges() {
        let lastUrl = window.location.href;

        const onUrlChange = () => {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                console.log("URL changed to " + currentUrl);
                CurrentAppID = null;
                fetchVNDBData();
            }
        };

        const observer = new MutationObserver(onUrlChange);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function onInitialLoad() {
        window.removeEventListener('load', onInitialLoad);
        fetchVNDBData();
        observeUrlChanges();
    }

    window.addEventListener('load', onInitialLoad);
})();
