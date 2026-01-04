// ==UserScript==
// @name         新商盟页面显示优化及隐藏(24.3.8完美版)
// @version      24.3.8
// @description  XSM
// @match        *://*.xinshangmeng.com/*
// @grant        none
// @namespace https://greasyfork.org/users/258372
// @downloadURL https://update.greasyfork.org/scripts/466913/%E6%96%B0%E5%95%86%E7%9B%9F%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96%E5%8F%8A%E9%9A%90%E8%97%8F%282438%E5%AE%8C%E7%BE%8E%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/466913/%E6%96%B0%E5%95%86%E7%9B%9F%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96%E5%8F%8A%E9%9A%90%E8%97%8F%282438%E5%AE%8C%E7%BE%8E%E7%89%88%29.meta.js
// ==/UserScript==


//①登录页面显示优化
//下面的代码只在下面网址(登录页)才运行
if (window.location.href.includes("xinshangmeng.com") && window.location.href.includes("Version=")) {

// 首页图片高度增加50像素
var timer = setInterval(function() {
    var elements11 = document.querySelectorAll('.content');
    for (var y = 0; y < elements11.length; y++) {
        var currentHeight1 = parseInt(window.getComputedStyle(elements11[y]).height);
        elements11[y].style.height = (currentHeight1 + 50) + 'px';
    }

    // 登录框字体调整
    var elements = document.querySelectorAll('#login-form *');
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.fontFamily = '微软雅黑';
        elements[i].style.fontSize = '22px';
        elements[i].style.fontWeight = 'bold';
    }

    // 检查是否完成，如果完成则清除定时器
    if (elements11.length > 0 && elements.length > 0) {
        clearInterval(timer);
    }
}, 100);

}


//②目录订单页+购物车页+历史订单页+通用栏页面优化

//检测到网址包含"xinshangmeng.com/eciop/orderForCC" 才运行下面代码
if (window.location.href.includes("xinshangmeng.com/eciop/order/cgtCoUpdate") || window.location.href.includes("xinshangmeng.com/eciop/orderForCC")) {

    //目录订单"序号"css宽度-30像素
    var numBtn1 = document.querySelector("#num-btn1");
    if (numBtn1) {
        numBtn1.style.width = "70px";
    }

    //目录订单"商品编码"宽度+20像素
    var spbmBtn = document.querySelector("#spbm-btn");``
    if (spbmBtn) {
        spbmBtn.style.width = "110px";
    }

    //目录订单"批发价格"宽度+10像素
    var hotsearch = document.querySelector("#hotsearch > span.rtl-price-slide");
    if (hotsearch) {
        hotsearch.style.width = "90px";
    }


    //所有新商盟目录订单和购物车的"香烟列表区",导航栏及首页字体统一设置为"微软雅黑22号加粗字体"
    var elements1 = document.querySelectorAll('#login-form, .xsm-utable, #qd-header-bottom, .xsm-order-content.pt10, #cbody > div:nth-child(8)');//此元素#cbody存在于已提交订单但未付款时的页面`
    for (var c = 0; c < elements1.length; c++) {
        var children1 = elements1[c].querySelectorAll('*');
        for (var j = 0; j < children1.length; j++) {
            children1[j].style.fontFamily = '微软雅黑';
            children1[j].style.fontSize = '22px';
            children1[j].style.fontWeight = 'bold';
        }
    }

    //购物车隐藏"收藏列"
    var elements2 = document.querySelectorAll('a.addFav');
    for (var k = 0; k < elements2.length; k++) {
        elements2[k].style.display = 'none';
    }

    //新商盟购物车(目录订单内不需要调整)可用量文本数值居中显示
    var elements3 = document.querySelectorAll('[id^="qty_lmt_span_"].num-span');
    for (var l = 0; l < elements3.length; l++) {
        elements3[l].style.textAlign = 'center';
    }

    //购物车内批发价这一列文字颜色改为红色
    var elements4 = document.querySelectorAll('[id^="li_"] > span:nth-child(4)');
    for (var m = 0; m < elements4.length; m++) {
        elements4[m].style.color = 'red';
    }



    //历史订单页面优化调整
    //调整历史订单整体宽度(速度快快快)
    var elements7= document.querySelectorAll('.xsm-order-title.graybg.graybd.pl10.lineh32.f14, .xsm-gboxone.textdg.mt10 ');
    var widths1= [];
    for (var q= 0; q < elements7.length; q++) {
        widths1.push(parseInt(window.getComputedStyle(elements7[q]).width));
    }
    for (var r= 0; r < elements7.length; r++) {
        elements7[r].style.width= (widths1[r] + 190) + 'px';
    }

    //调整历史订单列表每列宽度(速度快快快)
    var elements8= document.querySelectorAll('.otw120.pl5, .otw80.pl5, .otw200.pl5');
    var widths2= [];
    for (var s= 0; s < elements8.length; s++) {
        widths2.push(parseInt(window.getComputedStyle(elements8[s]).width));
    }
    for (var t= 0; t < elements8.length; t++) {
        elements8[t].style.width= (widths2[t] + 27) + 'px';
    }

    //移除目录订单+历史订单的悬浮广告
    setTimeout(function() {
        var elements5 = document.querySelectorAll('#sidebox1, .sidebar-container.sidebar-container');
        for (var n = 0; n < elements5.length; n++) {
            elements5[n].remove();
        }
    }, 500);


    //订单查询-订单查询详情
    var element1 = document.querySelector('#content > div.xsm-order-content.pt10');
    element1.style.width = '990px';
    var children2 = element1.children;
    for (var o = 0; o < children2.length; o++) {
        children2[o].style.width = '100%';
    }

    //订单查询详情文本居中显示
    var elements6 = document.getElementsByClassName("otw80");
    for (var p= 0; p < elements6.length; p++) {
        elements6[p].style.textAlign = "center";
    }


    //当前,本月,上月,历史这一行以及"本次已提交订单"字体统一设置为"微软雅黑18号加粗字体"
    var elements9= document.querySelectorAll('.xsm-order-title.graybg.graybd.pl10.lineh32.f14, #cbody > div:nth-child(8)');
    for (var u= 0; u < elements9.length; u++) {
        var children3= elements9[u].querySelectorAll('*');
        for (var v= 0; v < children3.length; v++) {
            children3[v].style.fontFamily= '微软雅黑';
            children3[v].style.fontSize= '18px';
            children3[v].style.fontWeight= 'bold';
        }
    }

    //目录订单和购物车字体加粗(除商品列表区)
    var elements10= document.querySelectorAll('.orderinfo, .mt10, #sumdiv');
    for (var w= 0; w < elements10.length; w++) {
        elements10[w].style.fontWeight= 'bold';
        elements10[w].style.fontFamily= 'Microsoft YaHei';
        var children4= elements10[w].querySelectorAll('*');
        for (var x= 0; x < children4.length; x++) {
            children4[x].style.fontWeight= 'bold';
            children4[x].style.fontFamily= 'Microsoft YaHei';
        }
    }
}

