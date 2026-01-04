// ==UserScript==
// @name         FUCK 提示跳转外部网站
// @namespace    https://github.com/idcpj
// @version      0.8
// @description  自动关闭烦人的跳转到外部网站的安全提醒
// @author       idcpj
// @match        *zhuanlan.zhihu.com/*
// @match        *www.jianshu.com/go-wild?ac=2&url*
// @match        *link.zhihu.com/?target=*
// @match        *gitee.com/link?target=*
// @match        *link.juejin.cn/?target=*
// @match        *cloud.tencent.com/developer/tools/blog-entry?target=*
// @match        *link.csdn.net/?target=*

// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396821/FUCK%20%E6%8F%90%E7%A4%BA%E8%B7%B3%E8%BD%AC%E5%A4%96%E9%83%A8%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/396821/FUCK%20%E6%8F%90%E7%A4%BA%E8%B7%B3%E8%BD%AC%E5%A4%96%E9%83%A8%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==

(function() {
    'use strict';



    setTimeout(()=>{
     let btns=[
            ".Modal-closeButton", //知乎跳转外部链接
            ".actions .button",
            ".external-link-btn",  //码云跳转外部链接
           ".middle-page .content .btn", //掘金
           ".mod-external-link-btn a", //腾讯云
             ".loading-btn", //csdn

        ];

        btns.map(btn=>{
                document.querySelector(btn)?.click();
        })

        // 使用 xpath


        let btn_xpath=[
            "//div[contains(text(),'继续前往')]" ,//简书
        ];
         btn_xpath.map(btn=>{
              const xpathResult = document.evaluate(btn, document, null, XPathResult.ANY_TYPE, null);
             let node = xpathResult.iterateNext();
             while (node) {
                 node.click()
                 //node = xpathResult.iterateNext();
             }
        })

    },200)



    
})();