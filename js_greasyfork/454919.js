// ==UserScript==
// @name         autoplay-kfdx
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  hnkfdx
// @author       qiu6406,guaxiangdeba
// @match        https://*.hnsydwpx.cn/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/454919/autoplay-kfdx.user.js
// @updateURL https://update.greasyfork.org/scripts/454919/autoplay-kfdx.meta.js
// ==/UserScript==
(function () {
  'use strict';

  var sections = document.getElementsByClassName("sectionNum");
  var items = document.getElementsByClassName("buyCourse_itemMain")
  var cursec = 0;
  var txt;
  var study_css = ".egg_study_btn{outline:0;border:0;position:fixed;top:5px;left:5px;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#fff;color:#d90609;font-size:18px;font-weight:bold;text-align:center;box-shadow:0 0 9px #666777}.egg_manual_btn{transition:0.5s;outline:none;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#e3484b;color:rgb(255,255,255);font-size:18px;font-weight:bold;text-align:center;}.egg_auto_btn{transition:0.5s;outline:none;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#666777;color:rgb(255,255,255);font-size:18px;font-weight:bold;text-align:center;}.egg_setting_box{position:fixed;top:70px;left:5px;padding:12px 20px;border-radius:10px;background-color:#fff;box-shadow:0 0 9px #666777}.egg_setting_item{margin-top:5px;height:30px;width:140px;font-size:16px;display:flex;justify-items:center;justify-content:space-between}input[type='checkbox'].egg_setting_switch{cursor:pointer;margin:0;outline:0;appearance:none;-webkit-appearance:none;-moz-appearance:none;position:relative;width:40px;height:22px;background:#ccc;border-radius:50px;transition:border-color .3s,background-color .3s}input[type='checkbox'].egg_setting_switch::after{content:'';display:inline-block;width:1rem;height:1rem;border-radius:50%;background:#fff;box-shadow:0,0,2px,#999;transition:.4s;top:3px;position:absolute;left:3px}input[type='checkbox'].egg_setting_switch:checked{background:#fd5052}input[type='checkbox'].egg_setting_switch:checked::after{content:'';position:absolute;left:55%;top:3px}";
  GM_addStyle(study_css);

  //页面判断
  function checkUrl() {
    if (window.location.href.indexOf('mineCourse') > 0) {//学习中心页面
      console.log("学习中心页面");
      return 1;
    } else if (window.location.href.indexOf('videoPlayback') > 0) {//播放详情页面
      console.log("详情页面 ");
      return 3;
    } else {
      return -1;
    }

  }

  /**
   * 轮询检查 video 标签是否存在
   * @param {function} callback - 找到 video 后的回调函数
   * @param {string} [selector] - 可选的选择器
   * @param {number} [maxAttempts=0] - 最大检查次数，0 表示无限次
   */
  function pollForVideo(callback, selector, maxAttempts = 5) {
    let attempts = 0;
    const interval = 1000; // 检查间隔：1秒

    const timer = setInterval(() => {
      const video = selector
        ? document.querySelector(selector)
        : document.querySelector('video');

      if (video) {
        clearInterval(timer);
        callback(video); // 找到后执行回调
      }

      // 如果超过最大尝试次数，停止检查
      if (maxAttempts > 0 && ++attempts >= maxAttempts) {
        clearInterval(timer);
        console.error('达到最大检查次数仍未找到 video 标签');
      }
    }, interval);
  }


  //获取课程位置并跳转
  function getPlayItem() {
    if ($("#tab-third span div sup").textContent > 0) {
      console.log("开始学习未完成课程");
      $(".basic-list-item-tool").firstChild.click();
    }
  }


  //选择培训年
  function selectYears() {
    //document.getElementsByClassName("years").item(0).childNodes.item(2).click();//选择2024年度
    pollForVideo(video => { video.firstChild.click(); }, ".basic-list-item-tool", 5);

  }

  //添加控制按钮
  function addButton() {
    var button = document.createElement("button"); //创建一个提示框按钮
    button.id = "id001";
    GM_getValue("start") == 1 ? button.textContent = "正在自动学习！" : button.textContent = "开始学习";
    button.className = "egg_study_btn egg_menu";
    button.onclick = function () {
      if (button.textContent == "开始学习") {
        button.textContent = "正在自动学习！";
        GM_setValue("start", 1);
        selectYears();
        checkUrl();

      } else {
        button.textContent = "开始学习";
        GM_setValue("start", 0);
      }
    }
    var x = document.getElementsByTagName("body")[0];
    x.append(button);
  }


  //初始化
  async function init() {
    switch (checkUrl()) {
      case -1:
        console.log("未找到正确页面");
        break;
      case 1:
        addButton();
        if (GM_getValue("start") === 1) {
          console.log("检测到自动学习状态，继续执行");
          setTimeout(selectYears, 2000); // 等待页面加载完成
        }
        break;
      case 3:
        //播放详情
        // addButton();
        await playNext();
        // $('#TnavUlId li')[7].click();
        break;
    }
  }

  // 配置弹窗选择器（需根据实际页面结构修改）
  const POPUP_SELECTOR = ".el-message-box__btns"; // 示例选择器
  const CONTINUE_BUTTON_SELECTOR = ".el-button--primary"; // 按钮

  // 创建弹窗观察器
  const popupObserver = new MutationObserver(mutations => {
    if (!document.querySelector(POPUP_SELECTOR)) return;

    // 关闭弹窗逻辑
    const btn = document.querySelector(CONTINUE_BUTTON_SELECTOR);
    if (btn) {
      console.log("[自动点击] 关闭继续播放提示");
      btn.click();
    }
  });

  // 开始监听
  popupObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  window.onload = (event) => { init(); }

  const observer = new MutationObserver(mutations => {
    // 添加防抖：1000ms内只执行一次
    clearTimeout(observer.timeout);
    observer.timeout = setTimeout(() => {
      checkUrlAndInit();
    }, 1000);
  });


  // 观察动态容器（根据实际结构调整）
  const containerNode = document.querySelector('.basic-list-item-tool') || document.body;
  observer.observe(containerNode, {
    childList: true,    // 监听子节点变化
    subtree: true,      // 观察后代节点
    attributes: false
  });

  function checkUrlAndInit() {
    if (window.location.href.indexOf('videoPlayback') > -1) {
      console.log('检测到视频播放页面，执行初始化');
      // 查找 video 标签，最多尝试 5 次
        pollForVideo(
          video => {
            video.addEventListener('play', () => {
              console.log('视频开始播放');
            });
            video.addEventListener('pause', () => {
              console.log('视频已暂停');
              video.play();
            });
            video.addEventListener('ended', () => {
              console.log('视频播放结束');
              // playNext();
            });
            video.muted = true; // 强制静音
            video.play(); //静音后自动播放
          },
          null,
          5
        );
      init();
    }
  }

function playNext() {
  return new Promise(resolve => {
    let doing = setInterval(async () => {
      try {
        // 等待元素加载完成
        const activeItem = await waitForElement(".playlist_li_active");
        const lastChild = activeItem.lastElementChild; // 使用 lastElementChild 避免文本节点

        if (!lastChild) {
          console.log("未找到有效子元素");
          return;
        }

        switch (lastChild.innerText.trim()) { // 清理空格避免匹配失败
          case '100%':
            const playlist = await waitForElement(".playlist");
            const items = playlist.children;
            let allCompleted = true;

            for (let i = 0; i < items.length; i++) {
              const item = items[i];
              const itemLastChild = item.lastElementChild;

              if (!itemLastChild) continue;

              if (itemLastChild.innerText.trim() === "100%") {
                if(i==items.length-1) allCompleted=true;
                else console.log(`第${i}小结已学习完成`);
              } else {
                allCompleted = false;
                item.click(); // 点击未完成的项目
                break; // 只处理第一个未完成项
              }
            }

            if (allCompleted) {
              clearInterval(doing);
              resolve('本课学习完成');
              window.location.href="https://www.hnsydwpx.cn/mineCourse";
            }
            break;

          default:
            console.log(lastChild.innerText);
        }
      } catch (err) {
        console.error("检测到错误:", err);
      }
    }, 5000);
  });
}

// 工具函数：等待元素加载
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
      } else if (Date.now() - start >= timeout) {
        reject(new Error(`元素 ${selector} 加载超时`));
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
}

})();


