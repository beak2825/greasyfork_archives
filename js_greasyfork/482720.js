// ==UserScript==
// @name code 外置编辑器
// @namespace http://tampermonkey.net/
// @version 2023-12-15
// @description 抓取textarea内容到编辑器内进行快速编辑!
// @author Steryn
// @match http://localhost:8099/messageTemplate/detail?*
// @icon https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @license MIT
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/482720/code%20%E5%A4%96%E7%BD%AE%E7%BC%96%E8%BE%91%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/482720/code%20%E5%A4%96%E7%BD%AE%E7%BC%96%E8%BE%91%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  // "use strict";
  // var scriptNode = document.createComment("script");
  // scriptNode.async = false;
  // scriptNode.defer = false;
  // scriptNode.type = "text/javascript";
  // scriptNode.src =
  //   "https://cdn.bootcdn.net/ajax/libs/monaco-editor/0.43.0/min/vs/loader.min.js";
  // document.body.appendChild(scriptNode);

  let bs = document.createElement("link");
  bs.rel = "stylesheet";
  bs.href =
    "https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.3.1/css/bootstrap.min.css";
  document.head.appendChild(bs);

  //#region 异步加载js文件
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      let script = document.createElement("script");
      script.src = src;

      script.onload = () => resolve(script);
      script.onerror = reject;

      document.head.appendChild(script);
    });
  }
  //#endregion

  //#region 开始操作
  var instance = null; // code editor 实例
  var onceFlag = false;
  var rawVal = "";
  var isFull = false;
  var rawSize = {
    w: 800,
    h: 800,
  };
  var isMinimize = true;

  loadScript(
    "https://cdn.bootcdn.net/ajax/libs/monaco-editor/0.43.0/min/vs/loader.min.js"
  ).then(() => {
    window.addEventListener("load", (event) => {
      require.config({
        paths: {
          vs: "https://cdn.bootcdn.net/ajax/libs/monaco-editor/0.43.0/min/vs/",
        },
      });
      window.MonacoEnvironment = {
        getWorkerUrl: function (workerId, label) {
          return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
              self.MonacoEnvironment = {
                baseUrl: 'https://cdn.bootcdn.net/ajax/libs/monaco-editor/0.43.0/min/'
              };
              importScripts('https://cdn.bootcdn.net/ajax/libs/monaco-editor/0.43.0/min/vs/base/worker/workerMain.min.js');`)}`;
        },
      };
      require(["vs/editor/editor.main"], function () {});

      generateCodeBox();
      render();
    });
  });
  //#endregion

  //#region 功能函数 创建画布盒子
  function generateCodeBox() {
    let outerWrapper = document.createElement("div");
    outerWrapper.id = "monaco-editor-outer-wrapper";
    outerWrapper.style.position = "fixed";

    // isMinimize = true  // default
    outerWrapper.style.width = "50px";
    outerWrapper.style.height = "50px";
    outerWrapper.style.borderRadius = "100%";
    outerWrapper.style.left = "0px";
    outerWrapper.style.bottom = "0px";
    outerWrapper.style.top = "auto";
    outerWrapper.style.resize = "none";
    outerWrapper.style.transition =
      "all 0.2s cubic-bezier(0.43, 0.43, 0.48, 1.19) 0s";

    outerWrapper.style.display = "flex";
    outerWrapper.style.flexDirection = "column";
    outerWrapper.style.zIndex = "1000";
    outerWrapper.style.overflow = "auto";
    outerWrapper.style.backgroundColor = "#569cd6";
    outerWrapper.style.borderRadius = "6px";
    outerWrapper.style.border = "4px solid #569cd6";
    outerWrapper.draggable = "true";

    outerWrapper.onclick = outerWrapperClick;

    function outerWrapperClick() {
      if (isMinimize) {
        const _outerChildren = Array.from(outerWrapper.children);
        _outerChildren.forEach((element) => {
          element.style.visibility = "visible";
        });
        outerWrapper.style.top = "auto";
        outerWrapper.style.left = "0";
        outerWrapper.style.bottom = "0";
        outerWrapper.style.width = `${rawSize.w}px`;
        outerWrapper.style.height = `${rawSize.h}px`;
        outerWrapper.style.borderRadius = "6px";
        outerWrapper.style.resize = "both";
        outerWrapper.onclick = null;
        setTimeout(() => {
          outerWrapper.style.transition = "";
        }, 300);
        isMinimize = false;
      }
    }

    // Buttons
    // 容器
    let btnWrapper = document.createElement("div");
    btnWrapper.id = "btn-wrapper";
    btnWrapper.style.display = "flex";
    btnWrapper.style.justifyContent = "space-between";
    btnWrapper.style.alignItems = "center";
    btnWrapper.style.padding = "6px";
    btnWrapper.style.visibility = "hidden";

    btnWrapper.ondblclick = function (e) {
      if (e.target != e.currentTarget) return;
      if (isFull) {
        outerWrapper.style.width = `${rawSize.w}px`;
        outerWrapper.style.height = `${rawSize.h}px`;
      } else {
        rawSize.w = outerWrapper.offsetWidth;
        rawSize.h = outerWrapper.offsetHeight;

        outerWrapper.offsetLeft;
        outerWrapper.style.left = "0";
        outerWrapper.style.top = "0";
        outerWrapper.style.width = "100vw";
        outerWrapper.style.height = "100vh";
      }
      isFull = !isFull;
    };

    // 添加拖动事件
    btnWrapper.onmousedown = function (e) {
      //兼容  e || window.event  现在都可以
      let event = e || window.event;
      // 获取鼠标按下去的那一个点距离边框顶部和左侧的距离
      let point_x = event.offsetX;
      let point_y = event.offsetY;
      //  鼠标移动(小方块在文档上移动，给文档注册一个是移动事件)
      document.onmousemove = function (ent) {
        let evt = ent || window.event;
        // 获取鼠标移动的坐标位置
        let ele_left = evt.clientX - point_x;
        let ele_top = evt.clientY - point_y;
        ele_left = Math.min(
          Math.max(0, ele_left),
          window.innerWidth - outerWrapper.offsetWidth
        );
        ele_top = Math.min(
          Math.max(0, ele_top),
          window.innerHeight - outerWrapper.offsetHeight
        );
        outerWrapper.style.left = ele_left + "px";
        outerWrapper.style.top = ele_top + "px";
      };

      // 抬起停止移动
      document.onmouseup = function (event) {
        // 移除移动和抬起事件
        this.onmouseup = null;
        this.onmousemove = null;
        //修复低版本的ie可能出现的bug
        if (typeof outerWrapper.releaseCapture != "undefined") {
          outerWrapper.releaseCapture();
        }
      };
      // 解决有些时候,在鼠标松开的时候,元素仍然可以拖动-使用的是第二种方式
      document.ondragstart = function (ev) {
        ev.preventDefault();
      };
      document.ondragend = function (ev) {
        ev.preventDefault();
      };
    };

    // 容器左侧
    let btnWrapperLeft = document.createElement("div");
    btnWrapperLeft.id = "btn-wrapper-left";
    btnWrapperLeft.style.display = "flex";
    btnWrapperLeft.style.gap = "6px";

    let minimizeBtn = document.createElement("button");
    minimizeBtn.id = "minimize-btn";
    minimizeBtn.innerHTML = "最小化";
    minimizeBtn.classList = ["btn btn-secondary btn-sm"];
    minimizeBtn.onclick = function (e) {
      e.stopPropagation();
      const _outerChildren = Array.from(outerWrapper.children);

      isMinimize = true;
      rawSize.w = outerWrapper.offsetWidth;
      rawSize.h = outerWrapper.offsetHeight;
      _outerChildren.forEach((element) => {
        element.style.visibility = "hidden";
      });
      outerWrapper.style.transition =
        "all 0.2s cubic-bezier(0.43, 0.43, 0.48, 1.19) 0s";
      outerWrapper.style.width = "50px";
      outerWrapper.style.height = "50px";
      outerWrapper.style.borderRadius = "100%";
      outerWrapper.style.left = "0px";
      outerWrapper.style.bottom = "0px";
      outerWrapper.style.top = "auto";
      outerWrapper.style.resize = "none";
      outerWrapper.onclick = outerWrapperClick;
    };

    let themeLight = document.createElement("button");
    themeLight.innerText = "主题-浅色";
    themeLight.classList = ["btn btn-light btn-sm"];
    themeLight.onclick = (e) => {
      e.stopPropagation();
      instance.updateOptions({
        theme: "vs",
      });
    };

    let themeDark = document.createElement("button");
    themeDark.innerText = "主题-深色";
    themeDark.classList = ["btn btn-dark btn-sm"];
    themeDark.onclick = (e) => {
      e.stopPropagation();
      instance.updateOptions({
        theme: "vs-dark",
      });
    };

    btnWrapperLeft.append(minimizeBtn);
    btnWrapperLeft.append(themeLight);
    btnWrapperLeft.append(themeDark);

    // 容器右侧
    let btnWrapperRight = document.createElement("div");
    btnWrapperRight.id = "btn-wrapper-right";
    btnWrapperRight.style.display = "flex";
    btnWrapperRight.style.gap = "6px";

    /** 格式化值 */
    let formatBtn = document.createElement("button");
    formatBtn.innerText = "格式化";
    formatBtn.classList = ["btn btn-success btn-sm"];
    formatBtn.onclick = (e) => {
      e.stopPropagation();
      instance.getAction("editor.action.formatDocument").run();
    };
    /** 清空值 */
    let emptyBtn = document.createElement("button");
    emptyBtn.innerText = "清空";
    emptyBtn.classList = ["btn btn-danger btn-sm"];
    emptyBtn.onclick = (e) => {
      e.stopPropagation();
      instance.getModel().setValue("");
    };
    /** 读取值 */
    let setValBtn = document.createElement("button");
    setValBtn.innerText = "读取";
    setValBtn.classList = ["btn btn-warning btn-sm"];
    setValBtn.onclick = (e) => {
      e.stopPropagation();
      var targetNode = document.querySelector(".html-content textarea");
      instance.getModel().setValue(targetNode?.value || "");
      instance.getAction("editor.action.formatDocument").run();
      if (!onceFlag) {
        rawVal = targetNode?.value;
      }
    };
    /** 写入值 */
    let getValBtn = document.createElement("button");
    getValBtn.innerText = "写入";
    getValBtn.classList = ["btn btn-info btn-sm"];
    getValBtn.onclick = (e) => {
      e.stopPropagation();
      var targetNode = document.querySelector(".html-content textarea");
      targetNode.value = instance.getModel().getValue();
    };
    /** 还原到初始值 */
    let restore = document.createElement("button");
    restore.innerText = "还原初始值";
    restore.classList = ["btn btn-danger btn-sm"];
    restore.onclick = (e) => {
      e.stopPropagation();
      instance.getModel().setValue(rawVal);
      instance.getAction("editor.action.formatDocument").run();
    };

    let editorWrapper = document.createElement("div");
    editorWrapper.id = "monaco-editor-wrapper";
    editorWrapper.style.position = "relative";
    editorWrapper.style.width = "100%";
    editorWrapper.style.display = "block";
    editorWrapper.style.flex = "1";
    editorWrapper.style.visibility = "hidden";

    btnWrapperRight.append(formatBtn);
    btnWrapperRight.append(emptyBtn);
    btnWrapperRight.append(setValBtn);
    btnWrapperRight.append(getValBtn);
    btnWrapperRight.append(restore);

    // 容器填入
    btnWrapper.append(btnWrapperLeft);
    btnWrapper.append(btnWrapperRight);
    outerWrapper.append(btnWrapper);
    outerWrapper.append(editorWrapper);
    document.body.appendChild(outerWrapper);
  }
  //#endregion

  //#region 功能函数 渲染
  function render() {
    function rotation() {
      setTimeout(() => {
        if (window.monaco) {
          console.log("🚀 🍀 window.monaco:", window.monaco);
          init();
        } else {
          rotation();
        }
      }, 500);
    }
    rotation();

    function init() {
      instance = window.monaco.editor.create(
        document.getElementById("monaco-editor-wrapper"),
        {
          value: "",
          language: "html",
          theme: "vs-dark",
          automaticLayout: true,
        }
      );
    }
  }
  //#endregion
})();
