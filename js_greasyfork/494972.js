// ==UserScript==
// @name         Better Youtube Video Size
// @namespace    http://tampermonkey.net/
// @version      2024-05-26
// @description  Enlarges youtube video to fill height on wide screen displays
// @author       Marthinus Bosman
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494972/Better%20Youtube%20Video%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/494972/Better%20Youtube%20Video%20Size.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...

  function overwriteStyles() {
    var video_element = document.querySelector(
      "#movie_player > div:nth-child(1) > video:nth-child(1)"
    );
    var height = video_element.clientHeight;
    var width = video_element.clientWidth;
    var ratio = width / height;
    document.documentElement.style.setProperty(
      "--custom-max-height",
      "calc(100vh - 180px)"
    );
    document.documentElement.style.setProperty(
      "--custom-max-width",
      `calc(var(--custom-max-height) * ${ratio})`
    );
    document.querySelector(
      "ytd-watch-flexy[flexy]:not([full-bleed-player][full-bleed-no-max-width-columns]) #columns.ytd-watch-flexy"
    ).style.maxWidth = "100vw";
    document.querySelector(
      "ytd-watch-flexy[flexy][is-two-columns_][is-extra-wide-video_]:not([full-bleed-player][full-bleed-no-max-width-columns]):not([fixed-panels]) #primary.ytd-watch-flexy, ytd-watch-flexy[flexy][is-two-columns_][is-four-three-to-sixteen-nine-video_]:not([full-bleed-player][full-bleed-no-max-width-columns]):not([fixed-panels]) #primary.ytd-watch-flexy"
    ).style.maxWidth = "var(--custom-max-width)";
    document.querySelector(
      "ytd-watch-flexy[flexy] #player-container-outer.ytd-watch-flexy"
    ).style.maxWidth = "var(--custom-max-width)";
    // video_element.style.height = "var(--custom-max-height)";
    // video_element.style.width = "var(--custom-max-width)";
    document.querySelector(
      ".ytp-chrome-bottom"
    ).style.width = `calc(100% - 24px)`;
    document.querySelector(".ytp-chapter-hover-container").style.width = "100%";
  }

//   function waitForEl(el) {
//     return new Promise((resolve, reject) => {
//       const intervalId = setInterval(() => {
//         if (document.querySelector(el)) {
//           clearInterval(intervalId);
//           resolve();
//         }
//       }, 500);
//     });
//   }

//   waitForEl("#comments").then(() => {
//     // comments should be loaded here
//     overwriteStyles();

//     var observer = new MutationObserver(function (mutations) {
//       mutations.forEach(function (mutationRecord) {
//         console.log("style changed!");
//         overwriteStyles();
//         console.log("overwrite width done!");
//       });
//     });

//     var target = document.querySelector(
//       "#movie_player > div:nth-child(1) > video:nth-child(1)"
//     );
//     observer.observe(target, { attributes: true });
//   });

  const elementToObserve = document.querySelector("body");
  const lookingFor = "#player-container";
  const observer = new MutationObserver(() => {
    if (document.querySelector(lookingFor)) {
      console.log(`${lookingFor} is ready`);
      overwriteStyles();
      var playerObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutationRecord) {
          console.log("style changed!");
          overwriteStyles();
          console.log("overwrite width done!");
        });
      });

      var target = document.querySelector(
        "#movie_player > div:nth-child(1) > video:nth-child(1)"
      );
      playerObserver.observe(target, { attributes: true });
      observer.disconnect();
    }
  });

  observer.observe(elementToObserve, { subtree: true, childList: true });
})();
