// ==UserScript==
// @name         Spotify Mini Player
// @namespace    Spotify
// @version      0.30
// @description  An enhancement to the spotify web player to make it a usable player in small window sizes. Especially useful when installing the web player as a standalone web app.
// @author       designakt
// @match        *://open.spotify.com/*
// @icon         https://developer.spotify.com/assets/branding-guidelines/icon4@2x.png
// @run-at       document-start
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/456915/Spotify%20Mini%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/456915/Spotify%20Mini%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var customCSS = `
@media screen and (max-width: 799px), screen and (max-height: 564px) {
  body {
    min-height: inherit;
    min-width: inherit;
  }

  /* Playlist Container */
  div:has(> div > div > div > div > button[data-testid="play-button"]) {
    border: 0px solid green;
    padding: 0;
    margin-bottom: 8px;
    width: 80px;
    height: 80px;
    overflow: hidden;
  }

  div:has(> div > div > div > button[data-testid="play-button"])
    > div:nth-child(1) {
    border: 0px solid red;
    width: 80px;
    height: 80px;
  }

  div:has(> div > div > div > button[data-testid="play-button"])
    > div:nth-child(2) {
    padding: 0;
    width: 0;
  }

  /* Play-Button Wrapper - might just be a helper to remove later... */
  div:has(> div > button[data-testid="play-button"]) {
    border: 0px solid red;
    border-radius: unset;
    pointer-events: auto;
    position: absolute !important;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0 !important;
    transform: none;
  }

  div:has(> button[data-testid="play-button"]) {
    border: 0px solid red;
    width: 100%;
    height: 100%;
  }

  button[data-testid="play-button"] {
    border: 0px solid yellow;
    border-radius: unset;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  button[data-testid="play-button"] > span {
    transform: scale(0.5);
    transition: all 300ms;
  }

  button[data-testid="play-button"]:hover > span {
    transform: scale(0.6) !important;
  }

  /* Playlist Group */
  div:has(> div > div > div > div > div > button[data-testid="play-button"]) {
    border: 0px solid red;
    display: block;
    width: calc(175px * 4) !important;
    /* width determins how many items are loaded */
    min-width: 80px !important;
  }

  /* No Playlist Section */
  section:not(button[data-testid="play-button"]) {
    visibility: hidden;
    height: 0;
    min-height: 0;
  }

  /* Playlist Group Section */
  section:has(
      > div > div > div > div > div > div > button[data-testid="play-button"]
    ) {
    border: 0px solid red;
    width: 80px;
    visibility: visible;
    height: auto;
  }

  /* Sections Group */
  section:has(section button[data-testid="play-button"]) {
    visibility: visible;
    height: auto;
  }

  /* Section Headlines and spacing */
  section h2,
  section h2 a {
    font-size: 1rem !important;
    white-space: break-spaces !important;
    pointer-events: none;
  }

  section div:has(> div > h2) {
    border: 0px solid firebrick;
    margin-bottom: 0 !important;
  }

  /* hide more link next to headlines */
  a > span[data-encore-id="type"] {
    display: none;
  }

  div:has(
      > section
        > div
        > div
        > div
        > div
        > div
        > div
        > button[data-testid="play-button"]
    ) {
    border: 0px solid blue;
    width: calc(80px + 4px + 4px);
    gap: 0;
    padding: 0;
    padding-left: 4px;
    padding-top: 4px;
    overflow-x: hidden;
    overflow-y: scroll;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: var(--background-base);
  }

  div:has(
      > section
        > div
        > div
        > div
        > div
        > div
        > div
        > button[data-testid="play-button"]
    )::-webkit-scrollbar {
    width: 4px !important;
  }

  .main-view-container__mh-footer-container {
    margin-top: 40px;
    display: none;
  }

  /* Now Playing Area */

  .Root__top-container,
  div#main > div > div:nth-child(2) {
    overflow: hidden;
    row-gap: 0;
    padding: 0;
    display: grid;
    grid-template-columns: max-content 1fr;
    grid-template-rows: 1fr 0;
    grid-auto-columns: 0;
    grid-auto-rows: 0;
    gap: 0px 0px;
    grid-template-areas: "playlist-bar now-playing-bar";
  }

  div:has(> div.main-view-container) {
    border: 0px solid red;
    grid-area: playlist-bar !important;
    width: 15px;
    height: 100%;
    border-radius: 0;
    background: var(--background-base);
    transition: all 0.2s ease-out;
    opacity: 0.5;

    overflow: hidden;
  }

  div:has(> div.main-view-container):hover {
    width: calc(80px + 4px + 4px);
    opacity: 1;
  }

  div:has(> div.main-view-container)::before {
    content: "";
    position: absolute;
    top: 0;
    width: 84px;
    height: 8px;
    background: linear-gradient(var(--background-base), rgba(0, 0, 0, 0.001));
    background: linear-gradient(
      to bottom,
      hsl(0, 0%, 7%) 0%,
      hsla(0, 0%, 7%, 0.987) 8.1%,
      hsla(0, 0%, 7%, 0.896) 22.5%,
      hsla(0, 0%, 7%, 0.741) 35.3%,
      hsla(0, 0%, 7%, 0.55) 47.1%,
      hsla(0, 0%, 7%, 0.352) 58.8%,
      hsla(0, 0%, 7%, 0.175) 71%,
      hsla(0, 0%, 7%, 0.049) 84.5%,
      hsla(0, 0%, 7%, 0) 100%
    );
    z-index: 1;
  }

  div:has(> div.main-view-container)::after {
    content: "";
    position: absolute;
    bottom: 0;
    width: 84px;
    height: 20px;
    background: linear-gradient(rgba(0, 0, 0, 0.001), var(--background-base));
    /* transparent keyword is broken in Safari */
    background: linear-gradient(
      to top,
      hsl(0, 0%, 7%) 0%,
      hsla(0, 0%, 7%, 0.987) 8.1%,
      hsla(0, 0%, 7%, 0.896) 22.5%,
      hsla(0, 0%, 7%, 0.741) 35.3%,
      hsla(0, 0%, 7%, 0.55) 47.1%,
      hsla(0, 0%, 7%, 0.352) 58.8%,
      hsla(0, 0%, 7%, 0.175) 71%,
      hsla(0, 0%, 7%, 0.049) 84.5%,
      hsla(0, 0%, 7%, 0) 100%
    );
  }

  div:has(> div.main-view-container) > div::after {
    background: linear-gradient(
      to left,
      hsl(0, 0%, 7%) 0%,
      hsla(0, 0%, 7%, 0.987) 8.1%,
      hsla(0, 0%, 7%, 0.896) 22.5%,
      hsla(0, 0%, 7%, 0.741) 35.3%,
      hsla(0, 0%, 7%, 0.55) 47.1%,
      hsla(0, 0%, 7%, 0.352) 58.8%,
      hsla(0, 0%, 7%, 0.175) 71%,
      hsla(0, 0%, 7%, 0.049) 84.5%,
      hsla(0, 0%, 7%, 0) 100%
    );
    content: "";
    position: absolute;
    top: 0;
    width: 20%;
    height: 100vh;
    right: 0;
    opacity: 0.2;
    transition: all 0.2s step-start;
  }

  div:has(> div.main-view-container):hover > div::after {
    right: 4px;
    transition: all 0.2s step-end;
  }

  .Root__now-playing-bar,
  div:has(> footer) {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mOU+A8AATUBGe90iuoAAAAASUVORK5CYII=);
    transition: background-image 6s ease-out;
    z-index: auto !important;
  }

  .Root__now-playing-bar footer,
  footer {
    background-color: rgba(24, 24, 24, 0.4);
    backdrop-filter: blur(50px);
  }

  .Root__now-playing-bar,
  .Root__now-playing-bar footer,
  .Root__now-playing-bar footer > div,
  div:has(> footer),
  footer,
  footer > div {
    width: 100%;
    min-width: 300px !important;
    height: 100vh;
    min-height: 100vh;
  }

  /* Now Playing Bar Layout to vertical */
  .Root__now-playing-bar footer > div,
  footer > div {
    flex-direction: column !important;
    justify-content: center !important;
    gap: 16px;
    padding: 0 !important;
  }

  /* Widen Now Playing Bar content areas */
  .Root__now-playing-bar footer > div > div,
  footer > div > div {
    width: 70% !important;
  }

  /* Cover,Title,Artist block */
  .Root__now-playing-bar footer > div > div:first-child > div,
  footer > div > div:first-child > div {
    justify-content: space-between;
    gap: 8px;
    transform: none;
    transition: none;
  }

  /* Cover box */
  footer > div > div:first-child > div > div:first-child {
    transform: none;
    box-shadow: 0 1px 15px rgba(0, 0, 0, 0.3);
  }

  /* Cover Expand Button */
  .Root__now-playing-bar
    footer
    > div
    > div:first-child
    > div
    > div:first-child
    > button,
  footer > div > div:first-child > div > div:first-child > button {
    display: none;
  }

  /* Cover Link */
  .Root__now-playing-bar
    footer
    > div
    > div:first-child
    > div
    > div:first-child
    img,
  footer > div > div:first-child > div > div:first-child > div > a {
    cursor: default;
  }

  /* Title, Artist box */
  .Root__now-playing-bar
    footer
    > div
    > div:first-child
    > div
    > div:nth-child(2),
  footer > div > div:first-child > div > div:nth-child(2) {
    width: 100%;
  }

  /* Playback block */
  .playback-bar > div:first-child {
    min-width: 25px;
  }

  .playback-bar > div:last-child {
    min-width: 30px;
  }

  /* Volume block */
  .Root__now-playing-bar footer > div > div:last-child,
  footer > div > div:last-child {
    justify-content: center;
  }

  footer > div > div:last-child > div {
    flex-direction: row-reverse;
  }

  .Root__now-playing-bar footer > div > div:last-child > div .volume-bar,
  footer > div > div:last-child > div .volume-bar {
    width: 100%;
    flex-basis: auto;
  }

  button[data-testid="control-button-npv"],
  button[data-testid="lyrics-button"],
  button[data-testid="control-button-queue"],
  div[data-testid="indicator"] {
    display: none;
  }

  /* Hide Spotify's own scroll bars */
  .os-scrollbar,
  .os-scrollbar-corner {
    display: none;
  }
}

@media screen and (min-width: 800px) and (min-height: 565px) {
  div:has(> footer) {
    background-image: none !important;
  }
}
`;
    // apply above css
    addGlobalStyle(customCSS);

    // wait for document to complete
    var interval = setInterval(function() {
        if(document.readyState === 'complete') {
            clearInterval(interval);
            init();
        }
    }, 100);

})();

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function init() {
    var item = null;
    var itemSRC = null;
    var bglayer = null;
    // regualarly check for cover art (if it exists and if it has changed)
    var interval = setInterval(function() {
        // see if there is a cover art
        item = document.querySelector('img[data-testid="cover-art-image"]');
        // check if there is a cover art
        if(item == null) {
            //console.log("searching for cover art");
        }
        // check if cover art has changed
        else if(item.src != itemSRC) {
            // store cover art url
            itemSRC = item.src;
            //console.log("found new cover art: " + item.src);
            // select background element to apply cover art to
            bglayer = document.querySelector('div:has(> footer)');
            // set cover art as background image
            bglayer.style.backgroundImage = "url(" + itemSRC + ")";
            console.log("applied new cover art to background");
        }
    }, 1000);
}
