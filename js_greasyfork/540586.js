// ==UserScript==
// @name         专业技术人员学习新干线
// @namespace    https://learning.hzrs.hangzhou.gov.cn
// @description  开始学习直接跳转到学习页，不用二次中转
// @author       NetFert
// @match        https://learning.hzrs.hangzhou.gov.cn/*
// @grant        none
// @license      MIT
// @version      0.0.4
// @downloadURL https://update.greasyfork.org/scripts/540586/%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E5%AD%A6%E4%B9%A0%E6%96%B0%E5%B9%B2%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/540586/%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E5%AD%A6%E4%B9%A0%E6%96%B0%E5%B9%B2%E7%BA%BF.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const loadLearnList = () => {
    fetch("https://learning.hzrs.hangzhou.gov.cn/api/index/Course/index", {
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: "Bearer " + localStorage.getItem("front_token"),
        "cache-control": "no-cache",
        "content-type": "application/json",
        pragma: "no-cache",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
      },
      referrer: "https://learning.hzrs.hangzhou.gov.cn/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: '{"limit":10,"page":1}',
      method: "POST",
      mode: "cors",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((res) => {
        const tbodyChildren =
          document.getElementsByTagName("tbody")[0].children;
        for (let i = 0; i < tbodyChildren.length; i++) {
          const childElement = tbodyChildren[i];
          childElement.childNodes[4].children[0].children[0].children[0].addEventListener(
            "click",
            function (e) {
              e.stopPropagation();
              e.preventDefault();
              window.open(
                "https://learning.hzrs.hangzhou.gov.cn/#/class?courseId=" +
                  res.data.data[i].courseid +
                  "&coursetitle=" +
                  res.data.data[i].coursename
              );
            },
            true
          );
        }
      });
  };

  const tryLoadLearnList = () => {
    let attempts = 0;
    const maxAttempts = 3000;
    const intervalTime = 10;

    function checkAndLoad() {
      const tbody = document.getElementsByTagName("tbody")[0];
      if (tbody && tbody.children.length > 0) {
        loadLearnList();
      } else {
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkAndLoad, intervalTime);
        } else {
          alert("脚本无法成功运行，可能失效了。");
        }
      }
    }
    checkAndLoad();
  };

  const killConfirm = () => {
    setInterval(() => {
      console.log("正在寻找确认按钮...");
      const allElements = document.querySelectorAll("*");
      const confirmButtons = [];
      allElements.forEach((el) => {
        if (el.textContent.trim() === "确定") {
          confirmButtons.push(el);
        }
      });

      for (let i = 0; i < confirmButtons.length; i++) {
        const button = confirmButtons[i];
        if (button.tagName === "BUTTON" || button.tagName === "A") {
          console.log("击毙确认按钮中...");
          button.click();
        }
      }
    }, 3000);
  };

  window.addEventListener("load", function () {
    if (window.location.hash.includes("#/learn")) {
      tryLoadLearnList();
    }

    if (window.location.hash.includes("#/class")) {
      killConfirm();
    }
  });
})();
