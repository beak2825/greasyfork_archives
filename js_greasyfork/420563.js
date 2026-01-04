// ==UserScript==
// @name         Link to Facebook Ad Library
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420563/Link%20to%20Facebook%20Ad%20Library.user.js
// @updateURL https://update.greasyfork.org/scripts/420563/Link%20to%20Facebook%20Ad%20Library.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let url = document.URL
    let re1 = /&id=(\d+)/
    let re2 = /facebook\.com\/(\d+)/
    let page_id1 = url.match(re1)
    let page_id2 = url.match(re2)
    console.log("page_id2",page_id1)
    if (page_id1) {
        let ad_url=`https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&view_all_page_id=${page_id1[1]}&sort_data[direction]=desc&sort_data[mode]=relevancy_monthly_grouped`
        window.open(ad_url, "_blank")
    } else {
        let ad_url=`https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&view_all_page_id=${page_id2[1]}&sort_data[direction]=desc&sort_data[mode]=relevancy_monthly_grouped`
        window.open(ad_url, "_blank")
    }

})();