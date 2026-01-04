// ==UserScript==
// @name         Auto Complete MS-Reward Activities
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动完成 MS Reward 活动
// @license      MIT
// @author       Xiong,Cheng-Qing
// @match        https://rewards.bing.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463255/Auto%20Complete%20MS-Reward%20Activities.user.js
// @updateURL https://update.greasyfork.org/scripts/463255/Auto%20Complete%20MS-Reward%20Activities.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // Complete all kinds of activities
    const promises = Array
    .from(document.querySelectorAll('.c-card'))
    .filter(node => node.innerHTML.includes('mee-icon-AddMedium'))
    .map((node, index) => {
        const href = node.querySelector('.ds-card-sec');
        return new Promise(resolve => {
            setTimeout(() => {
                href.click();
                resolve();
            }, index * 3000);
        });
    });


    if (promises.length) {
        console.log(promises.length);
        const res = await Promise.all(promises);
        location.reload();
    }

})();