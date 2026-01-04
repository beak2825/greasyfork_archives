// ==UserScript==
// @name        用本地播放器播放欧乐
// @description 用本地播放器播放欧乐视频
// @namespace   https://greasyfork.org/zh-CN/scripts/473431
// @match       *://*.olehdtv.com/*
// @grant       GM_setClipboard
// @version     1.0.9
// @author      zqq
// @license     MIT
// @description 调用本地播放器播放欧乐视频
// @downloadURL https://update.greasyfork.org/scripts/473431/%E7%94%A8%E6%9C%AC%E5%9C%B0%E6%92%AD%E6%94%BE%E5%99%A8%E6%92%AD%E6%94%BE%E6%AC%A7%E4%B9%90.user.js
// @updateURL https://update.greasyfork.org/scripts/473431/%E7%94%A8%E6%9C%AC%E5%9C%B0%E6%92%AD%E6%94%BE%E5%99%A8%E6%92%AD%E6%94%BE%E6%AC%A7%E4%B9%90.meta.js
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
          let p = document.querySelector('.player_video.embed-responsive.embed-responsive-16by9.author-qq362695000.clearfix').getElementsByTagName("script")[0].innerHTML;
          // let img = p["backgroundImage"];
          let video_id = p.match(/"https:(.*?)"/)[0].replace(/"/g, '').replace(/\\/g, '');
          let video_url=player_url+video_id;
          if (copy_url==1)
            {
              GM_setClipboard(video_url);
              alert(video_url);
              window.close();
            }
          else if (copy_url==3) {
            let paras=video_id.split('://');
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
      document.querySelector(".tabs.playlist").prepend(btn_name);


    }

    // 按照以下格式自行添加其它外部播放器
    // Add other external players by yourself according to the following format
    btn_com("btn0","copy link","",true);
    btn_com("btn1","potplayer","potplayer://");
    btn_com("btn2","vlc","vlc://");
    btn_com("btn3","nplayer","nplayer-");
    btn_com("btn4","安卓MPV","intent://",3);

}
)();