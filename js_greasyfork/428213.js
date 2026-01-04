// ==UserScript==
// @name         B站视频自动点赞
// @namespace    https://eliotzhang.cn
// @version      1.0.2
// @description  自动给B站视频点赞！
// @author       EliotZhang
// @match        https://www.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428213/B%E7%AB%99%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/428213/B%E7%AB%99%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function main() {
        var like_btn = $('.like')
        if (like_btn.length == 0)
        {
            return
        }
        if (like_btn[0].className === 'like') {
            like_btn[0].click()
        }
    }

    setInterval(main, 5000)
})();