// ==UserScript==
// @name         郎振彬个人出品脚本
// @namespace    http://realtimeinfo.com.cn/
// @version      0.19
// @description  try to take over the world!
// @author       langzhenbin
// @match        http://192.168.50.213/*
// @match        http://172.18.1.81/*
// @match        http://172.18.1.80/*
// @match        http://192.168.1.187/*
// @match        http://whatismyviewport.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405979/%E9%83%8E%E6%8C%AF%E5%BD%AC%E4%B8%AA%E4%BA%BA%E5%87%BA%E5%93%81%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/405979/%E9%83%8E%E6%8C%AF%E5%BD%AC%E4%B8%AA%E4%BA%BA%E5%87%BA%E5%93%81%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';


var x = document.querySelectorAll(".main_text");
//alert(x[0].style.width);
x[0].style.width = "255px";
// 	alert(x.style.width);

var z = document.querySelectorAll(".list_table_heading_col");
//alert(x[0].style.width);
z[0].width = "20%";
z[1].width = "20%";
z[2].width = "20%";

//alert("Good");

//      var obj = document.getElementsByClassName("main_text");
//alert(obj)
//    obj.style.width = "255px";
//      obj.setAttribute("className","otherclass");//IE下使用className
// obj.setAttribute("class","otherclass");//FF下的方式 所以要注意


document.getElementsByTagName("title")[0].innerText = 'Matflo WMS - 郎振彬修改适配。';

var tab11 = document.getElementById("std_table");
tab11.style.width = "265px";//width: 217px; table-layout: fixed;


var metaList = document.getElementsByTagName("meta");
for (var j = 0; j < metaList.length; j++) {
  if (metaList[j].getAttribute("name") == "viewport") {
    metaList[j].content = "width=250, initial-scale=1.0, user-scalable=no";
  }
}

var div1 = document.getElementById("main_content");
div1.style.height = "255px";




var list = document.querySelectorAll( 'P[style]' );
    for ( var i=0; i<list.length; i++ ) {
   if((list[i].style.fontSize == '150%')|(list[i].style.fontSize == '125%') ){
           list[i].style.fontSize = '120%';
		   }
}
    function bodyScale() {
    var devicewidth = document.documentElement.clientWidth;
    var scale = devicewidth / 250;//分母——设计稿的尺寸
    document.body.style.zoom = scale;
}
window.onload = window.onresize = function () {
    bodyScale();
};


})();
