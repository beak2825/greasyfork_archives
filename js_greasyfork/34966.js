// ==UserScript==
// @version        2017.11.01
// @name 来贝使用JSON快速添加
// @description 来贝快速添加投资记录，采用从记呗详单页面复制的JSON
// @name 51laibeiquickadd
// @namespace 51laibeiquickadd
// @match https://www.51laibei.com/user/add_invest_record.html*
// @match https://www.51laibei.com/invest/addInvestRecord*
// @grant 51laibeiquickadd
// @downloadURL https://update.greasyfork.org/scripts/34966/%E6%9D%A5%E8%B4%9D%E4%BD%BF%E7%94%A8JSON%E5%BF%AB%E9%80%9F%E6%B7%BB%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/34966/%E6%9D%A5%E8%B4%9D%E4%BD%BF%E7%94%A8JSON%E5%BF%AB%E9%80%9F%E6%B7%BB%E5%8A%A0.meta.js
// ==/UserScript==
$(function(){
    var json_from_jibei='<input id="jsondata" type="text" style="width:100%;color:green;line-height:32px;" /><br/><input id="btnFill" type="button" value="一键填充数据到表单中" style="width:100%;background-color:lightgreen;height:32px;font-size:14px;"/>';
    $("#farst").prepend(json_from_jibei);

    $("#btnFill").click(function(){
        //AutoFill();
        delayCompute();
        finishDate();
        alert($("#finishDate").val());
    });

    $("#jsondata").keyup(function(e){
        AutoFill();
    });
    var datetextbox='<input id="qInvestDate" type="text" />';
    $("#lendDate").after(datetextbox);
    $("#qInvestDate").keyup(function(){
        $("#lendDate").val($("#qInvestDate").val());
    });

    function AutoFill(){
        //trigger on user press ctrl+v, CTRL:17, V:86 (e.ctrlKey not works)
        if (e.which == 86) {
            var jsondata=$("#jsondata").val();
            var idata=eval("("+jsondata+")");
            //平台
            var website=idata["website"];
            //项目
            var project=idata["project"];
            //金额
            var amount=idata["amount"];
            //日期
            var investdate=idata["investdate"].replace("/","-").replace("/","-");
            //投资期限
            var investterm=idata["investterm"];
            var limitTimeLabel=investterm.indexOf("天")>0?'天':'月';
            var limitTime=investterm.replace("个月","").replace("天","").replace(".00","");
            //管理费
            var managementfee=idata["managementfee"];
            //年化利率
            var rate=idata["rate"];
            //还款方式
            var rembtype=idata["rembtype"];
            //奖励抵扣
            var reward=idata["reward"];

            $("#platName").val(website);
            $("#lendDate").val(investdate);
            $("#lendMoney").val(amount);

            $("#limitTime").val(limitTime);
            $("#limitTimeLabel").text(limitTimeLabel);
            if(limitTimeLabel=='天'){
                //$("input[name='limitType']:checked").val()
                $("#limitTypeD").attr("checked","checked");
                $("#limitTypeM").removeAttr("checked");
                $("#jsondata").css("color","red");
            }
            else{
                $("#limitTypeM").attr("checked","checked");
                 $("#limitTypeD").removeAttr("checked");
                $("#jsondata").css("color","green");
            }
            $("#rate").val(rate);
            $("#cashBack").val(reward);
            $("#remark").val(project);
            //$("#manageFee").val("10");
            delayCompute();
            adjust();
        }
    }


});
