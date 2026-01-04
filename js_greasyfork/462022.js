// ==UserScript==
// @name        中国语文自动刷新
// @namespace   http://tampermonkey.net/
// @version     1.2
// @description 武汉理工大学，每次100分钟左右需要重新登录
// @author      zizhan
// @include     http://59.69.102.9/*
// @grant       none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462022/%E4%B8%AD%E5%9B%BD%E8%AF%AD%E6%96%87%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/462022/%E4%B8%AD%E5%9B%BD%E8%AF%AD%E6%96%87%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

const links = [
  "http://59.69.102.9/zgyw/study/LearningContent.aspx?type=1&id=2&learningid=3106",
  "http://59.69.102.9/zgyw/study/LearningContent.aspx?type=1&id=2&learningid=3108",
  "http://59.69.102.9/zgyw/study/LearningContent.aspx?type=1&id=2&learningid=3109",
  "http://59.69.102.9/zgyw/study/LearningContent.aspx?type=1&id=2&learningid=3113",
  "http://59.69.102.9/zgyw/study/LearningContent.aspx?type=1&id=2&learningid=3100",
  "http://59.69.102.9/zgyw/study/LearningContent.aspx?type=1&id=2&learningid=3098",
  "http://59.69.102.9/zgyw/study/LearningContent.aspx?type=1&id=2&learningid=3093",
  "http://59.69.102.9/zgyw/study/LearningContent.aspx?type=1&id=2&learningid=3110",
  "http://59.69.102.9/zgyw/study/LearningContent.aspx?type=1&id=2&learningid=3094",
  "http://59.69.102.9/zgyw/study/LearningContent.aspx?type=1&id=2&learningid=3104",
  "http://59.69.102.9/zgyw/study/LearningContent.aspx?type=5&id=29&learningid=3057",
  "http://59.69.102.9/zgyw/study/LearningContent.aspx?type=5&id=29&learningid=3058",
  "http://59.69.102.9/zgyw/study/LearningContent.aspx?type=5&id=29&learningid=3056",
  "http://59.69.102.9/zgyw/study/LearningContent.aspx?type=5&id=29&learningid=3055",
  "http://59.69.102.9/zgyw/study/LearningContent.aspx?type=5&id=29&learningid=3045",
  "http://59.69.102.9/zgyw/study/LearningContent.aspx?type=5&id=29&learningid=3046",
  "http://59.69.102.9/zgyw/study/LearningContent.aspx?type=5&id=29&learningid=3047",
  "http://59.69.102.9/zgyw/study/LearningContent.aspx?type=5&id=29&learningid=3048",
  "http://59.69.102.9/zgyw/study/LearningContent.aspx?type=5&id=29&learningid=3049",
  "http://59.69.102.9/zgyw/study/LearningContent.aspx?type=5&id=29&learningid=3050"
];

const visited = new Set();

function getRandomLink() {
  if (visited.size === links.length) {
    visited.clear();
  }
  let link;
  do {
    const randomIndex = Math.floor(Math.random() * links.length);
    link = links[randomIndex];
  } while (visited.has(link));
  visited.add(link);
  return link;
}

function refreshPage() {
  location.reload();
}

function visitRandomLink() {
  const link = getRandomLink();
  console.log("Visiting link:", link);
  window.location.href = link;
  // 如果需要刷新页面，可以使用以下代码：
  // setTimeout(refreshPage, 5000); // 5秒后刷新页面
}

// 每 5 分钟访问一个链接
setInterval(visitRandomLink, 300000);
