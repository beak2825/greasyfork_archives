// ==UserScript==
// @name         Deezer Record Client
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Record deezer tracks
// @author       you
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @match        https://www.deezer.com/*
// @downloadURL https://update.greasyfork.org/scripts/383968/Deezer%20Record%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/383968/Deezer%20Record%20Client.meta.js
// ==/UserScript==

console.log("[Deezer Record] Loading script  ... ");

(function (win) {

    var appConfig = {
        server_addr: "http://127.0.0.1:4000"
    };

    // Application State
    var appState = {
        isUiVisible: false,
        isConnected: false,
        isRecording: false,
        song: null,
        lastRequest: "",
    };

    var appUi = {
        divContainer: null,
        buttonConnect: null,
        divSongLabel: null,
        divRecordingOk: null,
        divRecordingKo: null,
        buttonActivate: null,
        buttonDeactivate: null,
        buttonToggle: null,
    };

    /**
     * Deezer Player.
     */
    var dzPlayer;

    /**
     * Log something
     */
    function log(o) {
        console.log(o);
    }

    /**
     * Log state
     */
    function printState() {
        log("song ID : " + dzPlayer.getCurrentSong().SNG_ID);
        log("dzPlayer.getCurrentSong() : " + dzPlayer.getCurrentSong());
        log("dzPlayer.isPlaying()   : " + dzPlayer.isPlaying());
        log("dzPlayer.isPaused()    : " + dzPlayer.isPaused());
        log("dzPlayer.getDuration() : " + dzPlayer.getDuration());
        log("dzPlayer.getPosition() : " + dzPlayer.getPosition());
        log("dzPlayer.isLastSong()  : " + dzPlayer.isLastSong());
    }



    /**
     * -----------------------------------------------------------------------
     * UI
     * -----------------------------------------------------------------------
     */

    /**
     * Create the application shell
     */
    function initializeUi() {
        GM_addStyle(`
.rec-container {
position: fixed;
top: 0;
right: 0;
display: inline-block;
width: 500px;
height: 100px;
background: #23232C;
border: 1px solid #23232C;
border-radius: 3px;
z-index: 999;
color: #CACACA;
font-family: "Open Sans",Arial,sans-serif;
padding: 5px;
}

.rec-title {
border-bottom: 1px solid #505050;
}

.rec-container.is-not-connected .rec-panel.connection-ko {
display: block;
padding: 10px;
}

.rec-container.is-connected .rec-panel.connection-ko {
display: none;
}

.rec-container.is-not-connected .rec-panel.connection-ok {
display: none;
}

.rec-container.is-connected .rec-panel.connection-ok {
display: block;
}

.rec-container-toggle {
background: #007feb;
width: 27px;
height: 25px;
color: white;
padding: 5px;
position: absolute;
bottom: -26px;
right: 10px;
border-bottom-right-radius: 5px;
border-bottom-left-radius: 5px;
cursor: pointer;
}

.rec-container.is-toggle-on .rec-container-toggle svg {
transform : rotate(-90deg);
transition: all 0.2s ease;
}

.rec-container.is-toggle-off .rec-container-toggle svg {
transform : rotate(90deg);
transition: all 0.2s ease;
}

.rec-one-btn {
width: 150px;
margin: 10px;
position: absolute;
bottom: 0;
right: 0;
}

.is-visible {
display: block;
}

.is-not-visible {
display: none;
}

.is-toggle-on {
top : 0px;
transition: all 0.2s ease;
}

.is-toggle-off {
top : -100px;
transition: all 0.2s ease;
}
`);

        var template = `
<div id="rec-container" class="rec-container is-not-connected is-toggle-off">

<div id="rec-container-toggle" class="rec-container-toggle">
<svg class="svg-icon svg-icon-chevron-right" height="16" width="16" viewBox="0 0 12 12" aria-hidden="true"><g><path d="M8.49982292,5.98684317 C8.50318075,5.84078825 8.44961512,5.70791994 8.36216536,5.60205861 L6.76694027,2.95634347 L5.17171518,0.310628317 C4.7410759,-0.403596201 3.66948999,0.242212541 4.10012927,0.956437059 L5.61708674,3.47234368 L7.13404421,5.9882503 L4.09946473,11.0447071 C3.67029875,11.7598174 4.74321374,12.4034167 5.17237972,11.6883064 L8.36295889,6.37191056 C8.45019023,6.26586926 8.50348184,6.13289086 8.49982292,5.98684317 L8.49982292,5.98684317 Z"></path></g></svg>
</div>

<div class="rec-title">DEEZER Recorder</div>

<div class="rec-panel connection-ko">
<span>Pas de connection ...</span>
<button id="rec-button-connect" class="btn btn-primary btn-block rec-one-btn" >Connection</button>
</div>

<div class="rec-panel connection-ok">

<div id="panel-recording-ko">
<span>Connection établie. Enregistrement non actif.</span>
<button id="rec-button-activate" class="btn btn-primary btn-block rec-one-btn" >Activer</button>
</div>

<div id="panel-recording-ok">
<span>Connection établie. Enregistrement actif !</span>
<div>Enregistrement en cours : <span id="rec-song-name"></span></div>
<button id="rec-button-deactivate" class="btn btn-primary btn-block rec-one-btn" >Désactiver</button>
</div>

</div>

</div>
`;

        var container = win.document.createElement('div');
        container.innerHTML = template;
        win.document.body.appendChild(container);

        var findId = function (id) {
            return document.getElementById(id);
        };

        // link template
        appUi.divSongLabel = findId('rec-song-name');
        appUi.divContainer = findId('rec-container');
        appUi.divRecordingOk = findId('panel-recording-ok');
        appUi.divRecordingKo = findId('panel-recording-ko');
        appUi.buttonConnect = findId('rec-button-connect');
        appUi.buttonActivate = findId('rec-button-activate');
        appUi.buttonDeactivate = findId('rec-button-deactivate');
        appUi.buttonToggle = findId('rec-container-toggle');

        log(appUi);

        // add listener
        appUi.buttonConnect.addEventListener('click', doPingRequest);
        appUi.buttonActivate.addEventListener('click', actionActivate);
        appUi.buttonDeactivate.addEventListener('click', actionDeactivate);
        appUi.buttonToggle.addEventListener('click', actionToggle);
    }

    /**
     * refresh UI
     */
    function refreshUi() {

        // log("Refresh UI ...");

        var divContainerClass = "rec-container";
        if (appState.isConnected === true) {
            divContainerClass += " is-connected";
        } else {
            divContainerClass += " is-not-connected";
        }
        if (appState.isUiVisible === true) {
            divContainerClass += " is-toggle-on";
        } else {
            divContainerClass += " is-toggle-off";
        }
        appUi.divContainer.className = divContainerClass;

        if (appState.isActivated === true) {
            appUi.divRecordingOk.className = 'is-visible';
            appUi.divRecordingKo.className = 'is-not-visible';
        } else {
            appUi.divRecordingKo.className = 'is-visible';
            appUi.divRecordingOk.className = 'is-not-visible';
        }

        if (appState.isRecording === true) {
            appUi.divSongLabel.innerText = getCurrentSongName();
        } else {
            appUi.divSongLabel.innerText = "Aucun titre";
        }

        // log("Refresh UI ... Done !");
    }

    /**
     * Get the current song name
     */
    function getCurrentSongName() {
        return appState.song.ART_NAME + '-' + appState.song.TRACK_NUMBER + '-' + appState.song.SNG_TITLE;
    }


    /**
     * -----------------------------------------------------------------------
     * ACTIONS
     * -----------------------------------------------------------------------
     */


    /**
     * Toggle UI
     */
    function actionToggle() {
        if (appState.isUiVisible) {
            appState.isUiVisible = false;
        } else {
            appState.isUiVisible = true;
        }
        refreshUi();
    }

    /**
     * Activate
     */
    function actionActivate() {
        appState.isActivated = true;
        refreshUi();
    }

    /**
     * Deactivate
     */
    function actionDeactivate() {
        appState.isActivated = false;
        refreshUi();
    }



    /**
     * -----------------------------------------------------------------------
     * NETWORK
     * -----------------------------------------------------------------------
     */



    /**
     * Do a request
     */
    function doRequest(url, data, onSuccess, onError) {

        if (url !== "ping") {
            if (appState.lastRequest === url) {
                return;
            }
            appState.lastRequest = url;
        }

        log("Do Request (" + url + ") ...");

        GM_xmlhttpRequest({
            method: "POST",
            url: appConfig.server_addr + "/" + url,
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
            onload: function (response) {
                log("[request] : success");

                if (typeof onSuccess === "function") {
                    onSuccess();
                }
            },
            onerror: function (response) {
                log("[request] : error");

                if (typeof onError === "function") {
                    onError();
                }
            }
        });

        log("Do Request ... Done !");
    }

    /**
     * Do the record request
     */
    function doRecordRequest() {
        doRequest("record", appState.song);
    }

    /**
     * Do the record request
     */
    function doStopRecordRequest() {
        doRequest("stop", appState.song);
    }

    /**
     * Do the record request
     */
    function doAbortRecordRequest() {
        doRequest("delete", appState.song);
    }

    /**
     * Do a ping request
     */
    function doPingRequest() {

        var onSuccess = function () {
            appState.isConnected = true;
            refreshUi();
        };

        var onError = function () {
            appState.isConnected = false;
            refreshUi();
        };

        doRequest("ping", {}, onSuccess, onError);
    }



    /**
     * -----------------------------------------------------------------------
     * EVENTS & STATE
     * -----------------------------------------------------------------------
     */

    /**
     * Proxify function.
     */
    function proxify(obj, functionName, onBefore) {

        var functionDescriptor = Object.getOwnPropertyDescriptor(
            obj, functionName
        );

        var handler = {
            apply: function (target, that, args) {
                onBefore(args);
                return target.apply(that, args);
            }
        };

        var proxy = new Proxy(functionDescriptor.value, handler);

        functionDescriptor.value = proxy;

        Object.defineProperty(obj, functionName, functionDescriptor);
    }

    /**
     * Trace all methods
     */
    function traceAll(obj) {
        var allDescriptors = Object.entries(
            Object.getOwnPropertyDescriptors(
                obj
            )
        );

        allDescriptors.forEach(function (entry) {
            if (typeof entry[1].value === "function") {

                //if (["getContext", "getPlayerType", "getCurrentSong"].indexOf(entry[0])>=0) return;

                if (entry[0] === "trigger") {
                    proxify(obj, entry[0], function () {
                        console.log("called : ", entry[0]);
                    });
                }
            }
        });
    }

    /**
     * Initialize Triggers
     */
    function initializeTriggers() {

        log("Initialize Triggers ...");

        //traceAll(dzPlayer);

        proxify(dzPlayer, "trigger", function (args) {
            // audioPlayer_playTracks
            // audioPlayer_pause
            // audioPlayer_play ["resume", 24.896882]
            // audioPlayer_seek

            log(args);
            /*
            log("dzPlayer.isPlaying   : " + dzPlayer.isPlaying());
            log("dzPlayer.isPaused    : " + dzPlayer.isPaused());
            log("dzPlayer.getDuration : " + dzPlayer.getDuration());
            log("dzPlayer.getPosition : " + dzPlayer.getPosition());
            */
            updateState();
        });

        log("Initialize Triggers ... Done !");
    }

    /**
     * State is a track end
     *
     * VM684:63 dzPlayer.isPlaying()   : false
     * VM684:65 dzPlayer.getDuration() : 211.317104
     * VM684:66 dzPlayer.getPosition() : 211.317104
     */
    function isStateTrackEnd() {
        if ((appState.isRecording === true) &&
            (dzPlayer.getDuration() === dzPlayer.getPosition()) &&
            (dzPlayer.isPlaying() === false)) {
            return true;
        }

        return false;
    }

    /**
     * State is play track
     *
     * VM684:63 dzPlayer.isPlaying()   : true
     * VM684:65 dzPlayer.getDuration() : 211
     * VM684:66 dzPlayer.getPosition() : 0
     */
    function isStatePlay() {
        if ((appState.isRecording === false) &&
            (dzPlayer.getDuration() > 0) &&
            (dzPlayer.getPosition() <= 0.2) &&
            (dzPlayer.isPlaying() === true)) {
            return true;
        }
        return false;
    }

    /**
     * State is play abort
     *
     * VM684:63 dzPlayer.isPlaying()   : false
     * VM684:65 dzPlayer.getDuration() : 211
     * VM684:66 dzPlayer.getPosition() : 16.010593
     */
    function isStateAbort() {

        var song = dzPlayer.getCurrentSong();

        if ((appState.isRecording === true) &&
            (appState.song.SNG_ID !== song.SNG_ID) &&
            (dzPlayer.getDuration() !== dzPlayer.getPosition()) &&
            (dzPlayer.getPosition() === 0) &&
            (dzPlayer.isPlaying() === true)) {
            return true;
        }

        if ((appState.isRecording === true) &&
            (dzPlayer.getDuration() !== dzPlayer.getPosition()) &&
            (dzPlayer.getPosition() !== 0) &&
            (dzPlayer.isPlaying() === false)) {
            return true;
        }
        return false;
    }

    /**
     * Play
     */
    function doRecord() {
        log("Do Record ...");

        appState.isRecording = true;
        appState.song = dzPlayer.getCurrentSong();

        doRecordRequest();

        log("Record song : " + appState.song.ART_NAME + appState.song.TRACK_NUMBER + appState.song.SNG_TITLE);

        log("Do Record ... Done !");
    }

    /**
     * Track end
     */
    function doStopRecord() {
        log("Do Stop Record ...");

        appState.isRecording = false;

        doStopRecordRequest();

        log("Stop Record song : " + appState.song.ART_NAME + appState.song.TRACK_NUMBER + appState.song.SNG_TITLE);

        log("Do Stop Record ... Done !");
    }

    /**
     * Abort
     */
    function doCancelRecord() {
        log("Do Cancel Record ...");

        appState.isRecording = false;

        doAbortRecordRequest();

        log("Cancel Record song : " + appState.song.ART_NAME + appState.song.TRACK_NUMBER + appState.song.SNG_TITLE);

        log("Do Cancel Record ... Done !");
    }

    /**
     * Update State
     */
    function updateState() {

        // guard
        if (appState.isActivated === false) {
            // log("Recording is not activated ...");
            return;
        }

        // guard
        if (appState.isConnected === false) {
            // log("Application is not connected ...");
            return;
        }

        // log("Update State ... ");

        if (isStatePlay()) {
            //log("STATE PLAY");
            doRecord();
        }

        if (isStateTrackEnd()) {
            //log("STATE TRACK END");
            doStopRecord();
        }

        if (isStateAbort()) {
            //log("STATE ABORT");
            doCancelRecord();
        }

        refreshUi();
        // printState();

        // log("Update State ... Done !");
    }


    /**
     * -----------------------------------------------------------------------
     * HIDE AD BANNER
     * -----------------------------------------------------------------------
     */


    /**
     * Hide ads.
     */
    function hideAdBanner() {
        var banner = win.document.querySelector(".abp-banner-container");
        if (banner !== null) {
            banner.remove();
        }
        var pageAds = win.document.querySelector('a[data-type="offers_subscribe"]');
        if (pageAds !== null) {
            pageAds.remove();
        }
        var conversionBanner = win.document.querySelector(".conversion-banner");
        if (conversionBanner !== null) {
            conversionBanner.remove();
        }
        win.setTimeout(function () {
            hideAdBanner();
        }, 500);
    }


    /**
     * -----------------------------------------------------------------------
     * BOOTSTRAP
     * -----------------------------------------------------------------------
     */


    /**
     * Find the Deezer Player App.
     */
    function findDzPlayer() {

        log("Find DzPlayer module ...");

        /*
        win.webpackJsonpDeezer(["getDzPlayerHack"], {
            "getDzPlayerHack": function(a, b, require) {
                var modules = require.c;
                var found = false;
                for (var moduleid in modules) {
                    var el = require(moduleid);
                    if (moduleid === "./js/_modules/dzPlayer.js") {
                        found = true;
                        log(" Found module [" + moduleid + "]");
                        dzPlayer = el.a;
                    }
                }

                if (found === false) {
                    log("DzPlayer module NOT FOUND !");
                }
            }
        },["getDzPlayerHack"]);
        */
        dzPlayer = win.dzPlayer;
    }

    function polling(t) {

        updateState();

        win.setTimeout(() => {
            polling();
        }, 10);
    }

    /**
     * Initialize Application
     */
    function initializeApplication() {

        log("InitializeApplication ...");

        findDzPlayer();
        initializeTriggers();
        initializeUi();
        hideAdBanner();

        polling(0);

        log("InitializeApplication ... Done !");
    }

    /**
     * Listener to load the application
     */
    win.addEventListener('load', function () {
        win.setTimeout(initializeApplication, 1000);

    }, false);

})(unsafeWindow);
