// ==UserScript==
// @name         CQOOC Enhance
// @namespace    https://www.cqooc.com/
// @version      0.21
// @description  cqooc enhance
// @author       omg-xtao
// @match        https://www.cqooc.com/*
// @icon         https://www.cqooc.com/images/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_notification
// @license      GPL-3.0 License
// @supportURL   https://github.com/cqwu-ehall/Cqooc_Ehance
// @homepageURL  https://github.com/cqwu-ehall/Cqooc_Ehance
// @downloadURL https://update.greasyfork.org/scripts/473037/CQOOC%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/473037/CQOOC%20Enhance.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const searchUrl = `https://www.cqooc.com/json/test/result/search?`;
  const tasksearchUrl = `https://www.cqooc.com/json/task/result/search?`;

  function AddElement(q, score) {
    if (document.getElementById(q) !== null) {
      const scoreP = document.createElement("p");
      scoreP.style.color = "red";
      scoreP.innerHTML = `得分：${score}`;
      document.getElementById(q).appendChild(scoreP);
    } else {
      setTimeout(() => {
        AddElement(q, score);
      }, 1000);
    }
  }
  if (window.location.pathname === "/learn/mooc/task/do") {
    const params = new URLSearchParams(window.location.search);
    const tid = params.get("tid");
    if (tid === null) {
      return;
    }
    const ts = new Date().getTime();

    function addFileDownload(url) {
      if (document.getElementById("fileUrl") !== null) {
        const down = document.createElement("span");
        down.style.color = "green";
        down.innerHTML = "&nbsp;&nbsp;下载";
        down.addEventListener("click", () => {
          window.open(`https://www.cqooc.com${url}`, "_blank");
        });
        document.getElementById("fileUrl").parentNode.appendChild(down);
      } else {
        setTimeout(() => {
          addFileDownload(url);
        }, 1000);
      }
    }

    // 显示文件下载按钮
    try {
      GM_xmlhttpRequest({
        method: "GET",
        url: tasksearchUrl + `taskId=${tid}&ts=${ts}`,
        headers: {
          referer: window.location.href,
        },
        onload: function (response) {
          const jsondata = JSON.parse(response.responseText);
          if (jsondata.data.length > 0) {
            const attachment = jsondata.data[0].attachment;
            if (attachment !== null) {
              addFileDownload(attachment);
            }
          }
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
  if (window.location.pathname === "/learn/mooc/testing/do") {
    const params = new URLSearchParams(window.location.search);
    const tid = params.get("tid");
    if (tid === null) {
      return;
    }
    const ts = new Date().getTime();
    // 测验显示小题得分
    try {
      GM_xmlhttpRequest({
        method: "GET",
        url: searchUrl + `testID=${tid}&ts=${ts}`,
        headers: {
          referer: window.location.href,
        },
        onload: function (response) {
          const jsondata = JSON.parse(response.responseText);
          if (jsondata.data.length > 0) {
            const scoreData = jsondata.data[0].scoreLog;
            if (scoreData.length > 0) {
              const scoreLogData = scoreData[scoreData.length - 1];
              for (var q in scoreLogData) {
                AddElement(q, scoreLogData[q].get);
              }
            }
          }
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  function createAnswerButton(exam) {
    const buttonDiv = document.createElement("p");
    buttonDiv.className = "time";
    const copyButton = document.createElement("span");
    copyButton.innerHTML = "复制答案&nbsp;&nbsp;";
    const pasteButton = document.createElement("span");
    pasteButton.innerHTML = "&nbsp;&nbsp;粘贴答案";
    buttonDiv.appendChild(copyButton);
    buttonDiv.appendChild(pasteButton);
    copyButton.addEventListener("click", () => {
      const answer = [];
      document.querySelectorAll("input[checked]").forEach((item) => {
        if (exam) {
          if (item.parentElement.className.indexOf("true") > -1) {
            answer.push(item.id);
          }
        } else {
          answer.push(item.id);
        }
      });
      GM_setClipboard(answer.join(","));
      alert("答案已复制到剪贴板");
    });
    pasteButton.addEventListener("click", () => {
      GM_notification({ highlight: true });
      navigator.clipboard.readText().then((text) => {
        const lines = text.split("\r\n");
        lines.forEach((line) => {
            const answer = line.split(",");
            answer.forEach((item) => {
            const input = document.getElementById(item);
            if (input !== null) {
              input.click();
            }
          });
        });
        alert("答案已粘贴");
      });
    });
    return buttonDiv;
  }

  if (
    window.location.pathname === "/learn/mooc/testing/do" ||
    window.location.pathname === "/learn/mooc/exam/do"
  ) {
    // 测试复制答案
    const buttonDiv = createAnswerButton(
      window.location.pathname === "/learn/mooc/exam/do"
    );
    if (window.location.pathname === "/learn/mooc/testing/do") {
      function AddAnserButton() {
        const scoreDiv = document.getElementById("score");
        if (scoreDiv !== null) {
          scoreDiv.appendChild(buttonDiv);
        } else {
          setTimeout(() => {
            AddAnserButton();
          }, 1000);
        }
      }

      AddAnserButton();
    }
    // 考试复制答案
    if (window.location.pathname === "/learn/mooc/exam/do") {
      function AddAnserButton() {
        const timeDiv = document.querySelector(".timeout");
        if (timeDiv !== null) {
          document
            .querySelectorAll(".mooc-wrap")[1]
            .insertBefore(buttonDiv, timeDiv);
        } else {
          setTimeout(() => {
            AddAnserButton();
          }, 1000);
        }
      }

      AddAnserButton();
    }
  }
})();
