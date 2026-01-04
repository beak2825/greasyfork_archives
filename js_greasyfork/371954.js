// ==UserScript==
// @name 查看历史价格
// @namespace win.somereason.web.utils
// @version 2019.08.02.1
// @description 这个脚本帮助你跳转到"慢慢买"网站查看历史价格.它会在商品名称后显示[历史价格]按钮,点击后打开"慢慢买"网站,并自动输入要查询的商品页url.目前支持京东,淘宝,天猫,亚马逊,当当,苏宁,网易严选,网易考拉.还支持一键打开"什么值得买"网站.查询这个商品的评价和促销信息.(测试中),目前仅支持京东.
// @author somereason
// @license MIT
// @date 2018-09-06
// @match *://item.jd.com/*.html*
// @match *://item.taobao.com/item.htm*
// @match *://detail.tmall.com/item.htm*
// @match *://www.amazon.cn/dp/*
// @match *://product.dangdang.com/*.html*
// @match *://product.suning.com/*/*.html*
// @match *://item.yhd.com/*.html*
// @match *://you.163.com/item/detail*
// @match *://goods.kaola.com/product/*.html*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/371954/%E6%9F%A5%E7%9C%8B%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/371954/%E6%9F%A5%E7%9C%8B%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC.meta.js
// ==/UserScript==
// 

(function () {
    var titleElement = null;
    var productTitle = null;
    if (window.location.href.indexOf("jd.com") > -1) {
        titleElement = document.querySelector(".sku-name");
        productTitle = document.querySelector(".parameter2.p-parameter-list li").title;
    } else if (window.location.href.indexOf("taobao.com") > -1) {
        titleElement = document.querySelector(".tb-main-title");
    } else if (window.location.href.indexOf("tmall.com") > -1) {
        titleElement = document.querySelector(".tb-detail-hd");
    } else if (window.location.href.indexOf("amazon.cn") > -1) {
        titleElement = document.querySelector("#productTitle");
    } else if (window.location.href.indexOf("dangdang.com") > -1) {
        titleElement = document.querySelector(".name_info");
    } else if (window.location.href.indexOf("suning.com") > -1) {
        titleElement = document.querySelector(".proinfo-title");
    } else if (window.location.href.indexOf("yhd.com") > -1) {
        titleElement = document.querySelector("#detail_sku_main");
    } else if (window.location.href.indexOf("you.163.com") > -1) {
        //由于网易严选用的是react,页面初始化的时候元素没有渲染,找不到.所以设置延时1秒,然后在找到 title并添加按钮.
        setTimeout(function () {
            setManManBuyButton(document.querySelector(".intro .name"));
        }, 1000);
    } else if (window.location.href.indexOf("goods.kaola.com") > -1) {
        //网易家的都是后渲染的?延时1秒,简单粗暴,解决问题.
        setTimeout(function () {
            setManManBuyButton(document.querySelector(".product-title"));
        }, 1000);
    }
    function openSiteManManBuy() {
        window.open("http://tool.manmanbuy.com/historyLowest.aspx?url=" + encodeURIComponent(window.location.href) + "");
    }
    if (titleElement !== null) {
        setManManBuyButton(titleElement);
    }
    function setManManBuyButton(titleElementsss) {
        let buttonElement= document.createElement('button');
        buttonElement.id = 'openHistoryPricePagesss';
        buttonElement.innerText = '历史价格';
        titleElementsss.appendChild(buttonElement);
        document.getElementById("openHistoryPricePagesss").style.cssText = "width: 90px;height: 32px;background:linear-gradient(#00b79e, #002bffcc);border: 1px solid white;cursor: pointer;color: white;";
        document.getElementById("openHistoryPricePagesss").onclick = openSiteManManBuy;
    }

    //=================================================
    console.log(productTitle);
    function openSite3DM() {
        window.open("https://search.smzdm.com/?s="+encodeURIComponent(productTitle) +"&v=b");
    }
    if (productTitle !== null && titleElement !== null) {
        set3DMButton();
    }
    function set3DMButton() {
        let buttonElement= document.createElement('button');
        buttonElement.id = 'btnOpen3DMpage';
        buttonElement.innerText = '什么值得买';
        titleElement.appendChild(buttonElement);
        document.getElementById("btnOpen3DMpage").style.cssText = "width: 100px;height: 32px;background:linear-gradient(#00b79e, #281256);border: 1px solid white;cursor: pointer;color: white;";
        document.getElementById("btnOpen3DMpage").onclick = openSite3DM;
    }

})();
