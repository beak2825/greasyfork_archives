// ==UserScript==
// @name         Same Style
// @name:zh-CN   Same Style
// @namespace    com.hct.operate
// @icon         https://lk-data-collection.oss-cn-qingdao.aliyuncs.com/winner/winnercoupang/Icon.png
// @version      1.61
// @description  Taobao commodity information collection applied to Operate system
// @description:zh-cn   采集同款信息
// @author       hansel
// @include      https://item.taobao.com/*
// @grant        GM_xmlhttpRequest
// @require      http://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/408325/Same%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/408325/Same%20Style.meta.js
// ==/UserScript==
var sclickUrl168 ="https://detail.1688.com/offer/";
var alClickUrl = "https://item.taobao.com/item.htm?id=";
var vvicUrl = "https://www.vvic.com/item/";
var rs_url = "http://rs.hagoto.com:8090";
var api_url = "http://120.27.60.38:8093//search/api";
var main_image = '';
var details_id = "";
var platform_type = 'vvic';
var sort_by = 'sort_zh';
var price_arr = [];
var avg = "";
var bmid = "";

var vvic_list = [],
    vvic_origin_list = [],
    alibaba_list = [],
    alibaba_origin_list = [],
    tb_list = [],
    tb_origin_list = [];

(function() {
    'use strict';
    var cur_url = document.location.href;
    initializePage();
})();
function initializePage(){
    var url = window.location.href;
    if(url.indexOf("details_id=")>0){
        var keydatas = url.split('details_id=');
        details_id = keydatas[1];
    }
    if(details_id == ""){
        return;
    }
    if(url.indexOf("bmid=")>0){
        var key_datas = url.split('bmid=');
        bmid = key_datas[1];
    }

    var div = document.createElement("div");
    div.setAttribute("style", "width: 100%;height: 30px;position: fixed;left: 84%;bottom: 50%;height: 35px;line-height: 35px;color: #333;font-size: 14px;");
    var inner_html = '<p style="border: 1px solid #ccc;border-bottom: none;font-size: 13px;width: 275px;padding-left: 5px;margin:0">当前已选择 <span class="have_choose" style="color:red">0</span> 件商品</p><input type="text" value="价格平均值：00.00" readonly class="input_price"><button class="btn-confirm">回传系统</button>';
    div.innerHTML = inner_html;
    document.body.appendChild(div);
    $(".input_price").attr("style","display: inline-block;width: 200px;padding: 5px;border: 1px solid #ccc;font-size:14px;color: #222;font-weight: bold;");
    $(".btn-confirm").attr("style","border: none;width: 82px;height: 33px;color: #fff;background: #fb658a;cursor: pointer;");

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
                
                if(result.readyState==4&&result.status==200){
                    var dataJson = JSON.parse(result.response);
                    console.log(dataJson);
                    alert(dataJson.msg);
                }
            }
        })

    });

    var params = {"bestId":details_id};
    var getDetailsInfo = api_url+'/bestInfo';
    GM_xmlhttpRequest({
        method: "POST",
        url: getDetailsInfo,
        dataType: "json",
        data: JSON.stringify(params),
        headers:  {
            "Content-Type": "application/json"
        },
        onload: function(response) {
            if(response.readyState==4&&response.status==200){
                var jsondata = JSON.parse(response.responseText);
                if(jsondata.code==500){
                    alert(jsondata.msg);
                    return;
                }
                main_image = jsondata.data.goodImg;
                var div = document.createElement("div");
                div.setAttribute("style", "position: relative;width: 1190px;margin: 0 auto;");
                var html_one = "<div class='item-content clearfix'>" +
                    "        <div style='width: 970px;margin-top: 20px;float:left'>" +
                    "            <div style='padding: 0 20px 0 440px;min-height: 450px;position: relative;width: 530px;'>" +
                    "                <div style='position: relative;width: 530px;color: #333;padding-bottom: 10px;'>" +
                    "                    <strong style='font-size: 18px;font-weight: 400;margin-bottom: 10px;'>"+jsondata.data.goodName+"</strong>" +
                    "                </div>" +
                    "                <div style='padding: 15px 20px;background-color: #fbf1f0;font-size: 14px;position: relative;'>" +
                    "                    <div style='line-height: 1.2;height:40px;display: block;color: #999;overflow: hidden;'>" +
                    "                        <div style='float: left;line-height:35px;width: 74px;'>韩国网店价</div>" +
                    "                        <div style='color: #ff4640;width: 370px;float: left;'>" +
                    "                            <span style='float: left;'>" +
                    "                                <strong style='font-style: normal;font-size: 24px;font-family: Arial;margin-right: 3px;'>₩</strong>" +
                    "                                <strong style='font-size: 26px;font-weight: bold;'>"+jsondata.data.goodPrice+"</strong>" +
                    "                            </span>" +
                    "                        </div>" +
                    "                        <div style='clear: both;'></div>" +
                    "                    </div>" +
                    "                </div>" +
                    "                <div style='position: relative;width: 530px;padding: 2px 0;'>" +
                    "                    <div style='position: relative;zoom: 1;line-height: 30px;margin: 10px 20px;'>" +
                    "                        <div style='float: left;font-size:14px;color: #6c6c6c;width: 86px;'>推荐采购价格</div>" +
                    "                        <div style='display: inline-block;color: #6c6c6c;'>"+jsondata.data.recommendPrice+"元</div>" +
                    "                        <div style='clear: both;'></div>" +
                    "                    </div>" +
                    "                </div>" +

                    "                <div style='position: absolute;top: 0;left: 20px;width: 408px;height: 420px;padding-left: 0;'>" +
                    "                    <div class='thumbnail' style='height: 420px;position: relative;overflow: hidden;'>" +
                    "                        <div style='position: relative;width: 400px;height: 400px;z-index: 1;background-color: #f5f5f5;' class='tb-booth tb-pic tb-s400'>" +
                    "                            <div class='tb-pic-main'>" +
                    "                                <a href="+jsondata.data.goodUrl+" target='_blank'>" +
                    "                                    <img src="+jsondata.data.goodImg+" alt='' class='jqzoom' style='max-height: 400px;max-width: 400px;cursor: pointer;'>" +
                    "                                </a>" +
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
                    "                <li id='ali' data-platform='1688' style='text-align:center;width: 110px;padding: 0 10px;display: inline;float: left;font-size: 14px;height: 46px;line-height: 46px;border-right: 1px solid #E5E5E5;margin-top: -1px;cursor: pointer;' class='ul-li list'><a class='tb-tab-anchor' data-index='2'>1688</a></li>" +
                    "                <li id='tb' data-platform='tb' style='text-align:center;width: 110px;padding: 0 10px;display: inline;float: left;font-size: 14px;height: 46px;line-height: 46px;border-right: 1px solid #E5E5E5;margin-top: -1px;cursor: pointer;' class='ul-li list'><a class='tb-tab-anchor' data-index='1'>淘宝</a></li>" +
                    "                <li id='sort_price' style='text-align:center;width: 70px;padding: 0 10px;display: inline;float: right;font-size: 14px;height: 46px;line-height: 46px;border-right: 1px solid #E5E5E5;margin-top: -1px;cursor: pointer;' class='ul-li sort'><a class='tb-tab-anchor'>价格排序</a></li>" +
                    "                <li id='sort_sale' style='text-align:center;width: 70px;padding: 0 10px;display: inline;float: right;font-size: 14px;height: 46px;line-height: 46px;border-right: 1px solid #E5E5E5;margin-top: -1px;cursor: pointer;' class='ul-li sort'><a class='tb-tab-anchor'>销量排序</a></li>" +
                    "                <li id='sort_zh' style='text-align:center;width: 70px;padding: 0 10px;display: inline;float: right;font-size: 14px;height: 46px;line-height: 46px;border-right: 1px solid #E5E5E5;margin-top: -1px;cursor: pointer;color:blue' class='ul-li sort'><a class='tb-tab-anchor' >综合排序</a></li>" +
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
                div.innerHTML = html_one;
                document.body.appendChild(div);

                $('#J_TabBar li').on('click', function (e) {
                    if ($(this).hasClass('list')) {
                        $(".result_content").css("display","none");
                        $('#J_TabBar li.list').css("color","#333");
                        $(this).css("color","red");
                        platform_type = $(this).attr('data-platform');
                        if(e.currentTarget.id!=null&&e.currentTarget.id!=""){
                            $("#"+e.currentTarget.id+"_content").css("display","block");
                        }
                    }
                    $('#J_TabBar li.sort').css("color","#333");
                    $("#sort_zh").css("color","blue");
                });

                //价格排序
                $('#sort_price').on('click',function () {
                    console.log(platform_type + '价格排序');
                    $('#J_TabBar li.sort').css("color","#333");
                    $(this).css("color","blue");
                    if (platform_type == 'vvic') {
                        showVvicList('price');
                    }
                    if (platform_type == '1688') {
                        show1688List('price');
                    }
                    if (platform_type == 'tb') {
                        showTbList('price');
                    }
                })
                //销量排序
                $('#sort_sale').on('click',function () {
                    console.log(platform_type+'销量排序');
                    $('#J_TabBar li.sort').css("color","#333");
                    $(this).css("color","blue");
                    if (platform_type == 'vvic') {
                        showVvicList('sale');
                    }
                    if (platform_type == '1688') {
                        show1688List('sale');
                    }
                    if (platform_type == 'tb') {
                        showTbList('sale');
                    }
                })
                //综合排序
                $('#sort_zh').on('click',function () {
                    console.log(platform_type+'综合排序');
                    $('#J_TabBar li.sort').css("color","#333");
                    $(this).css("color","blue");
                    if (platform_type == 'vvic') {
                        showVvicList('zh');
                    }
                    if (platform_type == '1688') {
                        show1688List('zh');
                    }
                    if (platform_type == 'tb') {
                        showTbList('zh');
                    }
                });
                getVvicList(main_image);
                get1688List(main_image);
              //  getTaobaoiList(main_image);
            }
        }
    });

}

//采集
function collectData(params,obj){
    GM_xmlhttpRequest({
        method: "POST",
        url: api_url +"/grabGood/"+details_id,
        dataType: "json",
        data: params,
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(result) {
            if(result.readyState==4&&result.status==200){
                var dataJson = JSON.parse(result.response);
                console.log(dataJson);
                if (dataJson.status == 1) {
                    $(obj.currentTarget).attr("value","已选用");
                }
                alert(dataJson.msg);
            }
        }
    })

}
function getSupplierInfo(params,obj){
    GM_xmlhttpRequest({
        method: "POST",
        url: api_url +"getSupplierInfo?details_id="+details_id,
        dataType: "json",
        data: params,
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(result) {
            if(result.readyState==4&&result.status==200){
                var dataJson = JSON.parse(result.response);
                console.log(dataJson);
                if (dataJson.status == 1) {
                    $(obj.currentTarget).attr("value","已获取");
                }
                alert(dataJson.msg);
            }
        }
    })
}

//淘宝
function getTaobaoiList(zhuImgUrl) {
     GM_xmlhttpRequest({
         method: "POST",
         url: "https://s.taobao.com/search?app=imgsearch&tfsid=" + encodeURI(zhuImgUrl),
         dataType: "json",
         headers: {
             "Content-Type": "application/json"
         },
         onload: function(result) {
             if(result.readyState==4&&result.status==200){
                 if (result.responseText != null) {
                     try {
                         var beginCut = result.responseText.indexOf("g_page_config =");
                         if (beginCut > 0) {
                             var cutBeginStr = result.responseText.substring(beginCut + 15);
                             var endCut = cutBeginStr.indexOf("};");
                             var similarListStr = cutBeginStr.substring(0, endCut + 1).trim();
                             var similarJson = JSON.parse(similarListStr);
                             if(similarJson.mods.itemlist.data.collections!=null&&similarJson.mods.itemlist.data.collections.length>0){
                                 var similarList = similarJson.mods.itemlist.data.collections[0].auctions;
                                 if (similarList.length > 0) {
                                     tb_list = similarJson.mods.itemlist.data.collections[0].auctions;
                                     tb_origin_list = similarJson.mods.itemlist.data.collections[0].auctions;
                                     showTbList();
                                 } else {
                                     $("#tb_table").html("<tr><td class='lxSimilarImage' colspan='3' align='center'>未找到相似商品</td></tr>");
                                 }
                             }else {
                                 $("#tb_table").html("<tr><td class='lxSimilarImage' colspan='3' align='center'>未找到相似商品</td></tr>");
                             }
                         } else if (result.responseText.indexOf("/verify/") > 0) {
                             $("#tb_table").html('<tr><td class="lxSimilarImage" colspan="3" align="center"><a target="_blank" rel="norefferrer"  href="' + result.finalUrl + '">点此验证后，刷新本页面重新加载</a></td></tr>');
                         } else {
                             $("#tb_table").html("<tr><td class='lxSimilarImage' colspan='3' align='center'>未找到相似商品</td></tr>");
                         }
                     } catch (err) {
                         console.log(err);
                     }
                 } else {
                     $("#tb_table").html("<tr><td class='lxSimilarImage' colspan='3' align='center'>未找到相似商品</td></tr>");
                 }
             }
         }
     });
}

function showTbList(sort_by) {
    var similarHtml="";
    var similarList = tb_list;
    if (sort_by == 'sale') {
        similarList = similarList.sort(sortTBSaleNum);
    }else if (sort_by == 'price') {
         similarList = similarList.sort(sortTBPrice);
    } else {
        similarList = tb_origin_list;
    }
    for (var i = 0; i < similarList.length; i++) {
        var thisBean = similarList[i];

        var goodsSource = "淘宝网";
        if (thisBean.detail_url.indexOf("detail.tmall.com/") > -1) {
            goodsSource = "天猫商城";
        }
        var datajson = {"goodsId":thisBean.nid,"goodsImg":thisBean.pic_url,"goodsName":thisBean.title,"goodsPrice":thisBean.view_price,"goodsSource":goodsSource,"goodsUrl":alClickUrl + thisBean.nid,"promoPrice":thisBean.view_price,"saleNum":thisBean.view_sales,"shopName":thisBean.nick};
        var datastr = JSON.stringify(datajson);
        var trItemSame = '<tr class="tr_'+i+'"><td width="14%" rowspan="2" class="lxSimilarImage"><a target="_blank" href="' + alClickUrl + thisBean.nid +'"> '+
            '<img src="' + thisBean.pic_url + '" style="width:100px;height:100px;" /></a></td><td width="45%" class="lxSimilarTitle"><a target="_blank" href="' +
            alClickUrl + thisBean.nid +'">' + thisBean.title + '</a></td><td width="15%" class="lxSimilarSale">' + thisBean.view_sales +
            '</td><td width="16%" class="lxSimilarPrice">￥' + thisBean.view_price + '</td></tr><tr  class="tr_'+i+'"><td class="lxSimilarShop">' + thisBean.nick +
            '</td><td class="lxSimilarLocation">' + thisBean.item_loc + '</td><td><input type="button" value="选用" class="cjtb_btn" data=\''+datastr+'\'/></td></tr></div>';
        similarHtml += trItemSame;
    }
    $("#tb_table").html(similarHtml);
    $(".lxSimilarImage").attr("style","padding-top: 5px;padding-left: 5px;");
    $(".lxSimilarTitle").attr("style","padding-left: 5px;");
    $(".lxSimilarTitle a").attr("style","color:#36c;text-decoration:none;font-size:14px");
    $(".lxSimilarPrice").attr("style","font-size:18px;");
    $(".lxSimilarShop").attr("style","padding-left: 5px;");
    $('.cjtb_btn').on('click', function (e) {
        var datastr = $(e.currentTarget).attr("data");
        $(e.currentTarget).attr("disabled","disabled");
        $(e.currentTarget).css("background-color","rgb(133, 159, 179)");
        collectData(datastr,e);
    });
    $(".cjtb_btn").attr("style","width: 70px;height: 32px;line-height: 32px;color: #fff;background-color: #1E9FFF;text-align: center;border: none;border-radius: 3px;cursor: pointer;");
    $('.cjtb_btn').on('mouseover', function (e) {
        $(e.currentTarget).css("background-color","#48a9f5");
    });
    $('.cjtb_btn').on('mouseout', function (e) {
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

function sortTBPrice(a,b){
  var a_price = a.view_price;
  var b_price = b.view_price;
  if(a_price!=null&&b_price!=null)
  {
     return parseFloat(a_price)-parseFloat(b_price);
  }
  return 0;
}

function sortTBSaleNum(a,b){
  var a_sale = a.view_sales;
  var b_sale = b.view_sales;
  if(a_sale!=null&&b_sale!=null)
  {
     return parseFloat(b_sale)-parseFloat(a_sale);
  }
  return 0;
}

//1688
function get1688List(zhuImgUrl) {
    var currentTime = new Date().getTime();
	var appkey = window.btoa("pc_tusou;" + currentTime);
     GM_xmlhttpRequest({
         method: "POST",
         url: "https://open-s.1688.com/openservice/imageSearchOfferResultViewService?imageAddress=" + encodeURI(zhuImgUrl) + "&imageType=https://g-search2.alicdn.com&pageSize=40&beginPage=1&appName=pc_tusou&appKey=" + appkey,
         dataType: "json",
         headers: {
             "Content-Type": "application/json"
         },
         onload: function(result) {
             if(result.readyState==4&&result.status==200){
                 try {
                     var list_1688 = JSON.parse(result.response).data.offerList;
                     if (list_1688.length > 0) {
                         alibaba_list = JSON.parse(result.response).data.offerList;
                         alibaba_origin_list = JSON.parse(result.response).data.offerList;
                         show1688List();
                     } else {
                         $("#ali_table").html("<tr><td class='lxSimilarImage' colspan='3' align='center'>未找到相似商品</td></tr>");
                     }
                 } catch (err) {
                     console.log(err);
                     $("#ali_table").html("<tr><td class='lxSimilarImage' colspan='3' align='center'>未找到相似商品</td></tr>");
                 }
             }
         }
     });
}

function show1688List(sort_by) {
    var similarList1688 = alibaba_list;
    if (sort_by == 'sale') {
        similarList1688 = similarList1688.sort(sortSaleNum);
    }else if (sort_by == 'price') {
         similarList1688 = similarList1688.sort(sortPrice);
    } else {
        similarList1688 = alibaba_origin_list;
    }
    var similarHtml = "";
    for (var i = 0; i < similarList1688.length; i++) {
        var thisBean = similarList1688[i];
        var datajson = {"goodsId":thisBean.id,"goodsImg":thisBean.image.imgUrl,"goodsName":thisBean.information.subject,"goodsPrice":thisBean.tradePrice.offerPrice.valueString,"goodsSource":"1688","goodsUrl":sclickUrl168 + thisBean.id+".html","promoPrice":thisBean.tradePrice.offerPrice.valueString,"saleNum":thisBean.tradeQuantity.number,"shopName":thisBean.aliTalk.loginId};
        var datastr = JSON.stringify(datajson);
        var itemId = thisBean.id;
        var imageUrl = thisBean.image.imgUrlOf100x100;
        var title = thisBean.information.subject;
        var tradeNumber = thisBean.tradeQuantity.number;
        var price = "￥" + thisBean.tradePrice.offerPrice.valueString;
        if (thisBean.tradePrice.offerPrice.valueString == undefined) {
            thisBean.tradePrice.offerPrice.valueString = "999546548.99";
            price = "授权可见";
        }
        var trItemSame = '<tr class="tr_'+i+'"><td width="14%" rowspan="2" class="lxSimilarImage"><a target="_blank" href="' + sclickUrl168 + itemId + '.html"><img src="' +
            imageUrl + '" style="width:100px;height:100px;"/></a></td><td width="50%" class="lxSimilarTitle"><a target="_blank" href="' +
            sclickUrl168 + itemId + '.html">' + title + '</a></td><td width="25%" class="lxSimilarSale">成交' + tradeNumber + '笔</td><td width="16%" class="lxSimilarPrice">' +
            price + '</td></tr><tr class="tr_'+i+'"><td class="lxSimilarShop">' + thisBean.aliTalk.loginId + '</td><td class="lxSimilarLocation">' +
            thisBean.company.city + '</td><td align="center"><input type="button" value="选用" class="cj1688_btn" data=\''+datastr+'\'/><input type="button" value="价格比对" data-price="'+price+'" data-itemid="'+itemId+'" class="price_compare_1688" /></td></tr>';

         for (var j = 0; j < price_arr.length; j++) {
            if (price_arr[j].itemid == itemId) {
                trItemSame = '<tr class="tr_'+i+'"><td width="14%" rowspan="2" class="lxSimilarImage"><a target="_blank" href="' + sclickUrl168 + itemId + '.html"><img src="' +
            imageUrl + '" style="width:100px;height:100px;"/></a></td><td width="50%" class="lxSimilarTitle"><a target="_blank" href="' +
            sclickUrl168 + itemId + '.html">' + title + '</a></td><td width="25%" class="lxSimilarSale">成交' + tradeNumber + '笔</td><td width="16%" class="lxSimilarPrice">' +
            price + '</td></tr><tr class="tr_'+i+'"><td class="lxSimilarShop">' + thisBean.aliTalk.loginId + '</td><td class="lxSimilarLocation">' +
            thisBean.company.city + '</td><td align="center"><input type="button" value="选用" class="cj1688_btn" data=\''+datastr+'\'/><input type="button" value="取消比对" data-price="'+price+'" data-itemid="'+itemId+'" class="price_compare_1688 has" /></td></tr>';
            }
        }
        similarHtml += trItemSame;
    }
    $("#ali_table").html(similarHtml);
    $(".lxSimilarImage").attr("style","padding-top: 5px;padding-left: 5px;");
    $(".lxSimilarTitle").attr("style","padding-left: 5px;");
    $(".lxSimilarTitle a").attr("style","color:#36c;text-decoration:none;font-size:14px");
    $(".lxSimilarPrice").attr("style","font-size:18px;");
    $(".lxSimilarShop").attr("style","padding-left: 5px;");
    //采集
    $('.cj1688_btn').on('click', function (e) {
        var datastr = $(e.currentTarget).attr("data");
        $(e.currentTarget).attr("disabled","disabled");
        $(e.currentTarget).css("background-color","rgb(133, 159, 179)");
        collectData(datastr,e);
    });
    //加入比对
    $('.price_compare_1688').on('click',function() {
        var get_itemid = $(this).attr('data-itemid');
        if ($(this).hasClass('has')) {
            for (var i = 0; i < price_arr.length; i++) {
                if (price_arr[i].itemid == get_itemid) {
                    price_arr.splice(i, 1);
                }
            }
            $(this).css('background','rgb(30, 159, 255)');
            $(this).val('价格比对');
            $(this).removeClass('has');
        } else {
            $(this).css('background','rgb(177, 94, 46)');
            $(this).val('取消比对');
            $(this).addClass('has');
            var get_price = $(this).attr('data-price');
            get_price = get_price.trim();
            var price_temp = get_price.split("￥");
            var this_price = parseFloat(price_temp[1]);
            var temp = {};
            temp.itemid = get_itemid;
            temp.price = this_price;
            price_arr.push(temp);
        }
        console.log(price_arr);
        avg = getAvg();
        console.log(avg);
        var length = price_arr.length;
        $(".have_choose").text(length);
        $(".input_price").attr("value","价格平均值："+avg);
    });
    $(".cj1688_btn").attr("style","width: 70px;height: 32px;line-height: 32px;color: #fff;background-color: #1E9FFF;text-align: center;border: none;border-radius: 3px;cursor: pointer;");
    $(".price_compare_1688").attr("style","width: 90px;position: absolute;margin-left: 35px;height: 32px;line-height: 32px;color: #fff;background-color: #1E9FFF;text-align: center;border: none;border-radius: 3px;cursor: pointer;");
    $(".price_compare_1688.has").attr("style","width: 90px;position: absolute;margin-left: 35px;height: 32px;line-height: 32px;color: #fff;background-color: rgb(177, 94, 46);text-align: center;border: none;border-radius: 3px;cursor: pointer;");
    $('.cj1688_btn').on('mouseover', function (e) {
        $(e.currentTarget).css("background-color","#48a9f5");
    });
    $('.cjtb_btn').on('mouseout', function (e) {
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
    console.log(zhuImgUrl);
     GM_xmlhttpRequest({
         method: "POST",
         url: rs_url + "/ylfs/vvic/goodsSimilar?path=" +zhuImgUrl,
         dataType: "json",
         headers: {
             "Content-Type": "application/json"
         },
         onload: function(result) {

             if(result.readyState==4&&result.status==200){
                 try {
                     var similarObj = JSON.parse(result.response);
                     var status = similarObj.status;
                     if (status==1) {
                         vvic_list = JSON.parse(similarObj.data);
                         vvic_origin_list = JSON.parse(similarObj.data);
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

        var trItemSame =  '<tr  class="tr_'+i+'"><td width="14%" rowspan="2" class="lxSimilarImage"><a target="_blank" href="' + vvicUrl + itemId + '.html"><img src="' + imageUrl + '" style="width:100px;height:100px;"/></a></td><td width="50%" class="lxSimilarTitle"><a target="_blank" href="' + vvicUrl + itemId + '.html">' +
            title + '</a></td><td width="25%" class="lxSimilarSale">成交' + tradeNumber + '笔</td><td width="16%" class="lxSimilarPrice">' + price + '</td></tr><tr  class="tr_'+i+'"><td class="lxSimilarShop">' + shopName +
            '</td><td class="lxSimilarLocation">' + "" + '</td><td align="center" style="width:100px;position:relative"><input type="button" value="选用" class="cjvvic_btn" data=\''+datastr+'\'/></td></tr>';
        for (var j = 0; j < price_arr.length; j++) {
            if (price_arr[j].itemid == itemId) {
                trItemSame = '<tr  class="tr_'+i+'"><td width="14%" rowspan="2" class="lxSimilarImage"><a target="_blank" href="' + vvicUrl + itemId + '.html"><img src="' + imageUrl + '" style="width:100px;height:100px;"/></a></td><td width="50%" class="lxSimilarTitle"><a target="_blank" href="' + vvicUrl + itemId + '.html">' +
            title + '</a></td><td width="25%" class="lxSimilarSale">成交' + tradeNumber + '笔</td><td width="16%" class="lxSimilarPrice">' + price + '</td></tr><tr  class="tr_'+i+'"><td class="lxSimilarShop">' + shopName +
            '</td><td class="lxSimilarLocation">' + "" + '</td><td align="center" style="width:100px;position:relative"><input type="button" value="选用" class="cjvvic_btn" data=\''+datastr+'\'/></td></tr>';
            }
        }
        similarHtml += trItemSame;
    }
    $("#vvic_table").html(similarHtml);
    $(".lxSimilarImage").attr("style","padding-top: 5px;padding-left: 5px;");
    $(".lxSimilarTitle").attr("style","padding-left: 5px;");
    $(".lxSimilarTitle a").attr("style","color:#36c;text-decoration:none;font-size:14px");
    $(".lxSimilarPrice").attr("style","font-size:18px;");
    $(".lxSimilarShop").attr("style","padding-left: 5px;");
    //采集
    $('.cjvvic_btn').on('click', function (e) {
        var datastr = $(e.currentTarget).attr("data");
        $(e.currentTarget).attr("disabled","disabled");
        $(e.currentTarget).css("background-color","rgb(133, 159, 179)");
        collectData(datastr,e);
    });
    //获取供应商信息
    $('.get_supplier_info').on('click', function (e) {
        var datastr = $(e.currentTarget).attr("data");
        $(e.currentTarget).attr("disabled","disabled");
        $(e.currentTarget).css("background-color","rgb(133, 159, 179)");
        getSupplierInfo(datastr,e);
    });
    //加入比对
    $('.price_compare').on('click',function() {
        var get_itemid = $(this).attr('data-itemid');
        if ($(this).hasClass('has')) {
            for (var i = 0; i < price_arr.length; i++) {
                if (price_arr[i].itemid == get_itemid) {
                    price_arr.splice(i, 1);
                }
            }
            $(this).css('background','#1E9FFF');
            $(this).val('价格比对');
            $(this).removeClass('has');
        } else {
            $(this).css('background','rgb(177, 94, 46)');
            $(this).val('取消比对');
            $(this).addClass('has');
            var get_price = $(this).attr('data-price');
            get_price = get_price.trim();
            var price_temp = get_price.split("￥");
            var this_price = parseFloat(price_temp[1]);
            var temp = {};
            temp.itemid = get_itemid;
            temp.price = this_price;
            price_arr.push(temp);
        }
        console.log(price_arr);
        avg = getAvg();
        console.log(avg);
        var length = price_arr.length;
        $(".have_choose").text(length);
        $(".input_price").attr("value","价格平均值："+avg);
    });
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
