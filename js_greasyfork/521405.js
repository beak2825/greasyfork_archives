// ==UserScript==
// @name         百度教育自动展开答案
// @namespace    net.myitian.js.easylearn.autoShowAnswer
// @version      1
// @description  自动点击“百度教育-不挂科”/“百度教育-百度题库”题目详情页的查看答案
// @author       Myitian
// @license      Unlicensed
// @match        https://easylearn.baidu.com/edu-page/tiangong/bgkdetail?*
// @match        https://easylearn.baidu.com/edu-page/tiangong/questiondetail?*
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521405/%E7%99%BE%E5%BA%A6%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/521405/%E7%99%BE%E5%BA%A6%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
async function main() {
  let show = null;
  while (!show) {
    await sleep(10);
    show = document.querySelector(".answer-hide, .shiti-answer .mask .toogle-btn");
  }
  show.click();
  show = null;
  while (!show) {
    await sleep(10);
    show = document.querySelector(".question-recomm .dan-btn, .exercise-new-dialog .exercise-btn-4");
  }
  show.click();
}
main();