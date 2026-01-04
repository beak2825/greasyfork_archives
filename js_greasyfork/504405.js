// ==UserScript==
// @name         new-award-exchange抢码脚本
// @namespace    none
// @version      1.4.9.1
// @description  抢码
// @author       LynLuc
// @match        *://www.bilibili.com/blackboard/activity-Cf9EeKvyZ4.html*
// @grant        none
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504405/new-award-exchange%E6%8A%A2%E7%A0%81%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/504405/new-award-exchange%E6%8A%A2%E7%A0%81%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
// Proxy configuration
const proxyConfig = {
  enable: false, // 是否启用代理
  proxyUrl: "", // 代理服务器地址
  proxyCookies: "", // 代理服务器cookie
  SESSDATA: "",
};
const fetchh = fetch;
// 读取本地代理配置
(function loadProxyConfigFromLocal() {
  try {
    const local = localStorage.getItem("bili_proxy_config");
    if (local) {
      const obj = JSON.parse(local);
      // 不自动覆盖enable，始终默认不代理
      delete obj.enable;
      Object.assign(proxyConfig, obj);
      proxyConfig.enable = false;
    }
  } catch (e) {
    console.warn("本地代理配置读取失败", e);
  }
})();

//入口https://www.bilibili.com/blackboard/activity-Cf9EeKvyZ4.htmll
let web_location = 888.138163;
let sendDelay = 500;
let scheduleTime = [0, 59, 57];
let bnum = 0;

// 星穹铁道每日任务ID配置
const srTaskProgressIds =
  "6ERAxwloghv53z00,6ERAxwloghv4g800,6ERAxwloghv4g900,6ERAxwloghv47300,6ERAxwloghv3kc00,6ERAxwloghv33n00,6ERAxwloghv4jn00,6ERAxwloghv53e00,6ERAxwloghv32000,6ERAxwloghv52p00,6ERAxwloghv4ax00,6ERAxwloghv3xv00,6ERAxwloghv4aa00,6ERAxwloghv3xi00,6ERAxwloghv4gj00,6ERAxwloghv4kb00,6ERAxwloghv4zp00,6ERAxwloghv3kx00,6ERAxwloghv33600";
const jqlTaskProgressIds =
  "6ERAxwloghvvo400,6ERAxwloghvbib00,6ERAxwloghvbv200,6ERAxwloghvvon00,6ERAxwloghvnkl00,6ERAxwloghvv0s00,6ERAxwloghvvpt00,6ERAxwloghvbgw00,6ERAxwloghvbld00,6ERAxwloghvbvp00,6ERAxwloghvbi800,6ERAxwloghvbub00,6ERAxwloghvnte00";
const DNATaskProgressIds =
  "6ERAxwloghv74800,6ERAxwloghv8sa00,6ERAxwloghv7rf00,6ERAxwloghv7qh00,6ERAxwloghv7y900,6ERAxwloghv8yq00,6ERAxwloghv7fp00,6ERAxwloghv74700";
const srTaskDailyIds = "6ERAxwloghv4gk00,6ERAxwloghv4pn00";
const jqlTaskDailyIds =
  "6ERAxwloghvbcy00,6ERAxwloghvbct00,6ERAxwloghvvo500,6ERAxwloghvns700";
const DNATaskDailyIds =
  "6ERAxwloghv7t200,6ERAxwloghv8zf00,6ERAxwloghv7zz00,6ERAxwloghv8zd00";
// 添加版本配置
const versionConfig = {
  versions: [
    {
      id: "1ERA5wloghv16x00",
      name: "二重螺旋1.1",
      description: "二重螺旋公测创作者激励计划",
    },
    {
      id: "1ERA5wloghv1h200",
      name: "崩坏星穹铁道3.8",
      description: "崩坏：星穹铁道3.8创作者激励计划",
    },
    {
      id: "1ERA5wloghvxjg00",
      name: "绝区零2.4",
      description: "绝区零2.4版本兑换码",
    },
    {
      id: "1ERA5wloghvl3n00",
      name: "二重螺旋1.0",
      description: "二重螺旋公测创作者激励计划",
    },
    {
      id: "1ERA4wloghvmrs00",
      name: "崩坏星穹铁道3.7",
      description: "崩坏：星穹铁道3.7创作者激励计划",
    },
    {
      id: "1ERA4wloghvm0j00",
      name: "绝区零2.3",
      description: "绝区零2.3版本兑换码",
    },
    {
      id: "1ERA4wloghvgku00",
      name: "绝区零2.2",
      description: "绝区零2.2版本兑换码",
    },
    {
      id: "1ERA4wloghv8zz00",
      name: "崩坏星穹铁道3.5",
      description: "崩坏：星穹铁道3.5创作者激励计划",
    },
    {
      id: "1ERA3wloghv71w00",
      name: "绝区零2.1",
      description: "绝区零2.1版本兑换码",
    },

    {
      id: "1ERA3wloghv8if00",
      name: "崩坏星穹铁道3.4",
      description: "崩坏：星穹铁道3.4创作者激励计划",
    },
    {
      id: "1ERA4wloghvdht00",
      name: "绝区零2.0",
      description: "绝区零2.0版本兑换码",
    },
    {
      id: "1ERA4wloghvfwr00",
      name: "崩坏星穹铁道3.3",
      description: "崩坏：星穹铁道3.3创作者激励计划",
    },
    {
      id: "1ERA3wloghvpu000",
      name: "绝区零1.7",
      description: "绝区零1.7版本兑换码",
    },
    {
      id: "1ERA3wloghvdym00",
      name: "崩坏星穹铁道3.2",
      description: "崩坏：星穹铁道3.2创作者激励计划",
    },
    {
      id: "1ERA3wloghvc8700",
      name: "绝区零1.6",
      description: "绝区零1.6版本兑换码",
    },
    {
      id: "1ERA3wloghvl0700",
      name: "崩坏星穹铁道3.1",
      description: "崩坏星穹铁道3.1版本兑换码",
    },
    {
      id: "1ERA2wloghvvtb00",
      name: "绝区零1.5",
      description: "绝区零1.5版本兑换码",
    },
    {
      id: "1ERA2wloghvvjq00",
      name: "崩坏星穹铁道3.0",
      description: "崩坏星穹铁道3.0版本兑换码",
    },
  ],
};
(function delOriginHtml() {
  if (bnum >= 10) {
    return;
  }
  bnum++;
  // 获取body元素
  const body = document.body;
  document.title = "抢码工具";

  // 收集所有不包含'h-100'类的子元素
  // 注意：这里我们使用Array.from()将NodeList转换为数组，以便使用filter等方法
  const elementsToRemove = Array.from(body.children).filter((element) => {
    // 使用classList.contains()检查元素是否不包含'h-100'类
    return (
      !element.classList.contains("protected") &&
      !element.classList.contains("geetest_wind") &&
      !element.classList.contains("modal-backdrop") &&
      !element.classList.contains("toast-container")
    );
  });

  // 反向遍历并删除这些元素
  // 从后向前遍历是因为直接删除元素会改变索引，导致出错
  for (let i = elementsToRemove.length - 1; i >= 0; i--) {
    elementsToRemove[i].remove();
  }

  setTimeout(delOriginHtml, 1000);
})();
if (
  !document.querySelector(
    'link[href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/css/bootstrap.min.css"]'
  )
) {
  // 创建一个新的link元素
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/css/bootstrap.min.css";
  // 将link元素添加到head中
  document.head.appendChild(link);
}
// 创建一个新的script元素
var script = document.createElement("script");
script.src =
  "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/js/bootstrap.bundle.min.js";
// 将script元素添加到body中
document.head.appendChild(script);
(function adjustRem() {
  // 获取屏幕的宽度
  const screenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  // 根据屏幕宽度设置不同的基础字体大小
  // 这里只是一个示例，你可以根据需要调整这些值
  let baseFontSize;
  if (screenWidth >= 1200) {
    baseFontSize = 16; // 对于大屏幕，设置基础字体大小为16px
  } else if (screenWidth >= 992) {
    baseFontSize = 15; // 对于中等屏幕，设置基础字体大小为14px
  } else if (screenWidth >= 768) {
    baseFontSize = 14; // 对于较小屏幕，设置基础字体大小为12px
  } else {
    baseFontSize = 13; // 对于非常小的屏幕，设置基础字体大小为10px
  }

  // 设置根元素的字体大小
  setTimeout(() => {
    document.documentElement.style.fontSize = `${baseFontSize}px`;
  }, 1000);
  document.documentElement.style.fontSize = `${baseFontSize}px`;
  window.addEventListener("resize", adjustRem);
})();

class Queue {
  constructor() {
    this.queue = [];
  }

  // 入队，传入一个函数和该函数的参数数组
  enqueue(func, taskName, ...args) {
    this.queue.push({ func, taskName, args });
  }
  // 删除指定索引的任务
  removeTask(index) {
    if (index >= 0 && index < this.queue.length) {
      this.queue.splice(index, 1); // 使用splice方法删除指定索引的任务
    }
  }

  // 异步执行队列中的函数，并在成功后出队
  async run() {
    while (true) {
      if (this.queue.length <= 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 等待1秒
        continue;
      }
      const { func, taskName, args } = this.queue[0];
      try {
        const result = await func(...args);
        if (result === true) {
          // 如果函数返回true，则从队列中移除该任务
          this.queue.shift();
          console.log(`Task "${taskName}" completed successfully.`);
        } else {
          console.log(`Task "${taskName}" did not return true`);
          // 如果函数没有返回true，但也没有抛出错误，可以增加尝试次数（可选）
          // 注意：这里我们没有增加尝试次数，因为题目没有明确要求
          // 如果需要，可以修改成 this.queue[0].attempts++;
        }
      } catch (error) {
        console.log(`Task "${taskName}" failed with error:`, error);
        console.error("Error executing function:", error);
        // 如果需要，可以在这里处理错误，比如重试逻辑（可选）
        // 注意：简单的重试逻辑可能需要额外的逻辑来避免无限循环
      } finally {
        //无论如何都严格延时一秒执行下一个任务
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 等待1秒
      }
      // 这里没有使用setTimeout或延迟，因为题目要求是在函数执行完毕后立即检查
    }

    // 如果队列在执行过程中变空，并且有可能有新任务添加进来，
    // 但我们没有新的任务要执行（isRunning已经是false），
    // 我们可以考虑在队列非空时再次启动run方法（可选，取决于具体需求）
    // 但在这个简单的示例中，我们假设enqueue会负责启动run如果需要的话
  }
  // 首个出队
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.shift();
  }

  // 查看队首元素
  front() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[0];
  }

  // 检查队列是否为空
  isEmpty() {
    return this.items.length === 0;
  }

  // 获取队列大小
  size() {
    return this.items.length;
  }

  // 打印队列
  print() {
    console.log(this.items.toString());
  }
}

/**
 * 获取用户info
 * return { "mid": 用户mid , "follower": 粉丝数 };z
 */
function myInfo() {
  return fetch("https://api.bilibili.com/x/space/v2/myinfo", {
    headers: {
      accept: "*/*",
      "accept-language": "zh-CN,zh;q=0.9",
      // 注意：通常不需要显式设置 accept 为 "*/*"，因为这是浏览器的默认值
      // 但这里保留以符合您的原始代码
    },
    method: "GET",
    mode: "cors",
    credentials: "include", // 如果需要包含 Cookies，请保留此设置
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // 处理用户信息
      if (data.code !== 0) {
        alert(data.message);
        throw new Error("Failed to retrieve user info"); // 使用 throw 抛出错误，以便在调用者处捕获
      }
      return {
        mid: data.data.profile.mid,
        follower: data.data.follower,
        name: data.data.profile.name,
      };
    })
    .catch((error) => {
      console.error("There was a problem with your fetch operation:", error);
      throw error; // 重新抛出错误，以便在调用者处可以进一步处理
    });
}
async function delay(time) {
  await new Promise(async (resolve) => {
    setTimeout(resolve, time);
  });
}

(function () {
  "use strict";
  let queue = new Queue();
  queue.run();
  let apiData = {};
  let csrf = (function getCsrf() {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key.trim() === "bili_jct") {
        return value.trim();
      }
    }
    return null;
  })();

  // 添加csrf自动更新逻辑
  function updateCsrf() {
    const newCsrf = document.cookie
      .split("; ")
      .find((row) => row.startsWith("bili_jct="))
      ?.split("=")[1];
    if (newCsrf && newCsrf !== csrf) {
      csrf = newCsrf;
      console.log("CSRF token updated");
      addAlertTip("更新", "CSRF token已更新");
    }
  }

  // 监听页面可见性变化
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      updateCsrf();
    }
  });

  // 定期检查csrf (每5分钟)
  setInterval(updateCsrf, 300000);
  let totalDelay = []; //记录延迟
  let requestCount = 0;
  let avgDelay = 60;
  // 任务间隔延迟（用于相邻任务发送的附加间隔，原 luckyNum）
  let taskIntervalMs = 20;
  function calDelay() {
    let num = 0;
    for (let i = 0; i < totalDelay.length; i++) {
      if (num > 1000) {
        //舍弃过大的延迟
        continue;
      }
      num += totalDelay[i];
    }
    avgDelay = Math.floor(num / requestCount);
    console.log(`平均延迟: ${avgDelay}ms`);

    // 将计算得到的平均延迟同步到定时设置里，作为后续可复用的"任务间隔延迟"
    try {
      const saved = localStorage.getItem("bili_schedule_config");
      const cfg = saved ? JSON.parse(saved) : {};
      // 建议值为网络平均延迟的整数毫秒
      const recommendedDelay = Math.max(0, Math.round(avgDelay || 0));
      cfg.delay = recommendedDelay; // 存作建议值
      localStorage.setItem("bili_schedule_config", JSON.stringify(cfg));

      // 即时生效到当前运行时（仅作为建议显示，不强制改动计划任务间隔）
      if (typeof sendDelay !== "undefined") {
        sendDelay = recommendedDelay;
      }

      // 若设置窗口已打开，更新"网络平均延迟"输入框显示
      const delayInput = document.getElementById("scheduleNetworkDelay");
      if (delayInput) {
        delayInput.value = String(recommendedDelay);
      }
    } catch (e) {
      // 忽略本地存储异常，避免打断主流程
    }
  }
  //
  //
  //
  let i = localStorage.getItem("wbi_img_urls"),
    regex = /([a-f0-9]{32})/g;
  if (i) {
    i = i.split("-");
  } else {
    i = [
      localStorage.getItem("wbi_img_url"),
      localStorage.getItem("wbi_sub_url"),
    ];
  }
  let n = i[0].match(regex),
    r = i[1].match(regex);
  const e = (function (t) {
    const e = [];
    return (
      [
        46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5,
        49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24,
        55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63,
        57, 62, 11, 36, 20, 34, 44, 52,
      ].forEach((n) => {
        t.charAt(n) && e.push(t.charAt(n));
      }),
      e.join("").slice(0, 32)
    );
  })(n + r); //n和r是localStorage.wbi_img_urls
  let u1 = `wts=${Math.round(Date.now() / 1e3)}`; //wts
  let bin = {
    stringToBytes: function (t) {
      for (var e = [], n = 0; n < t.length; n++) e.push(255 & t.charCodeAt(n));
      return e;
    },
    bytesToString: function (t) {
      for (var e = [], n = 0; n < t.length; n++)
        e.push(String.fromCharCode(t[n]));
      return e.join("");
    },
  };
  let utf8 = {
    stringToBytes: function (t) {
      return bin.stringToBytes(unescape(encodeURIComponent(t)));
    },
    bytesToString: function (t) {
      return decodeURIComponent(escape(u.bin.bytesToString(t)));
    },
  };
  let n0 = function (t) {
    return (
      null != t &&
      (d(t) ||
        (function (t) {
          return (
            "function" == typeof t.readFloatLE &&
            "function" == typeof t.slice &&
            d(t.slice(0, 0))
          );
        })(t) ||
        !!t._isBuffer)
    );
  };
  function d(t) {
    return (
      !!t.constructor &&
      "function" == typeof t.constructor.isBuffer &&
      t.constructor.isBuffer(t)
    );
  }
  let t = {
    rotl: function (t, e) {
      return (t << e) | (t >>> (32 - e));
    },
    rotr: function (t, e) {
      return (t << (32 - e)) | (t >>> e);
    },
    endian: function (t) {
      if (t.constructor == Number)
        return (16711935 & this.rotl(t, 8)) | (4278255360 & this.rotl(t, 24));
      for (var n = 0; n < t.length; n++) t[n] = this.endian(t[n]);
      return t;
    },
    randomBytes: function (t) {
      for (var e = []; t > 0; t--) e.push(Math.floor(256 * Math.random()));
      return e;
    },
    bytesToWords: function (t) {
      for (var e = [], n = 0, r = 0; n < t.length; n++, r += 8)
        e[r >>> 5] |= t[n] << (24 - (r % 32));
      return e;
    },
    wordsToBytes: function (t) {
      for (var e = [], n = 0; n < 32 * t.length; n += 8)
        e.push((t[n >>> 5] >>> (24 - (n % 32))) & 255);
      return e;
    },
    bytesToHex: function (t) {
      for (var e = [], n = 0; n < t.length; n++)
        e.push((t[n] >>> 4).toString(16)), e.push((15 & t[n]).toString(16));
      return e.join("");
    },
    hexToBytes: function (t) {
      for (var e = [], n = 0; n < t.length; n += 2)
        e.push(parseInt(t.substr(n, 2), 16));
      return e;
    },
    bytesToBase64: function (e) {
      for (var n = [], r = 0; r < e.length; r += 3)
        for (
          var i = (e[r] << 16) | (e[r + 1] << 8) | e[r + 2], o = 0;
          o < 4;
          o++
        )
          8 * r + 6 * o <= 8 * e.length
            ? n.push(t.charAt((i >>> (6 * (3 - o))) & 63))
            : n.push("=");
      return n.join("");
    },
    base64ToBytes: function (e) {
      e = e.replace(/[^A-Z0-9+\/]/gi, "");
      for (var n = [], r = 0, i = 0; r < e.length; i = ++r % 4)
        0 != i &&
          n.push(
            ((t.indexOf(e.charAt(r - 1)) & (Math.pow(2, -2 * i + 8) - 1)) <<
              (2 * i)) |
              (t.indexOf(e.charAt(r)) >>> (6 - 2 * i))
          );
      return n;
    },
  };
  i = {
    _ff: function (t, e, n, r, i, o, a) {
      var s = t + ((e & n) | (~e & r)) + (i >>> 0) + a;
      return ((s << o) | (s >>> (32 - o))) + e;
    },
    _gg: function (t, e, n, r, i, o, a) {
      var s = t + ((e & r) | (n & ~r)) + (i >>> 0) + a;
      return ((s << o) | (s >>> (32 - o))) + e;
    },
    _hh: function (t, e, n, r, i, o, a) {
      var s = t + (e ^ n ^ r) + (i >>> 0) + a;
      return ((s << o) | (s >>> (32 - o))) + e;
    },
    _ii: function (t, e, n, r, i, o, a) {
      var s = t + (n ^ (e | ~r)) + (i >>> 0) + a;
      return ((s << o) | (s >>> (32 - o))) + e;
    },
    _blocksize: 16,
    _digestsize: 16,
  };

  function i1(o, a) {
    o.constructor == String
      ? (o =
          a && "binary" === a.encoding
            ? bin.stringToBytes(o)
            : utf8.stringToBytes(o))
      : n0(o)
      ? (o = Array.prototype.slice.call(o, 0))
      : Array.isArray(o) || o.constructor === Uint8Array || (o = o.toString());
    for (
      var s = t.bytesToWords(o),
        c = 8 * o.length,
        u = 1732584193,
        l = -271733879,
        f = -1732584194,
        d = 271733878,
        p = 0;
      p < s.length;
      p++
    )
      s[p] =
        (16711935 & ((s[p] << 8) | (s[p] >>> 24))) |
        (4278255360 & ((s[p] << 24) | (s[p] >>> 8)));
    (s[c >>> 5] |= 128 << c % 32), (s[14 + (((c + 64) >>> 9) << 4)] = c);
    var h = i._ff,
      v = i._gg,
      m = i._hh,
      y = i._ii;
    for (p = 0; p < s.length; p += 16) {
      var g = u,
        b = l,
        _ = f,
        w = d;
      (u = h(u, l, f, d, s[p + 0], 7, -680876936)),
        (d = h(d, u, l, f, s[p + 1], 12, -389564586)),
        (f = h(f, d, u, l, s[p + 2], 17, 606105819)),
        (l = h(l, f, d, u, s[p + 3], 22, -1044525330)),
        (u = h(u, l, f, d, s[p + 4], 7, -176418897)),
        (d = h(d, u, l, f, s[p + 5], 12, 1200080426)),
        (f = h(f, d, u, l, s[p + 6], 17, -1473231341)),
        (l = h(l, f, d, u, s[p + 7], 22, -45705983)),
        (u = h(u, l, f, d, s[p + 8], 7, 1770035416)),
        (d = h(d, u, l, f, s[p + 9], 12, -1958414417)),
        (f = h(f, d, u, l, s[p + 10], 17, -42063)),
        (l = h(l, f, d, u, s[p + 11], 22, -1990404162)),
        (u = h(u, l, f, d, s[p + 12], 7, 1804603682)),
        (d = h(d, u, l, f, s[p + 13], 12, -40341101)),
        (f = h(f, d, u, l, s[p + 14], 17, -1502002290)),
        (u = v(
          u,
          (l = h(l, f, d, u, s[p + 15], 22, 1236535329)),
          f,
          d,
          s[p + 1],
          5,
          -165796510
        )),
        (d = v(d, u, l, f, s[p + 6], 9, -1069501632)),
        (f = v(f, d, u, l, s[p + 11], 14, 643717713)),
        (l = v(l, f, d, u, s[p + 0], 20, -373897302)),
        (u = v(u, l, f, d, s[p + 5], 5, -701558691)),
        (d = v(d, u, l, f, s[p + 10], 9, 38016083)),
        (f = v(f, d, u, l, s[p + 15], 14, -660478335)),
        (l = v(l, f, d, u, s[p + 4], 20, -405537848)),
        (u = v(u, l, f, d, s[p + 9], 5, 568446438)),
        (d = v(d, u, l, f, s[p + 14], 9, -1019803690)),
        (f = v(f, d, u, l, s[p + 3], 14, -187363961)),
        (l = v(l, f, d, u, s[p + 8], 20, 1163531501)),
        (u = v(u, l, f, d, s[p + 13], 5, -1444681467)),
        (d = v(d, u, l, f, s[p + 2], 9, -51403784)),
        (f = v(f, d, u, l, s[p + 7], 14, 1735328473)),
        (u = m(
          u,
          (l = v(l, f, d, u, s[p + 12], 20, -1926607734)),
          f,
          d,
          s[p + 5],
          4,
          -378558
        )),
        (d = m(d, u, l, f, s[p + 8], 11, -2022574463)),
        (f = m(f, d, u, l, s[p + 11], 16, 1839030562)),
        (l = m(l, f, d, u, s[p + 14], 23, -35309556)),
        (u = m(u, l, f, d, s[p + 1], 4, -1530992060)),
        (d = m(d, u, l, f, s[p + 4], 11, 1272893353)),
        (f = m(f, d, u, l, s[p + 7], 16, -155497632)),
        (l = m(l, f, d, u, s[p + 10], 23, -1094730640)),
        (u = m(u, l, f, d, s[p + 13], 4, 681279174)),
        (d = m(d, u, l, f, s[p + 0], 11, -358537222)),
        (f = m(f, d, u, l, s[p + 3], 16, -722521979)),
        (l = m(l, f, d, u, s[p + 6], 23, 76029189)),
        (u = m(u, l, f, d, s[p + 9], 4, -640364487)),
        (d = m(d, u, l, f, s[p + 12], 11, -421815835)),
        (f = m(f, d, u, l, s[p + 15], 16, 530742520)),
        (u = y(
          u,
          (l = m(l, f, d, u, s[p + 2], 23, -995338651)),
          f,
          d,
          s[p + 0],
          6,
          -198630844
        )),
        (d = y(d, u, l, f, s[p + 7], 10, 1126891415)),
        (f = y(f, d, u, l, s[p + 14], 15, -1416354905)),
        (l = y(l, f, d, u, s[p + 5], 21, -57434055)),
        (u = y(u, l, f, d, s[p + 12], 6, 1700485571)),
        (d = y(d, u, l, f, s[p + 3], 10, -1894986606)),
        (f = y(f, d, u, l, s[p + 10], 15, -1051523)),
        (l = y(l, f, d, u, s[p + 1], 21, -2054922799)),
        (u = y(u, l, f, d, s[p + 8], 6, 1873313359)),
        (d = y(d, u, l, f, s[p + 15], 10, -30611744)),
        (f = y(f, d, u, l, s[p + 6], 15, -1560198380)),
        (l = y(l, f, d, u, s[p + 13], 21, 1309151649)),
        (u = y(u, l, f, d, s[p + 4], 6, -145523070)),
        (d = y(d, u, l, f, s[p + 11], 10, -1120210379)),
        (f = y(f, d, u, l, s[p + 2], 15, 718787259)),
        (l = y(l, f, d, u, s[p + 9], 21, -343485551)),
        (u = (u + g) >>> 0),
        (l = (l + b) >>> 0),
        (f = (f + _) >>> 0),
        (d = (d + w) >>> 0);
    }
    return t.endian([u, l, f, d]);
  }

  function p(e, n) {
    if (null == e) throw new Error("Illegal argument " + e);
    var o = t.wordsToBytes(i1(e, n));
    return n && n.asBytes
      ? o
      : n && n.asString
      ? bin.bytesToString(o)
      : t.bytesToHex(o);
  }

  function get_w_rid(task_id) {
    if (!(n || r)) {
      return null;
    }
    let unit1 = "";
    if (task_id) {
      unit1 = `task_id=${task_id}&web_location=${web_location}&`;
    }
    let now = Math.round(Date.now() / 1e3);
    let data = {
      wts: (u1 = `${unit1}wts=${now}`),
      w_rid: p(u1 + e),
      time: now,
    };
    return data;
  }
  //获取w_rid,若无w_rid和wts信息进行send请求,可能会遇到拦截
  //
  //

  // Proxy request function 代理方法
  async function forProxy(url, options = {}) {
    // 未启用代理时直接发送请求
    if (!proxyConfig.enable) {
      return fetchh(url, options);
    }

    // 检查是否需要加Cookie
    let sendOptions = { ...options };
    if (sendOptions.credentials === "include" && proxyConfig.proxyCookies) {
      if (!sendOptions.headers) sendOptions.headers = {};
      sendOptions.headers["Cookie"] = proxyConfig.proxyCookies;
    }

    // 准备代理请求配置
    const proxyOptions = {
      method: "POST",
      headers: {
        "X-Proxy-URL": url, // 原始目标URL
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendOptions), // 原始请求配置作为body
      credentials: "include", // 携带凭证
    };

    // 发送代理请求
    try {
      const response = await fetchh(proxyConfig.proxyUrl, proxyOptions);
      return response; // 改回直接返回response对象
    } catch (error) {
      console.error("代理请求错误:", error);
      throw error;
    }
  }
  const fetch = forProxy;

  // 任务API对象
  const TaskAPI = {
    taskDataCache: {},
    processedTaskListCache: {},

    // 清理无效的已选择任务ID（当任务列表更新时）
    cleanupInvalidSelectedTaskIds(gameType, validSids) {
      try {
        // 从本地存储读取当前配置
        const saved = localStorage.getItem("bili_schedule_config");
        if (!saved) return;

        const cfg = JSON.parse(saved);
        if (!cfg.selectedTaskIds || !cfg.selectedTaskIds[gameType]) return;

        const validSidSet = new Set(validSids.map(String));
        const originalLength = cfg.selectedTaskIds[gameType].length;

        // 过滤掉无效的sid
        cfg.selectedTaskIds[gameType] = cfg.selectedTaskIds[gameType].filter(
          (sid) => validSidSet.has(String(sid))
        );

        // 如果有清理，则更新存储
        if (cfg.selectedTaskIds[gameType].length !== originalLength) {
          localStorage.setItem("bili_schedule_config", JSON.stringify(cfg));
          console.log(
            `[TaskAPI] 清理了 ${gameType} 游戏类型中 ${
              originalLength - cfg.selectedTaskIds[gameType].length
            } 个无效的已选择任务ID`
          );
        }
      } catch (e) {
        console.error("[TaskAPI] 清理无效任务ID时出错:", e);
      }
    },

    // 读取已选择的定时任务 sid 列表（按游戏类型）
    getSelectedTaskIds(gameType) {
      try {
        // 直接从本地存储读取，避免依赖 scheduleConfig 的加载状态
        const saved = localStorage.getItem("bili_schedule_config");
        if (!saved) return [];
        const cfg = JSON.parse(saved);
        const byGame =
          cfg && cfg.selectedTaskIds && cfg.selectedTaskIds[gameType];
        return Array.isArray(byGame) ? byGame.map(String) : [];
      } catch (e) {
        return [];
      }
    },

    // 全局任务数据缓存
    taskDataCache: {
      sr: null,
      jql: null,
      dna: null,
      lastUpdate: null,
    },

    // 全局处理后的任务列表缓存
    processedTaskListCache: {
      sr: null,
      jql: null,
      dna: null,
      lastUpdate: null,
    },

    // 全局活动ID缓存
    activityIdCache: {
      sr: null,
      jql: null,
      dna: null,
    },

    /**
     * 获取任务进度数据
     * @param {string} taskIds - 逗号分隔的任务ID列表
     * @returns {Promise<Object>} - 任务数据的响应对象
     */
    async getTaskProgress(taskIds) {
      try {
        const url = `https://api.bilibili.com/x/task/totalv2?csrf=${csrf}&task_ids=${taskIds}&web_location=${web_location}`;

        const response = await fetch(url, {
          headers: {
            accept: "*/*",
            "accept-language": "zh-CN,zh;q=0.9",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
          },
          method: "GET",
          mode: "cors",
          credentials: "include",
        });

        return await response.json();
      } catch (error) {
        console.error("获取任务进度失败:", error);
        throw error;
      }
    },

    /**
     * 获取并缓存任务数据
     * @param {string} gameType - 游戏类型 ('sr', 'jql' 或 'dna')
     * @param {boolean} forceRefresh - 是否强制刷新缓存
     * @returns {Promise<Object>} - 任务数据
     */
    async getTaskDataWithCache(gameType, forceRefresh = false) {
      const cacheKey = gameType;
      const now = Date.now();

      // 改为每次都从接口获取最新数据
      try {
        let taskIds = "";
        if (gameType === "sr") {
          taskIds = srTaskDailyIds + "," + srTaskProgressIds;
        } else if (gameType === "jql") {
          taskIds = jqlTaskDailyIds + "," + jqlTaskProgressIds;
        } else if (gameType === "dna") {
          taskIds = DNATaskDailyIds + "," + DNATaskProgressIds;
        } else {
          throw new Error("无效的游戏类型");
        }

        console.log(`获取${gameType}任务数据...`);
        const data = await this.getTaskProgress(taskIds);

        // 更新缓存
        this.taskDataCache[cacheKey] = data;
        this.taskDataCache.lastUpdate = now;

        // 获取活动ID（如果还没有缓存的话）
        if (
          !this.activityIdCache[cacheKey] &&
          data.code === 0 &&
          data.data.list &&
          data.data.list.length > 0
        ) {
          await this.cacheActivityId(gameType, data.data.list[0]);
        }

        // 同时处理数据并缓存处理后的结果
        let actName = "";
        if (gameType === "sr") {
          actName = "崩坏星穹铁道";
        } else if (gameType === "jql") {
          actName = "绝区零";
        } else if (gameType === "dna") {
          actName = "二重螺旋";
        }

        const processedData = this.convertToTaskListFormat(data, actName);
        this.processedTaskListCache[cacheKey] = processedData;
        this.processedTaskListCache.lastUpdate = now;

        console.log(`${gameType}任务数据、活动ID和处理后的结果已更新`);
        return data;
      } catch (error) {
        console.error(`获取${gameType}任务数据失败:`, error);
        throw error;
      }
    },

    /**
     * 获取处理后的任务列表缓存
     * @param {string} gameType - 游戏类型 ('sr', 'jql' 或 'dna')
     * @param {boolean} forceRefresh - 是否强制刷新缓存
     * @returns {Promise<Array>} - 处理后的任务列表
     */
    async getProcessedTaskListCache(gameType, forceRefresh = false) {
      const cacheKey = gameType;
      // 改为每次都重新获取并处理数据
      console.log(`重新获取并处理${gameType}任务数据...`);
      await this.getTaskDataWithCache(gameType, true);
      return this.processedTaskListCache[cacheKey];
    },

    /**
     * 获取任务状态文本和样式类
     * @param {number} status - 任务状态码 (1:未达成, 2:已完成可领取, 3:已领取)
     * @returns {Object} - 包含文本和CSS类的对象
     */
    getStatusInfo(status) {
      switch (status) {
        case 1:
          return { text: "未达成", cssClass: "text-muted" };
        case 2:
          return { text: "可领取", cssClass: "text-warning fw-bold" };
        case 3:
          return { text: "已领取", cssClass: "text-success" };
        default:
          return { text: "未知状态", cssClass: "text-secondary" };
      }
    },

    /**
     * 处理任务数据，获取累计任务和常规任务的进度HTML
     * @param {Object} data - API返回的任务数据
     * @param {string} gameType - 游戏类型 ('sr', 'jql' 或 'dna')
     * @returns {string} - 任务进度HTML
     */
    processTaskData(data, gameType) {
      let progressHtml = "";
      const validSids = []; // 收集所有有效的sid用于清理

      if (data.code === 0 && data.data.list && data.data.list.length > 0) {
        data.data.list.forEach((task) => {
          // 处理累计任务类型（有accumulative_check_points的任务）
          if (
            task.task_type === 1 &&
            task.statistic_type === 2 &&
            task.accumulative_check_points &&
            task.accumulative_check_points.length > 0
          ) {
            // 收集有效的sid
            task.accumulative_check_points.forEach((cp) => {
              if (cp && cp.sid) validSids.push(cp.sid);
            });
            progressHtml += this.generateAccumulativeTaskHtml(task, gameType);
          }
          // 处理普通任务类型（有check_points的任务）
          else if (task.check_points && task.check_points.length > 0) {
            // 收集有效的sid
            task.check_points.forEach((cp) => {
              if (cp && cp.sid) validSids.push(cp.sid);
            });
            progressHtml += this.generateRegularTaskHtml(task, gameType);
          }
          // 处理既有累计又有单次的混合任务
          else if (
            task.task_type === 1 &&
            task.statistic_type === 2 &&
            task.accumulative_count > 0
          ) {
            progressHtml += `
          <div class="list-group-item list-group-item-info">
            <h6>${task.task_name}</h6>
            <p class="mb-2 text-primary fw-bold">已完成 ${task.accumulative_count} 天</p>
            <div class="alert alert-warning">无法获取详细奖励信息</div>
          </div>
          `;
          }
        });
      }

      // 清理无效的已选择任务ID
      this.cleanupInvalidSelectedTaskIds(gameType, validSids);

      return progressHtml;
    },

    /**
     * 生成累计任务的HTML内容
     * @param {Object} task - 任务对象
     * @returns {string} - 累计任务的HTML
     */
    generateAccumulativeTaskHtml(task, gameType) {
      let html = `
    <div class="list-group-item list-group-item-info">
      <h6>${task.task_name}</h6>
      <p class="mb-2 text-primary fw-bold">已完成 ${task.accumulative_count} 天</p>
      <h6 class="text-secondary">奖励进度:</h6>
      <div class="list-group">
    `;

      // 添加奖励进度列表
      task.accumulative_check_points.forEach((checkpoint) => {
        if (!checkpoint.list || checkpoint.list.length === 0) return;

        const indicator = checkpoint.list[0];
        const progress = (indicator.cur_value / indicator.limit) * 100;
        const statusInfo = this.getStatusInfo(checkpoint.status);

        // 设置进度条样式
        let progressBarClass = "";
        if (checkpoint.status === 2) {
          progressBarClass = "bg-warning"; // 可领取用黄色
        } else if (checkpoint.status === 3) {
          progressBarClass = "bg-success"; // 已领取用绿色
        }

        // 生成领取按钮
        let claimButton = "";
        if (checkpoint.status === 2) {
          claimButton = `
            <button class="btn btn-warning btn-sm claim-btn" 
                    data-task-id="${checkpoint.sid}" 
                    data-task-name="${task.task_name}"
                    data-award-name="${checkpoint.award_name}"
                    style="min-width: 80px;">
              <i class="bi bi-gift"></i> 领取
            </button>`;
        } else if (checkpoint.status === 3) {
          claimButton = `
            <button class="btn btn-success btn-sm claim-btn" 
                    data-task-id="${checkpoint.sid}" 
                    data-task-name="${task.task_name}"
                    data-award-name="${checkpoint.award_name}"
                    style="min-width: 80px;">
              <i class="bi bi-check-circle"></i> 已领取
            </button>`;
        } else {
          claimButton = `
            <button class="btn btn-secondary btn-sm claim-btn" 
                    data-task-id="${checkpoint.sid}" 
                    data-task-name="${task.task_name}"
                    data-award-name="${checkpoint.award_name}"
                    style="min-width: 80px;">
              <i class="bi bi-clock"></i> 未达成
            </button>`;
        }

        const selected = TaskAPI.getSelectedTaskIds(gameType);
        const isChecked = selected.includes(String(checkpoint.sid));
        html += `
      <div class="list-group-item">
        <div class="d-flex justify-content-between align-items-center">
          <div class="flex-grow-1 me-3">
            <p class="mb-1 d-flex align-items-center gap-2">
              <input type="checkbox" class="form-check-input task-select-checkbox" data-task-id="${
                checkpoint.sid
              }" data-game="${gameType}" ${isChecked ? "checked" : ""}>
              <span>${checkpoint.award_name}</span>
            </p>
            <small class="${statusInfo.cssClass}">${statusInfo.text} (${
          indicator.cur_value
        }/${indicator.limit})</small>
          </div>
          <div class="d-flex align-items-center gap-2">
            <div class="progress" style="height: 10px; width: 100px;">
              <div class="progress-bar ${progressBarClass}" role="progressbar" 
                style="width: ${progress}%" aria-valuenow="${
          indicator.cur_value
        }" 
                aria-valuemin="0" aria-valuemax="${indicator.limit}"></div>
            </div>
            ${claimButton}
          </div>
        </div>
      </div>
      `;
      });

      html += `
      </div>
    </div>
    `;

      return html;
    },

    /**
     * 生成常规任务的HTML内容
     * @param {Object} task - 任务对象
     * @returns {string} - 常规任务的HTML
     */
    generateRegularTaskHtml(task, gameType) {
      // 获取第一个检查点
      const checkpoint = task.check_points[0];
      if (!checkpoint || !checkpoint.list || checkpoint.list.length === 0) {
        return "";
      }

      const indicators = checkpoint.list;
      let indicatorsHtml = "";

      const statusInfo = this.getStatusInfo(checkpoint.status);

      // 设置进度条样式
      let progressBarClass = "";
      if (checkpoint.status === 2) {
        progressBarClass = "bg-warning"; // 可领取用黄色
      } else if (checkpoint.status === 3) {
        progressBarClass = "bg-success"; // 已领取用绿色
      }

      // 生成领取按钮
      let claimButton = "";
      if (checkpoint.status === 2) {
        claimButton = `
          <button class="btn btn-warning btn-sm claim-btn" 
                  data-task-id="${checkpoint.sid}" 
                  data-task-name="${task.task_name}"
                  data-award-name="${checkpoint.award_name}"
                  style="min-width: 80px;">
            <i class="bi bi-gift"></i> 领取
          </button>`;
      } else if (checkpoint.status === 3) {
        claimButton = `
          <button class="btn btn-success btn-sm claim-btn" 
                  data-task-id="${checkpoint.sid}" 
                  data-task-name="${task.task_name}"
                  data-award-name="${checkpoint.award_name}"
                  style="min-width: 80px;">
            <i class="bi bi-check-circle"></i> 已领取
          </button>`;
      } else {
        claimButton = `
          <button class="btn btn-secondary btn-sm claim-btn" 
                  data-task-id="${checkpoint.sid}" 
                  data-task-name="${task.task_name}"
                  data-award-name="${checkpoint.award_name}"
                  style="min-width: 80px;">
            <i class="bi bi-clock"></i> 未达成
          </button>`;
      }

      indicators.forEach((indicator) => {
        const progress = (indicator.cur_value / indicator.limit) * 100;
        indicatorsHtml += `
      <div class="mb-2">
        <div class="d-flex justify-content-between mb-1">
          <span>${indicator.cur_value}/${indicator.limit}</span>
          <small class="${statusInfo.cssClass}">${statusInfo.text}</small>
        </div>
        <div class="progress">
          <div class="progress-bar ${progressBarClass}" role="progressbar" style="width: ${progress}%"
            aria-valuenow="${indicator.cur_value}" aria-valuemin="0" aria-valuemax="${indicator.limit}"></div>
        </div>
      </div>
      `;
      });

      const selected = TaskAPI.getSelectedTaskIds(gameType);
      const isChecked = selected.includes(String(checkpoint.sid));
      return `
    <div class="list-group-item">
      <div class="d-flex justify-content-between align-items-start">
        <div class="flex-grow-1">
          <h6 class="d-flex align-items-center gap-2">
            <input type="checkbox" class="form-check-input task-select-checkbox" data-task-id="${
              checkpoint.sid
            }" data-game="${gameType}" ${isChecked ? "checked" : ""}>
            <span>${task.task_name}</span>
          </h6>
          <p class="mb-2">奖励: ${checkpoint.award_name}</p>
          ${indicatorsHtml}
        </div>
        <div class="ms-3">
          ${claimButton}
        </div>
      </div>
    </div>
    `;
    },

    /**
     * 获取星穹铁道任务进度
     * @param {string} taskIds - 逗号分隔的任务ID列表
     * @returns {Promise<string>} - 任务HTML内容
     */
    async getSrTaskProgress(taskIds) {
      try {
        const data = await this.getTaskProgress(taskIds);
        return this.processTaskData(data);
      } catch (error) {
        console.error("获取星穹铁道任务进度出错:", error);
        return `<div class="alert alert-danger">获取任务进度出错: ${error.message}</div>`;
      }
    },

    /**
     * 创建动态任务列表（使用缓存数据）
     * @param {string} gameType - 游戏类型 ('sr' 或 'jql')
     * @param {boolean} forceRefresh - 是否强制刷新缓存
     * @returns {Promise<Array>} - 动态生成的任务列表
     */
    async createDynamicTaskList(gameType, forceRefresh = false) {
      try {
        // 直接使用处理后的任务列表缓存，避免重复处理
        return await this.getProcessedTaskListCache(gameType, forceRefresh);
      } catch (error) {
        console.error("创建动态任务列表失败:", error);
        throw error;
      }
    },

    /**
     * 将totalv2 API响应转换为taskList格式
     * @param {Object} data - totalv2 API返回的数据
     * @param {string} actName - 活动名称
     * @returns {Array} - 转换后的任务列表
     */
    convertToTaskListFormat(data, actName) {
      if (data.code !== 0 || !data.data || !data.data.list) {
        console.warn("API数据格式不正确:", data);
        return [];
      }

      const taskList = [];

      data.data.list.forEach((task) => {
        // 处理累计任务类型（有accumulative_check_points的任务）
        if (
          task.accumulative_check_points &&
          task.accumulative_check_points.length > 0
        ) {
          task.accumulative_check_points.forEach((checkpoint) => {
            // 使用checkpoint的sid，这是最重要的任务ID
            taskList.push({
              name: `${task.task_name} - ${checkpoint.award_name}`,
              url: checkpoint.sid, // 使用checkpoint的sid作为task_id
            });
          });
        }

        // 处理常规任务类型（有check_points的任务）
        if (task.check_points && task.check_points.length > 0) {
          task.check_points.forEach((checkpoint) => {
            // 使用checkpoint的sid，这是最重要的任务ID
            taskList.push({
              name: `${task.task_name} - ${checkpoint.award_name}`,
              url: checkpoint.sid, // 使用checkpoint的sid作为task_id
            });
          });
        }
      });

      return [
        {
          actName: actName,
          list: taskList,
        },
      ];
    },

    /**
     * 预览动态任务列表
     * @param {string} gameType - 游戏类型 ('sr' 或 'jql')
     */
    async previewDynamicTaskList(gameType) {
      try {
        const dynamicTasks = await this.createDynamicTaskList(gameType);
        console.log(`动态任务列表 (${gameType}):`, dynamicTasks);

        // 显示预览信息
        const gameName = gameType === "sr" ? "星穹铁道" : "绝区零";
        const taskCount = dynamicTasks[0]?.list?.length || 0;

        alert(
          `动态任务列表预览 (${gameName}):\n共找到 ${taskCount} 个任务\n详细信息请查看控制台`
        );
      } catch (error) {
        console.error("预览动态任务列表失败:", error);
        alert(`预览失败: ${error.message}`);
      }
    },

    /**
     * 处理任务领取
     * @param {string} taskId - 任务ID (checkpoint.sid)
     * @param {string} taskName - 任务名称
     * @param {string} awardName - 奖励名称
     * @returns {Promise<string>} - 领取结果
     */
    async claimTask(taskId, taskName, awardName) {
      try {
        // 调用现有的send函数进行领取
        const result = await send(taskId);

        // 处理新的返回格式 {code: ..., message: ...}
        if (result && typeof result === "object" && result.code !== undefined) {
          const { code, message } = result;

          if (
            code === 0 &&
            typeof message === "string" &&
            message.match(/^[A-Z0-9]{12}$/)
          ) {
            // 成功领取到兑换码
            addAlertTip("领取成功", `获得兑换码: ${message}`, 3000);
            return message;
          } else if (code === 202031 || message === "任务奖励已经领取") {
            // 已领取的情况，message可能是兑换码
            if (
              typeof message === "string" &&
              message.match(/^[A-Z0-9]{12}$/)
            ) {
              addAlertTip("已领取", `兑换码: ${message}`, 3000);
            } else {
              addAlertTip("已领取", "该奖励已经领取过了", 2000);
            }
            return message;
          } else if (code === 75255 || message === "库存已经使用完") {
            addAlertTip("库存不足", "奖励库存已用完", 2000);
            return message;
          } else if (code === 202032 || message === "无资格领取奖励") {
            addAlertTip("无资格", "当前无资格领取该奖励", 2000);
            return message;
          } else if (code === 202033 || message === "任务活动过期") {
            addAlertTip("活动过期", "任务活动已过期", 2000);
            return message;
          } else {
            addAlertTip("领取失败", message || "未知错误", 3000);
            return message;
          }
        } else {
          // 兼容旧的字符串格式
          if (typeof result === "string" && result.match(/^[A-Z0-9]{12}$/)) {
            addAlertTip("领取成功", `获得兑换码: ${result}`, 3000);
            return result;
          } else {
            addAlertTip("领取失败", result || "未知错误", 3000);
            return result;
          }
        }
      } catch (error) {
        console.error("领取任务失败:", error);
        addAlertTip("领取失败", error.message, 3000);
        throw error;
      }
    },

    /**
     * 缓存活动ID
     * @param {string} gameType - 游戏类型 ('sr' 或 'jql')
     * @param {Object} taskData - 任务数据（用于获取第一个任务的task_id）
     */
    async cacheActivityId(gameType, taskData) {
      try {
        // 获取第一个任务的task_id来获取活动ID
        const firstTaskId = taskData.task_id;
        console.log(`正在获取${gameType}活动ID，使用任务ID: ${firstTaskId}`);

        const taskInfo = await getApiInfo(firstTaskId);
        if (taskInfo && taskInfo.code === 0 && taskInfo.data.act_id) {
          this.activityIdCache[gameType] = taskInfo.data.act_id;
          console.log(`${gameType}活动ID已缓存: ${taskInfo.data.act_id}`);
        } else {
          console.warn(`无法获取${gameType}活动ID`);
        }
      } catch (error) {
        console.error(`获取${gameType}活动ID失败:`, error);
      }
    },

    /**
     * 获取活动ID
     * @param {string} gameType - 游戏类型 ('sr' 或 'jql')
     * @returns {string|null} - 活动ID
     */
    getActivityId(gameType) {
      return this.activityIdCache[gameType] || null;
    },

    /**
     * 获取缓存状态信息
     * @returns {Object} - 缓存状态信息
     */
    getCacheStatus() {
      const now = Date.now();
      const cacheAge = 5 * 60 * 1000; // 5分钟

      return {
        sr: {
          hasData: !!this.taskDataCache.sr,
          hasProcessedData: !!this.processedTaskListCache.sr,
          hasActivityId: !!this.activityIdCache.sr,
          age: this.taskDataCache.lastUpdate
            ? now - this.taskDataCache.lastUpdate
            : null,
          isValid: this.taskDataCache.lastUpdate
            ? now - this.taskDataCache.lastUpdate < cacheAge
            : false,
        },
        jql: {
          hasData: !!this.taskDataCache.jql,
          hasProcessedData: !!this.processedTaskListCache.jql,
          hasActivityId: !!this.activityIdCache.jql,
          age: this.taskDataCache.lastUpdate
            ? now - this.taskDataCache.lastUpdate
            : null,
          isValid: this.taskDataCache.lastUpdate
            ? now - this.taskDataCache.lastUpdate < cacheAge
            : false,
        },
        dna: {
          hasData: !!this.taskDataCache.dna,
          hasProcessedData: !!this.processedTaskListCache.dna,
          hasActivityId: !!this.activityIdCache.dna,
          age: this.taskDataCache.lastUpdate
            ? now - this.taskDataCache.lastUpdate
            : null,
          isValid: this.taskDataCache.lastUpdate
            ? now - this.taskDataCache.lastUpdate < cacheAge
            : false,
        },
      };
    },

    /**
     * 为领取按钮添加事件监听器
     */
    addClaimButtonListeners() {
      document.querySelectorAll(".claim-btn").forEach((button) => {
        button.addEventListener("click", async (event) => {
          event.preventDefault();

          const taskId = button.getAttribute("data-task-id");
          const taskName = button.getAttribute("data-task-name");
          const awardName = button.getAttribute("data-award-name");

          // 禁用按钮并显示加载状态
          button.disabled = true;
          const originalContent = button.innerHTML;
          button.innerHTML =
            '<i class="bi bi-hourglass-split spin"></i> 领取中...';

          try {
            const result = await TaskAPI.claimTask(taskId, taskName, awardName);

            // 根据结果更新按钮状态（所有情况都不禁用，方便测试）
            if (typeof result === "string" && result.match(/^[A-Z0-9]{12}$/)) {
              // 成功领取到兑换码
              button.innerHTML = '<i class="bi bi-check-circle"></i> 已领取';
              button.className = "btn btn-success btn-sm claim-btn";
              button.disabled = false;
            } else if (result === "任务奖励已经领取") {
              // 已经领取过了
              button.innerHTML = '<i class="bi bi-check-circle"></i> 已领取';
              button.className = "btn btn-success btn-sm claim-btn";
              button.disabled = false;
            } else if (result === "库存已经使用完") {
              // 库存不足
              button.innerHTML =
                '<i class="bi bi-exclamation-triangle"></i> 库存不足';
              button.className = "btn btn-danger btn-sm claim-btn";
              button.disabled = false;
            } else if (result === "无资格领取奖励") {
              // 无资格
              button.innerHTML = '<i class="bi bi-x-circle"></i> 无资格';
              button.className = "btn btn-secondary btn-sm claim-btn";
              button.disabled = false;
            } else if (result === "任务活动过期") {
              // 活动过期
              button.innerHTML = '<i class="bi bi-clock-history"></i> 活动过期';
              button.className = "btn btn-secondary btn-sm claim-btn";
              button.disabled = false;
            } else if (result === "任务奖励类型错误") {
              // 奖励类型错误
              button.innerHTML =
                '<i class="bi bi-exclamation-circle"></i> 类型错误';
              button.className = "btn btn-secondary btn-sm claim-btn";
              button.disabled = false;
            } else {
              // 其他错误（如网络错误、验证码等）
              button.innerHTML = '<i class="bi bi-gift"></i> 重试';
              button.className = "btn btn-warning btn-sm claim-btn";
              button.disabled = false;
            }
          } catch (error) {
            console.error("领取失败:", error);
            // 恢复按钮状态
            button.innerHTML = originalContent;
            button.disabled = false;
          }
        });
      });
    },
  };

  //获取用户信息
  async function getApiInfo(taskId, retryCount = 0) {
    const startTime = performance.now(); // 记录开始时间
    return new Promise((resolve, reject) => {
      let wdata = get_w_rid(taskId); //获取w_rid
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://api.bilibili.com/x/activity_components/mission/info?task_id=${taskId}&web_location=${web_location}&w_rid=${wdata.w_rid}&wts=${wdata.time}`,
            {
              referrer: `https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=${taskId}`,
              referrerPolicy: "no-referrer-when-downgrade",
              method: "GET",
              mode: "cors",
              credentials: "include",
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const endTime = performance.now(); // 记录结束时间
          const delay = endTime - startTime; // 计算延迟
          totalDelay.push(delay); // 将延迟时间添加到数组中
          requestCount++; // 请求计数器加1
          calDelay(); // 计算平均延迟

          const data = await response.json();
          data.getTime = new Date(); //获取当前时间
          if (data.code === -702) {
            if (retryCount < 5) {
              // 假设最多重试5次
              setTimeout(() => {
                fetchData(taskId, retryCount + 1);
              }, 1500);
            } else {
              reject(
                new Error(
                  "Maximum retries reached, still unable to fetch data."
                )
              );
            }
          } else {
            resolve(data);
          }
        } catch (error) {
          reject(error);
        }
      };

      fetchData(taskId);
    });
  }
  async function setApiInfo(taskId) {
    if (apiData[taskId]) {
      try {
        apiData[taskId] = await getApiInfo(taskId);
      } catch (error) {
        return false;
      }
      return true;
    }
    return false;
  }
  //在cdkey列表中检索最新的符合条件的cdkey然后返回
  async function getAwardCdkey(taskId) {
    try {
      // 直接获取任务信息，从中获取act_id和award_id
      const taskInfo = await getApiInfo(taskId);
      if (!taskInfo || taskInfo.code !== 0) {
        console.warn("无法获取任务信息");
        return false;
      }

      const act_id = taskInfo.data.act_id;
      if (!act_id) {
        console.warn("无法获取活动ID");
        return false;
      }

      if (!taskInfo.data.reward_info) {
        console.warn("无法获取任务奖励信息");
        return false;
      }

      const award_id = taskInfo.data.reward_info.award_inner_id;

      // 获取已领取的奖励列表
      let v2AwardList = null;
      for (let i = 0; i < 5 && v2AwardList === null; i++) {
        v2AwardList = await getVersionCodes(act_id).catch(() => null);
        if (v2AwardList === null && i < 4)
          await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
      }

      if (v2AwardList && v2AwardList.list) {
        let list = v2AwardList.list;
        for (let i = 0; i < list.length; i++) {
          //一般较新的都排在前面直接从0开始检索即可
          if (list[i].award_id === award_id) {
            return list[i].extra_info.cdkey_content;
          }
        }
      }

      console.warn("未找到对应的兑换码");
      return false;
    } catch (error) {
      console.error("获取兑换码失败:", error);
      return false;
    }
    // return new Promise((resolve, reject) => {
    //   const fetchData = async () => {
    //     try {
    //       const response = await fetch(
    //         `https://api.bilibili.com/x/activity_components/mission/mylist?activity_id=${act_id}`,
    //         {
    //           method: "GET",
    //           credentials: "include",
    //         }
    //       );

    //       if (!response.ok) {
    //         throw new Error(`HTTP error! status: ${response.status}`);
    //       }

    //       const data = await response.json();

    //       if (data.code === -702) {
    //         if (retryCount < 5) {
    //           // 假设最多重试5次
    //           setTimeout(() => {
    //             fetchData(taskId, retryCount + 1);
    //           }, 5000);
    //         } else {
    //           reject(
    //             new Error(
    //               "Maximum retries reached, still unable to fetch data."
    //             )
    //           );
    //         }
    //       } else {
    //         let award_id = apiData[taskId].data.reward_info.award_inner_id;
    //         let list = data.data.list;
    //         for (let i = 0; i < list.length; i++) {
    //           //一般较新的都排在前面直接从0开始检索即可
    //           if (list[i].award_id === award_id) {
    //             resolve(list[i].extra_info.cdkey_content);
    //           }
    //         }
    //       }
    //     } catch (error) {
    //       reject(error);
    //     }
    //   };

    //   fetchData(taskId);
    // });
  }
  //将类中的内容替换为新的内容,若没有新的内容则替换为加载指示器
  function replaceContent(querySelectorObject, className, newContent) {
    const content =
      newContent ||
      `  
            <div class="spinner-border text-warning spinner-border-sm" role="status">  
                <span class="visually-hidden">Loading...</span>  
            </div>  
        `;
    if (querySelectorObject) {
      const originalContent = querySelectorObject.innerHTML;
      querySelectorObject.innerHTML = "";
      querySelectorObject.innerHTML = content;
      return;
    }
    // 使用querySelectorAll获取所有具有指定类名的元素
    const elements = document.querySelectorAll(className);
    // 遍历所有元素
    elements.forEach((element) => {
      // 保存当前元素的内容
      const originalContent = element.innerHTML;

      // 清空元素内容
      element.innerHTML = "";

      // 将加载指示器添加到元素中
      element.innerHTML = content;

      // 如果需要，可以在这里存储原始内容或执行其他操作
      // 例如，将原始内容存储到元素的某个属性或全局变量中
      // element.setAttribute('data-original-content', originalContent);
    });
  }
  async function send(taskId) {
    const startTime = performance.now(); // 记录开始时间

    // 从缓存数据中查找taskId来判断游戏类型
    let gameType = null;
    let activityId = null;

    // 检查星穹铁道缓存
    if (
      TaskAPI.taskDataCache.sr &&
      TaskAPI.taskDataCache.sr.code === 0 &&
      TaskAPI.taskDataCache.sr.data.list
    ) {
      const srTask = TaskAPI.taskDataCache.sr.data.list.find(
        (task) =>
          (task.check_points &&
            task.check_points.some((cp) => cp.sid === taskId)) ||
          (task.accumulative_check_points &&
            task.accumulative_check_points.some((cp) => cp.sid === taskId))
      );
      if (srTask) {
        gameType = "sr";
        activityId = TaskAPI.getActivityId("sr");
      }
    }

    // 检查绝区零缓存
    if (
      !gameType &&
      TaskAPI.taskDataCache.jql &&
      TaskAPI.taskDataCache.jql.code === 0 &&
      TaskAPI.taskDataCache.jql.data.list
    ) {
      const jqlTask = TaskAPI.taskDataCache.jql.data.list.find(
        (task) =>
          (task.check_points &&
            task.check_points.some((cp) => cp.sid === taskId)) ||
          (task.accumulative_check_points &&
            task.accumulative_check_points.some((cp) => cp.sid === taskId))
      );
      if (jqlTask) {
        gameType = "jql";
        activityId = TaskAPI.getActivityId("jql");
      }
    }

    // 如果缓存中没有找到，则获取任务信息并判断
    if (!gameType || !activityId) {
      console.log(`缓存中未找到taskId: ${taskId}，正在获取任务信息...`);
      const taskInfo = await getApiInfo(taskId);
      if (taskInfo && taskInfo.code === 0 && taskInfo.data.act_id) {
        activityId = taskInfo.data.act_id;

        // 根据活动名称判断游戏类型
        const actName = taskInfo.data.act_name || "";
        if (actName.includes("星穹铁道") || actName.includes("崩坏")) {
          gameType = "sr";
        } else if (actName.includes("绝区零") || actName.includes("zzz")) {
          gameType = "jql";
        } else {
          // 默认判断为星穹铁道
          gameType = "sr";
        }

        // 缓存活动ID
        TaskAPI.activityIdCache[gameType] = activityId;
        console.log(`${gameType}活动ID已缓存: ${activityId}`);
      } else {
        throw new Error("无法获取活动ID");
      }
    }

    // 简化的参数，只需要3个必要参数
    const dynamicData = {
      task_id: taskId,
      activity_id: activityId,
      csrf: csrf,
    };
    // 将动态数据转换为URL编码的字符串
    const body = new URLSearchParams(dynamicData).toString();
    const wrid = get_w_rid();
    return fetch(
      `https://api.bilibili.com/x/activity_components/mission/receive?w_rid=${wrid.w_rid}&${wrid.wts}`,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "sec-fetch-mode": "cors",
        },
        referrer: `https://www.bilibili.com/blackboard/new-award-exchange.html?task_id=${taskId}`,
        referrerPolicy: "no-referrer-when-downgrade",
        body: body,
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const endTime = performance.now(); // 记录结束时间
        const delay = endTime - startTime; // 计算延迟
        totalDelay.push(delay); // 将延迟时间添加到数组中
        requestCount++; // 请求计数器加1
        calDelay(); // 计算平均延迟

        if (data.message === "0" || data.code === 0) {
          return {
            code: data.code,
            message:
              data.data.send_extra.cdkey_content ||
              data.data.extra_info.cdkey_content,
          };
        }
        if (data.code === 202031 || data.message === "任务奖励已经领取") {
          return getAwardCdkey(taskId).then((cdkey) => {
            return { code: data.code, message: cdkey || "任务奖励已经领取" };
          });
        }
        if (data.code === 75255 || data.message === "库存已经使用完") {
          return { code: data.code, message: "库存已经使用完" };
        }
        if (data.code === 202100 || data.message === "该用户需要验证") {
          //对是否验证码和是否有资格进行验证
          const e =
              "//s1.hdslb.com/bfs/seed/jinkela/risk-captcha-sdk/CaptchaLoader.js",
            n = document.createElement("script");
          (n.src = e),
            (n.onload = async () => {
              try {
                const e = await CaptchaLoader.load(),
                  n = await e({
                    riskParams: {
                      v_voucher: data.data,
                    },
                    onInit: (data) => {
                      const e = data.instance;
                      setTimeout(() => {
                        e.destroy();
                      }, 6e4);
                    },
                  });
                // return await send(taskId);//成功后重试
              } catch (t) {
                //此处原是用于弹出黑色提示
                return t.toString;
              }
            }),
            document.body.appendChild(n);
          return { code: data.code, message: data.message };
        }
        if (data.code === 202033 || data.message === "任务活动过期") {
          return { code: data.code, message: data.message };
        }
        if (data.code === 202030 || data.message === "任务奖励类型错误") {
          return { code: data.code, message: data.message };
        }
        if (data.code === 202032 || data.message === "无资格领取奖励") {
          return { code: data.code, message: data.message };
        }
        return { code: data.code, message: data.message };
      })
      .catch((error) => console.error("Error:", error));
  }

  // 添加日期格式化函数
  function formatDate(timestamp) {
    const date = new Date(
      typeof timestamp === "number" ? timestamp * 1000 : timestamp
    );
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }

  function addAlertTip(title, content, duration = 3000) {
    let alertTip = `<div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
      <svg class="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#007aff"></rect></svg>
      <strong class="me-auto">${title}</strong>
      <small class="text-muted">${new Date().toTimeString()}</small>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">${content}</div>
  </div>`;
    let toastContainer = document.querySelector(".toast-container");
    toastContainer.insertAdjacentHTML("beforeend", alertTip);

    // 获取刚刚添加的toast元素
    const toast = toastContainer.lastElementChild;

    // 设置定时器，在指定时间后开始淡出动画
    setTimeout(() => {
      toast.style.opacity = "0";

      // 等待淡出动画完成后移除元素
      setTimeout(() => {
        toast.remove();
      }, 500); // 500ms 是淡出动画的持续时间
    }, duration);

    // 如果用户手动点击关闭按钮，也应用淡出动画
    toast.querySelector(".btn-close").addEventListener("click", (e) => {
      e.preventDefault();
      toast.style.opacity = "0";
      setTimeout(() => {
        toast.remove();
      }, 500);
    });
  }
  // 添加获取版本兑换码的函数
  async function getVersionCodes(activityId) {
    try {
      const response = await fetch(
        `https://api.bilibili.com/x/lottery/rewards/awards/mylist/v2?activity_id=${activityId}&csrf=${csrf}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.code !== 0) {
        throw new Error(data.message);
      }

      return data.data;
    } catch (error) {
      console.error("Error fetching version codes:", error);
      addAlertTip("错误", `获取版本兑换码失败: ${error.message}`);
      return null;
    }
  }
  function windowOnload() {
    // 修改导航栏，添加兑换码管理选项
    let navHtml = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark protected">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">B站助手</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link active" href="#" data-page="code-tool">抢码工具</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" data-page="code-manager">兑换码管理</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" data-page="settings">设置</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" data-page="about">关于</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>`;

    // 修改页面容器，添加兑换码管理页面
    let pagesHtml = `
    <div class="container-fluid protected mt-3">
        <div id="code-tool" class="page active">
            <!-- 原有的抢码工具内容将被移到这里 -->
        </div>
        <div id="code-manager" class="page d-none">
            <h2>兑换码管理</h2>
            <div class="row mb-3">
                <div class="col">
                    <div class="input-group mb-3">
                        <label class="input-group-text" for="versionSelect">选择版本</label>
                        <select class="form-select" id="versionSelect">
                            ${versionConfig.versions
                              .map(
                                (version) =>
                                  `<option value="${version.id}">${version.name}</option>`
                              )
                              .join("")}
                        </select>
                        <button class="btn btn-primary" type="button" id="refreshVersionCodes">刷新列表</button>
                    </div>
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="搜索兑换码..." id="codeSearch">
                        <button class="btn btn-outline-secondary filter-daily" type="button">只看每日任务</button>
                        <button class="btn btn-outline-secondary filter-non-daily" type="button">排除每日任务</button>
                        <button class="btn btn-outline-secondary clear-filter" type="button">取消筛选</button>
                        <button class="btn btn-outline-secondary" type="button" id="exportCodes">导出兑换码</button>
                        <button class="btn btn-outline-danger" type="button" id="clearCodes">清空列表</button>
                    </div>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>奖励名称</th>
                            <th>兑换码</th>
                            <th>获取时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody id="codeTableBody">
                        <!-- 兑换码列表将动态插入这里 -->
                    </tbody>
                </table>
            </div>
        </div>
        <div id="settings" class="page d-none">
            <h2>设置</h2>
            <div class="row">
                <div class="card mb-3">
                  <div class="card-header">代理设置</div>
                  <div class="card-body">
                    <div class="form-check form-switch mb-3">
                      <input class="form-check-input" type="checkbox" id="proxyEnableSwitch">
                      <label class="form-check-label" for="proxyEnableSwitch">启用代理</label>
                    </div>
                    <div class="mb-3">
                      <label for="proxyUrlInput" class="form-label">代理服务器地址</label>
                      <input type="text" class="form-control" id="proxyUrlInput" placeholder="http://localhost:3000/proxy">
                    </div>
                    <div class="mb-3">
                      <label for="proxySessdataInput" class="form-label">SESSDATA</label>
                      <input type="text" class="form-control" id="proxySessdataInput" placeholder="输入SESSDATA，用于代理请求">
                    </div>
                    <button class="btn btn-primary" id="saveProxyConfig">保存设置</button>
                    <div class="alert alert-warning mt-3" role="alert">
                      如遇到代理无法连接、证书无效等问题，请在浏览器中信任本代理服务器的自签名证书。<br>
                      详细方法：访问代理主页，下载证书并导入到操作系统的受信任根证书颁发机构。
                    </div>
                  </div>
                </div>
            </div>
        </div>
        <div id="about" class="page d-none">
            <h2>关于</h2>
            <div class="row">
                <div class="col-md-8 offset-md-2">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">B站抢码助手</h5>
                            <p class="card-text">版本：1.4.8.0</p>
                            <p class="card-text">作者：LynLuc</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    // 添加导航栏和页面容器到body
    document.body.insertAdjacentHTML("afterbegin", navHtml);
    document.body.insertAdjacentHTML("beforeend", pagesHtml);

    //
    //
    //设置页面相关代码

    // 进入设置页面时初始化表单
    function initProxyConfigForm() {
      document.getElementById("proxyEnableSwitch").checked = proxyConfig.enable;
      document.getElementById("proxyUrlInput").value = proxyConfig.proxyUrl;
      document.getElementById("proxySessdataInput").value =
        proxyConfig.SESSDATA;
    }

    // 生成代理用的Cookie字符串
    function makeProxyCookies() {
      // 获取当前页面cookie
      let docCookie = document.cookie || "";
      // 处理SESSDATA
      let sess = proxyConfig.SESSDATA.trim();
      let sessStr = sess ? `SESSDATA=${sess}; ` : "";
      // 拼接SESSDATA到最前面
      let result = sessStr + docCookie;
      // 去重SESSDATA（只保留第一个）
      if (sess) {
        result = result.replace(/SESSDATA=[^;]*;? ?/g, "");
        result = `SESSDATA=${sess}; ` + result;
      }
      proxyConfig.proxyCookies = result;
    }

    // 校验代理可用性函数
    async function checkProxyAvailable() {
      try {
        const res = await forProxy(
          "https://api.bilibili.com/x/web-interface/nav",
          {
            headers: {
              accept: "*/*",
              "accept-language": "zh-CN,zh;q=0.9",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-site",
            },
            method: "GET",
            mode: "cors",
            credentials: "include",
          }
        );
        if (!res.ok) return false;
        const data = await res.json();
        return data && data.code === 0;
      } catch (e) {
        return false;
      }
    }

    // 保存按钮事件
    document
      .getElementById("saveProxyConfig")
      .addEventListener("click", async function () {
        proxyConfig.enable =
          document.getElementById("proxyEnableSwitch").checked;
        proxyConfig.proxyUrl = document
          .getElementById("proxyUrlInput")
          .value.trim();
        proxyConfig.SESSDATA = document
          .getElementById("proxySessdataInput")
          .value.trim();
        makeProxyCookies();

        if (proxyConfig.enable) {
          const btn = this;
          btn.disabled = true;
          btn.textContent = "校验中...";
          const ok = await checkProxyAvailable();
          if (ok) {
            addAlertTip("保存成功", "代理设置已更新并校验通过");
            proxyConfig.enable = true;
            // 保存到本地（不保存enable字段）
            try {
              const { enable, ...saveObj } = proxyConfig;
              localStorage.setItem(
                "bili_proxy_config",
                JSON.stringify(saveObj)
              );
            } catch (e) {
              addAlertTip("警告", "本地保存代理配置失败");
            }
          } else {
            addAlertTip(
              "代理校验失败",
              "无法通过代理访问B站，请检查代理地址和SESSDATA"
            );
            proxyConfig.enable = false;
            document.getElementById("proxyEnableSwitch").checked = false;
          }
          btn.disabled = false;
          btn.textContent = "保存设置";
        } else {
          addAlertTip("保存成功", "代理设置已更新");
          // 保存到本地（不保存enable字段）
          try {
            const { enable, ...saveObj } = proxyConfig;
            localStorage.setItem("bili_proxy_config", JSON.stringify(saveObj));
          } catch (e) {
            addAlertTip("警告", "本地保存代理配置失败");
          }
        }
      });

    // 切换到设置页面时自动同步
    document
      .querySelector('a[data-page="settings"]')
      .addEventListener("click", function () {
        setTimeout(initProxyConfigForm, 100); // 等待页面切换动画
      });

    //
    //
    // 只保留一个 toast 容器创建，使用 position-fixed
    let toastContainerHtml = `<div class="toast-container position-fixed protected">
    </div>`;
    document.body.insertAdjacentHTML("beforeend", toastContainerHtml);

    // 获取原有内容的容器
    let codeToolPage = document.getElementById("code-tool");

    // 保留导出功能所需的 xlsx 库
    var xlsxScript = document.createElement("script");
    xlsxScript.type = "module";
    xlsxScript.src =
      "https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js";
    xlsxScript.onerror = function () {
      console.warn("SheetJS 加载失败，导出功能将不可用");
    };
    try {
      document.head.appendChild(xlsxScript);
    } catch (e) {
      console.warn("附加 SheetJS 脚本失败: ", e);
    }

    // 仅保留"获取每日任务进度"按钮
    let container = document.createElement("div");
    container.className = "container protected";

    // 嵌入式每日任务进度面板
    let progressPanelHtml = `
      <div id="task-progress-inline" class="protected mt-2">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="mb-0">每日任务进度</h5>
          <div class="d-flex align-items-center gap-2">
            <div class="btn-group btn-group-sm" role="group" aria-label="Game Switch">
              <button type="button" class="btn btn-outline-secondary game-switch active" data-target="sr">星穹铁道</button>
              <button type="button" class="btn btn-outline-secondary game-switch" data-target="jql">绝区零</button>
              <button type="button" class="btn btn-outline-secondary game-switch" data-target="dna">二重螺旋</button>
            </div>
            <button type="button" class="btn btn-sm btn-outline-success schedule-timer-btn">
              <i class="bi bi-clock"></i> 定时设置
            </button>
            <button type="button" class="btn btn-sm btn-outline-info preview-tasks-btn">
              <i class="bi bi-eye"></i> 预览
            </button>
            <button type="button" class="btn btn-sm btn-outline-primary refresh-task-progress">
              <i class="bi bi-arrow-clockwise"></i> 刷新
            </button>
          </div>
        </div>
        <div class="cache-status-info small text-muted mb-2">
          <i class="bi bi-info-circle"></i> 缓存状态: <span id="cache-status-text">未初始化</span>
        </div>
        <div class="row g-3">
          <div id="sr-section" class="col-12">
            <h6 class="mb-2">星穹铁道</h6>
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <div class="list-group sr-tasks-list"></div>
          </div>
          <div id="zzz-section" class="col-12">
            <h6 class="mb-2">绝区零</h6>
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <div class="list-group zzz-tasks-list"></div>
          </div>
          <div id="dna-section" class="col-12">
            <h6 class="mb-2">二重螺旋</h6>
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <div class="list-group dna-tasks-list"></div>
          </div>
        </div>
      </div>`;

    container.insertAdjacentHTML("beforeend", progressPanelHtml);

    // 将容器添加到抢码工具页面
    codeToolPage.appendChild(container);

    // 修改样式
    const style = document.createElement("style");
    style.textContent = `
        .page {
            min-height: calc(100vh - 56px);
            padding: 20px;
        }
        .navbar {
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        .toast-container {
            position: fixed !important;
            bottom: 20px;
            right: 20px;
            z-index: 1050;
        }
        .toast {
            transition: opacity 0.5s ease-out;
            opacity: 1;
        }
        #code-tool .row {
            margin-top: 20px;
        }
        #task-progress-inline .list-group .list-group-item { border: 1px solid #f1f3f5; }
        #task-progress-inline .list-group-item-info { background: #f8fbff; }
        #task-progress-inline h6 { font-weight: 600; }
        #task-progress-inline .spinner-border { display: none; }
        #task-progress-inline .sr-tasks-list:empty::before,
        #task-progress-inline .zzz-tasks-list:empty::before,
        #task-progress-inline .dna-tasks-list:empty::before {
          content: '暂无数据';
          display: block;
          color: #6c757d;
          padding: 8px 0;
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* 领取按钮样式 */
        .claim-btn {
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .claim-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        .claim-btn:active {
          transform: translateY(0);
        }
        .claim-btn:disabled {
          transform: none;
          box-shadow: none;
        }
        
        /* 任务卡片样式优化 */
        .list-group-item .d-flex {
          gap: 0.5rem;
        }
        .progress {
          flex-shrink: 0;
        }
        .btn-sm {
          font-size: 0.875rem;
          padding: 0.25rem 0.5rem;
        }
        
        /* 定时设置模态框样式 */
        #scheduleModal .modal-dialog {
          max-width: 500px;
        }
        #scheduleModal .form-check-input:checked {
          background-color: #198754;
          border-color: #198754;
        }
        #scheduleModal .alert-info {
          background-color: #f8f9fa;
          border-color: #dee2e6;
          color: #495057;
        }
        #scheduleModal .input-group-text {
          background-color: #f8f9fa;
          border-color: #ced4da;
          color: #6c757d;
        }
        #scheduleModal .form-label {
          font-weight: 500;
          color: #495057;
        }
        #scheduleModal .text-muted {
          font-size: 0.875rem;
        }
        #scheduleModal .modal-title i {
          color: #198754;
        }
    `;
    document.head.appendChild(style);

    // 定义加载任务数据的函数（嵌入式展示）
    async function loadTaskProgress(forceRefresh = false) {
      // 显示加载指示器
      document.querySelector("#sr-section .spinner-border").style.display =
        "block";
      document.querySelector("#zzz-section .spinner-border").style.display =
        "block";
      document.querySelector("#dna-section .spinner-border").style.display =
        "block";

      // 清空当前内容
      document.querySelector(".sr-tasks-list").innerHTML = "";
      document.querySelector(".zzz-tasks-list").innerHTML = "";
      document.querySelector(".dna-tasks-list").innerHTML = "";

      try {
        // 使用缓存系统加载星穹铁道任务数据
        const srData = await TaskAPI.getTaskDataWithCache("sr", forceRefresh);
        const srProgressHtml = TaskAPI.processTaskData(srData, "sr");
        const srTasksList = document.querySelector(".sr-tasks-list");

        // 隐藏加载指示器
        document.querySelector("#sr-section .spinner-border").style.display =
          "none";

        // 显示内容
        if (srProgressHtml) {
          srTasksList.innerHTML = srProgressHtml;
        } else {
          srTasksList.innerHTML = `<div class="alert alert-warning">未找到星穹铁道任务数据</div>`;
        }
      } catch (error) {
        console.error("获取星穹铁道任务进度出错:", error);
        addAlertTip("错误", "获取星穹铁道任务进度时出现错误，请查看控制台");

        // 隐藏加载指示器并显示错误信息
        document.querySelector("#sr-section .spinner-border").style.display =
          "none";
        document.querySelector(
          ".sr-tasks-list"
        ).innerHTML = `<div class="alert alert-danger">获取任务进度出错: ${error.message}</div>`;
      }

      try {
        // 使用缓存系统加载绝区零任务数据
        const jqlData = await TaskAPI.getTaskDataWithCache("jql", forceRefresh);
        const jqlProgressHtml = TaskAPI.processTaskData(jqlData, "jql");
        const zzzTasksList = document.querySelector(".zzz-tasks-list");

        // 隐藏加载指示器
        document.querySelector("#zzz-section .spinner-border").style.display =
          "none";

        if (jqlProgressHtml) {
          zzzTasksList.innerHTML = jqlProgressHtml;
        } else {
          zzzTasksList.innerHTML = `<div class="alert alert-info">未找到绝区零任务数据</div>`;
        }
      } catch (error) {
        console.error("获取绝区零任务进度出错:", error);
        addAlertTip("错误", "获取绝区零任务进度时出现错误，请查看控制台");

        document.querySelector("#zzz-section .spinner-border").style.display =
          "none";
        document.querySelector(
          ".zzz-tasks-list"
        ).innerHTML = `<div class="alert alert-danger">获取任务进度出错: ${error.message}</div>`;
      }

      try {
        // 使用缓存系统加载二重螺旋任务数据
        const dnaData = await TaskAPI.getTaskDataWithCache("dna", forceRefresh);
        const dnaProgressHtml = TaskAPI.processTaskData(dnaData, "dna");
        const dnaTasksList = document.querySelector(".dna-tasks-list");

        // 隐藏加载指示器
        document.querySelector("#dna-section .spinner-border").style.display =
          "none";

        if (dnaProgressHtml) {
          dnaTasksList.innerHTML = dnaProgressHtml;
        } else {
          dnaTasksList.innerHTML = `<div class="alert alert-info">未找到二重螺旋任务数据</div>`;
        }
      } catch (error) {
        console.error("获取二重螺旋任务进度出错:", error);
        addAlertTip("错误", "获取二重螺旋任务进度时出现错误，请查看控制台");

        document.querySelector("#dna-section .spinner-border").style.display =
          "none";
        document.querySelector(
          ".dna-tasks-list"
        ).innerHTML = `<div class="alert alert-danger">获取任务进度出错: ${error.message}</div>`;
      }

      // 绑定任务选择多选框事件，持久化选择
      document.querySelectorAll(".task-select-checkbox").forEach((cb) => {
        cb.onchange = function () {
          try {
            const sid = String(this.getAttribute("data-task-id"));
            const game = this.getAttribute("data-game");

            // 确保 scheduleConfig.selectedTaskIds 存在
            if (!scheduleConfig.selectedTaskIds) {
              scheduleConfig.selectedTaskIds = { sr: [], jql: [], dna: [] };
            }
            if (!Array.isArray(scheduleConfig.selectedTaskIds[game])) {
              scheduleConfig.selectedTaskIds[game] = [];
            }

            const arr = scheduleConfig.selectedTaskIds[game];
            const idx = arr.indexOf(sid);
            if (this.checked) {
              if (idx === -1) arr.push(sid);
            } else {
              if (idx > -1) arr.splice(idx, 1);
            }

            // 保存到本地存储
            saveScheduleConfig();

            // 同步更新定时设置窗口的显示（如果打开的话）
            updateScheduleTaskList();
          } catch (e) {
            console.error("更新任务选择状态失败:", e);
          }
        };
      });

      // 更新缓存状态显示
      updateCacheStatusDisplay();

      // 添加领取按钮事件监听器
      TaskAPI.addClaimButtonListeners();
    }

    // 顶部按钮已删除，面板内嵌显示

    // 面板内刷新按钮
    document
      .querySelector(".refresh-task-progress")
      ?.addEventListener("click", async function () {
        this.disabled = true;
        this.innerHTML = '<i class="bi bi-arrow-clockwise spin"></i> 刷新中...';

        try {
          // 强制刷新缓存数据并重新加载任务进度显示
          await loadTaskProgress(true);

          addAlertTip("成功", "任务进度已强制刷新", 1500);
        } catch (error) {
          console.error("强制刷新失败:", error);
          addAlertTip("错误", `强制刷新失败: ${error.message}`, 3000);
        } finally {
          this.disabled = false;
          this.innerHTML = '<i class="bi bi-arrow-clockwise"></i> 刷新';
        }
      });

    // 定时设置按钮
    document
      .querySelector(".schedule-timer-btn")
      ?.addEventListener("click", function () {
        // 确保Bootstrap已加载
        if (typeof bootstrap === "undefined") {
          // 等待Bootstrap加载
          const checkBootstrap = setInterval(() => {
            if (typeof bootstrap !== "undefined") {
              clearInterval(checkBootstrap);
              showScheduleModal();
            }
          }, 100);

          // 设置超时，避免无限等待
          setTimeout(() => {
            clearInterval(checkBootstrap);
            if (typeof bootstrap === "undefined") {
              addAlertTip("错误", "Bootstrap库加载超时，请刷新页面重试", 3000);
            }
          }, 5000);
        } else {
          showScheduleModal();
        }
      });

    // 预览按钮
    document
      .querySelector(".preview-tasks-btn")
      ?.addEventListener("click", async function () {
        this.disabled = true;
        this.innerHTML = '<i class="bi bi-eye spin"></i> 预览中...';

        try {
          const currentGame = document
            .querySelector(".game-switch.active")
            .getAttribute("data-target");
          await TaskAPI.previewDynamicTaskList(currentGame);
        } catch (error) {
          console.error("预览失败:", error);
          addAlertTip("错误", `预览失败: ${error.message}`, 3000);
        } finally {
          this.disabled = false;
          this.innerHTML = '<i class="bi bi-eye"></i> 预览';
        }
      });

    // 更新缓存状态显示
    function updateCacheStatusDisplay() {
      const cacheStatus = TaskAPI.getCacheStatus();
      const statusText = document.getElementById("cache-status-text");

      if (statusText) {
        const srStatus = cacheStatus.sr;
        const jqlStatus = cacheStatus.jql;
        const dnaStatus = cacheStatus.dna;

        if (srStatus.hasData && jqlStatus.hasData && dnaStatus.hasData) {
          const srAge = srStatus.age ? Math.round(srStatus.age / 1000) : 0;
          const jqlAge = jqlStatus.age ? Math.round(jqlStatus.age / 1000) : 0;
          const dnaAge = dnaStatus.age ? Math.round(dnaStatus.age / 1000) : 0;
          const srProcessed = srStatus.hasProcessedData ? "✓" : "✗";
          const jqlProcessed = jqlStatus.hasProcessedData ? "✓" : "✗";
          const dnaProcessed = dnaStatus.hasProcessedData ? "✓" : "✗";
          const srActivityId = srStatus.hasActivityId ? "✓" : "✗";
          const jqlActivityId = jqlStatus.hasActivityId ? "✓" : "✗";
          const dnaActivityId = dnaStatus.hasActivityId ? "✓" : "✗";
          statusText.textContent = `星穹铁道: ${srAge}s前${srProcessed}${srActivityId}, 绝区零: ${jqlAge}s前${jqlProcessed}${jqlActivityId}, 二重螺旋: ${dnaAge}s前${dnaProcessed}${dnaActivityId}`;
          statusText.className =
            srStatus.isValid && jqlStatus.isValid && dnaStatus.isValid
              ? "text-success"
              : "text-warning";
        } else if (srStatus.hasData || jqlStatus.hasData || dnaStatus.hasData) {
          let game, age, processed, activityId;
          if (srStatus.hasData) {
            game = "星穹铁道";
            age = srStatus.age;
            processed = srStatus.hasProcessedData;
            activityId = srStatus.hasActivityId;
          } else if (jqlStatus.hasData) {
            game = "绝区零";
            age = jqlStatus.age;
            processed = jqlStatus.hasProcessedData;
            activityId = jqlStatus.hasActivityId;
          } else {
            game = "二重螺旋";
            age = dnaStatus.age;
            processed = dnaStatus.hasProcessedData;
            activityId = dnaStatus.hasActivityId;
          }
          const ageText = age ? Math.round(age / 1000) + "s前" : "未知";
          const processedText = processed ? "✓" : "✗";
          const activityIdText = activityId ? "✓" : "✗";
          statusText.textContent = `${game}: ${ageText}${processedText}${activityIdText}`;
          statusText.className = "text-warning";
        } else {
          statusText.textContent = "未初始化";
          statusText.className = "text-muted";
        }
      }
    }

    // 首次进入即加载（无需顶层 await）
    loadTaskProgress();

    // 添加一个标记，用于记录是否已经加载过兑换码列表
    let hasLoadedCodeManager = false;

    // 添加页面切换功能
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", async (e) => {
        e.preventDefault();

        // 如果已经是激活状态的链接，不做任何处理
        if (e.target.classList.contains("active")) {
          return;
        }

        // 处理导航链接的激活状态
        document
          .querySelectorAll(".nav-link")
          .forEach((l) => l.classList.remove("active"));
        e.target.classList.add("active");

        // 处理页面切换
        const targetPage = e.target.getAttribute("data-page");
        document.querySelectorAll(".page").forEach((page) => {
          page.classList.add("d-none");
        });
        document.getElementById(targetPage).classList.remove("d-none");

        // 只在首次进入兑换码管理页面时加载数据
        if (targetPage === "code-manager" && !hasLoadedCodeManager) {
          const activityId = document.getElementById("versionSelect").value;
          const versionCodes = await getVersionCodes(activityId);
          updateVersionCodeList(versionCodes);
          hasLoadedCodeManager = true;
        }
      });
    });

    // 版本选择事件监听
    document
      .getElementById("versionSelect")
      ?.addEventListener("change", async (e) => {
        const activityId = e.target.value;
        const versionCodes = await getVersionCodes(activityId);
        updateVersionCodeList(versionCodes);
      });

    // 删除重复的过滤器事件监听器代码,保留一个统一的过滤器处理函数
    function handleFilter(filterType) {
      const rows = document.querySelectorAll("#codeTableBody tr");
      const searchText =
        document.getElementById("codeSearch")?.value.toLowerCase() || "";

      rows.forEach((row) => {
        const awardName = row.querySelector("td:first-child span").textContent;
        const isDaily = awardName.includes("【每日任务】");
        const cdkey = row.querySelector(".input-group input").value;
        const text = awardName + cdkey;

        let shouldShow = text.toLowerCase().includes(searchText);

        switch (filterType) {
          case "daily":
            shouldShow = shouldShow && isDaily;
            break;
          case "non-daily":
            shouldShow = shouldShow && !isDaily;
            break;
          case "clear":
            // 保持搜索文本过滤
            break;
        }

        row.style.display = shouldShow ? "" : "none";
      });

      // 更新按钮状态
      document
        .querySelector(".filter-daily")
        .classList.toggle("active", filterType === "daily");
      document
        .querySelector(".filter-non-daily")
        .classList.toggle("active", filterType === "non-daily");
      document
        .querySelector(".clear-filter")
        .classList.toggle("active", filterType === "clear");
    }

    // 添加统一的过滤器事件监听器
    document
      .querySelector(".filter-daily")
      ?.addEventListener("click", () => handleFilter("daily"));
    document
      .querySelector(".filter-non-daily")
      ?.addEventListener("click", () => handleFilter("non-daily"));
    document.querySelector(".clear-filter")?.addEventListener("click", () => {
      handleFilter("clear");
      // 清空搜索框
      document.getElementById("codeSearch").value = "";
    });

    // 搜索功能
    document.getElementById("codeSearch")?.addEventListener("input", (e) => {
      const filterType = document
        .querySelector(".filter-daily")
        .classList.contains("active")
        ? "daily"
        : document
            .querySelector(".filter-non-daily")
            .classList.contains("active")
        ? "non-daily"
        : "clear";
      handleFilter(filterType);
    });

    // 导出功能
    document.getElementById("exportCodes")?.addEventListener("click", () => {
      // 等待 SheetJS 库加载完成
      if (typeof XLSX === "undefined") {
        addAlertTip("错误", "正在加载导出功能，请稍后重试");
        return;
      }

      const versionName =
        document.getElementById("versionSelect").options[
          document.getElementById("versionSelect").selectedIndex
        ].text;
      const currentDate = new Date();
      const fileName = `${versionName}_兑换码列表_${currentDate.getFullYear()}_${
        currentDate.getMonth() + 1
      }_${currentDate.getDate()}.xlsx`;

      // 处理每日任务数据
      const dailyTasksData = {};
      // 处理其他任务数据
      const otherTasksData = [];

      const rows = document.querySelectorAll("#codeTableBody tr");
      rows.forEach((row) => {
        const awardName = row.querySelector("td:first-child span").textContent;
        const cdkey = row.querySelector(".input-group input").value;
        const time = row.querySelector("td:nth-child(3)").textContent;
        const date = new Date(time);
        const dateKey = `${date.getMonth() + 1}/${date.getDate()}`; // 月/日 格式

        if (awardName.includes("【每日任务】")) {
          // 处理每日任务
          const taskName = awardName.replace("【每日任务】", "").trim();
          if (!dailyTasksData[dateKey]) {
            dailyTasksData[dateKey] = {};
          }
          dailyTasksData[dateKey][taskName] = cdkey;
        } else {
          // 处理其他任务
          otherTasksData.push({
            奖励名称: awardName,
            兑换码: cdkey,
            获取时间: time,
          });
        }
      });

      // 创建每日任务工作表
      const dailyWorksheet = XLSX.utils.aoa_to_sheet([]);
      // 获取所有唯一的任务名称和日期
      const allTaskNames = new Set();
      const allDates = new Set();
      Object.values(dailyTasksData).forEach((dateData) => {
        Object.keys(dateData).forEach((taskName) => allTaskNames.add(taskName));
      });
      Object.keys(dailyTasksData).forEach((date) => allDates.add(date));

      // 转换为数组并排序
      const sortedTaskNames = Array.from(allTaskNames).sort();
      const sortedDates = Array.from(allDates).sort((a, b) => {
        const [aMonth, aDay] = a.split("/").map(Number);
        const [bMonth, bDay] = b.split("/").map(Number);
        return aMonth === bMonth ? aDay - bDay : aMonth - bMonth;
      });

      // 创建表头
      const headers = ["日期", ...sortedTaskNames];
      XLSX.utils.sheet_add_aoa(dailyWorksheet, [headers], { origin: "A1" });

      // 填充数据
      const dailyData = sortedDates.map((date) => {
        const row = [date];
        sortedTaskNames.forEach((taskName) => {
          row.push(dailyTasksData[date]?.[taskName] || "");
        });
        return row;
      });
      XLSX.utils.sheet_add_aoa(dailyWorksheet, dailyData, { origin: "A2" });

      // 创建其他任务工作表
      const otherWorksheet = XLSX.utils.json_to_sheet(otherTasksData);

      // 创建工作簿并添加工作表
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, dailyWorksheet, "每日任务");
      XLSX.utils.book_append_sheet(workbook, otherWorksheet, "其他任务");

      // 导出文件
      XLSX.writeFile(workbook, fileName);
      addAlertTip("导出成功", `文件已保存为 ${fileName}`);
    });

    // 清空列表功能
    document.getElementById("clearCodes")?.addEventListener("click", () => {
      if (confirm("确定要清空兑换码列表吗？此操作不可恢复。")) {
        document.getElementById("codeTableBody").innerHTML = "";
        // 可以选择是否同时清空 apiData
        // Object.keys(apiData).forEach(key => delete apiData[key]);
      }
    });

    // 添加更新兑换码列表的函数(将apiData中的数据更新到页面中,已删除)
    function updateCodeList() {
      const tableBody = document.getElementById("codeTableBody");
      if (!tableBody) return;

      tableBody.innerHTML = "";
      Object.keys(apiData).forEach((taskId) => {
        if (apiData[taskId].data.award_cdkey) {
          const row = document.createElement("tr");
          row.innerHTML = `
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="${
                              apiData[taskId].data.reward_info.award_icon || ""
                            }" alt="" class="reward-icon me-2" style="width: 32px; height: 32px; object-fit: contain;">
                            <span>${apiData[taskId].data.task_name}</span>
                        </div>
                    </td>
                    <td>
                        <div class="input-group">
                            <input type="text" class="form-control" value="${
                              apiData[taskId].data.award_cdkey
                            }" readonly style="cursor: pointer;">
                            <button class="btn btn-outline-secondary copy-btn" type="button">复制</button>
                        </div>
                    </td>
                    <td>${formatDate(apiData[taskId].getTime)}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary view-btn">查看详情</button>
                    </td>
                `;
          tableBody.appendChild(row);

          // 添加复制按钮功能
          row.querySelector(".copy-btn").addEventListener("click", () => {
            const input = row.querySelector(".input-group input");
            navigator.clipboard
              .writeText(input.value)
              .then(() => {
                addAlertTip("复制成功", `兑换码 ${input.value} 已复制到剪贴板`);
              })
              .catch((err) => {
                addAlertTip("复制失败", "请检查浏览器权限设置");
                console.error("复制失败:", err);
              });
          });

          // 添加输入框点击复制功能
          row
            .querySelector(".input-group input")
            .addEventListener("click", () => {
              const input = row.querySelector(".input-group input");
              navigator.clipboard
                .writeText(input.value)
                .then(() => {
                  addAlertTip(
                    "复制成功",
                    `兑换码 ${input.value} 已复制到剪贴板`
                  );
                })
                .catch((err) => {
                  addAlertTip("复制失败", "请检查浏览器权限设置");
                  console.error("复制失败:", err);
                });
            });

          // 添加查看详情按钮功能
          row.querySelector(".view-btn").addEventListener("click", () => {
            const detailsHtml = `
                    <div class="modal fade" id="codeDetailsModal" tabindex="-1">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">兑换码详情</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body">
                                    <p><strong>奖励名称：</strong>${
                                      apiData[taskId].data.task_name
                                    }</p>
                                    <p><strong>兑换码：</strong>${
                                      apiData[taskId].data.award_cdkey
                                    }</p>
                                    <p><strong>获取时间：</strong>${formatDate(
                                      apiData[taskId].getTime
                                    )}</p>
                                    <p><strong>活动名称：</strong>${
                                      apiData[taskId].data.act_name ||
                                      "未知活动"
                                    }</p>
                                    <p><strong>描述：</strong>${
                                      apiData[taskId].data.description || "无"
                                    }</p>
                                    ${
                                      apiData[taskId].data.reward_info
                                        .award_icon
                                        ? `<img src="${
                                            apiData[taskId].data.reward_info
                                              .award_icon
                                          }" alt="${
                                            apiData[taskId].data.task_name || ""
                                          }" class="img-fluid mb-3" style="max-width: 200px;">`
                                        : ""
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            document.body.insertAdjacentHTML("beforeend", detailsHtml);
            const modal = new bootstrap.Modal(
              document.getElementById("codeDetailsModal")
            );
            modal.show();
            document
              .getElementById("codeDetailsModal")
              .addEventListener("hidden.bs.modal", function () {
                this.remove();
              });
          });
        }
      });
    }

    // 添加样式
    const additionalStyle = `
        .table-responsive {
            max-height: 70vh;
            overflow-y: auto;
        }
        #codeTableBody .input-group {
            max-width: 300px;
        }
        .reward-icon {
            border-radius: 4px;
            background-color: #f8f9fa;
            padding: 2px;
            transition: transform 0.2s;
            flex-shrink: 0;
        }
        .reward-icon:hover {
            transform: scale(1.2);
        }
        #codeTableBody td:first-child {
            min-width: 200px;
        }
        .d-flex.align-items-center {
            gap: 0.5rem;
        }
    `;
    style.textContent += additionalStyle;

    // 在windowOnload函数中添加版本选择相关的事件监听
    function updateVersionCodeList(data) {
      const tableBody = document.getElementById("codeTableBody");
      if (!tableBody) return;

      tableBody.innerHTML = "";

      // 检查数据结构
      if (!data || !data.list) {
        console.error("Invalid data structure:", data);
        addAlertTip("错误", "获取兑换码数据格式错误");
        return;
      }

      // 定义每日任务名称列表
      const dailyTaskNames = [
        "丁尼*5000",
        "丁尼*1000",
        "音擎能源模块*2",
        "资深调查员记录*2",
        "遗失碎金*5-每日开播60分钟",
        "漫游指南*2-每日获得2电池",
        "冒险记录*6-每日4人发弹幕",
        "信用点*11111-每日观看时长15分钟",
        "【每日】冒险记录*6+遗失碎金*5",
        "【每日】漫游指南*2+信用点*11111",
        "武器说明书*6",
        "战斗旋律*3",
        "深红凝珠*100",
        "铜币*10000",
      ];

      data.list.forEach((code) => {
        if (!code.extra_info?.cdkey_content) return; // 跳过没有兑换码的记录

        // 检查是否为每日任务
        const isDailyTask = dailyTaskNames.some(
          (taskName) => code.award_name?.trim() === taskName.trim()
        );
        const displayAwardName = isDailyTask
          ? `【每日任务】${code.award_name || "未知奖励"}`
          : code.award_name || "未知奖励";

        const row = document.createElement("tr");
        row.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${code.icon || ""}" alt="${
          code.award_name
        }" class="reward-icon me-2" style="width: 32px; height: 32px; object-fit: contain;">
                        <span>${displayAwardName}</span>
                    </div>
                </td>
                <td>
                    <div class="input-group">
                        <input type="text" class="form-control" value="${
                          code.extra_info.cdkey_content
                        }" readonly style="cursor: pointer;">
                        <button class="btn btn-outline-secondary copy-btn" type="button">复制</button>
                    </div>
                </td>
                <td>${formatDate(code.receive_time)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary view-btn">查看详情</button>
                </td>
            `;
        tableBody.appendChild(row);

        // 添加复制按钮功能
        row.querySelector(".copy-btn").addEventListener("click", (e) => {
          const input = e.target.previousElementSibling;
          navigator.clipboard
            .writeText(input.value)
            .then(() => {
              addAlertTip("复制成功", `兑换码 ${input.value} 已复制到剪贴板`);
            })
            .catch((err) => {
              addAlertTip("复制失败", "请检查浏览器权限设置");
              console.error("复制失败:", err);
            });
        });

        // 添加输入框点击复制功能
        row
          .querySelector(".input-group input")
          .addEventListener("click", (e) => {
            const input = e.target;
            navigator.clipboard
              .writeText(input.value)
              .then(() => {
                addAlertTip("复制成功", `兑换码 ${input.value} 已复制到剪贴板`);
              })
              .catch((err) => {
                addAlertTip("复制失败", "请检查浏览器权限设置");
                console.error("复制失败:", err);
              });
          });

        // 添加查看详情按钮功能
        row.querySelector(".view-btn").addEventListener("click", () => {
          const detailsHtml = `
                    <div class="modal fade" id="codeDetailsModal" tabindex="-1">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">兑换码详情</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body">
                                    <p><strong>奖励名称：</strong>${displayAwardName}</p>
                                    <p><strong>兑换码：</strong>${
                                      code.extra_info.cdkey_content
                                    }</p>
                                    <p><strong>获取时间：</strong>${formatDate(
                                      code.receive_time
                                    )}</p>
                                    <p><strong>活动名称：</strong>${
                                      code.activity_name || "未知活动"
                                    }</p>
                                    <p><strong>描述：</strong>${
                                      code.description || "无"
                                    }</p>
                                    ${
                                      code.icon
                                        ? `<img src="${code.icon}" alt="${
                                            code.award_name || ""
                                          }" class="img-fluid mb-3" style="max-width: 200px;">`
                                        : ""
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                `;
          document.body.insertAdjacentHTML("beforeend", detailsHtml);
          const modal = new bootstrap.Modal(
            document.getElementById("codeDetailsModal")
          );
          modal.show();
          document
            .getElementById("codeDetailsModal")
            .addEventListener("hidden.bs.modal", function () {
              this.remove();
            });
        });
      });

      // 设置取消筛选按钮为默认激活状态
      document.querySelector(".clear-filter")?.classList.add("active");
      document.querySelector(".filter-daily")?.classList.remove("active");
      document.querySelector(".filter-non-daily")?.classList.remove("active");
    }

    // 刷新按钮事件监听
    document
      .getElementById("refreshVersionCodes")
      ?.addEventListener("click", async () => {
        // 移除过滤器的激活状态
        document.querySelector(".filter-daily")?.classList.remove("active");
        document.querySelector(".filter-non-daily")?.classList.remove("active");
        document.querySelector(".clear-filter")?.classList.add("active");

        const activityId = document.getElementById("versionSelect").value;
        const versionCodes = await getVersionCodes(activityId);
        updateVersionCodeList(versionCodes);
        addAlertTip("刷新成功", "兑换码列表已更新");
      });

    // 在windowOnload函数中添加事件监听器
    document.querySelector(".filter-daily")?.addEventListener("click", () => {
      const rows = document.querySelectorAll("#codeTableBody tr");
      rows.forEach((row) => {
        const awardName = row.querySelector("td:first-child span").textContent;
        row.style.display = awardName.includes("【每日任务】") ? "" : "none";
      });
      // 高亮当前激活的过滤按钮
      document.querySelector(".filter-daily").classList.add("active");
      document.querySelector(".filter-non-daily").classList.remove("active");
      document.querySelector(".clear-filter").classList.remove("active");
    });

    document
      .querySelector(".filter-non-daily")
      ?.addEventListener("click", () => {
        const rows = document.querySelectorAll("#codeTableBody tr");
        rows.forEach((row) => {
          const awardName = row.querySelector(
            "td:first-child span"
          ).textContent;
          row.style.display = !awardName.includes("【每日任务】") ? "" : "none";
        });
        // 高亮当前激活的过滤按钮
        document.querySelector(".filter-non-daily").classList.add("active");
        document.querySelector(".filter-daily").classList.remove("active");
      });

    // 修改搜索功能，使其能够与过滤功能协同工作
    document.getElementById("codeSearch")?.addEventListener("input", (e) => {
      const searchText = e.target.value.toLowerCase();
      const rows = document.querySelectorAll("#codeTableBody tr");

      // 获取当前激活的过滤器
      const isDailyFilterActive = document
        .querySelector(".filter-daily")
        .classList.contains("active");
      const isNonDailyFilterActive = document
        .querySelector(".filter-non-daily")
        .classList.contains("active");

      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        const awardName = row.querySelector("td:nth-child(2)").textContent;
        const isDaily = awardName.includes("【每日任务】");

        let shouldShow = text.includes(searchText);

        // 应用过滤器规则
        if (isDailyFilterActive) {
          shouldShow = shouldShow && isDaily;
        } else if (isNonDailyFilterActive) {
          shouldShow = shouldShow && !isDaily;
        }

        row.style.display = shouldShow ? "" : "none";
      });

      // 如果搜索框为空且没有激活的过滤器，移除所有过滤按钮的激活状态
      if (!searchText && !isDailyFilterActive && !isNonDailyFilterActive) {
        document.querySelector(".clear-filter").classList.add("active");
      } else {
        document.querySelector(".clear-filter").classList.remove("active");
      }
    });

    // 添加按钮激活状态的样式
    const filterButtonStyle = `
        .btn.active {
            background-color: #0d6efd;
            color: white;
        }
    `;
    style.textContent += filterButtonStyle;

    // 在windowOnload函数中添加事件监听器
    document.querySelector(".clear-filter")?.addEventListener("click", () => {
      // 显示所有行
      const rows = document.querySelectorAll("#codeTableBody tr");
      rows.forEach((row) => {
        row.style.display = "";
      });

      // 移除所有过滤按钮的激活状态
      document.querySelector(".filter-daily").classList.remove("active");
      document.querySelector(".filter-non-daily").classList.remove("active");
      document.querySelector(".clear-filter").classList.add("active");

      // 清空搜索框
      document.getElementById("codeSearch").value = "";
    });

    // 修改其他过滤按钮的点击事件，添加对clear-filter按钮状态的处理
    document.querySelector(".filter-daily")?.addEventListener("click", () => {
      const rows = document.querySelectorAll("#codeTableBody tr");
      rows.forEach((row) => {
        const awardName = row.querySelector("td:first-child").textContent;
        row.style.display = awardName.includes("【每日任务】") ? "" : "none";
      });
      // 高亮当前激活的过滤按钮
      document.querySelector(".filter-daily").classList.add("active");
      document.querySelector(".filter-non-daily").classList.remove("active");
      document.querySelector(".clear-filter").classList.remove("active");
    });

    document
      .querySelector(".filter-non-daily")
      ?.addEventListener("click", () => {
        const rows = document.querySelectorAll("#codeTableBody tr");
        rows.forEach((row) => {
          const awardName = row.querySelector("td:first-child").textContent;
          row.style.display = !awardName.includes("【每日任务】") ? "" : "none";
        });
        // 高亮当前激活的过滤按钮
        document.querySelector(".filter-non-daily").classList.add("active");
        document.querySelector(".filter-daily").classList.remove("active");
        document.querySelector(".clear-filter").classList.remove("active");
      });

    // 修改搜索功能，使其能够与过滤功能协同工作
    document.getElementById("codeSearch")?.addEventListener("input", (e) => {
      const searchText = e.target.value.toLowerCase();
      const rows = document.querySelectorAll("#codeTableBody tr");

      // 获取当前激活的过滤器
      const isDailyFilterActive = document
        .querySelector(".filter-daily")
        .classList.contains("active");
      const isNonDailyFilterActive = document
        .querySelector(".filter-non-daily")
        .classList.contains("active");

      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        const awardName = row.querySelector("td:first-child").textContent;
        const isDaily = awardName.includes("【每日任务】");

        let shouldShow = text.includes(searchText);

        // 应用过滤器规则
        if (isDailyFilterActive) {
          shouldShow = shouldShow && isDaily;
        } else if (isNonDailyFilterActive) {
          shouldShow = shouldShow && !isDaily;
        }

        row.style.display = shouldShow ? "" : "none";
      });

      // 如果搜索框为空且没有激活的过滤器，移除所有过滤按钮的激活状态
      if (!searchText && !isDailyFilterActive && !isNonDailyFilterActive) {
        document.querySelector(".clear-filter").classList.add("active");
      } else {
        document.querySelector(".clear-filter").classList.remove("active");
      }
    });

    // 代理开关变更时自动触发保存逻辑
    const proxyEnableSwitch = document.getElementById("proxyEnableSwitch");
    if (proxyEnableSwitch) {
      proxyEnableSwitch.addEventListener("change", function () {
        document.getElementById("saveProxyConfig").click();
      });
    }

    // 初始化切换逻辑与默认显示
    (function initGameSwitch() {
      const srSection = document.getElementById("sr-section");
      const zzzSection = document.getElementById("zzz-section");
      const dnaSection = document.getElementById("dna-section");
      if (srSection && zzzSection && dnaSection) {
        srSection.style.display = "";
        zzzSection.style.display = "none";
        dnaSection.style.display = "none";
      }
      const switchButtons = document.querySelectorAll(
        "#task-progress-inline .game-switch"
      );
      switchButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
          switchButtons.forEach((b) => b.classList.remove("active"));
          this.classList.add("active");
          const target = this.getAttribute("data-target");
          if (target === "sr") {
            srSection && (srSection.style.display = "");
            zzzSection && (zzzSection.style.display = "none");
            dnaSection && (dnaSection.style.display = "none");
          } else if (target === "jql") {
            srSection && (srSection.style.display = "none");
            zzzSection && (zzzSection.style.display = "");
            dnaSection && (dnaSection.style.display = "none");
          } else if (target === "dna") {
            srSection && (srSection.style.display = "none");
            zzzSection && (zzzSection.style.display = "none");
            dnaSection && (dnaSection.style.display = "");
          }
        });
      });
    })();

    // 定时设置相关功能
    let scheduleConfig = {
      enabled: false,
      time: "00:00:01",
      delay: 500,
      // 任务间隔延迟（原 luckyNum）
      taskIntervalMs: 500,
      // 定时抢码选择的任务 sid 列表（分游戏）
      selectedTaskIds: { sr: [], jql: [], dna: [] },
      // 是否跳过无资格任务
      skipNoQualification: true,
      srTasks: true,
      jqlTasks: true,
      dnaTasks: true,
      timerId: null,
      taskIntervalId: null,
    };

    // 全局任务列表，用于存储当前运行的任务和结果
    let globalAllTasks = [];

    // 从本地存储加载定时设置
    function loadScheduleConfig() {
      try {
        const saved = localStorage.getItem("bili_schedule_config");
        if (saved) {
          const config = JSON.parse(saved);
          Object.assign(scheduleConfig, config);

          // 确保selectedTaskIds包含所有游戏类型
          if (!scheduleConfig.selectedTaskIds) {
            scheduleConfig.selectedTaskIds = { sr: [], jql: [], dna: [] };
          } else {
            if (!scheduleConfig.selectedTaskIds.sr) {
              scheduleConfig.selectedTaskIds.sr = [];
            }
            if (!scheduleConfig.selectedTaskIds.jql) {
              scheduleConfig.selectedTaskIds.jql = [];
            }
            if (!scheduleConfig.selectedTaskIds.dna) {
              scheduleConfig.selectedTaskIds.dna = [];
            }
          }

          // 确保游戏类型标志存在
          if (scheduleConfig.srTasks === undefined) {
            scheduleConfig.srTasks = true;
          }
          if (scheduleConfig.jqlTasks === undefined) {
            scheduleConfig.jqlTasks = true;
          }
          if (scheduleConfig.dnaTasks === undefined) {
            scheduleConfig.dnaTasks = true;
          }
        }
      } catch (e) {
        console.warn("加载定时设置失败:", e);
      }
    }

    // 保存定时设置到本地存储
    function saveScheduleConfig() {
      try {
        localStorage.setItem(
          "bili_schedule_config",
          JSON.stringify(scheduleConfig)
        );
        console.log("定时设置已保存到本地存储");
      } catch (e) {
        console.warn("保存定时设置失败:", e);
      }
    }

    // 显示定时设置模态框
    function showScheduleModal() {
      // 检查Bootstrap是否已加载
      if (typeof bootstrap === "undefined") {
        addAlertTip("错误", "Bootstrap库未加载，请刷新页面重试", 3000);
        return;
      }

      // 显示模态框
      const modalElement = document.getElementById("scheduleModal");
      if (!modalElement) {
        addAlertTip("错误", "模态框元素未找到", 3000);
        return;
      }

      try {
        const modal = new bootstrap.Modal(modalElement, {
          backdrop: true,
          keyboard: true,
          focus: true,
        });

        // 监听模态框显示事件，在显示后设置表单数据
        const handleShown = () => {
          // 打开前刷新内存中的配置，确保使用最近一次写入本地存储的延迟
          try {
            loadScheduleConfig();
          } catch (e) {}
          // 初始化表单数据
          const enableSwitch = document.getElementById("scheduleEnableSwitch");
          const timeInput = document.getElementById("scheduleTime");
          const delayInput = document.getElementById("scheduleNetworkDelay");
          const intervalInput = document.getElementById("scheduleTaskInterval");
          const settingsDiv = document.getElementById("scheduleSettings");

          if (enableSwitch) enableSwitch.checked = scheduleConfig.enabled;
          if (timeInput) timeInput.value = scheduleConfig.time || "00:00:01";
          if (delayInput)
            delayInput.value = Number.isFinite(scheduleConfig.delay)
              ? scheduleConfig.delay
              : 500;
          if (intervalInput)
            intervalInput.value = scheduleConfig.taskIntervalMs;
          const skipNoQualificationCheckbox = document.getElementById(
            "scheduleSkipNoQualification"
          );
          if (skipNoQualificationCheckbox)
            skipNoQualificationCheckbox.checked =
              scheduleConfig.skipNoQualification;

          // 显示/隐藏设置区域
          if (settingsDiv) {
            if (scheduleConfig.enabled) {
              settingsDiv.classList.remove("d-none");
            } else {
              settingsDiv.classList.add("d-none");
            }
          }

          // 更新任务列表显示
          updateScheduleTaskList();

          // 移除事件监听器，避免重复绑定
          modalElement.removeEventListener("shown.bs.modal", handleShown);

          // 绑定事件监听器
          bindScheduleEvents();
        };

        modalElement.addEventListener("shown.bs.modal", handleShown);
        modal.show();
      } catch (error) {
        console.error("模态框初始化失败:", error);
        addAlertTip("错误", "模态框初始化失败: " + error.message, 3000);
      }
    }

    // 根据taskId获取任务名称
    function getTaskName(taskId, gameType) {
      if (
        TaskAPI.taskDataCache[gameType] &&
        TaskAPI.taskDataCache[gameType].code === 0
      ) {
        const task = TaskAPI.taskDataCache[gameType].data.list.find(
          (t) =>
            (t.check_points &&
              t.check_points.some((cp) => cp.sid === taskId)) ||
            (t.accumulative_check_points &&
              t.accumulative_check_points.some((cp) => cp.sid === taskId))
        );
        if (task) {
          // 优先使用检查点的award_name，如果没有则使用task_name
          // 先检查 check_points
          let checkpoint =
            task.check_points &&
            task.check_points.find((cp) => cp.sid === taskId);
          if (!checkpoint && task.accumulative_check_points) {
            // 如果 check_points 中没找到，再检查 accumulative_check_points
            checkpoint = task.accumulative_check_points.find(
              (cp) => cp.sid === taskId
            );
          }
          if (checkpoint && checkpoint.award_name) {
            return checkpoint.award_name;
          }
          return task.task_name || taskId;
        }
      }
      return taskId; // 如果找不到任务名称，返回taskId
    }

    // 更新定时设置窗口中的任务列表显示
    function updateScheduleTaskList() {
      try {
        // 检查模态框是否显示
        const scheduleModal = document.getElementById("scheduleModal");
        if (!scheduleModal || !scheduleModal.classList.contains("show")) {
          return; // 如果模态框没有显示，不执行更新
        }

        // 获取已选择的任务ID
        const srSelectedIds = TaskAPI.getSelectedTaskIds("sr");
        const jqlSelectedIds = TaskAPI.getSelectedTaskIds("jql");
        const dnaSelectedIds = TaskAPI.getSelectedTaskIds("dna");

        // 获取当前运行中的任务（如果有的话）
        const currentRunningTasks = globalAllTasks || [];

        // 更新星穹铁道任务列表
        const srTaskList = document.getElementById("scheduleSrTaskList");
        if (srTaskList) {
          if (srSelectedIds.length === 0) {
            srTaskList.innerHTML =
              '<div class="text-muted text-center py-3">暂无已选择的星穹铁道任务</div>';
          } else {
            // 这里需要从缓存的任务数据中获取任务名称
            // 暂时显示任务ID，后续可以优化为显示任务名称
            let srHtml = "";
            srSelectedIds.forEach((sid) => {
              // 查找历史结果
              let resultText = "";
              let resultClass = "text-muted";
              if (currentRunningTasks.length > 0) {
                const historicalTask = currentRunningTasks.find(
                  (t) => t.gameType === "sr" && t.taskId === sid
                );
                if (historicalTask && historicalTask.lastResult) {
                  resultText = historicalTask.lastResult;
                  if (historicalTask.lastResult.includes("成功:"))
                    resultClass = "text-success";
                  else if (historicalTask.lastResult.includes("库存已经使用完"))
                    resultClass = "text-danger";
                  else if (historicalTask.lastResult.includes("无资格"))
                    resultClass = "text-warning";
                }
              }

              const taskName = getTaskName(sid, "sr");
              srHtml += `
                <div class="form-check d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-center gap-2">
                    <input class="form-check-input schedule-task-checkbox" type="checkbox" 
                           data-task-id="${sid}" data-game="sr" checked>
                    <label class="form-check-label" for="schedule-task-${sid}">
                      ${taskName}
                    </label>
                  </div>
                  <span class="schedule-task-result ${resultClass}" data-task-id="${sid}">${resultText}</span>
                </div>
              `;
            });
            srTaskList.innerHTML = srHtml;
          }
        }

        // 更新绝区零任务列表
        const jqlTaskList = document.getElementById("scheduleJqlTaskList");
        if (jqlTaskList) {
          if (jqlSelectedIds.length === 0) {
            jqlTaskList.innerHTML =
              '<div class="text-muted text-center py-3">暂无已选择的绝区零任务</div>';
          } else {
            let jqlHtml = "";
            jqlSelectedIds.forEach((sid) => {
              // 查找历史结果
              let resultText = "";
              let resultClass = "text-muted";
              if (currentRunningTasks.length > 0) {
                const historicalTask = currentRunningTasks.find(
                  (t) => t.gameType === "jql" && t.taskId === sid
                );
                if (historicalTask && historicalTask.lastResult) {
                  resultText = historicalTask.lastResult;
                  if (historicalTask.lastResult.includes("成功:"))
                    resultClass = "text-success";
                  else if (historicalTask.lastResult.includes("库存已经使用完"))
                    resultClass = "text-danger";
                  else if (historicalTask.lastResult.includes("无资格"))
                    resultClass = "text-warning";
                }
              }

              const taskName = getTaskName(sid, "jql");
              jqlHtml += `
                <div class="form-check d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-center gap-2">
                    <input class="form-check-input schedule-task-checkbox" type="checkbox" 
                           data-task-id="${sid}" data-game="jql" checked>
                    <label class="form-check-label" for="schedule-task-${sid}">
                      ${taskName}
                    </label>
                  </div>
                  <span class="schedule-task-result ${resultClass}" data-task-id="${sid}">${resultText}</span>
                </div>
              `;
            });
            jqlTaskList.innerHTML = jqlHtml;
          }
        }

        // 更新二重螺旋任务列表
        const dnaTaskList = document.getElementById("scheduleDnaTaskList");
        if (dnaTaskList) {
          if (dnaSelectedIds.length === 0) {
            dnaTaskList.innerHTML =
              '<div class="text-muted text-center py-3">暂无已选择的二重螺旋任务</div>';
          } else {
            let dnaHtml = "";
            dnaSelectedIds.forEach((sid) => {
              // 查找历史结果
              let resultText = "";
              let resultClass = "text-muted";
              if (currentRunningTasks.length > 0) {
                const historicalTask = currentRunningTasks.find(
                  (t) => t.gameType === "dna" && t.taskId === sid
                );
                if (historicalTask && historicalTask.lastResult) {
                  resultText = historicalTask.lastResult;
                  if (historicalTask.lastResult.includes("成功:"))
                    resultClass = "text-success";
                  else if (historicalTask.lastResult.includes("库存已经使用完"))
                    resultClass = "text-danger";
                  else if (historicalTask.lastResult.includes("无资格"))
                    resultClass = "text-warning";
                }
              }

              const taskName = getTaskName(sid, "dna");
              dnaHtml += `
                <div class="form-check d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-center gap-2">
                    <input class="form-check-input schedule-task-checkbox" type="checkbox" 
                           data-task-id="${sid}" data-game="dna" checked>
                    <label class="form-check-label" for="schedule-task-${sid}">
                      ${taskName}
                    </label>
                  </div>
                  <span class="schedule-task-result ${resultClass}" data-task-id="${sid}">${resultText}</span>
                </div>
              `;
            });
            dnaTaskList.innerHTML = dnaHtml;
          }
        }

        // 绑定定时设置窗口中的任务复选框事件
        document.querySelectorAll(".schedule-task-checkbox").forEach((cb) => {
          cb.onchange = function () {
            const sid = String(this.getAttribute("data-task-id"));
            const game = this.getAttribute("data-game");

            // 确保 scheduleConfig.selectedTaskIds 存在
            if (!scheduleConfig.selectedTaskIds) {
              scheduleConfig.selectedTaskIds = { sr: [], jql: [], dna: [] };
            }
            if (!Array.isArray(scheduleConfig.selectedTaskIds[game])) {
              scheduleConfig.selectedTaskIds[game] = [];
            }

            const arr = scheduleConfig.selectedTaskIds[game];
            if (!this.checked) {
              // 取消勾选时从列表中移除
              const idx = arr.indexOf(sid);
              if (idx > -1) {
                arr.splice(idx, 1);
                saveScheduleConfig();
                console.log(
                  `[定时设置] 从定时抢码列表中移除任务: ${game} - ${sid}`
                );

                // 立即更新定时设置窗口中的任务列表显示
                updateScheduleTaskList();

                // 同时更新主页面中对应任务的复选框状态
                const mainPageCheckbox = document.querySelector(
                  `.task-select-checkbox[data-task-id="${sid}"][data-game="${game}"]`
                );
                if (mainPageCheckbox) {
                  mainPageCheckbox.checked = false;
                }
              }
            }
          };
        });
      } catch (e) {
        console.error("更新定时设置任务列表失败:", e);
      }
    }

    // 启用/禁用开关事件（使用直接赋值，避免重复绑定）
    function bindScheduleEvents() {
      const enableSwitch = document.getElementById("scheduleEnableSwitch");
      const saveButton = document.getElementById("saveScheduleSettings");

      if (enableSwitch) {
        enableSwitch.onchange = function () {
          const settingsDiv = document.getElementById("scheduleSettings");
          if (settingsDiv) {
            if (this.checked) {
              settingsDiv.classList.remove("d-none");
            } else {
              settingsDiv.classList.add("d-none");
            }
          }
        };
      }

      if (saveButton) {
        saveButton.onclick = function () {
          // 保存前将输入值写入到 scheduleConfig（避免被旧内存值覆盖）
          try {
            const delayInput = document.getElementById("scheduleNetworkDelay");
            if (delayInput) {
              const v = parseInt(delayInput.value);
              if (Number.isFinite(v) && v >= 0) scheduleConfig.delay = v;
            }
          } catch (e) {}
          // 任务间隔延迟
          try {
            const intervalInput = document.getElementById(
              "scheduleTaskInterval"
            );
            if (intervalInput) {
              const iv = parseInt(intervalInput.value);
              if (Number.isFinite(iv) && iv >= 0)
                scheduleConfig.taskIntervalMs = iv;
            }
          } catch (e) {}
          // 获取表单数据
          scheduleConfig.enabled = document.getElementById(
            "scheduleEnableSwitch"
          ).checked;
          scheduleConfig.time = document.getElementById("scheduleTime").value;
          scheduleConfig.delay =
            parseInt(document.getElementById("scheduleNetworkDelay").value) ||
            500;
          scheduleConfig.taskIntervalMs =
            parseInt(document.getElementById("scheduleTaskInterval").value) ||
            500;
          scheduleConfig.skipNoQualification = document.getElementById(
            "scheduleSkipNoQualification"
          ).checked;

          // 保存到本地存储
          saveScheduleConfig();

          // 更新全局变量
          sendDelay = scheduleConfig.delay;
          taskIntervalMs = scheduleConfig.taskIntervalMs;

          // 设置或清除定时器
          if (scheduleConfig.enabled) {
            setupScheduleTimer();
            addAlertTip(
              "成功",
              "定时抢码已启用，将在每天 " + scheduleConfig.time + " 执行",
              3000
            );
          } else {
            clearScheduleTimer();
            addAlertTip("成功", "定时抢码已禁用", 2000);
          }

          // 不关闭模态框，让用户继续查看任务状态
        };
      }
    }

    // 设置定时器
    function setupScheduleTimer() {
      // 清除现有定时器，但保留任务数据
      clearScheduleTimer(false);

      // 解析时间
      const [hours, minutes, seconds] = scheduleConfig.time
        .split(":")
        .map(Number);

      // 计算下次执行时间
      const now = new Date();
      const nextRun = new Date();
      nextRun.setHours(hours, minutes, seconds, 0);

      // 如果今天的时间已过，设置为明天
      if (nextRun.getTime() <= now.getTime()) {
        nextRun.setDate(nextRun.getDate() + 1);
      }

      // 计算延迟时间
      const delay = nextRun.getTime() - now.getTime();

      // 设置定时器
      scheduleConfig.timerId = setTimeout(() => {
        executeScheduledTask();
        // 延迟设置下一天的定时器，让当前任务运行一段时间
        setTimeout(() => {
          setupScheduleTimer();
        }, 60000); // 延迟1分钟再设置下一天的定时器
      }, delay);

      console.log(`定时任务已设置，下次执行时间: ${nextRun.toLocaleString()}`);
    }

    // 清除定时器
    function clearScheduleTimer(clearTasks = true) {
      // 清除主定时器
      if (scheduleConfig.timerId) {
        clearTimeout(scheduleConfig.timerId);
        scheduleConfig.timerId = null;
      }

      // 清除任务循环定时器
      if (scheduleConfig.taskIntervalId) {
        clearInterval(scheduleConfig.taskIntervalId);
        scheduleConfig.taskIntervalId = null;
      }

      // 只有在明确要求时才清除运行中的任务状态
      if (clearTasks) {
        globalAllTasks = [];
      }

      console.log("定时任务已清除");
    }

    // 执行定时任务
    async function executeScheduledTask() {
      console.log("开始执行定时抢码任务");
      addAlertTip("定时任务", "开始执行定时抢码任务", 3000);

      try {
        // 直接基于已选择的列表进行任务
        const selectedTaskIds = scheduleConfig.selectedTaskIds || {
          sr: [],
          jql: [],
          dna: [],
        };

        // 获取配置参数
        const taskIntervalMs = scheduleConfig.taskIntervalMs || 500;

        // 收集所有任务，每次从已选择列表重新整理
        globalAllTasks = [];
        for (const gameType of ["sr", "jql", "dna"]) {
          const taskIds = selectedTaskIds[gameType] || [];
          if (taskIds.length > 0) {
            console.log(`执行 ${gameType} 任务，共 ${taskIds.length} 个任务`);
            taskIds.forEach((taskId) => {
              // 获取任务名称
              let taskName = taskId; // 默认使用taskId
              if (
                TaskAPI.taskDataCache[gameType] &&
                TaskAPI.taskDataCache[gameType].code === 0
              ) {
                const task = TaskAPI.taskDataCache[gameType].data.list.find(
                  (t) =>
                    (t.check_points &&
                      t.check_points.some((cp) => cp.sid === taskId)) ||
                    (t.accumulative_check_points &&
                      t.accumulative_check_points.some(
                        (cp) => cp.sid === taskId
                      ))
                );
                if (task) {
                  // 优先使用检查点的award_name，如果没有则使用task_name
                  // 先检查 check_points
                  let checkpoint =
                    task.check_points &&
                    task.check_points.find((cp) => cp.sid === taskId);
                  if (!checkpoint && task.accumulative_check_points) {
                    // 如果 check_points 中没找到，再检查 accumulative_check_points
                    checkpoint = task.accumulative_check_points.find(
                      (cp) => cp.sid === taskId
                    );
                  }
                  if (checkpoint && checkpoint.award_name) {
                    taskName = checkpoint.award_name;
                  } else {
                    taskName = task.task_name || taskId;
                  }
                }
              }

              globalAllTasks.push({
                gameType,
                taskId,
                taskName, // 添加任务名称
                status: "active", // 任务状态：active(活跃), completed(已完成), no_stock(无库存), no_qualification(无资格)
                skipNoQualification:
                  scheduleConfig.skipNoQualification || false, // 是否跳过无资格
                lastResult: null, // 最后一次返回的结果
                lastResultTime: null, // 最后一次结果的时间
              });
            });
          }
        }

        if (globalAllTasks.length === 0) {
          console.log("没有选择任何任务");
          return;
        }

        console.log(`总共 ${globalAllTasks.length} 个任务，启动统一循环定时器`);

        // 立即执行第一次
        executeAllTasks();

        // 设置统一的循环定时器
        const intervalId = setInterval(() => {
          if (globalAllTasks.length > 0) {
            // 检查是否还有活跃任务
            const activeTasks = globalAllTasks.filter(
              (task) => task.status === "active"
            ).length;
            if (activeTasks > 0) {
              executeAllTasks();
            } else {
              console.log("没有活跃任务，停止循环定时器");
              clearInterval(intervalId);
              scheduleConfig.taskIntervalId = null;
              addAlertTip("定时任务", "所有任务已处理完毕，循环已停止", 3000);
            }
          }
        }, taskIntervalMs);

        // 保存定时器ID
        scheduleConfig.taskIntervalId = intervalId;
        console.log("setInterval 已设置，ID:", intervalId);

        addAlertTip("定时任务", "定时抢码任务已启动", 3000);
      } catch (error) {
        console.error("执行定时任务失败:", error);
        addAlertTip("错误", "执行定时任务失败: " + error.message, 3000);
      }
    }

    // 执行所有任务
    async function executeAllTasks() {
      try {
        // 获取当前延迟（每次send后都会重新计算）
        const currentDelay = scheduleConfig.delay || 500;

        // 计算延迟时间：currentDelay减少3位数后向上取整来作为被减数
        const baseTime = Math.ceil(currentDelay / 1000) * 1000;
        let adjustedDelay = baseTime - currentDelay;

        // 确保延迟不为负数
        adjustedDelay = Math.max(0, adjustedDelay);

        console.log(
          `当前延迟: ${currentDelay}ms, 调整后延迟: ${adjustedDelay}ms`
        );

        // 统计任务状态
        const activeTasks = globalAllTasks.filter(
          (task) => task.status === "active"
        ).length;
        const completedTasks = globalAllTasks.filter(
          (task) => task.status === "completed"
        ).length;
        const noStockTasks = globalAllTasks.filter(
          (task) => task.status === "no_stock"
        ).length;
        const noQualificationTasks = globalAllTasks.filter(
          (task) => task.status === "no_qualification"
        ).length;

        console.log(
          `任务状态统计: 活跃${activeTasks}个, 已完成${completedTasks}个, 无库存${noStockTasks}个, 无资格${noQualificationTasks}个`
        );

        // 如果没有活跃任务，停止循环定时器
        if (activeTasks === 0) {
          console.log("所有任务都已处理完毕，停止循环定时器");
          if (scheduleConfig.taskIntervalId) {
            clearInterval(scheduleConfig.taskIntervalId);
            scheduleConfig.taskIntervalId = null;
          }
          addAlertTip("定时任务", "所有任务已处理完毕，循环已停止", 3000);
          return;
        }

        // 等待调整后的延迟时间，然后同时发送所有任务
        setTimeout(async () => {
          if (globalAllTasks.length === 0) {
            return;
          }

          // 同时发送所有任务的请求
          const promises = globalAllTasks.map(async (task) => {
            const { gameType, taskId, status, skipNoQualification } = task;

            // 检查任务状态，跳过已完成或无库存的任务
            if (status !== "active") {
              console.log(`跳过任务 ${gameType}-${taskId}，状态: ${status}`);
              return;
            }

            try {
              const result = await send(taskId);

              // 尝试在小窗口对应任务条右侧显示结果
              try {
                const listId =
                  gameType === "sr"
                    ? "scheduleSrTaskList"
                    : gameType === "jql"
                    ? "scheduleJqlTaskList"
                    : "scheduleDnaTaskList";
                const listEl = document.getElementById(listId);
                if (listEl) {
                  const checkbox = listEl.querySelector(
                    `input.schedule-task-checkbox[data-task-id="${taskId}"]`
                  );
                  if (checkbox) {
                    const row = checkbox.closest(".form-check");
                    if (row) {
                      const resultSpan = row.querySelector(
                        ".schedule-task-result"
                      );
                      if (resultSpan) {
                        let text = "";
                        let cls = "text-muted";
                        if (
                          typeof result === "string" &&
                          /^(?:[A-Z0-9]{12})$/.test(result)
                        ) {
                          text = `成功: ${result}`;
                          cls = "text-success";
                        } else if (result && typeof result === "object") {
                          text = result.message || String(result.code || "");
                          if (
                            result.code === 0 ||
                            /^(?:[A-Z0-9]{12})$/.test(text)
                          )
                            cls = "text-success";
                          else if (
                            result.code === 75255 ||
                            /库存已经使用完/.test(text)
                          )
                            cls = "text-danger";
                          else if (
                            result.code === 202032 ||
                            /无资格/.test(text)
                          )
                            cls = "text-warning";
                          else cls = "text-muted";
                        }
                        resultSpan.className = `schedule-task-result ${cls}`;
                        resultSpan.textContent = text;

                        // 保存结果到任务对象中
                        task.lastResult = text;
                        task.lastResultTime = new Date().toLocaleTimeString();

                        // 如果小窗口是打开的，实时更新显示
                        const scheduleModal =
                          document.getElementById("scheduleModal");
                        if (
                          scheduleModal &&
                          scheduleModal.classList.contains("show")
                        ) {
                          const listId =
                            gameType === "sr"
                              ? "scheduleSrTaskList"
                              : gameType === "jql"
                              ? "scheduleJqlTaskList"
                              : "scheduleDnaTaskList";
                          const listEl = document.getElementById(listId);
                          if (listEl) {
                            const resultSpan = listEl.querySelector(
                              `.schedule-task-result[data-task-id="${taskId}"]`
                            );
                            if (resultSpan) {
                              resultSpan.className = `schedule-task-result ${cls}`;
                              resultSpan.textContent = text;
                              if (task.lastResultTime) {
                                resultSpan.title = `最后更新: ${task.lastResultTime}`;
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              } catch (_) {}

              // 处理返回结果，更新任务状态
              if (result && typeof result === "object") {
                if (
                  result.code === 0 &&
                  result.message &&
                  result.message.match(/^[A-Z0-9]{12}$/)
                ) {
                  // 成功获取兑换码
                  console.log(
                    `定时任务成功: ${gameType}-${taskId} - ${result.message}`
                  );
                  addAlertTip(
                    "定时任务成功",
                    `${gameType}-${taskId}: ${result.message}`,
                    3000
                  );
                  task.status = "completed"; // 标记为已完成
                } else if (
                  result.code === 202031 ||
                  result.message === "任务奖励已经领取"
                ) {
                  // 已领取
                  console.log(`任务已领取: ${gameType}-${taskId}`);
                  task.status = "completed";
                } else if (
                  result.code === 75255 ||
                  result.message === "库存已经使用完"
                ) {
                  // 无库存
                  console.log(`任务无库存: ${gameType}-${taskId}`);
                  task.status = "no_stock";
                } else if (
                  result.code === 202032 ||
                  result.message === "无资格领取奖励"
                ) {
                  // 无资格
                  console.log(`任务无资格: ${gameType}-${taskId}`);
                  if (skipNoQualification) {
                    task.status = "no_qualification"; // 标记为无资格，后续跳过
                  }
                } else if (
                  result.code === 202033 ||
                  result.message === "任务活动过期"
                ) {
                  // 活动过期
                  console.log(`任务活动过期: ${gameType}-${taskId}`);
                  task.status = "completed";
                } else if (
                  result.code === 202030 ||
                  result.message === "任务奖励类型错误"
                ) {
                  // 奖励类型错误
                  console.log(`任务奖励类型错误: ${gameType}-${taskId}`);
                  task.status = "completed";
                }
              } else if (
                typeof result === "string" &&
                result.match(/^[A-Z0-9]{12}$/)
              ) {
                // 直接返回兑换码的情况
                console.log(`定时任务成功: ${gameType}-${taskId} - ${result}`);
                addAlertTip(
                  "定时任务成功",
                  `${gameType}-${taskId}: ${result}`,
                  3000
                );
                task.status = "completed";
              }
            } catch (error) {
              console.error(`定时任务失败: ${gameType}-${taskId}`, error);
            }
          });

          // 等待所有任务完成
          await Promise.all(promises);
        }, adjustedDelay);
      } catch (error) {
        console.error("执行所有任务失败:", error);
      }
    }

    // 页面加载时初始化定时设置
    loadScheduleConfig();
    if (scheduleConfig.enabled) {
      setupScheduleTimer();
    }

    // 添加定时设置模态框到页面
    let scheduleModalHtml = `
    <div class="modal fade protected" id="scheduleModal" tabindex="-1" aria-labelledby="scheduleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="scheduleModalLabel">
              <i class="bi bi-clock"></i> 定时抢码设置
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row mb-3">
              <div class="col-12">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="scheduleEnableSwitch">
                  <label class="form-check-label" for="scheduleEnableSwitch">
                    <strong>启用定时抢码</strong>
                  </label>
                </div>
                <small class="text-muted">启用后将在指定时间自动执行抢码任务</small>
              </div>
            </div>
            
            <div id="scheduleSettings" class="d-none">
              <div class="row mb-3">
                <div class="col-12">
                  <label class="form-label">执行时间</label>
                  <div class="input-group">
                    <input type="time" class="form-control" id="scheduleTime" value="00:00:01">
                    <span class="input-group-text">每天</span>
                  </div>
                  <small class="text-muted">设置每天的执行时间，建议设置为00:00:01</small>
                </div>
              </div>
              
                                <div class="row mb-3">
                    <div class="col-6">
                      <label class="form-label">网络平均延迟 (毫秒)</label>
                      <input type="number" class="form-control" id="scheduleNetworkDelay" value="500" min="0" max="5000">
                      <small class="text-muted">系统测得的平均网络延迟，作为参考/建议值</small>
                    </div>
                    <div class="col-6">
                      <label class="form-label">任务间隔延迟 (毫秒)</label>
                      <input type="number" class="form-control" id="scheduleTaskInterval" value="500" min="0" max="10000">
                      <small class="text-muted">定时抢码在目标时间附近会连续重复发送请求；此参数用于控制每两次重复请求之间的间隔时间。</small>
                    </div>
                  </div>
                  
                  <div class="row mb-3">
                    <div class="col-12">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="scheduleSkipNoQualification">
                        <label class="form-check-label" for="scheduleSkipNoQualification">
                          <strong>跳过无资格任务</strong>
                        </label>
                      </div>
                      <small class="text-muted">启用后，遇到"无资格领取奖励"的任务将不再重复尝试</small>
                    </div>
                  </div>
              
              <div class="row mb-3">
                <div class="col-12">
                  <label class="form-label">取消勾选任务将从定时抢码列表中移除该任务</label>
                  
                  <!-- 星穹铁道任务列表 -->
                  <div class="mb-3">
                    <h6 class="text-primary">
                      <i class="bi bi-star"></i> 星穹铁道任务
                    </h6>
                    <div id="scheduleSrTaskList" class="border rounded p-2" style="max-height: 200px; overflow-y: auto;">
                      <div class="text-muted text-center py-3">暂无已选择的星穹铁道任务</div>
                    </div>
                  </div>
                  
                  <!-- 绝区零任务列表 -->
                  <div class="mb-3">
                    <h6 class="text-success">
                      <i class="bi bi-lightning"></i> 绝区零任务
                    </h6>
                    <div id="scheduleJqlTaskList" class="border rounded p-2" style="max-height: 200px; overflow-y: auto;">
                      <div class="text-muted text-center py-3">暂无已选择的绝区零任务</div>
                    </div>
                  </div>
                  
                  <!-- 二重螺旋任务列表 -->
                  <div class="mb-3">
                    <h6 class="text-danger">
                      <i class="bi bi-dna"></i> 二重螺旋任务
                    </h6>
                    <div id="scheduleDnaTaskList" class="border rounded p-2" style="max-height: 200px; overflow-y: auto;">
                      <div class="text-muted text-center py-3">暂无已选择的二重螺旋任务</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="row mb-3">
                <div class="col-12">
                  <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i>
                    <strong>定时任务说明：</strong><br>
                    • 系统会在每天指定时间自动执行抢码任务<br>
                    • 建议设置提前5秒，确保覆盖每日任务刷新时间<br>
                    • 不建议过多添加任务，避免请求过快,保证单ip每秒请求少于4次<br>
                    • 可以通过延迟时间由脚本自动计算,用于调整抢码时机
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" id="saveScheduleSettings">保存设置</button>
          </div>
        </div>
      </div>
    </div>`;

    document.body.insertAdjacentHTML("beforeend", scheduleModalHtml);
  }

  windowOnload();
  // 定时抢码功能已移除，仅保留"获取每日任务进度"相关功能
})();
//添加卡片删除功能//
//添加定时任务//
//添加卡片重复检测,直接在原卡片上刷新//
//添加卡片刷新功能//
//显示执行次数card-text-report,抢码时更改按钮显示,增加反馈量
//添加修改定时任务功能//
//1.1.1
//修复点击过的卡片显示无资格问题//
//增加图片点击打开链接//
//1.1.2
//修复成功抢到后按钮显示错误问题//
//1.1.3
//修复任务活动过期状态监测//
//1.1.4
//修复0点抢码时使用旧数据0库存无法抢码问题//直接取消0库存跳过规则
//修复1点卡点完成任务时,因为使用旧数据导致无法抢码问题//直接取消无资格跳过规则
//1.1.5
//对获得的数据添加获取时间,若数据不是新的(非任务开始时之后获取的),则计划任务检测时跳过//
//在每小时的第1秒更新apiData数据//
//所有获取数据操作都使用队列任务//
//使用刷新键后会叠加多个addEventListener//
//展示cdkey在检测判断是否跳过时执行//
//1.2.0
//增加网络延时检测并优化抢码时机//
//修复执行完毕但是显示正在抢码问题//
//1.2.1
//移除定时任务开始时立即进行的数据刷新//因为会导致脚本马上结束
//1.2.2
//增加自定义是否跳过资格检测等//
//1.3.0
//官方更新接口,无w_rid和wts信息将拦截,增加w_rid和wts信息获取//错误信息{"code":-351,"message":"受到神秘力量干扰，请稍后再试！","ttl":1}
//1.3.1
//修复执行完毕但是显示错误的问题//
//修复设置幸运数字导致无法抢码的问题//
//1.3.1.1
//崩坏更新新版本
//1.4.0.1
//绝区零更新新版本
//1.4.0.2
//崩坏更新新版本
//1.4.0.3
//修改bootstrap的cdn链接
//1.4.0.4
//崩坏星穹铁道任务列表更新：
//- 添加每日任务（开播、礼物、弹幕、观看）
//- 添加上下半期投稿任务
//- 添加限时开播任务
//- 添加新人限定任务
//- 更新舰长任务
//1.4.1.0
//增加自定义任务输入功能：
//- 支持直接输入task_id
//- 支持输入完整URL
//- 优化错误提示
//1.4.2.0
//绝区零任务列表更新：
//- 更新每日任务（开播、牛哇牛哇、弹幕、观看）
//- 更新里程碑任务
//- 更新舰长任务
//- 更新投稿任务
//增加一键添加每日任务功能：
//- 自动识别所有每日任务
//- 使用队列避免请求过快
//- 完成时显示提示
//1.4.3.0
//优化总体界面
//增加兑换码管理页面
//- 兑换码管理页面的全面优化
//1.4.3.1
//修复兑换码页面频繁刷新问题
//纠正兑换码列表筛选功能
//1.4.4.0
//优化卡片响应式布局：
//- 根据屏幕尺寸自动调整每行卡片数量
//- 优化卡片内部布局和间距
//- 添加文本溢出处理和提示
//- 改进按钮和图标的对齐方式
//优化CSRF token获取机制：
//- 添加页面可见性变化时自动更新
//- 添加定期检查更新(5分钟)
//- 更新时添加用户通知
//修复问题：
//- 修复点击按钮导致页面跳转的问题
//- 改进卡片关闭和刷新按钮的布局
//1.4.4.1
//优化任务卡片
//1.4.4.2
//- 崩坏星穹铁道更新新版本
//1.4.4.3
//- 绝区零更新新版本
//1.4.4.4
//绝区零牛蛙牛蛙任务显示错误修复
//1.4.4.5
//崩坏：星穹铁道3.2创作者激励计划
//1.4.4.6
//绝区零1.7更新
//1.4.4.7
//绝区零1.7更新补充
//1.4.4.8
//绝区零+崩铁版本更新
//1.4.5.0
//官方api更换,同步更新
//1.4.5.1
//星穹铁道更新
//1.4.6.0
//添加每日任务进度显示
//1.4.7.0
//添加所有任务进度显示
//1.4.7.1
//绝区零更新
//1.4.8.0
//重大功能更新：添加完整的定时抢码系统
//- 将动态任务按钮改为定时设置按钮，提供完整的定时抢码功能
//- 添加美观的定时设置模态框，支持时间、延迟、任务间隔等参数配置
//- 支持星穹铁道和绝区零任务的选择性执行，用户可自由选择需要定时抢码的任务
//- 智能任务状态管理：自动跳过已完成、无库存、无资格的任务，避免无效请求
//- 实时结果显示：在小窗口中实时显示任务执行结果和历史记录
//- 本地存储持久化：设置和任务选择保存到本地存储，页面刷新后自动恢复
//- 优化用户体验：保存设置后小窗口保持打开，显示任务名称而非ID，提供友好的操作界面
//- 性能优化：使用全局任务缓存，避免重复API调用，提升响应速度
//- 智能循环控制：当所有任务处理完毕时自动停止循环，避免资源浪费
//- 完整的错误处理和用户反馈机制
//1.4.8.1
//绝区零更新
//1.4.9.0
//添加对二重螺旋的支持
//星穹铁道更新3.7
//绝区零2.3更新
//1.4.9.1
//游戏版本更新
