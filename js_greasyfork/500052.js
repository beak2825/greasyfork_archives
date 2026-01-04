// ==UserScript==
// @name         scRYMble
// @license      MIT
// @version      2.20250109031512
// @description  Visit a release page on rateyourmusic.com and scrobble the songs you see!
// @author       fidwell
// @icon         https://e.snmc.io/2.5/img/sonemic.png
// @namespace    https://github.com/fidwell/scRYMble
// @include      https://rateyourmusic.com/release/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @require      https://update.greasyfork.org/scripts/130/10066/Portable%20MD5%20Function.js
// @downloadURL https://update.greasyfork.org/scripts/500052/scRYMble.user.js
// @updateURL https://update.greasyfork.org/scripts/500052/scRYMble.meta.js
// ==/UserScript==
'use strict';

class HttpResponse {
    constructor(raw) {
        this.status = raw.status;
        this.statusText = raw.statusText;
        this.responseText = raw.responseText;
        this.lines = raw.responseText.split("\n");
    }
    get isOkStatus() {
        return this.lines[0] === "OK";
    }
    get sessionId() {
        return this.lines[1];
    }
    get nowPlayingUrl() {
        return this.lines[2];
    }
    get submitUrl() {
        return this.lines[3];
    }
}

function httpGet(url, onload) {
    GM_xmlhttpRequest({
        method: "GET",
        url,
        headers: {
            "User-agent": "Mozilla/4.0 (compatible) Greasemonkey"
        },
        onload: (responseRaw) => onload(new HttpResponse(responseRaw))
    });
}
function httpPost(url, data, onload) {
    GM_xmlhttpRequest({
        method: "POST",
        url,
        data,
        headers: {
            "User-agent": "Mozilla/4.0 (compatible) Greasemonkey",
            "Content-type": "application/x-www-form-urlencoded"
        },
        onload: (responseRaw) => onload(new HttpResponse(responseRaw))
    });
}

function fetch_unix_timestamp() {
    return parseInt(new Date().getTime().toString().substring(0, 10));
}
function stripAndClean(input) {
    input = input
        .replace("&amp;", "")
        .replace("\n", " ");
    while (input.indexOf("  ") >= 0) {
        input = input.replace("  ", " ");
    }
    while (input.startsWith(" - ")) {
        input = input.substring(3);
    }
    while (input.startsWith("- ")) {
        input = input.substring(2);
    }
    return input.trim();
}

function handshake(ui, callback) {
    const username = ui.username;
    const password = ui.password;
    GM_setValue("user", username);
    GM_setValue("pass", password);
    const timestamp = fetch_unix_timestamp();
    const auth = hex_md5(`${hex_md5(password)}${timestamp}`);
    const handshakeURL = `http://post.audioscrobbler.com/?hs=true&p=1.2&c=scr&v=1.0&u=${username}&t=${timestamp}&a=${auth}`;
    httpGet(handshakeURL, callback);
}

class rymUi {
    constructor() {
        this.albumTitleClass = ".album_title";
        this.byArtistProperty = "byArtist";
        this.creditedNameClass = "credited_name";
        this.trackElementId = "tracks";
        this.tracklistDurationClass = ".tracklist_duration";
        this.tracklistLineClass = "tracklist_line";
        this.tracklistNumClass = ".tracklist_num";
        this.tracklistTitleClass = ".tracklist_title";
        this.tracklistArtistClass = ".artist";
        this.tracklistRenderedTextClass = ".rendered_text";
        //#endregion
    }
    get isVariousArtists() {
        const artist = this.pageArtist;
        return artist.indexOf("Various Artists") > -1 ||
            artist.indexOf(" / ") > -1;
    }
    get pageArtist() {
        var _a;
        return (_a = this.multipleByArtists) !== null && _a !== void 0 ? _a : this.singleByArtist;
    }
    get pageAlbum() {
        var _a, _b;
        // Not using innerText because it doesn't work with Jest tests.
        const element = document.querySelector(this.albumTitleClass);
        return ((_b = (_a = element.firstChild) === null || _a === void 0 ? void 0 : _a.textContent) !== null && _b !== void 0 ? _b : "").trim();
    }
    get multipleByArtists() {
        return Array.from(document.getElementsByClassName(this.creditedNameClass))
            .map(x => x)
            .map(x => { var _a; return (_a = x.innerText) !== null && _a !== void 0 ? _a : ""; })[1];
    }
    get singleByArtist() {
        return Array.from(document.querySelectorAll(`span[itemprop='${this.byArtistProperty}'] > a`))
            .map(e => this.parseArtistLink(e))
            .join(" / ");
    }
    parseArtistLink(element) {
        return Array.from(element.childNodes)
            .filter(node => node.nodeType === 3) // Node.TEXT_NODE
            .map(node => { var _a, _b; return (_b = (_a = node.textContent) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : ""; })
            .join("");
    }
    hasTrackNumber(tracklistLine) {
        var _a, _b;
        return ((_b = (_a = tracklistLine.querySelector(this.tracklistNumClass)) === null || _a === void 0 ? void 0 : _a.innerHTML) !== null && _b !== void 0 ? _b : "").trim().length > 0;
    }
    //#region Element getters
    get trackListDiv() {
        return document.getElementById(this.trackElementId);
    }
    get tracklistLines() {
        var _a;
        return Array.from((_a = this.trackListDiv.getElementsByClassName(this.tracklistLineClass)) !== null && _a !== void 0 ? _a : [])
            .map(l => l);
    }
    tracklistLine(checkbox) {
        var _a;
        return (_a = checkbox.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
    }
    trackName(tracklistLine) {
        var _a, _b;
        let songTitle = "";
        const songTags = tracklistLine === null || tracklistLine === void 0 ? void 0 : tracklistLine.querySelectorAll("[itemprop=name]");
        if (songTags.length > 0) {
            const lastSongTag = songTags[songTags.length - 1];
            songTitle = ((_a = lastSongTag === null || lastSongTag === void 0 ? void 0 : lastSongTag.textContent) !== null && _a !== void 0 ? _a : "").replace(/\n/g, " ");
            // Check if the tag is hiding any artist links; if so, strip them out
            const artistLinks = lastSongTag.querySelectorAll(this.tracklistArtistClass);
            if (artistLinks.length > 0) {
                const renderedTextSpan = lastSongTag.querySelector(this.tracklistRenderedTextClass);
                songTitle = renderedTextSpan.innerHTML.replace(/<a[^>]*>.*?<\/a>/g, " ").trim();
            }
        }
        else {
            const renderedTextSpan = tracklistLine === null || tracklistLine === void 0 ? void 0 : tracklistLine.querySelector(this.tracklistRenderedTextClass);
            songTitle = (_b = renderedTextSpan === null || renderedTextSpan === void 0 ? void 0 : renderedTextSpan.textContent) !== null && _b !== void 0 ? _b : "";
        }
        return stripAndClean(songTitle);
    }
    trackArtist(tracklistLine) {
        var _a, _b;
        const artistTags = tracklistLine === null || tracklistLine === void 0 ? void 0 : tracklistLine.querySelectorAll(this.tracklistArtistClass);
        if (artistTags.length === 0)
            return "";
        if (artistTags.length === 1) {
            return (_a = artistTags[0].textContent) !== null && _a !== void 0 ? _a : "";
        }
        // Multiple artists
        const entireSpan = tracklistLine.querySelector(this.tracklistTitleClass);
        const entireText = ((_b = entireSpan.textContent) !== null && _b !== void 0 ? _b : "").replace(/\n/g, " ");
        const dashIndex = entireText.indexOf(" - ");
        return entireText.substring(0, dashIndex);
    }
    trackDuration(tracklistLine) {
        var _a;
        const durationElement = tracklistLine === null || tracklistLine === void 0 ? void 0 : tracklistLine.querySelector(this.tracklistDurationClass);
        return ((_a = durationElement.textContent) !== null && _a !== void 0 ? _a : "").trim();
    }
}

class scRYMbleUi {
    constructor(rymUi) {
        var _a, _b;
        this.enabled = false;
        this.marqueeId = "scrymblemarquee";
        this.progBarId = "progbar";
        this.scrobbleNowId = "scrobblenow";
        this.scrobbleThenId = "scrobblethen";
        this.testId = "scrobbletest";
        this.checkboxClass = "scrymblechk";
        this.selectAllOrNoneId = "allornone";
        this.usernameId = "scrobbleusername";
        this.passwordId = "scrobblepassword";
        this._rymUi = rymUi;
        if (((_b = (_a = this._rymUi.trackListDiv) === null || _a === void 0 ? void 0 : _a.children.length) !== null && _b !== void 0 ? _b : 0) === 0) {
            console.log("scRYMble: No track list found.");
        }
        else {
            this.enabled = true;
            this.createCheckboxes();
            this.createControls();
        }
    }
    get isEnabled() {
        return this.enabled;
    }
    get username() {
        return this.usernameInput.value;
    }
    get password() {
        return this.passwordInput.value;
    }
    createCheckboxes() {
        const checkboxTemplate = `<input type="checkbox" class="${this.checkboxClass}" checked="checked">`;
        for (const tracklistLine of this._rymUi.tracklistLines) {
            if (this._rymUi.hasTrackNumber(tracklistLine)) {
                const thisCheckboxElement = document.createElement("span");
                thisCheckboxElement.style.float = "left";
                thisCheckboxElement.innerHTML = checkboxTemplate;
                tracklistLine.prepend(thisCheckboxElement);
            }
        }
    }
    createControls() {
        var _a;
        const eleButtonDiv = document.createElement("div");
        eleButtonDiv.innerHTML = `
<table style="border: 0;" cellpadding="0" cellspacing="2px">
  <tr>
    <td style="width: 112px;">
      <input type="checkbox" name="${this.selectAllOrNoneId}" id="${this.selectAllOrNoneId}" style="vertical-align: middle;" checked="checked">&nbsp;
      <label for="${this.selectAllOrNoneId}" style="font-size: 60%;">select&nbsp;all/none</label>
      <br/>
      <table border="2" cellpadding="0" cellspacing="0">
        <tr>
          <td style="height: 50px; width: 103px; background: url(https://cdn.last.fm/flatness/logo_black.3.png) no-repeat; color: #fff;">
            <div class="marquee" style="position: relative; top: 17px; overflow: hidden; white-space: nowrap;">
              <span style="font-size: 80%; width: 88px; display: inline-block; animation: marquee 5s linear infinite;" id="${this.marqueeId}">&nbsp;</span>
            </div>
          </td>
        </tr>
        <tr>
          <td style="background-color: #003;">
            <div style="position: relative; background-color: #f00; width: 0; max-height: 5px; left: 0; top: 0;" id="${this.progBarId}">&nbsp;</div>
          </td>
        </tr>
      </table>
    </td>
    <td>user: <input type="text" size="16" id="${this.usernameId}" value="${GM_getValue("user", "")}" /><br />
        pass: <input type="password" size="16" id="${this.passwordId}" value="${GM_getValue("pass", "")}"></input><br />
        <input type="button" id="${this.scrobbleNowId}" value="Scrobble in real-time" />
        <input type="button" id="${this.scrobbleThenId}" value="Scrobble a previous play" />
        <input type="button" id="${this.testId}" value="Test tracklist parsing" style="display: none;" />
      </td>
    </tr>
  </table>`;
        eleButtonDiv.style.textAlign = "right";
        (_a = this._rymUi.trackListDiv) === null || _a === void 0 ? void 0 : _a.after(eleButtonDiv);
        this.allOrNoneCheckbox.addEventListener("click", () => this.allOrNoneClick(), true);
        const marqueeStyle = document.createElement("style");
        document.head.appendChild(marqueeStyle);
        marqueeStyle.textContent = `
      @keyframes marquee {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }`;
    }
    hookUpScrobbleNow(startScrobble) {
        this.scrobbleNowButton.addEventListener("click", startScrobble, true);
    }
    hookUpScrobbleThen(handshakeBatch) {
        this.scrobbleThenButton.addEventListener("click", handshakeBatch, true);
    }
    hookUpScrobbleTest(callback) {
        this.scrobbleTestButton.addEventListener("click", callback, true);
    }
    setMarquee(value) {
        this.marquee.innerHTML = value;
    }
    setProgressBar(percentage) {
        if (percentage >= 0 && percentage <= 100) {
            this.progressBar.style.width = `${percentage}%`;
        }
    }
    allOrNoneClick() {
        window.setTimeout(() => this.allOrNoneAction(), 10);
    }
    allOrNoneAction() {
        for (const checkbox of this.checkboxes) {
            checkbox.checked = this.allOrNoneCheckbox.checked;
        }
    }
    elementsOnAndOff(state) {
        if (state) {
            this.scrobbleNowButton.removeAttribute("disabled");
            this.usernameInput.removeAttribute("disabled");
            this.passwordInput.removeAttribute("disabled");
        }
        else {
            this.scrobbleNowButton.setAttribute("disabled", "disabled");
            this.usernameInput.setAttribute("disabled", "disabled");
            this.passwordInput.setAttribute("disabled", "disabled");
        }
        for (const checkbox of this.checkboxes) {
            if (state) {
                checkbox.removeAttribute("disabled");
            }
            else {
                checkbox.setAttribute("disabled", "disabled");
            }
        }
    }
    elementsOff() {
        this.elementsOnAndOff(false);
    }
    elementsOn() {
        this.elementsOnAndOff(true);
    }
    //#region Element getters
    get allOrNoneCheckbox() {
        return document.getElementById(this.selectAllOrNoneId);
    }
    get scrobbleNowButton() {
        return document.getElementById(this.scrobbleNowId);
    }
    get scrobbleThenButton() {
        return document.getElementById(this.scrobbleThenId);
    }
    get scrobbleTestButton() {
        return document.getElementById(this.testId);
    }
    get marquee() {
        return document.getElementById(this.marqueeId);
    }
    get progressBar() {
        return document.getElementById(this.progBarId);
    }
    get usernameInput() {
        return document.getElementById(this.usernameId);
    }
    get passwordInput() {
        return document.getElementById(this.passwordId);
    }
    get checkboxes() {
        return document.getElementsByClassName(this.checkboxClass);
    }
}

class ScrobbleRecord {
    constructor(trackName, artist, duration) {
        this.artist = artist;
        this.trackName = trackName;
        const durastr = duration.trim();
        const colon = durastr.indexOf(":");
        if (colon !== -1) {
            const minutes = parseInt(durastr.substring(0, colon));
            const seconds = parseInt(durastr.substring(colon + 1));
            this.duration = minutes * 60 + seconds;
        }
        else {
            this.duration = 180;
        }
        this.time = 0;
    }
}

function buildListOfSongsToScrobble(_rymUi, _scRYMbleUi) {
    const toScrobble = [];
    Array.from(_scRYMbleUi.checkboxes).forEach(checkbox => {
        if (checkbox.checked) {
            toScrobble[toScrobble.length] = parseTracklistLine(_rymUi, checkbox);
        }
    });
    return toScrobble;
}
function parseTracklistLine(rymUi, checkbox) {
    const tracklistLine = rymUi.tracklistLine(checkbox);
    const pageArtist = rymUi.pageArtist;
    let songTitle = rymUi.trackName(tracklistLine);
    let artist = pageArtist;
    const duration = rymUi.trackDuration(tracklistLine);
    if (rymUi.isVariousArtists) {
        artist = rymUi.trackArtist(tracklistLine);
        if (artist.length === 0) {
            artist = pageArtist.indexOf("Various Artists") > -1
                ? rymUi.pageAlbum
                : pageArtist; // Probably a collaboration release, like a classical work.
        }
    }
    else {
        const trackArtist = rymUi.trackArtist(tracklistLine);
        if (trackArtist.length > 0) {
            artist = trackArtist;
        }
    }
    if (songTitle.toLowerCase() === "untitled" ||
        songTitle.toLowerCase() === "untitled track" ||
        songTitle === "") {
        songTitle = "[untitled]";
    }
    return new ScrobbleRecord(songTitle, artist, duration);
}

const _rymUi = new rymUi();
const _scRYMbleUi = new scRYMbleUi(_rymUi);
let toScrobble = [];
let currentlyScrobbling = -1;
let sessID = "";
let submitURL = "";
let npURL = "";
let currTrackDuration = 0;
let currTrackPlayTime = 0;
function confirmBrowseAway(oEvent) {
    if (currentlyScrobbling !== -1) {
        oEvent.preventDefault();
        return "You are currently scrobbling a record. Leaving the page now will prevent future tracks from this release from scrobbling.";
    }
    return "";
}
function acceptSubmitResponse(responseDetails, isBatch) {
    if (responseDetails.status === 200) {
        if (!responseDetails.isOkStatus) {
            alertSubmitFailed(responseDetails);
        }
    }
    else {
        alertSubmitFailed(responseDetails);
    }
    if (isBatch) {
        _scRYMbleUi.setMarquee("Scrobbled OK!");
    }
    else {
        scrobbleNextSong();
    }
}
function alertSubmitFailed(responseDetails) {
    alert(`Track submit failed: ${responseDetails.status} ${responseDetails.statusText}\n\nData:\n${responseDetails.responseText}`);
}
function acceptSubmitResponseSingle(responseDetails) {
    acceptSubmitResponse(responseDetails, false);
}
function acceptSubmitResponseBatch(responseDetails) {
    acceptSubmitResponse(responseDetails, true);
}
function acceptNPResponse(responseDetails) {
    if (responseDetails.status === 200) {
        if (!responseDetails.isOkStatus) {
            alertSubmitFailed(responseDetails);
        }
    }
    else {
        alertSubmitFailed(responseDetails);
    }
}
function submitTracksBatch(sessID, submitURL) {
    toScrobble = buildListOfSongsToScrobble(_rymUi, _scRYMbleUi);
    if (toScrobble === null)
        return;
    let currTime = fetch_unix_timestamp();
    const hoursFudgeStr = prompt("How many hours ago did you listen to this?");
    if (hoursFudgeStr !== null) {
        const album = _rymUi.pageAlbum;
        const hoursFudge = parseFloat(hoursFudgeStr);
        if (!isNaN(hoursFudge)) {
            currTime = currTime - hoursFudge * 60 * 60;
        }
        for (let i = toScrobble.length - 1; i >= 0; i--) {
            currTime = currTime * 1 - toScrobble[i].duration * 1;
            toScrobble[i].time = currTime;
        }
        let outstr = `Artist: ${_rymUi.pageArtist}\nAlbum: ${album}\n`;
        for (const song of toScrobble) {
            outstr = `${outstr}${song.trackName} (${song.duration})\n`;
        }
        const postdata = {};
        for (let i = 0; i < toScrobble.length; i++) {
            postdata[`a[${i}]`] = toScrobble[i].artist;
            postdata[`t[${i}]`] = toScrobble[i].trackName;
            postdata[`b[${i}]`] = album;
            postdata[`n[${i}]`] = `${i + 1}`;
            postdata[`l[${i}]`] = `${toScrobble[i].duration}`;
            postdata[`i[${i}]`] = `${toScrobble[i].time}`;
            postdata[`o[${i}]`] = "P";
            postdata[`r[${i}]`] = "";
            postdata[`m[${i}]`] = "";
        }
        postdata["s"] = sessID;
        const postdataStr = Object.entries(postdata)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join("&");
        httpPost(submitURL, postdataStr, acceptSubmitResponseBatch);
    }
}
function startScrobble() {
    currentlyScrobbling = -1;
    currTrackDuration = 0;
    currTrackPlayTime = 0;
    _scRYMbleUi.elementsOff();
    toScrobble = buildListOfSongsToScrobble(_rymUi, _scRYMbleUi);
    scrobbleNextSong();
}
function resetScrobbler() {
    currentlyScrobbling = -1;
    currTrackDuration = 0;
    currTrackPlayTime = 0;
    _scRYMbleUi.setMarquee("&nbsp;");
    _scRYMbleUi.setProgressBar(0);
    toScrobble = [];
    _scRYMbleUi.elementsOn();
}
function scrobbleNextSong() {
    currentlyScrobbling++;
    if (currentlyScrobbling === toScrobble.length) {
        resetScrobbler();
    }
    else {
        window.setTimeout(timertick, 10);
        handshake(_scRYMbleUi, acceptHandshakeSingle);
    }
}
function submitThisTrack() {
    const postdata = {};
    const i = 0;
    const currTime = fetch_unix_timestamp();
    postdata[`a[${i}]`] = toScrobble[currentlyScrobbling].artist;
    postdata[`t[${i}]`] = toScrobble[currentlyScrobbling].trackName;
    postdata[`b[${i}]`] = _rymUi.pageAlbum;
    postdata[`n[${i}]`] = `${currentlyScrobbling + 1}`;
    postdata[`l[${i}]`] = `${toScrobble[currentlyScrobbling].duration}`;
    postdata[`i[${i}]`] = `${currTime - toScrobble[currentlyScrobbling].duration}`;
    postdata[`o[${i}]`] = "P";
    postdata[`r[${i}]`] = "";
    postdata[`m[${i}]`] = "";
    postdata["s"] = sessID;
    const postdataStr = Object.entries(postdata)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");
    httpPost(submitURL, postdataStr, acceptSubmitResponseSingle);
}
function npNextTrack() {
    const postdata = {};
    postdata["a"] = toScrobble[currentlyScrobbling].artist;
    postdata["t"] = toScrobble[currentlyScrobbling].trackName;
    postdata["b"] = _rymUi.pageAlbum;
    postdata["n"] = `${currentlyScrobbling + 1}`;
    postdata["l"] = `${toScrobble[currentlyScrobbling].duration}`;
    postdata["m"] = "";
    postdata["s"] = sessID;
    currTrackDuration = toScrobble[currentlyScrobbling].duration;
    currTrackPlayTime = 0;
    _scRYMbleUi.setMarquee(toScrobble[currentlyScrobbling].trackName);
    const postdataStr = Object.entries(postdata)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");
    httpPost(npURL, postdataStr, acceptNPResponse);
}
function timertick() {
    let again = true;
    if (currentlyScrobbling !== -1) {
        if (currTrackDuration !== 0) {
            _scRYMbleUi.setProgressBar(100 * currTrackPlayTime / currTrackDuration);
        }
        currTrackPlayTime++;
        if (currTrackPlayTime === currTrackDuration) {
            submitThisTrack();
            again = false;
        }
    }
    if (again) {
        window.setTimeout(timertick, 1000);
    }
}
function acceptHandshakeSingle(responseDetails) {
    acceptHandshake(responseDetails, false);
}
function acceptHandshakeBatch(responseDetails) {
    acceptHandshake(responseDetails, true);
}
function acceptHandshake(responseDetails, isBatch) {
    if (responseDetails.status === 200) {
        if (!responseDetails.isOkStatus) {
            alertHandshakeFailed(responseDetails);
        }
        else {
            sessID = responseDetails.sessionId;
            npURL = responseDetails.nowPlayingUrl;
            submitURL = responseDetails.submitUrl;
            if (isBatch) {
                submitTracksBatch(sessID, submitURL);
            }
            else {
                npNextTrack();
            }
        }
    }
    else {
        alertHandshakeFailed(responseDetails);
    }
}
function alertHandshakeFailed(responseDetails) {
    alert(`Handshake failed: ${responseDetails.status} ${responseDetails.statusText}\n\nData:\n${responseDetails.responseText}`);
}
function handshakeBatch() {
    handshake(_scRYMbleUi, acceptHandshakeBatch);
}
function scrobbleTest() {
    console.log(_rymUi.pageAlbum);
    toScrobble = buildListOfSongsToScrobble(_rymUi, _scRYMbleUi);
    toScrobble.forEach((song, i) => {
        const minutes = Math.floor(song.duration / 60);
        const seconds = song.duration % 60;
        const secondsStr = `00${seconds}`.slice(-2);
        console.log(`${i + 1}. ${song.artist} — ${song.trackName} (${minutes}:${secondsStr})`);
    });
}
(function () {
    if (!_scRYMbleUi.isEnabled) {
        return;
    }
    _scRYMbleUi.hookUpScrobbleNow(startScrobble);
    _scRYMbleUi.hookUpScrobbleThen(handshakeBatch);
    _scRYMbleUi.hookUpScrobbleTest(scrobbleTest);
    window.addEventListener("beforeunload", confirmBrowseAway, true);
})();
