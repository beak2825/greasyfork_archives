// ==UserScript==
// @name         caiji-check
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  -------------
// @author       chenzheng
// @match        https://*.1688.com/**
// @match        https://*.aliexpress.com/*
// @match        https://aliexpress.ru/*
// @grant        GM.xmlHttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440808/caiji-check.user.js
// @updateURL https://update.greasyfork.org/scripts/440808/caiji-check.meta.js
// ==/UserScript==

(function(window) {
    'use strict';
    var productCode = "";
    var shopId = "";
    var preURL = "https://adminserver.fashiontiy.com";
    // var preURL = "http://localhost:8081";
    var buttonsDiv = '<div id="caiji_parent" style="position: fixed;z-index:9999;right: 0;top: 5rem;padding: 1rem 0.5rem; width:10rem; max-height:10rem;text-align: center;background-color: rgba(0, 0, 0, .8);">'
        +'<input class="caiji_btn" type = "button" value = "采集检查" onclick="window.checkProductList()"' +
        ' style="color: white;cursor:pointer;padding:0.5rem 1rem;font-size:13px;background: #9c27b0;margin: 0.5rem;border: 0;min-width: 8rem" />'
        +"<br>"
        +'</div>';

    var maskDiv = '<div id="mask_div" style="display:none; position: fixed; z-index:9999;bottom:0;left: 0;top: 0;padding: 1rem 1rem; width:100%; height: 100%; text-align: center;background-color: rgba(0, 0, 0, .2);">'
        +'<p style="margin-top: 200px; width: 100%; font-size: 20px; color: red; font-weight: bold;">请稍等...</p>'
        +'</div>';

    window.getTagHtml = function (isCaiji){
        if (isCaiji){
            return  "<span title='点击可隐藏' style='cursor: pointer;color: white;font-weight: bold;text-align: center;background: red;padding:0 0.2rem;margin-right:0.2rem'>已被采集</span>"
        }else{
            return  "<span title='点击可隐藏' style='cursor: pointer;color: white;font-weight: bold;text-align: center;background: green;padding:0 0.2rem;margin-right:0.2rem'>可采集</span>"
        }
    }

    window.getLoadingHtml = function (){
       return  "<span id='loadinghtml' title='点击可隐藏' style='cursor: pointer;color: white;font-weight: bold;text-align: center;background: darkcyan;padding:0 0.2rem;margin-right:0.2rem'>采集检查中...</span>"
    }

    window.getErrorHtml = function (){
        return  "<span style='color: white;font-weight: bold;text-align: center;background: coral;padding:0 0.2rem;margin-right:0.2rem'>请求失败,刷新尝试</span>"
    }

    var hasChecked = false;

    window.logInfo = function(msg){
        console.log(msg);
    }
    window.showWaiting = function(msg) {
        if(!yIsEmpty(msg)) {
            $("#mask_div p").html(msg);
        }
        $("#mask_div").show();
    }

    window.closeWaiting = function() {
        $("#mask_div p").html("请稍等...");
        $("#mask_div").hide();
    }

    var listParent ;
    window.onload = function() {
        $("body").prepend(maskDiv);
        var href =  window.location.href;
        if (window.is1688()){
            window.onload1688();
        }
        if (window.isAliexpress()){
            window.onloadAliexpress();
        }
    };

    window.is1688 = function (){
        return window.location.href.indexOf("1688.com")!==-1;
    }
    window.isAliexpress = function (){
        return window.location.href.indexOf("aliexpress.com")!==-1;
    }
    window.isAlibaba = function (){
        return window.location.href.indexOf("alibaba.com")!==-1;
    }

    window.onload1688 = function (){
        var href =  window.location.href;
        //详情页
        if (href.indexOf("https://detail.1688.com/offer")!==-1){
            window.checkProduct();
        }
        //搜索页面
        if (href.indexOf("selloffer/offer_search")!==-1){
            $('body').prepend(buttonsDiv);
            listParent = $(".mojar-element-title a");
        }
        //商家页面
        if (href.indexOf("page/offerlist")!==-1){
            $(".m-content").prepend(buttonsDiv);
            listParent = $(".offer-list-row .image a");
        }
    }

    window.onloadAliexpress = function (){
        console.log("onloadAliexpress");
        var href =  window.location.href;
        //详情页
        if (href.indexOf("https://www.aliexpress.com/item/")!==-1){
            window.checkProduct();
        }
        //搜索页面
        if (href.indexOf("aliexpress.com/wholesale")!==-1){
            $('body').prepend(buttonsDiv);
        }
        //商家页面
        if (href.indexOf("store/group/")!==-1){
            $('body').prepend(buttonsDiv);
        }
    }

    window.checkProductList = function (){
        var checkJson = {};
        var products = [];

        if (window.is1688()){
            listParent.each(function(index,val){
                var href = $(this).attr("href");
                if (href.indexOf("detail.1688.com/offer/")!==-1){
                    products.push(href.replace("https://detail.1688.com/offer/",""));
                }
            });
            checkJson.products = products;
            checkJson.site = "1688";
        }
        if (window.isAliexpress()){

            if ($("a._3t7zg._2f4Ho").length>0){
                listParent = $("a._3t7zg._2f4Ho");
            }
            if (window.location.href.indexOf('store/group/')!==-1){
                listParent = $("ul.items-list h3 a[href]");
            }
            listParent.each(function(index,val){
                var href = $(this).attr("href");
                if (href.indexOf("/item/")!==-1){
                    href = href.substring(0,href.indexOf("?"))
                    products.push(href.replace("/item/",""));
                }
            });
            checkJson.products = products;
            checkJson.site = "aliexpress";
        }

        console.log(checkJson);

        // 此处模拟网络请求
        var headers = {'Accept': 'application/json', "Content-Type": "application/x-www-form-urlencoded"};
        var checkURL = preURL + "/adminServer/product/supply/batchCheckExist";
        var msgSuffix = "检查失败";
        showWaiting();
        GM.xmlHttpRequest({
            method: "POST",
            url: checkURL,
            headers: headers,
            responseType: "json",
            data: "json="+encodeURIComponent(JSON.stringify(checkJson)),
            onload: function(xhr) {
                closeWaiting();
                if(xhr.status === 200) {
                    var responseData = JSON.parse(xhr.responseText);
                    if(responseData.success) {
                        console.log(responseData.result);
                        resetProductsUI(responseData.result);
                    }else{
                        alert(responseData.errorMessage+"，"+msgSuffix);
                        logInfo(responseData.errorMessage);
                        console.log(responseData);
                    }
                }else{
                    alert(msgSuffix);
                    logInfo("检查产品：检查异常");
                    console.log(xhr.responseText);
                }
                console.log("submited");
            },
            onerror: function(xhr) {
                closeWaiting();
                alert(msgSuffix);
                logInfo("检查产品：提交数据异常");
                console.log(xhr.responseText);
            }
        });
    },

        window.resetProductsUI  = function(faildProducts){
            if(!hasChecked) {
                if (window.is1688()){
                    listParent.each(function(index,val){
                        var href = $(this).attr("href");
                        if (href.indexOf("detail.1688.com/offer/")!==-1){
                            var isCaiji = (-1 !== faildProducts.indexOf(href));
                            $(this).find(".title").prepend(getTagHtml(isCaiji));
                            $(this).parent().parent().find(".title-link").prepend(getTagHtml(isCaiji));
                        }
                    });
                }
                if (window.isAliexpress()){
                    listParent.each(function(index,val){
                        var href = $(this).attr("href");
                        if (href.indexOf("/item/")!==-1){
                            var isCaiji = (-1 !== faildProducts.indexOf(href));
                            $(this).find("h1").prepend(getTagHtml(isCaiji));
                            $(this).prepend(getTagHtml(isCaiji));

                        }
                    });
                }

            }
            hasChecked = true;
        }


    window.checkProduct = function (){
        var shopInfo ;
        var preUI ;
        if (window.is1688()){
            shopInfo = getShopInfo1688();
            productCode = getProductCode1688();
            preUI = $('.title-text')
        }
        if (window.isAliexpress()){
            shopInfo = getShopInfoAliexpress();
            productCode = getProductCodeAliexpress();
            preUI = $('.product-title')
        }
        preUI.prepend(window.getLoadingHtml());
        preUI.click(function(){
            preUI.remove();
        });
        shopId = shopInfo.shopId;
        console.log("productCode:"+productCode+"  shopId="+shopId);


        var checkURL = preURL + "/adminServer/product/supply/checkExist?source=1&code="+productCode+"&shopId="+shopId;
        var headers = {'User-Agent': 'Mozilla/4.0 (compatible) Greasemonkey', 'Accept': 'application/json'};
        GM.xmlHttpRequest({
            method: "GET",
            url: checkURL,
            headers: headers,
            responseType: "json",
            onload: function(xhr) {
                var infoH2;
                if (window.is1688()){
                    infoH2 =  $('.title-text');
                }
                if (window.isAliexpress()){
                    infoH2 =  $('.product-title');
                }
                $('#loadinghtml').remove();
                if(xhr.status === 200) {
                    var responseData = JSON.parse(xhr.responseText);
                    if(responseData.success) {
                        var hasCaiji = responseData.result.isExist; //产品是否已被采集过
                        var hasBanned = responseData.result.shopHasBanned; //商家是否已被屏蔽
                        console.log("hasCaiji:"+hasCaiji+" hasBanned:"+hasBanned)
                        if (hasBanned || hasCaiji){
                            infoH2.prepend(getTagHtml(true));
                        }else{
                            infoH2.prepend(getTagHtml(false));
                        }
                    }else{
                        console.log(xhr.responseText);
                    }
                }else{
                    console.log(xhr.responseText);
                    infoH2.prepend(getErrorHtml());
                }
            },
            onerror: function(xhr) {
                console.log(xhr.responseText);
            }
        });
    }




    window.getProductCode1688 = function (){
        var url = window.location.href;
        var start = url.lastIndexOf("/");
        var end = url.indexOf(".html");
        return url.substr(start+1,end-start-1);
    }

    window.getProductCodeAliexpress = function (){
        var url = window.location.href;
        url = url.substring(0,url.indexOf('.html')).replace("https://www.aliexpress.com/item/","")
        return url;
    }

    //店铺 URL
    window.getShopInfo1688 = function (){
        var shopId = "";
        $("a[target='_blank'][href*='1688.com'][href] ").each(
            function (item, index) {
                let href =  $(this).attr('href');
                if (href.indexOf("https://")>=0 && href.indexOf('detail.1688.com')===-1 && href.indexOf('1688.com/page/')>=0){
                    var temp = href.replace("https://","");
                    shopId = temp.substring(0,temp.indexOf('.1688.com'))
                    return false;
                }
            }
        );

        var shopName = $("#38229149").next("div").find('span[title]').text();
        if (yIsEmpty(shopId)){
            //code for https://detail.1688.com/offer/523804289132.html
            var shopURL =  $('.cht-pc-header .topApp .logoTwo .logoSub a').text();
            shopId = shopURL.substring(0,shopURL.indexOf('.1688.com'))
            shopName = $('.cht-pc-header .topApp .logoTwo .logoName a').text();
        }
        //超级工厂 https://detail.1688.com/offer/573406095476.html
        if ($('.store-factory-text').length>0){
            var url = $('.store-factory').attr('href');
            shopId = url.substring(url.indexOf('&facMemId='),url.indexOf('&__recSource__=')).replace("&facMemId=","");
            console.log("超级工厂 shopId: "+shopId);
            shopName = $('.od-pc-jgdz-store .store-name').text();
        }

        //厂货通
        if ($('.logo-sub a').text() ==='cht.1688.com'){
            shopId = "cht";
            shopName = "厂货通";
            console.log("厂货通 shopName: "+shopName);

        }

        if (yIsEmpty(shopId)){
            alert("getShopInfo1688店铺信息获取失败,请联系技术同事, 此款产品不可提交");
        }

        return {
            shopName:shopName,
            shopUrl:"https://"+shopId+".1688.com",
            shopId:shopId,
            years:"",
            location:"",
            sellerName:"",
            sellerChat:"",
            sellScore:"",
        }

    }

    window.getShopInfoAliexpress = function (){
        var shopUrl = $('.store-info-top .shop-name a').attr('href');
        var shopId = shopUrl.replace("//www.aliexpress.com/store/","");
        var shopName = $('.store-info .shop-name a').text().trim();
        console.log("shopId="+shopId+"   shopName="+shopName);
        if (yIsEmpty(shopId)){
            alert("getShopInfoAliexpress店铺信息获取失败,请联系技术同事, 此款产品不可提交");
        }
        return {
            shopName:shopName,
            shopUrl:"https:"+shopUrl,
            shopId:shopId,
            years:"",
            location:"",
            sellerName:"",
            sellerChat:"",
            sellScore:"",
        }
    }

    window.yIsEmpty = function(str) {
        if(str == null) {
            return true;
        }
        if(str.trim() === "") {
            return true;
        }
        return false;
    }

})(window.unsafeWindow);
