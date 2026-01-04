// ==UserScript==
// @name         去除V2EX广告
// @namespace    remove ad
// @version      1.3
// @description  去广告
// @author       lcc
// @match        https://www.v2ex.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424562/%E5%8E%BB%E9%99%A4V2EX%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/424562/%E5%8E%BB%E9%99%A4V2EX%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function() {
    'use strict';
    setTimeout(function(){
        $('#Rightbar .inner').css('display', 'none');
        $('#Rightbar .sidebar_compliance a').text('去你妈的广告')
    },200)
})();