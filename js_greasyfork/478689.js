// ==UserScript==
// @name         sendRequest at Specific Time
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  sendRequest at a specific time from a server's time
// @match        https://cafe.playbattlegrounds.com/act/a20231012pubg/index*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478689/sendRequest%20at%20Specific%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/478689/sendRequest%20at%20Specific%20Time.meta.js
// ==/UserScript==

(function() {
  'use strict';
  let count = 0; // 初始化计数器变量
  async function sendRequest() {
    if (count == 0) {console.log('时间到开始执行');};
    if (count < 4) {
      console.log('当前计数器值：', count); // 显示当前计数器值
      try {
        // 白银
        const response1 = await fetch("https://cafe.playbattlegrounds.com/act/a20231012pubg/get_gift", {
          "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "pragma": "no-cache",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"102\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
          },
          "referrer": "https://cafe.playbattlegrounds.com/act/a20231012pubg/index",
          "referrerPolicy": "strict-origin-when-cross-origin",
          "body": "gift_id=300005",
          "method": "POST",
          "mode": "cors",
          "credentials": "include"
        });

        const data1 = await response1.json();
        const msg1 = data1.msg;
        console.log('白银日志：', msg1);
        const time1 = new Date(response1.headers.get('Date'));
        const milliseconds = time1.getMilliseconds();
        console.log('白银日志：', `${time1} + ${milliseconds}`);
      
        // 青铜
        const response2 = await fetch("https://cafe.playbattlegrounds.com/act/a20231012pubg/get_gift", {
          "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "pragma": "no-cache",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"102\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
          },
          "referrer": "https://cafe.playbattlegrounds.com/act/a20231012pubg/index",
          "referrerPolicy": "strict-origin-when-cross-origin",
          "body": "gift_id=300006",
          "method": "POST",
          "mode": "cors",
          "credentials": "include"
        });
        const data2 = await response2.json();
        const msg2 = data2.msg;
        console.log('青铜日志：', msg2);
        const time2 = new Date(response2.headers.get('Date'));
        const milliseconds2 = time2.getMilliseconds();
        console.log('青铜日志：', `${time2} + ${milliseconds2}`);
        count++; // 增加计数器
        sendRequest();
      } catch (error) {
        console.error('Error:', error);
        count++; // 增加计数器
        sendRequest();
      }
    } else {
      console.log('已执行请求4次');
    }
  }


  const startTime = performance.now(); // 记录开始时间
  const randomValue = Math.random(); // 生成随机数
  const url = `https://worldtimeapi.org/api/ip`
  fetch(url)
      .then(response => response.json())
      .then(data => {
          const endTime = performance.now(); // 记录结束时间
          const duration = endTime - startTime; // 计算时间差
          const fixTime = duration/2;
          console.log('请求花费的时间（毫秒）:', duration);
          console.log('data.datetime', data.datetime);
          var currentTime = new Date();
          const milliseconds1 = currentTime.getMilliseconds();
          console.log('当前时间:',`${currentTime}---${milliseconds1}`);
          var serverTime = new Date(data.datetime);
          const milliseconds2 = serverTime.getMilliseconds();
          console.log('服务器时间:',`${serverTime}---${milliseconds2}`);
          var targetTime = new Date(serverTime);
          targetTime.setHours(10, 0, 0, 0);
          //模式1 服务器时间做差
          //模式2 服务器时间做差计算补偿
          //模式3 本地时间做差
          let model=2;
          switch (model) {
            case 1:
              //服务器时间做差
              var timeDiff = targetTime.getTime() - serverTime.getTime();console.log('使用服务器时间到10点计算时间差模式');
              break;
            case 2:
              //服务器时间做差计算补偿
              var timeDiff = targetTime.getTime() - serverTime.getTime() + 50;console.log('使用服务器时间到10点计算时间差再多等50ms模式');
                break;
            case 3:
              //本地时间做差
              var timeDiff = targetTime.getTime() - currentTime.getTime();console.log('使用本地时间到10点计算时间加差模式');
                break;
  
            default:
              //本地时间做差
              var timeDiff = targetTime.getTime() - currentTime.getTime();console.log('使用本地时间到10点计算时间差模式');
          }
  
  
  
          //本地时间和服务器时间差多少
          let diffInMilliseconds = currentTime - serverTime;
          console.log('本地时间比服务器快（毫秒）:', diffInMilliseconds);
          // Convert timeDiff to hours, minutes, seconds
          var seconds = Math.floor(timeDiff / 1000);
          var hours = Math.floor(seconds / 3600);
          seconds %= 3600;
          var minutes = Math.floor(seconds / 60);
          seconds %= 60;
  
          console.log('与10点的时间差为: ' + hours + ' hours, ' + minutes + ' minutes, ' + seconds + ' seconds');
  
          if (timeDiff > 0) {
              setTimeout(sendRequest, timeDiff);
              console.log('已配置定时执行脚本');
          } else {
              console.log('目标时间已经过去了');
          }
      })
      .catch(error => console.error('Error fetching server time:', error));
})();
