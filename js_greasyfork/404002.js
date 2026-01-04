// ==UserScript==
// @name         hide comments on VK.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Specially for N.
// @author       NickKolok
// @match        https://vk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404002/hide%20comments%20on%20VKcom.user.js
// @updateURL https://update.greasyfork.org/scripts/404002/hide%20comments%20on%20VKcom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var st = document.createElement('style');
    st.innerHTML = '.replies,.post_replies_header{visibility:hidden;position:absolute}';
    document.body.appendChild(st);
 })();