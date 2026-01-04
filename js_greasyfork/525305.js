// ==UserScript==
// @name        Plex GUID Grabber
// @namespace   @soitora/plex-guid-grabber
// @description Grab the GUID of a Plex entry on demand
// @version     3.5.0
// @license     MPL-2.0
// @icon        https://app.plex.tv/desktop/favicon.ico
// @homepageURL https://soitora.com/Plex-GUID-Grabber/
// @include     *:32400/*
// @include     *://plex.*/*
// @include     https://app.plex.tv/*
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.11/clipboard.min.js
// @require     https://cdn.jsdelivr.net/npm/sweetalert2@11
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceText
// @grant       GM_setClipboard
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/525305/Plex%20GUID%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/525305/Plex%20GUID%20Grabber.meta.js
// ==/UserScript==

GM_addStyle(`button[id$="-guid-button"],
button[id$="-yaml-button"] {
    margin-right: 4px;
}

button[id$="-guid-button"]:not([id="imdb-guid-button"]):hover img,
button[id$="-yaml-button"]:not([id="imdb-yaml-button"]):hover img {
    filter: invert(100%) grayscale(100%) contrast(120%);
}

button[id="imdb-guid-button"]:hover img,
button[id="imdb-yaml-button"]:hover img {
    filter: grayscale(100%) contrast(120%);
}

button[id="imdb-guid-button"] img,
button[id="imdb-yaml-button"] img {
    width: 30px !important;
    height: 30px !important;
}

.pgg-toast-container {
    min-width: 400px !important;
    max-width: 800px !important;
}

.pgg-toast-yaml {
    white-space: pre-wrap;
    font-family: monospace;
}
`);

// Initialize GM values if they don't exist
function initializeGMValues() {
    if (GM_getValue("USE_SOCIAL_BUTTONS") === undefined) {
        GM_setValue("USE_SOCIAL_BUTTONS", true);
        console.log(LOG_PREFIX, LOG_STYLE, "Created USE_SOCIAL_BUTTONS storage");
    }

    if (GM_getValue("SOCIAL_BUTTON_SEPARATION") === undefined) {
        GM_setValue("SOCIAL_BUTTON_SEPARATION", true);
        console.log(LOG_PREFIX, LOG_STYLE, "Created SOCIAL_BUTTON_SEPARATION storage");
    }

    if (GM_getValue("USE_PAS") === undefined) {
        GM_setValue("USE_PAS", false);
        console.log(LOG_PREFIX, LOG_STYLE, "Created USE_PAS storage");
    }

    if (GM_getValue("TMDB_API_READ_ACCESS_TOKEN") === undefined) {
        GM_setValue("TMDB_API_READ_ACCESS_TOKEN", "");
        console.log(LOG_PREFIX, LOG_STYLE, "Created TMDB_API_READ_ACCESS_TOKEN storage");
    }

    if (GM_getValue("TMDB_LANGUAGE") === undefined) {
        GM_setValue("TMDB_LANGUAGE", "en-US");
        console.log(LOG_PREFIX, LOG_STYLE, "Created TMDB_LANGUAGE storage");
    }

    if (GM_getValue("TVDB_API_KEY") === undefined) {
        GM_setValue("TVDB_API_KEY", "");
        console.log(LOG_PREFIX, LOG_STYLE, "Created TVDB_API_KEY storage");
    }

    if (GM_getValue("TVDB_SUBSCRIBER_PIN") === undefined) {
        GM_setValue("TVDB_SUBSCRIBER_PIN", "");
        console.log(LOG_PREFIX, LOG_STYLE, "Created TVDB_SUBSCRIBER_PIN storage");
    }

    if (GM_getValue("TVDB_LANGUAGE") === undefined) {
        GM_setValue("TVDB_LANGUAGE", "eng");
        console.log(LOG_PREFIX, LOG_STYLE, "Created TVDB_LANGUAGE storage");
    }
}

// SweetAlert2 Toast
const Toast = Swal.mixin({
    toast: true,
    position: "bottom-right",
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    width: "auto",
    customClass: {
        container: "pgg-toast-container",
    },
});

// Variables
let rightButtonContainer = null;

// Constants
const LOG_PREFIX = "%c🔍 PGG";
const DEBUG_PREFIX = "%c🔍 PGG %cDebug";
const ERROR_PREFIX = "%c🔍 PGG %cError";
const LOG_STYLE = "color: cyan;";
const COLOR_GREEN = "color: lime; font-weight: bold;";
const COLOR_CYAN = "color: cyan; font-weight: bold;";
const ERROR_STYLE = "color: cyan; font-weight: bold; background-color: red;";
const DEBOUNCE_DELAY = 100;
const BUTTON_FADE_DELAY = 50;
const BUTTON_MARGIN = "8px";

// User configuration - Set these values in your userscript manager
const USE_SOCIAL_BUTTONS = GM_getValue("USE_SOCIAL_BUTTONS", true);
const SOCIAL_BUTTON_SEPARATION = GM_getValue("SOCIAL_BUTTON_SEPARATION", true);
const USE_PAS = GM_getValue("USE_PAS", false);
const TMDB_API_READ_ACCESS_TOKEN = GM_getValue("TMDB_API_READ_ACCESS_TOKEN", "");
const TMDB_LANGUAGE = GM_getValue("TMDB_LANGUAGE", "en-US");
const TVDB_API_KEY = GM_getValue("TVDB_API_KEY", "");
const TVDB_SUBSCRIBER_PIN = GM_getValue("TVDB_SUBSCRIBER_PIN", "");
const TVDB_LANGUAGE = GM_getValue("TVDB_LANGUAGE", "eng");

// Initialize
console.log(LOG_PREFIX, LOG_STYLE, "Plex GUID Grabber v3.5.0");
initializeGMValues();

const siteConfig = {
    plex: {
        id: "plex-guid-button",
        name: "Plex",
        icon: "https://raw.githubusercontent.com/Soitora/Plex-GUID-Grabber/main/.github/images/plex.webp",
        buttonLabel: "Copy Plex GUID",
        visible: ["album", "artist", "movie", "season", "episode", "show"],
        isYamlButton: false,
        isSocialButton: false,
    },
    imdb: {
        id: "imdb-social-button",
        name: "IMDb",
        icon: "https://raw.githubusercontent.com/Soitora/Plex-GUID-Grabber/main/.github/images/imdb.webp",
        buttonLabel: "Open IMDB",
        visible: ["movie", "show"],
        isYamlButton: false,
        isSocialButton: true,
    },
    tmdb: {
        id: "tmdb-social-button",
        name: "TMDB",
        icon: "https://raw.githubusercontent.com/Soitora/Plex-GUID-Grabber/main/.github/images/tmdb-small.webp",
        buttonLabel: "Open TMDB",
        visible: ["movie", "show"],
        isYamlButton: false,
        isSocialButton: true,
    },
    tvdb: {
        id: "tvdb-social-button",
        name: "TVDB",
        icon: "https://raw.githubusercontent.com/Soitora/Plex-GUID-Grabber/main/.github/images/tvdb.webp",
        buttonLabel: "Open TVDB",
        visible: ["movie", "show"],
        isYamlButton: false,
        isSocialButton: true,
    },
    mbid: {
        id: "musicbrainz-social-button",
        name: "MusicBrainz",
        icon: "https://raw.githubusercontent.com/Soitora/Plex-GUID-Grabber/main/.github/images/musicbrainz.webp",
        buttonLabel: "Open MusicBrainz",
        visible: ["album", "artist"],
        isYamlButton: false,
        isSocialButton: true,
    },
    anidb: {
        id: "anidb-social-button",
        name: "AniDB",
        icon: "https://raw.githubusercontent.com/Soitora/Plex-GUID-Grabber/main/.github/images/anidb.webp",
        buttonLabel: "Open AniDB",
        visible: ["show", "movie"],
        isYamlButton: false,
        isSocialButton: true,
    },
    youtube: {
        id: "youtube-social-button",
        name: "YouTube",
        icon: "https://raw.githubusercontent.com/Soitora/Plex-GUID-Grabber/main/.github/images/youtube.webp",
        buttonLabel: "Open YouTube",
        visible: ["movie", "show", "episode"],
        isYamlButton: false,
        isSocialButton: true,
    },
    tmdbYaml: {
        id: "tmdb-yaml-button",
        name: "TMDB YAML",
        icon: "https://raw.githubusercontent.com/Soitora/Plex-GUID-Grabber/main/.github/images/tmdb-pas.webp",
        buttonLabel: "Copy TMDB YAML",
        visible: ["movie", "show"],
        isYamlButton: true,
        isSocialButton: false,
    },
    tvdbYaml: {
        id: "tvdb-yaml-button",
        name: "TVDB YAML",
        icon: "https://raw.githubusercontent.com/Soitora/Plex-GUID-Grabber/main/.github/images/tvdb-pas.webp",
        buttonLabel: "Copy TVDB YAML",
        visible: ["movie", "show"],
        isYamlButton: true,
        isSocialButton: false,
    },
};

function handleButtons(metadata, pageType, guid) {
    const leftButtonContainer = $(document).find(".PageHeaderLeft-pageHeaderLeft-GB_cUK");
    const rightButtonContainer = $(document).find(".PageHeaderRight-pageHeaderRight-j9Yjqh");
    console.debug(DEBUG_PREFIX, COLOR_CYAN, COLOR_GREEN, "Button container found:", rightButtonContainer.length > 0);

    if (!rightButtonContainer.length || $("#" + siteConfig.plex.id).length) return;

    const $directory = $(metadata).find("Directory, Video").first();
    const title = $directory.attr("parentTitle") || $directory.attr("title");

    const buttons = createButtonsConfig(guid, pageType, metadata);

    Object.entries(buttons).forEach(([site, { handler, config }]) => {
        if (config.visible.includes(pageType)) {
            if (config.isYamlButton && !USE_PAS) return;

            let shouldShow = true;
            if (config.isYamlButton) {
                const apiSite = site === "tmdbYaml" ? "tmdb" : "tvdb";
                shouldShow = !!guid[apiSite];
            }

            const $button = createButtonElement(config, shouldShow, guid[site], title);

            if ($button) {
                if (site === "plex") {
                    $button.on("click", () => handlePlexButtonClick(guid[site], config, title));
                } else if (config.isYamlButton) {
                    $button.on("click", async () => handleYamlButtonClick(metadata, site, pageType, guid, title));
                } else {
                    $button.on("click", (e) => handler(e));
                }

                appendButtonToContainer($button, config, rightButtonContainer, leftButtonContainer);

                setTimeout(() => {
                    $button.css("opacity", 1);
                }, BUTTON_FADE_DELAY);
            }
        }
    });
}

function createButtonsConfig(guid, pageType, metadata) {
    return Object.keys(siteConfig).reduce((acc, site) => {
        acc[site] = {
            handler: (event) => handleButtonClick(event, site, guid[site], pageType, metadata),
            config: siteConfig[site],
        };
        return acc;
    }, {});
}

function createButtonElement(config, shouldShow, guid, title) {
    if (!USE_SOCIAL_BUTTONS && config.isSocialButton) {
        return null;
    }

    const buttonClasses = ["_1v4h9jl0", "_76v8d62", "_76v8d61", "_76v8d68", "tvbry61", "_76v8d6g", "_76v8d6h", "_1v25wbq1g", "_1v25wbq18"].join(" ");

    const imageContainerClasses = ["_1h4p3k00", "_1v25wbq8", "_1v25wbq1w", "_1v25wbq1g", "_1v25wbq1c", "_1v25wbq14", "_1v25wbq3g", "_1v25wbq2g"].join(" ");

    return $("<button>", {
        id: config.id,
        "aria-label": config.buttonLabel,
        class: buttonClasses,
        css: {
            marginRight: BUTTON_MARGIN,
            display: (config.isYamlButton ? shouldShow : guid) ? "block" : "none",
            opacity: 0,
            transition: "opacity 0.3s ease-in-out",
        },
        html: `
            <div class="${imageContainerClasses}">
                <img src="${config.icon}" alt="${config.buttonLabel}" title="${config.buttonLabel}" style="width: 32px; height: 32px;">
            </div>
        `,
    });
}

// Utility function for clipboard operations
function copyToClipboard(text, successMessage, errorMessage) {
    const formattedText = text.replace(/\n/g, "<br>");

    // Attempt to use clipboard.js
    const tempButton = document.createElement("button");
    const clipboard = new ClipboardJS(tempButton, {
        text: () => text,
    });

    clipboard.on("success", () => {
        Toast.fire({
            icon: "success",
            title: successMessage,
            html: `<span class="pgg-toast-yaml"><strong>Copied Content:</strong><br>${formattedText}</span>`,
        });
        clipboard.destroy();
    });

    clipboard.on("error", () => {
        // Fallback to GM_setClipboard
        try {
            GM_setClipboard(text);
            Toast.fire({
                icon: "success",
                title: successMessage,
                html: `<span class="pgg-toast-yaml"><strong>Copied Content:</strong><br>${formattedText}</span>`,
            });
        } catch (error) {
            console.error(ERROR_PREFIX, ERROR_STYLE, "Failed to copy with GM_setClipboard:", error);
            // Fallback to native clipboard API
            navigator.clipboard
                .writeText(text)
                .then(() => {
                    Toast.fire({
                        icon: "success",
                        title: successMessage,
                        html: `<span class="pgg-toast-yaml"><strong>Copied Content:</strong><br>${formattedText}</span>`,
                    });
                })
                .catch((err) => {
                    console.error(ERROR_PREFIX, ERROR_STYLE, "Failed to copy with native clipboard API:", err);
                    Toast.fire({
                        icon: "error",
                        title: errorMessage,
                        html: err.message,
                    });
                });
        }
    });

    // Trigger the clipboard.js copy action
    tempButton.click();
}

function handlePlexButtonClick(guid, config, title) {
    console.log(LOG_PREFIX, LOG_STYLE, "GUID Output:", guid);
    const successMessage = `Copied ${config.name} guid to clipboard.`;
    const errorMessage = "Failed to copy guid";
    copyToClipboard(guid, successMessage, errorMessage);
}

async function handleYamlButtonClick(metadata, site, pageType, guid, title) {
    try {
        const yamlOutput = await generateYamlOutput(metadata, site, pageType, guid);
        console.log(LOG_PREFIX, LOG_STYLE, "YAML Output:\n", yamlOutput);
        if (yamlOutput) {
            const successMessage = `Copied ${siteConfig[site].name} output to clipboard.`;
            const errorMessage = "Failed to copy YAML output";
            copyToClipboard(yamlOutput, successMessage, errorMessage);
        }
    } catch (error) {
        console.error(ERROR_PREFIX, ERROR_STYLE, "Failed to generate YAML:", error);
        Toast.fire({
            icon: "error",
            title: "Failed to generate YAML",
            html: error.message,
        });
    }
}

function appendButtonToContainer($button, config, rightButtonContainer, leftButtonContainer) {
    if (config.isYamlButton || config.id === siteConfig.plex.id) {
        rightButtonContainer.prepend($button);
    } else {
        if (SOCIAL_BUTTON_SEPARATION) {
            leftButtonContainer.append($button);
        } else {
            rightButtonContainer.prepend($button);
        }
    }
}

function checkApiKeys(site) {
    if (site === "tmdb" && !TMDB_API_READ_ACCESS_TOKEN) {
        Toast.fire({
            icon: "error",
            title: "TMDB Read Access Token Missing",
            html: "Please set your TMDB Read Access Token in the userscript settings",
        });
        return false;
    }
    if (site === "tvdb" && !TVDB_API_KEY) {
        Toast.fire({
            icon: "error",
            title: "TVDB API Key Missing",
            html: "Please set your TVDB API key in the userscript settings",
        });
        return false;
    }
    return true;
}

async function handleButtonClick(event, site, guid, pageType, metadata) {
    console.debug(DEBUG_PREFIX, COLOR_CYAN, COLOR_GREEN, "Button clicked:", site, guid, pageType);

    let title = $(metadata).find("Directory, Video").first();
    title = title.attr("parentTitle") || title.attr("title");

    const urlMap = {
        imdb: `https://www.imdb.com/title/${guid}/`,
        tmdb: pageType === "movie" ? `https://www.themoviedb.org/movie/${guid}` : `https://www.themoviedb.org/tv/${guid}`,
        tvdb: pageType === "movie" ? `https://www.thetvdb.com/dereferrer/movie/${guid}` : `https://www.thetvdb.com/dereferrer/series/${guid}`,
        mbid: pageType === "album" ? `https://musicbrainz.org/album/${guid}` : `https://musicbrainz.org/artist/${guid}`,
        anidb: `https://anidb.net/anime/${guid}`,
        youtube: `https://www.youtube.com/watch?v=${guid}`,
    };

    const url = urlMap[site];

    if (!siteConfig[site].visible.includes(pageType)) {
        Toast.fire({
            icon: "warning",
            title: `${siteConfig[site].name} links are not available for ${pageType} pages.`,
        });
        return;
    }

    if (!guid) {
        Toast.fire({
            icon: "warning",
            title: `No ${siteConfig[site].name} GUID found for this item.`,
        });
        return;
    }

    if (url) {
        const ctrlClick = event.ctrlKey || event.metaKey;
        const newTab = window.open(url, "_blank");

        if (!ctrlClick) {
            newTab.focus();
        }

        Toast.fire({
            icon: "success",
            title: `Opened ${siteConfig[site].name} in a new tab.`,
        });
    }
}

async function getGuid(metadata) {
    if (!metadata) return null;

    const $directory = $(metadata).find("Directory, Video").first();
    console.debug(DEBUG_PREFIX, COLOR_CYAN, COLOR_GREEN, "Directory/Video:", $directory[0]);
    //console.debug(DEBUG_PREFIX, COLOR_CYAN, COLOR_GREEN, "Directory/Video outerHTML:", $directory[0]?.outerHTML);
    //console.debug(DEBUG_PREFIX, COLOR_CYAN, COLOR_GREEN, "Directory/Video innerHTML:", $directory[0]?.innerHTML);

    if (!$directory.length) {
        console.error(ERROR_PREFIX, ERROR_STYLE, "Main element not found in XML");
        return null;
    }

    const guid = initializeGuid($directory);

    if (guid.plex?.startsWith("com.plexapp.agents.hama://")) {
        extractHamaGuid(guid, guid.plex);
    }

    $directory.find("Guid").each(function () {
        const guidId = $(this).attr("id");
        if (guidId) {
            const [service, value] = guidId.split("://");
            if (service && value) {
                extractGuid(guid, service, value);
            }
        }
    });

    return guid;
}

function initializeGuid($directory) {
    return {
        plex: $directory.attr("guid"),
        imdb: null,
        tmdb: null,
        tvdb: null,
        mbid: null,
        anidb: null,
        youtube: null,
    };
}

function extractHamaGuid(guid, plexGuid) {
    const match = plexGuid.match(/com\.plexapp\.agents\.hama:\/\/(\w+)-(\d+)/);
    if (match) {
        extractGuid(guid, match[1], match[2]);
    }
}

function extractGuid(guid, service, value) {
    const normalizedService = service.toLowerCase();
    if (normalizedService.startsWith("tsdb")) {
        guid.tmdb = value;
    } else if (guid.hasOwnProperty(normalizedService)) {
        guid[normalizedService] = value;
    }
}

async function getLibraryMetadata(metadataPoster) {
    const img = metadataPoster.find("img").first();
    if (!img?.length) {
        console.debug(DEBUG_PREFIX, COLOR_CYAN, COLOR_GREEN, "No image found in metadata poster");
        return null;
    }

    const imgSrc = img.attr("src");
    if (!imgSrc) {
        console.debug(DEBUG_PREFIX, COLOR_CYAN, COLOR_GREEN, "No src attribute found in image");
        return null;
    }

    const url = new URL(imgSrc);
    const serverUrl = `${url.protocol}//${url.host}`;
    const plexToken = url.searchParams.get("X-Plex-Token");
    const urlParam = url.searchParams.get("url");
    const metadataKey = urlParam?.match(/\/library\/metadata\/(\d+)/)?.[1];

    if (!plexToken || !metadataKey) {
        console.debug(DEBUG_PREFIX, COLOR_CYAN, COLOR_GREEN, "Missing plexToken or metadataKey", { plexToken: !!plexToken, metadataKey: !!metadataKey });
        return null;
    }

    try {
        const response = await fetch(`${serverUrl}/library/metadata/${metadataKey}?X-Plex-Token=${plexToken}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return new DOMParser().parseFromString(await response.text(), "text/xml");
    } catch (error) {
        console.error(ERROR_PREFIX, ERROR_STYLE, "Failed to fetch metadata:", error.message);
        return null;
    }
}

async function observeMetadataPoster() {
    let isObserving = true;

    const observer = new MutationObserver(
        debounce(async () => {
            if (!isObserving) return;

            if (!window.location.href.includes("%2Flibrary%2Fmetadata%2")) {
                isObserving = false;
                console.debug(DEBUG_PREFIX, COLOR_CYAN, COLOR_GREEN, "Not a metadata page.");
                return;
            }

            const $metadataPoster = $("div[data-testid='metadata-poster']");
            //console.debug(DEBUG_PREFIX, COLOR_CYAN, COLOR_GREEN, "Metadata poster found:", $metadataPoster.length > 0);

            if (!$metadataPoster.length) return;

            isObserving = false;
            const metadata = await getLibraryMetadata($metadataPoster);
            console.debug(DEBUG_PREFIX, COLOR_CYAN, COLOR_GREEN, "Metadata retrieved:", !!metadata);

            const pageType = $(metadata).find("Directory, Video").first().attr("type");
            let title = $(metadata).find("Directory, Video").first();
            title = title.attr("parentTitle") || title.attr("title");

            console.log(LOG_PREFIX, LOG_STYLE, "Type:", pageType);
            console.log(LOG_PREFIX, LOG_STYLE, "Title:", title);

            if (pageType) {
                const guid = await getGuid(metadata);
                console.log(LOG_PREFIX, LOG_STYLE, "Guid:", guid);

                if (guid) {
                    handleButtons(metadata, pageType, guid);
                }
            }
        }, DEBOUNCE_DELAY)
    );

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["data-page-type"],
    });

    const handleNavigation = debounce(() => {
        isObserving = true;
        console.debug(DEBUG_PREFIX, COLOR_CYAN, COLOR_GREEN, "Navigation detected - resuming observation.");
    }, DEBOUNCE_DELAY);

    $(window).on("hashchange popstate", handleNavigation);
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

async function getTVDBToken() {
    const LOGIN_URL = "https://api4.thetvdb.com/v4/login";
    const API_KEY = TVDB_API_KEY;
    const PIN = TVDB_SUBSCRIBER_PIN;

    try {
        const response = await fetch(LOGIN_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({ apikey: API_KEY, pin: PIN }),
        });

        //console.log(DEBUG_PREFIX, "TVDB Token Response:", response);

        if (!response.ok) {
            throw new Error(`Login failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        //console.log(DEBUG_PREFIX, "TVDB Token Data:", data.data);

        return data.data.token;
    } catch (error) {
        console.error(DEBUG_PREFIX, COLOR_CYAN, COLOR_GREEN, "Authentication error:", error);
        return null;
    }
}

async function fetchApiData(url, headers = {}) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: {
                ...headers,
            },
            onload: function (response) {
                if (response.status >= 200 && response.status < 300) {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data);
                    } catch (error) {
                        console.error(ERROR_PREFIX, ERROR_STYLE, "Failed to parse JSON response:", error);
                        Toast.fire({
                            icon: "error",
                            title: "API Error",
                            html: "Failed to parse JSON response",
                        });
                        reject(new Error("Failed to parse JSON response"));
                    }
                } else {
                    console.error(ERROR_PREFIX, ERROR_STYLE, `API error: ${response.status} - ${response.responseText}`);
                    Toast.fire({
                        icon: "error",
                        title: "API Error",
                        html: `Status: ${response.status} - ${response.responseText}`,
                    });
                    reject(new Error(`API error: ${response.status} - ${response.responseText}`));
                }
            },
            onerror: function (error) {
                console.error(ERROR_PREFIX, ERROR_STYLE, "Network error:", error);
                Toast.fire({
                    icon: "error",
                    title: "Network Error",
                    html: error.message,
                });
                reject(new Error(`Network error: ${error}`));
            },
        });
    });
}

async function generateYamlOutput(metadata, site, pageType, guid) {
    const apiSite = site === "tmdbYaml" ? "tmdb" : "tvdb";

    if (!checkApiKeys(apiSite)) return "";

    const mediaType = pageType === "movie" ? "movie" : "tv";
    const $directory = $(metadata).find("Directory, Video").first();
    const plex_guid = $directory.attr("guid");

    try {
        const { title, numberOfSeasons } = await fetchTitleAndSeasons(apiSite, mediaType, guid);
        return constructYamlOutput(title, plex_guid, numberOfSeasons, guid, mediaType);
    } catch (error) {
        console.error(ERROR_PREFIX, ERROR_STYLE, "Error generating YAML output:", error);
        return "";
    }
}

async function fetchTitleAndSeasons(apiSite, mediaType, guid) {
    if (apiSite === "tmdb") {
        return fetchTmdbData(mediaType, guid[apiSite]);
    } else if (apiSite === "tvdb") {
        return fetchTvdbData(mediaType, guid[apiSite]);
    }
}

async function fetchTmdbData(mediaType, tmdbId) {
    const url =
        mediaType === "tv" ? `https://api.themoviedb.org/3/tv/${tmdbId}?language=${TMDB_LANGUAGE}` : `https://api.themoviedb.org/3/movie/${tmdbId}?language=${TMDB_LANGUAGE}`;

    const data = await fetchApiData(url, {
        Accept: "application/json",
        Authorization: `Bearer ${TMDB_API_READ_ACCESS_TOKEN}`,
    });

    const title = mediaType === "tv" ? data.name : data.title;
    const numberOfSeasons = mediaType === "tv" ? data.number_of_seasons || 1 : 1;

    return { title, numberOfSeasons };
}

async function fetchTvdbData(mediaType, tvdbId) {
    const tvdbBearerToken = await getTVDBToken();
    if (!tvdbBearerToken) {
        console.error(ERROR_PREFIX, ERROR_STYLE, "Failed to retrieve TVDB token.");
        return { title: "", numberOfSeasons: 1 };
    }

    const url =
        mediaType === "tv"
            ? `https://api4.thetvdb.com/v4/series/${tvdbId}/translations/${TVDB_LANGUAGE}`
            : `https://api4.thetvdb.com/v4/movies/${tvdbId}/translations/${TVDB_LANGUAGE}`;

    const data = await fetchApiData(url, {
        Accept: "application/json",
        Authorization: `Bearer ${tvdbBearerToken}`,
    });

    const title = data.data.name;
    const numberOfSeasons = mediaType === "tv" ? await fetchTvdbSeasons(tvdbId, tvdbBearerToken) : 1;

    return { title, numberOfSeasons };
}

async function fetchTvdbSeasons(tvdbId, tvdbBearerToken) {
    const episodesData = await fetchApiData(`https://api4.thetvdb.com/v4/series/${tvdbId}/episodes/default/${TVDB_LANGUAGE}`, {
        Accept: "application/json",
        Authorization: `Bearer ${tvdbBearerToken}`,
    });

    const seriesSeasons = new Set();
    episodesData.data.episodes.forEach((episode) => {
        if (episode.seasonNumber !== 0) {
            seriesSeasons.add(episode.seasonNumber);
        }
    });

    return seriesSeasons.size || 1;
}

function constructYamlOutput(title, plex_guid, numberOfSeasons, guid, mediaType) {
    const data = [
        {
            title: title,
            guid: plex_guid,
            seasons: Array.from({ length: numberOfSeasons }, (_, i) => ({
                season: i + 1,
                "anilist-id": 0,
            })),
        },
    ];

    let yamlOutput = jsyaml.dump(data, {
        quotingType: `"`,
        forceQuotes: { title: true },
        indent: 2,
    });

    yamlOutput = yamlOutput.replace(/^(\s*guid: )"([^"]+)"$/gm, "$1$2").trim();

    const url_IMDB = guid.imdb ? `\n  # imdb: https://www.imdb.com/title/${guid.imdb}/` : "";
    const url_TMDB = guid.tmdb ? `\n  # tmdb: https://www.themoviedb.org/${mediaType}/${guid.tmdb}` : "";
    const url_TVDB = guid.tvdb ? `\n  # tvdb: https://www.thetvdb.com/dereferrer/${mediaType === "tv" ? "series" : "movie"}/${guid.tvdb}` : "";

    const guidRegex = /^(\s*guid:.*)$/m;
    return yamlOutput
        .replace(guidRegex, `$1${url_IMDB}${url_TMDB}${url_TVDB}`)
        .replace(/^/gm, "  ")
        .replace(/^\s\s$/gm, "\n");
}

$(document).ready(observeMetadataPoster);
