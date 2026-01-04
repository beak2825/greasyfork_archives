// ==UserScript==
// @name         多邻国网页小助手
// @namespace    http://tampermonkey.net/
// @description  多邻国一键查看当前题目答案
// @version      0.0.3
// @author       https://github.com/QingXia-Ela
// @match        https://www.duolingo.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=duolingo.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490756/%E5%A4%9A%E9%82%BB%E5%9B%BD%E7%BD%91%E9%A1%B5%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/490756/%E5%A4%9A%E9%82%BB%E5%9B%BD%E7%BD%91%E9%A1%B5%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';
  /** @type {import("redux").Store<import("./type").DuolingoReduxState, {}, {}>} */
  let store

  /** @typedef {import("./type").DuolingoReduxState['player']['session']['challenges'][0]} CurrentChallenge */

  /**
   * @param {CurrentChallenge} currentChallenge 
   */
  function chooseTranslateKey(currentChallenge) {
    const {
      choices,
      compactTranslations
    } = currentChallenge
    const choose = Array
      .from(document.querySelectorAll("button[data-test]"))
      .filter((v) => v.getAttribute("data-test").includes("-challenge-tap-token"))

    const chooseMap = {}
    choose.forEach((v, index) => {
      const text = v.querySelector("span[data-test='challenge-tap-token-text']").innerHTML
      chooseMap[text] = v
    })

    /** @type {string} */
    const bestAnswer = compactTranslations[0]
    let beginIndex = 0, maxCnt = 20

    while (beginIndex < bestAnswer.length && maxCnt > 0) {
      maxCnt--
      choices.forEach(({ text }, index) => {
        if (bestAnswer.indexOf(text, beginIndex) !== -1) {
          chooseMap[text].click()

          beginIndex = bestAnswer.indexOf(text) + text.length
        }
      })
    }
  }

  function clickCurrentPageCorrectAnswer(currentChallenge) {
    const {
      correctIndex
    } = currentChallenge
    document.querySelectorAll("div[data-test='challenge-choice']")[correctIndex].click()
  }

  function selectCurrentExercisesAnswer() {
    // player -> challengeStates: Array - 可以获取 challenge 题目类型
    // player -> currentIndex - 第几题了
    // player -> session -> challenges 获取题目列表
    const {
      player: {
        challengeStates,
        currentIndex,
        session: {
          challenges
        }
      }
    } = store.getState()

    const currentChallenge = challenges[currentIndex]
    const currentChallengeType = currentChallenge.type

    switch (currentChallengeType) {
      case "translate":
        chooseTranslateKey(currentChallenge)
        break;

      // 5选5
      case "characterMatch":
        // todo!
        break


      default:
        clickCurrentPageCorrectAnswer(currentChallenge)
        break;
    }
  }

  function createCheckButton() {
    const div = document.createElement("div")
    div.style.position = "fixed"
    div.style.bottom = "56px"
    div.style.left = "3.5rem"
    div.style.zIndex = "999"
    div.style.userSelect = "none"
    div.style.color = "blue"

    div.innerHTML = "查看当前题目答案"

    div.addEventListener("click", () => {
      store = document.querySelector("#root")._reactRootContainer.current.memoizedState.element.props.store
      if (!window.location.pathname.startsWith("/lesson")) {
        alert("非做题页面！")
        return
      }
      try {
        selectCurrentExercisesAnswer()
      } catch (e) {
        alert("处理答案失败，你可以考虑将错误信息汇报给开发者: " + e.toString())
      }
    })

    document.body.appendChild(div)
  }

  createCheckButton()
})();
