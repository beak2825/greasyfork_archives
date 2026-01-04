// ==UserScript==
// @name        Internet Roadtrip Permanent Radios
// @namespace   http://tampermonkey.net/
// @version     1.5.1
// @description Overrides Internet Roadtrip radio with your favorite radio
// @author      TotallyNotSamm
// @license     MIT
// @match       https://neal.fun/internet-roadtrip/
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @connect     api-1.wbor.org
// @connect     playlists.wbor.org
// @connect     public.radio.co
// @connect     www.radio-browser.info
// @connect     de1.api.radio-browser.info
// @run-at      document-start
// @require     https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @icon        https://i.redd.it/0xszn1428p5f1.png
// @downloadURL https://update.greasyfork.org/scripts/538771/Internet%20Roadtrip%20Permanent%20Radios.user.js
// @updateURL https://update.greasyfork.org/scripts/538771/Internet%20Roadtrip%20Permanent%20Radios.meta.js
// ==/UserScript==

(async () => {
    if (!IRF.isInternetRoadtrip) return;

        const radioBody = await IRF.dom.radio;
        let isPopupOpen = false;
        let infoButton;
        let tooltipSpan;
        let infoPopup;

    let customRadios = await GM_getValue("customRadios", []);
    const radios = [
        { name: "WBOR 91.1 FM", url: "https://listen.wbor.org/" },
        { name: "Folk'd Up Radio", url: "https://s4.radio.co/s129fcc067/listen" },
        { name: "CBFM Radio", url: "https://s4.radio.co/s6f58ddb4f/listen" },
        { name: "WMUA 91.1 FM", url: "https://usa5.fastcast4u.com/proxy/qernhlca?mp=/1" },
            { name: "WMUAx", url: "https://usa5.fastcast4u.com/proxy/qernhlca?mp=/2" },
            { name: "The Wave 100.9 FM", url: "https://mbsradio-ais.leanstream.co/CKTOFM-MP3" },
            { name: "ICI Musique Montréal", url: "https://rcavliveaudio.akamaized.net/hls/live/2006979/M-7QMTL0_MTL/master.m3u8", format: "hls" },
            { name: "ICI Musique Classique", url: "https://rcavliveaudio.akamaized.net/hls/live/2006977/M-2QMUCL_CLASSIQUE/master.m3u8", format: "hls" },
            { name: "CBC Radio One", url: "https://cbcradiolive.akamaized.net/hls/live/2040990/ES_R1ASY/adaptive_192/chunklist_ao.m3u8", format: "hls" }
        ];
        const allRadios = [...radios, ...customRadios];

        let selectedStationName = await GM_getValue("lastSelectedStation", allRadios[0].name);
        let selectedStation = allRadios.find(r => r.name === selectedStationName) || allRadios[0];
        let isOverrideEnabled = await GM_getValue("isOverrideEnabled", false);

        const vcontainer = await IRF.vdom.container;
        const originalUpdateData = vcontainer.methods.updateData;

        vcontainer.state.updateData = new Proxy(originalUpdateData, {
            apply: (target, thisArg, args) => {
                if (!isOverrideEnabled) {
                    const currentStation = args[0].station?.name;
                    const alreadySet = currentStation === selectedStation.name;

                    if (!alreadySet) {
                        args[0].station = {
                            name: selectedStation.name,
                            url: selectedStation.url,
                            format: selectedStation.format || "mp3",
                            distance: 0
                        };
                    }
                }

                IRF.vdom.radio.then(radio => {
                    // Error handling
                    if (!radio.state._errorHandler) {
                        radio.state._errorHandler = true;

                        const handleStreamError = () => {
                            radio.state.stationInfo = "Connection Error - Reconnecting...";
                            setTimeout(() => {
                                console.log('Attempting to reconnect...');
                                radio.state.stationInfo = "TUNE IN";
                                setTimeout(() => {
                                    radio.state.stationInfo = "PLAYING";
                                }, 1000);
                            }, 3000);
                        };

                        radio.state._handleStreamError = handleStreamError;
                    }

                    const currentStation = radio.state.stationName;
                    if (radio.state.isPoweredOn && nowPlayingInfo[currentStation]) {
                        radio.state.stationInfo = nowPlayingInfo[currentStation].nowPlaying;
                    } else {
                        radio.state.stationInfo = radio.state.isPoweredOn ? "PLAYING" : "TUNE IN";
                    }
                });

                return Reflect.apply(target, thisArg, args);
            }
        });

        // Info button and popup
        if (!radioBody) {
            console.warn("[Radio Info] Radio DOM element not found. The info button won't be displayed.");
            return;
        }

        // A more specific element to position relative
        const radioContainer = radioBody.querySelector('.radio-body') || radioBody.querySelector('.station-name') || radioBody;
        radioContainer.style.position = "relative";

        // Info button
        infoButton = document.createElement("button");
        infoButton.textContent = "i";
        infoButton.setAttribute("aria-label", "Show Radio Info");
        Object.assign(infoButton.style, {
            position: "absolute",
            top: "8px",
            left: "8px",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            border: "none",
            background: "transparent",
            color: "white",
            fontWeight: "bold",
            fontFamily: "inherit",
            cursor: "pointer",
            padding: "0",
            lineHeight: "18px",
            textAlign: "center",
            userSelect: "none",
            zIndex: "9999",
        });
        radioContainer.appendChild(infoButton);

        // Tooltip
        tooltipSpan = document.createElement("div");
        tooltipSpan.textContent = "Show more info";
        Object.assign(tooltipSpan.style, {
            position: "fixed",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            color: "#fff",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            fontFamily: "inherit",
            opacity: "0",
            visibility: "hidden",
            transition: "opacity 0.2s ease",
            whiteSpace: "nowrap",
            zIndex: "9998",
        });
        document.body.appendChild(tooltipSpan);

        // Info popup
        infoPopup = document.createElement("div");
        const refStyles = getComputedStyle(radioBody.querySelector(".station-name"));
        Object.assign(infoPopup.style, {
            position: "fixed",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "6px",
            fontFamily: refStyles.fontFamily,
            fontWeight: "normal",
            fontSize: "14px",
            maxWidth: "240px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.8)",
            opacity: "0",
            visibility: "hidden",
            transition: "opacity 0.25s ease",
            userSelect: "none",
            zIndex: "9998",
        });
        document.body.appendChild(infoPopup);

        // State for now playing info
        let nowPlayingInfo = {
            'WBOR 91.1 FM': {
                nowPlaying: 'Unknown Track – Unknown Artist'
            },
            'Folk\'d Up Radio': {
                nowPlaying: 'Unknown Track – Unknown Artist'
            },
            'CBFM Radio': {
                nowPlaying: 'Unknown Track – Unknown Artist'
            }
        };

        // Station change tracking
        let currentStation = '';
        let liveShowName = null;
        let liveDjName = null;

        // Fetch WBOR now playing info
        async function fetchWBORInfo() {
            try {
                const response = await new Promise((resolve) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "https://api-1.wbor.org/api/spins",
                        onload: resolve,
                        onerror: () => resolve({ responseText: '{}' })
                    });
                });

                // Parse song info
                try {
                    const data = JSON.parse(response.responseText);
                    const latestSpin = data.items?.[0] || {};
                    const artist = latestSpin.artist || "Unknown Artist";
                    const title = latestSpin.song || "Unknown Title";
                    nowPlayingInfo['WBOR 91.1 FM'].nowPlaying = `${title} – ${artist}`;
                } catch (e) {
                    console.error("[WBOR] Song info parse error:", e);
                }
            } catch (e) {
                console.error("[WBOR] Fetch error:", e);
            }
        }

        // Fetch WBOR live show info
        async function fetchLiveShowInfo() {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://playlists.wbor.org/WBOR/",
                    onload: function (response) {
                        try {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, "text/html");

                            const showTitleEl = doc.querySelector("h3.show-title a");
                            liveShowName = showTitleEl ? showTitleEl.textContent.trim() : null;

                            const djNameEl = doc.querySelector("p.dj-name a");
                            liveDjName = djNameEl ? djNameEl.textContent.trim() : null;

                        } catch (e) {
                            console.error("[WBOR] Failed to parse live show info HTML:", e);
                            liveShowName = null;
                            liveDjName = null;
                        } finally {
                            resolve();
                        }
                    },
                    onerror: function (e) {
                        console.error("[WBOR] GM_xmlhttpRequest failed for live show info:", e);
                        liveShowName = null;
                        liveDjName = null;
                        resolve();
                    }
                });
            });
        }

        // Fetch Folk'd Up Radio now playing info
        async function fetchFolkdUpInfo() {
            try {
                const response = await new Promise((resolve) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "https://public.radio.co/api/v2/s129fcc067/track/current",
                        onload: resolve,
                        onerror: () => resolve({ responseText: '{}' })
                    });
                });

                const data = JSON.parse(response.responseText);
                nowPlayingInfo['Folk\'d Up Radio'].nowPlaying = data.data?.title || "Unknown Title";
            } catch (e) {
                console.error("[Folk'd Up] Fetch error:", e);
            }
        }

        // Fetch CBFM Radio now playing info
        async function fetchCBFMInfo() {
            try {
                const response = await new Promise((resolve) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "https://public.radio.co/api/v2/s6f58ddb4f/track/current",
                        onload: resolve,
                        onerror: () => resolve({ responseText: '{}' })
                    });
                });

                const data = JSON.parse(response.responseText);
                nowPlayingInfo['CBFM Radio'].nowPlaying = data.data?.title || "Unknown Title";
            } catch (e) {
                console.error("[CBFM] Fetch error:", e);
            }
        }

        // Update all info
        async function updateAllInfo() {
            await Promise.all([fetchWBORInfo(), fetchLiveShowInfo(), fetchFolkdUpInfo(), fetchCBFMInfo()]);
        }

        // RADIO BROWSER API FUNCTIONS
        async function searchRadioBrowser(query, limit = 20) {
            try {
                const response = await new Promise((resolve) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: `https://de1.api.radio-browser.info/json/stations/search?name=${encodeURIComponent(query)}&limit=${limit}&hidebroken=true`,
                        onload: resolve,
                        onerror: () => resolve({ responseText: '[]' })
                    });
                });

                const stations = JSON.parse(response.responseText);
                return stations.map(station => ({
                    name: station.name,
                    url: station.url_resolved || station.url,
                    format: station.codec || "mp3",
                    country: station.country,
                    language: station.language,
                    tags: station.tags,
                    favicon: station.favicon,
                    votes: station.votes,
                    bitrate: station.bitrate
                }));
            } catch (e) {
                console.error("[Radio Browser] Search error:", e);
                return [];
            }
        }

        async function getPopularStations(limit = 10) {
            try {
                const response = await new Promise((resolve) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: `https://de1.api.radio-browser.info/json/stations/topvote?limit=${limit}&hidebroken=true`,
                        onload: resolve,
                        onerror: () => resolve({ responseText: '[]' })
                    });
                });

                const stations = JSON.parse(response.responseText);
                return stations.map(station => ({
                    name: station.name,
                    url: station.url_resolved || station.url,
                    format: station.codec || "mp3",
                    country: station.country,
                    language: station.language,
                    tags: station.tags,
                    favicon: station.favicon,
                    votes: station.votes,
                    bitrate: station.bitrate
                }));
            } catch (e) {
                console.error("[Radio Browser] Popular stations error:", e);
                return [];
            }
        }

        async function getRandomStation() {
            try {
                console.log("[Random Station] Fetching popular stations to pick random one...");

                const response = await new Promise((resolve) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: `https://de1.api.radio-browser.info/json/stations/topvote?limit=50&hidebroken=true`,
                        onload: resolve,
                        onerror: () => resolve({ responseText: '[]', status: 0 })
                    });
                });

                console.log("[Random Station] Response status:", response.status);

                // Handle case where responseText might be undefined
                const responseText = response.responseText || '[]';
                console.log("[Random Station] Response text:", responseText.substring(0, 200) + "...");

                if (response.status !== 200) {
                    console.error("[Random Station] HTTP error:", response.status);
                    return null;
                }

                const stations = JSON.parse(responseText);
                console.log("[Random Station] Parsed stations:", stations.length);

                if (stations.length > 0) {
                    // Filter out stations without valid URLs
                    const validStations = stations.filter(station =>
                        station.url_resolved || station.url
                    );

                    if (validStations.length === 0) {
                        console.error("[Random Station] No valid stations found");
                        return null;
                    }

                    // Get a random station from the popular stations
                    const randomIndex = Math.floor(Math.random() * validStations.length);
                    const station = validStations[randomIndex];

                    console.log("[Random Station] Selected station:", station.name);

                    return {
                        name: station.name,
                        url: station.url_resolved || station.url,
                        format: station.codec || "mp3",
                        country: station.country,
                        language: station.language,
                        tags: station.tags,
                        favicon: station.favicon,
                        votes: station.votes,
                        bitrate: station.bitrate
                    };
                }
                return null;
            } catch (e) {
                console.error("[Radio Browser] Random station error:", e);
                return null;
            }
        }

        // SETTINGS PANEL
        const tab = await IRF.ui.panel.createTabFor(GM.info, {
            tabName: "Radio Selector",
            className: "radio-selector-tab"
        });

        // Add base styles to the container
        const style = document.createElement('style');
        style.textContent = `
            .radio-selector-tab {
                padding: 1.5rem;
                color: #fff;
                font-family: "Roboto", "Inter", "Segoe UI", sans-serif;
                position: relative;
            }
        `;
        document.head.appendChild(style);

        // Override Toggle Row
        const overrideRow = document.createElement("div");
        Object.assign(overrideRow.style, {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "-0.6rem"
        });

        const overrideLabel = document.createElement("label");
        overrideLabel.textContent = "Reset to default radio station";
        Object.assign(overrideLabel.style, {
            fontWeight: "500",
            fontSize: "0.95rem"
        });

        const overrideToggle = document.createElement("input");
        overrideToggle.type = "checkbox";
        overrideToggle.className = IRF.ui.panel.styles.toggle;
        overrideToggle.checked = isOverrideEnabled;

        overrideRow.appendChild(overrideLabel);
        overrideRow.appendChild(overrideToggle);
        tab.container.appendChild(overrideRow);

        // Divider
        const divider = document.createElement("hr");
        Object.assign(divider.style, {
            border: "none",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            margin: "1.3rem 0"
        });
        tab.container.appendChild(divider);

        // BUTTONS CONTAINER
        const buttonsContainer = document.createElement("div");
        Object.assign(buttonsContainer.style, {
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            alignItems: "center",
            marginBottom: "1.5rem"
        });
        tab.container.appendChild(buttonsContainer);

        // Random Station Button
        const randomButton = document.createElement("button");
        randomButton.textContent = "🎲 Random Station";
        randomButton.title = "Switch to a random station";
        Object.assign(randomButton.style, {
            padding: "0.35rem 1rem",
            cursor: "pointer",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "999px",
            background: "rgba(68, 68, 170, 0.2)",
            color: "#fff",
            fontSize: "0.9rem",
            fontFamily: "inherit",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
            marginBottom: "0.5rem"
        });

        randomButton.addEventListener("mouseenter", () => {
            randomButton.style.background = "rgba(68, 68, 170, 0.4)";
            randomButton.style.borderColor = "rgba(255, 255, 255, 0.5)";
        });
        randomButton.addEventListener("mouseleave", () => {
            randomButton.style.background = "rgba(68, 68, 170, 0.2)";
            randomButton.style.borderColor = "rgba(255, 255, 255, 0.3)";
        });

        randomButton.onclick = async () => {
            if (isChangingStation) return;
            isChangingStation = true;

            // Get available stations (exclude current one)
            const availableStations = allRadios.filter(station => station.name !== selectedStationName);

            if (availableStations.length === 0) {
                console.log("No other stations available");
                isChangingStation = false;
                return;
            }

            // Pick a random station
            const randomIndex = Math.floor(Math.random() * availableStations.length);
            const randomStation = availableStations[randomIndex];

            // Update selection
            selectedStation = randomStation;
            selectedStationName = randomStation.name;
            await GM_setValue("lastSelectedStation", selectedStationName);

            randomButton.textContent = "🎲 Switching...";
            randomButton.style.background = "rgba(68, 68, 170, 0.6)";

            // Re-render buttons to show new selection
            renderButtons();

            // Reset button after delay
            setTimeout(() => {
                randomButton.textContent = "🎲 Random Station";
                randomButton.style.background = "rgba(68, 68, 170, 0.2)";
                isChangingStation = false;
            }, 1000);
        };

        buttonsContainer.appendChild(randomButton);

        let isChangingStation = false;

        // RADIO BROWSER SEARCH SECTION
        const radioBrowserSection = document.createElement("div");
        Object.assign(radioBrowserSection.style, {
            marginTop: "1.5rem",
            marginBottom: "1.5rem"
        });

        const radioBrowserTitle = document.createElement("div");
        radioBrowserTitle.textContent = "🌐 Add Station through Radio Browser";
        Object.assign(radioBrowserTitle.style, {
            marginBottom: "1rem",
            fontWeight: "500",
            fontSize: "0.95rem"
        });
        radioBrowserSection.appendChild(radioBrowserTitle);

        // Search input
        const searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.placeholder = "Search for stations (ex., 'jazz', 'rock', 'news')";
        const inputStyles = {
            background: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "999px",
            padding: "0.5rem 1rem",
            color: "#fff",
            fontSize: "0.9rem",
            width: "95%",
            marginBottom: "0.75rem"
        };
        Object.assign(searchInput.style, inputStyles);
        radioBrowserSection.appendChild(searchInput);

        // Search button
        const searchButton = document.createElement("button");
        searchButton.textContent = "Search";
        Object.assign(searchButton.style, {
            padding: "0.5rem 1rem",
            cursor: "pointer",
            border: "1px solid #44a",
            borderRadius: "999px",
            background: "#44a",
            color: "#fff",
            fontSize: "0.9rem",
            fontFamily: "inherit",
            transition: "all 0.2s ease",
            marginTop: "0.5rem",
            marginRight: "0.5rem"
        });

        searchButton.addEventListener("mouseenter", () => {
            searchButton.style.background = "#55b";
            searchButton.style.borderColor = "#55b";
        });
        searchButton.addEventListener("mouseleave", () => {
            searchButton.style.background = "#44a";
            searchButton.style.borderColor = "#44a";
        });

        // Popular stations button
        const popularButton = document.createElement("button");
        popularButton.textContent = "Popular Stations";
        Object.assign(popularButton.style, {
            padding: "0.5rem 1rem",
            cursor: "pointer",
            border: "1px solid #44a",
            borderRadius: "999px",
            background: "#44a",
            color: "#fff",
            fontSize: "0.9rem",
            fontFamily: "inherit",
            transition: "all 0.2s ease",
            marginTop: "0.5rem"
        });

        popularButton.addEventListener("mouseenter", () => {
            popularButton.style.background = "#55b";
            popularButton.style.borderColor = "#55b";
        });
        popularButton.addEventListener("mouseleave", () => {
            popularButton.style.background = "#44a";
            popularButton.style.borderColor = "#44a";
        });

        // Random station button
        const randomStationButton = document.createElement("button");
        randomStationButton.textContent = "🎲 Random Station";
        Object.assign(randomStationButton.style, {
            padding: "0.5rem 1rem",
            cursor: "pointer",
            border: "1px solid #44a",
            borderRadius: "999px",
            background: "#44a",
            color: "#fff",
            fontSize: "0.9rem",
            fontFamily: "inherit",
            transition: "all 0.2s ease",
            marginTop: "0.5rem",
            marginLeft: "0.5rem"
        });

        randomStationButton.addEventListener("mouseenter", () => {
            randomStationButton.style.background = "#55b";
            randomStationButton.style.borderColor = "#55b";
        });
        randomStationButton.addEventListener("mouseleave", () => {
            randomStationButton.style.background = "#44a";
            randomStationButton.style.borderColor = "#44a";
        });

        randomStationButton.onclick = async () => {
            randomStationButton.textContent = "🎲 Loading...";
            randomStationButton.disabled = true;

            try {
                console.log("[Random Station] Starting to fetch random station...");
                const randomStation = await getRandomStation();

                if (randomStation) {
                    console.log("[Random Station] Successfully fetched station:", randomStation.name);

                    // Check if already exists
                    if (allRadios.some(r => r.name === randomStation.name)) {
                        console.log("[Random Station] Station already exists:", randomStation.name);
                        alert("This station is already in your list! Try again for a different random station.");
                        randomStationButton.textContent = "🎲 Random Station";
                        randomStationButton.disabled = false;
                        return;
                    }

                    // Add station to custom radios
                    const newStation = {
                        name: randomStation.name,
                        url: randomStation.url,
                        format: randomStation.format
                    };

                    console.log("[Random Station] Adding new station:", newStation);
                    customRadios.push(newStation);
                    allRadios.push(newStation);
                    await GM_setValue("customRadios", customRadios);

                    // Switch to the new station
                    selectedStation = newStation;
                    selectedStationName = randomStation.name;
                    await GM_setValue("lastSelectedStation", selectedStationName);

                    // Update UI
                    renderButtons();

                    alert(`Added random station "${randomStation.name}" from ${randomStation.country || 'Unknown'} to your stations!`);
                } else {
                    console.error("[Random Station] Failed to fetch random station - returned null");
                    alert("Failed to fetch a random station. Please check the browser console for details and try again.");
                }
            } catch (e) {
                console.error("[Random Station] Error adding random station:", e);
                alert(`Error adding random station: ${e.message}. Please check the browser console for details.`);
            } finally {
                randomStationButton.textContent = "🎲 Random Station";
                randomStationButton.disabled = false;
            }
        };

        // Results container
        const searchResultsContainer = document.createElement("div");
        Object.assign(searchResultsContainer.style, {
            marginTop: "1rem",
            maxHeight: "300px",
            overflowY: "auto",
            display: "none"
        });

        // Track if popular results are showing
        let popularResultsShowing = false;

        // Search functionality
        let searchTimeout;
        searchInput.addEventListener("input", () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(async () => {
                const query = searchInput.value.trim();
                if (query.length >= 2) {
                    searchButton.textContent = "Searching...";
                    const results = await searchRadioBrowser(query);
                    displaySearchResults(results);
                    searchButton.textContent = "Search";
                    // Reset popular button state
                    popularResultsShowing = false;
                    popularButton.textContent = "Popular Stations";
                } else {
                    searchResultsContainer.style.display = "none";
                }
            }, 500);
        });

        searchButton.onclick = async () => {
            const query = searchInput.value.trim();
            if (!query) {
                alert("Please enter a search term");
                return;
            }

            searchButton.textContent = "Searching...";
            const results = await searchRadioBrowser(query);
            displaySearchResults(results);
            searchButton.textContent = "Search";
            // Reset popular button state
            popularResultsShowing = false;
            popularButton.textContent = "Popular Stations";
        };

        popularButton.onclick = async () => {
            if (popularResultsShowing) {
                // Close results
                searchResultsContainer.style.display = "none";
                popularResultsShowing = false;
                popularButton.textContent = "Popular Stations";
            } else {
                // Show popular results
                popularButton.textContent = "Loading...";
                const results = await getPopularStations();
                displaySearchResults(results);
                popularResultsShowing = true;
                popularButton.textContent = "Close Popular Stations";
            }
        };

        function displaySearchResults(stations) {
            searchResultsContainer.innerHTML = "";

            if (stations.length === 0) {
                searchResultsContainer.innerHTML = '<div style="color: rgba(255,255,255,0.6); text-align: center; padding: 1rem;">No stations found</div>';
                searchResultsContainer.style.display = "block";
                return;
            }

            stations.forEach(station => {
                const stationDiv = document.createElement("div");
                Object.assign(stationDiv.style, {
                    padding: "0.75rem",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "6px",
                    marginBottom: "0.5rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                });

                stationDiv.addEventListener("mouseenter", () => {
                    stationDiv.style.background = "rgba(255, 255, 255, 0.1)";
                });
                stationDiv.addEventListener("mouseleave", () => {
                    stationDiv.style.background = "rgba(255, 255, 255, 0.05)";
                });

                const stationInfo = `
                    <div style="font-weight: 500; margin-bottom: 0.25rem;">${station.name}</div>
                    <div style="font-size: 0.8rem; color: rgba(255,255,255,0.7);">
                        ${station.country || 'Unknown'} • ${station.language || 'Unknown'} • ${station.bitrate || 'Unknown'}kbps
                    </div>
                    ${station.tags ? `<div style="font-size: 0.75rem; color: rgba(255,255,255,0.6); margin-top: 0.25rem;">${station.tags.split(',').slice(0, 3).join(', ')}</div>` : ''}
                `;

                stationDiv.innerHTML = stationInfo;

                stationDiv.onclick = async () => {
                    // Add station to custom radios
                    const newStation = {
                        name: station.name,
                        url: station.url,
                        format: station.format
                    };

                    // Check if already exists
                    if (allRadios.some(r => r.name === station.name)) {
                        alert("This station is already in your list!");
                        return;
                    }

                    customRadios.push(newStation);
                    allRadios.push(newStation);
                    await GM_setValue("customRadios", customRadios);

                    // Switch to the new station
                    selectedStation = newStation;
                    selectedStationName = station.name;
                    await GM_setValue("lastSelectedStation", selectedStationName);

                    // Update UI
                    renderButtons();
                    searchResultsContainer.style.display = "none";
                    searchInput.value = "";
                    popularResultsShowing = false;
                    searchInput.value = "";
                    popularButton.textContent = "Popular";

                    alert(`Added "${station.name}" to your stations!`);
                };

                searchResultsContainer.appendChild(stationDiv);
            });

            searchResultsContainer.style.display = "block";
        }

        radioBrowserSection.appendChild(searchButton);
        radioBrowserSection.appendChild(popularButton);
        radioBrowserSection.appendChild(randomStationButton);
        radioBrowserSection.appendChild(searchResultsContainer);
        tab.container.appendChild(radioBrowserSection);

        function renderButtons() {
            buttonsContainer.innerHTML = "";
            allRadios.forEach(radio => {
                const isCustom = customRadios.some(r => r.name === radio.name && r.url === radio.url);

                const btnWrapper = document.createElement("div");
                Object.assign(btnWrapper.style, {
                    position: "relative",
                    display: "inline-block"
                });

                const btn = document.createElement("button");
                btn.textContent = radio.name;
                Object.assign(btn.style, {
                    padding: "0.35rem 1rem",
                    cursor: "pointer",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "999px",
                    background: "transparent",
                    color: "#fff",
                    fontSize: "0.9rem",
                    fontFamily: "inherit",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap"
                });

                // Hover effect
                btn.addEventListener("mouseenter", () => {
                    if (btn.textContent !== selectedStationName || isOverrideEnabled) {
                        btn.style.background = "rgba(68, 68, 170, 0.1)";
                    }
                });
                btn.addEventListener("mouseleave", () => {
                    if (btn.textContent !== selectedStationName || isOverrideEnabled) {
                        btn.style.background = "transparent";
                    }
                });

                btn.onclick = async () => {
                    if (isChangingStation || selectedStation === radio) return;
                    isChangingStation = true;

                    selectedStation = radio;
                    selectedStationName = radio.name;
                    await GM_setValue("lastSelectedStation", selectedStationName);
                    highlightSelectedButton();

                    setTimeout(() => {
                        isChangingStation = false;
                    }, 500);
                };

                btnWrapper.appendChild(btn);

                if (isCustom) {
                    const deleteBtn = document.createElement("div");
                    deleteBtn.textContent = "×";
                    deleteBtn.title = "Delete this station";
                    Object.assign(deleteBtn.style, {
                        position: "absolute",
                        top: "-0.5rem",
                        right: "-0.25rem",
                        fontSize: "1.2rem",
                        color: "rgba(255, 255, 255, 0.8)",
                        cursor: "pointer",
                        zIndex: "2",
                        background: "rgba(0, 0, 0, 0.6)",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                        opacity: "0",
                        visibility: "hidden"
                    });

                    deleteBtn.addEventListener("mouseenter", () => {
                        deleteBtn.style.background = "rgba(255, 0, 0, 0.8)";
                    });
                    deleteBtn.addEventListener("mouseleave", () => {
                        deleteBtn.style.background = "rgba(0, 0, 0, 0.6)";
                    });

                    deleteBtn.onclick = (e) => {
                        e.stopPropagation();
                        if (confirm(`Delete custom station "${radio.name}"?`)) {
                            customRadios = customRadios.filter(r => !(r.name === radio.name && r.url === radio.url));
                            GM_setValue("customRadios", customRadios);
                            allRadios.splice(allRadios.findIndex(r => r.name === radio.name && r.url === radio.url), 1);
                            renderButtons();
                        }
                    };

                    btnWrapper.appendChild(deleteBtn);

                    const editBtn = document.createElement("div");
                    editBtn.textContent = "✎";
                    editBtn.title = "Edit this station";
                    Object.assign(editBtn.style, {
                        position: "absolute",
                        top: "-0.5rem",
                        right: "1.25rem",
                        fontSize: "1rem",
                        color: "rgba(255, 255, 255, 0.8)",
                        cursor: "pointer",
                        zIndex: "2",
                        background: "rgba(0, 0, 0, 0.6)",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        lineHeight: "1",
                        paddingBottom: "2px",
                        transition: "all 0.2s ease",
                        opacity: "0",
                        visibility: "hidden"
                    });

                    editBtn.addEventListener("mouseenter", () => {
                        editBtn.style.background = "rgba(68, 68, 170, 0.8)";
                    });
                    editBtn.addEventListener("mouseleave", () => {
                        editBtn.style.background = "rgba(0, 0, 0, 0.6)";
                    });

                    editBtn.onclick = (e) => {
                        e.stopPropagation();
                        stationNameInput.value = radio.name;
                        streamInput.value = radio.url;
                        addButton.textContent = "Update Station";
                        addButton.dataset.editMode = "true";
                        addButton.dataset.originalName = radio.name;
                        addButton.dataset.originalUrl = radio.url;
                        stationNameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    };

                    btnWrapper.appendChild(editBtn);

                    // Show/hide buttons on hover
                    btnWrapper.addEventListener("mouseenter", () => {
                        editBtn.style.opacity = "1";
                        editBtn.style.visibility = "visible";
                        deleteBtn.style.opacity = "1";
                        deleteBtn.style.visibility = "visible";
                    });

                    btnWrapper.addEventListener("mouseleave", () => {
                        editBtn.style.opacity = "0";
                        editBtn.style.visibility = "hidden";
                        deleteBtn.style.opacity = "0";
                        deleteBtn.style.visibility = "hidden";
                    });
                }

                buttonsContainer.appendChild(btnWrapper);
            });
            highlightSelectedButton();
        }

        function highlightSelectedButton() {
            Array.from(buttonsContainer.querySelectorAll("button")).forEach(btn => {
                if (btn.textContent === selectedStationName && !isOverrideEnabled) {
                    Object.assign(btn.style, {
                        backgroundColor: "#44a",
                        color: "#fff",
                        border: "1px solid #44a"
                    });
                } else {
                    Object.assign(btn.style, {
                        backgroundColor: "transparent",
                        color: "#fff",
                        border: "1px solid rgba(255, 255, 255, 0.2)"
                    });
                }
            });
        }

        // CUSTOM STATION SECTION
        const customSection = document.createElement("div");
        Object.assign(customSection.style, {
            marginTop: "1.5rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)"
        });

        const customTitle = document.createElement("div");
        customTitle.textContent = "📝 Add Station Manually";
        Object.assign(customTitle.style, {
            marginBottom: "1rem",
            fontWeight: "500",
            fontSize: "0.95rem"
        });
        customSection.appendChild(customTitle);

        const stationNameInput = document.createElement("input");
        stationNameInput.type = "text";
        stationNameInput.placeholder = "Station name";
        Object.assign(stationNameInput.style, inputStyles);
        customSection.appendChild(stationNameInput);

        const streamInput = document.createElement("input");
        streamInput.type = "text";
        streamInput.placeholder = "Stream URL";
        Object.assign(streamInput.style, inputStyles);
        customSection.appendChild(streamInput);

         // Stream URL hint
        const streamHint = document.createElement("div");
        Object.assign(streamHint.style, {
            fontSize: "0.8rem",
            color: "rgba(255, 255, 255, 0.6)",
            marginTop: "0rem",
            lineHeight: "1.4"
        });
        streamHint.innerHTML = 'Get Stream URLs from <a href="https://www.radio-browser.info" target="_blank" style="color: #44a; text-decoration: none;">radio-browser.info</a>, <a href="https://irt.crschmidt.net/radio.html" target="_blank" style="color: #44a; text-decoration: none;">irt.crschmidt.net/radio.html</a>. Archive of previous stations <a href="https://roadtrip.pikarocks.dev/stations" target="_blank" style="color: #44a; text-decoration: none;">roadtrip.pikarocks.dev/stations</a>.';
        customSection.appendChild(streamHint);
        tab.container.appendChild(customSection);

        const addButton = document.createElement("button");
        addButton.textContent = "Add Station";
        Object.assign(addButton.style, {
            padding: "0.5rem 1rem",
            cursor: "pointer",
            border: "1px solid #44a",
            borderRadius: "999px",
            background: "#44a",
            color: "#fff",
            fontSize: "0.9rem",
            fontFamily: "inherit",
            transition: "all 0.2s ease",
            marginTop: "0.5rem"
        });

        addButton.addEventListener("mouseenter", () => {
            addButton.style.background = "#55b";
            addButton.style.borderColor = "#55b";
        });
        addButton.addEventListener("mouseleave", () => {
            addButton.style.background = "#44a";
            addButton.style.borderColor = "#44a";
        });

        customSection.appendChild(addButton);

        // Event Listeners
        overrideToggle.addEventListener("change", async () => {
            isOverrideEnabled = overrideToggle.checked;
            await GM_setValue("isOverrideEnabled", isOverrideEnabled);
            console.log(`Radio override ${isOverrideEnabled ? "Reset to default station" : `custom station active — ${selectedStation.name}`}.`);
            highlightSelectedButton();

            // Force an update of the radio station
            const container = await IRF.vdom.container;
            if (container && container.methods.updateData) {
                container.methods.updateData.call(container.state, container.state.data);
            }
        });

        addButton.onclick = async () => {
            const name = stationNameInput.value.trim();
            const url = streamInput.value.trim();

            if (!name || !url) {
                alert("Please fill in both the station name and stream URL.");
                return;
            }

            // Validate URL format
            try {
                new URL(url);
            } catch (e) {
                alert("Please enter a valid URL");
                return;
            }

            const isEditMode = addButton.dataset.editMode === "true";
            const originalName = addButton.dataset.originalName;
            const originalUrl = addButton.dataset.originalUrl;

            // Check for duplicate names, but exclude the station being edited
            if (!isEditMode && allRadios.some(r => r.name === name)) {
                alert("A station with this name already exists.");
                return;
            }

            if (isEditMode) {
                // Remove the old station
                customRadios = customRadios.filter(r => !(r.name === originalName && r.url === originalUrl));
                allRadios.splice(allRadios.findIndex(r => r.name === originalName && r.url === originalUrl), 1);
            }

            const newStation = { name, url };
            customRadios.push(newStation);
            allRadios.push(newStation);
            await GM_setValue("customRadios", customRadios);

            // If we were editing the currently selected station, update the selection
            if (isEditMode && selectedStationName === originalName) {
                selectedStation = newStation;
                selectedStationName = name;
                await GM_setValue("lastSelectedStation", selectedStationName);
            }

            // Reset the form
            stationNameInput.value = "";
            streamInput.value = "";
            addButton.textContent = "Add Station";
            addButton.dataset.editMode = "false";
            delete addButton.dataset.originalName;
            delete addButton.dataset.originalUrl;

            renderButtons();

            // Force an update of the radio station if necessary
            if (isEditMode && selectedStationName === name) {
                const container = await IRF.vdom.container;
                if (container && container.methods.updateData) {
                    container.methods.updateData.call(container.state, container.state.data);
                }
            }
        };

        renderButtons();

        // Start fetching station info
        await updateAllInfo();
        setInterval(updateAllInfo, 30000);

        function updatePopupContent() {
            IRF.vdom.radio.then(radio => {
                const currentStation = radio.state.stationName;
                const info = nowPlayingInfo[currentStation];

                if (!info) {
                    infoPopup.innerHTML = '<div>No additional information available for this station.</div>';
                    return;
                }

                if (currentStation === 'WBOR 91.1 FM') {
                    let liveShowText = "No live shows currently";
                    if (liveDjName && !/wbor'?s commodore\s*64/i.test(liveDjName.trim())) {
                        liveShowText = `Live Show: ${liveShowName}${liveDjName ? ` with ${liveDjName}` : ""}`;
                    }

                    infoPopup.innerHTML = `
                        <div><strong>Now Playing:</strong> ${info.nowPlaying}</div>
                        <div style="margin-top: 8px;"><strong>${liveShowText}</strong></div>
                    `;
                } else if (currentStation === 'Folk\'d Up Radio' || currentStation === 'CBFM Radio') {
                    infoPopup.innerHTML = `
                        <div><strong>Now Playing:</strong> ${info.nowPlaying}</div>
                    `;
                }
            });
        }

        function positionPopup() {
            // Wait for content to be rendered and dimensions to be calculated
            requestAnimationFrame(() => {
                const btnRect = infoButton.getBoundingClientRect();
                const popupRect = infoPopup.getBoundingClientRect();
                let left = btnRect.left - popupRect.width - 8;
                let top = btnRect.top + (btnRect.height / 2) - (popupRect.height / 2);

                if (left < 8) {
                    left = btnRect.right + 8;
                }
                if (top < 8) top = 8;
                if (top + popupRect.height > window.innerHeight - 8) {
                    top = window.innerHeight - popupRect.height - 8;
                }

                infoPopup.style.left = `${left}px`;
                infoPopup.style.top = `${top}px`;
            });
        }

        infoButton.addEventListener("mouseenter", () => {
            if (isPopupOpen) return;
            const rect = infoButton.getBoundingClientRect();
            tooltipSpan.style.left = `${rect.left - tooltipSpan.offsetWidth - 8}px`;
            tooltipSpan.style.top = `${rect.top + (rect.height / 2) - 10}px`;
            tooltipSpan.style.opacity = "1";
            tooltipSpan.style.visibility = "visible";
        });

        infoButton.addEventListener("mouseleave", () => {
            tooltipSpan.style.opacity = "0";
            tooltipSpan.style.visibility = "hidden";
        });

        infoButton.addEventListener("click", () => {
            isPopupOpen = !isPopupOpen;
            if (isPopupOpen) {
                updatePopupContent();
                // First make the popup visible but transparent for proper dimension calculation
                infoPopup.style.visibility = "visible";
                infoPopup.style.opacity = "0";

                // Position the popup after content is updated
                requestAnimationFrame(() => {
                    positionPopup();
                    // Fade
                    requestAnimationFrame(() => {
                        infoPopup.style.opacity = "1";
                    });
                });

                tooltipSpan.style.opacity = "0";
                tooltipSpan.style.visibility = "hidden";
            } else {
                infoPopup.style.opacity = "0";
                infoPopup.style.visibility = "hidden";
            }
        });

        document.addEventListener("click", (e) => {
            if (!infoPopup.contains(e.target) && e.target !== infoButton) {
                infoPopup.style.opacity = "0";
                infoPopup.style.visibility = "hidden";
                isPopupOpen = false;
            }
        });

        window.addEventListener("resize", () => {
            if (infoPopup.style.visibility === "visible") {
                positionPopup();
            }
        });
    })();

