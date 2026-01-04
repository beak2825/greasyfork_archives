// ==UserScript==
// @name         mycrack
// @namespace    https://greasyfork.org/zh-CN/scripts/35250-mycrack
// @version      2021.3.7
// @description  try to take over the world!
// @author       love336
// @match        https://*.fcww18.com/videos/*
// @match        http://*.xiaobi013.com/videos/*
// @match        http://*.papax.me/*.html
// @match        http://mjuy.pw/*
// @match        http://www.qyl74.com/*/*/
// @match        http://www.19fuli.club/*
// @match        https://boqil.com/*
// @match        http://*.5916av.com/*
// @match        http://*.china-auro.com/*
// @match        https://*.ssp34.cc/videos/*
// @match        https://kkys.live/*/view_*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35250/mycrack.user.js
// @updateURL https://update.greasyfork.org/scripts/35250/mycrack.meta.js
// ==/UserScript==

if (location.host.indexOf("fcww18") > -1) {
    var item = document.getElementsByClassName("info")[0].children;                       //定位视频下载信息，并且使之显示
    item[item.length - 1].removeAttribute("style");
    if (document.getElementsByClassName("no-player").length) {                            //判断是否禁止播放
        if (document.getElementById("look_video"))                                        //判断是否需要积分才能观看，需要积分则替换为引用视频代码
            document.getElementsByClassName("no-player")[0].innerHTML = '<iframe width="100%" height="560" src="http://www.fcww18.com/embed/' + pageContext.videoId + '" frameborder="0" allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen></iframe>';
        else html5video(6);                                                               //不需要积分则按私有视频处理
    }
}

else if (location.host.indexOf("xiaobi013") > -1) {
    document.cookie = "video_log= ; path=/; domain=.xiaobi013.com";                        //修改cookie：video_log= 清除记录以解除观看数量限制
    if (document.getElementsByClassName("no-player").length) {                            //判断是否为私有视频
        var item = document.getElementsByClassName("info")[0].children;                   //从下载连接获取视频地址
        html5video(7);
    }
}

else if (location.host.indexOf("papax") > -1) {
    var preview_url = window.parent.document.getElementsByTagName("img")[0].src;          //获取预览图片地址
    var img = preview_url.match(/(\d+)\/(.+)(?=\.jpg)/);                                  //通过预览图获取视频文件名
    img = img[1] + img[2];
    document.getElementsByClassName("video")[0].innerHTML = '<video id="myVideo" src="../../../d/file/video/' + img + '.mp4" poster="' + preview_url + '" controls autoplay width="100%" height="100%"></video>';            //写入视频代码
    document.getElementById("myVideo").volume = 0.2;
}

else if (location.host.indexOf("mjuy") > -1) {
    var vip = document.getElementById("appModal");                              //找到弹出的加入VIP提示框
    if (location.href.indexOf("/play") > -1) {                                  //判断是否普通视频播放页面
        var video = document.getElementById("video-play_html5_api");            //找到页面上的播放器
        video.volume = 0.2;
        document.getElementById("video-play").onclick = function() {            //视频被点击时执行
            var tmp = video.src.split("com/")[1].split("/", 1);                 //从视频连接获取临时播放编码
            document.cookie = "tmp=" + tmp + "; path=/";                        //将临时编码写入到Cookie
        };
    }
    var all = document.getElementsByClassName("video-vertical");                //找到页面上的所有视频
    for(var i=0; i<all.length; i++) {                                           //使用循环找到被点击的视频
        all[i].onclick = function() {
            if (video) video.pause();                                           //如果页面上已有视频则使之暂停
            var img = event.target.parentNode.parentNode.parentNode.getElementsByTagName("img")[0].src.split("thumb/")[1].split("_thumb", 1);                     //从被点击的视频预览图获取文件名
            vip.children[0].innerHTML = '<p style="color:white">VIP视频如无法播放请先播放一次普通视频以获取编码</p><video id="myVideo" src="http://a.b.space.lsjmail.com/' + getCookie("tmp") + '/'+ img + '-a.mp4" controls autoplay></video>';            //使用视频代码替换VIP提示框
            document.getElementById("myVideo").volume = 0.2;
        };
    }
    vip.onclick= function() {document.getElementById("myVideo").pause();};      //退出VIP视频时使之暂停
}

else if (location.host.indexOf("qyl74") > -1) {
    videojs('player').videoJsResolutionSwitcher({'default': 360, 'dynamicLabel': true});       //将默认视频源切换为360p
    document.getElementById("player_html5_api").volume = 0.2;
}

else if (location.host.indexOf("19fuli") > -1)
    document.cookie = "PHPSESSID=";                                             //修改cookie：PHPSESSID= 清除记录以解除浏览数量限制

else if (location.host.indexOf("boqil") > -1)
    //document.cookie = "guestview_7ree=1";                                             //修改cookie：PHPSESSID= 清除记录以解除浏览数量限制
    document.getElementsByTagName("video")[0].volume = 0.2;

else if (location.host.indexOf("5916") > -1) {
    all = document.getElementsByTagName("em");                              //找到页面上的所有视频
    for(i=0; i<all.length; i++) {                                           //使用循环找到被点击的视频
        all[i].onclick = function() {
            var id = event.target.parentNode.href.split("/voddetail/")[1].split(".html", 1);                                        //从被点击的视频获取id
            img = event.target.parentNode.getElementsByTagName("img")[0].src.split("/yp/")[1].split(".jpg", 1);                     //从被点击的视频预览图获取文件名
            document.cookie = "tmp=" + img + "; path=/";
            event.target.parentNode.href = "/vodplay/" + id + "-1-1.html";                          //修改跳转链接
        };
    }
    document.getElementById("bofang_box").innerHTML = '<video id="myVideo" src="http://9xhk.cn/yp/' + getCookie("tmp") + '.mp4" controls autoplay width="100%" height="100%"></video>';
    document.getElementById("myVideo").volume = 0.2;
}

else if (location.host.indexOf("china-auro") > -1) {
    timesj = 999999;
}

else if (location.host.indexOf("ssp34") > -1) {
    var path = $("meta[property='og:image']")[0].content.match(/\D+(\/\d+\/(\d+)\/)preview(\w*\.mp4)\.jpg/);      //通过预览图获取路径
    document.getElementsByClassName("player")[0].innerHTML = '<video id="myVideo" src="https://vvvvone.govvvver.com/contents/videos' + path[1] + path[2] + path[3] + '" poster="' + path[0] + '" controls width="100%" height="560"></video>';            //写入视频代码
    myVideo.onerror = function() {                     //视频加载失败则更换服务器
        myVideo.src = 'https://vvvvtwo.govvvver.com/contents/videos' + path[1] + path[2] + path[3];
        myVideo.onerror = function() {                 //视频加载失败则更换服务器
            myVideo.src = 'https://vvvvthree.govvvver.com/contents/videos' + path[1] + path[2] + path[3];
        };
    };
    myVideo.volume = 0.2;
}

else if (location.host.indexOf("kkys") > -1) {
    setTimeout("function timeHandler(time) {}");
}


//for fcw,kdw
function html5video(metaNum) {
    var video_url = item[item.length - 1].children[0].href.split("/?", 1);                //从下载连接获取视频地址
    var preview_url = document.getElementsByTagName("meta")[metaNum].content;             //获取预览图片地址
    document.getElementsByClassName("player")[0].innerHTML = '<video id="myVideo" src="' + video_url + '" poster="' + preview_url + '" controls width="100%" height="560"></video>';            //写入视频代码
    document.getElementById("myVideo").volume = 0.2;
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  }
