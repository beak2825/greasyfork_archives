// ==UserScript==
// @name         校服平台快捷语句
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.4
// @description  快捷语句管理工具
// @author       baozhenyu
// @match        http://115.238.148.133:19091/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/502960/%E6%A0%A1%E6%9C%8D%E5%B9%B3%E5%8F%B0%E5%BF%AB%E6%8D%B7%E8%AF%AD%E5%8F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/502960/%E6%A0%A1%E6%9C%8D%E5%B9%B3%E5%8F%B0%E5%BF%AB%E6%8D%B7%E8%AF%AD%E5%8F%A5.meta.js
// ==/UserScript==

(function () {
  "use strict";

  GM_addStyle(`
    .xfxf_body {
      max-height: 40px;
      max-width: 400px;
      min-width: 40px;
      font-size: 14px;
      line-height: 30px;
      position: fixed;
      right: 10px;
      top: 50%;
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 4px;
      background-color: #fff;
      z-index: 9999;
      cursor: move;
    }
    .xfxf_body button {
      border: 0;
      background-color: rgba(0, 0, 0, 0);
      padding: 0 2px;
      text-wrap: nowrap;
      font-weight: bold;
      border-radius: 5px;
    }
    .xfxf_body .xf_title_tag {
      color: orange;
      cursor: pointer;
    }
    .xfxf_body button:hover {
      background-color: rgba(204, 204, 204, 0.7);
    }
    .xf-bodyTag {
      width: 100%;
      justify-content: space-between;
    }
    .flex_row {
      display: flex;
      flex-direction: row;
    }
    .xfxf_table {
      height: auto;
      width: auto;
    }
    .xfxf_table .tabBody {
      max-height: 200px;
      width: auto;
      overflow-y: scroll;
      scrollbar-width: thin; /* Firefox */
      -ms-overflow-style: -ms-autohiding-scrollbar; /* IE 10+ */
      border: 1px solid rgba(152, 152, 152, 0.5);
      border-radius: 5px;
    }
    .xfxf_table .tabBody::-webkit-scrollbar {
      width: 2px; /* 设置滚动条宽度 */
    }
    .xfxf_table .tabHead {
      width: 100%;
      justify-content: space-between;
      margin: 4px 0;
    }
    .xfxf_table .tabHead .xf_clear_but {
      color: rgba(255, 13, 0, 0.7);
    }
    .xfxf_table .tabHead #xf_filter_input {
      flex: 1;
      border: 1px solid rgba(152, 152, 152, 0.5);
      border-radius: 5px;
      padding: 0 4px;
      box-sizing: border-box;
      line-height: 20px;
      max-width: 240px;
      min-width: 140px;
      margin-right: 10px;
    }
    .xfxf_table .tabHead button {
      color: orange;
    }
    .xfxf_table .delete {
      color: rgb(255, 13, 0);
    }
    .xfxf_table .edit {
      color: orange;
    }
    .xfxf_table .line_text {
      padding: 0px 4px;
      max-width: 200px;
      line-height: 20px;
      white-space: normal;
      word-break: break-all;
    }
    .xfxf_table .line_buts {
      border-left: 1px solid rgba(152, 152, 152, 0.5);
    }
    .xfxf_table .tabline {
      height: auto;
      align-items: center;
      justify-content: space-between;
      padding: 2px 2px 2px 0px;
      border-top: 1px solid rgba(152, 152, 152, 0.5);
    }
    .xfxf_table .tabline:first-child {
      border-top: none;
    }
    .xf_edit_body .delete {
      color: orange;
    }
    .xf_edit_body .add {
      color: rgb(0, 204, 255);
    }
    .xf_edit_body {
      position: absolute;
      width: 200px;
      height: 150px;
      border: #333 solid 1px;
      background-color: #fff;
      border-radius: 10px;
      right: 5px;
      top: 0px;
      z-index: 10000;
    }
    .edit_body_bot_line {
      width: 100%;
      justify-content: space-around;
    }
    .xf_edit_body .edit_body_title {
      width: 100%;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
    }
    .xf_edit_body .xf_input {
      display: block;
      width: 90%;
      box-sizing: border-box;
      margin: 10px auto;
      line-height: 20px;
    }
  `);
  let xf_edit_text = "";
  let xf_edit_id = "";
  let xf_list = [];
  let debounceInputTimer = null;
  // 刷新
  let refresh_loading = false;
  const baseurl =
    "http://122.227.185.2:18092/xf-api/blade-quickStatement/quickStatement";
  // const baseurl = "http://172.21.8.56:3370/user";
  console.log("脚本执行");
  // Helper functions
  function objectToQueryString(obj) {
    if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
      throw new Error("Input must be an object.");
    }

    return (
      "?" +
      Object.keys(obj)
        .map(
          (key) => encodeURIComponent(key) + "=" + encodeURIComponent(obj[key])
        )
        .join("&")
    );
  }

  function xf_unfold() {
    const xfxf_table = document.getElementById("xfxf_table");
    const xfxf_body = document.getElementById("xfxf_body");
    const xfTagButton = document.getElementById("xf-tagButton");
    if (xfxf_table.style.display == "none") {
      xfxf_table.style.display = "block";
      xfxf_body.style.maxHeight = "300px";
      xfxf_body.style.width = "auto";
      xfTagButton.textContent = "收起";
      xfTagButton.style.display = "block";
    } else {
      xfxf_table.style.display = "none";
      xfTagButton.style.display = "none";
      xfxf_body.style.maxHeight = "40px";
      xfTagButton.textContent = "展开";
    }
  }

  // 获取当前用户id
  function get_xfUserId() {
    return localStorage.getItem("Meteor.userId") || getCookie("rc_uid");
  }

  // 获取 cookie 的函数
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };
  // 初始化列表
  async function getxf_initList() {
    const userId = get_xfUserId();
    const input = document.getElementById("xf_filter_input");
    input.value = "";
    GM_xmlhttpRequest({
      method: "GET",
      url: `${baseurl}/list?userId=${userId}`,
      headers: {
        "Content-Type": "application/json",
      },
      onload: function (response) {
        const data = JSON.parse(response.responseText);
        if (data.code === 200) {
          xf_list = data.data?.records ? data.data.records : data.data;
          console.log("列表:", xf_list);
          xf_create_list(xf_list);
        } else {
          console.log("获取列表失败");
        }
      },
    });
  }
  function xf_filter_input() {
    if (debounceInputTimer) {
      clearTimeout(debounceInputTimer);
    }
    debounceInputTimer = setTimeout(() => {
      const input = document.getElementById("xf_filter_input");
      const list = xf_list.filter((item) =>
        item.text.toLowerCase().includes(input.value.toLowerCase())
      );
      xf_create_list(list);
    }, 500);
  }
  // 列表渲染
  function xf_create_list(list) {
    const xfxf_tabBody = document.getElementById("xfxf_tabBody");
    xfxf_tabBody.innerHTML = ""; // 清空现有内容
    for (let i = 0; i < list.length; i++) {
      const item = list[i];

      // 创建新的tabline
      const tabLine = document.createElement("div");
      tabLine.className = "tabline flex_row";

      const lineText = document.createElement("div");
      lineText.className = "line_text";
      lineText.textContent = item.text;

      const lineButs = document.createElement("div");
      lineButs.className = "line_buts flex_row";

      const editButton = document.createElement("button");
      editButton.className = "edit";
      editButton.textContent = "编辑";
      editButton.onclick = () => xf_edit(item.id, item.text);

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete";
      deleteButton.textContent = "删除";
      deleteButton.onclick = () => xf_delete(item.id);

      const copyButton = document.createElement("button");
      copyButton.textContent = "复制";
      copyButton.style.color = "#6d6d6d";
      copyButton.onclick = () => copyText(item.text);

      const inputEditButton = document.createElement("button");
      inputEditButton.textContent = "填充";
      inputEditButton.style.color = "rgb(0, 204, 255)";
      inputEditButton.onclick = () => editInput(item.text);

      // 将按钮添加到lineButs
      lineButs.appendChild(editButton);
      lineButs.appendChild(deleteButton);
      lineButs.appendChild(copyButton);
      lineButs.appendChild(inputEditButton);

      // 将文本和按钮添加到tabLine
      tabLine.appendChild(lineText);
      tabLine.appendChild(lineButs);

      // 将新创建的tabLine添加到tabBody
      xfxf_tabBody.appendChild(tabLine);
    }
  }
  // 编辑、添加、删除逻辑
  function xf_edit(id, text) {
    xf_edit_handle("edit", id, text);
  }

  function xf_add() {
    xf_edit_handle("add");
  }

  function xf_edit_send() {
    const xf_input = document.getElementById("xf_input");
    xf_edit_text = xf_input.value;
    const xf_edit_body = document.getElementById("xf_edit_body");
    xf_edit_body.style.display = "none";
    if (xf_edit_text == "") {
      alert("内容不能为空");
      return;
    }
    xf_send_data(xf_edit_text, xf_edit_id);
  }
  function xf_edit_cancle(id) {
    const xf_edit_body = document.getElementById("xf_edit_body");
    xf_edit_body.style.display = "none";
  }
  async function xf_send_data(value, id) {
    const userId = get_xfUserId();
    try {
      GM_xmlhttpRequest({
        // method: "POST",
        method: "GET",
        url:
          baseurl +
          "/" +
          (id ? "update" : "save") +
          objectToQueryString({
            userId: userId,
            text: value,
            id: id,
          }),
        headers: {
          "Content-Type": "application/json",
        },
        onload: function (response) {
          const data = JSON.parse(response.responseText);
          if (data.code === 200) {
            getxf_initList();
          } else {
            alert("操作失败");
          }
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  }

  function xf_edit_handle(type, id = "", text = "") {
    const userId = get_xfUserId();
    console.log("userId", userId);
    if (!userId) {
      alert("请先登录客服平台后，点击刷新重试");
      return;
    }
    const xf_edit_body = document.getElementById("xf_edit_body");
    const edit_body_title = document.getElementById("edit_body_title");
    const xf_input = document.getElementById("xf_input");
    xf_input.value = "";
    xf_edit_body.style.display = "block";
    switch (type) {
      case "add":
        edit_body_title.textContent = "新增";
        xf_edit_id = "";
        break;
      case "edit":
        edit_body_title.textContent = "编辑";
        xf_edit_id = id;
        xf_input.value = text;
        break;
    }
  }
  function showConfirm(message) {
    return new Promise((resolve) => {
      const result = confirm(message);
      resolve(result);
    });
  }
  async function xf_delete(id) {
    const confirmed = await showConfirm("确定删除吗？");
    if (!confirmed) {
      return;
    }
    const userId = get_xfUserId();
    GM_xmlhttpRequest({
      // method: "POST",
      method: "GET",
      url:
        baseurl +
        "/remove" +
        objectToQueryString({
          userId: userId,
          id: id,
        }),
      headers: {
        "Content-Type": "application/json",
      },
      onload: function (response) {
        const data = JSON.parse(response.responseText);
        if (data.code === 200) {
          getxf_initList();
        } else {
          alert("删除失败");
        }
      },
    });
  }

  function copyText(text) {
    navigator.clipboard.writeText(text).then(
      () => {
        alert("复制成功！");
      },
      (err) => {
        console.error("复制失败:", err);
      }
    );
  }
  function xf_clearInput() {
    if (refresh_loading) {
      return;
    }
    let xf_clear_but = document.getElementById("xf_clear_but");
    xf_clear_but.style.color = "#6d6d6d";
    refresh_loading = true;
    setTimeout(() => {
      refresh_loading = false;
      let xf_clear_but = document.getElementById("xf_clear_but");
      xf_clear_but.style.color = "rgba(255, 13, 0, 0.7)";
    }, 1000);
    const xfFiltrInput = document.getElementById("xf_filter_input");
    xfFiltrInput.value = "";
    getxf_initList(xf_list);
  }
  function editInput(text) {
    // 通过textarea标签的name="msg" 属性查找 这个dom
    const textareaInput = document.querySelector('textarea[name="msg"]');
    if (!textareaInput) {
      alert("当前页面不存在聊天页面的输入框");
      return;
    }
    textareaInput.value = text;
  }
  // 拖拽
  function xf_allowDrag() {
    const xfxfBody = document.getElementById("xfxf_body");
    const xfInput = document.getElementById("xf_input");
    const xfFiltrInput = document.getElementById("xf_filter_input");
    let isDragging = false;
    let offsetY = 0;

    // 节流函数
    function throttle(func, wait) {
      let timeout;
      let previous = 0;
      return function () {
        const context = this;
        const args = arguments;
        const now = Date.now();
        const remaining = wait - (now - previous);
        clearTimeout(timeout);
        if (remaining <= 0) {
          func.apply(context, args);
          previous = now;
        } else {
          timeout = setTimeout(function () {
            previous = Date.now();
            func.apply(context, args);
          }, remaining);
        }
      };
    }

    // 开始拖拽
    xfxfBody.addEventListener("mousedown", (e) => {
      e.preventDefault(); // 取消默认的鼠标按下事件
      isDragging = true;
      offsetY = e.clientY - xfxfBody.offsetTop;
    });

    // 监听鼠标移动
    document.addEventListener(
      "mousemove",
      throttle((e) => {
        if (isDragging) {
          e.stopPropagation(); // 阻止事件冒泡
          xfxfBody.style.top = e.clientY - offsetY + "px";
        }
      }, 100)
    );

    // 结束拖拽
    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
    // 处理xf_input元素的点击事件
    xfInput.addEventListener("mousedown", (e) => {
      e.stopPropagation(); // 阻止事件冒泡
    });
    xfFiltrInput.addEventListener("mousedown", (e) => {
      e.stopPropagation(); // 阻止事件冒泡
    });
  }

  function xf_routerChange() {}
  // 初始化
  function xf_init() {
    // 创建 DOM 结构
    createDOMStructure();
    // 请求获取原始数据
    getxf_initList();
    // 监听路由变化
    xf_routerChange();
    // 增加允许拖拽
    xf_allowDrag();
  }

  function createDOMStructure() {
    const body = document.body;
    const divBody = document.createElement("div");
    divBody.className = "xfxf_body";
    divBody.id = "xfxf_body";

    const xfBodyTag = document.createElement("div");
    xfBodyTag.className = "xf-bodyTag flex_row";
    const xfTitleTag = document.createElement("text");
    xfTitleTag.id = "xf_title_tag";
    xfTitleTag.className = "xf_title_tag";
    xfTitleTag.onclick = xf_unfold;
    xfTitleTag.textContent = "快捷语句";
    const xfTagButton = document.createElement("button");
    xfTagButton.id = "xf-tagButton";
    xfTagButton.onclick = xf_unfold;
    xfTagButton.textContent = "展开";
    xfTagButton.style.display = "none";
    xfBodyTag.appendChild(xfTitleTag);
    xfBodyTag.appendChild(xfTagButton);

    const xfxfTable = document.createElement("div");
    xfxfTable.className = "xfxf_table";
    xfxfTable.id = "xfxf_table";
    xfxfTable.style.display = "none";

    const tabHead = document.createElement("div");
    tabHead.className = "tabHead flex_row";
    const tabInput = document.createElement("input");
    tabInput.oninput = xf_filter_input;
    tabInput.id = "xf_filter_input";
    tabInput.placeholder = "输入以筛选";
    tabHead.appendChild(tabInput);
    const clearButton = document.createElement("button");
    clearButton.onclick = xf_clearInput;
    clearButton.className = "xf_clear_but";
    clearButton.id = "xf_clear_but";
    clearButton.textContent = "刷新";
    tabHead.appendChild(clearButton);
    const addButton = document.createElement("button");
    addButton.onclick = xf_add;
    addButton.textContent = "新增语句";
    tabHead.appendChild(addButton);

    const tabBody = document.createElement("div");
    tabBody.id = "xfxf_tabBody";
    tabBody.className = "tabBody";

    xfxfTable.appendChild(tabHead);
    xfxfTable.appendChild(tabBody);

    const xfEditBody = document.createElement("div");
    xfEditBody.className = "xf_edit_body flex_col";
    xfEditBody.id = "xf_edit_body";
    xfEditBody.style.display = "none";

    const editBodyTitle = document.createElement("div");
    editBodyTitle.className = "edit_body_title";
    editBodyTitle.id = "edit_body_title";
    editBodyTitle.textContent = "新增";

    const xfInput = document.createElement("textarea");
    xfInput.id = "xf_input";
    xfInput.className = "xf_input";
    xfInput.name = "xf_input";
    xfInput.rows = "3";

    const editBodyBotLine = document.createElement("div");
    editBodyBotLine.className = "edit_body_bot_line flex_row";

    const confirmButton = document.createElement("button");
    confirmButton.className = "add";
    confirmButton.textContent = "确认";
    confirmButton.onclick = xf_edit_send;

    const cancelButton = document.createElement("button");
    cancelButton.className = "delete";
    cancelButton.textContent = "取消";
    cancelButton.onclick = xf_edit_cancle;

    editBodyBotLine.appendChild(confirmButton);
    editBodyBotLine.appendChild(cancelButton);

    xfEditBody.appendChild(editBodyTitle);
    xfEditBody.appendChild(xfInput);
    xfEditBody.appendChild(editBodyBotLine);

    divBody.appendChild(xfBodyTag);
    divBody.appendChild(xfxfTable);
    divBody.appendChild(xfEditBody);
    body.appendChild(divBody);
  }

  xf_init();
})();
