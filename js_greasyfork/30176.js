// ==UserScript==
// @name         屏蔽动漫之家10秒广告
// @name:zh-CN   屏蔽动漫之家广告
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @description:zh-cn 屏蔽动漫之家10秒广告
// @author       You
// @match        http://m.dmzj.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30176/%E5%B1%8F%E8%94%BD%E5%8A%A8%E6%BC%AB%E4%B9%8B%E5%AE%B610%E7%A7%92%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/30176/%E5%B1%8F%E8%94%BD%E5%8A%A8%E6%BC%AB%E4%B9%8B%E5%AE%B610%E7%A7%92%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var ad = document.querySelector('.timeAD');
    var s = document.querySelector('.control_panel.alpha');
    console.log(ad);
    ad.style.display = 'none';
    s.style.display = 'none';
    document.documentElement.style.overflow = 'auto';
    // Your code here...
})();