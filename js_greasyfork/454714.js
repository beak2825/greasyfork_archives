// ==UserScript==
// @name         PatreonExpander-Monthly
// @namespace    https://github.com/frosn0w/iOSscripts
// @version      1.0
// @description  Expand content and comments.
// @author       frosn0w
// @match        *://*.patreon.com/*
// @run-at       document-end
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAA3tJREFUeF7tmj1s00AUx/8vbjdaOy1MMMDCQBlggoEBJMRE2ZqNBSEisdRRO7A1nVhaxSxIRagDYzu2E0KiAwNMdKAMLDDABG3swtamD10hJRjbd44T+YgvY+757r3ffbyPO0LBf1Rw+2EAmBVQcAJmCxR8AZhDUHkLfJ8ZO9c6aN0hxhUGLum4cgh4w4RXVqm1PLL4472KjkoAAteZY3BdpUNdZBg8X/Z2pTpLAXyrjZ8c4v3PuhiWRo99Gjp1vLH9JekbKYDAHW0wyE0zsC6yBPZsb7eWCYDv2m8BXNDFqJR6bDpecDErAE45qFbijhckrnLpFvBd2wDQakpTKtP3FcCg+bLnJ7qbpuucLoGXGLihoj8Bzw9A1bLnf0qSb7qjdQLNJcn0HYBsgLZyvmvfA7CkAgBA1fGCJyqysi0q0y/zGRAeoOk6V8OKE/MJEFZUDDqSYVSY6Gv4m7Lnb3T+px0AoZxfs1fAmEplsEyYsOo0gkpYTBsAYuY7Z6enEELGd46lFQAivt85Sz2BEDJe9MlMj9uw9QIAfokIhbveDjF9MeiavgDEJu0FhIQ+9AcQAaE57awR8U3ZWffrU16zvd1bRy40dKhqBYBBZ0TAEunnO2ax2zgg5hw5jBNEgEXgj7kGQiJqY8bTOD/PTOsEftZNHEDEtxk0GWkgo0KEu7Losu+BkMqSzlPGADDpsKkHmIKIKYklEMicDud5wquMbbyA8QLGC/TXC4jEhUHrsfU+wioYL1LUA9tbuwrC9YRUusrMk0SUmGD1/QxokXV+vLGz5U/bU//E+53JUFR73CnGqDiPgtXY8trv9sMb61ZrK9dkqE1YlKlIFETavyw1Acm3WqXDkQCyGK8AUG8AvTBeAkFfAEUviha6LP7XbU0RL0baACKvxsBnu4kDGPThv7wai/LLkXGCQhwgS3hyvxhRuR7fro1NDPH+w9gCZ8hKAq2VrNKDkcWdxKduTdepEzjf63HZDOXd3vdQOG8DZeMbAFnrAYFrv9b1aaxs9sXTWdsLLmerCdbsBTBmZINp2U5YdBrBbCYA27VjExZb77Q0UKKUZVkTMk8iLYqKMVTcjW6ACFS3PX9eppcSANGJeDQ9zHuzDBKPoHR9OrtJ4I09Gl6QPZL+k3DKEA14u/IKGFQOBsCgzqyqXWYFqJIaVDmzAgZ1ZlXt+gnhrHFfaCYwZQAAAABJRU5ErkJggg==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454714/PatreonExpander-Monthly.user.js
// @updateURL https://update.greasyfork.org/scripts/454714/PatreonExpander-Monthly.meta.js
// ==/UserScript==
var close = 1;
document.querySelector("header").remove();
setInterval(async function () {
  "use strict";
  if (close < 50) {
    var btns = document.querySelectorAll("button");
    var divs = document.querySelectorAll("div");
    var spans = document.querySelectorAll("span");
    var as = document.querySelectorAll("a");
    var navs = document.querySelectorAll("nav");
    var Current = new Date();
    const mm = Current.getMonth() + 1;
    const ydd = Current.getDate() - 1;
    const yd2 = Current.getDate() - 2;
    const yd3 = Current.getDate() - 3;
    const yd4 = Current.getDate() - 4;
    const yd5 = Current.getDate() - 5;
    const dd = Current.getDate();
    //div process
    for (let j = 0; j < divs.length; j++) {
      //remove subnav
      if (
        divs[j].getAttribute("aria-expanded") === "false" &&
        divs[j].innerText.includes("我的会籍")
      ) {
        divs[j].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
      }
      //remove head img
      else if (
        divs[j].getAttribute("data-tag") === "creation-name" &&
        divs[j].innerText.includes("Love & Peace !")
      ) {
        divs[j].parentNode.parentNode.parentNode.parentNode.remove();
      }
      //remove main navigation
      else if (divs[j].getAttribute("id") === "main-app-navigation") {
        divs[j].remove();
      }
      //remove outdated post card - "date" format
      else if (
        divs[j].getAttribute("data-tag") === "post-card" &&
        divs[j].innerText.includes(mm+"月") &&
        divs[j].innerText.split(mm+"月")[0] < mm
      ) {
        divs[j].remove();
      }
      //remove comment-box
      else if (divs[j].getAttribute("data-tag") === "comment-field-box") {
        divs[j].parentNode.parentNode.parentNode.remove();
      }
      //remove deleted row
      else if (
        divs[j].getAttribute("data-tag") === "comment-body" &&
        divs[j].innerText.includes("此留言已被删除。")
      ) {
        divs[j].parentNode.parentNode.remove();
      }
      //remove sort on the top
      else if (
        divs[j].getAttribute("data-tag") === "sort-posts" &&
        divs[j].innerText.includes("最新文章")
      ) {
        divs[j].parentNode.remove();
      }
      //remove filter
      else if (divs[j].getAttribute("data-tag") === "search-input-box") {
        divs[j].parentNode.parentNode.parentNode.remove();
      }
      //remove comment toolbar
      else if (divs[j].getAttribute("data-tag") === "comment-actions") {
        divs[j].remove();
      }
      //boarder the padding
      else if (divs[j].getAttribute("data-tag") === "post-stream-container") {
        divs[j].parentNode.style.setProperty("padding-left", "4px");
        divs[j].parentNode.style.setProperty("padding-right", "4px");
      }
      //continue
      else {
        continue;
      }
    }
    //a process
    for (let v = 0; v < as.length; v++) {
      //format date
      if (
        as[v].innerText.includes(" 小时前") ||
        as[v].innerText.includes(" 分钟前")
      ) {
        const TimeString = mm + "月" + dd + "日";
        as[v].textContent = TimeString;
      }
      else if (as[v].innerText.includes("昨天")) {
        const TimeString1 = mm + "月" + ydd + "日";
        as[v].textContent = TimeString1;
      }
      else if (as[v].innerText.includes("2 天前")) {
        const TimeString1 = mm + "月" + yd2 + "日";
        as[v].textContent = TimeString1;
      }
      else if (as[v].innerText.includes("3 天前")) {
        const TimeString1 = mm + "月" + yd3 + "日";
        as[v].textContent = TimeString1;
      }
      else if (as[v].innerText.includes("4 天前")) {
        const TimeString1 = mm + "月" + yd4 + "日";
        as[v].textContent = TimeString1;
      }
      else if (as[v].innerText.includes("5 天前")) {
        const TimeString1 = mm + "月" + yd5 + "日";
        as[v].textContent = TimeString1;
      }
      //remove avatar
      else if (as[v].getAttribute("data-tag") === "comment-avatar-wrapper") {
        as[v].parentNode.remove();
      }
      //continue
      else {
        continue;
      }
    }
    //btns process
    for (let i = 0; i < btns.length; i++) {
      //remove post toolbar
      if (
        btns[i].getAttribute("aria-label") === "更多操作" &&
        btns[i].getAttribute("data-tag") === "more-actions-button"
      ) {
        btns[i].parentNode.parentNode.parentNode.remove();
      }
      //remove expand
      else if (btns[i].innerText === "收起") {
        btns[i].parentNode.remove();
      }
      //expand content
      else if (btns[i].innerText === "展开") {
        setInterval(async function () {
          btns[i].click();
        }, 2888);
      }
      //click loading comment
      else if (btns[i].innerText === "加载更多留言") {
        setInterval(async function () {
          btns[i].click();
        }, 1688);
      }
      //click loading reply
      else if (btns[i].innerText === "加载回复") {
        setInterval(async function () {
          btns[i].click();
        }, 1888);
      }
      //bold host-name
      else if (btns[i].getAttribute("data-tag") === "commenter-name") {
        if (btns[i].innerText === "贝乐斯 Think Analyze Invest") {
          btns[i].style.color = "rgb(245, 31, 0)";
          btns[i].style.fontWeight = "bold";
        } else {
          btns[i].style.color = "rgb(0, 0, 0)";
          btns[i].style.fontWeight = "bold";
        }
      }
      //continue
      else {
        continue;
      }
    }
    close++;
  }
}, 2888);
