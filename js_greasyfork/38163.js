// ==UserScript==
// @name         巴哈動漫電玩通題庫與解答系統
// @namespace    https://home.gamer.com.tw/moontai0724
// @version      5.1.0
// @description  巴哈動漫電玩通題庫與解答系統，蒐集題庫中～
// @author       moontai0724
// @match        https://forum.gamer.com.tw/B.php*
// @supportURL   https://home.gamer.com.tw/creationDetail.php?sn=3924920
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @resource     quizrp https://raw.githubusercontent.com/moontai0724/bahamut-quiz-script/master/right-box.html
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/38163/%E5%B7%B4%E5%93%88%E5%8B%95%E6%BC%AB%E9%9B%BB%E7%8E%A9%E9%80%9A%E9%A1%8C%E5%BA%AB%E8%88%87%E8%A7%A3%E7%AD%94%E7%B3%BB%E7%B5%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/38163/%E5%B7%B4%E5%93%88%E5%8B%95%E6%BC%AB%E9%9B%BB%E7%8E%A9%E9%80%9A%E9%A1%8C%E5%BA%AB%E8%88%87%E8%A7%A3%E7%AD%94%E7%B3%BB%E7%B5%B1.meta.js
// ==/UserScript==
/** @class */
class Database {
  /** @type {String} */
  static URL = "https://script.google.com/macros/s/AKfycbxYKwsjq6jB2Oo0xwz4bmkd3-5hdguopA6VJ5KD/exec";

  constructor() {
    throw new Error("New a Database instance is not needed.");
  }

  /**
   * Check is quiz exists in database
   * @param {Quiz} quiz 
   * @returns {Boolean}
   */
  static async exists(quiz) {
    let exists = await this.fetch("checkExisting", quiz.sn).catch(() => false);
    return exists ? true : false;
  }

  /**
   * Find answer of quiz in database
   * @param {Quiz} quiz 
   */
  static async answerOf(quiz) {
    let data = await this.fetch("answer", quiz.sn);
    return Promise.resolve(data);
  }

  /**
   * Find hint of quiz in database
   * @param {Quiz} quiz 
   */
  static async hintOf(quiz) {
    let data = await this.fetch("hint", quiz.sn);
    return Promise.resolve(data);
  }

  /**
   * Fetch (get) data from database
   * @param {String} type type of action
   * @param {Number} sn serial number of quiz
   */
  static async fetch(type, sn) {
    const data = new URLSearchParams({ type: type, sn: sn });
    const response = await fetch(`${Database.URL}?${data.toString()}`)
      .then(response => response.json());
    if (response.success)
      return Promise.resolve(response.data);

    return Promise.reject(response);
  }

  /**
   * Submit (post) data to database
   * @param {Quiz} quiz quiz infos
   * @param {Number} answer answer of quiz
   * @param {Boolean} correctness correctness of answer
   */
  static async submit(quiz, answer, correctness) {
    const data = {
      "version": GM_info.script.version,
      "sn": quiz.sn,
      "question": quiz.question,
      "options": quiz.options,
      "bsn": quiz.bsn,
      "author": quiz.author,
      "this_answered": answer,
      "correctness": correctness,
    };

    const response = await fetch(Database.URL, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "content-type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  }
}
/** @class */
class Quiz {
  /** @type {Number} */
  sn;
  /** @type {String} */
  question;
  /** @type {Array<String>} */
  options;
  /** @type {String} */
  author;
  /** @type {Number} */
  answer;
  /** @type {Number} */
  bsn;
  /** @type {Boolean} */
  answered = false;

  constructor() {
    let qabox = document.querySelector(".BH-qabox1");
    this.sn = qabox.getAttribute("data-quiz-sn");
    this.question = encodeURIComponent(qabox.innerText.split("\n").shift());
    this.options = Array.from(qabox.querySelectorAll("li a")).map(element => encodeURIComponent(element.innerText));
    this.author = new URL("https://" + qabox.querySelector("span>a").getAttribute("href")).pathname.split("/").pop();
    this.bsn = new URL(location.href).searchParams.get("bsn");
  }

  /**
   * try and submit answer to database
   * @param {User} user user to get CSRFToken
   * @param {View} view 
   * @param {Number|null} answer if provided, will test answer correctness
   */
  async submitAnswer(user, view, answer = undefined) {
    let token = await user.getCSRFToken();
    if (!answer || !(await this.attemptAnswer(answer, token, view)))
      answer = await this.getAnswer(token);

    let response = await Database.submit(this, answer, true);
    view.setSubmitResult(response);
  }

  /**
   * Try answer correctness and return correct answer
   * @param {String} token CSRFToken
   * @param {Number} tryAnswer answer index to try submit
   */
  async getAnswer(token, tryAnswer = 1) {
    if (tryAnswer > 4) return Promise.reject();
    const correctness = await this.attemptAnswer(tryAnswer, token);
    if (correctness) {
      this.answer = tryAnswer;
      return tryAnswer;
    }
    return await this.getAnswer(token, ++tryAnswer);
  }

  /**
   * Submit quiz answer to Bahamut
   * @param {Number} answer answer number, valid from 1 to 4
   * @param {String} token CSRFToken
   * @param {View} view if provided, will update response into view
   */
  async attemptAnswer(answer, token, view = undefined) {
    const data = new URLSearchParams({ sn: this.sn, o: answer, token: token });
    const response = await fetch(`/ajax/quiz_answer.php?${data.toString()}`).then(response => response.text());
    if (view)
      view.setResponse(response);
    return response.includes("答對");
  }

  toString() {
    let data = { sn: this.sn, question: this.question, options: this.options, author: this.author, answer: this.answer, bsn: this.bsn };
    return JSON.stringify(data);
  }
}
/** @class */
class User {
  /** @type {String|undefined} */
  id;

  constructor() {
    this.initializeId();
  }

  initializeId() {
    try {
      this.id = BAHAID;
    } catch (error) {
      let cookie = document.cookie.split("; ").filter(cookie => cookie.startsWith("BAHAID")).shift();
      this.id = cookie ? cookie.split("=").pop() : undefined;
    }
  }

  async getCSRFToken() {
    const response = await fetch("/ajax/getCSRFToken.php");
    return await response.text();
  }
}
/** @class */
class View {
  /** @type {HTMLElement} */
  window;
  /** @type {HTMLElement} */
  qabox;

  /**
   * @param {User} user 
   * @param {Quiz} quiz 
   */
  constructor(user, quiz) {
    this.window = document.querySelector("#quizrp");
    this.qabox = document.querySelector(".BH-qabox1");

    this.window.querySelector(".version span").innerHTML = GM_info.script.version;
    this.initOptions(user, quiz);
    this.initAutoAnswer(user, quiz);
    this.window.querySelector(".hint button").addEventListener("click", event => this.showHint(quiz));
    this.window.querySelector(".original button").addEventListener("click", event => this.showQuiz(quiz));
  }

  /**
   * @param {User} user 
   * @param {Quiz} quiz 
   */
  initAutoAnswer(user, quiz) {
    if (GM_getValue("auto-answer", false)) {
      this.window.querySelector(".auto span").classList.add("enable");
      setTimeout(() => quiz.submitAnswer(user, this), 2000);
    }
    this.window.querySelector(".auto button").addEventListener("click", event => this.toggleAutoAnswer(user, quiz))
  }

  /**
   * @param {User} user 
   * @param {Quiz} quiz 
   */
  initOptions(user, quiz) {
    this.qabox.querySelectorAll("li a").forEach(async (element, index, array) => {
      element.removeAttribute("href");
      element.addEventListener("click", async event => quiz.submitAnswer(user, this, index + 1, true));
    });
  }

  /**
   * Toggle and trigger auto answer
   * @param {User} user 
   * @param {Quiz} quiz 
   */
  toggleAutoAnswer(user, quiz) {
    let autoAnswerStatus = this.window.querySelector(".auto span");
    autoAnswerStatus.classList.toggle("enable");

    if (!autoAnswerStatus.classList.contains("enable")) {
      GM_deleteValue("auto-answer");
      return;
    }

    GM_setValue("auto-answer", true);
    quiz.submitAnswer(user, this);
  }

  /**
   * Show quiz
   * @param {Quiz} quiz 
   */
  async showQuiz(quiz) {
    let original = this.window.querySelector(".original div");
    original.innerHTML = `題目編號：${quiz.sn}<br>原題目：${decodeURIComponent(quiz.question)}<ol><li>${quiz.options.map(decodeURIComponent).join("</li><li>")}</li></ol>`;
    original.classList.remove("hide");
    this.window.querySelector(".original button").classList.add("hide");

    let answer = await Database.answerOf(quiz).catch(err => null);
    let options = Array.from(this.window.querySelectorAll(".original li"));
    if (answer)
      options.forEach((element, index) => element.classList.add(index + 1 == answer ? "correct" : "wrong"));
  }

  /**
   * Show hint
   * @param {Quiz} quiz 
   */
  async showHint(quiz) {
    let view = this.window.querySelector(".hint span");
    let hint = await Database.hintOf(quiz).catch(err => null);
    this.window.querySelector(".hint button").classList.add("hide");
    if (!hint) {
      view.innerHTML = "題庫中無資料。";
      return;
    }
    view.innerHTML = "提示已獲取！";
    view.classList.add("success");
    this.qabox.querySelector(`li:nth-child(${hint}) a`).classList.add("wrong");
  }

  /**
   * Set response of database to view
   * @param {JSON} response 
   */
  setSubmitResult(response) {
    let messages = {
      "DATA_INVALID": "無法送出答案，請檢查是否有更新，或通知作者。",
      "DATA_APPENDED": "資料新增了！感謝提供～",
      "DATA_UPDATED": "資料更新了！感謝提供～",
      "IGNORED": "題庫中已經有資料啦～",
    };
    const statusDisplay = this.window.querySelector(".report span");
    statusDisplay.innerHTML = messages[response.message];
    if (response.success)
      statusDisplay.classList.add("success");
  }

  /**
   * Set native baha response of quiz into view
   * @param {String} html 
   */
  setResponse(html) {
    this.qabox.style["text-align"] = "center";
    this.qabox.innerHTML = html;
  }
}
(function () {
  'use strict';

  document.querySelector(".BH-qabox1").outerHTML += GM_getResourceText("quizrp");

  let user = new User();
  let quiz = new Quiz();
  let view = new View(user, quiz);
})();
