// ==UserScript==
// @name                      BiliBili换一换,换回来
// @namespace                 https://greasyfork.org/scripts/478516-bilibili%E6%8D%A2%E4%B8%80%E6%8D%A2-%E6%8D%A2%E5%9B%9E%E6%9D%A5/code/BiliBili%E6%8D%A2%E4%B8%80%E6%8D%A2,%E6%8D%A2%E5%9B%9E%E6%9D%A5.user.js
// @version                   2026.01.0301
// @description               点击换一换后推荐的内容就再也找不到了? 没关系既然能换走，现在也能换回来
// @author                    CNGEGE
// @match                     https://www.bilibili.com/
// @match                     https://www.bilibili.com/index.html
// @match                     https://www.bilibili.com/?*
// @grant                     none
// @license                   Apache 2
// @require                   https://code.jquery.com/jquery-3.7.1.min.js
// @run-at                    document-end
// @website                   https://soujiaoben.org/#/pages/list/detail?id=478516&host=greasyfork
// @downloadURL https://update.greasyfork.org/scripts/478516/BiliBili%E6%8D%A2%E4%B8%80%E6%8D%A2%2C%E6%8D%A2%E5%9B%9E%E6%9D%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/478516/BiliBili%E6%8D%A2%E4%B8%80%E6%8D%A2%2C%E6%8D%A2%E5%9B%9E%E6%9D%A5.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // 全局变量
    /* 换一换 按钮 */
    let roll_btn = $("button.primary-btn.roll-btn"); // 自然 一开始是没有的
    let back_btn = {};   // 脚本创建的按钮
    let historyItem = [];// 用于记录的历史视频
    let currentBatch = 0;
    let rotete = 0;      // 用于旋转动画的 记录的旋转角度

    main();

    /* 主方法 */
    function main(){
        // 首先我要延迟循环去查找 换一换按钮, 因为这个按钮是JS动态载入的
      let loopid = setInterval(()=>{
        // 获取
        roll_btn = $("button.primary-btn.roll-btn svg path");
        if(roll_btn.length > 0){
          roll_btn = $("button.primary-btn.roll-btn");
          roll_btn_load();
          clearInterval(loopid);
        }
      },500);

    }

    /* 原始的换一换按钮载入了 */
    function roll_btn_load(){
      // 两件事
      /* 1. 复制按钮*/
      back_btn = roll_btn.clone();
      back_btn.addClass("back-btn");
      back_btn.css("margin-top","10px");
      back_btn.find("span").text("换回来");
      roll_btn.after(back_btn);
      /* 2. 监听原始按钮点击*/
      roll_btn.click(roll_btn_click);
      /* 3. 监听复制后按钮的点击 */
      back_btn.mousedown(back_btn_click);
      /* 4. 屏蔽复制后按钮的默认右键事件 */
      //back_btn.
      back_btn.bind("contextmenu",function(e){
        return false;
      });
    }

    /* 原始的换一换按钮点击事件 */
    function roll_btn_click(event){
      //在切换前将项目记录下来
      let olditem = $("div.container").find(".feed-card");
      if(olditem.length > 0){
          for(let i=0;i<olditem.length;i++){
            historyItem[currentBatch * olditem.length + i] = $(olditem[i]).find(".bili-feed-card").clone();
          }
          currentBatch++;
          // 修改换回来按钮的悬浮提示文字
          updateTitle();
      }
      else{
          console.error("准备记录时，没有找到视频节点");
      }
    }

    /* 复制后的换回来按钮的点击事件 */
    function back_btn_click(event){
      if(event.which == 1){ //左键
        // 反向旋转图标
        rotete-=720;
        back_btn.find("svg").css("transform","rotate("+rotete+"deg)");

        //复原项目
        if(historyItem.length > 0 && currentBatch > 0){
          currentBatch--;
          let olditem = $("div.container").find(".feed-card");
          for(let i=0;i<olditem.length;i++){
            // 先把原来的remove掉
            $(olditem[i]).find(".bili-feed-card").remove();
            $(olditem[i]).append(historyItem[currentBatch * olditem.length + i]);
          }
          updateTitle();
        }
      }else if(event.which == 3){ // 右键
        currentBatch = 0;
        for(let i=0;i<historyItem.length;i++){
          delete history[i];
          historyItem[i] = null;
        }
        historyItem = [];
        back_btn.removeAttr("title");
      }
    }

    /* 修改换回来按钮的悬浮提示文字 */
    function updateTitle(){
      back_btn.attr("title",`当前队列:${currentBatch} 缓存项目大小:${historyItem.length} "右键清除缓存 释放内存"`);
    }
    // Your code here...
})();