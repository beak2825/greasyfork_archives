// ==UserScript==
// @name        Dark Reader
// @description Toggle dark mode using an icon placed at the bottom left of your screen. Hotkey: Command + Shift + B
// @author      Schimon Jehudah, Adv.
// @namespace   i2p.schimon.dimmer
// @homepageURL https://greasyfork.org/en/scripts/466058-dark-reader
// @supportURL  https://greasyfork.org/en/scripts/466058-dark-reader/feedback
// @copyright   2023, Schimon Jehudah (http://schimon.i2p)
// @license     MIT; https://opensource.org/licenses/MIT
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7wn5SFPC90ZXh0Pjwvc3ZnPgo=
// @match       *://*/*
// @exclude     devtools://*
// @version     23.06.11
// @require     https://unpkg.com/darkreader@4.9.58/darkreader.js
// @noframes
// @grant       GM.getValue
// @grant       GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/466058/Dark%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/466058/Dark%20Reader.meta.js
// ==/UserScript==

/* TODO

Toggle color of button.
btn.style.filter = 'hue-rotate(500deg)'
See https://noscript.net/ or
use a plain character '●'.
btn.style.color = 'black' */


if (document.doctype == null) { return; }

//enable()

const
  namespace = 'i2p-schimon-dimmer',
  btn = document.createElement(namespace);

// create button
(async function createButton() {
  // create element
  document.body.append(btn);
  // set content
  btn.textContent = '🔆';
  btn.id = namespace;
  btn.style.all = 'unset';
  // set position
  btn.style.position = 'fixed';
  btn.style.bottom = 0;
  btn.style.left = 0;
  // set appearance
  btn.style.marginTop = '100px';
  btn.style.marginRight = '10px';
  btn.style.minWidth = '50px';
  btn.style.minHeight = '50px';
  btn.style.fontSize = '20px';
  btn.style.zIndex = 10000;
  btn.style.opacity = 0.5;
  //btn.style.transition = 'all .5s ease .5s';
  btn.onmouseover = () => {
    document
      .getElementById(namespace)
      .style.opacity = 0.9;
  };
  btn.onmouseout = () => {
    document
      .getElementById(namespace)
      .style.opacity = 0.3;
  };
  // center character
  btn.style.justifyContent = 'center';
  btn.style.alignItems = 'center';
  btn.style.display = 'flex';
  // disable selection marks
  btn.style.outline = 'none';
  btn.style.userSelect = 'none';
  btn.style.cursor = 'default';
  // set button behaviour
  btn.onclick = () => {
  //btn.onclick = async () => {
    try {
      toggle();
      //await toggle();
    } catch (err) {
      toggleByShape();
      console.warn('No support for Greasemonkey API');
      console.error(err);
    }
  };
  try {
    if (await GM.getValue('dimmer')) {
      enable()
    } else {
      disable();
    }
  } catch (err) {
    console.warn('No support for Greasemonkey API');
    console.error(err);
  }
})();

// set hotkey
document.onkeyup = function(e) {
  //if (e.ctrlKey && e.shiftKey && e.which == 190) { // Ctrl + Shift + <
  //if (e.metaKey && e.shiftKey && e.which == 68) { // Command + Shift + D
  if (e.metaKey && e.shiftKey && e.which == 66) { // Command + Shift + B
    toggle();
  }
};

// toggle mode
async function toggle() {
  if (await GM.getValue('dimmer')) {
    await GM.setValue('dimmer', false);
    disable();
  } else {
    await GM.setValue('dimmer', true);
    enable();
  }
}

// toggle mode
function toggleByShape() {
  if (btn.textContent == '🔆') {
    enable()
  } else {
    disable();
  }
}

function disable() {
  DarkReader.disable({
    brightness: 100,
    contrast: 90,
    sepia: 10
  });
  btn.textContent = '🔆';
  //return '🔆';
}

function enable() {
  DarkReader.setFetchMethod(window.fetch); // https://eligrey.com/
  DarkReader.enable({
    brightness: 100,
    contrast: 90,
    sepia: 10
  });
  btn.textContent = '🔅';
  //return '🔅';
}

// Set mode temporarily per session or until storage is cleared

function getPreference(key) {
  return window.localStorage.getItem(key);
}

function setPreference(key, value) {
  return window.localStorage.setItem(key, value);
}
