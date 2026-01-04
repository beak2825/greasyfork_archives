// ==UserScript==
// @name        BetterOsufy
// @name:en     BetterOsufy
// @name:de     BetterOsufy
// @namespace   http://tampermonkey.net/
// @version     1.8
// @description As of right now, adds dark mode, nicer css in general, numbers to display how many songs it found and more! If the dev of Osufy sees this, feel free to use some of this code. I did a little bit of weird stuff with AI, sorry.
// @description:en As of right now, adds dark mode, nicer css in general, numbers to display how many songs it found and more! If the dev of Osufy sees this, feel free to use some of this code. I did a little bit of weird stuff with AI, sorry.
// @description:de Im Moment fügt es den Dunkelmodus hinzu, schöneres CSS im Allgemeinen, Zahlen zur Anzeige, wie viele Songs gefunden wurden, und mehr! Wenn der Entwickler von Osufy dies sieht, kann er gerne einen Teil dieses Codes verwenden. Ich habe ein wenig seltsame Sachen mit KI gemacht, tut mir leid.
// @author      Master3307
// @match       https://osufy.lonke.ro/
// @include     https://osufy.lonke.ro/*
// @icon        https://master3307.netlify.app/assets/media/osufy_favicon.webp
// @grant       none
// @license     MIT
// @website     https://master3307.netlify.app/home
// @website     https://github.com/Master3307/BetterOsufy
// @downloadURL https://update.greasyfork.org/scripts/539159/BetterOsufy.user.js
// @updateURL https://update.greasyfork.org/scripts/539159/BetterOsufy.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const newLang = "en";
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute("lang", newLang);
  }

  // Add counter elements after page load
  function addCounters() {
    const searchInput = document.querySelector('input[type="text"]');
    if (!searchInput || document.getElementById("song-counters")) return;

    const countersDiv = document.createElement("div");
    countersDiv.id = "song-counters";
    countersDiv.style.cssText = `
            margin-top: 5px;
            color: rgba(255, 255, 255, 0.87);
            font-size: 14px;
        `;

    countersDiv.innerHTML = `
            <span id="maps-count">Maps found: 0</span> | 
            <span id="songs-count">Songs found: 0</span> | 
            <span id="missing-count">Missing: 0</span>
        `;

    searchInput.parentNode.appendChild(countersDiv);

    // --- Add "Found: X" next to the search button ---
    const searchButton = searchInput.parentNode.querySelector('button, input[type="submit"]');
    if (searchButton && !document.getElementById("found-total-span")) {
      const foundSpan = document.createElement("span");
      foundSpan.id = "found-total-span";
      foundSpan.style.cssText = "margin-left: 12px; color: #FF327A; font-weight: bold; font-size: 1.1em;";
      foundSpan.textContent = "Found: 0";
      searchButton.parentNode.insertBefore(foundSpan, searchButton.nextSibling);
    }
  }

  // Update counter values
  function updateCounters() {
    const panels = document.querySelectorAll(".mui-panel");
    const mapsCount = panels.length;
    const songsCount = new Set(
      Array.from(panels).map((panel) =>
        panel.querySelector("h2")?.textContent.trim()
      )
    ).size;
    const missingCount = mapsCount - songsCount;

    document.getElementById(
      "maps-count"
    ).textContent = `Maps found: ${mapsCount}`;
    document.getElementById(
      "songs-count"
    ).textContent = `Songs found: ${songsCount}`;
    document.getElementById(
      "missing-count"
    ).textContent = `Missing: ${missingCount}`;

    // --- Update "Found: X" span next to search button ---
    const foundSpan = document.getElementById("found-total-span");
    if (foundSpan) {
      foundSpan.textContent = `Found: ${mapsCount}`;
    }
  }

  // Set up observers
  function initializeCounters() {
    addCounters();
    const songsContainer = document.getElementById("songs");
    if (songsContainer) {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === "childList") {
            updateCounters();
          }
        }
      });
      observer.observe(songsContainer, { childList: true, subtree: true });
    }
    // Update counters once after setup to reflect any existing songs
    if (document.getElementById("maps-count")) {
      updateCounters();
    }
  }

  // Initialize when DOM is ready
  document.addEventListener("DOMContentLoaded", initializeCounters);
  // Backup initialization for dynamic page loads
  setTimeout(initializeCounters, 1000);

  // --- START OF CUSTOM CSS INJECTION ---
  const customCss = `/*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */
html {
    font-family: sans-serif;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
}

body {
    margin: 0;
    background-color: #1a1a1a; /* Dark background */
    color: rgba(255, 255, 255, 0.87); /* Light text */

    /* NEU: Zentrierung des Hauptinhalts */
    max-width: 1200px; /* Maximale Breite des Inhalts */
    margin-left: auto; /* Zentriert den Inhalt horizontal */
    margin-right: auto; /* Zentriert den Inhalt horizontal */
    padding: 0 20px; /* Etwas Padding an den Seiten für kleinere Bildschirme */
}

/* Anpassung für den Appbar, damit er die volle Breite behält, wenn er nicht Teil des zentrierten Inhalts sein soll */
.mui-appbar {
    width: 100%; /* Stellt sicher, dass die Appbar die volle Breite einnimmt */
    position: relative; /* Oder fixed/sticky, je nach gewünschtem Verhalten */
    left: auto; /* Entfernt eventuelle linke/rechte Margins, die durch body kommen könnten */
    right: auto;
    /* Füge hier weitere spezifische Appbar-Stile hinzu, wenn nötig */
}

/* Damit die Container innerhalb des zentrierten Bodys richtig funktionieren */
.mui-container,
.mui-container-fluid {
    margin-left: 0;
    margin-right: 0;
    padding-left: 0;
    padding-right: 0;
    max-width: 100%; /* Erlaubt den inneren Containern, die volle Breite des Body zu nutzen */
}

article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
main,
menu,
nav,
section,
summary {
    display: block;
}

audio,
canvas,
progress,
video {
    display: inline-block;
    vertical-align: baseline;
}

audio:not([controls]) {
    display: none;
    height: 0;
}

[hidden],
template {
    display: none;
}

a {
    background-color: transparent;
    color: #81c784; /* A light green for links */
}

a:active,
a:hover {
    outline: 0;
    color: #66bb6a; /* Slightly darker green on hover */
    text-decoration: underline;
}

abbr[title] {
    border-bottom: 1px dotted;
}

b,
strong {
    font-weight: 700;
}

dfn {
    font-style: italic;
}

h1 {
    font-size: 2em;
    margin: .67em 0;
    color: rgba(255, 255, 255, 0.95); /* Brighter for headings */
}

mark {
    background: #ff0;
    color: #000;
}

small {
    font-size: 80%;
}

sub,
sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
}

sup {
    top: -.5em;
}

sub {
    bottom: -.25em;
}

img {
    border: 0;
}

svg:not(:root) {
    overflow: hidden;
}

figure {
    margin: 1em 40px;
}

hr {
    box-sizing: content-box;
    height: 0;
    border: 0;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.12); /* Light divider for dark mode */
}

pre {
    overflow: auto;
}

code,
kbd,
pre,
samp {
    font-family: monospace, monospace;
    font-size: 1em;
}

button,
input,
optgroup,
select,
textarea {
    color: inherit;
    font: inherit;
    margin: 0;
}

button {
    overflow: visible;
}

button,
select {
    text-transform: none;
}

button,
html input[type=button],
input[type=reset],
input[type=submit] {
    -webkit-appearance: button;
    cursor: pointer;
}

button[disabled],
html input[disabled] {
    cursor: default;
}

button::-moz-focus-inner,
input::-moz-focus-inner {
    border: 0;
    padding: 0;
}

input {
    line-height: normal;
}

input[type=checkbox],
input[type=radio] {
    box-sizing: border-box;
    padding: 0;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    height: auto;
}

input[type=search] {
    -webkit-appearance: textfield;
    box-sizing: content-box;
}

input[type=search]::-webkit-search-cancel-button,
input[type=search]::-webkit-search-decoration {
    -webkit-appearance: none;
}

fieldset {
    border: 1px solid #444; /* Darker border */
    margin: 0 2px;
    padding: .35em .625em .75em;
}

legend {
    border: 0;
    padding: 0;
}

textarea {
    overflow: auto;
}

optgroup {
    font-weight: 700;
}

table {
    border-collapse: collapse;
    border-spacing: 0;
}

td,
th {
    padding: 0;
}

/* General Overhaul & Dark Theme */
* {
    box-sizing: border-box;
}

:after,
:before {
    box-sizing: border-box;
}

html {
    font-size: 10px;
    -webkit-tap-highlight-color: transparent;
}

body {
    font-family: Arial, Verdana, Tahoma, sans-serif;
    font-size: 16px; /* Slightly larger base font */
    font-weight: 400;
    line-height: 1.6; /* Increased line-height for readability */
    color: rgba(255, 255, 255, 0.87); /* Light text */
    background-color: #121212; /* Very dark background */
}

button,
input,
select,
textarea {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
}

a {
    color: #81c784; /* Light green */
    text-decoration: none;
}

a:focus,
a:hover {
    color: #66bb6a; /* Darker green on hover */
    text-decoration: underline;
}

a:focus {
    outline: thin dotted;
    outline: 5px auto -webkit-focus-ring-color;
    outline-offset: -2px;
}

p {
    margin: 0 0 15px; /* More spacing */
}

ol,
ul {
    margin-top: 0;
    margin-bottom: 15px; /* More spacing */
}

figure {
    margin: 0;
}

img {
    vertical-align: middle;
}

hr {
    margin-top: 30px;
    margin-bottom: 30px;
    border: 0;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.12);
}

legend {
    display: block;
    width: 100%;
    padding: 0;
    margin-bottom: 15px;
    font-size: 24px;
    color: rgba(255, 255, 255, 0.95);
    line-height: inherit;
    border: 0;
}

input[type=search] {
    box-sizing: border-box;
    -webkit-appearance: none;
}

input[type=checkbox]:focus,
input[type=radio]:focus,
input[type=file]:focus {
    outline: thin dotted;
    outline: 5px auto -webkit-focus-ring-color;
    outline-offset: -2px;
}

input[type=checkbox]:disabled,
input[type=radio]:disabled {
    cursor: not-allowed;
}

strong {
    font-weight: 700;
}

abbr[title] {
    cursor: help;
    border-bottom: 1px dotted #81c784; /* Light green dotted border */
}

h1,
h2,
h3 {
    margin-top: 25px;
    margin-bottom: 15px;
    color: rgba(255, 255, 255, 0.95);
}

h4,
h5,
h6 {
    margin-top: 15px;
    margin-bottom: 10px;
    color: rgba(255, 255, 255, 0.9);
}

.mui--appbar-height {
    height: 64px; /* Larger appbar for desktop */
}

.mui--appbar-min-height,
.mui-appbar {
    min-height: 64px;
}

.mui--appbar-line-height {
    line-height: 64px;
}

.mui--appbar-top {
    top: 64px;
}

@media (orientation: landscape) and (max-height: 480px) {
    .mui--appbar-height {
        height: 48px;
    }

    .mui--appbar-min-height,
    .mui-appbar {
        min-height: 48px;
    }

    .mui--appbar-line-height {
        line-height: 48px;
    }

    .mui--appbar-top {
        top: 48px;
    }
}

@media (min-width: 480px) {
    .mui--appbar-height {
        height: 64px;
    }

    .mui--appbar-min-height,
    .mui-appbar {
        min-height: 64px;
    }

    .mui--appbar-line-height {
        line-height: 64px;
    }

    .mui--appbar-top {
        top: 64px;
    }
}

.mui-appbar {
    background-color: #313131; /* Darker appbar */
    color: #FFF;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); /* Subtle shadow */
}

.mui-btn {
    -webkit-animation-duration: .1ms;
    animation-duration: .1ms;
    -webkit-animation-name: mui-node-inserted;
    animation-name: mui-node-inserted;
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.87); /* Light text for buttons */
    background-color: #424242; /* Darker button background */
    transition: all .2s ease-in-out;
    display: inline-block;
    height: 40px; /* Slightly taller buttons */
    padding: 0 28px; /* More padding */
    margin-top: 8px;
    margin-bottom: 8px;
    border: none;
    border-radius: 4px; /* Slightly more rounded corners */
    cursor: pointer;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    background-image: none;
    text-align: center;
    line-height: 40px;
    vertical-align: middle;
    white-space: nowrap;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-size: 15px; /* Slightly larger button font */
    letter-spacing: .04em;
    position: relative;
    overflow: hidden;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2); /* Subtle shadow */
}

.mui-btn:active,
.mui-btn:focus,
.mui-btn:hover {
    color: rgba(255, 255, 255, 0.95);
    background-color: #555; /* Lighter dark on hover */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); /* More pronounced shadow on hover */
}

.mui-btn[disabled]:active,
.mui-btn[disabled]:focus,
.mui-btn[disabled]:hover {
    color: rgba(255, 255, 255, 0.3);
    background-color: #424242;
    box-shadow: none;
}

.mui-btn.mui-btn--flat {
    color: #81c784; /* Light green for flat buttons */
    background-color: transparent;
    box-shadow: none;
}

.mui-btn.mui-btn--flat:active,
.mui-btn.mui-btn--flat:focus,
.mui-btn.mui-btn--flat:hover {
    color: #66bb6a;
    background-color: rgba(255, 255, 255, 0.08); /* Subtle hover for flat buttons */
}

.mui-btn.mui-btn--flat[disabled]:active,
.mui-btn.mui-btn--flat[disabled]:focus,
.mui-btn.mui-btn--flat[disabled]:hover {
    color: rgba(255, 255, 255, 0.3);
    background-color: transparent;
}

.mui-btn:active {
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.4);
}

.mui-btn.mui--is-disabled,
.mui-btn:disabled {
    cursor: not-allowed;
    pointer-events: none;
    opacity: .5;
    box-shadow: none;
}

.mui-btn+.mui-btn {
    margin-left: 10px;
}

.mui-btn--fab,
.mui-btn--raised {
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
}

.mui-btn--fab:active,
.mui-btn--raised:active {
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.4);
}

.mui-btn--fab {
    position: relative;
    padding: 0;
    width: 60px;
    height: 60px;
    line-height: 60px;
    border-radius: 50%;
    z-index: 1;
}

.mui-btn--primary {
    color: #FFF;
    background-color: #81c784; /* Primary green */
}

.mui-btn--primary:active,
.mui-btn--primary:focus,
.mui-btn--primary:hover {
    color: #FFF;
    background-color: #66bb6a; /* Darker primary green on hover */
}

.mui-btn--primary[disabled]:active,
.mui-btn--primary[disabled]:focus,
.mui-btn--primary[disabled]:hover {
    color: #FFF;
    background-color: #81c784;
}

.mui-btn--primary.mui-btn--flat {
    color: #81c784;
    background-color: transparent;
}

.mui-btn--primary.mui-btn--flat:active,
.mui-btn--primary.mui-btn--flat:focus,
.mui-btn--primary.mui-btn--flat:hover {
    color: #66bb6a;
    background-color: rgba(255, 255, 255, 0.08);
}

.mui-btn--primary.mui-btn--flat[disabled]:active,
.mui-btn--primary.mui-btn--flat[disabled]:focus,
.mui-btn--primary.mui-btn--flat[disabled]:hover {
    color: rgba(255, 255, 255, 0.3);
    background-color: transparent;
}

.mui-btn--dark {
    color: #FFF;
    background-color: #525252;
}

.mui-btn--dark:active,
.mui-btn--dark:focus,
.mui-btn--dark:hover {
    color: #FFF;
    background-color: #606060;
}

.mui-btn--dark[disabled]:active,
.mui-btn--dark[disabled]:focus,
.mui-btn--dark[disabled]:hover {
    color: #FFF;
    background-color: #525252;
}

.mui-btn--dark.mui-btn--flat {
    color: #525252;
    background-color: transparent;
}

.mui-btn--dark.mui-btn--flat:active,
.mui-btn--dark.mui-btn--flat:focus,
.mui-btn--dark.mui-btn--flat:hover {
    color: #606060;
    background-color: rgba(255, 255, 255, 0.08);
}

.mui-btn--dark.mui-btn--flat[disabled]:active,
.mui-btn--dark.mui-btn--flat[disabled]:focus,
.mui-btn--dark.mui-btn--flat[disabled]:hover {
    color: rgba(255, 255, 255, 0.3);
    background-color: transparent;
}

.mui-btn--danger {
    color: #FFF;
    background-color: #ff5252; /* Lighter red for danger */
}

.mui-btn--danger:active,
.mui-btn--danger:focus,
.mui-btn--danger:hover {
    color: #FFF;
    background-color: #ff6e6e;
}

.mui-btn--danger[disabled]:active,
.mui-btn--danger[disabled]:focus,
.mui-btn--danger[disabled]:hover {
    color: #FFF;
    background-color: #ff5252;
}

.mui-btn--danger.mui-btn--flat {
    color: #ff5252;
    background-color: transparent;
}

.mui-btn--danger.mui-btn--flat:active,
.mui-btn--danger.mui-btn--flat:focus,
.mui-btn--danger.mui-btn--flat:hover {
    color: #ff6e6e;
    background-color: rgba(255, 255, 255, 0.08);
}

.mui-btn--danger.mui-btn--flat[disabled]:active,
.mui-btn--danger.mui-btn--flat[disabled]:focus,
.mui-btn--danger.mui-btn--flat[disabled]:hover {
    color: rgba(255, 255, 255, 0.3);
    background-color: transparent;
}

.mui-btn--accent {
    color: #FFF;
    background-color: #f78c2e; /* Orange accent */
}

.mui-btn--accent:active,
.mui-btn--accent:focus,
.mui-btn--accent:hover {
    color: #FFF;
    background-color: #fa9c44;
}

.mui-btn--accent[disabled]:active,
.mui-btn--accent[disabled]:focus,
.mui-btn--accent[disabled]:hover {
    color: #FFF;
    background-color: #f78c2e;
}

.mui-btn--accent.mui-btn--flat {
    color: #f78c2e;
    background-color: transparent;
}

.mui-btn--accent.mui-btn--flat:active,
.mui-btn--accent.mui-btn--flat:focus,
.mui-btn--accent.mui-btn--flat:hover {
    color: #fa9c44;
    background-color: rgba(255, 255, 255, 0.08);
}

.mui-btn--accent.mui-btn--flat[disabled]:active,
.mui-btn--accent.mui-btn--flat[disabled]:focus,
.mui-btn--accent.mui-btn--flat[disabled]:hover {
    color: rgba(255, 255, 255, 0.3);
    background-color: transparent;
}

.mui-btn--small {
    height: 36px;
    line-height: 36px;
    padding: 0 18px;
    font-size: 13px;
}

.mui-btn--large {
    height: 60px;
    line-height: 60px;
    padding: 0 30px;
    font-size: 15px;
}

.mui-btn--fab.mui-btn--small {
    width: 48px;
    height: 48px;
    line-height: 48px;
}

.mui-btn--fab.mui-btn--large {
    width: 80px;
    height: 80px;
    line-height: 80px;
}

.mui-checkbox,
.mui-radio {
    position: relative;
    display: block;
    margin-top: 12px;
    margin-bottom: 12px;
}

.mui-checkbox>label,
.mui-radio>label {
    min-height: 22px;
    padding-left: 25px;
    margin-bottom: 0;
    font-weight: 400;
    cursor: pointer;
}

.mui-checkbox--inline>label>input[type=checkbox],
.mui-checkbox>label>input[type=checkbox],
.mui-radio--inline>label>input[type=radio],
.mui-radio>label>input[type=radio] {
    position: absolute;
    margin-left: -20px;
    margin-top: 4px;
}

.mui-checkbox+.mui-checkbox,
.mui-radio+.mui-radio {
    margin-top: -5px;
}

.mui-checkbox--inline,
.mui-radio--inline {
    display: inline-block;
    padding-left: 20px;
    margin-bottom: 0;
    vertical-align: middle;
    font-weight: 400;
    cursor: pointer;
}

.mui-checkbox--inline>input[type=checkbox],
.mui-checkbox--inline>input[type=radio],
.mui-checkbox--inline>label>input[type=checkbox],
.mui-checkbox--inline>label>input[type=radio],
.mui-radio--inline>input[type=checkbox],
.mui-radio--inline>input[type=radio],
.mui-radio--inline>label>input[type=checkbox],
.mui-radio--inline>label>input[type=radio] {
    margin: 4px 0 0;
    line-height: normal;
}

.mui-checkbox--inline+.mui-checkbox--inline,
.mui-radio--inline+.mui-radio--inline {
    margin-top: 0;
    margin-left: 10px;
}

/* Entfernt spezifische max-widths für .mui-container, da der body die Breite steuert */
.mui-container {
    padding-left: 0;
    padding-right: 0;
}

/* Entfernt spezifische max-widths für .mui-container, da der body die Breite steuert */
@media (min-width: 544px) {
    .mui-container {
        max-width: 100%;
    }
}

@media (min-width: 768px) {
    .mui-container {
        max-width: 100%;
    }
}

@media (min-width: 992px) {
    .mui-container {
        max-width: 100%;
    }
}

@media (min-width: 1200px) {
    .mui-container {
        max-width: 100%;
    }
}

.mui-container-fluid {
    margin-right: auto;
    margin-left: auto;
    padding-left: 20px;
    padding-right: 20px;
}

.mui-container-fluid:after,
.mui-container-fluid:before {
    content: " ";
    display: table;
}

.mui-container-fluid:after {
    clear: both;
}

.mui-divider {
    display: block;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.12);
}

.mui--divider-top {
    border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.mui--divider-bottom {
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.mui--divider-left {
    border-left: 1px solid rgba(255, 255, 255, 0.12);
}

.mui--divider-right {
    border-right: 1px solid rgba(255, 255, 255, 0.12);
}

.mui-dropdown {
    display: inline-block;
    position: relative;
}

[data-mui-toggle=dropdown] {
    -webkit-animation-duration: .1ms;
    animation-duration: .1ms;
    -webkit-animation-name: mui-node-inserted;
    animation-name: mui-node-inserted;
    outline: 0;
}

.mui-dropdown__menu {
    position: absolute;
    top: 100%;
    left: 0;
    display: none;
    min-width: 180px; /* Slightly wider dropdowns */
    padding: 8px 0; /* More padding */
    margin: 4px 0 0;
    list-style: none;
    font-size: 15px; /* Slightly larger font */
    text-align: left;
    background-color: #282828; /* Dark dropdown background */
    border-radius: 4px;
    z-index: 1;
    background-clip: padding-box;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4); /* Darker shadow for dropdowns */
}

.mui-dropdown__menu.mui--is-open {
    display: block;
}

.mui-dropdown__menu>li>a {
    display: block;
    padding: 8px 25px; /* More padding */
    clear: both;
    font-weight: 400;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.87);
    white-space: nowrap;
}

.mui-dropdown__menu>li>a:focus,
.mui-dropdown__menu>li>a:hover {
    text-decoration: none;
    color: rgba(255, 255, 255, 0.95);
    background-color: #383838; /* Darker hover for dropdown items */
}

.mui-dropdown__menu>.mui--is-disabled>a,
.mui-dropdown__menu>.mui--is-disabled>a:focus,
.mui-dropdown__menu>.mui--is-disabled>a:hover {
    color: rgba(255, 255, 255, 0.3);
}

.mui-dropdown__menu>.mui--is-disabled>a:focus,
.mui-dropdown__menu>.mui--is-disabled>a:hover {
    text-decoration: none;
    background-color: transparent;
    background-image: none;
    cursor: not-allowed;
}

.mui-dropdown__menu--right {
    left: auto;
    right: 0;
}

@media (min-width: 544px) {
    .mui-form--inline>.mui-textfield {
        display: inline-block;
        margin-bottom: 0;
    }

    .mui-form--inline>.mui-checkbox,
    .mui-form--inline>.mui-radio {
        display: inline-block;
        margin-top: 0;
        margin-bottom: 0;
        vertical-align: middle;
    }

    .mui-form--inline>.mui-checkbox>label,
    .mui-form--inline>.mui-radio>label {
        padding-left: 0;
    }

    .mui-form--inline>.mui-checkbox>label>input[type=checkbox],
    .mui-form--inline>.mui-radio>label>input[type=radio] {
        position: relative;
        margin-left: 0;
    }

    .mui-form--inline>.mui-select {
        display: inline-block;
    }

    .mui-form--inline>.mui-btn {
        margin-bottom: 0;
        margin-top: 0;
        vertical-align: bottom;
    }
}

.mui-row {
    margin-left: -15px;
    margin-right: -15px;
}

.mui-row:after,
.mui-row:before {
    content: " ";
    display: table;
}

.mui-row:after {
    clear: both;
}

.mui-col-lg-1,
.mui-col-lg-10,
.mui-col-lg-11,
.mui-col-lg-12,
.mui-col-lg-2,
.mui-col-lg-3,
.mui-col-lg-4,
.mui-col-lg-5,
.mui-col-lg-6,
.mui-col-lg-7,
.mui-col-lg-8,
.mui-col-lg-9,
.mui-col-md-1,
.mui-col-md-10,
.mui-col-md-11,
.mui-col-md-12,
.mui-col-md-2,
.mui-col-md-3,
.mui-col-md-4,
.mui-col-md-5,
.mui-col-md-6,
.mui-col-md-7,
.mui-col-md-8,
.mui-col-md-9,
.mui-col-sm-1,
.mui-col-sm-10,
.mui-col-sm-11,
.mui-col-sm-12,
.mui-col-sm-2,
.mui-col-sm-3,
.mui-col-sm-4,
.mui-col-sm-5,
.mui-col-sm-6,
.mui-col-sm-7,
.mui-col-sm-8,
.mui-col-sm-9,
.mui-col-xs-1,
.mui-col-xs-10,
.mui-col-xs-11,
.mui-col-xs-12,
.mui-col-xs-2,
.mui-col-xs-3,
.mui-col-xs-4,
.mui-col-xs-5,
.mui-col-xs-6,
.mui-col-xs-7,
.mui-col-xs-8,
.mui-col-xs-9 {
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
}

.mui-col-xs-1,
.mui-col-xs-10,
.mui-col-xs-11,
.mui-col-xs-12,
.mui-col-xs-2,
.mui-col-xs-3,
.mui-col-xs-4,
.mui-col-xs-5,
.mui-col-xs-6,
.mui-col-xs-7,
.mui-col-xs-8,
.mui-col-xs-9 {
    float: left;
}

.mui-col-xs-1 {
    width: 8.33333%;
}

.mui-col-xs-2 {
    width: 16.66667%;
}

.mui-col-xs-3 {
    width: 25%;
}

.mui-col-xs-4 {
    width: 33.33333%;
}

.mui-col-xs-5 {
    width: 41.66667%;
}

.mui-col-xs-6 {
    width: 50%;
}

.mui-col-xs-7 {
    width: 58.33333%;
}

.mui-col-xs-8 {
    width: 66.66667%;
}

.mui-col-xs-9 {
    width: 75%;
}

.mui-col-xs-10 {
    width: 83.33333%;
}

.mui-col-xs-11 {
    width: 91.66667%;
}

.mui-col-xs-12 {
    width: 100%;
}

.mui-col-xs-offset-0 {
    margin-left: 0;
}

.mui-col-xs-offset-1 {
    margin-left: 8.33333%;
}

.mui-col-xs-offset-2 {
    margin-left: 16.66667%;
}

.mui-col-xs-offset-3 {
    margin-left: 25%;
}

.mui-col-xs-offset-4 {
    margin-left: 33.33333%;
}

.mui-col-xs-offset-5 {
    margin-left: 41.66667%;
}

.mui-col-xs-offset-6 {
    margin-left: 50%;
}

.mui-col-xs-offset-7 {
    margin-left: 58.33333%;
}

.mui-col-xs-offset-8 {
    margin-left: 66.66667%;
}

.mui-col-xs-offset-9 {
    margin-left: 75%;
}

.mui-col-xs-offset-10 {
    margin-left: 83.33333%;
}

.mui-col-xs-offset-11 {
    margin-left: 91.66667%;
}

.mui-col-xs-offset-12 {
    margin-left: 100%;
}

@media (min-width: 544px) {

    .mui-col-sm-1,
    .mui-col-sm-10,
    .mui-col-sm-11,
    .mui-col-sm-12,
    .mui-col-sm-2,
    .mui-col-sm-3,
    .mui-col-sm-4,
    .mui-col-sm-5,
    .mui-col-sm-6,
    .mui-col-sm-7,
    .mui-col-sm-8,
    .mui-col-sm-9 {
        float: left;
    }

    .mui-col-sm-1 {
        width: 8.33333%;
    }

    .mui-col-sm-2 {
        width: 16.66667%;
    }

    .mui-col-sm-3 {
        width: 25%;
    }

    .mui-col-sm-4 {
        width: 33.33333%;
    }

    .mui-col-sm-5 {
        width: 41.66667%;
    }

    .mui-col-sm-6 {
        width: 50%;
    }

    .mui-col-sm-7 {
        width: 58.33333%;
    }

    .mui-col-sm-8 {
        width: 66.66667%;
    }

    .mui-col-sm-9 {
        width: 75%;
    }

    .mui-col-sm-10 {
        width: 83.33333%;
    }

    .mui-col-sm-11 {
        width: 91.66667%;
    }

    .mui-col-sm-12 {
        width: 100%;
    }

    .mui-col-sm-offset-0 {
        margin-left: 0;
    }

    .mui-col-sm-offset-1 {
        margin-left: 8.33333%;
    }

    .mui-col-sm-offset-2 {
        margin-left: 16.66667%;
    }

    .mui-col-sm-offset-3 {
        margin-left: 25%;
    }

    .mui-col-sm-offset-4 {
        margin-left: 33.33333%;
    }

    .mui-col-sm-offset-5 {
        margin-left: 41.66667%;
    }

    .mui-col-sm-offset-6 {
        margin-left: 50%;
    }

    .mui-col-sm-offset-7 {
        margin-left: 58.33333%;
    }

    .mui-col-sm-offset-8 {
        margin-left: 66.66667%;
    }

    .mui-col-sm-offset-9 {
        margin-left: 75%;
    }

    .mui-col-sm-offset-10 {
        margin-left: 83.33333%;
    }

    .mui-col-sm-offset-11 {
        margin-left: 91.66667%;
    }

    .mui-col-sm-offset-12 {
        margin-left: 100%;
    }
}

@media (min-width: 768px) {

    .mui-col-md-1,
    .mui-col-md-10,
    .mui-col-md-11,
    .mui-col-md-12,
    .mui-col-md-2,
    .mui-col-md-3,
    .mui-col-md-4,
    .mui-col-md-5,
    .mui-col-md-6,
    .mui-col-md-7,
    .mui-col-md-8,
    .mui-col-md-9 {
        float: left;
    }

    .mui-col-md-1 {
        width: 8.33333%;
    }

    .mui-col-md-2 {
        width: 16.66667%;
    }

    .mui-col-md-3 {
        width: 25%;
    }

    .mui-col-md-4 {
        width: 33.33333%;
    }

    .mui-col-md-5 {
        width: 41.66667%;
    }

    .mui-col-md-6 {
        width: 50%;
    }

    .mui-col-md-7 {
        width: 58.33333%;
    }

    .mui-col-md-8 {
        width: 66.66667%;
    }

    .mui-col-md-9 {
        width: 75%;
    }

    .mui-col-md-10 {
        width: 83.33333%;
    }

    .mui-col-md-11 {
        width: 91.66667%;
    }

    .mui-col-md-12 {
        width: 100%;
    }

    .mui-col-md-offset-0 {
        margin-left: 0;
    }

    .mui-col-md-offset-1 {
        margin-left: 8.33333%;
    }

    .mui-col-md-offset-2 {
        margin-left: 16.66667%;
    }

    .mui-col-md-offset-3 {
        margin-left: 25%;
    }

    .mui-col-md-offset-4 {
        margin-left: 33.33333%;
    }

    .mui-col-md-offset-5 {
        margin-left: 41.66667%;
    }

    .mui-col-md-offset-6 {
        margin-left: 50%;
    }

    .mui-col-md-offset-7 {
        margin-left: 58.33333%;
    }

    .mui-col-md-offset-8 {
        margin-left: 66.66667%;
    }

    .mui-col-md-offset-9 {
        margin-left: 75%;
    }

    .mui-col-md-offset-10 {
        margin-left: 83.33333%;
    }

    .mui-col-md-offset-11 {
        margin-left: 91.66667%;
    }

    .mui-col-md-offset-12 {
        margin-left: 100%;
    }
}

@media (min-width: 992px) {

    .mui-col-lg-1,
    .mui-col-lg-10,
    .mui-col-lg-11,
    .mui-col-lg-12,
    .mui-col-lg-2,
    .mui-col-lg-3,
    .mui-col-lg-4,
    .mui-col-lg-5,
    .mui-col-lg-6,
    .mui-col-lg-7,
    .mui-col-lg-8,
    .mui-col-lg-9 {
        float: left;
    }

    .mui-col-lg-1 {
        width: 8.33333%;
    }

    .mui-col-lg-2 {
        width: 16.66667%;
    }

    .mui-col-lg-3 {
        width: 25%;
    }

    .mui-col-lg-4 {
        width: 33.33333%;
    }

    .mui-col-lg-5 {
        width: 41.66667%;
    }

    .mui-col-lg-6 {
        width: 50%;
    }

    .mui-col-lg-7 {
        width: 58.33333%;
    }

    .mui-col-lg-8 {
        width: 66.66667%;
    }

    .mui-col-lg-9 {
        width: 75%;
    }

    .mui-col-lg-10 {
        width: 83.33333%;
    }

    .mui-col-lg-11 {
        width: 91.66667%;
    }

    .mui-col-lg-12 {
        width: 100%;
    }

    .mui-col-lg-offset-0 {
        margin-left: 0;
    }

    .mui-col-lg-offset-1 {
        margin-left: 8.33333%;
    }

    .mui-col-lg-offset-2 {
        margin-left: 16.66667%;
    }

    .mui-col-lg-offset-3 {
        margin-left: 25%;
    }

    .mui-col-lg-offset-4 {
        margin-left: 33.33333%;
    }

    .mui-col-lg-offset-5 {
        margin-left: 41.66667%;
    }

    .mui-col-lg-offset-6 {
        margin-left: 50%;
    }

    .mui-col-lg-offset-7 {
        margin-left: 58.33333%;
    }

    .mui-col-lg-offset-8 {
        margin-left: 66.66667%;
    }

    .mui-col-lg-offset-9 {
        margin-left: 75%;
    }

    .mui-col-lg-offset-10 {
        margin-left: 83.33333%;
    }

    .mui-col-lg-offset-11 {
        margin-left: 91.66667%;
    }

    .mui-col-lg-offset-12 {
        margin-left: 100%;
    }
}

@media (min-width: 1200px) {

    .mui-col-xl-1,
    .mui-col-xl-10,
    .mui-col-xl-11,
    .mui-col-xl-12,
    .mui-col-xl-2,
    .mui-col-xl-3,
    .mui-col-xl-4,
    .mui-col-xl-5,
    .mui-col-xl-6,
    .mui-col-xl-7,
    .mui-col-xl-8,
    .mui-col-xl-9 {
        float: left;
    }

    .mui-col-xl-1 {
        width: 8.33333%;
    }

    .mui-col-xl-2 {
        width: 16.66667%;
    }

    .mui-col-xl-3 {
        width: 25%;
    }

    .mui-col-xl-4 {
        width: 33.33333%;
    }

    .mui-col-xl-5 {
        width: 41.66667%;
    }

    .mui-col-xl-6 {
        width: 50%;
    }

    .mui-col-xl-7 {
        width: 58.33333%;
    }

    .mui-col-xl-8 {
        width: 66.66667%;
    }

    .mui-col-xl-9 {
        width: 75%;
    }

    .mui-col-xl-10 {
        width: 83.33333%;
    }

    .mui-col-xl-11 {
        width: 91.66667%;
    }

    .mui-col-xl-12 {
        width: 100%;
    }

    .mui-col-xl-offset-0 {
        margin-left: 0;
    }

    .mui-col-xl-offset-1 {
        margin-left: 8.33333%;
    }

    .mui-col-xl-offset-2 {
        margin-left: 16.66667%;
    }

    .mui-col-xl-offset-3 {
        margin-left: 25%;
    }

    .mui-col-xl-offset-4 {
        margin-left: 33.33333%;
    }

    .mui-col-xl-offset-5 {
        margin-left: 41.66667%;
    }

    .mui-col-xl-offset-6 {
        margin-left: 50%;
    }

    .mui-col-xl-offset-7 {
        margin-left: 58.33333%;
    }

    .mui-col-xl-offset-8 {
        margin-left: 66.66667%;
    }

    .mui-col-xl-offset-9 {
        margin-left: 75%;
    }

    .mui-col-xl-offset-10 {
        margin-left: 83.33333%;
    }

    .mui-col-xl-offset-11 {
        margin-left: 91.66667%;
    }

    .mui-col-xl-offset-12 {
        margin-left: 100%;
    }
}

.mui-panel {
    padding: 20px; /* More padding */
    margin-bottom: 25px;
    border-radius: 4px; /* Rounded corners */
    background-color: #282828; /* Dark panel background */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Darker shadow */
}

.mui-panel:after,
.mui-panel:before {
    content: " ";
    display: table;
}

.mui-panel:after {
    clear: both;
}

.mui-select {
    display: block;
    padding-top: 18px;
    margin-bottom: 25px;
    position: relative;
}

.mui-select:focus {
    outline: 0;
}

.mui-select:focus>select {
    height: 36px;
    margin-bottom: -1px;
    border-color: #81c784; /* Primary green for focus */
    border-width: 2px;
}

.mui-select>select {
    -webkit-animation-duration: .1ms;
    animation-duration: .1ms;
    -webkit-animation-name: mui-node-inserted;
    animation-name: mui-node-inserted;
    display: block;
    height: 35px;
    width: 100%;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    outline: 0;
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.26); /* Lighter border */
    border-radius: 0;
    box-shadow: none;
    background-color: transparent;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNiIgd2lkdGg9IjEwIj48cG9seWdvbiBwb2ludHM9IjAsMCAxMCwwIDUsNiIgc3R5bGU9ImZpbGw6cmdiYSgyNTUsMjU1LDI1NSwwLjUpOyIvPjwvc3ZnPg=="); /* White caret for dark mode */
    background-repeat: no-repeat;
    background-position: right center;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.87);
    font-size: 16px;
    padding: 0 30px 0 0; /* More padding for caret */
}

.mui-select>select::-ms-expand {
    display: none;
}

.mui-select>select:focus {
    outline: 0;
    height: 36px;
    margin-bottom: -1px;
    border-color: #81c784;
    border-width: 2px;
}

.mui-select>select:disabled {
    color: rgba(255, 255, 255, 0.38);
    cursor: not-allowed;
    background-color: transparent;
    opacity: 1;
}

.mui-select__menu {
    position: absolute;
    z-index: 1;
    min-width: 100%;
    overflow-y: auto;
    padding: 10px 0;
    background-color: #282828;
    font-size: 16px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

.mui-select__menu>div {
    padding: 0 25px;
    height: 48px; /* Taller menu items */
    line-height: 48px;
    cursor: pointer;
    white-space: nowrap;
    color: rgba(255, 255, 255, 0.87);
}

.mui-select__menu>div:hover {
    background-color: #383838;
}

.mui-select__menu>div.mui--is-selected {
    background-color: #424242; /* Darker selected background */
    color: #81c784; /* Highlight selected text */
}

th {
    text-align: left;
}

.mui-table {
    width: 100%;
    max-width: 100%;
    margin-bottom: 25px;
    background-color: #282828; /* Dark table background */
    color: rgba(255, 255, 255, 0.87);
    border-radius: 4px;
    overflow: hidden; /* For rounded corners */
}

.mui-table>tbody>tr>td,
.mui-table>tbody>tr>th,
.mui-table>tfoot>tr>td,
.mui-table>tfoot>tr>th,
.mui-table>thead>tr>td,
.mui-table>thead>tr>th {
    padding: 12px 15px; /* More padding */
    line-height: 1.5;
}

.mui-table>thead>tr>th {
    border-bottom: 2px solid rgba(255, 255, 255, 0.12);
    font-weight: 700;
    color: rgba(255, 255, 255, 0.95);
}

.mui-table>tbody>tr:nth-child(even) {
    background-color: #2a2a2a; /* Slightly lighter row for zebra striping */
}

.mui-table>tbody+tbody {
    border-top: 2px solid rgba(255, 255, 255, 0.12);
}

.mui-table.mui-table--bordered>tbody>tr>td {
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    border-right: 1px solid rgba(255, 255, 255, 0.08); /* Vertical borders */
}

.mui-table.mui-table--bordered>tbody>tr>td:last-child {
    border-right: none;
}

.mui-tabs__bar {
    list-style: none;
    padding-left: 0;
    margin-bottom: 0;
    background-color: #282828; /* Dark tab bar background */
    white-space: nowrap;
    overflow-x: auto;
    border-radius: 4px 4px 0 0; /* Rounded top corners */
}

.mui-tabs__bar>li {
    display: inline-block;
}

.mui-tabs__bar>li>a {
    display: block;
    white-space: nowrap;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 15px;
    color: rgba(255, 255, 255, 0.6); /* Lighter color for inactive tabs */
    cursor: pointer;
    height: 52px; /* Taller tabs */
    line-height: 52px;
    padding-left: 28px;
    padding-right: 28px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    transition: color 0.2s ease-in-out;
}

.mui-tabs__bar>li>a:hover {
    text-decoration: none;
    color: rgba(255, 255, 255, 0.8); /* Brighter on hover */
}

.mui-tabs__bar>li.mui--is-active {
    border-bottom: 3px solid #81c784; /* Thicker primary green active indicator */
}

.mui-tabs__bar>li.mui--is-active>a {
    color: #81c784; /* Primary green for active tab text */
}

.mui-tabs__bar.mui-tabs__bar--justified {
    display: table;
    width: 100%;
    table-layout: fixed;
}

.mui-tabs__bar.mui-tabs__bar--justified>li {
    display: table-cell;
}

.mui-tabs__bar.mui-tabs__bar--justified>li>a {
    text-align: center;
    padding-left: 0;
    padding-right: 0;
}

.mui-tabs__pane {
    display: none;
    background-color: #202020; /* Darker background for pane */
    padding: 20px;
    border-radius: 0 0 4px 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.mui-tabs__pane.mui--is-active {
    display: block;
}

[data-mui-toggle=tab] {
    -webkit-animation-duration: .1ms;
    animation-duration: .1ms;
    -webkit-animation-name: mui-node-inserted;
    animation-name: mui-node-inserted;
}

.mui-textfield {
    display: block;
    padding-top: 20px; /* More padding */
    margin-bottom: 25px;
    position: relative;
}

.mui-textfield>label {
    position: absolute;
    top: 0;
    display: block;
    width: 100%;
    color: rgba(255, 255, 255, 0.54);
    font-size: 13px; /* Slightly larger label font */
    font-weight: 400;
    line-height: 18px;
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.mui-textfield>textarea {
    padding-top: 8px;
}

.mui-textfield>input,
.mui-textfield>textarea {
    display: block;
}

.mui-textfield>input:focus~label,
.mui-textfield>textarea:focus~label {
    color: #81c784; /* Primary green for focus */
}

.mui-textfield--float-label>label {
    position: absolute;
    -webkit-transform: translate(0, 20px);
    transform: translate(0, 20px);
    font-size: 17px; /* Slightly larger font for floating label */
    line-height: 36px;
    color: rgba(255, 255, 255, 0.36);
    text-overflow: clip;
    cursor: text;
    pointer-events: none;
    transition: all 0.2s ease-out; /* Smooth transition */
}

.mui-textfield--float-label>input:focus~label,
.mui-textfield--float-label>textarea:focus~label {
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
    font-size: 13px;
    line-height: 18px;
    text-overflow: ellipsis;
}

.mui-textfield--float-label>input:not(:focus).mui--is-not-empty~label,
.mui-textfield--float-label>input:not(:focus):not(:empty):not(.mui--is-empty):not(.mui--is-not-empty)~label,
.mui-textfield--float-label>input:not(:focus)[value]:not([value=""]):not(.mui--is-empty):not(.mui--is-not-empty)~label,
.mui-textfield--float-label>textarea:not(:focus).mui--is-not-empty~label,
.mui-textfield--float-label>textarea:not(:focus):not(:empty):not(.mui--is-empty):not(.mui--is-not-empty)~label,
.mui-textfield--float-label>textarea:not(:focus)[value]:not([value=""]):not(.mui--is-empty):not(.mui--is-not-empty)~label {
    color: rgba(255, 255, 255, 0.54);
    font-size: 13px;
    line-height: 18px;
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
    text-overflow: ellipsis;
}

.mui-textfield--wrap-label {
    display: table;
    width: 100%;
    padding-top: 0;
}

.mui-textfield--wrap-label:not(.mui-textfield--float-label)>label {
    display: table-header-group;
    position: static;
    white-space: normal;
    overflow-x: visible;
}

.mui-textfield>input,
.mui-textfield>textarea {
    -webkit-animation-duration: .1ms;
    animation-duration: .1ms;
    -webkit-animation-name: mui-node-inserted;
    animation-name: mui-node-inserted;
    display: block;
    background-color: transparent;
    color: rgba(255, 255, 255, 0.87);
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.26);
    outline: 0;
    width: 100%;
    font-size: 17px; /* Larger input font */
    padding: 0;
    box-shadow: none;
    border-radius: 0;
    background-image: none;
    transition: border-color 0.2s ease-out;
}

.mui-textfield>input:focus,
.mui-textfield>textarea:focus {
    border-color: #81c784; /* Primary green for focus */
    border-width: 2px;
}

.mui-textfield>input:-moz-read-only,
.mui-textfield>input:disabled,
.mui-textfield>textarea:-moz-read-only,
.mui-textfield>textarea:disabled {
    cursor: not-allowed;
    background-color: transparent;
    opacity: 0.7;
}

.mui-textfield>input:disabled,
.mui-textfield>input:read-only,
.mui-textfield>textarea:disabled,
.mui-textfield>textarea:read-only {
    cursor: not-allowed;
    background-color: transparent;
    opacity: 0.7;
}

.mui-textfield>input::-webkit-input-placeholder,
.mui-textfield>textarea::-webkit-input-placeholder {
    color: rgba(255, 255, 255, 0.36);
    opacity: 1;
}

.mui-textfield>input::-moz-placeholder,
.mui-textfield>textarea::-moz-placeholder {
    color: rgba(255, 255, 255, 0.36);
    opacity: 1;
}

.mui-textfield>input:-ms-input-placeholder,
.mui-textfield>textarea:-ms-input-placeholder {
    color: rgba(255, 255, 255, 0.36);
    opacity: 1;
}

.mui-textfield>input::placeholder,
.mui-textfield>textarea::placeholder {
    color: rgba(255, 255, 255, 0.36);
    opacity: 1;
}

.mui-textfield>input {
    height: 35px;
}

.mui-textfield>input:focus {
    height: 36px;
    margin-bottom: -1px;
}

.mui-textfield>textarea {
    min-height: 70px; /* Taller textareas */
}

.mui-textfield>textarea[rows]:not([rows="2"]):focus {
    margin-bottom: -1px;
}

.mui-textfield>input:invalid:not(:focus):not(:required),
.mui-textfield>input:invalid:not(:focus):required.mui--is-empty.mui--is-dirty,
.mui-textfield>input:invalid:not(:focus):required.mui--is-not-empty,
.mui-textfield>input:invalid:not(:focus):required:not(:empty):not(.mui--is-empty):not(.mui--is-not-empty),
.mui-textfield>input:invalid:not(:focus):required[value]:not([value=""]):not(.mui--is-empty):not(.mui--is-not-empty),
.mui-textfield>input:not(:focus).mui--is-invalid:not(:required),
.mui-textfield>input:not(:focus).mui--is-invalid:required.mui--is-empty.mui--is-dirty,
.mui-textfield>input:not(:focus).mui--is-invalid:required.mui--is-not-empty,
.mui-textfield>input:not(:focus).mui--is-invalid:required:not(:empty):not(.mui--is-empty):not(.mui--is-not-empty),
.mui-textfield>input:not(:focus).mui--is-invalid:required[value]:not([value=""]):not(.mui--is-empty):not(.mui--is-not-empty) {
    height: 36px;
    margin-bottom: -1px;
}

.mui-textfield>input:invalid:not(:focus):not(:required)~label,
.mui-textfield>input:invalid:not(:focus):required.mui--is-not-empty~label,
.mui-textfield>input:invalid:not(:focus):required:not(:empty):not(.mui--is-empty):not(.mui--is-not-empty)~label,
.mui-textfield>input:invalid:not(:focus):required[value]:not([value=""]):not(.mui--is-empty):not(.mui--is-not-empty)~label,
.mui-textfield>input:not(:focus).mui--is-invalid:not(:required)~label,
.mui-textfield>input:not(:focus).mui--is-invalid:required.mui--is-not-empty~label,
.mui-textfield>input:not(:focus).mui--is-invalid:required:not(:empty):not(.mui--is-empty):not(.mui--is-not-empty)~label,
.mui-textfield>input:not(:focus).mui--is-invalid:required[value]:not([value=""]):not(.mui--is-empty):not(.mui--is-not-empty)~label,
.mui-textfield>textarea:invalid:not(:focus):not(:required)~label,
.mui-textfield>textarea:invalid:not(:focus):required.mui--is-not-empty~label,
.mui-textfield>textarea:invalid:not(:focus):required:not(:empty):not(.mui--is-empty):not(.mui--is-not-empty)~label,
.mui-textfield>textarea:invalid:not(:focus):required[value]:not([value=""]):not(.mui--is-empty):not(.mui--is-not-empty)~label,
.mui-textfield>textarea:not(:focus).mui--is-not-empty~label,
.mui-textfield>textarea:not(:focus):not(:empty):not(.mui--is-empty):not(.mui--is-not-empty)~label,
.mui-textfield>textarea:not(:focus)[value]:not([value=""]):not(.mui--is-empty):not(.mui--is-not-empty)~label {
    color: #ff5252;
}

.mui-textfield:not(.mui-textfield--float-label)>input:invalid:not(:focus):required.mui--is-empty.mui--is-dirty~label,
.mui-textfield:not(.mui-textfield--float-label)>input:not(:focus).mui--is-invalid:required.mui--is-empty.mui--is-dirty~label,
.mui-textfield:not(.mui-textfield--float-label)>textarea:invalid:not(:focus):required.mui--is-empty.mui--is-dirty~label,
.mui-textfield:not(.mui-textfield--float-label)>textarea:not(:focus).mui--is-invalid:required.mui--is-empty.mui--is-dirty~label {
    color: #ff5252;
}

@-webkit-keyframes mui-node-inserted {
    from {
        opacity: .99
    }

    to {
        opacity: 1
    }
}

@keyframes mui-node-inserted {
    from {
        opacity: .99
    }

    to {
        opacity: 1
    }
}

.mui--no-transition {
    transition: none !important;
}

.mui--no-user-select {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.mui-caret {
    display: inline-block;
    width: 0;
    height: 0;
    margin-left: 3px;
    vertical-align: middle;
    border-top: 5px solid; /* Slightly larger caret */
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
    color: rgba(255, 255, 255, 0.6); /* Lighter caret color */
}

.mui--text-left {
    text-align: left !important;
}

.mui--text-right {
    text-align: right !important;
}

.mui--text-center {
    text-align: center !important;
}

.mui--text-justify {
    text-align: justify !important;
}

.mui--text-nowrap {
    white-space: nowrap !important;
}

.mui--align-baseline {
    vertical-align: baseline !important;
}

.mui--align-top {
    vertical-align: top !important;
}

.mui--align-middle {
    vertical-align: middle !important;
}

.mui--align-bottom {
    vertical-align: bottom !important;
}

.mui--text-dark {
    color: rgba(255, 255, 255, 0.87);
}

.mui--text-dark-secondary {
    color: rgba(255, 255, 255, 0.6);
}

.mui--text-dark-hint {
    color: rgba(255, 255, 255, 0.4);
}

.mui--text-light {
    color: #1a1a1a;
}

.mui--text-light-secondary {
    color: rgba(0, 0, 0, 0.7);
}

.mui--text-light-hint {
    color: rgba(0, 0, 0, 0.3);
}

.mui--text-accent {
    color: #f78c2e;
}

.mui--text-accent-secondary {
    color: #ff038f; /* Pink accent color */
    opacity: 0.7;
}

.mui--text-accent-hint {
    color: rgba(247, 140, 46, 0.4);
}

.mui--text-black {
    color: #000;
}

.mui--text-white {
    color: #FFF;
}

.mui--text-danger {
    color: #ff5252;
}

.mui-list--unstyled {
    padding-left: 0;
    list-style: none;
}

.mui-list--inline {
    padding-left: 0;
    list-style: none;
    margin-left: -5px;
}

.mui-list--inline>li {
    display: inline-block;
    padding-left: 5px;
    padding-right: 5px;
}

.mui--z1,
.mui-dropdown__menu,
.mui-select__menu {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 2px 5px rgba(0, 0, 0, 0.3); /* Darker shadows */
}

.mui--z2 {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.4);
}

.mui--z3 {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.35), 0 8px 8px rgba(0, 0, 0, 0.4);
}

.mui--z4 {
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.4), 0 12px 12px rgba(0, 0, 0, 0.35);
}

.mui--z5 {
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5), 0 18px 15px rgba(0, 0, 0, 0.4);
}

.mui--clearfix:after,
.mui--clearfix:before {
    content: " ";
    display: table;
}

.mui--clearfix:after {
    clear: both;
}

.mui--pull-right {
    float: right !important;
}

.mui--pull-left {
    float: left !important;
}

.mui--hide {
    display: none !important;
}

.mui--show {
    display: block !important;
}

.mui--invisible {
    visibility: hidden;
}

.mui--overflow-hidden {
    overflow: hidden !important;
}

.mui--overflow-hidden-x {
    overflow-x: hidden !important;
}

.mui--overflow-hidden-y {
    overflow-y: hidden !important;
}

.mui--visible-lg-block,
.mui--visible-lg-inline,
.mui--visible-lg-inline-block,
.mui--visible-md-block,
.mui--visible-md-inline,
.mui--visible-md-inline-block,
.mui--visible-sm-block,
.mui--visible-sm-inline,
.mui--visible-sm-inline-block,
.mui--visible-xl-block,
.mui--visible-xl-inline,
.mui--visible-xl-inline-block,
.mui--visible-xs-block,
.mui--visible-xs-inline,
.mui--visible-xs-inline-block {
    display: none !important;
}

@media (max-width: 543px) {
    .mui-visible-xs {
        display: block !important;
    }

    table.mui-visible-xs {
        display: table;
    }

    tr.mui-visible-xs {
        display: table-row !important;
    }

    td.mui-visible-xs,
    th.mui-visible-xs {
        display: table-cell !important;
    }

    .mui--visible-xs-block {
        display: block !important;
    }

    .mui--visible-xs-inline {
        display: inline !important;
    }

    .mui--visible-xs-inline-block {
        display: inline-block !important;
    }
}

@media (min-width: 544px) and (max-width: 767px) {
    .mui-visible-sm {
        display: block !important;
    }

    table.mui-visible-sm {
        display: table;
    }

    tr.mui-visible-sm {
        display: table-row !important;
    }

    td.mui-visible-sm,
    th.mui-visible-sm {
        display: table-cell !important;
    }

    .mui--visible-sm-block {
        display: block !important;
    }

    .mui--visible-sm-inline {
        display: inline !important;
    }

    .mui--visible-sm-inline-block {
        display: inline-block !important;
    }
}

@media (min-width: 768px) and (max-width: 991px) {
    .mui-visible-md {
        display: block !important;
    }

    table.mui-visible-md {
        display: table;
    }

    tr.mui-visible-md {
        display: table-row !important;
    }

    td.mui-visible-md,
    th.mui-visible-md {
        display: table-cell !important;
    }

    .mui--visible-md-block {
        display: block !important;
    }

    .mui--visible-md-inline {
        display: inline !important;
    }

    .mui--visible-md-inline-block {
        display: inline-block !important;
    }
}

@media (min-width: 992px) and (max-width: 1199px) {
    .mui-visible-lg {
        display: block !important;
    }

    table.mui-visible-lg {
        display: table;
    }

    tr.mui-visible-lg {
        display: table-row !important;
    }

    td.mui-visible-lg,
    th.mui-visible-lg {
        display: table-cell !important;
    }

    .mui--visible-lg-block {
        display: block !important;
    }

    .mui--visible-lg-inline {
        display: inline !important;
    }

    .mui--visible-lg-inline-block {
        display: inline-block !important;
    }
}

@media (min-width: 1200px) {
    .mui-visible-xl {
        display: block !important;
    }

    table.mui-visible-xl {
        display: table;
    }

    tr.mui-visible-xl {
        display: table-row !important;
    }

    td.mui-visible-xl,
    th.mui-visible-xl {
        display: table-cell !important;
    }

    .mui--visible-xl-block {
        display: block !important;
    }

    .mui--visible-xl-inline {
        display: inline !important;
    }

    .mui--visible-xl-inline-block {
        display: inline-block !important;
    }
}

@media (max-width: 543px) {
    .mui--hidden-xs {
        display: none !important;
    }
}

@media (min-width: 544px) and (max-width: 767px) {
    .mui--hidden-sm {
        display: none !important;
    }
}

@media (min-width: 768px) and (max-width: 991px) {
    .mui--hidden-md {
        display: none !important;
    }
}

@media (min-width: 992px) and (max-width: 1199px) {
    .mui--hidden-lg {
        display: none !important;
    }
}

@media (min-width: 1200px) {
    .mui--hidden-xl {
        display: none !important;
    }
}

body.mui-body--scroll-lock {
    overflow: hidden !important;
}

#mui-overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99999999;
    background-color: rgba(0, 0, 0, 0.4); /* Darker overlay */
    overflow: auto;
}

.mui-ripple-effect {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    opacity: 0;
    -webkit-animation: mui-ripple-animation 2s;
    animation: mui-ripple-animation 2s;
}

@-webkit-keyframes mui-ripple-animation {
    from {
        -webkit-transform: scale(1);
        transform: scale(1);
        opacity: .3; /* Slightly less opaque ripple */
    }

    to {
        -webkit-transform: scale(100);
        transform: scale(100);
        opacity: 0;
    }
}

@keyframes mui-ripple-animation {
    from {
        -webkit-transform: scale(1);
        transform: scale(1);
        opacity: .3;
    }

    to {
        -webkit-transform: scale(100);
        transform: scale(100);
        opacity: 0;
    }
}

.mui-btn>.mui-ripple-effect {
    background-color: rgba(255, 255, 255, 0.2); /* Lighter ripple for dark buttons */
}

.mui-btn--primary>.mui-ripple-effect {
    background-color: rgba(255, 255, 255, 0.3);
}

.mui-btn--dark>.mui-ripple-effect {
    background-color: rgba(255, 255, 255, 0.3);
}

.mui-btn--danger>.mui-ripple-effect {
    background-color: rgba(255, 255, 255, 0.3);
}

.mui-btn--accent>.mui-ripple-effect {
    background-color: rgba(255, 255, 255, 0.3);
}

.mui-btn--flat>.mui-ripple-effect {
    background-color: rgba(255, 255, 255, 0.1);

}

.mui--text-display4 {
    font-weight: 300;
    font-size: 100px; /* Slightly smaller */
    line-height: 100px;
    color: rgba(255, 255, 255, 0.98);
}

.mui--text-display3 {
    font-weight: 400;
    font-size: 52px;
    line-height: 52px;
    color: rgba(255, 255, 255, 0.95);
}

.mui--text-display2 {
    font-weight: 400;
    font-size: 42px;
    line-height: 46px;
    color: rgba(255, 255, 255, 0.95);
}

.mui--text-display1,
h1 {
    font-weight: 400;
    font-size: 38px;
    line-height: 44px;
    color: rgba(255, 255, 255, 0.95);
}

.mui--text-headline,
h2 {
    font-weight: 400;
    font-size: 28px;
    line-height: 36px;
    color: rgba(255, 255, 255, 0.95);
}

.mui--text-title,
h3 {
    font-weight: 400;
    font-size: 22px;
    line-height: 30px;
    color: rgba(255, 255, 255, 0.95);
}

.mui--text-subhead,
h4 {
    font-weight: 400;
    font-size: 18px;
    line-height: 26px;
    color: rgba(255, 255, 255, 0.9);
}

.mui--text-body2,
h5 {
    font-weight: 500;
    font-size: 15px;
    line-height: 24px;
    color: rgba(255, 255, 255, 0.87);
}

.mui--text-body1 {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: rgba(255, 255, 255, 0.87);
}

.mui--text-caption {
    font-weight: 400;
    font-size: 13px;
    line-height: 18px;
    color: rgba(255, 255, 255, 0.6);
}

.mui--text-menu {
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    color: rgba(255, 255, 255, 0.87);
}

.mui--text-button {
    font-weight: 500;
    font-size: 15px;
    line-height: 20px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.87);
}
.mui-btn {
  background-color: #c11c84
}
.mui-btn:hover {
  background-color: #ff038f
}
.song-panel {
    width: 100%; /* Macht das Panel 3x so breit (nimmt die volle verfügbare Breite ein) */
    /* Die ursprünglichen Klassen mui-col-md-12 und mui-col-lg-4 sind weiterhin im HTML,
       aber diese Regel überschreibt deren Breitenbeschränkung */
}

/* Optional: Um sicherzustellen, dass sie nicht nebeneinander floaten, falls das Grid-System das macht */
@media (min-width: 992px) { /* mui-col-lg-4 ist für größere Bildschirme */
    .song-panel.mui-col-lg-4 {
        width: 100%;
        float: none; /* Verhindert das Floaten, sodass sie untereinander erscheinen */
        margin-left: 0; /* Setzt eventuelle Margins zurück */
        margin-right: 0; /* Setzt eventuelle Margins zurück */
    }
}

@media (min-width: 768px) and (max-width: 991px) { /* mui-col-md-12 ist für mittlere Bildschirme */
    .song-panel.mui-col-md-12 {
        width: 100%;
        float: none; /* Verhindert das Floaten, sodass sie untereinander erscheinen */
        margin-left: 0; /* Setzt eventuelle Margins zurück */
        margin-right: 0; /* Setzt eventuelle Margins zurück */
    }
}

/* Für kleinere Bildschirme (<768px) ist mui-col-md-12 standardmäßig 100% breit,
   daher ist hier keine zusätzliche Breitenanpassung nötig, aber float:none kann nützlich sein. */
@media (max-width: 767px) {
    .song-panel.mui-col-md-12 { /* oder nur .song-panel, wenn es die einzige breitenrelevante Klasse ist */
        float: none;
        margin-left: 0;
        margin-right: 0;
    }
}
/* Stil für den Play-Button-Container */
.play {
    text-shadow: none !important; /* Entfernt jeglichen Text-Glow vom Container */
    box-shadow: none !important; /* Entfernt jeglichen Box-Glow vom Container */
    filter: none !important; /* Entfernt jegliche Filter (wie drop-shadow) vom Container */
    outline: none !important; /* Entfernt Fokus-Umrisse */
}

/* Stil für das Play-Icon selbst */
.fa-play {
    font-size: 300% !important; /* Macht das Icon 50% kleiner (wiederholen mit !important) */
    margin-right: 5px; /* Behält den Abstand bei */
    color: #81c784; /* Behält die grüne Farbe bei */

    text-shadow: none !important; /* Entfernt jeglichen Text-Glow */
    box-shadow: none !important; /* Entfernt jeglichen Box-Glow */
    filter: none !important; /* Entfernt jegliche Filter (wie drop-shadow) */
    outline: none !important; /* Entfernt Fokus-Umrisse */
}

/* Um sicherzustellen, dass keine Effekte beim Hover oder Fokus erscheinen */
.play:hover,
.play:focus,
.fa-play:hover,
.fa-play:focus {
    text-shadow: none !important;
    box-shadow: none !important;
    filter: none !important;
    outline: none !important;
}
.mode-icon {
  color: white
}
.mui-textfield > input {
    padding: 8px 12px;
    height: 42px;
    border: 1px solid rgba(255, 255, 255, 0.12) !important; /* Zwingt den Rahmen zu dieser Farbe und Dicke */
    border-radius: 4px;
    background-color: #282828 !important; /* Zwingt den dunklen Hintergrund */
    color: rgba(255, 255, 255, 0.87);
    box-shadow: none !important; /* Zwingt die Entfernung von Schatten */
    transition: border-color 0.2s ease-out, box-shadow 0.2s ease, background-color 0.3s ease;
    background-image: none !important; /* Zwingt die Entfernung von Hintergrundbildern/Verläufen */
}

.mui-textfield > input:focus {
    border-color: #81c784 !important; /* Zwingt den grünen Fokusrahmen */
    border-width: 2px;
    box-shadow: 0 0 0 2px rgba(129, 199, 132, 0.3) !important; /* Zwingt den Fokus-Glow */
    height: 42px;
}

.mui-textfield > input:hover:not(:focus) {
    background-color: #333333 !important; /* Zwingt den dunkleren Hover-Hintergrund */
    border-color: rgba(255, 255, 255, 0.2) !important; /* Zwingt den Hover-Rahmen */
}

/* Anpassung der Position des schwebenden Labels, damit es zur neuen Feldhöhe passt */
.mui-textfield--float-label > label {
    -webkit-transform: translate(0, 14px);
    transform: translate(0, 14px);
    line-height: normal;
}

/* Anpassung der Höhe für den Invalid-Zustand */
.mui-textfield > input:invalid:not(:focus):not(:required),
.mui-textfield > input:invalid:not(:focus):required.mui--is-empty.mui--is-dirty,
.mui-textfield > input:invalid:not(:focus):required.mui--is-not-empty,
.mui-textfield > input:invalid:not(:focus):required:not(:empty):not(.mui--is-empty):not(.mui--is-not-empty),
.mui-textfield > input:invalid:not(:focus):required[value]:not([value=""]):not(.mui--is-empty):not(.mui--is-not-empty),
.mui-textfield > input:not(:focus).mui--is-invalid:not(:required),
.mui-textfield > input:not(:focus).mui--is-invalid:required.mui--is-empty.mui--is-dirty,
.mui-textfield > input:not(:focus).mui--is-invalid:required.mui--is-not-empty,
.mui-textfield > input:not(:focus).mui--is-invalid:required:not(:empty):not(.mui--is-empty):not(.mui--is-not-empty),
.mui-textfield > input:not(:focus).mui--is-invalid:required[value]:not([value=""]):not(.mui--is-empty):not(.mui--is-not-empty) {
    height: 42px;
    margin-bottom: 0;
}
.beta-logo {
  display: none
}
.title {
  max-width: 900px !important;
  height: 300px;
  margin-left: auto !important;
  margin-right: auto !important;
  font-size: 0 !important; /* Versteckt eventuellen Textinhalt */
  height: 60px !important; /* Setzt die Höhe für das Bild */
  background-image: url('https://master3307.netlify.app/assets/media/osufy!.webp') !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  background-size: 20%;
}
.mui--text-accent-secondary {
	/*Your code should go under this comment*/
}
.mui-panel:nth-child(1) #pane-4989721 .song-image {
	/*Your code should go under this comment*/
}

`; // <-- DO NOT DELETE THIS BACKTICK OR SEMICOLON

  // This part injects the custom CSS into the page.

  const styleElement = document.createElement("style");
  styleElement.textContent = customCss;
  document.head.appendChild(styleElement);
  // --- END OF CUSTOM CSS INJECTION ---

  // Define a unique class name for the number span to easily check for its existence
  const NUMBER_SPAN_CLASS = "osufy-added-song-number";

  // --- Main function to add and style Spotify song numbers ---
  function addSpotifySongNumbers() {
    // Select all the H2 tags that represent the Spotify song titles
    // Update selector to include potential elements generated by your script if they use a different structure
    const songTitles = document.querySelectorAll(".mui-panel h2"); // Assuming your generated panels also use h2

    if (songTitles.length > 0) {
      songTitles.forEach((titleElement, index) => {
        // Check if this title element already contains our unique number span.
        // This prevents adding numbers multiple times.
        if (titleElement.querySelector(`.${NUMBER_SPAN_CLASS}`)) {
          return; // If it does, skip this element.
        }

        // Create a text node with the number and a space.
        const numberTextNode = document.createTextNode(`${index + 1}. `);

        // Create a span to apply custom styles and add our unique class.
        const numberSpan = document.createElement("span");
        numberSpan.classList.add(NUMBER_SPAN_CLASS); // Add the unique class.
        numberSpan.appendChild(numberTextNode);
        numberSpan.style.fontSize = "2em"; // Make the number bigger.
        numberSpan.style.color = "#FF327A"; // Make the number pink.
        numberSpan.style.fontWeight = "bold"; // Make it bold for more prominence.
        numberSpan.style.marginRight = "10px"; // Add some space after the number.

        // Add the styled number span to the beginning of the H2 title.
        titleElement.prepend(numberSpan);
      });
    }
  }

  // --- MutationObserver to handle dynamically loaded content ---
  // Keep the existing observer to add numbers to elements added by the original site
  const observer = new MutationObserver((mutationsList, observer) => {
    const songsContainer = document.getElementById("songs");
    if (songsContainer) {
      let changesDetected = false;
      for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          // Check if any newly added nodes are song panels (containing h2 elements).
          // This helps detect when the original Osufy site loads results.
          const relevantNodes = Array.from(mutation.addedNodes).some(
            (node) =>
              node.nodeType === Node.ELEMENT_NODE &&
              node.classList.contains("mui-panel") &&
              node.querySelector("h2")
          );
          if (relevantNodes) {
            changesDetected = true;
            break;
          }
        }
      }
      if (changesDetected) {
        // Disconnect the observer temporarily
        observer.disconnect();
        // Re-run the function to add numbers to all relevant song titles (including new ones).
        addSpotifySongNumbers();
        // Reconnect the observer after modifications are complete.
        observer.observe(songsContainer, { childList: true, subtree: true });
      }
    }
  });

  // --- Initial setup and execution ---
  // Get the container where the songs are dynamically loaded.
  const songsContainer = document.getElementById("songs");
  if (songsContainer) {
    // Start observing the songs container for changes (e.g., when new songs are loaded via AJAX by Osufy).
    observer.observe(songsContainer, { childList: true, subtree: true });
  }

  // Run the function once when the initial HTML document is fully loaded (before external resources like images/CSS).
  document.addEventListener("DOMContentLoaded", addSpotifySongNumbers);

  // Run it again a short time after the entire page (including all resources) has loaded.
  // This helps catch any content that might be rendered very late or via complex dynamic processes.
  window.addEventListener("load", () => {
    setTimeout(addSpotifySongNumbers, 500);
  });

  function createBeatmapHtml(beatmap, index) {
    const panel = document.createElement("div");
    panel.classList.add("mui-col-md-12", "mui-col-lg-4", "song-panel");

    const muiPanel = document.createElement("div");
    muiPanel.classList.add("mui-panel");

    // Create tabs wrapper for difficulties
    const tabsWrapper = document.createElement("div");
    tabsWrapper.classList.add("mui-tabs-wrapper");

    // For each difficulty in the beatmap
    beatmap.difficulties.forEach((diff, diffIndex) => {
      const pane = document.createElement("div");
      pane.classList.add("mui-tabs__pane");
      if (diffIndex === 0) pane.classList.add("mui--is-active");
      pane.id = `pane-${beatmap.beatmapsetId}-${diffIndex}`;

      // Create difficulty info section
      const diffInfo = document.createElement("div");
      diffInfo.classList.add("mui-col-md-12", "diff-info", "padding-left-0");

      // Add difficulty stats (AR, OD, CS, HP, BPM)
      const stats = [
        { text: "AR", value: diff.ar || "?", title: "Approach rate" },
        { text: "OD", value: diff.od || "?", title: "Overall difficulty" },
        { text: "CS", value: diff.cs || "?", title: "Circle size" },
        { text: "HP", value: diff.hp || "?", title: "Health drain" },
        { text: "BPM", value: beatmap.bpm || "?", title: "Beats Per Minute" },
      ];

      stats.forEach((stat) => {
        const div = document.createElement("div");
        div.classList.add("mui--z1");
        div.title = stat.title;
        div.innerHTML = `
                <span>
                    <span class="info-text">${stat.text}</span>
                    <span class="info-value">${stat.value}</span>
                </span>
            `;
        diffInfo.appendChild(div);
      });

      pane.appendChild(diffInfo);
      tabsWrapper.appendChild(pane);
    });

    // Add the rest of the beatmap info (image, metadata, etc.)
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("mui-col-md-12", "padding-left-0");

    // Create image container with play button
    const imgCol = document.createElement("div");
    imgCol.classList.add("song-image", "mui--z2");
    imgCol.style.background = `url('${
      beatmap.cover || "//via.placeholder.com/150"
    }')`;

    const playButton = document.createElement("span");
    playButton.classList.add("play");
    playButton.dataset.id = beatmap.beatmapsetId;
    playButton.innerHTML = '<i class="fa fa-play"></i>';

    imgCol.appendChild(playButton);
    contentDiv.appendChild(imgCol);

    // Add song info
    const songInfo = document.createElement("div");
    songInfo.classList.add("song-info");
    songInfo.innerHTML = `
        <div title="Creator"><i class="fa fa-user"></i> <a href="http://osu.ppy.sh/users/${
          beatmap.creator
        }" target="_blank">${beatmap.creator}</a></div>
        <div title="Genre"><i class="fa fa-paint-brush"></i> ${
          beatmap.genre || "Unknown"
        }</div>
    `;
    contentDiv.appendChild(songInfo);

    // Add download buttons
    const infoWrapper = document.createElement("div");
    infoWrapper.classList.add(
      "info-wrapper",
      "mui-col-xs-12",
      "padding-left-0"
    );
    infoWrapper.innerHTML = `
        <div class="download-buttons">
            <a href="${beatmap.downloadUrl}" target="_blank" title="Download from osu! website"><i class="fa fa-download"></i></a>
            &nbsp; <i class="mui--divider-left"></i>&nbsp;
            <a href="osu://dl/${beatmap.beatmapsetId}" title="Download from osu!direct"><i class="fa fa-cloud-download"></i></a>
        </div>
    `;
    contentDiv.appendChild(infoWrapper);

    muiPanel.appendChild(tabsWrapper);
    muiPanel.appendChild(contentDiv);
    panel.appendChild(muiPanel);

    return panel;
  }
})();
