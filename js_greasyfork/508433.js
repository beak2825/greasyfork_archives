// ==UserScript==
// @name        东南大学研究生抢课助手
// @namespace   http://tampermonkey.net/
// @version     3.2.1
// @description 半自动，请自行提前修改lessons列表！
// @author      ginga
// @license     MIT
// @match       https://yjsxk.urp.seu.edu.cn/yjsxkapp/sys/xsxkapp/course.html
// @run-at      document-loaded
// @downloadURL https://update.greasyfork.org/scripts/508433/%E4%B8%9C%E5%8D%97%E5%A4%A7%E5%AD%A6%E7%A0%94%E7%A9%B6%E7%94%9F%E6%8A%A2%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/508433/%E4%B8%9C%E5%8D%97%E5%A4%A7%E5%AD%A6%E7%A0%94%E7%A9%B6%E7%94%9F%E6%8A%A2%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  // 循环选课模式，可尝试效果，不建议使用！
  const loopMode = false;

  const min = 100;
  const max = 300;

  // 设置时间间隔，单位为毫秒
  let interval = Math.floor(Math.random()*(max-min+1))+min;
  console.log("interval: " + interval);

  function chooseBatch() {
    // 让网页加载数据, 延迟启动
    setTimeout(() => {
      console.log("choosing...");
      // 1. 选择菜单
      let menu = document.querySelector("#zynkcGrid");
      // 2. 选择表格
      let table = menu.querySelector("tbody");
      let trs = table.children;
      // 3. 遍历每一个课程的不同教学班
      for (let tr of trs) {
        // 3.1 展开该课程的所有教学班
        tr.click();
        let isFull = true;
        // 3.2 选择第一个教学班(因为第一个教学班总是南京)
        let td = tr.querySelector(".cv-course-card");
        // 3.3 判断班级是否已满
        isFull =
          td
            .querySelector("div")
            .querySelectorAll(".cv-card-content")[2]
            .querySelector("span").innerText === "已满";

        // 3.4 如果班级人数未满, 则点击选择
        if (!isFull) {
          td.click();
          let chooseBtn = td.querySelectorAll("div")[10].children[0];
          chooseBtn.click();
        }
      }
      //
      setTimeout(() => {
          location.replace(location.href);
      }, Math.floor(interval / 2));

    }, interval);
  }
  
  chooseBatch();
})();
