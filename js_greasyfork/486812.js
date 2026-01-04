// ==UserScript==
// @name     RedGIFs iframe Sound Helper
// @description    Provide facilities to automatically enable RedGIFs audio in embedded iframes, and for communication regarding audio controls between the the hosting site and the iframe.
// @license public domain
// @version  1.4.1
// @grant    none
// @include  https://www.redgifs.com/ifr/*
// @namespace https://greasyfork.org/users/1258441
// @downloadURL https://update.greasyfork.org/scripts/486812/RedGIFs%20iframe%20Sound%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/486812/RedGIFs%20iframe%20Sound%20Helper.meta.js
// ==/UserScript==

const SOUND_DEFAULT = false; // false = off, true = on
const LINK_DEFAULT = true; // false = link removed, true = link remains

const urlParams = new URLSearchParams(window.location.search);

function waitForElm(selector) {
  // Lovingly stolen from Yong Wang and sashaolm on StackOverflow
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }
    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

function toBoolean(argument) {
  if (argument === "true" || argument === "yes" || argument === "on" || argument === "1") {
    return true;
  }
  if (argument === "false" || argument === "no" || argument === "off" || argument === "0") {
    return false;
  }
  return undefined; // I could probably do this implicitly...
}

// Quick and dirty function to click an arbitrary element—not sure if elm.click() would work better?
var click = function(elm) {
  var clickEvent = new MouseEvent("click", {
    "bubbles": true,
    "cancelable": false,
    "view": window
  });
  elm.dispatchEvent(clickEvent);
};

// Facilities for enabling or disabling click-to-open link on the video
var saved_link = null;

function disableHyperLink(hyperlink) {
  if (hyperlink.tagName !== "A") {
    return;
  }
  if (saved_link === null) {
    saved_link = hyperlink.href;
  }
  hyperlink.href = "javascript: void(0)";
  hyperlink.target = "_self";
}

function enableHyperLink(hyperlink) {
  if (hyperlink.tagName !== "A" || saved_link === null) {
    return;
  }
  hyperlink.href = saved_link;
  hyperlink.target = "_blank";
}

// Facilities for turning looping on and off

var video_end_listener = (event) => window.parent.postMessage("gfy_ended", "*")

function disableLoop(video) {
  if (video.tagName !== "VIDEO") {
    return;
  }
  video.removeAttribute("loop");
  video.addEventListener("ended", function(event) {window.dispatchEvent(event);});
  video.addEventListener("ended", video_end_listener);
}

function enableLoop(video) {
  if (video.tagName !== "VIDEO") {
    return;
  }
  video.setAttribute("loop", "");
  video.removeEventListener("ended", video_end_listener);
}

// Setup configuration
const query_sound = toBoolean(urlParams.get("sound"));
const query_link = toBoolean(urlParams.get("link"));
const query_loop = toBoolean(urlParams.get("loop"));
const hash = window.location.hash;

var autoenable_sound = undefined;
var autodisable_link = undefined;
var autodisable_loop = undefined;

// Figure out whether to enable sound
if (query_sound === true) {
  autoenable_sound = true;
}
else if (query_sound === false) { // do nothing if it's undefined
  autoenable_sound = false;
}

if (window.location.hash === "#sound") {
  autoenable_sound = true;
}
else if (window.location.hash === "#nosound") {
  autoenable_sound = false;
}

if (autoenable_sound === undefined) {
  autoenable_sound = SOUND_DEFAULT;
}

// Figure out whether to disable the link
if (query_link === true) {
  autodisable_link = false;
}
else if (query_link === false) {
  autodisable_link = true;
}

if (autodisable_link === undefined) {
  autodisable_link = !LINK_DEFAULT;
}

// Figure out whether to disable looping
autodisable_loop = !query_loop; // loop should be ON by default

// Execute the above settings
if (autoenable_sound) {
  waitForElm(".soundOff").then(click);
}

if (autodisable_link) {
  waitForElm(".videoLink").then(disableHyperLink)
}

if (autodisable_loop) {
  waitForElm("video").then(disableLoop);
}

window.parent.postMessage("gfy_enhanced_api", "*");

// For communication with the parent window
window.onmessage = function(message) {
  const soundButton = document.querySelector(".soundOff") || document.querySelector(".soundOn");
  const loaded = soundButton !== null;

  switch (message.data) {
    case "soundOn":
      /* If the page is not loaded yet and sound will be off when it loads, wait for it to load then click .soundOff
       * If the page is not loaded yet and sound will be on when it loads, do nothing
       * If the page is loaded, look for .soundOff and click if present
       *
       * I worked it out, this is the only way to make it work.
       */
      if (loaded) {
        let button = document.querySelector(".soundOff");
        if (button !== null)
          click(button);
      }
      else if (!autoenable_sound)
        waitForElm(".soundOff").then(click);
      break;

    case "soundOff":
      /* If the page is not loaded yet and sound will be off when it loads, do nothing
       * If the page is not loaded yet and sound will be on when it loads, wait for it to load then click .soundOn
       * If the page is loaded, look for .soundOn and click if present
       */
      if (loaded) {
        let button = document.querySelector(".soundOn");
        if (button !== null)
          click(button);
      }
      else if (autoenable_sound)
        waitForElm(".soundOff").then(click);
      break;

    case "soundToggle":
      click(soundButton);
      break;

    case "linkOff":
      waitForElm(".videoLink").then(disableHyperLink);
      break;

    case "linkOn":
      waitForElm(".videoLink").then(enableHyperLink);
      break;

    case "loopOff":
      waitForElm("video").then(disableLoop);
      break;

    case "loopOn":
      waitForElm("video").then(enableLoop);
      break;

    case "pause":
      waitForElm("video").then((vid) => vid.pause());
      break;

    case "play":
      waitForElm("video").then((vid) => vid.play());
      break;

    default:
      console.error("Unknown command " + message.data);
  }
}