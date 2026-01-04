// ==UserScript==
// @name         GoIndex Local Video Buffer
// @namespace    http://tampermonkey.net/
// @description  自用
// @match        *://*.workers.dev/*
// @grant        none
// @version      1.2
// @downloadURL https://update.greasyfork.org/scripts/422903/GoIndex%20Local%20Video%20Buffer.user.js
// @updateURL https://update.greasyfork.org/scripts/422903/GoIndex%20Local%20Video%20Buffer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ob = new MutationObserver(records =>
        records.map(record => {
            if (record.target.href.indexOf('iina://') === 0) {
                console.log(record.target.href)
                record.target.href = record.target.href.replace('url=', 'url=http://localhost:61234/video?')
                ob.takeRecords()
            }
        })
    )
    ob.observe(document.querySelector('#app'), {
        'subtree': true,
        'attributes': true,
        'attributeFilter': ['href']
    })
})();