// ==UserScript==
    // @name         阿里云盘批量重命名工具
    // @namespace    https://www.alipan.com/
    // @version      0.1
    // @description  x
    // @author       tuite
    // @match        https://www.alipan.com/drive/file/backup**
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494455/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E6%89%B9%E9%87%8F%E9%87%8D%E5%91%BD%E5%90%8D%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/494455/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E6%89%B9%E9%87%8F%E9%87%8D%E5%91%BD%E5%90%8D%E5%B7%A5%E5%85%B7.meta.js
    // ==/UserScript==
    (function () {
        'use strict';

        let list = document.querySelector('[class^="tbody"]');
        let fileList = list.querySelectorAll('[class^="tr-wrapper"]')
        for (let f of fileList) {
            console.log(f)
        }
    })();