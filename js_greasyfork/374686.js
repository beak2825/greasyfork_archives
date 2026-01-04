// ==UserScript==
// @name         Legovo 利润计算
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  计算legovo商品的利润够不够
// @author       Eric Cao
// @grant        none
// @match        http://sc.legovo.com/detail/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/374686/Legovo%20%E5%88%A9%E6%B6%A6%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/374686/Legovo%20%E5%88%A9%E6%B6%A6%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    var lirun = 0;
    var ticheng = 0.3;
    setTimeout(function(){
        var price = getNum(formatStr($('span.grp-price-num')[0].innerHTML));
        var suggestprice = getNum(formatStr($('span.grp-retail')[0].innerHTML));
        var freight = getNum(formatStr($('span.grp-col2')[2].innerHTML));
        var tax = getNum(formatStr($('span.grp-col2')[3].innerHTML));
        var type = formatStr($('span.grp-col2')[5].innerHTML);
        if (type=='跨境电商（9610）') {
            lirun = suggestprice - tax - freight - suggestprice*ticheng - price;
            lirun = Math.round(lirun * 100)/100;
        }
        else if (type=='快件直邮') {
            lirun = suggestprice - tax - suggestprice*0.1*0.25 - freight - suggestprice*ticheng - price;
            lirun = Math.round(lirun * 100)/100;
        }
        var a = '<p><span class="grp-col1">利润</span><span class="grp-col2">'+lirun+'</span></p>';
        $('div.gr-details').append(a);
        //varaddInfo();
    } ,2000)//隔5秒之后执行.应该就能解决这个问题了

    function formatStr(str) {
        str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
        str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
        str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
        str = str.replace(/ /ig,'');//去掉
        str = str.replace(/^[\s　]+|[\s　]+$/g, "");//去掉全角半角空格
        str = str.replace(/[\r\n]/g,"");//去掉回车换行
        return str;
    }

    function getNum(str) {
        var exp = /(([1-9]\d*)(\.\d{1,2})?)$|(0\.0?([1-9]\d?))$/;
        str = str.match(exp);
        console.log(str);
        if (str==null) {
            return 0;
        }
        else {
            return str[0];
        }
    }

    function addInfo(price,suggestprice,freight,tax,type) {
        if (type=='跨境电商（9610）') {
            lirun = suggestprice - tax - freight - suggestprice*ticheng;
        }
        var a = '<p><span class="grp-col1">结果</span><span class="grp-col2">'+lirun+'</span></p>';
        $('div.gr-details').append(a);

    }

})();