// ==UserScript==
// @name         报警监控插件
// @namespace    http://tampermonkey.net/
// @version      2024-12-23
// @description  监听报警
// @author       Hashan
// @match        https://192.168.211.3/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=211.3
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require https://scriptcat.org/lib/637/1.4.3/ajaxHooker.js#sha256=y1sWy1M/U5JP1tlAY5e80monDp27fF+GMRLsOiIrSUY=
// @require https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.1/howler.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521826/%E6%8A%A5%E8%AD%A6%E7%9B%91%E6%8E%A7%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/521826/%E6%8A%A5%E8%AD%A6%E7%9B%91%E6%8E%A7%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

let timer;
let oldNum = 0;
let newNum = 0;
let records;
//let scode = 600000;
let scode = 1000;
(async function () {
  "use strict";

  window.onload = () => {
    try {
      const windowDom = document.querySelector("body");
      createdCard(windowDom);
      const card = document.querySelector("#card");
      card.addEventListener("click", cardClick);
    } catch (error) {
      alert("出现错误，请联系管理员");
      console.log("联网联控监控系统错误信息", error);
      stopMonitorAlarm();
    }
  };


  // 创建监控系统可视化卡片
function createdCard(windowDom) {
    const card = document.createElement("div");
    card.setAttribute("id", "card");
    GM_addStyle(`
      #card{
          position: fixed;
          top: 80px;
          right: 30px;
          width: 120px;
          height: 35px;
          border-radius: 10px;
          background-color: green;
          z-index: 9999;
          text-align: center;
          line-height: 35px;
          color: white;
      }
      `);
    card.innerText = "开始报警监控";
    windowDom.appendChild(card);
  }
  //卡片的点击事件
  function cardClick() {
    const cardDom = document.querySelector("#card");
    if (cardDom.innerText === "开始报警监控") {
      console.log("插件开始监控报警");
      monitorAlarm(cardDom);
    } else {
      stopMonitorAlarm();
    }
  }

  // 开始监控报警
  async function monitorAlarm(cardDom) {
    cardDom.innerText = "停止报警监控";
    cardDom.style.backgroundColor = "red";
    refreshPage();
    oldNum = await requestDataMonitor();
    console.log("插件-》旧数据", oldNum);
    timerFn();
  }

  // 停止监控报警
  function stopMonitorAlarm() {
    const cardDom = document.querySelector("#card");
    cardDom.innerText = "开始报警监控";
    cardDom.style.backgroundColor = "green";
    clearInterval(timer);
    console.log("插件停止监控报警");
  }

  // 请求数据监听
  function requestDataMonitor() {
    return new Promise((resolve, reject) => {
      ajaxHooker.hook((request) => {
        if (request.url === "/api/lwlk-xj-web/alarmOwnerDeal/page") {
          request.response = (res) => {
            const data = JSON.parse(res.responseText);
            console.log("插件-》请求数据", data.data.total);
            if (data.code !== 200) {
              stopMonitorAlarm();
              reject();
            } else {
              records = data.data.records;
              resolve(data.data.total || 0);
            }
          };
        }
      });
    });
  }

  // 定时器
  function timerFn() {
    timer = setInterval(async () => {
      console.log("插件-》旧数据", oldNum);
      console.log("联网联控监控系统，定时运行");
      refreshPage();
      newNum = await requestDataMonitor();
      if (newNum !== oldNum) {
        oldNum = newNum;
        const end = newNum-oldNum
        playMusic();
        pushWechat(records.slice(0, end) || []);

      }
    }, scode);
  }

  // 页面刷新
  function refreshPage() {
    const queryBtn = document.querySelectorAll(
      ".el-button.el-button--primary.el-button--small"
    )[0];
    queryBtn.click();
  }

  // 播放音乐
  function playMusic() {
    var sound = new Howl({
      src: [
        "https://m10.music.126.net/20241224170024/8f8157726ff4ed1930341c1bd97bf2bc/yyaac/040b/545a/0f5f/3ae96bc187c06ca510d985838c8556eb.m4a",
      ],
      volume: 1.0,
      onend: function () {},
    });
    sound.play();
  }
  //推送企业微信
  function pushWechat(text) {
    if (text.length === 0) return;
    const url =
      "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=2422ba5f-aa63-4f2c-93d4-6d0649cc6301";
    text.forEach((item) => {
      const data = {
        msgtype: "markdown",
        markdown: {
          content: `<font color=\"red\">新增</font>联网联控报警<font color=\"warning\">${item.thirdMonitorName}</font>，请相关监控员同事注意。\n
               >车牌号:<font color=\"comment\">${item.vehiclenum}</font>
               >监控大厅:<font color=\"comment\">${item.thirdMonitorName}</font>
               >报警时间:<font color=\"comment\">${item.alarmTime}</font>`,
        },
      };
      const sendData = JSON.stringify(data);
      GM_xmlhttpRequest({
        url,
        method: "POST",
        data: sendData,
        headers: {
          "Content-type": "application/json",
        },
        onload: function (xhr) {
          console.log("凯里请求成功", xhr.responseText);
        },
      });
    });
  }


})();

