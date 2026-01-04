// ==UserScript==
// @name         MJU一键教师评价
// @namespace    http://shenhaisu.cc:6541/
// @version      1.2
// @description  进入评价页面按钮后自动填写满分
// @author       ShenHaiSu_KimSama
// @match        http://183.250.189.53/jwglxt/xspjgl/xspj_cxXspjIndex.html?doType=*&gnmkdm=*&layout=*&su=*
// @match        http://jwgl.mju.edu.cn/jwglxt/xspjgl/xspj_cxXspjIndex.html?doType=*&gnmkdm=*&layout=*&su=*
// @grant        none
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/458229/MJU%E4%B8%80%E9%94%AE%E6%95%99%E5%B8%88%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/458229/MJU%E4%B8%80%E9%94%AE%E6%95%99%E5%B8%88%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(function () {
  let newNode = document.createElement("button");
  newNode.innerText = "一键满分";

  newNode.addEventListener("click", () => {
    console.log("点击事件");
    // 自动填写
    document
      .querySelectorAll("input.form-control.input-sm.input-pjf")
      .forEach((item) => (item.value = 100));
  });

  addButton(newNode);
})();

function addButton(newNode) {
  let targetNode = Array.prototype.find.call(
    document.querySelectorAll("div.panel-heading"),
    (item) => {
      if (item.innerText === "评价内容") return item;
    }
  );
  targetNode.appendChild(newNode);
}
