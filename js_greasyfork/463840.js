// ==UserScript==
// @name         易仓下拉选择优化
// @namespace    http://maxpeedingrods.cn/
// @version      0.1.1
// @description  易仓自动客服页面-下拉框优化为可筛选
// @author       knight
// @license      No License
// @match        https://*.eccang.com/message/automatic-letter-rule/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/select2/4.0.13/js/select2.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/463840/%E6%98%93%E4%BB%93%E4%B8%8B%E6%8B%89%E9%80%89%E6%8B%A9%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/463840/%E6%98%93%E4%BB%93%E4%B8%8B%E6%8B%89%E9%80%89%E6%8B%A9%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==


function start()
{
    //引入css
    $(document.body).append(`<link href="https://cdn.bootcdn.net/ajax/libs/select2/4.0.13/css/select2.min.css" rel="stylesheet">`);

    //执行select优化
    $('#altc_id').select2({
        dropdownParent: $(".ui-dialog")
    });
}

(function() {
    'use strict';

    start();
})();
