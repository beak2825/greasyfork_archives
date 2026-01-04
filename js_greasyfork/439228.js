// ==UserScript==
// @name         微信网页版导出：通讯录、群成员名单、聊天列表
// @namespace    https://userscript.snomiao.com/
// @version      0.2
// @description  rt, 课代表核对名单用，入口藏在头像右边的下拉菜单里，以及群标题下拉的群成员列表的第一项
// @author       snomiao@gmail.com
// @icon         https://res.wx.qq.com/zh_CN/htmledition/v2/images/favicon31e225.ico
// @match        https://wx.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439228/%E5%BE%AE%E4%BF%A1%E7%BD%91%E9%A1%B5%E7%89%88%E5%AF%BC%E5%87%BA%EF%BC%9A%E9%80%9A%E8%AE%AF%E5%BD%95%E3%80%81%E7%BE%A4%E6%88%90%E5%91%98%E5%90%8D%E5%8D%95%E3%80%81%E8%81%8A%E5%A4%A9%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/439228/%E5%BE%AE%E4%BF%A1%E7%BD%91%E9%A1%B5%E7%89%88%E5%AF%BC%E5%87%BA%EF%BC%9A%E9%80%9A%E8%AE%AF%E5%BD%95%E3%80%81%E7%BE%A4%E6%88%90%E5%91%98%E5%90%8D%E5%8D%95%E3%80%81%E8%81%8A%E5%A4%A9%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var 取元素列表 = (e) => [...document.querySelectorAll(e)];
  var 取元素文字 = (e) => e.textContent;
  var 睡 = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  var 直到 = async (ms, fn) => {
    var ret,
      exit = 0;
    setTimeout(() => (exit = 1), ms);
    while (!exit && !(ret = await fn())) await 睡(1);
    return ret;
  };
  var 创建元素 = (html) => {
    var div = document.createElement("div");
    div.innerHTML = html;
    return div.firstChild;
  };
  var 下载文件 = (文件名, 内容) => {
    const a = document.createElement("a");
    a.setAttribute("download", 文件名);
    a.setAttribute("href", 内容);
    a.click();
  };
  var 下载文本文件 = (文件名, 文本) =>
    下载文件(文件名, URL.createObjectURL(new Blob([文本])));
  var 请复制 = (text) => {
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
  };
  var 功能列表 = [
    {
      类型: "群成员",
      名称: "群成员列表",
      选: ".member.ng-scope>p.nickname",
    },
    { 类型: "下拉", 名称: "聊天列表", 选: ".chat_list .nickname_text" },
    { 类型: "下拉", 名称: "通讯录", 选: ".contact_list .nickname" },
  ];
  功能列表.forEach((功能) => {
    功能.按钮标题 = "导出" + 功能.名称 + (功能.备注 || "");
    功能.触发函数 = () => {
      var 导出文本 = [功能.名称]
        .concat(取元素列表(功能.选).map(取元素文字))
        .join("\n");
      // var 文件名 = 功能.名称 + ".csv"
      // 下载文本文件(文件名, 导出文本)
      // console.log(导出文本)
      请复制(导出文本);
    };
  });
  document.addEventListener("click", async () => {
    var 菜单 = await 直到(200, () =>
      document.querySelector("#mmpop_system_menu .dropdown_menu")
    );
    菜单 &&
      功能列表
        .filter((e) => e.类型 == "下拉")
        .reverse()
        .map(({ 按钮标题, 触发函数 }) => {
          if (菜单["功能_" + 按钮标题]) return;
          菜单["功能_" + 按钮标题] = 1;
          var 新元素 = 创建元素(
            `<li><a href="javascript:;" title="${按钮标题}"><i class="menuicon_feedback"></i>${按钮标题}</a></li>`
          );
          新元素.querySelector("a").addEventListener("click", 触发函数);
          菜单.insertBefore(新元素, 菜单.firstChild);
        });

    var 群成员列表 = await 直到(200, () =>
      document.querySelector(".members .members_inner.scroll-content")
    );
    群成员列表 &&
      功能列表
        .filter((e) => e.类型 == "群成员")
        .reverse()
        .map(({ 按钮标题, 触发函数 }) => {
          if (群成员列表["功能_" + 按钮标题]) return;
          群成员列表["功能_" + 按钮标题] = 1;
          var 新元素 = 创建元素(
            `<div class="member opt">` +
              `<i class="web_wechat_add_friends" title="${按钮标题}"></i>` +
              `<p class="nickname ng-binding">${按钮标题}</p></div>`
          );
          新元素.addEventListener("click", 触发函数);
          群成员列表.insertBefore(新元素, 群成员列表.firstChild);
        });
  });
  // Your code here...
})();
