// ==UserScript==
// @name         京东开发票助手
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  京东开发票自动填写公司名税号
// @author       haifennj
// @match        https://myivc.jd.com/fpzz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jd.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454445/%E4%BA%AC%E4%B8%9C%E5%BC%80%E5%8F%91%E7%A5%A8%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/454445/%E4%BA%AC%E4%B8%9C%E5%BC%80%E5%8F%91%E7%A5%A8%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if ($("#buttomDivForAsync")) {
        setTimeout(function(){
            // var aTags = $("#buttomDivForAsync").find("a")
            // if (aTags.length > 0) {
            //     for(var i = 0;i < aTags.length;i++) {
            //         var a = aTags[i]
            //         if ($(a).text() == "申请换开"){
            //             $(a).click();
            //         }
            //     }
            // }
            $("#buttomDivForAsync").find("a[href^='javascript']").trigger("click");
        },1000);
    }

    if ($(".invoice-detail").text().indexOf("已换开")>0) {
        window.location=$(".download-trigger").attr("href")
    }

    if ($("#ivcTitleType")) {
        saveIvcContent(100);
        document.getElementById("ivcTitleType").value=5;
        loadTaxNo();
        document.getElementById("company").value="北京炎黄盈动科技发展有限责任公司";
        document.getElementById("taxNo").value="911101087461112418";
        setTimeout(function(){
            $(".btn-1.mr20").trigger("click");
        },1000);
    }
})();