// ==UserScript==
// @name              VIP视频全网解析
// @version           1.0.9
// @description       支持腾讯视频、爱奇艺、优酷、土豆、芒果TV、搜狐视频、乐视视频、PPTV、风行、华数TV、哔哩哔哩等，支持多个解析接口切换，自动解析视频，支持视频广告跳过。
// @author            远川の光
// @namespace
// @icon              data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABB0lEQVR42r2VCw7CIAxAWzQuelsv4ml12XSAhZQFl0L3cWvSwFjhtRQKeu9bALgiCbDQmOfuQHqGuow2whpPpLajTlMAWNKTAhhthDU6zBbbRY4D7LRFfQ3geXJIoCM1PIYTQC3JrRZBfooGIRqcA4gThZ/R6zCegI7EmBBIjAY4ogSSAFZNcppEZg9q7jz84WgMKFIDvEkvuVcCKG0bqoBCknEKKICgsIZ6TKEE0GwPBYSzbpYCFm9RMUn/SnJmnO7Az+URPLaZfQI47ttx/pwcCFHm3w7KtUgFlB6c/AbXSsVqQC6bAGl/pSoKE5t1tWirHAJ4UXvb6UWLgJ5/NgJgmbfCg/MFf/07iXwnzokAAAAASUVORK5CYII=
// @require           https://cdn.bootcss.com/jquery/3.5.1/jquery.min.js
// @match             *://v.qq.com/x/cover/*
// @match             *://v.qq.com/x/page/*
// @match             *://m.v.qq.com/x/m/*
// @match             *://*.iqiyi.com/v*
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
// @license           GPL License
// @grant             unsafeWindow
// @grant             GM_openInTab
// @grant             GM.openInTab
// @grant             GM_getValue
// @grant             GM.getValue
// @grant             GM_setValue
// @grant             GM.setValue
// @grant             GM_xmlhttpRequest
// @grant             GM.xmlHttpRequest
// @grant             GM_registerMenuCommand
// @connect           iqiyi.com
// @connect           mgtv.com
// @connect           pl.hd.sohu.com
// @connect           v.qq.com
// @namespace https://greasyfork.org/users/851241
// @downloadURL https://update.greasyfork.org/scripts/438773/VIP%E8%A7%86%E9%A2%91%E5%85%A8%E7%BD%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/438773/VIP%E8%A7%86%E9%A2%91%E5%85%A8%E7%BD%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var $ = $ || window.$;
    var log_count = 1;
    var host = location.host;
    var parseInterfaceList = [];
    var selectedInterfaceList = [];
    var originalInterfaceList = [
        {name:"纯净/B站",type:"1",url:"https://z1.m1907.cn/?jx="},
        {name:"综合/B站",type:"1",url:"https://vip.parwix.com:4433/player/?url="},
        {name:"OK解析",type:"1",url:"https://okjx.cc/?url="},
        {name:"诺诺",type:"1",url:"https://www.ckmov.com/?url="},
        {name:"冰豆",type:"1",url:"https://api.qianqi.net/vip/?url="},
        {name:"爱豆",type:"1",url:"https://jx.aidouer.net/?url="},
        {name:"BL",type:"1",url:"https://vip.bljiex.com/?v="},
        {name:"老板",type:"1",url:"https://vip.laobandq.com/jiexi.php?url="},
        {name:"小蒋",type:"1",url:"https://www.kpezp.cn/jlexi.php?url="},
        {name:"盘古云",type:"1",url:"https://go.yh0523.cn/y.cy?url="},
        {name:"17云",type:"1",url:"https://www.1717yun.com/jx/ty.php?url="},
        {name:"诺讯",type:"1",url:"https://www.nxflv.com/?url="},
        {name:"夜幕",type:"1",url:"https://www.yemu.xyz/?url="},
        {name:"凉城",type:"1",url:"https://jx.mw0.cc/?url="},
    ];

    //自定义 log 函数
    function mylog(param1, param2) {
        param1 = param1 ? param1 : "";
        param2 = param2 ? param2 : "";
        console.log("#" + log_count++ + "-VIP-log:", param1, param2);
    }

    //内嵌页内播放
    function innerParse(url) {
        $("#iframe-player").attr("src", url);
    }

    //兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
    function GMopenInTab(url, open_in_background) {
        if (typeof GM_openInTab === "function") {
            GM_openInTab(url, open_in_background);
        } else {
            GM.openInTab(url, open_in_background);
        }
    }

    //兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
    function GMgetValue(name, value) {
        if (typeof GM_getValue === "function") {
            return GM_getValue(name, value);
        } else {
            return GM.getValue(name, value);
        }
    }

    //兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
    function GMsetValue(name, value) {
        if (typeof GM_setValue === "function") {
            GM_setValue(name, value);
        } else {
            GM.setValue(name, value);
        }
    }

    //兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
    function GMxmlhttpRequest(obj) {
        if (typeof GM_xmlhttpRequest === "function") {
            GM_xmlhttpRequest(obj);
        } else {
            GM.xmlhttpRequest(obj);
        }
    }

    //兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
    function GMaddStyle(css) {
        var myStyle = document.createElement('style');
        myStyle.textContent = css;
        var doc = document.head || document.documentElement;
        doc.appendChild(myStyle);
    }

    //播放节点预处理
    var node = "";
    var player_nodes = [
        { url:"v.qq.com", node:"#mod_player"},
        { url:"m.v.qq.com", node:".mod_player"},
        { url:"www.iqiyi.com", node:"#flashbox"},
        { url:"m.iqiyi.com", node:"#flashbox"},
        { url:"v.youku.com", node:"#ykPlayer"},
        { url:"www.mgtv.com", node:"#mgtv-player-wrap container"},
        { url:"tv.sohu.com", node:"#player"},
        { url:"film.sohu.com", node:"#playerWrap"},
        { url:"www.le.com", node:"#le_playbox"},
        { url:"video.tudou.com", node:".td-playbox"},
        { url:"v.pptv.com", node:"#pptv_playpage_box"},
        { url:"vip.pptv.com", node:".w-video"},
        { url:"www.wasu.cn", node:"#flashContent"},
        { url:"www.fun.tv", node:"#html-video-player-layout"},
        { url:"www.acfun.cn", node:"#player"},
        { url:"www.bilibili.com", node:"#player_module"},
        { url:"vip.1905.com", node:"#player"},
        { url:"www.56.com", node:"#play_player"}
    ];
    for(var i in player_nodes) {
        if (player_nodes[i].url == host) {
            node = player_nodes[i].node;
        }
    }

    var videoPlayer = $("<div id='iframe-div' style='width:100%;height:100%;z-index:1000;'><iframe id='iframe-player' frameborder='0' allowfullscreen='true' width='100%' height='100%'></iframe></div>");
    var ImgBase64 =`
        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAeCAYAAABaKIzgAAAAAXNSR0IArs4c6QAABJ9JREFUWEfVWLtuFEEQ7JnZOyQbAn8AL8k2/AMhCQESIkdEJCAeEhIBHwAkJEhIBITYDkBCxHyCifEPYAdECFtEBIv6UdM969s9h/iS293bvaupqa6uvkSn5JVOCU46BnT/3NU+l
        Y5SKZRy0ffSEZVMqczs3K51mVLWe4mfyXwP35v02VyIMh9nIv4s8f1JjuU6n5dMlHCPXuPz+c7LBltz8vPu49t/v3z9nPkHBChAFMoCAKD5vBB1DA6LYVD6uQJmMADK35UEgCyYwcgCCiW+JuANpNynC5pvvaj4GqD7qxu9/hjYdLYy/7Aw7eBTAMqfyT22yCysGUBjk0E6ewzYAPK9kVUDOwF0U4DK
        jwh7xpAdR6B1u3FPfAbHDFBA8Pdh63kBfMnYFrAAqse6gLyEUbDJbHS63SoF0y1f4y/ruua6LLDD9vO7gqz6BOCqWdUlQGG7FSiJFOZbrtNm63+sbvSNPrtYUA4WoEWnWAB2IBfqRaP8rDMqgAvrbyAHYVdZ10IzrZZE8w9jGl3Z7LkIZFtDxet5R4mBBzk4SHUFAS7grOjk2ItD5MR0VSl4tVd3YK0
        a6NlUMYl2mmJCEY2DVL1CIsqkfoeCjgWkgKBFsy1h1Jit1U/jW7+/stE7SLcdrXTYk1sU2F3b/Ui/r90RxrXSI1ArJtjRwEd1B9S6VM9eUJP21DIKI+fCig7Qgmag/Pq+t0fnH7xWDzVG3egDiGj4VvHeGIzxNFX1wihrjSsbwHTrY+FIhcNPu44AFO2YAV948iZUvZp725FMq3WrvZjA7jijdetRUB
        1lNnXToOhQFgGr0sUMgYLdi0/f6paK0cOqUNXB8KVTKVAUn9rTaNVbZ2psyXwTGmX/bFxgMdDI7qVn7wY933QIfUY/PXkL9aABm2JWRQrQadMACq3tfpoMYSwFfl1+/r4WTRJPDSwbwNjzT1xMFZx1KQ0cHEYssJivLgP65+ajaui1pR5jE7bFXkuaoLYnOpOadYxv1p0kgJjph/bK9699W8zo0Y371
        iaHcW4YQjz2ad9XT11STN5ZGvYsPUm1157Ox8c1enj9nnWn2Bqt9yPqoREglDQZQH11tNez4cf26W104KFx643Rw1sPqf91ZFkULdiBIpyILjlYW6XH3l5zqrXZ+fZk1WvP7uGdg54vHar2fIRrWJgl/JqcQoqyLAqgKKQaqBc4wMTWrzeMsiYlR0Kf3G1k29lfLaiYxzbZlVnrCvXWFmPcU6DmoUj6
        5gDwXGX2RL1emUHSxwhS01MYUZDyo0xiIMFMhFQloTlhRAnhBHKQxS0LzlWj1pkwNwmjGNxsAbKQeM2SkuVSjCII0E3naYY9dYCm14tGp+xpZT0EZ4TiwdYvCsvir5hU+TlzjjozYezwKVT91Ic9hGaMJTllmo0X07oPdxaeffqM8Q6sDiKfFZ7KAF3HEz3moWY8CdMnwAP0hD0FoLFN1kEvjh7QsPl
        q+B9AANnY7FuuwaOZQtHXgz5jPh3tTNyPD85eaVmtIGee4i1R+Z8Tw9kq6+AXR2br68w0u4Fq2KdPZzNTnxOd2Xk1/gfE//z3zqn57+kfBMObH7Y1k58AAAAASUVORK5CYII=`;

    // 视频解析预处理
    var innerList = [];
    var outerList = [];
    var innerli = "";
    var outerli = "";
    originalInterfaceList.forEach((item, index) => {
        if (item.type == "1") {
            innerList.push(item);
            innerli += "<li>" + item.name + "</li>";
        } else {
            outerList.push(item);
            outerli += "<li>" + item.name + "</li>";
        }
    });
    parseInterfaceList = innerList.concat(outerList);

    //图片按钮定位
    var left = 0;
    var top = 100;
    var Position = GMgetValue("Position_" + host);
    if(!!Position){
        left = Position.left;
        top = Position.top;
    }
    GMaddStyle(`#vip_movie_box {cursor:pointer; position:fixed; top:` + top + `px; left:` + left + `px; width:28px;z-index:2147483647; font-size:12px; text-align:left;}
		        #vip_movie_box .item_text img {width:42px; height:30px; display:inline-block; vertical-align:middle;}
                #vip_movie_box .vip_mod_box_action {display:none; position:absolute; left:3px; top:30; text-align:center; background-color:#272930; border:1px solid gray;}
                #vip_movie_box .vip_mod_box_action li{font-size:12px; color:#DCDCDC; text-align:center; width:60px; line-height:21px; float:left; border:1px solid gray; padding:2px 4px; margin:2px 2px;}
                #vip_movie_box .vip_mod_box_action li:hover{color:#FF4500; background-color:#000000;}`);

    var html = $(`<div id='vip_movie_box'>
                    <div class='item_text'>
                       <img src='`+ ImgBase64 +`'>
                       <div class='vip_mod_box_action' >
                         <div style='display:flex;'>
                           <div style='width:168px; padding:10px 0;'>
                             <ul style='margin:0 10px;'>
                               ` + innerli + `
                               <div style='clear:both;'></div>
                             </ul>
                           </div>
                         </div>
                       </div>
                    </div>
                 </div>`);
    $("body").append(html);

    //视频解析事件处理
    $(".item_text").on("mouseover", () => {
        $(".vip_mod_box_action").show();
    });
    $(".item_text").on("mouseout", () => {
        $(".vip_mod_box_action").hide();
    });
    $(".vip_mod_box_action li").each((index, item) => {
        item.addEventListener("click", () => {
            if (parseInterfaceList[index].type == "1") {
                if (document.getElementById("iframe-player") == null) {
                    var player = $(node);
                    player.empty();
                    player.append(videoPlayer);
                }
                innerParse(parseInterfaceList[index].url + location.href);
            } else {
                GMopenInTab(parseInterfaceList[index].url + location.href, false);
            }
        });
    });

    //屏蔽网站广告 和 支持电视剧选集
    switch (host) {
        case 'www.iqiyi.com':
            //--------------------------------------------------------------------------------
            unsafeWindow.rate = 0; //视频广告加速
            unsafeWindow.Date.now = () => {
                return new unsafeWindow.Date().getTime() + (unsafeWindow.rate += 1000);
            }
            setInterval(() => {
                unsafeWindow.rate = 0;
            }, 600000);
            //--------------------------------------------------------------------------------
            setInterval(() => {
                if (document.getElementsByClassName("cupid-public-time")[0] != null) {
                    $(".skippable-after").css("display", "block");
                    document.getElementsByClassName("skippable-after")[0].click(); //屏蔽广告
                }
                $(".qy-player-vippay-popup").css("display", "none"); //移除会员提示
                $(".black-screen").css("display", "none"); //广告拦截提示
            }, 500);
            break
        case 'v.qq.com':
            //--------------------------------------------------------------------------------
            setInterval(() => { //视频广告加速
                $(".txp_ad").find("txpdiv").find("video")[0].currentTime = 100;
                $(".txp_ad").find("txpdiv").find("video")[1].currentTime = 100;
            }, 100)
            //--------------------------------------------------------------------------------
            setInterval(() => {
                var txp_btn_volume = $(".txp_btn_volume"); //打开声音
                if (txp_btn_volume.attr("data-status") === "mute") {
                    $(".txp_popup_volume").css("display", "block");
                    txp_btn_volume.click();
                    $(".txp_popup_volume").css("display", "none");
                }
                //$("txpdiv[data-role='hd-ad-adapter-adlayer']").attr("class", "txp_none"); //屏蔽广告
                $(".mod_vip_popup").css("display", "none"); //移除会员提示
                $(".tvip_layer").css("display", "none"); //遮罩层
                $("#mask_layer").css("display", "none"); //遮罩层
            }, 500);
            break
        case 'v.youku.com':
            //--------------------------------------------------------------------------------
            window.onload = function () { //视频广告加速
                if (!document.querySelectorAll('video')[0]) {
                    setInterval(() => {
                        document.querySelectorAll('video')[1].playbackRate = 16;
                    }, 100)
                }
            }
            //--------------------------------------------------------------------------------
            setInterval(() => {
                var H5 = $(".h5-ext-layer").find("div")
                if(H5.length != 0){
                    $(".h5-ext-layer div").remove(); //屏蔽广告
                    var control_btn_play = $(".control-left-grid .control-play-icon"); //自动播放
                    if (control_btn_play.attr("data-tip") === "播放") {
                        $(".h5player-dashboard").css("display", "block"); //显示控制层
                        control_btn_play.click();
                        $(".h5player-dashboard").css("display", "none"); //隐藏控制层
                    }
                }
                $(".information-tips").css("display", "none"); //信息提示
            }, 500);
            break
        case 'tv.sohu.com':
            setInterval(() => {
                $(".x-video-adv").css("display", "none");//屏蔽广告
                $(".x-player-mask").css("display", "none");//广告提示
                $("#player_vipTips").css("display", "none");//移除会员提示
            }, 500);
            break
        case 'www.fun.tv':
            setTimeout(() => {
                var control_btn_play = $(".fxp-controlbar .btn-toggle"); //自动播放
                if (control_btn_play.is('.btn-play')) {
                    control_btn_play.click();
                }
            }, 500);
            setInterval(() => {
                $("#play-Panel-Wrap").css("display", "none");//移除会员提示
            }, 500);
            break
        case 'www.bilibili.com':
            setInterval(() => {
                $(".player-limit-mask").remove();//移除会员提示
            }, 500);
            break
        default:
            break
    }
})();
