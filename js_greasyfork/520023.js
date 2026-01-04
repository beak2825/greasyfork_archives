// ==UserScript==
// @name         StopYourSite
// @namespace    https://milly.me/
// @version      0.0.3
// @description  Stop visiting the website that you hate.
// @author       MillyLee
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520023/StopYourSite.user.js
// @updateURL https://update.greasyfork.org/scripts/520023/StopYourSite.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const websites = ['yorg.io', 'www.douyu.com'];
    const targetSite = "https://google.com";
    if(!websites.includes(location.host)) return;
    setTimeout(() => {
        location.href = targetSite;
    }, 3000);
    document.write(`3s 内未自动跳转，请点击 <a href="${targetSite}">点击跳转</a>`);
})();