// ==UserScript==
// @name         评教
// @namespace    http://tampermonkey.net/
// @version       2.3
// @description  同济大学评教
// @author       You
// @match        https://1.tongji.edu.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @resource     customCSS https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/468651/%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/468651/%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==
const inspire = '老师上课准备的非常充分';
const comment = 'very good';
const teacher = 40;
(function() {
    'use strict';

    function sleep(numberMillis) {
        var now = new Date();
        var exitTime = now.getTime() + numberMillis;
        while (true) {
            now = new Date();
            if (now.getTime() > exitTime)
                return;
        }
    }


    function criteria() {
        setTimeout(function() {
           document.querySelector(".el-table__row:nth-child(1) > .el-table_2_column_11 span").click();
}, 1000);

        setTimeout(function() {
           console.log('begin')
}, 2000);
        setTimeout(function() {
            document.querySelector(".question-item-container:nth-child(1) .el-radio:nth-child(1) .el-radio__inner").click();
}, 2000);
                setTimeout(function() {
            document.querySelector(".question-item-container:nth-child(2) .el-radio:nth-child(1) .el-radio__inner").click();
}, 2000);
                setTimeout(function() {
            document.querySelector(".question-item-container:nth-child(3) .el-radio:nth-child(1) .el-radio__inner").click();
}, 2000);
                setTimeout(function() {
            document.querySelector(".question-item-container:nth-child(4) .el-radio:nth-child(1) .el-radio__inner").click();
}, 2000);
                setTimeout(function() {
            document.querySelector(".question-item-container:nth-child(5) .el-radio:nth-child(1) .el-radio__inner").click();
}, 2000);
                setTimeout(function() {
            document.querySelector(".question-item-container:nth-child(6) .el-radio:nth-child(1) .el-radio__inner").click();
}, 2000);
                setTimeout(function() {
            document.querySelector(".question-item-container:nth-child(7) .el-radio:nth-child(1) .el-radio__inner").click();
}, 2000);
                setTimeout(function() {
            document.querySelector(".question-item-container:nth-child(8) .el-radio:nth-child(1) .el-radio__inner").click();
}, 2000);
                setTimeout(function() {
            document.querySelector(".question-item-container:nth-child(9) .el-radio:nth-child(1) .el-radio__inner").click();
}, 2000);
                setTimeout(function() {
            document.querySelector(".question-item-container:nth-child(10) .el-radio:nth-child(1) .el-radio__inner").click();
}, 2000);
                setTimeout(function() {
            document.querySelector(".question-item-container:nth-child(11) .el-textarea__inner").click();
}, 2000);
        setTimeout(function() {
            document.querySelector(".question-item-container:nth-child(11) .el-textarea__inner").value = inspire;
}, 2000);
        setTimeout(function() {
            document.querySelector(".question-item-container:nth-child(12) .el-textarea__inner").click();
}, 2000);
        setTimeout(function() {
            document.querySelector(".question-item-container:nth-child(12) .el-textarea__inner").value = "非常棒";
}, 2000);
        setTimeout(function() {
            document.querySelector(".el-row > .el-button").click();
}, 2000);
        setTimeout(function() {
            document.querySelector(".el-button--default:nth-child(2) > span").click();
}, 3000);
    }

    function main() {
             setTimeout(function() {
             document.querySelector('.el-message-box__btns span').click();
},1000);
        
        for (let i = 0; i < teacher; i++) {
             setTimeout(function() {
             criteria();
},3000+3000*i);
    }



    }

    window.onload = function() {
        main();
    };
})();
