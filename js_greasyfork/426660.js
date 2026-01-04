// ==UserScript==
// @name         Remove PiP Disable Attributes  
// @version      1.0
// @description  Clear disablePictureInPicture attributes from videos.
// @author       Polywock
// @include      http://*
// @include      https://*
// @namespace    https://github.com/polywock
// @downloadURL https://update.greasyfork.org/scripts/426660/Remove%20PiP%20Disable%20Attributes.user.js
// @updateURL https://update.greasyfork.org/scripts/426660/Remove%20PiP%20Disable%20Attributes.meta.js
// ==/UserScript==

window.addEventListener("play", function(e) {
    e.target.removeAttribute("disablePictureInPicture")
}, true)

window.addEventListener("pause", function(e) {
    e.target.removeAttribute("disablePictureInPicture")
}, true)