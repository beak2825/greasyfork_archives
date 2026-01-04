// ==UserScript==
// @name         BiliBili——Gift Thanks--self
// @namespace    mscststs
// @version      0.2
// @description  礼物自动感谢
// @author       mscststs
// @include        /https?:\/\/live\.bilibili\.com\/\d/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36144/BiliBili%E2%80%94%E2%80%94Gift%20Thanks--self.user.js
// @updateURL https://update.greasyfork.org/scripts/36144/BiliBili%E2%80%94%E2%80%94Gift%20Thanks--self.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function notify(msg) {
      showMsgNotification('You have new information',msg);

  }
  function showMsgNotification(title, msg, icon) {
          var options = {
              body: msg,
              icon: icon||"//www.bilibili.com/favicon.ico"
          };
          var Notification = window.Notification || window.mozNotification || window.webkitNotification;
          if (Notification && Notification.permission === "granted") {
              var instance = new Notification(title, options);
              instance.onclick = function() {
                  // Something to do
              };
              instance.onerror = function() {
                  // Something to do
              };
              instance.onshow = function() {
                  // Something to do
//                          setTimeout(instance.close, 3000);
                  setTimeout(function () {
                      instance.close();
                  },3000);
                  console.log(instance.body);
              };
              instance.onclose = function() {
                  // Something to do
              };
              console.log(instance);
          } else if (Notification && Notification.permission !== "denied") {
              Notification.requestPermission(function(status) {
                  if (Notification.permission !== status) {
                      Notification.permission = status;
                  }
                  // If the user said okay
                  if (status === "granted") {
                      var instance = new Notification(title, options);
                      instance.onclick = function() {
                          // Something to do
                      };
                      instance.onerror = function() {
                          // Something to do
                      };
                      instance.onshow = function() {
                          // Something to do
                          setTimeout(instance.close, 3000);
                      };
                      instance.onclose = function() {
                          // Something to do
                      };
                  } else {
                      return false;
                  }
              });
          } else {
              return false;
          }
      }


    function getSeconds(){//取得秒数时间戳
        return Date.parse(new Date())/1000;
    }

    function getMiliSeconds(){//取得毫秒数时间戳
        return (new Date()).valueOf();
    }
    function Send_Danmaku(data,roomid){
        console.log(data);
        if(data.count){
        }else{
        return;}
        var text = "感谢 "+data.username+" 赠送的 "+data.count+" 个 "+data.gift;
        showMsgNotification("礼物信息",data.username+" 赠送了"+data.count+"个"+data.gift);
         console.log(text);
         $.ajax({
                    type: "POST",
                    url: "//api.live.bilibili.com/msg/send",
                    data: {
                        color:16777215,
                        fontsize:25,
                        mode:1,
                        msg:text,
                        rnd:getSeconds(),
                        roomid:roomid
                    },
                    datatype: "jsonp",
                    crossDomain:true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (data) {
                        if(data.code!==0){
                            msg("出错了！" +data.code+" " +data.msg);
                        }
                    },
                    complete: function () {

                    },
                    error: function () {
                    }
                });
    }
	 function get_roomid(){
            var url_text = window.location.href+"";
            var  m=url_text.slice(url_text.indexOf(".com/")+5,100);
            return m;//获取当前房间号
     }
    function msg(text,level,time){
            text=text||"这是一个提示";
            level=level||"success";
            time=time||2000;
            if(level!="success"){
                console.log(text);
            }
            var id = (new Date()).valueOf();
            if(window.localStorage["helper_msg_left"]){
            }else{
                window.localStorage["helper_msg_left"] = "400px";
            }
            if(window.localStorage["helper_msg_top"]){
            }else{
                window.localStorage["helper_msg_top"] = "500px";
            }

            var left = window.localStorage["helper_msg_left"];
            var top = window.localStorage["helper_msg_top"];

            $("body").append('<div class="link-toast '+level+'"data-id="'+id+'" style="left: '+left+'; top: '+top+';"><span class="toast-text">'+text+'</span></div>');
            $("div.link-toast[data-id='"+id+"']").slideDown("normal",function(){setTimeout(function(){$("div.link-toast[data-id='"+id+"']").fadeOut("normal",function(){$("div.link-toast[data-id='"+id+"']").remove();});},time);});

        }


    function danmaku_listen(){
           msg("自动感谢已开启");
            $(document).on("DOMNodeInserted",".gift-item",function(){
                var data = {
                    username:$(this).find("span.username").text(),
                    gift:$(this).find("span.action").text().slice(2,100),
                    count:$(this).find("span.gift-count").text().slice(2,100),
                };
                Send_Danmaku(data,get_roomid());

            });
        }

    function init(){
	if(confirm("是否在这个直播间打开自动感谢助手？？？本房间的房间号是："+get_roomid()+"，确认无误再点确定。"))
        danmaku_listen();
    }
    init();

})();