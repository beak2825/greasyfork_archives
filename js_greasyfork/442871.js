// ==UserScript==
// @name         kutt.appinn.net Demon Mirror
// @namespace    jerryshell
// @version      0.4
// @description  小众软件短链还原
// @author       github.com/jerryshell
// @match        *://www.appinn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=appinn.com
// @grant        GM_xmlhttpRequest
// @connect      kutt.appinn.net
// @license      GNU Affero General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/442871/kuttappinnnet%20Demon%20Mirror.user.js
// @updateURL https://update.greasyfork.org/scripts/442871/kuttappinnnet%20Demon%20Mirror.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(() => {
    'use strict';
    [...document.querySelectorAll('a[href^="https://kutt.appinn.net/"]')]
        .forEach(kuttAElement => GM_xmlhttpRequest({
            method: 'HEAD',
            url: kuttAElement.href,
            onload: (response) => {
                if (response.status === 200) {
                    const realUrl = response.finalUrl;
                    if (realUrl) {
                        kuttAElement.textContent = realUrl;
                        kuttAElement.href = realUrl;
                    }
                } else {
                    console.error(response);
                }
            },
            onerror: (error) => {
                const realUrl = error.error.split('"')[1];
                if (realUrl) {
                    kuttAElement.textContent = realUrl;
                    kuttAElement.href = realUrl;
                }
            },
        }));
})();
