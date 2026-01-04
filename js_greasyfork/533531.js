// ==UserScript==
// @name         B站粉丝、关注列表备注名功能
// @namespace    http://nsfjgf.cn/
// @version      0.2
// @description  用于给B站好友添加备注名，可导入导出
// @author       nsfjgf
// @run-at       document-end
// @grant        none
// @match        https://space.bilibili.com/*
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/533531/B%E7%AB%99%E7%B2%89%E4%B8%9D%E3%80%81%E5%85%B3%E6%B3%A8%E5%88%97%E8%A1%A8%E5%A4%87%E6%B3%A8%E5%90%8D%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/533531/B%E7%AB%99%E7%B2%89%E4%B8%9D%E3%80%81%E5%85%B3%E6%B3%A8%E5%88%97%E8%A1%A8%E5%A4%87%E6%B3%A8%E5%90%8D%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let name_arr = [];
  if (localStorage.getItem("name_arr")) {
    name_arr = JSON.parse(localStorage.getItem("name_arr"));
  }

  function createBtn(params) {
    let fix_dom = document.createElement("div");
    fix_dom.classList.add("my__fix");
    fix_dom.innerHTML =
      '<div class="export">导出</div><div class="import"><input id="my_export" type="file" accept=".json"><label for="my_export">导入</label></div>';
    document.body.appendChild(fix_dom);

    const dragBox = document.querySelector(".my__fix");

    let isDragging = false;
    let offsetY = 0;

    dragBox.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetY = e.clientY - dragBox.offsetTop;
      dragBox.style.transition = "none"; // 取消过渡动画以避免延迟
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        dragBox.style.top = e.clientY - offsetY + "px";
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
  }

  createBtn();

  const exportFileJSON = (data = {}, filename = "dataJSON.json") => {
    if (typeof data === "object") {
      data = JSON.stringify(data, null, 4);
    }
    // 导出数据
    const blob = new Blob([data], { type: "text/json" }),
      e = new MouseEvent("click"),
      a = document.createElement("a");

    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
    a.dispatchEvent(e);
  };

  function addExportListener() {
    $(".export").addEventListener("click", () => {
      exportFileJSON(name_arr, "name_arr.json");
    });
  }

  addExportListener();

  const importFileJSON = (ev) => {
    return new Promise((resolve, reject) => {
      const fileDom = ev.target,
        file = fileDom.files[0];

      // 格式判断
      if (file.type !== "application/json") {
        reject("仅允许上传json文件");
      }
      // 检验是否支持FileRender
      if (typeof FileReader === "undefined") {
        reject("当前浏览器不支持FileReader");
      }

      // 执行后清空input的值，防止下次选择同一个文件不会触发onchange事件
      ev.target.value = "";

      // 执行读取json数据操作
      const reader = new FileReader();
      reader.readAsText(file); // 读取的结果还有其他读取方式，我认为text最为方便

      reader.onerror = (err) => {
        reject("json文件解析失败", err);
      };

      reader.onload = () => {
        const resultData = reader.result;
        if (resultData) {
          try {
            const importData = JSON.parse(resultData);
            resolve(importData);
          } catch (error) {
            reject("读取数据解析失败", error);
          }
        } else {
          reject("读取数据解析失败", error);
        }
      };
    });
  };

  function mergeName_arr(data) {
    data.forEach((item) => {
      if (name_arr.find((item2) => item2.id === item.id)) return;
      name_arr.push(item);
    });

    localStorage.setItem("name_arr", JSON.stringify(name_arr));
    alert("导入合并成功，刷新后生效");
  }

  function addImportListenr() {
    $("my_export").addEventListener("change", (event) => {
      // exportFileJSON(name_arr, "name_arr.json");
      importFileJSON(event)
        .then((res) => {
          // 回显数据
          // showImportData(res);
          mergeName_arr(res);
        })
        .catch((err) => {
          alert(err);
        });
    });
  }

  addImportListenr();

  function addDynamicStyles() {
    // 检查是否已经添加过，避免重复添加

    const style = document.createElement("style");
    style.id = "dynamic-input-styles";

    style.textContent = `
        /* 基础输入框样式 */
        .edit_input {
         color: #999999;
         font-size:14px;
         line-height:20px;
         outline:none;
         text-indent:4px;
  
        }
  
        /* 焦点状态 */
        .edit_input:focus {
          border-color: #2196F3;
          border-radius:4px;
          box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
        }

        .my__fix {
            position: fixed;
            top: 50%;
            left: 0;
            background: #fff;
            border: 1px solid #ccc;
            cursor: pointer;
            padding: 6px;
            z-index:99999999;
        }
        .my__fix:hover {
            background: #f5f5f5;
        }

        .my__fix .import{
            margin-top:2px;
        }

        #my_export{
            width: 0;
            height: 0;
        }
  
  
      `;

    document.head.appendChild(style);
  }

  addDynamicStyles();

  function $(select) {
    if (select.includes(".")) return document.querySelector(select);
    return document.getElementById(select);
  }

  function updateUserName(id, name) {
    let index = name_arr.findIndex((item) => item.id === id);
    name = name.replace(/[\r\n]/g, "");

    if (name != "") {
      if (index !== -1) {
        name_arr[index].name = name;
      } else {
        name_arr.push({ id, name });
      }
    } else {
      name_arr.splice(index, 1);
    }

    localStorage.setItem("name_arr", JSON.stringify(name_arr));
  }

  // 创建一个新的 <div> 元素

  function init() {
    let listBox = document.querySelector(".relation-content");
    // if (listBox.querySelector(".edit_input")) return;

    let userList = listBox.querySelectorAll(".item");
    // window.hasCall = true;
    for (let i = 0; i < userList.length; i++) {
      let userid = userList[i]
        .querySelector("[data-user-profile-id]")
        .getAttribute("data-user-profile-id");
      let nameDomParent = userList[i].querySelector(".relation-card-info");
      if (userList[i].querySelector(".edit_input")) continue;
      // 名字的父级dom
      let nameDom = userList[i].querySelector(".relation-card-info__uname");
      const wrapper = document.createElement('div');
      wrapper.style.display = 'flex';
      // align-items center 让输入框和名字垂直居中
      wrapper.style.alignItems = 'flex-start';
      wrapper.appendChild(nameDom);
      // 是加到第一个位置
      nameDomParent.insertBefore(wrapper, nameDomParent.firstChild);
      // 名字的dom 变成了一个a标签了 2025-11-16
      nameDom.style.webkitLineClamp = 3;
      let div = document.createElement("div");
      div.setAttribute("contenteditable", "plaintext-only");
      div.innerText = name_arr.find((item) => item.id === userid)
        ? name_arr.find((item) => item.id === userid).name
        : "备注名";
      div.classList.add("edit_input");
      div.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
      });

      div.addEventListener("focusout", (e) => {
        let name = e.target.innerText;
        updateUserName(userid, name);
      });
      wrapper.appendChild(div);
    }
  }

  function callInit() {
    let listBox = document.querySelector(".relation-content");
    if (!!listBox) {
      let userList = listBox.querySelectorAll(".item");
      if (userList.length > 0) {
        initAndClick();
        return;
      } else {
        setTimeout(() => {
          callInit();
        }, 200);
      }
    } else {
      setTimeout(() => {
        callInit();
      }, 200);
    }
  }

  callInit(); //这样子调用没用

  function throttle(fn, delay) {
    let timer = null;
    return function () {
      if (timer) {
        return;
      }
      timer = setTimeout(() => {
        fn.apply(this);
        timer = null;
      }, delay);
    };
  }

  let initThrottle = throttle(init, 200);

  const observer1 = new MutationObserver((mutationsList, obs) => {
    for (let mutation of mutationsList) {
      // console.log("这里执行吧0000", mutation);
      if (mutation.type === "childList" && mutation.removedNodes.length > 0) {
        initThrottle();
      } else if (mutation.type === "attributes") {
        console.log(
          "The " + mutation.attributeName + " attribute was modified."
        );
      }
    }
  });

  // 保存原生方法
  const nativePushState = history.pushState;
  const nativeReplaceState = history.replaceState;

  // 重写 pushState
  history.pushState = function (state, title, url) {
    nativePushState.apply(this, arguments);
    dispatchUrlChangeEvent(url); // 触发自定义事件
  };

  // 重写 replaceState
  history.replaceState = function (state, title, url) {
    nativeReplaceState.apply(this, arguments);
    dispatchUrlChangeEvent(url);
  };

  // 创建自定义事件
  function dispatchUrlChangeEvent(url) {
    const event = new CustomEvent("urlchange", {
      detail: { url },
    });
    window.dispatchEvent(event);
  }

  let self_url = "";

  function addALLfansClick() {
    // 全部关注的最近关注和最近访问
    let listBox = document.querySelector(".relation-content");
    let xxxDom = listBox.querySelector(".radio-filter");
    if (xxxDom == null) return;
    xxxDom.addEventListener("click", () => {
      init();
    });
  }

  function initAndClick() {
    init();
    addALLfansClick();
    const targetNode1 = document.querySelector(".relation-content");
    observer1.observe(targetNode1, { childList: true, subtree: true });
    // 监听自定义事件
    window.addEventListener("urlchange", (e) => {
      if (self_url !== e.detail.url) {
        setTimeout(() => {
          if (self_url !== "") {
            observer1.disconnect();
          }
          const targetNode = document.querySelector(".relation-content");
          observer1.observe(targetNode, { childList: true, subtree: true });

          addALLfansClick();
        }, 200);
      }
      self_url = e.detail.url;
    });



  }

})();
