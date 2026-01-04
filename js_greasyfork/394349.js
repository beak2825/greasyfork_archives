// ==UserScript==
// @name         Collect Taobao
// @name:zh-CN   Collect Taobao
// @namespace    com.hct.rswinta
// @icon         https://lk-data-collection.oss-cn-qingdao.aliyuncs.com/winner/winnercoupang/Icon.png
// @version      1.1
// @description  Taobao commodity information collection applied to RS&Winta system
// @description:zh-cn   淘宝商品信息采集应用于RS&Winta系统
// @author       ylfs
// @include      https://item.taobao.com/*
// @include      https://detail.tmall.com/*
// @include      https://s.taobao.com/search?*
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/394349/Collect%20Taobao.user.js
// @updateURL https://update.greasyfork.org/scripts/394349/Collect%20Taobao.meta.js
// ==/UserScript==
var sclickUrl168 ="https://detail.1688.com/offer/";
var alClickUrl = "https://item.taobao.com/item.htm?id=";
var vvicUrl = "https://www.vvic.com/item/";
var rs_url = "http://rs.hagoto.com:8090";
var winner_url = "http://rs.hagoto.com:8092";
var keyword ="";
var keyId="";
var userId="";
var collectType="";
(function() {
    'use strict';
    var cur_url = document.location.href;
    var bigPicView = document.createElement("div");
    bigPicView.setAttribute("id", "bigPicView");
    bigPicView.setAttribute("style", "z-index:100000001;position:fixed;top:12%;left:220px;display:block;margin:5px;");
    bigPicView.innerHTML="<img src='' id='bigPic' style='width:500px;border-radius: 10px;'/>";
    document.body.appendChild(bigPicView);

    getUrlParams();
    if(cur_url.indexOf("item.taobao.com")>0)
    {
       //淘宝
        if(keyId == ""){
            return;
        }
       addTBPage();
    }else if(cur_url.indexOf("detail.tmall.com")>0){
       //天猫
       if(keyId == ""){
           return;
       }
       addTMPage();
    }else{
        var maskDiv = document.createElement("div");
        maskDiv.setAttribute("id", "maskDiv");
        maskDiv.setAttribute("style", "z-index:100000002;position:absolute;left:0px;top:0px;width:100%;height:100%;background-color:#000000;opacity:0.5; -moz-opacity:0.5; filter:alpha(opacity=50);");
        maskDiv.innerHTML="<div style='position: relative;top: 49%;width:100%;height:100%;font-size:25px;text-align:center;color:#fff'>请稍后，正在加载...</div>";
        document.body.appendChild(maskDiv);
        var bodyStyle = document.body.style;
        console.log(bodyStyle);
        $(document.body).attr("style","overflow: hidden;width:100%;height: 100%;top:0;position:fixed;");
        window.onload = function () {
            $(".icon-btn-search").each(function(){
                $(this).attr("onclick","javascript:alert('禁用搜索');return false;");
            });

             if(collectType=="rs"){
                 $(".J_MouserOnverReq").each(function(){
                     $(this).find("div.shop").remove();
                     $(this).find("div.row-4").remove();
                     var isAd = $(this).hasClass("item-ad");
                     $(this).find("a").each(function(){
                         if(isAd){
                             var aa = $(this).attr("data-nid");
                             $(this).attr("href","https://detail.tmall.com/item.htm?id="+aa+"&rs_keyword_id="+keyId+"&rs_user_id="+userId+"&rs_keyword="+encodeURI(keyword));
                         }else{
                             var aHref = $(this).attr("href");
                             $(this).attr("href",aHref+"&rs_keyword_id="+keyId+"&rs_keyword="+keyword+"&rs_user_id="+userId);
                         }
                     });
                 });
            }else{
              $(".items").find("a").each(function(){
                  var aHref = $(this).attr("href");
                  $(this).attr("href",aHref+"&winta_id="+keyId+"&rs_user_id="+userId);
              });
            }
            $("#maskDiv").css("display","none");
            $(document.body).attr("style",bodyStyle);
        }
    }
    queryKeyword();
})();
function getUrlParams(){
    var url = window.location.href;
    if(url.indexOf("q=")>0){
        var strs=url.split("q="); //字符分割
        var keywordstr = strs[1];
        keyword = decodeURI( keywordstr.split("&")[0])
    }else if(url.indexOf("&rs_keyword=")>0){
        var keydatas = url.split('&rs_keyword=');
        var keywords = keydatas[1];
        keyword = decodeURI(keywords.split("&")[0]);
    }
    if(url.indexOf("&rs_keyword_id=")>0){
        var keys = url.split('&rs_keyword_id=');
        var keyIds = keys[1];
        keyId = keyIds.split("&")[0];
        collectType = "rs";
    }
    if(url.indexOf("&rs_user_id=")>0){
        var users = url.split('&rs_user_id=');
        var userIds = users[1];
        userId = userIds.split("&")[0];
    }
    if(url.indexOf("&winta_id=")>0){
        var winnerKeys = url.split('&winta_id=');
        var winnerKeyIds = winnerKeys[1];
        keyId = winnerKeyIds.split("&")[0];
        collectType = "winta";
    }
}
function queryKeyword(){
    getUrlParams();
    if(keyId == ""){
        return;
    }
    var div = document.createElement("div");
    div.setAttribute("id", "img_div");
    div.setAttribute("style", "position: fixed;z-index:100000000;top: 12%;left: 20px; width: 200px;border:1px solid #96C2F1;margin: 0px auto;margin-bottom:20px; background-color: #EFF7FF;max-height:700px;overflow: hidden; ");
    var stylestr="";
    if(keyword.length<=10){
         stylestr = "font-size:18px;line-height: 40px;";
    }else if(keyword.length>10&&keyword.length<=20){
         stylestr = "font-size:18px;line-height: 20px;";
    }else if(keyword.length>20){
         stylestr = "font-size:20px;line-height: 22px;overflow: hidden;-webkit-line-clamp: 2;display: -webkit-box;-webkit-box-orient: vertical;";
    }
    var html = "<p style='color:#fff;background-color: #1E9FFF;height:40px;padding: 5px 5px 5px 10px;"+stylestr+"'>"+keyword+"</p>";

    var params = {"kid":keyId};

    if(collectType=="winta"){
        var wintaUrl= winner_url + "/coupang/searchById";
        GM_xmlhttpRequest({
            method: "POST",
            url: wintaUrl,
            dataType: "json",
            data: JSON.stringify(params),
            headers:  {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                if(response.readyState==4&&response.status==200){
                    var jsondata = JSON.parse(response.responseText);
                    if(jsondata.code==-1){
                        alert(jsondata.msg);
                        return;
                    }
                    var data = jsondata.data;
                    if(data!=null){
                        var imgUrl = data.coupangImages;
                        var imgUrls = imgUrl.split(",");
                        for (var i = 0; i < imgUrls.length; i++) {
                            html +="<div style='width:90px;height:90px;float:left;margin:5px;'><img class='rs_img' src='"+imgUrls[i]+"' style='border-radius: 5px;object-fit:cover;width:100%;height:100%' /></div>";
                        }
                        div.innerHTML=html;
                        document.body.appendChild(div);
                        $('.rs_img').on('mouseover', function (e) {
                            var imgPath = $(e.currentTarget)[0].src;
                            showBigPic(imgPath);
                        });
                        $('.rs_img').on('mouseout', function (e) {
                            closeimg()
                        });
                    }
                }
            }
        });
    }else{
       var rsUrl= rs_url + "/keyword/search";
       GM_xmlhttpRequest({
           method: "POST",
           url: rsUrl,
           dataType: "json",
           data: JSON.stringify(params),
           headers:  {
               "Content-Type": "application/json"
           },
           onload: function(response) {
               console.log(response);
               if(response.readyState==4&&response.status==200){
                   var jsondata = JSON.parse(response.responseText);

                   if(jsondata.code==-1){
                       alert(jsondata.msg);
                       return;
                   }
                   var data = jsondata.data;
                   var imgUrl = data.img_url;
                   var imgUrls = data.img_url.split(",");
                   for (var i = 0; i < imgUrls.length; i++) {
                       html +="<div style='width:90px;height:90px;float:left;margin:5px;'><img class='rs_img' src='"+imgUrls[i]+"' style='border-radius: 5px;object-fit:cover;width:100%;height:100%' /></div>";
                   }
                   div.innerHTML=html;
                   document.body.appendChild(div);
                   $('.rs_img').on('mouseover', function (e) {
                       var imgPath = $(e.currentTarget)[0].src;
                       showBigPic(imgPath);
                   });
                   $('.rs_img').on('mouseout', function (e) {
                       closeimg()
                   });
               }
           }
       });
    }
}
function addTBPage(){
    var tabbar_lis = $('#J_TabBar li');
    var num = tabbar_lis.length;
    for(var i=1;i<num;i++){
        tabbar_lis[i].parentNode.removeChild(tabbar_lis[i]);
    }
    var tabbar = document.getElementById("J_TabBar");
    var tempstr = tabbar.innerHTML;
    tabbar.innerHTML = "<li id='tb' ><a class='tb-tab-anchor' style='cursor:pointer' hidefocus='true' shortcut-effect='click' data-index='1'  data-spm-anchor-id='1'>淘宝</a></li>";
    tabbar.innerHTML += "<li id='ali'><a class='tb-tab-anchor' style='cursor:pointer' hidefocus='true' shortcut-effect='click' data-index='2'  data-spm-anchor-id='2'>1688</a></li>";
    tabbar.innerHTML += "<li id='vvic'><a class='tb-tab-anchor' style='cursor:pointer' hidefocus='true' shortcut-effect='click' data-index='5' data-spm-anchor-id='5'>VVIC</a></li>";
    tabbar.innerHTML += "<li id='hznz'><a class='tb-tab-anchor' style='cursor:pointer' hidefocus='true' shortcut-effect='click' data-index='4'  data-spm-anchor-id='4'>杭州女装</a></li>";
    tabbar.innerHTML += tempstr;
    var main_wrap = document.getElementById("J_MainWrap")
    main_wrap.innerHTML += "<div id='tb_content' class='content' style='display:none'><table id='tb_table' class='pt_table'></table></div>" ;
    main_wrap.innerHTML += "<div id='ali_content' class='content' style='display:none'><table id='ali_table' class='pt_table'></table></div>" ;
    main_wrap.innerHTML += "<div id='vvic_content' class='content' style='display:none' ><table id='vvic_table' class='pt_table'></table></div>" ;
    main_wrap.innerHTML += "<div id='hznz_content' class='content' style='display:none' ><table id='hznz_table' class='pt_table'></table></div>" ;
    $('#J_TabBar li').on('click', function (e) {
        $(".content").css("display","none");
        if(e.currentTarget.id!=null&&e.currentTarget.id!=""){
            $(".tb-price-spec").css("display","none");
            $(".correlative-items").css("display","none");
            $("#J_SubWrap").css("display","none");
            $("#reviews").css("display","none");
            $("#official-remind").css("display","none");
            $("#"+e.currentTarget.id+"_content").css("display","block");
        }else{
            $(".tb-price-spec").css("display","block");
            $(".correlative-items").css("display","block");
            $("#J_SubWrap").css("display","block");
            $("#J_DivItemDesc").css("display","block");
        }
    });
    var img_main = $("#J_UlThumb li div a img")[0];
    var img_frist = $("#J_UlThumb li")[0];
    var idno = $(img_frist).attr("id");
    if(idno!=null&&idno == "J_VideoThumb"){
      img_main = $("#J_UlThumb li div a img")[1];
    }
    var imgUrl = $(img_main).attr("data-src");
    imgUrl = imgUrl.substring(0,imgUrl.lastIndexOf("_"));
    var img_path = "https:"+ imgUrl.replace("_50x50.jpg","");
    getTaobaoiList(img_path);
    get1688List(img_path);
    getVvicList(img_path);
    getHznzList(img_path);
}
function addTMPage(){
    var tabbar = document.getElementById("J_TabBar");
    tabbar.innerHTML="";
    tabbar.innerHTML+="<li id='tb' tabindex='0' role='tab' aria-selected='false' style='cursor:pointer' data-spm-anchor-id='a'><a tabindex='-1' href='#tb' rel='nofollow' hidefocus='true' data-index='0' data-spm-anchor-id='1'>淘宝</a></li>";
    tabbar.innerHTML+="<li id='ali' tabindex='0' role='tab' aria-selected='false' style='cursor:pointer' data-spm-anchor-id='b'><a tabindex='-1' href='#ali' rel='nofollow' hidefocus='true' data-index='0' data-spm-anchor-id='2'>1688</a></li>";
    tabbar.innerHTML+="<li id='vvic' tabindex='0' role='tab' aria-selected='false' style='cursor:pointer' data-spm-anchor-id='c'><a tabindex='-1' href='#vvic' rel='nofollow' hidefocus='true' data-index='0' data-spm-anchor-id='3'>VVIC</a></li>";
    tabbar.innerHTML+="<li id='hznz' tabindex='0' role='tab' aria-selected='false' style='cursor:pointer' data-spm-anchor-id='d'><a tabindex='-1' href='#hznz' rel='nofollow' hidefocus='true' data-index='0' data-spm-anchor-id='4'>杭州女装</a></li>";
    var mainwrap = document.getElementById("J_Detail");
    $("#J_TabRecommends").css("display","none");
    $("#J_SellerInfo").css("display","none");
    $("#j-mdv").css("display","none");
    $("#official-remind").css("display","none");
    mainwrap.innerHTML += "<div id='tb_content' class='content' style='display:none'><table id='tb_table' class='pt_table'></table></div>" ;
    mainwrap.innerHTML += "<div id='ali_content' class='content' style='display:none'><table id='ali_table' class='pt_table'></table></div>" ;
    mainwrap.innerHTML += "<div id='vvic_content' class='content' style='display:none' ><table id='vvic_table' class='pt_table'></table></div>" ;
    mainwrap.innerHTML += "<div id='hznz_content' class='content' style='display:none' ><table id='hznz_table' class='pt_table'></table></div>" ;

    $('#J_TabBar li').on('click', function (e) {
        $(".content").css("display","none");
        $(".tm-qrcode-pic").css("display","none");
        $("#"+e.currentTarget.id+"_content").css("display","block");
    });

    var img_main = $("#J_UlThumb li a img")[0];
    var imgUrl = $(img_main).attr("src");
    imgUrl = imgUrl.substring(0,imgUrl.lastIndexOf("_"));
    var img_path = "https:"+imgUrl.replace("_60x60q90.jpg","");
    getTaobaoiList(img_path);
    get1688List(img_path);
    getVvicList(img_path);
    getHznzList(img_path);
}
//采集
function collectData(params,obj){
    if(collectType=="rs"){
        params = params.replace("}",',"searchKey":"'+keyword+'","searchKeyId":"'+keyId+'","userId":"'+userId+'"}');
        GM_xmlhttpRequest({
            method: "POST",
            url: rs_url +"/ylfs/collect/goods",
            dataType: "json",
            data: params,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(result) {
                if(result.readyState==4&&result.status==200){
                    var dataJson = JSON.parse(result.response);
                    if(dataJson.status==0){
                        if(dataJson.errorCode!=2003){//商品已采集过
                            $(obj.currentTarget).css("background-color","#1E9FFF");
                            $(obj.currentTarget).removeAttr("disabled");
                        }
                        alert(dataJson.errorMessage);
                    }else{
                        alert(dataJson.msg);
                    }
                }
            }
        })
    }else if(collectType=="winta"){
        params = params.replace("}",',"searchKey":"'+keyword+'","searchKeyId":"'+keyId+'","userId":"'+userId+'"}');
        GM_xmlhttpRequest({
            method: "POST",
            url: winner_url +"/coupang/collectGoodsByTB",
            dataType: "json",
            data: params,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(result) {
                if(result.readyState==4&&result.status==200){
                    var dataJson = JSON.parse(result.response);
                    if(dataJson.status==0){
                        if(dataJson.code!=2003){//商品已采集过
                            $(obj.currentTarget).css("background-color","#1E9FFF");
                            $(obj.currentTarget).removeAttr("disabled");
                        }
                        alert(dataJson.msg);
                    }else{
                        alert(dataJson.msg);
                    }
                }
            }
        })
    }
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
                                 var similarHtml="";
                                 if (similarList.length > 0) {
                                     similarList.sort(sortTBPrice);
                                     for (var i = 0; i < similarList.length; i++) {
                                         var thisBean = similarList[i];

                                         var goodsSource = "淘宝网";
                                         if (thisBean.detail_url.indexOf("detail.tmall.com/") > -1) {
                                             goodsSource = "天猫商城";
                                         }
                                         var datajson = {"goodsId":thisBean.nid,"goodsImg":thisBean.pic_url,"goodsName":thisBean.title,"goodsPrice":thisBean.view_price,"goodsSource":goodsSource,"goodsUrl":alClickUrl + thisBean.nid,"promoPrice":thisBean.view_price,"saleNum":thisBean.view_sales,"shopName":thisBean.nick};
                                         var datastr = JSON.stringify(datajson);
                                         var trItemSame = '<tr class="tr_'+i+'"><td width="14%" rowspan="2" class="lxSimilarImage"><a target="_blank" href="' + alClickUrl + thisBean.nid +'&rs_keyword_id='+keyId +
                                             '"><img src="' + thisBean.pic_url + '" style="width:100px;height:100px;" /></a></td><td width="45%" class="lxSimilarTitle"><a target="_blank" href="' +
                                             alClickUrl + thisBean.nid +'&rs_keyword_id='+keyId+'">' + thisBean.title + '</a></td><td width="15%" class="lxSimilarSale">' + thisBean.view_sales +
                                                 '</td><td width="16%" class="lxSimilarPrice">￥' + thisBean.view_price + '</td></tr><tr  class="tr_'+i+'"><td class="lxSimilarShop">' + thisBean.nick +
                                                 '</td><td class="lxSimilarLocation">' + thisBean.item_loc + '</td><td><input type="button" value="采集" class="cjtb_btn" data=\''+datastr+'\'/></td></tr></div>';
                                         similarHtml += trItemSame;
                                     }
                                     $("#tb_table").html(similarHtml);
                                     $(".lxSimilarImage").attr("style","padding-top: 5px;padding-left: 5px;");
                                     $(".lxSimilarTitle").attr("style","padding-left: 5px;");
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
function sortTBPrice(a,b){
  var a_price = a.view_price;
  var b_price = b.view_price;
  if(a_price!=null&&b_price!=null)
  {
     return parseFloat(a_price)-parseFloat(b_price);
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
                     var similarHtml = "";
                     var similarList1688 = JSON.parse(result.response).data.offerList;
                     if (similarList1688.length > 0) {
                         similarList1688.sort(sortPrice);
                         for (var i = 0; i < similarList1688.length; i++) {
                             var thisBean = similarList1688[i];
                             var datajson = {"goodsId":thisBean.id,"goodsImg":thisBean.image.imgUrl,"goodsName":thisBean.information.subject,"goodsPrice":thisBean.tradePrice.offerPrice.valueString,"goodsSource":"1688","goodsUrl":sclickUrl168 + thisBean.id,"promoPrice":thisBean.tradePrice.offerPrice.valueString,"saleNum":thisBean.tradeQuantity.number,"shopName":thisBean.aliTalk.loginId};
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
                                 thisBean.company.city + '</td><td align="center"><input type="button" value="采集" class="cj1688_btn" data=\''+datastr+'\'/></td></tr>';
                             similarHtml += trItemSame;
                         }
                         $("#ali_table").html(similarHtml);
                         $(".lxSimilarImage").attr("style","padding-top: 5px;padding-left: 5px;");
                         $(".lxSimilarTitle").attr("style","padding-left: 5px;");
                         $(".lxSimilarPrice").attr("style","font-size:18px;");
                         $(".lxSimilarShop").attr("style","padding-left: 5px;");
                         //采集
                         $('.cj1688_btn').on('click', function (e) {
                             var datastr = $(e.currentTarget).attr("data");
                             $(e.currentTarget).attr("disabled","disabled");
                             $(e.currentTarget).css("background-color","rgb(133, 159, 179)");
                             collectData(datastr,e);
                         });
                         $(".cj1688_btn").attr("style","width: 70px;height: 32px;line-height: 32px;color: #fff;background-color: #1E9FFF;text-align: center;border: none;border-radius: 3px;cursor: pointer;");
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
function sortPrice(a,b){
  var a_price = a.tradePrice.offerPrice.valueString;
  var b_price = b.tradePrice.offerPrice.valueString;
  if(a_price!=null&&b_price!=null)
  {
     return parseFloat(a_price)-parseFloat(b_price);
  }
  return 0;
}
//VVIC
function getVvicList(zhuImgUrl) {
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
                     var similarHtml = "";
                     var similarObj = JSON.parse(result.response);
                     var status = similarObj.status;
                     if (status==1) {
                         var similarList = JSON.parse(similarObj.data);
                         similarList.sort(sortVvicPrice);
                         for (var i = 0; i < similarList.length; i++) {
                             var thisBean = similarList[i];
                             var datastr = JSON.stringify(thisBean);
                             var itemId = thisBean.goodsId;
                             var imageUrl = thisBean.goodsImg;
                             var title = thisBean.goodsName;
                             var tradeNumber = thisBean.saleNum;
                             var price = "￥" + thisBean.goodsPrice;
                             var shopName = thisBean.shopName;
                             var trItemSame = '<tr  class="tr_'+i+'"><td width="14%" rowspan="2" class="lxSimilarImage"><a target="_blank" href="' + vvicUrl + itemId + '.html"><img src="' + imageUrl + '" style="width:100px;height:100px;"/></a></td><td width="50%" class="lxSimilarTitle"><a target="_blank" href="' + vvicUrl + itemId + '.html">' +
                                 title + '</a></td><td width="25%" class="lxSimilarSale">成交' + tradeNumber + '笔</td><td width="16%" class="lxSimilarPrice">' + price + '</td></tr><tr  class="tr_'+i+'"><td class="lxSimilarShop">' + shopName +
                                 '</td><td class="lxSimilarLocation">' + "" + '</td><td align="center"><input type="button" value="采集" class="cjvvic_btn" data=\''+datastr+'\'/></td></tr>';
                             similarHtml += trItemSame;
                         }
                         $("#vvic_table").html(similarHtml);
                         $(".lxSimilarImage").attr("style","padding-top: 5px;padding-left: 5px;");
                         $(".lxSimilarTitle").attr("style","padding-left: 5px;");
                         $(".lxSimilarPrice").attr("style","font-size:18px;");
                         $(".lxSimilarShop").attr("style","padding-left: 5px;");
                         //采集
                         $('.cjvvic_btn').on('click', function (e) {
                             var datastr = $(e.currentTarget).attr("data");
                             $(e.currentTarget).attr("disabled","disabled");
                             $(e.currentTarget).css("background-color","rgb(133, 159, 179)");
                             collectData(datastr,e);
                         });
                         $(".cjvvic_btn").attr("style","width: 70px;height: 32px;line-height: 32px;color: #fff;background-color: #1E9FFF;text-align: center;border: none;border-radius: 3px;cursor: pointer;");
                         $('.cjvvic_btn').on('mouseover', function (e) {
                             $(e.currentTarget).css("background-color","#48a9f5");
                         });
                         $('.cjvvic_btn').on('mouseout', function (e) {
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
function sortVvicPrice(a,b){
  var a_price = a.goodsPrice;
  var b_price = b.goodsPrice;
  if(a_price!=null&&b_price!=null)
  {
     return parseFloat(a_price)-parseFloat(b_price);
  }
  return 0;
}
//杭州女装网
function getHznzList(zhuImgUrl) {
     GM_xmlhttpRequest({
         method: "POST",
         url: rs_url + "/ylfs/hznzw/goodsSimilar?path=" +zhuImgUrl,
         dataType: "json",
         headers: {
             "Content-Type": "application/json"
         },
         onload: function(result) {
             if(result.readyState==4&&result.status==200){
                 try {
                     var similarHtml = "";
                     var similarObj = JSON.parse(result.response);
                     var status = similarObj.status;
                     if (status==1) {
                         var similarList = JSON.parse(similarObj.data);
                         similarList.sort(sortHznzPrice);
                         if(similarList.length<0){
                             for (var i = 0; i < similarList.length; i++) {
                                 var thisBean = similarList[i];
                                 var datastr = JSON.stringify(thisBean);
                                 var itemId = thisBean.goodsId;
                                 var imageUrl = thisBean.goodsImg;
                                 var title = thisBean.goodsName;
                                 var tradeNumber = thisBean.saleNum;
                                 var price = "￥" + thisBean.goodsPrice;
                                 var shopName = thisBean.shopName;
                                 var trItemSame = '<tr  class="tr_'+i+'"><td width="14%" rowspan="2" class="lxSimilarImage"><a target="_blank" href="' + vvicUrl + itemId + '.html"><img src="' + imageUrl + '" style="width:100px;height:100px;"/></a></td><td width="50%" class="lxSimilarTitle"><a target="_blank" href="' + vvicUrl + itemId + '.html">' +
                                     title + '</a></td><td width="25%" class="lxSimilarSale">成交' + tradeNumber + '笔</td><td width="16%" class="lxSimilarPrice">' + price + '</td></tr><tr  class="tr_'+i+'"><td class="lxSimilarShop">' + shopName +
                                     '</td><td class="lxSimilarLocation">' + "" + '</td><td align="center"><input type="button" value="采集" class="cjhznz_btn" data=\''+datastr+'\'/></td></tr>';
                                 similarHtml += trItemSame;
                             }
                             $("#hznz_table").html(similarHtml);
                             $(".lxSimilarImage").attr("style","padding-top: 5px;padding-left: 5px;");
                             $(".lxSimilarTitle").attr("style","padding-left: 5px;");
                             $(".lxSimilarPrice").attr("style","font-size:18px;");
                             $(".lxSimilarShop").attr("style","padding-left: 5px;");
                             //采集
                             $('.cjhznz_btn').on('click', function (e) {
                                 var datastr = $(e.currentTarget).attr("data");
                                 $(e.currentTarget).attr("disabled","disabled");
                                 $(e.currentTarget).css("background-color","rgb(133, 159, 179)");
                                 collectData(datastr,e);
                             });
                             $(".cjhznz_btn").attr("style","width: 70px;height: 32px;line-height: 32px;color: #fff;background-color: #1E9FFF;text-align: center;border: none;border-radius: 3px;cursor: pointer;");
                             $('.cjhznz_btn').on('mouseover', function (e) {
                                 $(e.currentTarget).css("background-color","#48a9f5");
                             });
                             $('.cjhznz_btn').on('mouseout', function (e) {
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
                         }else {
                             $("#hznz_table").html("<tr><td class='lxSimilarImage' colspan='3' align='center'>未找到相似商品</td></tr>");
                         }
                     } else {
                         $("#hznz_table").html("<tr><td class='lxSimilarImage' colspan='3' align='center'>未找到相似商品</td></tr>");
                     }
                 } catch (err) {
                     console.log(err);
                     $("#hznz_table").html("<tr><td class='lxSimilarImage' colspan='3' align='center'>未找到相似商品</td></tr>");
                 }
             }
         }
     });
}
function sortHznzPrice(a,b){
  var a_price = a.goodsPrice;
  var b_price = b.goodsPrice;
  if(a_price!=null&&b_price!=null)
  {
     return parseFloat(a_price)-parseFloat(b_price);
  }
  return 0;
}

//展示
function showBigPic(filepath) {
    $("#bigPic").attr("src",filepath);
    $("#bigPicView").css("display","block");
}

//隐藏
function closeimg(){
    $("#bigPicView").css("display","none");
}
