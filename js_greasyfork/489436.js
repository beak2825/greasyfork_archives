// ==UserScript==
// @name         Freeship
// @namespace    louga31
// @version      1.5
// @description  Unlock all Fireship PRO courses/lessons.
// @author       louga31
// @match        https://fireship.io/*
// @icon         https://fireship.io/img/logo.svg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489436/Freeship.user.js
// @updateURL https://update.greasyfork.org/scripts/489436/Freeship.meta.js
// ==/UserScript==

var utilityFunc = ()=> {
    var run = async () => {
       document.querySelectorAll("[free=\"\"]").forEach(el => el.setAttribute("free", true)) // set all elements with the attribute free set to "" to true

      if (document.querySelector("if-access [slot=\"granted\"]")) { // replace HOW TO ENROLL to YOU HAVE ACCESS
          document.querySelector("if-access [slot=\"denied\"]").remove()
          document.querySelector("if-access [slot=\"granted\"]").setAttribute("slot", "denied")
      }

      if (document.querySelector("video-player")?.shadowRoot?.querySelector(".vid")?.innerHTML) return; // return if no video player
      let vimeoId = atob(document.querySelector("global-data").vimeo); // get id for vimeo video
      const youtubeId = atob(document.querySelector("global-data").youtube); // get id for youtube video
      const buildId = parseInt(document.head.dataset.build);

      // vimeoId -= buildId;

      if (vimeoId) { // if there is an id,
          document.querySelector("video-player").setAttribute("free", true); // set free to true
          document.querySelector("video-player").shadowRoot.querySelector(".vid").innerHTML = `<iframe src="https://player.vimeo.com/video/${vimeoId}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen="" title="${location.pathname.split("/")[3]}" width="426" height="240" frameborder="0"></iframe>`; // set video
      }
      if (youtubeId) { // if there is an id,
          document.querySelector("video-player").setAttribute("free", true); // set free to true
          document.querySelector("video-player").shadowRoot.querySelector(".vid").innerHTML = `<iframe src="https://youtube.com/embed/${youtubeId}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen="" title="${location.pathname.split("/")[3]}" width="426" height="240" frameborder="0"></iframe>`; // set video
      }
    };

    var pS = window.history.pushState;
    var rS = window.history.replaceState;

    window.history.pushState = function(a, b, url) {
        pS.apply(this, arguments);
        setTimeout(run, 100);
    };

    window.history.replaceState = function(a, b, url) {
        rS.apply(this, arguments);
        setTimeout(run, 100);
    };

    run()
}
utilityFunc();