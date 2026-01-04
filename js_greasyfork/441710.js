// ==UserScript==
// @name         WYSIWYG off!
// @namespace    ttv-wysiwyg
// @version      1.0
// @description  Disable the (annoying) WYSIWYG chat input on twitch.tv
// @author       p1x0
// @license      MIT 
// @match        http*://*.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441710/WYSIWYG%20off%21.user.js
// @updateURL https://update.greasyfork.org/scripts/441710/WYSIWYG%20off%21.meta.js
// ==/UserScript==

(function() {
    window.__twilightSettings.wysiwyg_chat_input[0] = 0;
    window.__twilightSettings.wysiwyg_chat_input[1] = false; // doesn't do anything
    //console.log("done");
})();