// ==UserScript==
// @name         filter search results
// @namespace    https://idoubi.cc/
// @version      0.1
// @description  filter search results in google search page
// @license MIT
// @author       idoubi
// @match        *://*.google.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.0/dist/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474058/filter%20search%20results.user.js
// @updateURL https://update.greasyfork.org/scripts/474058/filter%20search%20results.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const filterUrls = [
        'csdn.net',
        'cloud.tencent.com/developer/article'
    ]

    let selectors = []
    filterUrls.map((v)=>{
        selectors.push(`a[ping*="${v}"]`)
    })
    const selector = selectors.join(',')

    let as = $(`${selector}`)
    for (let i=0,l=as.length; i < l; i++) {
        let a = as[i]
        const items = $(a).closest('.MjjYud')
        if (items.length > 0) {
          $(items[0]).attr('style', 'display:none')
        }
    }
})();