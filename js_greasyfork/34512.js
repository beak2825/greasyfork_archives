// ==UserScript==
// @name         sbcuiwen
// @namespace    https://github.com/xiaoguan002/sbcuiwen
// @version      1.2
// @description  sbcuiwen 1.0
// @author       xiaoguan002
// @match        https://shop.48.cn/tickets/item/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34512/sbcuiwen.user.js
// @updateURL https://update.greasyfork.org/scripts/34512/sbcuiwen.meta.js
// ==/UserScript==

/*-------------------------------------------脚本内容无须修改------------------------------------------------*/
(function() {
    'use strict';
    var _num=1;
    var looptime = 10;
    var _seattype;
    var L_state = false;
    var _id = location.pathname.split('/tickets/item/')[1];
    var _brand_id = $('body').text().match(/brand_id: (\d+)/)[1];
    var lastTime = 0;

    $('#addcart').after('<div id="Tmessage">null</div>');
    var content = '&emsp;刷新时间：<span class="refreshTime" style="color:#E53333;">null</span>' +
        '&emsp; 信息：<span class="message" style="color:#E53333;">null</span>' +
        '&emsp; 错误代码：<span class="errorCode" style="color:#E53333;">0</span>' +
        '&emsp; 请求时间：<span class="callTime" style="color:#E53333;">null</span><br/>';

    $("#Tmessage").html(content);

    $('#buy').after('<a href="javascript:void(0);" id="Tloop" class="ma_r10">开始捡漏</a>');
    $('#Tloop').attr("style","color:#FFF; padding:5px 10px; background:#ffbb00; display:block; border-radius: 5px; border:1px solid #ffbb00; float:left;");
    $('li:eq(2)',$('.i_sel:eq(0)')).after('<li>捡漏票种：<input type="checkbox" class="ISeatType" value="2">VIP坐票' +
                                          '&emsp; <input type="checkbox" class="ISeatType" value="3">普通坐票' +
                                          '&emsp; <input type="checkbox" class="ISeatType" value="4">普通站票</li>' +
                                         '<li>刷票间隔：<input type="text" id="ILoopTime" size="4" style="text-align:right">ms</li>');
    $('#ILoopTime').val(looptime);

    $("#Tloop").click( function() {
        if(L_state){
            L_state = false;
            $('.ISeatType').attr('disabled',false);
            $('#ILoopTime').attr('disabled',false);
            $('#Tloop').html('开始捡漏');
        }
        else{
            var n =0;
            var checkArray = document.getElementsByClassName("ISeatType");
            _seattype = new Array();
            for(var i=0;i<checkArray.length;i++){
                if(checkArray[i].checked){
                    _seattype[n]=checkArray[i].value;
                    n++;
                }
            }
            looptime = $('#ILoopTime').val();
            if(n==0){
                layer.msg("请选择捡漏票种");
            }else if(looptime<1){
                layer.msg("刷票间隔需为正值");
            }else if(looptime>=1){
                $('.ISeatType').attr('disabled',true);
                $('#ILoopTime').attr('disabled',true);
                L_state =true;
                $('#Tloop').html('停止捡漏');
                loopTickets();
            }else{
                layer.msg("请输入正确的刷票间隔");
            }
        }
    });


    function dateToTime(date){
        return (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ':' +
            (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ':' +
            (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
    }

    var date;
    var j=0;
    var sign = false;
    function loopTickets() {
        if(L_state){
            $('.refreshTime').html(dateToTime(new Date()));
            $('.message').html("waiting...");
            if ($("#buy").hasClass("blue_nb_gray")) {
                setTimeout(function(){loopTickets();},looptime);
                return;
            }
            $.ajax({
                url: "/tickets/saleList",
                type: "get",
                dataType: "json",
                data: {id:_id,brand_id:_brand_id},
                success: function (data) {
                    if (data.length>0)
                    {
                        date = new Date().getTime();
                        $(data).each(function(i,n){
                            for(j=0;j<_seattype.length;j++) {
                                if (n.seat_type ==_seattype[j] && n.amount>0 && n.tickets_sale_is_on_sale == true) {
                                    lastTime = date;
                                    buyTicket(_id,_num,n.seat_type,_brand_id);
                                }
                            }
                        });
                    }
                },
                error: function (e) {
                    $('.message').html("刷新失败，请检查网络");
                }
            });
        }
    }


    function buyTicket(ticketId,num,seatType,brandId)
    {
        $.ajax({
            url: "/TOrder/add",
            type: "post",
            dataType: "json",
            data: { id: ticketId, num: num, seattype: seatType, brand_id: brandId, r: Math.random() },
            success: function (result) {
                if(result.Message != null)
                    result.Message = result.Message.replace(/<br\/>/g,' ');
                $('.callTime').html(dateToTime(new Date()));
                $('.message').html(result.Message);
                $('.errorCode').html(result.ErrorCode);
                if(result.HasError)
                    setTimeout(function(){loopTickets();},looptime);
                else
                    if(result.Message=="success"){
                        $('.errorCode').after('&emsp; 订单号：<span style="color:#E53333;">' + result.ReturnObject + '</span>');
                        window.location.href = result.ReturnObject;
                    }
                else
                    setTimeout(function(){checkTicket(ticketId,num,seatType,brandId,0);},2000);
            },
            error: function (e) {
                $('.callTime').html(dateToTime(new Date()));
                $('.message').html("fail");
                $('.errorCode').html("162001");
                setTimeout(function(){loopTickets();},looptime);
            }
        });
    }

    function checkTicket(ticketId,num,seatType,brandId,times){
        $.ajax({
            url: "/TOrder/tickCheck",
            type: "GET",
            dataType: "json",
            data: { id: ticketId,r: Math.random() },
            success: function (result) {
                if(result.Message != null)
                    result.Message = result.Message.replace(/<br\/>/g,' ');
                $('.callTime').html(dateToTime(new Date()));
                $('.message').html(result.Message);
                $('.errorCode').html(result.ErrorCode);
                if (result.HasError){
                    setTimeout(function(){loopTickets();},looptime);
                }
                else
                    switch(result.ErrorCode){
                        case "wait":
                            if(times<2)
                                setTimeout(function(){checkTicket(ticketId,num,seatType,brandId,++times);},5000);
                            else
                                setTimeout(function(){loopTickets();},looptime);
                            break;
                        case "success":
                            $('.errorCode').after('&emsp; 订单号：<span style="color:#E53333;">' + result.ReturnObject + '</span>');
                            window.location.href = result.ReturnObject;
                            break;
                        case "fail":
                            setTimeout(function(){loopTickets();},looptime);
                            break;
                        default:
                            setTimeout(function(){loopTickets();},looptime);
                            break;
                    }

            },
            error: function (e) {
                $('.callTime').html(dateToTime(new Date()));
                $('.message').html("您排队失败，请刷新重试");
                $('.errorCode').html("162002");
            }
        });
    }



})();
