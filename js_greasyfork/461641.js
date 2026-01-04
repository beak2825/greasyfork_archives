// ==UserScript==
// @name         douban 左右按钮替换
// @namespace    https://github.com/zhangziang
// @version      0.2
// @description  douban 左右切换按钮替换
// @author       zhangang
// @match        https://*.douban.com
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461641/douban%20%E5%B7%A6%E5%8F%B3%E6%8C%89%E9%92%AE%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/461641/douban%20%E5%B7%A6%E5%8F%B3%E6%8C%89%E9%92%AE%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 左右按钮样式替换
    var styleEl = document.createElement('style');
    styleEl.innerHTML = '.ui-slide-control .btn-prev{box-sizing:border-box;position:relative;display:block;transform:scale(var(--ggs,1));width:18px;height:18px;border:2px solid;border-radius:100px}.gallery-ui-slide-control .gallery-btn-prev{box-sizing:border-box;position:relative;display:block;transform:scale(var(--ggs,1));width:18px;height:18px;border:2px solid;border-radius:100px}.ui-slide-control .btn-prev::after{content:"";display:block;box-sizing:border-box;position:absolute;width:4.9px;height:4.9px;border-bottom:2px solid;border-left:2px solid;transform:rotate(45deg);left:5px;top:4.9px}.ui-slide-control .btn-prev:hover:after{color:#fff}.gallery-ui-slide-control .gallery-btn-prev::after{content:"";display:block;box-sizing:border-box;position:absolute;width:4.9px;height:4.9px;border-bottom:2px solid;border-left:2px solid;transform:rotate(45deg);left:5px;top:4.9px}.gallery-ui-slide-control .gallery-btn-prev:hover:after{color:#fff}.ui-slide-control a{color:#6ea2d9;background:none!important}.gallery-ui-slide-control a{color:#6ea2d9;background:none!important}.ui-slide-control a:hover{color:#6ea2d9;background:#6ea2d9!important}.gallery-ui-slide-control a:hover{color:#6ea2d9;background:#6ea2d9!important}.ui-slide-control .btn-next{box-sizing:border-box;position:relative;display:block;transform:scale(var(--ggs,1));width:18px;height:18px;border:2px solid;border-radius:100px}.gallery-ui-slide-control .gallery-btn-next{box-sizing:border-box;position:relative;display:block;transform:scale(var(--ggs,1));width:18px;height:18px;border:2px solid;border-radius:100px}.ui-slide-control .btn-next::after{content:"";display:block;box-sizing:border-box;position:absolute;width:4.9px;height:4.9px;border-bottom:2px solid;border-right:2px solid;transform:rotate(-45deg);left:4px;top:4.9px}.ui-slide-control .btn-next:hover:after{color:#fff}.gallery-ui-slide-control .gallery-btn-next::after{content:"";display:block;box-sizing:border-box;position:absolute;width:4.9px;height:4.9px;border-bottom:2px solid;border-right:2px solid;transform:rotate(-45deg);left:4px;top:4.9px}.gallery-ui-slide-control .gallery-btn-next:hover:after{color:#fff}';
    document.head.appendChild(styleEl);
})();