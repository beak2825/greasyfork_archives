// ==UserScript==
// @name         2CLASS抢课
// @namespace    https://ehall.cqut.edu.cn/
// @version      1.5
// @description  CQUT2课抢课脚本。需进行端口监听使用!
// @author       KerCaR QQ78053394
// @match         *://2class.cqut.edu.cn/Student/Activity/apply.html*
// @icon         https://www.cqut.edu.cn/
// @grant        none
// @require      https://cdn.bootcss.com/html2canvas/1.4.1/html2canvas.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481563/2CLASS%E6%8A%A2%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/481563/2CLASS%E6%8A%A2%E8%AF%BE.meta.js
// ==/UserScript==
(function() {
    var Period = 300;//抢课的时间间隔 300ms,不建议低于200ms
    var AutoExit = true;//完成后是否自动退出
    var refreshTimer = setInterval(function()
    {
         window.scrollTo(0, document.body.scrollHeight);//滚到底部
         var flag1=document.getElementsByClassName("baom disabled")[0];
         if(flag1!=null&&flag1.innerText=="已报名"&&AutoExit==true) {window.close();}
         if(flag1!=null&&flag1.innerText=="未开始")
         {
             document.cookie = "activityApplyTimes=1";
             location.reload();
         }
        else
        {
          var width = 90;
          var height = 35;
          html2canvas(document.getElementById("vcode"), {
              width: width,
              height: height,
              scale: 1,
              useCORS: true,
              logging: true
            }).then(function(canvas) {
                  var result = recognizeCaptcha(canvas.toDataURL('image/png'), function(result) {
                  console.log(result.data);
                  var input = document.querySelector('input');
                  input.value=result.data;
                  document.getElementById("ok").click();
                  var btn=document.querySelector('span.mui-popup-button');
                  mui.trigger(btn,'tap');
                  document.cookie = "activityApplyTimes=1";
              });
              location.reload()
           });
       }
    },Period);
    var recognizeCaptcha = function(src, callback)//与本地监听端口通信，发送图片，获得验证码
    {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://127.0.0.1:19199/runtime/text/invoke", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onload = function() {
            if (xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            } else {
                console.error("请求发生错误:", xhr.status);
            }
        };
        xhr.onerror = function() {
            console.error("请求发生错误:", xhr.status);
        };
        var data = JSON.stringify({"project_name": "ddddocr","image": src,"extra": {"label_map":["0","1","2","3","4","5","6","7","8","9"]}});
        xhr.send(data);
    }
})();