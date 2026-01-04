// ==UserScript==
// @name          下载5弹幕网站中动漫的弹幕
// @namespace     https://greasyfork.org/zh-CN/users/1196880-ling2ling4
// @version       1.0
// @author        Ling2Ling4
// @description   下载5弹幕网站中动漫的弹幕, 若失效可自行调用 document.saveDm 方法, 传入请求到的弹幕数据的数组即可, 可传入多个
// @license       AGPL-3.0-or-later
// @icon data:image/png;base64,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
// @match         *://*.5dm.link/*
// @run-at        document-end
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @compatible    chrome
// @compatible    edge
// @compatible    firefox
// @downloadURL https://update.greasyfork.org/scripts/482309/%E4%B8%8B%E8%BD%BD5%E5%BC%B9%E5%B9%95%E7%BD%91%E7%AB%99%E4%B8%AD%E5%8A%A8%E6%BC%AB%E7%9A%84%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/482309/%E4%B8%8B%E8%BD%BD5%E5%BC%B9%E5%B9%95%E7%BD%91%E7%AB%99%E4%B8%AD%E5%8A%A8%E6%BC%AB%E7%9A%84%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function () {
  /**
   * 下载5弹幕网站中动漫的弹幕
   * @param {*} dmArr 弹幕的数组, 若有多个弹幕数组可以依次传入 (网站请求的数据中的弹幕数组)
   * @param {*} info 对象, 最后一个参数, 导出文件的信息
   * @param {*} info.delArr 需要删除的弹幕的数组, 如果其中一项是对象, 则其中的value属性表示含有value则删除该弹幕, reg属性表示正则表达式 匹配则删除
   * @param {*} info.data 导出数据, 可以是对象
   * @param {*} info.fileName ["outData"] 导出名
   * @param {*} info.type ["json"] 导出格式, 若不为json, 则按照文本格式导出
   * @param {*} info.isFormat [false] 是否格式化导出, 格式化导出的数据导入时可能解析JSON.parse失败
   * @param {*} info.space [2] 格式化导出时的缩进
   * @param {*} info.isDoubleOut [true] 格式化导出时是否再进行一次默认导出
   * @param {*} info.addText ["-格式化"] 格式化导出时末尾的附加文本
   */
  function saveDm(dmArr, info = {}) {
    /**
     * 将时间格式化显示
     * @param {*} time 秒数
     * @param {*} param1.delimiter [:] 分隔符
     * @param {*} param1.isAlign [true] 空缺位置是否添0, 是否整齐化
     * @returns
     */
    function formatTime(time, { delimiter = ":", isAlign = true } = {}) {
      if (time === 0 || time === "0") {
        return "00:00";
      }
      if (!time) {
        return -1;
      }
      let h = Math.floor(time / 60 / 60);
      let m = Math.floor((time / 60) % 60);
      let s = Math.ceil(time % 60);
      if (isAlign) {
        h = h ? h.toString().padStart(2, "0") : "";
        m = m.toString().padStart(2, "0");
        s = s.toString().padStart(2, "0");
      }
      if (h) {
        return h + delimiter + m + delimiter + s;
      } else {
        return m + delimiter + s;
      }
    }
    /**
     * 下载json文件
     * @param {*} info
     * @param {*} info.data 导出数据, 可以是对象
     * @param {*} info.fileName ["outData"] 导出名
     * @param {*} info.type ["json"] 导出格式, 若不为json, 则按照文本格式导出
     * @param {*} info.isFormat [false] 是否格式化导出, 格式化导出的数据导入时可能解析JSON.parse失败
     * @param {*} info.space [2] 格式化导出时的缩进
     * @param {*} info.isDoubleOut [true] 格式化导出时是否再进行一次默认导出
     * @param {*} info.addText ["-格式化"] 格式化导出时末尾的附加文本
     */
    function saveJson({
      data = "",
      fileName = "outData",
      type = "json",
      isFormat = false,
      space = 2,
      isDoubleOut = true,
      addText = "-格式化",
    } = {}) {
      if (typeof data !== "string" && type === "json") {
        if (isFormat) {
          if (isDoubleOut) {
            saveJson({
              data,
              fileName,
              type,
              isFormat: false,
              space,
              isDoubleOut: false,
            }); // 默认导出一次
          }
          fileName += addText;
          data = JSON.stringify(data, null, space);
        } else {
          data = JSON.stringify(data);
        }
      }
      //指定类型文件类型application/json;charset=utf-8
      const typeObj =
        type === "json" ? { type: "application/json" } : { type: "text/plain" };
      const blob = new Blob([data], typeObj);
      const href = URL.createObjectURL(blob);
      const alink = document.createElement("a");
      alink.style.display = "none";
      fileName += "." + type;
      alink.download = fileName; // 下载后文件名
      alink.href = href;
      document.body.appendChild(alink);
      alink.click();
      document.body.removeChild(alink); // 下载完成移除元素
      URL.revokeObjectURL(href); // 释放掉blob对象
    }
    function getDmArr(arr) {
      let out = [];
      // 去空项
      arr.forEach((i) => {
        if (i.length >= 5) out.push(i);
      });
      // 重组
      out = out.map((i) => {
        if (i.length === 5) {
          return {
            time: formatTime(+i[0]),
            value: i[4],
            s: i[0],
            color: i[2],
            type: i[1],
          };
        } else {
          return {
            time: formatTime(+i[0]), // 弹幕发送的视频的时间, xx:xx
            value: i[4], // 弹幕值
            s: i[0], // 弹幕发送的视频秒数
            color: i[2], // 弹幕颜色
            type: i[1], // 弹幕类型, top, right
            date: i[6], // 发送日期
            size: i[7], // 弹幕的字体大小, 含px
          };
        }
      });
      // 排序
      out = out.sort((a, b) => a.s - b.s);
      return out;
    }
    function delDm(arr, delArr) {
      arr.forEach((item, index) => {
        if (item.value) {
          delArr.forEach((i) => {
            if (typeof i === "string") {
              if (item.value === i) {
                arr.splice(index, 1);
              }
            } else {
              if (i.value && item.value.includes(i.value)) {
                arr.splice(index, 1);
              }
              if (i.reg && i.reg.test(item.value)) {
                arr.splice(index, 1);
              }
            }
          });
        } else {
          arr.splice(index, 1);
        }
      });
      return arr;
    }
    let baseName = "弹幕数据";
    let outName = "";
    const title = document.querySelector("h1");
    const curLink = document.querySelector("a.current-link");
    let delArr = info.delArr;
    if (!delArr) {
      delArr = [
        "文明追番，请勿剧透！",
        {
          value: "烂烂烂",
          // reg: /./
        },
      ];
    }
    let outArr = dmArr;
    if (arguments.length >= 2) {
      outArr = [];
      let isInfo = false;
      const endItem = arguments[arguments.length - 1];
      if (!Array.isArray(endItem) && typeof endItem === "object") {
        console.log("存在输出文件的配置信息");
        isInfo = true;
        info = endItem;
      } else {
        info = {};
      }
      const len = isInfo ? arguments.length - 1 : arguments.length;
      for (let i = 0; i < len; i++) {
        outArr = outArr.concat(arguments[i]);
      }
    }
    if (title) {
      outName = title.innerText.trim();
      if (curLink) {
        outName = outName + " " + curLink.innerText.trim();
      }
      outName = outName + `-${baseName}`;
    } else {
      if (curLink) {
        outName = outName + curLink.innerText.trim() + `-${baseName}`;
      } else {
        outName = baseName;
      }
    }
    if (info.isFormat === undefined) {
      info.isFormat = true;
    }
    if (info.fileName === undefined) {
      info.fileName = outName;
    }
    if (info.addText === undefined) {
      info.addText = "";
    }
    outArr = getDmArr(outArr);
    info.data = delDm(outArr, delArr);
    console.log(info);
    info.isDoubleOut = false;
    console.log(info.data);
    saveJson(info); // 标准导出文件
    const outObj = {};
    info.data.forEach((i) => {
      outObj[i.time] = i.value;
    });
    info.data = outObj;
    info.fileName = info.fileName.replace("弹幕数据", "弹幕基础数据");
    console.log(info.data);
    saveJson(info); // 仅用于观看的导出文件
  }
  document.saveDm = saveDm;

  async function request(url, options = {}) {
    options.method = options.method || "GET"; // 默认使用get方法
    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return await res.json();
    } catch (e) {
      throw e;
      // console.log(e);
    }
  }

  function downloadDm() {
    const iframe = document.querySelector("#player #player-embed iframe");
    if (!iframe) return;
    const arr = iframe.src.split("&");
    const item = arr.find((i) => i.includes("cid="));
    if (!item) {
      console.log("视频id获取失败");
      return;
    }
    const cid = item.replace("cid=", "");
    request("https://www.5dm.link/player/nxml.php?id=" + cid).then((data) => {
      if (data.data) {
        saveDm(data.data);
      }
    });
  }

  GM_registerMenuCommand("下载弹幕", () => {
    downloadDm();
  });
})();
