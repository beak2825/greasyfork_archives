// ==UserScript==
// @name        干净直播
// @namespace    https://greasyfork.org/users/91873
// @include      *://live.yj1211.work/*
// @grant       none
// @version      1.0.0.3
// @author       wujixian
// @description  clear live
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/446529/%E5%B9%B2%E5%87%80%E7%9B%B4%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/446529/%E5%B9%B2%E5%87%80%E7%9B%B4%E6%92%AD.meta.js
// ==/UserScript==

(async () => {
  delete window.RTCPeerConnection
  delete window.mozRTCPeerConnection
  delete window.webkitRTCPeerConnection
  delete window.RTCDataChannel
  delete window.DataChannel
  var flag=window.localStorage.getItem("isLogin")
  window.localStorage.clear();
  window.localStorage.setItem("userInfo","{\"uid\":\"c8daa39413bc49aaa781d72a15b23c54\",\"userName\":\"wujixian\",\"nickName\":\"无极限\",\"password\":\"1c75cc716662333874af4a8a8ddfbe29\",\"head\":null,\"isActived\":\"0\",\"allContent\":\"\",\"selectedContent\":\"\",\"douyuLevel\":\"1\",\"bilibiliLevel\":\"1\",\"huyaLevel\":\"1\",\"ccLevel\":\"1\",\"egameLevel\":\"1\"}");
  window.localStorage.setItem("isLogin","true");
  window.localStorage.setItem("mixLiveUpdate","2023101001");
  if(flag===null){
    location.reload();
  }
  setInterval(function () {
    if(document.getElementsByClassName("icon-danmukaiqi").length>0)
    {
      document.getElementsByClassName("icon-danmukaiqi")[0].click();
    }
  },3000);
})();