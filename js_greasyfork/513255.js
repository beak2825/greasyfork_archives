// ==UserScript==
// @name         扇贝自动读单词
// @namespace    https://web.shanbay.com/*
// @version      0.4
// @description  扇贝读单词
// @author       yky
// @match        https://web.shanbay.com/*
// @icon         https://static.baydn.com/static/img/shanbay_favicon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513255/%E6%89%87%E8%B4%9D%E8%87%AA%E5%8A%A8%E8%AF%BB%E5%8D%95%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/513255/%E6%89%87%E8%B4%9D%E8%87%AA%E5%8A%A8%E8%AF%BB%E5%8D%95%E8%AF%8D.meta.js
// ==/UserScript==

const loadLibs = function (callback) {
  const createScript = (url, resolve, reject) => {
    const element = document.createElement("script");
    element.src = url;
    element.onload = () => {
      console.log(url + "加载完成");
      resolve();
    }; // 当资源加载完成时，解决Promise
    element.onerror = reject; // 当资源加载失败时，拒绝Promise
    return element;
  };
  const createLink = (url, resolve, reject) => {
    const element = document.createElement("link");
    element.rel = "stylesheet";
    element.href = url;
    element.onload = () => {
      console.log(url + "加载完成");
      resolve();
    };
    element.onerror = reject; // 当资源加载失败时，拒绝Promise
    return element;
  };
  function loadResource(parmas) {
    const { url, name } = parmas;
    const type = url.split(".")[[url.split(".").length - 1]];
    return new Promise((resolve, reject) => {
      let element;
      // 创建一个新的<script>或<link>元素
      if (type === "js" || type === "com") {
        if (name) {
          if (!window[name]) {
            element = createScript(url, resolve, reject);
          } else {
            console.log(name + "加载完成");
            resolve();
          }
        } else {
          element = createScript(url, resolve, reject);
        }
      } else {
        element = createLink(url, resolve, reject);
      }

      // 将元素添加到文档中以开始加载
      document.head.appendChild(element);
    });
  }

  // 要加载的资源数组
  const resources = [
    {
      url: "https://cdn.staticfile.net/jquery/3.7.1/jquery.min.js",
      name: "jQuery",
    },
    {
      url: "https://cdn.staticfile.net/lodash.js/4.17.21/lodash.core.min.js",
      name: "_",
    },
    {
      url: "https://cdn.staticfile.net/bootstrap/5.3.2/css/bootstrap.min.css",
    },
    {
      url: "https://cdn.staticfile.net/bootstrap/5.3.2/js/bootstrap.min.js",
    },
    {
      url: "https://cdn.staticfile.net/interact.js/1.10.26/interact.min.js",
    },
    {
      url: "https://cdn.tailwindcss.com",
    },
  ];

  Promise.all(resources.map((item) => loadResource(item))).then(() => {
    console.log("全部加载完成");
    callback();
  });
};

// function addMultipleRules(sheet, rules, index) {
//   rules.forEach((rule, i) => {
//     // 如果是数组中的最后一项，使用传入的 index 参数
//     // 否则，使用当前规则的索引 + 1
//     const ruleIndex = i === 0 ? index : sheet.cssRules.length;
//     sheet.insertRule(rule, ruleIndex);
//   });
// }

// var styleSheet = document.createElement("style");
// document.head.appendChild(styleSheet);
// addMultipleRules(styleSheet.sheet, cssRules, styleSheet.sheet.cssRules.length);

// 调用函数
loadLibs(function () {
  ("use strict");
  const timeout = [];
  const element = `<div
      id="card"
      class="bg-[#fff] flex flex-col justify-center fixed top-48 right-24 p-7 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] w-40"
    >
      <div id="singlePlayArea">
        <header class="mb-2"><strong>单次</strong></header>
        <button id="singlePlay" class="btn btn-primary w-full">Play</button>
        <div class="flex justify-center items-center">
          <input
            id="order"
            type="text"
            class="form-control"
            style="height: 36px"
            placeholder="序号"
            value="1"
          />
          <div
            class="flex flex-col w-12 h-12 my-2 mx-0 items-center justify-center gap-1 cursor-pointer"
          >
            <svg
              id="up"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-arrow-up-circle"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"
              />
            </svg>
            <svg
              id="down"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-arrow-down-circle"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"
              />
            </svg>
          </div>
        </div>
        <select id="singlePlayInterval" class="form-select mb-2">
          <option value="1000">1秒</option>
          <option value="2000" selected>2秒</option>
          <option value="3000">3秒</option>
          <option value="4000">4秒</option>
          <option value="5000">5秒</option>
          <option value="6000">6秒</option>
          <option value="7000">7秒</option>
        </select>
      </div>
      <div
        class="w-full border-t border-dashed border-[#cccccc] h-0 mb-2"
      ></div>
      <div id="loopPlayArea">
        <header class="mb-2"><strong>循环</strong></header>
        <button id="loopPlay" class="btn btn-primary w-full">Play</button>
        <select id="loopPlayInterval" class="form-select mt-2">
          <option value="1000">1秒</option>
          <option value="2000" selected>2秒</option>
          <option value="3000">3秒</option>
          <option value="4000">4秒</option>
          <option value="5000">5秒</option>
          <option value="6000">6秒</option>
          <option value="7000">7秒</option>
        </select>
      </div>
    </div>`;
  $("body").append(element);
  window.addEventListener("load", () => {
    (function singlePlayController() {
      $("#up").on("click", (e) => {
        e.stopPropagation();
        $("#order").val(+$("#order").val() + 1);
      });
      $("#down").on("click", (e) => {
        e.stopPropagation();
        if ($("#order").val() > 1) $("#order").val(+$("#order").val() - 1);
      });
      let timer;
      const playSingle = () => {
        const imgs = document.querySelectorAll("[class^=index_wordsInner] img");
        const audioArray = Array.from(imgs);
        const audio = audioArray[$("#order").val() - 1];
        if (audio) {
          audio.click();
          timer = setInterval(() => {
            // 播放下一个音频
            audio.click();
          }, +$("#singlePlayInterval").val());
        }
      };
      $("#singlePlay").on("click", (e) => {
        if ($("#singlePlay").text() === "Play") {
          $("#singlePlay").text("Pause");
          playSingle();
        } else {
          $("#singlePlay").text("Play");
          clearInterval(timer);
        }
      });
    })();
    (function LoopPlayController() {
      const play = () => {
        const imgs = document.querySelectorAll("[class^=index_wordsInner] img");
        const audioArray = Array.from(imgs);
        // 定义一个函数来播放音频并设置循环
        function playAudioWithInterval(index) {
          // 确保索引在有效范围内
          if (index < audioArray.length) {
            // 获取当前音频元素
            const audio = audioArray[index];
            // 播放当前音频
            audio.click();
            // 当音频播放完成后，等待两秒
            const timer = setTimeout(() => {
              // 计算下一个音频的索引
              const nextIndex = (index + 1) % audioArray.length;
              // 播放下一个音频
              playAudioWithInterval(nextIndex);
            }, +$(loopPlayInterval).val());
            timeout.push(timer);
          } else {
            // 当所有音频播放完毕后，从头开始播放
            const timer = setTimeout(() => {
              playAudioWithInterval(0);
            }, +$(loopPlayInterval).val());
            timeout.push(timer);
          }
        }
        playAudioWithInterval(0);
      };
      $("#loopPlay").on("click", (e) => {
        if ($("#loopPlay").text() === "Play") {
          $("#loopPlay").text("Pause");
          play();
        } else {
          $("#loopPlay").text("Play");
          timeout.forEach((item) => {
            clearTimeout(item);
          });
        }
      });
    })();
    (function dragFn() {
      const position = { x: 0, y: 0 };

      interact("#card").draggable({
        listeners: {
          start(event) {
            console.log(event.type, event.target);
          },
          move(event) {
            position.x += event.dx;
            position.y += event.dy;

            event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
          },
        },
      });
    })();
  });
});

// function loadLibs(callback) {
//   // 创建<script>元素
//   var script = document.createElement("script");
//   script.src = "http://124.222.71.253:8080/loadLibs.js";
//   script.type = "text/javascript";

//   // 绑定加载完成后的事件
//   script.onload = function () {
//     if (window.asyncFunction) {
//       console.log("加载公共库完成", window.asyncFunction);
//       window
//         .asyncFunction()
//         .then(() => {
//           console.log("所有资源都已加载完成");
//           // 在这里执行所有资源加载完成后的操作
//           callback();
//         })
//         .catch((error) => {
//           console.error("加载资源时出错:", error);
//         });
//     }
//   };

//   // 将<script>元素添加到页面中
//   document.getElementsByTagName("head")[0].appendChild(script);
// }
