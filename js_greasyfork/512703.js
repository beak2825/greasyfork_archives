// ==UserScript==
// @name         复制/清除/推送页面Cookies到青龙面板
// @version      3.10
// @description  提供清除、复制Cookies以及推送到青龙面板的功能，首次使用需进行测试和配置
// @author       翼城
// @match        *://*/*
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @namespace
// @license      MIT
// @namespace
// @namespace
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/512703/%E5%A4%8D%E5%88%B6%E6%B8%85%E9%99%A4%E6%8E%A8%E9%80%81%E9%A1%B5%E9%9D%A2Cookies%E5%88%B0%E9%9D%92%E9%BE%99%E9%9D%A2%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/512703/%E5%A4%8D%E5%88%B6%E6%B8%85%E9%99%A4%E6%8E%A8%E9%80%81%E9%A1%B5%E9%9D%A2Cookies%E5%88%B0%E9%9D%92%E9%BE%99%E9%9D%A2%E6%9D%BF.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let URL_HOST = localStorage.getItem("PANEL_URL_HOST") || "";
  let Client_ID = localStorage.getItem("PANEL_Client_ID") || "";
  let Client_Secret = localStorage.getItem("PANEL_Client_Secret") || "";
  let isTested = localStorage.getItem("isTested") === "true";
  let domain = window.location.hostname;

  async function clearCookies() {
    if (domain.split(".").length > 2) {
      domain = "." + domain.split(".").slice(-2).join(".");
    }

    const cookieNames = document.cookie.match(/[^ =;]+(?=\=)/g) || [];
    cookieNames.forEach((cookieName) => {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=`;
    });
  }
  async function clearAllCookies() {
    await clearCookies();
    alert("所有Cookie已被清除。");
  }
  async function copyCookiesToClipboard() {
    const cookies = document.cookie;
    GM_setClipboard(cookies);
    alert("Cookie已复制到剪贴板。");
  }
  async function testConnectionToPanel() {
    if (isTested) {
      if (confirm("配置已通过测试，是否需要重置配置？")) {
        resetPanelConfiguration();
      } else {
        return;
      }
    }

    const configInput = prompt(
      "请输入面板配置，格式为：(面板ip:端口|your_Client_ID|your_Client_Secret)",
      `${URL_HOST}|${Client_ID}|${Client_Secret}`,
    );
    if (!configInput) {
      alert("配置输入不能为空！");
      return;
    }

    const configParts = configInput.split("|");
    if (configParts.length !== 3) {
      alert("输入格式不正确，请按格式：面板地址|Client_ID|Client_Secret");
      return;
    }

    [URL_HOST, Client_ID, Client_Secret] = configParts;

    try {
      let rr = await GM_fetch({
        method: "GET",
        url: `${URL_HOST}/open/auth/token?client_id=${Client_ID}&client_secret=${Client_Secret}`,
        headers: {
          "content-type": "application/json",
        },
      });

      if (rr.status === 200) {
        let panel_token = JSON.parse(rr.responseText).data.token;
        alert("面板连接成功，Token获取正常！");
        localStorage.setItem("PANEL_URL_HOST", URL_HOST);
        localStorage.setItem("PANEL_Client_ID", Client_ID);
        localStorage.setItem("PANEL_Client_Secret", Client_Secret);
        localStorage.setItem("isTested", "true");
        isTested = true;
      } else {
        alert(`面板连接失败，状态码：${rr.status}，错误信息：${rr.statusText}`);
      }
    } catch (error) {
      alert("面板连接失败，请检查面板地址、Client_ID和Client_Secret是否正确！");
    }
  }
  function resetPanelConfiguration() {
    localStorage.removeItem("PANEL_URL_HOST");
    localStorage.removeItem("PANEL_Client_ID");
    localStorage.removeItem("PANEL_Client_Secret");
    localStorage.removeItem("isTested");
    URL_HOST = "";
    Client_ID = "";
    Client_Secret = "";
    isTested = false;
    alert("面板配置已重置，请重新进行配置！");
  }
  async function pushCookiesToPanel2() {
    if (!isTested) {
      alert("请先进行测试连接，以确保面板连接正常！");
      return;
    }

    let ENV_NAME = prompt("请输入推送到面板的变量名", "COOKIES");
    if (ENV_NAME === null) {
      return;
    }
    if (!ENV_NAME) {
      alert("变量名不能为空，请重新输入！");
      return;
    }

    let collectedCookies = "";
    let ready = setInterval(function () {
      GM_cookie.list({}, function (cookies, error) {
        if (!error) {
          for (let i = 0; i < cookies.length; i++) {
            collectedCookies += `${cookies[i].name}=${cookies[i].value};`;
          }
          if (collectedCookies !== "") {
            clearInterval(ready);
            getTokenAndPush(collectedCookies, ENV_NAME);
          }
        } else {
          console.error("获取Cookie时出错：", error);
        }
      });
    }, 1000);
  }
  async function getTokenAndPush(cookies, ENV_NAME) {
    try {
      let rr = await GM_fetch({
        method: "GET",
        url: `${URL_HOST}/open/auth/token?client_id=${Client_ID}&client_secret=${Client_Secret}`,
        headers: {
          "content-type": "application/json",
        },
      });

      if (rr.status === 200) {
        let panel_token = JSON.parse(rr.responseText).data.token;
        let res = await GM_fetch({
          method: "GET",
          url: `${URL_HOST}/open/envs?searchValue=${ENV_NAME}`,
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${panel_token}`,
          },
        });

        if (res.status === 200) {
          let id = JSON.parse(res.responseText).data[0].id;
          let ress = await GM_fetch({
            method: "PUT",
            url: `${URL_HOST}/open/envs`,
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${panel_token}`,
            },
            data: JSON.stringify({ id: id, name: ENV_NAME, value: cookies }),
          });

          if (ress.status === 200) {
            alert("Cookie已成功推送到面板！");
          } else {
            alert(
              `推送Cookie失败，状态码：${ress.status}，错误信息：${ress.statusText}`,
            );
            console.error("推送Cookie失败：", ress);
          }
        } else {
          alert(
            `无法获取面板的环境变量列表，状态码：${res.status}，错误信息：${res.statusText}`,
          );
        }
      } else {
        alert(
          `无法获取面板Token，状态码：${rr.status}，错误信息：${rr.statusText}`,
        );
      }
    } catch (error) {
      alert(
        `大概率找不到变量名,确认青龙是否有。根据变量名自动创建功能,自己根据api写去吧!`,
      );
    }
  }
  async function splitAndSelectCookies() {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "20px";
    container.style.right = "20px";
    container.style.backgroundColor = "#ffffff";
    container.style.border = "2px solid #ddd";
    container.style.padding = "15px";
    container.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
    container.style.borderRadius = "8px";
    container.style.zIndex = "10000";
    container.style.maxHeight = "80vh";
    container.style.overflowY = "auto";
    // container.style.z-index = '10000';

    const selectedCookies = new Set();
    const pushButton = document.createElement("button");
    pushButton.textContent = "推送Cookie到面板";
    styleButton(pushButton, "#007bff", "#ffffff");
    pushButton.onclick = () => {
      const selectedCookieValue = Array.from(selectedCookies).join(";");
      promptAndPushCookies(selectedCookieValue);
    };
    container.appendChild(pushButton);
    const confirmButton = document.createElement("button");
    confirmButton.textContent = "保留选定的Cookie";
    styleButton(confirmButton, "#28a745", "#ffffff");

    confirmButton.onclick = () => {
      if (selectedCookies && selectedCookies.size == 0) {
        alert("请至少选择一个Cookie进行保留！");
        return;
      }
      const finalCookies = Array.from(selectedCookies).join(";");
      GM_setClipboard(finalCookies);
      alert("选定的Cookie已复制到剪贴板。");
      document.body.removeChild(container);
    };
    container.appendChild(confirmButton);
    const selectAllButton = document.createElement("button");
    selectAllButton.textContent = "全选";
    styleButton(selectAllButton, "#17a2b8", "#ffffff");
    selectAllButton.onclick = () => {
      cookies.forEach((cookie) => {
        const button = document.getElementById(`cookie-button-${cookie}`);
        if (button && !button.classList.contains("selected")) {
          button.classList.add("selected");
          selectedCookies.add(cookie);
          updateButtonStyle(button);
        }
      });
    };
    container.appendChild(selectAllButton);
    const toggleButton = document.createElement("button");
    toggleButton.textContent = "反选";
    styleButton(toggleButton, "#ffc107", "#ffffff");
    toggleButton.onclick = () => {
      cookies.forEach((cookie) => {
        const button = document.getElementById(`cookie-button-${cookie}`);
        if (button) {
          button.classList.toggle("selected");
          if (selectedCookies.has(cookie)) {
            selectedCookies.delete(cookie);
          } else {
            selectedCookies.add(cookie);
          }
          updateButtonStyle(button);
        }
      });
    };
    container.appendChild(toggleButton);
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "取消";
    styleButton(cancelButton, "#dc3545", "#ffffff");
    cancelButton.onclick = () => {
      document.body.removeChild(container);
    };
    container.appendChild(cancelButton);
    cookies.forEach((cookie) => {
      const button = document.createElement("button");
      button.textContent = cookie;
      button.id = `cookie-button-${cookie}`;
      button.style.display = "block";
      button.style.marginBottom = "5px";
      button.style.padding = "5px";
      button.style.border = "1px solid #ccc";
      button.style.backgroundColor = "#f0f0f0";
      button.style.cursor = "pointer";
      button.style.borderRadius = "5px";
      button.onclick = () => {
        button.classList.toggle("selected");
        if (selectedCookies.has(cookie)) {
          selectedCookies.delete(cookie);
        } else {
          selectedCookies.add(cookie);
        }
        updateButtonStyle(button);
      };
      updateButtonStyle(button);
      container.appendChild(button);
    });

    document.body.appendChild(container);
  }
  async function updateButtonStyle(button) {
    if (button.classList.contains("selected")) {
      button.style.backgroundColor = "#cce5ff";
      button.style.color = "#004085";
      button.style.border = "1px solid #004085";
    } else {
      button.style.backgroundColor = "#f0f0f0";
      button.style.color = "#000";
      button.style.border = "1px solid #ccc";
    }
  }
  async function styleButton(button, backgroundColor, color) {
    button.style.display = "block";
    button.style.marginBottom = "10px";
    button.style.padding = "8px 12px";
    button.style.border = "none";
    button.style.backgroundColor = backgroundColor;
    button.style.color = color;
    button.style.cursor = "pointer";
    button.style.borderRadius = "5px";
    button.style.fontSize = "14px";
    button.style.fontWeight = "bold";
    button.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
    button.onmouseover = () => {
      button.style.opacity = "0.8";
    };
    button.onmouseout = () => {
      button.style.opacity = "1";
    };
  }
  async function promptAndPushCookies(defaultCookieValue = "") {
    if (!isTested) {
      alert("请先进行测试连接，以确保面板连接正常！");
      return;
    }
    const ENV_NAME = prompt("请输入推送到面板的变量名", "COOKIES");
    const cookieValue = prompt(
      "请输入推送到面板的 Cookie 值",
      defaultCookieValue,
    );
    if (ENV_NAME === null || cookieValue === null) {
      return;
    }
    if (!ENV_NAME || !cookieValue) {
      alert("变量名 和 Cookie 值均不能为空，请重新输入！");
      return;
    }

    getTokenAndPush(cookieValue, ENV_NAME);
  }
  /*GM_registerMenuCommand("清除所有Cookie", clearAllCookies);
    GM_registerMenuCommand("复制Cookie到剪贴板", copyCookiesToClipboard);
    GM_registerMenuCommand("青龙面板连接", testConnectionToPanel);
    GM_registerMenuCommand("选择性ck推送", splitAndSelectCookies);
    GM_registerMenuCommand('手动选择变量/值到面板', () => {
        promptAndPushCookies();
    });
    GM_registerMenuCommand("推送全部ck到面板", pushCookiesToPanel2);
    GM_registerMenuCommand("重置面板配置", resetPanelConfiguration);*/

  if (window.self === window.top) {
    // 仅在主页面上运行
    const existingButton = document.getElementById("menuButton");
    if (!existingButton) {
      const style = document.createElement("style");
      style.textContent = `
        #customMenu {
            position: fixed;
            top: 50px;
            right: 10px;
            width: 220px;
            background: #ffffff;
            border: 1px solid #ddd;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            z-index: 10000;
            display: none;
            overflow: hidden;
            transition: all 0.3s ease-in-out;
        }
        #customMenu button {
            display: block;
            width: 100%;
            border: none;
            background: #f9f9f9;
            padding: 12px;
            z-index: 10000;

            cursor: pointer;
            text-align: left;
            font-size: 16px;
            color: #333;
            transition: background 0.2s, color 0.2s;
        }
        #customMenu button:hover {
            background: #007bff;
            color: #fff;
        }
        #menuButton {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 120px;
            height: 50px;
            background: #007bff;
            color: white;
            border: none;
            cursor: pointer;
            text-align: center;
            line-height: 50px;
            font-size: 16px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transition: all 0.2s ease-in-out;
        }
    `;
      document.head.appendChild(style);

      const menuButton = document.createElement("button");
      menuButton.id = "menuButton";
      menuButton.textContent = "CK管理菜单";
      document.body.appendChild(menuButton);

      const customMenu = document.createElement("div");
      customMenu.id = "customMenu";
      document.body.appendChild(customMenu);

      const menuItems = [
        { name: "清除所有Cookie", action: clearAllCookies },
        { name: "复制Cookie到剪贴板", action: copyCookiesToClipboard },
        { name: "青龙面板连接", action: testConnectionToPanel },
        { name: "选择部分ck推送", action: splitAndSelectCookies },
        { name: "手动选择变量/值到面板", action: promptAndPushCookies },
        { name: "推送全部ck到面板", action: pushCookiesToPanel2 },
        { name: "替换cookie", action: replaceCookies },
        { name: "重置面板配置", action: resetPanelConfiguration },
      ];

      menuItems.forEach((item) => {
        const button = document.createElement("button");
        button.textContent = item.name;
        button.onclick = item.action;
        customMenu.appendChild(button);
      });

      const isButtonHidden =
        localStorage.getItem("menuButtonHidden") === "true";
      if (isButtonHidden) {
        menuButton.style.display = "none";
      }

      let isMenuVisible = false;
      let menuCommandId = null;
      function updateMenuCommand() {
        const isHidden = menuButton.style.display === "none";
        const statusSymbol = isHidden ? "❌" : "✅";
        if (menuCommandId !== null) {
          GM_unregisterMenuCommand(menuCommandId);
        }
        menuCommandId = GM_registerMenuCommand(
          `${statusSymbol} 显示/隐藏 CK管理按钮`,
          toggleMenuButton,
        );
      }

      function toggleMenuButton() {
        const isHidden = menuButton.style.display === "none";
        menuButton.style.display = isHidden ? "block" : "none";
        localStorage.setItem("menuButtonHidden", !isHidden);
        isMenuVisible = !isHidden;
        updateMenuCommand();
      }

      updateMenuCommand();

      menuButton.onclick = () => {
        isMenuVisible = !isMenuVisible;
        customMenu.style.display = isMenuVisible ? "block" : "none";
        updateMenuCommand();
      };

      document.addEventListener("click", (event) => {
        if (
          !menuButton.contains(event.target) &&
          !customMenu.contains(event.target)
        ) {
          isMenuVisible = false;
          customMenu.style.display = "none";
          updateMenuCommand();
        }
      });

      let isDragging = false;
      let offsetX, offsetY;
      let dragStartTime;
      const dragThreshold = 1000;

      menuButton.addEventListener("mousedown", (event) => {
        isDragging = true;
        dragStartTime = Date.now();
        offsetX = event.clientX - menuButton.getBoundingClientRect().left;
        offsetY = event.clientY - menuButton.getBoundingClientRect().top;
      });

      document.addEventListener("mousemove", (event) => {
        if (isDragging) {
          const newLeft = event.clientX - offsetX;
          const newTop = event.clientY - offsetY;
          menuButton.style.left = `${newLeft}px`;
          menuButton.style.top = `${newTop}px`;
        }
      });

      document.addEventListener("mouseup", () => {
        if (isDragging) {
          isDragging = false;
          const dragDuration = Date.now() - dragStartTime;
          if (dragDuration < dragThreshold) {
            menuButton.click();
          }
          snapToEdge();
        }
      });

      menuButton.addEventListener("touchstart", (event) => {
        isDragging = true;
        dragStartTime = Date.now();
        const touch = event.touches[0];
        offsetX = touch.clientX - menuButton.getBoundingClientRect().left;
        offsetY = touch.clientY - menuButton.getBoundingClientRect().top;
      });

      document.addEventListener("touchmove", (event) => {
        if (isDragging) {
          const touch = event.touches[0];
          const newLeft = touch.clientX - offsetX;
          const newTop = touch.clientY - offsetY;
          menuButton.style.left = `${newLeft}px`;
          menuButton.style.top = `${newTop}px`;
        }
      });

      document.addEventListener("touchend", () => {
        if (isDragging) {
          isDragging = false;
          const dragDuration = Date.now() - dragStartTime;
          if (dragDuration < dragThreshold) {
            menuButton.click();
          }
          snapToEdge();
        }
      });

      async function snapToEdge() {
        let newLeft;
        let position = menuButton.getBoundingClientRect();
        if (window.innerWidth - position.right > position.left) {
          newLeft = 0;
        } else {
          newLeft = window.innerWidth - position.width;
        }
        menuButton.style.left = `${newLeft}px`;
        menuButton.style.transition = "all 0.2s ease-in-out";
        if (isMenuVisible) {
          customMenu.style.display = "none";
          isMenuVisible = false;
          updateMenuCommand();
        }
        ensureVisibility();
      }

      function ensureVisibility() {
        let position = menuButton.getBoundingClientRect();
        if (
          position.top < 0 ||
          position.left < 0 ||
          position.right > window.innerWidth ||
          position.bottom > window.innerHeight
        ) {
          menuButton.style.top = "10px";
          menuButton.style.left = `${
            window.innerWidth - menuButton.offsetWidth - 10
          }px`;
        }
      }
      ensureVisibility();

    //   const iframe = document.querySelector("iframe");
    //   iframe.onload = function () {
    //     const iframeDocument = iframe.contentWindow.document;
    //     const menuButton = iframeDocument.getElementById("menuButton");
    //     if (menuButton) {
    //       menuButton.parentNode.removeChild(menuButton);
    //     }
    //   };
      async function parseCookieString(ck) {
        return ck.split(";").map((e) => e.trim());
      }
    } else {
      console.log("菜单按钮已存在，跳过创建。");
    }
  } else {
    console.log("脚本在iframe内运行，跳过按钮创建。");
  }

  async function replaceCookies() {
    let cookies = prompt("请输入cookie：");
    cookies = await parseCookieString(cookies);
    if (cookies) {
      await clearCookies();
    }
    cookies.forEach((e) => {
      document.cookie = e + ";domain=." + domain + ";path=/;";
    });
    location.reload();
  }

  async function GM_fetch(details) {
    return new Promise((resolve, reject) => {
      details.onload = (res) => resolve(res);
      details.onerror = (res) => {
        alert(`请求出错：${res.statusText || "未知错误"}`);
        reject(res);
      };
      details.ontimeout = (res) => {
        alert("请求超时！");
        reject(res);
      };
      details.onabort = (res) => {
        alert("请求被中止！");
        reject(res);
      };
      GM_xmlhttpRequest(details);
    });
  }
})();
