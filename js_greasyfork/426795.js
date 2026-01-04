// ==UserScript==
// @name         防止mobius误提交
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  在你写mobius作业的时候，有可能还没写完就点到提交按钮，这就很麻烦了。所以安装此插件可以防止你在截至时间前提交。
// @author       You
// @match        https://jinanbham.mobiuscloud.cn/modules/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426795/%E9%98%B2%E6%AD%A2mobius%E8%AF%AF%E6%8F%90%E4%BA%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/426795/%E9%98%B2%E6%AD%A2mobius%E8%AF%AF%E6%8F%90%E4%BA%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //alert("as");

    $('.btn-default:contains("提交试卷")').hide();
    $('.btn-primary:contains("提交试卷")').hide();
    $('.btn btn-default:contains("提交试卷")').hide();
})();