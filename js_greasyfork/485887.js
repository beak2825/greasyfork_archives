// ==UserScript==
// @name         remove image lazy load
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  remove lazyload on img div
// @author       Charles
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @match        *://**/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/485887/remove%20image%20lazy%20load.user.js
// @updateURL https://update.greasyfork.org/scripts/485887/remove%20image%20lazy%20load.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let white_lists = GM_getValue("whitelists", []);
  let host_name = document.location.hostname;
  GM_registerMenuCommand("add site to enable remove lazy load", function () {
    console.log(host_name);
    // if host name is in white list, return
    if (white_lists.includes(host_name)) {
      return;
    }
    GM_setValue("whitelists", white_lists.concat(host_name));
  });
  GM_registerMenuCommand(
    "remove site to disable remove lazy load",
    function () {
      console.log(host_name);
      // if host name is not in white list, return
      if (!white_lists.includes(host_name)) {
        return;
      }
      GM_setValue(
        "whitelists",
        white_lists.filter((e) => e !== host_name)
      );
    }
  );
  // if host name is in white list , then enable remove lazy load
  if (white_lists.includes(host_name)) {
    // remove loading attribute
    let images = document.getElementsByTagName("img");
    for (let image of images) {
      image.removeAttribute("loading");
      // set data-src to src
      if (image.getAttribute("data-src") !== null)
        image.setAttribute("src", image.getAttribute("data-src"));
      else if (image.getAttribute("data-original") !== null)
        image.setAttribute("src", image.getAttribute("data-original"));
    }
  }
})();
