// ==UserScript==
// @name         4chan Tomorrow Selector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      GPLv3
// @description  Auto-selects Tomorrow stylesheet on 4chan, for use with private browsing
// @author       ceodoe
// @match        https://boards.4chan.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=4chan.org
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/489229/4chan%20Tomorrow%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/489229/4chan%20Tomorrow%20Selector.meta.js
// ==/UserScript==
document.querySelector("#styleSelector").value = "Tomorrow";
document.querySelector("#styleSelector").dispatchEvent(new Event("change"));
