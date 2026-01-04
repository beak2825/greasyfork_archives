// ==UserScript==
// @name         云效助手
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  包含云效项目功能加强、自动登录、快速填写工时、工时提醒
// @author       温华
// @match        https://passport.aliyun.com/havanaone/login/login.htm*
// @match        https://devops.aliyun.com/*
// @match        https://codeup.aliyun.com/*
// @match        https://account.aliyun.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliyun.com
// @license      MIT
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/533632/%E4%BA%91%E6%95%88%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/533632/%E4%BA%91%E6%95%88%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(async function () {
  "use strict";
  let userName = "";
  let password = "";
  var bugIconHtml = `<span class="CardTable--cardIconBox--M9k3BUL"><span class="workitemCategoryIconBox CardTable--cardIcon--39ZirqJ"><i class="teamix-icon teamix-icon-quexian-zhubug-line teamix-medium" style="color: var(--color-error-5, #e84738);"><svg viewBox="0 0 1024 1024"><use xlink:href="#yunxiao-quexian-zhubug-line"></use></svg></i></span></span>`;
  var reqIconHtml = `<span class="CardTable--cardIconBox--M9k3BUL"><span class="workitemCategoryIconBox CardTable--cardIcon--39ZirqJ"><i class="teamix-icon teamix-icon-assign-line teamix-medium" style="color: var(--color-success-5, #23b066);"><svg viewBox="0 0 1024 1024"><use xlink:href="#yunxiao-assign-line"></use></svg></i></span></span>`;
  var taskIconHtml = `<span class="CardTable--cardIconBox--M9k3BUL"><span class="workitemCategoryIconBox CardTable--cardIcon--39ZirqJ"><i class="teamix-icon teamix-icon-file-2-line teamix-medium" style="color: rgb(84, 64, 182);"><svg viewBox="0 0 1024 1024"><use xlink:href="#yunxiao-file-2-line"></use></svg></i></span></span>`;
  var setIconHtml = `<button type="button" class="next-btn next-small next-btn-normal next-btn-text isOnlyIcon isOnlyIcon aone-biz-today-work-setting-line is-yunxiao"><i class="teamix-icon teamix-icon-setting-line teamix-medium"><svg viewBox="0 0 1024 1024"><use xlink:href="#yunxiao-setting-line"></use></svg></i></button>`;

  /**
   * 自动登录
   */
  {
    userName = await GM_getValue("userName", "");
    password = await GM_getValue("password", "");

    if (!userName && location.host !== "passport.aliyun.com") {
      createGetLoginInfo();
    }
    const nameDom = document.querySelector("#fm-login-id");
    const passwordDom = document.querySelector("#fm-login-password");
    if (nameDom && passwordDom) {
      nameDom.value = userName;
      passwordDom.value = password;
      document.querySelector(".password-login").click();
    }
  }

  /**
   * 任务加强
   */
  if (location.host === "devops.aliyun.com") {
    let isLogin = false;
    const login = () => {
      if (isLogin) return;
      const loginDom = document.querySelector(
        ".next-overlay-wrapper .next-dialog-footer button"
      );
      if (loginDom && loginDom.textContent === "重新登录") {
        loginDom.click();
        isLogin = true;
      }
    };
    // 从其他tab切换回来时，需要重新登录
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        login();
      }
    });

    setInterval(() => {
      login();
      document.querySelectorAll(".next-btn").forEach((btn) => {
        const text = btn.querySelector(".teamix-title")?.innerText;
        if (!text) return;
        switch (text) {
          case "待修复":
          case "再次打开":
            btn.style.cssText = "background-color: red !important";
            break;
          case "测试中":
          case "开发中":
            btn.style.cssText = "background-color: #09f !important";
            break;
          case "修复完成":
            btn.style.cssText =
              "background-color: rgb(242, 151, 151) !important";
            break;
        }

        if (testFilter) {
          filterDom(btn, text);
        }
      });
    }, 1000);

    const closest = (el, selector) => {
      let element = el;
      while (element) {
        if (element.matches(selector)) {
          break;
        }
        element = element.parentElement;
      }
      return element;
    };

    const contianer = document.createElement("div");
    contianer.style.position = "fixed";
    contianer.style.top = "28px";
    contianer.style.right = "6px";
    contianer.style.zIndex = "9999";
    document.body.appendChild(contianer);

    const filterBtn = document.createElement("button");
    setBtnStyle(filterBtn);
    filterBtn.style.backgroundColor = "#999";
    filterBtn.innerHTML = "过滤";
    contianer.appendChild(filterBtn);

    const setBtn = document.createElement("span");
    setBtn.innerHTML = setIconHtml;
    setBtn.onclick = () => {
      createGetLoginInfo();
    };
    contianer.appendChild(setBtn);

    const filterChilds = document.createElement("div");
    filterChilds.style.position = "absolute";
    filterChilds.style.top = "24px";
    filterChilds.style.right = "0";
    filterChilds.style.width = "300px";
    filterChilds.style.textAlign = "right";
    filterChilds.style.display = "none";

    contianer.appendChild(filterChilds);

    // 增加多项checkbox按钮
    const btns = [
      {
        text: "测试完成",
        selected: true,
      },
      {
        text: "已取消",
        selected: true,
      },
      {
        text: "已发布",
        selected: true,
      },
      {
        text: "已完成",
        selected: true,
      },
      {
        text: "走查完成",
        selected: true,
      },
    ];
    btns.forEach((item) => {
      const contianer = document.createElement("span");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "test";
      checkbox.value = item.text;
      checkbox.checked = item.selected;
      checkbox.style.zoom = "0.8";
      checkbox.style.position = "relative";
      checkbox.style.top = "1px";
      checkbox.onchange = function () {
        item.selected = !item.selected;
      };
      contianer.appendChild(checkbox);
      const span = document.createElement("span");
      span.style.fontSize = "10px";
      span.innerHTML = item.text;
      contianer.appendChild(span);
      contianer.style.marginLeft = "4px";
      filterChilds.appendChild(contianer);
    });

    let testFilter = false;
    const filterDom = (btn, text = "") => {
      if (text === "") {
        text = btn.querySelector(".teamix-title")?.innerText;
      }
      if (!text) return;
      const filterItem = btns.find((item) => item.text === text);
      if (filterItem) {
        const tr = closest(btn, "tr");
        if (!testFilter) {
          tr.style.display = "";
        } else if (filterItem.selected) {
          tr.style.display = "none";
        } else {
          tr.style.display = "";
        }
      }
    };
    filterBtn.onclick = function () {
      testFilter = !testFilter;
      if (!testFilter) {
        filterBtn.style.backgroundColor = "#999";
        filterChilds.style.display = "none";
      } else {
        filterBtn.style.backgroundColor = "rgb(95, 206, 157)";
        filterChilds.style.display = "block";
      }
      document.querySelectorAll(".next-btn").forEach((btn) => {
        filterDom(btn);
      });
    };
  }

  /**
   * 工时管理
   */
  {
    const getTaskList = async () => {
      const res = await fetch(
        "https://devops.aliyun.com/projex/api/workitem/workitem/list?_input_charset=utf-8",
        {
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
            "cache-control": "no-cache",
            "content-type": "application/json",
            pragma: "no-cache",
            priority: "u=1, i",
            "sec-ch-ua":
              '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-csrf-token": "8rSfd6u3-6ucnCtsANW1H2wEUWab5kwxYL7E",
            "x-requested-with": "XMLHttpRequest",
          },
          referrer: "https://devops.aliyun.com/projex/workitem",
          referrerPolicy: "strict-origin-when-cross-origin",
          body: `{"spaceType":"User","spaceIdentifier":"${unsafeWindow.AONE_GLOBAL.user.identifier}","category":"","toPage":1,"pageSize":100,"conditions":"{\\"conditionGroups\\":[[{\\"fieldIdentifier\\":\\"statusStage\\",\\"operator\\":\\"CONTAINS\\",\\"value\\":[\\"1\\",\\"2\\",\\"6\\",\\"7\\",\\"11\\",\\"12\\",\\"13\\"],\\"toValue\\":null,\\"className\\":\\"statusStage\\",\\"format\\":\\"multiList\\"},{\\"fieldIdentifier\\":\\"assignedTo\\",\\"operator\\":\\"CONTAINS\\",\\"value\\":[\\"${unsafeWindow.AONE_GLOBAL.user.identifier}\\"],\\"toValue\\":null,\\"className\\":\\"user\\",\\"format\\":\\"list\\"}]]}","searchType":"LIST","orderBy":"{\\"fieldIdentifier\\":\\"workitemType\\",\\"format\\":\\"list\\",\\"order\\":\\"desc\\",\\"className\\":\\"workitemType\\"}","scope":"personal"}`,
          method: "POST",
          mode: "cors",
          credentials: "include",
        }
      ).then((res) => {
        return res.json();
      });
      return res.result;
    };
    let recordedHours = 0;
    const showTaskList = async () => {
      if (window.isShowTaskList) return;
      const list = await getTaskList();

      function createTable() {
        var contianer = document.createElement("div");
        contianer.id = "timeContianer";
        GM_addStyle(`
          #timeContianer {
            width: 850px;
            position: fixed;
            background: #fff;
            z-index: 99999;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 26px;
            box-shadow: 0 0px 0px 2000px rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            overflow-y: auto;
            overflow-x: hidden;
            max-height: 800px;
          }
        `);

        const closeDow = document.createElement("div");
        closeDow.id = "closeDow";
        GM_addStyle(`
          #closeDow {
            position: absolute;
            top: 10px;
            right: 10px;
            color: #000;
            font-size: 20px;
            line-height: 17px;
            padding: 4px 2px;
            cursor: pointer;
            font-family: NextIcon;

            &:before {
              content: var(--icon-content-close, "\e626");
            }
          }
        `);
        closeDow.onclick = () => {
          window.isShowTaskList = false;
          contianer.remove();
        };
        contianer.appendChild(closeDow);

        const titleDom = document.createElement("div");
        const selectType = {
          value: localStorage.getItem("selectType") || "develop",
        };
        createSelecter(titleDom, selectType);
        contianer.appendChild(titleDom);

        const table = document.createElement("table");
        table.id = "timeTable";
        GM_addStyle(`
          #timeTable {
            width: 100%;
          }

          .time-tr {
            height: 30px;
            background: #fff;
          }

          .time-tr:hover {
            background: #f2f5f7;
          }
        `);

        const thead = document.createElement("thead");
        const tbody = document.createElement("tbody");

        const headerRow = document.createElement("tr");
        const headerName = document.createElement("th");
        headerName.textContent = "名称";
        const headerButtons = document.createElement("th");
        headerButtons.textContent = "添加工时";
        headerRow.appendChild(headerName);
        headerRow.appendChild(headerButtons);
        thead.appendChild(headerRow);

        list.forEach((item) => {
          const name = item.subject;
          const row = document.createElement("tr");
          const nameCell = document.createElement("td");
          const title = document.createElement("div");
          row.className = "time-tr";
          title.style.width = "520px";
          title.style.whiteSpace = "nowrap";
          title.style.textOverflow = "ellipsis";
          title.style.overflow = "hidden";
          title.style.cursor = "pointer";

          title.onclick = () => {
            GM_openInTab(
              `https://devops.aliyun.com/projex/project/${item.spaceIdentifier}/req/${item.identifier}`,
              {
                active: true,
              }
            );
          };

          if (item.category.identifier === "Req") {
            const icon = document.createElement("span");
            icon.innerHTML = reqIconHtml;
            title.textContent = name;
            title.prepend(icon);
          } else if (item.category.identifier === "Task") {
            const icon = document.createElement("span");
            icon.innerHTML = taskIconHtml;
            title.textContent = name;
            title.prepend(icon);
          } else if (item.category.identifier === "Bug") {
            const icon = document.createElement("span");
            icon.innerHTML = bugIconHtml;
            title.textContent = name;
            title.prepend(icon);
          }
          nameCell.appendChild(title);

          const buttonCell = document.createElement("td");
          for (let i = 1; i <= 6; i++) {
            const button = document.createElement("button");
            button.textContent = `+${i}`;
            button.style.marginRight = "5px";
            button.style.cursor = "pointer";
            button.onclick = async function () {
              const t = recordedHours + i > 8 ? 8 - recordedHours : i;
              if (t <= 0) return;
              await addTime(item.identifier, t, selectType.value);
              setTimeout(setDayWorkitemTime, 1000);
            };
            buttonCell.appendChild(button);
          }

          row.appendChild(nameCell);
          row.appendChild(buttonCell);
          tbody.appendChild(row);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        contianer.appendChild(table);
        return contianer;
      }
      window.isShowTaskList = true;
      // 添加表格到页面
      document.body.appendChild(createTable());
    };

    const addTime = async (id, time, type) => {
      fetch(
        "https://devops.aliyun.com/projex/api/workitem/workitem/time?_input_charset=utf-8",
        {
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
            "cache-control": "no-cache",
            "content-type": "application/json",
            pragma: "no-cache",
            priority: "u=1, i",
            "sec-ch-ua":
              '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-csrf-token": "RaxYcieM-9JdzYreeKnesaSS4ZKB9Xmhd4zE",
            "x-requested-with": "XMLHttpRequest",
          },
          referrerPolicy: "strict-origin-when-cross-origin",
          body: `{"workitemIdentifier":"${id}","type":"${type}","actualTime":${time},"description":"","recordUserIdentifier":"${
            unsafeWindow.AONE_GLOBAL.user.identifier
          }","gmtStart":"${getLocalISOString()}","gmtEnd":"${getLocalISOString()}","containsRestDay":true}`,
          method: "POST",
          mode: "cors",
          credentials: "include",
        }
      );
    };

    const setDayWorkitemTime = async () => {
      const todayInfo = await getDayWorkitemTime();
      let timeTitle = document.querySelector("#timeTitle");
      let timeTitleMessage = document.querySelector("#timeTitleMessage");
      if (!timeTitle) {
        timeTitle = document.createElement("div");
        timeTitle.id = "timeTitle";
        GM_addStyle(`
          #timeTitle {
            color: #000;
            margin-left: 12px;
            font-weight: 900;
          }
        `);
        const dom = document.querySelector(".system-bar-left");
        dom.append(timeTitle);

        const btn = document.createElement("div");
        btn.id = "timeTitleBtn";
        GM_addStyle(`
          #timeTitleBtn {
            background: var(--color-brand1-6, #1b9aee);
            border-radius: 4px;
            cursor: pointer;
            mask: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxwYXRoIGQ9Ik0xMCAyMEM0LjQ3NyAyMCAwIDE1LjUyMyAwIDEwUzQuNDc3IDAgMTAgMHMxMCA0LjQ3NyAxMCAxMC00LjQ3NyAxMC0xMCAxMHptLjYxNS02LjU4NHYtMi44MDFoMi44MDFhLjYxNi42MTYgMCAwMDAtMS4yM2gtMi44MDFWNi41ODVhLjYxNS42MTUgMCAxMC0xLjIzIDB2Mi44bC0yLjguMDAyYS42MTQuNjE0IDAgMTAtLjAwMiAxLjIzaDIuODAydjIuOGEuNjE1LjYxNSAwIDAwMS4yMyAweiIgaWQ9ImEiLz48L2RlZnM+PHVzZSBmaWxsPSIjMDAwIiB4bGluazpocmVmPSIjYSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+) no-repeat center center;
            width: 20px;
            height: 20px;
            margin-left: 4px;
          }
        `);
        btn.onclick = showTaskList;
        dom.append(btn);

        timeTitleMessage = document.createElement("div");
        timeTitleMessage.id = "timeTitleMessage";
        GM_addStyle(`
          #timeTitleMessage {
            color: red;
            margin-left: 6px;
          }
        `);
        dom.append(timeTitleMessage);
      }
      recordedHours = todayInfo.recordedHours;
      timeTitle.innerText = `今日工时：${todayInfo.recordedHours}`;

      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      if (
        todayInfo.recordedHours < 3.76 &&
        (hours > 20 || (hours === 20 && minutes > 0))
      ) {
        timeTitleMessage.innerText = "今日工时不足，请填写！";
      } else if (todayInfo.recordedHours > 8) {
        timeTitleMessage.innerText = "今日工时不得大于8小时！";
      } else {
        timeTitleMessage.innerText = "";
      }
    };

    const getDayWorkitemTime = async () => {
      const today = getFormattedDate();
      const { monday, friday } = getWeekStartAndEnd();
      const res = await fetch(
        `https://devops.aliyun.com/projex/api/workitem/workitem/time/stats/user/dayWorkitemTime?gmtStart=${monday}&gmtEnd=${friday}`,
        {
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
            "cache-control": "no-cache",
            pragma: "no-cache",
            priority: "u=1, i",
            "sec-ch-ua":
              '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-csrf-token": "82wGAI9h-BvqfApuNHSKQHkYvGn1b4CkwymI",
            "x-requested-with": "XMLHttpRequest",
          },
          referrerPolicy: "strict-origin-when-cross-origin",
          body: null,
          method: "GET",
          mode: "cors",
          credentials: "include",
        }
      ).then((res) => {
        return res.json();
      });
      const dayWorkitemTime = res.result;
      const todayInfo = dayWorkitemTime.find((item) => item.date === today);
      return todayInfo;
    };

    const removeDom = () => {
      document.querySelector("#tb-navigation-customOperation")?.remove();
    };
    if (location.host === "devops.aliyun.com") {
      setTimeout(async () => {
        removeDom();
        setDayWorkitemTime();
      }, 1000);
    }
    setInterval(() => {
      setDayWorkitemTime();
    }, 1000 * 60 * 10);
    window.addEventListener("visibilitychange", () => {
      setDayWorkitemTime();
    });
  }

  /**
   * components
   */

  function createGetLoginInfo() {
    // 创建容器
    const container = document.createElement("div");
    container.className = "login-container";
    GM_addStyle(`
      .login-container {
        position: fixed;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0px 0px 2000px rgba(0, 0, 0, 0.3);
        background-color: #fff;
        z-index: 9999;
      }
      `);

    // 创建关闭按钮
    const closeButton = document.createElement("button");
    closeButton.textContent = "×"; // 使用 '×' 符号作为关闭按钮
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.fontSize = "20px";
    closeButton.style.backgroundColor = "transparent";
    closeButton.style.border = "none";
    closeButton.style.color = "#333";
    closeButton.style.cursor = "pointer";
    closeButton.style.padding = "0";
    closeButton.style.fontWeight = "bold";

    // 添加关闭按钮点击事件，隐藏容器
    closeButton.addEventListener("click", function () {
      container.remove();
    });

    // 创建标题
    const title = document.createElement("h2");
    title.textContent = "自动登录需设置账户密码";
    title.style.fontSize = "18px";
    title.style.fontWeight = "bold";
    title.style.marginBottom = "20px";
    title.style.color = "#333";
    title.style.textAlign = "center";

    // 创建说明文本
    const description = document.createElement("p");
    description.textContent = "提示：账号密码只存储到当前设备";
    description.style.fontSize = "12px";
    description.style.color = "#999";
    description.style.textAlign = "center";
    description.style.marginBottom = "30px";

    // 创建用户名输入框
    const usernameLabel = document.createElement("label");
    usernameLabel.textContent = "账号名";
    usernameLabel.style.fontSize = "14px";
    usernameLabel.style.color = "#333";
    usernameLabel.style.marginBottom = "5px";
    const usernameInput = document.createElement("input");
    usernameInput.placeholder = "请输入";
    usernameInput.style.width = "100%";
    usernameInput.style.padding = "12px";
    usernameInput.style.marginBottom = "15px";
    usernameInput.style.border = "1px solid #d9d9d9"; // 更浅的边框颜色
    usernameInput.style.borderRadius = "4px";
    usernameInput.style.fontSize = "14px";
    usernameInput.style.outline = "none";
    usernameInput.style.boxSizing = "border-box";
    usernameInput.style.color = "#333"; // 字体颜色调整

    // 创建密码输入框
    const passwordLabel = document.createElement("label");
    passwordLabel.textContent = "密码";
    passwordLabel.style.fontSize = "14px";
    passwordLabel.style.color = "#333";
    passwordLabel.style.marginBottom = "5px";
    const passwordInput = document.createElement("input");
    passwordInput.placeholder = "请输入";
    passwordInput.type = "password";
    passwordInput.style.width = "100%";
    passwordInput.style.padding = "12px";
    passwordInput.style.marginBottom = "20px";
    passwordInput.style.border = "1px solid #d9d9d9"; // 更浅的边框颜色
    passwordInput.style.borderRadius = "4px";
    passwordInput.style.fontSize = "14px";
    passwordInput.style.outline = "none";
    passwordInput.style.boxSizing = "border-box";
    passwordInput.style.color = "#333"; // 字体颜色调整

    // 创建登录按钮
    const loginButton = document.createElement("button");
    loginButton.textContent = "保存";
    loginButton.style.width = "100%";
    loginButton.style.padding = "12px";
    loginButton.style.backgroundColor = "#1890FF"; // 按钮颜色调整为蓝色
    loginButton.style.color = "#fff";
    loginButton.style.border = "none";
    loginButton.style.borderRadius = "4px";
    loginButton.style.cursor = "pointer";
    loginButton.style.fontSize = "16px";
    loginButton.style.transition = "background-color 0.3s";

    loginButton.addEventListener("click", async function () {
      userName = usernameInput.value;
      password = passwordInput.value;

      await GM_setValue("userName", userName);
      await GM_setValue("password", password);

      if (location.host === "account.aliyun.com") {
        location.href = location.href;
      } else {
        container.remove();
      }
    });

    // 添加按钮 hover 效果
    loginButton.addEventListener("mouseover", function () {
      loginButton.style.backgroundColor = "#0066cc"; // 悬停时的颜色
    });
    loginButton.addEventListener("mouseout", function () {
      loginButton.style.backgroundColor = "#1890FF"; // 悬停恢复颜色
    });

    // 将元素添加到容器中
    container.appendChild(closeButton);
    container.appendChild(title);
    container.appendChild(description);
    container.appendChild(usernameLabel);
    container.appendChild(usernameInput);
    container.appendChild(passwordLabel);
    container.appendChild(passwordInput);
    container.appendChild(loginButton);

    // 将容器添加到页面中
    unsafeWindow.document.body.appendChild(container);
  }

  /**
   * util
   */
  function setBtnStyle(btn) {
    btn.className = "next-btn next-medium next-btn-normal next-menu-btn";
    btn.style.backgroundColor = "rgb(95, 206, 157)";
    btn.style.color = "#fff";
    btn.style.padding = "0px 10px";
    btn.style.fontSize = "12px";
    btn.style.height = "24px";
    btn.style.width = "auto";
    btn.style.minWidth = "auto";
  }

  function getFormattedDate(dateInput = new Date()) {
    const date = new Date(dateInput); // 如果没有传参，则使用当前日期
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，所以加1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function createSelecter(container, selectType) {
    const dropdownContainer = document.createElement("div");
    dropdownContainer.classList.add("dropdown");

    const selectedOption = document.createElement("div");
    selectedOption.classList.add("selected");
    const options = [
      {
        name: "设计",
        type: "design",
      },
      {
        name: "研发",
        type: "develop",
      },
      {
        name: "测试",
        type: "test",
      },
      {
        name: "文档",
        type: "document",
      },
      {
        name: "其他",
        type: "others",
      },
    ];
    const name = options.find((item) => item.type === selectType.value).name;
    selectedOption.textContent = name; // Default selected option

    const optionsList = document.createElement("div");
    optionsList.style.display = "none";
    optionsList.classList.add("options");

    options.forEach((option) => {
      const optionItem = document.createElement("div");
      optionItem.classList.add("option");
      optionItem.textContent = option.name;
      optionItem.addEventListener("click", () => {
        selectedOption.textContent = option.name;
        selectType.value = option.type;
        localStorage.setItem("selectType", option.type);
        optionsList.style.display = "none"; // Hide the options after selection
      });
      optionsList.appendChild(optionItem);
    });

    dropdownContainer.appendChild(selectedOption);
    dropdownContainer.appendChild(optionsList);
    container.innerText = "工作类型：";
    container.appendChild(dropdownContainer);

    selectedOption.addEventListener("click", () => {
      optionsList.style.display =
        optionsList.style.display === "none" ? "block" : "none";
    });

    const style = document.createElement("style");
    style.textContent = `
    .dropdown {
      position: relative;
      display: inline-block;
      font-family: Arial, sans-serif;
      width: 150px;
    }
    .selected {
      padding: 3px 10px;
      color: #2a7bf2;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    .selected:hover {
      background-color: #e3f2fd;
    }
    .options {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      background-color: white;
      border: 1px solid #2a7bf2;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
      width: 100%;
      border-radius: 4px;
      z-index: 1;
    }
    .option {
      padding: 10px;
      background-color: white;
      color: #333;
      cursor: pointer;
      font-size: 14px;
    }
    .option:hover {
      background-color: #f0f7ff;
    }
  `;
    container.appendChild(style);
  }

  function getWeekStartAndEnd(dateInput = new Date()) {
    const date = new Date(dateInput);
    const day = date.getDay(); // 0 是周日，1 是周一，... 5 是周五，6 是周六
    const diffToMonday = day === 0 ? -6 : 1 - day; // 周日特殊处理，回退到上周一
    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);

    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    const format = (d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    return {
      monday: format(monday),
      friday: format(friday),
    };
  }

  function getLocalISOString() {
    const date = new Date();

    let isoString = date.toISOString().split(".")[0];

    const timezoneOffset = date.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
    const offsetMinutes = Math.abs(timezoneOffset) % 60;
    const sign = timezoneOffset > 0 ? "-" : "+";

    const formattedOffset = `${sign}${String(offsetHours).padStart(
      2,
      "0"
    )}:${String(offsetMinutes).padStart(2, "0")}`;

    const formattedDate = `${isoString}${formattedOffset}`;
    return formattedDate;
  }
})();
