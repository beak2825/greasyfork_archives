// ==UserScript==
// @name         VNDB GOG Enhancer
// @namespace    https://vndb.org/
// @version      1.1
// @description  Enhances GOG game pages with data from VNDB.
// @author       darklinkpower
// @match        https://www.gog.com/*/game/*
// @match        https://www.gog.com/game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gog.com
// @grant        GM_xmlhttpRequest
// @connect      api.vndb.org
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497691/VNDB%20GOG%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/497691/VNDB%20GOG%20Enhancer.meta.js
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
    function GetAppIDFromUrl()
    {
        var currentURL = window.location.href;
        var idPattern = /\/game\/([^\/?#]+)/;
        var match = currentURL.match(idPattern);

        if (match && match.length > 1) {
            return  match[1];
        } else {
            console.log("Id not found from url");
            return null;
        }
    }

    function GetCurrentAppID()
    {
        if(!CurrentAppID)
        {
            CurrentAppID = GetAppIDFromUrl();
        }

        return CurrentAppID;
    }

    function makeRow(rowClass, categoryText, contentText, contentUrl) {
        const row = document.createElement("div");
        row.className = "table__row details__row " + rowClass;

        const category = document.createElement("div");
        category.className = "details__category table__row-label";
        category.textContent = categoryText;

        const content = document.createElement("div");
        content.className = "details__content table__row-content";

        if (contentUrl) {
            const contentEl = document.createElement("a");
            contentEl.className = "details__link";
            contentEl.textContent = contentText;
            contentEl.href = contentUrl;
            content.appendChild(contentEl);
        } else {
            content.textContent = contentText;
        }

        row.appendChild(category);
        row.appendChild(content);

        return row;
    }

    let appId = GetCurrentAppID();
    if (appId == null) {
        return;
    }

    GM_xmlhttpRequest({
        method: "POST",
        url: "https://api.vndb.org/kana/vn",
        data: JSON.stringify({
            "filters": ["release", "=", ["extlink", "=", ["gog", appId]]],
            "fields": "length,length_votes,length_minutes,rating,votecount"
        }),
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(response) {
            let result = JSON.parse(response.responseText);
            if (!result.results || result.results.length == 0) {
                return;
            }

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

            const gogInfoContainer = document.createElement("div");
            gogInfoContainer.className = "content-summary-section";
            gogInfoContainer.setAttribute("content-summary-section-id", "vndbInfo");

            const panelTitle = document.createElement('div');
            panelTitle.className = 'title title--no-margin';

            const titleText = document.createElement('div');
            titleText.className = 'title__underline-text';
            titleText.textContent = 'VNDB Information';
            panelTitle.appendChild(titleText);
            gogInfoContainer.appendChild(panelTitle);

            const panelContent = document.createElement('div');
            panelContent.className = 'details table table--without-border';
            gogInfoContainer.appendChild(panelContent);

            rows.forEach(function(row) {
                panelContent.appendChild(row);
            });

            const sideColumn = document.querySelector('.layout-side-col');
            if (sideColumn) {
                sideColumn.insertBefore(gogInfoContainer, sideColumn.firstChild);
            } else {
                console.log("Target container element not found.");
            }
        }
    });
})();