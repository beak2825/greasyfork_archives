// ==UserScript==
// @name         国际站搜商品显示供应商名称 By 公众号搜索国际站Sky，微信号sky-0945
// @namespace    https://mp.weixin.qq.com/s/DtcPGtbc34bORAsrsf0OvA
// @version      10.0
// @description  解决在国际站上搜索时查看不到供应商的名称问题
// @author       By 公众号搜 国际站Sky
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @match        https://www.alibaba.com/products/*
// @match        https://www.alibaba.com/trade/*
// @match        https://www.alibaba.com/*/trade/*
// @icon         http://wx.qlogo.cn/mmopen/P5BIJwfH4HxRiapnX9AQg7FIh4nqEGmpncvIvdBqFxiaYPUyzq8ibNGoORy5B4kNMicRhicRshBSZAl9yogvJWm2RibenCdFsZZuzD/64
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459366/%E5%9B%BD%E9%99%85%E7%AB%99%E6%90%9C%E5%95%86%E5%93%81%E6%98%BE%E7%A4%BA%E4%BE%9B%E5%BA%94%E5%95%86%E5%90%8D%E7%A7%B0%20By%20%E5%85%AC%E4%BC%97%E5%8F%B7%E6%90%9C%E7%B4%A2%E5%9B%BD%E9%99%85%E7%AB%99Sky%EF%BC%8C%E5%BE%AE%E4%BF%A1%E5%8F%B7sky-0945.user.js
// @updateURL https://update.greasyfork.org/scripts/459366/%E5%9B%BD%E9%99%85%E7%AB%99%E6%90%9C%E5%95%86%E5%93%81%E6%98%BE%E7%A4%BA%E4%BE%9B%E5%BA%94%E5%95%86%E5%90%8D%E7%A7%B0%20By%20%E5%85%AC%E4%BC%97%E5%8F%B7%E6%90%9C%E7%B4%A2%E5%9B%BD%E9%99%85%E7%AB%99Sky%EF%BC%8C%E5%BE%AE%E4%BF%A1%E5%8F%B7sky-0945.meta.js
// ==/UserScript==


setTimeout(function(){
    'use strict';

    var html=document.documentElement.outerHTML;
    console.log("公众号搜索国际站Sky，进运营交流群")
    var json=html.substring(html.indexOf("window.__page__data__config =")+30,html.indexOf("window.__page__data = window.__page__data__config.props")).trim();
    var obj=$.parseJSON(json);
    var list=obj.props.offerResultData.offerList;
    for(var i=0;i<list.length;i++){
       var supplierName = list[i].supplier.supplierName + " 公众号搜 国际站Sky 进交流群";
       var id=  list[i].id;
        $("a[data-bizid=\""+id+"\"]").text(supplierName)
    }

},1200);
