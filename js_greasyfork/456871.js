// ==UserScript==
// @name        解除禁止复制、禁止粘贴
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  超星学习通考试解除禁止复制、禁止粘贴
// @author       aa
// @license MIT
// @include     *chaoxing.com/exam/*
// @include     *chaoxing.com/mooc2/exam/*
// @include     *mooc1.chaoxing.com/exam-ans/exam/*
// @include     *mooc1.chaoxing.com/exam-ans/exam/test/*
// @include     *mooc1.chaoxing.com/exam-ans/mooc2/exam/
// @include     *mooc1.chaoxing.com/exam-ans/mooc2/exam/preview?courseId=229081651&classId=64612512&start=3&cpi=200377496&examRelationId=2714034&examRelationAnswerId=78773427&newMooc=true&openc=9d6f9771587efb255aec1d5c2fc7b8f1&monitorStatus=0&monitorOp=-1&remainTimeParam=5817&relationAnswerLastUpdateTime=1670910158332&enc=1246b551f790f39265919071e3a73c85
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456871/%E8%A7%A3%E9%99%A4%E7%A6%81%E6%AD%A2%E5%A4%8D%E5%88%B6%E3%80%81%E7%A6%81%E6%AD%A2%E7%B2%98%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/456871/%E8%A7%A3%E9%99%A4%E7%A6%81%E6%AD%A2%E5%A4%8D%E5%88%B6%E3%80%81%E7%A6%81%E6%AD%A2%E7%B2%98%E8%B4%B4.meta.js
// ==/UserScript==
(function() {
    'use strict';
    $(function() {
         setTimeout(()=>{
            $("body").removeAttr("onselectstart");
            $("html").css("user-select", "unset");
            UE.EventBase.prototype.fireEvent = function() {
                return null
            };
        },
        1000);
        window.copyContentOld = function(event) {
            setTimeout(()=>{
                var range = document.createRange();
                var selection = window.getSelection();
                selection.removeAllRanges();
                range.selectNodeContents($(event.srcElement.parentNode).find("p")[0]);
                selection.addRange(range);
                document.execCommand('copy');
                selection.removeAllRanges();
                setTimeout(()=>{
                    tips.remove();
                },
                1000)
            },
            1000)
        }
        window.copyContentNew = function(event) {
            setTimeout(()=>{
                var range = document.createRange();
                var selection = window.getSelection();
                selection.removeAllRanges();
                range.selectNodeContents($(event.srcElement.nextSibling)[0]);
                selection.addRange(range);
                document.execCommand('copy');
                selection.removeAllRanges();
                insertAfter($(event.srcElement));
                setTimeout(()=>{
                    tips.remove();
                },1000)
            },1000)
        }
    })
})();