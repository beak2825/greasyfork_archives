// ==UserScript==
// @name         imslp download
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  不用等待 15 秒，直接显示下载链接。
// @author       Distors
// @match        *://*.imslp.org/*
// @icon         https://imslp.org/apple-touch-icon.png
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/452368/imslp%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/452368/imslp%20download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let t = setInterval(() => {
        let e = document.getElementById('sm_dl_wait')
        if (e)
        {
            let a = document.createElement('a');
            a.href = e.getAttribute('data-id');
            a.innerText = '点击这里下载';

            e.parentNode.replaceChild(a, e);
            clearInterval(t);
        }
    }, 1000);
})();