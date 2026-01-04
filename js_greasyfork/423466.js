// ==UserScript==
// @name         常州继续教育学习(新版无flash)
// @namespace    http://www.52love1.cn/
// @version      0.3
// @description  常州继续教育学习学习页面自动下一节
// @author       G魂帅X
// @match        https://www.czpx.cn/coursePlaySfpServlet.do?*
// @match        https://www.czpx.cn/coursePlayServlet.do?*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423466/%E5%B8%B8%E5%B7%9E%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%28%E6%96%B0%E7%89%88%E6%97%A0flash%29.user.js
// @updateURL https://update.greasyfork.org/scripts/423466/%E5%B8%B8%E5%B7%9E%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%28%E6%96%B0%E7%89%88%E6%97%A0flash%29.meta.js
// ==/UserScript==
/* globals jQuery, $, layer, waitForKeyElements */

(function() {
    'use strict';

    // Your code here...
    // 关闭所有弹窗（主要提示弹窗）
    layer.closeAll();
    // 自动点击播放(定时检测播放器初始化完成)
    var timer = setInterval(function(){
        if ($('#mse .xgplayer-icon-play').length > 0) {
            $('#mse .xgplayer-icon-play').click();
            clearInterval(timer);
            timer = null;
        }
    }, 500);

    layer.ready(function(){
        layer.config({
            success: function(layero, index){
                setTimeout(function(){
                    var a = layero.find('.layui-layer-btn a');
                    if(a.eq(0).html().indexOf('我要继续') > -1) {
                        a.eq(0).trigger('click');
                    } else if(a.eq(1).html().indexOf('我要继续') > -1) {
                        a.eq(1).trigger('click');
                    }
                }, 1500);
            }
        });
    });
})();