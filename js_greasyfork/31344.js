// ==UserScript==
// @name         DevRant-MOD
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Useful MODs for DevRant 
// @author       Himalay
// @match        https://www.devrant.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31344/DevRant-MOD.user.js
// @updateURL https://update.greasyfork.org/scripts/31344/DevRant-MOD.meta.js
// ==/UserScript==

(function() {
  "use strict";
  document.querySelector("style").innerHTML += `* {
        user-select: text !important;
        -moz-user-select: text !important;
        -webkit-user-select: text !important;
    }
    .rant-lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        z-index: 9999;
        padding: 10px;
    }
    .rant-lightbox img {
        max-height: 90vh;
    }
    .rant-lightbox a {
        margin-top: 10px;
        font-size: 1.5em;
    }
    .body-col1 {
        display: none;
    }
    .body-col2, .rantlist-bg, .rantlist-content-col, .rantlist-title-text  {
        width: 100%;
    }
    .rantlist-content-col {
        width: calc(100% - 50px);
    }
    .rant-image {
    overflow-y: auto;
    }
    .rant-image img {
        max-width: 100%;
    }
    .addrant-btn {
        margin-left: 0;
    }`;
  document.addEventListener("click", e => {
    if (e.target.parentElement.classList.contains("rant-image")) {
      document.body.innerHTML += `<div class="rant-lightbox" onclick="this.parentElement.removeChild(this);"><img src="${e
        .target.src}" /><a href="${e.target
        .src}" download="${e.target.src.split("/").pop()}">?</a></div>`;
      e.preventDefault();
      e.stopPropagation();
    }
  });
})();
