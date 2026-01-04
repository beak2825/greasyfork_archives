// ==UserScript==
// @name         词达人助手
// @namespace    https://github.com/Conard-Ferenc/vocabgo-assistant
// @version      0.0.3
// @description  词达人自动挂机
// @author       Conard
// @match        https://app.vocabgo.com/*
// @icon         https://app.vocabgo.com/student/favicon.ico
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/509550/%E8%AF%8D%E8%BE%BE%E4%BA%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/509550/%E8%AF%8D%E8%BE%BE%E4%BA%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  const style = document.createElement('style')
  style.innerHTML = `.cjw-topic-remark{display:block!important}`
  document.head.appendChild(style)
  const app = document.querySelector('div#app').__vue__
  const $nextTick = app.$nextTick
  const pluginMap = {
    sWord: () => {
      return $nextTick(createMap)
    },
    topicExam: () => {
      return $nextTick(autoAsk)
    }
    // tTopicExam: () => {
    //   return $nextTick(autoAsk)
    // }
  }
  let nowPlugin

  app.$router.beforeHooks.length = 0
  app.$router.afterHooks.push((e) => {
    const { name } = e
    if (nowPlugin === name) return
    else if (nowPlugin !== name) nowPlugin = name
    console.log(e)
    if (pluginMap[nowPlugin]) return pluginMap[nowPlugin]()
    nowPlugin = null
  })
  window.获取词库 = localStorage.getItem('fullMap')
  window.导入词库 = (data) => {
    if (typeof data === 'object') data = JSON.stringify(data)
    localStorage.setItem('fullMap', data)
  }
  const getTempMap = () => new Map(JSON.parse(获取词库))
  const fullMap = getTempMap()
  const createMap = () => {
    const wordPage = app.$el.querySelector('.word').__vue__

    wordPage.$watch(
      () => wordPage.$data.indexData,
      (data) => {
        if (!data) return
        const { au_word, means } = data
        // if (!fullMap.has(list_id)) fullMap.set(list_id, {})
        fullMap.set(au_word, means.map(({ mean }) => mean.join(' ')).join(' '))

        const nextBtn = wordPage.$el.querySelector(
          '.cjw-footer .van-pagination__next'
        )
        if (nextBtn.classList.contains('van-pagination__item--disabled')) {
          console.log(fullMap.entries())
          localStorage.setItem(
            'fullMap',
            JSON.stringify([...fullMap.entries()])
          )
        } else nextBtn.click()
      },
      { deep: true, immediate: true }
    )
  }
  const autoAsk = () => {
    const topicExam = app.$el.querySelector('.topic-exam').__vue__
    console.log(
      topicExam.$data.indexData
      // Reflect.get(topicExam.$data, 'indexData'),
      // typeof topicExam.topicData,
      // Object.keys(topicExam.$data)
    )
    // Object.keys(topicExam.$data).forEach((i) => {
    //   topicExam.$watch(
    //     () => topicExam.$data[i],
    //     (val) => {
    //       console.log(i, val)
    //     },
    //     { deep: true, immediate: true }
    //   )
    //   // console.log(topicExam.$data[i], typeof topicExam.$data[i])
    // })
    topicExam.$watch(
      () => topicExam.$data.topicData?.stem.content,
      (val) => {
        if (!val) return
        console.log(JSON.stringify(topicExam.topicData))
        if (topicExam.topicData.options.length) return typeSelect(topicExam)
        return typeInput(topicExam)
      },
      { immediate: true }
    )
  }
  const typeSelect = (topicExam) => {
    const {
      options,
      stem: { content }
    } = topicExam.topicData
    const reg = {
      singleWord: /^[a-z]+$/,
      wordInSentence: /(?<=\{)[a-z]+(?=\})/
    }
    const word = content.trim().toLowerCase()
    console.log(word)
    if (reg.singleWord.test(word)) return selectTranslate(word, options)
    else if (reg.wordInSentence.test(word))
      return selectTranslate(word.match(reg.wordInSentence)[0], options)
    return selectWord(word, options)
  }
  const selectTranslate = (word, options) => {
    const translate = fullMap.get(word) ?? fullMap.get(word.slice(0, -1))
    if (!translate) return app.$toast(`没有找到 ${word} 答案`)
    console.log(translate)
    const index = options.findIndex(({ content }) =>
      translate.includes(
        content
          .trim()
          .split(/ |，|；/)
          .pop()
      )
    )
    getClickDom(index)
    // nextTopic()
  }
  const selectWord = (word, options) => {
    const target = word.split(/ |，|；/).pop()
    console.log(target);
    const index = options.findIndex(({ content }) => {
      console.log(content);
      const translate = fullMap.get(content.trim())
      return translate && translate.includes(target)
    })
    getClickDom(index)
    // nextTopic()
  }
  const typeInput = (topicExam) => {
    console.log(topicExam.topicData)
    const { answer_content, w_tip, w_len } = topicExam.topicData
    const keys = [...fullMap.keys()]
    const first = keys.find(
      (i) => i.startsWith(w_tip.slice(0, -1)) && Object.is(w_len, i.length)
    )
    if (!first) return app.$toast(`没有找到 ${w_tip} 答案`)
    topicExam.$data.inputValue = answer_content ?? first
    getClickDom('.cjw-button .van-button', topicExam.$el)
  }
  const nextTopic = () => {
    setTimeout(() => {
      const nextBtn = app.$el.querySelector(
        '.cjw-exam-button > .cjw-exam-button-continue > .van-button'
      )
      if (!nextBtn) return
      nextBtn.click()
    }, 500)
  }
  /**@param {Element} dom */
  const lowSpeedClick = (dom) => {
    const baseDelay = 1500
    const delay = Math.floor(Math.random() * 500) + baseDelay
    setTimeout(() => {
      dom.click()
    }, delay)
  }
  const getClickDom = (i, root) => {
    if (typeof i === 'number') {
      const option = app.$el.querySelectorAll('.cjw-topic-options .cjw-option')[
        i
      ]
      if (!option) return
      lowSpeedClick(option)
    } else if (typeof i === 'string') {
      const dom = root.querySelector(i)
      if (!dom) return
      lowSpeedClick(dom)
    }
  }
})()
