// ==UserScript==
// @name         bilibili自写过滤器
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  try to take over the world!
// @author       Zino
// @match        *www.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @grant        none
// @require      https://apps.bdimg.com/libs/jquery/2.1.1/jquery.min.js
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/465027/bilibili%E8%87%AA%E5%86%99%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/465027/bilibili%E8%87%AA%E5%86%99%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==
//======================================
var zz = new Array();
//要屏蔽的up主关键字
zz = ["一","萌","啊","捏","苏打","儿","呀","哦","丫","吖","o","ui",
      "喵","ya","Ya","-","_","同学","饭","=","解说","肉","邻家",
      "菌","七七","三","诶","视角姬","好屏如潮","四川观察","爬爬娘",
      "穿毛裤","姬一元","GARNiDELiA","村霸","图吧首穷",
      //------------------------------------
      //游戏王鬼叫UP主
      "水无月","赤夏之鸣","铭阳","洺阳","日石rs终极大魔头","卷饼",
      //------------------
      "嘻嘻嘻2134678","咽气","侃英语","阿狸"
     ];


// 模糊匹配
function fuzzyMatch(str, key){
    let index = -1, flag = false;
    for(var i = 0, arr = key.split(""); i < arr.length; i++ ){
        //有一个关键字都没匹配到，则没有匹配到数据
        if(str.indexOf(arr[i]) < 0){
            break;
        }else{
            let match = str.matchAll(arr[i]);
            let next = match.next();
            while (!next.done){
                if(next.value.index > index){
                    index = next.value.index;
                    if(i === arr.length - 1){
                        flag = true
                    }
                    break;
                }
                next = match.next();
            }

        }
    }
    return flag
}


(function() {
    window.onload = function(){
        function 过滤主页推荐() {
            let 推广数量 = 0;
            let x , strlevel;
            推广数量 = Math.floor($(".rcmd-box-wrap").width() / $(".video-card-reco").width()) * 2;
            //这里需要另外获取
            if(isNaN(推广数量)) {
                //获取新版
                推广数量 = Math.floor($(".recommend-container__2-line").width() / $(".bili-video-card").width()) * 2;
                if(isNaN(推广数量))
                {
                    //判断是否旧页面
                    推广数量 = Math.floor($(".recommend-module").width() / $(".groom-module").width()) * 2;
                    if(推广数量 >= 3)
                    {
                        删除旧的主页推广();
                    }

                    console.log("[info] 非主页或是获取失败,或是已获取过,抛弃执行.");
                    return;
                }
            }
            console.log("[info] 当前页面数量:  ",推广数量);
            //-----------------------
            //主页推荐的广告过滤
            $(".bili-video-card .bili-video-card__info--ad").each(function (index, element) {
                $(this).parent().parent().parent().parent().parent().parent().remove();
                return false;
            });

            //屏蔽作者
            for (x = 0; x < zz.length; x++) {
                if (zz[x] != "") {
                    //匹配作者
                    $(".video-card-reco .info-box .info .up").each(function (index, element) {
                        //支持作者模糊匹配
                        strlevel = $(this).text();
                        //console.log("新的请求->",strlevel, zz[x]);
                        if(fuzzyMatch(strlevel, zz[x]))
                        {
                            console.log("[info] 命中关键词->",strlevel,"命中词为->",zz[x]);
                            $(this).parent().parent().parent().parent().hide();
                            return false;
                        }
                    });
                    $(".bili-video-card .bili-video-card__info--author").each(function (index, element) {
                        strlevel = $(this).text();
                        if(fuzzyMatch(strlevel, zz[x]))
                        {
                            console.log("[info] 命中关键词->",strlevel,"命中词为->",zz[x]);
                            $(this).parent().parent().parent().parent().parent().parent().remove();
                            return false;
                        }
                    });
                }
            }
        }

        function 删除旧的主页推广()
        {
            let strlevel ,x;

            for (x = 0; x < zz.length; x++) {
                if (zz[x] != "")
                {
                    $(".groom-module .author").each(function (index, element) {
                        //支持作者模糊匹配
                        strlevel = $(this).text();
                        if(fuzzyMatch(strlevel, zz[x]))
                        {
                            console.log("[info] 命中UP关键词-> ",strlevel ," , 命中词为-> " , zz[x]);
                            $(this).parent().parent().parent().hide();
                            return false;
                        }
                    });
                }
            }
            //移除推广界面
            $(".storey-box").each(function (index, element)
               {
                strlevel = $(this).text();
                console.log("dbg->",strlevel);
                    $(this).parent().parent().hide();
                    return false;
               });
            //移除主页直播页面
            $(".live-module").each(function (index, element)
               {
                strlevel = $(this).text();
                console.log("dbg->",strlevel);
                    $(this).hide();
                    return false;
               });



        }



        //直接连本带利移除掉推广栏目
        function 删除推广栏目()
        {
            //删除大推广页
            //$("div.focus-carousel").each(function (index, element) { $(this).remove();});
            //删除推广
            $("div.extension").each(function (index, element) { $(this).remove();});
            $("div.bypb-window").each(function (index, element) { $(this).remove();});
            //删除直播
            $("div.live-list").each(function (index, element) { $(this).remove(); });
            $("div.live-tabs").each(function (index, element) { $(this).remove(); });

            //新版页面 - 推广
            $("div.eva-extension-area").each(function (index, element) { $(this).remove(); });
            //新版页面 - 直播
            $("div.live-card-list").each(function (index, element) { $(this).remove(); });
            $("div.aside-head").each(function (index, element) { $(this).remove(); });

            //屏蔽头上的插件警告
            $("div.adblock-tips").each(function (index, element) { $(this).remove(); });
        }
        //屏蔽播放页的UP
        function 屏蔽播放页面UP()
        {
            //判断当前页面是否属于播放页.
            let x;
            var fl,i;
            for (x = 0; x < zz.length; x++)
            {
                if (zz[x] != "") {
                    fl = document.evaluate('//div[@class="rec-list"]/div[@class="video-page-card"]/div[@class="card-box"]/div[@class="info"]/div[@class="count up"]/a[contains(text(),"' + zz[x] + '")]/../../../..', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                    if (fl.snapshotLength) {
                        for (i = fl.snapshotLength - 1; i > -1; i--)
                        {
                            //console.log("屏蔽up/标题 " + "\t" + zz[x] + " :\t->" + fl.snapshotItem(i).innerText.replace(/\n/g, " ").replace(/\s\s/g, " "));
                            fl.snapshotItem(i).remove();
                        }
                    }
                }

            }

        }
        //1秒后寻找元素,并进行HOOK功能! [当前只针对老版页面的 换一换]
        setTimeout(function () {
            //Hook按钮-旧版页面
            $(".rcmd-box-wrap .change-btn").click(function () {
                setTimeout(()=>{过滤主页推荐()}, 500);
            })
            //Hook按钮,新版页面
            $("div.roll-btn-wrap .roll-btn").click(function () {
                setTimeout(()=>{过滤主页推荐()}, 500);
            })
            //Hook按钮 [2023.5.19新增]
            $("div.feed-roll-btn").click(function () {
                setTimeout(()=>{过滤主页推荐()}, 500);
            })
            //---------------
            //Hook按钮 [2023.9.27新增]
            $("span.rec-btn.next").click(function () {
                setTimeout(()=>{删除旧的主页推广()}, 500);
            })
            //---------------

            过滤主页推荐();
            删除推广栏目();
            var site = location.href;
            if ((site.indexOf("video/") > -1 && site.indexOf("online.html") < 0) || site.indexOf("play/") > -1) {
                setTimeout(()=>{屏蔽播放页面UP()}, 1000);
            }
        }, 1000);
    }
})();

