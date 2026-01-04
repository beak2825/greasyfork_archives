// ==UserScript==
// @name         Manyland no death
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Kills the kill function
// @author       Togekiss or KingTortle
// @match        http://manyland.com/*
// @match        https://manyland.com/*
// @icon         https://www.google.com/s2/favicons?domain=manyland.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451118/Manyland%20no%20death.user.js
// @updateURL https://update.greasyfork.org/scripts/451118/Manyland%20no%20death.meta.js
// ==/UserScript==
(function() {
    setTimeout(async () => {
        if (typeof Deobfuscator == 'undefined')
            await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js")

ig.game.player.kill = function() {}
    }, 3000)
})();