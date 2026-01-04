// ==UserScript==
// @name         联大学堂高等学历继续教育网络学习平台，自动刷课、答题、考试
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  联大学堂高等学历继续教育网络学习平台，自动刷课答题考试，进入答题或课程页面，点击右上角红色“开始”按钮，即可自动刷课、答题、考试。
// @author       zxyong
// @match        *://*.jxjypt.cn/classroom/start*
// @match        *://*.jxjypt.cn/paper/start*
// @icon         https://kc.jxjypt.cn/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463719/%E8%81%94%E5%A4%A7%E5%AD%A6%E5%A0%82%E9%AB%98%E7%AD%89%E5%AD%A6%E5%8E%86%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E7%BB%9C%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E3%80%81%E7%AD%94%E9%A2%98%E3%80%81%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/463719/%E8%81%94%E5%A4%A7%E5%AD%A6%E5%A0%82%E9%AB%98%E7%AD%89%E5%AD%A6%E5%8E%86%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E7%BB%9C%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E3%80%81%E7%AD%94%E9%A2%98%E3%80%81%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==
 
'use strict'
 
let timer = 0
 
const btn = document.createElement('button')
;(function () {
  btn.id = 'start-btn'
  btn.style.cssText = `
      position: fixed;
      z-index: 99999;
      top: 0;
      right: 0;
      padding: 10px 50px;
      background: red;
      color: white;
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 0 10px #999;
    `
  btn.innerText = '开始'
 
  btn.addEventListener('click', () => {
    if (timer) {
      clearInterval(timer)
      timer = 0
      btn.innerText = '开始'
    } else {
      btn.innerText = '暂停'
      const path = location.pathname
      if (path === '/classroom/start') {
        // 视频课
        doVideoCourse()
      } else if (path === '/paper/start') {
        // 课程作业或考试
        doPaper()
      } else {
        btn.innerText = '开始'
      }
    }
  })
  document.body.appendChild(btn)
})()
 
/** 视频课 */
function doVideoCourse() {
  const courseList = document.querySelectorAll('.course-l .course-list-txt')
  const unplayedList = [] // 待做课程id
  courseList.forEach(item => {
    const sections = item.querySelectorAll('dd.z-gery-icon')
    sections.forEach(section => {
      const unplay = section.querySelector('.fa-youtube-play')
      if (unplay) {
        unplayedList.push(section.dataset.jieId)
      }
    })
  })
  // console.log(unplayedList)
 
  function nextVideo() {
    if (unplayedList.length < 1) {
      clearInterval(timer)
      alert('当前页面全部课程已完成')
      btn.innerText = '开始'
      return
    }
    const section = document.querySelector(
      `dd[data-jie-id="${unplayedList[0]}"]`
    )
    section.parentElement.querySelector('dt.z-gery-icon').click()
    section.click()
    setTimeout(async () => {
      const video = document
        .querySelector('#video-content')
        .querySelector('video')
      if (video) {
        video.play()
      }
 
      const question = document.querySelector('#question-area .m-question')
      // console.log(question)
      const qid = question.dataset.qid
      const answer = await getAnswerByQid(qid)
      answer.forEach(a => {
        document
          .querySelector(`.m-question-option[data-value="${a}"]`)
          .click()
      })
 
      unplayedList.shift()
      console.log(`Done ${qid}, ${unplayedList.length} left`)
    }, 1000)
  }
 
  setTimeout(nextVideo, 1000)
  timer = setInterval(nextVideo, 1000 * 5)
}
 
/** 课程作业或考试 */
let qIndex = 0
function doPaper() {
  const qList = document.querySelectorAll('#questionModule > ul > li')
  timer = setInterval(async () => {
    if (qIndex === qList.length) {
      clearInterval(timer)
      document.querySelector('#btn_submit').click()
      btn.innerText = '开始'
      return
    }
 
    const qid = qList[qIndex].querySelector(
      `input[name="qid[${qIndex}]"]`
    ).value
    const pqid = qList[qIndex].querySelector(
      `input[name="pqid[${qIndex}]"]`
    ).value
    const answer = await getAnswerByQid(pqid)
 
    const options = qList[qIndex].querySelector('dl.sub-answer')
    if (options) {
      // 选择 判断题
      answer.forEach(a => {
        options.querySelector(`dd[data-value="${a}"]`).click()
      })
    } else {
      // 填空 简答
      qList[qIndex].querySelector('.mater-respond textarea').value = answer
    }
    qIndex++
    console.log(`Done ${qid}, ${qList.length - qIndex} left`)
  }, 1000)
}
 
/** 获取答案 */
async function getAnswerByQid(qid) {
  // https://kc.jxjypt.cn/paper/question/resolve/txt?uid=${uid}&pqid=${qid}
  const uid = document.querySelector('#captchaId').value
  const data = await fetch(`https://kc.jxjypt.cn/paper/question/resolve/txt?uid=${uid}&pqid=${qid}&_=${Date.now()}`)
  const json = await data.json()
  console.log('=========================================')
  console.log(json)
 
  const {rightAnswer, plainText} = json.data
 
  let answer
  if (plainText) {
    // 填空 简答
    answer = rightAnswer
  } else {
    if (rightAnswer == '错') {
      // 判断题
      answer = ['错误']
    } else if (rightAnswer == '对') {
      answer = ['正确']
    } else {
      // 选择题
      answer = rightAnswer.trim().split('')
    }
  }
 
  return answer
}
