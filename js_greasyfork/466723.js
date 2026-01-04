// ==UserScript==
// @name         自定义网页字体
// @namespace    https://greasyfork.org/
// @version      0.1
// @description  将任意网页的字体更换为自定义字体——微软雅黑、苹方、新宋体，全局默认为苹方字体
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466723/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/466723/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==
(function () {
  "use strict";

  // 定义一个函数来更换字体
  function changeFont(fontName) {
    // 在文档头部添加一个样式元素
    GM_addStyle(`* {font-family: '${fontName}' !important;}`);
  }

  // 定义一个函数来添加当前网页到储存列表
  function addPage(fontName) {
    // 获取当前网页的域名
    var domain = window.location.hostname;
    // 获取储存列表，如果不存在则创建一个空对象
    var list = GM_getValue("lists") || {};
    // 将当前域名作为键，值为字体名，添加到储存列表中
    list[domain] = fontName;
    // 将储存列表保存到油猴插件中
    GM_setValue("lists", list);
    // 提示用户已经添加成功，并更换字体
    alert(`已将当前网页添加到${fontName}字体列表`);
    changeFont(fontName);
  }

  // 定义一个函数来剔除当前网页从储存列表
  function removePage() {
    // 获取当前网页的域名
    var domain = window.location.hostname;
    // 获取储存列表，如果不存在则创建一个空对象
    var list = GM_getValue("lists") || {};
    // 如果当前域名在储存列表中，则删除它，并保存储存列表
    if (list[domain]) {
      delete list[domain];
      GM_setValue("lists", list);
      // 提示用户已经剔除成功，并刷新页面
      alert("已将当前网页从自定义字体列表中剔除");
      window.location.reload();
    } else {
      // 提示用户当前网页不在储存列表中，无需剔除
      alert("当前网页不在自定义字体列表中，无需剔除");
    }
  }

  // 注册一个菜单命令来触发这个函数，更换字体
  GM_registerMenuCommand("更换字体为微软雅黑", () => changeFont("Microsoft YaHei"), "W");
  GM_registerMenuCommand("更换字体为苹方", () => changeFont("PingFang SC"), "P");
  GM_registerMenuCommand("更换字体为新宋体", () => changeFont("NSimSun"), "N");
  // 注册一个菜单命令来触发这个函数，添加当前网页到储存列表
  GM_registerMenuCommand("添加当前网页到自定义字体列表", () => addPage("PingFang SC"), "A");
  // 注册一个菜单命令来触发这个函数，从储存列表剔除当前网页
  GM_registerMenuCommand("从自定义字体列表剔除当前网页", removePage, "R");

  // 检查当前网页是否在储存列表中，如果是则自动更换字体为对应的字体
  var domain = window.location.hostname;
  // 获取储存列表，如果不存在则创建一个空对象
  var list = GM_getValue("lists") || {};
  if (list[domain]) {
    changeFont(list[domain]);
  }
})();