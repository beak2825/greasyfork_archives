// ==UserScript==
// @name        Play stripchat by potplayer,vlc,nplayer,etc
// @name:zh-CN  Play stripchat by potplayer,vlc,nplayer,etc
// @name:en     Play stripchat by potplayer,vlc,nplayer,etc
// @description Play stripchat by potplayer,vlc,nplayer,etc.
// @description:zh-cn Play stripchat by potplayer,vlc,nplayer,etc.
// @namespace   https://greasyfork.org/zh-CN/scripts/473187
// @match       *://*.stripchat.com/*
// @grant       GM_setClipboard
// @version     1.0.5
// @author      zqq
// @license     MIT
// @description 调用本地播放器播放直播视频
// @downloadURL https://update.greasyfork.org/scripts/473187/Play%20stripchat%20by%20potplayer%2Cvlc%2Cnplayer%2Cetc.user.js
// @updateURL https://update.greasyfork.org/scripts/473187/Play%20stripchat%20by%20potplayer%2Cvlc%2Cnplayer%2Cetc.meta.js
// ==/UserScript==


(function(){
    'use strict';
    function btn_com(btn_name,player_name,player_url,copy_url=false) {
      let live_url_num=['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '16', '17', '18', '19', '20', '21', '23', '24'];
      let url_num=live_url_num[Math.floor(Math.random()*live_url_num.length)];
      btn_name = document.createElement("button");
      btn_name.innerHTML=player_name;
      btn_name.style.width = "90px"; //按钮宽度
      btn_name.style.height = "32px"; //按钮高度
      btn_name.style.align = "center"; //文本居中
      btn_name.style.color = "white"; //按钮文字颜色
      btn_name.style.background = "#e33e33"; //按钮底色
      btn_name.style.border = "1px solid #e33e33"; //边框属性
      btn_name.style.borderRadius = "8px"; //按钮四个角弧度
      btn_name.style.fontSize="16px";
      btn_name.onclick=function(){
          let p = document.querySelectorAll('meta');
          for (i in p) {
              let content = p[i]["content"];
              if (content) {
                  if (content.includes("thumbs")) {
                      var img = content;
                                  }
              }
          }
          //let img = p[24]["content"];
          //console.log(img)
          let live_id = img.match(/\d+/g)[1];
          //let live_url=player_url+"https://b-hls-"+url_num+".doppiocdn.com/hls/"+live_id+"/"+live_id+".m3u8";
          let live_url=player_url+"https://media-hls.doppiocdn.net/b-hls-"+url_num+"/"+live_id+"/"+live_id+".m3u8";
          if (copy_url==true)
            {
              GM_setClipboard(live_url);
              alert(live_url);
            }
          else
            {
              window.open(live_url);
            }

      }
      //document.body.prepend(btn_name);
      document.querySelector("#portal-root").prepend(btn_name);


    }

    // 按照以下格式自行添加其它外部播放器
    // Add other external players by yourself according to the following format
    btn_com("btn0","copy link","",true);
    btn_com("btn1","potplayer","potplayer://");
    btn_com("btn2","vlc","vlc://");
    btn_com("btn3","nplayer","nplayer-");

}
)();