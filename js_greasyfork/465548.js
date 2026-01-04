// ==UserScript==
// @name         Add URL to copied content on PsyPost
// @version      1
// @description  Add the URL of the current page to the end of the copied content on PsyPost website
// @match        https://www.psypost.org/*
// @grant        none
// @namespace https://greasyfork.org/users/1070025
// @downloadURL https://update.greasyfork.org/scripts/465548/Add%20URL%20to%20copied%20content%20on%20PsyPost.user.js
// @updateURL https://update.greasyfork.org/scripts/465548/Add%20URL%20to%20copied%20content%20on%20PsyPost.meta.js
// ==/UserScript==

document.addEventListener("copy", function(e) {
  const selection = window.getSelection().toString();
  const url = document.location.href;
  const copiedString = `${selection} (Source: ${url})`;
  e.clipboardData.setData("text/plain", copiedString);
  e.preventDefault();
});