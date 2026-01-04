// ==UserScript==
// @name         AppleGuessr
// @namespace    https://greasyfork.org/en/users/946023-mistystar
// @version      2.1
// @description  Adds Apple Look Around to GeoGuessr
// @author       Mistystar (Mistystar#2205, https://github.com/kittenz) & stocc (stocc#2919, https://github.com/stocc)
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// @license      MIT
// @run-at       document-start
// @require 	 https://cdn.jsdelivr.net/npm/protobufjs@7.0.0/dist/protobuf.js
// @require		 https://cdn.jsdelivr.net/npm/long@5/umd/index.js
// @require 	 https://cdn.jsdelivr.net/gh/chebum/heic2any@2c517409ac73e86e92560312b58fcfd565ad7393/dist/heic2any.min.js

// @downloadURL https://update.greasyfork.org/scripts/449488/AppleGuessr.user.js
// @updateURL https://update.greasyfork.org/scripts/449488/AppleGuessr.meta.js
// ==/UserScript==



/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 297:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// Blatantly stolen from https://github.com/sk-zk/lookaround-map/blob/main/static/auth.js
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Authenticator_instances, _Authenticator_generateSessionId, _Authenticator_generateTokenP3;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Authenticator = void 0;
const options_1 = __webpack_require__(944);
const proto_1 = __webpack_require__(224);
const TOKEN_P1 = "4cjLaD4jGRwlQ9U";
const MANIFEST_URL = "https://gspe35-ssl.ls.apple.com/geo_manifest/dynamic/config?application=geod" +
    "&application_version=1&country_code=US&hardware=MacBookPro11,2&os=osx" +
    "&os_build=20B29&os_version=11.0.1";
var GLOBAL_TOKENP2 = undefined;
class Authenticator {
    constructor() {
        _Authenticator_instances.add(this);
        this.sessionId = null;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.refreshCredentials();
        });
    }
    refreshCredentials() {
        return __awaiter(this, void 0, void 0, function* () {
            this.sessionId = __classPrivateFieldGet(this, _Authenticator_instances, "m", _Authenticator_generateSessionId).call(this);
        });
    }
    hasSession() {
        return this.sessionId != null;
    }
    getTokenP2() {
        return __awaiter(this, void 0, void 0, function* () {
            if (GLOBAL_TOKENP2 == undefined) {
                GLOBAL_TOKENP2 = (yield this.getResourceManifest()).tokenP2;
            }
            return GLOBAL_TOKENP2;
        });
    }
    authenticateUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const urlObj = new URL(url);
            let p2 = yield this.getTokenP2();
            const tokenP3 = __classPrivateFieldGet(this, _Authenticator_instances, "m", _Authenticator_generateTokenP3).call(this);
            const token = TOKEN_P1 + p2 + tokenP3;
            const timestamp = Math.floor(Date.now() / 1000) + 4200;
            const separator = urlObj.search ? "&" : "?";
            let urlPath = urlObj.pathname;
            if (urlObj.search) {
                urlPath += urlObj.search;
            }
            const plaintext = `${urlPath}${separator}sid=${this.sessionId}${timestamp}${tokenP3}`;
            const plaintextBytes = new TextEncoder().encode(plaintext);
            const key = yield sha256(token);
            const ciphertext = yield aes(key, plaintextBytes);
            const ciphertextB64 = btoa(String.fromCharCode(...new Uint8Array(ciphertext)));
            const ciphertextUrl = encodeURIComponent(ciphertextB64);
            const accessKey = `${timestamp}_${tokenP3}_${ciphertextUrl}`;
            const final = `${url}${separator}sid=${this.sessionId}&accessKey=${accessKey}`;
            return final;
        });
    }
    getResourceManifest() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(options_1.CORS_PROXY + MANIFEST_URL);
            let pb = yield response.arrayBuffer();
            return yield proto_1.default.parseResourceManifest(pb);
        });
    }
}
exports.Authenticator = Authenticator;
_Authenticator_instances = new WeakSet(), _Authenticator_generateSessionId = function _Authenticator_generateSessionId() {
    let id = "";
    for (let i = 0; i < 40; i++) {
        const digit = (Math.random() * 10) | 0;
        id += digit.toString();
    }
    return id;
}, _Authenticator_generateTokenP3 = function _Authenticator_generateTokenP3() {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let token = "";
    for (let i = 0; i < 16; i++) {
        const idx = (Math.random() * chars.length) | 0;
        token += chars[idx];
    }
    return token;
};
function sha256(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = yield window.crypto.subtle.digest("SHA-256", msgBuffer);
        return hashBuffer;
    });
}
function aes(key, encodedMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        const iv = new Uint8Array(16); // 16 zeroes
        const cryptoKey = yield window.crypto.subtle.importKey("raw", key, { name: "AES-CBC" }, true, ["encrypt"]);
        return yield window.crypto.subtle.encrypt({
            name: "AES-CBC",
            iv,
        }, cryptoKey, encodedMessage);
    });
}
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 97:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const TILE_SIZE = 256;
class GeoUtils {
    static haversineDistance(coords1, coords2) {
        function toRad(x) {
            return x * Math.PI / 180;
        }
        var lon1 = coords1[0];
        var lat1 = coords1[1];
        var lon2 = coords2[0];
        var lat2 = coords2[1];
        var R = 6371; // km
        var x1 = lat2 - lat1;
        var dLat = toRad(x1);
        var x2 = lon2 - lon1;
        var dLon = toRad(x2);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    }
    static radians_to_degrees(radians) {
        var pi = Math.PI;
        return radians * (180 / pi);
    }
    static headingFromUnknowns(unknown10, unknown11) {
        let westmin = 1;
        let westmax = 2159;
        let eastmin = 16383; // looking (north/south) and very slightly east
        let eastmax = 14318; // looking slightly (north/south) directly east
        let northmin = 8204; // this is likely lower
        let northmax = 6054;
        let southmin = 8204; // this is likely lower
        let southmax = 10173;
        var ew = 0;
        if (unknown10 < westmax) {
            ew = -((unknown10 - westmin) / (westmax - westmin));
        }
        else if (unknown10 > eastmax) {
            ew = ((unknown10 - eastmin) / (eastmax - eastmin));
        }
        var ns = 0;
        if (unknown11 <= northmin) {
            ns = ((unknown11 - northmin) / (northmax - northmin));
        }
        else {
            ns = -((unknown11 - southmin) / (southmax - southmin));
        }
        var r = GeoUtils.radians_to_degrees(Math.atan2(ew, ns));
        if (r < 0) {
            r += 360;
        }
        return r;
    }
    static mercator_to_wgs84(x, y) {
        let lat = (2 * Math.atan(Math.exp((y - 128) / -(256 / (2 * Math.PI)))) - Math.PI / 2) / (Math.PI / 180);
        let lon = (x - 128) / (256 / 360);
        return [lat, lon];
    }
    static tile_coord_to_wgs84(x, y, z) {
        let scale = 1 << z;
        let pixel_coord = [x * TILE_SIZE, y * TILE_SIZE];
        let world_coord = [pixel_coord[0] / scale, pixel_coord[1] / scale];
        let lat_lon = GeoUtils.mercator_to_wgs84(world_coord[0], world_coord[1]);
        return [lat_lon[0], lat_lon[1]];
    }
    static protobuf_tile_offset_to_wsg84(x_offset, y_offset, tile_x, tile_y) {
        let pano_x = tile_x + (x_offset / 64.0) / (TILE_SIZE - 1);
        let pano_y = tile_y + (255 - (y_offset / 64.0)) / (TILE_SIZE - 1);
        let coords = GeoUtils.tile_coord_to_wgs84(pano_x, pano_y, 17);
        return coords;
    }
    static wgs84_to_mercator(lat, lon) {
        var siny = Math.sin(lat * Math.PI / 180);
        siny = Math.min(Math.max(siny, -0.9999), 0.9999);
        return [
            TILE_SIZE * (0.5 + lon / 360),
            TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
        ];
    }
    static wgs84_to_tile_coord(lat, lon, zoom) {
        var scale = 1 << zoom;
        var world_coord = this.wgs84_to_mercator(lat, lon);
        var tile_coord = [
            Math.floor((world_coord[0] * scale) / TILE_SIZE),
            Math.floor((world_coord[1] * scale) / TILE_SIZE)
        ];
        return tile_coord;
    }
    static heading(coords1, coords2) {
        try {
            let c1 = new google.maps.LatLng(coords1[0], coords1[1]);
            let c2 = new google.maps.LatLng(coords2[0], coords2[1]);
            let result = google.maps.geometry.spherical.computeHeading(c1, c2);
            if (result < 0) {
                result += 360;
            }
            return result;
        }
        catch (e) {
            console.log(e);
        }
    }
}
exports["default"] = GeoUtils;
//# sourceMappingURL=geoutils.js.map

/***/ }),

/***/ 590:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// ==UserScript==
// @name         AppleGuessr
// @namespace    https://greasyfork.org/en/users/946023-mistystar
// @version      2.1
// @description  Adds Apple Look Around to GeoGuessr
// @author       Mistystar (Mistystar#2205, https://github.com/kittenz) & stocc (stocc#2919, https://github.com/stocc)
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// @license      MIT
// @run-at       document-start
// @require 	 https://cdn.jsdelivr.net/gh/chebum/heic2any@master/dist/heic2any.min.js
// @require 	 https://cdn.jsdelivr.net/npm/protobufjs@7.0.0/dist/protobuf.js
// @require		 https://cdn.jsdelivr.net/npm/long@5/umd/index.js
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// ==/UserScript==
/*
CREDITS

Massive thank you to the following people:
    - skzk#8049 - Without https://github.com/sk-zk/lookaround-map this script would not have been possible to make
    - Jupaoqq#7742 - I learned a lot from looking at Unity Script's source code
    - mattisinthesky#1294 or kowalski - For hosting the lookaround-map in Heroku and helping with issues
    - efefury#0519 and Apfeloxid#1368 - For making the Take A Look Around Germany map
*/
// BEGIN CODE SECTION
const Options = __webpack_require__(944);
const Lookaround = __webpack_require__(215);
const lookaround_1 = __webpack_require__(215);
const geoutils_1 = __webpack_require__(97);
protobuf.util.Long = Long;
protobuf.configure();
const MENU_HTML = (/* unused pure expression or super */ null && (`
<div class="start-standard-game_settings__x94PU">
	<div class="game-settings_default__DIBgs">
		<div class="game-settings_toggleLabel__nipwm">
			<div class="label_sizeXSmall__mFnrR">Apple Look Around</div>
			<span></span>
		</div>
		<div>
			<input type="checkbox" class="apple-look-around-toggle" checked>
		</div>
	</div>
</div>
`));
const isGamePage = () => location.pathname.startsWith("/challenge/") || location.pathname.startsWith("/results/") ||
    location.pathname.startsWith("/game/") || location.pathname.startsWith("/battle-royale/") ||
    location.pathname.startsWith("/duels/") || location.pathname.startsWith("/team-duels/") ||
    location.pathname.startsWith("/bullseye/") ||
    location.pathname.startsWith("/live-challenge/");
function overrideOnLoad(googleScript, observer, overrider) {
    const oldOnload = googleScript.onload;
    googleScript.onload = (event) => {
        const google = window.google;
        if (google) {
            observer.disconnect();
            overrider(google);
        }
        if (oldOnload) {
            oldOnload.call(googleScript, event);
        }
    };
}
function grabGoogleScript(mutations) {
    for (const mutation of mutations) {
        for (const newNode of mutation.addedNodes /* Please shut up, it works in JS so it must work here as well */) {
            const asScript = newNode;
            if (asScript && asScript.src && asScript.src.startsWith("https://maps.googleapis.com/")) {
                return asScript;
            }
        }
    }
    return null;
}
function injecter(overrider) {
    if (document.documentElement) {
        injecterCallback(overrider);
    }
    else {
        alert("Script didn't load, refresh to try loading the script");
    }
}
function injecterCallback(overrider) {
    new MutationObserver((mutations, observer) => {
        const googleScript = grabGoogleScript(mutations);
        if (googleScript) {
            overrideOnLoad(googleScript, observer, overrider);
        }
    }).observe(document.documentElement, { childList: true, subtree: true });
}
// End Script injection --------------------------------------------------------------s
function injectMenu() {
    const inject = () => {
        if (document.querySelector(".apple-look-around-toggle") !== null)
            return;
        const settingsSection = document.querySelector('.section_sectionMedium__yXgE6');
        if (settingsSection === null)
            return;
        settingsSection.insertAdjacentHTML("beforeend", MENU_HTML);
        const checkbox = document.querySelector(".apple-look-around-toggle");
        if (checkbox) {
            let isChecked = localStorage.getItem("applelookaroundchecked");
            if (isChecked === null) {
                checkbox.checked = false;
                localStorage.setItem("applelookaroundchecked", "false");
            }
            else if (isChecked === "true") {
                checkbox.checked = true;
            }
            else {
                checkbox.checked = false;
            }
            checkbox.addEventListener("change", (event) => {
                if (event.currentTarget === null)
                    return;
                if (event.currentTarget.checked) {
                    localStorage.setItem("applelookaroundchecked", "true");
                }
                else {
                    localStorage.setItem("applelookaroundchecked", "false");
                }
            });
        }
    };
    // We want the page to be loaded before trying to inject anything
    let documentLoadedInterval = setInterval(function () {
        if (document.readyState === "complete") {
            clearInterval(documentLoadedInterval);
            inject();
        }
    }, 100);
}
// ----------------------------------------------------------------------------
// Sate vars
// TODO: Is there a better way to do this?
var loadingInProgress = false;
var currentPano = new lookaround_1.PanoInfo("", "", "", 0, 0, 0);
var currentlyLoadedPanoTiles = [];
var curNeighbors = [];
// When moving, this is used to keep the current viewport while loading the next pano
var oldHeading = 0;
// ----------------------------------------------------------------------------
// Google Maps API callbacks
// Return a pano image given the panoID.
const getCustomPanoramaTileUrl = (pano, zoom, tileX, tileY) => {
    // Currently loading first image in a round, return a blank image
    //if (pano.startsWith("r")){
    if (currentlyLoadedPanoTiles.length === 0) {
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";
    }
    return currentlyLoadedPanoTiles[tileX];
};
const getPano = (pano) => {
    let rp = Options.RESOLUTION_PROFILES[Options.RESOLUTION_SETTING];
    let fullWidth = 2 * rp.big.width + 2 * rp.small.width - 4 * rp.overlap;
    return {
        location: {
            pano: pano,
            description: "Apple Look Around",
            latLng: new google.maps.LatLng(currentPano.lat, currentPano.lon),
        },
        links: [],
        // The text for the copyright control.
        copyright: "(C) Apple",
        // The definition of the tiles for this panorama.
        tiles: {
            tileSize: new google.maps.Size(Math.round(fullWidth / 4), Math.round(Options.EXTENSION_FACTOR * rp.big.height)),
            worldSize: new google.maps.Size(fullWidth, Math.round(rp.big.height * Options.EXTENSION_FACTOR)),
            // The heading in degrees at the origin of the panorama
            // tile set.
            centerHeading: function () {
                // While loading: use the old heading so that when moving, you keep the same viewport while loading the next pano
                if (loadingInProgress) {
                    return oldHeading;
                }
                else {
                    var newHeading = (currentPano.heading + Options.HEADING_CALIBRATION) % 360;
                    oldHeading = newHeading;
                    return newHeading;
                }
            }(),
            getTileUrl: getCustomPanoramaTileUrl,
        },
    };
};
// ----------------------------------------------------------------------------
// Init
function initLookAround() {
    google.maps.StreetViewPanorama = class extends google.maps.StreetViewPanorama {
        constructor(...args) {
            super(...args);
            let isChecked = localStorage.getItem("applelookaroundchecked");
            if (isChecked === "true") {
                this.registerPanoProvider(getPano);
                // Position is being changed by GeoGuessr at the beginning of each round. this.getPosition() contains lat/lng of round.
                this.addListener("position_changed", () => {
                    console.log("Position changed " + this.getPosition());
                    try {
                        // Detect if this is a new round. Normally, currentPano is already updated if this is a move in the same round.
                        if ((this.getPosition().lat() === currentPano.lat && this.getPosition().lng() === currentPano.lon)) {
                            console.log("Position is currentPano => same round");
                            return;
                        }
                        console.warn("Position actually changed => new round; full reload");
                        currentlyLoadedPanoTiles = []; // Causes black screen again
                        this.getFirstPanoId();
                    }
                    catch (e) {
                        console.error(e);
                    }
                });
                // Called after setPano(). If the pano is "r<panoId>/<regioId>", then we load the tiles for that pano.
                // If it doesn't start with "r", then loading is done.
                this.addListener("pano_changed", () => {
                    console.log("Pano changed " + this.getPano());
                    if (this.getPano() != null && this.getPano() != currentPano.panoFullId() && this.getPano() != "" && this.getPano().startsWith("r")) {
                        console.log("New pano requested " + this.getPano());
                        try {
                            this.beginLoadingPanos(this, this.getPano().replace("r", ""));
                        }
                        catch (_a) { }
                    }
                });
                this.addListener("links_changed", () => {
                    console.log("Links changed " + this.getLinks());
                    if (!this.getPano().startsWith("r") && curNeighbors != null) {
                        //this.getLinks().push(curNeighbors[0])
                        let neighborLinks = curNeighbors.map(neighbor => {
                            return {
                                "descripton": "",
                                "pano": "r" + neighbor.panoFullId(),
                                "heading": Math.round(geoutils_1.default.heading([neighbor.lat, neighbor.lon], [currentPano.lat, currentPano.lon]) + 180) % 360,
                            };
                        });
                        console.log("Pushing Links " + neighborLinks.length);
                        for (const neighbor of neighborLinks) {
                            if (neighbor.pano != "") {
                                this.getLinks().push(neighbor);
                            }
                        }
                    }
                });
            }
        }
        getFirstPanoId() {
            return __awaiter(this, void 0, void 0, function* () {
                let isChecked = localStorage.getItem("applelookaroundchecked");
                if (isChecked !== "true")
                    return;
                try {
                    let lat = this.position.lat();
                    let lon = this.position.lng();
                    let lookAroundPanoId, regionId;
                    let closestObject = yield Lookaround.getClosestPanoAtCoords(lat, lon);
                    lookAroundPanoId = closestObject.panoId;
                    regionId = closestObject.regionId;
                    // Request pano to load
                    currentPano = closestObject;
                    this.setPano("r" + lookAroundPanoId + "/" + regionId);
                }
                catch (_a) { }
            });
        }
        // param panoFullId is "panoId/regionId"
        beginLoadingPanos(_t, panoFullId) {
            return __awaiter(this, void 0, void 0, function* () {
                if (loadingInProgress)
                    return;
                //console.warn("http://localhost:5000/#c=17/"+currentPano.lat+"/"+currentPano.lon+"&p="+currentPano.lat+"/"+currentPano.lon);
                // Moved. Find the selected neigbor from ID.
                if (curNeighbors.length > 0) {
                    let selectedNeighbor = curNeighbors.filter(n => n.panoFullId() == panoFullId)[0];
                    if (selectedNeighbor != null) {
                        currentPano = selectedNeighbor;
                    }
                }
                console.log("Start loading Panos");
                loadingInProgress = true;
                let pano0 = Lookaround.loadTileForPano(panoFullId, 0);
                let pano1 = Lookaround.loadTileForPano(panoFullId, 1);
                let pano2 = Lookaround.loadTileForPano(panoFullId, 2);
                let pano3 = Lookaround.loadTileForPano(panoFullId, 3);
                curNeighbors = yield (yield Lookaround.getNeighbors(currentPano));
                loadingInProgress = false;
                currentlyLoadedPanoTiles = [yield pano0, yield pano1, yield pano2, yield pano3];
                // Set another panoId to refresh the view
                this.setPano(panoFullId);
            });
        }
    };
}
function launchObserver() {
    initLookAround();
    //let observer3 = new MutationObserver((mutations) => {
    //	const PATH_NAME = window.location.pathname;
    //	if (PATH_NAME.startsWith("/maps/") && PATH_NAME.endsWith("/play")) { // Inject the options menu if the path name is /maps/XXXXXXX/play
    //		//injectMenu();
    //	}
    //});
    //observer3.observe(document.body, {childList: true, subtree: true, attributes: false, characterData: false});
}
function onLoad() {
    let isChecked = localStorage.getItem("applelookaroundchecked");
    if (isChecked === null) {
        localStorage.setItem("applelookaroundchecked", "true");
    }
    //const PATH_NAME = window.location.pathname;
    //if (PATH_NAME.startsWith("/maps/") && PATH_NAME.endsWith("/play")) { // Inject the options menu if the path name is /maps/XXXXXXX/play
    //	//injectMenu();
    //}
    injecter(() => {
        launchObserver();
    });
}
(function () {
    onLoad();
})();
window.onload = onLoad;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 215:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getNeighbors = exports.getClosestPanoAtCoords = exports.loadTileForPano = exports.PanoInfo = void 0;
const Options = __webpack_require__(944);
const auth_1 = __webpack_require__(297);
const geoutils_1 = __webpack_require__(97);
const proto_1 = __webpack_require__(224);
const auth = new auth_1.Authenticator();
var tileCache = {};
class PanoInfo {
    constructor(date, panoId, regionId, heading, lat, lon) {
        this.date = date;
        this.panoId = panoId;
        this.regionId = regionId;
        this.heading = heading;
        this.lat = lat;
        this.lon = lon;
    }
    panoFullId() {
        return this.panoId + "/" + this.regionId;
    }
}
exports.PanoInfo = PanoInfo;
function getCoverageTileRaw(tile_x, tile_y) {
    return __awaiter(this, void 0, void 0, function* () {
        let headers = new Headers({
            "maps-tile-style": "style=57&size=2&scale=0&v=0&preflight=2",
            "maps-tile-x": tile_x.toString(),
            "maps-tile-y": tile_y.toString(),
            "maps-tile-z": "17",
            "maps-auth-token": "w31CPGRO/n7BsFPh8X7kZnFG0LDj9pAuR8nTtH3xhH8=",
        });
        let response = yield (yield fetch(Options.CORS_PROXY + "https://gspe76-ssl.ls.apple.com/api/tile?", { headers: headers })).arrayBuffer();
        let tile = yield proto_1.default.parseMapTile(response);
        return tile;
    });
}
function getCoverageInMapTile(x, y) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (tileCache["" + x + "/" + y]) {
                return tileCache[x + "/" + y];
            }
            let response = yield getCoverageTileRaw(x, y);
            var coverage = [];
            for (let pano of response.pano) {
                let coords = geoutils_1.default.protobuf_tile_offset_to_wsg84(pano.unknown4.longitudeOffset, pano.unknown4.latitudeOffset, x, y);
                let p = new PanoInfo(pano.timestamp.toString(), pano.panoid.toString(), response.unknown13[pano.regionIdIdx].regionId.toString(), geoutils_1.default.headingFromUnknowns(pano.unknown4.unknown10, pano.unknown4.unknown11), coords[0], coords[1]);
                coverage.push(p);
            }
            tileCache["" + x + "/" + y] = coverage;
            return coverage;
        }
        catch (error) {
            console.log(error);
        }
    });
}
function getClosestPanoAtCoords(lat, lon) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let tile = geoutils_1.default.wgs84_to_tile_coord(lat, lon, 17);
            let coverage = yield getCoverageInMapTile(tile[0], tile[1]);
            if (coverage.length == 0) {
                return null;
            }
            let smallestDistance = 9999999;
            let closest = null;
            for (let pano of coverage) {
                let distance = geoutils_1.default.haversineDistance([lat, lon], [pano.lat, pano.lon]);
                if (distance < smallestDistance) {
                    smallestDistance = distance;
                    closest = pano;
                }
            }
            return closest;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    });
}
exports.getClosestPanoAtCoords = getClosestPanoAtCoords;
function getNeighbors(panoInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let tile = geoutils_1.default.wgs84_to_tile_coord(panoInfo.lat, panoInfo.lon, 17);
            var coverage = yield getCoverageInMapTile(tile[0], tile[1]);
            // TODO Only extend when needed (we're close to the edge of the tile)
            coverage = coverage.concat(yield getCoverageInMapTile(tile[0] + 1, tile[1]));
            coverage = coverage.concat(yield getCoverageInMapTile(tile[0] - 1, tile[1]));
            coverage = coverage.concat(yield getCoverageInMapTile(tile[0], tile[1] + 1));
            coverage = coverage.concat(yield getCoverageInMapTile(tile[0], tile[1] - 1));
            coverage = coverage.concat(yield getCoverageInMapTile(tile[0] - 1, tile[1] - 1));
            coverage = coverage.concat(yield getCoverageInMapTile(tile[0] + 1, tile[1] - 1));
            coverage = coverage.concat(yield getCoverageInMapTile(tile[0] - 1, tile[1] + 1));
            coverage = coverage.concat(yield getCoverageInMapTile(tile[0] + 1, tile[1] + 1));
            coverage = coverage.sort((a, b) => Math.abs(geoutils_1.default.haversineDistance([panoInfo.lat, panoInfo.lon], [a.lat, a.lon])) - Math.abs(geoutils_1.default.haversineDistance([panoInfo.lat, panoInfo.lon], [b.lat, b.lon])));
            coverage = coverage.filter(pano => pano.panoFullId() != panoInfo.panoFullId());
            let minDist = 0.030; // 30 meters
            let maxDist = 0.300; // 300 meters
            coverage = coverage.filter(n => (minDist < Math.abs(geoutils_1.default.haversineDistance([panoInfo.lat, panoInfo.lon], [n.lat, n.lon])) &&
                Math.abs(geoutils_1.default.haversineDistance([panoInfo.lat, panoInfo.lon], [n.lat, n.lon])) < maxDist));
            return coverage.slice(0, 8);
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.getNeighbors = getNeighbors;
function getUrlForTile(panoFullId, x, resolution) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //if (!auth.hasSession()) {
            yield auth.init();
            //}
            let segments = panoFullId.split("/");
            let panoId = segments[0];
            let regionId = segments[1];
            let panoid_padded = panoId.padStart(20, "0");
            let region_id_padded = regionId.padStart(10, "0");
            let panoid_split = panoid_padded.slice(0, 4) + "/" + panoid_padded.slice(4, 8) + "/" + panoid_padded.slice(8, 12) + "/" + panoid_padded.slice(12, 16) + "/" + panoid_padded.slice(16, 20);
            return auth.authenticateUrl(Options.APPLE_MAPS_TILE_ENDPOINT + panoid_split + "/" + region_id_padded + "/t/" + x + "/" + resolution);
        }
        catch (error) {
            console.log(error);
        }
    });
}
// param panoFullId is "panoId/regionId"
function loadTileForPano(panoFullId, x) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var jpegblob;
            if (Options.CONVERT_LOCALLY) {
                // Step 1: Get the URL of the tile to load
                // New endpoint /panourl in the python server returns just the Apple URL for the pano
                var appleMapsPanoURL = yield getUrlForTile(panoFullId, x, Options.RESOLUTION_SETTING);
                appleMapsPanoURL = Options.CORS_PROXY + appleMapsPanoURL;
                // Step 2: Load the tile
                //console.log("Requesting tile " + [appleMapsPanoURL])
                var blobres = yield fetch(appleMapsPanoURL);
                var blob = yield blobres.blob();
                // Step 3: Convert from HEIC to JPEG with heic2any
                //console.log("Fetched tile, converting and resizing... " + [appleMapsPanoURL])
                //let startTime = Math.floor(Date.now() / 1000);
                jpegblob = heic2any({ "blob": blob, "type": "image/jpeg" });
            }
            else {
                jpegblob = yield (yield fetch(Options.BASE_URL + "pano/" + panoFullId + "/" + Options.RESOLUTION_SETTING + "/" + x + "/")).blob();
            }
            // Step 4: Process image
            // Cut off the overlap from the right of the tile using canvas
            // and add black bars on top and bottom because we don't have sky/ground tiles
            let rp = Options.RESOLUTION_PROFILES[Options.RESOLUTION_SETTING];
            // Putting the jpeg blob into a canvas to remove 256 px from the right (removes overlap)
            var w = rp.big.width;
            if (x == 1 || x == 3) {
                w = rp.small.width;
            }
            w = w - rp.overlap;
            var canvas = document.createElement('canvas');
            canvas.height = Math.round(Options.EXTENSION_FACTOR * rp.big.height);
            canvas.width = w;
            var ctx = canvas.getContext('2d');
            var img = new Image();
            var result = "";
            img.onload = function () {
                ctx.drawImage(img, 0, (canvas.height - rp.big.height) / 2);
                // This is a big data:image/jpeg;base64, URL
                result = canvas.toDataURL("image/jpeg");
            };
            img.src = URL.createObjectURL(yield jpegblob);
            //let endTime = Math.floor(Date.now() / 1000);
            //console.log("Time to convert: " + (endTime - startTime) + " seconds");
            // Wait for context to finish loading
            // TODO: Is there a better way?
            const delay = ms => new Promise(res => setTimeout(res, ms));
            yield delay(100);
            //let endTime2 = Math.floor(Date.now() / 1000);
            //console.log("Full time: " + (endTime - startTime) + " seconds");
            URL.revokeObjectURL(img.src);
            canvas.remove();
            img.remove();
            return result;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.loadTileForPano = loadTileForPano;
//# sourceMappingURL=lookaround.js.map

/***/ }),

/***/ 944:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CONVERT_LOCALLY = exports.BASE_URL = exports.RESOLUTION_PROFILES = exports.APPLE_MAPS_TILE_ENDPOINT = exports.CORS_PROXY = exports.EXTENSION_FACTOR = exports.HEADING_CALIBRATION = exports.RESOLUTION_SETTING = void 0;
// Determines the resolution of images requested from Apple
// Setting a higher resolution will make rounds load WAY slower, until browsers start to support HEIC
// 0 = highest resolution available, 4 = lowest resolution available.
// Default: 2
const RESOLUTION_SETTING = 2;
exports.RESOLUTION_SETTING = RESOLUTION_SETTING;
// Constant value added to calculated heading to calibrate the GeoGuessr compass
const HEADING_CALIBRATION = 45;
exports.HEADING_CALIBRATION = HEADING_CALIBRATION;
const EXTENSION_FACTOR = 2.12; // TODO Play around with this value for best results with image stretching
exports.EXTENSION_FACTOR = EXTENSION_FACTOR;
const BASE_URL = "https://lookaround.stocc.dev/";
exports.BASE_URL = BASE_URL;
const CONVERT_LOCALLY = true;
exports.CONVERT_LOCALLY = CONVERT_LOCALLY;
const CORS_PROXY = "https://nameless-bastion-28139.herokuapp.com/";
exports.CORS_PROXY = CORS_PROXY;
const APPLE_MAPS_TILE_ENDPOINT = "https://gspe72-ssl.ls.apple.com/mnn_us/";
exports.APPLE_MAPS_TILE_ENDPOINT = APPLE_MAPS_TILE_ENDPOINT;
const RESOLUTION_PROFILES = {
    0: {
        "overlap": 256,
        "big": {
            "width": 5632,
            "height": 4352,
        },
        "small": {
            "width": 3072,
            "height": 4352,
        }
    },
    1: {
        "overlap": 188,
        "big": {
            "width": 4128,
            "height": 3088,
        },
        "small": {
            "width": 2256,
            "height": 3088,
        },
    },
    2: {
        "overlap": 100,
        "big": {
            "width": 2208,
            "height": 1648,
        },
        "small": {
            "width": 1200,
            "height": 1648,
        }
    },
    3: {
        "overlap": 71,
        "big": {
            "width": 1568,
            "height": 1168,
        },
        "small": {
            "width": 848,
            "height": 1168,
        }
    },
    4: {
        "overlap": 50,
        "big": {
            "width": 1104,
            "height": 832,
        },
        "small": {
            "width": 608,
            "height": 832,
        }
    }
};
exports.RESOLUTION_PROFILES = RESOLUTION_PROFILES;
//# sourceMappingURL=options.js.map

/***/ }),

/***/ 224:
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
let mapTile = `
syntax = "proto3";

message MapTile {
  repeated Pano pano = 1;
  repeated Unknown13 unknown13 = 4;
  repeated Unknown22 unknown22 = 5;
  TileCoordinate tileCoordinate = 6;

  message Pano {
    uint64 panoid = 1;
    int32 unknown1 = 4;
    int64 timestamp = 5; // time the pano was taken
    int32 region_id_idx = 7;
    repeated int32 unknown3 = 9; // goes from 0 to 5. available sizes maybe?
    Unknown4 unknown4 = 10;
    Unknown5 unknown5 = 12;

    message Unknown4 {
      int32 longitude_offset = 1;
      int32 latitude_offset = 2;
      int32 unknown8 = 3;
      int32 unknown9 = 4;
      int32 unknown10 = 5;
      int32 unknown11 = 6;
    }

    message Unknown5 {
      repeated int32 unknown12 = 1;
    }
  }

  message Unknown13 {
    int32 unknown14 = 1;
    // this is the param that appears in pano URLs after the pano ID.
    // no idea what this does exactly.
    int32 region_id = 3;
    int32 unknown15 = 4;
    int32 unknown16 = 5;
    int32 unknown17 = 6;
    int32 unknown18 = 9;
    int32 unknown19 = 10;
    int32 unknown20 = 11;
    int32 unknown21 = 12;
  }

  message Unknown22 {
    int32 unknown23 = 1;
    Unknown24 unknown24 = 4;
    Unknown25 unknown25 = 5;
    int32 unknown26 = 6;

    message Unknown24 {
      int32 unknown27 = 1;
      double unknown28 = 2;
      double unknown29 = 3;
      double unknown30 = 4;
      double unknown31 = 5;
      double unknown32 = 6;
      double unknown33 = 7;
      double unknown34 = 8;
      double unknown35 = 9;
      double unknown36 = 10;
    }

    message Unknown25 {
      double unknown37 = 1;
      double unknown38 = 2;
      double unknown39 = 3;
      double unknown40 = 4;
      double unknown41 = 5;
      double unknown42 = 6;
    }
  }

  message TileCoordinate {
    int32 x = 1;
    int32 y = 2;
    int32 z = 3;
  }

}`;
let resourceManifest = `
syntax = "proto3";

message ResourceManifest {
	repeated StyleConfig style_config = 2;
	string token_p2 = 30;
	string cache_base_url = 31;
	repeated CacheFile cache_file = 72;
	repeated string cache_file_2 = 9;

	message CacheFile {
		string file_name = 2;
	}

	message StyleConfig {
		string url_prefix_1 = 1;
		string url_prefix_2 = 9;
		StyleID style_id = 3;

		enum StyleID {
			_ = 0;
			C3MM_1 = 14;
			C3M = 15;
			DTM_1 = 16;
			DTM_2 = 17;
			C3MM_2 = 52;
		}
	}
}
`;
class Proto {
    static parseResourceManifest(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const array = new Uint8Array(payload);
            let manifest = protobuf.parse(resourceManifest).root.lookup("ResourceManifest");
            let message = manifest.decode(array);
            return message;
        });
    }
    static parseMapTile(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const array = new Uint8Array(payload);
            let manifest = protobuf.parse(mapTile).root.lookup("MapTile");
            let message = manifest.decode(array);
            return message;
        });
    }
}
exports["default"] = Proto;
//# sourceMappingURL=proto.js.map

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/************************************************************************/
/******/
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(590);
/******/
/******/ })()
;