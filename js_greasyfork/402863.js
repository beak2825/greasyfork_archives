// ==UserScript==
// @name         百度搜索结果 百度百科图标不要播放视频
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  百度搜索结果 百度百科图标不要播放视频，还改回弹出百度百科页面
// @author       别问我是谁请叫我雷锋
// @license      BSD-3-Clause
// @incompatible firefox Firefox浏览器不会显示词条图标，变成了空白区域，应该从这个空白区域的顶部点击进入百科词条页面。
// @match        https://www.baidu.com/*
// @match        https://baike.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402863/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%20%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E5%9B%BE%E6%A0%87%E4%B8%8D%E8%A6%81%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/402863/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%20%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E5%9B%BE%E6%A0%87%E4%B8%8D%E8%A6%81%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

'use strict';
if (location.host != "baike.baidu.com") {

    jQuery.fn.wait = function (func, times, interval) {
        var _times = times || -1, //100次
            _interval = interval || 20, //20毫秒每次
            _self = this,
            _selector = this.selector, //选择器
            _iIntervalID; //定时器id
        if( this.length ){ //如果已经获取到了，就直接执行函数
            func && func.call(this);
        } else {
            _iIntervalID = setInterval(function() {
                if(!_times) { //是0就退出
                    clearInterval(_iIntervalID);
                }
                _times <= 0 || _times--; //如果是正数就 --

                _self = $(_selector); //再次选择
                if( _self.length ) { //判断是否取到
                    func && func.call(_self);
                    clearInterval(_iIntervalID);
                }
            }, _interval);
        }
        return this;
    }

    $(".op-bk-polysemy-imgWrap").wait(function () {
        let div = $(".op-bk-polysemy-imgWrap").parent().clone();
        let url = $(".op-bk-polysemy-imgWrap").attr("data-url");
        for (var x in $(".op-bk-polysemy-imgWrap")) {
            if ($(".op-bk-polysemy-imgWrap").length != 0 && !isNaN(x)) {
                let url = $(".op-bk-polysemy-imgWrap").get(x).dataset.url;
                $(".op-bk-polysemy-imgWrap").get(x).parentElement.innerHTML = "<a href='" + url + "' target='_blank' >" +  div.prop("outerHTML") + "</a>";
                $(".op-bk-polysemy-imgWrap").get(x).style.pointerEvents = "none";
                $(".op-bk-polysemy-imgWrap").find(".op-bk-polysemy-samicon").hide();
            }
        }
    }, 1)

    $("#wrapper_wrapper").bind("DOMSubtreeModified" , function () {
        console.log(1);
        let div = $(".op-bk-polysemy-imgWrap").parent().clone();
        let url = $(".op-bk-polysemy-imgWrap").attr("data-url");
        for (var x in $(".op-bk-polysemy-imgWrap")) {
            if ($(".op-bk-polysemy-imgWrap").length != 0 && !isNaN(x)) {
                let url = $(".op-bk-polysemy-imgWrap").get(x).dataset.url;
                $("#wrapper_wrapper").unbind("DOMSubtreeModified");
                $(".op-bk-polysemy-imgWrap").get(x).parentElement.innerHTML = "<a href='" + url + "' target='_blank' >" +  div.prop("outerHTML") + "</a>";
                $(".op-bk-polysemy-imgWrap").get(x).style.pointerEvents = "none";
                $(".op-bk-polysemy-imgWrap").find(".op-bk-polysemy-samicon").hide();
            }
        }
    })



} else {
    if (location.search.lastIndexOf("secondId") > 0) { location.href = location.href.substring(0, location.href.lastIndexOf('?')) }
}