// ==UserScript==
// @name        纯净直播 - PureLive
// @namespace   PureLive
// @match       https://www.douyu.com/*
// @match       https://www.huya.com/*
// @match       https://live.bilibili.com/*
// @match       https://egame.qq.com/*
// @require     https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @grant       none
// @version     1.1
// @author      Tiger
// @description 无广告、无弹幕，纯净直播。支持斗鱼直播、虎牙直播、企鹅电竞、哔哩哔哩直播平台。
// @license     GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/438300/%E7%BA%AF%E5%87%80%E7%9B%B4%E6%92%AD%20-%20PureLive.user.js
// @updateURL https://update.greasyfork.org/scripts/438300/%E7%BA%AF%E5%87%80%E7%9B%B4%E6%92%AD%20-%20PureLive.meta.js
// ==/UserScript==


(function() {
    function popu(){
      var popu = document.createElement("div");
      popu.innerHTML='<span id="pureBtn" style="background:#09f;color:#FFFFFF;display: block;height: 18px;margin-right: 20px;padding: 10px;box-sizing: content-box;position: fixed;right: 0px;top: calc(50vh);border-radius: 10px;box-shadow: rgb(0 0 0 / 20%) 0px 2px 8px;z-index: 9999;cursor: pointer;user-select: none;}">净化吧！</span>';
      document.body.appendChild(popu);
    }
  
    function getQueryVariable(url,variable){
       var query = url.substr(url.lastIndexOf("?")+1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
    }
  
    function getRoomId(platform){
      switch(platform){
        case "douyu":
          return getQueryVariable($(".Title-anchorPicBack a")[0].href,"room_id");
        case "huya":
          return $(".host-rid").text();
        case "bilibili":
          return window.__NEPTUNE_IS_MY_WAIFU__.roomInitRes.data.room_id;
        case "egame":
          return $(".bubbles-wrapper").attr("anchor-id");
      }
      return false;
    }
  
    function getPlatform(){
      var url = window.location.href;
      if(url.includes("douyu.com")){
        return "douyu";
      }else if(url.includes("huya.com")){
        return "huya";
      }else if(url.includes("bilibili.com")){
        return "bilibili";
      }else if(url.includes("egame.qq.com")){
        return "egame";
      }
    }

    $("body").on("click","#pureBtn",function(){
      //判断平台
      var p = getPlatform();
      //获取房间号
      var rid = getRoomId(p);
      if(parseInt(rid) > 0){
        window.location.href = "http://live.urweibo.com/?p="+p+"&rid=" + rid;
      }else{
        rid = prompt("请手动输入房间号：");
        if(parseInt(rid) > 0){
          window.location.href = "http://live.urweibo.com/?p="+p+"&rid=" + rid;
        }
      }
    });
  
    popu();
})();