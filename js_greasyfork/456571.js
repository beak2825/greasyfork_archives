// ==UserScript==
// @name         unixtime时间戳转成时间格式
// @namespace    https://www.asilu.com/post-35
// @version      0.1.1
// @description  时间戳转日期
// @author       asilu
// @match        *://*填写域名/i/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456571/unixtime%E6%97%B6%E9%97%B4%E6%88%B3%E8%BD%AC%E6%88%90%E6%97%B6%E9%97%B4%E6%A0%BC%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/456571/unixtime%E6%97%B6%E9%97%B4%E6%88%B3%E8%BD%AC%E6%88%90%E6%97%B6%E9%97%B4%E6%A0%BC%E5%BC%8F.meta.js
// ==/UserScript==

(function(){
    /*@ Adminer 时间戳转日期 */
    /* 获取所有数据单元格 */
    var doms = document.getElementsByTagName('td'),
        hash = {},
        pad = function (value) {
            value = String(value);
            while (value.length < 2) {
                value = '0' + value;
            }
            return value;
        },
        reg = /^\d{10}(\.\d{1,3})?$/;

    if(!doms){
        return false;
    }

    let k
    for(k in doms){
        let txt
        txt = doms[k].innerHTML;
        if(reg.test(txt)){
            let t,Y,m,d,H,i,s
            t = new Date(parseInt(txt) * 1000);
            Y = t.getFullYear();
            m = pad(t.getMonth() + 1);
            d = pad(t.getDate());
            H = pad(t.getHours());
            i = pad(t.getMinutes());
            s = pad(t.getSeconds());
            doms[k].innerHTML += '<font color="red"> '+ [Y,m,d].join('-') +' '+ [H,i,s].join(':') + '</font>';
        }
    }
})();