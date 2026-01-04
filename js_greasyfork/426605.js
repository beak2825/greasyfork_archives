// ==UserScript==
// @name           小鹅通(v2)视频下载
// @description    小鹅通(v2)视频直接下载，在「介绍」页多了一个「下载视频」的按钮。
// @author         018(lyb018@gmail.com)
// @contributor    Rhilip
// @connect        *
// @grant          GM_xmlhttpRequest
// @require        https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @match          https://*.h5.xiaoeknow.com/v2/*
// @version        0.1.0
// @icon           https://www.xiaoe-tech.com/logo-64.ico
// @run-at         document-end
// @namespace      http://018.ai
// @downloadURL https://update.greasyfork.org/scripts/426605/%E5%B0%8F%E9%B9%85%E9%80%9A%28v2%29%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/426605/%E5%B0%8F%E9%B9%85%E9%80%9A%28v2%29%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

// This Userscirpt can't run under Greasemonkey 4.x platform
if (typeof GM_xmlhttpRequest === 'undefined') {
    alert('不支持Greasemonkey 4.x，请换用暴力猴或Tampermonkey')
    return
}

;(function () {
    'use strict';

    $(document).ready(function () {
        // 下载
        var interval = setInterval(function() {
            if ($('.baseInfo-content').length <= 0) return

            clearInterval(interval)
            var $div = $('<div id="btn-download" style="font-size: 20px;">下载视频</div>')
            $div.click(function(){
                $.get('https://app8itcpmev8540.h5.xiaoeknow.com/_alive/v2/get_lookback_url?app_id=' + getApp_id() + '&alive_id=' + getResource_id(), function(data,status){
                    if (status === 'success') {
                        downloadFile(data.data.aliveVideoMp4Url, document.title + '.mp4')
                    } else {
                        console.warn('小鹅通(v2)视频下载插件异常：' + data)
                    }
                });
            })
            $('.baseInfo-content').append($div)
        }, 200);
    })

    function downloadFile(url, fileName = '') {
        let eleLink = document.querySelector('.dlurl');
        if(!eleLink) {
            eleLink = document.createElement('a');
        }
        eleLink.download = fileName;
        eleLink.className = 'dlurl';
        eleLink.style = 'font-size: 12px';
        eleLink.target = '_blank'
        //eleLink.style.display = 'none';
        eleLink.href = url;
        eleLink.textContent = '如果下载失败，请尝试用「链接存储为...」进行下载，或者「复制链接地址」使用下载工具如迅雷下载。';
        $('#btn-download').after(eleLink);
        eleLink.click();
        //document.body.removeChild(eleLink);
    };

    function getUrlParam(name) {
        //构造一个含有目标参数的正则表达式对象
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        //匹配目标参数
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        } else {
            //返回参数值
            return "";
        }
    }

    // 获取resource_id
    function getResource_id() {
        return window.location.pathname.substr(window.location.pathname.lastIndexOf('/') + 1)
    }

    // 获取app_id
    function getApp_id() {
        return getUrlParam('app_id');
    }
})()