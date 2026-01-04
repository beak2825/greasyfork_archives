// ==UserScript==
// @name         缺货-短链接转换
// @namespace    http://web.yuyehk.cn/
// @version      1.5.6
// @description  雨夜工作室实用系列!
// @author       YUYE
// @match        *://s.taobao.com/search*
// @match        *://list.tmall.com/search*
// @match        *://wq.jd.com/*
// @match        *://wqs.jd.com/*
// @match        *://yangkeduo.com/*
// @match        *://haohuo.jinritemai.com/ecommerce/*
// @match        http*://wq.jd.com*
// @match        http*://tcs.jiyunhudong.com/workprocess/6983936727631020548*
// @match        http*://tcs.jiyunhudong.com/workprocess/*
// @license      MIT
// @icon         http://fk.yuyehk.cn:81/uploads/images/ffaf74f0b5ed1ffc420401645c5d6ecf.png
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/459705/%E7%BC%BA%E8%B4%A7-%E7%9F%AD%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/459705/%E7%BC%BA%E8%B4%A7-%E7%9F%AD%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==
 
(function() {
 
    var interval2 = window.setInterval(tcsth,100);
    setTimeout(function() {window.clearInterval(interval2);},60000);
    function tcsth() {
        let css = `
        .ivu-col-span-8 { display: block;width: 50%;}`
        GM_addStyle(css)
        var tblocalHostPathName = window.location.href  //当前路径
        if(tblocalHostPathName.indexOf("haohuo.jinritemai.com/ecommerce/trade/detail/index.html?alkey=") > -1){
            // 提取id
            var localHostss="https://haohuo.jinritemai.com/views/product/item2?id="+tblocalHostPathName.match(/promotion_id%3D(.*?)%26/)[1]
            window.location.href = localHostss
        }
    }
})();