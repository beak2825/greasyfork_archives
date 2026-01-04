// ==UserScript==
// @name         1688 Main Image
// @name:zh-CN   1688 Main Image
// @namespace    com.hct.contrast
// @icon         https://lk-data-collection.oss-cn-qingdao.aliyuncs.com/winner/winnercoupang/Icon.png
// @version      1.0
// @description  get 1688 main_image and product name
// @description:zh-cn   手动采集1688
// @author       hansel
// @include      https://detail.1688.com/*
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/401593/1688%20Main%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/401593/1688%20Main%20Image.meta.js
// ==/UserScript==
var api_url = "http://operate.hagoto.com/admin/api/";
var sp_goods_id = "";
(function() {
    'use strict';
    var cur_url = document.location.href;
    if(cur_url.indexOf("sp_goods_id=")>0){
        var keydatas = cur_url.split('sp_goods_id=');
        sp_goods_id = keydatas[1];
    }
    if(sp_goods_id == ""){
        return;
    }
    var div = document.createElement("div");
    div.setAttribute("style", "width: 100%;height: 30px;position: fixed;left: 84%;bottom: 50%;height: 35px;line-height: 35px;color: #333;font-size: 14px;");
    var inner_html = '<button class="btn-confirm">获取主图信息</button>';
    div.innerHTML = inner_html;
    document.body.appendChild(div);

    $(".btn-confirm").attr("style","border: none;width: 102px;height: 33px;color: #fff;background: #1648d6;cursor: pointer;");


    //选用
    $('.btn-confirm').on('click', function (e) {
        var main_image = $(".mod-detail-gallery").find(".tab-pane").find("a.box-img").find("img").attr("src");
        var product_name = $("#mod-detail-title").find(".d-title").text();
        main_image = main_image.trim();
        product_name = product_name.trim();
        var datajson = {
            "sp_goods_id":sp_goods_id,
            "main_image":main_image,
            "product_name":product_name,
        };
        GM_xmlhttpRequest({
            method: "POST",
            url: api_url +"setAlibabaInfo",
            dataType: "json",
            data: JSON.stringify(datajson),
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(result) {
                console.log(result);
                if(result.readyState==4&&result.status==200){
                    var dataJson = JSON.parse(result.response);
                    alert(dataJson.msg);
                }
            }
        })
    });



})();
