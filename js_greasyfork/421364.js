// ==UserScript==
// @name         getalicode
// @namespace    http://tampermonkey.net/
// @version      1.23
// @description  页面数据提取
// @icon         https://lk-data-collection.oss-cn-qingdao.aliyuncs.com/winner/winnercoupang/Icon.png
// @author       Hunk
// @include      https://item.taobao.com/*
// @include      https://buy.taobao.com/*
// @include      https://cart.taobao.com/*
// @include      https://buyertrade.taobao.com/*
// @include      https://detail.tmall.com/*
// @include      https://cart.tmall.com/*
// @include      https://buy.tmall.com/*
// @include      https://*.alipay.com/*
// @require      http://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/421364/getalicode.user.js
// @updateURL https://update.greasyfork.org/scripts/421364/getalicode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var merge="<div class='merge' style='position: fixed;bottom: 0;left: 0;'><div style='width: 250px;height: 200px;background:#efe1b0;color: #170202;'><p>合并订单号:<span class='js-merge' style='color:#36c'></span></p><p></p><p>应该购买</p><div style='color:#36c;text-align: center;' class='js-m-view'></div><div style='display: none;' class='js-send'><p>支付流水号:</p><p class='js-ali-code'></p><p style='text-align: center;'><button style='background-color:red;' class='js-get-url'>推送</button></p></div></div></div>";
    $("body").append(merge);
    //获取url中的数据
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return null;
    }
    var id=$.getUrlParam('id');
    var merge_id=$.getUrlParam('merge');
    if(id&&merge_id==GM_getValue('merge_val')){
        GM_setValue('merge_val',$.getUrlParam('merge'));
        if(merge_id==GM_getValue('merge_val')&&$.getUrlParam('sku')!=GM_getValue('buy_html')){
            GM_setValue('buy_html',GM_getValue('buy_html')+'-'+$.getUrlParam('sku'));
        }
        else{
            GM_setValue('buy_html',$.getUrlParam('sku'));
        }
    }
    if(id&&merge_id!=GM_getValue('merge_val')){
        GM_setValue('merge_val',$.getUrlParam('merge'));
        GM_setValue('buy_html',$.getUrlParam('sku'));
    }
    //显示合并订单号
    $(".js-merge").html(GM_getValue('merge_val'));
    //显示应买规格
    if(GM_getValue('buy_html')){
        var html_arr=GM_getValue('buy_html').split('-');
        var buy_thml_view='';
        $.each(html_arr,function(i,val){
            buy_thml_view+='<p>'+val+'</p>'
        })
    $(".js-m-view").html(buy_thml_view);
    }

    var url = window.location.href;
    //支付控制台
    if(url.indexOf("alipay.com")!=-1){
        var alipay_code=$.getUrlParam('outBizNo');console.log(alipay_code);
        //判断是否含P
        if(alipay_code.indexOf("P")!=-1){console.log(11111);
            //批量采购的
            $('.merge').empty();
            //追加新的页面
            var get_ali_html="<div style='width: 250px;height: 200px;background:#efe1b0;color: #170202;'><p><textarea id='detail_json' style=' width: 250px; height: 134px;color: black;'></textarea></p><p style='text-align: center;'><button style='background-color:red;' class='js-extract-alicode'>提取</button></p></div></div>";
            $('.merge').append(get_ali_html);
            $('.js-extract-alicode').click(function(){
                var ali_code_list={};
                $(".trade-num").each(function(i,item){
                    ali_code_list[i]=$(this).text();
                });

                var detail=JSON.stringify(ali_code_list);
                $("#detail_json").val(detail);
            });
        }else{
            $('.js-send').show();
            $(".js-ali-code").html(alipay_code);
            //推送支付宝流水
            $('.js-get-url').click(function(){
                var params = {"merge_code":GM_getValue('merge_val'),"ali_code":alipay_code};
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://operate.hagoto.com/admin/interface_api/getTaoBaoOrderAliCode",
                    dataType: "json",
                    data: JSON.stringify(params),
                    headers: {
                        "Content-Type": "application/json"
                    },
                    onload: function(result) {
                        if(result.readyState==4&&result.status==200){
                            var dataJson = JSON.parse(result.response);
                            alert(dataJson.msg);
                        }
                    }
                })
            })
        }
    }

})();