// ==UserScript==
// @name         NodeSeek+
// @namespace    http://tampermonkey.net/
// @version      0.4.2
// @description  load post detail information is automatically loaded when the button is clicked
// @author       tsd
// @match        https://www.nodeseek.com/*
// @match        https://www.nodeseek.com/*
// @icon         https://www.nodeseek.com/static/image/favicon/android-chrome-192x192.png
// @license      GPLv3
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_removeValueChangeListener
// @grant        GM_addValueChangeListener
// @grant    GM_registerMenuCommand
// @grant    GM_unregisterMenuCommand

// @downloadURL https://update.greasyfork.org/scripts/480376/NodeSeek%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/480376/NodeSeek%2B.meta.js
// ==/UserScript==

(function () {
  "use strict";
  console.log("script");

  //GM_setValue
  //allCollectionData   收藏的post的id列表
  //checkInTime         签到的时间
  //isRandom            是否摸奖签到
  //isAuto              是否自动签到
  //contentTime         记录点击展开回复内容div的时间
  //replyNum            当前回复数
  //blockWords          屏蔽的关键词

  //默认抽奖
  if (GM_getValue("isRandom") === undefined) {
    GM_setValue("isRandom", true);
  }
  //默认手动
  if (GM_getValue("isAuto") === undefined) {
    GM_setValue("isAuto", false);
  }

  //注册菜单
  let switchCheckType;
  let switchAutoType;
  let listenerswitchCheckType;
  let listenerswitchAutoType;
  function createMenu() {
    switchCheckType = GM_registerMenuCommand(
      GM_getValue("isRandom") === true
        ? "切换签到模式,当前为随机"
        : "切换签到模式,当前为固定",
      menuRandomClick
    );
    switchAutoType = GM_registerMenuCommand(
      GM_getValue("isAuto") === true
        ? "切换自动模式,当前为自动"
        : "切换自动模式,当前为手动",
      menuAutoClick
    );
    //是否有变动
    listenerswitchCheckType = GM_addValueChangeListener(
      "isRandom",
      function (name, old_value, new_value, remote) {
        if (old_value !== new_value) {
          mscAlert(new_value === true ? "已切换为随机" : "已切换为固定");
        }
      }
    );
    listenerswitchAutoType = GM_addValueChangeListener(
      "isAuto",
      function (name, old_value, new_value, remote) {
        if (old_value !== new_value) {
          mscAlert(new_value === true ? "已切换为自动" : "已切换为手动");
        }
      }
    );
  }
  //菜单点击刷新签到信息
  function menuRandomClick() {
    GM_unregisterMenuCommand(switchCheckType);
    GM_getValue("isRandom") === true
      ? GM_setValue("isRandom", false)
      : GM_setValue("isRandom", true);
    //重新注册
    GM_removeValueChangeListener(listenerswitchCheckType);
    GM_removeValueChangeListener(listenerswitchAutoType);
    createMenu();
    checkIn();
  }
  //菜单点击刷新自动信息
  function menuAutoClick() {
    GM_unregisterMenuCommand(switchAutoType);
    GM_getValue("isAuto") === true
      ? GM_setValue("isAuto", false)
      : GM_setValue("isAuto", true);
    //重新注册
    GM_removeValueChangeListener(listenerswitchCheckType);
    GM_removeValueChangeListener(listenerswitchAutoType);
    createMenu();
    checkIn();
  }

  // 检查是否登陆
  let loginStatus = false;
  // 查看手机情况
  let mobileStatus = false;
  if (document.querySelector(".user-head")) {
    loginStatus = true;
  }
  // 检查屏蔽关键词
  blockPost();

  if(!document.querySelector("#nsk-right-panel-container>.user-card")){
    mobileStatus = true;
  }

  if (loginStatus) {
    //注册油猴菜单
    createMenu();
    //处理登录;
    checkIn();
    //维护一个全部的收藏id列表
    if (GM_getValue("allCollectionData") === undefined) {
      loadUntilEmpty();
    }
  } else {
    //清除收藏的post的id列表
    //GM_deleteValue("allCollectionData");
    //清除签到的时间
    //GM_deleteValue("checkInTime");
    //清除签到方式
    //GM_deleteValue("isRandom");
    //清除自动方式
    //GM_deleteValue("isAuto");
  }

  //签到判断
  function checkIn() {
    let timeNow =
      new Date().getFullYear() +
      "/" +
      (new Date().getMonth() + 1) +
      "/" +
      new Date().getDate();
    let oldTime = GM_getValue("checkInTime");
    if (!oldTime || oldTime !== timeNow) {
      //允许执行签到
      if (GM_getValue("isAuto") === true) {
        //执行自动签到
        getChicken(GM_getValue("isRandom")).then((responseData) => {
          if (responseData.success === true) {
            //签到成功之后存下时间
            GM_setValue("checkInTime", timeNow);
            console.log(`[NodeSeek] 签到：`, responseData.message);
          } else if (responseData.message === "今天已完成签到，请勿重复操作") {
            //存下时间
            GM_setValue("checkInTime", timeNow);
            console.log(`[NodeSeek] 签到：`, responseData.message);
          } else {
            console.error("Error in checkIn:", error);
          }
        });
      } else {
        //执行手动签到
        //处理按钮
        let right_panel = document.querySelector("#nsk-right-panel-container");
        let new_check = document.createElement("div");
        let publish_btn = document.querySelector(".btn.new-discussion");
        let publish_btn_parent = publish_btn.parentNode;
        new_check.innerHTML = '<a class="btn new-discussion">签到</a>';
        //展示签到按钮
        right_panel.insertBefore(new_check, publish_btn_parent);
        setupCursorStyle(new_check);
        new_check.onclick = function () {
          getChicken(GM_getValue("isRandom")).then((responseData) => {
            console.log(responseData.message);
            if (responseData.success === true) {
              //签到成功之后存下时间
              GM_setValue("checkInTime", timeNow);
              //弹窗示意多少鸡腿
              mscAlert(responseData.message);
              //隐藏
              new_check.style.display = "none";
            } else if (
              responseData.message === "今天已完成签到，请勿重复操作"
            ) {
              //存下时间
              GM_setValue("checkInTime", timeNow);
              mscAlert(responseData.message);
              //隐藏
              new_check.style.display = "none";
            } else {
              console.error("Error in checkIn:", error);
            }
          });
        };
      }
    } else {
      //返回已经签到按钮或隐藏
    }
  }
  // 签到
  async function getChicken(random) {
      const url = `https://www.nodeseek.com/api/attendance?random=${random}`;
      const data = {
      random: random,
    };
    try {
      const responseData = await postData(url, data);
      return responseData;
    } catch (error) {
      console.error("Error in getChicken:", error);
      return null;
    }
  }
  //自定义屏蔽词窗口
  let modal = document.createElement('div');
  let modalContent = document.createElement('div');
  let closeBtn = document.createElement('span');
  let promptText = document.createElement('p');
  let inputField = document.createElement('input');
  let submitBtn = document.createElement('button');

  // 设置元素属性和内容
  modal.id = 'myModal';
  modal.className = 'modal';
  modalContent.className = 'modal-content';
  closeBtn.className = 'close';
  closeBtn.textContent = '×';
  promptText.textContent = '请输入要屏蔽的关键词，多个关键词用逗号隔开（注意：严格区分，最好是复制过来）';
  inputField.id = 'block-input';
  inputField.type = 'text';
  submitBtn.id = 'submit-button';
  submitBtn.textContent = '确定';

  // 将所有元素添加到屏蔽词窗口中
  modalContent.appendChild(closeBtn);
  modalContent.appendChild(promptText);
  modalContent.appendChild(inputField);
  modalContent.appendChild(submitBtn);
  modal.appendChild(modalContent);

  function createBlockWordsModal() {
    document.body.appendChild(modal);
    modal.style.display = "block";
  }
  // 自定义屏蔽词
  let blockDiv = document.querySelector(".sorter");
  let btnBlock = document.createElement("button");
  btnBlock.style.cursor = 'pointer';
  btnBlock.innerText = "关键词屏蔽";
  btnBlock.classList.add("btnBlock-post");
  if(blockDiv !== null){
    blockDiv.parentNode.insertBefore(btnBlock, blockDiv.nextSibling);
  }


  // 弹窗输入屏蔽词
  function getOldBlockWords() {
    let oldBlockWords = GM_getValue("blockWords");
    inputField.value = oldBlockWords ? oldBlockWords : '';
    modal.style.display = 'block';
  }

  // 当用户点击 "确定" 按钮，获取输入值
  submitBtn.onclick = function() {
    let blockWords = inputField.value.trim();
    GM_setValue("blockWords", blockWords);
    modal.style.display = 'none';
    if (!blockWords) {
      window.location.reload();
    } else {
      blockPost();
    }
  }

  // 当用户点击屏蔽词窗口外的任何地方或 "x" 图标，关闭屏蔽词窗口
  closeBtn.onclick = window.onclick = function(event) {
    if (event.target == modal || event.target == closeBtn) {
      modal.style.display = 'none';
    }
  }

  // 点击按钮时，显示屏蔽词窗口
  btnBlock.onclick = function () {
    createBlockWordsModal();
    getOldBlockWords();
  };

  //屏蔽帖子
  function blockPost() {
    //获取自定义的屏蔽词
    let blockWords = GM_getValue("blockWords");
    blockWords = blockWords === undefined ? '':blockWords.trim();
    if (blockWords) {
      let blockWordsArr = blockWords.split(",");
      let lists = document.querySelectorAll(".post-list");
      lists.forEach((list) => {
        let items = list.childNodes;
        items.forEach((element) => {
          let post_item = element.querySelector(".post-title>a");
          let post_title = post_item.innerText;
          blockWordsArr.forEach((word) => {
            if (post_title.includes(word)) {
              element.classList.add('blocked-post');
            }
          });
        });
      });
    }
  }

  // 查看内容时的标签顺序样式修改
  let footTag = document.querySelectorAll(".floor-link");
  footTag.forEach((item) =>{
    item.className = "foot-tag";
    let itemChild = item.firstChild.textContent;
    item.firstChild.textContent = itemChild.replace(/^#/, "")
  })




  //查看帖子中的回复消息
  initializePage();

  // 定义一个函数来发送GET请求
  async function loadData(page) {
    const url = `https://www.nodeseek.com/api/statistics/list-collection?page=${page}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }
  //POST请求
  async function postData(url = "", data = {}) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("Error in postData:", error);
    }
  }
  async function loadUntilEmpty(page = 1) {
    //收藏列表数组
    let allCollectionData = [];
    while (true) {
      const data = await loadData(page);
      data.collections.forEach((item) => {
        // 将获取到的数据加到数组中
        allCollectionData.push(item.post_id);
      });
      // 如果没有获取到数据或获取到的数据为空，停止加载
      if (!data || data.collections.length === 0) {
        //丢进去方便存取
        GM_setValue("allCollectionData", allCollectionData);
        break;
      }
      page++;
    }
  }

  function initializePage() {
    let lists = document.querySelectorAll(".post-list");
    lists.forEach((list) => {
      let items = list.childNodes;
      items.forEach((element) => {
        setupPostItem(element);
      });
    });
  }

  function setupPostItem(element) {
    let post_item = element.querySelector(".post-title>a");
    let new_div = document.createElement("span");
    if(mobileStatus){
      new_div.className = "info-triganle-mobile";
    }else{
      new_div.className = "info-triganle";
    }
    new_div.innerHTML = '<span class="triangle">▼</span>';
    element.querySelector(".post-info").append(new_div);
    setupCursorStyle(new_div);
    new_div.onclick = function () {
      if(GM_getValue("contentTime") + 1000 >= Date.now()){
        console.warn("请勿重复点击");
      }else{
        GM_setValue("contentTime",Date.now());
        GM_setValue("replyNum",element.querySelector(".info-item.info-comments-count > span").innerText);
        togglePostContent(post_item, element, new_div);
      }
    };
  }

  function togglePostContent(post_item, element, new_div) {
    let id = post_item.href.replace("https://www.nodeseek.com", "");
    let content = document.getElementById(id);
    if (content) {
      toggleDisplay(content, new_div);
    } else {
      new_div.firstElementChild.innerText = "○";
      document.body.style.cursor = "wait";
      new_div.firstElementChild.className = "content-loaded";
      fetchContent(post_item.href, element, (contents, targetEle) => {
        insertContentAfter(contents, targetEle);
        loadNextPage(contents, targetEle, 1);
        new_div.firstElementChild.innerText = "▲";
        document.body.style.cursor = "auto";
      });
    }
  }
  //显隐箭头
  function toggleDisplay(content, new_div) {
    if (content.style.display === "none") {
      content.style.display = "block";
      new_div.firstElementChild.innerText = "▲";
    } else {
      content.style.display = "none";
      new_div.firstElementChild.innerText = "▼";
    }
  }

  //获取div框中的内容
  function fetchContent(url, targetEle, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function () {
        if (xhr.status !== 200) return;

        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = xhr.responseText;
        const contents = createContentDiv(url);
        const post_contents = tempContainer.querySelectorAll(".post-content");
        const colloct = appendPostContentBox(contents);

        post_contents.forEach((e) => {
            modifyFootTagDivStyle(e);
            contents.firstChild.appendChild(e.parentElement);
        });

        if (callback && typeof callback === "function") {
            callback(contents, targetEle);
        }
    };
    xhr.send();
}

function createContentDiv(url) {
    const contents = document.createElement("div");
    contents.id = url.replace("https://www.nodeseek.com", "");
    contents.className = "content-div";
    return contents;
}

function appendPostContentBox(contents) {
    contents.innerHTML += '<div class="post-content-box"></div>';

    const colloct = contents.firstChild;
    colloct.innerHTML +=
        '<div data-v-372de460="" class="comment-menu">' +
        '<div data-v-372de460="" title="收藏" class="menu-item"><svg data-v-372de460="" class="iconpark-icon"><use data-v-372de460="" href="#star-6negdgdk"></use></svg></div>' +
        "</div>";

    const icon = colloct.firstElementChild.querySelector(".menu-item");

    const postId = getPostId(contents.id);
    const is_collected = GM_getValue("allCollectionData").some(
        (item) => item === postId
    );
    if (is_collected) {
        icon.style.color = "red";
    }

    setupCursorStyle(icon);
    icon.onclick = function () {
        colloctContent(postId, colloct);
    };
    return colloct;
}

function getPostId(id) {
    const regex = /\/post-(\d+)-1/;
    const match = id.match(regex);
    if (match != null) {
        return parseInt(match[1]);
    }
    return null;
}

function modifyFootTagDivStyle(e) {
    const footTagDiv = e.parentElement.querySelector(".floor-link");
    footTagDiv.className = "foot-tag-div";
    const itemChild = footTagDiv.textContent;
    footTagDiv.textContent = itemChild.replace(/^#/, "")
}

  //帖子的收藏处理
  function colloctContent(post_id, colloct) {
    let icon = colloct.firstElementChild.querySelector(".menu-item");
    if (icon.style.color === "red") {
      //取消收藏处理
      let result = confirm("您确定要取消收藏吗？");
      if (result) {
        collection_del("remove", post_id).then((success) => {
          if (success === true) {
            icon.style.color = "";
            //维护一个全部的收藏id列表
            loadUntilEmpty();
          }
        });
      }
    } else {
      //收藏帖子
      collection_add("add", post_id).then((success) => {
        if (success === true) {
          icon.style.color = "red";
          //维护一个全部的收藏id列表
          loadUntilEmpty();
        }
      });
    }
  }
  //收藏方法
  async function collection_add(action_type, post_id) {
    const url = "https://www.nodeseek.com/api/statistics/collection";
    const data = {
      action: action_type,
      postId: post_id,
    };
    try {
      const responseData = await postData(url, data);
      if (responseData && responseData.success === true) {
        mscAlert("收藏成功！");
      }
      //   else if (responseData && responseData.success === false) {
      //     alert("你已经收藏过了！");
      //   }
      return responseData ? responseData.success : null;
    } catch (error) {
      console.error("Error in collection_add:", error);
      return null;
    }
  }

  //取消收藏方法
  async function collection_del(action_type, post_id) {
    const url = "https://www.nodeseek.com/api/statistics/collection";
    const data = {
      action: action_type,
      postId: post_id,
    };
    try {
      const responseData = await postData(url, data);
      if (responseData && responseData.success === true) {
        mscAlert("取消收藏成功！");
      }
      return responseData ? responseData.success : null;
    } catch (error) {
      console.error("Error in collection_del:", error);
      return null;
    }
  }

  function insertContentAfter(content, targetEle) {
    let ul = targetEle.parentNode;
    ul.insertBefore(content, targetEle.nextSibling);
  }

  function loadNextPage(contentDiv, targetEle, currentPage) {
    if(GM_getValue("replyNum") / 10 <= currentPage){
      return;
    }
    let nextPage = currentPage + 1;
    let nextPageUrl = targetEle
      .querySelector(".post-title>a")
      .href.replace(/(\d+)$/, nextPage);
    fetchContent(nextPageUrl, targetEle, (nextContents, targetEle) => {
      let postContentBox = contentDiv.querySelector(".post-content-box");
      if (nextContents.querySelector(".post-content")) {
        let nextPostContents = nextContents.querySelectorAll(".post-content");
        nextPostContents.forEach((e) => {
          postContentBox.appendChild(e.parentElement);
        });
        // 递归调用以加载后续页面,延迟1秒
        setTimeout(() => {
          loadNextPage(contentDiv, targetEle, nextPage);
        }, 1000);
      }
    });
  }

  function setupCursorStyle(element) {
    element.addEventListener("mouseover", function () {
      document.body.style.cursor = "pointer";
    });
    element.addEventListener("mouseout", function () {
      document.body.style.cursor = "auto";
    });
  }

  let css = `
     .content-div {
        height: 600px;
        padding: 20px;
        margin: 10px auto;
        border: 1px solid gray;
        border-radius: 10px;
        overflow: scroll;
    }

    .post-content-box {
        border-bottom: 2px dashed gray;
        padding-bottom: 10px;
        margin-bottom: 10px;
    }

    .triangle {
        font-size: medium;
        color: gray;
    }
    .info-triganle{
        position: absolute;
        right: 54px;
    }
    .info-triganle-mobile{
      position: absolute;
    }
    .content-loaded {
        font-size: medium;
        color: red;
    }
    ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    ::-webkit-scrollbar-track {
        border-radius: 3px;
        background: rgba(0,0,0,0.06);
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
    }
    ::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background: rgba(0,0,0,0.12);
        -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
    }
    .foot-tag{
      margin-left: 1rem;
      line-height: 0.5rem;
      border-radius: 0.5rem;
      display: inline-block;
      background-color: #f0f0f0;
      color: #bdbdbd;
      padding: 3px 9px;
      cursor: default;
    }
    .foot-tag-div{
      margin-left: 1rem;
      line-height: 0.5rem;
      border-radius: 0.5rem;
      display: inline-block;
      background-color: #f0f0f0;
      color: #bdbdbd;
      padding: 3px 9px;
      cursor: default;
    }
    .preview {
      margin: 1rem 0;
      border: 1px solid transparent;
      border-radius: 8px;;
      cursor: pointer;
    }

    .preview:hover {
      border: 1px solid #c8c8c8;
    }

    .preview > .post-content {
      height: 200px !important;
      margin-top: 0.5rem !important;
    }

    .preview > .post-content.show-all {
      max-height: 200px;
      -webkit-mask-image:none;
    }

    .preview  .topic-link:link {
      color: black !important;
    }
    .btnBlock-post{
      background-color: #888;
      border: 1px solid #737373;
      border-radius: 3px;
      display: inline-flex;
      margin: 0 8px;
      position: absolute;
      color: var(--bg-main-color);
      left: 15%;
    }
    /* 屏蔽框 */
    .modal {
      display: none;
      position: fixed;
      z-index: 1;
      padding-top: 100px;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0,0,0,0.4);
    }
    .modal-content {
      height: 15%;
      background-color: #fefefe;
      margin: auto;
      padding: 20px;
      border: 1px solid #888;
      width: 60%;
      border-radius: 15px;
      box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
    }
    .close {
      color: #aaaaaa;
      float: right;
      font-size: 28px;
      font-weight: bold;
    }
    .close:hover,
    .close:focus {
      color: #000;
      text-decoration: none;
      cursor: pointer;
    }
    .modal p {
      font-size: 18px;
      font-weight: bold;
    }
    #block-input {
      width: 100%;
      padding: 12px 20px;
      margin: 8px 0;
      box-sizing: border-box;
      border: 2px solid #ccc;
      border-radius: 4px;
      background-color: #f8f8f8;
      resize: none;
    }
    #submit-button {
      background-color: #4CAF50;
      color: white;
      padding: 10px 33px;
      text-align: center;
      text-decoration: none;
      display: block;
      font-size: 16px;
      margin: 8px 2px;
      cursor: pointer;
      border: none;
      border-radius: 4px;
      width: auto;
      float: right;
    }

    @media screen and (max-width: 600px) {
      .modal-content {
          width: 90%;
          height: 16%;
      }
      .btnBlock-post{
        background-color: #888;
        border: 1px solid #737373;
        border-radius: 3px;
        display: inline-flex;
        margin: 0 8px;
        position: absolute;
        color: var(--bg-main-color);
        left: 30%;
      }
    }
    `;
  GM_addStyle(css);
})();