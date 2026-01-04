// ==UserScript==
// @name         重庆工程学院一键评教
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       seesaw
// @match        https://zlpj.cqie.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cqie.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460890/%E9%87%8D%E5%BA%86%E5%B7%A5%E7%A8%8B%E5%AD%A6%E9%99%A2%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/460890/%E9%87%8D%E5%BA%86%E5%B7%A5%E7%A8%8B%E5%AD%A6%E9%99%A2%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var i = 0;
  var btns = [];
  var check;
  var timer;
  window.onload = function () {
    console.log("开始执行");
    const url = window.location.href;
    if (
      url !==
      "https://zlpj.cqie.edu.cn/#/education/teachevaluation/teachevaluationlist"
    ) {
      return;
    }
    const date = Date.now();
    timer = setInterval(() => {
      btns = document.querySelectorAll(".firstbutton > button");
      if (Date.now() - date > 10000) {
        alert("网站太垃圾 网太卡了");
        clearInterval(timer);
        return;
      }
      if (btns.length > 0) {
        clearInterval(timer);
       clickBtn();
      }
    }, 1000);
  };
  function score() {
    const arr = [];
    timer = setInterval(() => {
      check = document.querySelectorAll(".el-radio__original");
      if (check.length > 0) {
        clearInterval(timer);
        for (let j = 0; j < 50; j = j + 5) {
          check[j].click();
          arr.push(check[i]);
        }
        const result = arr.filter((item) => {
          return !item.checked;
        });
        if (result.length !== 0) {
          //如果没有代表都选中了
          setTimeout(() => {
            submit();
          }, 2000);
        }
      }
    }, 1000);
  }

  function clickBtn() {
       timer = setInterval(() => {
       btns = document.querySelectorAll(".firstbutton > button");
             if (btns.length > 0) {
                 clearInterval(timer)
      btns[0].click();
      setTimeout(() => {
        score();
      }, 2000);
      i++;
    }
       },1000)



  }

  function submit() {
    timer = setInterval(() => {
      const submit = document.querySelectorAll(".fen > button");
      if (submit.length > 0) {
        clearInterval(timer);
        submit[0].click();
        setTimeout(() => {
          submit2();
        }, 3000);
      }
    }, 1000);
  }

  function submit2() {
    timer = setInterval(() => {
      const submit = document.querySelectorAll(".saveti");
      if (submit.length > 0) {
        clearInterval(timer);
        submit[0].click();
        setTimeout(() => {
          submit3();
        }, 3000);
      }
    }, 1000);
  }

  function submit3() {
    timer = setInterval(() => {
      const submit = document.querySelectorAll(".contupin");
      if (submit.length > 0) {
        clearInterval(timer);
        submit[0].click();
        setTimeout(() => {
          clickBtn();
        }, 3000);
      }
    }, 1000);
  }
})();
