// ==UserScript==
// @name         百度搜索结果屏蔽诡异的网站
// @namespace    修宁
// @version      20220524
// @license      MIT
// @description  csdn让我不爽很久了,尤其是是它的博客会导致不能用鼠标关闭网页,那我干脆就屏蔽你
// @author       修宁
// @match        https://www.baidu.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/445455/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%B1%8F%E8%94%BD%E8%AF%A1%E5%BC%82%E7%9A%84%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/445455/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%B1%8F%E8%94%BD%E8%AF%A1%E5%BC%82%E7%9A%84%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==
function HideSearchedItems() {
  let Elements = document.querySelectorAll(".result .c-container");
  Elements.forEach(function (Item) {
    let Content = Item.querySelector(".c-color-gray").innerText;
    if (GM_getValue("menu_GAEEScript_tc_CSDN") && Content.indexOf("CSDN") >= 0) {
      Item.style.display = "none";
    }
    if (GM_getValue("menu_GAEEScript_tc_zzk") && Content.indexOf("51zbz") >= 0) {
      Item.style.display = "none";
    }
    if (GM_getValue("menu_GAEEScript_tc_51zbz") && Content.indexOf("走看看") >= 0) {
      Item.style.display = "none";
    }
  });
}

Script_setting();
document.onreadystatechange = () => (document.readyState === 'complete') && HideSearchedItems()

function Script_setting() {
  let menu_list = [
    ['menu_GAEEScript_tc_CSDN', 'CSDN', '过滤CSDN', true],
    ['menu_GAEEScript_tc_zzk', 'zzk', '过滤走看看', true],
    ['menu_GAEEScript_tc_51zbz', '51zbz', '过滤我要找标准', true],
  ], menu_ID = [];

  for (let i = 0; i < menu_list.length; i++) {
    if (GM_getValue(menu_list[i][0]) == null) {
      GM_setValue(menu_list[i][0], menu_list[i][3])
    }
  }
  registerMenuCommand();

  // 注册脚本菜单
  function registerMenuCommand() {
    if (menu_ID.length > menu_list.length) { // 如果菜单ID数组多于菜单数组，说明不是首次添加菜单，需要卸载所有脚本菜单
      for (let i = 0; i < menu_ID.length; i++) {
        GM_unregisterMenuCommand(menu_ID[i]);
      }
    }
    for (let i = 0; i < menu_list.length; i++) { // 循环注册脚本菜单
      menu_list[i][3] = GM_getValue(menu_list[i][0]);
      menu_ID[i] = GM_registerMenuCommand(`${menu_list[i][3] ? '✅' : '❎'} ${menu_list[i][2]}`, () => {
        menu_switch(`${menu_list[i][0]}`, `${menu_list[i][1]}`, `${menu_list[i][2]}`, `${menu_list[i][3]}`)
      });
    }
  }

  //切换选项
  function menu_switch(name, ename, cname, value) {
    if (value == 'false') {
      GM_setValue(`${name}`, true);
      registerMenuCommand(); // 重新注册脚本菜单
      location.reload(); // 刷新网页
      GM_notification({text: `「${cname}」已开启\n`, timeout: 3500}); // 提示消息
    } else {
      GM_setValue(`${name}`, false);
      registerMenuCommand(); // 重新注册脚本菜单
      location.reload(); // 刷新网页
      GM_notification({text: `「${cname}」已关闭\n`, timeout: 3500}); // 提示消息
    }
    registerMenuCommand(); // 重新注册脚本菜单
  }
}