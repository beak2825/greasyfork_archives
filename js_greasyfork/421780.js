// ==UserScript==
// @name         书易借 - 库存检查
// @namespace    https://book.interlib.cn
// @version      2021.02.18
// @description  深圳龙岗图书馆开通了图书直借服务，但图书列表不能直观显示库存情况，此脚本仅为解决这个问题。
// @author       Eric.Yang
// @match        https://book.interlib.cn/tcshop/*/catalog/*
// @grant        none
// @require  https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/421780/%E4%B9%A6%E6%98%93%E5%80%9F%20-%20%E5%BA%93%E5%AD%98%E6%A3%80%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/421780/%E4%B9%A6%E6%98%93%E5%80%9F%20-%20%E5%BA%93%E5%AD%98%E6%A3%80%E6%9F%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

   $(".bookList > li").each(function(){
       var $li = $(this);
       var $title = $(this).find(".titles");
       var address = $(this).find("a").attr("href");//tcshop/1342/product/714651.html
       var m = address.match(/\/tcshop\/(\d+)\/product\/(\d+)\.html/);

       $.ajax({url:address,async:true,success:function(data){
           var jdSkuId = data.match(/jdSkuId="(\d+)"/)[1];
           var jdcatalog2 = data.match(/jdcatalog2="(\d+)"/)[1];
           var jdcatalog3 = data.match(/jdcatalog3="(\d+)"/)[1];
           var checkStockUrl = "/tcshop/"+m[1]+"/product/getStockFromJd?provinceCode=&cityCode=&areaCode=&seller=jd&skuId="+jdSkuId+"&jdcatalog2="+jdcatalog2+"&jdcatalog3="+jdcatalog3+"&productId="+m[2];

           $.ajax({url:checkStockUrl,async:true,dataType:"json",success:function(result){
                if(result && result.stockStateId == 33){
                    $title.text("[有货]"+$title.text());
                    $title.attr("style","color:#F00");
                }else{
                    $li.remove();
                }
           }});

       }});

    });

})();