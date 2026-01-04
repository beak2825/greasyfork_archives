// ==UserScript==
// @name         新乡医学院学习系统10倍速插件
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  新乡医学院学习系统10倍速插件，节省时间，无风险，快速拿积分
// @author       ￥whz￥
// @match        https://www.xxyxyedu.com/edu/course/*
// @match        http://113.219.200.145:9000/console/index.aspx
// @match        http://113.219.200.145:9000/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=200.145
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/layer/2.3/layer.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475071/%E6%96%B0%E4%B9%A1%E5%8C%BB%E5%AD%A6%E9%99%A2%E5%AD%A6%E4%B9%A0%E7%B3%BB%E7%BB%9F10%E5%80%8D%E9%80%9F%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/475071/%E6%96%B0%E4%B9%A1%E5%8C%BB%E5%AD%A6%E9%99%A2%E5%AD%A6%E4%B9%A0%E7%B3%BB%E7%BB%9F10%E5%80%8D%E9%80%9F%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function insertRate(){
        var select = $('iframe[id*="layui-layer-iframe"]').contents().find('select[id="selRate"]')
        if(select.length > 0) {
            console.log('aaaaaa',select.children())
            $('<option></option>')
                .css('color', 'red')
                .attr('value', '10').text('10')
                .appendTo(select);

            console.log('aaaaaa',$('#selRate').children())

        }
    }

    let observerIframe = null
    function startObserverIframe(){
        var iframe = document.querySelector('iframe[id*=layui-layer-iframe]')
        // var hasIframe = iframe.body != undefined
        // 未创建时，在创建观察
        // if(observerIframe && !hasIframe){
        //     observerIframe = null
        // }
        // if (hasIframe && !observerIframe){
        //     observerIframe = new MutationObserver(function (records) {
        //         insertRate()
        //     });
        //     observerIframe.observe( iframe.body, {
        //         childList: true,
        //         subtree: true,
        //     });
        // }
        if(iframe){
            iframe.addEventListener('load', () => {
                if(iframe.contentDocument.body.childNodes.length > 0) {
                    console.log('has child nodes');
                    insertRate()
                }
            });
        }else{

            // 兼容其他网站
            var video = document.querySelector('video') 
            if(video){
                 $('video')
                .on('loadedmetadata', function() {
                    
                    if($('#rate10Btn').length == 0){
                        
                        var videoCtrl = document.querySelector('.art-controls-right') 
                        $('<button>')
                            .css('color', 'red')
                            .attr('id', 'rate10Btn').text('10倍速')
                            .appendTo(videoCtrl)
                            .on('click', function() {
                            // 获取视频元素并设置播放速度
                                video.playbackRate = 10;
                                alert('视频播放速度已设置为10倍！');
                            });
                        $('<button>')
                            .css('color', 'red')
                            .attr('id', 'rate16Btn').text('16倍速')
                            .appendTo(videoCtrl)
                            .on('click', function() {
                            // 获取视频元素并设置播放速度
                                video.playbackRate = 16;
                                alert('视频播放速度已设置为16倍！');
                            });
                    }
                   
                     
                            
                })
                
            }
        }
        
    }
    

    var oldTime = new Date();
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var observer = new MutationObserver(function (records) {
        var newTime = new Date();
        if (newTime - oldTime > 200) {
            oldTime = newTime;
            startObserverIframe()
        }
    });
    var option = {
        childList: true,
        subtree: true,
    };
    observer.observe( document.body, option);



})();