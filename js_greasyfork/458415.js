// ==UserScript==
// @name         QQ相册上传解锁原图
// @namespace    https://www.moeyuuko.com/
// @version      0.1
// @description  QQ相册上传时 把隐藏的原图选项恢复
// @author       Moeyuuko
// @match        https://user.qzone.qq.com/proxy/domain/qzs.qq.com/qzone/photo/v7/page/upload.html
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458415/QQ%E7%9B%B8%E5%86%8C%E4%B8%8A%E4%BC%A0%E8%A7%A3%E9%94%81%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/458415/QQ%E7%9B%B8%E5%86%8C%E4%B8%8A%E4%BC%A0%E8%A7%A3%E9%94%81%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(function(){
        document.querySelector("#option_quality > span.radio_item.radio_item_last").style=""
    } ,3000)
    //是的 就一行代码
})();