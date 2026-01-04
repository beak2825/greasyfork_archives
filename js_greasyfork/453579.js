// ==UserScript==
// @name                 青骄知识竞赛
// @namespace            https://greasyfork.org/zh-CN/users/256346-xuehuv
// @version              20221023
// @description          青骄第二课堂小助手: 知识竞赛
// @author               XH
// @match                *://ah.2-class.com/*
// @grant                GM_addStyle
// @grant                GM_getResourceText
// @grant                GM_registerMenuCommand
// @grant                GM_getValue
// @grant                GM_setValue
// @license              GPL-3.0
// @require              https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @require              https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/toastify-js/1.11.2/toastify.min.js
// @require              https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/vue/2.6.14/vue.min.js
// @require              https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/buefy/0.9.17/components/tag/index.min.js
// @require              https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/buefy/0.9.17/components/collapse/index.min.js
// @require              https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/buefy/0.9.17/components/switch/index.min.js
// @require              https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/buefy/0.9.17/components/button/index.min.js
// @require              https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/buefy/0.9.17/components/dialog/index.min.js
// @require              https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/buefy/0.9.17/components/upload/index.min.js
// @require              https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/buefy/0.9.17/components/field/index.min.js
// @require              https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/buefy/0.9.17/components/checkbox/index.min.js
// @require              https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/xlsx/0.18.2/xlsx.mini.min.js
// @require              https://greasyfork.org/scripts/453328-lib42class2022/code/lib42class2022.js?version=1108291
// @resource toastifycss https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/toastify-js/1.11.2/toastify.min.css
// @resource buefycss    https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/buefy/0.9.17/buefy.min.css
// @downloadURL https://update.greasyfork.org/scripts/453579/%E9%9D%92%E9%AA%84%E7%9F%A5%E8%AF%86%E7%AB%9E%E8%B5%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/453579/%E9%9D%92%E9%AA%84%E7%9F%A5%E8%AF%86%E7%AB%9E%E8%B5%9B.meta.js
// ==/UserScript==
 
'use strict';
 
if (isNone($.ajax) || isNone($.isNumeric)) {
  showMessage('无法找到脚本所需的 jQuery 函数!', 'red');
  return;
}
 
function isNone(anyObj) {
  return anyObj == undefined || anyObj == null;
}
 
function showMessage(text, color) {
  Toastify({
    text,
    duration: 3 * 1000,
    newWindow: true,
    gravity: 'top',
    position: 'left',
    stopOnFocus: true,
    style: { background: color }
  }).showToast();
}

function sleep(time) {
    return new Promise(resolve => {
		setTimeout(() => {
            resolve();
            }, time);
    });
}

function processSiteScript() {
  for (let script of document.getElementsByTagName('script')) {
    if (script.innerText.indexOf('window.__DATA__') != -1) {
      eval(script.innerText);
    }
  }
}

processSiteScript();
const location = document.location;
const pathname = location.pathname;

function runWhenReady(readySelector, callback) {
  var numAttempts = 0;
  var tryNow = function() {
    var elem = document.querySelector(readySelector);
    if (elem) {
      callback(elem);
    } else {
      numAttempts++;
      if (numAttempts >= 34) {
        console.warn(`无法找到元素 [${readySelector}]，已放弃！`)
      } else {
        setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
      }
    }
  };
  tryNow();
}
 
let alphas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function fromDisplayAnswers(answerList) {
  let result = [];
  for (let answer of answerList) {
    result.push(alphas.indexOf(answer));
  }
  return result;
}
 
function removeSpaces(str) {
  return str.replace(/\s*/g, '');
}
 
function arrDiff(arr1, arr2) {
  return arr1.concat(arr2).filter((v, _, arr) => {
    return arr.indexOf(v) === arr.lastIndexOf(v);
  });
}
 
 
(function() {
  // script pre-loads
  GM_addStyle(GM_getResourceText('toastifycss')); // apply toastifycss style file
  GM_addStyle(GM_getResourceText('buefycss')); // apply buefy style file
 


  // 知识竞赛 2022
  if (pathname === '/competition') {
    let answers = [];
    for (let primary of libs.libPrimarySchool) {
      let splited = primary.answer.split('').map(k => k.toUpperCase());
      answers.push({
        question: primary.question,
        answer: splited,
        answerIndex: fromDisplayAnswers(splited)
      });
    }
    for (let middle of libs.libMiddleSchool) {
      let splited = middle.answer.split('').map(k => k.toUpperCase());
      answers.push({
        question: middle.question,
        answer: splited,
        answerIndex: fromDisplayAnswers(splited)
      });
    }
 
 
    let started = false;
    let count = 0;
    function next(answers, btn=null) {
      runWhenReady('.exam-content-question', questionElement => {
        let question = questionElement.innerText;
        question = removeSpaces(question.split('\n')[0]); // get the first line
        console.debug(question);
 
        if (!started) {
          runWhenReady('#app > div > div.home-container > div > div > div.competiotion-exam-box-all > div.exam-box > div.competition-sub > button', element => {
            started = true;
            next(answers, element);
          });
        } else {
          if (count > 0) {
            btn = document.querySelector('#app > div > div.home-container > div > div > div.competiotion-exam-box-all > div.exam-box > div.competition-sub > button.ant-btn.ant-btn-primary');
          }

        sleep(1000).then(()=>{
            btn.click()
        })

          btn.onclick = () => {
            setTimeout(() => next(answers, btn), 500);
            return;
          }
 
          // 模糊匹配
          function fuzzyFind(question) {
            let arr = question.split('');
            let len = arr.length;
            let pers = [];
            for (let k of answers) {
              let karr = k.question.split('');
              let diff = arrDiff(arr, karr);
              let diffLen = diff.length;
              let per = diffLen / len;
              pers.push({ question: k.question, unconfidence: per, answer: k });
            }
            let confidenceQuestion = pers.sort((a, b) => a.unconfidence - b.unconfidence)[0];
            let answer = confidenceQuestion.answer;
            console.debug(`模糊匹配 "${question}" ->`, confidenceQuestion);
            return answer;
          }
  
          let answer = answers.find(it => removeSpaces(it.question) == question) || fuzzyFind(question);
          let selects = document.getElementsByClassName('exam-single-content-box');
          console.debug(answer, selects);
          showMessage(`第 ${count + 1} 题答案: ${answer.answer}`, 'green');
          for (let answerIndex of answer.answerIndex) {
            let selectElement = selects[answerIndex];
            selectElement.click(); // emulate to select the answer
          }
          count++;
        }
      });
    }
 
    runWhenReady('#app > div > div.home-container > div > div > div.competiotion-exam-box-all > div.exam-box > div > div.exam_content_bottom_btn > button', startButton => {
      startButton.onclick = () => {
        showMessage(`开始知识禁赛答题`, 'pink');
        next(answers);
      };
    });
  }
 

 

})();