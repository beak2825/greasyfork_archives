// ==UserScript==
// @name         虾皮商城--商品列表小图转大图
// @namespace    https://zhaojiafu.blog.csdn.net/
// @version      0.41
// @description  虾皮商城--
// @author       zhaojiafu
// @match        https://shopee.tw/*
// @grant        none
// @run-at       document-end
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441211/%E8%99%BE%E7%9A%AE%E5%95%86%E5%9F%8E--%E5%95%86%E5%93%81%E5%88%97%E8%A1%A8%E5%B0%8F%E5%9B%BE%E8%BD%AC%E5%A4%A7%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/441211/%E8%99%BE%E7%9A%AE%E5%95%86%E5%9F%8E--%E5%95%86%E5%93%81%E5%88%97%E8%A1%A8%E5%B0%8F%E5%9B%BE%E8%BD%AC%E5%A4%A7%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    // console.log("油猴脚本--虾皮商城--商品列表小图转大图")
    // 检测函数
    function check_img_items(){
        //debugger;
        //var img_list = $x('//img[contains(@class,"_2GchKS")]');
        var img_list = document.evaluate(
            '//img[contains(@class,"_2GchKS")]',
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null);
        var img_list_len = img_list.snapshotLength;
        //console.log("img_list_len",img_list_len);
        for (var i = 0; i < img_list.snapshotLength; i++) {
            let item = img_list.snapshotItem(i);
            // do something with thisDiv
            let src = item.src
            if (src.lastIndexOf('_tn') != -1) {
                item.src = src.replace("_tn","");
                //console.log("src_new",item.src);

            }
            //debugger;
        }
    };
    // 定时器
    setInterval(check_img_items,5000);
})();