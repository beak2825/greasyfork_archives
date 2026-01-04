// ==UserScript==
// @name        超星学习通考试解除禁止复制、禁止粘贴
// @namespace    http://tampermonkey.net/
// @version      0.20
// @description  🔥超星学习通考试解除禁止复制、禁止粘贴🔥
// @author       CHENL
// @include     *chaoxing.com/exam/*
// @include     *chaoxing.com/exam-ans/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435069/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%80%83%E8%AF%95%E8%A7%A3%E9%99%A4%E7%A6%81%E6%AD%A2%E5%A4%8D%E5%88%B6%E3%80%81%E7%A6%81%E6%AD%A2%E7%B2%98%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/435069/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%80%83%E8%AF%95%E8%A7%A3%E9%99%A4%E7%A6%81%E6%AD%A2%E5%A4%8D%E5%88%B6%E3%80%81%E7%A6%81%E6%AD%A2%E7%B2%98%E8%B4%B4.meta.js
// ==/UserScript==
(function() {
    'use strict';
    $(function() {
         setTimeout(()=>{
            $("body").removeAttr("onselectstart");
            $("html").css("user-select", "unset");
            Object.entries(UE.instants).forEach(item=>{
                item[1].options.disablePasteImage = false;
                item[1].removeListener('beforepaste',editorPaste)
            })
        },
        1000);
    })
})();