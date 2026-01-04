// ==UserScript==
// @name        Wanikani Block Review Submit
// @namespace   wk_block_submit
// @description Disable submission of reviews, for debugging purposes
// @match       https://*.wanikani.com/*
// @version     1.0.1
// @author      Robin Findley
// @copyright   2023, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/463190/Wanikani%20Block%20Review%20Submit.user.js
// @updateURL https://update.greasyfork.org/scripts/463190/Wanikani%20Block%20Review%20Submit.meta.js
// ==/UserScript==

window.block_submit = {};

(function(gobj) {

    let old_fetch = window.fetch;
    window.fetch = new_fetch;

    function new_fetch(url, data) {
        if ((url === '/subjects/review') && (data.method === 'PUT')) {
            console.log('Blocking submit: ', JSON.parse(data.body).counts[0]);
            return Promise.resolve({ok:true});
        }
        return old_fetch.apply(window, arguments);
    };

})(window.block_submit);
