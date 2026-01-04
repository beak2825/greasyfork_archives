// ==UserScript==
// @name         用本地播放器播放iyf
// @description  用本地播放器播放iyf视频
// @namespace    http://tampermonkey.net/
// @match        *://www.iyf.tv/play/*
// @version      0.1.2
// @author       zqq&gpt
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496811/%E7%94%A8%E6%9C%AC%E5%9C%B0%E6%92%AD%E6%94%BE%E5%99%A8%E6%92%AD%E6%94%BEiyf.user.js
// @updateURL https://update.greasyfork.org/scripts/496811/%E7%94%A8%E6%9C%AC%E5%9C%B0%E6%92%AD%E6%94%BE%E5%99%A8%E6%92%AD%E6%94%BEiyf.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var play_list=[]
    // 保存原始的 XMLHttpRequest 对象
    const originalXHR = window.XMLHttpRequest;

    // 创建一个新的 XMLHttpRequest 对象构造函数
    function newXHR() {
        const realXHR = new originalXHR();

        // 劫持 open 方法
        realXHR.open = (function(open) {
            return function(method, url, async, user, password) {
                this._url = url; // 保存请求的 URL
                return open.apply(this, arguments);
            };
        })(realXHR.open);

        // 劫持 send 方法
        realXHR.send = (function(send) {
            return function(body) {
                this.addEventListener('load', function() {
                    // 只处理包含特定URL的请求
                    if (this._url.includes('https://m10.iyf.tv/v3/video/play')) {
                        //console.log('Request URL:', this._url);
                        const jsonResponse = JSON.parse(this.responseText);
                        //console.log('Response JSON:', jsonResponse);

                        var clarity=jsonResponse.data.info[0].clarity

                        play_list=[]
                        for (let i = 0; i < clarity.length; i++) {
                          var path=clarity[i].path;
                          if (path != null) {
                                // var bitrate=clarity[i].title;
                                var rtmp=path.rtmp;
                                play_list.push(rtmp)

                          }
                        }
                    //console.log(play_list)
                    }
                });
                return send.apply(this, arguments);
            };
        })(realXHR.send);

        return realXHR;
    }

    // 将新的 XMLHttpRequest 对象赋值给 window.XMLHttpRequest
    window.XMLHttpRequest = newXHR;

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

          let video_url=player_url+play_list[0];
          console.log(video_url)
          if (copy_url==1)
            {
              GM_setClipboard(video_url);
              alert(video_url);
              history.back();
            }
          else if (copy_url==2) {
            location.reload();
          }
          else if (copy_url==3) {
            let paras=play_list[0].split('://');
            video_url=player_url+paras[1]+"#Intent;type=video/any;package=is.xyz.mpv;scheme="+paras[0]+";end;";
            window.open(video_url);
            history.back();
          }
          else
            {
              window.open(video_url);
              history.back();
            }

      }
      //document.body.prepend(btn_name);
      document.querySelector(".box.moveable").prepend(btn_name);


    }

    // 按照以下格式自行添加其它外部播放器
    // Add other external players by yourself according to the following format
    //btn_com("btn0","copy link","",1);
    btn_com("btn1","potplayer","potplayer://");
    btn_com("btn2","vlc","vlc://");
    btn_com("btn3","nplayer","nplayer-");
    btn_com("btn4","安卓MPV","intent://",3);

})();
