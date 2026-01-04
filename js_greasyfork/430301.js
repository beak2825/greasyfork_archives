// ==UserScript==
// @name         Luogu Comment Filter
// @version      0.1
// @description  过滤洛谷无意义评论
// @author       CoderOJ
// @match        https://www.luogu.com.cn/discuss/*
// @icon         https://www.google.com/s2/favicons?domain=luogu.com.cn
// @grant        none
// @namespace https://greasyfork.org/users/799991
// @downloadURL https://update.greasyfork.org/scripts/430301/Luogu%20Comment%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/430301/Luogu%20Comment%20Filter.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const filterList = [
    "qp",
    "hp",
    "前排",
    "后排",
    "滋滋",
    "滋磁",
    "zc",
    "这么前",
    "sqlm",
    "hqlm",
    "stlm",
    "考古",
    "%%%",
    "orz",
    "Orz",
    "sto",
    "兜售",
    "mian包",
  ];

  function isFiltered(content) {
    let pamLength = 0;
    for (const rule of filterList) {
      if (content.search(rule) != -1) {
        pamLength += (content.split(rule).length - 1) * rule.length;
      }
    }
    const actLength = content.split("").filter(c => !c.match(/\s/)).length;
    return pamLength >= actLength * 0.5;
  }

  function hideDom(dom) {
    let p = dom.parentNode.parentNode;
    p.style.display = "none";
  }

  let filteredContents = [];
  for (const dom of document.getElementsByClassName("am-comment-bd")) {
    const content = dom.innerText;
    if (isFiltered(content.trim())) {
      filteredContents.push(content.trim());
      hideDom(dom);
    }
  }
  console.log("[lgcf] filtered contents");
  filteredContents.forEach(a => console.log(a));
})();
