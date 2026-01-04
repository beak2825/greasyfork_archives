// ==UserScript==
// @name         Twitter Background Image
// @author       cass_per
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Allows you to use images as background for Twitter.
// @match        *twitter.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440654/Twitter%20Background%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/440654/Twitter%20Background%20Image.meta.js
// ==/UserScript==

// Replace the https:// url with any image URL
// This URL *MUST* be inside the single qoutes! Do not remove ''.

document.body.style.backgroundImage = "url('https://www.gardeningknowhow.com/wp-content/uploads/2020/12/lonely-japanese-cherry.jpg')";

// Keeps the background image fixed while you scroll. If you delete this the image will stay at the top of the page.
// https://www.w3schools.com/jsref/prop_style_backgroundattachment.asp
document.body.style.backgroundAttachment = "fixed";

// If you want background image to repeat:
// https://www.w3schools.com/jsref/prop_style_backgroundrepeat.asp
document.body.style.backgroundRepeat = "no-repeat";

// If you want to change image sizing/style:
// https://www.w3schools.com/jsref/prop_style_backgroundsize.asp
document.body.style.backgroundSize = "100%";