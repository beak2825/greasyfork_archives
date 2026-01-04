// ==UserScript==
// @name         Side Scroll Wheel Pagination
// @namespace    Hal74
// @version      0.1
// @description  鼠标侧滚轮翻页,支持键盘热键翻页
// @author       Hal74
// @match        *://*/*
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/479345/Side%20Scroll%20Wheel%20Pagination.user.js
// @updateURL https://update.greasyfork.org/scripts/479345/Side%20Scroll%20Wheel%20Pagination.meta.js
// ==/UserScript==

// 热键翻页开关
const needHotKey = false;
// 编辑下面的数组来自定义规则
const specialXpaths = [
  {
      //匹配的url
      urls: ["taobao.com"],
      //上一页节点的xpath
      prev: '//button[contains(@aria-label,"上一页")]',
      //下一页节点的xpath
      next: '//button[contains(@aria-label,"下一页")]',
  },
  // elementUI
  {
      urls: ["localhost"],
      prev: '//button[@class="btn-prev"]',
      next: '//button[@class="btn-next"]',
  },
];

const generalXpaths = [
  ["//a[(text()='", "')]"],
  ["//a[@class='", "']"],
  ["//button[(text()='", "')]"],
  ["//button[@class='", "']"],
  ["//input[@type='button' and @value='", "']"],
];

const Strs = {
  next: [
      "下一页",
      "下页",
      "下一页 »",
      "下一页 &gt;",
      "下一节",
      "下一章",
      "下一篇",
      "后一章",
      "后一篇",
      "后页>",
      "»",
      "next",
      "next page",
      "old",
      "older",
      "earlier",
      "下頁",
      "下一頁",
      "后一页",
      "后一頁",
      "翻下页",
      "翻下頁",
      "后页",
      "后頁",
      "下翻",
      "下一个",
      "下一张",
      "下一幅",
  ],
  prev: [
      "上一页",
      "上页",
      "« 上一页",
      "&lt; 上一页",
      "上一节",
      "上一章",
      "上一篇",
      "前一章",
      "前一篇",
      "<前页",
      "«",
      "previous",
      "prev",
      "previous page",
      "new",
      "newer",
      "later",
      "上頁",
      "上一頁",
      "前一页",
      "前一頁",
      "翻上页",
      "翻上頁",
      "前页",
      "前頁",
      "上翻",
      "上一个",
      "上一张",
      "上一幅",
  ]
}

const keys = {
  prev: [
      'ArrowLeft',
      'a',
  ],
  next: [
      'ArrowRight',
      'd'
  ]
}

function checkTextArea(node) {
  var name = node.localName.toLowerCase();
  if (name === "textarea" || name === "input" || name === "select") {
    return true;
  }
  if (name === "div" && (node.id.toLowerCase().includes("textarea") || node.contentEditable !== 'inherit')) {
    return true;
  }
  return false;
}

function hasHorizontalScrollbar(node) {
  while (node) {
    if ((node.scrollWidth - node.clientWidth) > 20) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}


function xpath(query) {
  return unsafeWindow.document.evaluate(
    query,
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null
  );
}

function getNode(lnstr) {
  var node = getNodeByGeneralXpath(lnstr);
  if (!node) node = getNodeBySpecialXpath(lnstr);
  return node;
}

function getNodeByGeneralXpath(lnstr) {
  var strs;
  strs = Strs[lnstr];
  var x = generalXpaths;
  for (var i in x) {
    for (var j in strs) {
      var query = x[i][0] + strs[j] + x[i][1];
      var nodes = xpath(query);
      if (nodes.snapshotLength > 0) return nodes.snapshotItem(0);
    }
  }
  return null;
}

function getNodeBySpecialXpath(lnstr) {
  var s = specialXpaths;
  for (var i in s) {
    if (checkXpathUrl(s[i].urls)) {
      return xpath(s[i][lnstr]).snapshotItem(0);
    }
  }
  return null;
}

function checkXpathUrl(urls) {
  for (var i in urls) if (location.href.indexOf(urls[i]) >= 0) return true;
  return false;
}

function throttle(func, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return func(...args);
  };
}

function findParentKey(obj, value) {
  for (let key in obj) {
    if (obj[key].includes(value)) {
      return key;
    }
  }
  return null;
}

function checkKey(e) {
  if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;
  if (checkTextArea(e.target)) return;
  const key = findParentKey(keys, e.key)
  const link = getNode(key);
  if (key && !!link) {
    link.click()
  }
}

function checkWheel(e) {
  if (hasHorizontalScrollbar(e.target)) return
  if (event.deltaX !== 0) {
    turnPage(event.deltaX);
  }
}

function turnPage(direction) {
  const keyText = direction > 0 ? 'prev' : 'next';
  const link = getNode(keyText);
  if (!!link) {
    link.click()
  }
}

if (top.location != self.location) return;

unsafeWindow.document.addEventListener('wheel', throttle((event) => {
  checkWheel(event)
}, 1000));

if (needHotKey) {
  unsafeWindow.document.addEventListener("keydown", checkKey, false);
}
