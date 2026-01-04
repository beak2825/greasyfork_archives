// ==UserScript==
// @name         ILIAS Autologin
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @license      MIT
// @description  click the damn button
// @author       tippfehlr
// @match        https://ilias.studium.kit.edu/*
// @icon         https://kit.edu/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523645/ILIAS%20Autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/523645/ILIAS%20Autologin.meta.js
// ==/UserScript==

document.querySelector(".glyphicon-login")?.click()
document.querySelector("#button_shib_login")?.click()
