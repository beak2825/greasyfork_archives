// ==UserScript==
// @name        象课堂视频学习
// @namespace   wwj
// @match       http://xxt-gupt.coolcollege.cn/
// @grant       none
// @version     1.0
// @author      wwj
// @description 2023/4/23 10:57:33
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/464686/%E8%B1%A1%E8%AF%BE%E5%A0%82%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/464686/%E8%B1%A1%E8%AF%BE%E5%A0%82%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

const waitSecond = 2000;
const tipSecond = 2000;
// 等待几秒后执行匹配并点击的操作
// 第一次进入的时间需要设置的长一些
setTimeout(matchAndClick, 5000);

(function() {

  // 保存原始的 open 和 send 方法
  var originalOpen = XMLHttpRequest.prototype.open;
  var originalSend = XMLHttpRequest.prototype.send;
  var originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

  // 定义变量保存请求的 method 和 url
  var requestMethod;
  var requestUrl;

  // 拦截 open 方法，保存请求的 method 和 url
  XMLHttpRequest.prototype.open = function(method, url) {
    requestMethod = method;
    requestUrl = url;
    originalOpen.call(this, method, url, true);
  };

  XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
    if (requestMethod === 'POST' && requestUrl.indexOf('save_progress') !== -1) {
      if (header.toLowerCase() === 'x-data-sign') {
        // 删除请求头中的x-data-sign参数
        console.log("删除请求头")
        return;
      }
    }

    // 调用原始的setRequestHeader方法
    originalSetRequestHeader.call(this, header, value);
  };


  // 拦截 send 方法，修改请求数据和请求头
  XMLHttpRequest.prototype.send = function(data) {
    // 如果是 POST 请求并且路径包含 "save_progress"
    if (requestMethod === 'POST' && requestUrl.indexOf('save_progress') !== -1) {
      // 修改请求数据中的 progress 字段为 100
      console.log("修改请求数据")
      var requestData = JSON.parse(data);
      requestData.progress = 100;
      data = JSON.stringify(requestData);

      // 添加请求成功后的提示框
      var originalOnReadyStateChange = this.onreadystatechange;
      this.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          showNotification("视频完成学习")
          setTimeout(matchReturnAndClick, waitSecond);
        }
        if (originalOnReadyStateChange) {
          originalOnReadyStateChange.apply(this, arguments);
        }
      };
    }

    // 调用原始的 send 方法
    originalSend.call(this, data);
  };

})();

// 弹窗提示
function showNotification(message, timeout = tipSecond) {
  const notification = document.createElement('div');
  notification.innerHTML = message;
  notification.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    padding: 10px;
    border-radius: 5px;
    background-color: rgba(0, 128, 0, 0.8);
    color: #fff;
    z-index: 99999;
    transition: opacity 0.5s;
    opacity: 0;
  `;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.opacity = 1;
  }, 100);
  setTimeout(() => {
    notification.style.opacity = 0;
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, timeout);
}

// 定义一个函数，用于匹配元素并点击
function matchAndClick() {
  // 通过querySelectorAll方法获取所有匹配的元素
  var elements = document.querySelectorAll('.cl-primary');
  console.log("设置一个定时器")
  var timer = setInterval(function() {
    // 遍历所有匹配的元素
    let i = 0;
    for (; i < elements.length; i++) {
      var element = elements[i];

      // 判断元素内容是否为“开始学习”
      if (element.textContent === '开始学习') {
        // 触发元素的点击事件
        console.log("点击进入视频页面 i:"+i)
        element.click();
        clearInterval(timer);
        break;
      }
    }
    if(i == elements.length){
      showNotification("所有视频已完成学习")
      clearInterval(timer);
    }
  }, 5000);
}

function matchReturnAndClick() {
  // 通过querySelectorAll方法获取所有匹配的元素
  const element = document.querySelector('.anticon.anticon-left');
  if(element){
    element.click()
    console.log("点击退出视频页面")
    // 等待几秒后执行匹配并点击的操作
    setTimeout(matchAndClick, waitSecond);
  }
}



// 以上代码均由ChatGPT提供，本人仅作调整



