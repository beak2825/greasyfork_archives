// ==UserScript==
// @name         Java_Fshare_ID
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.javlibrary.com/en/?v=*
// @match        http://www.javlibrary.com/en/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369947/Java_Fshare_ID.user.js
// @updateURL https://update.greasyfork.org/scripts/369947/Java_Fshare_ID.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function appendTo(el) {
        if (!el)
            return;
        el.appendChild(Object.assign(document.createElement('a'), {
            href: `https://www.google.com.vn/search?q=site%3Afshare.vn+${el.textContent}`,
            textContent: '   😏',
            target: '_blank'
        }))
    }

    appendTo(document.querySelector('#video_id .text'));

    Array.from(document.querySelectorAll('.video .id'), appendTo);
})();