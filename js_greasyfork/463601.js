// ==UserScript==
// @name        OCTE-Script
// @name:zh-TW  OCTE-腳本
// @namespace   https://github.com/kennotfindsymbol/OCTE-Script/tree/main
// @match       https://cuhk.evaluationkit.com/Respondent/*
// @grant       none
// @version     0.0.1
// @author      kennotfindsymbol
// @license     MIT
// @description Answer most questions in the OCTE questionnare automatically.
// @description:zh-tw 自動回答 OCTE 問卷中的大多數問題
// @downloadURL https://update.greasyfork.org/scripts/463601/OCTE-Script.user.js
// @updateURL https://update.greasyfork.org/scripts/463601/OCTE-Script.meta.js
// ==/UserScript==

(function () {
      'use strict';
      let optionInputs = document.querySelectorAll( "input[title='6 (Strongly Agree 非常同意)']");
      optionInputs.forEach(input => {
          input.checked = true;
          input.classList.add('rselected')
      });
      optionInputs = document.querySelectorAll( "input[title='6 (Strongly Agree)']");
      optionInputs.forEach(input => {
          input.checked = true;
          input.classList.add('rselected')
      });
      optionInputs = document.querySelectorAll( "input[title='80 - 100%");
      optionInputs.forEach(input => {
          input.checked = true;
          input.classList.add('rselected')
      });
      optionInputs = document.querySelectorAll( "input[title='6 (Always 經常)']");
      optionInputs.forEach(input => {
          input.checked = true;
          input.classList.add('rselected')
      });

    optionInputs = document.querySelectorAll( "input[title='Undergraduate']");
    optionInputs.forEach(input => {
        input.checked = true;
        input.classList.add('rselected')
    });
    optionInputs = document.querySelectorAll( "input[title='0-1.0']");
    optionInputs.forEach(input => {
        input.checked = true;
        input.classList.add('rselected')
    });
    optionInputs = document.querySelectorAll( "input[title='B+']");
    optionInputs.forEach(input => {
        input.checked = true;
        input.classList.add('rselected')
    });
})();