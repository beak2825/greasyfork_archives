// ==UserScript==
// @name         自用显示视频AV号、BV号、CID脚本
// @namespace    自用显示视频AV号、BV号、CID脚本
// @version      4.2
// @description  供自己方便使用的显示视频AV号、BV号、CID脚本
// @author       B站百科全书
// @copyright    2021,B站百科全书(https://space.bilibili.com/8350763)
// @license      MIT
// @require      https://cdn.staticfile.org/jquery/3.2.1/jquery.min.js
// @include      *.bilibili.com/video/*
// @include      *.bilibili.com/bangumi/play/*
// @include      *.bilibili.com/watchlater/*
// @include      *.bilibili.com/medialist/play/*
// @downloadURL https://update.greasyfork.org/scripts/398515/%E8%87%AA%E7%94%A8%E6%98%BE%E7%A4%BA%E8%A7%86%E9%A2%91AV%E5%8F%B7%E3%80%81BV%E5%8F%B7%E3%80%81CID%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/398515/%E8%87%AA%E7%94%A8%E6%98%BE%E7%A4%BA%E8%A7%86%E9%A2%91AV%E5%8F%B7%E3%80%81BV%E5%8F%B7%E3%80%81CID%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

/*
更新记录
2020-03-23-v1.0——正式发布
2020-03-25-v2.0——修改代码增加容错性
2020-04-02-v2.1——支持稍后再看播放页
2020-07-18-v3.0——1、支持新版稍后再看播放页 2、优化代码结构 3、添加并修改注解信息
2020-09-17-v4.0——1、支持收藏夹连播页 2、添加并修改注解信息
2020-11-09-v4.1——修复因为B站稍后再看和收藏夹连播播放页面更新导致功能失效的问题
2021-07-27-v4.2——修复番剧视频3.0灰度播放器无法正常使用的问题
*/

//封装方法方便执行
function pd() {
    var url = window.location.pathname; //获取当前页面的URL
    if(url.search("watchlater")!=-1||url.search("ml")!=-1){ //判断URL中是否含有“watchlater”和“ml”内容，如果有“watchlater”则说明当前页面是稍后再看页面，调用稍后再看&收藏夹连播专用方法，如果有“ml”则说明当前页面是收藏夹连播页面，调用稍后再看&收藏夹连播专用方法，如果都没有则调用普通方法
        xs2(); //稍后再看&收藏夹连播专用方法
    }else if(url.search("bangumi")!=-1){ //判断URL中是否含有“bangumi”内容，如果有则说明当前页面是番剧视频播放页面，调用番剧专用方法
    xs3(); //番剧专用方法
    }else{
        xs(); //普通方法
    }
}

function xs() { //普通方法
    if (aid) {
        var av = aid; //所有视频输入“aid”可以直接获取av号，番剧等类型视频无法通过此方法获取bv号
        var bv; //保存bv号
        var cid; //保存cid
        $.get("https://api.bilibili.com/x/web-interface/view?aid=" + av, function(data) { //使用jQuery的get方法通过B站相关api接口获取与视频AVID对应的数据
            bv = data.data.bvid; //从返回的数据中获取"bvid"的内容，该内容即为视频bv号
            $.get("https://api.bilibili.com/x/player/pagelist?bvid=" + bv, function(data) { //使用jQuery的get方法通过B站相关api接口获取与视频BVID对应的数据
                cid = data.data[0].cid; //从返回的数据中获取"cid"的内容，该内容即为视频cid
                console.log('自用显示脚本 by B站百科全书 普通 0：\nav号=av' + av + '\nbv号=' + bv + '\ncid=' + cid); //在浏览器控制台中输出信息
            });
        });
    } else if (bvid) {
        var av_; //保存av号
        var bv_ = window.bvid; //普通视频输入“bvid”可以直接获取bv号
        var cid_; //保存cid
        $.get("https://api.bilibili.com/x/web-interface/view?bvid=" + bv_, function(data) { //使用jQuery的get方法通过B站相关api接口获取与视频BVID对应的数据
            av_ = data.data.aid; //从返回的数据中获取"avid"的内容，该内容即为视频av号
            $.get("https://api.bilibili.com/x/player/pagelist?bvid=" + bv_, function(data) { //使用jQuery的get方法通过B站相关api接口获取与视频BVID对应的数据
                cid_ = data.data[0].cid; //从返回的数据中获取"cid"的内容，该内容即为视频cid
                console.log('自用显示脚本 by B站百科全书 普通 1：\nav号=av' + av_ + '\nbv号=' + bv_ + '\ncid=' + cid_); //在浏览器控制台中输出信息
            });
        });
    } else {
        console.log('自用显示脚本 by B站百科全书 普通 2：\n无法获取到av号和bv号！'); //如果视频av号和bv号都无法获取到，在浏览器控制台输出报错信息
    }
}

function xs2() { //稍后再看&收藏夹连播专用方法
    var url = $('.play-title-location').attr('href'); //获取标题对应的链接内容，里面含有视频BV号
    var bvid = url.substring(url.indexOf("B")); //从链接内容中截取视频BV号
    var aid; //保存av号
    var cid; //保存cid
    $.get("https://api.bilibili.com/x/web-interface/view?bvid=" + bvid, function(data) { //使用jQuery的get方法通过B站相关api接口获取与视频BVID对应的数据
        aid = data.data.aid; //从返回的数据中获取"aid"的内容，该内容即为视频av号
        $.get("https://api.bilibili.com/x/player/pagelist?bvid=" + bvid, function(data) { //使用jQuery的get方法通过B站相关api接口获取与视频BVID对应的数据
            cid = data.data[0].cid; //从返回的数据中获取"cid"的内容，该内容即为视频cid
            console.log('自用显示脚本 by B站百科全书 稍后再看&收藏夹连播专用：\nav号=av' + aid + '\nbv号=' + bvid + '\ncid=' + cid); //在浏览器控制台中输出信息
        });
    });
}

function xs3() { //番剧专用方法
var url = $('.pub-wrapper')[0].children[2].href; //获取番剧BV号链接，里面含有视频BV号
    var bvid = url.substring(url.indexOf("B"),url.lastIndexOf('/')); //从链接内容中截取视频BV号
    var aid; //保存av号
    var cid; //保存cid
    $.get("https://api.bilibili.com/x/web-interface/view?bvid=" + bvid, function(data) { //使用jQuery的get方法通过B站相关api接口获取与视频BVID对应的数据
        aid = data.data.aid; //从返回的数据中获取"aid"的内容，该内容即为视频av号
        $.get("https://api.bilibili.com/x/player/pagelist?bvid=" + bvid, function(data) { //使用jQuery的get方法通过B站相关api接口获取与视频BVID对应的数据
            cid = data.data[0].cid; //从返回的数据中获取"cid"的内容，该内容即为视频cid
            console.log('自用显示脚本 by B站百科全书 番剧专用：\nav号=av' + aid + '\nbv号=' + bvid + '\ncid=' + cid); //在浏览器控制台中输出信息
        });
    });
}

setTimeout(pd, 3000); //设置延迟3秒再执行