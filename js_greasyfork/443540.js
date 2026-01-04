// ==UserScript==
// @name         Open Twinkle App
// @version      1.0.5
// @description    Twinkleを自動的に開く
// @author       test2222
// @match        *://*.5ch.net/*
// @namespace https://greasyfork.org/users/730674
// @downloadURL https://update.greasyfork.org/scripts/443540/Open%20Twinkle%20App.user.js
// @updateURL https://update.greasyfork.org/scripts/443540/Open%20Twinkle%20App.meta.js
// ==/UserScript==
window.location.protocol = `twinkle2ch:${window.location.pathname}`;