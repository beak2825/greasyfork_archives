// ==UserScript==
// @name         GGn Unified OST Uploady
// @version      1.7.0
// @author       SleepingGiant
// @description  Uploady for multi-source OSTs on GGn (e.g. VGMdb, bandcamp, etc.)
// @namespace    https://greasyfork.org/users/1395131
// @include      https://gazellegames.net/upload.php*
// @match        https://gazellegames.net/torrents.php?action=editgroup*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require      https://update.greasyfork.org/scripts/533781/1578387/GGn%20Upload%20Blocker%20Manager.js
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @grant        GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/531202/GGn%20Unified%20OST%20Uploady.user.js
// @updateURL https://update.greasyfork.org/scripts/531202/GGn%20Unified%20OST%20Uploady.meta.js
// ==/UserScript==
// Prior Authors: NeutronNoir, ZeDoCaixao, Wealth - do not reach out to them for support, but feel free to thank them for their work :)

var UPLOADY_FIELD = `<input placeholder="VGMdb, Bandcamp, Apple Music, Steam, MusicBrainz, Qobuz URL" type="text" id="catalog_number" size="60"></input>`;

var UPLOADY_FIELD_EDITGROUP = `
<input placeholder="OST Uploady: VGMdb, Bandcamp, Apple Music, Steam, MusicBrainz, Qobuz URL"
       type="text" id="catalog_number" size="60"
       style="margin-left: 250px;">
`;

const uploadyExtraFeaturesKey = "useGGnOSTUploadyExtraFeatures";
let uploadBlockerInitiated = false;

// tampermonkey intro
(function () {
    const useExtraFeatures = localStorage.getItem(uploadyExtraFeaturesKey);

    if (useExtraFeatures === null) {
        const wantsFeatures = confirm("Would you like to enable additional OST Uploady features?");
        localStorage.setItem(uploadyExtraFeaturesKey, wantsFeatures ? "true" : "false");
    }

    if (window.location.href.includes("action=editgroup")) {
        $("input[name='aliases']").after($(UPLOADY_FIELD_EDITGROUP));
        url_parser_text_entry(editgroup_page_handler);
    } else {
        $("#categories").click(function () {
            var el = $(this);
            setTimeout(function () {
                $("#catalog_number").remove();
                if (isOSTSelected()) {
                    url_parser_text_entry(upload_page_handler);
                }
            }, 500);
        });
    }

    // Independent interval for blocking empty [b][/b] in first 2 lines. Uses generic UploadBlockerManager library
    const loader = setInterval(() => {
        if (document.readyState === 'complete') {
            if (uploadBlockerInitiated) clearInterval(loader);
            initUploadBlocker();
        }
    }, 200);

    if (useExtraFeatures === "true") {
        // Separate from OST Uploady - adds group title case checking.
        setInterval(() => {
            const descField = document.querySelector("#album_desc") || document.querySelector("textarea[name='body']");
            const existingButton = document.querySelector("#titleCaseResults");
            if (descField && !existingButton && isOSTSelected()) {
                createCheckButtonsUpload();
                createCheckButtonsEdit();
            }
        }, 500);
    }
})();

// Only add stuff from here to OSTs.
function isOSTSelected() {
    const categoryIsOST = $("#categories :selected").text().trim() === "OST";

    // Look for a table row under #weblinks_edit that contains "VGMdb"
    const hasVGMdbField = $("#weblinks_edit td").filter(function () {
        return $(this).text().trim().startsWith("VGMdb");
    }).length > 0;

    return categoryIsOST || hasVGMdbField;
}

function url_parser_text_entry(handler) {
    $("#categories").after($(UPLOADY_FIELD));
    $("#catalog_number").on("blur", function () {
        let url = $(this).val();
        let input = this;

        if (url.includes("vgmdb.net")) {
            $("input[name='vgmdburi'], input[name='weblink']").val(url);
        }

        handleURL(url).then(data => {
            handler(data);
        }).catch(() => {
            $(input).val("Album not found");
        });
    });
}

function handleURL(url) {
    // xmlHttpRequest only works on http*://website.stuff and does NOT work on website.stuff
    if (!url.startsWith('http')) {
        url = 'https://' + url;
    }

    if (url.includes('vgmdb.net')) {
        return parseVGMdb(url);
    } else if (url.includes('bandcamp.com')) {
        return parseBandcamp(url);
    } else if (url.includes('music.apple.com')) {
        return parseAppleMusic(url);
    } else if (url.includes('store.steampowered')) {
        return parseSteamOST(url);
    } else if (url.includes('musicbrainz.org')) {
        return parseMusicBrainz(url);
    } else if (url.includes('qobuz.com')) {
        return parseQobuz(url);
    } else {
        return Promise.reject('Unsupported URL');
    }
}


// These two do the actual "uploading" of data to the GGn site by setting the values, `data` is pre-filled from the parser flows for each website.
// If adding a new site, follow the same style and read the comment over `parseVGMdb`
function upload_page_handler(data) {
    $("#aliases").val(data.aliases);
    $("#album_desc").val(data.album_desc);
    $("#title").val(data.title);
    $("#year").val(data.year);
    $("#image").val(data.image);
}
function editgroup_page_handler(data) {
    $("input[name='aliases']").val(data.aliases);
    $("textarea[name='body']").val(data.album_desc);
    $("input[name='name']").val(data.title);
    $("input[name='year']").val(data.year);
    $("input[name='image']").val(data.image);
}

/**
 * Website parsing section. This comment applies to effectively all parseWebsite functions.
 *
 * Further below there is also a "xyz website helper method section" (should be commented at each separation)
 * This is where all the logic for each individual site will be stored.
 * To make scaling to more sites easier, you can think of each website as its own script - where the "master" script just handles the arbitrary data response
 * from a website script and fills in the GGn fields with that response object.
 *
 * @param {*} url - the URL pasted into the textbox (that we will retrieve data from). That's it.
 * @returns A standardized data object. The expected schema is:
            title: The string to be put in 'Title by Artist' in GGn
            aliases: The string to be put in 'Aliases' in GGn
            year: The number (it's javascript so in string form normally) that is the year - e.g. 2025
            image: Link to the cover image found on the page
            album_desc: Pre-formatted description. This should contain EVERYTHING. Header, tracklist, notes, etc. - what each function returns just ends up in the textbox.

            tags is purposefully omitted from here as sites that do have them (e.g. bandcamp) often have ones that will not apply to GGn and autofilling bad is worse than not autofilling.
 *
 */
function parseVGMdb(url) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: "GET",
            url: url,
            onload: (response) => {
                if (response.status === 200) {
                    let env = $(response.responseText);
                    resolve({
                        aliases: get_aliases_vgmdb(env),
                        album_desc: get_desc_vgmdb(env) + get_tracks_vgmdb(env) + get_notes_vgmdb(env),
                        title: get_title_vgmdb(env),
                        year: get_year_vgmdb(env),
                        image: get_cover_vgmdb(env)
                    });
                } else {
                    reject('Error fetching VGMdb');
                }
            }
        });
    });
}

function parseBandcamp(url) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: "GET",
            url: url,
            onload: function (response) {
                if (response.status !== 200) {
                    reject('Error fetching Bandcamp');
                    return;
                }

                const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                const jsonLd = doc.querySelector('script[type="application/ld+json"]');

                if (!jsonLd) {
                    reject('No JSON-LD found in the page.');
                    return;
                }

                const albumData = JSON.parse(jsonLd.textContent);

                let title = get_title_bandcamp(albumData);
                let aliases = get_aliases_bandcamp(albumData);
                let albumDesc = get_album_desc_bandcamp(albumData);
                let year = get_release_date_bandcamp(albumData);
                let image = get_cover_art_bandcamp(albumData);

                resolve({
                    aliases: aliases,
                    album_desc: albumDesc,
                    title: title,
                    year: year,
                    image: image
                });
            }
        });
    });
}


function parseAppleMusic(url) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: "GET",
            url: url,
            onload: (response) => {
                if (response.status !== 200) {
                    reject('Error fetching Apple Music');
                    return;
                }

                const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                const schemaScript = doc.querySelector('script[type="application/ld+json"]#schema\\:music-album');

                if (!schemaScript) {
                    reject('Schema script not found');
                    return;
                }

                let jsonData;
                try {
                    jsonData = JSON.parse(schemaScript.textContent);
                } catch (error) {
                    reject('Error parsing JSON data');
                    return;
                }

                let title = get_title_applemusic(jsonData);
                let aliases = get_aliases_applemusic(doc);
                let albumDesc = get_album_desc_applemusic(jsonData);
                let year = get_release_year_applemusic(doc);
                let image = get_cover_art_applemusic(doc);

                resolve({
                    aliases: aliases,
                    album_desc: albumDesc,
                    title: title,
                    year: year,
                    image: image
                });
            }
        });
    });
}

function parseSteamOST(url) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: "GET",
            url: url,
            onload: (response) => {
                if (response.status !== 200) {
                    reject('Error fetching Steam page');
                    return;
                }

                const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                const title = get_title_steam(doc) + " by " + get_artist_steam(doc);
                const aliases = ''; //TODO: This if a need arises.
                const albumDesc = get_album_desc_steam(doc);
                const year = get_release_year_steam(doc);
                const image = get_cover_art_steam(doc);

                resolve({
                    aliases: aliases,
                    album_desc: albumDesc,
                    title: title,
                    year: year,
                    image: image
                });
            }
        });
    });
}

function parseMusicBrainz(url) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: "GET",
            url: url,
            onload: function (response) {
                if (response.status !== 200) {
                    reject('Error fetching MusicBrainz page.');
                    return;
                }

                const doc = new DOMParser().parseFromString(response.responseText, 'text/html');

                // Start parsing
                let title = get_title_musicbrainz(doc) + " by";
                let aliases = '';
                let albumDesc = get_album_desc_musicbrainz(doc);
                let year = get_release_year_musicbrainz(doc);
                let image = ''; //TODO: Musicbrainz is dumb and has a weird redirect URL as their default, so you have to open it and ptpimg the "final" URL. I don't want to fight with async await right now.

                resolve({
                    aliases: aliases,
                    album_desc: albumDesc,
                    title: title,
                    year: year,
                    image: image
                });
            }
        });
    });
}

function parseQobuz(url) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: "GET",
            url: url,
            onload: function (response) {
                if (response.status !== 200) {
                    reject('Error fetching Qobuz page.');
                    return;
                }

                const doc = new DOMParser().parseFromString(response.responseText, 'text/html');

                // Parse JSON-LD schemas
                const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
                let productSchema = null;
                let musicAlbumSchema = null;

                jsonLdScripts.forEach(script => {
                    try {
                        const data = JSON.parse(script.textContent);
                        if (data['@type'] === 'Product') {
                            productSchema = data;
                        } else if (data['@type'] === 'MusicAlbum') {
                            musicAlbumSchema = data;
                        }
                    } catch (e) {
                        // Skip invalid JSON
                    }
                });

                if (!productSchema) {
                    reject('No product schema found in Qobuz page.');
                    return;
                }

                let title = get_title_qobuz(productSchema);
                let aliases = get_aliases_qobuz();
                let albumDesc = get_album_desc_qobuz(doc, productSchema);
                let year = get_release_year_qobuz(productSchema);
                let image = get_cover_art_qobuz(productSchema);

                resolve({
                    aliases: aliases,
                    album_desc: albumDesc,
                    title: title,
                    year: year,
                    image: image
                });
            }
        });
    });
}



// ===Global Helper Method Section===
// We want as much site specific logic to be within its own method, even if it results in code duplication
// This section is for TRULY generic methods that is global across all (e.g. turning totalSeconds -> release total duration format)

function formatTotalDuration_generic(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}


// ===VGMdb helper method section===
function get_cover_vgmdb(env) {
    try {
        return env.find("#coverart").css("background-image").replace(/url\("([^"]*)"\)/, "$1").replace("medium-", "");
    } catch (e) {
        return '';
    }
}


function get_year_vgmdb(env) {
    var dateText = env.find("#album_infobit_large>tbody>tr>td>span>b:contains('Release Date')")
        .closest("tr")
        .find("td a").first().text().trim();  // Only get the first <a> element's text

    var year = new Date(Date.parse(dateText)).getFullYear();
    return isNaN(year) ? null : year;
}

function get_title_vgmdb(env) {
    const title = env.find(".albumtitle").first().text().trim();
    return title ? title + " by" : "";
}

function get_aliases_vgmdb(env) {
    var aliases = [];
    env.find("#innermain .albumtitle:not(:first)[lang='en']").each(function () {
        aliases.push($(this).text().trim());
    });
    return aliases.join(", ");
}

function get_desc_vgmdb(env) {
    var desc = "[align=center][u][b]" + env.find(".albumtitle").first().text() + "[/b]\n"
        + "[i][size=1]by[/i] [b]FILL_ARTIST_IN_HERE[/b][/u][/align]\n\n";

    env.find("#album_infobit_large>tbody>tr").each(function () {
        // Remove hyperlinks and non-visible fields. These will mess with parsing.
        $(this).find("[style*='display:none']").remove();
        $(this).find("script").remove();

        var title = $(this).find("td>span>b").text();
        var value = $(this).find("td").last().text().trim();
        if (title && value) {
            if (title == "Release Date") {
                var dateText = $(this).find("td a").first().text().trim();
                var rls_date = new Date(Date.parse(dateText));

                if (isNaN(rls_date)) {
                    var parsed = parse_mmm_yyyy_date_vgmdb(dateText);
                    if (parsed) rls_date = parsed;
                }

                if (!isNaN(rls_date)) {
                    desc += "[*][b]" + title + "[/b]: " +
                        rls_date.getFullYear() + "-" +
                        String(rls_date.getMonth() + 1).padStart(2, '0') + "-" +
                        String(rls_date.getDate()).padStart(2, '0') + "\n";
                } else {
                    desc += "[*][b]" + title + "[/b]: " + dateText + "\n"; // fallback to raw text
                }
            } else {
                desc += "[*][b]" + title + "[/b]: " + value + "\n";
            }
        }
    });
    return desc;
}

function parse_mmm_yyyy_date_vgmdb(dateText) {
    var parts = dateText.match(/^([A-Za-z]{3,9})\s+(\d{4})$/); // e.g., "Jun 2021"
    if (parts) {
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var month = monthNames.findIndex(m => m.toLowerCase() === parts[1].substring(0, 3).toLowerCase());
        if (month >= 0) {
            return new Date(parseInt(parts[2]), month, 1);
        }
    }
    return null;
}

function parseVgmdbTotalTimeToSeconds(timeStr) {
    const parts = timeStr.split(':').map(Number);

    if (parts.some(isNaN)) throw new Error('Invalid number in time string');

    if (parts.length === 3) {
        // h:mm:ss
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
        if (parts[0] >= 60) {
            // Assume hhh:mm
            return parts[0] * 60 + parts[1];
        } else {
            // mm:ss
            return parts[0] * 60 + parts[1];
        }
    } else if (parts.length === 1) {
        // Just minutes?
        return parts[0] * 60;
    } else {
        throw new Error('Unrecognized time format');
    }
}

function get_tracks_vgmdb(env) {
    let tracks = "\n[align=center][u][b]Tracklist[/b][/u][/align]\n";

    // This removes non-visible tracklists to prevent multilanguage duplication
    env.find("#tracklist").find("[style*='display: none']").remove();

    const disc_count = env.find("#tracklist").text().match(/Disc [0-9]+/g)?.length || 1;

    env.find("#tracklist>span>table>tbody").each(function (index) {
        if (disc_count > 1) {
            tracks += "[b]Disc " + (index + 1) + "[/b]\n";
        }
        $(this).find("tr").each(function () {
            const tds = $(this).find("td");
            const track_title = tds.eq(1).text().trim();
            const track_duration = tds.last().text().trim();

            if (track_title) {
                tracks += "[#] " + track_title;
                if (track_duration) {
                    tracks += " [i](" + track_duration + ")[/i]";
                }
                tracks += "\n";
            }
        });
    });

    let total_time = "";
    if (disc_count > 1) {
        total_time = env.find('#tracklist>span>h4>span:nth-child(2)>span:nth-child(4).time').text().trim();
    } else {
        total_time = env.find('#tracklist>span>span .time').text().trim();
    }

    if (total_time) {
        let formattedTotal = total_time;
        try {
            const totalSeconds = parseVgmdbTotalTimeToSeconds(total_time);
            formattedTotal = formatTotalDuration_generic(totalSeconds);
        } catch (e) {
            // If parsing fails, keep original total_time
        }
        tracks += "[b]Total Length[/b]: " + formattedTotal;
    }

    return tracks;
}

function get_notes_vgmdb(env) {
    const notes = env.find("#notes").html();
    if (notes) {
        const cleanedNotes = sanitize_notes(notes);

        // Notes of "no notes" does not help us.
        if (cleanedNotes === 'No notes available for this album.') {
            return "";
        }

        return "\n\n[quote][align=center][b][u]Notes[/u][/b][/align]\n" + cleanedNotes + "[/quote]";
    }
    return "";
}

// Bandcamp helper method section
function get_title_bandcamp(albumData) {
    return albumData.name + " by " + albumData.byArtist.name || "";
}

function get_aliases_bandcamp(albumData) {
    return "";
}

function get_album_desc_bandcamp(albumData) {
    let totalDurationSeconds = 0;
    let trackDetails = [];
    if (albumData.track) albumData.track.itemListElement.forEach((track, index) => {
        const trackDurationSeconds = parseDuration_bandcamp(track.item.duration);
        totalDurationSeconds += trackDurationSeconds;

        trackDetails.push({
            number: index + 1,
            name: track.item.name,
            duration: formatTrackDuration_bandcamp(trackDurationSeconds)
        });
    });

    // Format release date as yyyy-mm-dd
    let releaseDateFormatted = "";
    if (albumData.datePublished) {
        const rlsDate = new Date(Date.parse(albumData.datePublished));
        releaseDateFormatted =
            rlsDate.getUTCFullYear() + "-" +
            String(rlsDate.getUTCMonth() + 1).padStart(2, '0') + "-" +
            String(rlsDate.getUTCDate()).padStart(2, '0');
    }

    // Format release price
    let releasePriceFormatted = "";
    const release = albumData.albumRelease?.[0];
    const offer = release?.offers;

    if (offer && offer.price != null && offer.priceCurrency) {
        albumData.price = offer.price.toFixed(2); // Ensures "xyz.dd" format
        albumData.currency = offer.priceCurrency; // "USD"
        if (albumData.price && albumData.currency) {
            releasePriceFormatted = albumData.price + " " + albumData.currency;
        }
    }

    // Artist name
    let artistName = albumData.byArtist?.name || "FILL_ARTIST_IN_HERE";

    // Notes
    let notesFormatted = "";
    if (albumData.description) {
        let cleanNotes = albumData.description.replace(/<br\s*\/?>/gi, '\n').trim();
        notesFormatted = "\n\n[quote][align=center][b][u]Notes[/u][/b][/align]\n" + cleanNotes + "[/quote]";
    }

    // Build body
    let bodyContent = "[align=center][u][b]" + albumData.name + "[/b]\n" +
        "[i][size=1]by[/i] [b]" + artistName + "[/b][/u][/align]\n\n";

    bodyContent += "[*][b]Catalog Number[/b]: N/A\n";

    if (releaseDateFormatted) {
        bodyContent += "[*][b]Release Date[/b]: " + releaseDateFormatted + "\n";
    }

    if (releasePriceFormatted) {
        bodyContent += "[*][b]Release Price[/b]: " + releasePriceFormatted + "\n";
    }

    bodyContent += "[*][b]Media Format[/b]: Digital\n";

    if (artistName) {
        bodyContent += "[*][b]Artist[/b]: " + artistName + "\n";
    }

    bodyContent += '\n[align=center][u][b]Tracklist[/b][/u][/align]\n';

    trackDetails.forEach(track => {
        bodyContent += "[#] " + track.name + " [i](" + track.duration + ")[/i]\n";
    });

    bodyContent += "[b]Total Length[/b]: " + formatTotalDuration_generic(totalDurationSeconds);

    // Append notes
    bodyContent += notesFormatted;

    return bodyContent;
}

// Adjust the total duration format for the album (without leading zero for total time over 10 minutes)


function get_release_date_bandcamp(albumData) {
    if (!albumData.datePublished) return "";

    const dateString = albumData.datePublished;  // Example: "27 Mar 2025 09:04:37 GMT"
    const yearMatch = dateString.match(/\b\d{4}\b/);  // Extracts a 4-digit year

    return yearMatch ? yearMatch[0] : "";  // Return the year or fallback
}


function get_cover_art_bandcamp(albumData) {
    return albumData.image || "No Cover Art Available";
}

function get_tracks_bandcamp(albumData) {
    let trackDetails = [];
    if (albumData.track) albumData.track.itemListElement.forEach((track) => {
        const trackDurationSeconds = parseDuration_bandcamp(track.item.duration);
        trackDetails.push({
            name: track.item.name,
            duration: formatTrackDuration_bandcamp(trackDurationSeconds)
        });
    });
    return trackDetails;
}

function formatTrackDuration_bandcamp(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

function parseDuration_bandcamp(durationStr) {
    const regex = /^P(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
    const match = regex.exec(durationStr);
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);
    return (hours * 3600) + (minutes * 60) + seconds;
}


// Apple Music helper method section
function get_title_applemusic(jsonData) {
    // artistName in AppleMusic is an array. This gets the values directly if it is length 1, and defaults to empty string if multiple as mistakes are likely to be made then.
    let artistName = Array.isArray(jsonData.byArtist) && jsonData.byArtist.length === 1 ? jsonData.byArtist[0].name : "";
    return `${jsonData.name} by ${artistName}`;
}

function get_aliases_applemusic(doc) {
    return ""; // Apple Music doesn't typically provide alternate album names
}

function get_album_desc_applemusic(jsonData) {
    // artistName in AppleMusic is an array. This gets the values directly if it is length 1, and defaults to empty string if multiple as mistakes are likely to be made then.
    let artistName = Array.isArray(jsonData.byArtist) && jsonData.byArtist.length === 1 ? jsonData.byArtist[0].name : "FILL_ARTIST_IN_HERE";

    let tracks = [];
    let totalDuration = 0;
    const trackList = jsonData.tracks || [];
    trackList.forEach((track) => {
        let trackName = track.name || "Unknown Track";
        let trackDuration = track.duration || "PT0S";

        totalDuration += parseDuration_applemusic(trackDuration);
        tracks.push(`[#] ${trackName} [i](${formatDuration_applemusic(trackDuration)})[/i]`);
    });

    let albumDesc = `[align=center][u][b]${jsonData.name}[/b]
[i][size=1]by[/i] [b]${artistName}[/b][/u][/align]\n\n`;
    albumDesc += `[align=center][u][b]Tracklist[/b][/u][/align]\n`;
    albumDesc += tracks.join('\n') + `\n[b]Total Length[/b]: ${formatTotalDuration_generic(totalDuration)}`;

    return albumDesc;
}

function get_release_year_applemusic(doc) {
    let metadataElement = doc.querySelector(".headings__metadata-bottom");
    let yearMatch = metadataElement ? metadataElement.textContent.match(/\b(\d{4})\b/) : null;
    return yearMatch ? yearMatch[1] : "";
}

function get_cover_art_applemusic(doc) {
    // Find the <script> element with the schema:music-album ID
    const schemaScript = doc.querySelector('script[type="application/ld+json"]#schema\\:music-album');

    if (schemaScript) {
        const jsonData = JSON.parse(schemaScript.textContent);
        return jsonData.image || ''; // Return the image URL if found
    }

    return "";
}

function parseDuration_applemusic(duration) {
    // This function parses the "PTnMxxS", "PTxxS", and "PTnM" duration formats
    const match = duration.match(/^PT(?:(\d+)M)?(?:(\d+)S)?$/);
    if (match) {
        const minutes = match[1] ? parseInt(match[1]) : 0;
        const seconds = match[2] ? parseInt(match[2]) : 0;
        return minutes * 60 + seconds; // Return total seconds
    }
    return 0;
}

function formatDuration_applemusic(duration) {
    // Handle duration in PTnMxxS, PTxxS, or PTnM format
    const match = duration.match(/^PT(?:(\d+)M)?(?:(\d+)S)?$/);
    if (match) {
        let minutes = match[1] ? parseInt(match[1]) : 0;
        let seconds = match[2] ? parseInt(match[2]) : 0;
        return minutes > 0
            ? `${minutes}:${String(seconds).padStart(2, '0')}`
            : `0:${String(seconds).padStart(2, '0')}`; // Format as m:ss or 0:ss
    }
    return ""; // Default fallback
}



// Steam helper method section
function get_title_steam(doc) {
    return doc.querySelector("#appHubAppName")?.textContent?.trim() || "";
}

function get_album_desc_steam(doc) {
    const appName = get_title_steam(doc);
    const artist = get_artist_steam(doc);

    const releaseDate = doc.querySelector(".release_date .date")?.textContent?.trim();
    const albumMetadata = parseHTMLTable(doc.querySelector(".album_metadata_table"));

    const getMetadataValue = (key) => {
        const row = albumMetadata.find(row => row[0].toLowerCase().includes(key.toLowerCase()));
        return row ? row[1] : null;
    };

    const label = getMetadataValue("Label");
    const publisher = getMetadataValue("Publisher");
    const composer = getMetadataValue("Composer");
    let releasePrice = '';
    const originalPriceEl = doc.querySelector(".discount_original_price"); // Steam entry on sale
    const regularPriceEl = doc.querySelector(".game_purchase_price.price"); // Non sale entry

    if (originalPriceEl) {
        releasePrice = originalPriceEl.textContent.trim();
    } else if (regularPriceEl) {
        releasePrice = regularPriceEl.textContent.trim();
    }

    let albumDesc = `[align=center][u][b]${appName}[/b]\n[i][size=1]by[/i] [b]${artist}[/b][/u][/align]\n\n`;

    releaseDate && (albumDesc += `[*][b]Release Date[/b]: ${releaseDate}\n`);
    albumDesc += `[*][b]Media Format[/b]: Digital\n`;
    albumDesc += `[*][b]Publish Format[/b]: Commercial\n`;
    releasePrice && (albumDesc += `[*][b]Release Price[/b]:  ${releasePrice}\n`);
    albumDesc += `[*][b]Classification[/b]: Original Soundtrack\n`;

    artist && (albumDesc += `[*][b]Artist[/b]: ${artist}\n`);
    composer && (albumDesc += `[*][b]Composer[/b]: ${composer}\n`);
    label && (albumDesc += `[*][b]Label[/b]: ${label}\n`);
    publisher && (albumDesc += `[*][b]Publisher[/b]: ${publisher}\n`);

    albumDesc += `\n${get_tracklist_steam(doc)}`;

    return albumDesc;
}


function get_release_year_steam(doc) {
    const releaseDate = doc.querySelector(".release_date .date")?.textContent?.trim();
    return releaseDate ? releaseDate.split(", ")[1] : "Unknown Year";
}

function get_cover_art_steam(doc) {
    const img = doc.querySelector(".game_header_image_full");
    return img ? img.src : "";
}

function get_artist_steam(doc) {
    const albumMetadata = parseHTMLTable(doc.querySelector(".album_metadata_table"));
    const artistRow = albumMetadata.find(row => row[0].toLowerCase().includes("artist"));
    return artistRow ? artistRow[1] : "FILL_ARTIST_IN_HERE";
}

function get_tracklist_steam(doc) {
    const tracklistContent = doc.querySelector(".music_album_track_list_contents");
    if (!tracklistContent) return "";

    const discs = tracklistContent.querySelectorAll(".music_album_track_listing_ctn");
    let tracklist = "[align=center][u][b]Tracklist[/b][/u][/align]\n";
    let totalLength = 0;

    discs.forEach((disc, index) => {
        if (discs.length > 1) {
            tracklist += `[b]Disc ${index + 1}[/b]\n`;
        }
        const tracks = disc.querySelectorAll(".music_album_track_ctn");
        tracks.forEach(track => {
            let length = track.querySelector(".music_album_track_duration")?.textContent?.trim() || "0:00";
            tracklist += `[#] ${track.querySelector(".music_album_track_name")?.textContent?.trim()} [i](${length})[/i]\n`;
            totalLength += parseDuration_steam(length);
        });
    });
    tracklist += `[b]Total Length[/b]: ${formatTotalDuration_generic(totalLength)}`;
    return tracklist;
}

function parseDuration_steam(duration) {
    const [minutes, seconds] = duration.split(":").map(Number);
    return (minutes || 0) * 60 + (seconds || 0);
}

function parseHTMLTable(table) {
    if (!table) return [];
    const rows = Array.from(table.rows);
    return rows.map(row => {
        const cells = row.cells;
        return [cells[0]?.textContent.trim().replace(":", ""), cells[1]?.textContent.trim()];
    });
}












// MusicBrainz helper method section

function get_title_musicbrainz(doc) {
    const titleElement = doc.querySelector('div.releaseheader h1 bdi');
    if (titleElement) {
        return titleElement.textContent.trim();
    }
    return "";
}

function get_release_year_musicbrainz(doc) {
    const releaseDateElement = doc.querySelector('div.release-events-container .release-date');
    if (releaseDateElement) {
        const fullDate = releaseDateElement.textContent.trim();
        const yearMatch = fullDate.match(/^(\d{4})/);
        if (yearMatch) {
            return yearMatch[1]; // only the year part
        }
    }
    return "";
}

function get_album_desc_musicbrainz(doc) {
    const tracklistTable = doc.querySelector('table.tbl.medium');
    if (!tracklistTable) return "No tracklist found.";

    const tracks = [];

    const trackRows = tracklistTable.querySelectorAll('tbody tr');
    trackRows.forEach(row => {
        // Skip headers
        if (row.classList.contains('subh')) return;

        const positionCell = row.querySelector('td.pos.t a');
        const titleCell = row.querySelector('td.title a bdi');
        const durationCell = row.querySelector('td.treleases');

        if (positionCell && titleCell && durationCell) {
            const number = positionCell.textContent.trim();
            const name = titleCell.textContent.trim();
            const duration = durationCell.textContent.trim();

            tracks.push({ number, name, duration });
        }
    });

    let title = get_title_musicbrainz(doc);
    let artistName = "FILL_ARTIST_IN_HERE";
    let releaseDate;

    const releaseDateElement = doc.querySelector('div.release-events-container .release-date');
    if (releaseDateElement) {
        releaseDate = releaseDateElement.textContent.trim();
    }

    // Now format tracklist
    let bodyContent = "[align=center][u][b]" + title + "[/b]\n" +
        "[i][size=1]by[/i] [b]" + artistName + "[/b][/u][/align]\n\n";

    if (releaseDate) {
        bodyContent += "[*][b]Release Date[/b]: " + releaseDate + "\n";
    }

    tracks.forEach(track => {
        bodyContent += `[#] ${track.name} [i](${track.duration})[/i]\n`;
    });

    const totalDurationSeconds = tracks.reduce((acc, track) => {
        return acc + parseDuration_musicbrainz(track.duration);
    }, 0);

    bodyContent += "\n[b]Total Length[/b]: " + formatTotalDuration_generic(totalDurationSeconds);

    return bodyContent;
}

function parseDuration_musicbrainz(durationStr) {
    // Duration in format mm:ss
    const [minutes, seconds] = durationStr.split(':').map(num => parseInt(num, 10));
    return (minutes * 60) + seconds;
}



// Qobuz helper method section

function get_title_qobuz(productSchema) {
    const albumName = productSchema.name || "";
    const artistName = productSchema.brand?.name || "";
    return `${albumName} by ${artistName}`;
}

function get_aliases_qobuz() {
    return ""; // Qobuz doesn't typically provide alternate album names
}

function get_release_year_qobuz(productSchema) {
    if (!productSchema.releaseDate) return "";
    const releaseDate = new Date(productSchema.releaseDate);
    return releaseDate.getFullYear().toString();
}

function get_cover_art_qobuz(productSchema) {
    // Use the highest resolution image available
    if (productSchema.image && Array.isArray(productSchema.image)) {
        // Return the last (largest) image URL
        return productSchema.image[productSchema.image.length - 1] || "";
    }
    return "";
}

function get_album_desc_qobuz(doc, productSchema) {
    const albumName = productSchema.name || "Unknown Album";
    const artistName = productSchema.brand?.name || "FILL_ARTIST_IN_HERE";

    // Format release date as yyyy-mm-dd
    let releaseDateFormatted = "";
    if (productSchema.releaseDate) {
        const rlsDate = new Date(productSchema.releaseDate);
        if (!isNaN(rlsDate)) {
            releaseDateFormatted =
                rlsDate.getFullYear() + "-" +
                String(rlsDate.getMonth() + 1).padStart(2, '0') + "-" +
                String(rlsDate.getDate()).padStart(2, '0');
        }
    }

    // Format release price
    let releasePriceFormatted = "";
    const offer = productSchema.offers;
    if (offer && offer.price != null && offer.priceCurrency) {
        releasePriceFormatted = offer.price.toFixed(2) + " " + offer.priceCurrency;
    }

    // Extract additional metadata from "About the album" section (keep your existing approach)
    let composer = "";
    let label = "";
    let genre = "";

    const aboutSection = doc.body.textContent || "";

    const composerMatch = aboutSection.match(/Composer:\s*([^\n]+)/);
    if (composerMatch) composer = composerMatch[1].trim();

    const labelMatch = aboutSection.match(/Label:\s*([^\n]+)/);
    if (labelMatch) label = labelMatch[1].trim();

    // Build header + metadata bullets (match other sites)
    let bodyContent =
        "[align=center][u][b]" + albumName + "[/b]\n" +
        "[i][size=1]by[/i] [b]" + artistName + "[/b][/u][/align]\n\n";

    if (releaseDateFormatted) bodyContent += "[*][b]Release Date[/b]: " + releaseDateFormatted + "\n";
    if (releasePriceFormatted) bodyContent += "[*][b]Release Price[/b]: " + releasePriceFormatted + "\n";

    bodyContent += "[*][b]Media Format[/b]: Digital\n";

    if (genre) bodyContent += "[*][b]Genre[/b]: " + genre + "\n";
    if (artistName && artistName !== "FILL_ARTIST_IN_HERE") bodyContent += "[*][b]Artist[/b]: " + artistName + "\n";
    if (composer && composer !== "Various Composers") bodyContent += "[*][b]Composer[/b]: " + composer + "\n";
    if (label) bodyContent += "[*][b]Label[/b]: " + label + "\n";

    // Parse tracklist from DOM (keep your existing selectors/logic)
    const trackElements = doc.querySelectorAll('div.track');
    let trackDetails = [];
    let totalDurationSeconds = 0;

    trackElements.forEach((trackEl, index) => {
        const titleEl = trackEl.querySelector('div.track__item--name span');
        const trackTitle = titleEl ? titleEl.textContent.trim() : `Track ${index + 1}`;

        // Match H:MM:SS or M:SS somewhere in the track element text
        const trackText = trackEl.textContent || "";
        const durationMatch = trackText.match(/\b(\d{1,2}:\d{2}:\d{2})\b|\b(\d{1,2}:\d{2})\b/);

        let rawDuration = "";
        let durationSeconds = 0;
        let displayDuration = "";

        if (durationMatch) {
            rawDuration = durationMatch[1] || durationMatch[2] || "";
        }

        if (rawDuration) {
            durationSeconds = parseDuration_qobuz(rawDuration);
            if (durationSeconds > 0) {
                totalDurationSeconds += durationSeconds;
                displayDuration = formatTotalDuration_generic(durationSeconds);
            } else {
                // fallback if parsing fails
                displayDuration = rawDuration;
            }
        }

        trackDetails.push({ title: trackTitle, duration: displayDuration });
    });

    // Add tracklist consistent with other sites (NO [pre])
    if (trackDetails.length > 0) {
        bodyContent += "\n[align=center][u][b]Tracklist[/b][/u][/align]\n";

        trackDetails.forEach((track) => {
            bodyContent += "[#] " + track.title;
            if (track.duration) bodyContent += " [i](" + track.duration + ")[/i]";
            bodyContent += "\n";
        });

        if (totalDurationSeconds > 0) {
            bodyContent += "[b]Total Length[/b]: " + formatTotalDuration_generic(totalDurationSeconds);
        }
    }

    return bodyContent;
}



function parseDuration_qobuz(durationStr) {
    // Duration in format mm:ss or h:mm:ss
    const parts = durationStr.split(':').map(num => parseInt(num, 10));

    if (parts.length === 3) {
        // h:mm:ss format
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
        // mm:ss format
        return parts[0] * 60 + parts[1];
    }

    return 0;
}





// HERE BE DEMONS
// But really, this is the logic for checking title case being added to the group pages. There is no OST uploady specific code here.

let warningShown = false;

function isTitleCase(line) {
    const minorWordsSet = new Set([
        // Articles (do not capitalize unless first or last word)
        "a", "an", "the",

        // Coordinating conjunctions
        "and", "but", "or", "nor", "for", "so", "yet",

        // Short (three letters or less) prepositions
        "as", "at", "by", "for", "in", "of", "on", "to", "per", "via",

        // Special mentions (leaving out versus and etcetera so they don't slip through accidentally not being flagged in a situation they should)
        "vs", "v", "etc"
    ]);

    // Remove BBCode tags entirely
    const cleanLine = line.replace(/\[([^\]]+)\]/g, "").trim(); // Remove [#], [i], [*], etc.
    const rawWords = cleanLine.split(/\s+/);
    const violations = [];

    rawWords.forEach((word, idx) => {
        const cleanWord = word.replace(/[^a-zA-Z']/g, '');
        if (!cleanWord || /\d/.test(cleanWord)) return; // skip non-words and numerics

        const isFirst = idx === 0;
        const isMinor = minorWordsSet.has(cleanWord.toLowerCase());
        const isCapitalizedProperly = /^[A-Z][a-z'.’\-]*$/.test(cleanWord);
        const isLowercase = cleanWord === cleanWord.toLowerCase();

        let fail = false;
        if (isMinor) {
            fail = isFirst ? !isCapitalizedProperly : !isLowercase;
        } else {
            fail = !isCapitalizedProperly;
        }

        if (fail) violations.push(idx);
    });

    return violations;
}

function createStyledArea() {
    const styledArea = document.createElement("pre");
    styledArea.style.border = "1px solid #ccc";
    styledArea.style.padding = "10px";
    styledArea.style.whiteSpace = "pre-wrap";
    styledArea.style.wordWrap = "break-word";
    styledArea.style.display = "none";
    styledArea.style.maxHeight = "500px";
    styledArea.style.overflowY = "auto";
    styledArea.style.backgroundColor = "#3D365C";
    styledArea.style.color = '#FFFFFF';
    styledArea.id = "titleCaseResults";
    return styledArea;
}

function handleCheckClick(descField, styledArea) {
    if (!warningShown) {
        alert("Reminder: This title case check is a helpful tool, but it won't catch everything. Please still follow the formal capitalization guidelines.");
        warningShown = true;
    }

    const lines = descField.value.split("\n");
    styledArea.innerHTML = "";
    styledArea.style.display = "block";

    lines.forEach(line => {
        const spanLine = document.createElement("div");

        // Remove BBCode tags for validation
        const cleanLine = line.replace(/\[([^\]]+)\]/g, "").trim();
        const rawWords = cleanLine.split(/\s+/);

        // Get violations from cleaned version
        const violations = isTitleCase(line);

        // For display, split the original line (bbcode filtering can mess up indexing)
        const displayWords = line.split(/\s+/);

        let rawIndex = 0;

        displayWords.forEach((word, idx) => {
            const wordSpan = document.createElement("span");
            wordSpan.textContent = word + " ";

            const cleanWord = word.replace(/[^a-zA-Z']/g, '');
            const isSkippable = !cleanWord || /\d/.test(cleanWord);

            if (!isSkippable) {
                if (violations.includes(rawIndex)) {
                    wordSpan.style.color = "red";
                    wordSpan.style.fontWeight = "bold";
                }
                rawIndex++;
            }

            spanLine.appendChild(wordSpan);
        });

        styledArea.appendChild(spanLine);
    });
}


function handleClearClick(styledArea) {
    styledArea.innerHTML = "";
    styledArea.style.display = "none";
}

function createCheckButtonsUpload() {
    const descField = document.querySelector("#album_desc");
    if (!descField) return;

    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "flex-end";

    const checkBtn = document.createElement("button");
    checkBtn.innerText = "Check Title Case";
    checkBtn.type = "button";
    checkBtn.classList.add("button");
    checkBtn.style.cssText = "margin: 4px 0; width: 75%;";

    const clearBtn = document.createElement("button");
    clearBtn.innerText = "Clear Check";
    clearBtn.type = "button";
    clearBtn.classList.add("button");
    clearBtn.style.width = "75%";

    const styledArea = createStyledArea();

    checkBtn.addEventListener("click", () => handleCheckClick(descField, styledArea));
    clearBtn.addEventListener("click", () => handleClearClick(styledArea));

    const descTd = descField.closest("tr")?.querySelector("td");
    if (descTd) {
        descTd.appendChild(container);
        container.appendChild(checkBtn);
        container.appendChild(clearBtn);
    }

    descField.parentNode.insertBefore(styledArea, container.nextSibling);
}

function createCheckButtonsEdit() {
    const descField = document.querySelector('textarea[name="body"]');
    if (!descField) return;

    const checkBtn = document.createElement("input");
    checkBtn.type = "button";
    checkBtn.value = "Check Title Case";
    checkBtn.id = "titlecase_check";

    const clearBtn = document.createElement("input");
    clearBtn.type = "button";
    clearBtn.value = "Clear Check";
    clearBtn.id = "titlecase_clear";
    clearBtn.style.marginLeft = "6px";

    const styledArea = createStyledArea();

    checkBtn.addEventListener("click", () => handleCheckClick(descField, styledArea));
    clearBtn.addEventListener("click", () => handleClearClick(styledArea));

    descField.insertAdjacentElement("afterend", checkBtn);
    checkBtn.insertAdjacentElement("afterend", clearBtn);
    clearBtn.insertAdjacentElement("afterend", styledArea);
}












// Separate script: Block upload if title [b][/b] does not contain artist name.
// This is made to be compatible with the ptpimg upload blocker script and use the same "section" to describe blockers.

function refreshBlocker(mgr, descField) {
    if (!isOSTSelected()) {
        return;
    }
    const lines = descField.value.split('\n');

    checkArtistAndAlbumNames(mgr, lines);
    checkReleaseDate(mgr, lines);
    checkReleasePrice(mgr, lines);
}

function checkArtistAndAlbumNames(mgr, lines) {
    const line1 = lines[0] || '';
    if (line1.trim() && hasEmptyBoldTitle(line1)) {
        mgr.addReason('Album name (first line) must be wrapped in [b]…[/b]');
    } else {
        mgr.removeReason('Album name (first line) must be wrapped in [b]…[/b]');
    }

    const line2 = lines[1] || '';
    if (line2.trim() && hasEmptyBoldTitle(line2)) {
        mgr.addReason('Artist name (second line) must be wrapped in [b]…[/b]');
    } else {
        mgr.removeReason('Artist name (second line) must be wrapped in [b]…[/b]');
    }
}

function hasEmptyBoldTitle(line) {
    return (
        line.includes('[b][/b]') ||
        line.includes('[b]FILL_ARTIST_IN_HERE[/b]')
    );
}

function checkReleaseDate(mgr, lines) {
    const hasInvalidDate = lines.slice(0, 10).some(line =>
        line.toLowerCase().includes('release date') && line.toLowerCase().includes('nan')
    );

    if (hasInvalidDate) {
        mgr.addReason('Release date appears to be invalid (contains "nan")');
    } else {
        mgr.removeReason('Release date appears to be invalid (contains "nan")');
    }
}

function checkReleasePrice(mgr, lines) {
    const hasZeroPrice = lines.slice(0, 10).some(line => {
        const lowerLine = line.toLowerCase();
        const hasPrice = lowerLine.includes('price');
        const hasExactZero = /\b0\.00\b/.test(line); // This is how bandcamp appears
        const isFree = lowerLine.includes("free"); // For vgmdb
        return hasPrice && (hasExactZero || isFree);
    });

    if (hasZeroPrice) {
        mgr.addReason('Release price may be invalid (0.00 or `free` may be freely available which is not allowed on the site)');
    } else {
        mgr.removeReason('Release price may be invalid (0.00 or `free` may be freely available which is not allowed on the site)');
    }
}


function sanitize_notes(rawHtml) {
    if (!rawHtml) return "";

    // vgmdb special. Constantly have these.
    let sanitized = rawHtml.replace(/<br\s*\/?>/gi, "\n");
    sanitized = sanitized.replace(/&nbsp;/g, " ");
    sanitized = sanitized.replace(/&amp;/g, "&");

    // Awful, evil regex. Remove href and ending anchor tag while keeping the text.
    sanitized = sanitized.replace(/<a [^>]*?href="[^"]*"[^>]*?>(.*?)<\/a>/gi, "$1");

    // Remove any remaining HTML tags just in case
    sanitized = sanitized.replace(/<\/?[^>]+(>|$)/g, "");

    return sanitized.trim();
}

/** Find the relevant fields, wire up the manager, and start the interval/listeners. */
function initUploadBlocker() {

    const descField = document.querySelector("#album_desc") || document.querySelector("textarea[name='body']");
    const submitButton = document.querySelector('#post') || document.querySelector('input[type="submit"][value="Submit"]');
    if (!descField || !submitButton) return;

    const mgr = new UploadBlockerManager(submitButton);
    mgr.attachOverrideCheckbox();
    descField.addEventListener('input', () => refreshBlocker(mgr, descField));

    // Hardcode query selector here because referencing the old content would be dumb :P (it's only good for event listener)
    setInterval(() => refreshBlocker(mgr, document.querySelector("#album_desc") || document.querySelector("textarea[name='body']")), 500);
    uploadBlockerInitiated = true;
}