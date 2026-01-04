// ==UserScript==
// @name         exam
// @description  exam faster
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @author       You
// @match        https://l.jd.com/student/exam/analyze.du*
// @match        https://l.jd.com/student/exam/no-answer-analyze.du*
// @match        https://l.jd.com/student/exam/exam.du*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jd.com
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482107/exam.user.js
// @updateURL https://update.greasyfork.org/scripts/482107/exam.meta.js
// ==/UserScript==
;(function () {
  "use strict"
  let answersMap
  const paper = document.querySelector('.jdu-exam')
  const btnCtn = document.createElement("div")
  btnCtn.className = "jdu-btn-con";
  btnCtn.style.position = "fixed";
  paper.appendChild(btnCtn)

  const btn = document.createElement("a")
  btn.href = "#"
  btn.innerText = "Go！"

  btnCtn.appendChild(btn)
  setTimeout(() => {
    if (location.pathname.endsWith("analyze.du")) {
      btn.addEventListener("click", () => {
        const questions = document.querySelectorAll(".question")
        const map = {}

        Array.from(questions).map((question) => {
          const questionId = question.id
          const options = Array.from(
            question.querySelectorAll(".answer-options li")
          )
          const answersStr = question
            .querySelector(".jdu-answer-analyze > div:first-child")
            .innerText.substr(5)
          map[questionId] = answersStr.split("").reduce((prev, answerKey) => {
            const answerStr = options.find(
              (option) => option.innerText[1] == answerKey
            )
            const answer = answerStr.innerText.substr(1)
            prev.push(answer.trim().replace(/^ ?[ABCDEFGH]\. ?/, ""))
            return prev
          }, [])
        })
        GM_setClipboard(JSON.stringify(map), "text", () => alert("已复制"));
      })
    }

    if (location.pathname.endsWith("exam.du")) {
      btn.addEventListener("click", () => {
        const questions = document.querySelectorAll(".question")
        if (!answersMap) {
          answersMap = JSON.parse(prompt("请粘贴参考答案:"))
        }

        questions.forEach((question) => {
          const answers = answersMap[question.id] || []
          const options = question.querySelectorAll(".answer-options li")
          options.forEach((option) => {
            const purifiedOption = option.innerText
              .trim()
              .replace(/^ ?[ABCDEFGH]\. ?/, "")
            if (
              answers.some((answer) => {
                return answer === purifiedOption
              })
            ) {
              option.click()
            }
          })
        })
      })
    }
  }, 1000)
})()
