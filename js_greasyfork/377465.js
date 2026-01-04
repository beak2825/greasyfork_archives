// ==UserScript==
// @name         Vaughn.Live Video Size Fix and Video Player Keyboard Shortcuts
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.2.3
// @license      GNU AGPLv3
// @author       jcunews
// @description  Adds links to fix widescreen/letterbox videos (e.g. zoom letterboxed widescreen, unstretched letterbox, etc.; hover mouse cursor on links to show their description), and adds video player keyboard shortcuts: [Space] Play/pause, [M] Mute/unmute, [-] Decrease volume by 10%, [+]/[=] Increase volume by 10%, [F] Toggle fullscreen.
// @match        *://vaughn.live/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/377465/VaughnLive%20Video%20Size%20Fix%20and%20Video%20Player%20Keyboard%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/377465/VaughnLive%20Video%20Size%20Fix%20and%20Video%20Player%20Keyboard%20Shortcuts.meta.js
// ==/UserScript==

addEventListener("DOMContentLoaded", (ch, chVideoSetting, a) => {
  function setRatio(r) {
    switch (r) {
      case "ZLH":
        MvnHlsPlayerLive.style.transform = `scale(1.16)`;
        break;
      case "ZLF":
        MvnHlsPlayerLive.style.transform = `scale(1.33)`;
        break;
      case "USL":
        MvnHlsPlayerLive.style.transform = `scaleX(0.75)`;
        break;
      case "USW":
        MvnHlsPlayerLive.style.transform = `scaleY(0.75)`;
        break;
      case "USW2":
        MvnHlsPlayerLive.style.transform = `scale(1.33, 0.75)`;
        break;
      case "USWH":
        MvnHlsPlayerLive.style.transform = `scaleY(0.825)`;
        break;
      case "USLW":
        MvnHlsPlayerLive.style.transform = `scaleX(1.33)`;
        break;
      case "FVSW":
        MvnHlsPlayerLive.style.transform = `scaleY(1.33)`;
        break;
      case "FVULW":
        MvnHlsPlayerLive.style.transform = `scale(1.33) translateY(-6.0%)`;
        break;
      default:
        MvnHlsPlayerLive.style.transform = "";
    }
  }

  //add video player keyboard shortcuts
  addEventListener("keypress", (ev) => {
    if (document.activeElement && ["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
    switch (ev.key.toUpperCase()) {
      case " ": //pause/play
        if (window.MvnPlayer) MvnPlayer.PausePlay();
        break;
      case "M": //mute/unmute
        if (ev = document.querySelector("#MvnHlsPlayer_vol")) ev.click();
        break;
      case "-": //decrease volume
        if (window.MvnPlayer) {
          ev = MvnPlayer.video.volume - 0.1;
          MvnPlayer.setVolume(ev >= 0 ? ev : 0);
        }
        break;
      case "+": //increase volume
      case "=":
        if (window.MvnPlayer) {
          ev = MvnPlayer.video.volume + 0.1;
          MvnPlayer.setVolume(ev <= 1 ? ev : 1);
        }
        break;
      case "F": //toggle fullscreen
        if (ev = document.querySelector(".MvnHlsPlayer_fullscreen")) ev.click();
        break;
    }
  }); //add video player keyboard shortcuts

  //add video scaling links
  a = document.createElement("STYLE");
  a.innerHTML = `
#MvnHlsPlayerBar .MvnHlsPlayer_spacer span{position:relative;top:-.4em;margin-right:2ex;padding:0 .5ex .2em .5ex;cursor:pointer;font-size:10pt;font-weight:bold}
#MvnHlsPlayerBar .MvnHlsPlayer_spacer span.selected{background:#00d}
`;
  document.body.appendChild(a);
  if (!(a = document.querySelector("#MvnHlsPlayerBar .MvnHlsPlayer_spacer"))) return;
  ch = location.pathname.match(/\/([^\/]+)$/)[1];
  chVideoSetting = JSON.parse(localStorage.chVideoSetting || "{}");
  a.innerHTML = [
    ["Original", "Original video size"],
    ["ZLH", "Zoom letterbox half"],
    ["ZLF", "Zoom letterbox full"],
    ["USL", "Unstretch letterbox"],
    ["USW", "Unstretch widescreen (SHIFT = Unshrink ultra widescreen)"],
    ["USWH", "Unstretch widescreen half"],
    ["USLW", "Unshrink letterboxed widescreen"],
    ["FVSW", "Fix vertically shrinked widescreen"],
    ["FVULW", "Fix vertically uncentered letterbox widescreen"]
  ].map((v, i) =>
    `<span id="${v[0]}" title="${v[1]}" ${
      (
        (chVideoSetting[ch] === v[0]) ||
        (chVideoSetting[ch] && (chVideoSetting[ch].substr(-1) === "2") && (chVideoSetting[ch].substr(0, chVideoSetting[ch].length - 1) === v[0]))
      ) || (!chVideoSetting[ch] && !i) ? 'class="selected" ' : ''
    }href="javascript:void(0)">[${v[0]}]</span>`
  ).join("");
  a.addEventListener("click", (ev, r, a) => {
    if (ev.target.tagName !== "SPAN") return;
    Array.prototype.slice.call(ev.target.parentNode.children).forEach(e => {
      e.className = "";
    });
    ev.target.className = "selected";
    r = ev.target.id;
    if (ev.shiftKey && (r === "USW")) {
      r = "USW2";
      ev.preventDefault();
    }
    setRatio(r);
    if (r !== "Original") {
      chVideoSetting[ch] = r
    } else delete chVideoSetting[ch];
    localStorage.chVideoSetting = JSON.stringify(chVideoSetting);
  });//add video scaling links

  if (chVideoSetting[ch]) setRatio(chVideoSetting[ch]);
});
