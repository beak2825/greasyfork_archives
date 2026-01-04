// ==UserScript==
// @name        Instagram Larger Photos
// @namespace   InstaLargerPhotos
// @match       https://www.instagram.com/p/*
// @run-at      document-idle
// @grant       none
// @version     1.1
// @author      @billysanca
// @description Makes single page photos a little bigger
// @downloadURL https://update.greasyfork.org/scripts/414427/Instagram%20Larger%20Photos.user.js
// @updateURL https://update.greasyfork.org/scripts/414427/Instagram%20Larger%20Photos.meta.js
// ==/UserScript==

document.getElementsByClassName('ltEKP')[0].style.width = "120%";
document.getElementsByClassName('ltEKP')[0].style.maxWidth = "1200px";