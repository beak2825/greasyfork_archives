// ==UserScript==
// @name         成都市中小学教师继续教育网-挂机插件
// @namespace    http://notes.stepin.cn
// @version      0.4
// @description  成都继续教育挂机-免15分钟弹窗
// @author       stepin
// @include      *cdjxjy.com/*
// @run-at 	 document-end
// @downloadURL https://update.greasyfork.org/scripts/403025/%E6%88%90%E9%83%BD%E5%B8%82%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91-%E6%8C%82%E6%9C%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/403025/%E6%88%90%E9%83%BD%E5%B8%82%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91-%E6%8C%82%E6%9C%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    if(typeof(dingshi) === 'undefined'){
    }else{
        var longDS = 3100
        confirm("开始挂机,修改参数dingshi：弹窗时间由"+dingshi+"秒变为"+ longDS+"秒")
        dingshi = longDS
    }
})();