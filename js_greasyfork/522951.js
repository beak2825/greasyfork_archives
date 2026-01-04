// ==UserScript==
// @name           稀饭视频解析
// @namespace      稀饭视频解析
// @version           0.0.2.5
// @description        vip视频解析,【内嵌解析+带弹幕】, 支持：腾讯视频、爱奇艺、优酷、芒果TV、搜孤、哔哩哔哩、等网站会员视频解析，安装后在播放页左侧边上会出现一个vip标识，鼠标放上去会自动滑出功能界面，每个按钮代表不同解析接口，解析失败可选择其他按钮试试
// @author            1771245847
// @icon              data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACS0lEQVRYR8WXz2oTURTGv3MnpqhNKy1UWmxRTGdaiLSQRKkKIoK4FVrRPoHu7BMYn0B3+gQquuiuiC6kaFVsAhGEZkKqG/+Vrtp0YWsyR27KlEwz0xnnT3LgwjB37vl+97tzz9whdDiow/pwBCjofN0AJohwKQgkMxYF8Dmt0bxdnhaAQoWTXMczENJBhFvGMgqk4GY6SZXmPgvAmy/cnYijGqrwvmTVHSQup2jLvG0ByJf5EYDbUQIAeJxR6U4LQHGV1VodesTijfQxBdrkaSrL6z0Hlst8i4An7QBgYDar0lMrgM45ItxrCwDjflajnC+AtR8Gvn8zGpz9xwVOjor/Zma/ANt/GIsLNWxt8p7o4IiAmlLQP+C9pvkG+FoyUPxYs52xhFDPKIh3uRviG2ClWIdsTpHoJYymFNdliQzABBsaEZg4p+DwUftliRxAggwOC0xdidma1RaAI92Ea9OHOgcwPqlANruI1AElhsa2dBKXQJEBnDglGlvxWN/BNcE3gKyCS69b64AUlMISwEv4BpDJ3778i/Xfu5XQtFtaLq+9RiCA6gZj/dcuQN8Audod6kvodYZuz9k7UOK7JPDAbXAY/WxgLjtGDy2f408VPi8MLIUh4JbDELhwNknvLQDyQNoTh87AkFuCIP0E/NzcgWYeTC0bdrkNp6Lm9bc4YM4qr/NzEGaCzNJxLONFRqMbzf22JSu/wlcphhwzpsIAIcIHriGXGadX+/MdWDPflTjRxcH+kLYJhYtj5Piz4/0gF4YVNjk6DvAPDb0aMEr8/nEAAAAASUVORK5CYII=
// @match             *://v.qq.com/x/cover/*
// @match             *://v.qq.com/x/page/*
// @match             *://www.iqiyi.com/v*
// @match             *://v.youku.com/v_show/*
// @match             *://www.mgtv.com/b/*
// @match             *://tv.sohu.com/v/*
// @match             *://film.sohu.com/album/*
// @match             *://www.le.com/ptv/vplay/*
// @match             *://video.tudou.com/v/*
// @match             *://v.pptv.com/show/*
// @match             *://vip.pptv.com/show/*
// @match             *://www.fun.tv/vplay/*
// @match             *://www.acfun.cn/v/*
// @match             *://www.bilibili.com/video/*
// @match             *://www.bilibili.com/anime/*
// @match             *://www.bilibili.com/bangumi/play/*
// @match             *://vip.1905.com/play/*
// @match             *://www.wasu.cn/Play/show/*
// @match             *://www.56.com/*
// @match             *://m.v.qq.com/x/cover/*
// @match             *://m.v.qq.com/x/page/*
// @match             *://m.v.qq.com/*
// @match             *://m.iqiyi.com/v_*
// @match             *://m.iqiyi.com/w_*
// @match             *://m.iqiyi.com/a_*
// @match             *://m.youku.com/alipay_video/*
// @match             *://m.youku.com/video/id_*
// @match             *://m.mgtv.com/b/*
// @match             *://m.tv.sohu.com/v/*
// @match             *://m.film.sohu.com/album/*
// @match             *://m.le.com/ptv/vplay/*
// @match             *://m.pptv.com/show/*
// @match             *://m.bilibili.com/video/*
// @match             *://m.bilibili.com/anime/*
// @match             *://m.bilibili.com/bangumi/play/*
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/522951/%E7%A8%80%E9%A5%AD%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/522951/%E7%A8%80%E9%A5%AD%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==
 
/*
* 解析接口皆从互联网收集，切勿用于商业用途，侵删 ！
*/
 
(function () {
    'use strict';
    var div = document.createElement("div");
    if (window == top) {
        document.body.appendChild(div);
    };
    div.innerHTML = `
    <div class="box_1">
        <div class="box_2">
            <h2>解析不播放，请切换解析线路</h2>
            <p>&nbsp; 联系邮箱: 3473224711@qq.com </p>
        </div>
        <div class="box_3"></div>
        <i class="up-new"></i>
    </div>
    <style>
    .box_1 {
            position: fixed;
            top: 130px;
            left: -170px;
            height: 340px;
            width: 160px;
            padding: 3px;
            z-index: 99999;
            transition: 1s;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            border: hidden;
            border-radius: 8px;
            background: linear-gradient(#8c7bfd, #8c7bfd, #8c7bfd);
        }
 
        .box_2 {
            width: 95%;
            height: 80px;
            margin: 4px;
            color: #10a1be;
            background: linear-gradient(#8c7bfd, #8c7bfd, #8c7bfd);
            outline: 2px solid #ffffff;
            font-size: 12px;
            cursor: no-drop;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
        }
 
        .box_3 {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
        }
 
        .box_3 input {
            display: none;
        }
 
        .box_3 label {
            width: 50px;
            height: 24px;
            margin: 5px;
            padding: 3px;
            border: hidden;
            box-sizing: border-box;
            border-radius: 6px;
            background: linear-gradient(#8c7bfd, #8c7bfd, #8c7bfd);
            border-color: #ffffff;
            outline: 3px solid #8c7bfd;
            text-align: center;
            cursor: pointer;
            font-size: 10px;
            line-height: 12px;
            color: rgb(255, 255, 255);
        }
 
        input[name="drone"]:hover+label {
            background: #ff0000;
        }
 
        input[name="drone"]:checked+label {
            color: #ff544c;
            background: #ff0000;
        }
 
        .box_2 h2 {
            position: absolute;
            top: 20px;
            font-size: 12px;
            font-weight: bold;
        }
 
        .box_2 p {
            position: absolute;
            top: 55px;
            width: 12em;
            white-space: nowrap;
            overflow: hidden;
            text-shadow: 0 1px hsl(202, 85%, 61%),
                0 1px hsl(199, 80%, 56%),
                0 2px 4px rgba(34, 156, 226, 0.603);
            border-right: 2px solid transparent;
            animation: typing 6s;
            animation-iteration-count: infinite;
        }
 
        @keyframes typing {
            from {
                width: 0;
            }
 
            to {
                width: 12em;
            }
        }
 
        .up-new {
            position: absolute;
            top: 36px;
            width: 30px;
            height: 34px;
            right: -28px;
            z-index: 99999;
            cursor: pointer;
            background: url(https://pic.rmb.bdstatic.com/bjh/a1f76ba9e3f2388041bc2732f56cdd45.png) no-repeat;
        }
        </style>`
    var Interface = [
        { name: "稀饭解析", id: "awesome1", url: "https://jx.cqzaj.com/player/ec.php?code=xifan&if=1&url=" },
        { name: "夜幕解析", id: "awesome2", url: "https://www.yemu.xyz/?url=" },
        { name: "M3U8", id: "awesome3", url: "https://jx.m3u8.tv/jiexi/?url=" },
        { name: "虾米解析", id: "awesome4", url: "https://jx.xmflv.com/?url=" },
        { name: "HLS解析", id: "awesome5", url: "https://jx.hls.one/?url=" },
        { name: "剖云解析", id: "awesome6", url: "https://www.pouyun.com/?url=" },
        { name: "盘古解析", id: "awesome7", url: "https://www.pangujiexi.com/jiexi/?url=" },
        { name: "解析啦", id: "awesome7", url: "https://www.jiexila.com/?url=" },
    ]
    var box1 = document.querySelector('.box_1');
    var box3 = document.querySelector('.box_3');
    for (var i in Interface) {
        let inputs = document.createElement('input');
        let label = document.createElement('label');
        box3.appendChild(inputs);
        box3.appendChild(label);
        inputs.type = 'radio';
        inputs.name = "drone";
        inputs.id = Interface[i].id;
        label.htmlFor = Interface[i].id;
        label.innerHTML = Interface[i].name;
    }
    box1.addEventListener('mouseenter', () => {
        box1.style.left = "2px";
    })
    box1.addEventListener('mouseleave', () => {
        box1.style.left = "-170px";
    })
    var player_ids = [
        { url: "v.qq.com", id: "#player" },
        { url: "www.iqiyi.com", id: "#flashbox" },
        { url: "v.youku.com", id: "#player" },
        { url: "w.mgtv.com", id: "#mgtv-player-wrap" },
        { url: "www.mgtv.com", id: "#mgtv-player-wrap" },
        { url: "tv.sohu.com", id: "#player" },
        { url: "film.sohu.com", id: "#playerWrap" },
        { url: "www.le.com", id: "#le_playbox" },
        { url: "v.pptv.com", id: "#pptv_playpage_box" },
        { url: "vip.pptv.com", id: ".w-video" },
        { url: "vip.1905.com", id: "#player" },
        { url: "www.bilibili.com", id: "#bilibili-player" }
    ]
    for (let t in player_ids) {
        if (player_ids[t].url == location.host) {
            var ids = document.querySelector(player_ids[t].id);
        }
    }
    var iframe = `
            <iframe id='iframe-player' frameborder='0' allowfullscreen='true'></iframe>
            <style>
            #iframe-player{
                height: 100%;
                width: 100%;
                z-index: 99999;
            }
            </style>`
    var labels = document.querySelectorAll('.box_3 label');
    for (let h = 0; h < labels.length; h++) {
        labels[h].addEventListener('click', () => {
            ids.innerHTML = iframe;
            var iframe_player = document.querySelector('#iframe-player');
            iframe_player.src = Interface[h].url + location.href;
        })
    }
})();

