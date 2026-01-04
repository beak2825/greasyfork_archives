// ==UserScript==
// @name         中穗商品运营网页插件
// @namespace    http://tampermonkey.net/
// @version      0.102
// @description  中穗公司内部商品运营插件，已支持amazon.com，天猫
// @description:zh 测试版本的
// @author       Chen Ge
// @include      https://www.amazon.com/*
// @exclude      https://www.amazon.com/deals/*
// @exclude      https://www.amazon.com/gp/*
// @exclude      https://www.amazon.com/s?k=*
// @include      https://detail.tmall.com/item.htm*
// @include      https://detail.1688.com/offer/*
// @include      https://erp.lingxing.com/erp/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
// @license      MIT license
// @downloadURL https://update.greasyfork.org/scripts/448090/%E4%B8%AD%E7%A9%97%E5%95%86%E5%93%81%E8%BF%90%E8%90%A5%E7%BD%91%E9%A1%B5%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/448090/%E4%B8%AD%E7%A9%97%E5%95%86%E5%93%81%E8%BF%90%E8%90%A5%E7%BD%91%E9%A1%B5%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==


(function() {
  'use strict'
  console.log('start erp plugin');
  var url=window.location.href;
   var host='https://erp.blhjc.com:99/opt/iframepage';
   //host='http://localhost:8000/opt/iframepage'
   if(url.startsWith('https://erp.lingxing.com/erp/productExpressionNew')){ //产品表现
        console.log('自定义领星产品表现页面参数:'+url);
        var asinFind=new RegExp('\\?asin=[A-Za-z0-9]+').exec(url);
        if(asinFind){
            var asin=asinFind[0].substring(6);
            setTimeout(()=>{
             console.log(`asin:${asin}`);
            //window.$vm.$data.activeName='ASIN';
             //$('.product-expression-root').find('label').first().click();
             //setTimeout(()=>{
               $('.product-expression-root').find('.search-last-item').find('input').last().focus();
                document.execCommand('insertText', false, asin);
                //el.dispatchEvent(new Event('change', {bubbles: true})); // usually not needed
                //$('#advanced-input').find('.lx_combo_search').click();
                $('.product-expression-root').find('.search-last-item').find('.lx_combo_search').click();
             //},500);
            },1000);
        }
  }else if(url.startsWith('https://erp.lingxing.com/erp/listing')){ //领星LISTING
        console.log('自定义领星Listing页面参数:'+url);
        var asinFind=new RegExp('\\?asin=[A-Za-z0-9]+').exec(url);
        if(asinFind){
            var asin=asinFind[0].substring(6);
            setTimeout(()=>{
             console.log(`asin:${asin}`);
            //window.$vm.$data.activeName='ASIN';
             $('#listing-wrapper div div label').first().click();
             setTimeout(()=>{
                $('#advanced-input').find('input').last().focus();
                document.execCommand('insertText', false, asin);
                //el.dispatchEvent(new Event('change', {bubbles: true})); // usually not needed
                $('#advanced-input').find('.lx_combo_search').click();
             },500);
            },1000);
        }
  }else if(url.startsWith('https://erp.lingxing.com/erp/ProfitStatisticsNew')){ //领星利润统计
        console.log('自定义领星利润统计页面参数:'+url);
        var asinFind=new RegExp('\\?asin=[A-Za-z0-9]+').exec(url);
        if(asinFind){
            var asin=asinFind[0].substring(6);
            setTimeout(()=>{
             console.log(`asin:${asin}`);
            //window.$vm.$data.activeName='ASIN';
             $('#tab-ASIN').click();
             setTimeout(()=>{
                $('#advanced-input').find('.el-input__inner').last().focus();
                document.execCommand('insertText', false, asin);
                //el.dispatchEvent(new Event('change', {bubbles: true})); // usually not needed
                $('#advanced-input').find('.lx_combo_search').click();
             },500);
            },1000);
        }
  }else if (url.startsWith("https://www.amazon.")){
        console.log('start erp plugin - amazon');
        //获取网页数据
        var result={platform_id:1}; //亚马逊平台商品
        //获取父商品
        var parentAsanString=$("#twister div ul li").attr('data-dp-url'); //如果有找到说明是变体，否则为单体
        if(parentAsanString){
            result.ware_num=new RegExp('twister\_[A-Za-z0-9]+').exec(parentAsanString)[0].substring(8);
        }else{
            //console.log("这个商品是单体ASAN");
            result.ware_num=null;
        }

        result.sku_num=new RegExp('\/dp\/[A-Za-z0-9]+').exec(url)[0].substring(4);
        //获取商家编码，与名称
        var divSeller=$('#sellerProfileTriggerId');
        result.seller_name=divSeller.text();
        result.seller_id=new RegExp("seller\=[A-Za-z0-9]+").exec(divSeller.attr('href'))[0].substring(7);

        //获取主图
        //var picUrl=
        result.small_pic=$('#altImages ul li.item').first().find('img').attr('src');;
        //result.big_pic=picUrl.replace('40_.jpg','200_.jpg');
        result.big_pic=result.small_pic.replace('40_.jpg','200_.jpg');

        //标题
        result.title=$('#productTitle').text();
        result.title=result.title.substring(1,result.title.length-2).trim();

        //价格
        result.price=$('#apex_desktop').find('.a-offscreen').first().text().substring(1);

        //接收子窗体的信息
        window.addEventListener('message',function(event){
            if('erpNotePage'==event.data.sender){
                console.log('==== received message from child page ====:')
                console.log(event);
                var noteWindow=document.getElementById('ifrmNotePage').contentWindow;
                if(event.data.command=='giveMeGoodsInfo'){
                    noteWindow.postMessage({command:'giveYouGoodsInfo',data:result},'*');
                }else if(event.data.command=='maxMe'){
                    $('#containerNotePage').height(500);
                }else if(event.data.command=='miniMe'){
                    $('#containerNotePage').height(48);
                }
            }
        }, false);

        var divApp = $(`<div id='containerNotePage' style='height:48px'><iframe id='ifrmNotePage' src="`+host+`" style="width:100%;height:100%;border: solid #eee 1px" allowTransparency="true"/></div> `);
        //$('#centerCol').append(divApp);
         $('#ppd').before(divApp);
  }else if(url.startsWith('https://detail.tmall.com/item.htm')){
       console.log('start erp page tmall');
        //获取网页数据
        var result={platform_id:2}; //天猫平台商品
         //获取父商品
        result.ware_num=new RegExp('id=[0-9]+').exec(url)[0].substring(3);
        result.sku_num=null;
        //获取商家编码，与名称
        var divSeller=$('#shopExtra').find('.slogo-shopname');
        result.seller_name=divSeller.text();
        var divSellerIdString=$('meta[name="microscope-data"]').attr('content');
        result.seller_id= new RegExp('shopId=[0-9]+').exec(divSellerIdString)[0].substring(7);
        //result.seller_id=new RegExp("seller\=[A-Za-z0-9]+").exec(divSeller.attr('href'))[0].substring(7);

        //获取主图
        //var picUrl=
        result.small_pic='https:'+$('#J_UlThumb li').first().find('img').attr('src');;
        result.big_pic=result.small_pic.replace('_60x60q90.jpg','');

        //标题
        result.title=$('#J_DetailMeta').find('h1').text().trim();
        //result.title=result.title.substring(1,result.title.length-2).trim();

        //价格
        result.price=$('#J_PromoPrice').find('.tm-price').first().text();


        console.log(result);

              //接收子窗体的信息
        window.addEventListener('message',function(event){
            if('erpNotePage'==event.data.sender){
                console.log('==== received message from child page ====:')
                console.log(event);
                var noteWindow=document.getElementById('ifrmNotePage').contentWindow;
                if(event.data.command=='giveMeGoodsInfo'){
                    noteWindow.postMessage({command:'giveYouGoodsInfo',data:result},'*');
                }else if(event.data.command=='maxMe'){
                    $('#containerNotePage').height(500);
                }else if(event.data.command=='miniMe'){
                    $('#containerNotePage').height(48);
                }
            }
        }, false);

        var divApp = $(`<div id='containerNotePage' style='height:48px'><iframe id='ifrmNotePage' src="`+host+`" style="width:100%;height:100%;border: solid #eee 1px" allowTransparency="true"/></div> `);
        $('#detail').append(divApp);
  }else if(url.startsWith('https://detail.1688.com/offer/')){
       console.log('start 1688 page');
//获取网页数据
        var result={platform_id:xxx}; //天猫平台商品
         //获取父商品
        result.ware_num=new RegExp('/offer/[0-9]+').exec(url)[0].substring(7);
        result.sku_num=null;
        //获取商家编码，与名称
        var divSeller=null;//$('#shopExtra').find('.slogo-shopname');
        result.seller_name=null;//divSeller.text();
        //var divSellerIdString=$('meta[name="microscope-data"]').attr('content');
        result.seller_id=null;// new RegExp('shopId=[0-9]+').exec(divSellerIdString)[0].substring(7);
        //result.seller_id=new RegExp("seller\=[A-Za-z0-9]+").exec(divSeller.attr('href'))[0].substring(7);

        //获取主图
        //var picUrl=
        result.small_pic=$('.detail-gallery-turn-wrapper').first().find('detail-gallery-img').attr('src');;
        result.big_pic=result.small_pic;

        //标题
        result.title=$('.title-first-column').find('.title-text').text();
        //result.title=result.title.substring(1,result.title.length-2).trim();

        //价格
        result.price=$('.step-price-item').last().find('.price-text').text();

        console.log("result:");
        console.log(result);

  }else{ //tmall
       console.log('不支持该页面');

  }

})()

