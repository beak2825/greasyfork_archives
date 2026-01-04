// ==UserScript==
// @name               Twitter特殊词语屏蔽替换
// @name:en            Twitter Special Words Replace
// @name:zh            Twitter特殊词语屏蔽替换
// @namespace          https://greasyfork.org/zh-CN/users/1155708-dfk-klee
// @version            0.1.1.4
// @description        屏蔽或替换Twitter上的特殊词语
// @description:en     Block or Replace special words on Twitter
// @description:zh     屏蔽或替换Twitter上的特殊词语
// @author             KumaTea DFK_KLEE
// @match              https://twitter.com/*
// @match              https://x.com/*
// @license            GPLv3
// @downloadURL https://update.greasyfork.org/scripts/473514/Twitter%E7%89%B9%E6%AE%8A%E8%AF%8D%E8%AF%AD%E5%B1%8F%E8%94%BD%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/473514/Twitter%E7%89%B9%E6%AE%8A%E8%AF%8D%E8%AF%AD%E5%B1%8F%E8%94%BD%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
// "use strict";

const wordsList = new Set([
  RegExp("8964|８９６４|八九六四", "gi"),
  RegExp("(中|狗|支|你|猪|豬|反)(共|党|黨|蟈|国)人?", "gi"),
  RegExp("共(产|產|惨|慘)?(党|黨|匪|猪|豬|狗|爹)", "gi"),
  RegExp("毛?(主席|泽东|太祖|腊肉|臘肉)", "gi"),
  RegExp("(习|刁|習)(近平|主席|仲勋|狗|猪|大)", "gi"),
  RegExp("小?粉(蛆|红|紅)", "gi"),
  RegExp("(支|黃|賤|贱)(那|国|猪|豬|蛆|畜|狗|奴)", "gi"),
  RegExp("(屠|图|潳)支|滞纳|滯納|蜘蛛|🕷|(猪|豬)圈|奴(隶|隸|才)", "gi"),
]);

/**
 *
 * @param {HTMLElement[]} cellInnerDivs
 */
function blockTweets(cellInnerDivs) {
  let blockedDivCount = 0;
  // 使用for of遍历节点
  for (const cellInnerDiv of cellInnerDivs) {
    let tweetText = cellInnerDiv.textContent;
    let existed = false;
    for (const wordReg of wordsList) {
      if (wordReg.test(tweetText)) {
        existed = true;
        break;
      }
    }

    if (existed && cellInnerDiv.style.display !== "none") {
      cellInnerDiv.style.display = "none";
      blockedDivCount += 1;
    }
  }

  blockedDivCount &&
    console.log(
      `屏蔽了 ${blockedDivCount} 条推文，在 ${cellInnerDivs.length} 个推文节点中`
    );
}

function main() {
  // 监听DOM更新，并执行回调
  const observer = new MutationObserver((mutationsList) => {
    // 获取更新了的节点
    for (const mutation of mutationsList) {
      if (mutation.target) {
        const cellInnerDivs = mutation.target.querySelectorAll(
          "div[data-testid='cellInnerDiv']"
        );
        if (cellInnerDivs.length > 0) {
          blockTweets(cellInnerDivs);
        }
      }
    }
  });

  // 监听更新的节点
  observer.observe(document, { childList: true, subtree: true });
}

main();
