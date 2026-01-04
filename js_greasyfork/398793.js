// ==UserScript==
// @name         VVIC Price Contrast
// @name:zh-CN   VVIC Price Contrast
// @namespace    com.hct.contrast
// @icon         https://lk-data-collection.oss-cn-qingdao.aliyuncs.com/winner/winnercoupang/Icon.png
// @version      1.61
// @description  vvic price contrast
// @description:zh-cn   VVIC价格比对与选择同款并采集供应商信息
// @author       hansel
// @include      https://tusou.vvic.com/*
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/398793/VVIC%20Price%20Contrast.user.js
// @updateURL https://update.greasyfork.org/scripts/398793/VVIC%20Price%20Contrast.meta.js
// ==/UserScript==
var api_url = "http://operate.hagoto.com/admin/api/";
var price_arr = [];
var avg = '';
var bmid = "";
(function() {
    'use strict';
    var cur_url = document.location.href;
    if(cur_url.indexOf("bmid=")>0){
        var keydatas = cur_url.split('bmid=');
        bmid = keydatas[1];
    }
    if(bmid == ""){
        return;
    }
    var div = document.createElement("div");
    div.setAttribute("style", "width: 100%;height: 30px;position: fixed;left: 84%;bottom: 50%;height: 35px;line-height: 35px;color: #333;font-size: 14px;");
    var inner_html = '<p style="border: 1px solid #ccc;border-bottom: none;font-size: 13px;width: 295px;padding-left: 5px;">至少选择10件商品，当前已选择 <span class="have_choose" style="color:red">0</span> 件商品</p><input type="text" value="价格平均值：00.00" readonly class="input_price"><button class="btn-confirm">回传系统</button>';
    div.innerHTML = inner_html;
    document.body.appendChild(div);

    $(".input_price").attr("style","display: inline-block;width: 200px;padding: 5px;border: 1px solid #ccc;font-size:14px;color: #222;font-weight: bold;");
    $(".btn-confirm").attr("style","border: none;width: 82px;height: 33px;color: #fff;background: #fb658a;cursor: pointer;");


    setTimeout(function () {
        var button_html = "<button class='price_diff' style='border: none;width: 82px;height: 30px;color: #fff;background: #fb658a;cursor: pointer;'>价格比对</button>";
        $('.fr.sales').each(function () {
            $(this).html(button_html);
        });

        var span_html = "<span class='choose_this' style='width:114px'>选用</span><span class='get_supplier_info' style='width:114px'>获取供应商信息</span>";
        $(".ctrl.clearfix").each(function () {
            $(this).html(span_html);
        });
    },2000);


    //获取初始化平均值
    GM_xmlhttpRequest({
        method: "POST",
        url: api_url +"getAvg?bmid="+bmid,
        dataType: "json",
        data: JSON.stringify({}),
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(result) {
            console.log(result);
            if(result.readyState==4&&result.status==200){
                var dataJson = JSON.parse(result.response);
                $(".input_price").attr("value","价格平均值："+dataJson.data.avg);
                $(".have_choose").text(dataJson.data.avg_num);
            }
        }
    })


    //选用
    $(document).on('click','.choose_this', function (e) {

        //获取页面元素
        var _this = this;
        var this_parent = $(this).parent().parent();
        var goods_url = this_parent.find('a').attr('href');
        var goods_img = this_parent.find('img').attr('src');
        var goods_price_txt = this_parent.next().find('.fl.price').text();
        goods_price_txt = goods_price_txt.trim();
        var price_temp = goods_price_txt.split("¥");
        var goods_price = parseFloat(price_temp[1]);
        var goods_name = this_parent.next().find('.title a').text();
        goods_name = goods_name.trim();
        var goods_item_num = this_parent.next().find('.j_clip_button').text();
        goods_item_num = goods_item_num.trim();

        var datajson = {
            "goodsId":'',
            "goodsUrl":goods_url,
            "goodsSource":"VVIC",
            "goodsPrice":goods_price,
            "goodsImg":goods_img,
            "goodsName":goods_name,
            "goodsItemNum":goods_item_num,
        };
        console.log(datajson);
        GM_xmlhttpRequest({
            method: "POST",
            url: api_url +"confirm?bmid="+bmid,
            dataType: "json",
            data: JSON.stringify(datajson),
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(result) {
                    console.log(result);
                if(result.readyState==4&&result.status==200){
                    var dataJson = JSON.parse(result.response);
                    console.log(dataJson);
                    if (dataJson.status == 1 || dataJson.msg.indexOf('重复')>-1) {
                        $(_this).css('background','rgb(32, 148, 230)');
                        $(_this).text('已选用');
                    }
                    alert(dataJson.msg);
                }
            }
        })
    });

    //获取供应商信息
    $(document).on('click','.get_supplier_info', function (e) {
        var _this = this;
        var this_parent = $(this).parent().parent();
        var goods_url = this_parent.find('a').attr('href');

        var params = {
            "goodsId":'',
            "goodsUrl":goods_url,
        };

        GM_xmlhttpRequest({
            method: "POST",
            url: api_url +"getSupplierInfo?bmid="+bmid,
            dataType: "json",
            data: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(result) {
                    console.log(result);
                if(result.readyState==4&&result.status==200){
                    var dataJson = JSON.parse(result.response);
                    console.log(dataJson);
                    if (dataJson.status == 1 || dataJson.msg.indexOf('获取')>-1) {
                        $(_this).css('background','rgb(32, 148, 230)');
                        $(_this).text('已获取');
                    }
                    alert(dataJson.msg);
                }
            }
        })

    })

    //加入比对
    $('.price_diff').on('click',function() {
        if ($(this).hasClass('has')) {
            return false;
        }
        $(this).css('background','#2094e6');
        $(this).text('已比对');
        $(this).addClass('has');
        var get_price = $(this).parent().next().text();
        get_price = get_price.trim();
        var price_temp = get_price.split("¥");
        var this_price = parseFloat(price_temp[1]);
        price_arr.push(this_price);
        avg = getAvg();
        console.log(avg);
        var length = price_arr.length;
        $(".have_choose").text(length);
        $(".input_price").attr("value","价格平均值："+avg);
    });


    //确认回传价格平均值
    $('.btn-confirm').on('click',function() {

        if (avg == '') {
            alert('数据有误');return false;
        }
        var params = {"avg":avg,"avg_num":price_arr.length};
        GM_xmlhttpRequest({
            method: "POST",
            url: api_url +"callbackAvg?bmid="+bmid,
            dataType: "json",
            data: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(result) {
                console.log(result);
                if(result.readyState==4&&result.status==200){
                    var dataJson = JSON.parse(result.response);
                    console.log(dataJson);
                    alert(dataJson.msg);
                }
            }
        })

    });


})();

function getAvg() {
    var len = price_arr.length;
    var sum = 0;
    for(var i = 0; i < len ; i++){
        sum += price_arr[i];
    }
    var avg = sum/len;
    var numStr = avg.toString();
    var index = numStr.indexOf('.');
    var result = numStr.slice(0, index + 3);
    return result;
}





