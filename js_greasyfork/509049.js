// ==UserScript==
// @name         Open Kanka mentions in a new tab
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Makes entity mentions open in a new tab rather than the current one.
// @author       Salvatos
// @license      MIT
// @match        https://app.kanka.io/*
// @icon         https://www.google.com/s2/favicons?domain=kanka.io
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/509049/Open%20Kanka%20mentions%20in%20a%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/509049/Open%20Kanka%20mentions%20in%20a%20new%20tab.meta.js
// ==/UserScript==

document.querySelectorAll("a.entity-mention").forEach((m) => {m.target = "_blank"});