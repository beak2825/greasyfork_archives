// ==UserScript==
// @name         嘉兴市第二届青少年网络知识风暴竞赛 全自动答题脚本
// @namespace    myitian.wjx.jx-2nd-tiksc-autoanswer
// @version      1.0
// @description  全自动回答“嘉兴市第二届青少年网络知识风暴竞赛”的题目
// @author       Myitian
// @license      MIT
// @match        https://xxks.cnjxol.com/vm/t9oQQ3R.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454313/%E5%98%89%E5%85%B4%E5%B8%82%E7%AC%AC%E4%BA%8C%E5%B1%8A%E9%9D%92%E5%B0%91%E5%B9%B4%E7%BD%91%E7%BB%9C%E7%9F%A5%E8%AF%86%E9%A3%8E%E6%9A%B4%E7%AB%9E%E8%B5%9B%20%E5%85%A8%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/454313/%E5%98%89%E5%85%B4%E5%B8%82%E7%AC%AC%E4%BA%8C%E5%B1%8A%E9%9D%92%E5%B0%91%E5%B9%B4%E7%BD%91%E7%BB%9C%E7%9F%A5%E8%AF%86%E9%A3%8E%E6%9A%B4%E7%AB%9E%E8%B5%9B%20%E5%85%A8%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

function selectAns(e) {
  var correct = e.getAttribute("ans") != undefined;
  var i = e.querySelector("input");
  var a = e.querySelector("a");
  console.log(e.querySelector("input").checked);
  if (i.checked || a.className.indexOf("jqchecked") != -1) {
    if (!correct) {
      e.click();
      i.checked = false;
      if (a.className.indexOf("jqchecked") != -1) {
        a.className = a.className.substr(0, 7);
      }
    }
  }
  if (!(i.checked && a.className.indexOf("jqchecked") != -1)) {
    if (correct) {
      e.click();
      i.checked = true;
      if (a.className.indexOf("jqchecked") == -1) {
        a.className += " jqchecked";
      }
    }
  }
} // 确保能选中或取消选中，页面JS太烂了，光click可能导致<input>元素被选中，而<a>的jqchecked没加上

function selectAllAns() {
  document.querySelectorAll("fieldset[style=''] div.ui-radio").forEach(selectAns);
  document.querySelectorAll("fieldset[style=''] div.ui-checkbox").forEach(selectAns);
}

function autoSelect() {
  if (!selecting && document.querySelector("fieldset[style=''] div.ui-radio[ans],fieldset[style=''] div.ui-checkbox[ans]")) { // 确保有东西可选
    selecting = true;
    selectAllAns();
    selecting = false;
    setTimeout(nextPage, 10);
  }
}

function nextPage() {
  var submit = document.querySelector("#divSubmit[style='']");
  if (submit) { // 当提交按钮可见时提交
    submit.click();
  } else {
    document.querySelector(".button.mainBgColor").click(); // 下一页
  }
}
var selecting = false;
window.addEventListener("click", autoSelect);
document.body.click()