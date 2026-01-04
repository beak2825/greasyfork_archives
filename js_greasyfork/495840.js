// ==UserScript==
// @name         微博增强-添加悄悄关注
// @namespace    https://github.com/ozingi
// @version      2.0.02
// @description  在m.weibo.cn和weibo.com域名下运行的自定义脚本
// @author       ozingi
// @match        https://m.weibo.cn/*
// @match        https://weibo.com/*
// @match        https://weibo.com/set/*
// @match        https://m.weibo.cn/u/*
// @match        https://m.weibo.cn/setting*
// @grant        GM_xmlhttpRequest
// @connect      weibo.cn
// @license      版权所有 (C) 2024 ozingi@163.com。允许修改和再分发，但必须保留此版权声明。商业使用需联系作者获得授权。

// @downloadURL https://update.greasyfork.org/scripts/495840/%E5%BE%AE%E5%8D%9A%E5%A2%9E%E5%BC%BA-%E6%B7%BB%E5%8A%A0%E6%82%84%E6%82%84%E5%85%B3%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/495840/%E5%BE%AE%E5%8D%9A%E5%A2%9E%E5%BC%BA-%E6%B7%BB%E5%8A%A0%E6%82%84%E6%82%84%E5%85%B3%E6%B3%A8.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 获取当前页面的cookie
    var cookies = document.cookie;
    // 记录当前页面的URL
    let lastUrl = window.location.href;
    // 添加自定义样式
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        .custom-setting-span:active {
            background-color: orange;
        }
        .custom-setting-div {
            display: none; /* 默认不显示 */
            width: 200px;
            height: 300px;
            border: 1px solid black;
            position: absolute;
            top:10%;
            right: 5%;
            z-index:1;
            background:white;
            padding: 10px;
            box-sizing: border-box;
        }
        .custom-setting-div input,
        .custom-setting-div button {
            margin-top: 10px;
            width: 100%;
        }
    `;
    document.head.appendChild(style);
    function setQuietfollow(uid) {
        // 执行后台访问
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://weibo.cn/'+uid+'/operation?rl=0',
            headers:{
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/jxl,image/webp,*/*;q=0.8",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Accept-Language": "zh-CN,zh-HK;q=0.5",
                "Connection":"keep-alive",
                "Cookie": cookies,
                "Host": "weibo.cn",
                "Priority": "u=1",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.0.0"
            },
            onload: function(response) {
                // 这里可以根据返回的内容进行相应的处理
                //console.log('请求成功，返回的数据：', response.responseText);
                //console.log(typeof(response.responseText));
                // 使用正则表达式匹配St内容
                var regexSt = /rl=0&amp;st=(.*?)">/;
                var matchResult = response.responseText.match(regexSt);
                var matchesSt = matchResult ? matchResult[1] : false;
                //console.log("查找st",matchesSt);
                if(matchesSt!=false){
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: 'https://weibo.cn/attention/addPrivate?uid='+uid+'&rl=0&st='+matchesSt+'',
                        headers:{
                            "Host": "weibo.cn",
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.0.0",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/jxl,image/webp,*/*;q=0.8",
                            "Accept-Language": "zh-CN,zh-HK;q=0.5",
                            "Accept-Encoding": "gzip, deflate, br, zstd",
                            "Connection": "keep-alive",
                            "Referer": 'https://weibo.cn/'+uid+'/operation?rl=0&rand=6608&p=r',
                            "Cookie": cookies,
                            "Upgrade-Insecure-Requests": "1",
                            "Sec-Fetch-Dest": "document",
                            "Sec-Fetch-Mode": "navigate",
                            "Sec-Fetch-Site": "same-origin",
                            "Sec-Fetch-User": "?1",
                            "sec-ch-ua-platform": "Windows",
                            "sec-ch-ua": '"Edge";v="118", "Chromium";v="118", "Not=A?Brand";v="24"',
                            'sec-ch-ua-mobile': '?0',
                            'Priority': 'u=1',
                            'TE': 'trailers'
                        },
                        onload: function(response) {
                            // 这里可以根据返回的内容进行相应的处理
                            //console.log('请求成功，返回的数据：', response.responseText);
                            //console.log(typeof(response.responseText));
                            // 使用正则表达式匹配<div class="me">标签及其内容
                            var regexMe = /<div class="me">(.*?)<\/div>/;
                            var matchesMe = response.responseText.match(regexMe);
                            var regexPs = /<div class="ps">(.*?)<\/div>/;
                            var matchesPs = response.responseText.match(regexPs);
                            var matches;
                            matches=matchesMe?matchesMe:matchesPs;
                            //console.log(matchesMe);
                            if(matches){
                                matches = matches[1];
                                // 使用Toast函数
                                console.log(matches);
                                showToast(matches, 3000); // 显示3秒钟
                            }

                        },
                        onerror: function(error) {
                            // 请求失败时的处理
                            console.error('请求失败：', error);
                        }});}else{
                        showToast("请求用户信息失败", 3000); // 显示3秒钟
                    }}
        });
    }
    // 使用MutationObserver监听DOM变化
    var observer = new MutationObserver(function() {
        const url = window.location.href;
        // 使用正则表达式匹配执行url内容
        var regexUrl = /^https:\/\/m\.weibo\.cn\/(u\/\w+|setting|profile)/;
        var regexUrl2 = /^https:\/\/weibo\.com\/(set\/\w+|u)/;
        var matchUrl2 = url.match(regexUrl2);
        var matchUrl = url.match(regexUrl);

        //console.log('浏览器地址变化:', matchUrl2);
        if (matchUrl||matchUrl2) {
            if(typeof elements() === 'undefined'){

            }

        }

    });
    // 获取所有class为m-diy-btn m-box-col m-box-center m-box-center-a和div.bar-btn:nth-child(2)的元素
    var elements = ()=>{
        var element = document.querySelector('.m-diy-btn.m-box-col.m-box-center.m-box-center-a');
        var element2 = document.querySelector('.m-diy-btn.m-box-col.m-box-center.m-box-center-a.quiet-follow');
        //资料页
        var element3 = document.querySelector('div.bar-btn:nth-child(2)');
        var element4 = document.querySelector('.bar-btn.m-box-col.quiet-follow');
        //pc
        var element5 = document.querySelector('a.ALink_default_2ibt1:nth-child(6)');
        var element6 = document.querySelector('.router-link-exact-active.router-link-active.ALink_default_2ibt1.quiet-follow');

        var element7 = document.querySelector('div.woo-pop-wrap:nth-child(3)');
        var element8 = document.querySelector('.woo-pop-wrap.quiet-follow');
        //console.log("搜索个人页",element4)
        if (element&& (element2==null)) {
            // 创建新的div元素
            var newDiv = document.createElement('div');
            newDiv.className = 'm-diy-btn m-box-col m-box-center m-box-center-a quiet-follow'; // 添加自定义类名
            newDiv.innerHTML = '<div data-v-5552d90b="" callback="follow()" class="m-add-box m-followBtn"><span class="m-add-box"><h5>悄悄关注</h5></span></div>';
            // 将新的div标签添加到找到的div标签后面
            element.parentNode.insertBefore(newDiv, element.nextSibling);
            // 执行完毕后断开观察者
            //observer.disconnect();
            // 添加点击事件监听器
            newDiv.addEventListener('click', function() {
                var currentUrl = window.location.href;
                // 使用正则表达式匹配St内容
                var regexUid = /cn\/u\/(.*?)(?=\?|$)/;
                var matchUid = currentUrl.match(regexUid);
                if(matchUid){
                    setQuietfollow(matchUid[1])
                }
            });
        };
        if (element3&& (element4==null)) {
            // 创建新的div元素
            var newDiv2 = document.createElement('div');
            newDiv2.className = 'bar-btn m-box-col quiet-follow'; // 添加自定义类名
            newDiv2.innerHTML = '<div callback="follow()" class="m-add-box m-followBtn m-btn m-btn-block m-btn-blue"><span class="m-add-box"><sapn>悄悄关注</span></span></div>';
            // 将新的div标签添加到找到的div标签后面
            element3.parentNode.insertBefore(newDiv2, element3.nextSibling);
            // 执行完毕后断开观察者
            //observer.disconnect();
            // 添加点击事件监听器
            newDiv2.addEventListener('click', function() {
                var currentUrl = window.location.href;
                // 使用正则表达式匹配St内容
                var regexUid = /profile\/(.*?)(?=\?|$)/;
                var matchUid = currentUrl.match(regexUid);
                if(matchUid){
                    setQuietfollow(matchUid[1])
                }
            });
        };
        if (element5&& (element6==null)) {
            // 创建新的div元素
            var newDiv3 = document.createElement('a');
            newDiv3.className = 'router-link-exact-active router-link-active ALink_default_2ibt1 quiet-follow'; // 添加自定义类名
            newDiv3.href = 'https://m.weibo.cn/setting?tab=whisper'; // 设置跳转链接
            newDiv3.innerHTML = '<div class="woo-box-flex woo-box-alignCenter NavItem_main_2hs9r NavItem_cur_2ercx" role="link" title="使用偏好" tabindex="0" data-focus-visible="true"><span class="NavItem_text_3Z0D7">悄悄关注</span></div>';
            // 将新的div标签添加到找到的div标签后面
            element5.parentNode.insertBefore(newDiv3, element5.nextSibling);
        };
        if (element7&& (element8==null)) {
            // 创建新的div元素
            var newDiv4 = document.createElement('div');
            newDiv4.className = 'woo-pop-wrap quiet-follow'; // 添加自定义类名
            newDiv4.innerHTML = '<span class="woo-pop-ctrl"><button class="woo-button-main woo-button-flat woo-button-primary woo-button-m woo-button-round FollowBtn_m_1UJhp ProfileHeader_btn3_2VD_Y" user="[object Object]"><span class="woo-button-wrap"><span class="woo-button-content"> 悄悄关注 </span></span></button></span>';
            // 将新的div标签添加到找到的div标签后面
            element7.parentNode.insertBefore(newDiv4, element7.nextSibling);
            // 执行完毕后断开观察者
            //observer.disconnect();
            // 添加点击事件监听器
            newDiv4.addEventListener('click', function() {
                var currentUrl = window.location.href;
                // 使用正则表达式匹配St内容
                var regexUid = /\/u\/(\d+)(?=\?|$)/;
                var matchUid = currentUrl.match(regexUid);
                //console.log(matchUid)
                if(matchUid){
                    setQuietfollow(matchUid[1])
                }
            });
        };
        return element;
    }
    // 配置和启动观察者
    observer.observe(document.body, { childList: true, subtree: true });

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 查找.sub-header下的第一个span标签
        var subHeaderSpan = document.querySelector('.sub-header span');
        //console.log("搜索列表",subHeaderSpan)
        if (subHeaderSpan) {
            // 创建新的span标签
            var newSpan = document.createElement('span');
            newSpan.textContent = '设置'; // 设置新span的内容
            newSpan.style.float = 'right'; // 设置新span的样式
            newSpan.className = 'custom-setting-span'; // 添加自定义类名

            // 创建设置面板div
            var settingDiv = document.createElement('div');
            settingDiv.className = 'custom-setting-div';
            // 添加文本
            settingDiv.innerHTML = '<p>添加用户</p>';
            // 创建UID输入框
            var uidInput = document.createElement('input');
            uidInput.type = 'text';
            uidInput.placeholder = '请输入UID';
            // 创建确认添加按钮
            var addButton = document.createElement('button');
            addButton.textContent = '确认添加';
            // 将输入框和按钮添加到设置面板
            settingDiv.appendChild(uidInput);
            settingDiv.appendChild(addButton);

            // 添加点击事件监听器
            newSpan.addEventListener('click', function() {
                //关闭时刷新悄悄关注列表
                if(settingDiv.style.display=='block'){
                    location.reload();
                }
                // 显示或隐藏设置面板
                settingDiv.style.display = settingDiv.style.display === 'none' ? 'block' : 'none';
                //console.log(settingDiv.style.display);

            });
                        // 添加点击事件监听器
            addButton.addEventListener('click', function() {
                // 执行后台访问
                setQuietfollow(uidInput.value)
            });


            // 将新的span标签添加到找到的span标签后面
            subHeaderSpan.parentNode.insertBefore(newSpan, subHeaderSpan.nextSibling);
            // 将设置面板div添加到body中
            document.body.appendChild(settingDiv);
        }
    });
/*         // 保存原始的send函数
    var originalSend = XMLHttpRequest.prototype.send;

    // 修改send函数
    XMLHttpRequest.prototype.send = function() {
        // 在这里添加你的代码，它会在每个请求发送时执行

        // 监听请求的load事件，它会在请求完成时触发
        this.addEventListener('load', function() {
            if (this.readyState === 4 && this.status === 200) {
                // 在这里添加你的代码，它会在请求成功完成时执行
                var subHeaderSpan1 = document.querySelector('.box-right.m-box-center-a.m-box-center.m-btn-box');
                console.log("搜索列表",subHeaderSpan1)
                if (subHeaderSpan1) {
                    // 创建新的div元素
                    var newDiv = document.createElement('div');
                    newDiv.className = 'box-right m-box-center-a m-box-center m-btn-box'; // 添加自定义类名
                    newDiv.innerHTML = '<div data-v-124dcff2=""><div data-v-124dcff2="" class="m-add-box"><i data-v-124dcff2="" class="m-font m-font-follow"></i><h4 data-v-124dcff2="">加关注</h4></div></div>';

                    // 将新的div添加到当前元素的后面
                    subHeaderSpan1.appendChild(newDiv);
                }
                console.log('请求完成:', this);
            }
        }, false);

        // 调用原始的send方法
        originalSend.apply(this, arguments);
    }; */
    // 创建Toast函数
    function showToast(message, duration) {
        // 创建一个div元素作为Toast容器
        var toast = document.createElement('div');

        // 设置Toast的样式
        toast.style.position = 'fixed';
        toast.style.top = '50%';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        toast.style.color = 'white';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '5px';
        toast.style.zIndex = '555';
        toast.style.fontSize = '16px';

        // 将消息文本添加到Toast容器中
        toast.textContent = message;

        // 将Toast添加到文档中
        document.body.appendChild(toast);

        // 设置Toast显示的时间
        setTimeout(function() {
            // 移除Toast
            document.body.removeChild(toast);
        }, duration || 2000); // 如果没有指定时间，默认为2000毫秒
    }

})();
