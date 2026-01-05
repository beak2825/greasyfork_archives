// ==UserScript==
// @name         MuteMusic
// @namespace    https://greasyfork.org/en/users/11508-arcbell
// @version      1.0
// @description  Mutes music
// @author       Arcbell
// @match        https://epicmafia.com/game/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21304/MuteMusic.user.js
// @updateURL https://update.greasyfork.org/scripts/21304/MuteMusic.meta.js
// ==/UserScript==

selection_item = $('#mutemusic');
if (selection_item[0].className === "em_checkbox") {selection_item.click();}