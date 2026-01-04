// ==UserScript==
// @name         tbtm16pp
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  页面数据提取
// @icon         https://lk-data-collection.oss-cn-qingdao.aliyuncs.com/winner/winnercoupang/Icon.png
// @author       fengye
// @include      *://*yangkeduo.com/goods.html?*
// @include      *://detail.1688.com/offer/*.html?*
// @include      *://item.taobao.com/item.htm?*
// @include      *://detail.tmall.com/item.htm?*
// @require      http://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474127/tbtm16pp.user.js
// @updateURL https://update.greasyfork.org/scripts/474127/tbtm16pp.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var ext="<div class='ext111' style='position: fixed;top: 0;left: 0;z-index:999;'><div style='width: 250px;height: 200px;background:#efe1b0; color:#FFF;'><p>"
    +"<textarea id='detail_json' style=' width: 250px; height: 134px;color: black;'></textarea></p><p style='text-align: center;'><button style='background-color:red;' class='js-get-url'>提取</button>><button style='background-color:red;' class='js-copy'>COPY</button></p></div>";
    $("body").prepend(ext);
    var url = window.location.href;
    console.log(url);
    $('.js-get-url').click(function(){
        $("#detail_json").val("");
        if(url.indexOf("yangkeduo.com/goods.html")!=-1){
            //拼多多
            pinduoduo(url);
        }else if(url.indexOf("detail.1688.com")!=-1){
			//1688
			ali1688(url);
		}else if(url.indexOf("detail.tmall.com")!=-1){
			//TM
			grabTMInfo2023(url);
		}else if(url.indexOf("item.taobao.com")!=-1){
			//taobao
			grabTBInfo2023(url);
		}
    });
    $('.js-copy').click(function(){
        var goodInfo = $("#detail_json").val();
        copy(goodInfo);
    });

})();
function grabTMInfo(url){
    //商品名
    var title;
    var skuInfo;
    var goods_detail={};
    var details;
    var planGoodId;
    var platform = "BRS";
   // https://item.taobao.com/item.htm?id=670234801635&planGoodId=3186&myPlat=BRS
    if(url.indexOf("myPlat=BRS")!=-1){
        platform = "BRS";
    }else if(url.indexOf("myPlat=JOY")!=-1){
        platform = "JOY";
    }
    var params = url.split("&");
    for (var i=0;i<params.length;i++) {
        if(params[i].indexOf("planGoodId=")!=-1){
            planGoodId = params[i].split("=")[1];
            break;
        }
    }
    $(".tb-detail-hd").each(function(i,item){
		title = $(this).find("h1").text();
    });
     $("#detail_json").val(title.trim());
    //主图
    var ck=document.getElementsByTagName("script");
    for(var num = 1;num<ck.length;num++){
        var aa = $(ck[num]).text();
        if(aa.indexOf("TShop.Setup")!=-1){
            aa = aa.substring(aa.indexOf("TShop.Setup"));
            var first = aa.indexOf("{");
            var end = aa.lastIndexOf("}");
            aa = aa.substring(first,end+1);
            skuInfo=aa;
        }
    }
    $("#description").find("img").each(function(i,item){
        var imgsrc = $(this).attr("src");
        details += imgsrc+",";

    });
    var requestUrl = "http://120.27.60.38:8083/api/collectTMInfo";
    if("JOY"==platform){
        requestUrl = "http://120.27.60.38:8093/api/collectTMInfo";
    }
    $.ajax({
       	  	type:"post",
       	  	url:requestUrl,
       	  	data : {
       			"title": title,"detailInfo":details,"skuInfo":skuInfo,"planGoodId":planGoodId,"sellerId":$("#dsr-userid").val(),"skuHtml":$(".tb-sku").html()
       		},
       		async : true,
       	  	success:function(res){

       	  	},
       	  	error:function(xhr){
       	  		console.log(xhr)
       	  	}
       	  });


}

function grabTBInfo(url){
    //商品名
    var title =  $(".tb-main-title").text();
    if(title!=null){
        title = title.trim();
    }
    var skuInfo = {};
    var goods_detail={};
    var details;
    var mainImgs;
    var planGoodId;
    var platform = "BRS";
   // https://item.taobao.com/item.htm?id=670234801635&planGoodId=3186&myPlat=BRS
    if(url.indexOf("myPlat=BRS")!=-1){
        platform = "BRS";
    }else if(url.indexOf("myPlat=JOY")!=-1){
        platform = "JOY";
    }
    var params = url.split("&");
    for (var i=0;i<params.length;i++) {
        if(params[i].indexOf("planGoodId=")!=-1){
            planGoodId = params[i].split("=")[1];
            break;
        }
    }
     //主图
    $("#J_UlThumb").find("img").each(function(i,item){
		var imgsrc = $(this).attr("data-src");
        mainImgs += imgsrc+",";
    });
     $("#detail_json").val(title.trim());

    var descStr = Hub.config.get('desc');
    var sku = Hub.config.get('sku');
    skuInfo["skuMap"]=sku.valItemInfo.skuMap;
    skuInfo["propertyMemoMap"]=sku.valItemInfo.propertyMemoMap;
    skuInfo["itemId"]=g_config.sellerId;
    skuInfo["descImg"]=descStr.apiImgInfo;

    $("#description").find("img").each(function(i,item){
        var imgsrc = $(this).attr("src");
        details += imgsrc+",";

    });
    var requestUrl = "http://120.27.60.38:8083/api/collectTbInfo";
    if("JOY"==platform){
        requestUrl = "http://120.27.60.38:8093/api/collectTbInfo";
    }
    $.ajax({
       	  	type:"post",
       	  	url:requestUrl,
       	  	data : {
       			"title": title,"detailInfo":details,"skuInfo":JSON.stringify(skuInfo),"mainInfo":mainImgs,"skuHtml":$("#J_isku").html(),"planGoodId":planGoodId
       		},
       		async : true,
       	  	success:function(res){
                alert(res.msg);
                console.log(res.msg);
       	  	},
       	  	error:function(xhr){
       	  		console.log(xhr)
       	  	}
       	  });


}

function ali1688(url){

    var goods_detail={};
    //主图
    var main_img=new Array();
    var dataImgs;
    $(".detail-gallery-img").each(function(i,item){
		dataImgs = $(this).attr("src");
        main_img[i]=dataImgs;
    });
    goods_detail["main_img"]=main_img;
    //详情图
    var detail_list_img=new Array();
    var node_name=$(".content-detail").find("img");
    $(node_name).each(function(i,item){
        detail_list_img[i]=$(this).attr("src");
    });
    goods_detail["detail_list_img"]=detail_list_img;
    //商品名
    var goods_name=$(".title-text").text();
    goods_detail["goods_name"]=goods_name;
    //规格

    var init_data = window.__INIT_DATA;
    var globalData= init_data.globalData;
    var skuModal = init_data.globalData.skuModel;
    goods_detail["sku_list"]=skuModal;
    goods_detail["url"]=url;
    var detail=JSON.stringify(goods_detail);
    $("#detail_json").val(detail);
}

function grabTBInfo2023(url){
    //商品名
    var title =  $(".tb-main-title").text();
    if(title!=null){
        title = title.trim();
    }

    var skuInfo = {};
    var goods_detail={};
    goods_detail["goods_name"]=title;
    var details;
    var mainImgs;
    var imgsrc;
    var main_img=new Array();
     //主图
    $("#J_UlThumb").find("img").each(function(i,item){
		imgsrc = $(this).attr("data-src");
        if(imgsrc!=undefined){
            if(imgsrc.indexOf('jpg')!=-1){
                imgsrc = imgsrc.substring(0,imgsrc.indexOf('jpg')+3);
            }else if(imgsrc.indexOf('png')!=-1){
                imgsrc = imgsrc.substring(0,imgsrc.indexOf('png')+3);
            }
            if(imgsrc.indexOf('http')==-1){
               imgsrc='https:'+imgsrc;
            }
            main_img[i] = imgsrc;
        }
    });
    goods_detail["main_img"]=main_img;

    var descStr = Hub.config.get('desc');
    var sku = Hub.config.get('sku');

    skuInfo["skuMap"]=sku.valItemInfo.skuMap;
    skuInfo["itemId"]=g_config.sellerId;
    skuInfo["descImg"]=descStr.apiImgInfo;
    skuInfo["skuHtml"]=$("#J_isku").html();
    var detail_list_img=new Array();
    $("#description").find("img").each(function(i,item){
       imgsrc = $(this).attr("src");
        if(imgsrc.indexOf('http')==-1){
            imgsrc='https:'+imgsrc;
         }
         detail_list_img[i] = imgsrc;
    });
    goods_detail["detail_list_img"]=detail_list_img;
    goods_detail["sku_list"]=skuInfo;
    goods_detail["url"]=url;
    var detail=JSON.stringify(goods_detail);
    $("#detail_json").val(detail);
}

function grabTMInfo2023(url){
    //价格
    var goodPrice=0;
    $("div[class*='Price--originPrice']").find("span[class*='priceText']").each(function(i,item){
        if(!isNaN($(this).text())){
           goodPrice = $(this).text();
           return false;
        }

    });
    //商品名
    var title = $("h1[class*='mainTitle']").text();
    var skuInfo = {};
    var goods_detail={};
    var details;
    var imgsrc;
    goods_detail["goods_name"]=title;
    //主图
    var main_img=new Array();
    $("img[class*='thumbnailPic']").each(function(i,item){
		imgsrc = $(this).attr("src");
        if(imgsrc!=undefined){
            if(imgsrc.indexOf('jpg')!=-1){
                imgsrc = imgsrc.substring(0,imgsrc.indexOf('jpg')+3);
            }else if(imgsrc.indexOf('png')!=-1){
                imgsrc = imgsrc.substring(0,imgsrc.indexOf('png')+3);
            }
            if(imgsrc.indexOf('http')==-1){
               imgsrc='https:'+imgsrc;
            }
            main_img[i] = imgsrc;
        }
    });
    skuInfo["skuHtml"]=$(".skuWrapper").html();
    skuInfo["goodPrice"]=goodPrice;
    goods_detail["main_img"]=main_img;

    //详情图
    var detail_list_img=new Array();
    $(".desc-root").find("img").each(function(i,item){
       imgsrc = $(this).attr("src");
        if(imgsrc.indexOf('http')==-1){
            imgsrc='https:'+imgsrc;
         }
         detail_list_img[i] = imgsrc;
    });
    goods_detail["detail_list_img"]=detail_list_img;
    goods_detail["sku_list"]=skuInfo;
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

function copy(copyId){
    // var url = document.getElementById(copyId).innerText;
    // url = url.replace(RegExp(" ", "g"), ""); //复制链接时，把链接中所有空格替换为空字符串
    var oInput = document.createElement('input');
    oInput.value = copyId;
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    oInput.className = 'oInput';
    oInput.style.display='none';
}
