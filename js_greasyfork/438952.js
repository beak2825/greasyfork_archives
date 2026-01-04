// ==UserScript==
// @name         芯参数网站免验证码查看[修复]
// @namespace    https://greasyfork.org/
// @version      0.1.1
// @description  芯参数网站免密查看，去除截图右下角水印。
// @author       ZERO
// @match        https://www.xincanshu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438952/%E8%8A%AF%E5%8F%82%E6%95%B0%E7%BD%91%E7%AB%99%E5%85%8D%E9%AA%8C%E8%AF%81%E7%A0%81%E6%9F%A5%E7%9C%8B%5B%E4%BF%AE%E5%A4%8D%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/438952/%E8%8A%AF%E5%8F%82%E6%95%B0%E7%BD%91%E7%AB%99%E5%85%8D%E9%AA%8C%E8%AF%81%E7%A0%81%E6%9F%A5%E7%9C%8B%5B%E4%BF%AE%E5%A4%8D%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    clearInterval(intervalid);
    function denglutishifun() {};
    jq("span[class='logobq']").css('display','none');
    jq("div[class^='denglutishi']").html('<style>.cack_jt_box {display: block;}</style>');
})();