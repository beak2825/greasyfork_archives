// ==UserScript==
// @name         唯品会商品列表小图转大图
// @namespace    https://zhaojiafu.blog.csdn.net/
// @version      0.53
// @description  自动将唯品会商品列表小图地址转大图地址
// @author       zhaojiafu
// @match        https://category.vip.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441126/%E5%94%AF%E5%93%81%E4%BC%9A%E5%95%86%E5%93%81%E5%88%97%E8%A1%A8%E5%B0%8F%E5%9B%BE%E8%BD%AC%E5%A4%A7%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/441126/%E5%94%AF%E5%93%81%E4%BC%9A%E5%95%86%E5%93%81%E5%88%97%E8%A1%A8%E5%B0%8F%E5%9B%BE%E8%BD%AC%E5%A4%A7%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    // console.log("油猴脚本--唯品会商品列表小图转大图")
    // 检测函数
    function check_img_items(){
        //debugger;
        var img_list = $(".J-goods-item__img");
        var img_list_len = img_list.length;
        //console.log("img_list_len",img_list_len);
        img_list.map(function(index,item){
            let src = item.src;
            var src_match=src.match(/_\d+x\d+_\d+/g);
            if (src_match) {
                var new_str= src.replace(/_\d+x\d+_\d+/g, "");
                item.src = new_str;
            }
            //debugger;
            return item;

        });
    };
    // 定时器
    setInterval(check_img_items,5000);
})();