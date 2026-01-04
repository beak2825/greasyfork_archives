// ==UserScript==
// @name         bilibili小助手
// @namespace    http://tampermonkey.net/
// @version      0.5.1
// @description  自动分享视频获取5经验
// @author       Yuuuuu
// @match        *://bilibili.com/*
// @include      *://www.bilibili.com/video/av*
// @require      https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372144/bilibili%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/372144/bilibili%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

//自动分享视频获取5经验
(function() {
function Jrequest(url,data) {
    var ajax = new XMLHttpRequest();
    ajax.open("post",url);
    ajax.withCredentials = true;
    ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    ajax.send('aid='+data.aid +'&'+'csrf='+data.csrf);
    ajax.onreadystatechange = function () {
        if (ajax.readyState==4 && ajax.status==200){
            console.log(ajax.responseText)
        }
    }
}

    //获取当前av号
    var avId = document.URL;
    avId = avId.match(/\d+/)[0];
    console.log('当前视频AV号：'+avId);
  //获取bili_jct
   var bili_jct = Cookies.get('bili_jct');
   console.log(bili_jct)
  //判断当前时间
  var TimeShare = localStorage.getItem("TimeShare");
  console.log('当前TimeShare的时间为：'+TimeShare);
  var myDate = new Date();
  myDate = myDate.getDate();

  //第一次使用
  if(TimeShare === '' || TimeShare === null  ){
    localStorage.setItem('TimeShare',myDate);
      Jrequest("https://api.bilibili.com/x/web-interface/share/add",{'aid':avId,'jsonp':'jsonp','csrf':bili_jct})
  }else if (TimeShare != myDate){
    Jrequest("https://api.bilibili.com/x/web-interface/share/add",{'aid':avId,'jsonp':'jsonp','csrf':bili_jct})
 }
})()
