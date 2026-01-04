// ==UserScript==
// @name             VIP视频解析助手
// @namespace        vip_video_helper
// @version          2.0.1
// @icon             data:image/png;base64,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
// @description      支持优酷、爱奇艺、乐视、腾讯视频、芒果TV、搜狐、土豆、A站、B站、PPTV、1905，适配桌面端和移动端。
// @license          MIT
// @author           Subdue
// @supportURL       https://github.com/Subdue0/tampermonkey_scripts
// @match            *://*.iqiyi.com/v_*
// @match            *://*.v.qq.com/x/cover/*
// @match            *://*.v.qq.com/cover/*
// @match            *://m.v.qq.com/x/m/play?cid=*
// @match            *://m.v.qq.com/play.html?cid=*
// @match            *://*.mgtv.com/b/*
// @match            *://*.bilibili.com/video/*
// @match            *://*.bilibili.com/bangumi/play/*
// @match            *://v.youku.com/v_*
// @match            *://m.youku.com/video/id_**
// @match            *://m.youku.com/alipay_video/id_**
// @match            *://www.le.com/ptv/vplay/*
// @match            *://m.le.com/vplay_*
// @match            *://*.tv.sohu.com/v*
// @match            *://film.sohu.com/album/*
// @match            *://m.tv.sohu.com/phone_play_film?aid=*
// @match            *://*.pptv.com/show/*
// @match            *://*.tudou.com/v/*
// @match            *://*.acfun.cn/v/*
// @match            *://*.acfun.cn/bangumi/aa*
// @match            *://vip.1905.com/play/*
// @require          https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @run-at           document-idle
// @grant            unsafeWindow
// @grant            GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/437204/VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/437204/VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
/* eslint-disable no-undef */


(function () {
    'use strict';


    //移动端，默认解析api接口
    let default_api = 'https://api.okjx.cc:3389/jx.php?url=';

    //可自行增减解析api接口
    let api = [
        {name: '小小解析', url: 'https://jx.parwix.com:4433/player/?url='},
        {name: '全网解析', url: 'https://api.jiexi.la/?url='},
        {name: '8090解析', url: 'https://www.8090g.cn/jiexi/?url='},
        {name: '1717云解析', url: 'https://www.1717yun.com/jx/ty.php?url='},
        {name: '17k云解析', url: 'https://17kyun.com/api.php?url='},
        {name: 'OK解析', url: 'https://api.okjx.cc:3389/jx.php?url='},
        {name: 'CK解析', url: 'https://www.ckmov.vip/api.php?url='},
        {name: 'admin解析', url: 'https://www.administratorw.com/index.php?url='},
        {name: '89解析', url: 'https://api.8bys.cn/89/?url='},
        {name: 'bl解析', url: 'https://vip.bljiex.cc/?v='},
        {name: 'h8解析', url: 'https://www.h8jx.com/jiexi.php?url='},
        {name: 'TV解析', url: 'https://jx.m3u8.tv/jiexi/?url='},
        {name: 'Mao解析', url: 'https://www.mtosz.com/m3u8.php?url='},
        {name: '虾米解析', url: 'https://jx.xmflv.com/?url='},
        {name: '夜幕解析', url: 'https://www.yemu.xyz/?url='},
    ];


    GM_addStyle(`
        * {
            margin:0;
            padding:0
        }

        #container #icon-play {
            position: fixed;
            top: 50%;
            right: 3%;
            z-index: 999;
            transform: translateY(-50%);
            min-width: 40px;
            min-height: 46px;
        }

        #container #icon-play #triangle-right {
            position: absolute;
            border-left: 40px solid skyblue;
            border-top: 23px solid transparent;
            border-bottom: 23px solid transparent;
        }

        #container #api-list {
            display: none;
            position: fixed;
            top: 50%;
            right: 0;
            z-index: 9999;
            transform: translateY(-50%);
        }

        #container #api-list ol {
            counter-reset: li;
            list-style: none;
            font-size: 14px;
        }

        #container #api-list a {
            display: block;
            position: relative;
            margin: 1em 0;
            padding: 5px 15px 5px 25px;
            background: #ddd;
            color: #444;
            border-radius: 0 1em 1em 0;
            transition: all 0.3s ease-out;
            cursor: pointer;
            text-align: center;
            text-decoration: none;
        }

        #container #api-list a:hover {
            background: #eee;
            color: #ff6f5c;
            transition: all 0.3s ease-out;
        }

        #container #api-list a::before {
            content: counter(li);
            counter-increment: li;
            position: absolute;
            left: -1.2em;
            top: 50%;
            margin-top: -1.2em;
            background: skyblue;
            width: 2em;
            height: 2em;
            line-height: 2em;
            border-radius: 2em;
            border: 0.2em solid #fff;
            text-align: center;
            font-weight: bold;
            text-shadow: -1px -1px white;
        }
    `);


    let main = {
        showButton: function () {
            if (location.host.match(/youku|iqiyi|le|qq|mgtv|sohu|tudou|acfun|bilibili|pptv|1905/ig)) {
                let mainActivity = `
                    <div id="container">
                        <div id="icon-play">
                            <i id="triangle-right"></i>
                        </div>
                        <div id="api-list">
                            <ol></ol>
                        </div>
                    </div>
                `;

                $(document.body).append(mainActivity);

                api.forEach((val, index) => {
                    $('#container #api-list ol').append(`<li><a title="点击使用该接口解析VIP视频" target="_blank" onclick="this.href='${val.url}' + location.href">${val.name}</a></li>`);
                });

                //排除方向旋转的情况，粗略判断用户正在使用移动设备
                if (screen.width < screen.height) {
                    //移动端，双击直接使用默认接口
                    $(document.body).on('dblclick', '#container #icon-play', () => {
                        open(default_api + location.href);
                    });

                    //移动端，长按1s播放按钮，弹出解析菜单
                    let timeout;
                    $(document.body).on('touchstart', '#container #icon-play', () => {
                        timeout = setTimeout(function() {
                            $('#container #icon-play').fadeOut('fast');
                            $('#container #api-list').fadeIn('slow');
                        }, 1000);
                    });
                    $(document.body).on('touchend', '#container #icon-play', () => {
                        clearTimeout(timeout);
                    });
                    $(document.body).on('touchmove', '#container #icon-play', () => {
                        clearTimeout(timeout);
                    });

                    //移动端，滑动菜单，菜单消失
                    $(document.body).on('touchmove', '#container #api-list ol', () => {
                        $('#container #api-list').fadeOut('fast');
                        $('#container #icon-play').fadeIn('slow');
                    });
                } else {
                    //PC端，鼠标在播放按钮上方悬浮，弹出菜单
                    $(document.body).on('mouseenter', '#container #icon-play', () => {
                        $('#container #icon-play').fadeOut('fast');
                        $('#container #api-list').fadeIn('slow');
                    });

                    //PC端，鼠标划出菜单，菜单消失
                    $(document.body).on('mouseleave', '#container #api-list ol', () => {
                        $('#container #api-list').fadeOut("fast");
                        $('#container #icon-play').fadeIn("slow");
                    });
                }
            }
        }
    };

    $(function () {
        main.showButton();
    });
})();