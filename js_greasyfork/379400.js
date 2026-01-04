// ==UserScript==
// @name         New CZZ 终止交易确认书
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       zhurujin
// @match        https://rpt.interotc.com.cn/ReportSys/otcderivatives/addRiskWarn?type=5*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379400/New%20CZZ%20%E7%BB%88%E6%AD%A2%E4%BA%A4%E6%98%93%E7%A1%AE%E8%AE%A4%E4%B9%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/379400/New%20CZZ%20%E7%BB%88%E6%AD%A2%E4%BA%A4%E6%98%93%E7%A1%AE%E8%AE%A4%E4%B9%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var mainUrl  = 'https://10.2.86.31';
    var contractNo = GetQueryString('contractNo');
    console.log(contractNo);
    $.ajax({
        url: mainUrl + '/api/option_parameter/option_parameter_query?protocal=' + contractNo,
        type:'GET',
        dataType:'jsonp',
        success:function(data){
            handleData(data[0]);
            console.log(data);
        }
    });

    //填写数据
    function handleData(data){
        var terminalType = data.IS_TERMINATION === '否' ? '0':'1';
        //终止类型
        $('#tType').combobox('setValue', terminalType);
        //终止日期
        $('#tDate').datebox('setValue', data.INITIAL_OBSERVATION_DATE.replace(/\//g,'-'));
        //是否展期
        $('#extension').combobox('setValue', '01');
        //填报方累计净收益
        $('#tIncome').textbox('setValue',data.NET_TRADING.toFixed(2));
    }
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r !== null) return unescape(r[2]); return null;
    }

    function AutoUpdateZHY(contractNo, confirmNo){
        var token = '18a9ce1022cf908bbbfef6585db31b31';
        var url = `${mainUrl}/api/option_parameter/update_terminal_status?token=${token}&contractNo=${contractNo}&confirmNo=${confirmNo}`;
        console.log("更新综合业务平台数据: " + url);
        $.ajax({
            url:url,
            type:'GET',
            dataType:'jsonp',
            success:function(data){
                alert("更新综合业务平台Done！");
            }
        });
    }

    //绑定点击提交事件更新综合业务平台
    $('a.easyui-linkbutton.bondBtn.l-btn.l-btn-small.l-btn-plain[onclick="submitForm();"]').on('click',function(event){
        console.log("点击提交，更新综合业务平台");
        var confirmNo = $('input[textboxname="jNumber"]').textbox('getValue');
        AutoUpdateZHY(contractNo, confirmNo);
    });

    setTimeout(function(){
         console.log("点击提交，更新综合业务平台");
        var confirmNo = $('input[textboxname="jNumber"]').textbox('getValue');
        AutoUpdateZHY(contractNo, confirmNo);
    }, 5000);
})();