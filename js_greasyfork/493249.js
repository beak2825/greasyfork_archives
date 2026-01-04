// ==UserScript==
// @name         Remove popups on UiS Canvas
// @namespace    http://tampermonkey.net/
// @version      2024-04-24
// @description  Remove popups on UiS Canvas, eh?
// @author       UiS mad student
// @match        https://stavanger.instructure.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493249/Remove%20popups%20on%20UiS%20Canvas.user.js
// @updateURL https://update.greasyfork.org/scripts/493249/Remove%20popups%20on%20UiS%20Canvas.meta.js
// ==/UserScript==

document.body.appendChild(document.createElement("style")).innerHTML = "#ek-overlay, #ek-modal{display:none;}";
