// ==UserScript==
// @name         半自动微认证考试
// @namespace    https://github.com/Ocyss
// @version      2025-08-26
// @description  严谨分享，仅供自用!。
// @author       Ocyss
// @license      GPL-3.0
// @match        https://connect.huaweicloud.com/courses/exam/*
// @match        https://edu.huaweicloud.com/certifications/*
// @match        https://edu.huaweicloud.com/signup/*
// @match        https://www.huaweicloud.com

// @icon         https://www.google.com/s2/favicons?sz=64&domain=huaweicloud.com

// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/541430/%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%BE%AE%E8%AE%A4%E8%AF%81%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/541430/%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%BE%AE%E8%AE%A4%E8%AF%81%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==

/*
报名地址(2025.8.25，带AFF) :
https://edu.huaweicloud.com/signup/8a8472ec5f054f1596747afbe3e219f5?medium=share_kfzlb&invitation=af4e0c9ec56147bd8dc492d7afbcadaa

如果跨域可在UserScript当中添加如下代码，并替换 GM_chat 中的 fetch 为 GM_fetch

// @connect      *
// @grant        GM.xmlHttpRequest
// @require      https://cdn.jsdelivr.net/npm/@trim21/gm-fetch@0.3.0

*/

const 网络劫持Prompt = (x) => `## 角色设定
你是一位正在参加华为云认证考试的考生

## 任务要求
我将向你提供华为云认证的考试题目，然后请你直接给出准确答案+题号。

## 输出示例

A: 类型丰富
B: 弹性伸缩
C: 高安全、高可靠

## 参考题库
${GM_getValue('tk', '')}

## 输入题目
${x}`

const 快捷键Prompt = (x) => `## 角色设定
你是一位正在参加华为云认证考试的考生

## 任务要求
我将向你提供华为云认证的考试题目，你需要先对题目进行判断，是单选题还是多选题，然后直接给出准确答案+索引序号(1起始)，换行符表示新的选项。
请无视 上一题下一题 字样

## 输出示例

1: 类型丰富
2: 弹性伸缩
4: 高安全、高可靠

## 参考题库
${GM_getValue('tk', '')}

## 输入题目
${x}`

function initBlockingFeatures() {
  const stepEvent = (e) => {
    e.stopImmediatePropagation()
    e.stopPropagation()
    e.preventDefault()
    return false
  }
  // 伪造document.visibilityState为visible，始终显示为可见状态
  Object.defineProperty(unsafeWindow.document, 'visibilityState', {
    configurable: true,
    get: function () {
      return 'visible'
    },
  })

  // 伪造document.hidden为false，始终显示为非隐藏状态
  Object.defineProperty(unsafeWindow.document, 'hidden', {
    configurable: true,
    get: function () {
      return false
    },
  })

  ;[
    'blur', // 阻止焦点事件（失去焦点和获取焦点）
    'focus',
    'focusin',
    'focusout', // 阻止页面显示和隐藏事件
    'pageshow',
    'pagehide',
    'visibilitychange', // 阻止可见性变化事件
  ].forEach((k) => {
    unsafeWindow.addEventListener(k, stepEvent, true)
  })

  // 阻止可见性变化事件
  unsafeWindow.document.addEventListener('visibilitychange', stepEvent, true)

  // 阻止屏幕方向变化监听
  if (unsafeWindow.screen.orientation) {
    unsafeWindow.screen.orientation.addEventListener('change', stepEvent, true)
  }

  // 伪装全屏状态 - 让页面认为已经进入全屏
  Object.defineProperty(unsafeWindow.document, 'fullscreenElement', {
    configurable: true,
    get: function () {
      return unsafeWindow.document.documentElement
    },
  })

  Object.defineProperty(unsafeWindow.document, 'fullscreenEnabled', {
    configurable: true,
    get: function () {
      return true
    },
  })

  // 覆盖requestFullscreen使其无效，但返回成功状态
  unsafeWindow.Element.prototype.requestFullscreen = function () {
    return new Promise((resolve, reject) => {
      // 不执行真正的全屏，直接resolve让调用方认为成功
      resolve()
    })
  }

  // 覆盖exitFullscreen使其无效
  unsafeWindow.document.exitFullscreen = function () {
    return new Promise((resolve, reject) => {
      // 不执行真正的退出全屏，直接resolve
      resolve()
    })
  }

  // 阻止fullscreenchange事件
  unsafeWindow.document.addEventListener('fullscreenchange', stepEvent, true)

  console.log('切屏检测阻止功能已启用')
}

async function GM_chat(msg, opt = {}) {
  const { baseUrl, apiKey, model } = GM_getValue('gm_chat', {})
  if (!baseUrl | !apiKey | !model) {
    throw Error(`GM_chat没有进行配置。`)
  }
  const { stream = false, streamSplit = true, console: enableConsole = true } = opt

  const messages = typeof msg === 'string' ? [{ role: 'user', content: msg }] : msg

  const requestBody = {
    model,
    messages: messages,
    stream: stream,
  }

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    if (stream) {
      return
    } else {
      return await handleNormalResponse(response, { enableConsole })
    }
  } catch (error) {
    console.error('GM_chat 调用失败:', error)
    throw error
  }
}

async function handleNormalResponse(response, { enableConsole }) {
  const data = await response.json()
  const message = data.choices[0].message.content

  if (enableConsole) {
    console.log('OpenAI Response:', message)
  }

  return {
    message,
    usage: data.usage,
  }
}

function createReactiveObject(initialState) {
  let state = { ...initialState }
  return new Proxy(state, {
    get(target, key) {
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      return true
    },
  })
}

function createToggleMenu(config) {
  const { menuName, onStart, onStop, defaultEnabled = false } = config
  const storageKey = `toggle_${menuName}`
  const initialEnabled = GM_getValue(storageKey, defaultEnabled)

  const state = createReactiveObject({
    isEnabled: initialEnabled,
    menuCommandId: null,
  })

  function updateMenuCommand() {
    if (state.menuCommandId) {
      GM_unregisterMenuCommand(state.menuCommandId)
    }

    GM_setValue(storageKey, state.isEnabled)

    if (state.isEnabled) {
      state.menuCommandId = GM_registerMenuCommand(
        `🟢${menuName}(已启用)`,
        () => {
          state.isEnabled = false
          onStop(state)
          updateMenuCommand()
        },
        {
          autoClose: false,
        },
      )
    } else {
      state.menuCommandId = GM_registerMenuCommand(
        `🔴${menuName}(未启用)`,
        () => {
          state.isEnabled = true
          onStart(state)
          updateMenuCommand()
        },
        {
          autoClose: false,
        },
      )
    }
  }

  if (initialEnabled) {
    onStart(state)
  }

  updateMenuCommand()
  return state
}

// 全局题目存储对象
const globalQuestions = new Proxy(
  {},
  {
    set(target, key, value) {
      target[key] = value
      // console.log(`题目 ${key} 已保存:`, value)
      return true
    },
  },
)

function logQA(question, answer) {
  console.log(`
📚════════❓❓❓════════📚
${question}
📚════════✅✅✅════════📚
${answer}
📚════════🎆🎆🎆════════📚
`)
}

function parseQuestionInfo(questionText, answerText) {
  const matches = questionText.match(/^(\d+)\/(判断|单选|多选):\s*(.+)/)
  if (matches) {
    return {
      num: matches[1],
      type: matches[2],
      question: matches[3],
      answer: answerText || '暂无答案',
    }
  }
  return null
}

function createAnswerCard() {
  const cardHTML = `
    <div id="hwAnswerCard" style="
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      margin: 15px 10px;
      overflow: hidden;
      position: relative;
      font-family: Arial, sans-serif;
    ">
      <div id="hwCardHeader" style="
        padding: 0 15px;
        height: 50px;
        font-size: 16px;
        display: flex;
        align-items: center;
        background-color: #4a6baf;
        color: white;
      ">
        <span id="hwQuestionNum" style="
          font-weight: bold;
          color: #fff;
          margin-right: 5px;
          background-color: rgba(255,255,255,0.2);
          padding: 2px 6px;
          border-radius: 4px;
        "></span>
        <span id="hwQuestionType" style="
          font-weight: bold;
          color: #fff;
          margin-right: 10px;
          background-color: rgba(255,255,255,0.2);
          padding: 2px 6px;
          border-radius: 4px;
        "></span>
        <span id="hwQuestionTitle" style="
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0 5px;
        "></span>
      </div>
      <div style="
        padding: 10px 10px 25px 10px;
        position: relative;
        min-height: 60px;
      ">
        <div id="hwAnswerContent" style="
          font-family: Arial, sans-serif;
          color: #333;
          line-height: 1.6;
        "></div>
        <div style="
          position: absolute;
          right: 15px;
          bottom: 10px;
          font-size: 12px;
          color: #999;
        "><a href="https://github.com/Ocyss" target="_blank">华为云半自动认证脚本 by Ocyss</a></div>
      </div>
    </div>
  `
  return cardHTML
}

function highlightAnswerOptions(text) {
  // 多种ABCD高亮模式的正则表达式
  const patterns = [
    // A选项、B选项等
    {
      regex: /([A-Z])选项/g,
      style: 'color: #e74c3c; font-weight: bold; background-color: #ffeaa7; padding: 2px 4px; border-radius: 3px;',
    },
    // 选项A、选项B等
    {
      regex: /选项([A-Z])/g,
      style: 'color: #e74c3c; font-weight: bold; background-color: #ffeaa7; padding: 2px 4px; border-radius: 3px;',
    },
    // 答案：后面的ABCD（支持逗号、空格分隔）
    {
      regex: /(答案[：:])\s*([A-Z](?:\s*[,，]\s*[A-Z])*)/g,
      style: 'color: #27ae60; font-weight: bold; background-color: #d5f4e6; padding: 2px 4px; border-radius: 3px;',
    },
    // 单独的A:、B:等选项标识
    { regex: /^([A-Z][:：])/gm, style: 'color: #1890ff; font-weight: bold;' },
    // 括号内的选项说明，如（解析：A选项...）
    { regex: /（[^）]*([A-Z])选项[^）]*）/g, style: 'color: #8e44ad; font-style: italic;' },
    // 解析中的选项引用
    { regex: /解析[：:].*?([A-Z])选项/g, style: 'color: #8e44ad; font-style: italic;' },
  ]

  let highlightedText = text

  patterns.forEach((pattern) => {
    highlightedText = highlightedText.replace(pattern.regex, (match, ...groups) => {
      if (pattern.regex.source.includes('答案[：:]')) {
        // 特殊处理答案格式
        return `<span style="${pattern.style}">${groups[0]}${groups[1]}</span>`
      } else if (pattern.regex.source.includes('选项')) {
        // 处理选项格式
        return `<span style="${pattern.style}">${match}</span>`
      } else if (pattern.regex.source.includes('^([A-Z][:：])')) {
        // 处理选项标识
        return `<span style="${pattern.style}">${match}</span>`
      } else {
        // 其他格式
        return `<span style="${pattern.style}">${match}</span>`
      }
    })
  })

  return highlightedText
}

function updateAnswerCard(questionData) {
  const numEl = document.getElementById('hwQuestionNum')
  const typeEl = document.getElementById('hwQuestionType')
  const titleEl = document.getElementById('hwQuestionTitle')
  const contentEl = document.getElementById('hwAnswerContent')
  const headerEl = document.getElementById('hwCardHeader')

  if (!numEl || !typeEl || !titleEl || !contentEl || !headerEl) return

  numEl.textContent = questionData.num
  typeEl.textContent = questionData.type
  titleEl.textContent = questionData.question
  titleEl.title = questionData.question

  // 根据题目类型设置不同的头部样式
  headerEl.style.backgroundColor = questionData.type === '多选' ? '#8e44ad' : '#4a6baf'

  // 处理答案内容
  contentEl.innerHTML = ''

  if (questionData.answer === '暂无答案') {
    const noAnswerDiv = document.createElement('div')
    noAnswerDiv.style.color = '#999'
    noAnswerDiv.style.fontStyle = 'italic'
    noAnswerDiv.textContent = '暂无答案，请等待AI分析...'
    contentEl.appendChild(noAnswerDiv)
  } else {
    // 使用增强的高亮功能处理整个答案文本
    const highlightedAnswer = highlightAnswerOptions(questionData.answer)

    // 按行分割并处理
    const lines = highlightedAnswer.split('\n')
    lines.forEach((line) => {
      const lineDiv = document.createElement('div')
      lineDiv.style.margin = '8px 0'
      lineDiv.style.lineHeight = '1.6'

      // 检查是否是选项行（A:、B:等开头）
      const optionMatch = line.match(/^<span[^>]*>([A-Za-z][:：])<\/span>/)
      if (optionMatch) {
        // 如果已经被高亮处理，直接使用HTML
        lineDiv.innerHTML = line
      } else {
        // 检查原始文本是否是选项格式
        const originalOptionMatch = line.match(/^([A-Za-z][:：])\s*/)
        if (originalOptionMatch && !line.includes('<span')) {
          // 手动处理未被高亮的选项
          const optionText = originalOptionMatch[0]
          const restOfLine = line.substring(originalOptionMatch[0].length)

          lineDiv.innerHTML = `<span style="color: #1890ff; font-weight: bold;">${optionText}</span>${restOfLine}`
        } else {
          // 普通行，可能包含其他高亮内容
          lineDiv.innerHTML = line
        }
      }

      contentEl.appendChild(lineDiv)
    })
  }
}

;(function () {
  'use strict'
  unsafeWindow._chat = GM_chat
  initBlockingFeatures()

  GM_registerMenuCommand('⚙️ OpenAI配置', () => {
    const currentConfig = GM_getValue('gm_chat', {})
    const baseUrl = prompt('请输入 Base URL:', currentConfig.baseUrl || 'https://api.openai.com/v1')
    if (baseUrl === null) return

    const apiKey = prompt('请输入 API Key:', currentConfig.apiKey || '')
    if (apiKey === null) return

    const model = prompt('请输入模型名称:', currentConfig.model || 'gpt-3.5-turbo')
    if (model === null) return
    GM_setValue('gm_chat', {
      baseUrl: baseUrl.trim(),
      apiKey: apiKey.trim(),
      model: model.trim(),
    })
    alert('配置已保存！')
  })

  GM_registerMenuCommand('⚙️ 题库配置', () => {
    const tk = prompt('粘贴题库:', '')
    GM_setValue('tk', tk)
    alert('题库已保存！')
  })

  // 网络劫持功能开关
  createToggleMenu({
    menuName: '网络劫持',
    defaultEnabled: true,
    onStart: (state) => {
      console.log('网络劫持已启动', state)

      state.autoCopy = createToggleMenu({
        menuName: '题目自动复制',
        defaultEnabled: true,
        onStart: (state) => {
          console.log('题目自动复制已启动', state)
          GM_setValue('autoCopy', true)
        },
        onStop: (state) => {
          console.log('题目自动复制已停止', state)
          GM_setValue('autoCopy', false)
        },
      })

      state.autoAnswer = createToggleMenu({
        menuName: 'Gpt自动答题',
        defaultEnabled: false,
        onStart: (state2) => {
          console.log('Gpt自动答题已启动', state2)
          GM_setValue('autoAnswer', true)
        },
        onStop: (state) => {
          console.log('Gpt自动答题已停止', state)
          GM_setValue('autoAnswer', false)
        },
      })

      state.originalOpen = unsafeWindow.XMLHttpRequest.prototype.open
      state.originalSend = unsafeWindow.XMLHttpRequest.prototype.send

      const url = '/svc/innovation/userapi/exam2d/so/servlet/getExamPaper'

      unsafeWindow.XMLHttpRequest.prototype.open = function (m, u) {
        this._t = m === 'POST' && u.includes(url)
        return state.originalOpen.apply(this, arguments)
      }
      unsafeWindow.XMLHttpRequest.prototype.send = function () {
        if (this._t) {
          this.addEventListener('load', async function () {
            try {
              const response = JSON.parse(this.responseText)
              const questions = response.result.questions.map((x, i) => [
                `${i + 1}/${x.type == 2 ? '判断' : x.type == 0 ? '单选' : '多选'}: ${x.content}`,
                x.options
                  .map((opt, oi) => `${opt.optionOrder ?? String.fromCharCode(65 + oi)}: ${opt.optionContent}`)
                  .join('\n'),
              ])
              console.log('拦截到考试题目：', questions)
              if (GM_getValue('autoCopy', false)) {
                navigator.clipboard
                  .writeText(questions.map((x) => `${x[0]}\n${x[1]}\n`).join('\n'))
                  .then(() => {
                    console.log('✅ 成功复制到剪贴板')
                    alert('✅ 成功复制题目')
                  })
                  .catch((err) => {
                    console.error('❌ 复制失败:', err)
                    alert('❌ 题目复制失败')
                  })
              }
              // 保存题目到全局对象
              questions.forEach((question, index) => {
                const questionInfo = parseQuestionInfo(question[0], '暂无答案')
                if (questionInfo) {
                  globalQuestions[questionInfo.num] = questionInfo
                }
              })

              if (GM_getValue('autoAnswer', false)) {
                for (const question of questions) {
                  await new Promise((r) => {
                    setTimeout(() => r(), 2000)
                  })
                  const res = await GM_chat(网络劫持Prompt(question[0] + '\n\n' + question[1]), {
                    stream: false,
                    console: false,
                  })
                  logQA(question[0], res.message)

                  // 更新全局对象中的答案
                  const questionInfo = parseQuestionInfo(question[0], res.message)
                  if (questionInfo) {
                    globalQuestions[questionInfo.num] = questionInfo
                  }
                }
              }
            } catch (e) {
              console.error('解析考试数据失败：', e)
            }
          })
        }
        return state.originalSend.apply(this, arguments)
      }

      state.interceptor = { active: true }
    },
    onStop: (state) => {
      console.log('网络劫持已停止', state)
      GM_setValue('autoCopy', false)
      GM_setValue('autoAnswer', false)

      if (state.autoCopy?.menuCommandId) GM_unregisterMenuCommand(state.autoCopy.menuCommandId)
      if (state.autoAnswer?.menuCommandId) GM_unregisterMenuCommand(state.autoAnswer.menuCommandId)

      if (state.originalOpen) {
        unsafeWindow.XMLHttpRequest.prototype.open = state.originalOpen
        state.originalOpen = null
      }

      if (state.originalSend) {
        unsafeWindow.XMLHttpRequest.prototype.send = state.originalSend
        state.originalSend = null
      }

      if (state.interceptor) {
        state.interceptor.active = false
        state.interceptor = null
      }
    },
  })

  // ctrl+s 快捷键备用方案
  createToggleMenu({
    menuName: '快捷键',
    defaultEnabled: true,
    onStart: (state) => {
      console.log('快捷键监听已启动', state)
      async function handleKeyPress(event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
          event.preventDefault()

          const examElement = unsafeWindow.document.querySelector('#Examination > div.content > div.right')

          if (!examElement) {
            console.log('未找到考题元素')
            return
          }

          const textToCopy = examElement.innerText
          console.log('快捷键答题模式：', { text: textToCopy })

          // 获取当前题目编号
          const titleElement = unsafeWindow.document.querySelector('.examTitle .type-content div.active')
          const currentQuestionNum = titleElement ? titleElement.textContent.trim() : '未知'

          try {
            const res = await GM_chat(快捷键Prompt(textToCopy), { stream: false, console: false })
            logQA('', res.message)

            // 保存到全局对象，如果没有网络劫持的完整信息，就只保存基本信息
            if (currentQuestionNum !== '未知') {
              const existingData = globalQuestions[currentQuestionNum]
              if (existingData) {
                // 如果已存在完整信息，只更新答案
                globalQuestions[currentQuestionNum] = {
                  ...existingData,
                  answer: res.message,
                }
              } else {
                // 如果不存在，创建基本信息
                globalQuestions[currentQuestionNum] = {
                  num: currentQuestionNum,
                  type: '未知',
                  question: '快捷键获取',
                  answer: res.message,
                }
              }
            }
          } catch (error) {
            console.error('快捷键答题失败:', error)
          }
        }
      }
      state.keyHandler = handleKeyPress
      unsafeWindow.document.addEventListener('keydown', handleKeyPress)
    },
    onStop: (state) => {
      console.log('快捷键监听已停止', state)
      if (state.keyHandler) {
        unsafeWindow.document.removeEventListener('keydown', state.keyHandler)
        state.keyHandler = null
      }
    },
  })

  // 答案卡片显示功能
  createToggleMenu({
    menuName: '答案卡片显示',
    defaultEnabled: true,
    onStart: (state) => {
      console.log('答案卡片显示已启动', state)

      // 查找目标容器并插入答案卡片
      function insertAnswerCard() {
        const targetContainer = unsafeWindow.document.querySelector('.left-box .el-scrollbar .el-scrollbar__wrap')
        if (targetContainer && !unsafeWindow.document.getElementById('hwAnswerCard')) {
          targetContainer.insertAdjacentHTML('afterbegin', createAnswerCard())
          console.log('答案卡片已插入')
        }
      }

      // 检测当前题目位置并更新答案卡片
      function detectAndUpdateCard() {
        try {
          const titleElement = unsafeWindow.document.querySelector('.examTitle .type-content div.active')
          if (titleElement) {
            const currentQuestionNum = titleElement.textContent.trim()
            const questionData = globalQuestions[currentQuestionNum]

            if (questionData) {
              updateAnswerCard(questionData)
            } else {
              // 如果没有找到对应题目，显示默认信息
              const defaultData = {
                num: currentQuestionNum,
                type: '未知',
                question: '题目信息获取中...',
                answer: '暂无答案',
              }
              updateAnswerCard(defaultData)
            }
          }
        } catch (error) {
          console.error('检测题目位置时出错:', error)
        }
      }

      // 立即尝试插入卡片
      insertAnswerCard()

      // 设置定时器，每秒检测一次
      state.cardInterval = setInterval(() => {
        insertAnswerCard() // 确保卡片存在
        detectAndUpdateCard() // 更新卡片内容
      }, 1000)

      state.cardActive = true
    },
    onStop: (state) => {
      console.log('答案卡片显示已停止', state)

      // 清除定时器
      if (state.cardInterval) {
        clearInterval(state.cardInterval)
        state.cardInterval = null
      }

      // 移除答案卡片
      const answerCard = unsafeWindow.document.getElementById('hwAnswerCard')
      if (answerCard) {
        answerCard.remove()
        console.log('答案卡片已移除')
      }

      state.cardActive = false
    },
  })
})()
