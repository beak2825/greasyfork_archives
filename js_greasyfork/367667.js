// ==UserScript==
// @name         Add Instagram Video Progressbar
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.8
// @license      GNU AGPLv3
// @author       jcunews
// @description  Add a video playback progressbar at bottom of an Instagram video. This script also disables video looping and unmute audio. All are configurable in script code. Note: CSP must be disabled for Instagram, or use Tampermonkey.
// @match        *://www.instagram.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/367667/Add%20Instagram%20Video%20Progressbar.user.js
// @updateURL https://update.greasyfork.org/scripts/367667/Add%20Instagram%20Video%20Progressbar.meta.js
// ==/UserScript==

(function(vael, ie, ee, be, wm) {

  //===== CONFIGURATION BEGIN =====

  var ProgressbarHeight       = 3; //in pixels. set to zero to hide
  var ProgressbarColor        = "#fff"; //e.g. "#fff" or "#e0e0e0" or "cyan"
  var ProgressbarElapsedColor = "#f00";

  var disableVideoLoop = true;
  var unmuteVideo      = true;

  //===== CONFIGURATION END =====

  function setup(a, b) {
    if (disableVideoLoop && !this.attributes.noloop) {
      ie = this.parentNode.parentNode.parentNode.parentNode.lastElementChild;
      this.setAttribute("noloop", "");
      this.parentNode.querySelectorAll('div[role]').forEach(e => {
        Object.keys(e).some(k => {
          if (k.startsWith("__reactProps$")) {
            if (String(e[k].onClick).includes("pause")) e.addEventListener("click", () => this.paused && this.play());
            return true
          }
        })
      })
    }
    a = "aivp" + (new Date()).getTime();
    b = a + "bar";
    ee = document.createElement("DIV");
    ee.id = a;
    ee.innerHTML = `<style>
#${a} { position: absolute; opacity: .66; left: 0; right: 0; bottom: 0; height: ${ProgressbarHeight}px; background: ${ProgressbarColor} }
#${b} { width: 0; transition: width 100ms linear; height: 100%; background: ${ProgressbarElapsedColor} }
</style><div id="${b}"></div>`;
    wm.set(this, be = ee.lastElementChild);
    this.parentNode.insertBefore(ee, this);
    if (unmuteVideo && this.muted) {
      if (location.pathname.startsWith("/stories/")) {
        this.closest('div[style*="width"]')?.parentNode?.closest('div[style*="width"]')?.parentNode?.closest('div[style*="width"]')
          ?.querySelector('div[aria-label="Toggle audio"]')?.click()
      } else {
        this.parentNode.querySelectorAll('button').forEach(e => {
          Object.keys(e).some(k => {
            if (k.startsWith("__reactProps$")) {
              if (String(e[k].onClick).includes("AUDIO_STATES")) e.click();
              return true
            }
          })
        })
      }
    }
    this.removeEventListener("canplay", setup);
  }
  wm = new WeakMap;
  vael = HTMLVideoElement.prototype.addEventListener;
  HTMLVideoElement.prototype.addEventListener = function(type) {
    var res;
    ((ve, tm, be) => {
      function updBar() {
        be.style.width = Math.ceil((ve.currentTime / ve.duration) * ee.offsetWidth) + "px";
      }
      function startTimer(ev) {
        if (!be) be = wm.get(this);
        if (disableVideoLoop) ve.loop = false;
        if (!tm) tm = setInterval(updBar, 100);
      }
      function stopTimer(ev) {
        if (ev.type === "ended") {
          be.style.width = "100%";
          if (disableVideoLoop) ie.click();
        }
        clearInterval(tm);
        tm = 0;
      }
      if (disableVideoLoop && (type === "ended")) return;
      res = vael.apply(ve, arguments);
      if (!ve.attributes["aivp_done"]) {
        ve.setAttribute("aivp_done", "1");
        vael.call(ve, "canplay", setup);
        vael.call(ve, "play", startTimer);
        vael.call(ve, "playing", startTimer);
        vael.call(ve, "waiting", stopTimer);
        vael.call(ve, "pause", stopTimer);
        vael.call(ve, "ended", stopTimer);
      }
    })(this);
    return res;
  };
})();
