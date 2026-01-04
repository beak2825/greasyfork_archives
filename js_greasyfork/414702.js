// ==UserScript==
// @name         大淘客-创建淘礼金
// @namespace    https://greasyfork.org/zh-CN/users/177458-bd777
// @version      0.2.1
// @description  简单填写一些字段
// @author       windeng
// @match        http://www.dataoke.com/pmc/tlj-create.html
// @match        https://www.dataoke.com/pmc/tlj-create.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414702/%E5%A4%A7%E6%B7%98%E5%AE%A2-%E5%88%9B%E5%BB%BA%E6%B7%98%E7%A4%BC%E9%87%91.user.js
// @updateURL https://update.greasyfork.org/scripts/414702/%E5%A4%A7%E6%B7%98%E5%AE%A2-%E5%88%9B%E5%BB%BA%E6%B7%98%E7%A4%BC%E9%87%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    Date.prototype.format = function(fmt) {
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    }

    function fill() {
        var now = new Date()
        $("input[name='name']")[0].value = `${now.format("MMdd淘礼金")}`
        $("input[name='num_limit']")[0].value = 1
        $("input[name='send_start_time']")[0].value = now.format("yyyy-MM-dd hh:mm:ss")
        $("input[name='send_end_time']")[0].value = new Date(new Date(now.format("yyyy-MM-dd")).getTime() + 86400000*1-8*3600000-1000).format("yyyy-MM-dd hh:mm:ss")
        $("input[name='use_start_time']")[0].value = now.format("yyyy-MM-dd")
        $("input[name='use_end_time']")[0].value = new Date(new Date(now.format("yyyy-MM-dd")).getTime() + 86400000*0-8*3600000).format("yyyy-MM-dd")
    }

    fill()

    $("input[name='item_url']")[0].onblur = function(e) {
        $.get(`https://dtkapi.ffquan.cn/go_getway/proxy/search?platform=1&page=1&sortType=4&kw=${this.value}`, (data, status) => {
            if (data.data.search.list.length > 0) {
                var product = data.data.search.list[0]
                console.log(product)
                var a = document.getElementById("jump-dtk-product-page") || document.createElement("a")
                a.setAttribute("id", "jump-dtk-product-page")
                a.innerHTML = `前往大淘客商品页 - ${product.d_title}`
                a.setAttribute("href", `https://www.dataoke.com/item?id=${product.id}`)
                a.setAttribute("target", "_blank")
                this.parentNode.appendChild(a)
            }
        })
    }
})();