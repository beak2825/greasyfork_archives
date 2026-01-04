// ==UserScript==
// @name        xxl0518 - 10086.cn
// @namespace   Violentmonkey Scripts
// @match       https://wap.sc.10086.cn/scmccMiniWap/pandagame/xxl0518/index.html
// @grant       GM_getValue
// @version     1.0.3
// @author      lg8294
// @description 2023/10/25 14:38:15
// @license      GPL-3.0 License
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/478222/xxl0518%20-%2010086cn.user.js
// @updateURL https://update.greasyfork.org/scripts/478222/xxl0518%20-%2010086cn.meta.js
// ==/UserScript==
console.log("UserScript Start");

(function () {
  let context = {
    score: GM_getValue("score", 250), // 分数
    count: 0, // 已执行次数
    maxCount: GM_getValue("maxCount", 10), // 最大执行次数
    interval: GM_getValue("interval", 50000), // 50s 执行一次
    currentInterval: null,
    timeout: GM_getValue("timeout", 900000), // 15 minute 超时
    currentTimer: null,
    button: null,
    running: false,
  };

  /**
   * 保存游戏记录
   * @param {*} ss
   * @param {Function} callback 成功回调
   */
  function saveGameLog(ss, callback) {
    // callback('test');
    // return;

    getSaveNumber(gameCode, saveImpl, showError);

    /**
     * 保存实现
     * @param randomNum
     */
    function saveImpl(randomNum) {
      extAjax({
        url: "/scmccMiniWap/padgame/saveGameLog/" + getAddUrl(ss, randomNum),
        data: {
          gameCode: gameCode,
          ecrs: request.ecrs || "",
        },
        success: function (data) {
          if (data.code == 0) {
            gameLogs.push(data.obj);
            if (typeof callback == "function") {
              callback(data.obj);
            }
          } else if (data.code == 504) {
            showMsg("页面已更新，即将重新进入页面");
            setTimeout(function () {
              cleanCacheReplace();
            }, 2000);
          } else {
            showError(data);
          }
        },
        error: showError,
      });
    }

    function showError(obj) {
      var msg = "游戏记录保存异常，即将回到首页";
      if (obj) {
        msg = obj.info || msg;
      }
      showMsg(msg, 2500);
    }
  }

  /**
   * 开始运行
   */
  function start() {
    if (context.running) return;
    context.running = true;
    context.button.innerText = "Stop";
    // 先保存一次
    saveGameLog(context.score, function (log) {
      context.count++;
      console.log("完成", context.count, "次");
      console.log(log);
      checkFinish();
    });
    context.currentInterval = setInterval(function () {
      saveGameLog(context.score, function (log) {
        context.count++;
        console.log("完成", context.count, "次");
        console.log(log);
        checkFinish();
      });
    }, context.interval);

    // 超时后，停止
    context.currentTimer = setTimeout(stop, context.timeout);
  }

  function checkFinish() {
    if (context.count >= context.maxCount) {
      stop();
    }
  }

  /**
   * 停止运行
   */
  function stop() {
    if (!context.running) return;
    if (context.currentInterval != null) {
      clearInterval(context.currentInterval);
      context.currentInterval = null;
    }
    if (context.currentTimer != null) {
      clearTimeout(context.currentTimer);
      context.currentTimer = null;
    }
    context.running = false;
    context.button.innerText = "Restart";
    console.log("执行结束了,总共执行", context.count, "次");
  }

  /**
   * 创建UI
   */
  function createElement() {
    // 添加执行按键
    var button = document.createElement("div");
    button.id = "lg_start";
    button.innerText = "Start";
    button.style = `
      font-size: 44px;
      position: fixed;
      top: 50vh;
      color: #fff;
      background: #0007;
      margin: 8px;
      padding: 8px;
      border-radius: 8px;
      z-index: 1000;
      font-family: ui-monospace;
    `;
    button.addEventListener("click", function () {
      if (context.running) {
        stop();
      } else {
        start();
      }
    });
    document.lastChild.appendChild(button);
    context.button = button;
  }

  createElement();
})();

console.log("UserScript End");
