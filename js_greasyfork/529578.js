// ==UserScript==
// @name         【高教在线刷课助手】|| 自动执行，移除防止暂停，自动跳转下一节
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  高教在线课程自动挂机，当前脚本支持课程视频播放完成，自动跳转下一小节，章节测试自动跳过，后台播放防止视频暂停。
// @author       Sweek
// @match        *://*.cqooc.com/*
// @license      GPLv3
// @icon         https://www.sweek.top/api/preview/avatar.jpg
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        unsafeWindow
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/529578/%E3%80%90%E9%AB%98%E6%95%99%E5%9C%A8%E7%BA%BF%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B%E3%80%91%7C%7C%20%E8%87%AA%E5%8A%A8%E6%89%A7%E8%A1%8C%EF%BC%8C%E7%A7%BB%E9%99%A4%E9%98%B2%E6%AD%A2%E6%9A%82%E5%81%9C%EF%BC%8C%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E4%B8%8B%E4%B8%80%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/529578/%E3%80%90%E9%AB%98%E6%95%99%E5%9C%A8%E7%BA%BF%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B%E3%80%91%7C%7C%20%E8%87%AA%E5%8A%A8%E6%89%A7%E8%A1%8C%EF%BC%8C%E7%A7%BB%E9%99%A4%E9%98%B2%E6%AD%A2%E6%9A%82%E5%81%9C%EF%BC%8C%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E4%B8%8B%E4%B8%80%E8%8A%82.meta.js
// ==/UserScript==






/* 窗口初始化 */
/* 窗口初始化 */
/* 窗口初始化 */

function initPopup() {
  // 创建 CSS 样式
  const popCSs = `
    #my-window {
      position: fixed;
      top: 10px;
      left: 20px;
      width: 400px;
      height: 600px;
      background: rgb(255, 255, 255);
      color: white;
      font-size: 14px;
      border-radius: 5px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      user-select: none;
      font-family: 'fangsong';
      border: 1px solid rgb(71, 158, 130);
      overflow: hidden;
    }
    #window-header {
      height: 50px;
      padding: 0 10px;
      background: rgb(71, 158, 130);
      cursor: grab;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 5px 5px 0 0;
      .window-header-title {
        font-size: 16px;
        font-weight: bold;
        font-family: 'fangsong';
      }
    }
    #restore-btn {
      cursor: pointer;
      font-size: 16px;
      background: none;
      border: none;
      color: #444;
      height：20px;
      width：30px;
      text-align: center;
      line-height: 20px;
      background: #fff;
      border-radius: 5px;
      padding: 0 5px;
    }
    #restore-btn:hover {
      background: rgb(71, 158, 130);
      border: 1px solid #fff;
      color: #fff;
    }
    .tab {
      display: inline-block;
      padding: 5px 10px;
      cursor: pointer;
      background: #888;
      text-align: center;
      font-weight: bold;
    }
    .tab.active {
      background: #444;
    }
    #window-content {
      flex: 1;
      padding: 8px;
      overflow: auto;
    }
    #my-window.minimized {
      height: 50px;
      overflow: hidden;
    }
    #tab-container {
      display: block;
      width: 100%;
      background: #ddd;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      padding: 6px 8px;
    }
    #window-content {
      display: block;
      background: #fff;
    }
    #my-window.minimized #window-content, #my-window.minimized #tab-container {
      display: none;
    }
    #taskCountContent {
      background: #fff;
      border: 1px solid #ccc;
      border-radius: 5px;
      height: 100%;
      overflow-y: auto;
      color: #333;
      line-height: 20px;
      padding: 5px;
    }
    #taskLogsContent {
      background: #222;
      border: 1px solid #ccc;
      border-radius: 2px;
      height: 100%;
      overflow-y: auto;
      color: #fff;
      line-height: 20px;
      padding: 5px;
    }
  `;

  // 添加 CSS 样式
  const style = document.createElement("style");
  style.innerHTML = popCSs;
  document.head.appendChild(style);

  // 创建窗口元素
  const popHtml = `
    <div id="window-header">
      <span class="window-header-title">Sweek高教在线刷课助手[0.0.1]</span>
      <div id="restore-btn">⏷</div>
    </div>
    <div id="tab-container">
      <span class="tab active" data-tab="taskCount">页面任务</span>
      <span class="tab" data-tab="taskLogs">执行日志</span>
    </div>
    <div id="window-content">
      <div id="taskCountContent">当前任务数: <span id="taskCount">0</span></div>
      <div id="taskLogsContent" style="display: none;"></div>
    </div>
  `;

  const myWindow = document.createElement("div");
  myWindow.id = "my-window";
  myWindow.innerHTML = popHtml;
  document.body.appendChild(myWindow);

  // 绑定最小化按钮事件
  document.getElementById("restore-btn").addEventListener("click", () => {
    myWindow.classList.toggle("minimized");
  });

  // 处理拖动窗口
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  document.getElementById("window-header").addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - myWindow.offsetLeft;
    offsetY = e.clientY - myWindow.offsetTop;
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      let x = e.clientX - offsetX;
      let y = e.clientY - offsetY;
  
      // 限制窗口不能拖出屏幕
      let maxX = window.innerWidth - myWindow.offsetWidth;
      let maxY = window.innerHeight - myWindow.offsetHeight;
  
      x = Math.max(0, Math.min(x, maxX));
      y = Math.max(0, Math.min(y, maxY));
  
      myWindow.style.left = `${x}px`;
      myWindow.style.top = `${y}px`;
    }
  });
  

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // 绑定 Tab 切换事件
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(el => el.classList.remove("active"));
      tab.classList.add("active");
      
      document.getElementById("taskCountContent").style.display = "none";
      document.getElementById("taskLogsContent").style.display = "none";
      
      if (tab.dataset.tab === "taskCount") {
        document.getElementById("taskCountContent").style.display = "block";
      } else {
        document.getElementById("taskLogsContent").style.display = "block";
      }
    });
  });
}



function destroyPopup() {
  const myWindow = document.getElementById("my-window");
  if (myWindow) {
    myWindow.remove(); // 移除窗口
  }

  const styleTags = document.querySelectorAll("style");
  styleTags.forEach(style => {
    if (style.innerHTML.includes("#my-window")) {
      style.remove(); // 移除添加的 CSS 样式
    }
  });

  document.removeEventListener("mousemove", moveHandler);
  document.removeEventListener("mouseup", upHandler);

  // console.log("窗口已销毁");
}










/* 课程处理方法 */
/* 课程处理方法 */
/* 课程处理方法 */

let taskQueue = []; // 任务队列
const testDealEvent = new Event("testRedeal", { bubbles: false, cancelable: false });



// 处理视频
function handleVideo(Dom) {
  return new Promise((resolve) => {
    const playButton = Dom.querySelector(".dplayer-mobile-play"); // 获取播放按钮
    const video = Dom.querySelector("video"); // 获取视频元素

    if (!video) {
      addLog("未找到视频元素");
      return resolve();
    }

    let playAttempted = false; // 是否尝试过播放

    // 监听视频播放时的进度
    video.addEventListener("timeupdate", () => {
      const currentTime = video.currentTime; // 当前播放时间
      const duration = video.duration; // 视频总时长
      const playbackRate = video.playbackRate; // 播放倍速

      // 生成显示进度的内容
      const val1 = currentTime; // 当前播放时间
      const val2 = duration; // 视频总时长
      setProgress(val1, val2, playbackRate, 'video'); // 设置显示播放进度
    });

    function preventPause() {
      video.onpause = () => {
        // addLog("视频暂停，1秒后重新播放");
        setTimeout(() => {
          if (video.paused) {
            video.play().catch((error) => {
              addLog(`重新播放失败: ${error}`);
            });
          }
        }, 500); // 0.5秒后重新播放
      };
    }

    function checkPlayback() {
      setTimeout(() => {
        if (!video.paused) {
          addLog("视频已成功播放");
          return;
        }

        addLog("播放按钮点击无效，尝试直接调用 video.play()");
        video.muted = true; // 静音播放，防止浏览器限制
        video.play().catch((error) => {
          addLog(`直接播放失败: ${error}`);
        });
      }, 500); // 延迟检查，确保点击后有时间触发播放
    }

    if (playButton) {
      addLog("找到播放按钮，尝试点击播放");
      playButton.click();
      playAttempted = true;
      checkPlayback(); // 延迟检查播放情况
    }

    if (!playAttempted) {
      addLog("未找到播放按钮，尝试直接调用 video.play()");
      video.muted = true;
      video.play().catch((error) => {
        addLog(`直接播放失败: ${error}`);
      });
    }

    // 阻止视频暂停
    preventPause();

    // 监听视频播放完成事件
    video.onended = () => {
      addLog("视频播放完成");
      // 清理事件监听和状态
      video.onended = null;  // 移除事件监听
      video.onpause = null;  // 移除暂停监听
      resolve();  // 完成当前视频任务
    };
  });
}










// 处理PDF
function handlePDF(Dom) {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const headerBox = document.querySelector(".header-box");
      if (headerBox) {
        const text = headerBox.innerText;

        if (!text.includes("完成倒计时")) {
          clearInterval(interval); // 停止轮询
          resolve(); // 任务完成，调用 resolve
        }
      }
    }, 1000); // 每秒检查一次
  });
}





// 获取课程内容类型
function getCourseContentType(Dom) {

  // 获取DOM元素的HTML内容
  const htmlContent = Dom.innerHTML || Dom.outerHTML;

  // 判断Dom中是否包含<video>标签
  if (htmlContent.includes('video')) {
    return 'video';
  }

  // 判断Dom中是否包含<iframe>标签
  if (htmlContent.includes('iframe')) {
    return 'PDF';
  }

  // 如果都不包含，返回null或者其他默认值
  return null;
}






// 处理课程接口
function handleCourseContent(Dom) {
  return new Promise((resolve) => {
      const courseContentType = getCourseContentType(Dom)
      switch (courseContentType) {
        case 'video':
          addLog("开始处理视频任务...");
          handleVideo(Dom).then(() => {
            addLog("视频任务处理完成");
            resolve();
          });
          break;
        case 'PDF':
          addLog("开始处理PDF/PPT内容...");
          handlePDF(Dom).then(() => {
            addLog("PDF/PPT任务处理完成");
            resolve();
          });
          break;
        default:
          addLog("未知课程类型,跳过该任务");
          resolve();
      }
  });
}



// 监听任务完成状态的函数
function waitForContentToLoad() {
  return new Promise((resolve) => {
      let contentContainer = document.querySelector(".video-box");
      if (!contentContainer) {
        addLog("未找到课程内容模块，直接继续下一个任务");
        resolve();
        return
      }

      let observer = new MutationObserver((mutations, obs) => {
          if (contentContainer.innerText.trim() !== "") {
              obs.disconnect(); // 停止监听

              // 调用 handleCourseContent，并等待其完成
              handleCourseContent(contentContainer).then(() => {
                  resolve();
              });
          }
      });

      observer.observe(contentContainer, { childList: true, subtree: true });

      // 设置超时防止卡死
      // setTimeout(() => {
      //     addLog("课程内容加载超时，继续下一个任务");
      //     observer.disconnect();
      //     resolve();
      // }, 5000);
  });
}


// 任务执行器
async function processNextTask() {
    if (taskQueue.length === 0) {
        addLog("所有任务已执行完毕");
        return;
    }

    let element = taskQueue.shift(); // 取出任务
    // console.log(`点击元素:`, element);

    element.click(); // 触发点击
    await waitForContentToLoad(); // 等待课程内容加载处理完成

    // 触发下一个任务
    setTimeout(() => {
        document.dispatchEvent(testDealEvent);
    }, 2000);
}

// 监听事件，触发下一个任务
document.addEventListener("testRedeal", processNextTask);


// 初始化任务执行
function startTaskFlow() {
  let allTasks = Array.from(document.querySelectorAll(".third-level-box"))
    .filter(el => !/作业|测验/.test(el.innerText)); // 筛选掉包含"作业"或"测验"的任务

  let activeIndex = allTasks.findIndex(el => el.classList.contains("active"));
  addLog(`本课程共 ${allTasks.length} 个有效任务`); // 仅计算有效任务

  if (activeIndex === -1) {
      console.log("未找到 active 状态的元素，从头开始执行任务流");
      taskQueue = allTasks;
  } else {
      console.log(`找到 active 元素，从索引 ${activeIndex} 开始执行任务流`);
      taskQueue = [...allTasks.slice(activeIndex)];
  }

  addLog(`共 ${taskQueue.length} 个任务即将执行`);

  if (taskQueue.length > 0) {
      document.dispatchEvent(testDealEvent);
  }
}











/* 工具方法 */
/* 工具方法 */
/* 工具方法 */

// 格式化时间函数
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds}`;
}

// 添加日志方法
function addLog(message) {
  let logEl = document.getElementById("taskLogsContent");
  let logItem = document.createElement("div");
  logItem.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  logEl.appendChild(logItem);
};


// 设置播放进度
function setProgress(val1, val2, val3, type) {        
  let newContent = "";
  switch (type) {
      case "video":
        newContent += `<p>播放进度：${(val1/val2 * 100).toFixed(2)}%</p><hr>`;
        newContent += `<p>播放倍速：${val3}</p><hr>`;
        newContent += `<p>视频长度：${formatTime(val1)}/${formatTime(val2)}</p>`;
        break;
      case "PDF":
        newContent += `<p>滚动进度：${(val1/val2 * 100).toFixed(2)}%</p><hr>`;
        newContent += `<p>滚动倍速：${val3}</p><hr>`;
        newContent += `<p>PDF高度：${formatTime(val1)}/${formatTime(val2)}</p>`;
        break;
      default:
        break;
  }
  const taskCountContent = document.getElementById("taskCountContent"); // 获取显示进度的元素
  // 更新 taskCountContent 中的内容
  taskCountContent.innerHTML = newContent;
}

// 页面通知提示
function notify(text, time) {
  // 创建通知元素
  var notification = document.createElement('div');
  notification.className = 'notification';
  // 设置通知内容
  notification.innerHTML = '<div class="notification-content"><h2 style="font-size: 16px;font-weight: bold;color: #307dff;font-family: fangsong;">' + 'Sweek高教在线刷课助手提示' + '</h2><p style="font-family: fangsong;font-size: 13px;font-weight: bold;">' + text + '</p></div>';
  // 将通知添加到页面中
  document.body.appendChild(notification);
  // 设置通知样式
  notification.style.position = 'fixed';
  notification.style.top = '50px';
  notification.style.left = '-400px'; // 从左边弹出
  notification.style.transform = 'translateY(-50%)'; // 垂直居中
  notification.style.transition = 'left 0.5s ease-in-out'; // 添加过渡效果
  notification.style.zIndex = '999999';
  notification.style.backgroundColor = '#fff';
  notification.style.border = '1px solid #ccc';
  notification.style.padding = '10px';
  notification.style.borderRadius = '5px';
  notification.style.lineHeight = '25px';

  // 等待一小段时间后，移动通知到左边
  setTimeout(function() {
      notification.style.left = '20px'; // 移动到左边
  }, 100);

  // 设置定时器，在指定时间后移除通知
  setTimeout(function() {
      // 移动通知到左边以外
      notification.style.left = '-400px';
      // 等待过渡效果完成后，移除通知元素
      setTimeout(function() {
      notification.remove();
      }, 500);
  }, time);
}



/* 处理页面路由跳转 */
/* 处理页面路由跳转 */
/* 处理页面路由跳转 */

let lastPath = location.pathname;

function handlePathChange() {
  if (lastPath !== location.pathname) {
    lastPath = location.pathname;
    handleInPageNotify()
  }
}

// 进入页面提示逻辑
function handleInPageNotify() {
  // console.log('location.pathname：：：+ ', location.pathname)
  switch (location.pathname) {
    case '/index/home':
      notify('高教在线刷课助手已成功启动，已进入高教在线首页，请鼠标悬浮右上角头像点击在学课程', 2500)
      destroyPopup()
      break;
    case '/account/course':
      notify('已进入在学课程页面', 2500)
      destroyPopup()
      break;
    case '/course/detail/courseStudy':
      notify('已进入课程学习页面', 2500)
      // 初始化窗口
      initPopup()
      setTimeout(() => {
        // 执行任务流
        startTaskFlow();
      }, 2500);
      break;
    default:
      break;
  }
}

// 劫持 history.pushState 和 replaceState
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function (...args) {
  originalPushState.apply(this, args);
  handlePathChange();
};

history.replaceState = function (...args) {
  originalReplaceState.apply(this, args);
  handlePathChange();
};

window.addEventListener("popstate", handlePathChange);



// 方法执行入口
// 方法执行入口
// 方法执行入口
(async function () {
  // 引入Bootstrap Icons
  let link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://cdn.bootcdn.net/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.css";
  document.head.appendChild(link);
  handleInPageNotify()
})();



