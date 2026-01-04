// ==UserScript==
// @name         flomo > 显示标签下的卡片数量
// @namespace    DanDanZeZi@outlook.com
// @version      1.1
// @description  这个小东西可以让您直观的看到每个标签下的卡片数量。
// @author       丹丹泽子
// @match        https://flomoapp.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436848/flomo%20%3E%20%E6%98%BE%E7%A4%BA%E6%A0%87%E7%AD%BE%E4%B8%8B%E7%9A%84%E5%8D%A1%E7%89%87%E6%95%B0%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/436848/flomo%20%3E%20%E6%98%BE%E7%A4%BA%E6%A0%87%E7%AD%BE%E4%B8%8B%E7%9A%84%E5%8D%A1%E7%89%87%E6%95%B0%E9%87%8F.meta.js
// ==/UserScript==

window.onload = function() {

  // 计算卡片数量
  function calculateCard() {
    const numberOfTag = {};
    const cards = document.querySelectorAll("span.tag")
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const cardTagRaw = card.innerHTML; // #标签/标签
      const cardTagRawRemoveShape = cardTagRaw.substring(1); // 去除“#”号
      const cardTagRawRemovedSlash = cardTagRawRemoveShape.split('/'); // 去除"/”号
      const cardTag = cardTagRawRemovedSlash.pop(); // 去掉父标签，留下自己
      if (cardTag in numberOfTag) {
        numberOfTag[cardTag]++;
      } else {
        numberOfTag[cardTag] = 1;
      }
    }
    return numberOfTag;
  }
  const numberOfTag = calculateCard();

  // 将数量插入页面
  function insertNumberToPage() {
    const a = document.querySelectorAll("i[title='更改图标']");
    for (let i = 0; i < a.length; i++) {
      const tagNode = a[i].parentElement;
      const tagName = tagNode.innerText.split(" ").pop();
      if (tagName in numberOfTag) {
        tagNode.innerHTML += `  +${numberOfTag[tagName]}`
      }
    }
  }
  insertNumberToPage();

}