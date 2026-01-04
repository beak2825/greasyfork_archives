// ==UserScript==
// @name         LibriVox PlayMaker
// @namespace    https://vox.quartertone.net/
// @version      1.3.1
// @description  Converts audio link on LibriVox page to an audio element loader.
// @author       Quartertone
// @icon         https://vox.quartertone.net/favico.ico
// @grant        none
// @match        *://librivox.org/*
// @exclude      *://librivox.org/search*
// @exclude      *://librivox.org/reader*
// @exclude      *://librivox.org/
// @license      gpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/463722/LibriVox%20PlayMaker.user.js
// @updateURL https://update.greasyfork.org/scripts/463722/LibriVox%20PlayMaker.meta.js
// ==/UserScript==

(function() {
    'use strict';
  if (typeof vox == "undefined") var vox = false;
  let btns = document.getElementsByClassName("play-btn");
  if (btns.length == 0) return;
  if (!vox) {
    var style = document.createElement("style");
    style.innerHTML = "audio{width:110px;height:2em;position:absolute;} audio:focus,audio:hover{width:25em;} .play-btn{cursor:pointer;display:inline;background:transparent;}";
    document.head.appendChild(style);
  }
  let btnum = 0;
  let previousaudio = null;
  let lastplayed = "PM_Track";
  for (const btn of btns) {
    if (!vox) {
      btn.title = btn.href;
      btn.removeAttribute("href");
      btn.parentElement.style.width = "130px";
    }
    btn.innerHTML = "listen";
    btn.nexttrack = btns[++btnum];
    btn.tracknum = btnum;
    btn.onclick = function () {
      let audio = document.createElement("audio");
      audio.controls = true;
      audio.autoplay = true;
      audio.innerHTML = `<source src="${btn.title}" type="audio/mpeg"/>`;
      audio.oncanplay = function () {
        audio.currentTime = getCookie(btn.title) ? getCookie(btn.title) : 0;
        if (previousaudio != null)
          previousaudio.pause();
        previousaudio = audio;
        audio.oncanplay = null;
      };
      audio.onplay = function () {
        //console.log("on playyyy");
        createCookie(lastplayed, btn.title);
      };

      audio.ontimeupdate = audio.onpause = function () {
        createCookie(btn.title, this.currentTime);
      };
      audio.onended = function () {
        // createCookie(btn.title, 0);
        delCookie(btn.title);
        btn.innerHTML = "played";
        if (vox) btn.classList.add("play-btn");
        if (btn.nexttrack != undefined) {
          // there is a track after this one
          btn.nexttrack.click();
        } else {
          // end of album
          previousaudio = null;
          createCookie(lastplayed, "");
        }
      };
      btn.innerHTML = "";
      if (vox) btn.classList.remove("play-btn");
      btn.appendChild(audio);
    };
  }

  if (getCookie(lastplayed)) {
    //console.log("lastplayed", getCookie(lastplayed));
    try {
      document.querySelector("[title='" + getCookie(lastplayed) + "']").click();
    } catch (e) { };
  }
  function createCookie(name, value) {
    window.localStorage.setItem(name, value);
  }
  function getCookie(name) {
    return window.localStorage.getItem(name);
  }
  function delCookie(name) {
    window.localStorage.removeItem(name);
  }
})();