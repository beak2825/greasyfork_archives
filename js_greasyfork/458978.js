// ==UserScript==
// @name         Bypass Steam community content age warning screen
// @description  Bypass the "Content may not be appropriate for all ages" confirmation screen
// @author       anon
// @match        https://steamcommunity.com/*
// @grant        unsafeWindow
// @run-at       document-start
// @license MIT
// @version 0.0.1.20230127213432
// @namespace https://greasyfork.org/users/716107
// @downloadURL https://update.greasyfork.org/scripts/458978/Bypass%20Steam%20community%20content%20age%20warning%20screen.user.js
// @updateURL https://update.greasyfork.org/scripts/458978/Bypass%20Steam%20community%20content%20age%20warning%20screen.meta.js
// ==/UserScript==

// version: 2013.1.28

// Remove the content age checker (which run during document loading)
Object.defineProperty(unsafeWindow, "CheckAppAgeGateBypass", { value: () => {}, writable: false });