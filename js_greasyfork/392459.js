// ==UserScript==
// @name         Youtube Automatic BS Skip
// @namespace    https://greasyfork.org/en/scripts/392459-youtube-automatic-bs-skip
// @source       https://github.com/JustDaile/
// @version      2.9.11
// @description  A script to deal with the automatic skipping of fixed length intros/outros for your favourite Youtube channels.
// @author       Daile Alimo
// @license MIT
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/392459/Youtube%20Automatic%20BS%20Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/392459/Youtube%20Automatic%20BS%20Skip.meta.js
// ==/UserScript==
//
/* globals $ whenReady trustedTypes  */

const app = "YouTube Automatic BS Skip";
const version = '2.9.11';
const debug = false;

// Chrome: bypass content security policy, preventing innerHTML being set.
// https://stackoverflow.com/questions/61964265/getting-error-this-document-requires-trustedhtml-assignment-in-chrome

// Detect if browser supports trustedTypes by checking if its defined.
// If not defined mock the createHTML method to negate the need to make additional updates to the codebase depending on if trustedTypes is used or not.

let escapeHTMLPolicy;
if (typeof trustedTypes !== "undefined") {
    escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
        createHTML: (to_escape) => to_escape
    })
} else {
   escapeHTMLPolicy = {
       createHTML: (to_escape) => to_escape
   };
}

// Elements
const yabssInputIdPrefix = "yabbs-control";
const yabssModalIdPrefix = "yabbs-modal";
const yabssProgressbarIdPrefix = "yabss-pgbar";
const yabssIntroInputId = "yabbs-intro";
const yabssOutroInputId = "yabbs-outro";
const yabssChannelTxtContainerId = "yabbs-channel";

// Actions
const pauseOnOutro = "pause-on-outro";
const nextOnOutro = "next-on-outro";
const instantNextOnFinish = "instant-next";
const apply_ID = "apply";

// logs to console if debug is true
const log = function() {
    if (debug) {
        console.log(...arguments);
    }
};

log({
    app,
    version
});

// updateControls updates only the elements in the modal controls, in which the values are set when function is invoked.
const updateControls = ({introValue, outroValue, channelName, actions}) => {
    log('update controls');
    if (introValue !== undefined) {
        document.getElementById(yabssIntroInputId).value = introValue;
    }
    if (outroValue !== undefined) {
        document.getElementById(yabssOutroInputId).value = outroValue;
    }
    if (channelName !== undefined) {
        document.getElementById(yabssChannelTxtContainerId).innerText = channelName;
    }
    if (actions !== undefined) {
        actions.outro ? document.getElementById(nextOnOutro).checked = true : document.getElementById(pauseOnOutro).checked = true;
        actions.onFinish ? document.getElementById(instantNextOnFinish).checked = true : document.getElementById(instantNextOnFinish).checked = false;
    }
    document.getElementById(yabssModalIdPrefix).classList.remove('show');
};

// asyncAwaitElements returns each of the selectors in a object with the provided aliases as keys to the found DOM element.
const asyncAwaitElements = async (selectors, aliases, attempts = 5) => {
    return new Promise((resolve, reject) => {
        const id = setInterval(_ => {
            let ready = {};
            let found = 0;
            let count = 0;
            for(let i in selectors){
                let $sel = document.querySelector(selectors[i]);
                if ($sel) {
                    let index = aliases[i] ? aliases[i]: i;
                    log(`found selector ${selectors[i]}`);
                    ready[index] = $sel;
                    found++;
                }
            }
            if (found === selectors.length) {
                log("all selectors found");
                clearInterval(id);
                return resolve(ready);
            }
            if (count > attempts - 1) {
                reject(`reached max allowed attempts ${count}`);
            }
            count++
        }, 100)
        })
}

(function(yabssApp) {
    "use strict";
    // dispose function provided by yabssApp
    var dispose;
    const ytapp = document.querySelector('body > ytd-app');
    // Quick channel loading - Hook into Youtube's events.
    // Best determined event for bootstrapping the applications lifecycle.
    // YouTube calls yt-page-data-fetched when page when page/channel information has been loaded, but way sooner than it takes to update the UI.
    ytapp.addEventListener("yt-page-data-fetched", async (e) => {
        const page = e.detail.pageData.page; // browse, watch
        log(page);

        if (page !== 'watch') { // ignore any pages that are not 'watch'
            return
        }
        dispose = await yabssApp(e.detail.pageData.playerResponse.microformat.playerMicroformatRenderer.ownerChannelName);
    });
    // Dispose all event listeners whenever page navigation starts
    // When next video is loading YouTube resets video playback time to zero.
    // Since the binded timeupdate event is still running this causes last set intro to be skipped,
    // before the next video has loaded.
    // To get around this behaviour disposing all events listeners as soon as possible is best way to prevent this behaviour.
    ytapp.addEventListener("yt-navigate-start", (e) => {
        if (dispose) {
            dispose();
            dispose = null;
        }
    });
})(async (channelName) => {
    log(`binding to ${channelName}`);

    var paused = false;
    var continued = false;

    const { stream, controlContainer, progressbar } = await asyncAwaitElements([".video-stream", ".ytp-right-controls-left", ".ytp-progress-bar"], ["stream", "controlContainer", "progressbar"])
    const controls = document.querySelector(yabssInputIdPrefix);
    if (controls == null) {
        log('adding modal toggle to video control panel.');
        controlContainer.insertBefore(videoControlButton, controlContainer.firstChild);
    }

    // Pull channel settings
    var storeId = channelName.split(" ").join("_");
    var introTargetId = storeId + "-intro";
    var outroTargetId = storeId + "-outro";
    var outroActionId = storeId + "-outro-action";
    var finishedActionId = storeId + "-finished-action";
    var loadedIntroSetInSeconds = await GM.getValue(introTargetId, 0);
    var loadedOutroSetInSeconds = await GM.getValue(outroTargetId, 0);
    var playNextOnOutro = await GM.getValue(outroActionId, true);
    var instantNextOnFinished = await GM.getValue(finishedActionId, true);
    log('channel settings', {
        channelName,
        loadedIntroSetInSeconds,
        loadedOutroSetInSeconds,
        playNextOnOutro,
        instantNextOnFinished
    });

    // Setup & update progressbars
    var introBar = document.getElementById(`${yabssProgressbarIdPrefix}-intro`)
    if (introBar == null) {
        introBar = document.createElement('div')
        introBar.id = `${yabssProgressbarIdPrefix}-intro`
        introBar.classList.add('ytp-load-progress')
        introBar.style.left = "0%"
        introBar.style.transform = 'scaleX(0)'
        introBar.style.backgroundColor = "green"
        progressbar.insertBefore(introBar, progressbar.firstChild);
    }

    var outroBar = document.getElementById(`${yabssProgressbarIdPrefix}-outro`)
    if (outroBar == null) {
        outroBar = document.createElement('div')
        outroBar.id = `${yabssProgressbarIdPrefix}-outro`
        outroBar.classList.add('ytp-load-progress')
        outroBar.style.left = '100%'
        outroBar.style.transform = 'scaleX(0)'
        outroBar.style.backgroundColor = "green"
        progressbar.insertBefore(outroBar, progressbar.firstChild);
    }

    const updateProgressbars = (duration) => {
        var introFraction = loadedIntroSetInSeconds / duration;
        introBar.style.transform = `scaleX(${introFraction})`

        var outroFraction = loadedOutroSetInSeconds / duration;
        outroBar.style.left = `${100 - (outroFraction * 100)}%`
        outroBar.style.transform = `scaleX(${outroFraction})`
    }

    updateControls({ channelName, introValue: loadedIntroSetInSeconds, outroValue: loadedOutroSetInSeconds, actions: { outro: playNextOnOutro, onFinish: instantNextOnFinished } });
    const updateChannelSettings = _ => {
        loadedIntroSetInSeconds = document.getElementById(yabssIntroInputId).value;
        loadedOutroSetInSeconds = document.getElementById(yabssOutroInputId).value;
        GM.setValue(introTargetId, loadedIntroSetInSeconds);
        GM.setValue(outroTargetId, loadedOutroSetInSeconds);
        updateControls({
            introValue: loadedIntroSetInSeconds,
            outroValue: loadedOutroSetInSeconds
        });
    }
    document.getElementById(apply_ID).addEventListener('click', updateChannelSettings);
    const setPauseOnOutro = _ => {
        log('pause on outro changed');
        GM.setValue(outroActionId, false);
        playNextOnOutro=false
    }
    document.getElementById(pauseOnOutro).addEventListener('change', setPauseOnOutro);
    const setNextOnOutro = _ => {
        log('next on outro changed');
        GM.setValue(outroActionId, true);
        playNextOnOutro=true
    }
    document.getElementById(nextOnOutro).addEventListener('change', setNextOnOutro);
    const setInstantNextOnFinish = e => {
        log('instant next on finished changed');
        instantNextOnFinished=e.target.checked;
        GM.setValue(finishedActionId, instantNextOnFinished);
    }
    document.getElementById(instantNextOnFinish).addEventListener('change', setInstantNextOnFinish);

    // Start watching timeupdates
    const onTimeUpdate = e => {
        const outroReached = e.target.currentTime >= e.target.duration - loadedOutroSetInSeconds
        updateProgressbars(e.target.duration);

        // use pause to prevent timeupdate after script has clicked pause button.
        // There is a slight delay from when pause button is clicked, to when the timeupdates are stopped.
        // So this escape prevents further execution.
        if (paused) {
            return
        }

        // If current time less than intro, skip past intro.
        if(e.target.currentTime < loadedIntroSetInSeconds) {
            log(`intro skipped ${loadedIntroSetInSeconds}`, e.target);
            e.target.fastSeek(loadedIntroSetInSeconds);
            log(`time set`, e.target.currentTime);
        }

        // If current time greater or equal to outro, click next button or pause the stream.
        if(outroReached){
            log('outro reached');
            if (playNextOnOutro) {
                log('auto-click next');
                document.querySelector('.ytp-next-button').click();
            } else if (!continued) {
                log('auto-click pause');
                document.querySelector('.ytp-play-button').click();
                paused=true;
            }
        }
    }
    stream.addEventListener('timeupdate', onTimeUpdate);
    const onPlay = e => {
        log(`onPlay`);
        // continued is when outro is reached and playback is resumed by the user.
        // However the user may skip back before pressing play.
        // So when resuming continued must first detect if it is still during the outro, if so playback will continue to the end of the video normally.
        continued = e.target.currentTime >= e.target.duration - loadedOutroSetInSeconds;
        // unpause timeupdates.
        paused = false;
    }
    stream.addEventListener('play', onPlay);

    return _ => {
        log(`disposing event listeners`);
        stream.removeEventListener('timeupdate', onTimeUpdate);
        stream.removeEventListener('play', onPlay);
        document.getElementById(apply_ID).removeEventListener('click', updateChannelSettings);
        document.getElementById(pauseOnOutro).removeEventListener('change', setPauseOnOutro);
        document.getElementById(nextOnOutro).removeEventListener('change', setNextOnOutro);
        document.getElementById(instantNextOnFinish).removeEventListener('change', setInstantNextOnFinish);
    }
})

// videoControlButton is the button that is displayed within the video controls.
// click it will bring up the settings/controls modal.
var videoControlButton = document.createElement('button')
videoControlButton.innerHTML = escapeHTMLPolicy.createHTML(`
  <div class="ytp-autonav-toggle-button-container">
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" height="24"><path d="M0 0h24v24H0z" fill="none"/><path fill="white" d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"/></svg>
  </div>`);
videoControlButton.id = yabssInputIdPrefix;
videoControlButton.classList.add('ytp-button');
videoControlButton.setAttribute('title', app);
videoControlButton.setAttribute('aria-label', app);
log('created yabss button', videoControlButton);

// yabssPopupControls is the settings/controls modal that allows users to update settings for the channel.
var yabssPopupControls = document.createElement('div');
yabssPopupControls.id = yabssModalIdPrefix;
yabssPopupControls.innerHTML = escapeHTMLPolicy.createHTML(`
<div id="${yabssModalIdPrefix}-escape"></div>
   <div id="${yabssModalIdPrefix}-content">
      <div id="${yabssChannelTxtContainerId}">Loading Channel</div>
      <h2 id="${yabssInputIdPrefix}-title" class="d-flex justify-space-between">
         YouTube Automatic BS Skip ${version}
         <a href="https://www.buymeacoffee.com/JustDai" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24">
               <g>
                  <path d="M0,0h24v24H0V0z" fill="none"></path>
               </g>
               <g fill="var(--yt-live-chat-primary-text-color)">
                  <path d="M18.5,3H6C4.9,3,4,3.9,4,5v5.71c0,3.83,2.95,7.18,6.78,7.29c3.96,0.12,7.22-3.06,7.22-7v-1h0.5c1.93,0,3.5-1.57,3.5-3.5 S20.43,3,18.5,3z M16,5v3H6V5H16z M18.5,8H18V5h0.5C19.33,5,20,5.67,20,6.5S19.33,8,18.5,8z M4,19h16v2H4V19z"></path>
               </g>
            </svg>
         </a>
      </h2>
      <div id="${yabssInputIdPrefix}-control-wrapper">
         <div class="w-100 d-flex justify-space-around align-center">
            <label for="${yabssIntroInputId}">Intro</label>
            <input type="number" min="0" id="${yabssIntroInputId}" placeholder="unset" class="input">
         </div>
         <div class="w-100 d-flex justify-space-around align-center">
            <label for="${yabssOutroInputId}">Outro</label>
            <input type="number" min="0" id="${yabssOutroInputId}" placeholder="unset" class="input">
         </div>
         <div class="pa">
            <label for="${yabssInputIdPrefix}-outro-action-group">Action on outro:</label>
            <fieldset id="${yabssInputIdPrefix}-outro-action-group" class="d-flex">
               <div>
                  <label for="${pauseOnOutro}">Pause Video</label>
                  <input type="radio" name="outro-action-group" id="${pauseOnOutro}">
               </div>
               <div>
                  <label for="${nextOnOutro}">Play Next Video</label>
                  <input type="radio" name="outro-action-group" id="${nextOnOutro}" checked="checked">
               </div>
            </fieldset>
         </div>
         <div class="py" >
            <label for="${yabssInputIdPrefix}-ended-action-group">Action on finish:</label>
            <fieldset id="${yabssInputIdPrefix}-ended-action-group" class="d-flex">
               <div style="margin: auto; text-align: right;">
                  <label for="${instantNextOnFinish}">Instantly play next</label>
                  <input type="checkbox" name="outro-action-group" id="${instantNextOnFinish}">
               </div>
            </fieldset>
         </div>
      </div>
      <tp-yt-paper-button id="${apply_ID}" class="style-scope py ytd-video-secondary-info-renderer d-flex justify-center align-center" style-target="host" role="button" elevation="3" aria-disabled="false">${apply_ID}</tp-yt-paper-button>
   </div>`);
document.body.insertAdjacentElement('beforeend', yabssPopupControls);

// toggleModalEventListener display or hide the yabssPopupControls.
const toggleModalEventListener = _ => {
    log("toggling yabss modal");
    yabssPopupControls.classList.toggle("show");
}

// Listen to user clicks on the video control button.
videoControlButton.addEventListener('click', toggleModalEventListener);

// Listen to user clicks on modal escape area
document.querySelector(`#${yabssModalIdPrefix}-escape`).addEventListener('click', toggleModalEventListener);

// Write the CSS rules to the DOM
GM.addStyle(`
#${yabssModalIdPrefix}-escape {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
}
#${yabssModalIdPrefix} {
    display: none;
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999;
    background: rgba(0,0,0,.8);
}
#${yabssModalIdPrefix}.show {
    display: flex;
}
#${yabssModalIdPrefix}-content {
    margin: auto;
    width: 30%;
    height: auto;
    background-color: var(--yt-live-chat-action-panel-background-color);
    color: var(--yt-live-chat-primary-text-color);
    border-radius: 6px 6px 6px;
    border: 1px solid var(--yt-live-chat-enabled-send-button-color);
    padding: 15px;
    z-index: 1001;
    box-shadow: 1em 1em 3em black;
}
#${yabssIntroInputId},#${yabssOutroInputId} {
    font-size: 1.2em;
    padding: .4em;
    border-radius: .5em;
    border: 1px solid var(--yt-live-chat-secondary-text-color);
    width: 80%;
}
#${apply_ID} {
    position: relative;
    border: 1px solid var(--yt-live-chat-secondary-text-color);
    transition: background-color .2s ease-in-out
}
#${apply_ID}:hover {
    background-color: var(--yt-spec-10-percent-layer);
}
#${yabssInputIdPrefix} {
    height: 100%;
    padding: 0;
    margin: 0;

}
#${yabssInputIdPrefix} svg {
    position: relative;
}
#${yabssInputIdPrefix}-panel {
 margin-right: 1em;
 vertical-align:top
}
#${yabssInputIdPrefix} > * {
 display: inline-block;
 max-height: 100%;
}
#${yabssInputIdPrefix}-title {
 padding: 2px;
}
#${yabssInputIdPrefix}-outro-action-group {
    padding: .5em;
}
#${yabssInputIdPrefix}-outro-action-group > div {
 display: block;
 margin: auto;
 text-align-last: justify;
}
#${yabssInputIdPrefix}-control-wrapper > * {
    padding-top: 1em;
}
#action-radios {
  display: none;
}
#action-radios .actions {
  padding-left: 2px;
  text-align: left;
  background-color: var(--yt-spec-base-background);
  color: var(--yt-live-chat-secondary-text-color);
}
#${yabssIntroInputId},#${yabssOutroInputId} {
 margin-right: 2px;
}
#${yabssChannelTxtContainerId} {
    position: relative;
    top: -3.5em;
    margin-bottom: -1.5em;
    font-size: 1.1em;
    color: white;
}
.w-100 {
    width: 100% !important;
}
.input {
    padding: .2em;
}
.d-flex {
    display: flex;
}
.justify-center {
    justify-content: center;
}
.justify-space-around {
    justify-content: space-around;
}
.justify-space-between {
    justify-content: space-between;
}
.align-center {
    align-items: center;
}
.pa {
    padding: .5em;
}
.py {
    padding: .5em 0em;
}
`);