// ==UserScript==
// @name         亚马逊中国 ShortCode
// @namespace    https://www.iplaysoft.com
// @version      0.51
// @description  Amazon.cn Shorcode
// @author       X-Force
// @match        https://www.amazon.cn/dp/*
// @icon         https://www.amazon.cn/favicon.ico
// @require      https://cdn.staticfile.org/qrious/4.0.2/qrious.min.js
// @require      https://cdn.staticfile.org/jquery/3.6.1/jquery.min.js
// @grant        none
// @license     MIT
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/455249/%E4%BA%9A%E9%A9%AC%E9%80%8A%E4%B8%AD%E5%9B%BD%20ShortCode.user.js
// @updateURL https://update.greasyfork.org/scripts/455249/%E4%BA%9A%E9%A9%AC%E9%80%8A%E4%B8%AD%E5%9B%BD%20ShortCode.meta.js
// ==/UserScript==

/* globals $ */


(function() {
    'use strict';
   // var $ = unsafeWindow.jQuery;

$(document).ready(function(){
    console.log("BEGIN!");
    var pdata={};
    //pdata.url=$("#permalink>a")[0].href;
    pdata.affTag="personalass3898-23";
    pdata.asin = opts.asin;
    pdata.url=document.querySelector("link[rel='canonical']").getAttribute("href");
    pdata.url+="?tag="+pdata.affTag;
    pdata.title=$("#productTitle").text().replace(/(^\s*)|(\s*$)/g, "");
    pdata.desc=$("#feature-bullets>ul").text().trim().replace(/原文\s+.+/g,'').replace(/[\s]+/g,'');
    //品牌
    pdata.brand=$("#bylineInfo").text.trim;
    //缩略图
    pdata.imageThumb=$("#imgTagWrapperId>img").attr('src');
    //商品大图
    pdata.image=$("#imgTagWrapperId>img").attr('data-old-hires');

    //获取价格
    pdata.price=$('#ags_local_price').text().trim();
    if(pdata.price==''){
        //镇店之宝的价格
        pdata.price='￥'+$('#twister-plus-price-data-price').val();
    }

    //获取关税
    pdata.importFee="未知";
    //直接能在页面上获取
    //例子：https://www.amazon.cn/dp/B098LWQPRT
    if($("#agsIfdInsidePrice_feature_div>span").length > 0){
        console.log("Get Import Fee from page...");
        pdata.importFee=$('#agsIfdInsidePrice_feature_div').text().trim().match(/¥?([\d\.]+)/g);
        //console.log(pdata.importFee=$('#ags_shipping_import_fee').text().trim());
        //.match(/([\d\.]+)/g))
        //pdata.importFee=$('#ags_shipping_import_fee').text().trim().match(/¥?([\d\.]+)/g);
        createResult(pdata);
    }else{
        //页面上没有，需要通过http请求获取(抄自html源代码)
        P.when('A', 'ifd-data-'+pdata.asin).execute('desktop-ifd', function(A, agsIfdData) {
            console.log("Fetch Import Fee...");
            var shippingStringNode = A.$("#ags_shipping_import_fee");
            var formattedIfd = agsIfdData["formattedIfd"];
            pdata.importFee=formattedIfd;
            createResult(pdata);
        });

    }

});


})();

function createResult(pdata){
    console.log(pdata);

    var template = '[product name="'+ pdata["title"] + '" price="' + pdata["price"] + ' 元" pricetips="" priceinfo="+ ' + pdata["importFee"] + ' 进口税费';
    template += '" image="'+ pdata["imageThumb"] + '" url="'+pdata["url"] + '"]'+pdata["desc"] + '[/product]';
    console.log(template);

    var shortCodeDiv='<div id="shortCodeDiv" style="margin-top:20px"><textarea id="shortcode" readonly onclick="javascript:this.focus();this.select();" style="height: 182px;"></textarea></div>';
    var shareLinkUrl="https://www.amazon.cn/perassoc/gatewaysharedp?asin="+pdata.asin+"&tag="+pdata.affTag;
    $("#rightCol").append(shortCodeDiv);
    $("#shortcode").val(template);

    var qrCanvas = '<canvas id="qrcode" style="width:178px;height:178px;margin:20px auto;display:block"></canvas>';
    $("#shortCodeDiv").append(qrCanvas);
    var qrious = new QRious({
        element: document.getElementById('qrcode'),
        value: shareLinkUrl,
        size: 356
    });
}