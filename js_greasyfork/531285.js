// ==UserScript==
// @name         GGn SteamDB OST Uploady NEW
// @version      0.0.1
// @include      https://gazellegames.net/upload.php*
// @include      https://gazellegames.net/torrents.php?action=editgroup&groupid=*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @description  Uploady for SteamDB OSTs
// @author       Wealth
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @grant        GM.addStyle
// @namespace https://greasyfork.org/users/1395131
// @downloadURL https://update.greasyfork.org/scripts/531285/GGn%20SteamDB%20OST%20Uploady%20NEW.user.js
// @updateURL https://update.greasyfork.org/scripts/531285/GGn%20SteamDB%20OST%20Uploady%20NEW.meta.js
// ==/UserScript==
/* globals $ */


(function () {
    'use strict';

    function fetchSteampage(appid) {
        const url = `https://store.steampowered.com/app/${appid}/`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (response) {
                if (response.status === 200) {
                    console.log("Got steam page.");
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');

                    const appName = doc.querySelector("#appHubAppName")?.textContent?.trim(); // OST Name

                    const album_metadata = parseHTMLTable(doc.querySelector(".album_metadata_table"));
                    const artist_row = album_metadata.find(row => row[0].toLowerCase().includes("artist"));
                    const artist = artist_row ? artist_row[1] : "N/A"; // Artist Name

                    const release_date = doc.querySelector(".release_date .date")?.textContent?.trim(); // Release date

                    const app_details = parseDetails(doc.querySelector('#genresAndManufacturer')); // App Details

                    const tracklist_content = doc.querySelector(".music_album_track_list_contents");
                    const discs = tracklist_content.querySelectorAll(".music_album_track_listing_ctn");
                    let tracklist = "[align=center][u][b]Tracklist[/align]\n"; // track list
                    let total_length = 0;
                    for (let i = 0; i < discs.length; i++) {
                        if (discs.length > 1) {
                            tracklist += "[b]Disc " + Number(i+1) + "[/b]\n";
                        }
                        const tracks = discs[i].querySelectorAll(".music_album_track_ctn");
                        tracks.forEach((track) => {
                            let length = track.querySelector('.music_album_track_duration')?.textContent?.trim();
                            tracklist += "[#] " + track.querySelector('.music_album_track_name')?.textContent?.trim() + " [i](" + length + ")[/i]\n";
                            const [minute, second] = length.split(":").map(Number);
                            total_length += minute * 60 + second
                        });
                    }
                    const minutes = Math.floor(total_length/60);
                    const seconds = String(total_length % 60).padStart(2, '0');
                    tracklist += "[b]Total length[/b]: " + minutes + ":" + seconds;

                    setTitle(appName + " by " + artist);
                    setReleaseYear(release_date.split(", ")[1]);
                    //setCover(tbd);
                    let description = "[align=center][u][b]" + appName + "[/b]\n";
                    description += "[i][size=1]by[/i] [b]" + artist + "[/b][/align]\n\n"
                    description += "[*][b]Catalog Number[/b]: N/A\n";
                    description += "[*][b]Release date[/b]: " + release_date + "\n";
                    album_metadata.forEach((row) => {
                        description += "[*][b]" + row[0] + "[/b]: " + row[1] + "\n";
                    });
                    Object.keys(app_details).forEach((key) => {
                        if (!key.includes("Developer")) {
                            description += "[*][b]" + key + "[/b]: " + app_details[key] + "\n";
                        }
                    });
                    description += "\n" + tracklist;
                    setDescription(description);
                }
            }
        });
    }

    function parseDetails(details) {
        let app_details = [];
        details.querySelectorAll('.dev_row').forEach((row) => {
            let [header, value] = row.innerText.split(":");
            header = header.toLowerCase().trim();
            app_details[header.charAt(0).toUpperCase() + header.substring(1)] = value.trim();
        });
        return app_details;
    }

    function parseHTMLTable(table) {
        const rows = Array.from(table.rows);
        if (rows.length === 0) {
            console.error('Table has no rows');
            return [];
        }
        const headers = Array.from(rows).map(cell => cell.childNodes[1].textContent.trim().replace(":", ""));
        const data = Array.from(rows).map(cell => cell.childNodes[3].textContent.trim());

        return headers.map(function(e, i) { return [e, data[i]]; });
    }

    function setTitle(title) {
        document.querySelector('#title').value = title;
    }

    function setReleaseYear(year) {
        document.querySelector("#year").value = year;
    }

    function setCover(cover) {
        document.querySelector("#image").value = cover;
    }

    function setDescription(description) {
        document.querySelector("#album_desc").value = description;
    }

    function setup() {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Steam appid';
        input.id = 'steamid';
        document.querySelector("#torrent_type td:has(select)").appendChild(input);

        input.addEventListener('blur', () => {
            const value = input.value.trim();
            if (value) {
                fetchSteampage(value);
            }
        });
    }

    const selector = document.querySelector('#categories');
    if (selector.value === "OST") {
        setup();
    } else {
        selector.addEventListener("change", function() {
            if (this.value === "OST") {
                setup();
            }
        });
    }
})();