// ==UserScript==
// @name         pceggs_money_maker
// @namespace    http://tampermonkey.net/
// @version      1.0 Beta
// @description  I got it and made it!
// @author       ztxtxwd
// @match        http://www.pceggs.com/play/pg28Insert.aspx?LID=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391698/pceggs_money_maker.user.js
// @updateURL https://update.greasyfork.org/scripts/391698/pceggs_money_maker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //声明标准赔率集合
    var rates = new Array(1000, 333.3, 166.7, 100, 66.7, 47.6, 35.7, 27.8, 22.2, 18.2, 15.9, 14.5, 13.7, 13.33, 13.33, 13.7, 14.5, 15.9, 18.2, 22.2, 27.8, 35.7, 47.6, 66.7, 100, 166.7, 333.3, 1000);
    //检查是否需要进入下一期
    if($("#fc_an_l170223").html()=='进入下一期'){
        $("#fc_an_l170223").click();
    }
    var interval=window.setInterval(function(){
        if (TSeconds > 0) {
            TSeconds = TSeconds - 1;
            listenTime(TSeconds);
        }
        else {
            window.location.reload()
        }
    }, 1000);
    //获得当前赔率集合
    function getRateList(){
        $.ajax({
            type: "get",
            url: "pg28mode.aspx?refresh="+$("#LID").val(),
            success: function (data, textStatus) {
                bet(getBestNr(data.split(","),rates));
                setpeilv("", data.split(",")); //当前赔率
            }
        });
    }
    //监听剩余时间
    function listenTime(second){
        if(second==2){
            getRateList();
        }
    }
    //获得当前赔率与标准赔率偏离最大的数字
    function getBestNr(data,rates){
        let bestNr = 0;
        let biggestDeviation = data[0]/rates[0];
        for(let i=1;i<data.length;i++){
            let curDeviation = data[i]/rates[i];
            if(biggestDeviation < curDeviation){
                biggestDeviation = curDeviation;
                bestNr = i;
            }
        }
        console.log(bestNr);
        return bestNr;
    }
    //投注
    function bet(bestNr){
        var str = [];
        var smoneysum = $("#SMONEYSUM").val();
        for (var i = 0; i < 28; i++) {
            if(i==bestNr){
                str.push(nub[i]*10);
                smoneysum=nub[i]*10;
            }else{
                str.push('');
            }
        }
        $("#ALLSMONEY").val(str.join(","));
        JumpUrl = "";
        $("input[name='SMONEY']").attr("disabled", false);
        IsExchange = 0;
        var lid = $("#LID").val();
        var ctime = $("#CTIME").val();
        var allsmoney = $("#ALLSMONEY").val();
        var isdb_p = $("#isdb_p").val();
        var smoneyy = $("#SMONEYY").val();
        var cheat = $("#Cheat").val();
        $.ajax({
            dataType: "json",
            type: "Get",
            data: { 'LID': lid, 'CTIME': ctime, 'ALLSMONEY': allsmoney, 'isdb_p': isdb_p, 'SMONEYSUM': smoneysum, 'SMONEYY': smoneyy, 'Cheat': cheat },
            cache: false,
            url: "/play/pg28Insert_ajax.ashx",
            dataType: "json",
            async: false,
            error: function () {
                showmessage("7", "投注失败请重试", LastIssue);
            },
            success: function (data, textStatus) {
                window.location.reload()
            }
        });
    }
})();