  // ==UserScript==
  // @name         ErrorLogSentinel
  // @namespace    http://your-namespace.com
  // @version      1.9
  // @description
  // @run-at       document-start
  // @match        http://*/*
  // @match        https://*/*
  // @run-at       document-start
  // @license      MIT
  // @grant        GM_xmlhttpRequest
  // @require    https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @description 获取错误
// @downloadURL https://update.greasyfork.org/scripts/470816/ErrorLogSentinel.user.js
// @updateURL https://update.greasyfork.org/scripts/470816/ErrorLogSentinel.meta.js
  // ==/UserScript==
  (function () {
    "use strict";
    const domStyle = document.createElement("style");
    domStyle.type = "text/css";
    domStyle.rel = "stylesheet";
    function getUuid() {
      // 生成uuid
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      );
    }
    const style = `
            .data-key-pair,
            .data-type-label,
            .data-key,
            .data-object,
            .data-object-start,
            .data-object-body,
            .data-object-end,
            .data-function,
            .data-function-start,
            .data-function-body,
            .data-function-end,
            .MuiBox-root,
            .css-1q4kduy,
            .data-value-fallback {
                    color: #fff !important;
                    font-size:"14px"
                    font-family:"微软雅黑 !important"
            }
            @keyframes shake {
                0% {
                    transform: translateX(0);
                    border-color: red;
                }
                10%, 30%, 50%, 70%, 90% {
                    transform: translateX(0);
                    border-color: red;
                }
                20%, 40%, 60%, 80% {
                    transform: translateX(0);
                    border-color: red;
                }
                100% {
                    transform: translateX(0);
                    border-color: red;
                }
            }

            .element {
                animation: shake 1.5s infinite;
                border: 1px solid red;
            }
            #btnError{
                position: fixed !important;
                bottom: 0px !important;
                right: 0px !important;
                color:#fff;
                background-color: #007fff ;
                border-radius: 2px ;
                padding: 0.5rem  1.3rem ;
                cursor: pointer ;
                border:  5px solid transparent ;
          }
            #overlay{
                position: fixed;
                bottom: 0;
                right: 0;
                width: 45%;
                height: 45%;
                background-color: rgba(0, 0, 0, .9);
                z-index: 99;
                display: none;
                overflow: auto;
            }

            #btnClose{
                position: fixed;
                bottom: 40%;
                right: 3%;
                border.rid
                font-size: 30px;
                color: #fff;
                z-index: 999;
                cursor: pointer;
                display: none;
            }

            #empty{
                position: fixed;
                bottom: 40.5%;
                right: 6%;
                font-size: 16px;
                background-color: transparent ;
                border:none;
                color: #fff;
                z-index: 999;
                cursor: pointer;
                display: none;
            }
            #empty:hover{
               text-decoration: underline;
               color:#0085f2;
            }

            @keyframes blink {
                0% {
                    box-sizing: border-box;
                    border: red  5px solid ;
                }
                50% {
                    box-sizing: border-box;
                    border:  transparent  5px solid ;
                }
                100% {
                    box-sizing: border-box;
                    border:  red   5px solid;
                }
            }
            .btn_error {
                padding: 10px 20px;
                font-size: 16px;
                animation: blink 1s infinite;
            }
`;

    domStyle.appendChild(document.createTextNode(style));
    document.head.appendChild(domStyle);
    const script = document.createElement("script"); //JSON_VIEW
    script.src = "https://cdn.jsdelivr.net/npm/@textea/json-viewer@3";
    document.head.appendChild(script);
    const errorMap = [];
    let copyErrorMap = [];
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function () {
      // xml
      const xhr = new originalXHR();

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          // 请求完成时获取状态码
          const statusCode = xhr?.status;
          const url = xhr?.responseURL;
          if (statusCode != 200) {
            const text = {
              message: `状态码: ${statusCode}`,
              url: `url: ${url}`,
            };
            console.dir(xhr);
            const json = {
              url: url,
              status: statusCode,
              responseText: xhr?.responseText,
              timeout: xhr?.timeout,
            };
            errorMap.push({
              msg: text,
              type: "HTTP",
              jsonView: JSON.stringify(json),
            });
            renderErrors();
          }
        }
      };

      return xhr;
    };
    window.onerror = function (message, filename, lineno, colno, error) {
      //全局错误、
      const text = {
        message: `错误信息: ${message}`,
        url: `出错文件: ${filename}`,
        row: `出错位置: 行号: ${lineno};列号: ${colno}`,
        error: `错误详情: ${error}`,
      };
     if(error){
         errorMap.push({
        msg: text,
        type: "other",
        jsonView: JSON.stringify({ message, filename, lineno, colno, error }),
      });
      renderErrors();
     }
    };
    window.addEventListener("unhandledrejection", function (e) {
      const text = {
        message: `错误信息: ${e.reason.message}`,
        stack: `错误详情: ${e.reason.stack}`,
      };
      errorMap.push({
        msg: text,
        type: "other",
        jsonView: JSON.stringify({
          message: e.reason.message,
          stack: e.reason.stack,
        }),
      });
      renderErrors();
      return true;
    });
    window.addEventListener(
      //全局错误
      "error",
      (event) => {
        if (event.srcElement.nodeName) {
          const text = {
            message: `错误信息: HTML标签加载出错了`,
            html: `标签: ${event.target.outerHTML}`,
          };
          const errorJson = {
            type: event?.type,
            baseURI: event?.baseURI,
            timeStamp: event?.timeStamp,
            nodeName: event?.nodeName,
          };
          errorMap.push({
            msg: text,
            type: "other",
            jsonView: JSON.stringify(errorJson),
          });
        } else {

          const text = {
            message: `错误信息: ${event?.message}`,
            url: `出错文件: ${event?.filename}`,
            row: `出错位置: 行号: ${event?.lineno};列号: ${event?.colno}`,
            error: `错误详情: ${event?.error}`,
          };
          errorMap.push({
            msg: text,
            type: "other",
            jsonView: JSON.stringify({
              message: event?.message,
              filename: event?.filename,
              lineno: event?.lineno,
              colno: event?.colno,
              error: event?.error,
            }),
          });
        }

        renderErrors();
      },
      true
    );
    const originalFetch = window.fetch; //fetch请求
    window.fetch = function (url, options) {
      return originalFetch
        .apply(this, arguments)
        .then(function (response) {
          if (response.status != 200) {
            const text = {
              message: `状态码: ${response.status}`,
              url: `url: ${url}`,
              options: `请求参数: ${options}`,
            };
            const errorJson = {
              url: response?.url,
              status: response?.status,
              type: response?.type,
            };
            errorMap.push({
              msg: text,
              type: "HTTP",
              jsonView: JSON.stringify(errorJson),
            });
            renderErrors();
          }
          return response;
        })
        .catch(function (error) {
          console.log("请求错误:", error);
          throw error;
        });
    };
    function renderErrors() {
      //错误更新
      const overlay = document.getElementById("overlay");
      if (overlay && overlay.style.display === "block") {
        updateErrorContent();
      }
      if (errorMap.length) {
        const btnError = document.getElementById("btnError");
        btnError?.classList.add("btn_error");
      }
      if(_){
        let clone = _.cloneDeep([...errorMap,...copyErrorMap]);
        copyErrorMap = _.uniqWith(clone,_.isEqual)
      }
    }
    function updateErrorContent() {
      //更新蒙层
      const overlay = document.getElementById("overlay");
      if (overlay) overlay.innerHTML = "";
      const errorList = _.uniqWith(errorMap,_.isEqual)
      const errorContainer = document.createElement("div");
      errorContainer.id = "div";
      errorContainer.style.color = "#fff";
      errorContainer.style.width = "80%";
      errorContainer.style.margin = "auto";
      errorMap.forEach((item) => {
        const title = document.createElement("h3");
        title.style.color = "#fff";
        const type = item.type;
        title.innerHTML = getErrorTitle(type);
        errorContainer.appendChild(title);
        const errorUL = document.createElement("ul");
        const json = document.createElement("div");
        json.id = "jsonview";
        json.style.width = "100%";
        json.style.height = "100%";
        errorContainer.appendChild(json);
        for (const subItem in item.msg) {
          const errorItem = document.createElement("li");
          //const result = item[type][subItem].replace(/\n/g, "");
          errorItem.innerText = item.msg[subItem];
          errorItem.style.listStyleType = "disc";
          errorItem.style.width = "80%";
          errorItem.style.wordBreak = "break-all";
          errorUL.appendChild(errorItem);
        }
        new JsonViewer({
          value: { ...JSON.parse(item.jsonView) },
          displayDataTypes: false,
          copyable: false,
        }).render(json);
        const hr = document.createElement("hr");
        errorUL.appendChild(hr);
        errorContainer.appendChild(errorUL);
        overlay.classList.add("element");
        addAnimationClass();
      });

      overlay.appendChild(errorContainer);
    }
    function addAnimationClass() {
      //抖动动画
      const overlay = document.getElementById("overlay");
      setTimeout(() => {
        overlay.classList.remove("element");
      }, 800);
      setTimeout(() => {
        //  渲染后 滚动条拉到最低处
        overlay.scrollTop = overlay.scrollHeight - overlay.offsetHeight;
      }, 1000);
    }
    function getErrorTitle(type) {
      switch (type) {
        case "catch":
          return "catch";
        case "network":
          return "资源请求错误";
        case "Promise":
          return "未处理的 Promise 异常";
        case "HTTP":
          return "HTTP请求错误";
        default:
          return "全局错误";
      }
    }
    document.addEventListener("DOMContentLoaded", () => {
      // 创建按钮
      const button = document.createElement("button");
      button.id = "btnError";
      button.innerText = "检查错误";
      document.body.appendChild(button);

      // 创建蒙层
      const overlay = document.createElement("div");
      overlay.id = "overlay";
      document.body.appendChild(overlay);

      // 创建蒙层关闭按钮
      const close = document.createElement("span");
      close.id = "btnClose";
      close.innerHTML = "X";
      document.body.appendChild(close);
      //清空
      const empty = document.createElement("button");
            empty.id = "empty";
            empty.innerHTML = "清空内容";
      document.body.appendChild(empty);
      button.addEventListener("click", () => {
        overlay.innerHTML = "";
        close.style.display = "block";
        overlay.style.display = "block";
        empty.style.display = "block"
        updateErrorContent();
      });
      empty.addEventListener("click",()=>{
         errorMap.length = 0;
          renderErrors()
      })
      close.addEventListener("click", () => {
         empty.style.display = "none"
        overlay.style.display = "none";
        close.style.display = "none";
        overlay.innerHTML = "";
        if(_){
          let clone = _.cloneDeep([...errorMap,...copyErrorMap]);
          copyErrorMap = _.uniqWith(clone,_.isEqual)
        }
        button.classList.remove("btn_error");
      });
    });
  })();