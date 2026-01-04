// ==UserScript==
// @name        ERM 后台&全屏打开
// @namespace   Violentmonkey Scripts
// @match       http://erm.ds.gome.com.cn/manager
// @grant       none
// @version     1.0
// @author      -
// @description 2020/6/26 上午10:24:33
// @downloadURL https://update.greasyfork.org/scripts/412062/ERM%20%E5%90%8E%E5%8F%B0%E5%85%A8%E5%B1%8F%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/412062/ERM%20%E5%90%8E%E5%8F%B0%E5%85%A8%E5%B1%8F%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==
var new_go = '<button class="new_go" style="position: fixed;top: 15px;left: 400px;z-index: 9999;"><a class="new_go_a" id="new_go_a" style="color:000" target="_blank" href="">全屏打开</a></button>';
    $("body").append(new_go)    
    // $("#LAY_app a, #LAY_app li,.layui-tab-title li").click(function(){
$("#LAY_app_tabs,.layui-side-menu>*").click(function(){
        console.log("全屏打开运行成功")
        setTimeout(function(){
            var new_src = $("#LAY_app_tabsheader .layui-this").attr("lay-id")
            // $(".new_go_a").attr("href",new_src)
            // document.getElementById("new_go_a").href = new_src
            document.getElementById("new_go_a").setAttribute("href",new_src)
        },500)
    })


  var mycss = `
  <style>
    .my_table_center td,* {
      font-size: 12px;
      font-family: serif;
    }
  </style>
  `;
$("body").append(mycss)