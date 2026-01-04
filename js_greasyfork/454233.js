
// ==UserScript==
// @name        超星学习通考试解除禁止复制、禁止粘贴最新版
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  🔥超星学习通考试解除禁止复制、禁止粘贴🔥
// @author       CHENL
// @include     *chaoxing.com/exam/*
// @include     *chaoxing.com/mooc2/exam/*
// @include     *mooc1.chaoxing.com/exam-ans/exam/*
// @include     *mooc1.chaoxing.com/exam-ans/exam/test/*
// @include     *mooc1.chaoxing.com/exam-ans/mooc2/exam/
// @include     *mooc1.chaoxing.com/exam-ans/mooc2/exam/preview?courseId=229081651&classId=64612512&start=3&cpi=200377496&examRelationId=2714034&examRelationAnswerId=78773427&newMooc=true&openc=9d6f9771587efb255aec1d5c2fc7b8f1&monitorStatus=0&monitorOp=-1&remainTimeParam=5817&relationAnswerLastUpdateTime=1670910158332&enc=1246b551f790f39265919071e3a73c85
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454233/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%80%83%E8%AF%95%E8%A7%A3%E9%99%A4%E7%A6%81%E6%AD%A2%E5%A4%8D%E5%88%B6%E3%80%81%E7%A6%81%E6%AD%A2%E7%B2%98%E8%B4%B4%E6%9C%80%E6%96%B0%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/454233/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%80%83%E8%AF%95%E8%A7%A3%E9%99%A4%E7%A6%81%E6%AD%A2%E5%A4%8D%E5%88%B6%E3%80%81%E7%A6%81%E6%AD%A2%E7%B2%98%E8%B4%B4%E6%9C%80%E6%96%B0%E7%89%88.meta.js
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
        if(window.location.href.includes("newMooc=true")){
            $("<div style='background: #86b430;display:inline;border: solid 1px #6f8e30;color: #FFF;padding: 2px 10px;cursor: pointer;' onclick='copyContentNew(event)'>复制题目</div>").insertAfter($(".colorShallow"))
        }else{
            $("<div style='background: #86b430;display:inline;border: solid 1px #6f8e30;color: #FFF;padding: 2px 10px;cursor: pointer;' onclick='copyContentOld(event)'>复制题目</div>").insertAfter($(".Cy_TItle").find("p"))
        }
        window.copyContentOld = function(event) {
            setTimeout(()=>{
                var range = document.createRange();
                var selection = window.getSelection();
                selection.removeAllRanges();
                range.selectNodeContents($(event.srcElement.parentNode).find("p")[0]);
                selection.addRange(range);
                document.execCommand('copy');
                selection.removeAllRanges();
                let tips = $("<span style='color:red'>复制成功</span>").appendTo($(event.srcElement.parentNode));
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
                let tips = $("<span style='color:red'>复制成功</span>").insertAfter($(event.srcElement));
                setTimeout(()=>{
                    tips.remove();
                },1000)
            },1000)
        }
    })
})();