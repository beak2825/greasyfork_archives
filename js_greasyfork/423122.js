// ==UserScript==
// @name         51CTO不绑定微信
// @namespace    https://qinlili.bid
// @version      0.3
// @description  无需绑定微信就能看免费课
// @author       琴梨梨
// @match        https://edu.51cto.com/course/*.html
// @icon         https://edu.51cto.com/favicon.ico
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/423122/51CTO%E4%B8%8D%E7%BB%91%E5%AE%9A%E5%BE%AE%E4%BF%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/423122/51CTO%E4%B8%8D%E7%BB%91%E5%AE%9A%E5%BE%AE%E4%BF%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    (function(open) {

        oldXML.prototype.open = function(method, url, async, user, pass) {
            if(url.indexOf("check-follow")>0){
                url= "data:application/json;base64,eyJzdGF0dXMiOiAxLCAgIm1zZyI6ICIiLCAgImRhdGEiOiB0cnVlfQ==";
            }
            open.call(this, method, url, async, user, pass);
        };

    })(oldXML.prototype.open);
})();