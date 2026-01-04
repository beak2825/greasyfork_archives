// ==UserScript==
// @name         头衔更改
// @version      0.2
// @include      https://www.mcbbs.net/*
// @author       xmdhs
// @description discuz头衔随时间变化
// @namespace https://greasyfork.org/users/166541
// @require https://cdn.jsdelivr.net/gh/blueimp/JavaScript-MD5@2.12.0/js/md5.min.js
// @downloadURL https://update.greasyfork.org/scripts/396573/%E5%A4%B4%E8%A1%94%E6%9B%B4%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/396573/%E5%A4%B4%E8%A1%94%E6%9B%B4%E6%94%B9.meta.js
// ==/UserScript==

(function () {
    var a = document.getElementsByClassName("user_info_menu_btn");
    var b = a[0].childNodes[7].lastChild.href;
    var c = b.indexOf('&formhash=');
    var key = b.substring(c + 10);
    var times = Math.round(new Date().getTime() / 1000)
    var time = md5(times)
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "home.php?mod=spacecp&ac=profile&op=info", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("formhash=" + key + "&customstatus=" + time + "&profilesubmit=true&profilesubmitbtn=true");
   setInterval(
      function a() {
         var a = document.getElementsByClassName("user_info_menu_btn");
         var b = a[0].childNodes[7].lastChild.href;
         var c = b.indexOf('&formhash=');
         var key = b.substring(c + 10);
         var times = Math.round(new Date().getTime() / 1000)
         var time = md5(times)
         var xmlhttp;
         xmlhttp = new XMLHttpRequest();
         xmlhttp.open("POST", "home.php?mod=spacecp&ac=profile&op=info", true);
         xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
         xmlhttp.send("formhash=" + key + "&customstatus=" + time + "&profilesubmit=true&profilesubmitbtn=true");
      }, 60000)
})();

