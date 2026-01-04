// ==UserScript==
// @name         替换 Bing 错误贴吧 URL
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  将 Bing 搜索出的错误贴吧 URL 替换为正确 URL，解决无法登录贴吧的问题
// @author       Neroll
// @match        https://cn.bing.com/search?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512782/%E6%9B%BF%E6%8D%A2%20Bing%20%E9%94%99%E8%AF%AF%E8%B4%B4%E5%90%A7%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/512782/%E6%9B%BF%E6%8D%A2%20Bing%20%E9%94%99%E8%AF%AF%E8%B4%B4%E5%90%A7%20URL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    /*
    let as = document.querySelectorAll('#b_content .b_algo h2 a');
    let as2 = document.querySelectorAll('#b_content .b_algo .b_tpcn .tilk');

    for (let i = 0; i < as.length; i++) {
        let url = as[i].getAttribute('href');
        let new_url = url.replace('jump2.bdimg', 'tieba.baidu');
        as[i].setAttribute('href', new_url);
        as2[i].setAttribute('href', new_url);
    }*/

    function replace() {
        let as = document.querySelectorAll('#b_content .b_algo h2 a');
        let as2 = document.querySelectorAll('#b_content .b_algo .b_tpcn .tilk');

        for (let i = 0; i < as.length; i++) {
            let url = as[i].getAttribute('href');
            let new_url = url.replace('jump2.bdimg', 'tieba.baidu');
            as[i].setAttribute('href', new_url);
            as2[i].setAttribute('href', new_url);
        }
    }

    replace();

    var _pushState = window.history.pushState;
    window.history.pushState = function() {
        replace();
        console.log('change');
        return _pushState.apply(this, arguments);
    }

})();