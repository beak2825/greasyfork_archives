// ==UserScript==
// @name         soldout2查询物品均价
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在#store里点开物品可以快速看到昨日成交均价 帮你快速了解市场行情
// @author       You
// @match        https://so2.mutoys.com/
// @require      https://code.jquery.com/jquery-2.2.4.js

// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/381968/soldout2%E6%9F%A5%E8%AF%A2%E7%89%A9%E5%93%81%E5%9D%87%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/381968/soldout2%E6%9F%A5%E8%AF%A2%E7%89%A9%E5%93%81%E5%9D%87%E4%BB%B7.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var ref = "";
    var check_res;
    var datetime=getNowFormatDate();

    function showprice(){
        //读取是不是在store 如果是 则继续，避免在奇怪的地方显示价格
        var domain = window.location.href;
        var item=$('span.icon-category2x');
        var item2=$('span.icon-category');
        var itemclass,itemid
        if(item.length>0)
        {
            itemclass=item.next().attr('class');
            itemid=itemclass.trim().split(" ")[2].split("-")[2];
        }
        else if (item2.length>0)
        {
            item=item2;
            itemclass=item.parent().prev().children().attr('class');
            itemid=itemclass.trim().split(" ")[2].split("-")[2];
        }
        else
        {
            return
        }

        if((domain.indexOf("#store")<=0&&domain.indexOf("#stock")<=0)||item.attr('class').indexOf("flag")>0)
        {
            return;
        }
        if(check_res==null){
            getreportdata();
        }

        var dealdata;
        $.ajax({
            type: "GET",
            dataType:"json",
            async:false,
            url: "https://so2.mutoys.com/info/deal/"+itemid+"/0",
            success: function(data){
                dealdata=data;
            },
            error:function(e){
                return;
            }
        });
        var systemunit=0,systemprice=0,userunit=0,userprice=0,requestunit=0,requestprice=0,requestdeal="";
        if(check_res.system.item[itemid]!=null)
        {
            systemunit=check_res.system.item[itemid]["unit"]
            systemprice=check_res.system.item[itemid]["price"]
        }
        if(check_res.user.item[itemid]!=null)
        {
            userunit=check_res.user.item[itemid]["unit"]
            userprice=check_res.user.item[itemid]["price"]
        }
        if(check_res.request.item[itemid]!=null)
        {
            requestunit=check_res.request.item[itemid]["unit"]
            requestprice=check_res.request.item[itemid]["price"]
        }
        if(dealdata!=null&&dealdata[0].res.requests.length>0){
            requestdeal="<br />现有收单价格:"+dealdata[0].res.requests[0].price+"<br />";
        }

        if (item2.length>0)
        {
            item.parent().parent().parent().parent().next().before(
                "<span style='font-size: 70%;color: #2196f3'>"+
                "NPC---数量-" +systemunit+",均价-"+systemprice+"<br />"+
                "玩家---数量-" +userunit+",均价-"+userprice+"<br />"+
                "订单---数量-"+requestunit+",均价-"+requestprice+
                requestdeal+"</span>"
            );
        }
        else
        {
            item.parent().parent().after(
            "<span style='font-size: 70%;color: #2196f3'>"+
            "NPC---数量-" +systemunit+",均价-"+systemprice+"<br />"+
            "玩家---数量-" +userunit+",均价-"+userprice+"<br />"+
            "订单---数量-"+requestunit+",均价-"+requestprice+
            requestdeal+"</span>"
        );
        }

        item.addClass("flag")
    }
    ref = setInterval(function(){
        showprice();
    },2000);

    function getreportdata(){
        $.ajax({
            type: "GET",
            dataType:"json",
            async:false,
            url: "https://s3-ap-northeast-1.amazonaws.com/so2-api.mutoys.com/json/report/buy"+datetime+".json",
            success: function(data){
                check_res= data;
            },
            error:function(e){
            }
        });
    }

    function getdealdata(itemid){
        $.ajax({
            type: "GET",
            dataType:"json",
            async:false,
            url: "https://so2.mutoys.com/info/deal/"+itemid+"/0",
            success: function(data){
                var result=data;
                return result;
            },
            error:function(e){
            }
        });
    }

    function getNowFormatDate(){
        var day = new Date();
        var Year = 0;
        var Month = 0;
        var Day = 0;
        var CurrentDate = "";
        Year= day.getFullYear();//支持IE和火狐浏览器.
        Month= day.getMonth()+1;
        Day = day.getDate()-1;
        CurrentDate += Year;
        if (Month >= 10 ){
            CurrentDate += Month;
        }
        else{
            CurrentDate += "0" + Month;
        }
        if (Day >= 10 ){
            CurrentDate += Day ;
        }
        else{
            CurrentDate += "0" + Day ;
        }
        return CurrentDate;
    }
})();