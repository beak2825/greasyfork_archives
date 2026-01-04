// ==UserScript==
// @name         beyondlinda
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  话费抢单脚本!
// @author       Beyond
// @match        http://www.chadan.wang
// @match        http://chadan.wang/wang/realPhoneRecharge
// @match        http://chadan.wang/wang/makeMoney
// @match        http://99shou.cn/charge/phone/table*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380552/beyondlinda.user.js
// @updateURL https://update.greasyfork.org/scripts/380552/beyondlinda.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var url = window.location.pathname;
    var type = 0;
    if (url.indexOf("makeMoney") >= 0) {
        type = 1;
    }
    else if (url.indexOf("realPhoneRecharge") >= 0) {
        type = 2;
    }
    else if (url.indexOf("charge/phone/table") >= 0) {
        type = 3;
    }
    if (type == 1 || type ==2) {
        var html = "";
        if (type == 1) {
            html += '<div style="margin-top: 10px;margin-left: 50px;margin-right: 50px;">';
            html+='<div><label for="rate" style=""><input style="" id="rate" maxlength="4" autocomplete="off" type="number" placeholder="" value="250">频率ms</label></div>';
            html += '<div style="width:33%;float:left;box-sizing: border-box;border:solid 1px rgba(187, 187, 187, .4);"><label style="padding-top:8px;padding-bottom:8px;font-size:18px;"><input style="width:50%" type="checkbox" name="orderType" value="MOBILE"> 移动</label></div> ';
            html += '<div style="width:33%;float:left;box-sizing: border-box;border:solid 1px rgba(187, 187, 187, .4);"><label style="padding-top:8px;padding-bottom:8px;font-size:18px;"><input style="width:50%" type="checkbox" name="orderType" value="UNICOM"> 联通</label></div> ';
            html += '<div style="width:33%;float:left;box-sizing: border-box;border:solid 1px rgba(187, 187, 187, .4);"><label style="padding-top:8px;padding-bottom:8px;font-size:18px;"><input style="width:50%" type="checkbox" name="orderType" value="TELECOM"> 电信</label></div> </div> ';
            html += '<div style="clear:both"></div>';
            $('#poll').append('<a  href="/wang/realPhoneRecharge" style="display: block;"><div style="background-color:#d9edf7" data-facevalue="500"><p class="command">无券话费</p></div></a>');
        }

        html += '<div style="margin-top: 10px;margin-left: 50px;margin-right: 50px;">';
        html += '<div style="width:33%;float:left;box-sizing: border-box;border:solid 1px rgba(187, 187, 187, .4);"><label style="padding-top:8px;padding-bottom:8px;font-size:18px;"><input style="width:50%" type="radio" name="orderValue" value="10"> 10</label></div> ';
        html += '<div style="width:33%;float:left;box-sizing: border-box;border:solid 1px rgba(187, 187, 187, .4);"><label style="padding-top:8px;padding-bottom:8px;font-size:18px;"><input style="width:50%" type="radio" name="orderValue" value="20"> 20</label></div> ';
        html += '<div style="width:33%;float:left;box-sizing: border-box;border:solid 1px rgba(187, 187, 187, .4);"><label style="padding-top:8px;padding-bottom:8px;font-size:18px;"><input style="width:50%" type="radio" name="orderValue" value="30"> 30</label></div> ';
        html += '<div style="width:33%;float:left;box-sizing: border-box;border:solid 1px rgba(187, 187, 187, .4);margin-top: 10px;"><label style="padding-top:8px;padding-bottom:8px;font-size:18px;"><input type="radio" style="width:50%" name="orderValue" value="50"> 50</label></div> ';
        html += '<div style="width:33%;float:left;box-sizing: border-box;border:solid 1px rgba(187, 187, 187, .4);margin-top: 10px;"><label style="padding-top:8px;padding-bottom:8px;font-size:18px;"><input type="radio" style="width:50%" name="orderValue" value="100"> 100</label></div> ';
        html += '<div style="width:33%;float:left;box-sizing: border-box;border:solid 1px rgba(187, 187, 187, .4);margin-top: 10px;"><label style="padding-top:8px;padding-bottom:8px;font-size:18px;"><input type="radio" style="width:50%" name="orderValue" value="200"> 200</label></div> ';
        html += '<div style="width:33%;float:left;box-sizing: border-box;border:solid 1px rgba(187, 187, 187, .4);margin-top: 10px;margin-bottom: 10px;"><label style="padding-top:8px;padding-bottom:8px;font-size:18px;"><input type="radio" style="width:50%" name="orderValue" value="300"> 300</label></div> ';
        html += '<div style="width:33%;float:left;box-sizing: border-box;border:solid 1px rgba(187, 187, 187, .4);margin-top: 10px;margin-bottom: 10px;"><label style="padding-top:8px;padding-bottom:8px;font-size:18px;"><input type="radio" style="width:50%" name="orderValue" value="500"> 500</label></div></div>  ';
        html += '<div style="clear:both"></div>';
        html += '<button id="grabOrder"  style="display: block;width: 6.9rem;text-align: center;line-height: .96rem;font-family: PingFang-SC-Medium;font-size: .36rem;color: #444;background: #3296fa;border-radius: .48rem;margin-top:10px;margin-bottom: 0px;" id="getOrderScript">开始抢单</button>';
        html += '<div id="logContent" style="width:100%;text-align:center"><textarea  rows="8" style="width:6.9rem;text-align:center;"></textarea></div>';
        $('#getOrder').parent().append(html);
        $('#logContent').hide();
    }
    else if(type ==3){
$('#rememberfacevalue').before("<button id=\"grabOrder\"  class=\"layui-btn layui-btn-warning layui-btn-sm\">自动接单</button>");
        $('.layui-form').after('<div id="logContent" style="width:100%;text-align:center"><textarea rows="8" style="width:100%;text-align:center;"></textarea></div>');
    }

    if (type == 1) {
        $('#grabOrder').click(GrabDirectOrder);
    }
    else if(type==2) {
        $('#grabOrder').click(GrabOrder);
    }
    else if(type==3){
        $('#grabOrder').click(Grab99Order);
    }

    function GrabOrder() {
        var value = $('input[name="orderValue"]:checked').val();
        if (value == "" || value == undefined) {
            alert('请选择面值！');
            return;
        }
        $('#logContent').show();

        var formData = {
            JSESSIONID: myJessionID,
            faceValue: value,
        }
        $.ajax({
            type: "post",
            data: formData,
            url: "http://chadan.wang/order/getDirectCostOrder",
            success: function (rtn) {
                console.log(rtn);
                if (rtn.errorMsg == 'OK' && rtn.data.length>0) {
                    alert("接到订单!");
                    $('#logContent').hide();
                } else if (rtn.errorCode == 2028) {
                    Addlog("抢单失败：" + rtn.errorMsg);
                    setTimeout(GrabOrder(), 1000);

                } else {
                    Addlog("抢单失败：" + rtn.errorMsg);
                    GrabOrder();
                }
            }
        });
    }

    function GrabDirectOrder() {
        var rate = $('#rate').val();
        var types = [];
        $('input[name="orderType"]:checkbox:checked').each(function (index, item) {
            types.push($(this).val());
        });
        if (types == "" || types == undefined) {
            alert('请选择运营商类型！');
            return;
        }
        var value = $('input[name="orderValue"]:checked').val();
        if (value == "" || value == undefined) {
            alert('请选择面值！');
            return;
        }
        $('#logContent').show();
        $('input[name="orderType"]:checkbox:checked').each(function (index, item) {
            var type =$(this).val();
            var amount = $('#takeOrderNum').val();
            var formData = {
                JSESSIONID: myJessionID,
                faceValue: value,
                province: null,
                amount: amount,
                //operator: company[1],
                operator: type,
                channel: 1
            }
            $.ajax({
                type: "post",
                data: formData,
                url: " http://api.chadan.wang/order/getOrderdd623299",
                success: function (rtn) {
                    console.log(rtn);
                    if (rtn.data && rtn.data.length > 0) {
                        alert("接到订单!");
                        $('#logContent').hide();
                    } else if (rtn.errorCode == 2028) {
                        Addlog("抢单失败：" + rtn.errorMsg);
                        setTimeout(GrabDirectOrder, rate);
                    } else {
                        Addlog("抢单失败：" + rtn.errorMsg);
                        GrabDirectOrder();
                    }
                }
            });
        });
    }

    function Grab99Order (){
        var formData = new FormData();
        var facevalue =$('#facevalueSel').val();
        if(facevalue==""){
            layui.layer.msg('请选择接单面值！', {icon: 2});
            return;
        }
        formData.append("facevalue",facevalue);
        var receiveNum=$('#receiveNumSel').val();
        formData.append("receiveNum",receiveNum);
        var channelSel =$('#channelSel').val();
        if(channelSel==""){
            formData.append("channel[0]",1);
            formData.append("channel[1]",2);
            formData.append("channel[2]",3);
        }
        else{
            formData.append("channel",channelSel);
        }
        $.ajax({
            type: "post",
            data: formData,
            processData:false,
            contentType:false,
            url: "http://99shou.cn/charge/phone/receive/info",
            success: function(data){
                console.log(data);
                if(!!data.rtnData){
                    alert("接到订单!");
                    tableReload();
                }else if(data.rtnCode=="010019" || data.rtnCode=="010000"){
                    Addlog("抢单失败：" + data.rtnMsg);
                    setTimeout(Grab99Order, 3000);
                }else{
                    Addlog("抢单失败：" + data.rtnMsg);
                    Grab99Order();
                }
            }
        });

    }
    function getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }
    function Addlog(msg) {
        var str = $('textarea').val();
        var d =new Date();
        var dateStr = d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()+'.'+d.getMilliseconds();
        $('textarea').val(msg+'--'+dateStr + '\r\n' + str);
    }
    var myJessionID = getCookie("logged");
})();