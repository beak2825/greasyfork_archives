// ==UserScript==
// @name        用本地播放器播放无名小站
// @description 用本地播放器播放无名小站.
// @namespace   none
// @match       *://*.btnull.org/py/*
// @match       *://*.btnull.net/py/*
// @match       *://*.btnull.si/py/*
// @match       *://*.btnull.nu/py/*
// @match       *://*.btnull.fun/py/*
// @grant       GM_setClipboard
// @version     1.1
// @author      zqq
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/496727/%E7%94%A8%E6%9C%AC%E5%9C%B0%E6%92%AD%E6%94%BE%E5%99%A8%E6%92%AD%E6%94%BE%E6%97%A0%E5%90%8D%E5%B0%8F%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/496727/%E7%94%A8%E6%9C%AC%E5%9C%B0%E6%92%AD%E6%94%BE%E5%99%A8%E6%92%AD%E6%94%BE%E6%97%A0%E5%90%8D%E5%B0%8F%E7%AB%99.meta.js
// ==/UserScript==


(function(){
    'use strict';
    function btn_com(btn_name,player_name,player_url,copy_url=0) {
      btn_name = document.createElement("button");
      btn_name.innerHTML=player_name;
      btn_name.style.width = "90px"; //按钮宽度
      btn_name.style.height = "32px"; //按钮高度
      btn_name.style.align = "center"; //文本居中
      btn_name.style.color = "white"; //按钮文字颜色
      btn_name.style.background = "#17202A "; //按钮底色
      btn_name.style.border = "1px solid #e33e33"; //边框属性
      btn_name.style.borderRadius = "8px"; //按钮四个角弧度
      btn_name.style.fontSize="16px";
      btn_name.onclick=function(){

          let video_url=player_url+_obj.player.url;
          console.log(video_url)
          if (copy_url==1)
            {
              GM_setClipboard(video_url);
              alert(video_url);
              window.close();
            }
          else if (copy_url==2) {
            location.reload();
          }
          else if (copy_url==3) {
            let paras=_obj.player.url.split('://');
            video_url=player_url+paras[1]+"#Intent;type=video/any;package=is.xyz.mpv;scheme="+paras[0]+";end;";
            window.open(video_url);
            window.close();
          }
          else
            {
              window.open(video_url);
              window.close();
            }

      }
      //document.body.prepend(btn_name);
      document.querySelector(".play_rghit.right").prepend(btn_name);


    }

    // 按照以下格式自行添加其它外部播放器
    // Add other external players by yourself according to the following format
    btn_com("btn0","copy link","",1);
    btn_com("btn1","potplayer","potplayer://");
    btn_com("btn2","vlc","vlc://");
    btn_com("btn3","nplayer","nplayer-");
    btn_com("btn4","安卓MPV","intent://",3);

    btn_com("btn99","手动刷新","",2);

}
)();