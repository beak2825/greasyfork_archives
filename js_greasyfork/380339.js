// ==UserScript==
// @name Gfycat Always HD
// @namespace https://jacobbundgaard.dk
// @version 1.0
// @description Automatically switches embedded Gfycat gifs to HD.
// @match https://gfycat.com/ifr/*
// @grant none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/380339/Gfycat%20Always%20HD.user.js
// @updateURL https://update.greasyfork.org/scripts/380339/Gfycat%20Always%20HD.meta.js
// ==/UserScript==

(function() {
  var queryParameters = new URLSearchParams(window.location.search);
  if (queryParameters.get("hd") !== "1") {
    queryParameters.set("hd", "1");
    window.location.search = queryParameters.toString();
  }
})();