// ==UserScript==
// @name         InstaHaul
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://instagram.com&size=256
// @version      1.0.1
// @license      MIT
// @author       Kami
// @nameplace    https://github.com/SenpaiHunters/InstaHaul
// @description  From the creator of SpotOn, a Spotify Overhaul, I bring you this! Addition of a video playback progress-bar at bottom of an Instagram video (Currently set as purple, with a inverted background, but can be changed!). Video controls, an always on dark theme and some other neat features.
// @match        *://www.instagram.com/*
// @exclude      *://www.instagram.com/stories/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/969665
// @downloadURL https://update.greasyfork.org/scripts/454689/InstaHaul.user.js
// @updateURL https://update.greasyfork.org/scripts/454689/InstaHaul.meta.js
// ==/UserScript==

(function(vael, ie, ee, be, wm) {

  //===== CONFIGURATION BEGIN =====

  var ProgressbarHeight       = 4.5; //in pixels. set to zero to hide
  var ProgressbarColor        = "backdrop-filter: invert(70%);"; //e.g. "#fff" or "#e0e0e0" or "cyan"
  var ProgressbarElapsedColor = "#7c3aed";

  var disableVideoLoop = false;

  //===== CONFIGURATION END =====

  function addBar(a, b) {
    if (disableVideoLoop) ie = this.parentNode.parentNode.parentNode.parentNode.lastElementChild;
    a = "aivp" + (new Date()).getTime();
    b = a + "bar";
    ee = document.createElement("DIV");
    ee.id = a;
    ee.innerHTML = `<style>
#${a} { position: absolute; opacity: .66; left: 0; right: 0; bottom: 0; height: ${ProgressbarHeight}px; background: ${ProgressbarColor} backdrop-filter: invert(100%); }
#${b} { width: 0; height: 100%; background: ${ProgressbarElapsedColor} }
</style><div id="${b}"></div>`;
    wm.set(this, be = ee.lastElementChild);
    this.parentNode.insertBefore(ee, this);
    this.removeEventListener("canplay", addBar);
  }
  wm = new WeakMap;
  vael = HTMLVideoElement.prototype.addEventListener;
  HTMLVideoElement.prototype.addEventListener = function() {
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
      res = vael.apply(ve, arguments);
      if (!ve.attributes["aivp_done"]) {
        ve.setAttribute("aivp_done", "1");
        vael.call(ve, "canplay", addBar);
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

document.addEventListener('DOMContentLoaded', () => {
    document.body.style = "background-color: #000";
});

function main(){
    let url = new URL('/?hl=en&theme=dark');
    if(!url.searchParams.get("theme")){
        url.searchParams.append("theme", "dark");
        window.location.replace(url);
    }
}

(function() {
    'use strict';
    main();
})();

// Dark mode on Insta

document.addEventListener('DOMContentLoaded', () => {
    document.body.style = "background-color: #000000";
});

function main(){
    let url = new URL(window.location.href);
    if(!url.searchParams.get("theme")){
        url.searchParams.append("theme", "dark");
        window.location.replace(url);
    }
}

(function() {
    'use strict';
    main();
})();

(function() {
    'use strict';

    let videoObserver = new MutationObserver(function(mutations) {
        mutations = Array.from(mutations);

        function videoClassCount(removedNodes) {
            return Array.from(removedNodes)
                .filter(node => node.classList && node.classList.contains('_8jZFn')).length;
        }

        // Check for the play button to be removed, i.e. the video is being played
        let videoMutations = mutations
            .filter(m => m.removedNodes && videoClassCount(m.removedNodes) > 0);

        if(videoMutations.length === 0) return;

        videoMutations.forEach(m => {
            // The <video/> element should be before the removed button
            var video = m.previousSibling;
            if (video && video.tagName && video.tagName.toLowerCase() == 'video') {
                if (!video.controls) {

                    // Add native video controls
                    video.controls = 'controls';

                    // Remove overlay
                    let article = video.closest('article');
                    article.querySelectorAll('.PyenC, .fXIG0').forEach(trash => {
                        trash.parentNode.removeChild(trash);
                    });

                    // Keep volume value in localStorage
                    video.volume = localStorage.getItem('video_volume') || 1;
                    video.onvolumechange = (event) => {
                        localStorage.setItem('video_volume', event.target.volume);
                    };
                }

                if (!video.loop) {
                    video.loop = true;
                }
            }
        });
    }).observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
})();