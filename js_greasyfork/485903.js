// ==UserScript==
// @name         KMS-Labs
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  TMS-Labs ripper
// @author       XXXXXXXXXIII
// @match        https://tms-lab.jp/manga/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tms-lab.jp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485903/KMS-Labs.user.js
// @updateURL https://update.greasyfork.org/scripts/485903/KMS-Labs.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Download starting in 5 seconds")
    var timeout = 0
    setTimeout(() => {
        var img = $('div[class*="manga-entry-image__item"] img');
        Object.keys(img).forEach(k => {
            setTimeout(() => {
                console.log(`Downloading ${k}.jpg`)
                var a = document.createElement('a');
                a.href = img[k].src;
                a.download = `${k}.jpg`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }, timeout);
            timeout += 500
        })
    }, 5000);
})();