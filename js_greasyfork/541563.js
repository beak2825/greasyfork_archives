// ==UserScript==
// @name         Zoom in Browser
// @namespace    https://greasyfork.org/en/users/370665
// @version      1.0
// @description  Open Zoom in Web Client
// @author       Zach Kosove
// @license      MIT
// @match        https://*.zoom.us/j/*
// @match        https://*.zoom.us/s/*
// @icon         https://cdn-icons-png.freepik.com/64/4401/4401470.png
// @run-at       document-start
// @noframes
// @grant        none
// @homepageURL  https://greasyfork.org/scripts/541563
// @supportURL   https://greasyfork.org/scripts/541563/feedback
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @compatible   opera
// @compatible   safari
// @downloadURL https://update.greasyfork.org/scripts/541563/Zoom%20in%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/541563/Zoom%20in%20Browser.meta.js
// ==/UserScript==

(() => {
  const { pathname: path, search: params } = location;
  location.replace(`/wc/${path.slice(3)}/${path[1] === 'j' ? "join" : "start"}${params}`);
})();