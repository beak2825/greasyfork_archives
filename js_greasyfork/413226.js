// ==UserScript==
// @name         CNMOOC 好大学在线选择题答题情况查看 Revived
// @namespace    https://github.com/PhotonQuantum/cnmooc_select
// @version      0.9
// @description  显示好大学在线测验与作业选择题回答情况
// @author       fourstring, LightQuantum
// @match        https://cnmooc.org/study/initplay/*
// @match        https://cnmooc.org/examTest/stuExamList/*
// @match        https://www.cnmooc.org/examTest/stuExamList/*
// @match        https://www.cnmooc.org/study/*
// @match        https://*.cnmooc.org/examTest/stuExamList/*
// @match        https://*.cnmooc.org/study/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413226/CNMOOC%20%E5%A5%BD%E5%A4%A7%E5%AD%A6%E5%9C%A8%E7%BA%BF%E9%80%89%E6%8B%A9%E9%A2%98%E7%AD%94%E9%A2%98%E6%83%85%E5%86%B5%E6%9F%A5%E7%9C%8B%20Revived.user.js
// @updateURL https://update.greasyfork.org/scripts/413226/CNMOOC%20%E5%A5%BD%E5%A4%A7%E5%AD%A6%E5%9C%A8%E7%BA%BF%E9%80%89%E6%8B%A9%E9%A2%98%E7%AD%94%E9%A2%98%E6%83%85%E5%86%B5%E6%9F%A5%E7%9C%8B%20Revived.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var answers = [];
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
            answers = raw_answers.map((item) => {
              const parsed_item = JSON.parse(item);
              return parsed_item.errorFlag === "right";
            });
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
  function checkErrorFlags() {
    let zip = (rows) => rows[0].map((_, c) => rows.map((row) => row[c]));
    let problemsList = $("div.view-test.practice-item").toArray();
    if (problemsList.length == answers.length) {
      zip([problemsList, answers]).map(([problem, answer]) => {
        let currentProblemId = problem.getAttribute("id");
        if ($("div#" + currentProblemId + " a.selected").toArray().length > 0) {
          let addtionalTextArea = $(
            "div#" + currentProblemId + " div.test-attach"
          )[0];
          addtionalTextArea.appendChild(createTipsNode(answer));
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
