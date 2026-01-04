// ==UserScript==
// @name         Apple Music - Country redirection
// @namespace    https://puvox.software
// @version      2024-09-08
// @description  Redirect to your country location automatically
// @author       https://puvox.software
// @license MIT
// @match        https://music.apple.com/*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/507452/Apple%20Music%20-%20Country%20redirection.user.js
// @updateURL https://update.greasyfork.org/scripts/507452/Apple%20Music%20-%20Country%20redirection.meta.js
// ==/UserScript==



(function() {
    'use strict';
    const domain = 'music.apple.com';
    function isTargetPage() {
         return location.href.match(domain + '(.*?)\/album');
    }

    let redirectionPrefixOpt = "apple_redirection_prefix";
    let redirectionPrefix = GM_getValue(redirectionPrefixOpt);
    GM_registerMenuCommand("Set redirection settings", () => {
        if (isTargetPage()) return; // opposite action - to avoid two times popup in special cases
        const value = prompt("Enter your location prefix (to disable auto-redirection, set empty)");
        GM_setValue(redirectionPrefixOpt, value);
    });
    if (!redirectionPrefix) return;
    if (!isTargetPage()) return;

    const url = location.href;
    const urlParts = url.split('/');
    const lang = urlParts[3];
    const newLocation = location.href.replace(`music.apple.com/${lang}/`, `music.apple.com/${redirectionPrefix}/`);
    //if (confirm('redirect to: ' + newLocation))
    if (!location.href.match(`music.apple.com/${redirectionPrefix}/`)) {
        document.body.insertAdjacentHTML('afterbegin', '<div style="font-size:3em; color:red; background:white; position:relative; z-index:4444; text-align:center;">Redirecting (tampermonkey)</div>');
        setTimeout(()=>{location.href = newLocation}, 500);
    }
})();