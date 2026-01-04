// ==UserScript==
// @name        Block Service Workers
// @name:zh-CN  禁用Service Workers
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       GM_addElement
// @grant       GM_info
// @version     0.7
// @grant       GM_log
// @author      axototl
// @license     Unlicense
// @description Blocks Service Worker's registration.
// @description:zh-CN 阻止Service Worker注册，并移除现有的Service Workers，杜绝网上垃圾。
// @icon        https://www.w3.org/favicon.ico
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/476595/Block%20Service%20Workers.user.js
// @updateURL https://update.greasyfork.org/scripts/476595/Block%20Service%20Workers.meta.js
// ==/UserScript==
'use strict';

const main = async (logger) => {
    'use strict';
    if (!('serviceWorker' in navigator)) {
        console.warn("Did not detected SW APIs, exiting...");
        return;
    }
    logger("Removing Service Workers API, please wait...");
    navigator.serviceWorker.register =
        () => new Promise((res, rej) => rej("This method is not allowed!"));
    logger("Deregistering Installed Service Workers, please wait...");
    (await navigator.serviceWorker.getRegistrations())
        .forEach(it => it.unregister());
    logger("All done!");
}

if (GM_info.injectInto === 'page' || GM_info.sandboxMode === "raw") main(GM_log);
else {
    const blobURL = URL.createObjectURL(new Blob([`(${main.toString()})(console.log);`], {type: "text/javascript"}));
    GM_addElement("script", {src: blobURL}).onload =
        () => setTimeout(() => (URL.revokeObjectURL(blobURL), GM_log("Destroyed")), 1000);
}