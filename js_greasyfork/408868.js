// ==UserScript==
// @name 天猫订单管理页面获取订单号收件人信息
// @namespace http://tampermonkey.net/
// @version 0.2
// @description 订单管理界面就可以看到收件人，手机号，地址，快递单号等，不必点击进入订单详情查看，具体使用技巧查看下方介绍或者反馈。
// @author creasyWinds
// @match https://trade.tmall.com/detail/orderDetail.htm?*
// @match https://trade.taobao.com/trade/itemlist/list_sold_items.htm*
// @match https://trade.tmall.com/trade/itemlist/list_sold_items.htm*
// @match https://trade.taobao.com/detail/orderDetail.htm*
// @require https://cdn.bootcss.com/jquery/3.4.0/jquery.js
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/408868/%E5%A4%A9%E7%8C%AB%E8%AE%A2%E5%8D%95%E7%AE%A1%E7%90%86%E9%A1%B5%E9%9D%A2%E8%8E%B7%E5%8F%96%E8%AE%A2%E5%8D%95%E5%8F%B7%E6%94%B6%E4%BB%B6%E4%BA%BA%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/408868/%E5%A4%A9%E7%8C%AB%E8%AE%A2%E5%8D%95%E7%AE%A1%E7%90%86%E9%A1%B5%E9%9D%A2%E8%8E%B7%E5%8F%96%E8%AE%A2%E5%8D%95%E5%8F%B7%E6%94%B6%E4%BB%B6%E4%BA%BA%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==
    (function () {
        'use strict';
        var importJs = document.createElement('script');
        importJs.setAttribute("type", "text/javascript");
        importJs.setAttribute("src", 'https://cdn.bootcss.com/jquery/3.4.0/jquery.js');
        document.getElementsByTagName("head")[0].appendChild(importJs);
        setTimeout(function () {
            if ($("#tool3").length == 0) {
                $("body").append(
                    "<div style='width:240px;height:200px;position: fixed;right: 140px;top: 150px;z-index:11113;text-align:center;' id='tool3'><input type='checkbox' id='onlyChoose' style='vertical-align: text-top;' checked/>勾选模式<textarea id='order_area' style='opacity:0.8;width:240px;height:200px;border:2px solid green;color:purple;'></textarea><br><button id='get_order'>采集订单号</button>    <button id='push_order'>输出订单信息</button><a target='_blank' id='yzm' style='color: #fff;background-color: #118adb;border-color: #118adb;text-decoration: none;word-break: break-all;box-sizing: border-box;display: inline-block;height: 24px;line-height: 22px;padding: 0 12px;border-radius: 3px;font-size: 12px;cursor: pointer;margin-left: 5px;'>验证码</a></div>"
                );
            }
            $("#get_order").click(function () {
                $("#order_area").empty()
                if($("#onlyChoose").is(":checked")){
                    $.each($("input:checked[name='orderid']"),function(){
                        $("#order_area").append($(this).val()+"\n");
                    })
                }else{
                $.each($("input[name='orderid']"),function(){
                    $("#order_area").append($(this).val()+"\n");
                })}
                $("#order_area").val($("#order_area").text())
            })
            $("#push_order").click(function () {
                var data = $("#order_area").val().trim().split("\n");
                $("#yzm").attr("href", "https://trade.taobao.com/detail/orderDetail.htm?&bizOrderId=" +data[0]);
                function getOrder(i, length) {
                    $.ajax({
                        url:"https://trade.taobao.com/detail/orderDetail.htm?&bizOrderId=" +
                        data[i],
                        async: false,
                        success:function (data) {
                            $("#order_area").append(executeScript(data))
                        }
                    });
                    if (++i < length) {
                        getOrder(i, length)
                    }
                }
                $("#order_area").empty()
                $("#order_area").append("旺旺名"+"	" +"订单号"+ "	" +"收件人"+ "	" +"手机号"+ "	" +"收货地址"+  "	" + "订单价格"+"	" +"快递单号"+ "\n");
                getOrder(0, data.length)
                $("#order_area").val($("#order_area").text())
            })
            $("#order_area").dblclick(function(){
                $(this).empty();
                $(this).val("");
            })
        },1000)
        function executeScript(html) {
            var reg = /<script[^>]*>([^\x00]+)$/i;
            var htmlBlock = html.split("<\/script>");
            for (var i in htmlBlock) {
                if (htmlBlock[i].match(reg) && htmlBlock[i].match(/detailData/g)) {
                    var dd =JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[1].content[0].text.match("查看旧地址")?JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[3].content[0].text:(JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[2].key.match("发票抬头")?JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[6].content[0].text:(JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[1].content[0].text.match("查看旧地址")&&JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[3].key.match("发票抬头")?JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[7].content[0].text:JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[2].content[0].text))

                    var place = JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[0].content[0].text //获取收货信息
                    var name =place.split(",")[0];
                    var phone=place.split(",")[1].match("-")?place.split(",")[1].split("-")[1]:place.split(",")[1];
                    var places="";
                    var mais=JSON.parse(htmlBlock[i].split("detailData = ")[1]).orders.list;
                    var mail="";
                    $.each(mais,function(i){
                        if(mais[i].logistic){
                            mail+=mais[i].logistic.content[0].companyName+":"+mais[i].logistic.content[0].mailNo+"  ";
                        }else{
                            mail="";
                        }
                    })
                    if(place.split(",").length==4){
                        places=place.split(",")[2].trim();
                    }
                    if(place.split(",").length==5){
                        places=place.split(",")[3].trim();
                    }
                    var ww = JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[1].content[0].text.match("查看旧地址")&&JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[3].key.match("发票抬头")?JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[8].content[0].text.split("title='")[1].split("'>")[0]:(JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[1].content[0].text.match("查看旧地址")?JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[4].content[0].text.split("title='")[1].split("'>")[0]:(JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[2].key.match("发票抬头")&&JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[5].key.match("发票内容")?JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[7].content[0].text.split("title='")[1].split("'>")[0]:(JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[2].key.match("发票抬头")?JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[6].content[0].text.split("title='")[1].split("'>")[0]:JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[3].content[0].text.split("title='")[1].split("'>")[0]))); //获取旺旺名

                   var price = JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[1]==undefined&&JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[0][1].content[0].data.titleLink.text.match("店铺优惠")?JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[0][3].content[0].data.money.text.replace("￥",""):(JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[1]==undefined&&JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[0][1].content[0].data.titleLink.text.match("运费")?JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[0][2].content[0].data.money.text.replace("￥",""):(JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[1][0].content[0].data.titleLink==undefined?(JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[1][0].content[0].data.tipLink.text.match("集分宝")?JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[2][0].content[0].data.dotPrefixMoney.text+JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[2][0].content[0].data.dotSufixMoney.text:JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[1][0].content[0].data.dotPrefixMoney.text+JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[1][0].content[0].data.dotSufixMoney.text):(JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[1][0].content[0].data.titleLink.text.match("支付优惠")?JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[2][0].content[0].data.dotPrefixMoney.text+JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[2][0].content[0].data.dotSufixMoney.text:(JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[1][0].content[0].data.titleLink.text.match("红包")?JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[2][0].content[0].data.dotPrefixMoney.text+JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[2][0].content[0].data.dotSufixMoney.text:(JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[1][0].content[0].data.titleLink.text.match("天猫购物券")?JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[2][0].content[0].data.dotPrefixMoney.text+JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[2][0].content[0].data.dotSufixMoney.text:JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[1][0].content[0].data.dotPrefixMoney.text+JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[1][0].content[0].data.dotSufixMoney.text))))) //获取订单价格
//获取订单价格
                    if(JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[1].content[0].text.match("查看旧地址")){
                        name=name+"(修改过地址)"
                    }
                    return (ww +"	" +"'"+dd + "	" +name+ "	" +phone+ "	" +places+ "	" + price+"	"+mail.trim()+"\n")
                }
            }
        }
        //$(window).bind("scroll",function() {
        window.onload=function(){getInfom()}
        $("button[class*='button-mod__primary___']").on("click",function(){getInfom()})
        $("div[class*='simple-pagination-mod__container___'] button").on("click",function(){getInfom()})
        $("ul[unselectable='unselectable'] li").on("click",function(){getInfom()})
            function getInfom(){
                $('[name="orderid"]').map((function (e, o) {
                    $(".zmtool_trade_detail").remove();
                    (function(o){
                        setTimeout(function(){
                            if($($(o).parents("td")[0]).find(".infos").length==0){
                                $.ajax({
                                    url:"https://trade.taobao.com/detail/orderDetail.htm?&bizOrderId="+o.value,
                                    async: false,
                                    success:function (data) {
                                        //if(data.match("亲，小二正忙，滑动一下马上回来")){
                                        //$("#tool3").append('<iframe src="https://trade.taobao.com/detail/orderDetail.htm?&bizOrderId='+o.value+'" id="blank_fixed" style="width: 220px; height: 200px;margin:0 auto;"></iframe>')
                                        //return false;
                                        //}else{
                                        $($(o).parents("td")[0]).append(executeScript(data));
                                        //$(o).addClass("init");
                                        function executeScript(html) {
                                            var reg = /<script[^>]*>([^\x00]+)$/i;
                                            var htmlBlock = html.split("<\/script>");
                                            for (var i in htmlBlock) {
                                                if (htmlBlock[i].match(reg) && htmlBlock[i].match(/detailData/g)) {
                                                    var dd =JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[1].content[0].text.match("查看旧地址")?JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[3].content[0].text:(JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[2].key.match("发票抬头")?JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[6].content[0].text:(JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[1].content[0].text.match("查看旧地址")&&JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[3].key.match("发票抬头")?JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[7].content[0].text:JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[2].content[0].text)) //获取订单号

                                                    var place = JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[0].content[0].text;

                                                    var name =place.split(",")[0];

                                                    var phone=place.split(",")[1].match("-")?place.split(",")[1].split("-")[1]:place.split(",")[1];

                                                    var places="";
                                                    if(place.split(",").length==4){
                                                        places=place.split(",")[2].trim();
                                                    }
                                                    if(place.split(",").length==5){
                                                        places=place.split(",")[3].trim();
                                                    }
                                                    var ww = JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[1].content[0].text.match("查看旧地址")&&JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[3].key.match("发票抬头")?JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[8].content[0].text.split("title='")[1].split("'>")[0]:(JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[1].content[0].text.match("查看旧地址")?JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[4].content[0].text.split("title='")[1].split("'>")[0]:(JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[2].key.match("发票抬头")&&JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[5].key.match("发票内容")?JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[7].content[0].text.split("title='")[1].split("'>")[0]:(JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[2].key.match("发票抬头")?JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[6].content[0].text.split("title='")[1].split("'>")[0]:JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[3].content[0].text.split("title='")[1].split("'>")[0]))); //获取旺旺名

                                                    var price = JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[1]==undefined&&JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[0][1].content[0].data.titleLink.text.match("店铺优惠")?JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[0][3].content[0].data.money.text.replace("￥",""):(JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[1]==undefined&&JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[0][1].content[0].data.titleLink.text.match("运费")?JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[0][2].content[0].data.money.text.replace("￥",""):(JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[1][0].content[0].data.titleLink==undefined?(JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[1][0].content[0].data.tipLink.text.match("集分宝")?JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[2][0].content[0].data.dotPrefixMoney.text+JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[2][0].content[0].data.dotSufixMoney.text:JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[1][0].content[0].data.dotPrefixMoney.text+JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[1][0].content[0].data.dotSufixMoney.text):(JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[1][0].content[0].data.titleLink.text.match("支付优惠")?JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[2][0].content[0].data.dotPrefixMoney.text+JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[2][0].content[0].data.dotSufixMoney.text:(JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[1][0].content[0].data.titleLink.text.match("红包")?JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[2][0].content[0].data.dotPrefixMoney.text+JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[2][0].content[0].data.dotSufixMoney.text:(JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[1][0].content[0].data.titleLink.text.match("天猫购物券")?JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[2][0].content[0].data.dotPrefixMoney.text+JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[2][0].content[0].data.dotSufixMoney.text:JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[1][0].content[0].data.dotPrefixMoney.text+JSON.parse(htmlBlock[i].split("detailData = ")[1]).amount.count[1][0].content[0].data.dotSufixMoney.text))))) //获取订单价格

                                                    var mais=JSON.parse(htmlBlock[i].split("detailData = ")[1]).orders.list;
                                                    var mail="";
                                                    $.each(mais,function(i){
                                                        if(mais[i].logistic){
                                                            mail+=mais[i].logistic.content[0].companyName+":"+mais[i].logistic.content[0].mailNo+"  ";
                                                        }else{
                                                            mail="";
                                                        }
                                                    })
                                                    if(JSON.parse(htmlBlock[i].split("detailData = ")[1]).basic.lists[1].content[0].text.match("查看旧地址")){
                                                        name=name+"<b style='color:red'>(修改过地址)</b>"
                                                    }
                                                    return ("<br/><span class='infos' style='float: left;padding-left: 10px;'>"+ww+ "	" +dd+"	"+name+ "	" +phone+ "	" +places+"	"+price+"	"+mail.trim()+"</span>");
                                                }
                                            }
                                        }
                                    }}
                                       //}
                                      );
                            }
                        },200)
                    })(o)
                }))
                //});
            }
})();