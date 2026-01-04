// ==UserScript==
// @name         Curseforge install bypass
// @namespace    http://tampermonkey.net/
// @version      69.420
// @description  Bypass the 5 second rule!
// @author       Binner#6124 on discord(or Binner#0001 if that doesn't work)
// @match        https://www.curseforge.com/*/*/*/download/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=curseforge.com
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/460276/Curseforge%20install%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/460276/Curseforge%20install%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = location.href;

    if (!currentUrl.endsWith('/file')) {
        GM_setValue('newUrl', currentUrl + '/file');
        location.href = GM_getValue('newUrl');
    }
})();