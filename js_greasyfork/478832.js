// ==UserScript==
// @name         aggrx 测试测试
// @namespace    https://greasyfork.org/zh-CN/scripts/478832-aggrx-%E6%B5%8B%E8%AF%95%E6%B5%8B%E8%AF%95
// @version      1.3.2
// @description  aggrx用来测试
// @author       You
// @match        https://claude.ai/*
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @match        https://www.baidu.com/*
// @match        https://gemini.google.com/*
// @match        https://gemini.google.com/app/*
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/478832/aggrx%20%E6%B5%8B%E8%AF%95%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/478832/aggrx%20%E6%B5%8B%E8%AF%95%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // 添加样式
  const toastCSS = `
#tmToast {
    visibility: hidden;
    min-width: 250px;
    margin-left: -125px;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 2px;
    padding: 16px;
    position: fixed;
    z-index: 1;
    left: 50%;
    bottom: 30px;
    font-size: 17px;
}
#tmToast.show {
    visibility: visible;
    -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
    animation: fadein 0.5s, fadeout 0.5s 2.5s;
}
@-webkit-keyframes fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 30px; opacity: 1;}
}
@keyframes fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 30px; opacity: 1;}
}
@-webkit-keyframes fadeout {
    from {bottom: 30px; opacity: 1;}
    to {bottom: 0; opacity: 0;}
}
@keyframes fadeout {
    from {bottom: 30px; opacity: 1;}
    to {bottom: 0; opacity: 0;}
}
`;

  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = toastCSS;
  document.head.appendChild(styleSheet);

  // 添加 Toast 容器
  const toastContainer = document.createElement('div');
  toastContainer.id = 'tmToast';
  document.body.appendChild(toastContainer);

  // Toast 函数
  function showToast(message, duration = 3000) {
    const toast = document.getElementById("tmToast");
    toast.textContent = message;
    toast.className = "show";
    setTimeout(function () {
      toast.className = toast.className.replace("show", "");
    }, duration);
  }


  const savedUsername = localStorage.getItem('tmUsername') || '';
  const savedStartTime = localStorage.getItem('tmStartTime');
  const savedEndTime = localStorage.getItem('tmEndTime');
  const savedHost = localStorage.getItem('tmHost') || '';

  const settingTips = savedUsername || '设置>>';

  let startTime = savedStartTime !== null ? parseInt(savedStartTime, 10) : 0;
  let endTime = savedEndTime !== null ? parseInt(savedEndTime, 10) : 24;

  const panel = document.createElement('div');
  panel.innerHTML = `
    <style>
        #tmConfigPanel {
            position: fixed;
            top: 100px;
            right: 1px;
            padding: 2px;
            background: white;
            border: 1px solid #ccc;
            z-index: 9999;
            display: none;
            font-size: 12px;
            width:120px;
        }
        #tmToggleButton {
            position: fixed;
            top: 100px;
            right: 10px;
            padding: 2px;
            background: #4CAF50;
            color: black;
            cursor: pointer;
            z-index: 10000; /* 确保按钮在面板之上 */
            font-size: 12px;
        }
        #tmConfigPanel label, #tmConfigPanel button {
            display: block;
            margin: 3px 0;
        }
        #tmConfigPanel button {
            width:95%;
            padding: 2px;
            box-sizing: border-box;
        }
        #tmConfigPanel button {
            background-color: #4CAF50; /* Green */
            border: none;
            color: white;
            text-align: center;
            text-decoration: none;
            font-size: 12px;
            transition-duration: 0.4s;
            cursor: pointer;
            border-radius: 4px;
            margin:3px 0;
        }
        #tmConfigPanel button:hover {
            background-color: white;
            color: black;
            border: 1px solid #4CAF50;
        }
        #tmConfigPanel input {
            padding: 2px 4px;
            font-size: 12px;
            height: 20px;
            border: 1px solid #ccc;
        }
    </style>
    <div id="tmToggleButton" >${settingTips}</div>
    <div id="tmConfigPanel">
        <label>唯一标识：</label>
        <input type="text" style="width:95%" id="tmUsername" placeholder="唯一标识" value="${savedUsername}">
        <label>请求地址：</label>
        <input type="text" style="width:95%" id="tmHost" placeholder="gpt.aggrx.com:7002" value="${savedHost}">
        <div style="margin-top: 10px; display: flex; align-items: center;">
            <label for="tmIsGpt4" style="margin-right: 10px;">GPT4账号?</label>
            <input type="checkbox" id="tmIsGpt4" style="width: 15px; height: 15px; margin-top: -4px; vertical-align: middle;" ${localStorage.getItem('tmIsGpt4') === 'true' ? 'checked' : ''}>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <label>开始(0-24)：</label>
            <input type="number" id="tmStartTime" placeholder="0" value="${startTime}" min="0" max="24">
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <label>结束(0-24)：</label>
            <input type="number" id="tmEndTime" placeholder="24" value="${endTime}" min="0" max="24">
        </div>
            <button id="tmSave">保存/开始</button>
            <button id="tmStop">停止任务</button>

    </div>
    `;
  document.body.appendChild(panel);

  // 切换按钮和面板的显示函数
  function togglePanel() {
    const configPanel = document.getElementById('tmConfigPanel');
    if (configPanel.style.display === 'none' || configPanel.style.display === '') {
      configPanel.style.display = 'block';
    } else {
      configPanel.style.display = 'none';
    }
  }

  // 绑定切换函数到按钮
  document.getElementById('tmToggleButton').addEventListener('click', togglePanel);


  function isWithinScheduledTime() {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    console.log("开始时间：", startTime, "结束时间：", endTime, "当前时间：", currentHour)
    if (startTime < endTime) {
      // 同一天内的时间段
      return currentHour >= startTime && currentHour < endTime;
    } else {
      // 跨夜执行，分为两段时间：startTime 到午夜（24点），和午夜（0点）到 endTime
      return currentHour >= startTime || currentHour < endTime;
    }
  }

  function getProvider() {
    const currentUrl = window.location.href;

    let provider = '';
    if (currentUrl.includes("https://claude.ai/")) {
      provider = 'claude';
    } else if (currentUrl.includes("https://www.baidu.com/")) {
      provider = 'gemini';
    } else if (currentUrl.includes("https://gemini.google.com/app")) {
      provider = 'gemini_advanced';
    } else if (currentUrl.includes("https://chat.openai.com/")||currentUrl.includes("https://chatgpt.com/")) {
      provider = 'gpt';
      const isGpt4 = localStorage.getItem('tmIsGpt4') === 'true';
      if (isGpt4) {
        provider = 'gpt4'
      }
    }
    console.log("当前url：", currentUrl, "当前的provider：", provider)
    return provider
  }

  window.isTaskRunning = false;//任务是否在运行中

  function executeTask() {
    console.log('executeTask');

    const username = localStorage.getItem('tmUsername') || '';
    if (!username) {
      // 使用示例
      showToast('请在执行任务前输入并保存您的用户名。');
      return;
    }

    startTime = parseInt(localStorage.getItem('tmStartTime'), 10) || 0;
    endTime = parseInt(localStorage.getItem('tmEndTime'), 10) || 24;

    if (!isWithinScheduledTime()) {
      console.log('当前时间不在设定的执行时间范围内');
      cancelTask()
      return;
    }

    if (window.isTaskRunning) {
      console.log('任务已经在运行了！！');
      return;
    }

    const provider = getProvider();
    if (provider === 'gpt' || provider === 'claude' || provider === 'gpt4' || provider === 'gemini' || provider === 'gemini_advanced') {
      window.isTaskRunning = true;
      (window.task_manager || {
        task_cancel: function () {
        }
      }).task_cancel();
      const savedHost = localStorage.getItem('tmHost') || 'gpt.aggrx.com:7002';
      window.task_manager = {};
      window.module_url = `https://${savedHost}/task_manager/static/main.js?${Date.now()}`;
      fetch(`${window.module_url}`)
        .then((r) => r.text())
        .then((code) => {
          console.log(`已获取 ${window.module_url}   provider ${provider}`);
          window.module_target = window.task_manager;
          window.module_dep = {};
          const windowX = window.screenX || window.screenLeft || window.screenLeft;
          const windowY = window.screenY || window.screenTop || window.screenTop;

          console.log("浏览器窗口的X坐标：" + windowX);
          console.log("浏览器窗口的Y坐标：" + windowY);

          window.module_data = {client: `${username}_${provider}_${window.location.hostname}`, app_index: 0, provider: provider};
          new Function(code)();
        });
    } else {
      console.log('不支持provider', provider);
    }
  }

  document.getElementById('tmSave').addEventListener('click', function () {
    const username = document.getElementById('tmUsername').value;
    const startTimeInput = document.getElementById('tmStartTime').value;
    const endTimeInput = document.getElementById('tmEndTime').value;
    const host = document.getElementById('tmHost').value || 'gpt.aggrx.com:7002';

    if (host && username && startTimeInput && endTimeInput) {
      localStorage.setItem('tmUsername', username);
      localStorage.setItem('tmHost', host);
      localStorage.setItem('tmStartTime', '' + parseInt(startTimeInput, 10));
      localStorage.setItem('tmEndTime', '' + parseInt(endTimeInput, 10));
      const isGpt4 = document.getElementById('tmIsGpt4').checked;
      localStorage.setItem('tmIsGpt4', isGpt4);
      console.log('配置已保存:', host, username, startTimeInput, endTimeInput, "isGpt4", isGpt4);
      showToast('配置已保存！');
      checkGpt4AndExecuteTask()
    } else {
      showToast('请输入有效的配置信息。');
    }
  });

  console.log('读取配置:', localStorage.getItem('tmHost') || '', localStorage.getItem('tmUsername') || '', localStorage.getItem('tmStartTime'), localStorage.getItem('tmEndTime'), "isGpt4：", localStorage.getItem('tmIsGpt4'));

  function cancelTask() {
    (window.task_manager || {
      task_cancel: function () {
      }
    }).task_cancel();
    window.isTaskRunning = false;
  }

  window.cancel_by_user = false;
  document.getElementById('tmStop').addEventListener('click', function () {
    cancelTask()
    window.cancel_by_user = true;
    showToast('任务已停止。');
  });

  function onLoad() {
    checkGpt4AndExecuteTask()
  }

  function checkGpt4AndExecuteTask() {
    const currentUrl = window.location.href;

    if (currentUrl.includes("https://chat.openai.com/?model=")
      || currentUrl.includes("https://chat.openai.com/g/")
      || currentUrl === "https://chat.openai.com/"
      || currentUrl.includes("https://chatgpt.com/")
      || currentUrl.includes("https://claude.ai/chats")
      || currentUrl.includes("https://www.baidu.com/")
      || currentUrl.includes("https://gemini.google.com/app") // gemini advanced
    ) {
      executeTask();
    } else {
      console.log('不在可执行回答问题的页面');
    }
  }

  if (document.readyState === 'complete') {
    onLoad();
  } else {
    window.addEventListener('load', onLoad);
  }

  // 添加定时器，每小时检查一次
  setInterval(function () {
    const isTaskRunning = window.isTaskRunning;
    const isTimeInRange = isWithinScheduledTime();
    console.log("isTaskRunning", isTaskRunning, "isTimeInRange", isTimeInRange);

    if (isTimeInRange && !isTaskRunning) {
      // 如果在时间范围内并且任务没有启动，则启动任务
      if (!window.cancel_by_user) {//用户手动停止，则不需要重启
        executeTask();
        console.log('任务启动');
      }
    } else if (!isTimeInRange && isTaskRunning) {
      // 如果不在时间范围内，任务已经启动，则停止任务
      cancelTask();
      console.log('任务停止');
    }
  }, 3600000); // 每小时执行一次，3600000 毫秒等于 1 小时

  // 添加定时器，10分钟检查一次
  setInterval(function () {
    console.log('检查 aggrxNeedReload 字段', window.aggrxNeedReload);
    if (window.aggrxNeedReload) {
      window.location.reload()
    }
  }, 600000); // 每小时执行一次，600000 毫秒等于 10分钟
})();


