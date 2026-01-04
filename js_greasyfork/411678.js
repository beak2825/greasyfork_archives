// ==UserScript==
// @name         科举小抄
// @namespace    https://github.com/fuckKeju/fuckKeju
// @version      0.0.5
// @description  科举小抄 - 阿里云大学“科考”辅助工具
// @author       fuckKeju
// @match        *.developer.aliyun.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/411678/%E7%A7%91%E4%B8%BE%E5%B0%8F%E6%8A%84.user.js
// @updateURL https://update.greasyfork.org/scripts/411678/%E7%A7%91%E4%B8%BE%E5%B0%8F%E6%8A%84.meta.js
// ==/UserScript==

/* 题库数据 */
var customQuestionsDatabase = []
var useCustomQuestionsDatabase = false

async function getPageWindow () {
  return new Promise(function (resolve, reject) {
    if (window._pageWindow) {
      return resolve(window._pageWindow)
    }

    const listenEventList = ['load', 'mousemove', 'scroll', 'get-page-window-event']

    function getWin (event) {
      window._pageWindow = this
      // debug.log('getPageWindow succeed', event)
      listenEventList.forEach(eventType => {
        window.removeEventListener(eventType, getWin, true)
      })
      resolve(window._pageWindow)
    }

    listenEventList.forEach(eventType => {
      window.addEventListener(eventType, getWin, true)
    })

    /* 自行派发事件以便用最短的时候获得pageWindow对象 */
    window.dispatchEvent(new window.Event('get-page-window-event'))
  })
}
getPageWindow()

/* 修正标题字符串 */
function trimTitle (title, removeSerialNumber) {
  title = title || ''
  title = title.replace(/\s+/gi, ' ').replace(/\?{2,}/gi, ' ')
  if (removeSerialNumber) {
    title = title.replace(/^\d+\./, '')
  }
  return title
}

/* 提取答案字符串 */
function fixAnswer (answer) {
  answer = answer || ''
  return answer.replace(/^[A-Za-z]\.\s/, '').replace(/\s+--checked/, '')
}

/**
 * 判断两条题目是否为同一条题目
 * @param questionA
 * @param questionB
 */
function isTheSameQuestion (questionA, questionB) {
  let isSame = true
  const titleA = trimTitle(questionA.title, true)
  const titleB = trimTitle(questionB.title, true)

  if (titleA === titleB) {
    for (let i = 0; i < questionA.answerList.length; i++) {
      const answerA = fixAnswer(questionA.answerList[i])
      let hasSameAnswer = false
      for (let j = 0; j < questionB.answerList.length; j++) {
        const answerB = fixAnswer(questionB.answerList[j])
        if (answerA === answerB) {
          hasSameAnswer = true
          break
        }
      }

      if (!hasSameAnswer) {
        isSame = false
        break
      }
    }
  } else {
    isSame = false
  }

  // isSame && console.log(titleA, titleB, isSame)
  return isSame
}

/* 因为收集了部分异常数据，为了排查异常数据的干扰，所以需要进行是否异常的判断 */
function isNormalQuestion (question) {
  return /\s+--checked/.test(JSON.stringify(question.answerList))
}

function eachQuestionsDatabase (questionsDatabase, callback) {
  questionsDatabase.forEach((items, index) => {
    if (Array.isArray(items)) {
      items.forEach(curQuestion => {
        callback(curQuestion, index)
      })
    } else {
      callback(items, index)
    }
  })
}

function getQuestionsDatabase () {
  const subjectEl = document.querySelector('.yq-main-examination .top-info h2.title-content')
  let questionsDatabase = []
  try {
    if (subjectEl) {
      questionsDatabase = JSON.parse(localStorage.getItem(subjectEl.innerText) || '[]')
    } else {
      questionsDatabase = customQuestionsDatabase
    }
  } catch (e) {
    questionsDatabase = []
  }
  return questionsDatabase
}

/* 从混乱的题库集里提取整理后的题库 */
function extractQuestionList (questionsDatabase) {
  const questionList = []
  let addCount = 0

  function addToQuestionList (question) {
    addCount++
    // console.log(question, addCount)
    if (!question || !question.title || !Array.isArray(question.answerList)) {
      return false
    }

    let hasSameQuestion = false
    for (let i = 0; i < questionList.length; i++) {
      const questionB = questionList[i]
      if (isTheSameQuestion(question, questionB)) {
        hasSameQuestion = true
        if (isNormalQuestion(question) && question.rightAnswer === '答案正确') {
          questionList[i] = question
        } else {
          questionList[i].relatedQuestions = questionList[i].relatedQuestions || []
          questionList[i].relatedQuestions.push(question)
        }
        break
      }
    }

    if (!hasSameQuestion) {
      questionList.push(question)
    }
  }

  eachQuestionsDatabase(questionsDatabase, (question, index) => {
    addToQuestionList(question, index)
  })

  return questionList
}

// console.log(extractQuestionList(customQuestionsDatabase))

/**
 * 从某个题库数据集里查找是否存在相关的题目
 * @param questionsDatabase
 * @param questions
 */
function searchRelatedQuestions (questionsDatabase, questions) {
  let relatedQuestions = []
  eachQuestionsDatabase(questionsDatabase, (questionsA) => {
    if (isTheSameQuestion(questionsA, questions)) {
      relatedQuestions.push(questionsA)
    }
  })

  /* 查找是否存在答对的历史记录，优先显示答对的数据 */
  if (relatedQuestions.length > 1) {
    const rightAnswerArr = []
    const wrongAnswerArr = []
    relatedQuestions.forEach(question => {
      if (question.rightAnswer === '答案正确' && isNormalQuestion(question)) {
        rightAnswerArr.push(question)
      } else {
        wrongAnswerArr.push(question)
      }
    })
    relatedQuestions = rightAnswerArr.concat(wrongAnswerArr)
  }

  return relatedQuestions
}

/**
 * 判断某条题目的相关问答库里是否包含一样的答案记录
 * @param questions
 * @param relatedQuestions
 */
function hasTheSameQuestionsInRelatedQuestions (questions, relatedQuestions) {
  let hasSame = false
  relatedQuestions = relatedQuestions || []

  for (let i = 0; i < relatedQuestions.length; i++) {
    const relatedQuestion = relatedQuestions[i]
    let isSame = true
    for (let j = 0; j < relatedQuestion.answerList.length; j++) {
      const answer = relatedQuestion.answerList[j]
      const relatedQuestionChecked = /\s+--checked/.test(answer)
      const questionsChecked = /\s+--checked/.test(questions.answerList[j])
      if (relatedQuestionChecked !== questionsChecked) {
        isSame = false
        break
      }
    }

    if (isSame) {
      hasSame = true
      break
    }
  }

  return hasSame
}

/**
 * 遍历页面上的题目并进行回调,该方法必须在试题页面才能运行
 * @param callback
 * @returns {[]}
 */
function eachQuestionItem (callback) {
  const result = []
  const isExamMode = document.querySelector('.yq-main-examination .time-info')
  const items = document.querySelectorAll('.question-panel .question-item')
  if (items) {
    items.forEach(questionItemEl => {
      const type = questionItemEl.querySelector('.q-title .q-tag').innerText.trim()
      const title = trimTitle(questionItemEl.querySelector('.q-title .q-t-text').innerText.trim())
      const answerList = []
      const answerListEl = questionItemEl.querySelectorAll('.q-option .answer-text')
      answerListEl.forEach(answerEl => {
        let answer = answerEl.innerText.trim()
        const checkedEl = answerEl.parentNode.querySelector('input')
        if (checkedEl && checkedEl.checked) {
          answer += '  --checked'
        }
        answerList.push(answer)
      })

      const questionObj = {
        title,
        type,
        answerList
      }

      const pointEl = questionItemEl.querySelector('.e-point .p-detail')
      if (pointEl) {
        questionObj.point = '相关知识点：' + pointEl.innerText.trim()
      } else {
        questionObj.point = '未匹配到任何相关知识点'
      }

      const rightAnswerEl = questionItemEl.querySelector('.right-answer')
      if (rightAnswerEl) {
        questionObj.rightAnswer = rightAnswerEl.innerText.trim() || '答案正确'
      } else {
        if (isExamMode) {
          questionObj.rightAnswer = '答案未知'
        } else {
          questionObj.rightAnswer = '答案正确'
        }
      }
      result.push(questionObj)

      if (callback instanceof Function) {
        try {
          callback(questionObj, questionItemEl)
        } catch (err) {
          console.error('eachQuestionItem error:', err, questionObj, questionItemEl)
        }
      }
    })
  }
  return result
}

/* 添加相关题目内容到题目面板下面，并且添加显示隐藏事件 */
function addRelatedQuestionsDom (questionItemEl, relatedQuestions) {
  const dd = document.createElement('dd')
  dd.setAttribute('class', 'relatedQuestions')
  dd.style.marginTop = '30px'
  dd.style.display = 'none'
  dd.style.border = '1px solid #ccc'
  dd.style.borderRadius = '5px'
  // dd.style.padding = '10px'
  // dd.style.backgroundColor = '#f9f9f9'

  if (questionItemEl.querySelector('.relatedQuestions')) {
    questionItemEl.removeChild(questionItemEl.querySelector('.relatedQuestions'))
  }

  if (relatedQuestions.length) {
    const codeEl = document.createElement('pre')
    codeEl.style.border = 'none'
    codeEl.innerHTML = JSON.stringify(relatedQuestions, null, 2)
    dd.appendChild(codeEl)
    questionItemEl.appendChild(dd)
  } else {
    dd.innerText = '暂无相关题目信息，先考几遍，然后查看考试结果再试试吧'
    questionItemEl.appendChild(dd)
  }

  questionItemEl.ondblclick = function (event) {
    const relatedQuestions = questionItemEl.querySelector('.relatedQuestions')
    if (relatedQuestions) {
      if (relatedQuestions.style.display === 'none') {
        relatedQuestions.style.display = 'block'
        relatedQuestions.style.opacity = 0.4
        relatedQuestions.style.overflow = 'auto'
        relatedQuestions.style.maxHeight = '200px'
      } else {
        relatedQuestions.style.display = 'none'
      }
    }
  }
}

/**
 * 自动匹配题目并尝试自动填充对应答案
 * @param questionsDatabase
 */
function autoMatchQuestionAndCheckedAnswer (questionsDatabase) {
  eachQuestionItem((questions, questionItemEl) => {
    const relatedQuestions = searchRelatedQuestions(questionsDatabase, questions)
    if (relatedQuestions.length) {
      const relatedQuestion = relatedQuestions[0]
      if (isNormalQuestion(relatedQuestion) && relatedQuestion.rightAnswer === '答案正确') {
        relatedQuestion.answerList.forEach((answer, index) => {
          if (/\s+--checked/.test(answer)) {
            const answerLabel = questionItemEl.querySelectorAll('label.option-label')
            if (answerLabel[index]) {
              answerLabel[index].click()
            }
          }
        })
      }
    } else {
      console.log('以下题目无法匹配答案：', questions, questionItemEl, relatedQuestions)
    }
  })
}

/* 隐藏相关题目面板 */
function hideRelatedQuestions () {
  const relatedQuestionsEls = document.querySelectorAll('.relatedQuestions')
  relatedQuestionsEls.forEach(item => {
    item.style.display = 'none'
  })
}

let hasInit = false
async function fuckKeju () {
  if (hasInit) { return false }
  console.log('科举小抄 init suc')
  hasInit = true

  const subjectTitle = document.querySelector('.yq-main-examination .top-info h2.title-content').innerText
  const isExamMode = document.querySelector('.yq-main-examination .time-info')

  let questionsDatabase = getQuestionsDatabase()

  /* 使用预置数据，而非定义的数据 */
  if (useCustomQuestionsDatabase) {
    questionsDatabase = customQuestionsDatabase
  }

  let findNewQuestion = false
  const curQuestionsList = eachQuestionItem((questions, questionItemEl) => {
    const relatedQuestions = searchRelatedQuestions(questionsDatabase, questions)
    addRelatedQuestionsDom(questionItemEl, relatedQuestions)

    /* 收集新题目数据 */
    if (!isExamMode && !hasTheSameQuestionsInRelatedQuestions(questions, relatedQuestions)) {
      findNewQuestion = true
      questionsDatabase.push(questions)

      if (findNewQuestion) {
        console.log('发现新的题目，或新的答案记录：', questions)
      }
    }
  })

  /* 提示到控制面板，用于手动收集题目数据 */
  console.log(JSON.stringify(curQuestionsList, null, 2))

  /* 重新写入收集到的题目数据 */
  if (findNewQuestion) {
    // localStorage.setItem(subjectTitle, JSON.stringify(questionsDatabase))
  }
  localStorage.setItem(subjectTitle, JSON.stringify(questionsDatabase))

  /* 考试模式下双击标题尝试自填充答案 */
  const subjectEl = document.querySelector('.yq-main-examination .top-info h2.title-content')
  subjectEl.ondblclick = function () {
    if (isExamMode) {
      autoMatchQuestionAndCheckedAnswer(questionsDatabase)
    }
  }

  /* 切换题目时候，隐藏小抄 */
  const switchDoms = document.querySelectorAll('.question-num span.item')
  const switchDoms02 = document.querySelectorAll('.e-opt-panel a')

  switchDoms.forEach(el => {
    el.onmouseenter = hideRelatedQuestions
  })
  switchDoms02.forEach(el => {
    el.onclick = hideRelatedQuestions
  })

  /* 通过控制面板提取题库 */
  const pageWindow = await getPageWindow()
  pageWindow.extractQuestionList = function (print) {
    const questionsDatabase = getQuestionsDatabase()
    const questionList = extractQuestionList(questionsDatabase)
    if (print) {
      console.log(JSON.stringify(questionList, null, 2))
    }
    return questionList
  }
}

function ready (selector, fn, shadowRoot) {
  const listeners = []
  const win = window
  const doc = shadowRoot || win.document
  const MutationObserver = win.MutationObserver || win.WebKitMutationObserver
  let observer

  function $ready (selector, fn) {
    // 储存选择器和回调函数
    listeners.push({
      selector: selector,
      fn: fn
    })
    if (!observer) {
      // 监听document变化
      observer = new MutationObserver(check)
      observer.observe(shadowRoot || doc.documentElement, {
        childList: true,
        subtree: true
      })
    }
    // 检查该节点是否已经在DOM中
    check()
  }

  function check () {
    for (let i = 0; i < listeners.length; i++) {
      var listener = listeners[i]
      var elements = doc.querySelectorAll(listener.selector)
      for (let j = 0; j < elements.length; j++) {
        var element = elements[j]
        if (!element._isMutationReady_) {
          element._isMutationReady_ = true
          listener.fn.call(element, element)
        }
      }
    }
  }

  $ready(selector, fn)
}

ready('.question-panel .question-item', () => {
  /**
   * 此处必须延迟执行，题目渲染和选中渲染是异步操作
   * 需要延时等待选中的渲染成功才执行初始化逻辑
   */
  console.log('检查到进入了试题页面，即将为你初始化小抄逻辑')
  setTimeout(function () {
    fuckKeju()
  }, 1000 * 3)
})
