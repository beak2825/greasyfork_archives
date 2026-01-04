// ==UserScript==
// @name         translateSubTitle
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  视频字幕翻译插件, 目前支持: frontendMasters
// @author       You
// @match        https://frontendmasters.com/courses/*
// @run-at       document-end

// @homepageURL  https://github.com/truejiang/frontendMasterTranslate/master/README.md
// @supportURL   https://github.com/truejiang/frontendMasterTranslate/issues

// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/crypto-js/4.0.0/crypto-js.js

// @downloadURL https://update.greasyfork.org/scripts/483512/translateSubTitle.user.js
// @updateURL https://update.greasyfork.org/scripts/483512/translateSubTitle.meta.js
// ==/UserScript==

// 给视频加字幕
function addToVedio() {
  // 选择包含所有 .line 元素的父 DIV
  const textDiv = document.querySelector(
    ".FMPlayerLessonSummary .FMPlayerScrolling .text"
  );
  // 视频div
  const FMPlayerVideo = document.querySelector(".FMPlayerVideo");
  // 课程summary
  const FMPlayerLessonSummaryDiv = document.querySelector(
    ".FMPlayerLessonSummary.FMPlayerContentTray.FMPlayerComponent"
  );
  FMPlayerLessonSummaryDiv.style.maxHeight = "10px";
  FMPlayerVideo.style.position = "relative";
  // 创建一个回调函数来处理观察到的变化
  const callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        const targetElement = mutation.target;
        const isActive = targetElement.classList.contains("active");
        const [enText = "", zhText = ""] =
          targetElement.innerText?.split("---");
        const Subtitle = `<p style="font-size: 24px;">${enText}</p>`;
        const vedioSubtitle = document.getElementById("vedioSubtitle");
        if (!!vedioSubtitle) {
          vedioSubtitle.innerHTML = Subtitle;
        } else {
          const newElement = document.createElement("div");
          newElement.id = "vedioSubtitle";
          newElement.innerHTML = Subtitle;
          newElement.style.position = "absolute";
          newElement.style.bottom = "20px";
          newElement.style.left = "50%";
          newElement.style.transform = "translate(-50%, -50%)";
          newElement.style.color = "white";
          newElement.style.zIndex = "1000"; // 确保元素在视频上方
          newElement.style.background = "rgb(0 0 0 / 46%)";
          newElement.style.borderRadius = "10px";
          newElement.style.padding = "20px";
          newElement.style.width = "600px";
          FMPlayerVideo.appendChild(newElement);
        }
        console.log(
          `Class 'active' ${isActive ? "added to" : "removed from"} element:`,
          targetElement
        );
      }
    }
  };

  // 创建一个新的 MutationObserver 实例，并传入回调函数
  const observer = new MutationObserver(callback);

  // 配置观察者选项:
  const config = {
    attributes: true, // 观察属性变化
    attributeFilter: ["class"], // 过滤观察的属性，这里是 'class'
    subtree: true, // 观察目标节点下的所有子节点
  };

  // 针对 .text 元素的子节点开始观察
  observer.observe(textDiv, config);

  // 以后，当你想停止观察时：
  // observer.disconnect();

  return observer.disconnect;
}

(function () {
  "use strict";
  let lastTxt = "";
  const translate = async () => {
    addToVedio();
    // const arr = Array.from(
    //     document.querySelectorAll(".text .line")
    // );
    // console.log('txt', arr);
    // if(arr) {
    //    for (const titleDiv of arr) {
    //         const txt = titleDiv.innerText;
    //         // baidu(txt, addCH(titleDiv));
    //         await sleep(500);
    //         lastTxt = txt;
    //     }
    // }
  };
  onUrlChange(() => {
    setTimeout(translate, 3000);
  });
})();

async function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

// 监听url变化，用于切换课程
function onUrlChange(callback) {
  // 初始调用一次回调函数，因为初始页面加载时不会触发 popstate 事件
  callback(window.location.href);

  // 监听 popstate 事件，该事件在浏览器历史条目发生变化时触发
  window.addEventListener("popstate", function () {
    // 当 URL 变化时调用回调函数
    callback(window.location.href);
  });

  // 重写 history.pushState 和 history.replaceState 方法以监听通过这些方法的 URL 变化
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function () {
    originalPushState.apply(this, arguments);
    callback(window.location.href);
  };
  history.replaceState = function () {
    originalReplaceState.apply(this, arguments);
    callback(window.location.href);
  };
}

const addCH = (titleDiv) => (txt) => {
  const _t = titleDiv.innerText;
  titleDiv.innerText = _t + "---" + txt;
};

function truncate(q) {
  var len = q.length;
  if (len <= 20) return q;
  return q.substring(0, 10) + len + q.substring(len - 10, len);
}

function baidu(r, callback) {
  var KEY = "你的秘钥"; //
  var appid = "你的appid";
  var salt = 3;
  var q = r;
  var parmas = {
    q,
    from: "en",
    to: "zh",
    appid,
    salt,
    dict: false,
    sign: md5(appid + q + salt + KEY), // 签名算法
  };
  GM_xmlhttpRequest({
    method: "GET",
    url: `http://api.fanyi.baidu.com/api/trans/vip/translate?q=${q}&from=${parmas.from}&to=${parmas.to}&appid=${appid}&salt=${salt}&sign=${parmas.sign}`,
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    onload: function onload(response) {
      // console.warn(response);
      var result = JSON.parse(response.responseText);
      callback(result.trans_result[0].dst); // 执行回调，在回调中拼接
    },
  });
}

function md5(str) {
  var k = [],
    i = 0;

  for (i = 0; i < 64; ) {
    k[i] = 0 | (Math.abs(Math.sin(++i)) * 4294967296);
  }

  var b,
    c,
    d,
    j,
    x = [],
    str2 = unescape(encodeURI(str)),
    a = str2.length,
    h = [(b = 1732584193), (c = -271733879), ~b, ~c];

  for (i = 0; i <= a; ) {
    x[i >> 2] |= (str2.charCodeAt(i) || 128) << (8 * (i++ % 4));
  }

  x[(str = ((a + 8) >> 6) * 16 + 14)] = a * 8;
  i = 0;

  for (; i < str; i += 16) {
    a = h;
    j = 0;

    for (; j < 64; ) {
      a = [
        (d = a[3]),
        (b = a[1] | 0) +
          (((d =
            a[0] +
            [
              (b & (c = a[2])) | (~b & d),
              (d & b) | (~d & c),
              b ^ c ^ d,
              c ^ (b | ~d),
            ][(a = j >> 4)] +
            (k[j] + (x[([j, 5 * j + 1, 3 * j + 5, 7 * j][a] % 16) + i] | 0))) <<
            (a = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21][
              4 * a + (j++ % 4)
            ])) |
            (d >>> (32 - a))),
        b,
        c,
      ];
    }

    for (j = 4; j; ) {
      h[--j] = h[j] + a[j];
    }
  }

  str = "";

  for (; j < 32; ) {
    str += ((h[j >> 3] >> ((1 ^ (j++ & 7)) * 4)) & 15).toString(16);
  }

  return str;
}
