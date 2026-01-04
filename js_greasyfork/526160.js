// ==UserScript==
// @name        Stop slack from darkening on blur
// @namespace   Violentmonkey Scripts
// @match       *://app.slack.com/client/*
// @grant       none
// @version     1.0
// @author      CyrilSLi
// @description 06/02/2025, 23:27:38
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/526160/Stop%20slack%20from%20darkening%20on%20blur.user.js
// @updateURL https://update.greasyfork.org/scripts/526160/Stop%20slack%20from%20darkening%20on%20blur.meta.js
// ==/UserScript==
const observer = new MutationObserver((muts) => {
    setTimeout(() => {document.body.classList.remove("p-window--blurred")}, 0);
})
observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"]
})