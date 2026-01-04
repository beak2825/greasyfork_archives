// ==UserScript==
// @name        获取gerrit当前页change数
// @namespace   Violentmonkey Scripts
// @match       https://gerrit.pt.mioffice.cn/*
// @grant       none
// @version     1.3
// @author      songjianjun
// @description 2023/7/24 19:48:46
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471594/%E8%8E%B7%E5%8F%96gerrit%E5%BD%93%E5%89%8D%E9%A1%B5change%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/471594/%E8%8E%B7%E5%8F%96gerrit%E5%BD%93%E5%89%8D%E9%A1%B5change%E6%95%B0.meta.js
// ==/UserScript==
Element.prototype._attachShadow = Element.prototype.attachShadow
Element.prototype.attachShadow = function () {
  return this._attachShadow({mode:'open'})
}
const app = document.getElementsByTagName("gr-app")[0];
// console.log(app.shadowRoot.querySelector("#app-element").shadowRoot.querySelector("gr-change-list-view").shadowRoot.querySelector("gr-change-list").shadowRoot.querySelector("#changeList").childNodes[2])
const s =   app.shadowRoot.querySelector("#app-element").
  shadowRoot.querySelector("gr-change-list-view").
  shadowRoot.querySelector("gr-change-list").
  shadowRoot.querySelector("#changeList").
  getElementsByTagName("gr-change-list-section")

setTimeout(function(){
  // console.log(s[0])
  console.log(s[0].shadowRoot.querySelector("tbody").getElementsByTagName("gr-change-list-item").length)
},"500");