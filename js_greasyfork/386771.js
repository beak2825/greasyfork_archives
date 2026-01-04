// ==UserScript==
// @name         🧰蓝墨云工具箱 Mosoteach Toolkit
// @namespace    https://blog.younnt.one
// @version      1.4.6
// @license      MIT
// @description  让蓝墨云更加强大、易用！Make Mosoteach more powerful & user-friendly !
// @author       Younntone
// @match        https://www.mosoteach.cn/web/index.php?c=interaction_quiz&m=person_quiz_result&clazz_course_id=*&id=*&order_item=group&user_id=*
// @match        https://www.mosoteach.cn/web/index.php?c=interaction_quiz&m=person_quiz_result&clazz_course_id=*&id=*&order_item=group
// @match        https://www.mosoteach.cn/web/index.php?c=interaction_quiz&m=reply&clazz_course_id=*&id=*&order_item=group
// @match        https://www.mosoteach.cn/web/index.php?c=*&m=index&clazz_course_id=*
// @match        https://www.mosoteach.cn/web/index.php?c=res&m=index&clazz_course_id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386771/%F0%9F%A7%B0%E8%93%9D%E5%A2%A8%E4%BA%91%E5%B7%A5%E5%85%B7%E7%AE%B1%20Mosoteach%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/386771/%F0%9F%A7%B0%E8%93%9D%E5%A2%A8%E4%BA%91%E5%B7%A5%E5%85%B7%E7%AE%B1%20Mosoteach%20Toolkit.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 获取 当前页面
  const a = $('<a>', { href: window.location.search });

  const c = a.prop('search').split('?c=')[1].split('&')[0];

  const m = a.prop('search').split('&m=')[1].split('&')[0];

  if (m == 'index') {
    let classes = $('.cc-name')[0].children[0].innerText;
    $('.cc-name')[0].children[0].innerText = $(
      '.cc-name'
    )[0].children[2].innerText;
    $('.cc-name')[0].children[2].innerText = classes;
  }

  // 获取 课程 id
  let clazzCourseId = a
    .prop('search')
    .split('&clazz_course_id=')[1]
    .split('&')[0];

  // 判断 当前页面
  switch (c) {
    case 'interaction':
      /**
       * *---------------------------------------*
       * * 为 已结束 的 测试活动 添加直接查看分析的按钮 *
       * *---------------------------------------*
       */

      // 获取 活动节点集合
      let activities = $('.interaction-row');

      // 遍历所有活动
      for (let index = 0; index < activities.length; index++) {
        const activity = activities[index];
        const activityType = activity.getAttribute('data-type');
        const quizStatus =
          activity.children[1].children[0].children[0].className;
        // 判断 每个活动节点是否为测试
        if (activityType === 'QUIZ') {
          let id = activity.getAttribute('data-id');
          // 如果 是测试并且已经结束
          if (quizStatus === 'interaction-status end') {
            // 添加 直接打开分析页面的按钮
            let url = `https://www.mosoteach.cn/web/index.php?c=interaction_quiz&m=person_quiz_result&clazz_course_id=${clazzCourseId}&id=${id}&order_item=group`;
            let button = document.createElement('div');
            button.className = 'interaction-status processing';
            button.innerText = '习题分析';
            button.addEventListener('click', () => {
              window.open(url);
              event.stopPropagation();
            });
            activity.children[1].children[0].appendChild(button);
          }
          // 如果 是测试并且本地有答案
          if (JSON.parse(window.localStorage.getItem(id))) {
            let button = document.createElement('div');
            button.className = 'interaction-status processing';
            button.innerText = '有答案';
            activity.children[1].children[0].appendChild(button);
          }
        }
      }
      break;

    case 'interaction_quiz':
      /**
       * *-------------------------------------*
       * * 为 测试分析 添加导出全部题目到粘贴板的按钮 *
       * *-------------------------------------*
       */

      const id = a.prop('search').split('&id=')[1].split('&')[0];

      if (m === 'reply') {
        $('[style="text-align:center;"]').attr(
          'style',
          'position: sticky;text-align:center;bottom: 100px;'
        );

        let _answersList = JSON.parse(window.localStorage.getItem(id));

        let quizList = $('.student-topic-row');

        // 创建标示
        var copyButton = document.createElement('button');
        if (_answersList) {
          copyButton.innerHTML = '该测试有答案';
          copyButton.style =
            'width: 100px;height: 50px;position: fixed;top: 400px;left: 30px;background-color: green;';
          copyButton.addEventListener('click', function () {
            for (const key in _answersList) {
              if (_answersList.hasOwnProperty(key)) {
                const answers = _answersList[key];
                for (let i = 0; i < quizList.length; i++) {
                  const quiz = quizList[i];
                  if (
                    quiz.children[0].children[1].children[1].innerText.indexOf(
                      key
                    ) === 0
                  ) {
                    for (let j = 0; j < answers.length; j++) {
                      const answer = answers[j];
                      switch (answer) {
                        case 'A':
                          quizList[i].children[2].click();
                          break;

                        case 'B':
                          quizList[i].children[3].click();
                          break;

                        case 'C':
                          quizList[i].children[4].click();
                          break;

                        case 'D':
                          quizList[i].children[5].click();
                          break;

                        case 'E':
                          quizList[i].children[6].click();
                          break;

                        case 'F':
                          quizList[i].children[7].click();
                          break;

                        case 'G':
                          quizList[i].children[8].click();
                          break;

                        case 'H':
                          quizList[i].children[9].click();
                          break;

                        case 'I':
                          quizList[i].children[10].click();
                          break;

                        case 'J':
                          quizList[i].children[11].click();
                          break;

                        case 'K':
                          quizList[i].children[12].click();
                          break;

                        case 'L':
                          quizList[i].children[13].click();
                          break;

                        case 'M':
                          quizList[i].children[14].click();
                          break;

                        default:
                          break;
                      }
                    }
                  }
                }
              }
            }
          });
        } else {
          copyButton.innerHTML = '该测试无答案';
          copyButton.style =
            'width: 100px;height: 50px;position: fixed;top: 400px;left: 30px;background-color: red;';
        }

        // 挂载 按钮节点
        document.body.appendChild(copyButton);
      } else {
        let _answersList = JSON.parse(window.localStorage.getItem(id));

        // 创建 按钮节点
        var copyButton = document.createElement('button');
        if (_answersList) {
          copyButton.innerHTML = '该测试已有答案，导出试题';
          copyButton.style =
            'width: fit-content;padding: 30px;height: 50px;position: fixed;top: 400px;left: 30px;background-color: green;';
        } else {
          copyButton.innerHTML = '该试题无答案，点击导出试题并保存答案';
          copyButton.style =
            'width: fit-content;padding: 30px;height: 50px;position: fixed;top: 400px;left: 30px;background-color: red;';
        }
        copyButton.addEventListener('click', function () {
          getQuiz(id);
        });

        // 挂载 按钮节点
        document.body.appendChild(copyButton);
      }

      break;

    case 'res':
      /**
       * *-------------------------------------*
       * * 为 资源 添加是否可拖动进度条开关         *
       * *-------------------------------------*
       */
      const dragSwitch = $(
        '<i class="icon-ok-circle" id="dragable" style="margin-left: 10px;"></i><span>视频进度可拖拽</span>'
      );

      $('div[data-mime=video]').attr('data-drag', 'Y');

      dragSwitch.click(() => {
        if ($('#dragable').attr('class') == 'icon-circle-blank') {
          $('#dragable').attr('class', 'icon-ok-circle');

          $('div[data-mime=video]').attr('data-drag', 'Y');
        } else {
          $('#dragable').attr('class', 'icon-circle-blank');

          $('div[data-mime=video]').attr('data-drag', 'N');
        }
      });

      $("div[style='display:inline-block;']").after(dragSwitch);

      /**
       * *-------------------------------------*
       * * 点开视频再关闭即可实现看完              *
       * *-------------------------------------*
       */
      $.ajaxSetup({
        beforeSend: function () {
          console.log(arguments[1].data);
          let data = arguments[1].data;
          let encodedData = '';
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              let value = data[key];
              if (key.includes('watch_to')) {
                value = data.duration;
              }
              encodedData = encodedData.concat(`&${key}=${value}`);
            }
          }
          arguments[1].data = encodedData.substring(1, encodedData.length);
        },
        processData: false,
      });
      break;

    default:
      break;
  }

  const getQuiz = (id) => {
    const quizTitle = $('.info-con')[0].children[0].innerText;
    const quizCollection = $('.topic-item');
    const quizAnswerCollection = $('.answer-l');
    let quizList = [];
    let answerList = {};
    // 获取 所有题目
    for (let quizIndex = 0; quizIndex < quizCollection.length; quizIndex++) {
      const quiz = quizCollection[quizIndex];
      const num = quiz.children[0].children[0].innerHTML;
      const question =
        quiz.children[0].children[1].children[1].children[0].innerText;
      const optionCount =
        quiz.children[0].children[1].children[2].childElementCount;
      let options = [];

      // 获取 该题所有选项
      for (let optionIndex = 0; optionIndex < optionCount; optionIndex++) {
        const optionMark =
          quiz.children[0].children[1].children[2].children[optionIndex]
            .children[0].innerText;
        const option =
          quiz.children[0].children[1].children[2].children[optionIndex]
            .children[1].innerText;
        options.push(`
             ${optionMark} ${option}`);
      }

      // 获取 答案
      let answer = quizAnswerCollection[quizIndex].children[0].innerHTML;

      quizList.push(`
       
       
           ${num}. ${question}  ${answer}
           ${options}`);

      answerList[question] = answer;
    }

    // 整理内容
    var detail = `题目标题: ${quizTitle}
       题目总数: ${quizCollection.length}
       题目: ${quizList}
       `;

    var oInput = document.createElement('textarea');
    oInput.value = detail;
    document.body.appendChild(oInput);
    oInput.select();
    document.execCommand('Copy');
    oInput.className = 'oInput';
    oInput.style.display = 'none';
    alert('已复制到粘贴板');
    window.localStorage.setItem(id, JSON.stringify(answerList));
    copyButton.style =
      'width: fit-content;padding: 30px;height: 50px;position: fixed;top: 400px;left: 30px;background-color: green;';
  };
})();
