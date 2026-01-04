// ==UserScript==
// @name         Monitoring Streaming Platform
// @namespace    http://tampermonkey.net/
// @version      0.22
// @description  Script that can monitor main streaming platforms.
// @author       Gaspard
// @license MIT
// @include     https://www.spotify.com/fr/*
// @include     https://login.tidal.com/*
// @include     https://open.spotify.com/*
// @include     https://listen.tidal.com/*
// @include     https://www.deezer.com/*
// @include     https://app.napster.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390641/Monitoring%20Streaming%20Platform.user.js
// @updateURL https://update.greasyfork.org/scripts/390641/Monitoring%20Streaming%20Platform.meta.js
// ==/UserScript==
// TODO SAMEDI : GERER NAPSTER + REPEAT BUTTON + PLAYLIST DEFAULT 
// TODO DIMANCHE : GENERER MUSIQUE AIVA + GENERER COVER + PAYER DES COMPTES DISTROKID + FINIR D'INSTALLER TOUS LES SERVEURS 
// todo alternate between official playlist and our playlist 
// todo test aiva 
// todo MAKE CLEAR RULES FOR : CREATING LABEL (mail, ip) / ACCOUNT CREATION PLATFORM (MAIL) / MODE OF PAYMENT LABELS AND PLATFORM / 
// todo https://privacy.com/ or revolut  or https://aide.fortuneo.fr/questions/40465-utiliser-paiement-securise-internet-obtenir-numero-carte-bancaire-virtuelle
// todo make repeat button auto for each page 
// todo later add chrome vpn extension 
// todo navigate from "download spotify" to url playlist
// todo add NAPSTER
// todo make the connection automatic 
// todo improve the batch that reboot auto chrome every x hours to add some randomness
// todo create a get email for incremental mail 
// todo add default playlist for a user 
// todo create select button in front for each server (for add playlist or delete)
// todo handle deezer ads in freeze track error for free users
// todo make system for creating playlist 

var IP = "", STREAMING_PLATFORM = "", SIGNUP = false, LAST_TIME_TRACK = -50;
const SERVER_URL = 'https://server.lutily.fr:8443';

function main() {
    'use strict';

    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            setTimeout(function () {
                currrentUrl();
                if (SIGNUP) {
                    signUp()
                }
                else {
                    getIP();
                    setTimeout(function () {
                        if (checkConnectionStatus()) {
                            initApplication();
                            console.log("✔️ 1 Start to monitor the server ! ");
                            loopMonitoring();
                        }
                    }, 3000);
                }
            }, 5000);
        }
    };

};
main()


function loopMonitoring() {
    const start_monitoring_after = 5000;   // 10 seconds
    const refresh_time = 5000;             // 10 seconds 

    setTimeout(function () {
        window.setInterval(function () {
            sendMonitoringInfo();
        }, refresh_time);
    }, start_monitoring_after);
}

function signUp() {
    const url_user = 'https://randomuser.me/api/?nat=fr';
    const Http = new XMLHttpRequest();
    Http.open("GET", url_user);
    Http.send();

    return Http.onreadystatechange = (e) => {
        if (Http.readyState == 4) {
            var fakeUser = JSON.parse(Http.responseText).results[0]
            console.log(`User info : `, fakeUser);
            var dob = new Date(fakeUser.dob.date)

            if (STREAMING_PLATFORM === "SPOTIFY") {
                document.getElementById("register-email").value = "@gmail.com"
                document.getElementById("register-confirm-email").value = "@gmail.com"
                document.getElementById("register-password").value = "admin1234"
                document.getElementById("register-displayname").value = fakeUser.name.first + fakeUser.name.last
                document.getElementById("register-dob-day").value = dob.getDate()
                document.getElementById("register-dob-month").value = ("0" + (dob.getMonth() + 1)).slice(-2)
                document.getElementById("register-dob-year").value = dob.getFullYear()
                if (fakeUser.gender === "male") {
                    document.getElementById("register-male").checked = true
                } else {
                    document.getElementById("register-female").checked = true
                }
            }
            else if (STREAMING_PLATFORM === "DEEZER") {
                document.getElementById("register_form_mail_input").value = "@gmail.com"
                document.getElementById("register_form_username_input").value = fakeUser.name.first + fakeUser.name.last
                document.getElementById("register_form_password_input").value = "admin1234"
                document.getElementById("register_form_age_input").value = fakeUser.dob.age
                if (fakeUser.gender === "male") {
                    document.getElementById("register_form_gender_input").value = "M"
                } else {
                    document.getElementById("register_form_gender_input").value = "F"
                }
            }
            else if (STREAMING_PLATFORM === "TIDAL") {
                document.getElementsByName("email")[0].value = "@gmail.com"
                document.getElementById("recap-invisible").addEventListener("click", () => {
                    console.log("Click found !")
                    setTimeout(() => {
                        document.getElementById("new-password").value = "admin"
                        document.getElementById("new-password").value += "1234"
                        document.getElementById("password2").value = "admin1234"
                        document.getElementById("tbi-day").value = dob.getDate()
                        document.getElementById("tbi-month").value = (dob.getMonth() + 1)
                        document.getElementById("tbi-year").value = dob.getFullYear()

                    }, 3000)
                })
            }
        }
    }
}


function currrentUrl() {
    console.log("Page URL is " + window.location.href)
    if (window.location.href.includes("spotify")) {
        STREAMING_PLATFORM = "SPOTIFY";
        if (window.location.href.includes("signup")) {
            SIGNUP = true;
        }
    } else if (window.location.href.includes("deezer")) {
        STREAMING_PLATFORM = "DEEZER";
        if (window.location.href.includes("register")) {
            SIGNUP = true;
        }
    } else if (window.location.href.includes("tidal")) {
        STREAMING_PLATFORM = "TIDAL";
        if (window.location.href.includes("authorize")) {
            SIGNUP = true;
        }
    } else if (window.location.href.includes("napster")) {
        STREAMING_PLATFORM = "NAPSTER";
        if (window.location.href.includes("authorize")) {
            SIGNUP = true;
        }
    } else {
        console.error("No platform detected.");
        STREAMING_PLATFORM = "0";
        return false;
    }
    if (STREAMING_PLATFORM !== "") {
        console.log(`${STREAMING_PLATFORM} detected.`);
        return true;
    }
}

function navigateToPlaylist() {
    const url_user = SERVER_URL + '/servers/playlist/get';
    const Http = new XMLHttpRequest();
    Http.open("POST", url_user);
    Http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    Http.send("ip=" + IP + "&platform=" + STREAMING_PLATFORM);

    Http.onreadystatechange = (e) => {
        if (Http.readyState == 4) {
            var server = JSON.parse(Http.responseText).server
            console.log("SERVER PLAYLIST: ", server.urlPlaylist)
            var empty = false
            if (server === null || server === undefined) {
                empty = true
            }
            else if (server.urlPlaylist === "") {
                empty = true
            }
            if (empty) {
                if (STREAMING_PLATFORM === "SPOTIFY") {
                    playlistURL = "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M";
                }
                else if (STREAMING_PLATFORM === "DEEZER") {
                    playlistURL = "https://www.deezer.com/fr/playlist/6107820204";
                }
                else if (STREAMING_PLATFORM === "TIDAL") {
                    playlistURL = "https://listen.tidal.com/playlist/3afc7353-6079-4616-ba39-c256127c013e";
                }
                else if (STREAMING_PLATFORM === "NAPSTER") {
                    playlistURL = "https://app.napster.com/playlists/playlist/mp.273262033";
                }
            } else {
                playlistURL = server.urlPlaylist
            }
            console.log("URL Playlist : " + playlistURL)
            if (window.location.href !== playlistURL) {
                window.location.href = playlistURL

            }
            return playlistURL
        }
    }
}



function getIP() {

    // IP_PROVIDER :
    // https://api.ipify.org            => free and open source 
    // https://json.geoiplookup.io/     => sometimes prompt commercial use 
    // https://freegeoip.app/json/      => doesnt give hostname

    const url_ip = 'https://api.ipify.org';
    const Http = new XMLHttpRequest();
    Http.open("GET", url_ip);
    Http.send();

    Http.onreadystatechange = (e) => {
        if (Http.readyState == 4) {
            IP = Http.responseText
            console.log(`IP of the server : ${IP}`);
        }
    }
}

function checkConnectionStatus() {
    // Check if the user is still connected to the streaming platform 
    var connected = true;

    if (STREAMING_PLATFORM === "SPOTIFY") {
        connected = getElement("UserWidget__user-link", 0) !== undefined;
    }
    else if (STREAMING_PLATFORM === "DEEZER") {
        connected = getElement("unlogged-btn-label", 0) !== null;
    }
    else if (STREAMING_PLATFORM === "TIDAL") {
        connected = searchInPage(/userLoggedOut--[^"]*/, 0) === null;
    }
    else if (STREAMING_PLATFORM === "NAPSTER") {
        connected = getElement("thin-nav-button nav-profile-button", 0) !== null;
    }

    if (connected) {
        return true;
    }
    else {
        console.error("User disconnected")
        sendError("connection", "User disconnected", false)
        return false
    }
}

/*******************************************/
/*********** INIT APP PART **************/
/*******************************************/

function initApplication() {
    try {
        navigateToPlaylist()
        selectGoodRepetitionMode()
        var playButton = getPlayButton()
        if (!checkIfPlayingTrack(playButton)) {
            console.log("There is no track currently played")
            setTimeout(function () {
                clickOnPlayAlbum()
                setTimeout(function () {
                    if (!checkIfPlayingTrack(playButton)) {
                        simulatedClick(playButton)
                    }
                }, 2000)
            }, 2000)
        } else {
            console.log("Already playing track")
        }
    } catch (error) {
        console.error(error)
        // todo add send error
    }
}


function simulatedClick(target, options) {

    var event = target.ownerDocument.createEvent('MouseEvents'),
        options = options || {},
        opts = { // These are the default values, set up for un-modified left clicks
            type: 'click',
            canBubble: true,
            cancelable: true,
            view: target.ownerDocument.defaultView,
            detail: 1,
            screenX: 0, //The coordinates within the entire page
            screenY: 0,
            clientX: 0, //The coordinates within the viewport
            clientY: 0,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false, //I *think* 'meta' is 'Cmd/Apple' on Mac, and 'Windows key' on Win. Not sure, though!
            button: 0, //0 = left, 1 = middle, 2 = right
            relatedTarget: null,
        };

    //Merge the options with the defaults
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            opts[key] = options[key];
        }
    }

    //Pass in the options
    event.initMouseEvent(
        opts.type,
        opts.canBubble,
        opts.cancelable,
        opts.view,
        opts.detail,
        opts.screenX,
        opts.screenY,
        opts.clientX,
        opts.clientY,
        opts.ctrlKey,
        opts.altKey,
        opts.shiftKey,
        opts.metaKey,
        opts.button,
        opts.relatedTarget
    );

    //Fire the event
    target.dispatchEvent(event);
}

// Try to select the repeat playlist button
function selectGoodRepetitionMode(count = 0) {
    var repeatButton = getRepetitonButton()
    setTimeout(() => {
        if(!checkIfGoodModeOfRepetition(repeatButton)) {
            repeatButton.click()
            repeatButton = getRepetitonButton() 
            selectGoodRepetitionMode(count + 1)
        }
    }, 3000)
} 

function getRepetitonButton() {

    var repeatButton, error = false;

    if (STREAMING_PLATFORM === "SPOTIFY") {
        if ((repeatButton = document.getElementsByClassName("control-button")[6]) === null) {
            error = true
        }
    }
    else if (STREAMING_PLATFORM === "DEEZER") {
        if ((repeatButton = document.getElementsByClassName("svg-icon-group-btn").item(6)) === null) {
            error = true
        }
    }
    else if (STREAMING_PLATFORM === "TIDAL") {
        if ((repeatButton = getElement(/repeatButton--[^"]*/, 0))  === null) {
            error = true
        }
    }

    if (error) {
        console.error("Can't get repetition button ")
    }
    else {
        return repeatButton;
    }
}

function checkIfGoodModeOfRepetition(_repeatButton) {
    var error = true; 
   
    if (STREAMING_PLATFORM === "SPOTIFY") {
        if (_repeatButton.title === "Autoriser la répétition") {
            error = false 
        }
    }
    else if (STREAMING_PLATFORM === "DEEZER") {
    }
    else if (STREAMING_PLATFORM === "TIDAL") {
        if (_repeatButton.className.includes("all")) {
            error = false 
        }
    }
    else if (STREAMING_PLATFORM === "NAPSTER") {
    }
    if(error) {
        console.error("❌ Bad mode of repetition selected.")
        return false
    } else {
        console.log("Good mode of repetition selected.")
        return true;

    }
}

function clickOnPlayAlbum() {
    var playAlbumButton;

    if (STREAMING_PLATFORM === "SPOTIFY") {
        playAlbumButton = getElement("tracklist-play-pause", 1).click();
    }
    else if (STREAMING_PLATFORM === "DEEZER") {
        playAlbumButton = getElement("action-item-btn action-force", 1)
        playAlbumButton.click()
    }
    else if (STREAMING_PLATFORM === "TIDAL") {
        playAlbumButton = getElement(/controls--[^"]*/, 0).children[0]
        playAlbumButton.click();
    }
    else if (STREAMING_PLATFORM === "NAPSTER") {
        playAlbumButton = getElement("play-button icon-play-button", 1)
        playAlbumButton.click();
    }
}


function getPlayButton() {
    if (STREAMING_PLATFORM === "SPOTIFY") {
        return getElement("control-button--circled", 1)
    }
    else if (STREAMING_PLATFORM === "DEEZER") {
        return getElement("svg-icon-group-btn is-highlight", 1)
    }
    else if (STREAMING_PLATFORM === "TIDAL") {
        return getElement(/playbackToggle[^"]*/, 1);
    }
    else if (STREAMING_PLATFORM === "NAPSTER") {
        const divPlayButton = getElement("player-play-button", 1)
        return divPlayButton.children[1] === undefined ? divPlayButton.children[0] : divPlayButton.children[1]
    }
}


/*******************************************/
/*********** MONITORING PART **************/
/*******************************************/

function getMonitoringInfo() {

    var pseudo, playButton, stateOfPlaying, timeOfPlaying, trackTitle, premium;
    try {
        if (checkConnectionStatus()) {
            pseudo = getCurrentPseudo();
            playButton = getPlayButton()
            stateOfPlaying = checkIfPlayingTrack(playButton);
            timeOfPlaying = getTimeOfPlaying();
            trackTitle = getTitleTrack();
            premium = checkIfPremium()

            checkErrorTimeStuck(timeOfPlaying)
            // check if there is no freeze overtime 
            checkErrorTimeTrackFreeze(timeOfPlaying)
            // check if user still connected

            return `ip=${IP}&stateOfPlaying=${stateOfPlaying}&trackTitle=${trackTitle}&timeOfPlaying=${timeOfPlaying}&pseudo=${pseudo}&premium=${premium}&platform=${STREAMING_PLATFORM}`
        } else throw "User disconnected"
    } catch (error) {
        console.error(error)
        sendError("reload", error, true)
    }
}


function sendMonitoringInfo() {
    var monitoringInfo = getMonitoringInfo();
    console.log(monitoringInfo);
    const Http = new XMLHttpRequest();
    // todo change routes url to server/
    Http.open("POST", SERVER_URL + "/servers/", true);
    Http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    Http.send(monitoringInfo);
}


function sendError(_errorCode, _errorMessage, reloadPage) {
    if (_errorMessage === null || _errorMessage === undefined) _errorMessage = ""
    const errorPost = `ip=${IP}&errorCode=${_errorCode}&errorMessage=${_errorMessage}&platform=${STREAMING_PLATFORM}`;
    const Http = new XMLHttpRequest();
    // todo change routes url to server/error
    Http.open("POST", SERVER_URL + "/servers/error", true);
    Http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    Http.send(errorPost);
    if (reloadPage) {
        location.reload();
    }
}

function checkErrorTimeStuck(_timeOfPlaying) {
    if (LAST_TIME_TRACK === _timeOfPlaying) {
        sendError("reload", "Track stuck at the same time", true)
        throw "Track stuck at the same time"
    }
    else {
        LAST_TIME_TRACK = _timeOfPlaying
        return true
    }
}

function getTitleTrack() {
    if (STREAMING_PLATFORM === "SPOTIFY") {
        return getElement("track-info__name ellipsis-one-line", 1).children[0].children[0].children[0].innerHTML
    }
    else if (STREAMING_PLATFORM === "DEEZER") {
        return getElement("track-link", 1).innerText
    }
    else if (STREAMING_PLATFORM === "TIDAL") {
        return getElement(/mediaInformation--[^"]*/, 1).children[0].children[0].innerText
    }
    else if (STREAMING_PLATFORM === "NAPSTER") {
        return getElement("player-track", 1).children[0].innerText
    }
}

function getTimeOfPlaying() {
    if (STREAMING_PLATFORM === "SPOTIFY") {
        return getElement("playback-bar__progress-time", 1).innerText;
    }
    else if (STREAMING_PLATFORM === "DEEZER") {
        return getElement("slider-counter-current", 1).innerText;
    }
    else if (STREAMING_PLATFORM === "TIDAL") {
        return getElement(/currentTime--[^"]*/, 1).innerText;
    }
    else if (STREAMING_PLATFORM === "NAPSTER") {
        return getElement("player-time", 1).innerText;
    }
}

function getCurrentPseudo() {
    if (STREAMING_PLATFORM === "SPOTIFY") {
        return getElement("UserWidget__user-link", 1).innerText;
    }
    else if (STREAMING_PLATFORM === "DEEZER") {
        return getElement("topbar-profile-picture", 1).alt;
    }
    else if (STREAMING_PLATFORM === "TIDAL") {
        var pseudo = getElement(/profileName--[^"]*/, 1).innerText
        return pseudo === "" ? "Tidal-" + IP : pseudo;
    }
    else if (STREAMING_PLATFORM === "NAPSTER") {
        return getElement("thin-nav-button nav-profile-button", 1).title;
    }
}

function checkIfPremium() {
    if (STREAMING_PLATFORM === "SPOTIFY") {
        return getElement("Root__ads-container", 0) === null 
    }
    else if (STREAMING_PLATFORM === "DEEZER") {
        return getElement("conversion-banner") === null;
    }
    else if (STREAMING_PLATFORM === "TIDAL") {
        return true;
    }
    else if (STREAMING_PLATFORM === "NAPSTER") {
        return true;
    }
}

// todo make it simplier 
function checkErrorTimeTrackFreeze(_timeOfPlaying) {

    // check if there is no freeze overtime 
    var endTimeTrack_temp, endTimeTrack, currentTimeTrack_temp, currentTimeTrack, differenceTimePlaying;

    if (STREAMING_PLATFORM === "SPOTIFY") {
        if ((endTimeTrack_temp = document.getElementsByClassName("playback-bar__progress-time").item(1).valueOf().innerText.split(':')) !== null) {
            endTimeTrack = parseInt(endTimeTrack_temp[0]) * 60 + parseInt(endTimeTrack_temp[1]);
            currentTimeTrack_temp = _timeOfPlaying.split(':');
            currentTimeTrack = parseInt(currentTimeTrack_temp[0]) * 60 + parseInt(currentTimeTrack_temp[1]);
            differenceTimePlaying = endTimeTrack - currentTimeTrack;
            if (differenceTimePlaying < 0) {
                throw "Excess time playing : " + differenceTimePlaying
            }
        }
    }
    else if (STREAMING_PLATFORM === "DEEZER") {
    }
    else if (STREAMING_PLATFORM === "TIDAL") {
    }
}

// check if track are currently play
function checkIfPlayingTrack(_playButton) {

    var playing = false;

    if (STREAMING_PLATFORM === "SPOTIFY") {
        if (_playButton.title === "Pause") {
            playing = true;
        }
    }
    else if (STREAMING_PLATFORM === "DEEZER") {
        if (_playButton.getAttribute('aria-label') === "Pause") {
            playing = true;
        }
    }
    else if (STREAMING_PLATFORM === "TIDAL") {
        if (_playButton.title === "Pause") {
            playing = true;
        }
    }
    else if (STREAMING_PLATFORM === "NAPSTER") {
        if (_playButton.title === "Pause") {
            playing = true;
        }
    }
    if (playing) {
        return true
    }
    else {
        console.error("❌❌ Platform stopped playing tracks")
        return false
    }
}


// if you want to catch errors (for undefined or null), pass true in second arg
function getElement(_className, _catchErrors) {

    if (STREAMING_PLATFORM !== "TIDAL") {
        if (_catchErrors) {
            if (document.getElementsByClassName(_className)[0] !== undefined && document.getElementsByClassName(_className)[0] !== null) {
                return document.getElementsByClassName(_className)[0]
            }
            else {
                console.error("Element " + _className + " not found !");
                throw "Element " + _className + " not found !"
            }
        }
        else {
            return document.getElementsByClassName(_className)[0]
        }
    } else {
        if (_catchErrors) {
            var baliseName = searchInPage(_className);
            if (document.getElementsByClassName(baliseName)[0] !== null &&
                document.getElementsByClassName(baliseName)[0] !== undefined) {
                return document.getElementsByClassName(baliseName)[0];
            }
            else {
                console.error("Element " + _className + " not found !");
                throw "Element " + _className + " not found !"
            }
        }
        else {
            var baliseName = searchInPage(_className);
            return document.getElementsByClassName(baliseName)[0];
        }
    }
}

// tidal function
function searchInPage(regex) {
    docHTML = document.documentElement.innerHTML;
    if (docHTML.match(regex) !== null) {
        return docHTML.match(regex)[0];
    } else {
        return docHTML.match(regex);
    }
}
