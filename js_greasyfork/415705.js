// ==UserScript==
// @name         光环PMP课程习题复习助手
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  光环PMP课程习题复习助手，
// @author       HuTsing <hqyx45@gmail.com>
// @match        https://yun.aura.cn/Test/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415705/%E5%85%89%E7%8E%AFPMP%E8%AF%BE%E7%A8%8B%E4%B9%A0%E9%A2%98%E5%A4%8D%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/415705/%E5%85%89%E7%8E%AFPMP%E8%AF%BE%E7%A8%8B%E4%B9%A0%E9%A2%98%E5%A4%8D%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

;(function() {
  'use strict'
  let questions = document.querySelectorAll('.st_content_txt')
  const ansArr = ['A', 'B', 'C', 'D']
  let questionArr = []
  questions.forEach((item, index) => {
    // 获取题目
    let questionBody = item.querySelector('.st_content_txt_tm')
    let question = questionBody.innerText.replace(' [单选] ', '').replace(/[\r|\n]*/gi, '')
    question = question.replace(/[\u4e00-\u9fa5]？/g, '$&' + '\n')
    // 获取答案
    let wrongAnswerObj = item.querySelector('.answer_wrong')
    wrongAnswerObj.hidden = true
    let answerObj = item.querySelector('.answer_right')
    answerObj.hidden = true
    let answer = answerObj.innerText.replace(/[\r|\n]*/gi, '')
    let answerIndex = ansArr.findIndex(ans => ans === answer)
    // 获取选项
    let radios = item.querySelectorAll('li input')
    let radiosTextArr = []
    item.querySelectorAll('li').forEach((li, ind) => {
      radiosTextArr.push(li.innerText.trim() + '\n')
      li.style = 'cursor:pointer;'
      // 处理选中选项
      li.onclick = function (e) {
        radios[answerIndex].checked = true
        radios[ind].checked = true
        radios.forEach(rad => {
          rad.disabled = true
        })
        li.style = 'color:#d83838;cursor:pointer;'
        item.querySelectorAll('li')[answerIndex].style = 'color:#3f9835;cursor:pointer;'
        answerObj.hidden = false
        wrongAnswerObj.hidden = false
        if (ind !== answerIndex) {
          item.querySelector(`#copyBtn${index}`).click()
          alert('这道题你做错第二次了哦，已经帮你复制啦，要做笔记啦！')
        }
        // 移除点击事件
        item.querySelectorAll('li').forEach(list => {
          list.onclick = () => {}
        })
      }
    })
    // 初始化选项状态
    radios.forEach((radio, ind) => {
      radio.checked = false
      radio.disabled = false
    })
    // 获取解析
    let analysis = item.querySelector('.jxxq_jx_txt').innerText.replace(/[\s]*/gi, '')
    const questionObj = {
      answerObj,
      wrongAnswerObj
    }

    // 按钮样式
    const style = 'margin-left:10px;display:inline-block;padding:0 10px;text-align:center;background:#ff7962;color:#fff;height:24px;line-height:24px;font-size:14px;box-sizing:border-box;border-radius:3px;cursor:pointer;'

    // 复制题目
    let copyBtn = document.createElement('span')
    copyBtn.innerHTML = '复制题目至剪贴板'
    copyBtn.style = style
    copyBtn.addEventListener('click', () => {
      const text = document.createElement('textarea')
      document.body.appendChild(text)
      text.value = `${question}\n\n${radiosTextArr.join('\n')}`
      text.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        console.log('复制成功')
      }
      document.body.removeChild(text)
    })
    questionBody.appendChild(copyBtn)

    // 复制题目与答案
    let copyBtn1 = document.createElement('span')
    copyBtn1.id = `copyBtn${index}`
    copyBtn1.innerHTML = '复制题目和答案至剪贴板'
    copyBtn1.style = style
    copyBtn1.addEventListener('click', () => {
      const text = document.createElement('textarea')
      document.body.appendChild(text)
      text.value = `${question}\n\n${radiosTextArr.join('\n')}\n答案：${answer}\n${analysis}`
      text.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        console.log('复制成功')
      }
      document.body.removeChild(text)
    })
    questionBody.appendChild(copyBtn1)
  })

  // 防抖函数
  const debonce = (func, delay = 80, ...args) => {
    let timer = null
    return function () {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        func.apply(this, args)
      }, delay)
    }
  }

  // 滚动显示答案
  const questionHeight = document.querySelector('.st_content_left').scrollHeight
  const singleQuestionH = questionHeight / questionArr.length
  window.onscroll = debonce(() => {
    let scrollY = window.scrollY - 370
    let index = scrollY / singleQuestionH
    for (let i = 0; i < index; i++) {
      questionArr[i].answerObj.hidden = false
      questionArr[i].wrongAnswerObj.hidden = false
    }
  })
})()
