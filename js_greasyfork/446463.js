// ==UserScript==
// @name           Plex Download Icon
// @description    Remotely download videos associated with the current video on Plex.
// @author         Pip Longrun <pip.longrun@protonmail.com> and futurebum.
// @namespace      Violentmonkey Scripts
// @include        /^https?:\/\/app\.plex\.tv\/desktop/
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require        https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @grant          GM_download
// @license        MIT
// @version        2.01
// @downloadURL https://update.greasyfork.org/scripts/446463/Plex%20Download%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/446463/Plex%20Download%20Icon.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

/* Adapted from Pip's bookmarklet. */

/** (bookmarklet info)
 * https://piplong.run/plxdwnld/bookmarklet.js
 *
 * This project is licensed under the terms of the MIT license, see https://piplongrun.github.io/plxdwnld/LICENSE.txt
 *
 * @author      Pip Longrun <pip.longrun@protonmail.com>
 * @version     0.1
 * @see         https://piplongrun.github.io/plxdwnld/
 *
 */

/* TODO: Use Plex's Playback Settings menu styling instead of native select box. */
/* TODO: Use MutationObserver instead of waitForKeyElements. It's better? Who knows. */
/* TODO: Use checkboxes, 'select all/none', and be able to multidownload. TV: 'Download ep' + 'Download season' + 'Download series'*/
/* TODO: Better or more timely feedback when icon fails to load? */
/* ISSUE: I can't find the '.sub' file of an idx/sub (vobsub) pair. I can only find the idx. Hmm, oh well. If you know how to fetch it, let me know. */
/* ISSUE: Browsers limit the number of open connections to one domain at around 6, which means 'Download All' doesn't work right with numbers above that. Solution: Manage a queue? */
/* QUESTION: Should I eliminate videos with duplicate names? Probably same video in multiple places. */

/****** CONSTANTS ******/

const API_RESOURCE_URL_TEMPLATE = "https://plex.tv/api/resources?includeHttps=1&X-Plex-Token={token}";
const API_LIBRARY_KEY_TEMPLATE = "/library/metadata/{id}";
const REMOTE_URL_TEMPLATE = "{baseuri}{key}?X-Plex-Token={token}";
const REMOTE_DOWNLOAD_PARAM = {
    enabled: "&download=1",
    disabled: "&download=0"
};

const ACCESS_TOKEN_XPATH = "//Device[@clientIdentifier='{clientid}']/@accessToken";
const BASE_URI_XPATH = "//Device[@clientIdentifier='{clientid}']/Connection[@local=0]/@uri";
const PART_XPATH = "/MediaContainer/Video/Media/Part";

const CSS_CLASS_MAPPINGS = {}; // (key=prefixClassName, val=fullClassName), lazy-loaded below in 'mapCssClasses' function.

const PLAYBAR_ANCHOR_CSS_SELECTOR = "a[class^='MetadataPosterTitle-singleLineTitle']";
const PLAYBAR_TV_DETECTOR_CSS_SELECTOR = "span[class^='MetadataPosterTitle-singleLineTitle'] > span";
const PLAYBAR_THREE_DOTS_CSS_SELECTOR = "div[class^='PlayerControls-buttonGroupRight'] > span:nth-child(1)";

const DOWNLOADER_ID = 'plex-download-icon';
const DOWNLOADER_CLASS_KEYS = ['PlayerIconButton-playerButton', 'IconButton-button']; // keys to CSS_CLASS_MAPPINGS.
const DOWNLOADER_STATUSES = { // hex colors for icon, based on current status.
    loading: { // gray
        mouseout: '#808080B3',
        mouseover: '#808080'
    },
    enabled: { // white
        mouseout: '#FFFFFFB3',
        mouseover: '#FFFFFF'
    },
    disabled: { // dim white
        mouseout: '#FFFFFF1A',
        mouseover: '#FFFFFF1A'
    }
};

/* SVG code for download icon. */
// Credits for download icon SVG:
// Found here: https://www.flaticon.com/free-icon/download_1665583
// Author: Freepik @ https://www.flaticon.com/authors/freepik
// Author's website: https://www.freepik.com/
// Icon pack: https://www.flaticon.com/packs/ui-ux-interface
const DOWNLOADER_ICON_SVG = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>" +
    "<path fill='{fillColor}' d='m409.785156 278.5-153.785156 153.785156-153.785156-153.785156 28.285156-28.285156 105.5 105.5v-355.714844h40v355.714844l105.5-105.5zm102.214844 193.5h-512v40h512zm0 0'/>" +
    "</svg>";
/* Base64 conversions needed for hacky styling of <select> element later. */
for (const statuses of Object.values(DOWNLOADER_STATUSES)) {
    for (const[key, hex]of Object.entries(statuses)) {
        statuses[key + '_svg'] = "url('data:image/svg+xml;base64," + window.btoa(DOWNLOADER_ICON_SVG.replace('{fillColor}', hex)) + "') no-repeat";
    }
}

const DOWNLOADER_SELECT_CLASS_KEYS = ['PlexIcon-plexIcon']; // keys to CSS_CLASS_MAPPINGS.
const DOWNLOADER_SELECT_INDICES = {
    disabled: 0,
    optgroup: 1
};

const FILE_TYPE = {
    video: 'video',
    subtitle: 'subtitle'
};
const FILE_SORT = true;

/****** METHODS ******/

// Generic function for sending HTTP requests.
function sendRequest(url, type = 'GET') {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.status == 200) {
                    resolve(request);
                } else {
                    reject(Object.assign(new Error(`HTTP Error (${request.status}) | URL: '${url}'`), {
                            name: 'HTTP Error',
                            request: request,
                            url: url
                        }));
                }
            }
        };
        request.open(type, url);
        request.send();
    });
}

// XML convenience functions.
function getXml(url) {
    return sendRequest(url, 'GET').then(request => request.responseXML);
}
function evaluateXml(xml, xpath, resultType) {
    return xml.evaluate(xpath, xml, null, resultType, null);
}

/* Plex gives new names to their CSS classes from time to time, which breaks the script.
 * The prefixes of the classes seem unique (ex. 'PlayerControls-buttonGroupRight-...'), but there's a suffix that changes.
 * So, I'll just map the prefixes to whatever the full CSS className is, then reference the prefixes. */
var isCssMapped = false;
function mapCssClasses() {
    if (!isCssMapped) {
        isCssMapped = true;
        for (let node of document.querySelectorAll('[class]')) {
            for (let className of node.classList) {
                let classKey = className.includes('-') ? className.slice(0, className.lastIndexOf('-')) : className;
                if (!CSS_CLASS_MAPPINGS.hasOwnProperty(classKey)) { // don't overwrite...
                    CSS_CLASS_MAPPINGS[classKey] = className;
                }
            }
        }
    }
}

function downloadVideo(url, name, size) {
    let a = document.createElement("a");
    a.href = url;
    a.download = name; // doesn't do anything since cross-origin, but oh well.
    a.setAttribute('target', '_blank');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function makeDownloader(mediaUrl) {
    // Make a span to hold the <select> element that'll hold the links.
    let downloader = document.createElement("span");
    downloader.id = DOWNLOADER_ID;
    downloader.className = DOWNLOADER_CLASS_KEYS.map(k => CSS_CLASS_MAPPINGS[k]).join(' '); // plex css.

    // Make <select> element to hold all the links, then add it to downloader.
    let selex = document.createElement("select");
    downloader.append(selex);

    // Set some basic CSS attributes on selex.
    selex.className = DOWNLOADER_SELECT_CLASS_KEYS.map(k => CSS_CLASS_MAPPINGS[k]).join(' '); // plex css.
    selex.style.border = 'none'; // eliminate border
    selex.style.outline = 'none'; // don't show outline when selected
    selex.style.transition = 'none'; // overriding annoying thing in plex class that turns text white.
    selex.style.color = 'black'; // font color (same effect, really)

    // Remove arrow from <select> element.
    selex.style.appearance = 'none';
    selex.style.setProperty('-moz-appearance', 'none');
    selex.style.setProperty('-webkit-appearance', 'none');

    // In place of arrow, show SVG icon. (dumb hack shit; eventually i will make this ui stuff much cleaner and better mimic plex's menus?)
    selex.setStatus = function (status, titleText) {
        let statusInfo = DOWNLOADER_STATUSES[status];
        selex.style.background = statusInfo.mouseout_svg;
        selex.onmouseout = () => {
            selex.style.background = statusInfo.mouseout_svg;
        };
        selex.onmouseover = () => {
            selex.style.background = statusInfo.mouseover_svg;
        };
        selex.title = titleText ? `Download (${titleText})` : 'Download';
        selex.setAttribute('data-status', status);
    };
    selex.setStatus('loading', 'Loading');

    // [0]: Default label. Empty string so just the SVG icon background icon shows. Eh.
    let defaultLabel = document.createElement('option');
    defaultLabel.disabled = true;
    defaultLabel.selected = true;
    defaultLabel.innerHTML = '';
    defaultLabel.style.display = 'none'; // won't show when selex expanded.
    selex.append(defaultLabel);

    // [1]: Files Optgroup to contain links to files to download.
    let files = document.createElement('optgroup');
    files.label = 'Files';
    files.style.fontSize = '13px';

    // Action fired when a selex option is selected.
    selex.onchange = function () {
        // only download if it's video or subtitle under 'files' optgroup, not disabled default index (0).
        if (this.selectedIndex !== DOWNLOADER_SELECT_INDICES.disabled) {
            // assert: all siblings before 'files' optgroup are <option> elements. that is, elements counted by 'selectedIndex', unlike optgroups.
            let el = this.children[DOWNLOADER_SELECT_INDICES.optgroup].children[this.selectedIndex - DOWNLOADER_SELECT_INDICES.optgroup]; // Get 'option' element.
            this.selectedIndex = DOWNLOADER_SELECT_INDICES.disabled; // Reselect disabled 'Download' label to restore default appearance of <select> element.

            // DOWNLOAD
            let url = el.value;
            let name = el.getAttribute('data-name');
            let type = el.getAttribute('data-type');
            if (type == FILE_TYPE.subtitle) { // subtitle
                GM_download(url, name, {
                    saveAs: true
                }); // Use GM_download for subtitles since they're small.
            } else { // video (assert: type === FILE_TYPE.video)
                downloadVideo(url, name, el.getAttribute('data-size')); // Too large for GM_download.
            }
        }
    };

    // OK! Time to populate the files optgroup. Basically, the important part.
    // Get basic data From PlayerBar URL Link.
    let matchArray = mediaUrl.match(/^#!\/server\/([a-f0-9]{40})\/.+metadata%2F(\d+)/);
    let clientId = matchArray[1];
    let metaId = matchArray[2];

    // Context object for async calls below.
    let context = {
        current: 'API-Resource'
    };

    // Get XML from API Resource, which has basic info to construct URLs. (cache info?)
    let apiResourceUrl = API_RESOURCE_URL_TEMPLATE.replace('{token}', localStorage.myPlexAccessToken);
    getXml(apiResourceUrl).then(apiResourceXml => {
        // Populate some more basic data.
        context.token = evaluateXml(apiResourceXml, ACCESS_TOKEN_XPATH.replace('{clientid}', clientId), XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue.textContent;
        context.baseUri = evaluateXml(apiResourceXml, BASE_URI_XPATH.replace('{clientid}', clientId), XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue.textContent;

        // Set up API-Library XML call.
        let isTV = $(PLAYBAR_TV_DETECTOR_CSS_SELECTOR).length > 0;
        let apiLibraryKey = API_LIBRARY_KEY_TEMPLATE.replace('{id}', metaId) + (isTV ? '/allLeaves' : '');
        let apiLibraryUrl = REMOTE_URL_TEMPLATE.replace('{baseuri}', context.baseUri).replace('{key}', apiLibraryKey).replace('{token}', context.token);

        context.current = 'API-Library';
        return getXml(apiLibraryUrl);
    }).then(apiLibraryXml => {
        // Simple data structure to temporarily hold files found in API-Library XML response. Basically allows me to sort the files at the end.
        let media = {};
        let makeOption = (type, url, path, name, size) => {
            let downloadElement = document.createElement('option');
            downloadElement.value = url;
            downloadElement.innerHTML = path;
            downloadElement.setAttribute('data-name', name);
            downloadElement.setAttribute('data-type', type);
            if (size !== null) {
                downloadElement.setAttribute('data-size', size);
            }
            return downloadElement;
        };

        // Search XML response for any 'Part' nodes. They should contain library keys for videos.
        let iterator = evaluateXml(apiLibraryXml, PART_XPATH, XPathResult.ORDERED_NODE_ITERATOR_TYPE);
        let node = iterator.iterateNext();
        while (node) { // Found a 'Part' node.
            // Get the video.
            let videoKey = node.getAttribute('key');
            let videoPath = node.getAttribute('file');
            let videoName = videoPath.substr(videoPath.lastIndexOf('/') + 1);
            let videoUrl = REMOTE_URL_TEMPLATE.replace('{baseuri}', context.baseUri).replace('{key}', videoKey).replace('{token}', context.token);
            let videoSize = parseInt(node.getAttribute('size'));
            let video = makeOption(FILE_TYPE.video, videoUrl, videoPath, videoName, videoSize);
            media[videoPath] = {
                video: video,
                subtitles: []
            };

            // Get any external subs. (srt, really)
            for (let child of node.children) {
                if (child.getAttribute('key') && child.getAttribute('streamType') === '3' && child.tagName === 'Stream') {
                    let subtitleKey = child.getAttribute('key');
                    let subtitleUrl = REMOTE_URL_TEMPLATE.replace('{baseuri}', context.baseUri).replace('{key}', subtitleKey).replace('{token}', context.token);
                    let subtitleLang = child.getAttribute('languageCode'); // 'eng', 'spa', etc.
                    let subtitleCodec = child.getAttribute('codec'); // 'srt', 'ass', etc.
                    let subtitlePath = videoPath.substr(0, videoPath.lastIndexOf('.')) + (subtitleLang ? '.' + subtitleLang : '') + '.' + subtitleCodec;
                    let subtitleName = subtitlePath.substr(subtitlePath.lastIndexOf('/') + 1);
                    let subtitle = makeOption(FILE_TYPE.subtitle, subtitleUrl, subtitlePath, subtitleName);
                    media[videoPath].subtitles.push(subtitle);
                }
            }

            node = iterator.iterateNext();
        }

        // Get keys, sorting if need be.
        let keys = Object.keys(media);
        if (FILE_SORT) {
            keys = keys.sort();
        }

        // Add media files to download element.
        for (let key of keys) {
            let mediaFiles = media[key];
            files.appendChild(mediaFiles.video);
            for (let subtitle of mediaFiles.subtitles) {
                files.appendChild(subtitle);
            }
        }

        // Set download element status to enabled (changes color), then add files to selex.
        selex.setStatus('enabled');
        selex.append(files);
    }).catch(error => {
        console.error(`PLEX_DOWNLOAD_ICON: ${context.current} -> ${error.message}`);

        // Add a short error message to selex's mouse-over title.
        let shortErr = `Error: ${error.name}`;
            if (error.name == 'HTTP Error') {
                let errorStatus = error.request.status;
                if (errorStatus == 0) {
                    shortErr = "No direct connection to server"; // Relay connection.
                } else if (errorStatus == 403) {
                    shortErr = "Downloads forbidden"; // Whatever I tried didn't work, probably the eventual outcome here.
                }
            }

        // Set download element status to disabled (changes color).
        selex.setStatus('disabled', shortErr);
    });

    // Return span that contains <select> element, which will be filled out when the XML request chain resolves.
    return downloader;
}

// playbar can reload (ex. clicking 'settings' button), causing the script to rebuild the download element. so, remember the last one i made.
var lastDownloader = {
    mediaUrl: '',
    downloader: undefined
};
function addDownloader(mediaUrl) {
    let isSameUrl = (mediaUrl == lastDownloader.mediaUrl);
    let downloader = isSameUrl ? lastDownloader.downloader : makeDownloader(mediaUrl);
    let current = $('#' + DOWNLOADER_ID);
    if (current.length == 0) { // add new
        $(PLAYBAR_THREE_DOTS_CSS_SELECTOR).after(downloader);
    } else if (!current[0].isEqualNode(downloader)) { // replace existing?
        current.replaceWith(downloader);
    }

    lastDownloader.mediaUrl = mediaUrl;
    lastDownloader.downloader = downloader;
}

waitForKeyElements(PLAYBAR_ANCHOR_CSS_SELECTOR, playbarAnchor => { // wait for playbar anchor to load.
    let mediaUrl = playbarAnchor.attr('href');
    let isServerMedia = mediaUrl.startsWith('#!\/server\/'); // might be podcast or web show or whatever, in which case ignore.
    if (isServerMedia) {
        if (isCssMapped) {
            addDownloader(mediaUrl);
        } else {
            waitForKeyElements(PLAYBAR_THREE_DOTS_CSS_SELECTOR, threeDots => { // wait for three-dot icon on playbar to load (for 2 css classes).
                waitForKeyElements(`[class^="${DOWNLOADER_SELECT_CLASS_KEYS[0]}"]:eq(0)`, () => { // wait for plexicon to load (for 1 css class).
                    mapCssClasses();
                    addDownloader(mediaUrl);
                }, true);
            }, true);
        }
    }
});
