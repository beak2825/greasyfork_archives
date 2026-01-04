// ==UserScript==
// @name         Download Google Drive Video
// @namespace    christhielen
// @version      0.1
// @description  Add a (right click; save as) link on top of Videos distributed via Google Drive
// @author       Chris Thielen
// @license      MIT
// @match        https://youtube.googleapis.com/embed/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @downloadURL https://update.greasyfork.org/scripts/469788/Download%20Google%20Drive%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/469788/Download%20Google%20Drive%20Video.meta.js
// ==/UserScript==
const INITIAL_DELAY = 100;
const BACKOFF = 1.2;

(function() {
    'use strict';
    setTimeout(() => findVideo(INITIAL_DELAY), INITIAL_DELAY);
})();

function findVideo(delay) {
    const video = document.querySelector('video');
    const player = document.querySelector('.html5-video-player.playing-mode');
    if (video && video.src) {
        console.log('VIDEO SRC: ' + video.src);
        setTimeout(() => createLink(video.src), 100);
    } else {
        console.log('not yet');
        setTimeout(() => findVideo(delay * BACKOFF), delay * BACKOFF);
    }
}

const css = `
  body .saveas {
    opacity: 0%;
    transition: opacity 0.25s ease-in-out;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 1000;
    text-align: center;
  }

  .saveas a {
    color: white;
  }

  body:hover .saveas {
    opacity: 100%;
  }
`

function createLink(uri) {
    addStyle(css);

    const div = document.createElement("div"); // create a new div element
    div.className = "saveas";

    const anchor = document.createElement("a"); // create a new div element
    anchor.href = uri;

    const newContent = document.createTextNode("(right click; save as)"); // and give it some content
    anchor.appendChild(newContent); // add the text node to the newly created div
    div.appendChild(anchor);

//    const currentDiv = document.getElementById("player"); // add the newly created element and its content into the DOM
    document.body.appendChild(div);
}

function addStyle(styles) {
    var css = document.createElement('style');
    css.type = 'text/css';
    if (css.styleSheet) {
        css.styleSheet.cssText = styles;
    } else {
        css.appendChild(document.createTextNode(styles));
    }
    document.getElementsByTagName("head")[0].appendChild(css);
}