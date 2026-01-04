// ==UserScript==
// @name        步步高资料下载页增加产品分类
// @namespace   Violentmonkey Scripts
// @match       https://download.eebbk.com/index*
// @grant       none
// @version     1.0.1
// @author      antdz
// @description 将步步高下载中心(新版)没有的一些老产品显示出来。
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501032/%E6%AD%A5%E6%AD%A5%E9%AB%98%E8%B5%84%E6%96%99%E4%B8%8B%E8%BD%BD%E9%A1%B5%E5%A2%9E%E5%8A%A0%E4%BA%A7%E5%93%81%E5%88%86%E7%B1%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/501032/%E6%AD%A5%E6%AD%A5%E9%AB%98%E8%B5%84%E6%96%99%E4%B8%8B%E8%BD%BD%E9%A1%B5%E5%A2%9E%E5%8A%A0%E4%BA%A7%E5%93%81%E5%88%86%E7%B1%BB.meta.js
// ==/UserScript==


const xhrOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function () {
  // 这里保存了this到xhr变量，为了提高代码的可读性
  const xhr = this;


  if (arguments[1] == "/api/prod/getProdClasses") {
    console.log(xhr);

    const getter = Object.getOwnPropertyDescriptor(
      XMLHttpRequest.prototype,
      "responseText"
    ).get;


    Object.defineProperty(xhr, "responseText", {
      get: () => {
        let result = getter.call(xhr);
        let j = JSON.parse(result)
        console.log(result);
        const b = [{id: 1, title: '词典1', sn: 4},{id: 2, title: '词典2', sn: 5},{id: 4, title: '学习机', sn: 5},{id: 5, title: '电脑', sn: 5},{id: 6, title: '外语通', sn: 5},{id: 8, title: 'F', sn: 5},{id: 9, title: 'T1', sn: 5}]
        j['data'].push(...b);
        const d = JSON.stringify(j);
        return d;
      },
    });
  }
  return xhrOpen.apply(xhr, arguments);
};