// ==UserScript==
// @name        Dimmer (Dark Reader)
// @description Toggle dark mode using an icon placed at the bottom left of your screen. Hotkey: Command + Shift + B.
// @author      Schimon Jehudah, Adv.
// @namespace   i2p.schimon.dimmer
// @homepageURL https://greasyfork.org/scripts/466058-dark-reader
// @supportURL  https://greasyfork.org/scripts/466058-dark-reader/feedback
// @copyright   2023 - 2026, Schimon Jehudah (http://schimon.i2p)
// @license     MIT; https://opensource.org/licenses/MIT
// @icon        data:image/svg+xml;base64,CiAgICA8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDEwMCAxMDAiPgogICAgICAgIDx0ZXh0IHk9Ii45ZW0iIGZvbnQtc2l6ZT0iOTAiPuKYrzwvdGV4dD4KICAgIDwvc3ZnPgogIA==
// @exclude     devtools://*
// @match       file:///*
// @match       *://*/*
// @version     26.01.13
// @require     https://unpkg.com/darkreader@4.9.58/darkreader.js
// @grant       GM.getValue
// @grant       GM.registerMenuCommand
// @grant       GM.setValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/466058/Dimmer%20%28Dark%20Reader%29.user.js
// @updateURL https://update.greasyfork.org/scripts/466058/Dimmer%20%28Dark%20Reader%29.meta.js
// ==/UserScript==

/*

TODO

Toggle color of button.
See https://noscript.net/ or
use a plain character "●".

NOTE

https://greasyfork.org/en/scripts/390218-block
https://ao.vern.cc/questions/3250790/making-a-div-that-covers-the-entire-page
https://javascripttutorial.net/javascript-dom/javascript-page-load-events/

*/

DarkReader.setFetchMethod(window.fetch); // https://eligrey.com/

(async function createButton() {
  if (await GM.getValue("dimmer")) {
    enable();
  }
  await GM.registerMenuCommand("Toggle dark mode", () => toggle(), "T");
})();

// set hotkey
document.onkeyup = function(e) {
  //if (e.ctrlKey && e.shiftKey && e.which == 190) { // Ctrl + Shift + <
  //if (e.metaKey && e.shiftKey && e.which == 68) { // Command + Shift + D
  if (e.metaKey && e.shiftKey && e.which == 66) { // Command + Shift + B
    toggle();
  }
};

// TODO Toggle menu item 🔆 🔅 / ☀️ 🌕 / 🌤 🌥 / 🌕 🌙 / 💡 🕯 / ⚪ ⚫ / 🏳 🏴
async function toggle() {
  if (await GM.getValue("dimmer")) {
    await GM.setValue("dimmer", false);
    disable();
    notification("Dark color scheme is disabled.", "⚪");
  } else {
    await GM.setValue("dimmer", true);
    enable();
    notification("Dark color scheme is enabled.", "⚫");
  }
}

function disable() {
  DarkReader.disable({
    brightness: 100,
    contrast: 90,
    sepia: 10
  });
}

function enable() {
  DarkReader.enable({
    brightness: 100,
    contrast: 90,
    sepia: 10
  });
}

// Set mode temporarily per session or until storage is cleared

function getPreference(key) {
  return window.localStorage.getItem(key);
}

function setPreference(key, value) {
  return window.localStorage.setItem(key, value);
}

function characterAsSvgDataUri(character) {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <text y=".9em" font-size="90">${character}</text>
    </svg>
  `;
  const base64Svg = btoa(unescape(encodeURIComponent(svgString)));
  return `data:image/svg+xml;base64,${base64Svg}`;
}

function notification(message, graphics) {
  console.info("☯ Dimmer: " + message);
  if (typeof GM !== "undefined" && typeof GM.notification === "function") {
    GM.notification(message, "☯ Dimmer", characterAsSvgDataUri(graphics));
  } else {
    alert(message);
  }
}
