// ==UserScript==
// @name         阻止拷贝文档添加版权信息
// @version      2.0
// @author       xf
// @description  原理就是覆盖剪切板,理论上大部分网站都支持
// @include        *
// @license MIT
// @namespace https://greasyfork.org/users/392746
// @downloadURL https://update.greasyfork.org/scripts/467470/%E9%98%BB%E6%AD%A2%E6%8B%B7%E8%B4%9D%E6%96%87%E6%A1%A3%E6%B7%BB%E5%8A%A0%E7%89%88%E6%9D%83%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/467470/%E9%98%BB%E6%AD%A2%E6%8B%B7%E8%B4%9D%E6%96%87%E6%A1%A3%E6%B7%BB%E5%8A%A0%E7%89%88%E6%9D%83%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    [...document.querySelectorAll('*')].forEach(item=>{    item.oncopy = function(e) {        e.stopPropagation();    }});

})();