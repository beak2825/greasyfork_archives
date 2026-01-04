// ==UserScript==
// @name         do圈户口开处脚本（CSDX限定版）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  斗鱼刀区屏蔽zard
// @author       小北
// @match        https://www.douyu.com/g_DOTA2
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448013/do%E5%9C%88%E6%88%B7%E5%8F%A3%E5%BC%80%E5%A4%84%E8%84%9A%E6%9C%AC%EF%BC%88CSDX%E9%99%90%E5%AE%9A%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/448013/do%E5%9C%88%E6%88%B7%E5%8F%A3%E5%BC%80%E5%A4%84%E8%84%9A%E6%9C%AC%EF%BC%88CSDX%E9%99%90%E5%AE%9A%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const csdx = '60937'
    const removeItem = (rid) => {
        let e_a = document.querySelector(`li div a[href="/${rid}"]`);
        let e = e_a.parentElement.parentElement;
        e.style.display = 'none';
    }
    const init = () => {
        removeItem(csdx)
    }
    const main = () => {
        init()
        setTimeout(()=> {
            removeItem(csdx)
        },1000)

    }
    main()
})();