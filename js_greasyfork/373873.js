// ==UserScript==
// @name         斗鱼界面清理
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  清除斗鱼直播界面多余节点，给你一个清爽的阅读环境
// @author       Potoo
// @match        https://www.douyu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373873/%E6%96%97%E9%B1%BC%E7%95%8C%E9%9D%A2%E6%B8%85%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/373873/%E6%96%97%E9%B1%BC%E7%95%8C%E9%9D%A2%E6%B8%85%E7%90%86.meta.js
// ==/UserScript==


(function() {
  'use strict';

  var para = document.createElement("div");
  para.innerHTML = '<div style="position:fixed;left:50px;top:50px;border:solid 2px red;padding:10px;background-color:rgba(204,255,102,0.5);color:#F57F17;z-index:999;" id="mmPrint">清理界面</div>';
  document.body.appendChild(para);
  document.getElementById("mmPrint").onclick = function() {

    //alert('开始清除！');

    // 去掉斗鱼顶部
    document.getElementById('js-header').remove();
    // 去掉视频窗口顶部的标题、热度等直播房间信息
    document.getElementById('js-player-title').remove();

    // 去掉左侧边栏
    document.getElementsByClassName('layout-Aside')[0].remove();
    
    // 去掉右边活动
    try{
      document.getElementById('js-room-activity').remove();
    }
    catch(err){
      console.log(err)
    }
    
    // 去掉侧边广告
    document.getElementsByClassName('SignBarrage')[0].remove();

    // 去掉视频窗口底部的竞猜和鱼吧等js-player-guessgame
    document.getElementById('js-player-guessgame').remove();
    // 去掉视频窗口底部的任务、礼物等js-player-toolbar
    document.getElementById('js-player-toolbar').remove();
    //去掉底部广告、鱼吧js-bottom
    try{
      document.getElementById('js-bottom').remove();
    }
    catch(err){
      console.log(err)
    }

    //移除按钮
    document.getElementById("mmPrint").remove();

    // 改变窗口位置
    var player_pos = document.getElementsByClassName('layout-Player')[0];
    player_pos.style.left="-25%";
    player_pos.style.top="-15%";
    //alert('清除成功！');
  }

})();
