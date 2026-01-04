// ==UserScript==
// @name         twitter去广告Ad advertisement
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  最近twitter广告越来越多，因此可以用一行代码去掉广告。
// @author       lj92458
// @license     MPL-2.0
// @match        https://www.x.com/*
// @match        https://x.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/493643/twitter%E5%8E%BB%E5%B9%BF%E5%91%8AAd%20advertisement.user.js
// @updateURL https://update.greasyfork.org/scripts/493643/twitter%E5%8E%BB%E5%B9%BF%E5%91%8AAd%20advertisement.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(
        ()=>{
              $('article').filter(':has(span:contains("Ad"))').hide();
            }
         ,2000);
})();