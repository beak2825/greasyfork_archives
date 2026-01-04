// ==UserScript==
// @name         小陈
// @namespace   9800901222
// @version    2.1
// @description  全网视频VIP解析
// @author       卑微小陈
// @require           https://cdn.bootcss.com/jquery/3.5.1/jquery.min.js
// @include           *://v.qq.com/x/cover/*
// @include           *://v.qq.com/x/page/*// @include           *://*.youku.com/v_*
// @include           *://*.iqiyi.com/v_*
// @include           *://*.iqiyi.com/w_*
// @include           *://*.iqiyi.com/a_*
// @include           *://*.le.com/ptv/vplay/*
// @include           *://v.qq.com/x/cover/*
// @include           *://v.qq.com/x/page/*
// @include           *://v.qq.com/tv/*
// @include           *://*.tudou.com/listplay/*
// @include           *://*.tudou.com/albumplay/*
// @include           *://*.tudou.com/programs/view/*
// @include           *://*.mgtv.com/b/*
// @include           *://film.sohu.com/album/*
// @include           *://tv.sohu.com/v/*
// @include           *://v.qq.com/tv/*
// @include           *://*.youku.com/v_*
// @include           *://*.iqiyi.com/v_*
// @include           *://*.iqiyi.com/w_*
// @include           *://*.iqiyi.com/a_*
// @include           *://*.le.com/ptv/vplay/*
// @include           *://v.qq.com/x/cover/*
// @include           *://v.qq.com/x/page/*
// @include           *://v.qq.com/tv/*
// @include           *://*.tudou.com/listplay/*
// @include           *://*.tudou.com/albumplay/*
// @include           *://*.tudou.com/programs/view/*
// @include           *://*.mgtv.com/b/*
// @include           *://film.sohu.com/album/*
// @include           *://tv.sohu.com/v/*
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
// @license           GPL License
// @charset		      UTF-8
// @original-author   卑微小陈
// @connect           iqiyi.com
// @connect           mgtv.com
// @connect           pl.hd.sohu.com
// @connect           s.video.qq.com
// @downloadURL https://update.greasyfork.org/scripts/447398/%E5%B0%8F%E9%99%88.user.js
// @updateURL https://update.greasyfork.org/scripts/447398/%E5%B0%8F%E9%99%88.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var $ = $ || window.$;
    var log_count = 1;
    var host = location.host;
    var parseInterfaceList = [];
    var selectedInterfaceList = [];
    var originalInterfaceList = [
        {name:"纯净",type:"1",url:"https://www.1717yun.com/1717yun/?url="},
        {name:"弹幕",type:"1",url:"https://jx.bozrc.com:4433/player/?url="},
        {name:"仙女",type:"1",url:"https://jx.aidouer.net/?url="},
        {name:"专用",type:"1",url:"https://jx.m3u8.tv/jiexi/?url="},
        {name:"5",type:"1",url:"https://api.qianqi.net/vip/?url="},
        {name:"2",type:"1",url:"https://www.8090.la/8090/?url="},
        {name:"0",type:"1",url:"https://www.ckplayer.vip/jiexi/?url="},
        {name:"1",type:"1",url:"https://okjx.cc/?url="},
        {name:"3",type:"1",url:"https://www.ckmov.vip/api.php?url="},
        {name:"1",type:"1",url:"https://www.h8jx.com/jiexi.php?url="},
        {name:"4",type:"1",url:"https://jx.playerjy.com/?url="},
        {name:"鸭",type:"1",url:"https://ckmov.ccyjjd.com/ckmov/?url="},
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
        { url:"v.qq.com", node:"#player-container"},
        { url:"www.iqiyi.com", node:"#flashbox"},
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
        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABB0lEQVR42r2VCw7CIAxAWzQuelsv4ml12XSAhZQFl0L3cWvSwFjhtRQKeu9bALgiCbDQmOfuQHqGuow2whpPpLajTlMAWNKTAhhthDU6zBbbRY
        4D7LRFfQ3geXJIoCM1PIYTQC3JrRZBfooGIRqcA4gThZ/R6zCegI7EmBBIjAY4ogSSAFZNcppEZg9q7jz84WgMKFIDvEkvuVcCKG0bqoBCknEKKICgsIZ6TKEE0GwPBYSzbpYCFm9RMUn/SnJmnO7Az+URPLaZfQI47ttx/pwcCFHm3w7KtU
        gFlB6c/AbXSsVqQC6bAGl/pSoKE5t1tWirHAJ4UXvb6UWLgJ5/NgJgmbfCg/MFf/07iXwnzokAAAAASUVORK5CYII=`;
    var sImgBase64=`
        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAgUlEQVR42t3UQQqAIBAF0EahE3S1buFtPEY3jGr8QgxEm5D5Cc7GlfP8jigTsVR1ESZQaxxAcF+Xa2ORgEUtAQB1BsQSpJRCzvmkAffqmsAgRt
        M+AHXIYwCsGgj4c8j1y4iNfW1vl2e6OgPbA2DVC0CS2ALjxMcnwD0BTjxD31lAAVVYNypdDsbLAAAAAElFTkSuQmCC`;

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

    // 视频选集预处理
    function selectedList(episodeList) {
        var selectedList = [];
        var innerli = "";
        if (!!episodeList && episodeList.length != 0) {
            /*episodeList.sort((d1, d2) => { //升序排列
                return d1.name - d2.name;
            });*/
            episodeList.forEach((item, index) => {
                selectedList.push(item);
                innerli += "<li title='" + item.description + "'>" + item.name + "</li>";
            });
            $(".vip_mod_box_selected ul").empty();
            $(".vip_mod_box_selected ul").append(innerli);

            //视频选集事件处理
            $(".selected_text").on("mouseover", () => {
                $(".vip_mod_box_selected").show();
            });
            $(".selected_text").on("mouseout", () => {
                $(".vip_mod_box_selected").hide();
            });
            //点击过后的样式,方便查看进度
            $(".vip_mod_box_selected li").click(function(){
                $(this).siblings().removeClass("selected");
                $(this).addClass("selected");
            });
            $(".vip_mod_box_selected li").each((index, item) => {
                item.addEventListener("click", () => {
                    if (document.getElementById("iframe-player") == null) {
                        var player = $(node);
                        player.empty();
                        player.append(videoPlayer);
                    }
                    var num = "";
                    if(host == "www.bilibili.com"){
                        num = 1;
                    }else{
                        num = Math.floor(Math.random() * 35 - 1); //使用随机接口
                    }
                    innerParse(parseInterfaceList[num].url + selectedList[index].href);
                });
            });
        }
    }

    //图片按钮定位
    var left = 0;
    var top = 100;
    var Position = GMgetValue("Position_" + host);
    if(!!Position){
        left = Position.left;
        top = Position.top;
    }
    GMaddStyle(`*,*::before,*::after {box-sizing:inherit;}
                #vip_movie_box {cursor:pointer; position:fixed; top:` + top + `px; left:` + left + `px; width:29px; background-color:#FF4500; z-index:2147483647; font-size:12px; text-align:left;}
		        #vip_movie_box .item_text {width:28px; padding:4px 0px; text-align:center;}
		        #vip_movie_box .item_text img {width:22px; height:22px; display:inline-block; vertical-align:middle;}
                #vip_movie_box .vip_mod_box_action {display:none; position:absolute; left:28px; top:0; text-align:center; background-color:#151625; border:1px solid gray;}
                #vip_movie_box .vip_mod_box_action li{font-size:12px; color:#FFFFFF; text-align:center; width:60px; line-height:21px; float:left; padding:4px 4px; margin:3px 3px;background: rgba(0,0,0,.21);border-radius:2px;}
                #vip_movie_box .vip_mod_box_action li:hover{color:#FF4500; background-color:#000000;}
		        #vip_movie_box .selected_text {width:28px; padding:4px 0px; text-align:center;}
		        #vip_movie_box .selected_text img {width:22px; height:22px;display:inline-block; vertical-align:middle;}
                #vip_movie_box .vip_mod_box_selected {display:none; position:absolute; left:28px; top:0; text-align:center; background-color:#151625; border:1px solid gray;}
                #vip_movie_box .vip_mod_box_selected ul{height:455px; overflow-y: auto;}
                #vip_movie_box .vip_mod_box_selected li{background:rgba(0,0,0,.21); border-radius:2px; font-size:14px; color:#FFFFFF; text-align:center; width:37px; height: 37px;line-height:36px; float:left; margin:4px 4px;}
                #vip_movie_box .vip_mod_box_selected li:hover{color:#FF4500; background-color:#000000;}
                #vip_movie_box .vip_mod_box_selected .selected{color:#FF4500; background-color:#000000;}`);

    var html = $(`<div id='vip_movie_box'>
                    <div class='item_text'>
                       <img src='`+ ImgBase64 +`' title='视频解析'/>
                       <div class='vip_mod_box_action' >
                         <div style='display:flex;'>
                           <div style='width:316px; padding:10px 0;'>
                             <div style='font-size:13px; text-align:center; color:#FFFFFF; line-height:21px; margin:4px 4px;'>小陈</div>
                             <ul style='margin:0 10px;'>
                               ` + innerli + `
                               <div style='clear:both;'></div>
                             </ul>

                             </ul>
                           </div>
                         </div>
                       </div>
                    </div>
                    <div class='selected_text' >
                       <img src='`+ sImgBase64 +`' title='视频选集'/>
                       <div class='vip_mod_box_selected' >
                         <div style='display:flex;'>
                            <div style='width:316px; padding:10px 0;'>
                              <div style='font-size:13px; text-align:center; color:#FFFFFF; line-height:21px; margin:4px 4px;'>视频列表</div>
                              <ul style='margin:0 10px;'></ul>
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

    // 右键拖拽功能 - 防止与其他脚本干扰
    var movie_box = $("#vip_movie_box");
    movie_box.mousedown(function(e) {
        // 1 = 鼠标左键; 2 = 鼠标中键; 3 = 鼠标右键
        if (e.which == 3) {
            e.preventDefault() // 阻止默认行为
            movie_box.css("cursor", "move");//设置样式
            var positionDiv = $(this).offset();
            var distenceX = e.pageX - positionDiv.left;
            var distenceY = e.pageY - positionDiv.top;
            // 计算移动后的左偏移量 和 顶部的偏移量(防止超出边界)
            $(document).mousemove(function(e) {
                var x = e.pageX - distenceX;
                var y = e.pageY - distenceY;
                if (x < 0) {
                    x = 0;
                } else if (x > $(document).width() - movie_box.outerWidth(true)) {
                    x = $(document).width() - movie_box.outerWidth(true);
                }
                if (y < 0) {
                    y = 0;
                } else if (y > $(document).height() - movie_box.outerHeight(true)) {
                    y = $(document).height() - movie_box.outerHeight(true);
                }
                // 更新样式
                movie_box.css("left", x);
                movie_box.css("top", y);
                GMsetValue("Position_" + host,{ "left":x, "top":y});
            });
            $(document).mouseup(function() {
                $(document).off('mousemove');
                movie_box.css("cursor", "pointer");// 还原样式
            });
            $(document).contextmenu(function(e) {
                e.preventDefault();// 阻止右键菜单默认行为
            })
        }
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
            //选集
            setTimeout(() => {
                var episodeList = [];
                var i71playpagesdramalist = $("div[is='i71-play-ab']");
                if (i71playpagesdramalist.length != 0) {
                    var data = i71playpagesdramalist.attr(":page-info");
                    if (!!data) {
                        var dataJson = JSON.parse(data);
                        var albumId = dataJson.albumId;
                        var barlis = $(".qy-episode-tab").find(".bar-li");
                        var barTotal = barlis.length;
                        if(barTotal == 0){
                            barTotal = 1;
                        }
                        for (var page = 1; page <= barTotal; page++) {
                            GMxmlhttpRequest({
                                url: "https://pcw-api.iqiyi.com/albums/album/avlistinfo?aid=" + albumId + "&page=" + page + "&size=30",
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                },
                                onload: response => {
                                    var status = response.status;
                                    if (status == 200 || status == '200') {
                                        var serverResponseJson = JSON.parse(response.responseText);
                                        var code = serverResponseJson.code;
                                        if (code == "A00000") {
                                            var serverEpsodelist = serverResponseJson.data.epsodelist;
                                            //console.log(serverEpsodelist)
                                            for (var i = 0; i < serverEpsodelist.length; i++) {
                                                var name = serverEpsodelist[i].order;
                                                var href = serverEpsodelist[i].playUrl;
                                                var description = serverEpsodelist[i].subtitle;
                                                episodeList.push({
                                                    "name": name,
                                                    "href": href,
                                                    "description": description
                                                });
                                                //mylog({"name":name, "href":href, "description":description});
                                            }
                                            selectedList(episodeList);
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
            },2000);
            break
        case 'v.qq.com':
            //--------------------------------------------------------------------------------
            setInterval(() => {
                var txp_btn_volume = $(".txp_btn_volume"); //打开声音
                if (txp_btn_volume.attr("data-status") === "mute") {
                    $(".txp_popup_volume").css("display", "block");
                    txp_btn_volume.click();
                    $(".txp_popup_volume").css("display", "none");
                }
                //$("txpdiv[data-role='hd-ad-adapter-adlayer']").attr("class", "txp_none"); //屏蔽广告
                $(".panel-tip-pay").css("display", "none"); //移除会员提示
                $(".tvip_layer").css("display", "none"); //遮罩层
                $("#mask_layer").css("display", "none"); //遮罩层
            }, 500);
            //选集
            window.onload = setTimeout(() => {
                var episodeList = [];
                var timestamp = new Date().getTime();
                var COVER_INFO = unsafeWindow.window.__pinia.episodeMain.listData[0].list[0];
                var VIDEO_INFO = unsafeWindow.window.__pinia.global.videoInfo;
                var cid = COVER_INFO[0].cid;
                //api请求不能超过100集，这里只判断动漫，不处理预告集
                if (VIDEO_INFO.type_name == "动漫") {
                    var barTotal = COVER_INFO.length;
                    //mylog(barTotal)
                    for (var page = 1; page <= barTotal; page++) {
                        var i = page - 1;
                        var vid = COVER_INFO[i].vid;
                        var name = COVER_INFO[i].title;
                        var href = "https://v.qq.com/x/cover/" + cid + "/"+ vid + ".html";
                        episodeList.push({
                            "name": name,
                            "href": href,
                            "description": ""
                        });
                        //mylog({"name":name, "href":href, "description":""});
                    }
                     selectedList(episodeList);
                }else {
                    GMxmlhttpRequest({
                        url: "http://s.video.qq.com/get_playsource?id=" + cid + "&plat=2&type=1&data_type=2&video_type=3&plname=&otype=json&num_mod_cnt=100&_t="+ timestamp,
                        method: "GET",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        onload: response => {
                            var status = response.status;
                            if (status == 200 || status == '200') {
                                var str = response.responseText.replace('QZOutputJson=','');
                                var url_code = str.slice(0,str.length - 1);
                                var serverResponseJson = JSON.parse(url_code);
                                var code = serverResponseJson.error;
                                if (code == "0") {
                                    var serverEpsodelist = serverResponseJson.playlist[0].videoPlayList;
                                    for (var i = 0; i < serverEpsodelist.length; i++) {
                                        if(serverEpsodelist[i].type != 2 && serverEpsodelist[i].type != 4){
                                            var name = serverEpsodelist[i].episode_number;
                                            var href = serverEpsodelist[i].playUrl;
                                            episodeList.push({
                                                "name": name,
                                                "href": href,
                                                "description": ""
                                            });
                                            //mylog({"name":name, "href":href, "description":""});
                                        }
                                    }
                                    selectedList(episodeList);
                                }
                            }
                        }
                    });
                }
            }, 5000);
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
            //选集
            window.onload = setTimeout(() => {
                var Num;
                var episodeList = [];
                var videoCategory = unsafeWindow.__INITIAL_DATA__.data.data.data.extra.videoCategory;
                if(videoCategory == "动漫" || videoCategory == "电影" || videoCategory == "少儿"){
                    Num = 1;
                } else if(videoCategory == "电视剧" || videoCategory == "综艺"){
                    Num = 2;
                }
                if (!!Num){
                    var data = unsafeWindow.__INITIAL_DATA__.data.model.detail.data.nodes[0].nodes[Num];
                    var barTotal = data.nodes.length;
                    for (var page = 1; page <= barTotal; page++) {
                        var i = page - 1
                        if(data.nodes[i].data.videoType == "正片"){
                            if(videoCategory == "综艺" || videoCategory == "少儿"){
                                var name = i + 1;
                            }else{
                                name = data.nodes[i].data.stage;
                            }
                            var vid = data.nodes[i].data.action.value;
                            var title = data.nodes[i].data.title;
                            var href = "https://v.youku.com/v_show/id_" + vid + ".html";
                            episodeList.push({
                                "name": name,
                                "href": href,
                                "description": title
                            });
                            //mylog({"name":name, "href":href, "description":title});
                        }
                    }
                    selectedList(episodeList);
                }
            },2000);
            break
        case 'www.mgtv.com':
            //选集
            setTimeout(() => {
                var episodeList = [];
                var str = location.href;
                var index = str .lastIndexOf("\/");//斜杠 分割
                str = str.substring(index + 1, str.length);
                index = str.lastIndexOf(".html");
                var albumId = str.substring(0, index);
                //mylog(albumId)
                var barlis = $(".episode-header").find("a");
                var barTotal = barlis.length;
                if(barTotal == 0){
                    barTotal = 1;
                }
                for (var page = 1; page <= barTotal; page++) {
                    GMxmlhttpRequest({
                        url: "https://pcweb.api.mgtv.com/episode/list?_support=10000000&video_id=" + albumId + "&page=" + page + "&size=30",
                        method: "GET",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        onload: response => {
                            var status = response.status;
                            if (status == 200 || status == '200') {
                                var serverResponseJson = JSON.parse(response.responseText);
                                var code = serverResponseJson.code;
                                if (code == "200") {
                                    var serverEpsodelist = serverResponseJson.data.list;
                                    //mylog(serverEpsodelist)
                                    for (var i = 0; i < serverEpsodelist.length; i++) {
                                        var isnew = serverEpsodelist[i].isnew;
                                        if(isnew != "2"){
                                            var name = serverEpsodelist[i].t1;
                                            var href = serverEpsodelist[i].url;
                                            href = "https://www.mgtv.com" + href;
                                            var description = serverEpsodelist[i].t2;
                                            episodeList.push({
                                                "name": name,
                                                "href": href,
                                                "description": description
                                            });
                                            //mylog({"name":name, "href":href, "description":description});
                                        }
                                    }
                                    selectedList(episodeList);
                                }
                            }
                        }
                    });
                }
            },2000);
            break
        case 'tv.sohu.com':
            setInterval(() => {
                $(".x-video-adv").css("display", "none");//屏蔽广告
                $(".x-player-mask").css("display", "none");//广告提示
                $("#player_vipTips").css("display", "none");//移除会员提示
            }, 500);
            //选集
            window.onload = setTimeout(() => {
                var episodeList = [];
                var albumId = unsafeWindow.playlistId;
                var barTotal = 1;
                for (var page = 1; page <= barTotal; page++) {
                    GMxmlhttpRequest({
                        url: "https://pl.hd.sohu.com/videolist?playlistid=" + albumId + "&pagenum=1&pagesize=999",
                        method: "GET",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        onload: response => {
                            var status = response.status;
                            if (status == 200 || status == '200') {
                                var serverResponseJson = JSON.parse(response.responseText);
                                var serverEpsodelist = serverResponseJson.videos;
                                for (var i = 0; i < serverEpsodelist.length; i++) {
                                    var name = serverEpsodelist[i].order;
                                    var href = serverEpsodelist[i].pageUrl;
                                    var description = serverEpsodelist[i].name;
                                    episodeList.push({
                                        "name": name,
                                        "href": href,
                                        "description": description
                                    });
                                    //mylog({"name":name, "href":href, "description":description});
                                }
                                selectedList(episodeList);
                            }
                        }
                    });
                }
            },2000);
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
            //选集
            window.onload = setTimeout(() => {
                var episodeList = [];
                var data = unsafeWindow.vplayInfo.dvideos[0];
                var barTotal = data.videos.length;
                for (var page = 1; page <= barTotal; page++) {
                    var lists = data.videos[page-1].lists.length;
                    for (var i = 1; i <= lists; i++) {
                        var name = data.videos[page-1].lists[i-1].title;
                        var url = data.videos[page-1].lists[i-1].url;
                        var title = data.videos[page-1].lists[i-1].name;
                        var dtype = data.videos[page-1].lists[i-1].dtype;
                        if (!!name && !!url && dtype == "normal") {
                            var href = "http://www.fun.tv" + url;
                            episodeList.push({
                                "name": name,
                                "href": href,
                                "description": title
                            });
                            //mylog({"name":name, "href":href, "description":title});
                        }
                        selectedList(episodeList);
                    }
                }
            }, 2000);
            break
        case 'www.bilibili.com':
            setInterval(() => {
                $(".player-limit-mask").remove();//移除会员提示
            }, 500);
            //选集
            window.onload = setTimeout(() => {
                var episodeList = [];
                var data = unsafeWindow.__INITIAL_STATE__;
                var barTotal = data.epList.length;
                for (var page = 1; page <= barTotal; page++) {
                    var i = page - 1
                    var badge = data.epList[i].badge
                    var name = data.epList[i].title;
                    var id = data.epList[i].id;
                    var title = data.epList[i].longTitle;
                    if (!!name && !!id && badge != "预告") {
                        var href = "https://www.bilibili.com/bangumi/play/ep" + id;
                        episodeList.push({
                            "name": name,
                            "href": href,
                            "description": title
                        });
                    }
                    //mylog({"name":name, "href":href, "description":title});
                }
                selectedList(episodeList);
            }, 2000);
            break
        case 'v.pptv.com':
            //选集
            window.onload = setTimeout(() => {
                var episodeList = [];
                var data = unsafeWindow.webcfg;
                var dataJson = data.playList.data;
                var barTotal = dataJson.list.length;
                for (var page = 1; page <= barTotal; page++) {
                    var i = page - 1
                    var name = dataJson.list[i].rank + 1;
                    var href = dataJson.list[i].url;
                    var title = dataJson.list[i].title;
                    if (!!name && !!href) {
                        episodeList.push({
                            "name": name,
                            "href": href,
                            "description": title
                        });
                    }
                    //mylog({"name":name, "href":href, "description":title});
                }
                selectedList(episodeList);
            }, 2000);
            break
        default:
            break
    }
})();
