// ==UserScript==
// @name         挂机邦自动浏览广告
// @namespace    
// @version      0.1
// @description  挂机邦自动浏览广告 打开网页即可自动浏览
// @author       慕梓
// @match        http://www.guajibang.com/?browsead.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380862/%E6%8C%82%E6%9C%BA%E9%82%A6%E8%87%AA%E5%8A%A8%E6%B5%8F%E8%A7%88%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/380862/%E6%8C%82%E6%9C%BA%E9%82%A6%E8%87%AA%E5%8A%A8%E6%B5%8F%E8%A7%88%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $("a.btn-url").each(function(){
        $(this)[0].click();
    })
})();