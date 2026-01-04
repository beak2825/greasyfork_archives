// ==UserScript==
// @name         交大的课都是精品课，我除了感恩还能做什么呢
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  赞美太阳
// @author       Victrid
// @match        https://i.sjtu.edu.cn/xspjgl/*
// @icon         data:image/png;base64,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
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/436985/%E4%BA%A4%E5%A4%A7%E7%9A%84%E8%AF%BE%E9%83%BD%E6%98%AF%E7%B2%BE%E5%93%81%E8%AF%BE%EF%BC%8C%E6%88%91%E9%99%A4%E4%BA%86%E6%84%9F%E6%81%A9%E8%BF%98%E8%83%BD%E5%81%9A%E4%BB%80%E4%B9%88%E5%91%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/436985/%E4%BA%A4%E5%A4%A7%E7%9A%84%E8%AF%BE%E9%83%BD%E6%98%AF%E7%B2%BE%E5%93%81%E8%AF%BE%EF%BC%8C%E6%88%91%E9%99%A4%E4%BA%86%E6%84%9F%E6%81%A9%E8%BF%98%E8%83%BD%E5%81%9A%E4%BB%80%E4%B9%88%E5%91%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var pjfz = window.pjfz = {};

    pjfz.hqkc = function() {
        var t = 1;
        while($("#"+t).length==1){
            t+=1;
        }
        return t-1;
    };

    pjfz.xzpj = function () {
        $(".radio-pjf[data-dyf=\"95\"]").each( function (index, element) {
            element.checked = true;
        });
        var input_str = $("#xspy").val();
        const reg = /\[%teacher%\]/;
        input_str = input_str.replace(reg, $('#jsxm').html());
        $(".panel-body textarea").val(input_str);
        $("#btn_xspj_bc").data("enter", "1");
        $("#btn_xspj_bc").click();
    }

    pjfz.zdpj = async function () {
        var zdkc = pjfz.hqkc();
        for(var xzkc=1;xzkc<=zdkc;xzkc++){
            if($("#"+xzkc).is(':contains("提交")'))
                continue;
            $("#"+xzkc).click();
            while($("#ajaxForm1").length == 0){
                await new Promise(r => setTimeout(r, 1000));
            }
            pjfz.xzpj();
            while($("#btn_ok").length == 0){
                await new Promise(r => setTimeout(r, 1000));
            }
            $("#btn_ok").click();
            await new Promise(r => setTimeout(r, 1000));
        }
    };

    pjfz.tjdq = async function () {
            $("#btn_xspj_tj").data("enter", "1");
            $("#btn_xspj_tj").click();
    };

    pjfz.tjqb = async function () {
        var zdkc = pjfz.hqkc();
        for(var xzkc=1;xzkc<=zdkc;xzkc++){
            if($("#"+xzkc).is(':contains("未")'))
                continue;
            if($("#"+xzkc).is(':contains("提交")'))
                continue;
            $("#"+xzkc).click();
            var havetj = 5;
            while($("#btn_xspj_tj").length == 0 && havetj){
                await new Promise(r => setTimeout(r, 1000));
                havetj -= 1;
            }
            if (havetj){
                $("#btn_xspj_tj").data("enter", "1");
                $("#btn_xspj_tj").click();
                havetj = 5;
                while($("#btn_ok").length == 0 && havetj){
                    await new Promise(r => setTimeout(r, 1000));
                    havetj -= 1;
                }
                if(havetj) {
                    $("#btn_ok").click();
                    await new Promise(r => setTimeout(r, 1000));
                }
            }
        }
    };

    $("#pjzttts").css("margin-bottom","10px");

    $("#kc-head").append("<div class=\"panel-title\" style=\"padding: 10px; background: #D6EAF8; border: 1px solid #ccc; border-radius: 5px;\"> <center>"
                        + "<p>评教内容</p> <br/>"
                        + "可以使用[%teacher%]来替换老师名字"
                        + "<textarea class=\"form-control input-zgpj\" rows=\"4\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"\" "
                        + " maxlength=\"500\" placeholder=\"请至少输入0个字，至多输入500个字\" data-original-title=\"\" style=\"margin-top: 10px\" id=\"xspy\">"
                        + "课程质量很高，[%teacher%]老师授课富有激情。\</textarea> "
                        + "<div class=\"btn-group \" style=\"float: none; margin-top: 10px\">"
                        + "<button class=\"btn btn-default btn-default\" type=\"button\" onclick=\"pjfz.xzpj()\">评当前</button> "
                        + "<button class=\"btn btn-default btn-default\" type=\"button\" onclick=\"pjfz.zdpj()\">评全部</button> "
                        + "<button class=\"btn btn-default btn-default\" type=\"button\" onclick=\"pjfz.tjdq()\">提交当前</button> "
                        + "<button class=\"btn btn-default btn-default\" type=\"button\" onclick=\"pjfz.tjqb()\">提交全部</button> "
                        + "</div>"
                        + "</center> </div>")
})();