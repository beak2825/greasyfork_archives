// ==UserScript==
// @name         自动预约脚本
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动预约脚本，可以自动定时刷新页面
// @author       LiarCoder
// @license      MIT
// @match        https://yuyue.shdc.org.cn/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/540939/%E8%87%AA%E5%8A%A8%E9%A2%84%E7%BA%A6%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/540939/%E8%87%AA%E5%8A%A8%E9%A2%84%E7%BA%A6%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 拦截 XMLHttpRequest 请求
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, ...args) {
    // 检查是否是目标接口
    if (url && url.includes("queryDoctorByScheduleDate")) {
      console.log("拦截到 queryDoctorByScheduleDate 请求:", url);

      // 保存原始请求信息
      this._isTargetRequest = true;
      this._originalUrl = url;
      this._originalMethod = method;
    }

    return originalXHROpen.apply(this, [method, url, ...args]);
  };

  XMLHttpRequest.prototype.send = function (data) {
    if (this._isTargetRequest) {
      console.log("发送 queryDoctorByScheduleDate 请求");

      // 拦截响应
      const originalOnReadyStateChange = this.onreadystatechange;

      this.onreadystatechange = function () {
        if (this.readyState === 4) {
          console.log("收到 queryDoctorByScheduleDate 响应");

          try {
            // 尝试解析响应数据
            if (this.responseText) {
              const responseData = JSON.parse(this.responseText);
              console.log("响应数据:", responseData);

              // 处理响应数据
              handleScheduleResponse(responseData);
            }
          } catch (error) {
            console.error("解析响应数据失败:", error);
          }
        }

        // 调用原始的 onreadystatechange
        if (originalOnReadyStateChange) {
          originalOnReadyStateChange.apply(this, arguments);
        }
      };
    }

    return originalXHRSend.apply(this, arguments);
  };

  // 拦截 Fetch 请求
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    const url = typeof input === "string" ? input : input.url;

    if (url && url.includes("queryDoctorByScheduleDate")) {
      console.log("拦截到 Fetch queryDoctorByScheduleDate 请求:", url);

      return originalFetch.apply(this, arguments).then((response) => {
        // 克隆响应以便读取
        const clonedResponse = response.clone();

        clonedResponse
          .json()
          .then((data) => {
            console.log("Fetch 响应数据:", data);
            handleScheduleResponse(data);
          })
          .catch((error) => {
            console.error("解析 Fetch 响应失败:", error);
          });

        return response;
      });
    }

    return originalFetch.apply(this, arguments);
  };

  // 处理排班响应数据
  const handleScheduleResponse = (responseData) => {
    try {
      const doctors = responseData?.data?.schedules?.[0]?.doctors || [];
      console.log("医生列表:", doctors);

      const availableSchedule = doctors.find((item) => {
        const { status, reserveOrderNum, doctName } = item;
        console.log(
          "检查医生:",
          doctName,
          "状态:",
          status,
          "剩余号数:",
          reserveOrderNum
        );
        return status === "1" && parseInt(reserveOrderNum) > 0;
      });

      if (availableSchedule) {
        const { doctName, scheduleDate, reserveOrderNum } = availableSchedule;
        const title = `【${doctName}】 有号啦！`;
        const msg = `【${doctName}】 在 ${scheduleDate} 剩余 ${reserveOrderNum} 个号`;
        console.log("发现可预约号源:", title, msg);
        notify(title, msg);
      } else {
        console.log("当前没有可预约的号源");
      }
    } catch (error) {
      console.error("处理响应数据失败:", error);
    }
  };

  const grantedPermission = (title, msg) => {
    const options = {
      body: msg,
      dir: "auto",
    };
    const notification = new Notification(title, options);
    notification.onclick = (e) => {
      console.log("点了消息");
    };
    notification.onclose = (e) => {
      console.log("点了消息");
    };
    notification.onshow = (e) => {
      console.log("消息展示");
    };
    notification.onerror = (e) => {
      console.log("消息无法展示");
    };
  };

  const unsupportPermission = (msg) => {
    alert(msg);
  };

  const notify = (title, msg) => {
    // 如果用户同意就创建一个通知
    if (window.Notification && Notification.permission === "granted") {
      grantedPermission(title, msg);
    }

    // 如果用户没有选择是否显示通知
    // 注：因为在 Chrome 中我们无法确定 permission 属性是否有值，因此
    // 检查该属性的值是否是 "default" 是不安全的。
    else if (window.Notification && Notification.permission !== "denied") {
      Notification.requestPermission(function (status) {
        if (Notification.permission !== status) {
          Notification.permission = status;
        }

        // 如果用户同意了
        if (status === "granted") {
          grantedPermission(title, msg);
        }

        // 否则，我们可以让步的使用常规模态的 alert
        else {
          unsupportPermission(`用户拒绝该网站消息通知\n ${title}\n ${msg}`);
        }
      });
    }

    // 如果用户拒绝接受通知
    else {
      // 我们可以让步的使用常规模态的 alert
      unsupportPermission(`暂不支持消息通知\n ${title}\n ${msg}`);
    }
  };

  let timer;

  window.onload = () => {
    console.log(
      new Date().toLocaleString(),
      "门诊预约提醒脚本已启动，正在监听 queryDoctorByScheduleDate 请求..."
    );

    if (!window.location.hash.includes("doctorDetail")) {
      return;
    }

    // 请求通知权限
    if (window.Notification && Notification.permission === "default") {
      Notification.requestPermission();
    }

    timer = setTimeout(() => {
      window.location.reload();
    }, 15 * 1000);
  };
  window.addEventListener("beforeunload", () => {
    clearTimeout(timer);
  });
})();
