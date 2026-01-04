
// ==UserScript==
// @name         京东双11自动做红包任务 【全民养红包】 京东双十一最新脚本京东全品类优惠券  京东内部优惠券 优惠30%以上  京东双十一最新脚本  2019.10.23
// @namespace    https://www.49zhe.com/
// @version      6.42
// @description  新增最新京东全自动【全民养红包】，查询商家设置的隐藏优惠券，上万款内部优惠券等你免费领取、让您享受更多优惠!
// @author       Taobao
// @include      http*://item.jd.com/* 
// @include      http*://happy.m.jd.com/*
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40167/%E4%BA%AC%E4%B8%9C%E5%8F%8C11%E8%87%AA%E5%8A%A8%E5%81%9A%E7%BA%A2%E5%8C%85%E4%BB%BB%E5%8A%A1%20%E3%80%90%E5%85%A8%E6%B0%91%E5%85%BB%E7%BA%A2%E5%8C%85%E3%80%91%20%E4%BA%AC%E4%B8%9C%E5%8F%8C%E5%8D%81%E4%B8%80%E6%9C%80%E6%96%B0%E8%84%9A%E6%9C%AC%E4%BA%AC%E4%B8%9C%E5%85%A8%E5%93%81%E7%B1%BB%E4%BC%98%E6%83%A0%E5%88%B8%20%20%E4%BA%AC%E4%B8%9C%E5%86%85%E9%83%A8%E4%BC%98%E6%83%A0%E5%88%B8%20%E4%BC%98%E6%83%A030%25%E4%BB%A5%E4%B8%8A%20%20%E4%BA%AC%E4%B8%9C%E5%8F%8C%E5%8D%81%E4%B8%80%E6%9C%80%E6%96%B0%E8%84%9A%E6%9C%AC%20%2020191023.user.js
// @updateURL https://update.greasyfork.org/scripts/40167/%E4%BA%AC%E4%B8%9C%E5%8F%8C11%E8%87%AA%E5%8A%A8%E5%81%9A%E7%BA%A2%E5%8C%85%E4%BB%BB%E5%8A%A1%20%E3%80%90%E5%85%A8%E6%B0%91%E5%85%BB%E7%BA%A2%E5%8C%85%E3%80%91%20%E4%BA%AC%E4%B8%9C%E5%8F%8C%E5%8D%81%E4%B8%80%E6%9C%80%E6%96%B0%E8%84%9A%E6%9C%AC%E4%BA%AC%E4%B8%9C%E5%85%A8%E5%93%81%E7%B1%BB%E4%BC%98%E6%83%A0%E5%88%B8%20%20%E4%BA%AC%E4%B8%9C%E5%86%85%E9%83%A8%E4%BC%98%E6%83%A0%E5%88%B8%20%E4%BC%98%E6%83%A030%25%E4%BB%A5%E4%B8%8A%20%20%E4%BA%AC%E4%B8%9C%E5%8F%8C%E5%8D%81%E4%B8%80%E6%9C%80%E6%96%B0%E8%84%9A%E6%9C%AC%20%2020191023.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
        var url = window.location.host;
        var href = window.location.href;
        var name = '';
        var html = '';
         
         if (url.indexOf('jd.com') > 0) {
            var name = $.trim($('.sku-name').text());
            var html = '<a href="http://youhui.49zhe.com/?ah=total&kw='+ encodeURI(name) +'" target="_blank"  class="btn-special1 btn-lg">领取优惠券</a>';            
                html =html + '<a href="https://happy.m.jd.com/babelDiy/GZWVJFLMXBQVEBDQZWMY/XJf8bH6oXDWSgS91daDJzXh9bU7/index.html" target="_blank"  class="btn-special1 btn-lg">双11自动做任务</a>';
            $('#choose-btns').append(html);
        }

        if (href.indexOf('happy.m.jd.com/babelDiy/GZWVJFLMXBQVEBDQZWMY/XJf8bH6oXDWSgS91daDJzXh9bU7') >= 0) { 
            $('<div id="message" style="font-size:24px;color:white;padding-top:10px">任务开始......</div>').insertAfter(".logo");
            var message = '使用方法：\r\n';
            message = message + '1、首先在手机端京东APP内开启活动\r\n';
            message = message + '2、点击下方的确定按钮';
            alert(message);
            start();
        }
    });
 

    let productList = [],
        shopList = [],
        apiurl = "https://api.m.jd.com/client.action";
    function autoPost(id, type) {
        fetch(`${apiurl}?timestamp=${ new Date().getTime()}`, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type":"application/x-www-form-urlencoded"
            },
            body: `functionId=raisepacket_collectScore&body={
            "type": ${type},
            "ext": "${id}",
            "appsign":1,
            "msgsign":2}&client=wh5`
        }).then(function (response) {
            return response.json()
        }).then(function (res) {
            console.log(res.data.biz_msg)
        })
    }
    function start() {
        fetch(`${apiurl}?${new Date().getTime()}`, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type":"application/x-www-form-urlencoded"
            },
            body: 'functionId=raisepacket_getShopAndProductList&body=&client=wh5'
        }).then(function (response) {
            return response.json()
        }).then(function (res) {
            productList = res.data.result.productList;
            shopList = res.data.result.shopList;
            console.log(`获取到任务, 商品：${productList.length}商品：${shopList.length}`);
            autoProductTask()
        })
    }
    function autoProductTask() {
        for (let i = 0, leng = productList.length; i < leng; i++) {
            (function (index) {
                setTimeout(() => {
                    let item = productList[index];
                    autoPost(item['id'], 4);                     
                    $("#message").html(`商品总任务数：${leng} 当前任务数：${index + 1}`);       
                    if (leng - 1 == index) {
                        autoShopTask()
                    }
                },
                    index * 1500)
            })(i)
        }
    }
    function autoShopTask() {
        for (let i = 0, leng = shopList.length; i < leng; i++) {
            (function (index) {
                setTimeout(() => {
                    let item = shopList[index];
                    autoPost(item['id'], 2);
                    $("#message").html(`商铺总任务数：${leng} 当前任务数：${index + 1}`);  
                    if (leng - 1 == index) {
                        autoPlay()
                    }
                },
                    index * 1500)
            })(i)
        }
    }
    function autoPlay() {
        for (let i = 0, leng = 4; i < leng; i++) {
            (function (index) {
                setTimeout(() => {
                    autoPost(0, 5);
                    $("#message").html(`好玩互动：${leng} 当前任务数：${index + 1}`);  
                    if (leng - 1 == index) {
                        autoInteract()
                    }
                },
                    index * 1000)
            })(i)
        }
    }
    function autoInteract() {
        for (let i = 0, leng = 4; i < leng; i++) {
            (function (index) {
                setTimeout(() => {
                    autoPost(0, 10);
                    $("#message").html(`视频直播：${leng} 当前任务数：${index + 1}`); 
                   
                    if (leng - 1 == index) {
                        autoShopping()
                    }
                },
                    index * 1000)
            })(i)
        }
    }
    function autoShopping() {
        for (let i = 0, leng = 3; i < leng; i++) {
            (function (index) {
                setTimeout(() => {
                    autoPost(0, 3);
                    if (leng - 1 == index) {
                        alert('任务全部做完了！快去手机端升级红包吧！')
                        $("#message").html(`任务全部做完了！快去手机端升级红包吧`);  
                    }
                },
                    index * 1000)
            })(i)
        }
    }
})();