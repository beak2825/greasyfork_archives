// ==UserScript==
// @name         FNU_syaqks
// @namespace    tawnx
// @version      0.4
// @description  实验模拟考试页面下自动答题
// @author       tawnx
// @match        https://syaqjy.fjnu.edu.cn/fjnu_ksxt/Home/Examination/*
// @match        https://syaqjy.fjnu.edu.cn/fjnu_ksxt/Home/examination/*
// @icon         https://www.google.com/s2/favicons?domain=segmentfault.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/433803/FNU_syaqks.user.js
// @updateURL https://update.greasyfork.org/scripts/433803/FNU_syaqks.meta.js
// ==/UserScript==

(async function () {
  'use strict';
  await sleep(3000)
  var ques = document.querySelectorAll('div.exam-content-topic-item')
  //console.log(ques.length)
  for (var i = 0; i < ques.length; i++) {
    var ques_describe = ques[i].querySelector('div.exam-content-topic-m').innerText
    var ques_num = await getQuesNum(ques_describe)
    var ques_ans = await getQuesAns(ques_num)
    //console.log(ques_ans)
    var options
    if (ques_ans.length > 1) {
      options = ques[i].querySelectorAll('label.el-checkbox')
    } else {
      options = ques[i].querySelectorAll('label.el-radio')
    }
    //console.log(options.length)
    for (var j = 0; j < options.length; j++) {
      console.log(options[j].innerText)
      await sleep(1000)
      if (isRight(ques_ans, options[j].innerText)) {
        options[j].click();
      }
    }

    //console.log(qus[i].innerText)

  }
  var a = 'ok'

  //var input =document.querySelector('.el-radio__original');
  //alert(input.value)
  // Your code here...
  console.log(a)
})();
async function getQuesNum(title) {
  var res = await fetch("https://syaqjy.fjnu.edu.cn/fjnu_ksxt/Center/Question/questionList.html?start=0&limit=10&seaKey=" + encodeURI(title) + "&college_id=&question_type_id=&knowledge_point_id=&professional_level_id=", {
    "headers": {
      "accept": "*/*",
      "accept-language": "zh-CN,zh;q=0.9",
      "sec-ch-ua": "\"Chromium\";v=\"94\", \"Google Chrome\";v=\"94\", \";Not A Brand\";v=\"99\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"macOS\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest"
    },
    "referrer": "https://syaqjy.fjnu.edu.cn/fjnu_ksxt/Home/examination/index.html?jump=0&index=7",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  });
  var json = await res.json();
  //console.log(json)
  return json.data.list[0].question_no
  //json = JSON.parse(json)

}
async function getQuesAns(num) {
  var res = await fetch("https://syaqjy.fjnu.edu.cn/fjnu_ksxt/Center/Question/getQuestionDetail.html?question_no=" + num, {
    "headers": {
      "accept": "*/*",
      "accept-language": "zh-CN,zh;q=0.9",
      "sec-ch-ua": "\"Chromium\";v=\"94\", \"Google Chrome\";v=\"94\", \";Not A Brand\";v=\"99\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"macOS\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest"
    },
    "referrer": "https://syaqjy.fjnu.edu.cn/fjnu_ksxt/Home/examination/index.html?jump=0&index=7",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  });
  var json = await res.json();

  //console.log(json)
  //json = JSON.parse(json)
  if (json.data.question_type == '判断题') {
    if (json.data.question_result[0].right_wrong_mark == '1') {
      return ['正确']
    } else {
      return ['错误']
    }
  } else {
    var ans = []
    for (var i = 0; i < json.data.question_result.length; i++) {
        console.log(json.data.question_result[i])
      if (json.data.question_result[i].right_wrong_mark == '1') {
        ans.push(json.data.question_result[i].choice)
      }
    }
    return ans
  }

}
function isRight(ans, option) {
  for (let i in ans) {
    if (option.indexOf(ans[i]) > 0) {
      return true
    }
  }
  return false
}
function sleep(time) {//睡觉，毫秒
  return new Promise((resolve) => setTimeout(resolve, time));
}