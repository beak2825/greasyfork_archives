// ==UserScript==
// @name         Sun Yat-Sen University Course Registering Tool
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  GUI tool for course registering of Sun Yat-Sen University
// @author       Annonymous Student
// @match        https://jwxt.sysu.edu.cn/jwxt/mk/courseSelection/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sysu.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460366/Sun%20Yat-Sen%20University%20Course%20Registering%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/460366/Sun%20Yat-Sen%20University%20Course%20Registering%20Tool.meta.js
// ==/UserScript==

(async function() {

  'use strict'

  const ALLOW_USE_AFTER_DATE = new Date(2023, 1, 1);
  const FORCE_REFRESH_TIMEOUT = 10000;
  const REFRESH_INTERVAL = 800;
  const REFRESH_SHAKE = 100;

  // Wait until the course list element exists
  let awaitLoad = function() {
    let targetElement = document.querySelector(".stu-xk div .stu-xk-tab div>.stu-xk-con .stu-xk-bot");
    if (targetElement) {
      return Promise.resolve(targetElement);
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(awaitLoad());
      }, 100);
    });
  }

  await awaitLoad();

  // Import react, babel core, moment and antd
  let antdVersion = 5;

  let reactScript = document.createElement("script");
  reactScript.src = "https://unpkg.com/react@18/umd/react.production.min.js";
  reactScript.async = false;
  document.head.append(reactScript);
  let reactDomScript = document.createElement("script");
  reactDomScript.src = "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js";
  reactDomScript.async = false;
  document.head.append(reactDomScript);
  let babelScript = document.createElement("script");
  babelScript.src = "https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.26.0/babel.min.js";
  babelScript.async = false;
  document.head.append(babelScript);
  if (antdVersion === 3) {
    let momentScript = document.createElement("script");
    momentScript.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js";
    momentScript.async = false;
    document.head.append(momentScript);
    let antdScript = document.createElement("script");
    antdScript.src = "https://cdn.jsdelivr.net/npm/antd@3.26.20/dist/antd.min.js";
    antdScript.async = false;
    document.head.append(antdScript);
    // let antdStyle = document.createElement("link");
    // antdStyle.rel = "stylesheet";
    // antdStyle.href = "https://cdn.jsdelivr.net/npm/antd@3.26.20/dist/antd.css";
    // document.head.append(antdStyle);
  }
  else {
    let dayjsScript = document.createElement("script");
    dayjsScript.src = "https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.4/dayjs.min.js";
    dayjsScript.async = false;
    document.head.append(dayjsScript);
    let antdScript = document.createElement("script");
    antdScript.src = "https://cdn.jsdelivr.net/npm/antd@5.1.6/dist/antd.min.js";
    antdScript.async = false;
    document.head.append(antdScript);
    let antdIcons = document.createElement("script");
    antdIcons.src = "https://cdn.jsdelivr.net/npm/@ant-design/icons@5.0.1/dist/index.umd.min.js";
    antdIcons.async = false;
    document.head.append(antdIcons);
    // let antdStyle = document.createElement("link");
    // antdStyle.rel = "stylesheet";
    // antdStyle.href = "https://cdn.jsdelivr.net/npm/antd@5.1.6/dist/reset.css";
    // document.head.append(antdStyle);
  }

  /*** Util functions ***/
  function waitForElm(selector, exist=true) {
    if (exist) {
      return new Promise(resolve => {
          if (document.querySelector(selector)) {
              return resolve(document.querySelector(selector));
          }

          const observer = new MutationObserver(mutations => {
              if (document.querySelector(selector)) {
                  resolve(document.querySelector(selector));
                  observer.disconnect();
              }
          });

          observer.observe(document.body, {
              childList: true,
              subtree: true
          });
      });
    }
    else {
      return new Promise(resolve => {
          if (!document.querySelector(selector)) {
              return resolve();
          }

          const observer = new MutationObserver(mutations => {
              if (!document.querySelector(selector)) {
                  resolve();
                  observer.disconnect();
              }
          });

          observer.observe(document.body, {
              childList: true,
              subtree: true
          });
      });
    }
  }

  async function refreshList() {
    let searchBtn = document.querySelector("button.ant-btn.ant-input-search-button.ant-btn-primary.ant-btn-two-chinese-chars");
    searchBtn.click();
    
    let process = false;
    function waitFetch() {
      let mask = document.querySelector(".stu-xk>.stu-xk-list-loading");
      process = !(mask.style.display === "none");
      if (process) {
        return new Promise(resolve => setTimeout(async () => {
          await waitFetch();
          resolve();
        }, 0));
      }
      return Promise.resolve();
    }
    let forceRefreshTimer = setTimeout(function forceRefresh() {
      console.log("[E]: Refresh takes unexpected long time");
      console.log("[E]: Force refreshing");
      searchBtn.click();
      forceRefreshTimer = setTimeout(forceRefresh, FORCE_REFRESH_TIMEOUT);
    }, FORCE_REFRESH_TIMEOUT);
    await waitFetch();
    clearTimeout(forceRefreshTimer);
  }

  async function getRegisterResult() {
    let modal = await waitForElm(".ant-modal-mask+.ant-modal-wrap>.ant-modal");
    if (modal.classList.contains('ant-confirm-success')) {
      let closeBtn = modal.querySelector(".ant-confirm-btns>button.ant-btn.ant-btn-primary");
      closeBtn.click();
      await waitForElm(".ant-modal-mask+.ant-modal-wrap>.ant-modal", false);
      return '成功';
    }
    else if (modal.classList.contains('ant-confirm-info')) {
      let closeBtn = modal.querySelector(".ant-confirm-btns>button.ant-btn.ant-btn-primary");
      closeBtn.click();
      await waitForElm(".ant-modal-mask+.ant-modal-wrap>.ant-modal", false);
      return '冲突';
    }
    console.log("[E]: Unknown register result");
    let closeBtn = modal.querySelector(".ant-confirm-btns>button.ant-btn.ant-btn-primary");
    closeBtn.click();
    await waitForElm(".ant-modal-mask+.ant-modal-wrap>.ant-modal", false);
    return '失败';
  }

  async function attemptRegisterCourse(courseId) {
    let courseElements = document.querySelectorAll('.stu-xk-bot>div.stu-xk-bot-con.stu-xk-bot-my>ul li');
    let courseElement = [...courseElements].find(element => {
      return element.firstElementChild.firstElementChild.textContent.split("-")[0] === courseId;
    });
    if (!courseElement) {
      console.log("[E]: Course " + courseId + " not found");
      return {
        status: "失效",
        icon: "ant-badge-status-error"
      };
    }
    let registerBtn = courseElement.querySelector(".stu-xk-bot-r .stu-xk-bot-r-filtrate .thems:not(.register-course-btn)");
    if (!registerBtn) {
      return {
        status: "等候",
        icon: "ant-badge-status-processing"
      };
    }
    registerBtn.click();
    let result = await getRegisterResult();
    if (result === '成功') {
      return {
        status: "成功",
        icon: "ant-badge-status-success"
      };
    }
    else if (result === '冲突') {
      return {
        status: "冲突",
        icon: "ant-badge-status-error"
      };
    }
    else {
      return {
        status: "失败",
        icon: "ant-badge-status-error"
      };
    }
  }

  /*** Create GUI elements ***/
  // Select the course list element
  let courseListElement = document.querySelector(".stu-xk div .stu-xk-tab div>.stu-xk-con .stu-xk-bot");
  // Create gui container
  let guiContainer = document.createElement("div");
  guiContainer.style.width = "100%";
  guiContainer.style.marginTop = "16px";
  guiContainer.style.padding = "16px 22px";
  guiContainer.style.backgroundColor = "#fff";
  // Insert gui container before the course list
  courseListElement.before(guiContainer);
  // Create title
  let guiTitle = document.createElement("h6");
  guiTitle.style.fontWeight = "600";
  guiTitle.style.fontFamily = "Microsoft YaHei";
  guiTitle.style.fontSize = "17px";
  guiTitle.style.color = "#1890ff";
  guiTitle.innerText = "我的选课单";
  let titleListSeparator = document.createElement("div");
  titleListSeparator.style.width = "100%";
  titleListSeparator.style.height = "2px";
  titleListSeparator.style.marginTop = "8px";
  titleListSeparator.style.marginBottom = "0px";
  titleListSeparator.style.backgroundColor = "#d6ebff";
  guiContainer.append(guiTitle);
  guiContainer.append(titleListSeparator);
  // Create course list
  let wrapper_stu_xk = document.createElement("div");
  wrapper_stu_xk.classList.add("stu-xk");
  wrapper_stu_xk.style.width = "100%";
  wrapper_stu_xk.style.margin = "0";
  let wrapper_stu_xk_tab = document.createElement("div");
  wrapper_stu_xk_tab.classList.add("stu-xk-tab");
  let wrapper_stu_xk_con = document.createElement("div");
  wrapper_stu_xk_con.classList.add("stu-xk-con");
  let wrapper_stu_xk_bot = document.createElement("div");
  wrapper_stu_xk_bot.classList.add("stu-xk-bot");
  wrapper_stu_xk_bot.style.margin = "0";
  wrapper_stu_xk_bot.style.padding = "0";
  let wrapper_stu_xk_bot_con = document.createElement("div");
  wrapper_stu_xk_bot_con.classList.add("stu-xk-bot-con");
  let guiCourseList = document.createElement("ul");
  guiCourseList.style.width = "100%";
  guiCourseList.style.height = "auto";
  guiCourseList.style.padding = "0";
  guiCourseList.style.margin = "0";
  guiCourseList.style.listStyle = "none";
  wrapper_stu_xk.append(wrapper_stu_xk_tab);
  wrapper_stu_xk_tab.append(wrapper_stu_xk_con);
  wrapper_stu_xk_con.append(wrapper_stu_xk_bot);
  wrapper_stu_xk_bot.append(wrapper_stu_xk_bot_con);
  wrapper_stu_xk_bot_con.append(guiCourseList);
  guiContainer.append(wrapper_stu_xk);
  // Create Start Button
  let guiStartButton = document.createElement("button");
  guiStartButton.style.width = "90px";
  guiStartButton.style.height = "40px";
  guiStartButton.style.float = "right";
  guiStartButton.style.marginTop = "14px";
  guiStartButton.style.backgroundColor = "#c9c9c9";
  guiStartButton.style.color = "white";
  guiStartButton.style.border = "none";
  guiStartButton.style.borderRadius = "4px";
  guiStartButton.style.fontSize = "14px";
  guiStartButton.style.cursor = "not-allowed";
  guiStartButton.innerText = "暂无课程";
  guiStartButton.onclick = null;
  guiCourseList.parentElement.append(guiStartButton);
  // Create clear div
  let clearDiv = document.createElement("div");
  clearDiv.style.clear = "both";
  guiCourseList.parentElement.append(clearDiv);
  // Create course register function
  let guiIsRegistering = false;
  function stopRegister() {
    guiIsRegistering = false;
    guiStartButton.style.backgroundColor = "#1890ff";
    guiStartButton.style.cursor = "pointer";
    guiStartButton.innerText = "开始抢课";
    guiStartButton.onclick = function() {
      guiIsRegistering = true;
      guiRegisterAll();
    };
    // Change course status
    let courseList = guiCourseList.querySelectorAll("li");
    for (let i = 0; i < courseList.length; i++) {
      let courseStatus = courseList[i].children[2].lastElementChild;
      if (courseStatus.innerText === "等候" || courseStatus.innerText === "尝试") {
        courseStatus.innerText = "未选";
        courseStatus.previousElementSibling.classList.remove("ant-badge-status-processing");
        courseStatus.previousElementSibling.style.backgroundColor = "#1890ff";
      }
    }
  }
  function guiRegisterAll() {
    if (!guiIsRegistering) {
      return;
    }

    // Test if the module is allowed to run
    let currentDate = new Date();
    if (currentDate < ALLOW_USE_AFTER_DATE) {
      antd.Modal.error({
        content: '受限于作者，模块于2023-3-1日开放使用'
      });
      function hideModalIcon() {
        let modalIcon = document.querySelector(".ant-modal-confirm-body-wrapper>.ant-modal-confirm-body>span>svg");
        if (modalIcon === null) {
          setTimeout(hideModalIcon, 0);
          return;
        }
        modalIcon.style.display = "none";
      }
      hideModalIcon();
      stopRegister();
      return;
    }

    // Check current course selection stage
    let statusText = document.querySelector(".stu-xk-crumbs+.stu-xk-top .stu-xk-top-r .ant-divider+div>p+.stu-xk-top-r-b").innerText;
    if (statusText === "正选") {
      // Not the third round, display message box
      antd.Modal.warning({
        content: '当前不在抢选阶段，无法进行抢课'
      });
      function hideModalIcon() {
        let modalIcon = document.querySelector(".ant-modal-confirm-body-wrapper>.ant-modal-confirm-body>span>svg");
        if (modalIcon === null) {
          setTimeout(hideModalIcon, 0);
          return;
        }
        modalIcon.style.display = "none";
      }
      hideModalIcon();
      stopRegister();
      return;
    }

    // Change button status
    guiStartButton.style.backgroundColor = "#d85a5a";
    guiStartButton.style.cursor = "pointer";
    guiStartButton.innerText = "停止抢课";
    guiStartButton.onclick = stopRegister;

    // Change course status
    let courseList = guiCourseList.querySelectorAll("li");
    for (let i = 0; i < courseList.length; i++) {
      let courseStatus = courseList[i].children[2].lastElementChild;
      if (courseStatus.innerText === "未选" || courseStatus.innerText === "失效") {
        courseStatus.innerText = "等候";
        courseStatus.previousElementSibling.classList.add("ant-badge-status-processing");
        courseStatus.previousElementSibling.style.backgroundColor = null;
      }
    }

    // Start register
    let courses = [...courseList].map(course => {
      return {
        courseId: course.dataset.courseId,
        courseStatus: course.children[2].lastElementChild.innerText,
        courseElement: course
      };
    });
    async function registerAll() {
      if (!guiIsRegistering) {
        return;
      }
      await refreshList();
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].courseStatus === "等候" || courses[i].courseStatus === "失效") {
          let courseStatusText = courses[i].courseElement.children[2].lastElementChild;
          let courseStatusIcon = courses[i].courseElement.children[2].firstElementChild;
          courseStatusText.innerText = "尝试";
          let registerResult = await attemptRegisterCourse(courses[i].courseId);
          courseStatusText.innerText = registerResult.status;
          courseStatusIcon.classList.remove("ant-badge-status-processing");
          courseStatusIcon.classList.remove("ant-badge-status-error");
          courseStatusIcon.classList.remove("ant-badge-status-success");
          courseStatusIcon.classList.add(registerResult.icon);
          courses[i].status = registerResult.status;
          courses[i].courseStatus = registerResult.status;
        }
      }
      let randomShake = Math.random() * REFRESH_SHAKE + REFRESH_INTERVAL;
      setTimeout(registerAll, randomShake);
    }
    registerAll();
  }
  // Create course list item
  function guiCreateCourseItem({
    courseId,
    courseDiscriptionElement,
    updateFunc
  }) {
    // Create course container
    let courseContainer = document.createElement("li");
    courseContainer.dataset.courseId = courseId;
    courseContainer.style.width = "100%";
    courseContainer.style.padding = "12px 0";
    courseContainer.style.margin = "0";
    courseContainer.style.borderBottom = "1px solid #e9e9e9";
    courseContainer.style.display = "flex";
    courseContainer.style.flexDirection = "row";
    courseContainer.style.alignItems = "center";
    // Create course index
    let courseIndex = document.createElement("span");
    courseIndex.style.width = "32px";
    courseIndex.style.margin = "0 8px";
    courseIndex.style.fontWeight = "600";
    courseIndex.style.fontFamily = "Microsoft YaHei";
    courseIndex.style.fontSize = "18px";
    courseIndex.style.color = "#404040";
    courseIndex.innerText = "" + (guiCourseList.childElementCount + 1);
    courseIndex.display = "inline-block";
    // Create course status
    let courseStatus = document.createElement("span");
    courseStatus.style.width = "70px";
    courseStatus.style.verticalAlign = "10px";
    courseStatus.style.textAlign = "center";
    courseStatus.style.margin = "0 8px";
    let courseStatusDot = document.createElement("span");
    courseStatusDot.classList.add("ant-badge-status-dot");
    courseStatusDot.style.backgroundColor = "#1890ff";
    let courseStatusText = document.createElement("span");
    courseStatusText.classList.add("ant-badge-status-text");
    courseStatusText.innerText = "未选";
    courseStatus.append(courseStatusDot);
    courseStatus.append(courseStatusText);
    // Create course operation button
    let courseOperation = document.createElement("div");
    courseOperation.style.width = "180px";
    courseOperation.style.display = "flex";
    courseOperation.style.justifyContent = "space-around";
    courseOperation.style.alignItems = "center";
    courseOperation.style.margin = "0 8px";
    function uplift(event) {
      let currentCourseElement = event.target.parentElement.parentElement;
      let previousCourseElement = currentCourseElement.previousElementSibling;
      if (+previousCourseElement.firstElementChild.innerText == 1) {
        let currentCourseUpliftButton = currentCourseElement.querySelector(".thems");
        currentCourseUpliftButton.style.setProperty("color", "#d9d9d9", "important");
        currentCourseUpliftButton.onclick = null;
        currentCourseUpliftButton.style.cursor = "default";
        let previousCourseUpliftButton = previousCourseElement.querySelector(".thems");
        previousCourseUpliftButton.style.setProperty("color", "#1890ff", "important");
        previousCourseUpliftButton.onclick = uplift;
        previousCourseUpliftButton.style.cursor = "pointer";
      }
      if (+currentCourseElement.firstElementChild.innerText == guiCourseList.childElementCount) {
        let previousCourseDownliftButton = previousCourseElement.querySelectorAll(".thems")[1];
        previousCourseDownliftButton.style.setProperty("color", "#d9d9d9", "important");
        previousCourseDownliftButton.onclick = null;
        previousCourseDownliftButton.style.cursor = "default";
        let currentCourseDownliftButton = currentCourseElement.querySelectorAll(".thems")[1];
        currentCourseDownliftButton.style.setProperty("color", "#1890ff", "important");
        currentCourseDownliftButton.onclick = downlift;
        currentCourseDownliftButton.style.cursor = "pointer";
      }
      let temp = currentCourseElement.firstElementChild.innerText;
      currentCourseElement.firstElementChild.innerText = previousCourseElement.firstElementChild.innerText;
      previousCourseElement.firstElementChild.innerText = temp;
      previousCourseElement.before(currentCourseElement);
    }
    function downlift(event) {
      let currentCourseElement = event.target.parentElement.parentElement;
      let nextCourseElement = currentCourseElement.nextElementSibling;
      if (+nextCourseElement.firstElementChild.innerText == guiCourseList.childElementCount) {
        let currentCourseDownliftButton = currentCourseElement.querySelectorAll(".thems")[1];
        currentCourseDownliftButton.style.setProperty("color", "#d9d9d9", "important");
        currentCourseDownliftButton.onclick = null;
        currentCourseDownliftButton.style.cursor = "default";
        let nextCourseDownliftButton = nextCourseElement.querySelectorAll(".thems")[1];
        nextCourseDownliftButton.style.setProperty("color", "#1890ff", "important");
        nextCourseDownliftButton.onclick = downlift;
        nextCourseDownliftButton.style.cursor = "pointer";
      }
      if (+currentCourseElement.firstElementChild.innerText == 1) {
        let nextCourseUpliftButton = nextCourseElement.querySelector(".thems");
        nextCourseUpliftButton.style.setProperty("color", "#d9d9d9", "important");
        nextCourseUpliftButton.onclick = null;
        nextCourseUpliftButton.style.cursor = "default";
        let currentCourseUpliftButton = currentCourseElement.querySelector(".thems");
        currentCourseUpliftButton.style.setProperty("color", "#1890ff", "important");
        currentCourseUpliftButton.onclick = uplift;
        currentCourseUpliftButton.style.cursor = "pointer";
      }
      let temp = currentCourseElement.firstElementChild.innerText;
      currentCourseElement.firstElementChild.innerText = nextCourseElement.firstElementChild.innerText;
      nextCourseElement.firstElementChild.innerText = temp;
      nextCourseElement.after(currentCourseElement);
    }
    let courseUpliftButton = document.createElement("div");
    courseUpliftButton.classList.add("thems");
    courseUpliftButton.innerText = "上移";
    courseUpliftButton.style.fontSize = "16px";
    courseUpliftButton.style.cursor = "pointer";
    if (guiCourseList.childElementCount == 0) {
      courseUpliftButton.style.setProperty("color", "#d9d9d9", "important");
      courseUpliftButton.onclick = null;
      courseUpliftButton.style.cursor = "default";
    }
    else {
      courseUpliftButton.onclick = uplift;
    }
    let courseDownliftButton = document.createElement("div");
    courseDownliftButton.classList.add("thems");
    courseDownliftButton.innerText = "下移";
    courseDownliftButton.style.fontSize = "16px";
    courseDownliftButton.style.cursor = "default";
    courseDownliftButton.style.setProperty("color", "#d9d9d9", "important");
    courseDownliftButton.onclick = null;
    let courseDeleteButton = document.createElement("div");
    courseDeleteButton.classList.add("thems");
    courseDeleteButton.innerText = "删除";
    courseDeleteButton.style.fontSize = "16px";
    courseDeleteButton.style.cursor = "pointer";
    courseDeleteButton.onclick = function() {
      courseContainer.remove();
      let courseIndexList = guiCourseList.querySelectorAll("li > span:first-child");
      for (let i = 0; i < courseIndexList.length; i++) {
        courseIndexList[i].innerText = "" + (i + 1);
      }
      let firstCourseItem = guiCourseList.firstElementChild;
      if (firstCourseItem) {
        firstCourseItem.lastElementChild.children[0].style.setProperty("color", "#d9d9d9", "important");
        firstCourseItem.lastElementChild.children[0].onclick = null;
        firstCourseItem.lastElementChild.children[0].style.cursor = "default";
      }
      let lastCourseItem = guiCourseList.lastElementChild;
      if (lastCourseItem) {
        lastCourseItem.lastElementChild.children[1].style.setProperty("color", "#d9d9d9", "important");
        lastCourseItem.lastElementChild.children[1].onclick = null;
        lastCourseItem.lastElementChild.children[1].style.cursor = "default";
      }
      if (courseIndexList.length == 0) {
        guiStartButton.style.backgroundColor = "#c9c9c9";
        guiStartButton.style.cursor = "not-allowed";
        guiStartButton.onclick = null;
        guiStartButton.innerText = "暂无课程";
      }
      updateFunc();
    }
    let previousDownLiftButton = guiCourseList.lastElementChild?.lastElementChild.children[1];
    if (previousDownLiftButton) {
      previousDownLiftButton.style.color = null;
      previousDownLiftButton.style.cursor = "pointer";
      previousDownLiftButton.onclick = downlift
    }
    courseOperation.append(courseUpliftButton);
    courseOperation.append(courseDownliftButton);
    courseOperation.append(courseDeleteButton);
    // Create course description
    let courseDescription = courseDiscriptionElement.cloneNode(true);
    courseDescription.style.width = "calc(100% - " + (32 + 70 + 180 + 8 * 8) + "px)";
    courseDescription.style.margin = "0 8px";
    // Append to container
    courseContainer.append(courseIndex);
    courseContainer.append(courseDescription);
    courseContainer.append(courseStatus);
    courseContainer.append(courseOperation);
    // Change register button state
    guiStartButton.style.backgroundColor = "#1890ff";
    guiStartButton.style.cursor = "pointer";
    guiStartButton.innerText = "开始抢课";
    guiStartButton.onclick = function() {
      guiIsRegistering = true;
      guiRegisterAll();
    }
    // Return
    return courseContainer;
  }

  /*** Set observation of the DOM tree to add buttons ***/
  // Create an observer wrapper function
  let observeList = function( callback ) {
    // let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    let courseListElement = document.querySelector('.stu-xk-bot>div[class="stu-xk-bot-con stu-xk-bot-my"] ul');
    let previousChilds = [];

    let wrappedCallback = function() {
      if (previousChilds.length != courseListElement.childElementCount) {
        previousChilds = [...courseListElement.children].map((child) => child.firstElementChild.firstElementChild.textContent);
        callback();
      }
      else {
        for (let i = 0; i < previousChilds.length; i++) {
          if (previousChilds[i] != courseListElement.children[i].firstElementChild.firstElementChild.textContent) {
            previousChilds = [...courseListElement.children].map((child) => child.firstElementChild.firstElementChild.textContent);
            callback();
            break;
          }
        }
      }
    }

    // if( MutationObserver ){
    //   // define a new observer
    //   var mutationObserver = new MutationObserver(wrappedCallback);

    //   // have the observer observe for changes in children
    //   mutationObserver.observe( document, { childList:true, subtree:true });
    //   return mutationObserver;
    // }
    
    // // browser support fallback
    // else if( window.addEventListener ){
    //   document.addEventListener('DOMNodeInserted', wrappedCallback, false);
    //   document.addEventListener('DOMNodeRemoved', wrappedCallback, false);
    //   document.addEventListener('DOMSubtreeModified', wrappedCallback, false);
    // }

    courseListElement.addEventListener('DOMNodeInserted', wrappedCallback, false);
    courseListElement.addEventListener('DOMNodeRemoved', wrappedCallback, false);
    courseListElement.addEventListener('DOMSubtreeModified', wrappedCallback, false);
  }
  // Fetch the course list content element
  let courseListContentElement = document.querySelector('.stu-xk-bot>div[class="stu-xk-bot-con stu-xk-bot-my"]');
  // Create update buttons function
  function updateCourseButtons() {
    // Fetch course element list
    let courseElementList = courseListContentElement.querySelectorAll("ul li");
    // Add buttons to each course element
    courseElementList.forEach(courseElement => {
      // Get the course status
      let status = courseElement.querySelector("div.stu-xk-bot-r div.stu-xk-bot-r-unfiltrate span .ant-badge-status-text");
      // If the course is already registered, skip
      if (status.innerText == "成功" || status.innerText == "待筛选") {
          let previousButton = courseElement.querySelector(".register-course-btn");
          if (previousButton) {
            previousButton.remove();
          }
          return;
      }
      // Otherwise add the button
      let button = document.createElement("span");
      button.classList.add("thems");
      button.classList.add("register-course-btn");
      button.style.fontSize = "16px";
      button.style.marginRight = "10px";
      button.style.cursor = "pointer";
      // Get the course ID
      let courseID = courseElement.querySelector("div.stu-xk-bot-l>.stu-xk-bot-con-title2>span").innerText;
      courseID = courseID.split("-")[0];
      // Create onclick function
      let addRecord;
      let removeRecord = function() {
        // Remove the course from the target course list
        let course = guiCourseList.querySelector("li[data-course-id='" + courseID + "']");
        course.remove();
        let courseIndexList = guiCourseList.querySelectorAll("li > span:first-child");
        for (let i = 0; i < courseIndexList.length; i++) {
          courseIndexList[i].innerText = "" + (i + 1);
        }
        let firstCourseItem = guiCourseList.firstElementChild;
        if (firstCourseItem) {
          firstCourseItem.lastElementChild.children[0].style.setProperty("color", "#d9d9d9", "important");
          firstCourseItem.lastElementChild.children[0].onclick = null;
          firstCourseItem.lastElementChild.children[0].style.cursor = "default";
        }
        let lastCourseItem = guiCourseList.lastElementChild;
        if (lastCourseItem) {
          lastCourseItem.lastElementChild.children[1].style.setProperty("color", "#d9d9d9", "important");
          lastCourseItem.lastElementChild.children[1].onclick = null;
          lastCourseItem.lastElementChild.children[1].style.cursor = "default";
        }
        if (courseIndexList.length == 0) {
          guiStartButton.style.backgroundColor = "#c9c9c9";
          guiStartButton.style.cursor = "not-allowed";
          guiStartButton.onclick = null;
          guiStartButton.innerText = "暂无课程";
        }
        updateCourseButtons();
      };
      addRecord = function() {
        // Add the course to the target course list
        let course = guiCreateCourseItem({
          courseId: courseID,
          courseDiscriptionElement: courseElement.querySelector("div.stu-xk-bot-l"),
          updateFunc: updateCourseButtons
        });
        guiCourseList.append(course);
        // Update the buttons
        button.innerText = "移除";
        button.onclick = removeRecord;
      }
      // Check if the course is already in the target course list
      if (guiCourseList.querySelector("li[data-course-id='" + courseID + "']")) {
        button.innerText = "移除";
        button.onclick = removeRecord;
      }
      else {
        button.innerText = "抢课";
        button.onclick = addRecord;
      }
      let parent = courseElement.querySelector('div.stu-xk-bot-r .stu-xk-bot-r-filtrate');
      let oldButton = parent.querySelector(".register-course-btn");
      if (oldButton) {
          oldButton.remove();
      }
      parent.prepend(button);
      // Adjust the width of the course element
      let leftElement = courseElement.querySelector("div.stu-xk-bot-l");
      let rightElement = courseElement.querySelector("div.stu-xk-bot-r");
      let buttonCount = parent.querySelectorAll("span").length;
      parent.style.minWidth = "" + (20 + 40 * buttonCount) + "px";
      rightElement.style.width = "" + (360 + 100 * buttonCount) + "px";
      leftElement.style.width = "calc(100% - " + (360 + 100 * buttonCount) + "px)";
    });
  }
  // Update the buttons and add the observer
  updateCourseButtons();
  observeList(updateCourseButtons);
})();
