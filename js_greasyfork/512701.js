// ==UserScript==
// @name         hio直播刷礼物数量可手动更改
// @namespace    https://github.com/dadaewqq/fun
// @version      1.1
// @description  可+可-可为0
// @author       dadaewqq
// @match        https://hio.oppo.com/app/channel/detail?cid=*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oppo.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512701/hio%E7%9B%B4%E6%92%AD%E5%88%B7%E7%A4%BC%E7%89%A9%E6%95%B0%E9%87%8F%E5%8F%AF%E6%89%8B%E5%8A%A8%E6%9B%B4%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/512701/hio%E7%9B%B4%E6%92%AD%E5%88%B7%E7%A4%BC%E7%89%A9%E6%95%B0%E9%87%8F%E5%8F%AF%E6%89%8B%E5%8A%A8%E6%9B%B4%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the DOM to be fully loaded
    $(document).ready(function() {
        // Make all elements with 'total-num' class editable
        $('.total-num').attr('contenteditable', 'true');
    });
})();