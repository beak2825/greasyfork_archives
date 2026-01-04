// ==UserScript==
// @name         CurseForge Downloader
// @namespace    https://www.yesterday17.cn/
// @version      1.0.2
// @description  Download files from curseforge directly instead of launching Twitch.
// @author       Yesterday17
// @include      *://www.curseforge.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/386966/CurseForge%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/386966/CurseForge%20Downloader.meta.js
// ==/UserScript==

"use strict";
(function() {
  const elements = document.querySelectorAll(`a[href$="client=y"]`);
  Array.from(elements).forEach(aNode => {
    // remove client=y
    let link = aNode.getAttribute("href").replace(/\?client=y/g, "");
    // modpack main mage
    if (/(?:\/[^\/])*?\/download\/\d+/.test(link)) {
      link += "/file";
    }
    aNode.setAttribute("href", link);

    // change icon
    let child = aNode.firstElementChild;
    if (child.tagName !== "svg") {
      child = child.firstElementChild;
    }
    child.setAttribute("viewBox", "0 0 20 20");
    child.innerHTML =
      '<path fill-rule="evenodd" clip-rule="evenodd" d="M11.9989 7.97269H14.0369C14.4409 7.97269 14.8069 8.21669 14.9609 8.58969C15.1159 8.9637 15.0299 9.39369 14.7439 9.67969L10.7189 13.7257C10.5309 13.9127 10.2769 14.0187 10.0119 14.0187C9.7459 14.0187 9.4919 13.9127 9.3049 13.7257L5.2789 9.67969C4.9929 9.39369 4.9079 8.9637 5.0629 8.58969C5.2169 8.21669 5.5819 7.97269 5.9859 7.97269H8.0049V2.99969C8.0049 2.44769 8.4519 1.99969 9.0049 1.99969H10.9989C11.5509 1.99969 11.9989 2.44769 11.9989 2.99969V7.97269ZM4 18H16C16.553 18 17 17.553 17 17C17 16.447 16.553 16 16 16H4C3.448 16 3 16.447 3 17C3 17.553 3.448 18 4 18Z"/>';

    // Change text from 'Install' to 'Download'
    aNode.innerHTML = aNode.innerHTML.replace("Install", "Download");
  });
})();
