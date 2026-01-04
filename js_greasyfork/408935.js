// ==UserScript==
// @name         extract
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  页面数据提取
// @icon         https://lk-data-collection.oss-cn-qingdao.aliyuncs.com/winner/winnercoupang/Icon.png
// @author       Hunk
// @include      *://*yangkeduo.com/goods.html?*
// @include      *://detail.1688.com/offer/*.html?*
// @require      http://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408935/extract.user.js
// @updateURL https://update.greasyfork.org/scripts/408935/extract.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var ext="<div class='ext' style='position: fixed;bottom: 0;left: 0;'><div style='width: 250px;height: 200px;background:#efe1b0; color:#FFF;'><p><textarea id='detail_json' style=' width: 250px; height: 134px;color: black;'></textarea></p><p style='text-align: center;'><button style='background-color:red;' class='js-get-url'>提取</button></p></div>";
    $("body").prepend(ext);
    var url = window.location.href;
    $('.js-get-url').click(function(){
        $("#detail_json").val("");
        if(url.indexOf("yangkeduo.com/goods.html")!=-1){
            //拼多多
            pinduoduo(url);
        }else if(url.indexOf("detail.1688.com")!=-1){
			//1688
			ali1688(url);
		}
    });

})();
function ali1688(url){

    var goods_detail={};
    //主图
    var min_list_img=new Array();
    var dataImgs;
    $(".tab-trigger").each(function(i,item){
		dataImgs = JSON.parse($(this).attr("data-imgs"));
        min_list_img[i]=dataImgs.original;
    });
    goods_detail["min_list_img"]=min_list_img;
    //详情图
    var detail_list_img=new Array();
    var node_name=$("#desc-lazyload-container").find("img");
    $(node_name).each(function(i,item){
        detail_list_img[i]=$(this).attr("src");
    });

    goods_detail["detail_list_img"]=detail_list_img;
    //商品名
    var goods_name=$("#mod-detail-title").children(".d-title").text();
    goods_detail["goods_name"]=goods_name;
    //规格
    goods_detail["sku_list"]=iDetailData.sku;
    goods_detail["url"]=url;
    var detail=JSON.stringify(goods_detail);
    $("#detail_json").val(detail);
}


function pinduoduo(url){
    var goods_detail={};
    //主图
    var min_list_img={};
    $(".islider-html").each(function(i,item){
        min_list_img[i]=$(this).find("img").attr("src");
    });
    goods_detail["min_list_img"]=min_list_img;
    //详情图
    var detail_list_img={};
    var node_name="."+$("p:contains(商品详情)").parent().attr("class")+" img";
    $(node_name).each(function(i,item){
        detail_list_img[i]=$(this).attr("data-src");
    });
    goods_detail["detail_list_img"]=detail_list_img;
    //商品名
    var goods_name=$(".enable-select").text();
    goods_detail["goods_name"]=goods_name;
    //规格
    var sku_list={};
    $(".sku-specs").each(function(i,item){
        sku_list[i]={};
        sku_list[i]["sku_name"]=$(item).find(".sku-specs-key").text();
        var sku_tem=$(item).find(".sku-spec-value");
        var sku_val_arr={};
        $(sku_tem).each(function(i,val){
            sku_val_arr[i]=$(val).text();
        });
        sku_list[i]["sku_val"]=sku_val_arr;
    });
    goods_detail["sku_list"]=sku_list;
    //价格
    goods_detail["goods_price"]=$(".sku-selector-price").text();
    //售卖数量
    goods_detail["goods_sale_num"]=$("#g-base div:first-child").find("span").last().text();
    //店铺名
    goods_detail["store_name"]=$("._1g9X2Rjz").text();
    //星级
    var zheng=$("._2s1WyBtY").length;
    var ban=$("._5Uy8UhJ3").length;
    if(ban==1)
    {
        zheng=zheng+0.5;
    }
    goods_detail["store_star"]=zheng;
    //商品数量//总售
    goods_detail["store_sale"]=$("._dS_ovUS").text();
    //商品详情
    //判断是否存在更多
    var spec={};
    if($("div").hasClass("Q6DV2ayv"))
    {
        $(".Q6DV2ayv").click();
        $(".pdI641em").each(function(i,item){
        var spec_val={};
        spec_val["key"]=$(item).find("._1FrhYkvO").text();
        spec_val["val"]=$(item).find(".gMHKTkji").text();
        spec[i]=spec_val;
        });
    }
    else
    {
        $("._8rUS_gSm").each(function(i,item){
        var spec_val={};
        spec_val["key"]=$(item).find("._1M3pVo3W").text();
        spec_val["val"]=$(item).find("._32_tX1hK").text();
        spec[i]=spec_val;
        });
    }
    goods_detail["goods_spec"]=spec;
    $("._2PgsysSn").click();
    goods_detail["url"]=url;
    var detail=JSON.stringify(goods_detail);
    $("#detail_json").val(detail);
}