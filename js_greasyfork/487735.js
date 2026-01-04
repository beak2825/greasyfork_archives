// ==UserScript==
// @name         油猴脚本更新链接自动转脚本主页
// @namespace    https://greasyfork.org/users/759046
// @version      0.1
// @description  自动将油猴脚本的update链接转换至脚本首页
// @author       233yuzi
// @match        https://update.greasyfork.org/scripts/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487735/%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E6%9B%B4%E6%96%B0%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%BD%AC%E8%84%9A%E6%9C%AC%E4%B8%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/487735/%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E6%9B%B4%E6%96%B0%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%BD%AC%E8%84%9A%E6%9C%AC%E4%B8%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    autoGo()
    function autoGo() {
        let reg = RegExp(/update./)
        let a = location.href
        if (a.match(reg)) {
            a = a.replace("update.", "")
            console.log(a)
            location.href = a
        }
    }
})();