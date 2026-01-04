// ==UserScript==
// @name         玛雅固定资产隐藏多余列
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  隐藏多余列
// @author       AN drew
// @match        *://gz.dothantech.com/*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450565/%E7%8E%9B%E9%9B%85%E5%9B%BA%E5%AE%9A%E8%B5%84%E4%BA%A7%E9%9A%90%E8%97%8F%E5%A4%9A%E4%BD%99%E5%88%97.user.js
// @updateURL https://update.greasyfork.org/scripts/450565/%E7%8E%9B%E9%9B%85%E5%9B%BA%E5%AE%9A%E8%B5%84%E4%BA%A7%E9%9A%90%E8%97%8F%E5%A4%9A%E4%BD%99%E5%88%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
    .el-table_1_column_5{display:none!important}
    .el-table_1_column_6{display:none!important}
    .el-table_1_column_7{display:none!important}
    .el-table_1_column_8{display:none!important}
    .el-table_1_column_9{display:none!important}
    .el-table_1_column_10{display:none!important}
    .el-table_1_column_11{display:none!important}
    .el-table_1_column_12{display:none!important}
    .el-table_1_column_17{display:none!important}
    .el-table_1_column_18{display:none!important}

    .el-table_1_column_16 .cell.el-tooltip{width:135px!important}
    `);

    if(window.location.href.indexOf('gz.dothantech.com/#/assetlist') > -1)
    {
        setTimeout(function(){
            $('#app > div > div.content-box > div.content > div > div:nth-child(1) > div > div > div:nth-child(1) > form > button.el-button.el-button--primary.el-button--small').click();
            $('.el-table_1_column_19').removeClass('is-hidden');
        },3000);
    }
        setInterval(function(){
            $('.el-table_1_column_19').attr('class','el-table_1_column_19 is-center');
            $('.el-input.el-input--small.is-disabled .el-input__inner').prop("disabled", false);
            $('.el-input.el-input--small.is-disabled').attr('class','el-input el-input--small');
        },1000);

})();