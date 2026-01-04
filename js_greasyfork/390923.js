// ==UserScript==
// @icon             https://www.thfou.com/img/favicon.png
// @name             阿里巴巴详情页增强辅助
// @namespace        https://www.thfou.com/
// @version          2.4.2
// @description      自动获取阿里巴巴商品信息并展示在详情页顶部
// @author           头号否
// @match            *://detail.1688.com/offer/*
// @supportURL       https://www.thfou.com/liuyan
// @compatible	     Chrome
// @license          GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/390923/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E8%AF%A6%E6%83%85%E9%A1%B5%E5%A2%9E%E5%BC%BA%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/390923/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E8%AF%A6%E6%83%85%E9%A1%B5%E5%A2%9E%E5%BC%BA%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var host = "https://daima.thfou.com/";
    var site = document.domain;
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = ".thfou-1688-ctn{width: 100%; margin-top: 10px; margin-bottom: 5px; background-color: rgb(242, 242, 242); display: block; position: relative; border-radius: 8px;}.thfou-1688-ctn .thfou-content-ctn{padding-left: 0px; height: 50px; padding: 0px 5px;}.thfou-1688-ctn .thfou-logo-box{width: 126px; height: 50px; float: left;}.thfou-1688-ctn .thfou-logo-img{width: 88px; margin: 12px 3px;}.thfou-1688-ctn .thfou-content-ctn .item{width: auto; height: 46px; float: left; margin: 2px 5px 0px 15px;}.thfou-content-ctn .item p {display: inline-block; width: auto; height: 46px; line-height: 46px;}.thfou-content-ctn .item > span {display: inline-block; width: auto; height: 46px; line-height: 46px; color: rgb(255, 42, 0);}.thfou-1688-ctn .thfou-content-ctn .btn {position: relative; height: 26px; margin: 13px 15px 10px 0; padding: 0 5px; line-height: 26px; background: #ff3c00; color: #f2f2f2; border-radius: 2px; cursor: pointer; float: right;}";
    document.getElementsByTagName('HEAD').item(0).appendChild(style);

    $.ajax({
        url: host + "js/layui/layui.js",
        type: "GET",
        scriptCharset: "utf-8",
        async: false,
        dataType: "script"
    });

    setTimeout(function() {
        $.ajax({
            url: host + "js/layuiClick.js",
            type: "GET",
            scriptCharset: "utf-8",
            async: false,
            dataType: "script"
        });
    }, 30);

    //数据初始化
    var wxData = $('#initwx input').length;
    var wxContent = $('.thfou-content-ctn').eq(1).length;
    var cht = $('.cht-pc-header').length;

    var pdinput = $('#initwx input').length;
    var initWx = '<input type="hidden" data-tradedata-area-index="2" data-tradedata-1st-name="近30天采购" data-tradedata-1st-value data-tradedata-1st-unit="人" data-tradedata-2nd-name="人均件数" data-tradedata-2nd-value data-tradedata-2nd-unit="' + iDetailConfig.unit + '">';
    if (pdinput === 3) {
        $('#initwx input').eq(0).after(initWx);
    }
    //插入框架
    var thfouctn = '<div class="thfou-1688-ctn"></div>';
    $('#mod-detail-hd').prepend(thfouctn);
    var thfcon = '<div class="thfou-content-ctn"><div class="thfou-logo-box" style="margin-left:10px;margin-right:-20px;"><a href="https://www.thfou.com" target="_blank" style="display:inline-block"><img class="thfou-logo-img" src="https://www.thfou.com/img/headnewlogo.svg"></a></div></div>';
    $('.thfou-1688-ctn').prepend(thfcon);
    /*
    var aliwxInfo = '<div class="thfou-content-ctn"></div>';
    $('.thfou-1688-ctn').append(aliwxInfo);
    */
    //获取产品类目
    var fgf = " >> ";
    var categoryLists1 = iDetailData.registeredData.categoryList[0].name;
    var categoryLists2 = iDetailData.registeredData.categoryList[1].name;
    var categoryLists3 = iDetailData.registeredData.categoryName;
    var categoryList = document.createElement('div'); // 新增元素
    categoryList.className = 'item';
    categoryList.id = 'wp-categorylist';
    var lma = '<p>类目：</p><span title="' + categoryLists1 + fgf + categoryLists2 + fgf + categoryLists3 + '">';
    var lmb = '</span>';
    categoryList.innerHTML = lma + categoryLists3 + lmb;
    $('.thfou-content-ctn')[0].append(categoryList);
    //获取产品总销量
    var modconfig = document.getElementById('mod-detail-comment');
    var total = modconfig.getAttribute('data-mod-config');
    var arr = total.split(",");
    var Obj = arr[4];
    var cj = Obj.split(':');
    var zcj = cj[1].replace(/"/g, "");
    var zcjsl = document.createElement('div'); // 新增元素
    zcjsl.className = 'item';
    zcjsl.id = 'cp-total';
    var zcja = '<p>累计成交：</p><span>';
    var zcjb = '</span>';
    var zcjc = '<p>' + '&nbsp;' + iDetailConfig.unit + '</p>';
    zcjsl.innerHTML = zcja + zcj + zcjb + zcjc;
    $('.thfou-content-ctn')[0].append(zcjsl);
    //获取卖家旺旺号
    var getloginid = document.createElement('div'); // 新增元素
    getloginid.className = 'item';
    getloginid.id = 'wp-loginid';
    var loginId = iDetailData.registeredData.sellerInf['loginId'];
    var urla = '<p>卖家旺旺号：</p><span>';
    var urlb = '</span>';
    getloginid.innerHTML = urla + loginId + urlb;
    $('.thfou-content-ctn')[0].append(getloginid);
    if (cht < 1) {
        var dpDomainUrl = $('.logo a')[0].href;
        //按成交额
        var cjebtn = document.createElement('div'); // 新增元素
        cjebtn.className = 'btn';
        cjebtn.id = 'wp-cje';
        cjebtn.innerText = '按成交额';
        $('.thfou-content-ctn')[0].append(cjebtn);
        document.getElementById('wp-cje').innerHTML = cjebtn.innerHTML;
        $('#wp-cje').click(function() {
            var wpCjeOp = window.open("_blank");
            wpCjeOp.location = dpDomainUrl + 'page/offerlist.htm?spm=a261y.7663282.autotrace-topNav.3.195028fckDpSoJ&showType=windows&tradenumFilter=false&sampleFilter=false&sellerRecommendFilter=false&videoFilter=false&mixFilter=false&privateFilter=false&mobileOfferFilter=%24mobileOfferFilter&groupFilter=false&sortType=tradenumdown#search-bar';
        });
        //按价格
        var jgbtn = document.createElement('div'); // 新增元素
        jgbtn.className = 'btn';
        jgbtn.id = 'wp-jg';
        jgbtn.innerText = '按价格';
        $('.thfou-content-ctn')[0].append(jgbtn);
        document.getElementById('wp-jg').innerHTML = jgbtn.innerHTML;
        $('#wp-jg').click(function() {
            var wpJgOp = window.open("_blank");
            wpJgOp.location = dpDomainUrl + 'page/offerlist.htm?spm=a2615.7691456.newlist.4.3e61473bM1hayM&tradenumFilter=false&sampleFilter=false&sellerRecommendFilter=false&videoFilter=false&mixFilter=false&privateFilter=false&mobileOfferFilter=%24mobileOfferFilter&groupFilter=false&sortType=priceup#search-bar';
        });
        //按时间
        var timebtn = document.createElement('div'); // 新增元素
        timebtn.className = 'btn';
        timebtn.id = 'wp-time';
        timebtn.innerText = '按时间';
        $('.thfou-content-ctn')[0].append(timebtn);
        document.getElementById('wp-time').innerHTML = timebtn.innerHTML;
        $('#wp-time').click(function() {
            var wpTimeOp = window.open("_blank");
            wpTimeOp.location = dpDomainUrl + 'page/offerlist.htm?spm=a2615.7691456.newlist.5.5453473bV5BzTW&tradenumFilter=false&sampleFilter=false&sellerRecommendFilter=false&videoFilter=false&mixFilter=false&privateFilter=false&mobileOfferFilter=%24mobileOfferFilter&groupFilter=false&sortType=timedown#search-bar';
        });
    }
    //查看无线端
    var ckwxbtn = document.createElement('div'); // 新增元素
    ckwxbtn.className = 'btn';
    ckwxbtn.id = 'ckwx';
    ckwxbtn.innerText = '查看无线端';
    $('.thfou-content-ctn').eq(0).append(ckwxbtn);
    document.getElementById('ckwx').innerHTML = ckwxbtn.innerHTML;
})();