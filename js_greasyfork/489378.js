// ==UserScript==
// @name         Autopass Cloudflare CAPTCHA in iFrame
// @namespace    http://tampermonkey.net/
// @version      2024-03-09
// @description  自动点击“验证您是真人”
// @author       NWater
// @match        https://challenges.cloudflare.com/cdn-cgi/challenge-platform/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pqjc.site
// @grant        none
// @require     https://greasyfork.org/scripts/464929-module-jquery-xiaoying/code/module_jquery_XiaoYing.js
// @require     https://greasyfork.org/scripts/464780-global-module/code/global_module.js
// @downloadURL https://update.greasyfork.org/scripts/489378/Autopass%20Cloudflare%20CAPTCHA%20in%20iFrame.user.js
// @updateURL https://update.greasyfork.org/scripts/489378/Autopass%20Cloudflare%20CAPTCHA%20in%20iFrame.meta.js
// ==/UserScript==

// Thanks to https://greasyfork.org/scripts/464785-autopass-cloudflare-captcha/code

async function main() {
    'use strict';
    const global_module = window['global_module'];

    let dom = await global_module.waitForElement("input[type='checkbox']", null, null, 200, -1);
    global_module.clickElement($(dom).eq(0)[0]);
    dom = await global_module.waitForElement("span[class='mark']", null, null, 200, -1);
    global_module.clickElement($(dom).eq(0)[0]);
}

$(document).ready(() => main());