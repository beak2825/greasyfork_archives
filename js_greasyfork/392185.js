// ==UserScript==
// @name         全网VIP视频解析, 视频去广告, 支持优酷、腾讯、爱奇艺、芒果、PPTV等全网VIP视频 2020/01/10 更新
// @namespace    https://greasyfork.org/zh-CN/scripts/392185-%E5%85%A8%E7%BD%91vip%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90
// @version      1.3
// @description  VIP视频解析集合；支持【爱奇艺，优酷视频，乐视TV，腾讯视频，土豆视频，搜狐视频，PPTV，M1905，暴风影音，哔哩哔哩，咪咕视频】等全网VIP视频，此脚本根据其他脚本修改而来，只是为了自己使用方便所以做了些修改并集成了一下。
// @author       tianjianjun
// @icon         https://create-react-app.dev/img/logo.svg
// @match        *://m.youku.com/v*
// @match        *://m.youku.com/a*
// @match        *://v.youku.com/v_*
// @match        *://*.iqiyi.com/v_*
// @match        *://*.iqiyi.com/w_*
// @match        *://*.iqiyi.com/a_*
// @match        *://*.iqiyi.com/adv*
// @match        *://*.le.com/ptv/vplay/*
// @match        *://v.qq.com/x/cover/*
// @match        *://v.qq.com/cover*
// @match        *://v.qq.com/x/page/*
// @match        *://v.qq.com/play*
// @match        *://*.tudou.com/listplay/*
// @match        *://*.tudou.com/albumplay/*
// @match        *://*.tudou.com/programs/view/*
// @match        *://*.tudou.com/v/*
// @match        *://*.mgtv.com/b/*
// @match        *://film.sohu.com/album/*
// @match        *://tv.sohu.com/v/*
// @match        *://*.pptv.com/show/*
// @match        *://*.wasu.cn/Play/show/*
// @match        *://vip.1905.com/play/*
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/anime/*
// @match        *://*.bilibili.com/bangumi/play/*
// @match        *://*.baofeng.com/play/*
// @match        *://*.miguvideo.com/wap/resource/pc/detail/*
// @match        *://*.miguvideo.com/mgs/website/prd/detail*
// @match        *://*.wasu.cn/Play/show*
// @match        *://*.wasu.cn/Play/show/*
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @license      MIT2.0
// @downloadURL https://update.greasyfork.org/scripts/392185/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%2C%20%E8%A7%86%E9%A2%91%E5%8E%BB%E5%B9%BF%E5%91%8A%2C%20%E6%94%AF%E6%8C%81%E4%BC%98%E9%85%B7%E3%80%81%E8%85%BE%E8%AE%AF%E3%80%81%E7%88%B1%E5%A5%87%E8%89%BA%E3%80%81%E8%8A%92%E6%9E%9C%E3%80%81PPTV%E7%AD%89%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%2020200110%20%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/392185/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%2C%20%E8%A7%86%E9%A2%91%E5%8E%BB%E5%B9%BF%E5%91%8A%2C%20%E6%94%AF%E6%8C%81%E4%BC%98%E9%85%B7%E3%80%81%E8%85%BE%E8%AE%AF%E3%80%81%E7%88%B1%E5%A5%87%E8%89%BA%E3%80%81%E8%8A%92%E6%9E%9C%E3%80%81PPTV%E7%AD%89%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%2020200110%20%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==
(function () {
    'use strict';
    let urlList = [/chinese-elements.com/i, /tv.wandhi.com/i, /tv.oopw.top/i], currentUrl = window.location.href,
        bool = true;
    for (let i = 0; i < urlList.length; i++) {
        if (urlList[i].test(currentUrl)) {
            bool = false;
            break;
        }
    }

    if (bool) {
        let style = document.createElement("style");
        style.appendChild(document.createTextNode(`
        .aside-nav {
            position: fixed;
            top: 350px;
            width: 240px;
            height: 240px;
            user-select: none;
            opacity: .75;
            z-index: 999999;
            margin: 0;
            font-size: 1.6rem;
            color: #4E546B
        }

        .aside-nav.no-filter {
            filter: none
        }

        .aside-nav .aside-menu {
            position: absolute;
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: #f34444;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            text-align: center;
            line-height: 70px;
            color: #fff;
            font-size: 20px;
            z-index: 1;
            cursor: move;
            transition: all linear 0.8s;
            box-shadow: 0 0 0 20px transparent;
        }

        .aside-nav:hover .aside-menu {
            box-shadow: 0 0 0 0 #fff;
        }


        .aside-nav .menu-item {
            position: absolute;
            width: 60px;
            height: 60px;
            background-color: #FF7676;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            line-height: 60px;
            text-align: center;
            -webkit-border-radius: 50%;
            border-radius: 50%;
            text-decoration: none;
            color: #fff;
            transition: transform 0.6s, background 0.75s, box-shadow 1.2s, scale 1.2s;
            font-size: 14px;
            box-sizing: border-box;
            cursor: pointer;
            box-shadow: 0 0 0 20px transparent;
        }

        .aside-nav .menu-item:hover {
            background: #A9C734;
            box-shadow: 0 0 0 0 #fff;
            transform: scale(1.1);
        }

        .aside-nav .menu-line {
            line-height: 20px;
            padding-top: 10px;
        }

        .aside-nav .none {
            display: none;
        }

        .aside-nav:hover {
            opacity: 1;
        }

        .aside-nav:hover .aside-menu {
            animation: jello 1.2s
        }

        .aside-nav:hover .menu-first {
            transform: translate3d(0, -135%, 0)
        }

        .aside-nav:hover .menu-second {
            transform: translate3d(120%, -70%, 0)
        }

        .aside-nav:hover .menu-third {
            transform: translate3d(120%, 70%, 0)
        }

        .aside-nav:hover .menu-fourth {
            transform: translate3d(0, 135%, 0)
        }

        .aside-nav:hover .menu-fifth {
            transform: translate3d(-120%, 70%, 0)
        }

        .aside-nav:hover .menu-sixth {
            transform: translate3d(-120%, -70%, 0)
        }

        @keyframes jello {
            from, 11.1%, to {
                transform: none
            }
            22.2% {
                transform: skewX(-12.5deg) skewY(-12.5deg)
            }
            33.3% {
                transform: skewX(6.25deg) skewY(6.25deg)
            }
            44.4% {
                transform: skewX(-3.125deg) skewY(-3.125deg)
            }
            55.5% {
                transform: skewX(1.5625deg) skewY(1.5625deg)
            }
            66.6% {
                transform: skewX(-.78125deg) skewY(-.78125deg)
            }
            77.7% {
                transform: skewX(0.390625deg) skewY(0.390625deg)
            }
            88.8% {
                transform: skewX(-.1953125deg) skewY(-.1953125deg)
            }
        }

        .animated {
            animation-duration: 1s;
            animation-fill-mode: both
        }

        @keyframes bounceInUp {
            from, 60%, 75%, 90%, to {
                animation-timing-function: cubic-bezier(0.215, .61, .355, 1)
            }
            from {
                opacity: 0;
                transform: translate3d(0, 800px, 0)
            }
            60% {
                opacity: 1;
                transform: translate3d(0, -20px, 0)
            }
            75% {
                transform: translate3d(0, 10px, 0)
            }
            90% {
                transform: translate3d(0, -5px, 0)
            }
            to {
                transform: translate3d(0, 0, 0)
            }
        }

        .bounceInUp {
            animation-name: bounceInUp;
            animation-delay: 1s
        }

        @media screen and (max-width: 640px) {
            .aside-nav { /* display: none!important */
            }
        }

        @media screen and (min-width: 641px) and (max-width: 1367px) {
            .aside-nav {
                top: 50px
            }
        }

        `));
        document.head.appendChild(style);
        let temp = document.createElement('div');
        temp.className = 'aside-nav';
        temp.innerHTML = `<div class="aside-menu">VIP</div>
            <div class="menu-item menu-line menu-first" data-url="http://nitian9.com/?url=" data-encode="1">逆天<br>解析</div>
            <div class="menu-item menu-line menu-second" data-url="https://chinese-elements.com/v.html?zwx=" data-encode="">
                少年<br>的你
            </div>
            <div class="menu-item menu-line menu-third" data-url="http://tv.wandhi.com/go.html?url=" data-decode="">玩的<br>嗨TV
            </div>
            <div class="menu-item menu-line menu-fourth" data-url="http://jx.618g.com/?url=" data-decode="">618G<br>解析
            </div>
            <div class="menu-item menu-line menu-fifth" data-url="https://660e.com/?url=" data-encode="1">乐乐<br>云</div>
            <div class="menu-item menu-line menu-sixth" data-url="https://beaacc.com/api.php?url=" data-encode="1">beaacc<br>解析</div>
        `;
        document.body.appendChild(temp);
        let els = [...document.querySelectorAll('.menu-item')];
        els.map(item => {
            if (!item.classList.contains('none')) {
                item.addEventListener('click', e => {
                    let url = e.target.getAttribute('data-url');
                    if (e.target.getAttribute('data-encode')) {
                        url += encodeURI(currentUrl);
                    } else {
                        url += currentUrl;
                    }
                    window.open(url);
                })
            }
        });

    }
})();

