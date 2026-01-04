// ==UserScript==
// @name        Flash 小游戏下载
// @namespace   https://jueding.top
// @match       http://www.4399.com/flash/*_*.htm
// @match       http://www.7k7k.com/swf/*.htm
// @match       http://www.17yy.com/f/play/*.html
// @grant       none
// @version     1.0
// @author      Felix
// @description 支持 4399、7K7K、17yy 等平台 Flash 小游戏下载，注：该脚本不支持 H5 小游戏下载，有好的建议，或者遇到问题，欢迎留言反馈。
// @downloadURL https://update.greasyfork.org/scripts/424084/Flash%20%E5%B0%8F%E6%B8%B8%E6%88%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/424084/Flash%20%E5%B0%8F%E6%B8%B8%E6%88%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    var down = document.createElement('a');
    down.id = "down";
    down.style = "font-size: 14px; font-weight: 400; text-decoration: underline; padding-left: 20px;";
    down.text = "文件下载（右键另存为）";
    
    if (location.host == "www.4399.com") {
        down.href = window.webServer + window._strGamePath;
        if (down.href.endsWith(".swf")) {
            document.querySelector(".p-nav h1").append(down);
        }
    }
  
    if (location.host == "www.7k7k.com") {
        down.href = document.querySelector("#gameobj").src;
        down.style.float = "right";
        if (down.href.endsWith(".swf")) {
            document.querySelector(".play_header").append(down);
        }
        
    }
  
    if (location.host == "www.17yy.com") {
        down.href = document.querySelector("#flashgame").src;
        down.style.color = "#e8e8e8";
        if (down.href.endsWith(".swf")) {
            document.querySelector(".gm_name").append(down);
        }
    }
  
})();