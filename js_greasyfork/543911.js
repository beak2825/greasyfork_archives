// ==UserScript==
// @name         Sakura.fm NSFW Redirect
// @version      2.0
// @description  Redirect https://www.sakura.fm/ to https://www.sakura.fm/?allowNsfw=true. This is for people in the UK so they can look for NSFW chats without having to use a VPN.
// @author       Kir
// @match        https://www.sakura.fm/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sakura.fm
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/1499259
// @downloadURL https://update.greasyfork.org/scripts/543911/Sakurafm%20NSFW%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/543911/Sakurafm%20NSFW%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Instantly redirect to the NSFW-enabled version
    window.location.replace("https://www.sakura.fm/?allowNsfw=true");
})();
