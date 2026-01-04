// ==UserScript==
// @name              简洁视频解析
// @version           2.5.1
// @description       支持B站、腾讯视频、爱奇艺、优酷、土豆、芒果TV、搜狐视频、乐视视频、PPTV、风行、哔哩哔哩等，支持多个解析接口切换，界面简洁，脚本仅限学习，请大家支持正版。
// @author            waahah
// @namespace         https://greasyfork.org/users/856508
// @require           https://cdn.bootcss.com/jquery/3.5.1/jquery.min.js
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
// @match             *://www.eggvod.cn/*
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
// @downloadURL https://update.greasyfork.org/scripts/437435/%E7%AE%80%E6%B4%81%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/437435/%E7%AE%80%E6%B4%81%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var $ = $ || window.$;
    var host = location.host;
    var parseInterfaceList = [];
    var selectedInterfaceList = [];
    var originalInterfaceList = [
        //以下为爱优腾等全网视频解析线路：如果不满意接口速度可以适当替换或删除 https://www.nxflv.com/?url=
        //--------------------------------------------------------------------------------------
        {
            name: "线路一",
            type: "1",
            url: "https://jx.yangtu.top/?url="
        },
        {
            name: "线路二",
            type: "1",
            url: "https://jx.jsonplayer.com/player/?url="
        },
        {
            name: "线路三",
            type: "1",
            url: "https://vip.bljiex.cc/?v="
        },
        {
            name: "线路四",
            type: "1",
            url: "https://jx.playerjy.com/?url="
        },
        //--------------------------------------------------------------------------------------
        //以下为B站解析线路：如果不满意接口速度可以适当替换或删除
        //--------------------------------------------------------------------------------------
        {
            name: "线路一",
            type: "2",
            url: "https://vip.bljiex.com/?v="},
        {
            name: "线路二",
            type: "2",
            url: "https://yparse.ik9.cc/index.php?url="
        },
        {
            name: "线路三",
            type: "2",
            url: "https://www.yemu.xyz/?url="
        },
        {
            name: "线路四",
            type: "2",
            url: "https://vip5.jiexi.one/?url="
        },
        //--------------------------------------------------------------------------------------
    ];;
    function innerParse(url) {
        $("#iframe-player").attr("src", url);
    }
    function GMopenInTab(url, open_in_background) {
        if (typeof GM_openInTab === "function") { 
            GM_openInTab(url, open_in_background);
        } 
        else {
            GM.openInTab(url, open_in_background); 
        }
    }
    function GMgetValue(name, value) {
        if (typeof GM_getValue === "function") {
            return GM_getValue(name, value);
        } 
        else { 
            return GM.getValue(name, value);
        } 
    }
    function GMsetValue(name, value) {
        if (typeof GM_setValue === "function") {
            GM_setValue(name, value);
        } 
        else {
            GM.setValue(name, value); 
        } 
    }
    function GMxmlhttpRequest(obj) {
        if (typeof GM_xmlhttpRequest === "function") {
            GM_xmlhttpRequest(obj); 
        } 
        else {
            GM.xmlhttpRequest(obj);
        } 
    }
    function css(css) { 
        var myStyle = document.createElement('style');
        myStyle.textContent = css;
        var doc = document.head || document.documentElement;
        doc.appendChild(myStyle); 
    }

    var node = "";
    var player_nodes = [
        { 
            url:"v.qq.com", 
            node:"#player-container"
        },
        { 
            url:"www.iqiyi.com", 
            node:"#flashbox"
        },
        { 
            url:"v.youku.com", 
            node:"#ykPlayer"
        },
        { 
            url:"www.mgtv.com", 
            node:"#mgtv-player-wrap container"
        },
        { 
            url:"tv.sohu.com", 
            node:"#player"
        },
        { 
            url:"film.sohu.com", 
            node:"#playerWrap"
        },
        { 
            url:"www.le.com", 
            node:"#le_playbox"
        },
        { 
            url:"v.pptv.com", 
            node:"#pptv_playpage_box"
        },
        { 
            url:"vip.pptv.com", 
            node:".w-video"
        },
        { 
            url:"www.fun.tv", 
            node:"#html-video-player-layout"
        },
        { 
            url:"www.acfun.cn", 
            node:"#player"
        },
        { 
            url:"www.bilibili.com", 
            node:"#bilibili-player"
        },
        { 
            url:"vip.1905.com", 
            node:"#player"
        },
        { 
            url:"www.56.com", 
            node:"#play_player"
        }
    ];
    for(var i in player_nodes) {
        if (player_nodes[i].url == host) { 
            node = player_nodes[i].node;
        }
    }
    var videoPlayer = $("<div id='iframe-div' style='width:100%;height:100%;z-index:1000;'><iframe id='iframe-player' frameborder='0' allowfullscreen='true' width='100%' height='100%'></iframe></div>");
    var innerList = [];
    var innerli = "";
    var innerlis = "";
    originalInterfaceList.forEach((item, index) => {
        if (item.type == "1") {
            innerList.push(item);
            innerli += "<li>" + item.name + "</li>";
        }
        if (item.type == "2") {
            innerList.push(item);
            innerlis += "<li>" + item.name + "</li>";
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
         #zuihuitao .logo { position: absolute;right: 0; width: 1.5em;padding: 5px 2px;text-align: center;color: #fff;cursor: auto;user-select: none;border-radius: 0 4px 4px 0;transform: translate3d(100%, 5%, 0);background: #fc4273;}
         #zuihuitao .die {display:none; position:absolute; left:23px; top:0; text-align:center;background-color:#04B4AE; border:1px solid gray;}
         #zuihuitao .die li{font-size:12px; color:#fff; text-align:center; width:60px; line-height:21px; float:left; border:1px solid gray;border-radius: 6px 6px 6px 6px; padding:0 4px; margin:4px 2px;}
         #zuihuitao .die li:hover{color:#fff;background:#FE2E64;}
         .add{background-color:#FE2E64;`);
    $(function() {
        $("ul").on("click", "li", function() {
            $("ul li").removeClass("add");
            $(this).addClass("add");
        })
    });
    var html = $(`<div id='zuihuitao'>
                    <div class='item_text'>
                  <div class="logo"><a id="m">解析</a></div>
                       <div class='die' >
                         <div style='display:flex;'>
                           <div style='width:168px; padding:0px 0;'>
                             <br>
                             <div style='font-size:16px; text-align:center; color:#fff; line-height:21px;'>爱优腾全网解析</div>
                             <ul style='margin:0 10px;'>
                               ` + innerli + `
                             <div style='clear:both;'></div>
                             </ul>
                             <br>
                             <div style='font-size:16px; text-align:center; color:#fff; line-height:21px;'>B站专线解析</div>
                               <ul style='margin:0 10px;'>
                               ` + innerlis + `
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
       $("#m").on( 'click', function(){
        var play_jx_url = window.location.href;
        if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
            var mobile_html = "<div style='margin:0 auto;padding:10px;'>";
            mobile_html +="<button type='button' style='position:absolute;top:0;right:30px;font-size:30px;line-height: 1;color: #000;text-shadow: 0 1px 0 #fff;cursor: pointer;border:0;background:0 0;' onclick='location.reload();'>×</button>";
            mobile_html += "<div><iframe src='https://tv.wandhi.com/go.html?url="+play_jx_url +"' allowtransparency=true frameborder='0' scrolling='true' allowfullscreen=true allowtransparency=true name='jx_play'style='height:600px;width:100%'></iframe></div>"
            mobile_html += "</div>";
            $("body").html(mobile_html);
        } else {}
    });
    (function() {
        $("body").append("");
        setTimeout(function() {
            $("#loading").remove();
            $("#bilibili-player-wrap").after('<div class="bottom-page paging-box-big"><span class="current" style="background: #f45a8d;" id="go">站外下载视频</span><span>免责声明：请通过合法渠道购买VIP下载大会员内容,脚本仅对网页布局进行修改，不含任何漏洞利用，入侵，绕过等方式实现的功能</br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;因使用脚本造成任何后果的，脚本作者不承担任何责任。</span></div>');
            $("#go").click(function() {
                var aaa = $(".media-title").attr("title");
                var bbb = aaa.replace(/\s/g,"");
                var tempwindow = window.open("_blank");
                tempwindow.location = "https://www.wxtv.net/vodsearch/-------------.html?wd=" + bbb
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
            break
        case 'www.wxtv.net':
                $("#zuihuitao").remove();
                $(".searchlist_item").find("a").attr("id", "bbb");
                $("#topnav").remove();
                $("#mygod2m").remove();
                $("#mygod2pc").remove();
                $(".bgi_box").remove();
                $(".content_btn").remove();
                $(".hidden_xs").remove();
                $("#bofy").remove();
                $(".fo_t").remove();
                $(".list_scroll").remove();
                $(".title").remove();
            setInterval(() => {
                $("#bbb").click();
            }, 500);
            break
            default:
            break
            
        }
})();
