// ==UserScript==
// @name         自动填写问卷2
// @namespace    http://tampermonkey.net/
// @version      2
// @description  填写问卷
// @author       WT
// @icon        http://www.baidu.com
// @include       **://*/*
// @match        **://*/*
// @license       MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466315/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E9%97%AE%E5%8D%B72.user.js
// @updateURL https://update.greasyfork.org/scripts/466315/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E9%97%AE%E5%8D%B72.meta.js
// ==/UserScript==


(function() {
  'use strict';

  // 获取需要填写的问题节点
  const questions = document.querySelectorAll('.field.ui-field-contain');

  // 定义填写答案的函数
  function fillAnswer(answer, type, container) {
    switch (type) {
      case '单选':
        container.querySelector(`[name=${answer}]`).click();
        break;
      case '多选':
        const checkboxList = container.querySelectorAll(`[name=${answer}]`);
        checkboxList.forEach(checkbox => {
          checkbox.checked = false;
        });
        answer.forEach(ans => {
          container.querySelector(`[name=${answer}]`).click();
        });
        break;
      case '下拉':
        const select = container.querySelector(`[name=${answer}]`);
        for (let i = 0; i < select.options.length; i++) {
          const option = select.options[i];
          if (option.text.trim() === answer) {
            select.selectedIndex = i;
            break;
          }
        }
        break;
      case '量表':
        const radioList = container.querySelectorAll(`[name=${answer}]`);
        answer.forEach(ans => {
          radioList[ans].click();
        });
        break;
      case '填空':
        container.querySelector(`[name=${answer}]`).value = answer;
        break;
      default:
        break;
    }
  }

  // 填写每个问题的答案
  function fillForm() {

    // 是否同意的选项
    const answer1 = '选项1';

    // 性别的选项
    const answer2 = '选项2';

    // 年龄的选项
    const answer3 = '31';

    // 收入的选项
    const answer4 = '选项2';

    // 学历的选项
    const answer5 = ['选项3', '选项5', '选项7'];

    // 婚姻的选项
    const answer6 = '选项4';

    // 怀孕或孩子的选项（单选）
    const answer7 = '选项5';

    // 复杂问题的选项（多选）
    const answer8 = ['选项3', '选项7'];

    // 填写评价的答案
    const answer9 = '保密';

    // 填写邮编
    const answer10 = '404500'

    // 填写收入
    const answer11 = '30000'

    // 填写知不知道
    const answer12 = '不知道';

    const questions = document.querySelectorAll('.question');
    questions.forEach(question => {

      const questionType = question.querySelector('.questionTitle').textContent.trim();
      const questionContainer = question.querySelector('.questionContent');

      switch (questionType) {
        case '是否同意':
          fillAnswer(answer1, '单选', questionContainer);
          break;
        // 其它case语句省略，需要自己添加完整

        default:
          break;
      }
    });
  }

  // 填写表单
  fillForm();

})();









