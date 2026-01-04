// ==UserScript==
// @name         校园安全通辅助脚本 Beta
// @namespace    https://xyaqt.houtar.me/beta
// @version      0.1.1
// @description  校园安全通辅助脚本 Beta版本 用于自动学习与测试
// @author       Houtar
// @match        *://wap.xiaoyuananquantong.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546939/%E6%A0%A1%E5%9B%AD%E5%AE%89%E5%85%A8%E9%80%9A%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/546939/%E6%A0%A1%E5%9B%AD%E5%AE%89%E5%85%A8%E9%80%9A%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC%20Beta.meta.js
// ==/UserScript==

(function () {
  'use strict';

  try {
    // Function to generate random interval (e.g., 1-2 seconds in ms; adjust min/max as needed)
    function getRandomInterval() {
      return Math.floor(Math.random() * (2 - 1 + 1) + 1) * 1000;
    }

    // Wait for the page to load and elements to be ready
    // Ensure jQuery and elements are available
    if (typeof $ !== 'undefined' && $('#nextTop').length) {
      // Remove the original click handler to bypass the built-in time check
      $('#nextTop').off('click');

      // Extract necessary variables from the page's scope (these are global or DOM-based)
      var oPicUl = $("#picBox ul");
      var w1 = $(window).width();
      var len1 = $('#picBox li').length;
      var index = 0; // We manage our own index since we're overriding

      // Attach a new click handler without the time check
      $('#nextTop').click(function () {
        if (index < len1 - 1) {
          index++;
          oPicUl.animate({
            'left': -index * w1
          });
        } else {
          handleTest(); // Call the page's handleTest function as in original
        }
      });

      // Function to auto-trigger the click
      function autoFlip() {
        $('#nextTop').click();
        // Schedule next auto-flip
        setTimeout(autoFlip, getRandomInterval());
      }

      // Start auto-flipping
      autoFlip();
    } else {
      console.log('jQuery or nextTop element not found.');
    }
  } catch {}
  try {
    handleTest();
    $(".content_div1").show();
  } catch {}

  // 获取问题数据
  async function getQuestions(attempt = 1) {
    const articleId = document.getElementById('id') ? document.getElementById('id').value : document.getElementById('articleId').value; // 文章ID
    const userId = document.getElementById('userId').value; // 用户ID
    const ah = document.getElementById('ah').value; // ah参数

    console.log(`Fetching questions for articleId: ${articleId}, userId: ${userId}, ah: ${ah}, attempt: ${attempt}`);
    try {
      const response = await fetch(`/guns-vip-main/wap/question/list?articleId=${articleId}&ah=${ah}`);
      const data = await response.json();
      if (data && data.data && data.data.list) {
        // Filter out questions where 'quesType' is '多选' (multiple-choice)
        const multipleChoiceQuestions = data.data.list.filter(q => q.quesType === '多选');

        // If there are 3 or more '多选' questions and attempt is less than 10, call getQuestions recursively
        if (multipleChoiceQuestions.length >= 3 && attempt < 10) {
          console.log('Too many multiple-choice questions. Fetching again...');
          return getQuestions(attempt + 1); // Recursive call with incremented attempt counter
        }
        console.log(`Successfully fetched ${data.data.list.length} questions.`);
        return data.data.list; // Return the list of questions
      } else {
        console.warn('No questions found or malformed data structure.');
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    }
  }

  // 提交答案
  async function submitAnswer(questionId, option, quesType) {
    const articleId = document.getElementById('id') ? document.getElementById('id').value : document.getElementById('articleId').value; // 文章ID
    const userId = document.getElementById('userId').value; // 用户ID
    const ah = document.getElementById('ah').value; // ah参数

    console.log(`Preparing to submit answer for question ${questionId}, option ${option}, type ${quesType}`);
    const formData = new FormData();
    formData.append('articleId', articleId);
    formData.append('title', document.getElementsByClassName('chapterTest_title')[0] ? document.getElementsByClassName('chapterTest_title')[0].textContent : document.getElementsByClassName('title')[0].textContent);
    formData.append('userId', userId);
    formData.append('ah', ah);
    formData.append('question', `${questionId}-${option}`);
    formData.append('quesType', (t => {
      switch (t) {
        case '单选':
          // 单选题
          return '1';
        case '多选':
          // 多选题
          return '2';
        case '判断':
          // 判断题
          return '3';
        default:
          console.warn(`Unknown question type: ${quesType}`);
          break;
      }
    })(quesType));
    try {
      const response = await fetch('/guns-vip-main/wap/unitTest', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      if (response.ok) {
        console.log(`Successfully submitted answer for Question ${questionId} with option ${option}:`, result);
        if (result.data.isSuccess) $("#nextArticleId").val() ? goNext() : goHome();
      } else {
        console.error(`Failed to submit answer for Question ${questionId} with option ${option}:`, result);
      }
    } catch (error) {
      console.error('Error during submission:', error);
    }
  }

  // 获取所有可能的答案组合，包括单选和多选题
  function getAnswerCombinations(questions) {
    const allCombinations = [];
    function generate(index, current) {
      if (index === questions.length) {
        allCombinations.push(current);
        return;
      }
      const question = questions[index];
      const options = getOptions(question.quesType, question);
      if (question.quesType === '单选' || question.quesType == '判断') {
        // 对于单选题，每次选择一个选项
        for (const option of options) {
          generate(index + 1, [...current, {
            questionId: question.id,
            option,
            quesType: question.quesType
          }]);
        }
      } else if (question.quesType === '多选') {
        // 对于多选题，生成所有选项组合
        const allCombinationsForMulti = getMultiSelectCombinations(options);
        for (const optionCombo of allCombinationsForMulti) {
          generate(index + 1, [...current, {
            questionId: question.id,
            option: optionCombo,
            quesType: question.quesType
          }]);
        }
      }
    }
    generate(0, []);
    return allCombinations;
  }

  // 获取多选题的所有选项组合
  function getMultiSelectCombinations(options) {
    const combinations = [];

    // 获取所有选项组合，包括空组合
    const totalOptions = options.length;
    for (let i = 1; i < 1 << totalOptions; i++) {
      let combo = [];
      for (let j = 0; j < totalOptions; j++) {
        if (i & 1 << j) {
          combo.push(options[j]);
        }
      }
      combinations.push(combo.join(''));
    }
    return combinations;
  }

  // 提交一个组合的答案
  async function submitCombination(combination) {
    const formData = new FormData();
    const articleId = document.getElementById('id') ? document.getElementById('id').value : document.getElementById('articleId').value;
    const userId = document.getElementById('userId').value;
    const ah = document.getElementById('ah').value;
    const title = document.getElementsByClassName('chapterTest_title')[0] ? document.getElementsByClassName('chapterTest_title')[0].textContent : document.getElementsByClassName('title')[0].textContent;
    formData.append('articleId', articleId);
    formData.append('title', title);
    formData.append('userId', userId);
    formData.append('ah', ah);
    combination.forEach(answer => {
      formData.append('question', `${answer.questionId}-${answer.option}`);
      formData.append('quesType', answer.quesType === '单选' ? '1' : answer.quesType === '多选' ? '2' : '3');
    });
    try {
      const response = await fetch('/guns-vip-main/wap/unitTest', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      if (response.ok) {
        console.log('Submitted combination:', combination.map(a => a.option).join(','), result);
        if (result.data.isSuccess) $("#nextArticleId").val() ? goNext() : goHome();
      } else {
        console.error('Failed submission:', result);
      }
    } catch (error) {
      console.error('Error submitting combination:', combination, error);
    }
  }

  // 并发提交所有答案组合
  async function submitAllAnswers() {
    const questions = await getQuestions();
    if (!questions || questions.length === 0) {
      console.log('No questions found.');
      return;
    }
    const allCombinations = getAnswerCombinations(questions);
    console.log(`Total combinations: ${allCombinations.length}`);
    if (allCombinations.length > 1000) {
      console.log('Too many combinations, skipping...');
      goNext();
      return;
    }
    ;

    // 创建所有提交请求的 Promise 数组
    const submitPromises = allCombinations.map(combination => submitCombination(combination));

    // 使用 Promise.all 并发提交所有请求
    try {
      await Promise.all(submitPromises);
      console.log('All combinations submitted successfully.');
    } catch (error) {
      console.error('Error during batch submission:', error);
    }
  }

  // 根据题目类型获取选项
  function getOptions(quesType, question) {
    const options = [];
    // console.log(`Determining options for Question ID: ${question.id}, Type: ${quesType}`);
    switch (quesType) {
      case '单选':
        // 单选题
        if (question.optionA) options.push('A');
        if (question.optionB) options.push('B');
        if (question.optionC) options.push('C');
        if (question.optionD) options.push('D');
        break;
      case '多选':
        // 多选题
        if (question.optionA) options.push('A');
        if (question.optionB) options.push('B');
        if (question.optionC) options.push('C');
        if (question.optionD) options.push('D');
        if (question.optionE) options.push('E');
        if (question.optionF) options.push('F');
        break;
      case '判断':
        // 判断题
        options.push('1'); // 对
        options.push('2'); // 错
        break;
      default:
        console.warn(`Unknown question type: ${quesType}`);
        break;
    }
    return options;
  }
  submitAllAnswers();
})();