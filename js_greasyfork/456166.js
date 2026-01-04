// ==UserScript==
// @name         VNDB Steam Enhancer
// @namespace    https://vndb.org/
// @version      0.1
// @description  Enhance Steam app pages with data from VNDB.
// @author       Midori Kochiya
// @match        https://store.steampowered.com/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        GM_xmlhttpRequest
// @connect      api.vndb.org
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456166/VNDB%20Steam%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/456166/VNDB%20Steam%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LENGTH_MAP = {
        1: "Very short",
        2: "Short",
        3: "Medium",
        4: "Long",
        5: "Very long"
    };

    function formatMinutes(minutes) {
        if (minutes < 60) {
            return "" + minutes + "m";
        }
        return "" + Math.floor(minutes / 60) + "h" + (minutes % 60) + "m";
    }

    // From SteamDB
    var CurrentAppID;
    function GetAppIDFromUrl( url )
    {
        const appid = url.match( /\/(?:app|sub|bundle|friendsthatplay|gamecards|recommended|widget)\/(?<id>[0-9]+)/ );

        return appid ? parseInt( appid.groups.id, 10 ) : -1;
    }
    function GetCurrentAppID()
    {
        if( !CurrentAppID )
        {
            CurrentAppID = GetAppIDFromUrl( location.pathname );
        }

        return CurrentAppID;
    }

    function makeRow(rowClass, subtitle, linkText, linkUrl) {
        const row = document.createElement("div");
        row.className = "dev_row " + rowClass;

        const subtitleEl = document.createElement("div");
        subtitleEl.className = 'subtitle column';
        subtitleEl.textContent = subtitle;

        let linkEl;
        if (linkUrl) {
            linkEl = document.createElement("a");
            linkEl.className = "date";
            linkEl.textContent = linkText;
            linkEl.href = linkUrl;
        } else {
            linkEl = document.createElement("div");
            linkEl.className = "date";
            linkEl.textContent = linkText;
        }

        row.appendChild(subtitleEl);
        row.appendChild(linkEl);

        return row;
    }

    let appId = GetCurrentAppID();
    if (appId == -1) {
        return;
    }

    GM_xmlhttpRequest({
        method: "POST",
        url: "https://api.vndb.org/kana/vn",
        data: JSON.stringify({
            "filters": ["release", "=", ["extlink", "=", ["steam", appId]]],
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
                "VNDB",
                item.id,
                "https://vndb.org/" + item.id
            );

            const rows = [
                vndbIdRow,
            ];

            if (item.rating) {
                rows.push(makeRow(
                    "vndb_rating",
                    "VNDB Rating",
                    "" + item.rating + " (" + item.votecount + ")"
                ));
            }

            if (item.length) {
                let lengthText = LENGTH_MAP[item.length];

                if (item.length_minutes && item.length_votes) {
                    lengthText += " (" + formatMinutes(item.length_minutes) + " from " + item.length_votes + " votes)";
                }

                rows.push(makeRow(
                    "vndb_length",
                    "VNDB Length",
                    lengthText
                ));
            }

            // Reverse due to how they are inserted
            rows.reverse();
            const releaseDate = document.querySelector('.release_date');

            if( releaseDate ){
                for (const el of rows) {
                    releaseDate.parentNode.insertBefore(el, releaseDate.nextSibling);
                }
            } else {
                const firstDevRow = document.querySelector( '.glance_ctn_responsive_left .dev_row' );
                if(firstDevRow) {
                    for (const el of rows) {
                        firstDevRow.parentNode.insertBefore(el, firstDevRow);
                    }
                }
            }
        }
    });
})();