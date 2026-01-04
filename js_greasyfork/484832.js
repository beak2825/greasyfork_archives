// ==UserScript==
// @name                Buttercup
// @namespace           http://tampermonkey.net/
// @version             0.0.24
// @description         Replace YouTube auto captions with OpenAI Whisper-generated ones
// @include	            *://youtube.com/*
// @include	            *://*.youtube.com/*
// @grant               none
// @run-at              document-start
// @license             GPL-3
// @downloadURL https://update.greasyfork.org/scripts/484832/Buttercup.user.js
// @updateURL https://update.greasyfork.org/scripts/484832/Buttercup.meta.js
// ==/UserScript==

// I apologize in advance to whoever is paying for the API calls. But it's public, and there's an API, so I'm using it. I hope I'm defrauding some massive corporation and not some poor soul.
// Due to how I am injecting the custom subtitles, the only way this works is if the video already has auto captions. If it doesn't, IDK how to inject them.

const BUTTON_CLASSNAME = "ytp-subtitles-button ytp-button";

// Thank you sam herbert https://github.com/SamHerbert/SVG-Loaders, modified to fit the button
const SVG_LOADER = `<svg height=100% viewBox="0 0 36 36"width=100% xmlns=http://www.w3.org/2000/svg><defs><linearGradient id=a x1=8.042% x2=65.682% y1=0% y2=23.865%><stop offset=0% stop-color=#fff stop-opacity=0 /><stop offset=63.146% stop-color=#fff stop-opacity=.631 /><stop offset=100% stop-color=#fff /></linearGradient></defs><g fill=none fill-rule=evenodd><g transform="translate(1 1)"><path d="M26 18c0-4.418-3.582-8-8-8"id=Oval-2 stroke=url(#a) stroke-width=4><animateTransform attributeName=transform dur=0.9s from="0 18 18"repeatCount=indefinite to="360 18 18"type=rotate /></path><circle cx=26 cy=18 fill=#fff r=1><animateTransform attributeName=transform dur=0.9s from="0 18 18"repeatCount=indefinite to="360 18 18"type=rotate /></circle></g></g></svg>`;
const SVG_CAPTIONS = `<svg class="ytp-subtitles-button-icon" height="100%" version="1.1" viewBox="0 0 36 36" width="100%" fill-opacity="1"><use class="ytp-svg-shadow" xlink:href="#ytp-id-17"></use><path d="M11,11 C9.89,11 9,11.9 9,13 L9,23 C9,24.1 9.89,25 11,25 L25,25 C26.1,25 27,24.1 27,23 L27,13 C27,11.9 26.1,11 25,11 L11,11 Z M17,17 L15.5,17 L15.5,16.5 L13.5,16.5 L13.5,19.5 L15.5,19.5 L15.5,19 L17,19 L17,20 C17,20.55 16.55,21 16,21 L13,21 C12.45,21 12,20.55 12,20 L12,16 C12,15.45 12.45,15 13,15 L16,15 C16.55,15 17,15.45 17,16 L17,17 L17,17 Z M24,17 L22.5,17 L22.5,16.5 L20.5,16.5 L20.5,19.5 L22.5,19.5 L22.5,19 L24,19 L24,20 C24,20.55 23.55,21 23,21 L20,21 C19.45,21 19,20.55 19,20 L19,16 C19,15.45 19.45,15 20,15 L23,15 C23.55,15 24,15.45 24,16 L24,17 L24,17 Z" fill="#fff" id="ytp-id-17"></path></svg>`;
const SVG_TRANSLATE = `<?xml version="1.0" encoding="utf-8"?><svg fill="#fff" width="800px" height="800px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg"><path d="M235.57178,214.21094l-56-112a4.00006,4.00006,0,0,0-7.15528,0l-22.854,45.708a92.04522,92.04522,0,0,1-55.57275-20.5752A99.707,99.707,0,0,0,123.90723,60h28.08691a4,4,0,0,0,0-8h-60V32a4,4,0,0,0-8,0V52h-60a4,4,0,0,0,0,8h91.90772a91.74207,91.74207,0,0,1-27.91895,62.03357A91.67371,91.67371,0,0,1,65.23389,86.667a4,4,0,0,0-7.542,2.668,99.63009,99.63009,0,0,0,24.30469,38.02075A91.5649,91.5649,0,0,1,23.99414,148a4,4,0,0,0,0,8,99.54451,99.54451,0,0,0,63.99951-23.22461,100.10427,100.10427,0,0,0,57.65479,22.97192L116.4165,214.21094a4,4,0,1,0,7.15528,3.57812L138.46631,188H213.522l14.89453,29.78906a4,4,0,1,0,7.15528-3.57812ZM142.46631,180l33.52783-67.05566L209.522,180Z"/></svg>`;

let TRANSLATE = localStorage.getItem("bettercup_translate") === "true" || false;

const escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
  createHTML: (to_escape) => to_escape
});

(function () {
  'use strict';
  console.info("[Buttercup] Initializing");

  injectConfig();

  let customSubtitle = null;
  // MutationObserver to detect moving between videos
  const observer = new MutationObserver(function () {
    if (location.href !== currentURL) {
      console.info("[Buttercup] URL changed, resetting custom subtitles");
      customSubtitle = null;
      setLoading(false);
      currentURL = location.href;
    }
  });

  let currentURL = location.href;
  observer.observe(document, { childList: true, subtree: true });

  const OriginalXMLHttpRequest = window.XMLHttpRequest;

  function CustomXMLHttpRequest() {
    const xhr = new OriginalXMLHttpRequest();
    // time to do a live brain operation on the expected response. we will later need to click the subtitle button to re-fetch the subtitles
    Object.defineProperty(xhr, "responseText", {
      get: function () {
        // timedtext is the endpoint for all subtitles
        if (this.responseURL.includes('/api/timedtext') && isPlayer()) {
          // therefore if url param "kind" is not equal to "asr" (automatic subtitles) return as it's probably proper subtitles
          const urlParams = new URLSearchParams(this.responseURL);
          if (urlParams.get('kind') !== 'asr') {
            console.info("[Buttercup] Not automatic subtitles, passing through");
            return this.response;
          }
          if (customSubtitle === null) {
            console.info("[Buttercup] Getting custom subtitles");
            clickSubtitleButton();
            setLoading(true);

            let headers = {
              'BC-VideoID': getVideoId()
            }

            if (TRANSLATE) {
              headers['BC-Translate'] = 'true'
              console.info("[Buttercup] Requesting translated subtitles");
            }

            // Fetch subtitles from cache if available
            fetch('https://buttercup.igerman.cc/', {
              headers: headers
            })
              .then(response => {
                if (response.status === 200) {
                  console.info("[Buttercup] Using cached subtitles");
                  setLoading(false);
                  clickSubtitleButton();
                  return response.json();
                } else {
                  console.info("[Buttercup] Getting subtitles from HF");
                  getSubtitles();
                }
              })
              .then(data => {
                customSubtitle = data.c;
              })
              .catch(error => {
                console.error("[Buttercup] Error fetching subtitles: ", error);
              });
          }
          return customSubtitle;
        }
        return this.response;
      }
    });

    return xhr;
  }

  function getSubtitles() {
    // Thanks to sanchit-gandhi and their Huggingface space for the whisper-jax API!
    fetch("https://sanchit-gandhi-whisper-jax.hf.space/api/predict_2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: [window.location.href, TRANSLATE ? "translate" : "transcribe", true]
      })
    })
      .then(response => response.json())
      .then(data => {
        // data.data[0] is a youtube iframe
        const took = data.data[2]; // returns time taken in seconds, doesn't account for initialization, only transcription
        const subtitles = data.data[1]; // just a string
        console.info("[Buttercup] Got custom subtitles in " + took + "s");
        customSubtitle = JSON.stringify(customFormatToJson(subtitles));

        let headers = {
          'Content-Type': 'application/json',
          'BC-VideoID': getVideoId()
        }

        if (TRANSLATE) {
          headers['BC-Translate'] = 'true'
        }

        // Cache subtitles
        fetch('https://buttercup.igerman.cc/', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            id: getVideoId(),
            captions: customSubtitle
          })
        })
          .then(response => {
            if (response.status === 200) {
              console.info("[Buttercup] Subtitles cached");
            } else {
              console.error("[Buttercup] Error caching subtitles: ", response.status);
            }
          })
          .catch(error => {
            console.error("[Buttercup] Error caching subtitles: ", error);
          });
      })
      .catch(error => {
        setLoading(false, true)
        // it often errors with a 500 because yt-dlp fails on the backend, it should just retry
        // retrying on error is a bug btw and it will hammer the api but now its a feature YAY
        console.error('Error:', error)
      })
      .finally(() => {
        setLoading(false)
        clickSubtitleButton();
      });
  }

  function customFormatToJson(subtitleContent) {
    console.log("[Buttercup] Converting custom format to JSON")
    // Whisper-JAX, or at least the huggingface space, returns subtitles in a custom format that's not even SRT, disgusting fortune, time to parse
    // YouTube expects a completely different format of its own, they call it "json3", we'll convert to that right away

    const subtitleBlocks = subtitleContent.split('\n');
    const jsonSubtitles = { events: [] };

    // insert newlines into text at the nearest space if it's longer than 64 characters
    function insertNewlines(text) {
      let newText = '';
      let lineLength = 0;

      text.split(' ').forEach(word => {
        if (lineLength + word.length <= 64) {
          newText += ' ' + word;
          lineLength += word.length + 1; // +1 for the space
        } else {
          newText += '\n' + word;
          lineLength = word.length;
        }
      });

      return newText.trim();
    }

    subtitleBlocks.forEach(block => {
      const timeTextSplit = block.split('] ');
      const timeRange = timeTextSplit[0].replace('[', '').split(' -> ');
      const startTime = customTimeToMs(timeRange[0]);
      const endTime = customTimeToMs(timeRange[1]);
      const text = timeTextSplit[1].trim();

      // Insert newlines into the text
      const newText = insertNewlines(text);

      jsonSubtitles.events.push({
        tStartMs: startTime,
        dDurationMs: endTime - startTime,
        segs: [{ utf8: newText }]
      });
    });

    return jsonSubtitles;
  }

  function customTimeToMs(timeStr) {
    if (!timeStr || !timeStr.includes(":")) return 0;
    const [hoursMinSec, milli] = timeStr.split('.');
    // example: 15:22 570, if hours then 01:15:22 570
    // idk if it messes up with hours, i hope not i havent tested
    const hours = hoursMinSec.length > 5 ? hoursMinSec.split(':')[0] : 0;
    const minutes = hoursMinSec.length > 5 ? hoursMinSec.split(':')[1] : hoursMinSec.split(':')[0];
    const seconds = hoursMinSec.length > 5 ? hoursMinSec.split(':')[2] : hoursMinSec.split(':')[1];
    const milliseconds = milli || 0;
    return parseInt(hours) * 3600000 + parseInt(minutes) * 60000 + parseInt(seconds) * 1000 + parseInt(milliseconds);
  }

  function clickSubtitleButton() {
    document.getElementsByClassName(BUTTON_CLASSNAME)[0].click()
  }

  function setLoading(isLoading, error) {
    const element = document.getElementsByClassName(BUTTON_CLASSNAME)[0]
    if (error) {
      element.disabled = false;
      element.innerHTML = SVG_CAPTIONS;
    }
    element.disabled = isLoading
    element.innerHTML = isLoading ? SVG_LOADER : SVG_CAPTIONS;
  }

  function injectConfig() {
    const observer = new MutationObserver(function (mutationsList, observer) {
      const menu = document.getElementsByClassName("ytp-panel-menu")[0];
      if (menu) {
        console.info("[Buttercup] Found menu, inserting config");
        observer.disconnect();

        const menuItem = document.createElement("div");
        menuItem.classList.add("ytp-menuitem");
        menuItem.setAttribute("role", "menuitemcheckbox");
        menuItem.setAttribute("aria-checked", TRANSLATE);
        menuItem.setAttribute("tabindex", "0");

        const menuItemIcon = document.createElement("div");
        menuItemIcon.classList.add("ytp-menuitem-icon");
        menuItemIcon.innerHTML = escapeHTMLPolicy.createHTML(SVG_TRANSLATE);

        const menuItemLabel = document.createElement("div");
        menuItemLabel.classList.add("ytp-menuitem-label");
        menuItemLabel.innerHTML = escapeHTMLPolicy.createHTML("Buttercup - Translate to English");

        const menuItemContent = document.createElement("div");
        menuItemContent.classList.add("ytp-menuitem-content");

        const menuItemToggle = document.createElement("div");
        menuItemToggle.classList.add("ytp-menuitem-toggle-checkbox");

        menuItemContent.appendChild(menuItemToggle);
        menuItem.appendChild(menuItemIcon);
        menuItem.appendChild(menuItemLabel);
        menuItem.appendChild(menuItemContent);

        menu.appendChild(menuItem);

        menuItem.addEventListener("click", function () {
          TRANSLATE = !TRANSLATE;
          localStorage.setItem("bettercup_translate", TRANSLATE);
          menuItem.setAttribute("aria-checked", TRANSLATE);
        });
      }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  function getVideoId() {
    const urlObject = new URL(window.location.href);
    const pathname = urlObject.pathname;
    if (pathname.startsWith("/clip")) {
      return document.querySelector("meta[itemprop='videoId']").content;
    } else {
      if (pathname.startsWith("/shorts")) {
        return pathname.slice(8);
      }
      return urlObject.searchParams.get("v");
    }
  }

  // need to tell if we're in the player or not
  function isPlayer() {
    return document.location.pathname === "/watch"; //todo: better way to do this, otherwise the stupid miniplayer requests subtitles
  }


  // lobotomize and plant gay thoughts to xmlhttprequest
  window.XMLHttpRequest = CustomXMLHttpRequest;
})();