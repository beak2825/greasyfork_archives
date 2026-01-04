// ==UserScript==
// @name         课程思政教学能力提升专题网络培训（改良）
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  课程思政教学能力提升专题网络培训倍速和自动播放
// @author       You
// @match        https://study.enaea.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=enaea.edu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468030/%E8%AF%BE%E7%A8%8B%E6%80%9D%E6%94%BF%E6%95%99%E5%AD%A6%E8%83%BD%E5%8A%9B%E6%8F%90%E5%8D%87%E4%B8%93%E9%A2%98%E7%BD%91%E7%BB%9C%E5%9F%B9%E8%AE%AD%EF%BC%88%E6%94%B9%E8%89%AF%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/468030/%E8%AF%BE%E7%A8%8B%E6%80%9D%E6%94%BF%E6%95%99%E5%AD%A6%E8%83%BD%E5%8A%9B%E6%8F%90%E5%8D%87%E4%B8%93%E9%A2%98%E7%BD%91%E7%BB%9C%E5%9F%B9%E8%AE%AD%EF%BC%88%E6%94%B9%E8%89%AF%EF%BC%89.meta.js
// ==/UserScript==

(async function () {
  "use strict";
  async function waitElementLoaded(ele, max = 50, n = 1, m = "querySelector") {
    return new Promise((resolve, reject) => {
      let i = 0;
      let timer = setInterval(() => {
        let element = document[m](ele);
        console.log("find element: ", ele);
        if (element) {
          console.log("已找到指定元素: ", element);
          clearInterval(timer); // 停止重复计时
          resolve(element);
        } else {
          i++;
          console.log(`检测次数: ${i}`);
          if (i >= max) {
            console.log(`已检测超过 ${i} 次, 无法获取指定元素. `);
            clearInterval(timer); // 停止重复计时
            reject(null);
          }
        }
      }, n * 1000);
    });
  }
  async function courseDetail() {
    let speed = 2;

    async function waitTime(s = 3) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          return resolve();
        }, s * 1000);
      });
    }

    let currUrl = window.location.href;
    let url = currUrl.split("?")[0];

    function initialize() {
      const html = `
      <div id="acme-box">
          <button id="show" class="btn btn-outline-danger">
              <css-icon class="icon-arrow-up">
          </button>
          <div class="acme-card card">
              <div id="acme-card-header" title="可移动"
                  class="acme-card-header d-flex flex-row align-items-center card-header bg-danger text-white">
                  <css-icon class="icon-apps"></css-icon>
                  <span class="mx-2">控制面板</span>
                  <div class="flex-grow-1"></div>
                  <span id="restore" class="restore">
                      <css-icon class="icon-arrow-down"></css-icon>
                  </span>
              </div>
              <div class="acme-card-body card-body">

              <span>速度: </span>

              <select id="speedx" class="acme-speed">
              <option value="8.0">8.0x</option>
              <option value="6.0">6.0x</option>
              <option value="4.0">4.0x</option>
              <option value="3.0">3.0x</option>
              <option selected="selected"  value="2.0">2.0x</option>
              <option value="1.0">1.0x</option>
              <option value="0.5">0.5x</option>
          </select>

           <button id="set-speedx" class="btn btn-outline-danger">
                  设置播放速度
              </button>
              </div>
          </div>
      </div>`;
      const cssStyle = `
  @charset "UTF-8";


:root {
  --bs-blue: #0d6efd;
  --bs-indigo: #6610f2;
  --bs-purple: #6f42c1;
  --bs-pink: #d63384;
  --bs-red: #dc3545;
  --bs-orange: #fd7e14;
  --bs-yellow: #ffc107;
  --bs-green: #198754;
  --bs-teal: #20c997;
  --bs-cyan: #0dcaf0;
  --bs-white: #fff;
  --bs-gray: #6c757d;
  --bs-gray-dark: #343a40;
  --bs-gray-100: #f8f9fa;
  --bs-gray-200: #e9ecef;
  --bs-gray-300: #dee2e6;
  --bs-gray-400: #ced4da;
  --bs-gray-500: #adb5bd;
  --bs-gray-600: #6c757d;
  --bs-gray-700: #495057;
  --bs-gray-800: #343a40;
  --bs-gray-900: #212529;
  --bs-primary: #0d6efd;
  --bs-secondary: #6c757d;
  --bs-success: #198754;
  --bs-info: #0dcaf0;
  --bs-warning: #ffc107;
  --bs-danger: #dc3545;
  --bs-light: #f8f9fa;
  --bs-dark: #212529;
  --bs-primary-rgb: 13, 110, 253;
  --bs-secondary-rgb: 108, 117, 125;
  --bs-success-rgb: 25, 135, 84;
  --bs-info-rgb: 13, 202, 240;
  --bs-warning-rgb: 255, 193, 7;
  --bs-danger-rgb: 220, 53, 69;
  --bs-light-rgb: 248, 249, 250;
  --bs-dark-rgb: 33, 37, 41;
  --bs-white-rgb: 255, 255, 255;
  --bs-black-rgb: 0, 0, 0;
  --bs-body-color-rgb: 33, 37, 41;
  --bs-body-bg-rgb: 255, 255, 255;
  --bs-font-sans-serif: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --bs-font-monospace: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  --bs-gradient: linear-gradient(180deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0));
  --bs-body-font-family: var(--bs-font-sans-serif);
  --bs-body-font-size: 1rem;
  --bs-body-font-weight: 400;
  --bs-body-line-height: 1.5;
  --bs-body-color: #212529;
  --bs-body-bg: #fff;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

#acme-box {
  position: absolute;
  z-index: 2147483647;
}

#acme-box>#show {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  text-align: center;
  border-radius: 50%;
}

#acme-box>.acme-card {
  display: none;
  width: 320px;
  height: 180px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  font-size: 14px;
}

#acme-box>div>#acme-card-header:hover {
  cursor: grab;
}

#acme-box>div>#acme-card-header:active {
  cursor: grabbing;
}

#acme-box>div>div>#restore:hover {
  cursor: pointer;
}

/* 图标公共样式 */
#acme-box css-icon {
  display: inline-block;
  height: 1em;
  width: 1em;
  font-size: 20px;
  box-sizing: border-box;
  text-indent: -9999px;
  vertical-align: middle;
  position: relative;
}

#acme-box css-icon::before,
#acme-box css-icon::after {
  content: '';
  box-sizing: inherit;
  position: absolute;
  left: 50%;
  top: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

/* 图标公共样式线束 */


/* 向上图标 */
#acme-box .icon-arrow-up::before {
  height: .65em;
  width: .65em;
  border-style: solid;
  border-width: 2px 0 0 2px;
  -ms-transform: translate(-50%, -25%) rotate(45deg);
  transform: translate(-50%, -25%) rotate(45deg);
}

/* 向下图标 */
#acme-box .icon-arrow-down::before {
  height: .65em;
  width: .65em;
  border-style: solid;
  border-width: 2px 0 0 2px;
  -ms-transform: translate(-50%, -75%) rotate(225deg);
  transform: translate(-50%, -75%) rotate(225deg);
}

/* 标题栏图标 */
#acme-box .icon-apps::before {
  height: .15em;
  width: .15em;
  background: currentColor;
  box-shadow: -.35em -.35em, -.35em 0, -.35em .35em, 0 -.35em, 0 .35em, .35em -.35em, .35em 0, .35em .35em;
}

#acme-box .d-flex {
  display: flex !important;
}

#acme-box .flex-row {
  flex-direction: row !important;
}

#acme-box .flex-grow-1 {
  flex-grow: 1 !important;
}

#acme-box .align-items-center {
  align-items: center !important;
}

#acme-box .bg-danger {
  --bs-bg-opacity: 1;
  background-color: rgba(var(--bs-danger-rgb), var(--bs-bg-opacity)) !important;
}


#acme-box .text-white {
  --bs-text-opacity: 1;
  color: rgba(var(--bs-white-rgb), var(--bs-text-opacity)) !important;
}

#acme-box .btn {
  display: inline-block;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}


#acme-box .btn-outline-danger {
  color: #dc3545;
  border-color: #dc3545;
}

#acme-box .btn-outline-danger:hover {
  color: #fff;
  background-color: #dc3545;
  border-color: #dc3545;
}

#acme-box .btn-check:focus+.btn-outline-danger,
#acme-box .btn-outline-danger:focus {
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.5);
}

#acme-box .btn-check:checked+.btn-outline-danger,
#acme-box .btn-check:active+.btn-outline-danger,
#acme-box .btn-outline-danger:active,
#acme-box .btn-outline-danger.active,
#acme-box .btn-outline-danger.dropdown-toggle.show {
  color: #fff;
  background-color: #dc3545;
  border-color: #dc3545;
}

#acme-box .btn-check:checked+.btn-outline-danger:focus,
#acme-box .btn-check:active+.btn-outline-danger:focus,
#acme-box .btn-outline-danger:active:focus,
#acme-box .btn-outline-danger.active:focus,
#acme-box .btn-outline-danger.dropdown-toggle.show:focus {
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.5);
}

#acme-box .btn-outline-danger:disabled,
#acme-box .btn-outline-danger.disabled {
  color: #dc3545;
  background-color: transparent;
}

#acme-box .card {
  /* position: relative;
  display: flex; */
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.75rem;
}

#acme-box .card-body {
  flex: 1 1 auto;
  padding: 1rem 1rem;
}

#acme-box .card-title {
  margin-bottom: 0.5rem;
}

#acme-box .card-header {
  padding: 0.5rem 1rem;
  margin-bottom: 0;
  background-color: rgba(0, 0, 0, 0.03);
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  /* border-radius: 0.75rem; */
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
}

#acme-box .mx-2 {
  margin-right: 0.5rem !important;
  margin-left: 0.5rem !important;
}
  `;
      function addStyleCss(styleCss) {
        let style = document.createElement("style");
        style.type = "text/css";
        let text = document.createTextNode(styleCss);
        style.appendChild(text);

        document.querySelector("head").appendChild(style);
      }

      // 在 </body>标签前添加 html
      function addHtml(html) {
        document.body.insertAdjacentHTML("beforeend", html);
      }

      addStyleCss(cssStyle);
      addHtml(html);
    }
    initialize();
    (() => {
      // 实现界面的显示切换及拖动，这部分要放在最后面
      let btnShow = document.querySelector("#show");
      let acmeCard = document.querySelector("#acme-box > .acme-card");
      let acmeCardheader = document.querySelector("#acme-card-header");
      let restore = document.querySelector("#restore");
      let btnSetSpeedx = document.querySelector("#set-speedx");
      let speedSelect = document.querySelector("#speedx");

      speedSelect.addEventListener("change", async (e) => {
        console.log(speedSelect.value);
        speed = speedSelect.value;
        await setPlaySpeed(speed);
      });

      window.addEventListener("hashchange", async function (event) {
        console.log("url changed", event);
        await setPlaySpeed(speed);
      });

      btnShow.addEventListener("click", (e) => {
        acmeCard.style.display = "block";
        btnShow.style.display = "none";
      });

      restore.addEventListener("click", (e) => {
        acmeCard.style.display = "none";
        btnShow.style.display = "block";
      });

      btnSetSpeedx.addEventListener("click", (e) => {
        setPlaySpeed(speed);
      });
      // 鼠标指向标题栏时拖动 acmeCard
      acmeCardheader.addEventListener("mousedown", (e) => {
        let event = e || window.event;

        // 获取鼠标按下时的位置
        let pageX =
          event.pageX || event.clientX + document.documentElement.scrollLeft;
        let pageY =
          event.pageY || event.clientY + document.documentElement.scrollTop;

        // 计算鼠标按下时距例子的位置
        let spaceX = pageX - acmeCard.offsetLeft;
        let spaceY = pageY - acmeCard.offsetTop;

        // 实现拖动的函数
        function moveacmeCard(e) {
          let event = e || window.event;
          // 获取鼠标的位置
          let pageX =
            event.pageX || event.clientX + document.documentElement.scrollLeft;
          let pageY =
            event.pageY || event.clientY + document.documentElement.scrollTop;

          // 计算并设置盒子移动后的位置
          acmeCard.style.left = `${pageX - spaceX}px`;
          acmeCard.style.top = `${pageY - spaceY}px`;

          // 取消选中标题栏的文字
          if (window.getSelection) {
            window.getSelection().removeAllRanges();
          } else {
            document.selection.empty();
          }
        }

        // 移动例子
        document.addEventListener("mousemove", moveacmeCard);

        // 释放鼠标时停止移动
        document.addEventListener("mouseup", () => {
          document.removeEventListener("mousemove", moveacmeCard);
        });
      });
    })();

    const vd = "#J_CC_videoPlayerDiv > video ";
    let video = null;
    async function findVideoEl() {
      const el = await waitElementLoaded(vd);
      video = el;
      let timer;
      video.addEventListener("ended", async function (e) {
        console.log("播放已经结束");
        clearTimeout(timer);
        await waitTime(1);
        const xgReplay = document.querySelector(".xgplayer-replay");
        const styles = getComputedStyle(xgReplay);
        if (styles.display !== "none") {
          const query = new URLSearchParams(location.search);
          window.opener.postMessage({
            courseId: query.get("courseId"),
          });
        }
      });

      //   video.addEventListener("durationchange", async function (e) {
      //     console.log("播放时长改变");
      //     await waitTime(1);
      //     setPlaySpeed(speed);
      //   });

      video.addEventListener("pause", async function (e) {
        console.log("播放已暂停");

        timer = setTimeout(showPause, 1000);
      });
      setPlaySpeed(speed);
      video.play();
      video.muted = true;
      video.addEventListener("DOMNodeRemovedFromDocument", findVideoEl);
    }

    async function setPlaySpeed(speed = 4) {
      video.playbackRate = parseInt(speed);
      console.log("speed: ", video.playbackRate);
    }
    async function showPause() {
      try {
        let pauseBtn = await waitElementLoaded(".dialog-box  button", 2);
        if (pauseBtn) {
          console.log("触发离机检测，已恢复");
          pauseBtn.click();
        } else {
          video?.play();
        }
      } catch (e) {
        console.log("no dialog button.");
      }
    }
    findVideoEl();
    // setInterval(async function () {
    //   console.log("show pause dialog.");
    //   await showPause();
    // }, 1000 * 60);
  }
  async function courseList() {
    let lists = [];
    let btn;
    let courseNum;
    const insertBtn = () => {
      const btnHtml = `

        <button id="cus_btn" style="position:absolute;right:20px;bottom:20px;">收集课程<div id="course_num">?</div></button>
          `;
      document.body.insertAdjacentHTML("beforeend", btnHtml);
      btn = document.getElementById("cus_btn");
      courseNum = document.getElementById("course_num");
      btn.addEventListener("click", initLists);
    };
    async function initLists() {
      lists = Array.from(
        await waitElementLoaded("a[title=开始学习]", 50, 1, "querySelectorAll")
      );
      courseNum && (courseNum.innerText = lists.length);
    }
    insertBtn();
    initLists();

    window.addEventListener("message", (data) => {
      console.log("messgae", data);
      if (!data.data.courseId) {
        return;
      }
      const curIndex = lists.findIndex((item) => {
        console.log(item.getAttribute("courseid-id"), data.data.courseId);
        return item.getAttribute("courseid-id") === data.data.courseId;
      });
      if (curIndex === -1) {
        console.error("错误的courseId");
        return;
      }
      const nextCourse = lists[curIndex + 1];
      if (nextCourse) {
        nextCourse.click();
      } else {
        console.log("当前页课程已学完");
      }
    });
  }

  const path = location.pathname;
  if (path === "/circleIndexRedirect.do") {
    console.log("课程列表页启动");
    courseList();
  }
  if (path === "/viewerforccvideo.do") {
    console.log("课程详情页启动");
    courseDetail();
  }

  // Your code here...
})();
