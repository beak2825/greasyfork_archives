// ==UserScript==
// @name         ToolFlight
// @namespace    Unseeable's Noteflight Tools
// @version      1.0.0-b2r0
// @description  A set of tools and features for the online notation platform called Noteflight.
// @author       Colton Stone
// @homepage     https://github.com/Unseeable8710/ToolFlight
// @license      GPL-3.0-or-later
// @tag          productivity
// @tag          utilities
// @match        https://www.noteflight.com/*
// @require      https://update.greasyfork.org/scripts/540433/1612221/JSVL.js
// @icon         https://www.google.com/s2/favicons?sz=32&domain=noteflight.com
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/540434/ToolFlight.user.js
// @updateURL https://update.greasyfork.org/scripts/540434/ToolFlight.meta.js
// ==/UserScript==

var uwin;
var udoc;
(function () {
  // I'm not British, I just used single quotes for this. I usually prefer using double quotes because my American self is used to them.
  uwin = unsafeWindow;
  udoc = uwin.document;
  // uwin.alert("vars");
  function searchUserScores() {
    var name = prompt("Enter the username of the person whose scores you want to find:");
    if (name != null) {
      open(`https://noteflight.com/music/search?term=${name}`);
    }
  }
  // uwin.alert("search user scores");
  GM_registerMenuCommand("Search scores by user", searchUserScores, {
    accessKey: "u",
    title: "Searches for scores by a specific user. This can be handy if their scores aren't displayed on their profile."
  });
  // uwin.alert("register menu command");
  GM_addStyle(`
    textarea {
      resize: vertical !important;
      field-sizing: content !important;
    }
  `);
  // uwin.alert("style");
  // uwin.onload = () => {
  //   udoc.addEventListener("DOMContentLoaded", () => {
  //     uwin.alert("dom loaded");
  //     uwin.console.log("dom loaded");
  //     async function loop() {
  //       uwin.alert("called loop");
  //       const observer = new ResizeObserver(entries => {
  //         for (let entry of entries) {
  //           const newHeight = entry.contentRect.height;
  //           entry.target.style.height = "unset";
  //           entry.target.style.minHeight = newHeight;
  //           uwin.alert("resized");
  //         }
  //       });
  //       uwin.alert("observer");
  //       await function () {
  //         return new Promise((resolve, reject) => {
  //           try {
  //             var textareas = [];
  //             udoc.querySelectorAll("textarea").forEach((element) => {
  //               textareas[textareas.length] = element;
  //               element.style.minHeight = element.style.height;
  //               element.style.height = "unset";
  //               observer.observe(element);
  //             });
  //           } catch (error) {
  //             uwin.alert(error);
  //             console.error(error);
  //           }
  //         });
  //       }
  //       uwin.alert("returned promise");
  //       await loop();
  //     }
  //     loop();
  //   });
  // }
})();
