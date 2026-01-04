// ==UserScript==
// @name B站爱奇艺优酷腾讯视频起点去除app打开弹窗
// @author  Lemon399
// @description B站爱奇艺优酷腾讯视频起点去除app打开弹窗。
// @version 1.1
// @match *://*.youku.com/*
// @match *://m.iqiyi.com/*
// @match *://m.bilibili.com/*
// @match *://m.qidian.com/*
// @run-at document-start
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/456610/B%E7%AB%99%E7%88%B1%E5%A5%87%E8%89%BA%E4%BC%98%E9%85%B7%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E8%B5%B7%E7%82%B9%E5%8E%BB%E9%99%A4app%E6%89%93%E5%BC%80%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/456610/B%E7%AB%99%E7%88%B1%E5%A5%87%E8%89%BA%E4%BC%98%E9%85%B7%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E8%B5%B7%E7%82%B9%E5%8E%BB%E9%99%A4app%E6%89%93%E5%BC%80%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function () {
  let rules = `
! 没有两个 # 的行和 开头为 ! 的行会忽略
! baidu.com##.ec_wise_ad
! :remove() 会用 js 移除元素，:remove() 必须放在行尾
! baidu.com###ad:remove()
! :click() 会用 js 模拟点击元素，必须放在行尾
! baidu.com###btn:click()
! 上面两个可以带参数，格式
! remove(100, 4, 200)
! 代表 首先延时 100 ms，然后执行 4 次，两次间隔 200 ms
m.bilibili.com##DIV.openapp-mask
m.bilibili.com##DIV.openapp-content
youku.com##DIV.callEnd_box
m.iqiyi.com##DIV.iqyGuide-content
m.iqiyi.com##DIV.cover
m.v.qq.com##DIV.at-app-banner__layer
m.v.qq.com##DIV.at-app-banner__content
m.qidian.com##DIV.y-mask
m.qidian.com##DIV.y-popup__content
  `,
    selarray = [];

  function execOperation(sel, param, click) {
    setTimeout(() => {
      for (let c = parseInt(param[1]); c >= 1; --c) {
        setTimeout(() => {
          document
            .querySelectorAll(sel)
            .forEach((a) => (click ? a.click() : a.remove()));
        }, parseInt(param[2]) * (c - 1));
      }
    }, parseInt(param[0]));
  }
  function pushOperation(sel, op, type) {
    let tempParamArray = ["0", "1", "0"];
    if (sel.split(op)[1].indexOf(",") > 0)
      tempParamArray = sel.split(op)[1].slice(0, -1).split(",");
    selarray.push({
      sel: sel.split(op)[0],
      type: type,
      param: tempParamArray,
    });
  }
  function parseFunc(sel) {
    if (sel.indexOf(":remove(") > 0) {
      pushOperation(sel, ":remove(", 1);
    } else if (sel.indexOf(":click(") > 0) {
      pushOperation(sel, ":click(", 2);
    } else {
      selarray.push({ sel: sel, type: 0 });
    }
  }

  let styelem = document.createElement("style");

  rules.split("\n").forEach((rule) => {
    if (rule.indexOf("!") == 0) {
      return;
    } else if (rule.indexOf("##") > 0) {
      let domains = rule.split("##")[0].split(","),
        selector = rule.split("##")[1];
      domains.forEach((domain) => {
        if (domain.slice(0, 1) == "~") {
          if (location.hostname.indexOf(domain.slice(1)) >= 0) return;
        } else {
          if (location.hostname.indexOf(domain) < 0) return;
        }
        parseFunc(selector);
      });
    } else if (rule.indexOf("##") == 0) parseFunc(rule.slice(2));
  });

  function myfun() {
    document.documentElement.appendChild(styelem);
    let csel = "";
    selarray.forEach((selo) => {
      switch (selo.type) {
        case 0:
          csel += `,${selo.sel}`;
          break;
        case 1:
          execOperation(selo.sel, selo.param, 0);
          break;
        case 2:
          execOperation(selo.sel, selo.param, 1);
          break;
      }
    });
    if (csel.length >= 2)
      styelem.textContent = csel.slice(1) + " {display: none !important;};";
  }
  myfun();
})();