// ==UserScript==
// @name         jd
// @namespace    http://web.yuyehk.cn/
// @version      1.5.7
// @description  雨夜工作室实用系列!
// @author       YUYE
// @match        *://s.taobao.com/search*
// @match        *://list.tmall.com/search*
// @match        *://wq.jd.com/*
// @match        *://wqs.jd.com/*
// @match        *://yangkeduo.com/*
// @match        *://haohuo.jinritemai.com/views/product/*
// @match        *://haohuo.jinritemai.com/ecommerce/*
// @match        http*://wq.jd.com*
// @match        http*://tcs.jiyunhudong.com/workprocess/6983936727631020548*
// @match        http*://tcs.jiyunhudong.com/workprocess/*
// @license      MIT
// @icon         http://fk.yuyehk.cn:81/uploads/images/ffaf74f0b5ed1ffc420401645c5d6ecf.png
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/434800/jd.user.js
// @updateURL https://update.greasyfork.org/scripts/434800/jd.meta.js
// ==/UserScript==

(function() {

    var interval2 = window.setInterval(tcsth,100);
    setTimeout(function() {window.clearInterval(interval2);},60000);
    function tcsth() {
        let css = `
        .ivu-col-span-8 { display: block;width: 50%;}`
        GM_addStyle(css)
        var tblocalHostPathName = window.location.href  //当前路径
        if(tblocalHostPathName.indexOf("haohuo.jinritemai.com/views/product/") > -1){
            console.log(tblocalHostPathName.indexOf("fxg_admin_preview"));
            if(tblocalHostPathName.indexOf("fxg_admin_preview") == -1){
                var localHosts = tblocalHostPathName + "&fxg_admin_preview="
                window.location.href = localHosts.replace("detail","item2")
            }
        }
        if(tblocalHostPathName.indexOf("haohuo.jinritemai.com/ecommerce/trade/detail/index.html?alkey=") > -1){
            // 提取id
            var localHostss="https://haohuo.jinritemai.com/views/product/item2?id="+tblocalHostPathName.match(/promotion_id%3D(.*?)%26/)[1]+ "&fxg_admin_preview=110"
            window.location.href = localHostss
        }
        var tbyzs = document.querySelector("#pcprompt-viewpc")
        if(tbyzs != null){
            var ff = document.querySelector("#pcprompt-viewpc")
            console.log(ff);
            ff.click()
        }
    }
})();