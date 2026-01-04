// ==UserScript==
// @name         HKTicketing 快达网 busy page
// @namespace    https://www.jwang0614.top/scripts
// @version      0.1
// @description  尝试跳过倒数
// @author       Olivia
// @match        busy.hkticketing.com*
// @match        https://queue.hkticketing.com/hotshow.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454720/HKTicketing%20%E5%BF%AB%E8%BE%BE%E7%BD%91%20busy%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/454720/HKTicketing%20%E5%BF%AB%E8%BE%BE%E7%BD%91%20busy%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var des_url = "https://hotshow.hkticketing.com/shows/show.aspx?sh=PANTH1222";

    document.location = des_url;
})();