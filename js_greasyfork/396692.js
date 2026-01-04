// ==UserScript==
// @name         钉钉最大化
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  Web 钉钉支持最大化/最小化
// @author       HappyStraw <fangyutao1993@hotmail.com>
// @compatible   chrome
// @compatible   firefox
// @license      MIT
// @match        *://im.dingtalk.com/
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396692/%E9%92%89%E9%92%89%E6%9C%80%E5%A4%A7%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/396692/%E9%92%89%E9%92%89%E6%9C%80%E5%A4%A7%E5%8C%96.meta.js
// ==/UserScript==

var maximizeIcon =
  '<svg t="1582259817661" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1209" width="200" height="200"><path d="M482.3 513.3L196 799.6c-0.5-2.4-0.8-4.9-0.8-7.5V560.4h-42.7v231.7c0 44.2 35.9 80.1 80.1 80.1h231.7v-42.7H232.6c-1.9 0-3.8-0.1-5.7-0.4l285.5-285.5-30.1-30.3zM795.4 154.1H563.6v42.7h231.7c1.3 0 2.5 0.1 3.8 0.2L514.3 481.9l30.2 30.2L831.6 225c0.8 3 1.2 6 1.2 9.2V466h42.7V234.2c0-44.1-36-80.1-80.1-80.1z" p-id="1210" fill="#edf7ff"></path></svg>';
var minimizeIcon =
  '<svg t="1582259649712" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10462" width="200" height="200"><path d="M404.2 541.6H172.5v42.7h231.7c1.9 0 3.8 0.1 5.7 0.4L124.3 870.2l30.2 30.2 286.3-286.3c0.5 2.4 0.8 4.9 0.8 7.5v231.7h42.7V621.6c0-44.1-35.9-80-80.1-80zM618.8 441l284.9-284.9-30.2-30.2L586.4 413c-0.8-2.9-1.2-6-1.2-9.2V172.1h-42.7v231.7c0 44.2 35.9 80.1 80.1 80.1h231.7v-42.7H622.6c-1.3 0-2.6-0.1-3.8-0.2z" p-id="10463" fill="#edf7ff"></path></svg>';
var css = `
#layout-main,
#body {
  transition: .2s;
}
body.full-screen #layout-main {
  width: calc(100vw - 60px);
  flex: 1;
  min-width: 1000px;
  box-shadow: none;
  margin-top: 20px;
}
body.full-screen #body {
  height: calc(100vh - 100px);
  min-height: 600px;
}
.full-screen-toggle {
  width: 26px;
  height: 26px;
  float: right;
  margin: 17px 15px 4px 0;
  cursor: pointer;
}
.full-screen-toggle svg {
  width: 100%;
  height: 100%;
}
`;

function toggleFullScreen(button) {
  var isFullScreen = "false";
  if (button.title == "最大化") {
    button.innerHTML = minimizeIcon;
    button.title = "最小化";
    isFullScreen = "true";
  } else {
    button.innerHTML = maximizeIcon;
    button.title = "最大化";
  }

  document.body.classList.toggle("full-screen");
  // 记录状态
  document.cookie =
    "fullscreen=" +
    isFullScreen +
    "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
}

(function () {
  "use strict";

  // 新增样式
  var elStyle = document.createElement("style");
  elStyle.setAttribute("type", "text/css");
  elStyle.innerHTML = css;
  document.head.appendChild(elStyle);
  // console.log("初始化样式");

  // 添加最大化/最小化按键
  var timer = setInterval(function () {
    var elHeader = document.getElementById("header");
    if (!elHeader) {
      return;
    }
    var uploadList = elHeader.getElementsByTagName("upload-list");
    if (uploadList.length < 1) {
      return;
    }
    clearInterval(timer);
    // 添加按钮
    uploadList = uploadList[0];
    var button = document.createElement("div");
    button.id = "full-screen-toggle-btn";
    button.className = "full-screen-toggle";
    button.innerHTML = maximizeIcon;
    button.title = "最大化";
    button.addEventListener("click", function () {
      toggleFullScreen(this);
    });
    uploadList.prepend(button);
    // console.log("初始化按键");

    // 恢复上次状态
    var isFullScreen =
      document.cookie.replace(
        /(?:(?:^|.*;\s*)fullscreen\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      ) === "true";
    if (isFullScreen) {
      toggleFullScreen(button);
    }
  }, 500);
})();
