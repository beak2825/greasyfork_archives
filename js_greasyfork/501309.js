// ==UserScript==
// @name        GDC Vault Player Extended
// @namespace   Level3Manatee
// @match       https://gdcvault.com/play/*
// @match       https://www.gdcvault.com/play/*
// @match       https://gdcvault.blazestreaming.com/*
// @grant       none
// @version     1.1.0
// @author      Level3Manatee
// @license     MIT
// @description Extends GDC Vault player functionality: keyboard controls (see ? button), dark mode, stereo / mono toggle, ... and makes it bigger. Saves & restores playback position, subtitle settings and dark mode preference (LocalStorage)
// @supportURL  https://github.com/Level3Manatee/GDCVaultPlayerExtended
// @downloadURL https://update.greasyfork.org/scripts/501309/GDC%20Vault%20Player%20Extended.user.js
// @updateURL https://update.greasyfork.org/scripts/501309/GDC%20Vault%20Player%20Extended.meta.js
// ==/UserScript==

/** Notes
  * Player is video.js;
    API https://docs.videojs.com/player
    and https://videojs.readthedocs.io/en/latest/

  * The videoplayer is hosted by a third party and in an iframe,
    so all actions need to be forwarded as a message,
    and executed inside the iframe context.
*/

const isIframe = window.location.href.match(/gdcvault\.com/) === null;
const iframeEl = document.querySelector("#player iframe");
const isVideoContent = isIframe || iframeEl.src.match(/gdcvault\.blazestreaming\.com/) !== null;
const frameDuration = 1 / 30; // for frame-by-frame seeking (there is no good way to determine framerate programatically)


/** Key binds
 * keys: { KeyboardEvent.key: preventDefault }
 * */

const Actions = {
  Pause: {
    name: "Play / pause",
    keys: {
      " ": true,
      "k": false
    },
    execute: Pause,
    osd: function () { return player.paused() ? "Pause" : "Play"; }
  },
  Mute: {
    name: "Mute / unmute",
    keys: {
      "m": false
    },
    execute: Mute,
    osd: function () { return player.muted() ? "Muted" : `Vol ${player.volume().toFixed(1)}`; }
  },
  SeekBack: {
    name: "Seek backward 5 seconds",
    keys: {
      "ArrowLeft": false
    },
    execute: function () { return Promise.resolve( Seek(-5.0) ); },
    osd: function () { osdTimeDisplay.updateTextNode_(player.currentTime()); return osdTimeDisplay.formattedTime_; }
  },
  SeekForward: {
    name: "Seek forward 10 seconds",
    keys: {
      "ArrowRight": false
    },
    execute: function () { return Promise.resolve( Seek(10.0) ); },
    osd: function () { osdTimeDisplay.updateTextNode_(player.currentTime()); return osdTimeDisplay.formattedTime_; }
  },
  VolumeDown: {
    name: "Decrease Volume",
    keys: {
      "ArrowDown": true
    },
    execute: function () { return Promise.resolve( Volume(-0.1) ); },
    osd: function () { return `Vol ${player.volume().toFixed(1)}`; }
  },
  VolumeUp: {
    name: "Increase Volume",
    keys: {
      "ArrowUp": true
    },
    execute: function () { return Promise.resolve( Volume(0.1) ); },
    osd: function () { return `Vol ${player.volume().toFixed(1)}`; }
  },
  CycleMonoStereo: {
    name: "Cycle Stereo / Mono (L) / Mono (R)",
    keys: {
      "a": false
    },
    execute: CycleMonoStereo,
    osd: function () { switch (audioChannelMode) { case 0: return "Stereo"; case 1: return "Mono (left)"; case 2: return "Mono (right)"; } }
  },
  Fullscreen: {
    name: "Fullscreen",
    keys: {
      "f": false
    },
    execute: Fullscreen
  },
  PrevFrame: {
    name: "Previous frame",
    keys: {
      ",": false
    },
    execute: function () { return Promise.resolve( SeekFrame(-1) ); }
  },
  NextFrame: {
    name: "Next frame",
    keys: {
      ".": false
    },
    execute: function () { return Promise.resolve( SeekFrame(1) ); }
  },
  PlaybackSlower: {
    name: "Decrease playback speed",
    keys: {
      "<": false,
      "[": false
    },
    execute: function () { return Promise.resolve( PlaybackRate(-1) ); },
    osd: function () { return `${playbackRate}x`; }
  },
  PlaybackFaster: {
    name: "Increase playback speed",
    keys: {
      ">": false,
      "]": false
    },
    execute: function () { return Promise.resolve( PlaybackRate(1) ); },
    osd: function () { return `${playbackRate}x`; }
  },
  PlaybackDefault: {
    name: "Default playback speed (1.0x)",
    keys: {
      "Backspace": false
    },
    execute: function () { return Promise.resolve( PlaybackRate(0) ); },
    osd: function () { return `${playbackRate}x`; }
  },
  ToggleSubtitles: {
    name: "Toggle subtitles on / off",
    keys: {
      "v": false,
      "s": false
    },
    execute: ToggleSubtitles,
    osd: function () { return SubsAreVisible() ? "Subtitles on" : "Subtitles off"; }
  },
  CycleSubtitles: {
    name: "Cycle through subtitle tracks",
    keys: {
      "j": false,
      "S": false
    },
    execute: CycleSubtitles,
    osd: function () { return subtitles[currentSubtitle] !== undefined ? subtitles[currentSubtitle].language : "No subtitles available"; }
  },
  ToggleDarkMode: {
    name: "Toggle Dark Mode",
    keys: {
      "d": false
    },
    execute: ToggleDarkMode,
    osd: function () { return isDarkMode ? "Dark Mode on" : "Dark mode off"; }
  },
  OpenModal: {
    name: "Open/close help dialog",
    keys: {
      "h": false,
      "Escape": false
    },
    execute: ToggleModal
  }
}
// export for player button event handlers
window['playerActionShurtcuts'] = { actions: Actions };

let BindingsKeys = [];
for (let [actionName, action] of Object.entries(Actions)) {
  for (let [key, preventDefault] of Object.entries(action.keys))
    BindingsKeys[key] = {action: Actions[actionName], preventDefault: preventDefault}
}

let dispatchTimeout = -1;
window.addEventListener("keydown", evt => {
  // don't dispatch actions when input (e.g. search bar) has focus
  if (evt.target.nodeName.toLowerCase() === 'input')
    return;

  if (BindingsKeys[evt.key] === undefined) return;

  if (BindingsKeys[evt.key].preventDefault === true && isVideoContent)
    evt.preventDefault();

  clearTimeout(dispatchTimeout);
  dispatchTimeout = setTimeout(DispatchAction, 0, evt.key);
//  DispatchAction(evt.key);
});

/** Listen for forwarded event messages */
window.addEventListener("message", evt => {
  if (evt.origin !== "https://gdcvault.com"
      && evt.origin !== "https://www.gdcvault.com"
      && evt.origin !== "https://gdcvault.blazestreaming.com")
    return;

  DispatchAction(evt.data);
}, false);


function DispatchAction (binding) {
  if (isIframe) {
    if (BindingsKeys[binding] === undefined)
      return;

    BindingsKeys[binding].action.execute().then(()=> {
      if (BindingsKeys[binding].action.osd !== undefined)
        OSD(BindingsKeys[binding].action.osd);
    });
  } else {
    switch (binding) {
      case "ToggleDarkMode":
        ToggleDarkMode();
        break;
      case "Fullscreen":
        // Fullscreen needs to be applied to the iframe (container)
        Fullscreen();
        break;
      default:
        DispatchToIframe(binding);
    }
  }
}


function DispatchToIframe (binding) {
  if (isVideoContent)
    iframeEl.contentWindow.postMessage(binding, "https://gdcvault.blazestreaming.com/");
}

function DispatchToParent (binding) {
  if (self === top) // return if parent is this (i.e. not in iframe or iframe content without parent)
    return false;
  parent.postMessage(binding, "https://gdcvault.com");
  parent.postMessage(binding, "https://www.gdcvault.com");
  return true;
}

/*
 * Action functions
 */


let playFailed = false;
let initialPlay = true;
function Pause () {
  initialPlay = false;
  return new Promise((resolve, reject) => {
    if (player.paused()) {
      player.play().then(() => {
        playFailed = false;
        //OSD("Play");
        resolve();
      }).catch((error) => {
        // play failed, likely due to autoplay restrictions (hi chrome)
        playFailed = true;
        ResetPlayerHasStarted();
        reject();
      });
    } else {
      player.pause();
      //OSD("Pause");
      resolve();
    }
  });
}

function Mute () {
  return new Promise((resolve, reject) => {
    player.muted(!player.muted());
    resolve();
  });
}

function Seek (offset) {
  return new Promise((resolve, reject) => {
    player.currentTime(player.currentTime() + offset);
    resolve();
  });
}

function Volume (offset) {
  return new Promise((resolve, reject) => {
    if (player.muted())
      Mute();

    player.volume(player.volume() + offset);
    volume = player.volume();
    localStorage.setItem(`${videoId}-volume`, volume);
    resolve();
  });
}

let audioChannelMode = 0;
function CycleMonoStereo () {
  return new Promise((resolve, reject) => {
    audioChannelMode++;
    if (audioChannelMode > 2)
      audioChannelMode = 0;

    if (!usingAudioContext)
      InitializeAudioContext();

    if (audioContext.state !== "running")
      audioContext.resume();

    try {
      audioSplitter.disconnect(audioMerger);
    } catch (e) {}

    switch (audioChannelMode) {
      case 0: // stereo
        audioSplitter.connect(audioMerger, 0, 0);
        audioSplitter.connect(audioMerger, 1, 1);
        resolve();
        break;
      case 1: // mono, left channel
        audioSplitter.connect(audioMerger, 0, 0);
        audioSplitter.connect(audioMerger, 0, 1);
        resolve();
        break;
      case 2: // mono, right channel
        audioSplitter.connect(audioMerger, 1, 0);
        audioSplitter.connect(audioMerger, 1, 1);
        resolve();
        break;
    }
  });
}


function Fullscreen () {
  return new Promise((resolve, reject) => {
    if (isIframe) {
      if (player.isFullscreen()) {
        player.exitFullscreen();
        resolve();
        return;
      }

      if (DispatchToParent("Fullscreen")) {
        resolve();
        return;
      }

      player.isFullscreen() ? player.exitFullscreen() : player.requestFullscreen();
    }
    else {
      iframeIsFullscreen ? document.exitFullscreen() : iframeEl.requestFullscreen();
    }
    resolve();
  });
}

function PlaybackRate (direction) {
  return new Promise((resolve, reject) => {
    if (direction === 0) {
      playbackRate = 1.0;
      player.playbackRate(1);
      resolve();
      return;
    }
    const rates = player.playbackRates();
    const newIndex = Math.min(rates.length-1, Math.max(0, rates.indexOf(player.playbackRate())+direction));
    playbackRate = rates[newIndex];
    player.playbackRate(playbackRate);
    localStorage.setItem(`${videoId}-playbackRate`, player.playbackRate());
    resolve();
  });
}

function SeekFrame (frameOffset) {
  return new Promise((resolve, reject) => {
    player.pause();
    Seek(frameDuration * frameOffset);
    resolve();
  });
}

function ToggleSubtitles () {
  return new Promise((resolve, reject) => {
    if (SubsAreVisible()) {
      player.textTrackDisplay.hide();
      localStorage.setItem(`${videoId}-showSubtitles`, false);
    } else {
      player.textTrackDisplay.show();
      localStorage.setItem(`${videoId}-showSubtitles`, true);
    }
    resolve();
  });
}

function CycleSubtitles () {
  return new Promise((resolve, reject) => {
    if (subtitles.length === 0) {
      reject();
      return;
    }

    if (subtitles[currentSubtitle] === undefined && subtitles.length <= 1) {
      reject();
      return;
    }

    if (!SubsAreVisible())
      ToggleSubtitles();

    if (subtitles[currentSubtitle] !== undefined)
      subtitles[currentSubtitle].mode = 'disabled';

    let hangCheck = 0;
    while (hangCheck < 100) {
      currentSubtitle++;
      if (currentSubtitle >= subtitles.length)
        currentSubtitle = 0;
      hangCheck++;
      if (subtitles[currentSubtitle].kind === "subtitles" || subtitles[currentSubtitle].kind === "captions")
        break;
    }
    subtitles[currentSubtitle].mode = 'showing';
    localStorage.setItem(`${videoId}-subtitlesTrack`, subtitles[currentSubtitle].language);
    resolve();
  });
}

function ToggleModal () {
    return new Promise((resolve, reject) => {
      shortcutsModal.el().classList.contains("vjs-hidden") ? shortcutsModal.open() : shortcutsModal.close();
      resolve();
    });
}

function ToggleDarkMode () {
  return new Promise((resolve, reject) => {
    if (isIframe) {
      isDarkMode = !isDarkMode;
      localStorage.setItem("vpe-darkmode", isDarkMode);
      darkModeButton.$('.vjs-icon-placeholder').textContent = isDarkMode ? "\u{263C}" : "\u{2600}";
      DispatchToParent("ToggleDarkMode");
    } else {
      document.documentElement.classList.toggle("dark");
    }
    resolve();
  });
}

function OSD (content) {
  switch (typeof content) {
    case "string":
      DisplayOnOSD(content);
      break;
    case "function":
      DisplayOnOSD(content());
      break;
  }
}

let osdTimeout = -1;
function DisplayOnOSD (text) {
  osdModal.contentEl().textContent = text;
  osdModal.show();
  clearTimeout(osdTimeout);
  osdTimeout = setTimeout(HideOSD, 700);
}

function HideOSD () {
  osdModal.hide();
}


/*
 * Initialization & utils
 */

// LocalStorage settings
const playbackTime = isIframe ? parseFloat(localStorage.getItem(`${videoId}-time`) ?? 0.0) : null;
let volume = isIframe ? parseFloat(localStorage.getItem(`${videoId}-volume`) ?? -1.0) : -1.0;
let playbackRate = isIframe ? parseFloat(localStorage.getItem(`${videoId}-playbackRate`) ?? 1.0) : null;
let showSubtitles = isIframe ? (localStorage.getItem(`${videoId}-showSubtitles`) === 'true' ? true : false) : null;
let subtitlesTrack = isIframe ? localStorage.getItem(`${videoId}-subtitlesTrack`) : null;
let isDarkMode = isIframe ? (localStorage.getItem("vpe-darkmode") === "true" ? true : false) : null;


let hasRestoredPlaybackTime = false;

if (!isIframe && isDarkMode) {
  isDarkMode = false;
  ToggleDarkMode();
}

if (isIframe) {
  window.addEventListener("load", evt => {
    // restore playback position
    videojs("my-video").on("loadeddata", function(){
      RestorePlaybackTime();
      RestoreVolume();
      RestorePlaybackRate();
      OverrideFullscreenButton();
      AddDarkModeButton();
      AddShortcutsMenu();
      InitSubtitles();
      InitOSD();
      if (isDarkMode) {
        isDarkMode = false;
        ToggleDarkMode();
      }
    });

    videojs("my-video").on("play", evt =>{
      if (!initialPlay)
          return;
      Pause();
      ResetPlayerHasStarted();
      player.muted(false);
    });

    // Auto-save playback position every second
    setInterval(function () {
      if (!hasRestoredPlaybackTime)
          return;
      localStorage.setItem(`${videoId}-time`, player.currentTime());
    }, 1000);
  });
}


let osdModal = {};
let osdTimeDisplay = {};
function InitOSD () {
  videojs.registerComponent("OSDModal", videojs.extend(videojs.getComponent("ModalDialog")));
  osdModal = player.addChild("OSDModal", {
    label: "OSD",
    content: "OSD",
    pauseOnOpen: false,
    temporary: false,
    uncloseable: true,
    className: "OSD"
  });
  videojs.registerComponent("OSDTimeDisplay", videojs.extend(videojs.getComponent("TimeDisplay")));
  osdTimeDisplay = player.addChild("OSDTimeDisplay");
}


// API https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
var audioContext, audioSplitter, audioMerger, audioMediasource;
var usingAudioContext = false;
function InitializeAudioContext () {
  audioContext = new AudioContext();
  audioSplitter = audioContext.createChannelSplitter(2);
  audioMerger = audioContext.createChannelMerger(2);
  audioMediasource = audioContext.createMediaElementSource(player.$('video'));
  audioMediasource.connect(audioSplitter);
  audioSplitter.connect(audioMerger, 0, 0);
  audioSplitter.connect(audioMerger, 1, 1);
  audioMerger.connect(audioContext.destination);
  usingAudioContext = true;
}

function RestorePlaybackTime () {
  if (playbackTime === null)
    return;
  player.currentTime(playbackTime);
  hasRestoredPlaybackTime = true;
}

function RestoreVolume () {
  if (volume < 0.0)
    return;
  player.volume(volume);
}

function RestorePlaybackRate () {
  if (playbackRate === null) {
    playbackRate = 1.0;
    return;
  }
  const rates = player.playbackRates();
  const newIndex = Math.min(rates.length-1, Math.max(0, rates.indexOf(playbackRate)));
  playbackRate = rates[newIndex];
  player.playbackRate(playbackRate);
}

function OverrideFullscreenButton () {
  const fullscreenToggle = player.controlBar.getChild("FullscreenToggle");
  fullscreenToggle.handleClick = (evt => {
    window['playerActionShurtcuts'].actions.Fullscreen();
  });
  fullscreenToggle.handleKeyDown = ()=>{};
}


let iframeIsFullscreen = false;
if (!isIframe)
  iframeEl.addEventListener("fullscreenchange", evt => {
      iframeIsFullscreen = document.fullscreenElement !== null;
  });

let currentSubtitle = -1;
let subtitles = {};
function InitSubtitles () {
  subtitles = player.textTracks();
  let savedTrack = -1;
  for (let i = 0; i < subtitles.length; i++) {
    const track = subtitles[i];

    // find saved track
    if (subtitlesTrack !== null && subtitlesTrack === track.language)
      savedTrack = i;

    if (track.mode !== 'showing')
      continue;

    currentSubtitle = i;
  }
  if (savedTrack !== -1 && savedTrack !== currentSubtitle) {
    if (subtitles[currentSubtitle] !== undefined)
      subtitles[currentSubtitle].mode = 'disabled';
    subtitles[savedTrack].mode = 'showing';
    currentSubtitle = savedTrack;
  }

  if (!showSubtitles)
    player.textTrackDisplay.hide();
  else
    player.textTrackDisplay.show();
}

function SubsAreVisible () {
  return !player.textTrackDisplay.el().classList.contains('vjs-hidden');
}


let darkModeButton = {};
function AddDarkModeButton () {
  videojs.registerComponent("DarkModeButton", videojs.extend(videojs.getComponent("Button")));
  darkModeButton = player.controlBar.addChild("DarkModeButton", {className:"darkmode"}, 99);

  darkModeButton.controlText("Toggle Dark Mode");
  darkModeButton.$('.vjs-icon-placeholder').textContent = "\u{2600}";

  darkModeButton.handleClick = (evt => {
    ToggleDarkMode();
  });
  darkModeButton.handleKeyDown = () => {};
}


function ResetPlayerHasStarted () {
  player.hasStarted(false);
}


let shortcutsMenuButton;
let shortcutsModal = null;
function AddShortcutsMenu () {
  videojs.registerComponent("ShortcutsButton", videojs.extend(videojs.getComponent("Button")));
  shortcutsMenuButton = player.controlBar.addChild("ShortcutsButton", {className: "shortcuts-help"}, 99);
  shortcutsMenuButton.controlText("Shortcuts Help");
  shortcutsMenuButton.$('.vjs-icon-placeholder').textContent = "?";

  /* Loop through action bindings and generate markup */
  let shortcutsElements = document.createElement("div");
  Object.keys(Actions).forEach(action => {
    let row = document.createElement("div");
    row.classList.add("row");

    let actionName = document.createElement("div");
    actionName.classList.add("action");
    actionName.textContent = Actions[action].name;//ActionNames[action];
    row.appendChild(actionName);

    let binding = document.createElement("div");
    binding.classList.add("binding");
    const keys = Object.keys(Actions[action].keys);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      let keyEl = document.createElement('span');
      keyEl.classList.add('key');
      keyEl.textContent = key === ' ' ? 'Space' : key;
      binding.appendChild(keyEl);
      if (i >= keys.length - 1)
        continue;
      let orEl = document.createElement('span');
      orEl.textContent = "or";
      binding.appendChild(orEl);
    }
    row.appendChild(binding);

    shortcutsElements.appendChild(row);
  });

  let supportLinks = document.createElement("div");
  supportLinks.classList.add("support-links");
  let versionInfo = "";
  try {
    versionInfo = GM_info.script.version;
  } catch(e) {}
  supportLinks.innerHTML = `GDC Vault Player Extended ${versionInfo}
  <a href="https://github.com/Level3Manatee/GDCVaultPlayerExtended">GitHub</a> |
  <a href="https://greasyfork.org/en/scripts/501309-gdc-vault-player-extended">GreasyFork</a>`;
  shortcutsElements.appendChild(supportLinks);

  videojs.registerComponent("ShortcutsModal", videojs.extend(videojs.getComponent("ModalDialog")))
  shortcutsModal = player.addChild("ShortcutsModal", {
    label: "Shortcuts Help",
    content: shortcutsElements,
    pauseOnOpen: false,
    temporary: false,
    className: "shortcuts-help"
  });

  shortcutsModal.el().addEventListener('click', evt => {
    shortcutsModal.close();
  });

  shortcutsMenuButton.handleClick = (evt => {
    shortcutsModal.open();
  });

  // override default handler, since it eats all keyboard input after clicking fullscreen
  shortcutsMenuButton.handleKeyDown = () => {};
  shortcutsModal.handleKeyDown = () => {};
}


/*
 * CSS
 */
function AddStyle () {
  const styleEl = document.createElement("style");
  const vaultStyle = `
html {
  --text-color-grey: hsl(0, 0%, 60%);
}

.text-color-grey {
  color: var(--text-color-grey);
}

.wrapper {
    max-width: none;
    width: min-content;
}

.wrapper > nav,
.wrapper #player {
    width: min(90vw, calc(90vh * (16 / 9)));
}

.wrapper #player {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.wrapper #player > :not(.left_column),
.wrapper #player .left_column .overview-section {
    width: 100%;
    max-width: min(60rem, 100%);
}

.wrapper #player .left_column {
    width: 100%;
}

.wrapper #player .left_column .overview-section {
    float: none;
    margin: 0 auto;
}

@media screen and (min-width: 768px) {
    .overview-section dt,
    .player-info dt {
        width: 20%;
        clear: left;
    }
}

.wrapper #player .right_column,
#studio-subscription {
    margin-left: 0;
}

html.dark {
  --dark-bg: hsl(0, 0%, 17%);
  --text-color-grey: hsl(0, 0%, 70%);
  --color-dim: 0.75;
  background-color: hsl(247.7, 38.6%, calc(39.6% * var(--color-dim) * 0.75));
}

html.dark body {
  background: none;
}

html.dark body::after {
  content: "";
  position: absolute;
  display: block;
  top: 0; right: 0; bottom: 0; left: 0;
  z-index: -1;
  background: url(https://www.gdcvault.com/img/bg.png);
  filter: brightness(calc(var(--color-dim) * 0.75));
}

html.dark #iribbon-container,
html.dark footer {
  filter: brightness(var(--color-dim));
}

html.dark header, html.dark .wrapper {
  background: var(--dark-bg);
}

html.dark .wrapper {
  border-color: var(--dark-bg);
}

.wrapper > nav,
#load_recommended_videos {
  filter: brightness(var(--color-dim));
}

html.dark .logo-block {
  filter: brightness(1.33);
}

html.dark .site-header #searchForm {
  background-color: hsl(58, calc(100% * var(--color-dim)), calc(48% * var(--color-dim)));
}

html.dark .site-header input#vault_keyword_search {
  background-color: var(--dark-bg);
  color: white;
}

html.dark :is(a, dl:is(.player-info, .overview-section, .video-details) :is(dd, dd strong, dt, dt strong)) {
  color: var(--text-color-grey);
}

html.dark #studio-subscription {
  border-color: var(--text-color-grey);
  color: var(--text-color-grey);
}

html.dark :is(ul#tags, #player #recommended img) {
  filter: invert(1) hue-rotate(180deg);
}

html.dark #player #recommended img {
  background: none;
}

html.dark #player #recommended #header h3,
html.dark #player #recommended {
  color: var(--text-color-grey);
  background: var(--dark-bg);
}`;

  const iFrameStyle = `
body {
    margin: 0;
}

/* hide the unmute thing */
#playerContainer > button {
  display: none;
}

.vjs-modal-dialog.OSD {
  display: flex;
  background: none;
  justify-content: center;
  align-content: center;
}

.vjs-modal-dialog.OSD .vjs-modal-dialog-content {
  position: static;
  display: inline-block;
  width: auto;
  height: auto;
  margin: auto;
  padding: 0 1em;
  border-radius: 0.5em;
  background: hsla(0, 0%, 16.9%, 0.8);
  color: hsl(0, 0%, 80%);
  font-size: 1.5cqi;
  font-weight: bold;
  text-align: center;
  line-height: 3;
}

.video-js .vjs-control-bar {
  display: flex;
}

.video-js.vjs-playing:not(.vjs-user-active) .vjs-control-bar {
  opacity: 0;
}

.video-js.vjs-has-started .vjs-big-play-button {
    opacity: 0;
    transition: opacity 0s;
    pointer-events: none;
    display: block;
}

.video-js.vjs-has-started.vjs-paused .vjs-big-play-button {
    display: block;
    opacity: 1;
    transition: opacity 0.25s 0.75s;
}

.vjs-control-bar button.shortcuts-help,
.vjs-control-bar button.darkmode {
  font-size: 1.5em;
  cursor: pointer;
  width: 2.5em;
}

.vjs-modal-dialog.shortcuts-help {
  font-size: min(1rem, ${50 / Object.keys(Actions).length}cqh);
}

.vjs-modal-dialog.shortcuts-help .vjs-modal-dialog-content {
  display: flex;
}

.vjs-modal-dialog.shortcuts-help .vjs-modal-dialog-content > div {
  margin: auto;
  background: black;
  padding: 2em;
}

.vjs-modal-dialog.shortcuts-help .row {
  display: flex;
  gap: 1em;
}

.vjs-modal-dialog.shortcuts-help .action {
  width: 30ch;
  text-align: right;
  align-self: center;
}

.vjs-modal-dialog.shortcuts-help .binding span {
  display: inline-block;
  height: 2em;
  padding: 0.25em;
}

.vjs-modal-dialog.shortcuts-help .binding .key {
  margin: 0.25em;
  padding: 0.25em 0.75em;
  border: 1px solid white;
  border-radius: 0.1em;
  min-width: 2ch;
}

.shortcuts-help .support-links {
  border-top: 1px solid white;
  margin-top: 0.5em;
  padding-top: 0.5em;
}

.shortcuts-help .support-links a {
  color: white;
}`;
  if (isIframe)
    styleEl.textContent = iFrameStyle;
  else
    styleEl.textContent = vaultStyle;
  document.body.appendChild(styleEl);
}

AddStyle();
