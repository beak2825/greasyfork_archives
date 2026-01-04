// ==UserScript==
// @name        nodeseek.com 页面关键字检查
// @namespace   https://nodeseek.com/
// @match       *://*nodeseek.com/*
// @grant       none
// @version     1.1
// @author      Damon
// @description 2023/12/17 05:09:58
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482467/nodeseekcom%20%E9%A1%B5%E9%9D%A2%E5%85%B3%E9%94%AE%E5%AD%97%E6%A3%80%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/482467/nodeseekcom%20%E9%A1%B5%E9%9D%A2%E5%85%B3%E9%94%AE%E5%AD%97%E6%A3%80%E6%9F%A5.meta.js
// ==/UserScript==



(function() {
    'use strict';

    const word = "替换为你要检查的关键字";
    var flag = false;
    var max = 2;

    // 替换为你的飞书群机器人的 Webhook URL
    const webhookURL = "";

    // 检测到关键词后发送消息给飞书群机器人
    function sendToFeishuRobot(message) {
      fetch(webhookURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          msg_type: "text",
          content: {
            text: message,
          },
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Message sent to Feishu Robot:", data);
        })
        .catch((error) => {
          console.error("Error sending message to Feishu robot:", error);
        });
    }


    // 发起请求获取页面数据
    function getPageData(pageNumber) {
        var url = "page-" + pageNumber;
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                // 请求成功，分析页面数据
                if (data.includes(word)) {
                    console.log("第 "+ pageNumber +" 页" + " 中包含【"+word+"】关键字！");
                    flag = true;
                    print(pageNumber,word);
                }else{
                    console.log("第 "+ pageNumber +" 页" + " 中不包含关键信息，防止太快，睡眠20秒检索下一页数据");
                }

                if (pageNumber < max && !flag){
                    setTimeout(function() {
                        var nextPageNumber = pageNumber + 1;
                        getPageData(nextPageNumber);
                    }, 20000);
                }else{
                  console.log("已检索至" + pageNumber + "页，自动停止，80秒后自动重新开始");
                  flag = false;
                  setTimeout(function() {
                        getPageData(1);
                  }, 80000);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function print(pageNumber,word){
       console.log("第 "+ pageNumber +" 页" + " 中包含【"+word+"】关键字！速速!");
        if (webhookURL != ""){
           sendToFeishuRobot("nodeseek 第 "+ pageNumber +" 页" + " 中包含【"+word+"】关键字！速速!");
        }

    }


    getPageData(1);

    //     // 获取页面所有文本内容
    //     var pageText = document.body.innerText;

})();


