// ==UserScript==
// @name         Metalcore Weekly Release Thread
// @namespace    http://tampermonkey.net/
// @version      0.61
// @description  Mark up the r/Metalcore Weekly Release Threads
// @author       nuentes
// @match        https://old.reddit.com/r/Metalcore/comments/*/weekly_release_thread*
// @match        https://www.reddit.com/r/Metalcore/comments/*/weekly_release_thread*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/537368/Metalcore%20Weekly%20Release%20Thread.user.js
// @updateURL https://update.greasyfork.org/scripts/537368/Metalcore%20Weekly%20Release%20Thread.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const GOOGLE_SHEET_API = 'https://script.google.com/macros/s/AKfycbxAtYySUoh90evXB-qPSzc-bdhnC7Op9ozaYwYZGtNfdWAdtfq5RsGwdXHPBLLacoMdiw/exec';
    const THREAD_ID = location.pathname.split('/')[4];

    const defaultConfig = {
        favoriteArtists: ["A Day To Remember", "Architects", "As I Lay Dying", "August Burns Red", "Beartooth", "Bring Me The Horizon", "Counterparts", "Currents", "Erra", "Ice Nine Kills", "Killswitch Engage", "Knocked Loose", "Northlane", "Parkway Drive", "Polaris", "Spiritbox", "The Devil Wears Prada", "Wage War"],
        favColor: "#a0e0bd",
        ffoColor: "#dd9897"
    };
    function postDate() {
        const url = window.location.href;

        const trimmed = url.match(/weekly_release_thread_(.*)/i)
        const dateString = trimmed[1].match(/(\w+)_(\d{1,2})(th|rd|nd|st).*?(\d{4})?/i);

        const monthName = dateString[1];
        const day = String(parseInt(dateString[2])).padStart(2, '0');

        // Convert month name to number
        const months = {
            jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
        };
        const month = months[monthName.substr(0, 3).toLowerCase()];

        let year;
        if (dateString[4] !== undefined) {
            year = dateString[4]
        } else {
            // fallback to post date
            const postDateText = document.querySelector("time")?.getAttribute("datetime");
            if (!postDateText) return null;

            const postDateObj = new Date(postDateText);
            year = postDateObj.getFullYear();
        }

        return `${year}-${month}-${day}`;
    }


    const CONFIG = JSON.parse(localStorage.getItem('mcw-config') || JSON.stringify(defaultConfig));

    function extractArtistNames(releaseLines) {
        const artistMap = new Map();
        for (const p of releaseLines) {
            if (p.querySelector('strong')) continue;

            const text = p.textContent.trim();
            const match = text.match(/^(.*?)\s*-\s*(.*)$/);
            if (match) {
                let artist = match[1].trim();
                const album = match[2].trim();

                // Handle " x " collaborations
                if (artist.includes(' x ')) {
                    artist = artist.split(' x ')[0].trim();
                }

                if (artist && !artistMap.has(artist.toLowerCase())) {
                    artistMap.set(artist.toLowerCase(), {
                        artist,
                        album,
                        element: p
                    });
                }
            }
        }

        return normalizeArtistObjects(Array.from(artistMap.values()))
    }

    function normalizeArtistObjects(rawArtistObjects) {
        const result = [];

        for (const obj of rawArtistObjects) {
            const names = obj.artist.split('/').map(a => a.trim());

            for (const name of names) {
                result.push({
                    artist: name,
                    album: obj.album,
                    element: obj.element,
                });
            }
        }

        return result;
    }

    function arrayToArtistMap(array) {
        const map = {};
        for (const obj of array) {
            const key = obj.artist.toLowerCase(); // normalize artist name
            map[key] = obj;
        }
        return map;
    }

    async function fetchDate(artistObjects, announceDate) {
        const jsonDateResults = {};
        // clone artistObjects so we can track still missing artists after this is done
        let stillMissing = arrayToArtistMap(
            artistObjects.map(obj => ({ ...obj })) // shallow copy
        );

        //grab json data
        const url = `${GOOGLE_SHEET_API}?announce=${announceDate}`;
        const res = await fetch(url);
        const json = await res.json();

        //loop through results
        for (const [artist, data] of Object.entries(json)) {
            const artistKey = artist.toLowerCase();
            jsonDateResults[artistKey] = data;
            jsonDateResults[artistKey].notAnAlbum = false
            delete stillMissing[artistKey];
            //stillMissing = stillMissing.filter(obj => obj.artist.toLowerCase() !== artistKey);
        }
        if (Object.keys(jsonDateResults).length === 0){
            //the backend hasn't processed this page yet, so we queue it for processing
            queueThreadForBackend(window.location.href)
            //Best we can do is add artists
            fetchArtists(stillMissing)
        } else {
            injectData(artistObjects, jsonDateResults)
            fetchArtists(stillMissing)
        }
    }

    function queueThreadForBackend(postUrl) {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://script.google.com/macros/s/AKfycbwVkRh_SjgMJsg9V7a_21odYW33WFO6DAQ0qLRYope7OrBufhX7FdSYP-sVtj2x2ADz/exec",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({ url: postUrl }),
            onload: function (res) {
                console.log("Success:", res.responseText);
            },
            onerror: function (err) {
                console.error("Error:", err);
            }
        })
    }



    async function fetchArtists(stillMissing) {
        // Query again without announce filter for still-missing entries
        const jsonArtistResults = {};
        //wipe the album field so we don't match an album
        for (const artist in stillMissing) {
            stillMissing[artist].notAnAlbum = true
        }
        const stillMissingArray = Object.values(stillMissing);
        if (stillMissingArray.length > 0) {
            const fallbackUrl = `${GOOGLE_SHEET_API}?artists=${encodeURIComponent(stillMissingArray.map(o => o.artist).join('|'))}`;
            const fallbackres = await fetch(fallbackUrl);
            const fallbackjson = await fallbackres.json();

            for (const [artist, data] of Object.entries(fallbackjson)) {
                jsonArtistResults[artist.toLowerCase()] = data;
            }
        }

        injectData(stillMissingArray, jsonArtistResults);
    }

    function injectData(artistObjects, jsonResults) {
        const normalizedFavorites = CONFIG.favoriteArtists.map(name => name.toLowerCase());

        for (const { artist, album, element, notAnAlbum } of artistObjects) {
            const match = jsonResults[artist.toLowerCase()];
            if (!match) continue;

            element.textContent = '';

            const container = document.createElement('div');
            container.style.display = 'inline';

            // Handle collaborations
            const artists = artist.split(' x ');
            artists.forEach((name, idx) => {
                const artistName = name.trim();
                const link = document.createElement('a');
                link.href = `https://open.spotify.com/artist/${match.spotifyArtistId}`;
                link.target = '_blank';
                link.textContent = artistName;
                link.style.fontWeight = 'bold';
                container.appendChild(link);
                if (idx < artists.length - 1) {
                    container.appendChild(document.createTextNode(' x '));
                }
            });

            element.appendChild(container);
            element.appendChild(document.createTextNode(' - '));

            if (!notAnAlbum) {
                const albumLink = document.createElement('a');
                albumLink.href = `https://open.spotify.com/album/${match.spotifyAlbumId}`;
                albumLink.target = '_blank';
                albumLink.textContent = album;
                element.appendChild(albumLink);
            } else {
                element.appendChild(document.createTextNode(album));
            }

            // FFO
            const ffoList = [match.similar1, match.similar2, match.similar3, match.similar4, match.similar5].filter(Boolean);

            if (ffoList.length > 0) {
                const ffoElement = document.createElement('div');
                ffoElement.style.marginLeft = '1.5em';
                ffoElement.style.fontSize = 'smaller';
                ffoElement.style.color = 'gray';

                ffoElement.textContent = '🎧 FFO: ';

                ffoList.forEach((ffoName, i) => {
                    const span = document.createElement('span');
                    span.textContent = ffoName;
                    span.style.position = 'relative';
                    span.style.marginRight = '0.5em';

                    const plus = document.createElement('span');
                    plus.textContent = ' [+fav]';
                    plus.style.cursor = 'pointer';
                    plus.style.display = 'none';
                    plus.style.color = 'gray';
                    plus.style.fontSize = 'smaller';

                    plus.addEventListener('click', () => {
                        if (!CONFIG.favoriteArtists.includes(ffoName)) {
                            CONFIG.favoriteArtists.push(ffoName);
                            localStorage.setItem('mcw-config', JSON.stringify(CONFIG));
                            element.style.backgroundColor = CONFIG.ffoColor;
                            element.classList.add('ffoArtist')
                            element.classList.add('doNotHide')
                            plus.remove();
                        }
                    });

                    span.addEventListener('mouseenter', () => plus.style.display = 'inline');
                    span.addEventListener('mouseleave', () => plus.style.display = 'none');

                    span.appendChild(plus);
                    ffoElement.appendChild(span);
                    if (i < ffoList.length - 1) {
                        ffoElement.appendChild(document.createTextNode(', '));
                    }
                });

                element.appendChild(ffoElement);
            }

            const isFavorite = normalizedFavorites.includes(artist.toLowerCase());
            const ffoMatch = ffoList.some(name => normalizedFavorites.includes(name.toLowerCase()));
            if (isFavorite) {
                element.style.backgroundColor = CONFIG.favColor;
                element.classList.add('favArtist')
                element.classList.add('doNotHide')
            } else if (ffoMatch) {
                element.style.backgroundColor = CONFIG.ffoColor;
                element.classList.add('ffoArtist')
                element.classList.add('doNotHide')
            }
        }
    }

    function addConfigUI(postBlock, releaseLines) {
        postBlock.style.position = 'relative';

        const configButton = document.createElement('button');
        configButton.textContent = '⚙️ Config';
        configButton.style.cssText = 'position:absolute; top:10px; right:10px; padding:5px 10px; background:#333; color:white; border:none; border-radius:5px; cursor:pointer; height:26px';

        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Highlighted Only';
        toggleButton.style.cssText = 'position:absolute; top:10px; right:110px; padding:5px 10px; background:#555; color:white; border:none; border-radius:5px; cursor:pointer; width:120px; height:26px';
        let showingOnlyHighlighted = false;

        toggleButton.addEventListener('click', () => {
            showingOnlyHighlighted = !showingOnlyHighlighted;
            toggleButton.textContent = showingOnlyHighlighted ? "Show All" : 'Highlighted Only';
            document.querySelectorAll('.release-row').forEach(row => {
                const isMarked = row.classList.contains('doNotHide');
                row.style.display = (showingOnlyHighlighted && !isMarked) ? 'none' : '';
            })
        })

        configButton.addEventListener('click', () => {
            const configModal = document.createElement('div');
            configModal.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); padding:20px; background:#fff; border:1px solid #ccc; border-radius:5px; box-shadow:0 2px 10px rgba(0,0,0,0.1); z-index:1000;';

            const title = document.createElement('h3');
            title.textContent = 'Config';

            const artistLabel = document.createElement('label');
            artistLabel.textContent = 'Favorite Artists:';
            const artistInput = document.createElement('textarea');
            artistInput.rows = 6;
            artistInput.style.width = '50%';
            artistInput.value = CONFIG.favoriteArtists.join('\n');

            const lineBreak = document.createElement('br')

            const color1Label = document.createElement('label');
            color1Label.textContent = 'Favorite:';
            const color1Input = document.createElement('input');
            color1Input.type = 'color';
            color1Input.value = CONFIG.favColor;

            const color2Label = document.createElement('label');
            color2Label.textContent = 'FFO:';
            const color2Input = document.createElement('input');
            color2Input.type = 'color';
            color2Input.value = CONFIG.ffoColor;

            const saveButton = document.createElement('button');
            saveButton.textContent = 'Save';
            saveButton.style.marginTop = '10px';

            const reloadButton = document.createElement('button');
            reloadButton.textContent = 'Save & Reload';
            reloadButton.style.marginLeft = '10px';

            saveButton.addEventListener('click', () => {
                CONFIG.favoriteArtists = artistInput.value.split('\n').map(s => s.trim()).filter(Boolean);
                CONFIG.favColor = color1Input.value;
                CONFIG.ffoColor = color2Input.value;
                localStorage.setItem('mcw-config', JSON.stringify(CONFIG));
                configModal.remove();
            });

            reloadButton.addEventListener('click', () => {
                saveButton.click();
                location.reload();
            });

            configModal.append(title, artistLabel, artistInput, lineBreak, color1Label, color1Input, color2Label, color2Input, saveButton, reloadButton);
            document.body.appendChild(configModal);
        });

        postBlock.append(configButton, toggleButton);
    }

    function styleHeaders(postBlock) {
        const releaseLines = postBlock.querySelectorAll('p')
        for (const p of releaseLines) {
            if (p.querySelector('strong')) {
                p.style.backgroundColor = 'black';
                p.style.color = 'white';
                p.style.padding = '4px 6px';
                p.style.borderRadius = '4px';
                p.style.marginTop = '8px';
                p.className = "release-header"
            } else {
                p.classList.add('release-row')
            }
        }
    }

    function waitForDOM() {
        const announceDate = postDate();

        if (!document.querySelector('.md p')) {
            setTimeout(waitForDOM, 500);
            return;
        }
        //grab the data from the post
        const postBlock = document.querySelectorAll('.md')[1];
        const releaseLines = postBlock.querySelectorAll('p');
        styleHeaders(postBlock)
        addConfigUI(postBlock, releaseLines)
        const artists = extractArtistNames(releaseLines);
        fetchDate(artists, announceDate)
    }

    waitForDOM();
})();