// ==UserScript==
// @name         咸鱼搜索框
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://2.taobao.com/*
// @match        https://s.2.taobao.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38319/%E5%92%B8%E9%B1%BC%E6%90%9C%E7%B4%A2%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/38319/%E5%92%B8%E9%B1%BC%E6%90%9C%E7%B4%A2%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var script=document.createElement("script");
script.type="text/javascript";
script.src="https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(script);
 var d ="<div class=\"idle-search\">";
 var u ="<form method=\"get\" action=\"//s.2.taobao.com/list/list.htm\" name=\"search\" target=\"_top\">";
 var w =   "<input class=\"input-search\" id=\"J_HeaderSearchQuery\" name=\"q\" type=\"text\" value=\"\" placeholder=\"搜闲鱼\" />";
 var e =     "<input type=\"hidden\" name=\"search_type\" value=\"item\" autocomplete=\"off\" />";
 var n =    "<input type=\"hidden\" name=\"app\" value=\"shopsearch\" autocomplete=\"off\" />";
 var i =   "<button class=\"btn-search\" type=\"submit\"><i class=\"iconfont\">&#xe602;</i><span class=\"search-img\"></span></button>";
 var l =   "</form>";
 var y = "</div>";
var total=d+u+w+e+n+i+n+i+l+y;
 // var x = document.getElementsByClassName(".idle-header-wrap");
 //    x[0].insertAdjacentHTML('afterEnd',total);

setTimeout(function(){
$(document).ready(function(){
  $('.idle-header-wrap').append(total);

});
},1000);
   // alert(total);

  //  $(".idle-header-wrap").append(total);
    // Your code here...
})();