// ==UserScript==
// @name         西瓜卡通 - 辅助播放插件
// @namespace    https://github.com/SMWHff/MelonToon-AssistAddon
// @version      0.3
// @description  支持无刷新切换章节，在[我的收藏]里显示最后播放章节、进度、最新章节、播放排序。
// @author       神梦无痕
// @match        https://cn.xgcartoon.com/*
// @match        https://www.xgcartoon.com/*
// @match        https://pframe.xgcartoon.com/player.htm*
// @icon         https://cn.xgcartoon.com/icon/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479015/%E8%A5%BF%E7%93%9C%E5%8D%A1%E9%80%9A%20-%20%E8%BE%85%E5%8A%A9%E6%92%AD%E6%94%BE%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/479015/%E8%A5%BF%E7%93%9C%E5%8D%A1%E9%80%9A%20-%20%E8%BE%85%E5%8A%A9%E6%92%AD%E6%94%BE%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 播放历史列表的键名
    var historyKey = 'playHistory';

    // 播放历史列表的先后顺序
    var OrderKey = 'orderHistory';

    // 当前播放的视频信息
    window.G_currentVideo = {
        title: null,
        url: null,
        curTime: null,
        durTime: null
    };


    var path = window.location.pathname;
    console.log(path);
    if(path === '/user/bookshelf'){
        userBookshelf();
    }else if(path.split('/')[1] === 'video' || path.split('/')[1] === 'user' ){
        inlineVideoSourceSwitch();
    }else if(path === '/player.htm'){
        pframePlayer();
    }

    // 获取本地存储的JSON对象
    function GM_getValueJSON(name){
        var strJSON = GM_getValueEx(name, '{}');
        return JSON.parse(strJSON);
    }

    // 设置本地存储的JSON对象
    function GM_setValueJSON(name, obj){
        GM_setValueEx(name, JSON.stringify(obj));
    }

    // 获取本地存储 - 双重版
    function GM_getValueEx(name, defaultValue){
        return GM_getValue(name, localStorage.getItem(name) || defaultValue);
    }

    // 设置本地存储 - 双重版
    function GM_setValueEx(name, value){
        localStorage.setItem(name, value);
        GM_setValue(name, value);
        return value;
    }

    // 从本地存储获取播放历史
    function getPlayHistory(dramaTitle) {
        var history = GM_getValueEx(historyKey, "{}");
        history = JSON.parse(history);
        if(!history[dramaTitle]){
            history[dramaTitle] = {};
        }
        return history;
    }

    // 将播放历史保存到本地存储
    function savePlayHistory(dramaTitle, video) {
        var history = getPlayHistory(dramaTitle);
        if(video.title) history[dramaTitle].title = video.title;
        if(video.url) history[dramaTitle].url = video.url;
        if(video.curTime) history[dramaTitle].curTime = video.curTime;
        if(video.durTime) history[dramaTitle].durTime = video.durTime;
        var ret = GM_setValueEx(historyKey, JSON.stringify(history));
        console.log(ret);
    }

    // 将秒转化为时间格式
    function formatTime(seconds) {
        seconds = Math.floor(seconds);

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        const formattedHours = hours > 0 ? `${hours.toString().padStart(2, '0')}:` : '';
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

        return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
    }

    // 格式化为百分号
    function formatAsPercentage(decimal, minimumFractionDigits = 0, maximumFractionDigits = 0) {
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: minimumFractionDigits,
            maximumFractionDigits: maximumFractionDigits
        });
        return formatter.format(decimal);
    }

    function pframePlayer(){
        // 页面关闭前保存当前视频到播放历史
        window.addEventListener('beforeunload', function() {
            window.G_currentVideo.curTime = elevideo.currentTime;
            savePlayHistoryTime(window.G_currentVideo);
            GM_setValueEx(getVid() + '_curTime', elevideo.currentTime);
        });

        // 页面窗口前保存当前视频到播放历史
        window.addEventListener('unload', function() {
            window.G_currentVideo.curTime = elevideo.currentTime;
            savePlayHistoryTime(window.G_currentVideo);
            GM_setValueEx(getVid() + '_curTime', elevideo.currentTime);
        });

        var elevideo = document.querySelector("#video_frame");
        elevideo.addEventListener('progress', function (e) {
            // 客户端正在请求数据
            // console.log('客户端正在请求数据：', elevideo.buffered.end(0));
        });
        elevideo.addEventListener('loadedmetadata', function () { //成功获取资源长度
            //视频的总长度
            console.log('视频的总长度：' + elevideo.duration);
            window.G_currentVideo.durTime = elevideo.duration;
            savePlayHistoryTime(window.G_currentVideo);

            // 设置历史播放进度
            var curTime = Number(GM_getValueEx(getVid() + '_curTime', 0));
            elevideo.currentTime = curTime;
            console.log('设置历史播放进度：' + curTime);
            elevideo.play();
        });

        elevideo.addEventListener('play', function () { //播放开始执行的函数
            console.log("开始播放");
        });
        elevideo.addEventListener('playing', function () { //播放中
            console.log("播放中");
        });
        elevideo.addEventListener('waiting', function () { //加载
            console.log("加载中");
        });
        elevideo.addEventListener('pause', function () { //暂停开始执行的函数
            console.log("暂停播放", elevideo.currentTime);
            GM_setValueEx(getVid() + '_curTime', elevideo.currentTime);
        });
        elevideo.addEventListener('ended', function () { //结束
            console.log("播放结束");
            GM_setValueEx(getVid() + '_curTime', 0);
        }, false);

        function getVid(){
            var params = new URLSearchParams(window.location.search);
            return params.get('vid');
        }

        function getDramaTitle(){
            return GM_getValueEx(getVid(), '');
        }

        function savePlayHistoryTime(video){
            savePlayHistory(getDramaTitle(), video)
        }
    }


    function userBookshelf(){
        var OrderList = JSON.parse(GM_getValueEx(OrderKey, "[]"));
        var bookshelfList = [];
        var bookshelfItems = document.querySelectorAll("#layout > div.bookshelf.container .bookshelf-item");
        bookshelfItems.forEach(function(book) {
            var bookshelf = book.querySelector("div.bookshelf-item-info > div > a");
            var btns = book.querySelector(".btns");
            var lastChapter = book.querySelector(".last-chapter");
            var btnBase = book.querySelector(".btn-base");
            var btnBase_span = btnBase.querySelector("span");

            // 获取动画名
            var bookTitle = bookshelf.textContent || bookshelf.innerText;

            // 按最近播放时间排序
            var index = OrderList.indexOf(bookTitle)
            if(index > -1){
                bookshelfList[index] = book;
            }

            // 获取动画URL
            var detailURL = bookshelf.href;
            var newVolume = getDetailUpdate(detailURL, btns);

            // 获取历史播放记录
            var history = GM_getValueEx(historyKey, localStorage.getItem(historyKey) || '{}');
            history = JSON.parse(history);
            var history_book = history[bookTitle];
            if(history_book){
                var chapterTitle = history_book.title;
                var btnBaseURL = history_book.url;
                var seconds = history_book.curTime || 0;
                var duration = history_book.durTime;
                var progress = "";

                // 计算播放进度
                if(duration){
                     progress = "（" + formatAsPercentage(seconds / duration) + "）";
                }

                // 修改最后播放标题
                if(chapterTitle){
                    lastChapter.innerHTML = '上次看到:  ' + chapterTitle + progress;
                }

                // 修改最后播放链接
                if(btnBaseURL){
                    btnBase.href = btnBaseURL;
                }
            }
        });

        // 调整元素顺序
        // 设置 order 为 -1 可以使其排到第一位
        bookshelfList.forEach(function(ele) {
            ele.style.order = -1;
        });
    }


    function getDetailUpdate(URL, btns){
        // 创建XHR请求
        var xhr = new XMLHttpRequest();
        xhr.open('GET', URL, true);
        xhr.responseType = 'document';

        // XHR请求完成后的处理
        xhr.onload = function() {
            if (xhr.status === 200) {
                // 判断更新状态
                var newStatus = "最近更新"
                var newStatusEle = xhr.response.querySelector(".detail-sider > div:has(+ .desk-ad) > div:last-child");
                if (newStatusEle) {
                    var newStatusText = newStatusEle.textContent || newStatusEle.innerText;
                    if(newStatusText.search(/^全\d+话,/) === 0){
                        newStatus = "全本完结";
                    }
                }

                // 请求成功，获取最新话元素
                var newVolumeEle = xhr.response.querySelector(".detail-right__volumes > .row > div:last-child > a");
                if (newVolumeEle) {
                    // 返回当前页面的最新话
                    newVolumeEle.className = '';
                    var newVolume = newVolumeEle.outerHTML;
                    btns.insertAdjacentHTML('afterbegin', `<div class="new-chapter text-truncate" style="color: var(--color-primary); padding: 6px 0;" data-v-2c578c40="">`+ newStatus +`:  ` + newVolume +`</div>`);
                } else {
                    console.log('No volume-title found in the response.');
                }
            } else {
                console.log('Request failed. Returned status of ' + xhr.status);
            }
        };

        // 发送XHR请求
        xhr.send();
}


    function inlineVideoSourceSwitch(){

        // 获取当前的剧名
        window.G_dramaTitle = '';
        var breadcrumbItem = document.querySelector("nav > ol > a.breadcrumb-item:nth-child(3)")
        if(breadcrumbItem){
            window.G_dramaTitle = breadcrumbItem.textContent || breadcrumbItem.innerText;
        }

        // 关联剧名和vid
        var src = document.querySelector('iframe')?.src;
        var search = src.split('?')[1];
        var params = new URLSearchParams(search);
        var vid = params.get('vid');
        GM_setValueEx(vid, window.G_dramaTitle);

        // 更新播放列表顺序
        var OrderList = JSON.parse(GM_getValueEx(OrderKey, "[]"));
        OrderList = OrderList.filter(item => item !== window.G_dramaTitle);
        OrderList.push(window.G_dramaTitle);
        GM_setValueEx(OrderKey, JSON.stringify(OrderList));

        // 保存当前页面视频信息
        var aActive = document.querySelector('#video-volumes-items a.active');
        if(aActive){
            // 父组件滚动法，滚动到 active 元素位置
            var activeParent = aActive.parentElement;
            document.querySelector("#video-volumes-items").scrollTo(0, activeParent.offsetTop - activeParent.offsetHeight);

            // 获取a标签的href属性和文本内容（标题）
            var href = aActive.getAttribute('href');
            var aActiveTitle = aActive.querySelector('.title');
            var title = aActiveTitle.textContent || aActiveTitle.innerText;

            // 更新当前视频信息
            window.G_currentVideo = { title: title, url: href };
            savePlayHistory(window.G_dramaTitle, window.G_currentVideo);
        }

        // 获取#video-volumes-items元素下的所有a标签
        var videoVolumeItems = document.querySelectorAll('#video-volumes-items a');


        // 页面关闭前保存当前视频到播放历史
        window.addEventListener('beforeunload', function() {
            if (window.G_dramaTitle && window.G_currentVideo.title && window.G_currentVideo.url) {
                savePlayHistory(window.G_dramaTitle, window.G_currentVideo);
            }
        });

        // 页面窗口前保存当前视频到播放历史
        window.addEventListener('unload', function() {
            if (window.G_dramaTitle && window.G_currentVideo.title && window.G_currentVideo.url) {
                savePlayHistory(window.G_dramaTitle, window.G_currentVideo);
            }
        });

        // 为每个a标签添加点击事件监听器
        videoVolumeItems.forEach(function(item) {
            item.addEventListener('click', function(event) {
                // 阻止a标签的默认点击行为
                event.preventDefault();

                // 移除所有a标签的active类
                videoVolumeItems.forEach(function(el) {
                    el.classList.remove('active');
                });

                // 给当前点击的a标签添加active类
                item.classList.add('active');

                // 获取a标签的href属性和文本内容（标题）
                var href = item.getAttribute('href');
                var item_title = item.querySelector('.title');
                var title = item_title.textContent || item_title.innerText;

                // 更新当前视频信息
                window.G_currentVideo = { title: title, url: href };
                savePlayHistory(window.G_dramaTitle, window.G_currentVideo);

                // 创建XHR请求
                var xhr = new XMLHttpRequest();
                xhr.open('GET', href, true);
                xhr.responseType = 'document';

                // XHR请求完成后的处理
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        // 请求成功，获取iframe元素
                        var iframeSrc = xhr.response.querySelector('iframe')?.src;
                        if (iframeSrc) {
                            // 找到当前页面的iframe元素
                            var currentIframe = document.querySelector('iframe');
                            if (currentIframe) {
                                // 替换当前页面iframe的src属性
                                currentIframe.src = iframeSrc;
                            } else {
                                console.log('No iframe found on the current page to replace src.');
                            }
                        } else {
                            console.log('No iframe found in the response.');
                        }
                    } else {
                        console.log('Request failed. Returned status of ' + xhr.status);
                    }
                };

                // 发送XHR请求
                xhr.send();
            });
        });
    }

})();