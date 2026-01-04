// ==UserScript==
// @name         Plex Playlist Generator
// @namespace    https://greasyfork.org/users/957127-supertouch
// @version      0.5
// @description  Generate playlists from shows on Plex
// @author       SuperTouch
// @match        https://app.plex.tv/desktop/*
// @match        https://plex.inprivate.space/*
// @icon         https://plex.tv/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @grant        GM.xmlHttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/474446/Plex%20Playlist%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/474446/Plex%20Playlist%20Generator.meta.js
// ==/UserScript==

(function (open) {
    let plexDirectBaseURL;
    const epDataRegex = /library\/metadata\/[0-9]+\/children(\?|$)/;
    let plexAccessToken;
    let showData;

    function isShowPage() {
        return location.hash.includes('/server/') && location.hash.includes('/details?key=%2Flibrary%2Fmetadata%2F');
    }

    function getUrlParameter(url, name) {
        const parsedUrl = new URL(url);
        return parsedUrl.searchParams.get(name);
    }

    window.addEventListener('hashchange', () => {
        console.log("[Plex Playlist Generator] Reset show data")
        showData = null;
    });

    XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
        if (url.match(epDataRegex)) {

            if (!plexAccessToken) {
              plexAccessToken = getUrlParameter(url, 'X-Plex-Token');
            }

            this.addEventListener('readystatechange', async () => {
                if (this.readyState === 4 && this.status === 200) {
                    const jsonResponse = JSON.parse(this.responseText);

                    if (jsonResponse.MediaContainer && jsonResponse.MediaContainer.viewGroup !== "episode") return;

                    showData = showData ? await updateShowData(jsonResponse) : jsonResponse;

                    console.log("[Plex Playlist Generator] Analyzing url", url)
                    if (showData && !allRequestsCompleted(showData)) return;
                    // After all data is found
                    if (!plexDirectBaseURL) plexDirectBaseURL = url.split('/library')[0];
                    // If not a single request had the token
                    if (!plexAccessToken) {
                        plexAccessToken = localStorage.getItem('myPlexAccessToken');
                        if (plexAccessToken) console.log("[Plex Playlist Generator] Plex token found in localStorage");
                        else console.warn("[Plex Playlist Generator] Unable to find Plex token");
                    } else {
                        console.log("[Plex Playlist Generator] Plex token found in request");
                    }

                    console.log("[Plex Playlist Generator] Show data", showData);
                }
            });
        }

        return open.apply(this, arguments);
    };

    async function updateShowData(jsonResponse) {
        return new Promise((resolve) => {
            const episodeIds = new Set(showData.MediaContainer.Metadata.map(episode => episode.Media[0].id));

            for (const episode of jsonResponse.MediaContainer.Metadata) {
                if (episode.Media && episode.Media.length > 0) {
                    const mediaId = episode.Media[0].id;
                    if (!episodeIds.has(mediaId)) {
                        episodeIds.add(mediaId);
                        showData.MediaContainer.Metadata.push(episode);
                    }
                }
            }

            resolve(showData);
        });
    }

    function allRequestsCompleted(showData) {
        const totalEpisodes = showData.MediaContainer.totalSize;
        const uniqueEpisodes = showData.MediaContainer.Metadata.length;
        console.log(`[Plex Playlist Generator] Found ${uniqueEpisodes}/${totalEpisodes} episodes`);

        return totalEpisodes === uniqueEpisodes;
    }

    function createDownloadUrls(jsonData, token) {
        const downloadUrls = [];
        const episodes = jsonData.MediaContainer.Metadata;
        let playlistName = "";

        for (const episode of episodes) {
            if (!playlistName) {
                playlistName = `${episode.grandparentTitle} - ${episode.parentTitle}`;
            }
            if (episode.Media && episode.Media.length > 0) {
                const media = episode.Media[0];
                if (media.Part && media.Part.length > 0) {
                    const part = media.Part[0];
                    const downloadUrl = `${plexDirectBaseURL}${part.key}?download=1&X-Plex-Token=${token}`;
                    downloadUrls.push(downloadUrl);
                }
            }
        }

        return [playlistName, downloadUrls];
    }

    function createPlaylist(jsonData, token) {
        let M3U = "#EXTM3U\n";
        let playlistName = "";
        const episodes = jsonData.MediaContainer.Metadata;

        for (const episode of episodes) {
            if (!playlistName) {
                playlistName = `${episode.grandparentTitle} - ${episode.parentTitle}`;
            }

            const media = episode.Media[0];
            if (media.Part && media.Part.length > 0) {
                const part = media.Part[0];
                const url = `${plexDirectBaseURL}${part.key}?download=1&X-Plex-Token=${token}`;
                const title = `${episode.grandparentTitle} - ${episode.parentTitle} Episode ${episode.index} - ${episode.title}`;
                M3U += `#EXTINF:0,${title}\n${url}\n`;
            }
        }

        return [playlistName, M3U];
    }

    document.arrive('div[class^="Menu-menuScroller"]', { existing: true }, (menuScroller) => {
        if (!showData || menuScroller.getAttribute('data-dl-added') === 'true') return;

        const playlistButton = document.createElement('button');
        playlistButton.setAttribute('data-testid', 'dropdownItem');
        playlistButton.setAttribute('role', 'menuitem');
        playlistButton.setAttribute('class', 'MenuItem-menuItem-C_KBbX MenuItem-default-NAJl2g Link-link-SxPFpG Link-default-BXtKLo');
        playlistButton.setAttribute('type', 'button');
        playlistButton.innerText = 'Download (M3U)';

        const downloadButton = playlistButton.cloneNode(true);
        downloadButton.innerText = "Download (TXT)";

        playlistButton.addEventListener('click', () => {
            const [playlistName, M3U] = createPlaylist(showData, plexAccessToken);
            const blob = new Blob([M3U], { type: 'text/plain;charset=utf-8' });
            saveAs(blob, `${playlistName}.m3u`);
        });

        downloadButton.addEventListener('click', () => {
            const [playlistName, downloadUrls] = createDownloadUrls(showData, plexAccessToken);
            const blob = new Blob([downloadUrls.join('\n')], { type: 'text/plain;charset=utf-8' });
            saveAs(blob, `${playlistName}.txt`);
        });

        menuScroller.appendChild(playlistButton);
        menuScroller.appendChild(downloadButton);

        menuScroller.setAttribute('data-dl-added', 'true');
    });

})(XMLHttpRequest.prototype.open);
