// ==UserScript==
// @name         一汽-大众销售促进系统增强
// @namespace    http://tampermonkey.net/
// @version      2.0.6
// @description  让销售促进系统的项目审核状态更加醒目、增加任意月份跳转功能等
// @author       摸鱼君Lio
// @match        http://faw-vw.bresearch.cn:11025/faw/dealership/events?dealershipID=*
// @match        http://faw-vw.bresearch.cn:11025/faw/event/AddPlan?form=*
// @match        http://faw-vw.bresearch.cn:11025/faw/event/ModifyEvent?eventID=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393882/%E4%B8%80%E6%B1%BD-%E5%A4%A7%E4%BC%97%E9%94%80%E5%94%AE%E4%BF%83%E8%BF%9B%E7%B3%BB%E7%BB%9F%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/393882/%E4%B8%80%E6%B1%BD-%E5%A4%A7%E4%BC%97%E9%94%80%E5%94%AE%E4%BF%83%E8%BF%9B%E7%B3%BB%E7%BB%9F%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
if (location.href.match(/^http:\/\/faw-vw\.bresearch\.cn:11025\/faw\/dealership\/events\?dealershipID=[0-9]+/)) {
    //--------------审核状态醒目化--------------
    (function () {
        'use strict';
        var state
        var obj = $("tbody:first>tr");
        //对每个立项迭代
        obj.each(function () {
            state = $(this).children("td").eq(6);
            //根据文本内容匹配对应的CSS样式
            switch (state.html()) {
            case "等待审核(Waiting)(第三方)":
            case "等待审核(Waiting)":
                state.css({
                    "background-color": "Orange"
                });
                break;
            case "等待审核(Waiting)(区域)":
            case "驳回，申诉中(Appeal)":
                state.css({
                    "background-color": "Yellow"
                });
                break;
            case "通过(Allowed)":
            case "区域特殊审核(通过(Allowed))":
                state.css({
                    "background-color": "Green",
                    "color": "Lime"
                });
                break;
            case "驳回(Disallowed)":
                state.css({
                    "background-color": "Red"
                });
                break;
            default:
                break;
            }
        });

    })();

    //--------------任意月份跳转--------------
    (function () {
        'use strict';
        //年份选单的html代码
        var y2Jump_slt_html = ''
            y2Jump_slt_html += '<select class="valid" id="y2Jump" style="float:left;width:21%">';
        y2Jump_slt_html += '<option value=0 selected="selected">-</option>';
        y2Jump_slt_html += '<option value=2017>2017</option>';
        y2Jump_slt_html += '<option value=2018>2018</option>';
        y2Jump_slt_html += '<option value=2019>2019</option>';
        y2Jump_slt_html += '<option value=2020>2020</option>';
        y2Jump_slt_html += '</select>';

        //月份选单的html代码
        var m2Jump_slt_html = ''
            m2Jump_slt_html += '<select class="valid" id="m2Jump" style="float:left;width:15%">';
        m2Jump_slt_html += '<option value=0 selected="selected">-</option>';
        m2Jump_slt_html += '<option value=1>1</option>';
        m2Jump_slt_html += '<option value=2>2</option>';
        m2Jump_slt_html += '<option value=3>3</option>';
        m2Jump_slt_html += '<option value=4>4</option>';
        m2Jump_slt_html += '<option value=5>5</option>';
        m2Jump_slt_html += '<option value=6>6</option>';
        m2Jump_slt_html += '<option value=7>7</option>';
        m2Jump_slt_html += '<option value=8>8</option>';
        m2Jump_slt_html += '<option value=9>9</option>';
        m2Jump_slt_html += '<option value=10>10</option>';
        m2Jump_slt_html += '<option value=11>11</option>';
        m2Jump_slt_html += '<option value=12>12</option>';
        m2Jump_slt_html += '</select>';

        //跳转按钮
        var jump_btn_html = ''
            jump_btn_html += '<a class="btn btn-default" id="jump_btn">跳转</a>';

        //以上全部工具
        var jump_tool_html = '';
        jump_tool_html += y2Jump_slt_html;
        jump_tool_html += m2Jump_slt_html;
        jump_tool_html += jump_btn_html;

        //将以上拼接的html代码插入到网页里的div中
        var rightToolBar = $("div.right-toolbar").children();
        if (rightToolBar) {
            rightToolBar.prepend(jump_tool_html)
        }

        //获取经销商ID
        var lastMonthLink = $('.right-toolbar>div').first().children('a').eq(1).attr('href')
            var dealershipID = lastMonthLink.match(/(?<=dealershipID=)\d*/)[0]

            //设置选单默认年份
            var curYear = lastMonthLink.match(/(?<=year=)\d{4}/)[0];
        $('#y2Jump>option').each(function () {
            if ($(this).val() == curYear) {
                $(this).attr("selected", "selected")
            }
        })

        //设置跳转按钮单击事件
        $("#jump_btn").click(function () {
            //跳转动作
            let m2Jump = $('#m2Jump').val();
            let y2Jump = $('#y2Jump').val();
            if ((y2Jump > 0) && (m2Jump > 0)) {
                let page2Jump = 'http://';
                page2Jump += 'faw-vw.bresearch.cn:11025/faw/dealership/events?dealershipID=';
                page2Jump += String(dealershipID);
                page2Jump += '&year=' + String(y2Jump);
                page2Jump += '&month=' + String(m2Jump);
                //跳转
                location.href = page2Jump;
            }
        });
    })();
}

if (
location.href.match(/^http:\/\/faw-vw\.bresearch\.cn:11025\/faw\/event\/AddPlan\?form=\d0&dealershipId=\d{1,4}&guideID=/)
||location.href.match(/^http:\/\/faw-vw\.bresearch\.cn:11025\/faw\/event\/ModifyEvent\?eventID=\d*/)
) {
    //--------------选中在售全系（非新能源）--------------
    function setAllModelChecked() {
        //获取当前全系勾选状态
        const MDLARR = [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0]
        let stateArr = new Array();
        $('#event-models>div').find('input[name="cbModelPercent"]').each(function () {
            if ($(this).attr('type') == 'hidden') {
                stateArr.push(0);
            } else {
                stateArr.push(1);
            }

        })
        $('input#cbModelSelected').each(function () {
            let modelId = $(this).attr('data-id');
            //判断是否已勾选
            if (stateArr[modelId - 1] != MDLARR[modelId - 1]) {
                $(this).click();
            } else if (($(this).attr('data-id') < 6 || $(this).attr('data-id') > 7) && $(this).attr('data-id') < 13 && stateArr.toString() == MDLARR.toString()) {
                $(this).click();
            }
        });
        //调用预算分配函数
        setBudgetPercentage(10);
    };

    //预算分配函数
    function setBudgetPercentage(qty) {
        //TO DO
        let baseBP = Math.floor(100 / qty);
        let restBP = 100 % qty;
        $('#event-models>div').find('input[type="number"]').each(function () {
            //排除 JETTA及OTHER
            if ($(this).attr('data-id') < 6 || $(this).attr('data-id') > 7) {
                //分配百分比
                $(this).val(parseInt(baseBP));
            }
        });
        $('#event-models>div').find('input[type="number"]').last().val(parseInt(baseBP + restBP));
    };

    //按钮
    var eventModel_btn_html = ''
        eventModel_btn_html += '<button type="button" class="btn btn-default btn-sm" id="btnAllModel">全系</button>';
    eventModel_btn_html += '<button type="button" class="btn btn-default btn-sm" id="btnDistBgt">分配占比</button>';

    //将按钮插入页面中
    $('#event-models').prepend(eventModel_btn_html);

    //按钮事件
    $('#btnAllModel').click(function () {
        setAllModelChecked();
    });
    $('#btnDistBgt').click(function () {
        let n = $('#event-models>div').find('input[type="number"]').size();
        setBudgetPercentage(n);
    });
};
