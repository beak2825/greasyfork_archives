// ==UserScript==
// @name         RS-Same Style
// @name:zh-CN   RS-Same Style
// @namespace    com.hct.operate
// @icon         https://lk-data-collection.oss-cn-qingdao.aliyuncs.com/winner/winnercoupang/Icon.png
// @version      1.0.1
// @description  Taobao commodity information collection applied to Operate system
// @description:zh-cn   采集vvic同款信息
// @author       hansel
// @include      https://tusou.vvic.com/list/*?*
// @grant        GM_xmlhttpRequest
// @require      http://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/421016/RS-Same%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/421016/RS-Same%20Style.meta.js
// ==/UserScript==
var vvicUrl = "https://www.vvic.com/item/";
var rs_url = "http://120.27.60.38:8093/search/api";
var api_url = "http://120.27.60.38:8093/search/api";
var main_image = '';
var details_id = '';
var platform_type = 'vvic';
var sort_by = 'sort_zh';
var price_arr = [];
var avg = "";

var vvic_list = new Array();
var vvic_origin_list = new Array();

(function() {
    'use strict';
    var cur_url = document.location.href;
    initializePage();
})();
function initializePage(){
    var url = window.location.href;

    if(url.indexOf("imgUrl=")>0){
        var keydatas = url.split('imgUrl=');
        main_image = keydatas[1];
        if(main_image.indexOf("http")<0){
            main_image = "http:"+main_image;
        }
        main_image=decodeURIComponent(main_image);
    }
    if(main_image == ""){
        return;
    }

    var div = document.createElement("div");
    div.setAttribute("style", "width: 100%;height: 30px;position: fixed;left: 84%;bottom: 50%;height: 35px;line-height: 35px;color: #333;font-size: 14px;");
    var inner_html = '<p style="border: 1px solid #ccc;border-bottom: none;font-size: 13px;width: 275px;padding-left: 5px;margin:0">当前已选择 <span class="have_choose" style="color:red">0</span> 件商品</p><input type="text" value="价格平均值：00.00" readonly class="input_price"><button class="btn-confirm">回传系统</button>';
    div.innerHTML = inner_html;
    document.body.appendChild(div);
    $(".input_price").attr("style","display: inline-block;width: 200px;padding: 5px;border: 1px solid #ccc;font-size:14px;color: #222;font-weight: bold;");
    $(".btn-confirm").attr("style","border: none;width: 82px;height: 33px;color: #fff;background: #fb658a;cursor: pointer;");

    var params = {"bestId":details_id};
    var getDetailsInfo = api_url+'/koreaGood';

    var div1 = document.createElement("div");
    div1.setAttribute("style", "position: relative;width: 1190px;margin: 0 auto;");
    var html_one = "<div class='item-content clearfix'>" +
        "        <div style='width: 970px;margin-top: 20px;float:left'>" +
        "            <div style='padding: 0 20px 0 260px;min-height: 300px;position: relative;width: 530px;'>" +
        "               <div style='position: absolute;top: 0;left: 20px;width: 280px;height: 280px;padding-left: 0;'>" +
        "                    <div class='thumbnail' style='height: 280px;position: relative;overflow: hidden;'>" +
        "                        <div style='position: relative;width: 280px;height: 280px;z-index: 1;background-color: #f5f5f5;' class='tb-booth tb-pic tb-s400'>" +
        "                            <div class='tb-pic-main'>" +
        "                                <img src="+main_image+" alt='' class='jqzoom' style='max-height: 280px;max-width: 280px;cursor: pointer;'>" +
        "                            </div>" +
        "                        </div>" +
        "                    </div>" +
        "                </div>" +
        "            </div>" +
        "        </div>" +
        "    </div>" +
        "  <div id='main-con' style='position: relative;clear:both;margin-top:20px;margin-bottom: 30px;z-index: 1;background-color: #fff;'>" +
        "     <div style='height: 44px;line-height: 44px;margin: 0 auto;padding: 0;position: relative;float: left;border: 1px solid #E5E5E5;background-color: #F6F6F6;width:100%'>" +
        "          <ul id='J_TabBar' style='margin:0;padding:0'>" +
        "                <li id='vvic' data-platform='vvic' style='color:red;text-align:center;width: 110px;padding: 0 10px;display: inline;float: left;font-size: 14px;height: 46px;line-height: 46px;border-right: 1px solid #E5E5E5;margin-top: -1px;cursor: pointer;' class='ul-li list selected'><a class='tb-tab-anchor' data-index='5'>VVIC</a></li>" +
        "                <li id='sort_price' style='text-align:center;width: 70px;display: inline;float: right;font-size: 14px;height: 46px;line-height: 46px;border-right: 1px solid #E5E5E5;margin-top: -1px;cursor: pointer;' class='ul-li sort'><a class='tb-tab-anchor'>价格排序</a></li>" +
        "                <li id='sort_sale' style='text-align:center;width: 70px;display: inline;float: right;font-size: 14px;height: 46px;line-height: 46px;border-right: 1px solid #E5E5E5;margin-top: -1px;cursor: pointer;' class='ul-li sort'><a class='tb-tab-anchor'>销量排序</a></li>" +
        "                <li id='sort_zh' style='text-align:center;width: 70px;display: inline;float: right;font-size: 14px;height: 46px;line-height: 46px;border-right: 1px solid #E5E5E5;margin-top: -1px;cursor: pointer;color:blue' class='ul-li sort'><a class='tb-tab-anchor' >综合排序</a></li>" +
        "          </ul>" +
        "        </div>" +
        "     <div class='tab-content' style='clear:both;'>" +
        "           <div id='vvic_content' class='result_content' style='border: 1px solid #ccc;border-top: none;'>" +
        "                 <table id='vvic_table' class='pt_table' style='border-collapse:collapse'></table>" +
        "           </div>" +
        "           <div id='ali_content' class='result_content' style='display: none;border: 1px solid #ccc;border-top: none;'>" +
        "                  <table id='ali_table' class='pt_table' style='border-collapse:collapse'></table>" +
        "           </div>" +
        "           <div id='tb_content' class='result_content' style='display: none;border: 1px solid #ccc;border-top: none;'>" +
        "                  <table id='tb_table' class='pt_table' style='border-collapse:collapse'></table>" +
        "           </div>" +
        "     </div> " +
        "  </div>";
    div1.innerHTML = html_one;
    var f = document.body;
    var childs = f.childNodes;
    for(var i = childs.length - 1; i >= 0; i--) {
        f.removeChild(childs[i]);
    }
    document.body.appendChild(div1);
    //价格排序
    $('#sort_price').on('click',function () {
        showVvicList('price');
    });
    //销量排序
    $('#sort_sale').on('click',function () {
        showVvicList('sale');
    });
    //综合排序
    $('#sort_zh').on('click',function () {
        showVvicList('zh');
    });
    getVvicList(main_image);

}

function sortPrice(a,b){
  var a_price = a.tradePrice.offerPrice.valueString;
  var b_price = b.tradePrice.offerPrice.valueString;
  if(a_price!=null&&b_price!=null)
  {
     return parseFloat(a_price)-parseFloat(b_price);
  }
  return 0;
}

function sortSaleNum(a,b){
  var a_sale = a.tradeQuantity.number;
  var b_sale = b.tradeQuantity.number;
  if(a_sale!=null&&b_sale!=null)
  {
     return parseFloat(b_sale)-parseFloat(a_sale);
  }
  return 0;
}
//VVIC
function getVvicList(zhuImgUrl) {

     GM_xmlhttpRequest({
         method: "POST",
         url: rs_url + "/vvic/similar?path=" +zhuImgUrl,
         dataType: "json",
         headers: {
             "Content-Type": "application/json"
         },
         onload: function(result) {
             console.log(result);
             if(result.readyState==4&&result.status==200){
                 try {
                     var similarObj = JSON.parse(result.response);
                     console.log(similarObj);
                     var status = similarObj.code;
                     if (status==0) {
                         vvic_list = similarObj.data;
                         for (var i = 0; i < vvic_list.length; i++) {
                             vvic_origin_list[i]=vvic_list[i];
                         }
                         showVvicList();
                     } else {
                         $("#vvic_table").html("<tr><td class='lxSimilarImage' colspan='3' align='center'>未找到相似商品</td></tr>");
                     }
                 } catch (err) {
                     console.log(err);
                     $("#vvic_table").html("<tr><td class='lxSimilarImage' colspan='3' align='center'>未找到相似商品</td></tr>");
                 }
             }
         }
     });
}


function showVvicList(sort_by) {
    var similarHtml = "";
    var similarList = vvic_list;
    if (sort_by == 'sale') {
        similarList = similarList.sort(sortVvicSaleNum);
    }else if (sort_by == 'price') {
         similarList = similarList.sort(sortVvicPrice);
    } else {
        similarList = vvic_origin_list;
    }
    for (var i = 0; i < similarList.length; i++) {
        var thisBean = similarList[i];
        var datastr = JSON.stringify(thisBean);
        var itemId = thisBean.goodsId;
        var imageUrl = thisBean.goodsImg;
        var title = thisBean.goodsName;
        var tradeNumber = thisBean.saleNum;
        var price = "￥" + thisBean.goodsPrice;
        var shopName = thisBean.shopName;

        var trItemSame =  '<tr  class="tr_'+i+'"><td width="16%" rowspan="2" class="lxSimilarImage"><a target="_blank" href="' + vvicUrl + itemId + '.html"><img src="' + imageUrl + '" style="width:100px;height:100px;"/></a></td><td width="60%" class="lxSimilarTitle"><a target="_blank" href="' + vvicUrl + itemId + '.html">' +
            title + '</a></td><td width="20%" class="lxSimilarSale">成交' + tradeNumber + '笔</td><td width="16%" class="lxSimilarPrice">' + price + '</td></tr><tr  class="tr_'+i+'"><td class="lxSimilarShop">' + shopName +
            '</td><td class="lxSimilarLocation"></td></tr>';
        for (var j = 0; j < price_arr.length; j++) {
            if (price_arr[j].itemid == itemId) {
                trItemSame = '<tr  class="tr_'+i+'"><td width="16%" rowspan="2" class="lxSimilarImage"><a target="_blank" href="' + vvicUrl + itemId + '.html"><img src="' + imageUrl + '" style="width:100px;height:100px;"/></a></td><td width="60%" class="lxSimilarTitle"><a target="_blank" href="' + vvicUrl + itemId + '.html">' +
            title + '</a></td><td width="20%" class="lxSimilarSale">成交' + tradeNumber + '笔</td><td width="16%" class="lxSimilarPrice">' + price + '</td></tr><tr  class="tr_'+i+'"><td class="lxSimilarShop">' + shopName +
            '</td><td class="lxSimilarLocation"></td></tr>';
            }
        }
        similarHtml += trItemSame;
    }
     $("#vvic_table").html('');
    $("#vvic_table").html(similarHtml);
    $(".lxSimilarImage").attr("style","padding-top: 5px;padding-left: 5px;");
    $(".lxSimilarTitle").attr("style","padding-left: 5px;");
    $(".lxSimilarTitle a").attr("style","color:#36c;text-decoration:none;font-size:14px");
    $(".lxSimilarPrice").attr("style","font-size:18px;");
    $(".lxSimilarShop").attr("style","padding-left: 5px;");

    $(".cjvvic_btn").attr("style","width: 70px;height: 32px;line-height: 32px;color: #fff;background-color: #1E9FFF;text-align: center;border: none;border-radius: 3px;cursor: pointer;");
    $(".get_supplier_info").attr("style","width: 120px;position: absolute;margin-left: 20px;height: 32px;line-height: 32px;color: #fff;background-color: #1E9FFF;text-align: center;border: none;border-radius: 3px;cursor: pointer;");
    $(".price_compare").attr("style","width: 90px;position: absolute;margin-left: 155px;height: 32px;line-height: 32px;color: #fff;background-color: #1E9FFF;text-align: center;border: none;border-radius: 3px;cursor: pointer;");
    $(".price_compare.has").attr("style","background:rgb(177, 94, 46);width: 90px;position: absolute;margin-left: 155px;height: 32px;line-height: 32px;color: #fff;text-align: center;border: none;border-radius: 3px;cursor: pointer;");
    $('.cjvvic_btn,.get_supplier_info').on('mouseover', function (e) {
        $(e.currentTarget).css("background-color","#48a9f5");
    });
    $('.cjvvic_btn,.get_supplier_info').on('mouseout', function (e) {
        $(e.currentTarget).css("background-color","#1E9FFF");
    });

    $('tr').on('mouseover', function (e) {
        var name = $(e.currentTarget).attr("class");
        $("."+name).css("background-color","#ddd");
    });
    $('tr').on('mouseout', function (e) {
        var name = $(e.currentTarget).attr("class");
        $("."+name).css("background-color","#fff");
    });

}


function getAvg() {
    var len = price_arr.length;
    var sum = 0;
    if (len <= 0) return 0;
    for(var i = 0; i < len ; i++){
        sum += price_arr[i].price;
    }
    var avg = sum/len;
    var numStr = avg.toString();
    var index = numStr.indexOf('.');
    var result = numStr.slice(0, index + 3);
    return result;
}

function sortVvicPrice(a,b){
  var a_price = a.goodsPrice;
  var b_price = b.goodsPrice;
  if(a_price!=null&&b_price!=null)
  {
     return parseFloat(a_price)-parseFloat(b_price);
  }
  return 0;
}
function sortVvicSaleNum(a,b){
  var a_sale = a.saleNum;
  var b_sale = b.saleNum;
  if(a_sale!=null&&b_sale!=null)
  {
      return parseFloat(b_sale)-parseFloat(a_sale);
  }
  return 0;
}
