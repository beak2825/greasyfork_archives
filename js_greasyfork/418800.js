// ==UserScript==
// @name         lyj视频解析工具3.0
// @namespace    http://tampermonkey.net/
// @version      2.8.5
// @description  升级2.0 测试版本 想知道有什么好的beta
// @author       tang1jun
// @include      *.youku.com/v*
// @include      *m.youku.com/*
// @include      *v.qq.com/x/*
// @include      *v.qq.com/p*
// @include      *v.qq.com/cover*
// @include      *v.qq.com/tv/*
// @include      *film.sohu.com/album/*
// @include      *tv.sohu.com/*
// @include      *.iqiyi.com/v_*
// @include      *.iqiyi.com/w_*
// @include      *.iqiyi.com/a_*
// @include      *.le.com/ptv/vplay/*
// @include      *.tudou.com/listplay/*
// @include      *.tudou.com/albumplay/*
// @include      *.tudou.com/programs/view/*
// @include      *.tudou.com/v*
// @include      *.mgtv.com/b/*
// @include      *.acfun.cn/v/*
// @include      *.bilibili.com/video/*
// @include      *.bilibili.com/anime/*
// @include      *.bilibili.com/bangumi/play/*
// @include      *.pptv.com/show/*
// @include      *.wasu.cn/Play/show*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418800/lyj%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E5%B7%A5%E5%85%B730.user.js
// @updateURL https://update.greasyfork.org/scripts/418800/lyj%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E5%B7%A5%E5%85%B730.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var $ = $ || window.$;

    addStyle();

    $('body').append('<div class="lyjvip wrapper"><ui class="mainMenu"><li class="item"id="account"><span class="btn"><i class="fas fa-user-circle"></i>播放线路</span><div class="subMenu vipjx"><span>全民</span><span>思古</span><span>tv920</span></div></li><li class="item"id="support"><span class="btn"><i class="fas fa-info"></i>技术支持</span><div class="subMenu"><span>tang1jun</span></div></li></ui></div>')

    function GMopenInTab(url, open_in_background) {
        if (typeof GM_openInTab === "function") {
            GM_openInTab(url, open_in_background);
        } else {
            GM.openInTab(url, open_in_background);
        }
    }

    function createStyle() {
        return "*{list-style:none;text-decoration:none}.wrapper{position:fixed;z-index:99999;left:0%;top:50%;transform:translate(0%,-50%)}.mainMenu{width:116px;display:block;border-radius:10px;overflow:hidden}.item{border-top:1px solid #ef584a;overflow:hidden}.btn{display:block;padding:15px 20px;background-color:#ff6f61;color:#fff;position:relative}.btn:before{content:'';position:absolute;width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:10px solid #ff6f61;right:15px;bottom:-10px;z-index:9}.btn i{margin-right:10px}.subMenu{background:#273057;overflow:hidden;transition:max-height 0.7s;max-height:0}.subMenu span{display:block;padding:9px 20px;color:#fff;font-size:14px;border-bottom:1px solid #394c7f;position:relative}.subMenu span:before{content:'';opacity:0;transition:opacity 0.3s}.lyjvip .subMenu span:hover:before{content:'';position:absolute;height:0;width:6px;left:0;top:0;opacity:1;border-top:24px solid transparent;border-left:11px solid #fcdc29;border-bottom:24px solid transparent}.subMenu span:after{content:'';opacity:0;transition:opacity 0.3s}.lyjvip .subMenu span:hover:after{content:'';position:absolute;height:0;width:6px;right:0px;top:0;opacity:1;border-top:24px solid transparent;border-right:11px solid #fcdc29;border-bottom:24px solid transparent}.lyjvip .subMenu span:hover{background:#273057;background:-moz-linear-gradient(top,#273057 0%,#273057 50%,#394c7f 51%,#394c7f 100%);background:-webkit-linear-gradient(top,#273057 0%,#273057 50%,#394c7f 51%,#394c7f 100%);background:linear-gradient(to bottom,#273057 0%,#273057 50%,#394c7f 51%,#394c7f 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#273057',endColorstr='#394c7f',GradientType=0);transition:all 0.3s;border-bottom:1px solid #394c7f}.nihao{max-height:1000em;}"
    }

    function addStyle() {
        var style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = createStyle();
        window.document.head.appendChild(style);
    }

    // 全屏播放
    function ow(owurl) {
        window.open(owurl);
    }

    var log_count = 1;
    var host = location.host;
    var parseInterfaceList = [];
    var selectedInterfaceList = [];
    var originalInterfaceList = [
        {
            nme: "B站1",
            type: "0",
            url: "https://vip.parwix.com:4433/player/?url="
        },
        {
            nme: "思古",
            type: "0",
            url: "https://jsap.attakids.com/?url="
        },

        {
            nme: "tv920",
            type: "0",
            url: "https://api.tv920.com/vip/?url="
        },

        //--------------------------------------------------------------------------------------

    ];
    var innerList = [];
    var outerList = [];
    var innerli = "";
    var innerli1 = "";
    var outerli = "";
    originalInterfaceList.forEach((item, index) => {
        if (item.type == "0") {
            innerList.push(item);
            innerli1 += "<li>" + item.nme + "</li>";
        }
        if (item.type == "1") {
            innerList.push(item);
            innerli += "<li>" + item.name + "</li>";
        }
        if (item.type == "2") {
            outerList.push(item);
            outerli += "<li>" + item.name + "</li>";
        }
    });
    parseInterfaceList = innerList.concat(outerList);



    $(".lyjvip li").on({
        click:function(){
            console.info('lyj:keyile');

            if($(this).find("div.subMenu").is('.nihao')){
                $(this).find("div.subMenu").removeClass('nihao')
            } else {
                console.info('lyj: haved')
                $(this).find("div.subMenu").addClass('nihao')
            }
        }
    });

    $(".lyjvip li").each((index, item) => {
        console.info('lyj:bianli biaoti', item);
        item.addEventListener("click", () => {
            console.info('lyj:add listener to biaoti', );

            // debugger
            $(this).removeClass('btn');

            if($('.vipjx').is(':hidden')){
                console.log('lyj:yincangde !!!')
            } else {
                console.log('lyj:dakaile !!!')
            }

        });
    });

    $(".vipjx span").each((index, item) => {
        console.info('lyj:you click span for vip', item);
        item.addEventListener("click", () => {
            console.info('lyj:add listener to span', parseInterfaceList[index].type);

            if (parseInterfaceList[index].type == "0") {
                // GMopenInTab(parseInterfaceList[index].url + location.href, false);
                ow(parseInterfaceList[index].url + location.href);
            }
        });
    });

})();