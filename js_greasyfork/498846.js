// ==UserScript==
// @name        rush4award
// @namespace   vurses
// @license     Mit
// @match       https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=*
// @match       https://www.bilibili.com/blackboard/era/award-exchange.html?task_id=*
// @version     3.8.0
// @author      layenh
// @icon        https://i0.hdslb.com/bfs/activity-plat/static/b9vgSxGaAg.png
// @homepage    https://github.com/vruses/get-bili-redeem
// @supportURL  https://github.com/vruses/get-bili-redeem/issues
// @require     https://update.greasyfork.org/scripts/535838/1588053/NumberInput.js
// @require     https://update.greasyfork.org/scripts/535840/1588055/FloatButton.js
// @run-at      document-start
// @grant       none
// @description 🔥功能介绍：1、支持B站所有激励计划，是否成功取决于b站接口是否更新，与游戏版本无关；2、根据验证码通过情况自适应请求速度
// @downloadURL https://update.greasyfork.org/scripts/498846/rush4award.user.js
// @updateURL https://update.greasyfork.org/scripts/498846/rush4award.meta.js
// ==/UserScript==

const storage = {
  set(key, value) {
    try {
      const data = JSON.stringify(value);
      localStorage.setItem(key, data);
    } catch (e) {
      console.error("Storage Set Error:", e);
    }
  },

  get(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data !== null ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error("Storage Get Error:", e);
      return defaultValue;
    }
  },
};

let ReceiveTime = storage.get("ReceiveTime", 1000);
let SlowerTime = storage.get("SlowerTime", 3000);

const workerJs = function () {
  class TimerManager {
    constructor() {
      this.timers = new Map();
    }
    set(key, callback, delay) {
      this.clean(key);
      const id = setTimeout(() => {
        callback();
      }, delay);
      this.timers.set(key, id);
    }
    clean(key) {
      if (this.timers.has(key)) {
        clearTimeout(this.timers.get(key));
        this.timers.delete(key);
      }
    }
    cleanAll() {
      for (let id of this.timers.values()) {
        clearTimeout(id);
      }
      this.timers.clear();
    }
    has(key) {
      return this.timers.has(key);
    }
  }
  const manager = new TimerManager();
  // 根据taskName设置定时
  self.addEventListener("message", function (e) {
    manager.set(
      e.data.taskName,
      () => self.postMessage(e.data.taskName),
      e.data.time
    );
  });
};

workerJs.toString();
const blob = new Blob([`(${workerJs})()`], { type: "application/javascript" });
const url = URL.createObjectURL(blob);
const worker = new Worker(url);

const originalCall = Function.prototype.call;

Function.prototype.call = function (...args) {
  if (this.name === "fb94") {
    let funcStr = this.toString();
    const oldIndex = funcStr.indexOf("this.$nextTick(()=>{}),");
    // const newIndex = funcStr.indexOf("this.$nextTick((function(){})),");
    if (oldIndex !== -1) {
      funcStr.indexOf("this.$nextTick(()=>{}),");
      funcStr = funcStr.replace(
        `this.$nextTick(()=>{}),`,
        (res) =>
          res +
          "Object.assign(window,{awardInstance:this}),Object.assign(window,{utils:v}),"
      );
      // 禁止pub&notify错误页消息
      funcStr = funcStr.replace(
        `setCommonDialog(t){b.commonErrorDialog=t},`,
        `setCommonDialog(t){},`
      );
      // 防止不再弹出验证码
      funcStr = funcStr.replace(`e.destroy()`, ``);
      funcStr = eval("(" + funcStr + ")");
    } else {
      // 新版页面patch
      // 定位目标函数，获取被压缩的函数名(A-Z)
      const target1 = "(this.taskKey)";
      const index1 = funcStr.indexOf(target1);
      // 用于暴露获取奖励信息的函数
      const infoFuncName = funcStr.charAt(index1 - 1);

      const target2 = "(this.actId).then";
      const index2 = funcStr.indexOf(target2);
      // 用于暴露获取奖励cdk的函数
      const historyFuncName = funcStr.charAt(index2 - 1);

      // 动态注入函数名
      funcStr = funcStr.replace(
        `this.$nextTick((function(){})),`,
        (res) =>
          res +
          `Object.assign(window,{awardInstance:this}),Object.assign(window,{utils:{getBounsInfo:${infoFuncName},getBounsHistory:${historyFuncName}}}),`
      );
      // 禁止pub&notify错误页消息
      funcStr = funcStr.replace(`I.commonErrorDialog=t`, ``);
      funcStr = eval("(" + funcStr + ")");
    }

    return originalCall.apply(funcStr, args);
  }
  return originalCall.apply(this, args);
};

const originalFetch = window.fetch;

window.fetch = function (input, init = {}) {
  let url = "";
  // 处理 input 可能是字符串或 Request 对象
  if (typeof input === "string") {
    url = input;
  } else if (input instanceof Request) {
    url = input.url;
  }
  if (url.includes("/x/activity_components/mission/receive")) {
    return originalFetch
      .call(this, input, init)
      .then((res) => {
        res
          .clone()
          .json()
          .then((res) => {
            if (res.code === 202100) {
              // 由于移除了验证码机制，这部分逻辑可能会在未来移除
              document.querySelector("a.geetest_close")?.click();
              worker.postMessage({ taskName: "receiveTask", time: SlowerTime });
            } else {
              worker.postMessage({
                taskName: "receiveTask",
                time: ReceiveTime,
              });
            }
          });
        return res;
      })
      .catch((e) => {
        console.log(e);
      });
  }
  return originalFetch.call(this, input, init);
};

window.addEventListener("load", function () {
  // 插入到页面的一些信息
  const totalStockEl = document.createElement("p");
  totalStockEl.className = "extra-info";
  totalStockEl.textContent = `总剩余量: ${"未获取"}`;
  const cdKeyEl = document.createElement("p");
  cdKeyEl.className = "extra-info";
  cdKeyEl.textContent = `cdKey: ${"未获取"}`;
  const awardPreviewEl = document.createElement("div");
  awardPreviewEl.className = "award-preview";
  awardPreviewEl.append(cdKeyEl, totalStockEl);
  // 文字可选中
  document.querySelector(".award-wrap").style.userSelect = "text";
  document.querySelector(".award-wrap").append(awardPreviewEl);
  if (awardInstance?.cdKey) {
    return;
  }
  const loopRequest = function () {
    return new Promise((res, rej) => {
      setTimeout(res, 1000);
    })
      .then(() => {
        awardInstance.handelReceive("user");
      })
      .catch((e) => {
        console.log(e);
        loopRequest();
      });
  };
  loopRequest();
  // 定时获取新的信息
  setInterval(() => {
    worker.postMessage({ taskName: "getInfoTask", time: 0 });
  }, SlowerTime);
  console.log(awardInstance);
  awardInstance.$watch("pageError", function (newVal, oldVal) {
    this.pageError = false;
  });
  awardInstance.$watch("cdKey", function (newVal, oldVal) {
    window.fetch = originalFetch;
    worker.terminate();
  });
  worker.addEventListener("message", function (e) {
    if (e.data === "receiveTask") {
      awardInstance.handelReceive("user");
    } else if (e.data === "getInfoTask") {
      // 更新显示信息
      utils.getBounsHistory(awardInstance.actId).then((res) => {
        // 根据活动id取出对应兑换码
        const id = awardInstance.awardInfo.award_inner_id || 0;
        const i = res?.list?.find((t) => t.award_id === id);
        awardInstance.cdKey = i?.extra_info?.cdkey_content || "";
      });
      utils.getBounsInfo(awardInstance.taskId).then((res) => {
        totalStockEl.textContent = `总剩余量：${res.stock_info.total_stock}%`;
        cdKeyEl.textContent = `cdKey：${awardInstance.cdKey}`;
      });
    }
  });
});

// 在修改间隔后进行存储
// 每次请求发起的间隔
const receiveInput = document.createElement("input-number");
receiveInput.value = ReceiveTime / 1000;
receiveInput._value = receiveInput.value;
Object.defineProperty(receiveInput, "value", {
  get() {
    return this._value;
  },
  set(value) {
    console.log("receive:" + value);
    ReceiveTime = value * 1000;
    storage.set("ReceiveTime", value * 1000);
    this._value = value;
  },
});
// 每次验证使用的时间
const validateInput = document.createElement("input-number");
validateInput.value = SlowerTime / 1000;
validateInput._value = validateInput.value;
Object.defineProperty(validateInput, "value", {
  get() {
    return this._value;
  },
  set(value) {
    console.log("validate:" + value);
    SlowerTime = value * 1000;
    storage.set("SlowerTime", value * 1000);
    this._value = value;
  },
});
// 请求插槽
const intervalFaster = document.createElement("div");
intervalFaster.slot = "interval-faster";
intervalFaster.style.display = "flex";
intervalFaster.style.alignItems = "center";
intervalFaster.innerHTML = `<span style="width: 70px">请求间隔</span>`;
// 验证插槽
const intervalSlower = document.createElement("div");
intervalSlower.slot = "interval-slower";
intervalSlower.style.display = "flex";
intervalSlower.style.alignItems = "center";
intervalSlower.innerHTML = `<span style="width: 70px">信息同步</span>`;

intervalFaster.append(receiveInput);
intervalSlower.append(validateInput);

const floatButton = document.createElement("float-button");
floatButton.append(intervalFaster, intervalSlower);
document.documentElement.append(floatButton);
