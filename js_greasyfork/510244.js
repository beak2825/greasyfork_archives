// ==UserScript==
// @name         Original Filename
// @namespace    https://wilchan.org
// @version      0.2
// @description  Umożliwia pobranie pliku z oryginalną nazwą.
// @author       Anonimas
// @match        https://wilchan.org/*
// @match        https://akanechan.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wilchan.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510244/Original%20Filename.user.js
// @updateURL https://update.greasyfork.org/scripts/510244/Original%20Filename.meta.js
// ==/UserScript==

(function() {
    'use strict';

document.querySelectorAll(".info > .file").forEach(element => {
    element.setAttribute("download", element.childNodes[1].innerText + element.childNodes[3].innerText);
});

window.addEventListener("after-create-post-section-element-event", function (event) {
    if (event.detail.post.file) {
        let postSectionElement = event.detail.element;
        let element = postSectionElement.querySelector(".info > .file");
        element.setAttribute("download", event.detail.post.fileNameOriginal);
    }
}, false);

})();