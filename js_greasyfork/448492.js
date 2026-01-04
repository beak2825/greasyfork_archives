// ==UserScript==
// @name         AtCoder Submission Language Detector
// @namespace    https://twitter.com/KakurenboUni
// @version      1.1.1
// @description  Automatically detects the language used based on the information in the source code comments and selects it as the one to be submitted.
// @author       uni-kakurenbo
// @match        https://atcoder.jp/contests/*/tasks/*
// @match        https://atcoder.jp/contests/*/submit*
// @match        https://atcoder.jp/contests/*/custom_test*
// @license      MIT
// @supportURL   https://twitter.com/KakurenboUni
// @downloadURL https://update.greasyfork.org/scripts/448492/AtCoder%20Submission%20Language%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/448492/AtCoder%20Submission%20Language%20Detector.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  const DETECTION_REG_EXP = /#.*lang(?:uage)?:?(?<args>\s+[^\n\r*/#]+)/;

  await rendered();

  const $editor = ace.edit("editor");
  const $plainTextarea = $("#plain-textarea");

  const $selectLanguage = $("#select-lang select");
  const $languageOptions = $selectLanguage[0].querySelectorAll("option");
  const languageOptions = [].map.call($languageOptions, ({ value, label, dataset: { mime } = {} }) => {
    return {
      id: value,
      label: label.toLowerCase() ?? "",
      code: mime?.toLowerCase().replaceAll(/^.+\/x?|src$/g, "") ?? "",
    };
  });

  $editor.getSession().on("change", updateLanguageSettings);
  $plainTextarea.on("input", updateLanguageSettings);
  document.addEventListener("paste", updateLanguageSettings);
  $("#input-open-file").on("change", () => { setTimeout(updateLanguageSettings, 0); });

  function getSourceCode() {
      if($editor.isFocused()) return $editor.getValue();
      else return $plainTextarea[0].value;
  }

  function updateLanguageSettings() {
    const sourceCode = getSourceCode();
    console.log(sourceCode);

    const languageInfomation = sourceCode.match(DETECTION_REG_EXP);
    if (!languageInfomation || !languageInfomation?.groups?.args) return;

    let languageSelectors = languageInfomation.groups.args?.trim().replace(/\s+/g, " ").split(" ");
    languageSelectors = languageSelectors.map((selector) => selector.toLowerCase());

    const selectedOption = languageOptions.find((option) => {
      return (
        languageSelectors.includes(option.id) ||
        languageSelectors.every((selector) => option.label.includes(selector)) ||
        languageSelectors.every((selector) => option.code.includes(selector))
      );
    });

    if (!selectedOption) return;

    $selectLanguage.val(selectedOption.id).trigger("change");
  }

  async function rendered() {
    let timer;
    await new Promise((resolve) => {
      observer();
      function observer() {
        console.log(getLS)
        if (typeof getLS == "function") {
          resolve();
        }
        timer = setTimeout(observer, 10);
      }
    });
    clearTimeout(timer);
  }
})();
