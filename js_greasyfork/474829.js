// ==UserScript==
// @name        暴力猴控制台美化
// @namespace   Violentmonkey Scripts
// @match       https://greasyfork.org/zh-CN/users/*
// @grant       none
// @version     0.1.6
// @author      aliha
// @description 美化暴力猴控制台|
// @icon
// @run-at
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/474829/%E6%9A%B4%E5%8A%9B%E7%8C%B4%E6%8E%A7%E5%88%B6%E5%8F%B0%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/474829/%E6%9A%B4%E5%8A%9B%E7%8C%B4%E6%8E%A7%E5%88%B6%E5%8F%B0%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  'use strict';


  const topHeight = 42;
  const menuItems = [
    { className: 'script-list-sort', title: '脚本排序' },
    { className: 'script-list-filter', title: '生效过滤' },
    { className: 'script-language-filter', title: '编程语言' }
  ];

  const userMenuTextMapping = {
    "发布你编写的脚本": "发布脚本",
    "发布你编写的样式": "发布样式",
    "新建脚本收藏集": "新建收藏",
    "设置 webhook": "Webhook",
    "编辑账号信息": "账号信息",
    "更改登录方式": "登录方式",
    "编辑通知": "通知方式",
    "退出": "退出登录"
  };

  // 设置脚本菜单小标题
  function SetScriptListTitle() {
    const headerElement = document.querySelector("#user-script-list-section header");
    const h3Element = headerElement.querySelector("h3");
    const divElement = document.createElement("div");
    divElement.id = "user-script-list-view-all"
    divElement.textContent = h3Element.textContent;
    headerElement.replaceChild(divElement, h3Element);
  }

  // 添加菜单
  function AddMenu() {
    // 获取具有ID "left-menu" 的父元素
    var leftMenu = document.getElementById("left-menu");

    // 创建一个包含类名 "list-option-title" 和文本内容 "相关讨论" 的<div>元素
    var relatedDiscussionsDiv = document.createElement("div");
    relatedDiscussionsDiv.id = "user-discussions-on-scripts-written-menu";
    let relatedDiscussionsMenuDiv = document.createElement("div")
    relatedDiscussionsMenuDiv.className = "list-option-title";
    relatedDiscussionsMenuDiv.textContent = "相关讨论";
    relatedDiscussionsDiv.appendChild(relatedDiscussionsMenuDiv);

    // 创建一个包含一个<ul>元素和一个<li>元素的<div>元素
    var relatedDiscussionsList = document.createElement("ul");
    var relatedDiscussionsListItem = document.createElement("li");
    relatedDiscussionsListItem.id = "user-discussions-on-scripts-written-view-all"
    relatedDiscussionsListItem.className = "list-option";
    relatedDiscussionsListItem.textContent = "查看所有";
    relatedDiscussionsList.appendChild(relatedDiscussionsListItem);
    relatedDiscussionsDiv.appendChild(relatedDiscussionsList);

    // 同样的方式创建其他三个<div>元素，分别对应不同的标题和内容

    // 创建 "近期评论" 的<div>元素
    var recentCommentsDiv = document.createElement("div");
    recentCommentsDiv.id = "user-discussions-menu";
    let recentCommentsMenuDiv = document.createElement("div")
    recentCommentsMenuDiv.className = "list-option-title";
    recentCommentsMenuDiv.textContent = "近期评论";
    recentCommentsDiv.appendChild(recentCommentsMenuDiv)

    var recentCommentsList = document.createElement("ul");
    var recentCommentsListItem = document.createElement("li");
    recentCommentsListItem.id = "user-discussions-view-all";
    recentCommentsListItem.className = "list-option";
    recentCommentsListItem.textContent = "查看评论";
    recentCommentsList.appendChild(recentCommentsListItem);
    recentCommentsDiv.appendChild(recentCommentsList);

    // 创建 "近期私信" 的<div>元素
    var recentMessagesDiv = document.createElement("div");
    recentMessagesDiv.id = "user-conversations-menu";
    let recentMessagesMenuDiv = document.createElement("div");
    recentMessagesMenuDiv.className = "list-option-title";
    recentMessagesMenuDiv.textContent = "近期私信";
    recentMessagesDiv.appendChild(recentMessagesMenuDiv);

    var recentMessagesList = document.createElement("ul");
    var recentMessagesListItem = document.createElement("li");
    recentMessagesListItem.id = "user-conversations-view-all";
    recentMessagesListItem.textContent = "查看私信";
    recentMessagesList.appendChild(recentMessagesListItem);
    recentMessagesDiv.appendChild(recentMessagesList);

    // 创建 "脚本收藏" 的<div>元素
    var scriptFavoritesDiv = document.createElement("div");
    scriptFavoritesDiv.id = "user-script-sets-section-menu";
    let scriptFavoritesMenuDiv = document.createElement("div");
    scriptFavoritesMenuDiv.className = "list-option-title";
    scriptFavoritesMenuDiv.textContent = "脚本收藏";
    scriptFavoritesDiv.appendChild(scriptFavoritesMenuDiv);

    var scriptFavoritesList = document.createElement("ul");
    var scriptFavoritesListItem = document.createElement("li");
    scriptFavoritesListItem.id = "user-script-sets-section-view-all";
    scriptFavoritesListItem.textContent = "查看收藏";
    scriptFavoritesList.appendChild(scriptFavoritesListItem);
    scriptFavoritesDiv.appendChild(scriptFavoritesList);

    // 插入这四个<div>元素到具有ID "left-menu" 的父元素下
    leftMenu.appendChild(relatedDiscussionsDiv);
    leftMenu.appendChild(recentCommentsDiv);
    leftMenu.appendChild(recentMessagesDiv);
    leftMenu.appendChild(scriptFavoritesDiv);

  }

  // 绑定事件
  function BindEvent() {

    function clickEvent() {

      // 获取"查看所有"元素
      var btn0 = document.getElementById('user-script-list-view-all');
      var btn1 = document.getElementById('user-discussions-on-scripts-written-view-all');
      var btn2 = document.getElementById('user-discussions-view-all');
      var btn3 = document.getElementById('user-conversations-view-all');
      var btn4 = document.getElementById('user-script-sets-section-view-all');
      let tdiv0 = document.getElementById('user-script-list');
      let tdiv1 = document.getElementById('user-discussions-on-scripts-written');
      let tdiv2 = document.getElementById('user-discussions');
      let tdiv3 = document.getElementById('user-conversations');
      let tdiv4 = document.getElementById('user-script-sets-section');

      // 添加点击事件监听器
      btn0.addEventListener("click", function () {
        tdiv0.style.display = "block";
        tdiv1.style.display = "none";
        tdiv2.style.display = "none";
        tdiv3.style.display = "none";
        tdiv4.style.display = "none";
      });
      btn1.addEventListener("click", function () {
        tdiv0.style.display = "none";
        tdiv1.style.display = "block";
        tdiv2.style.display = "none";
        tdiv3.style.display = "none";
        tdiv4.style.display = "none";
      });
      btn2.addEventListener("click", function () {
        tdiv0.style.display = "none";
        tdiv1.style.display = "none";
        tdiv2.style.display = "block";
        tdiv3.style.display = "none";
        tdiv4.style.display = "none";
      });
      btn3.addEventListener("click", function () {
        tdiv0.style.display = "none";
        tdiv1.style.display = "none";
        tdiv2.style.display = "none";
        tdiv3.style.display = "block";
        tdiv4.style.display = "none";
      });
      btn4.addEventListener("click", function () {
        tdiv0.style.display = "none";
        tdiv1.style.display = "none";
        tdiv2.style.display = "none";
        tdiv3.style.display = "none";
        tdiv4.style.display = "block";
      });
    }

    clickEvent();

  }

  // 更改右侧菜单的标题
  function ModifyScriptListTitle(className, titleName) {
    const parentElement = document.getElementById(className);
    const originalTextElement = parentElement.firstChild;
    parentElement.removeChild(originalTextElement);
    const titleDiv = document.createElement('div');
    titleDiv.className = 'list-option-title';
    titleDiv.textContent = titleName;
    parentElement.insertBefore(titleDiv, parentElement.firstChild);
  }

  // 移动菜单
  function MoveMenu() {
    const leftMenuDiv = document.createElement("div");
    leftMenuDiv.className = "user-menus";
    leftMenuDiv.id = "left-menu";


    // 获取要移动的元素
    var discussionsSection = document.getElementById("user-discussions-on-scripts-written");
    var discussions = document.getElementById("user-discussions");
    var conversations = document.getElementById("user-conversations");
    var scriptSetsSection = document.getElementById("user-script-sets-section");

    // 获取要移动到的目标元素
    var scriptListSection = document.getElementById("user-script-list-section");

    // 将 discussionsSection 移动到 scriptListSection 中
    scriptListSection.appendChild(discussionsSection);

    // 将 discussions 移动到 scriptListSection 中
    scriptListSection.appendChild(discussions);

    // 将 conversations 移动到 scriptListSection 中
    scriptListSection.appendChild(conversations);

    // 将 scriptSetsSection 移动到 scriptListSection 中
    scriptListSection.appendChild(scriptSetsSection);

    // 设置移动后的元素为隐藏
    discussionsSection.style.display = "none";
    discussions.style.display = "none";
    conversations.style.display = "none";
    scriptSetsSection.style.display = "none";


    const sectionsToMove = [
      "about-user",
    ];

    const sidebarred = document.querySelector(".sidebarred");
    sidebarred.insertBefore(leftMenuDiv, sidebarred.firstChild);

    sectionsToMove.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      leftMenuDiv.appendChild(section);
    });

    const textContentElements = document.querySelectorAll('.text-content');
    textContentElements.forEach(element => {
      element.style.margin = '0';
      element.style.border = 'none';
      element.style.borderRadius = '0';
      element.style.boxShadow = 'none';
    });

  }

  // 修改用户菜单
  function ModifyUserMenu() {

    // 获取要替换的<h3>元素
    var h3Element = document.querySelector("#control-panel header h3");

    // 创建一个新的<div>元素
    var divElement = document.createElement("div");
    divElement.textContent = h3Element.textContent; // 将文本内容复制到新的<div>元素

    // 用新的<div>元素替换掉<h3>元素
    h3Element.parentNode.replaceChild(divElement, h3Element);

    const controlPanelLinks = document.querySelectorAll("#user-control-panel li a");
    controlPanelLinks.forEach(link => {
      const originalText = link.textContent.trim();
      const newText = userMenuTextMapping[originalText];
      if (newText) {
        link.textContent = newText;
      }
    });
    const aboutUserSection = document.getElementById("about-user");
    const reportLink = aboutUserSection.querySelector(".report-link");
    const h2Element = aboutUserSection.querySelector("h2");
    const right = document.querySelector('.sidebar.collapsed');
    const elementToRemove = right.querySelector('.close-sidebar');
    // 获取带有 open-sidebar 类的元素
    var colltag = document.querySelector(".open-sidebar");

    // 检查元素是否存在
    if (colltag) {
      // 使用 remove 方法移除元素
      colltag.remove();
    }


    // 检查元素是否存在，然后将其删除
    if (elementToRemove) {
      elementToRemove.remove(); // 删除元素
    }

    if (reportLink) {
      reportLink.remove();
    }

    if (h2Element) {
      h2Element.remove();
    }
  }

  // 添加 CSS 样式
  function AddCustomStyles() {
    const style_css = document.createElement('style');
    style_css.textContent = `
    /* CSS 样式内容 */

    /* 隐藏浏览器默认的滚动条 */
    ::-webkit-scrollbar {
        width: 0px; /* 设置滚动条宽度 */
    }

    /* 滚动条轨道 */
    ::-webkit-scrollbar-track {
        background-color: #f1f1f1; /* 设置滚动条轨道背景颜色 */
    }

    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb {
        background-color: #888; /* 设置滚动条滑块颜色 */
        border-radius: 6px; /* 设置滑块边角的圆角 */
    }

    /* 当鼠标悬停在滑块上时 */
    ::-webkit-scrollbar-thumb:hover {
        background-color: #555; /* 设置滚动条滑块的悬停颜色 */
    }

    html, body{
        margin: 0;
        padding: 0;
        height: 100%;
        overflow: hidden;
    }

    body {
      display: flex;
      flex-direction: column;
    }
    
    ul, ol{
        list-style-type: none;
        margin:0;
       
    }



    p {
      margin-top:0;
      margin-left:20px;
    }
    
    .width-constraint {
        margin: 0;
        height: 100%;
        max-width: 100%;
    }
    
    #main-header {
      background-color: #545c64;
      box-shadow: none;
    }
    
    #main-header a {
      text-decoration: none;
    }
    
    #site-name img {
      display: none;
    }
    
    .sidebarred {
      display:flex;
      height: 100%;
      max-height:88vh;
    }
    
    .sidebar.collapsed, .sidebarred-main-content {
      margin: 0;
      padding: 0;
    }
    
    .sidebar {
      width: 200px;
      min-width:200px;
      max-width:200px;
      background-color: #6e767d; 
      flex:1;
      margin:0;
    }
    
    .sidebarred-main-content {
      border: none;
      max-width: 100%;
      background-color: #e9e9eb;
      margin-left: auto;
      height:100%;
      
    }

    .sidebarred-main-content a {
      white-space:normal;
    }
    
    #about-user, .text-content {
        margin: 0;
        border: none;
        border-radius: 0;
        box-shadow: none;
        padding:0;
    }

    #user-control-panel {
      background-color: #dcdfe6;
    }
    
    a {
        text-decoration: none;
    }
    
    #left-menu {
        width:160px;
        min-width:160px;
        max-width:160px;
        background-color:#6e767d;
        flex:1;
    }

    .user-menus ul {
      background-color:#dcdfe6;
      padding:0;
      align-items:center;
    }

    .user-menus li{
      display: flex; 
      color:#a42121;
      width:100%;
      cursor: pointer;
      height:28px;
      width:100%;
      align-items: center; 
      justify-content: space-around;
      text-align: center;
    }

    .user-menus li:hover {
      background-color:white;
    }
    
    /* 搜索选项 */
    .close-sidebar, .list-option-title,  #control-panel div  {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background-color: #545c64; 
        color: #fff; 
        height:21px;
    }
    .list-option  {
        cursor: pointer;
    }
    
    /* 设置字体颜色为 #e7bf4b 并加粗 */
    .close-sidebar div {
        color: #e7bf4b; 
        font-weight: bold; 
        font-family: "黑体", sans-serif; 
    }
    
    .close-sidebar .sidebar-title,
    .close-sidebar div:nth-child(2) {
        visibility: hidden;
    }
    
    /* 搜索选项 - 选项菜单 */
    .list-option-groups {
        justify-content: space-between;
        align-items: center;
        padding: 0px;
        cursor: pointer;
        background-color: #e9eef3;
    }

    .list-option-groups div {
      cursor:default;
    }
    
    .list-option-group {
        padding: 0;
        margin: 0;
    }
    
    .list-option-title, #control-panel div {
        background-color: #6e767d;
        font-weight: bold;
        font-size: 16px;
    }
    
    .list-option-group ul {
        box-shadow: none;
        border: none;
        border-radius: 0;
        margin-top: 0;
        margin-bottom: 0;
        padding-top: 0;
        padding-bottom: 0;
        background-color: #DCDFE6;
    }
    
    .list-option-group a {
        text-decoration: none;
    }
    
    .list-option-group .list-current {
        border-left: none;
        box-shadow: none;
        margin: 0;
        padding: .4em 1em .4em calc(1em - 3px);
        background: #F2F6FC;
    }
    
    /* 脚本列表 - 脚本list */
    #user-script-list {
        border: none;
        padding-top: 0;
        margin-top: 0;
        background: none;
        box-shadow: none;
        overflow-y: auto;
        max-height: 82vh;
    }
    
    #user-script-list-section {
        margin: 0;
        padding: 0;
    }
    
    #user-script-list-section li, 
    .discussion-list-item{
        border-bottom: 1px solid #ccc;
        border-radius: 2px;
        margin-bottom: 2px;
        list-style: none;
        background-color: #ffffff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        margin: 5px;
        padding: 15px;
        display: flex;
        flex-direction: column;
        transition: box-shadow 0.3s ease, background-color 0.3s ease;
    }

    #user-script-list-section li:hover {
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); 
      background-color: #f0f0f0; 
    }
    
    /* 脚本列表 - 脚本title */
    #user-script-list-view-all {
        background-color: #545c64;
        color: #fff; 
        padding: 0;
        height: 41px;
        display: flex;
        justify-content: center;
        cursor:pointer;
    }
    
    #user-script-list-section header div {
        display: flex;
        align-items: center;
        justify-content: space-around;
        text-align: center;
        width: 100%;
        height: 41px;
        color: #e7bf4b;
        font-weight: bold;
        font-family: "黑体", sans-serif;
    }

    #user-script-list-section header h3{
      margin-left:12px;
    }

    #user-discussions ul, #user-script-sets-section ul{
      padding:0;
    }
    #user-discussions .text-content, 
    #user-script-sets-section .text-content, 
    #user-discussions-on-scripts-written .text-content,
    #user-conversations .text-content{
      background-color: transparent;
    }

      /* ... */
    `;
    document.head.appendChild(style_css);
  }

  menuItems.forEach(menuItem => {
    ModifyScriptListTitle(menuItem.className, menuItem.title);
  });

  SetScriptListTitle();
  MoveMenu();
  ModifyUserMenu();
  AddMenu();
  BindEvent();
  AddCustomStyles();



})();
