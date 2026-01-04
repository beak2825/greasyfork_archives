// ==UserScript==
// @name         视频号创建计划
// @namespace    http://tampermonkey.net/
// @version      2025-06-03
// @description  你懂的
// @author       qjj
// @match        *://ad.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538161/%E8%A7%86%E9%A2%91%E5%8F%B7%E5%88%9B%E5%BB%BA%E8%AE%A1%E5%88%92.user.js
// @updateURL https://update.greasyfork.org/scripts/538161/%E8%A7%86%E9%A2%91%E5%8F%B7%E5%88%9B%E5%BB%BA%E8%AE%A1%E5%88%92.meta.js
// ==/UserScript==

(function () {
  "use strict";
//sleep函数
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
//当前日期 格式化毫秒
function getTime() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var millisecond = date.getMilliseconds();
  return year + "-" + month + "-" + day + " " + hour + ":" + minute;
}
//var date = new Date();
async function run() {
// 判断区域是否选择
const region = document.querySelector('button[data-value="regions"]');
    if (!region.classList.contains("active")) {
  region.click();
  await sleep(500);
}
    set_name();
  const l = document.querySelectorAll(
    ".select-list-inner.clearfix .scope:first-child .list-with-select li"
  );

  for (let index = 0; index < l.length; index++) {
    if (!l[index].title.match(/新疆|西藏|香港|澳门|台湾/g)) {
      console.log(
        l[index].title +
          "------" +
          l[index].title.match(/新疆|西藏|香港|澳门|台湾|/g)
      );

        l[index]
          .querySelector(
            ".autocomplete-and-table-select .scope:nth-child(1)  span.spaui-checkbox-indicator"
          )
          .click();
      await sleep(200);
    }
    // console.log(l[index].title)
  }
}

function set_name() {
    // 判断是否选择了时间

    const time = document.querySelector(
      ".meta-expand.meta-tabs-body.meta-tabs-body.has-active.align-content"
    );
    // const timel = document.querySelector('.meta-expand.meta-tabs-body.meta-tabs-body.has-active.align-content')

  const ele = document.querySelector(
    'input[placeholder="广告名称仅用于管理广告，不会对外展示"]'
  );

  const name = document.querySelector(".in").textContent;

  const t = document.querySelectorAll(
    ".spaui-button.spaui-button-primary.active"
  );
  let timel = "";
  for (let index = 0; index < t.length; index++) {
    if (t[index].textContent.indexOf("小时") != -1) {
      console.log(t[index]);
      timel = t[index].textContent.replace(" ", "");
    }
  }

    let n = name + "_";
    if (time) {
      n += `_${time.textContent.replace(" ", "_")}`;
    }
    if (timel) {
      n += `_${timel}`;
}
// if (time) {
//     ele.value = `${time.textContent.replace(" ")}_${name}`;
//     alert('请选择时间')
//     return
// }else{
//     ele.value = `{{创建日期}}_{{创建时间}}_${name}`;
// }
    ele.value = n;
  // 创建一个事件
  const evt = new Event("input");
  // 对其进行事件触发
  ele.dispatchEvent(evt);
  // 获取元素的所有键名，并通过find函数进行查找
  // find函数会根据传入的函数进行判断，返回正确的值，
  // 而我们的函数是判断前缀是否是__reactEventHandlers
  const prop = Object.keys(ele).find((p) =>
    p.startsWith("__reactEventHandlers")
  );
  // 获取到对应键名的对象，得到该对象的onchange函数，并且传入event
  ele[prop].onChange(evt);
}

// 创建浮动按钮
  const button = document.createElement("button");
  button.style.position = "fixed";
  button.style.bottom = "10px";
  button.style.left = "10px";
  button.style.zIndex = "9999";
  button.style.backgroundColor = "blue";
  button.style.color = "white";
  button.style.padding = "10px 20px";
  button.style.borderRadius = "20px";
  button.style.cursor = "pointer";
  button.textContent = "执行操作";
  // 记录按钮对象，后续可用
  document.body.appendChild(button);

  // 包装run函数，控制按钮状态
  button.onclick = async function () {
    button.disabled = true;
    button.style.backgroundColor = "#aaa";
    button.style.cursor = "not-allowed";
    button.textContent = "执行中...";
    try {
      await run();
      // alert("全部完成！");
    } finally {
      button.disabled = false;
      button.style.backgroundColor = "blue";
      button.style.cursor = "pointer";
      button.textContent = "执行操作";
    }
  };

  // 创建配置按钮
  const configButton = document.createElement("button");
  configButton.style.position = "fixed";
  configButton.style.bottom = "10px";
  configButton.style.left = "120px";
  configButton.style.zIndex = "9999";
  configButton.style.backgroundColor = "#888";
  configButton.style.color = "white";
  configButton.style.padding = "10px 20px";
  configButton.style.borderRadius = "20px";
  configButton.style.cursor = "pointer";
  configButton.textContent = "配置";
  document.body.appendChild(configButton);

  // 创建抽屉和遮罩
  const drawerMask = document.createElement("div");
  drawerMask.style.position = "fixed";
  drawerMask.style.top = "0";
  drawerMask.style.left = "0";
  drawerMask.style.width = "100vw";
  drawerMask.style.height = "100vh";
  drawerMask.style.background = "rgba(0,0,0,0.3)";
  drawerMask.style.zIndex = "10000";
  drawerMask.style.display = "none";
  document.body.appendChild(drawerMask);

  const drawer = document.createElement("div");
  drawer.style.position = "fixed";
  drawer.style.top = "0";
  drawer.style.right = "0";
  drawer.style.width = "400px";
  drawer.style.height = "100vh";
  drawer.style.background = "#fff";
  drawer.style.boxShadow = "-2px 0 8px rgba(0,0,0,0.2)";
  drawer.style.zIndex = "10001";
  drawer.style.padding = "24px";
  drawer.style.display = "none";
  drawer.innerHTML = `
  <h2>自定义配置</h2>
  <div id="config-list"></div>
  <button id="add-config" style="margin-top:10px;">新增配置</button>
  <br>
  <button id="save-config" style="margin-top:10px;">保存配置</button>
  <button id="close-drawer" style="margin-top:10px;margin-left:10px;">关闭</button>
`;
  document.body.appendChild(drawer);

  // 渲染配置列表
  function renderConfigList(configArr) {
    const listDiv = document.getElementById("config-list");
    listDiv.innerHTML = "";
    configArr.forEach((val, idx) => {
      const textarea = document.createElement("textarea");
      textarea.style.width = "100%";
      textarea.style.height = "80px";
      textarea.style.marginBottom = "8px";
      textarea.style.border = "1px solid #ccc"; // 浅灰色边框
      textarea.value = val;
      textarea.setAttribute("data-idx", idx);
      listDiv.appendChild(textarea);
    });

    // 限制最多5个配置
    const addBtn = document.getElementById("add-config");
    if (configArr.length >= 5) {
      addBtn.disabled = true;
      addBtn.style.backgroundColor = "#eee";
      addBtn.style.color = "#aaa";
      addBtn.style.cursor = "not-allowed";
      addBtn.title = "最多只能添加5个配置";
    } else {
      addBtn.disabled = false;
      addBtn.style.backgroundColor = "#f5f5f5";
      addBtn.style.color = "#333";
      addBtn.style.cursor = "pointer";
      addBtn.title = "";
    }
  }

  // 配置按钮事件
  configButton.onclick = function () {
    drawerMask.style.display = "block";
    drawer.style.display = "block";
    // 读取本地配置
    let configArr = [];
    try {
      configArr = JSON.parse(localStorage.getItem("my_custom_config_arr")) || [
        "",
      ];
    } catch {
      configArr = [""];
    }
    renderConfigList(configArr);
  };

  // 新增配置
  document.getElementById("add-config").onclick = function () {
    const listDiv = document.getElementById("config-list");
    if (listDiv.children.length >= 5) return; // 限制最多5个
    const textarea = document.createElement("textarea");
    textarea.style.width = "100%";
    textarea.style.height = "80px";
    textarea.style.marginBottom = "8px";
    textarea.style.border = "1px solid #ccc"; // 浅灰色边框
    textarea.value = "";
    textarea.setAttribute("data-idx", listDiv.children.length);
    listDiv.appendChild(textarea);
    // 重新判断按钮状态
    if (listDiv.children.length >= 5) {
      const addBtn = document.getElementById("add-config");
      addBtn.disabled = true;
      addBtn.style.backgroundColor = "#eee";
      addBtn.style.color = "#aaa";
      addBtn.style.cursor = "not-allowed";
      addBtn.title = "最多只能添加5个配置";
    }
  };

  // 保存配置
  document.getElementById("save-config").onclick = function () {
    const listDiv = document.getElementById("config-list");
    const configs = [];
    for (let i = 0; i < listDiv.children.length; i++) {
      const val = listDiv.children[i].value.trim();
      if (val) configs.push(val);
    }
    localStorage.setItem("my_custom_config_arr", JSON.stringify(configs));
    console.log("保存的配置内容：", configs);
    alert("配置已保存！");
  };

  // 关闭抽屉
  document.getElementById("close-drawer").onclick = function () {
    drawerMask.style.display = "none";
    drawer.style.display = "none";
  };
  // 点击遮罩关闭
  drawerMask.onclick = function () {
    drawerMask.style.display = "none";
    drawer.style.display = "none";
  };

  // --- 增加样式，所有按钮和输入框浅灰色边框 ---
  const configStyle = document.createElement("style");
  configStyle.type = "text/css";
  configStyle.textContent = `
  #config-list textarea,
  #add-config,
  #save-config,
  #close-drawer {
    border: 1px solid #ccc !important;
    box-sizing: border-box;
  }
  #add-config,
  #save-config,
  #close-drawer {
    background: #f5f5f5;
    color: #333;
    border-radius: 4px;
    margin-right: 8px;
    padding: 6px 16px;
    transition: background 0.2s;
  }
  #add-config:disabled {
    background: #eee !important;
    color: #aaa !important;
    cursor: not-allowed !important;
  }
`;
  document.head.appendChild(configStyle);

 // 定义常量和命名空间，避免与网页原有元素ID/类名冲突
  const PREFIX = "tm-excel-parser-";
    const IDs = {
    toggleButton: PREFIX + "toggle-button",
    mainContainer: PREFIX + "main-container",
    input: PREFIX + "input",
    parseButton: PREFIX + "parse-button",
    output: PREFIX + "output",
    closeButton: PREFIX + "close-button",
    };
    const Classes = {
    floatingButton: PREFIX + "floating-button",
    mainContainer: PREFIX + "main-container",
    hidden: PREFIX + "hidden",
    contentContainer: PREFIX + "content-container",
    };

    // --- 注入 CSS 样式 ---
    // 通过创建 <style> 元素并添加到 <head> 来注入CSS
  const styleElement = document.createElement("style");
  styleElement.type = "text/css";
    styleElement.textContent = `
        .${Classes.floatingButton} {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 50%; /* 圆形按钮 */
            width: 50px;
            height: 50px;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 99999; /* 确保在最上层 */
            display: flex;
            justify-content: center;
            align-items: center;
            transition: background-color 0.2s ease-in-out;
            opacity: 0.8;
        }
        .${Classes.floatingButton}:hover {
            background-color: #0056b3;
            opacity: 1;
        }

        .${Classes.mainContainer} {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%); /* 居中 */
            background-color: #fff;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            max-width: 600px;
            width: 90%; /* 响应式宽度 */
            max-height: 80vh; /* 最大高度，防止内容过多超出屏幕 */
            overflow-y: auto; /* 内容溢出时滚动 */
            z-index: 99998; /* 比浮动按钮低一层 */
            border: 1px solid #ddd;
            box-sizing: border-box; /* 边框和内边距包含在宽度内 */
            display: none; /* 初始隐藏 */
            font-family: Arial, sans-serif;
            color: #333;
        }
        .${Classes.mainContainer}.${Classes.hidden} {
            display: none;
        }
        .${Classes.mainContainer}:not(.${Classes.hidden}) {
            display: block; /* 显示时为 block */
        }

        .${Classes.contentContainer} h1 {
            margin-top: 0;
            color: #333;
            font-size: 22px;
            margin-bottom: 10px;
        }
        .${Classes.contentContainer} p {
            font-size: 14px;
            color: #666;
            margin-bottom: 15px;
        }
        #${IDs.input} {
            width: calc(100% - 22px); /* 减去padding和border */
            height: 180px;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 14px;
            resize: vertical; /* 允许垂直拖动调整大小 */
            box-sizing: border-box;
        }
        #${IDs.parseButton} {
            padding: 10px 20px;
            background-color: #28a745; /* 绿色按钮 */
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.2s ease-in-out;
        }
        #${IDs.parseButton}:hover {
            background-color: #218838;
        }
        #${IDs.output} {
            margin-top: 20px;
            background-color: #f8f9fa;
            border: 1px solid #eee;
            padding: 15px;
            border-radius: 5px;
            white-space: pre-wrap; /* 保留空白符和换行符 */
            word-wrap: break-word; /* 单词换行 */
            font-family: 'Courier New', Courier, monospace; /* 等宽字体方便查看数组结构 */
            font-size: 13px;
            color: #333;
            max-height: 200px; /* 限制输出区域高度并允许滚动 */
            overflow-y: auto;
        }
        #${IDs.closeButton} {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 28px;
            cursor: pointer;
            color: #aaa;
            transition: color 0.2s ease-in-out;
        }
        #${IDs.closeButton}:hover {
            color: #666;
        }
    `;
    // 将 <style> 元素添加到文档的 <head> 中
    document.head.appendChild(styleElement);

  // 读取本地 configs 并反序列化为数组
  function getLocalConfigs() {
    let configs = [];
    try {
      const raw = localStorage.getItem("my_custom_config_arr");
      if (raw) {
        configs = JSON.parse(raw);
        if (!Array.isArray(configs)) configs = [];
      }
    } catch (e) {
      configs = [];
    }
    return configs;
  }

  // 初始化创建 按钮
  function parseConfigStrToObj(str) {
    const obj = {};
    str.split("\n").forEach((line) => {
      if (!line.trim()) return;
      const idx = line.indexOf(":");
      if (idx !== -1) {
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim();
        obj[key] = value;
      }
    });
    return obj;
  }

  function createConfigButtons(configArr) {
    // 先移除旧的自定义按钮，避免重复
    document
      .querySelectorAll(".custom-config-btn")
      .forEach((btn) => btn.remove());

    // 找到“执行操作”按钮
    const baseBtn = button; // 你已有的“执行操作”按钮变量

    configArr.forEach((cfg, idx) => {
      const btn = document.createElement("button");
      btn.className = "custom-config-btn";
      btn.textContent = cfg["创建名称"] || `自定义${idx + 1}`;
      btn.style.position = "fixed";
      btn.style.left = baseBtn.style.left;
      btn.style.zIndex = "9999";
      btn.style.backgroundColor = "#f5f5f5";
      btn.style.color = "#333";
      btn.style.border = "1px solid #ccc";
      btn.style.borderRadius = "20px";
      btn.style.cursor = "pointer";
      btn.style.padding = "10px 20px";
      btn.style.marginBottom = "8px";
      // 依次往上排列
      btn.style.bottom = 60 + idx * 50 + "px";

      btn.onclick = async function () {
              // 这里可以自定义点击后的处理逻辑
        console.log("点击的配置对象：", cfg);
              btn.disabled = true;

    const tmp_color = btn.style.backgroundColor
    btn.style.backgroundColor = "#aaa";
    btn.style.cursor = "not-allowed";
    btn.textContent = "执行中...";
    try {
      await run();
         for (const [key, value] of Object.entries(cfg)) {
            await runConfigItem(configList, key, value);
          }
      // alert("全部完成！");
    } finally {
      btn.disabled = false;
      btn.style.backgroundColor = tmp_color
      btn.style.cursor = "pointer";
      btn.textContent =  cfg["创建名称"] || `自定义${idx + 1}`;
    }









        // alert('已输出到控制台');
        // 你可以在这里调用其它函数并传入cfg
      };

      document.body.appendChild(btn);
    });
  }

  // 读取本地数据进行创建

  function createButtons() {
    const list = getLocalConfigs();
    console.log(list);

    const obj = list.map((e) => parseConfigStrToObj(e));
    console.log(obj);

    createConfigButtons(obj);
  }
  createButtons();

  /**
   * 根据名字查找对应的 .meta-inner 元素
   * @param {string} name - 要匹配的名字
   * @returns {Element|null} 匹配到的 .meta-inner 元素，未找到返回 null
   */
  function findMetaInnerByName(name) {
    const inners = document.querySelectorAll(".meta");
    for (let i = 0; i < inners.length; i++) {
      const metaNameEl = inners[i].querySelector(".meta-name");
      if (metaNameEl && metaNameEl.textContent.trim() === name) {
        return inners[i];
      }
    }
    return null;
  }

  function click1(el, arg) {
    const l = arg.split(",");
    for (let i = 0; i < l.length; i++) {
      const b = el.querySelectorAll("button");
      for (let index = 0; index < b.length; index++) {
        const element = b[index];
        if (element.textContent.trim() == l[i]) {
          element.click();
        }
      }
    }
  }

  async function click2(el, arg) {
    const l = arg.split(",");
    click1(el, "自定义")
    await sleep(300)
    let el1 = findMetaInnerByName("行为兴趣意向")
        el1.querySelector("h3").click()
    await sleep(500)
    el1= findMetaInnerByName("行为兴趣意向")
    if (el1) {
        // 遍历所有 li，点击匹配的
        const lis = el1.querySelectorAll("li label");
        for (let i = 0; i < lis.length; i++) {
          const txt = lis[i].innerText.trim();
          if (l.includes(txt)) {
            lis[i].click();
              console.log(1)
            await sleep(100); // 可选：每次点击后稍作延迟
          }
        }
      }



  }

  const configList = {
    性别: click1,
    年龄: click1,
    行为兴趣意向: click2,
    优化目标: click1,
    // 广告名称:set_name
  };

  // 执行对应函数
  async function runConfigItem(configList, itemName, arg) {
    const r = findMetaInnerByName(itemName);
    if (r) {
      configList[itemName](r, arg);
    }
  }
})();
