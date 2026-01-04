// ==UserScript==
// @name         上人气Copy
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Just for myself
// @author       You
// @match       http://shang.shangrenqi.com/manage/trade_refund*
// @match       http://shang.shangrenqi.com/manage/normal_order*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/372928/%E4%B8%8A%E4%BA%BA%E6%B0%94Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/372928/%E4%B8%8A%E4%BA%BA%E6%B0%94Copy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function GMaddStyle(cssText){
        let a = document.createElement('style');
        a.textContent = cssText;
        let doc = document.head || document.documentElement;
        doc.appendChild(a);
    }
    GMaddStyle(`
.copyAll{
	cursor:pointer;
	width:40px;
	height:28px;
	font-size: 15px;
	border-radius:4px;
	line-height:26px;
	text-align:center;
	border: #fe6725 solid 1px;
	color: #FFFFFF;
	transition: border 0.25s linear, color 0.25s linear, background-color 0.25s linear;
	margin-left:130px;
	margin-top:-2px;
	position: absolute;
}
.copyAll:hover{
	background: #fff;
    color: #fe6725;
}
.copyAll:active{
	background: #af3500;
}
.copy01{
    background: #fe6725;
}
.copy02{
    background: #fe6725;
}
.copy10{
    background: #2270ff;
}
.copy11{
    background: #ff3b00;
}
.copy12{
    background: #e51816;
}
    `);
/*------------------------------------------------------------------------------------------------------------------------`
-------------------------------------------------------------------------------------------------*/
    $("body").on("click",function(){
        myAddButton();
    })
    $("body").on("click",".copyAll",function(){
        var str_id,str_name,str_monkey,myCptext
        if(window.location.href.substring(0,48) == "http://shang.shangrenqi.com/manage/trade_refund" || window.location.href.substring(0,48) == "http://shang.shangrenqi.com/manage/trade_refund?"){
            str_id = $(this).parent().prev().prev().prev().prev().children("p").eq(4).text().split("：")[1];
            str_name = $(this).parent().prev().prev().prev().children("p").eq(1).text().split("：")[1];
            str_monkey = $(this).prev().prev().text().split("￥")[1];
            if($(this).parent().prev().prev().prev().prev().children('p').eq(3).text() == '商铺名称：瑞星家装专营店'){
                if(str_id.slice(6,7)!='-'){
                    str_id = insertStr(str_id,6,'-');
                }
            }
            myCptext = str_id + "	" + str_name + "	" + str_monkey;
            // console.log(str_id + "	" + str_name + "	" + str_monkey);
        }else if(window.location.href.substring(0,48) == "http://shang.shangrenqi.com/manage/normal_order"){
            str_id = $(this).parent().text().slice(0,-1);
            str_name = $(this).parent().prev().prev().prev().prev().text();
            myCptext = str_id + "	" + str_name + "	0";
        }
        let oInput = document.createElement('input');
        oInput.value = myCptext;
        document.getElementById("copyYC").appendChild(oInput);
        oInput.select();
        document.execCommand("Copy");
        $("#copyYC").empty();
        $(this).css("background","#ddd");
    })
    function myAddButton(){
        if($("body").find("#copyYC").attr("id")!="copyYC"){
            $("body").append("<div id='copyYC'></div>");
        }
        //console.log(window.location.href.substring(0,45));
        if(window.location.href.substring(0,48) == "http://shang.shangrenqi.com/manage/trade_refund" || window.location.href.substring(0,48) == "http://shang.shangrenqi.com/manage/trade_refund?"){
            if($("#page_data").find(".copyAll").length<=0){
                $("#page_data").find(".row.taskView.form-inline").each(function(){
                    var myshopname = $(this).parent().prev().prev().prev().prev().find('p').eq(3).text();
                    switch(myshopname){
                        case '商铺名称：私人空间瓷砖':
                        $(this).after("<div class='copyAll copy10'>私</div>");
                        break;
                        case '商铺名称：佛山市瑞星陶瓷企业':
                        $(this).after("<div class='copyAll copy11'>瑞</div>");
                        break;
                        case '商铺名称：瑞星家装专营店':
                        $(this).after("<div class='copyAll copy12'>拼</div>");
                        break;
                        default:
                        $(this).after("<div class='copyAll copy01'>C</div>");
                        break;
                    }
                });
            }
        }else if(window.location.href.substring(0,48) == "http://shang.shangrenqi.com/manage/normal_order"){
            if($(".table.table-bordered.text-center.df_info").find(".copyAll").length<=0){
                $(".table.table-bordered.text-center.df_info").find("tr td:nth-child(7)").each(function(){
                    var myshopname = $(this).prev().prev().prev().text();
                    if(myshopname=='手机拼多多任务'){
                        $(this).append("<div class='copyAll copy12'>拼</div>");
                    }else{
                        $(this).append("<div class='copyAll copy02'>C</div>");
                    }
                });
            }
        }
    }
    function insertStr(soure, start, newStr){
        return soure.slice(0, start) + newStr + soure.slice(start);
    }
})();