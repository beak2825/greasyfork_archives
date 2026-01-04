// ==UserScript==
// @name         Lihuelworks' YouTube Subtitle Viewer (Manual Trigger) with TrustedHTML Bypass
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Fetch subtitles as SRT with manual trigger, bypass TrustedHTML policy, and insert a button (with spinner) into a Polymer dropdown element
// @match        *://www.youtube.com/watch?v*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license MIT 
// @run-at       document-end
// @supportURL   https://github.com/lihuelworks/youtube_translation_button_restorer/issues
// @contributionURL https://github.com/lihuelworks/youtube_translation_button_restorer#donate
// @downloadURL https://update.greasyfork.org/scripts/529667/Lihuelworks%27%20YouTube%20Subtitle%20Viewer%20%28Manual%20Trigger%29%20with%20TrustedHTML%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/529667/Lihuelworks%27%20YouTube%20Subtitle%20Viewer%20%28Manual%20Trigger%29%20with%20TrustedHTML%20Bypass.meta.js
// ==/UserScript==


// Apply container-specific CSS styles outside of the function using GM_addStyle
GM_addStyle(`
    .ytd-popup-container.style-scope {
       height: 250px;
       max-height: none;
       overflow: hidden;
   }

   #lihuelworks-subtitle-container:hover {
           background-color: var(--yt-spec-10-percent-layer);
   }
.spinner {
           border: 3px solid #ccc;
           border-top: 3px solid #333;
           border-radius: 50%;
           width: 15px;
           height: 15px;
           margin-left: 20px;
           animation: spin 0.6s linear infinite;
       }
       @keyframes spin {
           0% { transform: rotate(0deg); }
           100% { transform: rotate(360deg); }
       }
   ;
`);

// Main function to handle the process
(function() {
   'use strict';

   if (window.trustedTypes && trustedTypes.createPolicy) {
       if (!trustedTypes.defaultPolicy) {
           const passThroughFn = (x) => x;
           trustedTypes.createPolicy('default', {
               createHTML: passThroughFn,
               createScriptURL: passThroughFn,
               createScript: passThroughFn,
           });
       }
   }

   function getVideoID() {
       return new URLSearchParams(window.location.search).get("v");
   }

   function fetchCaptions(videoID) {
       showSpinner();
       GM_xmlhttpRequest({
           method: "GET",
           url: `https://www.youtube.com/watch?v=${videoID}`,
           onload: function(response) {
               const match = response.responseText.match(/"captionTracks":(\[.*?\])/);
               if (match) {
                   const captions = JSON.parse(match[1]);
                   const captionUrl = captions[0].baseUrl.replace(/\\u0026/g, "&");
                   fetchSubtitle(captionUrl);
               } else {
                   alert("No captions found.");
                   hideSpinner();
               }
           }
       });
   }

   function fetchSubtitle(url) {
       GM_xmlhttpRequest({
           method: "GET",
           url: url,
           onload: function(response) {
               const srtData = xmlToSrt(response.responseText);
               openInNewTab(srtData);
               hideSpinner();
           }
       });
   }

   function xmlToSrt(xml) {
       const parser = new DOMParser();
       const xmlDoc = parser.parseFromString(xml, "text/xml");
       let srt = "";
       let counter = 1;
       xmlDoc.querySelectorAll("text").forEach((node) => {
           let start = parseFloat(node.getAttribute("start"));
           let duration = parseFloat(node.getAttribute("dur"));
           let end = start + duration;
           let startTime = formatTime(start);
           let endTime = formatTime(end);
           let text = decodeHtmlEntities(node.textContent);
           srt += `${counter}\n${startTime} --> ${endTime}\n${text}\n\n`;
           counter++;
       });
       return srt;
   }

   function decodeHtmlEntities(text) {
       const element = document.createElement('div');
       if (text) {
           element.innerHTML = text;
           // Use innerText to extract correctly decoded characters
           return element.innerText || element.textContent;
       }
       return text;
   }

   function formatTime(seconds) {
       let date = new Date(0);
       date.setSeconds(seconds);
       return date.toISOString().substr(11, 12).replace(".", ",");
   }

   function openInNewTab(srtContent) {
       const blob = new Blob([srtContent], { type: "text/plain; charset=utf-8" });
       const url = URL.createObjectURL(blob);
       const newTab = window.open(url, "_blank");
       if (!newTab) {
           alert("Please allow popups for this action to work.");
       }
   }


   function showSpinner() {
       const button = document.getElementById("lihuelworks-subtitle-getter");
       if (button) {
           button.innerHTML = '';
           const spinner = document.createElement("div");
           spinner.className = 'spinner';
           button.appendChild(spinner);
           button.disabled = true;
       }
   }

   function hideSpinner() {
       const button = document.getElementById("lihuelworks-subtitle-getter");
       if (button) {
           button.innerText = "Transcription";
           button.disabled = false;
       }
   }

   function createButton() {
       const container = document.querySelector(".ytd-popup-container.style-scope > .ytd-menu-popup-renderer.style-scope");
       if (!container) {
           console.log("Menu container not found, retrying...");
           setTimeout(createButton, 1000);
           return;
       }

       const divContainer = document.createElement("div");
       divContainer.id = "lihuelworks-subtitle-container";
       divContainer.style.display = "flex";
       divContainer.style.alignItems = "center";

       const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
       svgIcon.setAttribute("width", "16");
       svgIcon.setAttribute("height", "16");
       svgIcon.setAttribute("fill", "currentColor");
       svgIcon.setAttribute("class", "bi bi-body-text");
       svgIcon.setAttribute("viewBox", "0 0 16 16");
       svgIcon.style.marginLeft = "20px";
       svgIcon.style.paddingTop = "-3px";
       svgIcon.style.textAlign = "baseline";

       const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
       path.setAttribute("fill-rule", "evenodd");
       path.setAttribute("d", "M0 .5A.5.5 0 0 1 .5 0h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 0 .5m0 2A.5.5 0 0 1 .5 2h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m9 0a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-9 2A.5.5 0 0 1 .5 4h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m5 0a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m7 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-12 2A.5.5 0 0 1 .5 6h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m8 0a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-8 2A.5.5 0 0 1 .5 8h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m7 0a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-7 2a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5");
       svgIcon.appendChild(path);

       const button = document.createElement("button");
       button.id = "lihuelworks-subtitle-getter";
       button.classList.add("style-scope", "ytd-menu-service-item-renderer");
       button.innerText = "Transcription";
       button.style.flexBasis = "1e-09px";
       button.style.flexGrow = "1";
       button.style.flexShrink = "1";
       button.style.height = "36px";
       button.style.width = "auto";
       button.style.fontFamily = "Roboto, Arial, sans-serif";
       button.style.fontSize = "1.4rem";
       button.style.fontWeight = "400";
       button.style.lineHeight = "normal";
       button.style.textSizeAdjust = "100%";
       button.style.whiteSpace = "nowrap";
       button.style.whiteSpaceCollapse = "collapse";
       button.style.color = "rgb(241, 241, 241)";
       button.style.cursor = "pointer";
       button.style.border = "none";
       button.style.margin = "0";
       button.style.padding = "0";
       button.style.width = "auto";
       button.style.overflow = "visible";
       button.style.background = "transparent";
       button.style.color = "inherit";
       button.style.lineHeight = "normal";
       button.style.webkitFontSmoothing = "inherit";
       button.style.mozOsxFontSmoothing = "inherit";
       button.style.webkitAppearance = "none";

       button.addEventListener("click", function() {
           const videoID = getVideoID();
           fetchCaptions(videoID);
       });

       divContainer.appendChild(svgIcon);
       divContainer.appendChild(button);
       container.appendChild(divContainer);
   }

   createButton();
})();
