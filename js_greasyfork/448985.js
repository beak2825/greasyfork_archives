// ==UserScript==
// @name         优化AliEx-TEM页面显示
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  优化订单详情页显示
// @author       Tony
// @match        https://gsp.aliexpress.com/apps/order/detail*
// @match        https://gsp.aliexpress.com/apps/order/index*
// @match        https://sg-cainiao.aliexpress.com/export*
// @icon         https://ae01.alicdn.com/kf/S8b15587a48b441b08c4e96f60fb946c43.png
// @require      https://greasyfork.org/scripts/443912-trackingandsku/code/trackingAndSKU.js?version=1089492
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448985/%E4%BC%98%E5%8C%96AliEx-TEM%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/448985/%E4%BC%98%E5%8C%96AliEx-TEM%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function(){
    startem();

    function startem(){
        setTimeout(function(){
            'use strict';
            //点击图片，直接打开宝贝详情页
            var imgClass = document.getElementsByClassName("tb-product-info-image");
            for (var imgI = 0; imgI < imgClass.length; imgI++){
                var imgUrl = imgClass[imgI].getElementsByTagName("a")[0].getAttribute("href");
                var productId = imgUrl.slice(-16);
                var newImgUrl = "https://www.aliexpress.com/item/" + productId + ".html";
                imgClass[imgI].getElementsByTagName("a")[0].setAttribute("href",newImgUrl);
            }
            // 获取当前页路径名
            var addPath = window.location.pathname;
            //定义路径中包含的字符，以此判断是哪个页面
            var detailPage = "detail";
            var indexPage = "index";
            var cainiaoPage = "export";
            var qtyOneCSS = 'font-size: 24px;display: inline-block;min-width: 40px;height: 40px;border-radius: 50%;background-color: #999;color: #fff;text-align: center;padding: 2px;';
            var qtyOverOneCSS = 'font-size: 24px;display: inline-block;min-width: 40px;height: 40px;border-radius: 50%;background-color: #23ac38;color: #fff;text-align: center;padding: 2px;';
            //可自定义"height"的值，更改"250px"中的"250"即可，不大于“300”；
            var picSize = 'width: auto; height: 250px; max-height: 300px;';
            var trackingCSS = 'font-size:24px; background-color:#23ac38; color:#ffffff;';
            //订单详情页优化
            if (addPath.indexOf(detailPage) != -1){
                // 高亮显示详情页的数量
                var qty = document.getElementsByClassName("count");
                for(var i = 0; i < qty.length; i++){
                    var s = qty[i].getElementsByTagName("span");
                    if(Number(s[0].innerHTML) > 1){
                        //s[0].classList.add("biggerThan2");
                        s[0].style.cssText = qtyOverOneCSS;
                    }else{
                        s[0].style.cssText = qtyOneCSS;
                    }
                }
                // 放大详情页的产品图片
                var srcValue = document.getElementsByClassName("tb-product-info-image-img");
                for(var k = 0; k<srcValue.length; k++){
                    var newSrc = srcValue[k].src.substring(0,srcValue[k].src.length-10);
                    srcValue[k].src = newSrc;
                    srcValue[k].style.cssText = picSize;
                }
                //突出显示物流单号
                var tracking = document.getElementsByClassName("cell-logistics-tracking");
                tracking[0].style.cssText = trackingCSS;
                for(var tn = 0; tn < tracking.length; tn++){
                    if(tracking[tn+1].innerText != tracking[tn].innerText){
                        tracking[tn+1].style.cssText = trackingCSS;
                    }
                }
            }
            //订单列表页优化
            if (addPath.indexOf(indexPage) != -1){
                // 高亮显示订单列表页的数量
                var quantity = document.getElementsByClassName("quantity");
                for(var j = 0; j < quantity.length; j++){
                    var m = quantity[j].getElementsByTagName("span");
                    if(m[0].innerHTML != "x1"){
                        m[0].style.cssText = qtyOverOneCSS;
                    }else{
                        m[0].style.cssText = qtyOneCSS;
                    }
                }
            }
            //菜鸟物流页
            if (addPath.indexOf(cainiaoPage) != -1){
                //放大显示菜鸟的运费
                var trackingFee = document.getElementsByClassName("note")[0];
                trackingFee.style.cssText = "font-size:24px; ";
                console.log(trackingFee);
            }

        } ,5000)//隔5秒之后执行.
    }
})();
//The End
