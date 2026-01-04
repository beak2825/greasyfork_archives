// ==UserScript==
// @name         hbjs质量技术网络学习助手
// @namespace    x_jianp
// @version      2026.01
// @description  答题进度提示,答案备份和恢复
// @author       x_jianp
// @license GPL-3.0-only
// @match        *://mis.hebjs.com.cn:9011/Technic/Exam/*
// @match        *://nxb.hebjs.com.cn/paper/toExamPaperRecord/*
// @match        *://nxb.hebjs.com.cn/front/*
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @require      http://code.jquery.com/jquery-latest.js
// @copyright 2025, jpxie (https://openuserjs.org/users/jpxie)
// @downloadURL https://update.greasyfork.org/scripts/435675/hbjs%E8%B4%A8%E9%87%8F%E6%8A%80%E6%9C%AF%E7%BD%91%E7%BB%9C%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/435675/hbjs%E8%B4%A8%E9%87%8F%E6%8A%80%E6%9C%AF%E7%BD%91%E7%BB%9C%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
// 本脚本发布地址在 https://greasyfork.org/zh-CN/scripts/435675

//2024 需更改edge或chrome的插件管理器，打开开发者模式。
//更正match网络，让插件使用更精准。
//增加智学苑答题提示系统。不增加加速

(function () {
  'use strict';

  // 获取当前页面的URL
  const url = window.location.href;

  // 根据不同的网址执行不同的逻辑
  if (url.includes('mis.hebjs.com.cn:9011/Technic/Exam/')) {
    // 对 mis.hebjs.com.cn:9011/Technic/Exam/  的处理
    // 答题辅助
    getrecord();
    setanswer();
  }
  else if (url.includes('nxb.hebjs.com.cn/paper/toExamPaperRecord')) {
    // 对 内训宝答案凝练 的处理
    nxbshowanswer();
    //    } else if (url.includes('example3.com')) {
    // 对 example3.com 的处理
    //handleExample3();
  }
  else if (url.includes('nxb.hebjs.com.cn/front/')) {
    // 默认加速倍数
    let currentSpeedMultiplier = 1;
    let isAccelerated = false;
    let originalCountDown = null;
    let originalOneMinuteAjax = null;
    let isMinimized = false; // 控制面板最小化状态

    // 加速版的 countDown 函数
    function acceleratedCountDown() {
      //unsafeWindow
      if (unsafeWindow.timer != null) {
        return;
      }
      console.log('加速版 countDown 启动，加速倍数:', currentSpeedMultiplier);
      unsafeWindow.timer = setInterval(function () {
        unsafeWindow.index++;
        unsafeWindow.studyTime++;

        if (unsafeWindow.index !== 0 && unsafeWindow.index % 10 == 0) {
          unsafeWindow.oneMinuteAjax();
        }
      }, 1000);
    }

    // 加速版的 oneMinuteAjax 函数
    function acceleratedOneMinuteAjax(callback) {
      console.log('加速版 oneMinuteAjax 被调用，studyTime:', unsafeWindow.studyTime);

      $.ajax({
        url: unsafeWindow.baselocation + "/ajax/course/progress/update",
        type: "post",
        data: {
          "kpointId": unsafeWindow.kpointId,
          "courseId": unsafeWindow.courseId,
          "breakpoint": unsafeWindow.nowPlayTime * 60,
          "sign": $("#course_sign").val(),
          "studyTime": unsafeWindow.studyTime * 60
        },
        dataType: "json",
        success: function (result) {
          if (result.success) {
            if (result.entity.courseFace >= 1) {
              console.log("大于等于一次不再弹人脸----次数----" + result.entity.courseFace);
              clearInterval(unsafeWindow.timerFace);
              unsafeWindow.timerFace = null;
            }
            $("#course_sign").val(result.entity.sign);
            $(".kpoint_progress_" + unsafeWindow.kpointId).html(result.entity.progress);
          }
          else if (result.message == 'not_sign') {
            var h5Video = document.getElementsByTagName('video')[0];
            unsafeWindow._player = h5Video;
            h5Video.pause();
            clearInterval(unsafeWindow.timer);
            unsafeWindow.timer = null;
            if (unsafeWindow.dialogFun) {
              unsafeWindow.dialogFun('提示', '您已在其他地方开始学习，继续学习将不再记录观看时间。', 0);
            }
            return;
          }
          else if (result.message == 'noLogin') {
            var h5Video = document.getElementsByTagName('video')[0];
            unsafeWindow._player = h5Video;
            h5Video.pause();
            clearInterval(unsafeWindow.timer);
            unsafeWindow.timer = null;
            if (unsafeWindow.dialogFun) {
              unsafeWindow.dialogFun('提示', '您的登录状态已过期，请重新登录后继续学习', 11, 'https://nxb.hebjs.com.cn/login');
            }
            return;
          }
          if (typeof (callback) === 'function') {
            callback();
          }
        }
      });
      unsafeWindow.studyTime = 0;
    }

    // 启用加速
    function enableAcceleration(speedMultiplier) {
      currentSpeedMultiplier = speedMultiplier;

      // 保存原始函数（如果还没有保存）
      if (!originalCountDown && unsafeWindow.countDown) {
        originalCountDown = unsafeWindow.countDown;
        console.log('已保存原始 countDown 函数');
      }
      if (!originalOneMinuteAjax && unsafeWindow.oneMinuteAjax) {
        originalOneMinuteAjax = unsafeWindow.oneMinuteAjax;
        console.log('已保存原始 oneMinuteAjax 函数');
      }

      // 替换函数
      unsafeWindow.countDown = acceleratedCountDown;
      unsafeWindow.oneMinuteAjax = acceleratedOneMinuteAjax;

      isAccelerated = true;
      console.log('加速已启用，倍数:', currentSpeedMultiplier + 'x');
    }
    // 更新加速倍数
    function updateSpeed(multiplier) {
      if (multiplier === 1) {
        disableAcceleration();
      }
      else {
        enableAcceleration(multiplier);
      }
      updateControlPanel();
    }

    // 禁用加速
    function disableAcceleration() {
      if (isAccelerated && originalCountDown && originalOneMinuteAjax) {
        // 恢复原始函数
        unsafeWindow.countDown = originalCountDown;
        unsafeWindow.oneMinuteAjax = originalOneMinuteAjax;
      }

      currentSpeedMultiplier = 1;
      isAccelerated = false;
      console.log('加速已禁用，恢复原始速度');
    }

    // 强制重新替换函数（用于处理函数被重新定义的情况）
    function forceReplaceFunctions() {
      if (isAccelerated) {
        console.log('强制重新替换函数...');
        unsafeWindow.countDown = acceleratedCountDown;
        unsafeWindow.oneMinuteAjax = acceleratedOneMinuteAjax;
      }
    }
    // 切换最小化状态
    function toggleMinimize() {
      isMinimized = !isMinimized;
      const panel = document.getElementById('acceleratorPanel');
      const content = document.getElementById('panelContent');
      const minimizeBtn = document.getElementById('minimizeBtn');

      if (panel && content && minimizeBtn) {
        if (isMinimized) {
          content.style.display = 'none';
          panel.style.minWidth = 'auto';
          panel.style.width = 'auto';
          minimizeBtn.innerHTML = '□'; // 最大化图标
          minimizeBtn.title = '展开面板';
        }
        else {
          content.style.display = 'block';
          panel.style.minWidth = '180px';
          minimizeBtn.innerHTML = '_'; // 最小化图标
          minimizeBtn.title = '最小化面板';
        }
      }
    }

    // 添加控制面板到页面
    function addControlPanel() {
      const panel = document.createElement('div');
      panel.id = 'acceleratorPanel';
      panel.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                z-index: 10000;
                font-family: Arial, sans-serif;
                font-size: 12px;
                min-width: 180px;
                border: 1px solid #666;
                box-shadow: 0 2px 10px rgba(0,0,0,0.5);
            `;

      panel.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div style="font-weight: bold; cursor: move;" id="panelHeader">学习加速</div>
                    <button id="minimizeBtn" style="background: none; border: none; color: white; font-size: 16px; cursor: pointer; padding: 0 5px; line-height: 1;" title="最小化面板">_</button>
                </div>
                <div id="panelContent">
                    <div style="margin-bottom: 5px;">状态: <span id="accStatus">未加速</span></div>
                    <div style="margin-bottom: 5px;">倍数: <span id="currentSpeed">1</span>x</div>
                    <div style="margin-bottom: 8px;">累计: <span id="totalTime">0</span>秒</div>
                    <div style="margin-bottom: 5px; font-size: 10px; color: #ccc;">函数状态: <span id="funcStatus">等待检测</span></div>
                    <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 8px;">
                        <button style="padding: 2px 6px; font-size: 11px;" onclick="updateSpeed(1)">1x</button>
                        <button style="padding: 2px 6px; font-size: 11px;" onclick="updateSpeed(60)">60x</button>
                    </div>
                    <div style="display: flex; gap: 5px;">
                    <button style="padding: 2px 6px; font-size: 11px; flex: 1;" onclick="forceReplace()">强制替换</button>
                </div>
                <div id="minimizedView" style="display: none; text-align: center; font-size: 10px;">
                    <div>加速面板</div>
                    <div style="font-size: 9px; color: #ccc;">点击展开</div>
                </div>
            `;

      document.body.appendChild(panel);

      // 添加全局函数供按钮使用
      unsafeWindow.updateSpeed = updateSpeed;
      unsafeWindow.forceReplace = forceReplaceFunctions;
      // 添加最小化按钮事件
      const minimizeBtn = document.getElementById('minimizeBtn');
      if (minimizeBtn) {
        minimizeBtn.addEventListener('click', toggleMinimize);
      }

      // 添加拖拽功能
      makePanelDraggable(panel);

      // 更新显示的时间
      setInterval(() => {
        updateControlPanel();
      }, 1000);
    }

    // 使面板可拖拽
    function makePanelDraggable(panel) {
      const header = document.getElementById('panelHeader');
      let isDragging = false;
      let dragOffset = {
        x: 0,
        y: 0
      };

      header.style.cursor = 'move';

      header.addEventListener('mousedown', startDrag);
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', stopDrag);

      function startDrag(e) {
        isDragging = true;
        const rect = panel.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        panel.style.opacity = '0.8';
      }

      function onDrag(e) {
        if (!isDragging) return;

        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;

        // 限制在窗口范围内
        const maxX = unsafeWindow.innerWidth - panel.offsetWidth;
        const maxY = unsafeWindow.innerHeight - panel.offsetHeight;

        panel.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
        panel.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
        panel.style.right = 'auto'; // 取消right定位
      }

      function stopDrag() {
        isDragging = false;
        panel.style.opacity = '1';
      }
    }

    // 更新控制面板显示
    function updateControlPanel() {
      const statusElement = document.getElementById('accStatus');
      const speedElement = document.getElementById('currentSpeed');
      const timeElement = document.getElementById('totalTime');
      const funcStatusElement = document.getElementById('funcStatus');
      if (statusElement && speedElement && timeElement && funcStatusElement) {
        statusElement.textContent = isAccelerated ? '已加速' : '未加速';
        statusElement.style.color = isAccelerated ? '#4CAF50' : '#ff9800';
        speedElement.textContent = currentSpeedMultiplier;
        timeElement.textContent = unsafeWindow.index || 0;

        // 显示函数状态
        const countDownType = typeof unsafeWindow.countDown;
        const oneMinuteType = typeof unsafeWindow.oneMinuteAjax;
        let funcStatus = '';

        if (isAccelerated) {
          if (unsafeWindow.countDown === acceleratedCountDown && unsafeWindow.oneMinuteAjax === acceleratedOneMinuteAjax) {
            funcStatus = '✓ 两个函数都已替换';
          }
          else if (unsafeWindow.oneMinuteAjax === acceleratedOneMinuteAjax) {
            funcStatus = '⚠ 仅oneMinuteAjax替换成功';
          }
          else if (unsafeWindow.countDown === acceleratedCountDown) {
            funcStatus = '⚠ 仅countDown替换成功';
          }
          else {
            funcStatus = '✗ 两个函数都未替换';
          }
        }
        else {
          funcStatus = '使用原始函数';
        }

        funcStatusElement.textContent = funcStatus;
      }
    }

    // 创建样式
    function addStyles() {
      const style = document.createElement('style');
      style.textContent = `
                button {
                    background: #555;
                    color: white;
                    border: none;
                    border-radius: 3px;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                button:hover {
                    background: #777;
                }
                button:active {
                    background: #999;
                }
                #acceleratorPanel {
                    user-select: none;
                }
                #panelHeader:hover {
                    color: #4CAF50;
                }
                #minimizeBtn:hover {
                    background: #666 !important;
                    border-radius: 2px;
                }
            `;
      document.head.appendChild(style);
    }
    // 监控函数变化
    function monitorFunctions() {
      let lastCountDown = unsafeWindow.countDown;
      let lastOneMinuteAjax = unsafeWindow.oneMinuteAjax;

      setInterval(() => {
        if (unsafeWindow.countDown !== lastCountDown || unsafeWindow.oneMinuteAjax !== lastOneMinuteAjax) {
          console.log('检测到函数变化，重新应用加速...');
          lastCountDown = unsafeWindow.countDown;
          lastOneMinuteAjax = unsafeWindow.oneMinuteAjax;

          if (isAccelerated) {
            // 如果处于加速状态但函数被覆盖了，重新替换
            setTimeout(() => {
              enableAcceleration(currentSpeedMultiplier);
            }, 100);
          }
        }
      }, 500);
    }

    // 初始化
    function init() {
      addStyles();
      addControlPanel();
      monitorFunctions();
      console.log('视频学习加速器已加载，点击按钮启用加速');
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    }
    else {
      init();
    }
  }
  else {
    // 默认处理
    handleDefault();
  }

  // 定义不同的处理函数
  function getrecord() {
    console.log('答题辅助系统启动');
    // 在这里添加针对 example1.com 的具体逻辑

    //成绩进度查询
    //
    //在"/Technic/Exam/AnswerNotes/ListAsJson?UnitId=1&&rows=200"文件中有全部答题记录。
    //1.读取JSON，处理数据
    //2.便历页面中的试卷名称，添加年度标识图标，实现鼠标on事件，显示成绩。

    //在规范答题的时候刷新成绩，不再做存储。
    let myJson = new Object;
    let yanzheng = null;
    try {
      yanzheng = document.querySelector("#formMain > table > tbody > tr:nth-child(1) > td > h3");
    }
    finally {}
    if (yanzheng != null) {
      if (yanzheng.innerText = '请选择规范开始答题') {
        // alert("新成绩读入开始工作");
        console.log("成绩读取开始");
        //let keys = GM_listValues();
        //for (let key of keys){ GM_deleteValue(key);}
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            //GM_setValue('chengji',this.responseText);
            myJson = JSON.parse(this.responseText).rows;
            //chengji = myJson.rows;
            //console.log(myJson);
            for (let j = 0; j < 6; j++) {
              let tiku = document.querySelector("#formMain > table > tbody > tr:nth-child(" + String(j * 2 + 3) + ") > td");
              let tishu = tiku.children.length;
              for (let i = 0; i < tishu; i++) {
                //innerText 将取回文字中的两个空格，精简成了一个。造成部分试卷成绩查询失败。原因是innerText是基于浏览器显示的，会基于CSS，性能比不上textContent。
                //                            let tiname = tiku.children[i].querySelector("span > span.l-btn-text").innerText;
                let tiname = tiku.children[i].querySelector("span > span.l-btn-text").textContent;
                //筛选数据.
                let chengji = myJson.filter(function (e) {
                  return e.BankName.value == tiname
                });
                //console.log(chengji);
                let years = {};
                if (chengji.length != 0) {
                  for (let k = 0; k < chengji.length; k++) {
                    var year = chengji[k].CreatedDate.split("-")[0];
                    years[year] = year;
                    //console.log(years);
                  }
                  for (var key in years) {

                    var imgy = document.createElement("img");

                    switch (key) {
                      case "2020":
                        //imgy.src = "https://img1.imgtp.com/2022/08/23/lMc5hns8.svg";
                        break;
                      case '2021':
                        imgy.src = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iOSIKICAgaGVpZ2h0PSIyNCIKICAgdmlld0JveD0iMCAwIDIuMzgxMjUwMiA2LjM0OTk5OTciCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzUiCiAgIGlua3NjYXBlOnZlcnNpb249IjEuNC4yIChlYmYwZTk0LCAyMDI1LTA1LTA4KSIKICAgc29kaXBvZGk6ZG9jbmFtZT0icDIwMjEuc3ZnIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyI+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXc3IgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzExMTExMSIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIGlua3NjYXBlOnNob3dwYWdlc2hhZG93PSIwIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjEiCiAgICAgaW5rc2NhcGU6ZGVza2NvbG9yPSIjZDFkMWQxIgogICAgIGlua3NjYXBlOmRvY3VtZW50LXVuaXRzPSJweCIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iMTYiCiAgICAgaW5rc2NhcGU6Y3g9Ii05LjA5Mzc1IgogICAgIGlua3NjYXBlOmN5PSIxNC40MDYyNSIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTAxNyIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iNzYwIgogICAgIGlua3NjYXBlOndpbmRvdy15PSItOCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9ImxheWVyMSIgLz4KICA8ZGVmcwogICAgIGlkPSJkZWZzMiIgLz4KICA8ZwogICAgIGlua3NjYXBlOmxhYmVsPSLlm77lsYIgMSIKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlkPSJsYXllcjEiPgogICAgPHJlY3QKICAgICAgIHN0eWxlPSJmaWxsOiNjMGMwYzA7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlLXdpZHRoOjIuMDA1NTQ7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3BhaW50LW9yZGVyOnN0cm9rZSBmaWxsIG1hcmtlcnMiCiAgICAgICBpZD0icmVjdDE2MC05IgogICAgICAgd2lkdGg9IjEuOTM0MjQ3NSIKICAgICAgIGhlaWdodD0iNi4wNTg5MTEzIgogICAgICAgeD0iMC4yMzE1MTA0OSIKICAgICAgIHk9IjAuMTMyMjkxNjQiCiAgICAgICByeT0iMC42OTk2MDAxIgogICAgICAgcng9IjAuNjk5NjAwMSIgLz4KICAgIDxyZWN0CiAgICAgICBzdHlsZT0iZmlsbDojZDNkM2QzO2ZpbGwtcnVsZTpldmVub2RkO3N0cm9rZS13aWR0aDoyLjAwNTU0O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtwYWludC1vcmRlcjpzdHJva2UgZmlsbCBtYXJrZXJzIgogICAgICAgaWQ9InJlY3QxNjAiCiAgICAgICB3aWR0aD0iMS45MzQyNDc1IgogICAgICAgaGVpZ2h0PSI2LjA1ODkxMTMiCiAgICAgICB4PSIwIgogICAgICAgeT0iMCIKICAgICAgIHJ5PSIwLjY5OTYwMDEiCiAgICAgICByeD0iMC42OTk2MDAxIiAvPgogICAgPHRleHQKICAgICAgIHhtbDpzcGFjZT0icHJlc2VydmUiCiAgICAgICBzdHlsZT0iZm9udC1zdHlsZTpub3JtYWw7Zm9udC12YXJpYW50Om5vcm1hbDtmb250LXdlaWdodDpib2xkO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1zaXplOjEuOTI1MzdweDtsaW5lLWhlaWdodDoxLjI1O2ZvbnQtZmFtaWx5OnNhbnMtc2VyaWY7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonc2Fucy1zZXJpZiBCb2xkJztmaWxsOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuNjQzNzIiCiAgICAgICB4PSItNC42MzU0MDYiCiAgICAgICB5PSIxLjg5NzY5MzQiCiAgICAgICBpZD0idGV4dDI3MCIKICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KDAsLTEuMjcxMTI2MiwwLjc4NjcwMzk1LDAsMCwwKSI+PHRzcGFuCiAgICAgICAgIHNvZGlwb2RpOnJvbGU9ImxpbmUiCiAgICAgICAgIGlkPSJ0c3BhbjI2OCIKICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtc2l6ZToxLjkyNTM3cHg7Zm9udC1mYW1pbHk6c2Fucy1zZXJpZjstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidzYW5zLXNlcmlmIEJvbGQnO2ZpbGw6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC42NDM3MiIKICAgICAgICAgeD0iLTQuNjM1NDA2IgogICAgICAgICB5PSIxLjg5NzY5MzQiPjIwMjE8L3RzcGFuPjwvdGV4dD4KICA8L2c+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhMTU4Ij4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGNjOmxpY2Vuc2UKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LzQuMC8iIC8+CiAgICAgIDwvY2M6V29yaz4KICAgICAgPGNjOkxpY2Vuc2UKICAgICAgICAgcmRmOmFib3V0PSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS80LjAvIj4KICAgICAgICA8Y2M6cGVybWl0cwogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjUmVwcm9kdWN0aW9uIiAvPgogICAgICAgIDxjYzpwZXJtaXRzCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyNEaXN0cmlidXRpb24iIC8+CiAgICAgICAgPGNjOnJlcXVpcmVzCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyNOb3RpY2UiIC8+CiAgICAgICAgPGNjOnJlcXVpcmVzCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyNBdHRyaWJ1dGlvbiIgLz4KICAgICAgICA8Y2M6cGVybWl0cwogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjRGVyaXZhdGl2ZVdvcmtzIiAvPgogICAgICA8L2NjOkxpY2Vuc2U+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KPC9zdmc+Cg==";
                        break;
                      case '2022':
                        imgy.src = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iOSIKICAgaGVpZ2h0PSIyNCIKICAgdmlld0JveD0iMCAwIDIuMzgxMjUwMiA2LjM0OTk5OTciCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzUiCiAgIGlua3NjYXBlOnZlcnNpb249IjEuNC4yIChlYmYwZTk0LCAyMDI1LTA1LTA4KSIKICAgc29kaXBvZGk6ZG9jbmFtZT0icDIwMjIuc3ZnIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyI+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXc3IgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzExMTExMSIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIGlua3NjYXBlOnNob3dwYWdlc2hhZG93PSIwIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjEiCiAgICAgaW5rc2NhcGU6ZGVza2NvbG9yPSIjZDFkMWQxIgogICAgIGlua3NjYXBlOmRvY3VtZW50LXVuaXRzPSJweCIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iMTYiCiAgICAgaW5rc2NhcGU6Y3g9Ii05LjA5Mzc1IgogICAgIGlua3NjYXBlOmN5PSIxNC40MDYyNSIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTAxNyIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iNzYwIgogICAgIGlua3NjYXBlOndpbmRvdy15PSItOCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9ImxheWVyMSIgLz4KICA8ZGVmcwogICAgIGlkPSJkZWZzMiIgLz4KICA8ZwogICAgIGlua3NjYXBlOmxhYmVsPSLlm77lsYIgMSIKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlkPSJsYXllcjEiPgogICAgPHJlY3QKICAgICAgIHN0eWxlPSJmaWxsOiNhOWE5YTk7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlLXdpZHRoOjIuMDA1NTQ7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3BhaW50LW9yZGVyOnN0cm9rZSBmaWxsIG1hcmtlcnMiCiAgICAgICBpZD0icmVjdDE2MC05IgogICAgICAgd2lkdGg9IjEuOTM0MjQ3NSIKICAgICAgIGhlaWdodD0iNi4wNTg5MTEzIgogICAgICAgeD0iMC4yMzE1MTA0OSIKICAgICAgIHk9IjAuMTMyMjkxNjQiCiAgICAgICByeT0iMC42OTk2MDAxIgogICAgICAgcng9IjAuNjk5NjAwMSIgLz4KICAgIDxyZWN0CiAgICAgICBzdHlsZT0iZmlsbDojYzBjMGMwO2ZpbGwtcnVsZTpldmVub2RkO3N0cm9rZS13aWR0aDoyLjAwNTU0O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtwYWludC1vcmRlcjpzdHJva2UgZmlsbCBtYXJrZXJzIgogICAgICAgaWQ9InJlY3QxNjAiCiAgICAgICB3aWR0aD0iMS45MzQyNDc1IgogICAgICAgaGVpZ2h0PSI2LjA1ODkxMTMiCiAgICAgICB4PSIwIgogICAgICAgeT0iMCIKICAgICAgIHJ5PSIwLjY5OTYwMDEiCiAgICAgICByeD0iMC42OTk2MDAxIiAvPgogICAgPHRleHQKICAgICAgIHhtbDpzcGFjZT0icHJlc2VydmUiCiAgICAgICBzdHlsZT0iZm9udC1zdHlsZTpub3JtYWw7Zm9udC12YXJpYW50Om5vcm1hbDtmb250LXdlaWdodDpib2xkO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1zaXplOjEuOTI1MzdweDtsaW5lLWhlaWdodDoxLjI1O2ZvbnQtZmFtaWx5OnNhbnMtc2VyaWY7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonc2Fucy1zZXJpZiBCb2xkJztmaWxsOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuNjQzNzIiCiAgICAgICB4PSItNC42MzU0MDYiCiAgICAgICB5PSIxLjg5NzY5MzQiCiAgICAgICBpZD0idGV4dDI3MCIKICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KDAsLTEuMjcxMTI2MiwwLjc4NjcwMzk1LDAsMCwwKSI+PHRzcGFuCiAgICAgICAgIHNvZGlwb2RpOnJvbGU9ImxpbmUiCiAgICAgICAgIGlkPSJ0c3BhbjI2OCIKICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtc2l6ZToxLjkyNTM3cHg7Zm9udC1mYW1pbHk6c2Fucy1zZXJpZjstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidzYW5zLXNlcmlmIEJvbGQnO2ZpbGw6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC42NDM3MiIKICAgICAgICAgeD0iLTQuNjM1NDA2IgogICAgICAgICB5PSIxLjg5NzY5MzQiPjIwMjI8L3RzcGFuPjwvdGV4dD4KICA8L2c+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhMTU4Ij4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGNjOmxpY2Vuc2UKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LzQuMC8iIC8+CiAgICAgIDwvY2M6V29yaz4KICAgICAgPGNjOkxpY2Vuc2UKICAgICAgICAgcmRmOmFib3V0PSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS80LjAvIj4KICAgICAgICA8Y2M6cGVybWl0cwogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjUmVwcm9kdWN0aW9uIiAvPgogICAgICAgIDxjYzpwZXJtaXRzCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyNEaXN0cmlidXRpb24iIC8+CiAgICAgICAgPGNjOnJlcXVpcmVzCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyNOb3RpY2UiIC8+CiAgICAgICAgPGNjOnJlcXVpcmVzCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyNBdHRyaWJ1dGlvbiIgLz4KICAgICAgICA8Y2M6cGVybWl0cwogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjRGVyaXZhdGl2ZVdvcmtzIiAvPgogICAgICA8L2NjOkxpY2Vuc2U+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KPC9zdmc+Cg==";
                        break;
                      case '2023':
                        imgy.src = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iOSIKICAgaGVpZ2h0PSIyNCIKICAgdmlld0JveD0iMCAwIDIuMzgxMjUwMiA2LjM0OTk5OTciCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzUiCiAgIGlua3NjYXBlOnZlcnNpb249IjEuNC4yIChlYmYwZTk0LCAyMDI1LTA1LTA4KSIKICAgc29kaXBvZGk6ZG9jbmFtZT0icDIwMjMuc3ZnIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyI+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXc3IgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzExMTExMSIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIGlua3NjYXBlOnNob3dwYWdlc2hhZG93PSIwIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjEiCiAgICAgaW5rc2NhcGU6ZGVza2NvbG9yPSIjZDFkMWQxIgogICAgIGlua3NjYXBlOmRvY3VtZW50LXVuaXRzPSJweCIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iMTYiCiAgICAgaW5rc2NhcGU6Y3g9Ii05LjA5Mzc1IgogICAgIGlua3NjYXBlOmN5PSIxNC40MDYyNSIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTAxNyIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iNzYwIgogICAgIGlua3NjYXBlOndpbmRvdy15PSItOCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9ImxheWVyMSIgLz4KICA8ZGVmcwogICAgIGlkPSJkZWZzMiIgLz4KICA8ZwogICAgIGlua3NjYXBlOmxhYmVsPSLlm77lsYIgMSIKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlkPSJsYXllcjEiPgogICAgPHJlY3QKICAgICAgIHN0eWxlPSJmaWxsOiM4MDgwODA7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlLXdpZHRoOjIuMDA1NTQ7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3BhaW50LW9yZGVyOnN0cm9rZSBmaWxsIG1hcmtlcnMiCiAgICAgICBpZD0icmVjdDE2MC05IgogICAgICAgd2lkdGg9IjEuOTM0MjQ3NSIKICAgICAgIGhlaWdodD0iNi4wNTg5MTEzIgogICAgICAgeD0iMC4yMzE1MTA0OSIKICAgICAgIHk9IjAuMTMyMjkxNjQiCiAgICAgICByeT0iMC42OTk2MDAxIgogICAgICAgcng9IjAuNjk5NjAwMSIgLz4KICAgIDxyZWN0CiAgICAgICBzdHlsZT0iZmlsbDojYTlhOWE5O2ZpbGwtcnVsZTpldmVub2RkO3N0cm9rZS13aWR0aDoyLjAwNTU0O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtwYWludC1vcmRlcjpzdHJva2UgZmlsbCBtYXJrZXJzIgogICAgICAgaWQ9InJlY3QxNjAiCiAgICAgICB3aWR0aD0iMS45MzQyNDc1IgogICAgICAgaGVpZ2h0PSI2LjA1ODkxMTMiCiAgICAgICB4PSIwIgogICAgICAgeT0iMCIKICAgICAgIHJ5PSIwLjY5OTYwMDEiCiAgICAgICByeD0iMC42OTk2MDAxIiAvPgogICAgPHRleHQKICAgICAgIHhtbDpzcGFjZT0icHJlc2VydmUiCiAgICAgICBzdHlsZT0iZm9udC1zdHlsZTpub3JtYWw7Zm9udC12YXJpYW50Om5vcm1hbDtmb250LXdlaWdodDpib2xkO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1zaXplOjEuOTI1MzdweDtsaW5lLWhlaWdodDoxLjI1O2ZvbnQtZmFtaWx5OnNhbnMtc2VyaWY7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonc2Fucy1zZXJpZiBCb2xkJztmaWxsOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuNjQzNzIiCiAgICAgICB4PSItNC42MzU0MDYiCiAgICAgICB5PSIxLjg5NzY5MzQiCiAgICAgICBpZD0idGV4dDI3MCIKICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KDAsLTEuMjcxMTI2MiwwLjc4NjcwMzk1LDAsMCwwKSI+PHRzcGFuCiAgICAgICAgIHNvZGlwb2RpOnJvbGU9ImxpbmUiCiAgICAgICAgIGlkPSJ0c3BhbjI2OCIKICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtc2l6ZToxLjkyNTM3cHg7Zm9udC1mYW1pbHk6c2Fucy1zZXJpZjstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidzYW5zLXNlcmlmIEJvbGQnO2ZpbGw6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC42NDM3MiIKICAgICAgICAgeD0iLTQuNjM1NDA2IgogICAgICAgICB5PSIxLjg5NzY5MzQiPjIwMjM8L3RzcGFuPjwvdGV4dD4KICA8L2c+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhMTU4Ij4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGNjOmxpY2Vuc2UKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LzQuMC8iIC8+CiAgICAgIDwvY2M6V29yaz4KICAgICAgPGNjOkxpY2Vuc2UKICAgICAgICAgcmRmOmFib3V0PSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS80LjAvIj4KICAgICAgICA8Y2M6cGVybWl0cwogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjUmVwcm9kdWN0aW9uIiAvPgogICAgICAgIDxjYzpwZXJtaXRzCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyNEaXN0cmlidXRpb24iIC8+CiAgICAgICAgPGNjOnJlcXVpcmVzCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyNOb3RpY2UiIC8+CiAgICAgICAgPGNjOnJlcXVpcmVzCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyNBdHRyaWJ1dGlvbiIgLz4KICAgICAgICA8Y2M6cGVybWl0cwogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjRGVyaXZhdGl2ZVdvcmtzIiAvPgogICAgICA8L2NjOkxpY2Vuc2U+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KPC9zdmc+Cg==";
                        break;
                      case '2024':
                        imgy.src = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iOSIKICAgaGVpZ2h0PSIyNCIKICAgdmlld0JveD0iMCAwIDIuMzgxMjUwMiA2LjM0OTk5OTciCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzUiCiAgIGlua3NjYXBlOnZlcnNpb249IjEuNC4yIChlYmYwZTk0LCAyMDI1LTA1LTA4KSIKICAgc29kaXBvZGk6ZG9jbmFtZT0icDIwMjQuc3ZnIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyI+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXc3IgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzExMTExMSIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIGlua3NjYXBlOnNob3dwYWdlc2hhZG93PSIwIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjEiCiAgICAgaW5rc2NhcGU6ZGVza2NvbG9yPSIjZDFkMWQxIgogICAgIGlua3NjYXBlOmRvY3VtZW50LXVuaXRzPSJweCIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iMTYiCiAgICAgaW5rc2NhcGU6Y3g9Ii05LjA5Mzc1IgogICAgIGlua3NjYXBlOmN5PSIxNC40MDYyNSIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTAxNyIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iNzYwIgogICAgIGlua3NjYXBlOndpbmRvdy15PSItOCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9ImxheWVyMSIgLz4KICA8ZGVmcwogICAgIGlkPSJkZWZzMiIgLz4KICA8ZwogICAgIGlua3NjYXBlOmxhYmVsPSLlm77lsYIgMSIKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlkPSJsYXllcjEiPgogICAgPHJlY3QKICAgICAgIHN0eWxlPSJmaWxsOiM2OTY5Njk7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlLXdpZHRoOjIuMDA1NTQ7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3BhaW50LW9yZGVyOnN0cm9rZSBmaWxsIG1hcmtlcnMiCiAgICAgICBpZD0icmVjdDE2MC05IgogICAgICAgd2lkdGg9IjEuOTM0MjQ3NSIKICAgICAgIGhlaWdodD0iNi4wNTg5MTEzIgogICAgICAgeD0iMC4yMzE1MTA0OSIKICAgICAgIHk9IjAuMTMyMjkxNjQiCiAgICAgICByeT0iMC42OTk2MDAxIgogICAgICAgcng9IjAuNjk5NjAwMSIgLz4KICAgIDxyZWN0CiAgICAgICBzdHlsZT0iZmlsbDojODA4MDgwO2ZpbGwtcnVsZTpldmVub2RkO3N0cm9rZS13aWR0aDoyLjAwNTU0O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtwYWludC1vcmRlcjpzdHJva2UgZmlsbCBtYXJrZXJzIgogICAgICAgaWQ9InJlY3QxNjAiCiAgICAgICB3aWR0aD0iMS45MzQyNDc1IgogICAgICAgaGVpZ2h0PSI2LjA1ODkxMTMiCiAgICAgICB4PSIwIgogICAgICAgeT0iMCIKICAgICAgIHJ5PSIwLjY5OTYwMDEiCiAgICAgICByeD0iMC42OTk2MDAxIiAvPgogICAgPHRleHQKICAgICAgIHhtbDpzcGFjZT0icHJlc2VydmUiCiAgICAgICBzdHlsZT0iZm9udC1zdHlsZTpub3JtYWw7Zm9udC12YXJpYW50Om5vcm1hbDtmb250LXdlaWdodDpib2xkO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1zaXplOjEuOTI1MzdweDtsaW5lLWhlaWdodDoxLjI1O2ZvbnQtZmFtaWx5OnNhbnMtc2VyaWY7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonc2Fucy1zZXJpZiBCb2xkJztmaWxsOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuNjQzNzIiCiAgICAgICB4PSItNC42MzU0MDYiCiAgICAgICB5PSIxLjg5NzY5MzQiCiAgICAgICBpZD0idGV4dDI3MCIKICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KDAsLTEuMjcxMTI2MiwwLjc4NjcwMzk1LDAsMCwwKSI+PHRzcGFuCiAgICAgICAgIHNvZGlwb2RpOnJvbGU9ImxpbmUiCiAgICAgICAgIGlkPSJ0c3BhbjI2OCIKICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtc2l6ZToxLjkyNTM3cHg7Zm9udC1mYW1pbHk6c2Fucy1zZXJpZjstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidzYW5zLXNlcmlmIEJvbGQnO2ZpbGw6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC42NDM3MiIKICAgICAgICAgeD0iLTQuNjM1NDA2IgogICAgICAgICB5PSIxLjg5NzY5MzQiPjIwMjQ8L3RzcGFuPjwvdGV4dD4KICA8L2c+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhMTU4Ij4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGNjOmxpY2Vuc2UKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LzQuMC8iIC8+CiAgICAgIDwvY2M6V29yaz4KICAgICAgPGNjOkxpY2Vuc2UKICAgICAgICAgcmRmOmFib3V0PSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS80LjAvIj4KICAgICAgICA8Y2M6cGVybWl0cwogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjUmVwcm9kdWN0aW9uIiAvPgogICAgICAgIDxjYzpwZXJtaXRzCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyNEaXN0cmlidXRpb24iIC8+CiAgICAgICAgPGNjOnJlcXVpcmVzCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyNOb3RpY2UiIC8+CiAgICAgICAgPGNjOnJlcXVpcmVzCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyNBdHRyaWJ1dGlvbiIgLz4KICAgICAgICA8Y2M6cGVybWl0cwogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjRGVyaXZhdGl2ZVdvcmtzIiAvPgogICAgICA8L2NjOkxpY2Vuc2U+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KPC9zdmc+Cg==";
                        break;
                      case '2025':
                        imgy.src = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iOSIKICAgaGVpZ2h0PSIyNCIKICAgdmlld0JveD0iMCAwIDIuMzgxMjUwMiA2LjM0OTk5OTciCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzUiCiAgIGlua3NjYXBlOnZlcnNpb249IjEuNC4yIChlYmYwZTk0LCAyMDI1LTA1LTA4KSIKICAgc29kaXBvZGk6ZG9jbmFtZT0icDIwMjUuc3ZnIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyI+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXc3IgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzExMTExMSIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIGlua3NjYXBlOnNob3dwYWdlc2hhZG93PSIwIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjEiCiAgICAgaW5rc2NhcGU6ZGVza2NvbG9yPSIjZDFkMWQxIgogICAgIGlua3NjYXBlOmRvY3VtZW50LXVuaXRzPSJweCIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iMTYiCiAgICAgaW5rc2NhcGU6Y3g9Ii05LjA5Mzc1IgogICAgIGlua3NjYXBlOmN5PSIxNC40MDYyNSIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTAxNyIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iNzYwIgogICAgIGlua3NjYXBlOndpbmRvdy15PSItOCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9ImxheWVyMSIgLz4KICA8ZGVmcwogICAgIGlkPSJkZWZzMiIgLz4KICA8ZwogICAgIGlua3NjYXBlOmxhYmVsPSLlm77lsYIgMSIKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlkPSJsYXllcjEiPgogICAgPHJlY3QKICAgICAgIHN0eWxlPSJmaWxsOiMwMDAwMDA7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlLXdpZHRoOjIuMDA1NTQ7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3BhaW50LW9yZGVyOnN0cm9rZSBmaWxsIG1hcmtlcnMiCiAgICAgICBpZD0icmVjdDE2MC05IgogICAgICAgd2lkdGg9IjEuOTM0MjQ3NSIKICAgICAgIGhlaWdodD0iNi4wNTg5MTEzIgogICAgICAgeD0iMC4yMzE1MTA0OSIKICAgICAgIHk9IjAuMTMyMjkxNjQiCiAgICAgICByeT0iMC42OTk2MDAxIgogICAgICAgcng9IjAuNjk5NjAwMSIgLz4KICAgIDxyZWN0CiAgICAgICBzdHlsZT0iZmlsbDojNjk2OTY5O2ZpbGwtcnVsZTpldmVub2RkO3N0cm9rZS13aWR0aDoyLjAwNTU0O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtwYWludC1vcmRlcjpzdHJva2UgZmlsbCBtYXJrZXJzIgogICAgICAgaWQ9InJlY3QxNjAiCiAgICAgICB3aWR0aD0iMS45MzQyNDc1IgogICAgICAgaGVpZ2h0PSI2LjA1ODkxMTMiCiAgICAgICB4PSIwIgogICAgICAgeT0iMCIKICAgICAgIHJ5PSIwLjY5OTYwMDEiCiAgICAgICByeD0iMC42OTk2MDAxIiAvPgogICAgPHRleHQKICAgICAgIHhtbDpzcGFjZT0icHJlc2VydmUiCiAgICAgICBzdHlsZT0iZm9udC1zdHlsZTpub3JtYWw7Zm9udC12YXJpYW50Om5vcm1hbDtmb250LXdlaWdodDpib2xkO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1zaXplOjEuOTI1MzdweDtsaW5lLWhlaWdodDoxLjI1O2ZvbnQtZmFtaWx5OnNhbnMtc2VyaWY7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonc2Fucy1zZXJpZiBCb2xkJztmaWxsOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuNjQzNzIiCiAgICAgICB4PSItNC42MzU0MDYiCiAgICAgICB5PSIxLjg5NzY5MzQiCiAgICAgICBpZD0idGV4dDI3MCIKICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KDAsLTEuMjcxMTI2MiwwLjc4NjcwMzk1LDAsMCwwKSI+PHRzcGFuCiAgICAgICAgIHNvZGlwb2RpOnJvbGU9ImxpbmUiCiAgICAgICAgIGlkPSJ0c3BhbjI2OCIKICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtc2l6ZToxLjkyNTM3cHg7Zm9udC1mYW1pbHk6c2Fucy1zZXJpZjstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidzYW5zLXNlcmlmIEJvbGQnO2ZpbGw6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC42NDM3MiIKICAgICAgICAgeD0iLTQuNjM1NDA2IgogICAgICAgICB5PSIxLjg5NzY5MzQiPjIwMjU8L3RzcGFuPjwvdGV4dD4KICA8L2c+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhMTU4Ij4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGNjOmxpY2Vuc2UKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LzQuMC8iIC8+CiAgICAgIDwvY2M6V29yaz4KICAgICAgPGNjOkxpY2Vuc2UKICAgICAgICAgcmRmOmFib3V0PSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS80LjAvIj4KICAgICAgICA8Y2M6cGVybWl0cwogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjUmVwcm9kdWN0aW9uIiAvPgogICAgICAgIDxjYzpwZXJtaXRzCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyNEaXN0cmlidXRpb24iIC8+CiAgICAgICAgPGNjOnJlcXVpcmVzCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyNOb3RpY2UiIC8+CiAgICAgICAgPGNjOnJlcXVpcmVzCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyNBdHRyaWJ1dGlvbiIgLz4KICAgICAgICA8Y2M6cGVybWl0cwogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjRGVyaXZhdGl2ZVdvcmtzIiAvPgogICAgICA8L2NjOkxpY2Vuc2U+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KPC9zdmc+Cg=="
                        break;
                      case '2026':
                        imgy.src = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iMTUiCiAgIGhlaWdodD0iMjQiCiAgIHZpZXdCb3g9IjAgMCAzLjk2ODc1IDYuMzQ5OTk5NyIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0ic3ZnNSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS40LjIgKGViZjBlOTQsIDIwMjUtMDUtMDgpIgogICBzb2RpcG9kaTpkb2NuYW1lPSJ2MjAyNjIuc3ZnIgogICBpbmtzY2FwZTpleHBvcnQtZmlsZW5hbWU9IlYyMDIzLnBuZyIKICAgaW5rc2NhcGU6ZXhwb3J0LXhkcGk9Ijk2IgogICBpbmtzY2FwZTpleHBvcnQteWRwaT0iOTYiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIj4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgaWQ9Im5hbWVkdmlldzciCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjMTExMTExIgogICAgIGJvcmRlcm9wYWNpdHk9IjEiCiAgICAgaW5rc2NhcGU6c2hvd3BhZ2VzaGFkb3c9IjAiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMSIKICAgICBpbmtzY2FwZTpkZXNrY29sb3I9IiNkMWQxZDEiCiAgICAgaW5rc2NhcGU6ZG9jdW1lbnQtdW5pdHM9InB4IgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBpbmtzY2FwZTp6b29tPSIxNS43NjM0NTIiCiAgICAgaW5rc2NhcGU6Y3g9Ii0wLjAzMTcxODk0MSIKICAgICBpbmtzY2FwZTpjeT0iMjIuMTA4MTAyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDE3IgogICAgIGlua3NjYXBlOndpbmRvdy14PSI3NjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9Ii04IgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ibGF5ZXIxIiAvPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMyIiAvPgogIDxnCiAgICAgaW5rc2NhcGU6bGFiZWw9IuWbvuWxgiAxIgogICAgIGlua3NjYXBlOmdyb3VwbW9kZT0ibGF5ZXIiCiAgICAgaWQ9ImxheWVyMSI+CiAgICA8cmVjdAogICAgICAgc3R5bGU9ImRpc3BsYXk6aW5saW5lO2ZpbGw6I2JhYmRiNjtmaWxsLXJ1bGU6ZXZlbm9kZDtzdHJva2Utd2lkdGg6Mi4xMzE3ODtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7cGFpbnQtb3JkZXI6c3Ryb2tlIGZpbGwgbWFya2VycyIKICAgICAgIGlkPSJyZWN0MTYwLTgiCiAgICAgICB3aWR0aD0iMy40NjgyNzIiCiAgICAgICBoZWlnaHQ9IjYuMzQ5OTk5OSIKICAgICAgIHg9IjAuMTI1MzYxNDMiCiAgICAgICB5PSIyLjc3MDI1MDZlLTE2IgogICAgICAgcnk9IjAuNzI3MjU2MzYiIC8+CiAgICA8cmVjdAogICAgICAgc3R5bGU9ImZpbGw6I2MyMTgwMDtmaWxsLXJ1bGU6ZXZlbm9kZDtzdHJva2Utd2lkdGg6Mi4wMDU1NDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7cGFpbnQtb3JkZXI6c3Ryb2tlIGZpbGwgbWFya2VycztmaWxsLW9wYWNpdHk6MSIKICAgICAgIGlkPSJyZWN0MTYwIgogICAgICAgd2lkdGg9IjMuMTkxMDE4MyIKICAgICAgIGhlaWdodD0iNi4xMDg1MjEiCiAgICAgICB4PSIwIgogICAgICAgeT0iMCIKICAgICAgIHJ5PSIwLjY5OTYwMDEiIC8+CiAgICA8dGV4dAogICAgICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKICAgICAgIHN0eWxlPSJmb250LXNpemU6Mi41NzQ4OHB4O2xpbmUtaGVpZ2h0OjEuMjU7Zm9udC1mYW1pbHk6c2Fucy1zZXJpZjtmaWxsOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjAuNjQzNzIiCiAgICAgICB4PSItNi4zMzg5MDg3IgogICAgICAgeT0iMi40Njk2MjgzIgogICAgICAgaWQ9InRleHQyNzAiCiAgICAgICB0cmFuc2Zvcm09InJvdGF0ZSgtOTApIgogICAgICAgaW5rc2NhcGU6bGFiZWw9InRleHQyNzAiPjx0c3BhbgogICAgICAgICBzb2RpcG9kaTpyb2xlPSJsaW5lIgogICAgICAgICBpZD0idHNwYW4yNjgiCiAgICAgICAgIHN0eWxlPSJmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zdHJldGNoOm5vcm1hbDtmb250LWZhbWlseTpzYW5zLXNlcmlmOy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246J3NhbnMtc2VyaWYgQm9sZCc7ZmlsbDojZmZmZmZmO3N0cm9rZS13aWR0aDowLjY0MzcyIgogICAgICAgICB4PSItNi4zMzg5MDg3IgogICAgICAgICB5PSIyLjQ2OTYyODMiPjIwMjY8L3RzcGFuPjwvdGV4dD4KICA8L2c+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhMTU4Ij4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGNjOmxpY2Vuc2UKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LzQuMC8iIC8+CiAgICAgIDwvY2M6V29yaz4KICAgICAgPGNjOkxpY2Vuc2UKICAgICAgICAgcmRmOmFib3V0PSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS80LjAvIj4KICAgICAgICA8Y2M6cGVybWl0cwogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjUmVwcm9kdWN0aW9uIiAvPgogICAgICAgIDxjYzpwZXJtaXRzCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyNEaXN0cmlidXRpb24iIC8+CiAgICAgICAgPGNjOnJlcXVpcmVzCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyNOb3RpY2UiIC8+CiAgICAgICAgPGNjOnJlcXVpcmVzCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyNBdHRyaWJ1dGlvbiIgLz4KICAgICAgICA8Y2M6cGVybWl0cwogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjRGVyaXZhdGl2ZVdvcmtzIiAvPgogICAgICA8L2NjOkxpY2Vuc2U+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KPC9zdmc+Cg=="
                        break;
                      default:
                        var btn = document.createElement("button");
                        var btt1 = document.createTextNode(years[key]);
                        btn.appendChild(btt1);
                        tiku.children[i].appendChild(btn);
                    }
                    tiku.children[i].appendChild(imgy);
                  }
                }
                else {
                  console.log(tiname + "没成绩");
                }
              }
            }
          }
        };
        xmlhttp.open("GET", "/Technic/Exam/AnswerNotes/ListAsJson?UnitId=1&&rows=200", true);
        xmlhttp.send();
      }
    }
    //成绩查询结束===========================================

  }

  function setanswer() {
    console.log('答案恢复系统启动');
    // 答题助手
    jQuery(function () {});

    try {
      var myFormDoc = document.getElementById("formMain").children[11].children[0]; //页面结构变了的时候，注意这里
    }
    catch (e) {}
    finally {}
    if (myFormDoc != null) {
      var qnum = (myFormDoc.children.length - 3) / 2;
      var butt = $('<a/>', {
        'id': 'upAnswer',
        'href': 'javascript:void(0)',
        'onclick': 'up_myanswer()'
      }).text('答案恢复');
      /*        var dbutt = $('<a/>',{
      'id': 'downAnswer',
      'href':'javascript:void(0)',
      'onclick':'down_myanswer()'
      }).text('      答案导出');*/

      unsafeWindow.up_myanswer = function up_myanswer() {
        alert("该插件仅用于答题暂停时，答案备份和恢复，请正规使用。规范学习");
        console.log("btn_ok");

        var dateNow = new Date();
        let timerp = GM_getValue('timer');
        if (timerp == undefined) {
          var dataTime = new Date("1984-1-1");
        }
        else {
          dataTime = new Date(timerp)
        };
        var timeDiff = dateNow.getTime() - dataTime.getTime();
        //if (timeDiff > 15*60*1000) { //15分钟限制
        if (timeDiff > 60) {
          GM_setValue("timer", dateNow.toUTCString());
          var mytxt = document.getElementById("myinputAnswer").value.split("\n");
          if (mytxt.length != 0) {
            try {
              for (var i = 0; i < mytxt.length; i++) {
                document.getElementById(String(i) + "_MyAnswer").value = mytxt[i];
                var iqus = mytxt[i].split(';');
                var qusid = document.getElementById(String(i) + "_QuestionId").value; //更正题库答案的时候会影响QUSID的数值，不再是连续的，所以每次都需要读取ID来继续分步。这意味着以前的答案可能拿不了满分
                for (var j = 0; j < iqus.length; j++) {
                  try {
                    document.getElementsByName(String(i) + "_MyAnswerItem_" + String(qusid))[j].value = iqus[j];
                  }
                  catch (e) {}
                  finally {}
                  //console.log(String(i)+"_MyAnswerItem_"+String(qstarnum + i));
                  //console.log(document.getElementById(String(i)+"_MyAnswerItem_"+String(qstarnum + i)));
                }
                //document.getElementById(String(i)+"_MyAnswer").type=""; //显示答案统计信息
              }
            }
            catch (e) {}
            finally {}
          }
        }
        else {
          alert("两次答题时间间隔未满15分钟，请保持克制~！！");
        };
      }

      unsafeWindow.down_myanswer = function down_myanswer() {
        var mytxt = ""
        for (var i = 0; i < qnum; i++) {
          mytxt += document.getElementById(String(i) + "_MyAnswer").value + "\n";
        }
        document.getElementById("myinputAnswer").value = mytxt;
      }

      $("#formMain").append(butt);
      //        $('#formMain').append(dbutt);
      $('#formMain').append('<textarea id="myinputAnswer"></textarea>');
    }
    //$('#formMain').append('<button id="upanswer_btn">上传答案</button>');
    /*
        for (var i=0;i<qnum;i++)
    {
        document.getElementById(String(i)+"_MyAnswer").type="text";
        }
         */
    //document.getElementById("formMain").appendChild(btn);
  }

  function nxbshowanswer() {
    console.log('内训宝答案处理');
    const correctAnswers = [];

    // Function to extract correct answers
    function extractCorrectAnswers() {
      // Select all question items
      const questionItems = document.querySelectorAll('.p-q-item');
      questionItems.forEach((item, index) => {
        // Check if it's a multiple choice question
        const correctAnswer = item.querySelector('.p-ques-score .c-green').textContent.trim();
        correctAnswers.push({
          question: index + 1,
          answer: correctAnswer
        });
      });

      // Display the results
      //console.log(correctAnswers.join('\n'));
      //alert(correctAnswers.join('\n'));
    }
    // Function to display the answers at the top of the page
    function displayAnswers() {
      // Create a new div element for the answers
      const answersDiv = document.createElement('div');
      answersDiv.id = 'answersDiv';
      //answersDiv.style.position = 'fixed';
      answersDiv.style.top = '0';
      answersDiv.style.left = '0';
      answersDiv.style.right = '0';
      answersDiv.style.backgroundColor = '#f8f9fa';
      answersDiv.style.padding = '10px';
      answersDiv.style.zIndex = '1000';
      answersDiv.style.textAlign = 'left';
      answersDiv.style.fontSize = '16px';
      answersDiv.style.color = '#343a40';

      // Format the answers
      let formattedAnswers = '<strong>Correct Answers:</strong><br>';
      let currentLine = '';
      let count = 0;

      correctAnswers.forEach((answer, i) => {
        if (answer.answer.includes(',')) { // Multi-select question
          if (count > 0) {
            formattedAnswers += `${(Math.floor(i / 5) + 1) * 5}-${i + 1}: ` + currentLine + '<br>';
            currentLine = '';
            count = 0;
          }
          formattedAnswers += `${answer.question}: ${answer.answer}<br>`;
          count = 0;
        }
        else { // Single-choice question
          currentLine += `${answer.answer} `;
          count++;
          if ((i + 1) % 5 === 0 || i === correctAnswers.length - 1) {
            formattedAnswers += `${i - 3}-${i + 1}: ` + currentLine + '<br>';
            currentLine = '';
            count = 0;
          }
        }
      });

      // Set the inner HTML of the div to be the answers
      answersDiv.innerHTML = formattedAnswers;
      // Prepend the div to the body so it appears at the top
      document.body.prepend(answersDiv);
    }

    // Run the extraction function and then display the answers
    extractCorrectAnswers();
    displayAnswers();
  }

  function handleDefault() {
    console.log('正在处理其他网址');
    // 在这里添加默认的处理逻辑
  }
})();
