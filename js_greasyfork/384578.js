// ==UserScript==
// @name         [timerd][网络电视] 腾讯、爱奇艺、芒果、优酷、乐视、B站、土豆、搜狐、1905等 VIP视频免费看(2021.03.24)更新
// @name:en      [timerd][The Eight Hundred] VIP Video tencent, iqiyi, mgtv, youku, Blibili, sohu, tudou (2021.03.24)
// @namespace    http://timerd.ml
// @version      2021.03.24
// @description  腾讯、爱奇艺、芒果、优酷、乐视、B站、土豆、搜狐、1905等各大视频网站视频解析服务(有谷歌ads)
// @description:en  tencent, iqiyi, mgtv, youku, letv, Bilibili, sohu, tudou, 1905(Containing google ads)
// @author       timerd
// @include      *://v.youku.com/v_*
// @include      *://m.youku.com/v*
// @include      *://m.youku.com/a*
// @include      *://*.iqiyi.com/v_*
// @include      *://*.iqiyi.com/w_*
// @include      *://*.iqiyi.com/a_*
// @include      *://*.iqiyi.com/dianying/*
// @include      *://*.le.com/ptv/vplay/*
// @include      *://*v.qq.com/x/cover/*
// @include      *://*v.qq.com/x/page/*
// @include      *://*v.qq.com/play*
// @include      *://*v.qq.com/cover*
// @include      *://*.tudou.com/listplay/*
// @include      *://*.tudou.com/albumplay/*
// @include      *://*.tudou.com/programs/view/*
// @include      *://*.tudou.com/v*
// @include      *://*.mgtv.com/b/*
// @include      *://film.sohu.com/album/*
// @include      *://tv.sohu.com/*
// @include      *://*.bilibili.com/video/*
// @include      *://*.bilibili.com/anime/*
// @include      *://*.bilibili.com/bangumi/play/*
// @include      *://*.pptv.com/show/*
// @include      *://*.wasu.cn/Play/show*
// @include      *://*.1905.com/play/*
// @include      *://chinese-elements.com/*
// @require      http://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @license      MIT2.0
// @downloadURL https://update.greasyfork.org/scripts/394492/%5Btimerd%5D%5B%E7%BD%91%E7%BB%9C%E7%94%B5%E8%A7%86%5D%20%E8%85%BE%E8%AE%AF%E3%80%81%E7%88%B1%E5%A5%87%E8%89%BA%E3%80%81%E8%8A%92%E6%9E%9C%E3%80%81%E4%BC%98%E9%85%B7%E3%80%81%E4%B9%90%E8%A7%86%E3%80%81B%E7%AB%99%E3%80%81%E5%9C%9F%E8%B1%86%E3%80%81%E6%90%9C%E7%8B%90%E3%80%811905%E7%AD%89%20VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B%2820210324%29%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/394492/%5Btimerd%5D%5B%E7%BD%91%E7%BB%9C%E7%94%B5%E8%A7%86%5D%20%E8%85%BE%E8%AE%AF%E3%80%81%E7%88%B1%E5%A5%87%E8%89%BA%E3%80%81%E8%8A%92%E6%9E%9C%E3%80%81%E4%BC%98%E9%85%B7%E3%80%81%E4%B9%90%E8%A7%86%E3%80%81B%E7%AB%99%E3%80%81%E5%9C%9F%E8%B1%86%E3%80%81%E6%90%9C%E7%8B%90%E3%80%811905%E7%AD%89%20VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B%2820210324%29%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==
(function() {

    'use strict'
    // Define region
    //-------------------------------------------------------------
    function addInfrastructure() {
        let style = document.createElement("style");

        style.appendChild(document.createTextNode(`
        #mywidget {
            position: relative;
            animation: mywidget_ani 2s 1;
            border-radius: 8px;
            background: transparent;
        }

        #mywidget a {
            position: absolute;
            left: -75px;
            transition: 0.3s;
            padding: 15px 30px 15px 15px;
            text-decoration: none;
            color: white !important;
            border-radius: 8px;
            font: 20px "Microsoft YaHei", SimHei, helvetica, arial, verdana, tahoma, sans-serif;
            min-width: 80px;
            text-align: right;
            white-space: nowrap;
        }


        #mywidget a:hover {
            left: -8px;
        }

        #vparse {
            background-color: #f44336;
        }

        #myplaybutton {
            position: absolute;
            right: -8px;
            top: 14px;
            width: 0px;
            height: 0px;
            margin: 0px;
            border-width: 16px;
            border-style: solid;
            border-color: transparent transparent transparent white;
        }


        @keyframes mywidget_ani {
            0% {
                transform: rotate(0deg);
                left: 20px;
            }

            50% {
                transform: rotate(8deg);
                left: 500px;
            }

            100% {
                transform: rotate(-360deg);
                left: 0px;
            }
        }`));

        document.head.appendChild(style);
    }

    function tricks() {
        window.addEventListener('message', function(event) {
            if (~event.origin.indexOf('chinese-elements.com')) {
                var intervalId = window.setInterval(function() {
                    $("#aside-nav").hide();
                    window.clearInterval(intervalId)
                }, 1000 * 2);
            } else {
                return;
            }
        });
        const im = /chinese-elements.com/i;
        if (im.test(self.location.href)) {
            var intervalId = window.setInterval(function() {
                $("#aside-nav").hide();
                window.clearInterval(intervalId);
                try {
                    var frame = document.getElementById("player");
                    if (frame && frame.hasOwnProperty('contentWindow')) {
                        var iframeWindow = frame.contentWindow;
                        iframeWindow.postMessage("tricks", "*");
                    }

                } catch (e) {
                    console.log(e);
                }
            }, 1000 * 2);
        }
    }

    //-------------------------------------------------------------
    let playurl = window.location.href;
    let rArray = playurl.split('?');
    let cWeb = rArray[0];
    const vSite = /m1907.cn/i;
    //-------------------------------------------------------------

    // Little tricks
    tricks();
    if (vSite.test(cWeb)) {
        window["alert"] = function(e) {};
        return;
    }
    //------------------------------------------------------------

    //add a button to current website.
    const vWebsites = new Array();
    vWebsites[0] = /youku.com/i;
    vWebsites[1] = /iqiyi.com/i;
    vWebsites[2] = /le.com/i;
    vWebsites[3] = /qq.com/i;
    vWebsites[4] = /tudou.com/i;
    vWebsites[5] = /mgtv.com/i;
    vWebsites[6] = /sohu.com/i;
    vWebsites[7] = /1905.com/i;
    vWebsites[8] = /bilibili.com/i;
    vWebsites[9] = /pptv.com/i;
    vWebsites[10] = /yinyuetai.com/i;
    vWebsites[11] = /wasu.cn/i;
    vWebsites.every((item) => {
        if (item.test(cWeb)) {
            addInfrastructure();
            var jumpButton = $(`
            <div id="mywidget" href='javascript:void(0)' target='_blank' style="z-index:9999; position:fixed;left:0px;top:280px;">
                <a href="#" id="vparse">❀视频解析<div id="myplaybutton"></div></a>
            </div>
            `);

            $("body").append(jumpButton);

            // bind onclick event
            $("#mywidget").click(function() {
                var openUrl = window.location.href;
                window.open('https://timerd.me/static/tv.html?zwx=' + openUrl);
            });
            return false;
        }
        return true;
    });

})();
