// ==UserScript==
// @name         东方财富 期货内外盘比
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  增加内外盘比的自动计算
// @author       benwang
// @match        http://quote.eastmoney.com/qihuo/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391678/%E4%B8%9C%E6%96%B9%E8%B4%A2%E5%AF%8C%20%E6%9C%9F%E8%B4%A7%E5%86%85%E5%A4%96%E7%9B%98%E6%AF%94.user.js
// @updateURL https://update.greasyfork.org/scripts/391678/%E4%B8%9C%E6%96%B9%E8%B4%A2%E5%AF%8C%20%E6%9C%9F%E8%B4%A7%E5%86%85%E5%A4%96%E7%9B%98%E6%AF%94.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    window.setTimeout(setWpNpRate, 1500);

    function setWpNpRate() {
        // 获取外盘数据
        var _wp = document.querySelector("span.price_num.wp.red").innerText;
        if (_wp[_wp.length - 1] == "万") {
            _wp = parseFloat(_wp.substring(0, _wp.length - 1)) * 10000;
        }else{
            _wp = parseFloat(_wp);
        }

        //获取内盘数据
        var _np = document.querySelector("span.price_num.np.green").innerText;
        if (_np[_np.length - 1] == "万") {
            _np = parseFloat(_np.substring(0, _np.length - 1)) * 10000;
        }else{
            _np = parseFloat(_np);
        }

        var _rate = _wp / (_wp + _np) * 100;
        var _span = document.createElement("span");
        _span.style.left = "20px";
        _span.innerText = "外内盘比：" + _rate.toFixed(2) + "%";
        if (_rate >= 50) {
            _span.className = 'price_num red';
        } else {
            _span.className = 'price_num green';
        }

        // 在行情报价 后面追加 比例
        document.querySelector("div.side.side_right h2.title.fl").appendChild(_span)
    }
})();