// ==UserScript==
// @name         口语 100 破解
// @namespace    PencilX Studio
// @version      1.0.0
// @description  破解口语 100 听说测试
// @author       PencilX Studio
// @license      MIT
// @match        *://ah.kouyu100.com/*
// @icon         https://static2.kouyu100.com/favicon.ico
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @require      https://greasyfork.org/scripts/441806/code/jquery-tools.js
// @downloadURL https://update.greasyfork.org/scripts/441808/%E5%8F%A3%E8%AF%AD%20100%20%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/441808/%E5%8F%A3%E8%AF%AD%20100%20%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

function getInfo() {
  // 获取必要信息
  const schoolPattern = /^\/(.+)\/.*/;
  const resSchoolName = schoolPattern.exec(location.pathname);
  const schoolNameId = resSchoolName[1];
  const examId = $('#examId').val();
  return { examId, schoolNameId };
}

function loadAnswer() {
  // 获取答案并加载
  const info = getInfo();
  $.ajax({
    type: 'get',
    url: `//ah.kouyu100.com/${info.schoolNameId}/findTitleAnswerText.action?listenExamTitleText.examId=${info.examId}`,
    dataType: 'json',
    success: function (response) {
      const answers = response.listenExamTitleTextList;
      for (const answer of answers) {
        var answerElement = $(`[titleid=${answer.titleId}]`)[0];
        var answerDiv = document.createElement('div');
        answerDiv.style.color = 'red';
        answerDiv.style.fontWeight = 'bold';
        answerDiv.innerText = `【答案】${answer.content1}`;
        answerElement.appendChild(answerDiv);
      }
    },
  });
}

function main() {
  const path = location.pathname;
  if (/^\/.*\/spokenExam.action$/.test(path)) {
    loadAnswer();
  }
}

$('#viewGroupList').wait(main);

// 切换试卷时的处理方式，因为是元素异步加载的，所以要在大项加载后重新绑定事件
$('.not_cur_exam').click(loadAnswer);
$('.unchecked').click(() => {
  $('.not_cur_exam').click(loadAnswer);
});

setInterval(function () {
  // 开启跳过放音功能
  const tip = $('.record-tips').text();
  if ($('.test').css('display') == 'inline-block') {
    $('.skip').css('display', 'none');
  } else {
    $('.skip').css('display', 'inline-block');
    if (tip.indexOf('正在录音') == -1) {
      $('.skip').removeClass('disabled');
    } else {
      $('.skip').addClass('disabled');
    }
  }
}, 20);
