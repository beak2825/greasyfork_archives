// ==UserScript==
// @name         r/place Download as PNG
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  ok
// @author       tt2468
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/442580/rplace%20Download%20as%20PNG.user.js
// @updateURL https://update.greasyfork.org/scripts/442580/rplace%20Download%20as%20PNG.meta.js
// ==/UserScript==

/* Canvas Download */
function download(canvas, filename) {
  var lnk = document.createElement('a'), e;

  lnk.download = filename;

  lnk.href = canvas.toDataURL("image/png;base64");

  if (document.createEvent) {
    e = document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window,
                     0, 0, 0, 0, 0, false, false, false,
                     false, 0, null);

    lnk.dispatchEvent(e);
  } else if (lnk.fireEvent) {
    lnk.fireEvent("onclick");
  }
}

function downloadPng() {
    var canvas = document.querySelector("body > mona-lisa-app > faceplate-csrf-provider > faceplate-alert-reporter > mona-lisa-embed").shadowRoot.querySelector("div > mona-lisa-share-container > mona-lisa-camera > mona-lisa-canvas").shadowRoot.querySelector("div > canvas");

    download(canvas, "canvas.png");
}

(function() {
    function addButton(text, onclick, cssObj) {
        cssObj = cssObj || {position: 'absolute', bottom: '5%', left:'14%', 'z-index': 3}
        let button = document.createElement('button'), btnStyle = button.style
        document.body.appendChild(button)
        button.innerHTML = text
        button.onclick = onclick
        btnStyle.position = 'absolute'
        Object.keys(cssObj).forEach(key => {btnStyle[key] = cssObj[key]})
        return button
    }

    window.addEventListener('load', () => {
        addButton('Download Canvas PNG', downloadPng);
    })
})();