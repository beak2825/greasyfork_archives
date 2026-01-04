// ==UserScript==
// @name         记住B站动态首页上次看的位置
// @namespace  cordy
// @version      1.2
// @description  记住B站动态首页上次看的位置并自动滚动到该视频
// @author       cordy
// @license MIT
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/arrive@2.4.1/minified/arrive.min.js
// @match        https://t.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/466836/%E8%AE%B0%E4%BD%8FB%E7%AB%99%E5%8A%A8%E6%80%81%E9%A6%96%E9%A1%B5%E4%B8%8A%E6%AC%A1%E7%9C%8B%E7%9A%84%E4%BD%8D%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/466836/%E8%AE%B0%E4%BD%8FB%E7%AB%99%E5%8A%A8%E6%80%81%E9%A6%96%E9%A1%B5%E4%B8%8A%E6%AC%A1%E7%9C%8B%E7%9A%84%E4%BD%8D%E7%BD%AE.meta.js
// ==/UserScript==


var docCookies = {
  getItem: function (sKey) {
    return (
      decodeURIComponent(
        document.cookie.replace(
          new RegExp(
            "(?:(?:^|.*;)\\s*" +
              encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") +
              "\\s*\\=\\s*([^;]*).*$)|^.*$",
          ),
          "$1",
        ),
      ) || null
    );
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
      return false;
    }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires =
            vEnd === Infinity
              ? "; expires=Fri, 31 Dec 2099 23:59:59 GMT"
              : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie =
      encodeURIComponent(sKey) +
      "=" +
      encodeURIComponent(sValue) +
      sExpires +
      (sDomain ? "; domain=" + sDomain : "") +
      (sPath ? "; path=" + sPath : "") +
      (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!sKey || !this.hasItem(sKey)) {
      return false;
    }
    document.cookie =
      encodeURIComponent(sKey) +
      "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
      (sDomain ? "; domain=" + sDomain : "") +
      (sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    return new RegExp(
      "(?:^|;\\s*)" +
        encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") +
        "\\s*\\=",
    ).test(document.cookie);
  },
  keys: /* optional method: you can safely remove it! */ function () {
    var aKeys = document.cookie
      .replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "")
      .split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nIdx = 0; nIdx < aKeys.length; nIdx++) {
      aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
    }
    return aKeys;
  },
};

(async () =>  {
    'use strict';
    var last_watch_video = getRecordInfo();
    var has_new_item =false;
    var delay_to_scroll_id;
    var last_video_item;

    document.body.arrive(
        ".bili-dyn-my-info",
        {
            fireOnAttributesModification: true,
            onceOnly: true,
            existing: true,
        },
        item => {
             if(last_watch_video){
                 $(item).parent().parent().append(`<section><div style="background:#ffffff;padding:10px;text-align:center;font-size:12px;color:#6d757a;cursor:pointer" class="scroll-to-last-video">滚动到前次观看<br>最后视频：${last_watch_video.time}</div></section>`);
                 $('.scroll-to-last-video').click(function(){
                     scrollToLastVideo();
                 })
             }else{
                 $(item).parent().parent().append('<section><div style="background:#ffffff;padding:10px;text-align:center;font-size:12px;color:#6d757a;cursor:pointer" class="scroll-to-last-video">还没有观看记录</div></section>');
             }
        }
    );

    document.body.arrive(
        ".bili-dyn-list__item",
        {
            fireOnAttributesModification: true,
            onceOnly: false,
            existing: true,
        },
        item => {
            has_new_item = true;
            $(item).find("a.bili-dyn-card-video").mousedown(function(e){
                if(e.which == 1 || e.which == 2){
                    let time=timeToDate($(item).find(".bili-dyn-time").text().trim());
                    let id = $(item).find('[dyn-id]').attr("dyn-id");
                    last_watch_video = {time:time,id:id};
                    setRecordInfo(last_watch_video);
                    identifyLastVideo(item);
                }
            });
            $(item).mousedown(function(e){
                if(e.ctrlKey && (e.which == 1 || e.which == 2)){
                    let time=timeToDate($(item).find(".bili-dyn-time").text().trim());
                    let id =$(item).find('[dyn-id]').attr("dyn-id");
                    last_watch_video = {time:time,id:id};
                    setRecordInfo(last_watch_video);
                    identifyLastVideo(item);
                }
            });
        }
    );

    function scrollToLastVideo(){
        if(!last_watch_video){
            alert("还没有看过视频");
            return;
        }
        has_new_item =false;
        let item = checkLastVideo();
        if(item){
            identifyLastVideo(item);
            clearTimeout(delay_to_scroll_id);
            $('html,body').animate({
                scrollTop : last_video_item.offset().top,
            }, 1000);
        }else{
            $('html,body').animate({
                scrollTop : $(".bili-dyn-list__item:last").offset().top
            }, 1000,delayToScrollToLastVideo);
        }
    }

    function checkLastVideo(){
        let items = $(".bili-dyn-list__item");
        for(var i=0;i<items.length;i++){
            let item = items[i];
            let time=timeToDate($(item).find(".bili-dyn-time").text().trim());
            let id = $(item).find('[dyn-id]').attr("dyn-id");
            if(time<last_watch_video.time || (time == last_watch_video.time&& id==last_watch_video.id)){
                return item;
            }
        }
        return null;
    }

    function  delayToScrollToLastVideo(){
        if(has_new_item){
            scrollToLastVideo();
        }else{
            delay_to_scroll_id = setTimeout(delayToScrollToLastVideo,1000);
        }
    }

    function identifyLastVideo(item){
         if(last_video_item)last_video_item.find(".bili-dyn-time").css('color','');
         last_video_item = $(item);
         last_video_item.find(".bili-dyn-time").css('color','#fb7299');
    }

    function timeToDate(time) {
        let videoDate = new Date();
        let matches;
        if (time.match(/\d+年\d+月\d+日/)) {
            matches = time.match(/(\d+)年(\d+)月(\d+)日/);
            videoDate.setFullYear(matches[1]);
            videoDate.setMonth(matches[2] - 1);
            videoDate.setDate(matches[3]);
        }else if (time.match(/\d+月\d+日/)) {
            matches = time.match(/(\d+)月(\d+)日/);
            videoDate.setMonth(matches[1] - 1);
            videoDate.setDate(matches[2]);
        }else{
            let day=0;
            if (time.match(/\d+小时前/)) {
            }else if (time.match(/\昨天/)) {
                day = 1;
            }else if (time.match(/\d+天前/)) {
                matches = time.match(/(\d+)天前/);
                day = parseInt(matches[1]);
            }
            videoDate.setDate(videoDate.getDate()-day);
        }
        return formatTime('Y-M-D', videoDate);
    }

    function formatNum(num, dig = 2){
        let str = num + "";
        while (str.length < dig) {
            str = "0" + str;
        }
        return str;
    }

    function formatTime(format,time){
        //Y 4位年 M 2位月 D 2位日 y 2位年 m 1位月 d 1位日 H 2位时 I 2位分 S 2位秒 h 1位时 i 1位分 1 1位秒
        var d = new Date();
        if(typeof(time)=='number'){
            d.setTime(time);
        }else if(time instanceof Date){
            d = time;
        }
        if(!format)format="Y-M-D H:I:S";
        var str = format;//Y年M月D日
        str = str.split("Y").join(d.getFullYear().toString());
        str = str.split("y").join(d.getFullYear().toString().substr(2));
        str = str.split("M").join(formatNum(d.getMonth() + 1));
        str = str.split("m").join((d.getMonth() + 1).toString());
        str = str.split("D").join(formatNum(d.getDate()));
        str = str.split("d").join(d.getDate().toString());
        str = str.split("H").join(formatNum(d.getHours()));
        str = str.split("h").join(d.getHours().toString());
        str = str.split("I").join(formatNum(d.getMinutes()));
        str = str.split("i").join(d.getMinutes().toString());
        str = str.split("S").join(formatNum(d.getSeconds()));
        str = str.split("s").join(d.getSeconds().toString());
        return str;
    }

    function getRecordInfo(){
        return JSON.parse(docCookies.getItem("last_watch_video"));
    }

    function setRecordInfo(info){
        docCookies.setItem("last_watch_video", JSON.stringify(info),Infinity);
    }
})();


