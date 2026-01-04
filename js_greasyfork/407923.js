// ==UserScript==
// @name         MikuTools vip
// @namespace    MikuTools-vip
// @version      0.1
// @description  mikutools always vip
// @author       pq
// @match        https://tools.miku.ac/*
// @grant        none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/407923/MikuTools%20vip.user.js
// @updateURL https://update.greasyfork.org/scripts/407923/MikuTools%20vip.meta.js
// ==/UserScript==

'use strict';

// 引用自[https://kantv-helper.mutoo.im/dist/kantv-helper.user.js]
/**
 * get a vue instance from selector
 * @param selector
 * @return {any | null}
 */
function getVueInstance(selector) {
    return detectElement(selector).then(dom => dom.__vue__);
}

/**
 * resolve once a element is on the page
 * @param selector
 * @param interval
 * @param retry
 * @return {Promise<any>}
 */
function detectElement(selector, interval = 500, retry = 10) {
    return new Promise((resolve, reject) => {
        setTimeout(function detect() {
            let dom = document.querySelector(selector);
            if (dom) {
                resolve(dom);
            } else if (retry > 0) {
                setTimeout(detect, interval);
                retry -= 1;
            } else {
                reject(`can not found ${selector} on the page`);
            }
        }, interval);
    });
}

function mikuTools() {
    return getVueInstance('#__nuxt')
        .then(vue => {
        const $state = vue.$store.app.store.state
        $state.vip = true
    })
        .catch(err => {
        console.warn('qr vue is not detected.');
    });
}

(()=>{
    mikuTools()
})();