// ==UserScript==
// @name         橘二八的快乐生活
// @namespace    YoungYang
// @version      0.2
// @description  橘二八的定制脚本-B站点赞,下载某网站视频
// @author       You
// @match        *://*.bilibili.com/*
// @match        *://*.pornhub.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467498/%E6%A9%98%E4%BA%8C%E5%85%AB%E7%9A%84%E5%BF%AB%E4%B9%90%E7%94%9F%E6%B4%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/467498/%E6%A9%98%E4%BA%8C%E5%85%AB%E7%9A%84%E5%BF%AB%E4%B9%90%E7%94%9F%E6%B4%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentURL = window.location.href;

    // initBilibili
    let initBilibili = function(){

        // 判断是不是视频页面
        let regex = new RegExp("(www\.)?bilibili.com/video/[a-zA-Z0-9]+/");
        
        if( !regex.test(currentURL) ){
            return;
        }
        
        // 添加绑定事件
        let _wr = function(type) {
            let orig = history[type];
            return function() {
                let rv = orig.apply(this, arguments);
                let e = new Event(type);
                e.arguments = arguments;
                window.dispatchEvent(e);
                return rv;
            };
        };
        history.pushState = _wr('pushState');
        history.replaceState = _wr('replaceState');

        // 防抖
        let timeout = null;
        let debounce = function(func, wait = 2000, immediate = false) {
            if (timeout !== null) clearTimeout(timeout);
            if (immediate) {
                var callNow = !timeout;
                timeout = setTimeout(function() {
                    timeout = null;
                }, wait);
                if (callNow) typeof func === 'function' && func();
            } else {
                timeout = setTimeout(function() {
                    typeof func === 'function' && func();
                }, wait);
            }
        }

        // 点赞
        let clickLike = function(){
            let curLike = document.querySelector(".video-like.video-toolbar-left-item");
            if (curLike) {
                if ( curLike.classList.contains('on') ) {
                    console.log('已经点赞');
                } else {
                    console.log('没有点赞,正在点赞');
                    curLike.click();
                }
            }
        }

        // 检测是否登录
        let UserInterval = setInterval(function(){
            let userImg = document.querySelector(".bili-header .header-entry-mini .v-img");
            if (userImg) {
                debounce(clickLike);
                window.addEventListener('replaceState', function(e) {
                    debounce(clickLike);
                });
                window.addEventListener('pushState', function(e) {
                    debounce(clickLike);
                });
                clearInterval(UserInterval);
            }
        },1000);

    };


    // initPornhub
    let initPornhub = function(){

        // 判断是不是视频页面
        let regex = new RegExp('pornhub\\.com/view_video\\.php\\?viewkey=');
        
        if( !regex.test(currentURL) ){
            return;
        }

        // 页面所需的CSS
        let initStyles = function () {
            let style = document.createElement("style");
            style.appendChild(document.createTextNode(`
                div#__draw__Pane {
                    position: relative;
                    z-index: 9999;
                }
                div#__draw__Pane .__button{
                    position: fixed;
                    left: 50px;
                    top: 50%;
                    transform: translate3d(-50%, -50%, 0);
                    background: #fff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 20px;
                    color: #000;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                }
                div#__draw__Pane .__pane{
                    display: none;
                    position: fixed;
                    left: 50%;
                    top: 50%;
                    background: #fff;
                    padding: 20px;
                    color: #000;
                    font-size: 20px;
                    transform: translate3d(-50%, -50%, 0);
                }
                div#__draw__Pane .__pane.on{
                    display: block;
                }
            `));
            document.head.appendChild(style);
        }

        // 绘制表格 draw Pane
        let drawPane = function(infos, id){
            let dom = document.getElementById(id);
            if (!dom) {
                dom = document.createElement("div");
                dom.id = id;
                dom.innerHTML = `
                    <div class="__button">D</div>
                    <div class="__pane">
                        <table>
                            <tr>
                                <th>质量</th>
                                <th>下载地址</th>
                            </tr>
                            ${infos
                            .map(
                                (item) => `
                                <tr>
                                    <td>${item.quality}</td>
                                    <td><a href="${item.videoUrl}" onclick="javascript:return false">右键另存为</a></td>
                                </tr>
                            `
                            )
                            .join("")}
                        </table>
                    </div>
                `;

                document.body.appendChild(dom);

                let __button = document.querySelector(`#${id} .__button`);
                let __pane = document.querySelector(`#${id} .__pane`);

                __button.addEventListener('click', function() {
                    if ( __pane.classList.contains('on') ) {
                        __pane.classList.remove("on");
                    } else {
                        __pane.classList.add("on");
                    }
                });
                
            };
            
        }

        // 获取所有视频信息
        let videosInfo = eval(
            Object.keys(window).filter((item) => item.indexOf("flashvars_") == 0)[0]
        ).mediaDefinitions;

        // 获取所有视频信息
        let mp4Url = videosInfo.filter((item) => item.format == "mp4")[0].videoUrl;
        fetch(mp4Url)
        .then((data) => data.json())
        .then((data) => {
          console.table(
            data.map((item) => ({ 质量: item.quality, 地址: item.videoUrl }))
          );
          initStyles();
          drawPane(data, "__draw__Pane");
        })
        // .catch((error) => {
        //   alert("视频详情获取失败");
        //   console.error(error);
        // });
    }




    // 初始化
    let currentHostName = window.location.hostname;
    let regexUrl = {
        "bilibili": /bilibili.com/,
        "pornhub": /pornhub.com/,
    }


    if( regexUrl.bilibili.test(currentHostName) ){
        initBilibili();
    }

    if( regexUrl.pornhub.test(currentHostName) ){
        initPornhub();
    }

})();