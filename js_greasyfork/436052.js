// ==UserScript==
// @name        mine
// @namespace   Violentmonkey Scripts
// @match       *://*.iqiyi.com
// @match       *://*.iqiyi.com/v*
// @match       *://*.qq.com/*/*/*
// @grant       none
// @version     1.0
// @author      -
// @description 2021/11/22 下午1:33:27
// @downloadURL https://update.greasyfork.org/scripts/436052/mine.user.js
// @updateURL https://update.greasyfork.org/scripts/436052/mine.meta.js
// ==/UserScript==
(function(){
  "use strict";
  // 解析用的url链接
  var parse_url =[
    {"name":"1717","url":"https://www.1717yun.com/jx/ty.php?url="},
    {"name":"pangu","url": "https://www.pangujiexi.com/jiexi/?url="},
    {"name":"17yun","url": "https://www.1717yun.com/1717yun/?url="},
    // {"name":"17yun","url": "http://17kyun.com/api.php?url="}
  ]
  // 创建一个容器container
  var mine_container = document.createElement("div"); 
  // 为container添加样式
  var ctn_style = "max-width:56px;min-width:56px;position:fixed;top:200px;left:0;z-index:999;border:none;";
  mine_container.style=ctn_style
  
  // 创建一个解析按钮容器content
  var mine_content = document.createElement("div");
  var ctt_style = "max-width:64px;min-width: 64px;border:none;margin:0;";
  mine_content.style = ctt_style;
  mine_content.setAttribute("hidden",""); //隐藏content盒子
  
  var mine_over = function() {
    // window.open("https://www.baidu.com")
    //当鼠标移入mine的时候显示content
    mine_content.removeAttribute("hidden");
  }
  
  var mine_leave = function() {
    //当鼠标移出mine的时候隐藏content
    mine_content.setAttribute("hidden","");
  }
  
  var img_url = "http://p1.qhmsg.com/dm/180_180_100/t0164d6ed814abfc554.jpg"; // 头像url
  // 创建一个主按钮mine
  var mine = document.createElement("button");
  // 为mine编辑样式
  var mine_style = "width:56px;height:56px;margin:0;padding:0;display: inline;font-size:18px;color:white;z-index:999;border:none;outline:none;cursor:pointer;opacy:0;";
  mine.id="mine";//为mine设置id
  // 为mine编辑样式
  mine.style=mine_style;
  mine.style.backgroundColor="skyblue"; // 为mine添加背景颜色
  // mine.style.backgroundImage="url(http://p1.qhmsg.com/dm/180_180_100/t0164d6ed814abfc554.jpg)";
  mine.innerHTML="MINE";
  mine.onmouseover=mine_over
  mine.onmouseleave=mine_leave
//   mine.onclick = (e) => {
    
//   }
  
  mine_container.addEventListener("mouseover",mine_over);
  mine_container.addEventListener("mouseleave",mine_leave);
  var btn_style="width:56px;height:56px;font-size:16px;line-height:56px;border:none;display:block;text-align:center;text-decoration:none;color:black;background-color:skyblue;margin:5px 0;";
  for(var p in parse_url){
    //为每个解析按钮创建一个btn，设置属性并放进content中
    var mine_btn = document.createElement("a"); 
    mine_btn.innerHTML=parse_url[p].name;
    mine_btn.style=btn_style;
    mine_btn.setAttribute("href",parse_url[p].url+window.location.href)
    mine_btn.target="_blank";
    mine_content.appendChild(mine_btn) 
  }
  mine_container.appendChild(mine) //把mine放进container中
  mine_container.appendChild(mine_content) //把content放进container中
  document.body.appendChild(mine_container)
  
})();