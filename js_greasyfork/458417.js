// ==UserScript==
// @name         云盘资源网-优化小助手
// @namespace    http://shenhaisu.cc/
// @version      1.2.2
// @description  删除额外不重要的文本，一键回复，直链跳转
// @author       ShenHaiSu_KimSama
// @match        https://www.yunpanziyuan.com/thread-*.htm
// @match        https://www.yunpanziyuan.xyz/thread-*.htm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yunpanziyuan.com
// @grant        none
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/458417/%E4%BA%91%E7%9B%98%E8%B5%84%E6%BA%90%E7%BD%91-%E4%BC%98%E5%8C%96%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/458417/%E4%BA%91%E7%9B%98%E8%B5%84%E6%BA%90%E7%BD%91-%E4%BC%98%E5%8C%96%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  // Create Display Box
  let displayParent = document.querySelector(
    ".col-lg-3.d-none.d-lg-block.aside"
  );
  let displayNode = document.createElement("div");
  let displayHeader = document.createElement("div");
  let displayBody = document.createElement("div");
  let displayMsgList = document.createElement("ul");
  displayHeader.className = "card-header text-bold";
  displayHeader.innerText = "小助手";
  displayNode.appendChild(displayHeader);
  displayBody.className = "card-body small";
  displayBody.style.padding = "0.5rem";
  displayNode.appendChild(displayBody);
  displayMsgList.className = "site-list-ul";
  displayBody.appendChild(displayMsgList);
  displayNode.className = "card";
  displayParent.prepend(displayNode);

  // Tool Functions
  let addMsg = (message) => {
    let newNode = document.createElement("li");
    newNode.innerHTML = `<span>${message}</span>`;
    displayMsgList.appendChild(newNode);
  };

  // One click reply
  let replyNode = document.createElement("a");
  replyNode.setAttribute("role", "button");
  replyNode.className = "btn btn-primary btn-block mb-3";
  replyNode.style.color = "#fff";
  replyNode.innerText = "一 键 回 复";
  displayBody.prepend(replyNode);
  replyNode.addEventListener("click", () => {
    document.querySelector("#div1_xiuno_top").children[1].click();
    document.querySelector("#submit").click();
  });

  // Delete unnecessary text
  document
    .querySelectorAll("div.message.break-all a[class]")
    .forEach((item) => {
      if (item.className === "post_reply") return;
      item.remove();
    });
  addMsg("已删除不必要文字");

  // Direct link jump
  document
    .querySelectorAll(`
      div.alert.alert-success>span.thread_links,
      div.alert.alert-success>span[style],
      div.alert.alert-success>p>span.thread_links,
      div.alert.alert-success>p>span[style]
    `)
    .forEach((item) => {
      item.querySelector("a[href]").href =
        item.querySelector("span.thread_links").innerText;
    });
  addMsg("已改为直链跳转");
})();
