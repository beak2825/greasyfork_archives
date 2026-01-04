// ==UserScript==
// @name         AO3 HS Fix
// @namespace    https://greasyfork.org/en/scripts/444424-ao3-hs-fix
// @version      0.2
// @description  Change `width` to `max-width` on Homestuck fics on AO3.
// @author       You
// @match        https://archiveofourown.org/*
// @license MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444424/AO3%20HS%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/444424/AO3%20HS%20Fix.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
  const blocks = document.getElementById("workskin").getElementsByClassName("block");
  if (blocks) {
    for (let i = 0; i < blocks.length; i++) {
      blocks[i].style.width = "unset";
      blocks[i].style.maxWidth = "650px";
    }
  }
})();