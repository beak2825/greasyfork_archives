// ==UserScript==
// @name         Optimize Quill.org
// @namespace    https://greasyfork.org/en/users/198860-zyenith
// @version      0.0.1
// @description  Speeds up quill.org answering, simply and easy.
// @author       zyenith
// @match        https://www.quill.org/connect/*
// @match        https://www.quill.org/grammar/*
// @grant        none
// @antifeature  Tracking, for compatibility info
// @require      https://greasyfork.org/scripts/410512-sci-js-from-ksw2-center/code/scijs%20(from%20ksw2-center).js
// @downloadURL https://update.greasyfork.org/scripts/456856/Optimize%20Quillorg.user.js
// @updateURL https://update.greasyfork.org/scripts/456856/Optimize%20Quillorg.meta.js
// ==/UserScript==

let enable = true;
setInterval(() => {
      enable && ((document.getElementsByClassName("quill-button focus-on-light primary contained large")[0].innerText == "Next" && document.getElementsByClassName("quill-button focus-on-light primary contained large")[0].click()), (
      document.getElementsByClassName("quill-button focus-on-light primary contained large")[0].innerText == "Next question" && document.getElementsByClassName("quill-button focus-on-light primary contained large")[0].click()))
}, 100);
