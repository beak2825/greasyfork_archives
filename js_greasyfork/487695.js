// ==UserScript==
// @name         短剧网
// @namespace    http://tampermonkey.net/
// @version      2024-02-19
// @description  免登录，免会员
// @author       You
// @match        https://www.duanju5.com/vodplay/*
// @icon         https://www.duanju5.com/template/mxone/mxstatic/picture/logo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487695/%E7%9F%AD%E5%89%A7%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/487695/%E7%9F%AD%E5%89%A7%E7%BD%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var videoElement, 当前集数;
    window.onload = function(){
        var iframe = document.querySelector('#playleft iframe');//找到iframe元素
        var iframeWindow = iframe.contentWindow;// 访问iframe的内容窗口
        if (!iframeWindow) return null;// 如果无法访问，返回null或抛出错误
        videoElement = iframeWindow.document.querySelector('video'); // 访问iframe窗口通过标签名获取第一个video元素
        var url = videoElement.getAttribute("src");//视频链接
        var 解析播放地址 = url.split('/');
        var 片名 = 解析播放地址[3];
        当前集数 = 解析播放地址[4].split('.').slice(0, -1).join('');
        var newurl = `${解析播放地址[0]}//${解析播放地址[2]}/${解析播放地址[3]}/`;
        top[2].ck.removeListener('ended', top[2].endedHandler);//删除原本的自动下一集
        top[2].endedHandler = function() {
            top[2].document.querySelector('video').src = top.MacPlayer.PlayUrlNext;
        }
        top[2].ck.addListener('ended', top[2].endedHandler);//添加自动下一集
        下一集按钮(newurl,当前集数);
        修改集数列表(newurl);
    }



    //修改集数列表
    function 修改集数列表(newurl){
        let aElement = document.querySelector('div.scroll-content');//获取集数列表元素
        let allA = aElement.querySelectorAll('a');//获取全部集数的A标签
        let 总集数 = allA.length;
        var aTags = document.querySelector('div.scroll-content').querySelectorAll('a');
        aTags.forEach(function(aTag) {
            aTag.addEventListener('click', function(event) {
                event.preventDefault(); // 阻止默认行为

                // 删除所有链接的 selected 类
                aTags.forEach(function(tag) {
                    tag.classList.remove('selected');
                    // 获取每个链接对应的 div
                    var div = tag.querySelector('.playon');
                    if (div) {
                        // 如果 div 存在，则隐藏
                        div.style.display = 'none';
                    }
                });

                // 给当前点击的链接添加 selected 类
                aTag.classList.add('selected');

                // 获取当前链接的文本内容
                var textContent = aTag.textContent;

                // 使用正则表达式匹配数字
                var match = textContent.match(/\d+/);
                if (match) {
                    // 如果找到了数字，则输出
                    var episodeNumber = parseInt(match[0]); // 将匹配到的数字转换为整数
                    //console.log("集数：" + episodeNumber);
                    let selectuel = `${newurl}${episodeNumber}.mp4`;
                    修改播放链接(selectuel)
                    Edith1(episodeNumber);
                }

                // 输出当前链接的文本内容
                //console.log("完整文本：" + textContent);
            });
        });
    }

    //修改下一集按钮
    function 下一集按钮(newurl,当前集数){
        // 获取下一集按钮元素
        var aElement = document.querySelector('div.video-player-handle > a');

        // 为下一集按钮添加点击事件监听器
        aElement.addEventListener('click', function(event) {
            event.preventDefault(); // 阻止跳转
            当前集数++;
            let 下一集数 = 当前集数;
            var nexturl = `${newurl}${下一集数}.mp4`;
            修改播放链接(nexturl)
            Edith1(下一集数);
        });
    }

    //修改播放链接
    function 修改播放链接(url) {
        videoElement.src = url;
    }

    //修改显示集数
    function Edith1(text){
        // 获取需要修改元素
        var h1Element = document.querySelector('span.page-title');

        // 修改显示集数文本内容
        h1Element.textContent = ` 第${text}集`;
    }
})();