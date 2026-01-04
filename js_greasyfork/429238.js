// ==UserScript==
// @name              【全网视频VIP解析】改
// @version           1.0.0
// @description       更改自脚本(ID:424086)v2.5,作者小艾特,遵循原作者GPL协议,仅用于学习.
// @author            小艾特, modified by symant233
// @icon              https://cdn.jsdelivr.net/gh/symant233/PublicTools/Beautify/Bkela.png
// @namespace         https://greasyfork.org/zh-CN/scripts/424086
// @require           https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @match             *://v.qq.com/x/cover/*
// @match             *://v.qq.com/x/page/*
// @match             *://m.qq.com/*
// @match             *://www.iqiyi.com/v*
// @match             *://m.iqiyi.com/*
// @match             *://v.youku.com/v_show/*
// @match             *://m.youku.com/*
// @match             *://www.mgtv.com/b/*
// @match             *://tv.sohu.com/v/*
// @match             *://film.sohu.com/album/*
// @match             *://www.le.com/ptv/vplay/*
// @match             *://v.pptv.com/show/*
// @match             *://vip.pptv.com/show/*
// @match             *://www.fun.tv/vplay/*
// @match             *://www.acfun.cn/v/*
// @match             *://www.bilibili.com/video/*
// @match             *://www.bilibili.com/anime/*
// @match             *://www.bilibili.com/bangumi/play/*
// @match             *://m.bilibili.com/*
// @match             *://vip.1905.com/play/*
// @match             *://www.56.com/*
// @match             *://www.wxtv.net/*
// @license           GPL License
// @grant             unsafeWindow
// @grant             GM_addStyle
// @grant             GM_openInTab
// @grant             GM.openInTab
// @grant             GM_getValue
// @grant             GM.getValue
// @connect           iqiyi.com
// @connect           mgtv.com
// @connect           pl.hd.sohu.com
// @downloadURL https://update.greasyfork.org/scripts/429238/%E3%80%90%E5%85%A8%E7%BD%91%E8%A7%86%E9%A2%91VIP%E8%A7%A3%E6%9E%90%E3%80%91%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/429238/%E3%80%90%E5%85%A8%E7%BD%91%E8%A7%86%E9%A2%91VIP%E8%A7%A3%E6%9E%90%E3%80%91%E6%94%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var $ = $ || window.$;
    var host = location.host;
    var parseInterfaceList = [];
    var selectedInterfaceList = [];
    var originalInterfaceList = [
        //以下为B站解析线路
        //--------------------------------------------------------------------------------------
        {name: "yaohuaxuan",type: "1",url: "https://jx.yaohuaxuan.com/?url="},
        {name: "5igen",type: "1",url: "https://www.5igen.com/dmplayer/player/?url="},
        {name: "parwix",type: "1",url: "https://vip.parwix.com:4433/player/?url="},
        //--------------------------------------------------------------------------------------
        //以下为爱优腾等全网视频解析线路
        //--------------------------------------------------------------------------------------
        {name: "h8jx",type: "2",url: "https://www.h8jx.com/jiexi.php?url="},
        {name: "bljiex",type: "2",url: "https://vip.bljiex.com/?v="},
        {name: "youyitv",type: "2",url: "https://jx.youyitv.com/?url="},
        //--------------------------------------------------------------------------------------
        //以下为通用视频解析线路
        //--------------------------------------------------------------------------------------
        {name: "m1907",type: "3",url: "https://z1.m1907.cn/?jx="},
        {name: "M3U8",type: "3",url: "https://jx.m3u8.tv/jiexi/?url="},
        //--------------------------------------------------------------------------------------
    ];;
    function innerParse(url) {$("#iframe-player").attr("src", url);}
    function GMopenInTab(url, open_in_background) {if (typeof GM_openInTab === "function") { GM_openInTab(url, open_in_background);} else {GM.openInTab(url, open_in_background); }}
    function GMgetValue(name, value) {if (typeof GM_getValue === "function") {return GM_getValue(name, value);} else { return GM.getValue(name, value);} }
    function css(css) { var myStyle = document.createElement('style');myStyle.textContent = css;var doc = document.head || document.documentElement;doc.appendChild(myStyle); }

    var node = "";
    var player_nodes = [
        { url:"v.qq.com", node:"#mod_player"},
        { url:"www.iqiyi.com", node:"#flashbox"},
        { url:"v.youku.com", node:"#ykPlayer"},
        { url:"www.mgtv.com", node:"#mgtv-player-wrap container"},
        { url:"tv.sohu.com", node:"#player"},
        { url:"film.sohu.com", node:"#playerWrap"},
        { url:"www.le.com", node:"#le_playbox"},
        { url:"v.pptv.com", node:"#pptv_playpage_box"},
        { url:"vip.pptv.com", node:".w-video"},
        { url:"www.fun.tv", node:"#html-video-player-layout"},
        { url:"www.acfun.cn", node:"#player"},
        { url:"www.bilibili.com", node:"#player_module"},
        { url:"vip.1905.com", node:"#player"},
        { url:"www.56.com", node:"#play_player"}
    ];
    for(var i in player_nodes) {if (player_nodes[i].url == host) { node = player_nodes[i].node;}}
    var videoPlayer = $("<div id='iframe-div' style='width:100%;height:100%;z-index:1000;'><iframe id='iframe-player' frameborder='0' allowfullscreen='true' width='100%' height='100%'></iframe></div>");
    var innerList = [];
    var innerli = "";
    var innerlis = "";
    var innerlisc = "";
    originalInterfaceList.forEach((item, index) => {
        if (item.type == "1") {
            innerList.push(item);
            innerli += "<li>" + item.name + "</li>";
        }
        if (item.type == "2") {
            innerList.push(item);
            innerlis += "<li>" + item.name + "</li>";
        }
        if (item.type == "3") {
            innerList.push(item);
            innerlisc += "<li>" + item.name + "</li>";
        }
    });
    parseInterfaceList = innerList;

    var left = 0;
    var top = 100;
    var Position = GMgetValue("Position_" + host);
    if(!!Position){
        left = Position.left;
        top = Position.top;
    }
    css(`#zuihuitao {cursor:pointer; position:fixed; top:` + top + `px; left:` + left + `px; width:0px; z-index:2147483647; font-size:12px; text-align:left;}
         #zuihuitao .logo { position: absolute;right: 1px; width: 1.5em;padding: 5px 2px;text-align: center;color: #fff;cursor: auto;user-select: none;border-radius: 0 4px 4px 0;transform: translate3d(100%, 5%, 0);background: #fc4273;}
         #zuihuitao .die {display:none; position:absolute; left:23px; top:0; text-align:center;background-color:#04B4AE; border:1px solid gray;}
         #zuihuitao .die li{font-size:12px; color:#fff; text-align:center; width:60px; line-height:21px; float:left; border:1px solid gray;border-radius: 6px 6px 6px 6px; padding:0 4px; margin:4px 2px;}
         #zuihuitao .die li:hover{color:#fff;background:#FE2E64;}
         .add{background-color:#FE2E64;`);
    $(function() {$("ul").on("click", "li", function() {$("ul li").removeClass("add");$(this).addClass("add");}) });
    var html = $(`<div id='zuihuitao'>
                    <div class='item_text'>
                  <div class="logo"><a id="m">解析</a></div>
                       <div class='die' >
                         <div style='display:flex;'>
                           <div style='width:168px; padding:0px 0;'>
                             <br>
                             <div style='font-size:16px; text-align:center; color:#fff; line-height:21px;'>B站专线解析</div>
                             <ul style='margin:0 10px;'>
                               ` + innerli + `
                             <div style='clear:both;'></div>
                             </ul>
                             <br>
                             <div style='font-size:16px; text-align:center; color:#fff; line-height:21px;'>爱优腾解析</div>
                               <ul style='margin:0 10px;'>
                               ` + innerlis + `
                               <div style='clear:both;'></div>
                             </ul>
                             <br>
                             <div style='font-size:16px; text-align:center; color:#fff; line-height:21px;'>通用解析</div>
                             <ul style='margin:0 10px;'>
                               ` + innerlisc + `
                             <div style='clear:both;'></div>
                             </ul>
                             <br>
                 </div>`);
    $("body").append(html);
    $(".item_text").on("mouseover", () => {
        $(".die").show();
    });
    $(".item_text").on("mouseout", () => {
        $(".die").hide();
    });
    $(".die li").each((index, item) => {
        item.addEventListener("click", () => {
            if (parseInterfaceList[index].type == "1","2") {
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
    $("#m").click(function(){
        var play_jx_url = window.location.href;
        if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
            var mobile_html = "<div style='margin:0 auto;padding:10px;'>";
            mobile_html +="<button type='button' style='position:absolute;top:0;right:30px;font-size:30px;line-height: 1;color: #000;text-shadow: 0 1px 0 #fff;cursor: pointer;border:0;background:0 0;' onclick='location.reload();'>×</button>";
            mobile_html += "<div><iframe src='https://www.eggvod.cn/mobile.php?zhm_jx="+play_jx_url +"' allowtransparency=true frameborder='0' scrolling='no' allowfullscreen=true allowtransparency=true name='jx_play'style='height:600px;width:100%'></iframe></div>"
            mobile_html += "</div>";
            $("body").html(mobile_html);
        } else {}
    });
    (function() {
        $("body").append("");
        setTimeout(function() {
            $("#loading").remove();
            $(".watch-info").after('<div class="bottom-page paging-box-big"><span style="cursor: pointer;color: #fff;background: #ff9800;font-size: 14px;height: 2em;line-height: 27px;margin-left: 18px;border-radius: 4px;padding: 0 10px;display: inline-block;" id="go">站外下载视频</span></div>');
            $("#go").click(function() {
                var aaa = $(".media-title").attr("title").replace(/\s/g,"");
                var tempwindow = window.open("_blank");
                tempwindow.location = "https://www.wxtv.net/vodsearch/-------------.html?wd=" + aaa
            })
        }, 4000)
    })();
    switch (host) {
        case 'www.iqiyi.com':
            //--------------------------------------------------------------------------------
            unsafeWindow.rate = 0;
            unsafeWindow.Date.now = () => {
                return new unsafeWindow.Date().getTime() + (unsafeWindow.rate += 1000);
            }
            setInterval(() => {
                unsafeWindow.rate = 0;
            }, 600000);
            //--------------------------------------------------------------------------------
            setInterval(() => {
                $('div[style*="top: 74px"]').attr("id", "absolute");
                $("#absolute").css("zIndex",0)
            }, 500);
            break;
        case 'www.wxtv.net':
            GM_addStyle(`html{overflow:overlay;}
                ::-webkit-scrollbar {height: 16px;width: 11px;background-color: initial;}
                ::-webkit-scrollbar-button {height: 0;}
                ::-webkit-scrollbar-thumb {background-color: rgba(0,0,0,.2);background-clip: padding-box;border: solid transparent;border-width: 1px 1px 1px 1px;box-shadow: inset 1px 1px 0 rgb(0 0 0 / 10%), inset 0 -1px 0 rgb(0 0 0 / 7%);}
                ::-webkit-scrollbar-thumb:hover{background: rgba(0,0,0,.4);background-clip: padding-box;}
                ::-webkit-scrollbar-thumb:active{background: rgba(0,0,0,.5);background-clip: padding-box;}
                ::-webkit-scrollbar-track {background-clip: padding-box;border: solid transparent;border-width: 0 0 0 4px;}
                .head_box{position:absolute;}
                .foot{padding:0px;}
                .nav_fixed{top:inherit !important;}
                `);
            $("#zuihuitao").remove();
            $(".searchlist_item").find("a").attr("id", "bbb");
            $("#mygod2m").remove();
            $("#mygod2pc").remove();
            //$("#bofy").remove();
            $(".fo_t").remove();
            //$(".list_scroll").remove();
            //$(".title").remove();
            setTimeout(() => {
                $("#bbb")[0].click();
            }, 500);
            break;
        default:
            break;
    }
})();
