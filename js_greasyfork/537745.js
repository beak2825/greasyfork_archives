// ==UserScript==
// @name         Extension STF [privé] by kpri
// @version      1.1
// @description  Copie l'URL source de la vidéo en cours de lecture sur divers sites de streaming dans le presse-papiers, l'ouvre dans un nouvel onglet ou fournit un lien de partage sécurisé.
// @author       KPRI
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
// @match        https://www.lebonstream.kim/*
// @match        https://papadustream.mov/*
// @match        https://monstream.to/*
// @match        https://justdaz.org/*
// @match        https://www.wawacity.al/*
// @match        https://lemissyl.fr/*
// @match        https://wiflix-catalogue.net/*
// @match        https://www.cpasmieux.is/*
// @match        https://www.voiranime.top/*
// @match        https://anime-sama.fr/*
// @match        https://filmoflix.dev/*
// @match        https://filmoflix.bz/*
// @match        https://v5.voiranime.com/*
// @match        https://www.papstream.fr/*
// @match        https://ww2.123streaming.buzz/*
// @match        https://fr.papystreaming.vip/*
// @match        https://www.cocostream.cam/*
// @match        https://senpai-stream.tv/*
// @match        https://wwv.wookafr.org/*
// @match        https://flemmix.ws/*
// @match        https://raphaelsimonet.fr/*
// @match        https://v1.justdaz.org/*
// @match        https://kameo.tv/*
// @run-at       document-idle
// @grant        none
// @namespace https://greasyfork.org/users/1237914
// @downloadURL https://update.greasyfork.org/scripts/537745/Extension%20STF%20%5Bpriv%C3%A9%5D%20by%20kpri.user.js
// @updateURL https://update.greasyfork.org/scripts/537745/Extension%20STF%20%5Bpriv%C3%A9%5D%20by%20kpri.meta.js
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