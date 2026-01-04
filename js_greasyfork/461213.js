// ==UserScript==
// @name         Wayback Machine Toolbar Remover
// @namespace    https://greasyfork.org/en/users/1036852-brandonb
// @version      0.1
// @description  Removes the pesky toolbar on archive.org's wayback machine.
// @author       BrandonB
// @match        http://web.archive.org/*
// @match        https://web.archive.org/*
// @icon         https://web.archive.org/_static/images/archive.ico
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461213/Wayback%20Machine%20Toolbar%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/461213/Wayback%20Machine%20Toolbar%20Remover.meta.js
// ==/UserScript==

document.getElementById("wm-ipp-base").remove();