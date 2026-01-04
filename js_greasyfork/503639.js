// ==UserScript==
// @name        Youtube HLS Enabler
// @namespace   https://github.com/pepeloni-away
// @author      pploni
// @run-at      document-start
// @insert-into page
// @version     1.81
// @description Play the hls manifest from the ios player response. Based on https://github.com/zerodytrash/Simple-YouTube-Age-Restriction-Bypass
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_setClipboard
// @require     https://cdn.jsdelivr.net/npm/hls.js@1
// @match       https://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/503639/Youtube%20HLS%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/503639/Youtube%20HLS%20Enabler.meta.js
// ==/UserScript==

/* user options */

// show a toast notification when successfully obtaining the hls manifest
const notifyOnSuccess = false
// only fetch the hls manifest when premium 1080p is available
// NOTE: youtube doesn't show the premium 1080p option in embeds or when the user is not logged in
const onlyOnPremiumAvailable = true
// automatically switch to the hls manifest when it is added to the player
const onByDefault = false
// show a toasat notification when 616 is in the hls manifest
const notify616 = false
// switch to the hls manifest when it contains 616
const onBy616 = true
const disableLogging = false

// what is 616? what do the changing numbers on the toggle button mean?
// they are youtube specific format ids, ctrl-f them on https://gist.github.com/MartinEesmaa/2f4b261cb90a47e9c41ba115a011a4aa

/* end user options */
const console = {
    log: disableLogging ? function () {} : unsafeWindow.console.log
}

if (unsafeWindow.trustedTypes && unsafeWindow.trustedTypes.createPolicy) {
    if (!unsafeWindow.trustedTypes.defaultPolicy) {
        const fn = _ => _
        trustedTypes.createPolicy('default', {
            createHTML: fn,
            createScriptURL: fn,
            createScript: fn,
        })
    }
    else {
        console.log('there already is a default trustedtypes policy, should probably intercept it')
    }
}


const VALID_PLAYABILITY_STATUSES = ['OK', 'LIVE_STREAM_OFFLINE'];
const GOOGLE_AUTH_HEADER_NAMES = [
    // 'Authorization',
    // 'X-Goog-AuthUser',
    // 'X-Origin',
    'X-Goog-Visitor-Id',
];

var proxy = {
    getPlayer,
    getNext,
    getGoogleVideoUrl,
};

let nextResponseCache = {};

function getGoogleVideoUrl(originalUrl) {
    return Config.VIDEO_PROXY_SERVER_HOST + '/direct/' + btoa(originalUrl.toString());
}

function getPlayer(payload) {
    // Also request the /next response if a later /next request is likely.
    if (!nextResponseCache[payload.videoId] && !isMusic && !isEmbed) {
        payload.includeNext = 1;
    }

    return sendRequest('getPlayer', payload);
}

function getNext(payload) {
    // Next response already cached? => Return cached content
    if (nextResponseCache[payload.videoId]) {
        return nextResponseCache[payload.videoId];
    }

    return sendRequest('getNext', payload);
}

function sendRequest(endpoint, payload) {
    const queryParams = new URLSearchParams(payload);
    const proxyUrl = `${Config.ACCOUNT_PROXY_SERVER_HOST}/${endpoint}?${queryParams}&client=js`;

    try {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', proxyUrl, false);
        xmlhttp.send(null);

        const proxyResponse = nativeJSONParse(xmlhttp.responseText);

        // Mark request as 'proxied'
        proxyResponse.proxied = true;

        // Put included /next response in the cache
        if (proxyResponse.nextResponse) {
            nextResponseCache[payload.videoId] = proxyResponse.nextResponse;
            delete proxyResponse.nextResponse;
        }

        return proxyResponse;
    } catch (err) {
        console.log(err, 'Proxy API Error');
        return { errorMessage: 'Proxy Connection failed' };
    }
}

var Config = window[Symbol()] = {
    // UNLOCKABLE_PLAYABILITY_STATUSES,
    VALID_PLAYABILITY_STATUSES,
    // ACCOUNT_PROXY_SERVER_HOST,
    // VIDEO_PROXY_SERVER_HOST,
    // ENABLE_UNLOCK_CONFIRMATION_EMBED,
    // ENABLE_UNLOCK_NOTIFICATION,
    // SKIP_CONTENT_WARNINGS,
    GOOGLE_AUTH_HEADER_NAMES,
    // BLURRED_THUMBNAIL_SQP_LENGTHS,
};

var innertube = {
    getPlayer: getPlayer$1,
    getNext: getNext$1,
};

function getPlayer$1(payload, useAuth) {
    return sendInnertubeRequest('v1/player', payload, useAuth);
}

function getNext$1(payload, useAuth) {
    return sendInnertubeRequest('v1/next', payload, useAuth);
}

function sendInnertubeRequest(endpoint, payload, useAuth) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', `/youtubei/${endpoint}?key=${getYtcfgValue('INNERTUBE_API_KEY')}&prettyPrint=false`, false);

    if (useAuth /*&& isUserLoggedIn()*/) {
        xmlhttp.withCredentials = true;
        Config.GOOGLE_AUTH_HEADER_NAMES.forEach((headerName) => {
            xmlhttp.setRequestHeader(headerName, get(headerName));
        });
    }

    xmlhttp.send(JSON.stringify(payload));
    return nativeJSONParse(xmlhttp.responseText);
}

const localStoragePrefix = '1080pp_';

function set(key, value) {
    localStorage.setItem(localStoragePrefix + key, JSON.stringify(value));
}

function get(key) {
    try {
        return JSON.parse(localStorage.getItem(localStoragePrefix + key));
    } catch {
        return null;
    }
}

function getSignatureTimestamp() {
    return (
        getYtcfgValue('STS')
        || (() => {
            var _document$querySelect;
            // STS is missing on embedded player. Retrieve from player base script as fallback...
            const playerBaseJsPath = (_document$querySelect = document.querySelector('script[src*="/base.js"]')) === null || _document$querySelect === void 0
                ? void 0
                : _document$querySelect.src;

            if (!playerBaseJsPath) return;

            const xmlhttp = new XMLHttpRequest();
            xmlhttp.open('GET', playerBaseJsPath, false);
            xmlhttp.send(null);

            return parseInt(xmlhttp.responseText.match(/signatureTimestamp:([0-9]*)/)[1]);
        })()
    );
}

function getCurrentVideoStartTime(currentVideoId) {
    // Check if the URL corresponds to the requested video
    // This is not the case when the player gets preloaded for the next video in a playlist.
    if (window.location.href.includes(currentVideoId)) {
        var _ref;
        // "t"-param on youtu.be urls
        // "start"-param on embed player
        // "time_continue" when clicking "watch on youtube" on embedded player
        const urlParams = new URLSearchParams(window.location.search);
        const startTimeString = (_ref = urlParams.get('t') || urlParams.get('start') || urlParams.get('time_continue')) === null || _ref === void 0
            ? void 0
            : _ref.replace('s', '');

        if (startTimeString && !isNaN(startTimeString)) {
            return parseInt(startTimeString);
        }
    }

    return 0;
}

function getUnlockStrategies(videoId, reason) {
    const clientName = getYtcfgValue('INNERTUBE_CLIENT_NAME') || 'WEB';
    const clientVersion = getYtcfgValue('INNERTUBE_CLIENT_VERSION') || '2.20220203.04.00';
    const signatureTimestamp = getSignatureTimestamp();
    const startTimeSecs = getCurrentVideoStartTime(videoId);
    const hl = getYtcfgValue('HL');

    return [
        {
            name: 'ios',
            requiresAuth: true,
            payload: {
                context: {
                    client: {
                        clientName: 'IOS',
                        clientVersion: '19.09.3',
                        deviceModel: 'iPhone14,3',
                        // check https://github.com/yt-dlp/yt-dlp/blob/master/yt_dlp/extractor/youtube.py#L176 for client name/ver updates
                        // userAgent: 'com.google.ios.youtube/19.09.3 (iPhone14,3; U; CPU iOS 15_6 like Mac OS X)',
                        hl,
                    },
                },
                playbackContext: {
                    contentPlaybackContext: {
                        signatureTimestamp,
                    },
                },
                videoId,
                startTimeSecs,
                racyCheckOk: true,
                contentCheckOk: true,
            },
            endpoint: innertube,
        },
    ]
}

let cachedPlayerResponse = {};

function createDeepCopy(obj) {
    return nativeJSONParse(JSON.stringify(obj));
}

function isUserLoggedIn() {
    // LOGGED_IN doesn't exist on embedded page, use DELEGATED_SESSION_ID or SESSION_INDEX as fallback
    if (typeof getYtcfgValue('LOGGED_IN') === 'boolean') return getYtcfgValue('LOGGED_IN');
    if (typeof getYtcfgValue('DELEGATED_SESSION_ID') === 'string') return true;
    if (parseInt(getYtcfgValue('SESSION_INDEX')) >= 0) return true;

    return false;
}

function getUnlockedPlayerResponse(videoId, reason, copy) {
    // Check if response is cached
    // if (cachedPlayerResponse.videoId === videoId) return createDeepCopy(cachedPlayerResponse);
    if (cachedPlayerResponse.videoId === videoId && !copy) {
        try {
            // check if hls manifest expired on the cached response
            // for the edge case of pausing a video at night and continuing it next morning
            const expireDate = cachedPlayerResponse.streamingData.hlsManifestUrl.match(/(?<=expire\/)\d+/)[0]
            const initialSecondsLeft = cachedPlayerResponse.streamingData.expiresInSeconds // 21540, almost 6h. This is a minute before reaching expire date
            const offset = 100
            const secondsNow = Math.floor(Date.now() / 1000)
            const age =  expireDate - secondsNow - offset

            if (initialSecondsLeft - (initialSecondsLeft - age) < 0) {
                console.log('cached player response expired, refetching ...')
            } else {
                console.log(
                    'using cached response',
                    // cachedPlayerResponse,
                )
                return createDeepCopy(cachedPlayerResponse);
            }
        } catch(err) {
            console.log('failed to check cached response age, page reload might be necessary', err)
            return createDeepCopy(cachedPlayerResponse);
        }
    }

    const unlockStrategies = getUnlockStrategies(videoId, reason);

    let unlockedPlayerResponse = {};

    // Try every strategy until one of them works
    unlockStrategies.every((strategy, index) => {
        var _unlockedPlayerRespon6;
        // Skip strategy if authentication is required and the user is not logged in
        // if (strategy.skip || strategy.requiresAuth && !isUserLoggedIn()) return true;

        console.log(`Trying Player Unlock Method #${index + 1} (${strategy.name})`);

        try {
            unlockedPlayerResponse = strategy.endpoint.getPlayer(strategy.payload, strategy.requiresAuth || strategy.optionalAuth);
        } catch (err) {
            console.log(err, `Player Unlock Method ${index + 1} failed with exception`);
        }

        const isStatusValid = Config.VALID_PLAYABILITY_STATUSES.includes(
            (_unlockedPlayerRespon6 = unlockedPlayerResponse) === null || _unlockedPlayerRespon6 === void 0
                || (_unlockedPlayerRespon6 = _unlockedPlayerRespon6.playabilityStatus) === null || _unlockedPlayerRespon6 === void 0
                ? void 0
                : _unlockedPlayerRespon6.status,
        );

        if (isStatusValid) {
            var _unlockedPlayerRespon7;
            /**
             * Workaround: https://github.com/zerodytrash/Simple-YouTube-Age-Restriction-Bypass/issues/191
             *
             * YouTube checks if the `trackingParams` in the response matches the decoded `trackingParam` in `responseContext.mainAppWebResponseContext`.
             * However, sometimes the response does not include the `trackingParam` in the `responseContext`, causing the check to fail.
             *
             * This workaround addresses the issue by hardcoding the `trackingParams` in the response context.
             */
            if (
                !unlockedPlayerResponse.trackingParams
                || !((_unlockedPlayerRespon7 = unlockedPlayerResponse.responseContext) !== null && _unlockedPlayerRespon7 !== void 0
                    && (_unlockedPlayerRespon7 = _unlockedPlayerRespon7.mainAppWebResponseContext) !== null && _unlockedPlayerRespon7 !== void 0
                    && _unlockedPlayerRespon7.trackingParam)
            ) {
                unlockedPlayerResponse.trackingParams = 'CAAQu2kiEwjor8uHyOL_AhWOvd4KHavXCKw=';
                unlockedPlayerResponse.responseContext = {
                    mainAppWebResponseContext: {
                        trackingParam: 'kx_fmPxhoPZRzgL8kzOwANUdQh8ZwHTREkw2UqmBAwpBYrzRgkuMsNLBwOcCE59TDtslLKPQ-SS',
                    },
                };
            }

            /**
             * Workaround: Account proxy response currently does not include `playerConfig`
             *
             * Stays here until we rewrite the account proxy to only include the necessary and bare minimum response
             */
            if (strategy.payload.startTimeSecs && strategy.name === 'Account Proxy') {
                unlockedPlayerResponse.playerConfig = {
                    playbackStartConfig: {
                        startSeconds: strategy.payload.startTimeSecs,
                    },
                };
            }
        }

        return !isStatusValid;
    });

    // Cache response to prevent a flood of requests in case youtube processes a blocked response mutiple times.
    if (!copy) {
        cachedPlayerResponse = { videoId, ...createDeepCopy(unlockedPlayerResponse) };
    }

    return unlockedPlayerResponse;
}

let lastPlayerUnlockVideoId = null;
let lastPlayerUnlockReason = null;

function waitForElement(elementSelector, timeout) {
    const deferred = new Deferred();

    const checkDomInterval = setInterval(() => {
        const elem = document.querySelector(elementSelector);
        if (elem) {
            clearInterval(checkDomInterval);
            deferred.resolve(elem);
        }
    }, 100);

    if (timeout) {
        setTimeout(() => {
            clearInterval(checkDomInterval);
            deferred.reject();
        }, timeout);
    }

    return deferred;
}
// const nativeJSONParse = window.JSON.parse;
// const nativeXMLHttpRequestOpen = window.XMLHttpRequest.prototype.open;
const nativeJSONParse = unsafeWindow.JSON.parse;
const nativeXMLHttpRequestOpen = unsafeWindow.XMLHttpRequest.prototype.open;

const isDesktop = window.location.host !== 'm.youtube.com';
const isMusic = window.location.host === 'music.youtube.com';
const isEmbed = window.location.pathname.indexOf('/embed/') === 0;

function createElement(tagName, options) {
    const node = document.createElement(tagName);
    options && Object.assign(node, options);
    return node;
}

class Deferred {
    constructor() {
        return Object.assign(
            new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
            }),
            this,
        );
    }
}

function pageLoaded() {
    if (document.readyState === 'complete') return Promise.resolve();

    const deferred = new Deferred();

    unsafeWindow.addEventListener('load', deferred.resolve, { once: true });

    return deferred;
}

var tDesktop = '<tp-yt-paper-toast></tp-yt-paper-toast>\n';

var tMobile =
        '<c3-toast>\n    <ytm-notification-action-renderer>\n        <div class="notification-action-response-text"></div>\n    </ytm-notification-action-renderer>\n</c3-toast>\n';

const template = isDesktop ? tDesktop : tMobile;

const nToastContainer = createElement('div', { id: 'toast-container', innerHTML: template });
const nToast = nToastContainer.querySelector(':scope > *');

async function show(message, duration = 5) {
    // if (!Config.ENABLE_UNLOCK_NOTIFICATION) return;
    if (isEmbed) return;

    await pageLoaded();

    // Do not show notification when tab is in background
    if (document.visibilityState === 'hidden') return;

    // Append toast container to DOM, if not already done
    if (!nToastContainer.isConnected) document.documentElement.append(nToastContainer);

    nToast.duration = duration * 1000;
    nToast.show(message);
}

var Toast = { show };

const messagesMap = {
    success: 'hls manifest available',
    fail: 'Failed to fetch hls manifest',
    _616: '616 available',
};

function isPlayerObject(parsedData) {
    return (parsedData === null || parsedData === void 0 ? void 0 : parsedData.videoDetails)
        && (parsedData === null || parsedData === void 0 ? void 0 : parsedData.playabilityStatus);
}

function isPremium1080pAvailable(parsedData) {
    return parsedData?.paygatedQualitiesMetadata?.qualityDetails?.reduce((found, current) => {
        if (current.key === '1080p Premium') {
            return current
        }
        return found
    }, undefined)
}

function getYtcfgValue(name) {
    var _window$ytcfg;
    return (_window$ytcfg = unsafeWindow.ytcfg) === null || _window$ytcfg === void 0 ? void 0 : _window$ytcfg.get(name);
}

function unlockResponse$1(playerResponse) {
    var _playerResponse$video, _playerResponse$playa, _playerResponse$previ, _unlockedPlayerRespon, _unlockedPlayerRespon3;

    const videoId = ((_playerResponse$video = playerResponse.videoDetails) === null || _playerResponse$video === void 0 ? void 0 : _playerResponse$video.videoId)
        || getYtcfgValue('PLAYER_VARS').video_id;
    const reason = ((_playerResponse$playa = playerResponse.playabilityStatus) === null || _playerResponse$playa === void 0 ? void 0 : _playerResponse$playa.status)
        || ((_playerResponse$previ = playerResponse.previewPlayabilityStatus) === null || _playerResponse$previ === void 0 ? void 0 : _playerResponse$previ.status);

    // if (!Config.SKIP_CONTENT_WARNINGS && reason.includes('CHECK_REQUIRED')) {
    //     console.log(`SKIP_CONTENT_WARNINGS disabled and ${reason} status detected.`);
    //     return;
    // }

    lastPlayerUnlockVideoId = videoId;
    lastPlayerUnlockReason = reason;


    const unlockedPlayerResponse = getUnlockedPlayerResponse(videoId, reason);
    // console.log('ios response', unlockedPlayerResponse)

    // // account proxy error?
    // if (unlockedPlayerResponse.errorMessage) {
    //     Toast.show(`${messagesMap.fail} (ProxyError)`, 10);
    //     throw new Error(`Player Unlock Failed, Proxy Error Message: ${unlockedPlayerResponse.errorMessage}`);
    // }

    // check if the unlocked response isn't playable
    if (
        !Config.VALID_PLAYABILITY_STATUSES.includes(
            (_unlockedPlayerRespon = unlockedPlayerResponse.playabilityStatus) === null || _unlockedPlayerRespon === void 0 ? void 0 : _unlockedPlayerRespon.status,
        )
    ) {
        var _unlockedPlayerRespon2;
        Toast.show(`${messagesMap.fail} (PlayabilityError)`, 10);
        throw new Error(
            `Player Unlock Failed, playabilityStatus: ${
                (_unlockedPlayerRespon2 = unlockedPlayerResponse.playabilityStatus) === null || _unlockedPlayerRespon2 === void 0 ? void 0 : _unlockedPlayerRespon2.status
            }`,
        );
    }

    if (!unlockedPlayerResponse.streamingData.hlsManifestUrl) {
        Toast.show(`${messagesMap.fail} (undefined)`, 10)
        throw new Error('response is playable but doesn\'t contain hls manifest (???)', unlockedPlayerResponse)
    }



    // Overwrite the embedded (preview) playabilityStatus with the unlocked one
    if (playerResponse.previewPlayabilityStatus) {
        playerResponse.previewPlayabilityStatus = unlockedPlayerResponse.playabilityStatus;
    }

    // Transfer all unlocked properties to the original player response
    // Object.assign(playerResponse, unlockedPlayerResponse);

    playerResponse.streamingData.__hlsManifestUrl = unlockedPlayerResponse.streamingData.hlsManifestUrl
    // is there a player library that can play dash, hls and mix and match by selecting video and audio streams? like playing 616+251
    // playerResponse.streamingData.__adaptiveFormats = unlockedPlayerResponse.streamingData.adaptiveFormats


    // playerResponse.playabilityStatus.paygatedQualitiesMetadata.qualityDetails[0].value = {} // this closes the popup after click and selects normal 1080p
    // playerResponse.playabilityStatus.paygatedQualitiesMetadata.qualityDetails[0].value.paygatedIndicatorText = 'HLS Manifest'
    // playerResponse.playabilityStatus.paygatedQualitiesMetadata.qualityDetails[0].value.endpoint = {} // remove popup on click, do nothing
    // playerResponse.playabilityStatus.paygatedQualitiesMetadata.restrictedAdaptiveFormats = [] // this removed the option alltogether


    // playerResponse.unlocked = true;

    console.log('set hls manifest')
    if (notifyOnSuccess) {
        Toast.show(messagesMap.success, 2);
    }
}

/**
     *  Handles XMLHttpRequests and
     * - Rewrite Googlevideo URLs to Proxy URLs (if necessary)
     * - Store auth headers for the authentication of further unlock requests.
     * - Add "content check ok" flags to request bodys
     */
function handleXhrOpen(method, url, xhr) {
    const url_obj = new URL(url);
    // let proxyUrl = unlockGoogleVideo(url_obj);
    // if (proxyUrl) {
    //     // Exclude credentials from XMLHttpRequest
    //     Object.defineProperty(xhr, 'withCredentials', {
    //         set: () => {},
    //         get: () => false,
    //     });
    //     return proxyUrl.toString();
    // }

    if (url_obj.pathname.indexOf('/youtubei/') === 0) {
        // Store auth headers in storage for further usage.
        attach$4(xhr, 'setRequestHeader', ([headerName, headerValue]) => {
            if (Config.GOOGLE_AUTH_HEADER_NAMES.includes(headerName)) {
                set(headerName, headerValue);
            }
        });
    }

    // if (Config.SKIP_CONTENT_WARNINGS && method === 'POST' && ['/youtubei/v1/player', '/youtubei/v1/next'].includes(url_obj.pathname)) {
    //     // Add content check flags to player and next request (this will skip content warnings)
    //     attach$4(xhr, 'send', (args) => {
    //         if (typeof args[0] === 'string') {
    //             args[0] = setContentCheckOk(args[0]);
    //         }
    //     });
    // }
}

/**
 *  Handles Fetch requests and
 * - Rewrite Googlevideo URLs to Proxy URLs (if necessary)
 * - Store auth headers for the authentication of further unlock requests.
 * - Add "content check ok" flags to request bodys
 */
function handleFetchRequest(url, requestOptions) {
    const url_obj = new URL(url);
    // const newGoogleVideoUrl = unlockGoogleVideo(url_obj);
    // if (newGoogleVideoUrl) {
    //     // Exclude credentials from Fetch Request
    //     if (requestOptions.credentials) {
    //         requestOptions.credentials = 'omit';
    //     }
    //     return newGoogleVideoUrl.toString();
    // }

    if (url_obj.pathname.indexOf('/youtubei/') === 0 && isObject(requestOptions.headers)) {
        // Store auth headers in authStorage for further usage.
        for (let headerName in requestOptions.headers) {
            if (Config.GOOGLE_AUTH_HEADER_NAMES.includes(headerName)) {
                set(headerName, requestOptions.headers[headerName]);
            }
        }
    }

    // if (Config.SKIP_CONTENT_WARNINGS && ['/youtubei/v1/player', '/youtubei/v1/next'].includes(url_obj.pathname)) {
    //     // Add content check flags to player and next request (this will skip content warnings)
    //     requestOptions.body = setContentCheckOk(requestOptions.body);
    // }
}

function processYtData(ytData) {
    try {
        // if (isPlayerObject(ytData) && isPremium1080pAvailable(ytData.playabilityStatus)) {
        //     if (!ytData.streamingData.__hlsManifestUrl) {
        //         unlockResponse$1(ytData)
        //         console.log('baa', ytData)
        //     }
        // }


        // if (isPlayerObject(ytData)) {
        //     if (isPremium1080pAvailable(ytData)) {
        //         console.log('si prem')
        //         // console.log(value, 'set', value.videoDetails.videoId)
        //         if (!ytData.streamingData.__hlsManifestUrl) {
        //             const id = ytData.videoDetails.videoId
        //             // getIosResponse(id, ytData)
        //             unlockResponse$1(ytData)
        //         }
        //     } else {
        //         console.log('ni prem')
        //     }
        // }
    } catch (err) {
        // console.log(err, 'Premium 1080p unlock failed')
    }

    return ytData;
}

try {
    attach$3(processYtData);
    attach$2(processYtData);
    attach(handleXhrOpen);
    attach$1(handleFetchRequest);

} catch (err) {
    console.log(err, 'Error while attaching data interceptors');
}

function attach$4(obj, prop, onCall) {
    if (!obj || typeof obj[prop] !== 'function') {
        return;
    }

    let original = obj[prop];

    obj[prop] = function() {
        try {
            onCall(arguments);
        } catch {}
        original.apply(this, arguments);
    };
}

let ageRestricted = false
let live = false
function attach$3(onInitialData) {
    interceptObjectProperty('playerResponse', (obj, playerResponse) => {
        // console.log(`playerResponse property set, contains sidebar: ${!!obj.response}`);

        // The same object also contains the sidebar data and video description
        if (isObject(obj.response)) onInitialData(obj.response);

        // If the script is executed too late and the bootstrap data has already been processed,
        // a reload of the player can be forced by creating a deep copy of the object.
        // This is especially relevant if the userscript manager does not handle the `@run-at document-start` correctly.
        // playerResponse.unlocked = false;

        onInitialData(playerResponse);




        const id = playerResponse?.videoDetails?.videoId
        // don't run on unavailable videos
        // don't run when hovering over videos on the youtube home page
        // don't run on unavailable videos (no streaming data)
        if (
            id &&
            location.href.includes(id) &&
            playerResponse.streamingData &&
            playerResponse.videoDetails
        ) {
            if (id !== sharedPlayerElements.id) {
                ageRestricted = !!playerResponse.unlocked || !!playerResponse.YHEageRestricted // for cached responses
                live = !!playerResponse.videoDetails.isLive
                console.log(
                    '-----------------------------------------------------\nnew vid',
                    id,
                    '\nis live:',
                    live,
                    '\nis SYARB unlocked:',
                    ageRestricted,
                    // playerResponse,
                )
                resetPlayer()
                sharedPlayerElements.hlsUrl = false
                // mark response as ageRestricted so we know if we meet it agan from cache without playerResponse.unlocked
                ageRestricted && (playerResponse.YHEageRestricted = true)
            }

            // don't run when https://github.com/zerodytrash/Simple-YouTube-Age-Restriction-Bypass unlocked the video
            // don't run on live content
            if (!ageRestricted && !live && (isPremium1080pAvailable(playerResponse.playabilityStatus) || !onlyOnPremiumAvailable)) {
                if (!playerResponse.streamingData.__hlsManifestUrl) {
                    unlockResponse$1(playerResponse)
                    // console.log('unlock fn, obj', unlockResponse$1, playerResponse)
                    // sharedPlayerElements.hlsUrl = playerResponse.streamingData.__hlsManifestUrl
                }
                sharedPlayerElements.hlsUrl = playerResponse.streamingData.__hlsManifestUrl
                setupPlayer()
            }

            sharedPlayerElements.id = id
        }
        currentVideoId = id




        // return playerResponse.unlocked ? createDeepCopy(playerResponse) : playerResponse;
        return playerResponse
    });

    // The global `ytInitialData` variable can be modified on the fly.
    // It contains search results, sidebar data and meta information
    // Not really important but fixes https://github.com/zerodytrash/Simple-YouTube-Age-Restriction-Bypass/issues/127
    unsafeWindow.addEventListener('DOMContentLoaded', () => {
        if (isObject(unsafeWindow.ytInitialData)) {
            onInitialData(unsafeWindow.ytInitialData);
        }
    });
}

function attach$2(onJsonDataReceived) {
    unsafeWindow.JSON.parse = function() {
        const data = nativeJSONParse.apply(this, arguments);
        return isObject(data) ? onJsonDataReceived(data) : data;
    };
}

function attach$1(onRequestCreate) {
    if (typeof unsafeWindow.Request !== 'function') {
        return;
    }

    unsafeWindow.Request = new Proxy(unsafeWindow.Request, {
        construct(target, args) {
            let [url, options] = args;
            try {
                if (typeof url === 'string') {
                    if (url.indexOf('/') === 0) {
                        url = window.location.origin + url;
                    }

                    if (url.indexOf('https://') !== -1) {
                        const modifiedUrl = onRequestCreate(url, options);

                        if (modifiedUrl) {
                            args[0] = modifiedUrl;
                        }
                    }
                }
            } catch (err) {
                console.log(err, `Failed to intercept Request()`);
            }

            return Reflect.construct(target, args);
        },
    });
}

function attach(onXhrOpenCalled) {
    unsafeWindow.XMLHttpRequest.prototype.open = function(...args) {
        let [method, url] = args;
        try {
            if (typeof url === 'string') {
                if (url.indexOf('/') === 0) {
                    url = window.location.origin + url;
                }

                if (url.indexOf('https://') !== -1) {
                    const modifiedUrl = onXhrOpenCalled(method, url, this);

                    if (modifiedUrl) {
                        args[1] = modifiedUrl;
                    }
                }
            }
        } catch (err) {
            console.log(err, `Failed to intercept XMLHttpRequest.open()`);
        }

        nativeXMLHttpRequestOpen.apply(this, args);
    };
}



function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}

function interceptObjectProperty(prop, onSet) {
    var _Object$getOwnPropert;
    // Allow other userscripts to decorate this descriptor, if they do something similar
    // const dataKey = '__SYARB_' + prop;
    const dataKey = '__1080pp_' + prop;
    const { get: getter, set: setter } = (_Object$getOwnPropert = Object.getOwnPropertyDescriptor(Object.prototype, prop)) !== null && _Object$getOwnPropert !== void 0
        ? _Object$getOwnPropert
        : {
            set(value) {
                this[dataKey] = value;
            },
            get() {
                return this[dataKey];
            },
        };

    // Intercept the given property on any object
    // The assigned attribute value and the context (enclosing object) are passed to the onSet function.
    Object.defineProperty(Object.prototype, prop, {
        set(value) {
            setter.call(this, isObject(value) ? onSet(this, value) : value);
        },
        get() {
            return getter.call(this);
        },
        configurable: true,
    });
}

// const hls = new Hls() // api guide at https://github.com/video-dev/hls.js/blob/master/docs/API.md

// method 1
/* class fLoader extends Hls.DefaultConfig.loader {
    constructor(config) {
        super(config);
        const load = this.load.bind(this);
        this.load = function (context, config, callbacks) {
            // console.log(...arguments)
            const onError = callbacks.onError
            callbacks.onError = function (error, context, xhr) {
                // hls.js doesn' retry on code 0 cors error, change it here for shouldRetry to be called next
                // https://github.com/video-dev/hls.js/blob/773fe886ed45cc83a015045c314763953b9a49d9/src/utils/error-helper.ts#L77

                console.log('err', ...arguments, 'errrrr', this.requestTimeout)
                if (error.code === 0 && new URL(context.url).hostname.endsWith('.googlevideo.com')) {
                    GM_xmlhttpRequest({
                        url: context.url,
                        onload: function (r) {
                            if (r.status === 200 && r.finalUrl !== context.url) {
                                error.code = 302
                                error.recoverable = true // this gets passed to shouldRetry
                                // context.frag._url is the url used if shouldRetry returns true
                                context.frag._url = r.finalUrl
                                onError(error, context, xhr)
                            }
                        },
                        onerror: function (r) {
                            console.log(
                                'Failed to recover cors error',
                                r,
                            )
                            onError(error, context, xhr)
                        }
                    })
                } else {
                    onError(error, context, xhr)
                }
            }
            load(context, config, callbacks);
        }
    }
} */

// method 3
// fLoader only runs on fragments
// add .isFragment to xhr here to use it in xhrSetup
class fLoader2 extends Hls.DefaultConfig.loader {
    constructor(config) {
        super(config);
        this.loadInternal = function() {
            var t = this,
                e = this.config,
                r = this.context;
            if (e && r) {
                var i = this.loader = new self.XMLHttpRequest,
                    n = this.stats;
                i.isFragment = true // just adding this to the original loadInternal function, we use it in xhrSetup
                n.loading.first = 0, n.loaded = 0, n.aborted = !1;
                var a = this.xhrSetup;
                a ? Promise.resolve().then((function() {
                    if (!t.stats.aborted) return a(i, r.url)
                })).catch((function(t) {
                    return i.open("GET", r.url, !0), a(i, r.url)
                })).then((function() {
                    t.stats.aborted || t.openAndSendXhr(i, r, e)
                })).catch((function(e) {
                    t.callbacks.onError({
                        code: i.status,
                        text: e.message
                    }, r, i, n)
                })) : this.openAndSendXhr(i, r, e)
            }
        }.bind(this)
    }
}
// const desc = Object.getOwnPropertyDescriptor(Hls.DefaultConfig.abrController.prototype, "nextAutoLevel")
//
// Object.defineProperty(Hls.DefaultConfig.abrController.prototype, "nextAutoLevel", {
//     get: desc.get,
//     set: new Proxy(desc.set, {
//         apply(target, thisArg, args) {
//             console.log('set nextautolvl', ...arguments, 'bb', )
//             return Reflect.apply(...arguments)
//         }
//     })
// })

const hls = new Hls({
    // sometimes segment urls redirect to a different url (usually 234 audio)
    // the redirect loses the Origin request header and we get blocked by cors
    // https://stackoverflow.com/a/22625354 - related info

    // workaround method 1 requests redirecting fragments twice, once via gm_xhr to get the final url
    // and hls.js requests the final url again.
    // inefficient but nothing compared to the amount of abuse the yt fragment urls can take.
    // :::: it seems it breaks the built in hls.js autobitrate controller and sometimes gets stuck on low quality
    // :::: makes hls.bandwidthEstimate grow forever?
    //
    // check git here for older discarded workaround ideas if the current one fails later on
    debug: false,
    // startLevel: 15, // this gets the player stuck if your internet isn't up to par with 616, or 1440p if 616 is not available
    // startFragPrefetch: true,
    abrEwmaDefaultEstimate: 5000000, // bump to 5MBps from 0.5 MBps default, reasonable if you have good enough internet to consider this userscript i'd say
                                     // also doesn't take away the ability to auto adjust to lower res if needed

    // methon 1
   /*  fragLoadPolicy: {
        default: {
          maxTimeToFirstByteMs: 9000,
          maxLoadTimeMs: 100000,
          timeoutRetry: {
            maxNumRetry: 2,
            retryDelayMs: 0,
            maxRetryDelayMs: 0,
          },
          errorRetry: {
            maxNumRetry: 5,
            retryDelayMs: 3000,
            maxRetryDelayMs: 15000,
            backoff: 'linear',
            // can't find a way to define shouldRetry alone without this entire block
            shouldRetry: function(retryConfig, retryCount, isTimeout, loaderResponse, originalShouldRetryResponse) {
                if (loaderResponse.recoverable) {
                    console.log(
                        'Retrying recoverable cors error. Attempt nr:',
                        retryCount,
                    )
                    // retryConfig.retryDelayMs = 150
                    retryConfig.retryDelayMs = 0 // hmm, this actually changes the entire config
                    retryConfig.maxRetryDelayMs = 0
                    return true
                }
                retryConfig.retryDelayMs = 3000
                retryConfig.maxRetryDelayMs = 15000
                return originalShouldRetryResponse
            }
          },
        },
      },
    fLoader: fLoader, */


      fLoader: fLoader2,
      xhrSetup(xhr, url) {

        // method 2
        // this block alone works perfectly but requests everything twice so it is slower
        /* return new Promise(function(resolve, reject) {
            // console.log('req')
            GM_xmlhttpRequest({
                url: url,
                onload: function(r) {
                    // console.log('loaded')
                    if (r.status === 200) {
                        xhr.open('GET', r.finalUrl)
                        resolve()
                    }
                },
                onerror: function(r) {
                    console.log(
                        'Failed to recover cors error',
                        r,
                    )
                    reject()
                }
            })
        }) */

        // method 3
        // source code reference https://github.com/video-dev/hls.js/blob/773fe886ed45cc83a015045c314763953b9a49d9/src/utils/xhr-loader.ts#L153
        // this only requests fragments once with gm_xhr
        // seems to also work perfectly so far
        if (xhr.isFragment) {
            // const ogsend = xhr.send.bind(xhr)
            xhr.send = function(...args) {
                // console.log('sent')
                xhr._onreadystatechange = xhr.onreadystatechange
                xhr._onprogress = xhr.onprogress
                xhr.onprogress = null
                xhr.onreadystatechange = null
                Object.defineProperty(xhr, "readyState", {writable: true})
                Object.defineProperty(xhr, "status", {writable: true})
                Object.defineProperty(xhr, "response", {writable: true})

                // return ogsend(...args)
            }

            return new Promise(function(resolve, reject) {
                // console.log('req')
                GM_xmlhttpRequest({
                    url: url,
                    responseType: 'arraybuffer',
                    // onprogress: function(e) {
                    //     xhr._onprogress({
                    //         loaded: e.loaded,
                    //         total: e.total
                    //     })
                    // },
                    onprogress: xhr._onprogress,
                    onreadystatechange: function(e) {
                        // console.log(
                        //     'rsc',
                        //     // e,
                        //     // xhr
                        // )
                        xhr.status = e.status
                        xhr.readyState = e.readyState
                        xhr.response = e.response
                        xhr._onreadystatechange()
                    }
                })
                resolve()
            })
        }
      }
})

const sharedPlayerElements = {}
unsafeWindow.Hls = Hls
unsafeWindow.hls = hls
unsafeWindow.sharedPlayerElements = sharedPlayerElements
// self.hls = hls
// self.sharedPlayerElements = sharedPlayerElements
function setupPlayer() {
    if (sharedPlayerElements.hlsToggle) return
    const div = document.createElement('div')
    div.innerHTML = `<div id="yt1080pp" class="ytp-menuitem" role="menuitemcheckbox" aria-checked="false" tabindex="0"><div style="text-align: center;" class="ytp-menuitem-icon">pp</div><div class="ytp-menuitem-label"><span>Hls manifest</span><br><div style="display: none;"><span id="yt1080pp_vitag">0</span><span id="yt1080pp_va_separator">/</span><span id="yt1080pp_aitag">0</span></div></div><div class="ytp-menuitem-content"><div class="ytp-menuitem-toggle-checkbox"></div></div></div>`
    const wtf = div.firstChild
    if (isEmbed) {
        wtf.firstChild.innerText = ''
    }

    wtf.addEventListener('click', _ => {
        if (wtf.ariaChecked === 'false') {
            wtf.ariaChecked = 'true'

            // block the normal quality button
            wtf.previousSibling.style.position = 'relative'
            const blocker = createElement('div', {
                style: 'background-color: rgba(0 0 0 / 0.5);width: 100%;height: 100%;position: absolute;top: 0;left: 0;cursor: not-allowed;',
                onclick: e => {
                    e.stopPropagation()
                    e.preventDefault()
                }
            })
            wtf.previousSibling.append(blocker)
            wtf.querySelector('br').nextSibling.style.display = ''
            sharedPlayerElements.blocker = blocker

            hookHlsjs()
        } else {
            wtf.ariaChecked = 'false'

            wtf.previousSibling.style.position = ''
            wtf.querySelector('br').nextSibling.style.display = 'none'
            sharedPlayerElements.blocker?.remove?.()
            sharedPlayerElements.blocker = false

            unhookHlsjs()
        }
    })

    function panelReady() {
        const panel = document.querySelector('div:not(.ytp-contextmenu) > div.ytp-panel > .ytp-panel-menu')
        const vid = document.querySelector('video.html5-main-video')
        const settings = document.querySelector('.ytp-settings-button')
        if (panel && panel.childElementCount === 0 && settings) {
            // settings panel is empty until opened when first loading the page
            settings.click()
            settings.click()
        }
        return (panel && vid && settings && panel.firstChild) ? panel : undefined
    }
    function addTo(target) {
        target.append(wtf)
        sharedPlayerElements.hlsToggle = wtf
        console.log('added toggle')

        if (onByDefault) {
            wtf.click()
            console.log('autostarted hls')
        }

        if (notify616 || onBy616) {
            fetch(sharedPlayerElements.hlsUrl)
            .then(r => r.text())
            .then(r => {
                const match = r.match(/\/itag\/616\//)
                if (match) {
                    if (notify616) {
                        Toast.show(messagesMap._616, 2)
                        console.log('616 detected')
                    }
                    if (!onByDefault && onBy616) {
                        wtf.click()
                        console.log('started hls because 616')
                    }
                }
            })
        }
    }

    if (panelReady()) {
        // addTo(panelReady())
        setTimeout(addTo.bind(null, panelReady()))
    } else {
        new MutationObserver(function(m) {
            label: for (const i of m) {
                const panel = panelReady()
                if (panel) {
                    this.disconnect()
                    addTo(panel)

                    break label
                }
            }
        }).observe(document, {subtree: true, childList: true})
    }
    sharedPlayerElements.hlsToggle = true
    console.log('adding toggle')
}

function resetPlayer() {
    if (sharedPlayerElements.hlsToggle) {
        if (sharedPlayerElements.hlsToggle.ariaChecked === 'true') {
            sharedPlayerElements.hlsToggle.click()
        }
        sharedPlayerElements.hlsToggle.remove()
        sharedPlayerElements.hlsToggle = false
        console.log('removed toggle')
    }
}

function hookHlsjs() {
    const vid = document.querySelector('video')
    const time = vid.currentTime
    if (vid.src) {
        sharedPlayerElements.pre_hlsjs_hook_src = vid.src
    }

    hls.loadSource(sharedPlayerElements.hlsUrl)
    hls.attachMedia(vid)

    hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        // console.log(event, data)
        const itag = hls.levels[data.level].url[0].match(/(?<=itag\/)\d+/)?.[0] || '?'
        document.querySelector('#yt1080pp_vitag').innerText = itag
    })

    hls.on(Hls.Events.AUDIO_TRACK_SWITCHED , (event, data) => {
        // console.log(event, data)
        const itag = data?.attrs?.["GROUP-ID"] || '?'
        document.querySelector('#yt1080pp_aitag').innerText = itag
    })

    hls.on(Hls.Events.ERROR, (event, data) => {
        console.log(event, data)
        // we can check if the error was solved in data.errorAction.resolved
        if (data.fatal) {
            console.log('fatal error, disabling. A page reload might fix this')
            Toast.show('fatal playback error')
            if (sharedPlayerElements.hlsToggle.ariaChecked === 'true') {
                sharedPlayerElements.hlsToggle.click()
            }
        }
        // should self disable if we can't play because cors issues or anything else really
    })

    vid.currentTime = time
    vid.pause()
    vid.play()
}

function unhookHlsjs() {
    const vid = hls.media
    hls.detachMedia(vid) // this also removes the src attribute

    if (sharedPlayerElements.pre_hlsjs_hook_src) {
        vid.src = sharedPlayerElements.pre_hlsjs_hook_src
        delete sharedPlayerElements.pre_hlsjs_hook_src
    }
    // vid.src = undefined // it seems youtube fixes this almost instantly
}




let currentVideoId
let menuCommandId = 'copyHls'
const opts = {
    id: menuCommandId,
    autoClose: false,
}
const initialCaption = 'Copy new hls manifest'
function menuCommandFn() {
    console.log('copy new hls manifest clicked')
    menuCommandId = GM_registerMenuCommand('Fetching...', _ => {}, opts)
    const newResponse = getUnlockedPlayerResponse(currentVideoId, '', true)
    const url = newResponse?.streamingData?.hlsManifestUrl
    if (url) {
        GM_setClipboard(url, 'text/plain')
        menuCommandId = GM_registerMenuCommand('Copied!', _ => {}, opts)
        setTimeout(
            _ => { menuCommandId = GM_registerMenuCommand(initialCaption, menuCommandFn, opts) },
            1000
        )
        return
    }
    menuCommandId = GM_registerMenuCommand('Error!', _ => {}, opts)
    console.log('failed to copy hls manifest', newResponse)
    setTimeout(
        _ => { menuCommandId = GM_registerMenuCommand(initialCaption, menuCommandFn, opts) },
        3000
    )
}
menuCommandId = GM_registerMenuCommand(initialCaption, menuCommandFn, opts)
