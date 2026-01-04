// ==UserScript==
// @name         Closing Confirmation
// @namespace    https://greasyfork.org/en/users/173828-snowofficial
// @version      1.0
// @description  Prevents the page from being closed without your consent
// @author       Copyright 2017, iomods.weebly.com, All rights reserved.
// @match        http://*/*
// @match        https://*/*
// @match        *://*
// @supportURL   http://iomods.weebly.com/
// @icon         https://cdn.discordapp.com/avatars/459369695519178773/d4ba99e72010e782441f050d63bd8670.png?size=1024
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/370146/Closing%20Confirmation.user.js
// @updateURL https://update.greasyfork.org/scripts/370146/Closing%20Confirmation.meta.js
// ==/UserScript==

window.onbeforeunload = function() {
    return "You sure you want to leave kid???";
};