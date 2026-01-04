// ==UserScript==
// @name         Soundcloud Download Button
// @namespace    Freebee1693
// @version      1.1.0-GitHub
// @description  A Script that adds a Download button to SoundCloud
// @author       Freebee1693
// @license      Apache License 2.0
// @match        https://soundcloud.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412108/Soundcloud%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/412108/Soundcloud%20Download%20Button.meta.js
// ==/UserScript==

(function () {
  'use strict';
  function downdone() {
    clearInterval(window["downloop"]);
    window["loopbtn"].innerText = "Download complete!";
    setTimeout(() => {
      window["loopbtn"].innerText = "Download";
    }, 5000);
  }

  function getCompareString() {
    return `soundcloud.com${location.pathname}`;
  }

  setInterval(() => {
    const re1 = new RegExp('(.*)soundcloud.com/(.*)/(.*)');
    const re2 = new RegExp('(.*)soundcloud.com/(.*)/sets/(.*)');
    if(document.querySelector("#scr-download-button") != null) return;
    const btnElem = document.createElement("button");
    btnElem.setAttribute("type", "button");
    btnElem.setAttribute("id", "scr-download-button");
    btnElem.setAttribute("class", "sc-button-download sc-button sc-button-medium sc-button-responsive");
    btnElem.setAttribute("aria-describedby", "tooltip-122");
    btnElem.setAttribute("tabindex", "0");
    if (re2.test(getCompareString())) {
      btnElem.setAttribute("title", "Download Playlist");
      btnElem.setAttribute("aria-label", "Download Playlist");
      btnElem.innerText = "Download Playlist";
    } else {
      btnElem.setAttribute("title", "Download");
      btnElem.setAttribute("aria-label", "Download");
      btnElem.innerText = "Download";
    }
    btnElem.onclick = (event) => {
      window["loopcount"] = 1
      const path = event.path || (event.composedPath && event.composedPath());
      window["loopbtn"] = path[0];
      window["downloop"] = setInterval(() => {
        switch (window["loopcount"]) {
          case 1:
            window["loopbtn"].innerText = "Downloading .";
            window["loopcount"] = 2;
            break;

          case 2:
            window["loopbtn"].innerText = "Downloading ..";
            window["loopcount"] = 3;
            break;

          case 3:
            window["loopbtn"].innerText = "Downloading ...";
            window["loopcount"] = 4;
            break;

          case 4:
            window["loopcount"] = 1;
            break;
        }
      }, 333);
      if (re2.test(getCompareString())) {
        const tmp = re2.exec(getCompareString());
        const url = "https://api.modlabs.cc/scr/" + tmp[2] + "/sets/" + tmp[3];
        fetch(url).then(function (t) {
          downdone();
          return t.blob().then((b) => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(b);
            a.setAttribute("download", tmp[2] + " - " + tmp[3] + ".m3u8");
            a.click();
          });
        });
      } else if (re1.test(getCompareString())) {
        const tmp = re1.exec(getCompareString());
        const url = "https://api.modlabs.cc/scr/" + tmp[2] + "/" + tmp[3];
        fetch(url).then(function (t) {
          downdone();
          return t.blob().then((b) => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(b);
            a.setAttribute("download", tmp[2] + " - " + tmp[3] + ".mp3");
            a.click();
          });
        });
      }
    };
    for (const i of document.getElementsByClassName("sc-button-group")) {
      if (i.classList.contains("sc-button-group-medium")) {
        i.insertAdjacentElement("afterBegin", btnElem);
      }
    }
  }, 100);
})();
