// ==UserScript==
// @name         Copy Video Source Link
// @namespace    https://naeembolchhi.github.io/
// @version      2.38
// @description  Copies the source URL of the currently playing video in various streaming sites to clipboard, opens it in a new tab, or provides a safe-to-share link.
// @author       NaeemBolchhi
// @license      GPL-3.0-or-later
// @match        https://www2.movies7.to/*
// @match        https://4anime.biz/*
// @match        https://sflix.to/*
// @match        https://solarmovies.win/*
// @match        https://solarmovie.ma/*
// @match        https://animepahe.com/*
// @match        https://aniwave.to/*
// @match        https://azm.to/*
// @match        https://cineb.net/*
// @match        https://flixtor.video/*
// @match        https://flixtor.id/*
// @match        https://fmovies.to/*
// @match        https://fmovies2.cx/*
// @match        https://fmovies.kim/*
// @match        https://fmovies.ps/*
// @match        https://1fmovies.co/*
// @match        https://streamm4u.com/*
// @match        https://hdonline.co/*
// @match        https://9goaltv.cc/*
// @match        https://9goaltv.in/*
// @match        https://kissasian.li/*
// @match        https://*.fboxtv.com/*
// @match        https://filmoflix.app/*
// @match        https://filmoflix.zip/*
// @icon         data:image/png;base64,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
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439879/Copy%20Video%20Source%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/439879/Copy%20Video%20Source%20Link.meta.js
// ==/UserScript==

(function() {
'use strict';

// Various ICONs used in the script.
const toggleSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M7 11H1v2h6v-2zm2.17-3.24L7.05 5.64 5.64 7.05l2.12 2.12 1.41-1.41zM13 1h-2v6h2V1zm5.36 6.05l-1.41-1.41-2.12 2.12 1.41 1.41 2.12-2.12zM17 11v2h6v-2h-6zm-5-2c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm2.83 7.24l2.12 2.12 1.41-1.41-2.12-2.12-1.41 1.41zm-9.19.71l1.41 1.41 2.12-2.12-1.41-1.41-2.12 2.12zM11 23h2v-6h-2v6z"/></svg>';
const copySVG = '<svg id="orb-copy-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>';
const copyGREEN = '<svg id="orb-green-svg" style="display: none;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M22,5.18L10.59,16.6l-4.24-4.24l1.41-1.41l2.83,2.83l10-10L22,5.18z M19.79,10.22C19.92,10.79,20,11.39,20,12 c0,4.42-3.58,8-8,8s-8-3.58-8-8c0-4.42,3.58-8,8-8c1.58,0,3.04,0.46,4.28,1.25l1.44-1.44C16.1,2.67,14.13,2,12,2C6.48,2,2,6.48,2,12 c0,5.52,4.48,10,10,10s10-4.48,10-10c0-1.19-0.22-2.33-0.6-3.39L19.79,10.22z"/></svg>';
const copyRED = '<svg id="orb-red-svg" style="display: none;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"/></svg>';
const linkSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>';
const shareSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>';

// Some variables for recognizing links and websites.
let sourceLINK = "document.querySelector('iframe').src";
let sitename = window.location.hostname;

// JSON for site matching.
const siteLIST = [
    {"match": "sflix", "video": "#iframe-embed"},
    {"match": "kissasian", "video": "#my_video_1"}
];

// Loop with siteLIST to set proper sourceLINK value.
(function() {
    for (let x = 0; x < siteLIST.length; x++) {
        if (sitename.match(siteLIST[x].match)) {
            sourceLINK = "document.querySelector('" + siteLIST[x].video + "').src";
        }
    }
})();

// Define dark and light colors.
const orbWhite = `:root {
  --orb-background-100: #f8f8ff;
  --orb-background-95: #eaeaf2;
  --orb-background-reverse: #0f0f0f;
  --orb-foreground: #000000;
  --orb-foreground-reverse: #f8f8ff;
  --orb-warning-red: #ff0000;
  --orb-success-green: #28cc28;
}`;
const orbBlack = `:root {
  --orb-background-100: #0f0f0f;
  --orb-background-95: #1c1c1c;
  --orb-background-reverse: #f8f8ff;
  --orb-foreground: #f8f8ff;
  --orb-foreground-reverse: #0f0f0f;
  --orb-warning-red: #7f0000;
  --orb-success-green: #146614;
}`;

// Function for setting theme choice.
function orbColor() {
    if (sitename.match(/streamm4u/)) {
        return orbBlack;
    } else {
        return orbWhite;
    }
}

// Functions for injecting CSS, JS, and HTML.
function addStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {window.location.reload();}
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
function addScript(js) {
    var body, script;
    body = document.getElementsByTagName('body')[0];
    if (!body) {window.location.reload();}
    script = document.createElement('script');
    script.type = "text/javascript";
    script.innerHTML = js;
    body.appendChild(script);
}
function addElement(html) {
    var body, element;
    body = document.getElementsByTagName('body')[0];
    if (!body) {window.location.reload();}
    element = document.createElement('controlcenter');
    element.innerHTML = html;
    body.appendChild(element);
}

// Defining CSS of the script.
const toggleStyle = `
@import url("https://fonts.googleapis.com/css2?family=PT+Sans&display=swap");
${orbColor()}
orbinfo {
  background: var(--orb-background-100);
  border-radius: 50px;
  bottom: 0;
  box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.45);
  color: var(--orb-foreground);
  font-family: "PT Sans", sans-serif !important;
  font-size: 14px;
  left: 80px;
  line-height: 1;
  opacity: 0;
  padding: 4px 10px;
  position: fixed;
  transition: opacity 240ms ease-in-out;
  white-space: nowrap;
  z-index: -2147483647;
}
orbinfo.orb-toggle {
  transform: translate(0,-39px);
}
orbinfo.orb-copy {
  transform: translate(0,-99px);
}
orbinfo.orb-link {
  transform: translate(0,-159px);
}
orbinfo.orb-share {
  transform: translate(0,-219px);
}
orbinfo.orb-active {
  opacity: 1;
  z-index: 2147483647;
}
orb {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 30px;
  left: 25px;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.35);
}
orb:hover {
  box-shadow: 0 0 4.5px 1.5px rgba(0, 0, 0, 0.45);
  cursor: pointer;
}
orb > svg {
  box-sizing: content-box;
  fill: var(--orb-foreground) !important;
  height: 20px;
  width: 20px;
}
orb.orb-control-toggle {
  background: var(--orb-background-100);
  opacity: 0.3;
  transform: translate(0,0);
  z-index: 2147483647;
  transition: transform 150ms ease-in-out, opacity 240ms;
}
orb.orb-control-toggle:hover {
  opacity: 1;
  transition: transform 150ms ease-in-out, opacity 240ms;
}
orb.orb-control-toggle > svg {
  transform: rotate(0deg);
  transition: transform 200ms ease-in-out;
}
orb.orb-control-copy {
  background: var(--orb-background-95);
  transform: translate(0,-60px);
  z-index: 2147483646;
  transition: transform 150ms ease-in-out, opacity 240ms;
}
orb.orb-control-link {
  background: var(--orb-background-95);
  transform: translate(0,-120px);
  z-index: 2147483645;
  transition: transform 150ms ease-in-out, opacity 240ms;
}
orb.orb-control-share {
  background: var(--orb-background-95);
  transform: translate(0,-180px);
  z-index: 2147483644;
  transition: transform 150ms ease-in-out, opacity 240ms;
}
orb.orb-hidden {
  transform: translate(0,0);
  opacity: 0;
  transition: transform 150ms ease-in-out, opacity 240ms;
}
orb.orb-active {
  opacity: 1 !important;
}
orb.orb-active > svg {
  transform: rotate(180deg);
  transition: transform 200ms ease-in-out;
}
orb.orb-color-red {
  background: var(--orb-warning-red) !important;
}
orb.orb-color-green {
  background: var(--orb-success-green) !important;
}
orb.orb-color-red > #orb-red-svg, orb.orb-color-green > #orb-green-svg {
  display: inline !important;
}
orb.orb-color-red > #orb-copy-svg, orb.orb-color-green > #orb-copy-svg {
  display: none !important;
}
orb.orb-color-flip {
  background: var(--orb-background-reverse) !important;
}
orb.orb-color-flip > svg {
  fill: var(--orb-foreground-reverse) !important;
}
div.orb-curtain {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 2147483640;
}
div.orb-nothing {
  display: none;
}
`;

// Defining HTML of the script.
const toggleElement = `
<orbinfo class="orb-toggle">Toggle Quick Commands</orbinfo>
<orbinfo class="orb-copy">Copy Video Source Link</orbinfo>
<orbinfo class="orb-link">Open Video Source Link in New Tab</orbinfo>
<orbinfo class="orb-share">Get Safely Sharable Video Link</orbinfo>
<orb class="orb-control-toggle" onclick="setOrbLink();">${toggleSVG}</orb>
<orb class="orb-control-copy orb-hidden">${copySVG + copyGREEN + copyRED}</orb>
<a target="_blank"><orb class="orb-control-link orb-hidden">${linkSVG}</orb></a>
<a target="_blank"><orb class="orb-control-share orb-hidden">${shareSVG}</orb></a>
<div class="orb-curtain orb-nothing"></div>
`;

// Defining JS of the script.
const toggleScript = `
function setOrbLink() {
    if (!document.querySelector('iframe')) {
        alert('No video found. Play a video first.');
        return;
    } else {
        document.querySelector('orb.orb-control-link').parentNode.href = ${sourceLINK};
        var encodedLINK = encodeURIComponent(document.querySelector('orb.orb-control-link').parentNode.href);
        document.querySelector('orb.orb-control-share').parentNode.href = "https://disshit.github.io/take.html?x=lnk&y=" + encodedLINK + "&z=1";
    }
}
document.querySelector('orb.orb-control-copy').addEventListener("click", (function() {
    navigator.clipboard.writeText(${sourceLINK}).then(function() {
        document.querySelector('orb.orb-control-copy').classList.add('orb-color-green');
    }, function() {
        document.querySelector('orb.orb-control-copy').classList.add('orb-color-red');
    });
    setTimeout((function(){
        document.querySelector('orb.orb-control-copy').classList.remove('orb-color-green');
        document.querySelector('orb.orb-control-copy').classList.remove('orb-color-red');
    }),1000);
}));

function orbToggleMain() {
    if (document.querySelector('orb.orb-control-copy').className.match(/hidden/i)) {
        if (document.querySelector('iframe')) {
            document.querySelector('orb.orb-control-copy').classList.remove('orb-hidden');
            document.querySelector('orb.orb-control-link').classList.remove('orb-hidden');
            document.querySelector('orb.orb-control-share').classList.remove('orb-hidden');
            document.querySelector('orb.orb-control-toggle').classList.add('orb-active');
            document.querySelector('div.orb-curtain').classList.remove('orb-nothing');
        }
	} else {
        document.querySelector('orb.orb-control-copy').classList.add('orb-hidden');
        document.querySelector('orb.orb-control-link').classList.add('orb-hidden');
        document.querySelector('orb.orb-control-share').classList.add('orb-hidden');
        document.querySelector('orb.orb-control-toggle').classList.remove('orb-active');
        document.querySelector('orbinfo.orb-toggle').classList.remove('orb-active');
        document.querySelector('orbinfo.orb-copy').classList.remove('orb-active');
        document.querySelector('orbinfo.orb-link').classList.remove('orb-active');
        document.querySelector('orbinfo.orb-share').classList.remove('orb-active');
        document.querySelector('div.orb-curtain').classList.add('orb-nothing');
	}
}
document.querySelector('orb.orb-control-toggle').addEventListener("click", orbToggleMain);
document.querySelector('div.orb-curtain').addEventListener("click", orbToggleMain);

document.querySelector('orb.orb-control-link').parentNode.addEventListener("click", (function() {
    document.querySelector('orb.orb-control-link').classList.add('orb-color-flip');
    setTimeout((function(){
        document.querySelector('orb.orb-control-link').classList.remove('orb-color-flip');
    }),1000);
}));
document.querySelector('orb.orb-control-share').parentNode.addEventListener("click", (function() {
    document.querySelector('orb.orb-control-share').classList.add('orb-color-flip');
    setTimeout((function(){
        document.querySelector('orb.orb-control-share').classList.remove('orb-color-flip');
    }),1000);
}));
document.querySelector('orb.orb-control-toggle').addEventListener("mouseover", (function() {
	document.querySelector('orbinfo.orb-toggle').classList.add('orb-active');
}));

document.querySelector('orb.orb-control-toggle').addEventListener("mouseout", (function() {
	document.querySelector('orbinfo.orb-toggle').classList.remove('orb-active');
}));
document.querySelector('orb.orb-control-copy').addEventListener("mouseover", (function() {
	document.querySelector('orbinfo.orb-copy').classList.add('orb-active');
}));
document.querySelector('orb.orb-control-copy').addEventListener("mouseout", (function() {
	document.querySelector('orbinfo.orb-copy').classList.remove('orb-active');
}));
document.querySelector('orb.orb-control-link').addEventListener("mouseover", (function() {
	document.querySelector('orbinfo.orb-link').classList.add('orb-active');
}));
document.querySelector('orb.orb-control-link').addEventListener("mouseout", (function() {
	document.querySelector('orbinfo.orb-link').classList.remove('orb-active');
}));
document.querySelector('orb.orb-control-share').addEventListener("mouseover", (function() {
	document.querySelector('orbinfo.orb-share').classList.add('orb-active');
}));
document.querySelector('orb.orb-control-share').addEventListener("mouseout", (function() {
	document.querySelector('orbinfo.orb-share').classList.remove('orb-active');
}));
`;

// Invoking injection functions with appropriate constants.
addStyle(toggleStyle); addElement(toggleElement); addScript(toggleScript);

})();