// ==UserScript==
// @name         自动刷新脚本
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  自动刷新脚本2.0
// @author       You
// @match        http://www.hkmt.top/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hkmt.top
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459429/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/459429/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let el = undefined;
  let title = undefined;
  let timeList = uni.getStorageSync("timeSettings") || new Array(24).fill(6);
  let timeout = undefined;
  let updateRate = timeList[new Date().getHours()];
  let runCount = 0;

  function start() {
    el = document.querySelector(".change-price-box");
    if (el) {
      console.log("开始执行");
      startOn(el);
    } else {
      console.log("等待进入预定页面");
      setTimeout(start, 100);
    }
  }
  start();
  function startOn() {
    console.log("进入主函数");
    if (!el) {
      alert("错误01");
      return;
    }

    uni.showToast({ title: "脚本启动成功！" });
    // 配置功能
    let options = document.createElement("div");
    options.className = "bottom-box";
    options.setAttribute("data-v-1200c765", "");
    let div = "<p>配置间隔时间（修改后需点击保存更新配置）</p>";
    timeList.forEach((el, i) => {
      div += `<div>
      <span>${i}点:</span>
      <input width="200px" style="width:30px" id='time-${i}' value="${el}" placeholder='6'>
      <span>分钟</span>
      </div>`;
    });
    options.innerHTML = div;
    let btn = document.createElement("button");
    btn.innerText = "保存";
    btn.style.marginTop = "6px";
    btn.style.padding = "6px 12px";
    btn.addEventListener("click", () => {
      let arr = [];
      for (let i = 0; i < 24; i++) {
        arr.push(parseInt(document.querySelector(`#time-${i}`).value || 6));
      }
      console.log("间隔", arr);
      uni.setStorageSync("timeSettings", arr);
      uni.showToast({
        title: "修改成功",
        icon: "success",
        mask: true,
      });
      setTimeout(() => {
        location.reload();
      }, 2500);
    });
    options.appendChild(btn);
    el.insertBefore(options, document.querySelector(".bottom-box"));
    // 日志功能
    let infos = document.createElement("div");
    infos.className = "bottom-box logs";
    infos.style.maxHeight = "300px";
    infos.style.overflow = "auto";
    title = document.createElement("p");
    title.innerText = "脚本执行日志：";
    infos.appendChild(title);
    infos.setAttribute("data-v-1200c765", "");
    el.insertBefore(infos, document.querySelector(".bottom-box"));

    // 暂停功能
    let stopBtn = document.createElement("button");
    stopBtn.innerText = "暂停";
    stopBtn.style.padding = "6px 12px";
    stopBtn.style.width = "100px";
    stopBtn.style.height = "40px";
    stopBtn.style.marginTop = "6px";
    stopBtn.addEventListener("click", () => {
      let text = stopBtn.innerText;
      if (text == "暂停") {
        clearTimeout(timeout);
        stopBtn.innerText = "启动";
        addLog(`[${new Date().toLocaleTimeString("zh-CN")}] 脚本暂停`);
      } else {
        stopBtn.innerText = "暂停";
        addLog(`[${new Date().toLocaleTimeString("zh-CN")}] 脚本启动`);
        loop();
      }
    });
    el.insertBefore(stopBtn, document.querySelector(".logs"));
    function updates() {
      runCount++;
      updateRate = timeList[new Date().getHours()]; // 获取当前小时更新频率
      addLog(`[${new Date().toLocaleTimeString("zh-CN")}] 第 ${runCount} 次提交，当前间隔 ${updateRate} 分钟`);
      let nextUpdateTime = new Date(+new Date() + updateRate * 60 * 1000).toLocaleTimeString("zh-CN");
      el.__vue__.formattingPriceList();
      el.__vue__.sendPriceList = (t) => {
        uni.showLoading({
          title: "上传中",
          mask: !0,
        });
        let e = el.__vue__;
        e.$http
          .post("/AllTenant/PostProductsEasyNew", {
            items: e.productArr,
            LoginSign: uni.getStorageSync("LoginSign"),
          })
          .then(function (n) {
            uni.hideLoading();
            if (200 == n.RespCode) {
              e.showSuccess(n.Data, t);
              addLog(
                `[${new Date().toLocaleTimeString("zh-CN")}] 第 ${runCount} 次提交成功，下次提交时间 ${nextUpdateTime} `
              );
              setTimeout(() => {
                el.__vue__.showWindow = false;
              }, 3000);
            }
            if (400 == n.RespCode) {
              if ("登录验证失败" == n.Message) {
                uni.showModal({
                  title: "提示",
                  content: "登录已失效，请重新登录。",
                  confirmText: "确定",
                  showCancel: !1,
                  success: function (t) {
                    uni.removeStorageSync("token"),
                      uni.removeStorageSync("isLogin"),
                      uni.switchTab({
                        url: "/pages/member/main",
                      });
                  },
                });
                addLog(`登录失效，需要重新登录`);
                alert("登录失效，请重新登录");
              } else {
                uni.showToast({
                  title: n.Message,
                  icon: "none",
                });
                addLog(
                  `[${new Date().toLocaleTimeString("zh-CN")}] 第 ${runCount} 次提交异常:\n${
                    n.Message
                  }\n下次提交时间 ${nextUpdateTime}`
                );
              }
            }
          });
      };
    }
    let lastRunTime = 0;
    let updateRate = timeList[new Date().getHours()];
    let nextRunTime = new Date().getMinutes() + updateRate;
    let h = new Date().getHours();
    if (nextRunTime >= 60) {
      h++;
      nextRunTime = nextRunTime - 60;
    }
    addLog(`初次执行时间为 ${h}:${nextRunTime}:00`);
    function loop() {
      timeout = setTimeout(loop, 100);
      updateRate = timeList[new Date().getHours()];
      if (updateRate == -1) {
        console.log("该时间段跳过");
        return;
      }
      let m = new Date().getMinutes();
      let s = new Date().getSeconds();
      console.log(m, nextRunTime, s, 0, lastRunTime, nextRunTime);
      console.log(m == nextRunTime, s == 0, lastRunTime !== nextRunTime);
      if (m == nextRunTime && s == 0 && lastRunTime !== nextRunTime) {
        lastRunTime = nextRunTime;
        updates();
      } else if (lastRunTime == nextRunTime) {
        nextRunTime = lastRunTime + updateRate;
        if (nextRunTime >= 60) {
          nextRunTime = nextRunTime - 60;
        }
      }
    }
    loop();
  }
  function addLog(str) {
    let text = document.createElement("p");
    text.style.marginTop = "6px";
    text.innerText = str;
    insertAfter(text, title);
  }
  function insertAfter(newElement, targetElement) {
    var parent = targetElement.parentNode;
    if (parent.lastChild == targetElement) {
      parent.appendChild(newElement);
    } else {
      parent.insertBefore(newElement, targetElement.nextSibling);
    }
  }
})();
