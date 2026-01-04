// ==UserScript==
// @name         测试环境自动跳转本地同时同步Storage
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动同步session和token
// @author       李良荣
// @include     *
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/475330/%E6%B5%8B%E8%AF%95%E7%8E%AF%E5%A2%83%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E6%9C%AC%E5%9C%B0%E5%90%8C%E6%97%B6%E5%90%8C%E6%AD%A5Storage.user.js
// @updateURL https://update.greasyfork.org/scripts/475330/%E6%B5%8B%E8%AF%95%E7%8E%AF%E5%A2%83%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E6%9C%AC%E5%9C%B0%E5%90%8C%E6%97%B6%E5%90%8C%E6%AD%A5Storage.meta.js
// ==/UserScript==

(function () {
  'use strict';


  var syncConfig = [
    {
      sourceHost: "http://return-admin-test.parcelpanel.com",
      targetHost: "http://localhost:8555",
      open: true,
    },
    {
      sourceHost: "https://wp-test.parcelpanel.com/web",
      targetHost: "http://localhost:4000",
      open: true,
    },
    {
      sourceHost: "https://wp-test.parcelpanel.com/app-test",
      targetHost: "http://localhost:5173/app-test",
      open: true,
    },
    {
      sourceHost: "https://manage-test.parcelpanel.com",
      targetHost: "http://localhost:8001",
      open: true,
    },
    // 可以根据需求添加更多 host 之间的数据同步关系
  ]

  function syncExecute() {
    var currentPageURL = window.location.origin;
    var syncInfo = syncConfig.find(
      (item) =>
        item.open && [item.sourceHost, item.targetHost].some(item => window.location.href.includes(item))
    );
    if (syncInfo) {
      // 如果当前页面是源页面，则执行数据收集和传递操作

      if (syncInfo.sourceHost.includes(currentPageURL)) {
        // 在当前页面加载完成后执行

        window.addEventListener("load", function () {
          // 收集 localStorage 和 sessionStorage 数据

          var storageData = {
            localStorageData: JSON.stringify(localStorage),

            sessionStorageData: JSON.stringify(sessionStorage),
          };
          // 将数据保存到 GM_setValue 中，用于在目标页面获取
          GM_setValue("syncData", storageData);
          // 跳转到目标页面
          if (sessionStorage.length + localStorage.length > 0) {
            window.location.href = window.location.href.replace(syncInfo.sourceHost, syncInfo.targetHost)
          }
        });
      }
      // 如果当前页面是目标页面，则执行数据接收和同步操作
      else if (syncInfo.targetHost.includes(currentPageURL)) {
        // 在当前页面加载完成后执行
        window.addEventListener("load", function () {
          var storageData = GM_getValue("syncData");
          // 获取从源页面传递过来的数据
          if (storageData) {
            // 同步 localStorage 和 sessionStorage 数据到当前页面
            if (storageData.localStorageData) {
              var localStorageData = JSON.parse(storageData.localStorageData);

              for (var key in localStorageData) {
                localStorage.setItem(key, localStorageData[key]);
              }
            }

            if (storageData.sessionStorageData) {
              var sessionStorageData = JSON.parse(storageData.sessionStorageData);

              for (var key in sessionStorageData) {
                sessionStorage.setItem(key, sessionStorageData[key]);
              }
            }
            GM_deleteValue("syncData")
          }
        });
      }
    }
  }

  syncExecute()

})();

