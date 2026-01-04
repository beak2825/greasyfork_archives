// ==UserScript==
// @name         Auto High-Res Cookie & Resize To Fullscreen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically adds the "Always High Resolution" cookie and resizes the image to fit snugly in the client window so you don't have to scroll right.
// @author       eM-Krow
// @match        *://rule34.xxx/*
// @icon         https://www.google.com/s2/favicons?domain=rule34.xxx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431403/Auto%20High-Res%20Cookie%20%20Resize%20To%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/431403/Auto%20High-Res%20Cookie%20%20Resize%20To%20Fullscreen.meta.js
// ==/UserScript==

try {
    Cookie.create('resize-original',1); Cookie.create('resize-notification',1); Post.highres(); $('resized_notice').hide();
} catch (e) {
    console.log("Image already high-res, cannot reset cookie...");
}
const autoResize = () => {
    do {
        document.getElementById("image").style = "position: absolute; left: 5px; width: 99%; height: auto;";
    } while (!document.getElementById("image").style == "position: absolute; left: 5px; width: 99%; height: auto;")
};
window.onload = autoResize();