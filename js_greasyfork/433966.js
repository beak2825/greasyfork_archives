// ==UserScript==
// @name         m.jd.com查排名删除广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  查看排名和sku用的
// @author       qq806350554
// @match     https://so.m.jd.com/ware/search.action?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433966/mjdcom%E6%9F%A5%E6%8E%92%E5%90%8D%E5%88%A0%E9%99%A4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/433966/mjdcom%E6%9F%A5%E6%8E%92%E5%90%8D%E5%88%A0%E9%99%A4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...




    //$(".m_cc_header_inner").append(`<div id='cha'  style='position: fixed; right: 50px; top: 191px;background-color: red;'>查询排名</div>`)  //添加按钮
    //$("#id-pcprompt-mask").remove()//移出广告节点,失效

    function dianji(){// 定时器内方法
        $("#pcprompt-viewpc").click()//去掉 刚开始的黑屏二维码
        $(".shan").remove()
        $(".search_prolist_ad").parent().parent().parent().parent().remove()//移出广告节点

        for (var i=0;i<$(".search_prolist_item").length;i++){
            let sku= $('.search_prolist_item_inner').eq(i).attr('id').substr(5,)
            $(".search_prolist_item").eq(i).prepend(`<h1 class='shan'>`+'第  '+(i+1)+'名，  '+'sku是   '+sku+`</h1>`)
        }
        i=0

    }

    setInterval(dianji,1000)

})();