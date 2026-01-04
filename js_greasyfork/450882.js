// ==UserScript==
// @name         自动填写工时
// @namespace    undefined
// @version      0.0.2
// @description  自动填写工时代码
// @author       ccb
// @match        https://manhour.mycyclone.com/
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450882/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%B7%A5%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/450882/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%B7%A5%E6%97%B6.meta.js
// ==/UserScript==
    const selectData = {
      type: "产品研发",
      line: "平台产品线",
      product: "平台集成",
      version: "2.6",
      day: "1",
    };
    const workArr = [
      "bug修改1",
      "bug修改2",
      "bug修改3",
      "bug修改4",
      "bug修改5",
    ];
    const selectArr = Object.values(selectData);
    const delay1 = (ms) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    };
    const optionSelect = async (report, i) => {
      if (i > 3) {
        return;
      }
      report.querySelectorAll(".ant-select")[i].click();
      await delay1(300);
      let arr = document.querySelectorAll(".ant-select-dropdown-menu-item");

      arr.forEach(async (ele) => {
        if (ele.innerHTML?.includes(selectArr[i])) {
          ele.click();
          await delay1(200);
          optionSelect(report, i + 1);
        }
      });
    };
    (async () => {
      await delay1(1000);

      for (let i = 0; i < 5; i++) {
        let report = document.querySelectorAll(".report")[i];

        // report.querySelector(".ant-select").click();

        optionSelect(report, 0);

        await delay1(1000);
      }
       await delay1(10000);
  document
    .querySelectorAll(".report input[type='text']:not(.ant-input-disabled)")
    .forEach((ele, idx) => {
      ele.__vue__._events["change.value"][0](workArr[idx]);
    });
    })();