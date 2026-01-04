// ==UserScript==
// @name         🌱通威学习中心自动学习脚本
// @description  Learning Center Automation Tools
// @version      2.0
// @description  个人脚本
// @author       leibing
// @match        *://*21tb.com/*
// @match        *://*yxxy.yongx.net:*/*
// @icon         https://21tb-file5.21tb.com/sf-server/file/getFile/faea6060ff41010e29235a87b176ff3e-N_1523333333333/60af80f6a3102fedcd26bc80_0100
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1417023
// @downloadURL https://update.greasyfork.org/scripts/523097/%F0%9F%8C%B1%E9%80%9A%E5%A8%81%E5%AD%A6%E4%B9%A0%E4%B8%AD%E5%BF%83%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/523097/%F0%9F%8C%B1%E9%80%9A%E5%A8%81%E5%AD%A6%E4%B9%A0%E4%B8%AD%E5%BF%83%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 全局消息队列
    var messageQueue = [];
    var minimizeButton =null;
    var messageContainer = null;
  var maxStudyRetry = 2;
  var studyRetry = 0;
    // 获取当前时间的函数
    function getCurrentTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = ('0' + (now.getMonth() + 1)).slice(-2);
        const day = ('0' + now.getDate()).slice(-2);
        const hours = ('0' + now.getHours()).slice(-2);
        const minutes = ('0' + now.getMinutes()).slice(-2);
        const seconds = ('0' + now.getSeconds()).slice(-2);
        return `${hours}:${minutes}:${seconds}`;
    }
    // 打印信息的函数
    function msg(msgInfo) {
      console.log(`自动学习： ${document.title}-${getCurrentTime()}: ${msgInfo} ${location.href}`);

      if(msgInfo =="close"){
        document.body.removeChild(messageContainer)
      }
        // 获取或创建消息容器元素
        //messageContainer = document.getElementById('message-container');
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.id = 'message-container';
            messageContainer.style.position = 'fixed';
            messageContainer.style.bottom = '0';
            messageContainer.style.right = '0';
            messageContainer.style.width = '350px';
            messageContainer.style.height = '80px';
            messageContainer.style.backgroundColor = '#333';
            messageContainer.style.color = 'white';
            messageContainer.style.padding = '10px';
            messageContainer.style.display = 'block';

            messageContainer.style.fontSize = '12px';
            messageContainer.style.borderRadius = '5px 0 0 0';
            messageContainer.style.zIndex = '9999'; // 设置 z-index 为较高的值
            document.body.appendChild(messageContainer);
                // 圆形图标点击事件
        messageContainer.onclick = function() {
            console.log('圆形图标被点击'); // 添加调试信息
            messageContainer.style.width = '350px';
            messageContainer.style.height = '80px';
            messageContainer.style.borderRadius = '5px 0 0 0';
            messageContainer.style.padding = '10px';
            minimizeButton.style.display = 'block';
            messageElement.style.display = 'block';
            messageContainer.innerHTML = '';
            messageQueue.forEach(function(message) {
                messageContainer.appendChild(message);
            });
            messageContainer.appendChild(minimizeButton);
        };
        }

        // 隐藏上层页面的 onlineDiv 元素
        var onlineDiv = window.parent.document.getElementById('onlineDiv');
        if (onlineDiv) {
            onlineDiv.style.display = 'none';
        }

        // 创建一个新的消息元素
        var messageElement = document.createElement('div');
        messageElement.textContent = `${getCurrentTime()}: ${msgInfo}`;

        // 将消息元素添加到消息队列中
        messageQueue.push(messageElement);

        // 如果消息队列超过5条，移除最早的消息
        if (messageQueue.length > 3) {
            messageQueue.shift();
        }
      //如果最小化了，就不显示
      if(messageContainer.innerHTML.indexOf("显示")>0){
        return;
      }else{
              messageContainer.innerHTML = '';
        // 将消息队列中的消息添加到消息容器中
        messageQueue.forEach(function(message) {
            messageContainer.appendChild(message);
        });
        if (!minimizeButton) {
          // 创建最小化按钮
          var minimizeButton = document.createElement('button');
          minimizeButton.textContent = '最小化';
          minimizeButton.style.position = 'absolute';
          minimizeButton.style.top = '0';
          minimizeButton.style.right = '0';
          minimizeButton.style.backgroundColor = '#333';
          minimizeButton.style.color = 'white';
          minimizeButton.style.border = 'none';
          minimizeButton.style.padding = '5px';
          minimizeButton.style.cursor = 'pointer';
          // 将最小化按钮添加到消息容器中
          messageContainer.appendChild(minimizeButton);
          // 最小化按钮点击事件
        minimizeButton.onclick = function(event) {
            event.stopPropagation(); // 阻止事件冒泡
            console.log('最小化按钮被点击'); // 添加调试信息
            console.log(messageContainer);
            messageContainer.style.width = '60px';
            messageContainer.style.height = '60px';
            messageContainer.style.borderRadius = '50%';
            messageContainer.style.overflow = 'hidden';
            messageContainer.style.padding = '0';
            minimizeButton.style.display = 'none';
            messageElement.style.display = 'none';
            messageContainer.innerHTML = '<span style="color: white; font-size: 20px; line-height: 60px; display: flex; justify-content: center; align-items: center;">显示</span>';
        };
        }

      }










    }
    // 刷新页面的函数
    function reload() {
        document.location.reload();
    }
    // 学习函数
    function study() {
        // 检测并发异常
        var error_tips = document.querySelector(".error_tips");
        if (error_tips != null) {
            // 刷新页面
            msg("刷新");
            reload();
            return;
        }


        // 课程类型一：单一课程类型
        var cl_head_tip = document.querySelector(".cl-head-tip");
        if (cl_head_tip != null) {
            if (cl_head_tip.innerText.indexOf("已学习") > 0) {
              var cltime =cl_head_tip.querySelectorAll(".cl-time");
              var caltime = parseInt(cltime[0].innerText, 10);
              var studiedTime = parseInt(cltime[1].innerText, 10);
              if ((caltime-studiedTime) ==0 ){
                msg("学习完成");
                clearInterval(intervalId);
                return;
              }
              //cl-time
              msg("学习中：剩余"+(caltime-studiedTime)+"分钟");
              return;
            } else {
              msg("未知状态");
            }
        }

        // 课程类型二：课程列表类型
        var section_item = document.querySelectorAll(".section-item");
        if (section_item != null && section_item.length > 0) {
            var foundItem = null;
            for (var i = 0; i < section_item.length; i++) {
                foundItem = section_item[i].querySelector(".finish-tig-item");
                if (foundItem==null) {
                    continue;
                }
                if (foundItem && foundItem.innerText == "学习中") {
                    msg("学习中");
                    return;
                }
            }
            for (var i = 0; i < section_item.length; i++) {
                foundItem = section_item[i].querySelector(".finish-tig-item");
                if (foundItem==null) {
                      msg("学习下一项");
                      section_item[i].click();
                      return;
                  }
            }
            msg("学习完成！");
            //clearInterval(intervalId);
            return;
        }
        //msg("");
      studyRetry++;
      if(studyRetry >= maxStudyRetry){
        msg("close");
        console.log("未知");
        clearInterval(intervalId);
        return;
      }

    }

    // 设置定时器
    if(location.href.indexOf("courseInfo") > 0){
        $("#goStudyBtn")[0].click();
        msg("进入学习");
    }
    else if (location.href.indexOf("courseSetting/coursePlay/") > 0){
        msg("脚本启动");
        study();
        var intervalId = setInterval(study, 10000);

    }
    else if (location.href.indexOf("courseStudyItem/courseStudyItem.learn.do111") > 0){
        msg("脚本启动");
        study();
        var intervalId = setInterval(study, 10000);
    }
  else{
    console.log("URL识别失败："+location.href);
  }
  //https://yxgf.21tb.com/courseSetting/coursePlay/c795aa486d09448b92a1e260ad3e5b6b%26yxgf%26c795aa486d09448b92a1e260ad3e5b6b%26fc15b20cdaa4441f8c26c91f07aa9791
    //if (location.href.indexOf("courseSetting") > 0)  courseStudyItem
})();