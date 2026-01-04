// ==UserScript==
// @name         好医生自动听课
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  好医生自动听课代码
// @author       EVILAND
// @match        *://cme.haoyisheng.com/cme/polyv.*
// @match        *://cme.haoyisheng.com/cme/study2.*
// @match        *://cme.haoyisheng.com/cme/exam.*
// @match        *://cme.haoyisheng.com/cme/examQuizFail.*
// @match        *://cme.haoyisheng.com/cme/examQuizPass.*
// @match        *://cme.haoyisheng.com/cme/course.*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=haoyisheng.com    
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @require      https://cdn.jsdelivr.net/jquery/latest/jquery.min.js
// @license      eviland
// @downloadURL https://update.greasyfork.org/scripts/479499/%E5%A5%BD%E5%8C%BB%E7%94%9F%E8%87%AA%E5%8A%A8%E5%90%AC%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/479499/%E5%A5%BD%E5%8C%BB%E7%94%9F%E8%87%AA%E5%8A%A8%E5%90%AC%E8%AF%BE.meta.js
// ==/UserScript==


(function () {


  'use strict';
  var ansStr = []; //正确答案列表

  // 获取正确答案

  if (GM_getValue('answer') != null) {
    ansStr = GM_getValue('answer');
  }

  // 填写答案的函数

  function fillAnswers(answers) {
    // 遍历每个问题
    $('.exam_list li').each(function (index) {
      // 找到问题的选项
      var options = $(this).find('input[type=radio], input[type=checkbox]');
      // 获取正确答案
      var correctAnswer = answers[index];
      // 遍历选项并填写答案
      options.each(function () {
        var value = $(this).val();
        // 根据正确答案选择选项
        if (correctAnswer.indexOf(value) > -1) {
          $(this).prop('checked', true);
        }
      });
    });
  }

  //主函数

  if (window.location.pathname.includes('course')) {  //听课目录页面
    // 获取课程信息
    var m = $('.wxx , .xxz').length;
    var n = $('.kstg').length;
    if (m == 0) { return };
    var t = '已学习' + n + '节课，尚未完成' + m + '节课，是否开始自动听课？';
    //弹出提示框，如果点击确定，则点击第一个课程
    if (confirm(t)) {
      $('.wxx , .xxz')[0].click();
    }

  } else if (window.location.pathname.includes('examQuizFail')) { //答案页面
    // 提取正确答案
    $(".answer_list h3").each(function () {
      var answer = $(this).text();
      var correctAnswer = answer.match(/正确答案：([A-Z]+[\.]?)/);
      if (correctAnswer) {
        ansStr.push(correctAnswer[1]);
      }
    });
    //console.log(ansStr);
    GM_setValue('answer', ansStr);
    // 提交答案
    $('#cxdt')[0].click();//此处必须加上[0]，因为$调用的是oncllick方法，而不是click事件，加上【0】，或者用原生getel……byID（）。click（）

  } else if (window.location.pathname.includes('examQuizPass')) { //答题通过页面
    $('.show_exam_btns a')[0].click();

  } else if (window.location.pathname.includes('exam')) { //考试页面
    if (ansStr.length != 0) {
      //已经获得答案，开始答题
      console.log(ansStr);
      fillAnswers(ansStr);
      ansStr = [];
      GM_deleteValue('answer');
      form1.submit();
    } else {
            //    if(confirm("开始自动答题？")){
      //没有正确答案，开始胡乱答题
      var aQus = form1.ques_list.value.split(",");
      for (var i = 0; i < aQus.length; i++) {
        document.getElementsByName("ques_" + aQus[i])[0].checked = true
      };
      form1.submit();
      //         }
    }

  } else {  //听课页面
    //    if(confirm("免听课进入答题页面？")){
    playEnd();
    $('.s_r_bts .cur').click();
    //    }
  }


})();