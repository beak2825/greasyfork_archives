// ==UserScript==
// @name         新疆职业药师刷课脚本
// @namespace    https://github.com/ischaojie/
// @version      0.1.0
// @author       ischaojie
// @description  职业药师继续教育刷课北京金航联继续教育学习平台新疆职业药师
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match        http://xj.mtnet.com.cn/*
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/532347/%E6%96%B0%E7%96%86%E8%81%8C%E4%B8%9A%E8%8D%AF%E5%B8%88%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/532347/%E6%96%B0%E7%96%86%E8%81%8C%E4%B8%9A%E8%8D%AF%E5%B8%88%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  (function() {
    console.log("[刷课脚本] 已启动...");
    const TOKEN_NAME = "aiToken";
    const rightAnswersMap = /* @__PURE__ */ new Map();
    _GM_registerMenuCommand(
      "设置刷考试唯一码",
      function(event) {
        const tokenGM = _GM_getValue(TOKEN_NAME);
        const token = prompt("请输入唯一码", (tokenGM == null ? void 0 : tokenGM.toString()) || "");
        _GM_setValue(TOKEN_NAME, token);
      },
      "s"
    );
    updateDocumentTitle();
    setInterval(init, 3 * 1e3);
    function init() {
      if (document.querySelector("video")) {
        autoPlayVideo();
      } else if (document.querySelector(".questionList")) {
        autoExam();
      } else if (document.querySelector(".gxkn")) {
        const buttons = document.querySelectorAll(".gxkn");
        buttons.forEach((button) => {
          button.click();
          checkCourseList();
        });
      }
    }
    function updateDocumentTitle() {
      document.title = "[刷课脚本]工作中";
      setInterval(() => {
        var _a;
        const pointNum = ((_a = document.title.match(/\./g)) == null ? void 0 : _a.length) || 0;
        if (pointNum >= 9) {
          document.title = "[刷课脚本]工作中";
        } else {
          document.title += ".";
        }
      }, 500);
    }
    function checkCourseList() {
      const courseItems = document.querySelectorAll(".indexCourseListSLi");
      for (const course of courseItems) {
        const progressSpan = course.querySelector(".gkjd span");
        if (progressSpan && progressSpan.textContent.trim() !== "100%") {
          const enterButton = course.querySelector(".indexTextBtn");
          if (enterButton) {
            console.log(
              "[刷课脚本] 发现未完成课程，进入学习:",
              course.textContent.trim()
            );
            enterButton.click();
            return;
          }
        }
      }
      for (const course of courseItems) {
        const onlineTest = course.querySelector(".onlineTest");
        if (onlineTest) {
          console.log(
            "[刷课脚本] 发现考试，进入考试:",
            course.textContent.trim()
          );
          onlineTest.click();
          return;
        }
        rightAnswersMap.clear();
      }
      console.log("[刷课脚本] 所有课程已完成。");
    }
    function autoPlayVideo() {
      const video = document.querySelector("video");
      if (video) {
        video.muted = true;
        if (video.paused) {
          video.play();
          console.log("[刷课脚本] 开始播放视频...");
        }
        video.addEventListener("ended", function() {
          console.log("[刷课脚本] 播放下个视频...");
          goToNext();
        });
        removeDialog();
      } else {
        console.log("[刷课脚本] 未发现视频，回到课程列表...");
        window.history.back();
      }
    }
    async function autoExam() {
      console.info("[刷课脚本] 开始考试...");
      if (_GM_getValue(TOKEN_NAME) === null) return;
      await exam();
      const allRadiListChecked = document.querySelectorAll(".radioList .question div").length === document.querySelectorAll(".radioList .is-checked").length;
      const allCheckboxListChecked = document.querySelectorAll(".checkboxList .question div").length <= document.querySelectorAll(".checkboxList .is-checked").length;
      if (allRadiListChecked && allCheckboxListChecked) {
        await commitAnswer();
      }
    }
    async function commitAnswer() {
      return new Promise((resolve, reject) => {
        const commitAnswer2 = document.querySelector(".loginBtn");
        setTimeout(() => commitAnswer2.click(), 1e3);
        console.info("[刷课脚本] 提交答案...");
        const result = document.querySelector(".results");
        if (result) {
          if (result.textContent.includes("重新答题")) {
            console.info("[刷课脚本] 成绩不合格, 重新答题...");
            const allQuestions = getAllQuestions();
            allQuestions.filter((question) => question.className.includes("right")).forEach((question) => {
              const kind = question.querySelector("div").className === "el-radio-group" ? "radioList" : "checkboxList";
              const answer = Array.from(
                question.querySelectorAll(
                  `${kind === "checkboxList" ? ".el-checkbox" : ".el-radio"}`
                )
              ).filter((option) => option.className.includes("is-checked")).map((o) => o.querySelector("input").value).join("");
              rightAnswersMap.set(question.id, answer);
            });
            console.debug("[刷课脚本] 正确答案: ", rightAnswersMap);
            document.querySelectorAll(".results span")[0].click();
          } else {
            console.info("[刷课脚本] 成绩合格, 继续下一个课程...");
            goToNext();
          }
        }
        resolve();
      });
    }
    function getAllQuestions() {
      let allQuestions = [];
      let questionsSingle = document.querySelector(`.radioList .question`);
      let questionsMulti = document.querySelector(`.checkboxList .question`);
      if (questionsSingle) {
        allQuestions = [...allQuestions, ...questionsSingle.children];
      }
      if (questionsMulti) {
        allQuestions = [...allQuestions, ...questionsMulti.children];
      }
      return allQuestions;
    }
    async function exam() {
      const allQuestions = getAllQuestions();
      for (const question of allQuestions) {
        const kind = question.querySelector("div").className === "el-radio-group" ? "radioList" : "checkboxList";
        if (question.querySelector(".is-checked") === null) {
          await answerQuestion(question, kind);
        }
      }
    }
    async function answerQuestion(question, kind) {
      console.debug("[刷课脚本] 回答题目: ", question.textContent);
      let answer;
      if (rightAnswersMap.has(question.id)) {
        answer = rightAnswersMap.get(question.id);
        console.info("[刷课脚本] 使用缓存正确答案: ", answer);
      } else {
        answer = await askAI(question, kind);
      }
      const questionEl = kind === "checkboxList" ? ".el-checkbox" : ".el-radio";
      question.querySelectorAll(`${questionEl} input`).forEach((option) => {
        switch (kind) {
          case "checkboxList":
            if (answer.includes(option.value)) {
              setTimeout(() => {
                option.click();
              }, 300);
            }
            break;
          case "radioList":
            if (option.value === answer) {
              setTimeout(() => {
                option.click();
              }, 300);
            }
            break;
        }
      });
    }
    function askAI(question, kind) {
      return new Promise((resolve, reject) => {
        const questionText = question.textContent;
        const questionType = kind === "checkboxList" ? "多选题" : "单选题";
        const questionExample = kind === "checkboxList" ? "ABC" : "A";
        const prompt2 = `请认真回答${questionType}：${questionText} 
 请直接给出答案，不需要解析，不知道答案也尝试给出结果（强制），示例 ${questionExample}`;
        const data = {
          model: "qwen-plus",
          messages: [
            {
              role: "system",
              content: "你是一名专业的执业药师熟悉继续教育相关考试题"
            },
            {
              role: "user",
              content: prompt2
            }
          ]
        };
        _GM_xmlhttpRequest({
          method: "POST",
          responseType: "json",
          url: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
          data: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${_GM_getValue(TOKEN_NAME)}`
          },
          onload: function(response) {
            const data2 = response.response;
            var answer = "";
            try {
              answer = data2.choices[0].message.content;
              console.info("[刷课脚本] AI 答案: ", answer);
            } catch (error) {
              console.error(error);
            }
            if (!/^[A-Z]+$/.test(answer)) {
              const options2 = ["A", "B", "C", "D"];
              const randomAnswer = options2[Math.floor(Math.random() * options2.length)];
              answer = randomAnswer;
              console.warn("[刷课脚本] AI 无答案，使用随机答案: ", answer);
              if (kind === "checkboxList") {
                const randomAnswers = [];
                for (let i = 0; i < Math.floor(Math.random() * 4); i++) {
                  randomAnswers.push(options2[i]);
                }
                answer = randomAnswers.join("");
              }
            }
            if (kind === "checkboxList" && answer.length === 1) {
              const randomAnswers = [];
              for (let i = 0; i < Math.floor(Math.random() * 4); i++) {
                randomAnswers.push(options[i]);
              }
              answer = randomAnswers.join("");
            }
            resolve(answer);
          },
          onerror: function(error) {
            reject(error);
          },
          ontimeout: function() {
            reject("请求超时");
          }
        });
      });
    }
    function removeDialog() {
      const dialog = document.getElementById("nPlay");
      if (dialog) {
        dialog.remove();
      }
      const vModal = document.getElementsByClassName("v-modal")[0];
      if (vModal) {
        vModal.remove();
      }
    }
    function goToNext() {
      location.replace(`http://${location.host}/index`);
    }
  })();

})();