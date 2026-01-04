// ==UserScript==
// @name         Anti Verify Injector
// @namespace    Mordern
// @version      Mordern.1
// @description  No verification
// @author       Mordern
// @license      GNU Public License V2
// @match        https://discordapp.com/library/*
// @match        https://discordapp.com/store/*
// @match        https://discordapp.com/channels/*
// @match        https://discord.com/library/*
// @match        https://discord.com/store/*
// @match        https://discord.com/channels/*
// @icon         https://cdn.discordapp.com/avatars/834842435204284527/8ab16792caaa54dd6ff2a3e9de7a57b0.png?size=4096
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/444388/Anti%20Verify%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/444388/Anti%20Verify%20Injector.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
        document.querySelector('[aria-label="VERIFICATION"]').remove();
        document.querySelector("#app-mount > div:nth-of-type(2)").children[0].children[1].children[0].style = ""
    }, 15000);
})();