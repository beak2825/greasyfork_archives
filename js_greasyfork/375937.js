// ==UserScript==
// @name         去掉t66y.com 因广告过滤插件导致屏蔽内容的屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  2018-12-25 去掉t66y.com 因广告过滤插件导致屏蔽内容的屏蔽
// @author       You<https://itbook.download/>
// @match        http://www.t66y.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375937/%E5%8E%BB%E6%8E%89t66ycom%20%E5%9B%A0%E5%B9%BF%E5%91%8A%E8%BF%87%E6%BB%A4%E6%8F%92%E4%BB%B6%E5%AF%BC%E8%87%B4%E5%B1%8F%E8%94%BD%E5%86%85%E5%AE%B9%E7%9A%84%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/375937/%E5%8E%BB%E6%8E%89t66ycom%20%E5%9B%A0%E5%B9%BF%E5%91%8A%E8%BF%87%E6%BB%A4%E6%8F%92%E4%BB%B6%E5%AF%BC%E8%87%B4%E5%B1%8F%E8%94%BD%E5%86%85%E5%AE%B9%E7%9A%84%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var highestTimeoutId = setTimeout(";");
    for (var i = 0 ; i < highestTimeoutId ; i++) {
        clearTimeout(i);
    }
})();