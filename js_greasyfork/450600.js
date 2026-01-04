// ==UserScript==
// @name         CNMOOC 好大学在线选择题答题情况查看 Rebirth
// @namespace    https://github.com/hans362/cnmooc_select
// @version      1.1
// @description  显示好大学在线测验与作业选择题回答情况
// @author       fourstring, LightQuantum, Hans362
// @match        https://cnmooc.org/study/initplay/*
// @match        https://cnmooc.org/examTest/stuExamList/*
// @match        https://www.cnmooc.org/examTest/stuExamList/*
// @match        https://www.cnmooc.org/study/*
// @match        https://*.cnmooc.org/examTest/stuExamList/*
// @match        https://*.cnmooc.org/study/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450600/CNMOOC%20%E5%A5%BD%E5%A4%A7%E5%AD%A6%E5%9C%A8%E7%BA%BF%E9%80%89%E6%8B%A9%E9%A2%98%E7%AD%94%E9%A2%98%E6%83%85%E5%86%B5%E6%9F%A5%E7%9C%8B%20Rebirth.user.js
// @updateURL https://update.greasyfork.org/scripts/450600/CNMOOC%20%E5%A5%BD%E5%A4%A7%E5%AD%A6%E5%9C%A8%E7%BA%BF%E9%80%89%E6%8B%A9%E9%A2%98%E7%AD%94%E9%A2%98%E6%83%85%E5%86%B5%E6%9F%A5%E7%9C%8B%20Rebirth.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var answers = {};
  (function (open) {
    const re = /https:\/\/(|www.)cnmooc.org\/examSubmit\/\d*\/getExamPaper-\d*_\d*_\d*\.mooc/;
    XMLHttpRequest.prototype.open = function () {
      this.addEventListener(
        "readystatechange",
        function () {
          if (this.readyState == 4 && re.test(this.responseURL)) {
            const parsed_json = JSON.parse(this.response);
            const quoted_answers = parsed_json.examSubmit.submitContent;
            const raw_answers = JSON.parse(quoted_answers);
            raw_answers.forEach((item) => {
              const parsed_item = JSON.parse(item);
              answers[parsed_item.quizId.toString()] = parsed_item.errorFlag === "right";
            });
            answers.length = raw_answers.length;
          }
        },
        false
      );
      open.apply(this, arguments);
    };
  })(XMLHttpRequest.prototype.open);
  function createTipsNode(ok) {
    var tipsNode = document.createElement("span");
    if (ok) {
      tipsNode.innerText =
        "[正确(结果不会即时更新，需要答题完暂存后再重新进入查看)]";
      tipsNode.style.color = "green";
    } else {
      tipsNode.innerText =
        "[错误(结果不会即时更新，需要答题完暂存后再重新进入查看)]";
      tipsNode.style.color = "red";
    }
    return tipsNode;
  }
  function markAnswer(ok) {
    if (ok) {
      return "p-no done";
    } else {
      return "p-no error";
    }
  }
  function checkErrorFlags() {
    let problemsList = $("div.view-test.practice-item").toArray();
    let circleList = $("a.p-no").toArray();
    if (problemsList.length == answers.length) {
      problemsList.map((problem) => {
        let currentProblemId = problem.getAttribute("id");
        if ($("div#" + currentProblemId + " a.selected").toArray().length > 0) {
          let addtionalTextArea = $(
            "div#" + currentProblemId + " div.test-attach"
          )[0];
          addtionalTextArea.appendChild(createTipsNode(answers[problem.getAttribute("quiz_id").toString()]));
          let circleId = parseInt($("span.test-no", problem).text());
          circleList[circleId-1].setAttribute("class", markAnswer(answers[problem.getAttribute("quiz_id").toString()]));
        }
      });
    }
  }
  function hook(_this, func, pre, post) {
    return function () {
      if (pre) pre.apply(_this, arguments);
      func.apply(_this, arguments);
      if (post) post.apply(_this, arguments);
    };
  }
  setInterval(function () {
    if (window.MathJax !== undefined && window.MathJax.patched === undefined) {
      window.MathJax.Hub.Queue = hook(
        window.MathJax.Hub,
        window.MathJax.Hub.Queue,
        null,
        checkErrorFlags
      );
      window.MathJax.patched = true;
    }
  }, 500);
})();