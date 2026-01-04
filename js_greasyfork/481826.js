// ==UserScript==
// @name        Youtube - Link to Full Video from Short
// @namespace   Youtube Scripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     0.0.1
// @author      Matthew Chai
// @description Adds a link to the full video from a short.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481826/Youtube%20-%20Link%20to%20Full%20Video%20from%20Short.user.js
// @updateURL https://update.greasyfork.org/scripts/481826/Youtube%20-%20Link%20to%20Full%20Video%20from%20Short.meta.js
// ==/UserScript==


(function() {
  'use strict';

  function promiseIdReady(id, dt = 500) {
    const promise = new Promise(function(resolve, reject) {
      const start = performance.now();
      const check = setInterval(function() {
        const page_manager = document.getElementById(id);
        if (page_manager !== null) {
          clearInterval(check);
          resolve(page_manager);
        }
      }, dt);
    });
    return promise;
  }

  function main() {
    promiseIdReady("shorts-container")
    .then(function(parent_element) {
      let window_href = window.location.href;
      const link = document.createElement("a");
      let current_url = new URL(window.location.href);
      let video_id = current_url.pathname.split("/")[2];
      let full_url = "https://www.youtube.com/watch?v=" + video_id;
      link.style.setProperty("font-size", "14px");
      link.style.setProperty("position", "absolute");
      if (window.location.href.indexOf("shorts") === -1) {
        link.style.setProperty("display", "none");
      }
      link.innerHTML = full_url;
      link.setAttribute("href", full_url);
      parent_element.insertBefore(link, parent_element.firstChild);
      setInterval(function() {
        if (window.location.href !== window_href) {
          if (window.location.href.indexOf("shorts") === -1) {
            link.style.setProperty("display", "none");
          } else {
            link.style.removeProperty("display");
          }
          window_href = window.location.href;
          current_url = new URL(window.location.href);
          video_id = current_url.pathname.split("/")[2];
          full_url = "https://www.youtube.com/watch?v=" + video_id;
          link.innerHTML = full_url;
          link.setAttribute("href", full_url);
        }
      }, 500);
    });
  }
  main();

})();