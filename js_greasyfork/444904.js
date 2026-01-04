// ==UserScript==
// @name         华师网络教育学习助手
// @version      0.0.5
// @namespace    http://tampermonkey.net/
// @description  华师网络教育学习助手，自动学习、获取题库
// @author       4Ark
// @match        *https://gdou.scnu.edu.cn/learnspace/learn/learn/blue/index.action*
// @match        *https://scnu-exam.webtrn.cn/platformwebapi/student/exam/studentExam_queryExamInfo.action*
// @match        *https://gdou.scnu.edu.cn/learnspace/learn/learn/blue/exam_checkPaperToexam.action*
// @match        *https://scnu-exam.webtrn.cn/student/exam/studentExam_studentInfo.action*
// @match        *https://scnu-exam.webtrn.cn/exam/examflow_index.action*
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_setClipboard
// @antifeature  ads
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444904/%E5%8D%8E%E5%B8%88%E7%BD%91%E7%BB%9C%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/444904/%E5%8D%8E%E5%B8%88%E7%BD%91%E7%BB%9C%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const DEFAULT_AUTO_GET_EXAM_COUNT = 15

  const PLAY_SPEED_STRATEGY = {
    25: 16,
    15: 12,
    10: 8,
    3: 4,
    2: 2,
    1: 1
  }

  const EXAM_IDS_KEY = 'huashi-exam-ids'

  const QUESTION_TYPE_SORT = {
    单项选择题: 1,
    多项选择题: 2,
    判断题: 3,
    填空题: 4
  }

  const UTILS_TYPE = {
    LEARN: '自动学习',
    GET_EXAM: '获取题库'
  }

  let util_type = UTILS_TYPE.LEARN

  const CHAPTER_TYPE = {
    VIDEO: 'video',
    TEXT: 'text'
  }

  const GET_EXAM_BASE_URL =
    'https://scnu-exam.webtrn.cn/platformwebapi/student/exam/studentExam_queryExamInfo.action'
  const GET_EXAM_BASE_URL_2 =
    'https://gdou.scnu.edu.cn/learnspace/learn/learn/blue/exam_checkPaperToexam.action'

  const SURE_EXAM_BASE_URL =
    'https://scnu-exam.webtrn.cn/student/exam/studentExam_studentInfo.action'

  const EXAM_BASE_URL = 'https://scnu-exam.webtrn.cn/exam/examflow_index.action'

  let currentPage
  let currentFrame

  const delay = (time) =>
    new Promise((resolve) => {
      setTimeout(() => resolve(), time)
    })

  function main() {
    const getType = function () {
      const module = getCurrentModule()

      if (module.includes('教学视频')) {
        return UTILS_TYPE.LEARN
      }

      if (module.includes('在线练习')) {
        return UTILS_TYPE.GET_EXAM
      }
    }

    $('.nav .nav_li').click(function () {
      var tab = $(this).find('a').text()

      if (tab === '课程内容') {
        initToolbar()

        awaitPageLoaded(function () {
          setMessage('准备中...')

          awaitFrameLoaded(() => {
            const type = getType()

            const actions = {
              [UTILS_TYPE.LEARN]: startLearn,
              [UTILS_TYPE.GET_EXAM]: getExam
            }

            setUtilType(type)

            actions[type] && actions[type]()
          })
        })

        return
      }

      $('#huashi-exam-toolbar').remove()
    })

    if (location.href.includes(GET_EXAM_BASE_URL)) {
      openExam()
    }

    if (location.href.includes(GET_EXAM_BASE_URL_2)) {
      getExam()
    }

    if (location.href.includes(SURE_EXAM_BASE_URL)) {
      sureExam()
    }

    if (location.href.includes(EXAM_BASE_URL)) {
      submitExam()
    }
  }

  function initToolbar() {
    if ($('#huashi-exam-toolbar').length) return

    const messageBox = $(
      `<div id="huashi-exam-toolbar">
                <p style="color:red">华师网络教育学习助手</p>
                <div id="huashi-exam-message"></div>
                <div id="huashi-exam-util-type">当前功能：<span>${util_type}</span></div>
            </div>`
    )

    const css = `
            #huashi-exam-toolbar {
                position: absolute;
                width: 100%;
                height: 50px;
                padding: 0px 20px;
                background: rgb(255, 255, 255);
                top: 0px; left: 0px;
                color: red;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-sizing: border-box;
            }
    
            #huashi-exam-message {
                color: red;
            }
        `

    $('body').append(messageBox)
    $('head').append($('<style type="text/css">').html(css))
  }

  function getCurrentModule() {
    return $page('#nav .vtitle span.v2').text()
  }

  function $page(selector, context = currentPage) {
    return $(context).contents().find(selector)
  }

  function setMessage(message) {
    $('#huashi-exam-message').text(message)
  }

  function setUtilType(type) {
    util_type = type

    $('#huashi-exam-util-type span').text(util_type)

    setMessage('')
  }

  function awaitPageLoaded(cb) {
    const page = $('#mainContent')

    $(page).one('load', function () {
      currentPage = $(this)

      cb()
    })
  }

  function awaitFrameLoaded(cb) {
    $(currentPage)
      .contents()
      .find('#mainFrame')
      .on('load', function () {
        currentFrame = $(this)

        cb()
      })
  }

  function fmtMSS(s) {
    s = parseInt(s)

    if (s < 0 || isNaN(s)) return ''

    return (s - (s %= 60)) / 60 + (s > 9 ? ':' : ':0') + s
  }

  function fmtM(s) {
    s = parseInt(s)

    return (s - (s %= 60)) / 60
  }

  function startLearn() {
    const getSpeed = function (minute) {
      const key = Object.keys(PLAY_SPEED_STRATEGY)
        .sort((a, b) => b - a)
        .find(function (m) {
          return m <= minute
        })

      return PLAY_SPEED_STRATEGY[key] || 1
    }

    const passVideo = function (video, next) {
      const duration = fmtMSS(video.duration)
      const minute = fmtM(video.duration)

      const speed = getSpeed(minute)

      setMessage(
        '当前视频时长：' +
          duration +
          '，将采用' +
          speed +
          '倍速播放，预计需要' +
          (minute * (speed / 100)).toFixed(1) +
          '分钟。'
      )

      video.muted = true
      video.playbackRate = speed

      const timer = setInterval(function () {
        if (video && video.playbackRate !== speed) {
          video.playbackRate = speed
        }
      }, 5000)

      $(video).on('ended', function () {
        clearInterval(timer)

        next()
      })
    }

    const passChapterByType = function (type, context) {
      const next = getNext()

      if (type === CHAPTER_TYPE.TEXT) {
        return next()
      }

      if (type === CHAPTER_TYPE.VIDEO) {
        return passVideo(context, next)
      }
    }

    const getNext = function () {
      const menus = $page('.menuct .menub')
      const menu = $page('.menuct .menubu')

      const index = menus.index(menu)

      const nextChapter = function () {
        const chapters = $page('.vcon:visible .vconlist > li')
        const chapter = $page('.vcon:visible .vconlist > li.select')

        const index = chapters.index(chapter)

        if (index === chapters.length - 1) {
          return () => {
            setMessage('学习完毕')
          }
        }

        return function () {
          setMessage('正在加载...')

          setTimeout(() => {
            $(chapters[index + 1]).click()
            $(chapters[index + 1])
              .find('a')
              .click()
          }, 500)
        }
      }

      if (index === menus.length - 1) {
        return nextChapter()
      }

      return function () {
        setMessage('正在加载...')

        $page('#rtarr').click()
      }
    }

    const awaitVideoLoaded = function (cb) {
      var target = $(currentFrame).contents().find('body')[0]

      const textContent = $(target).find('#textContent')

      if (textContent.length >= 1) {
        cb(CHAPTER_TYPE.TEXT, textContent)

        return
      }

      let loadedVideo

      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function () {
          if (loadedVideo) return

          const video = $(target).find('.cont video')

          if (video.attr('src')) {
            loadedVideo = true

            video.on('loadedmetadata', function () {
              cb(CHAPTER_TYPE.VIDEO, video[0])
            })

            observer.disconnect()
          }
        })
      })

      observer.observe(target, { subtree: true, childList: true })
    }

    awaitVideoLoaded((type, context) => {
      setTimeout(() => {
        passChapterByType(type, context)
      }, 500)
    })
  }

  function getExam() {
    setUtilType(UTILS_TYPE.GET_EXAM)

    const isSolo = location.href.includes(GET_EXAM_BASE_URL_2)

    if (!isSolo) {
      const isConfirm = window.confirm('是否需要自动获取题库？')

      if (!isConfirm) return
    }

    const autoGetExamCount = window.prompt(
      '请输入自动获取题库次数：',
      DEFAULT_AUTO_GET_EXAM_COUNT
    )

    GM_setValue('autoGetExamCount', autoGetExamCount)

    GM_setValue(EXAM_IDS_KEY, [])

    if (isSolo) {
      window.open($('#examIframe', currentFrame).attr('src'))
    } else {
      window.open($page('#examIframe', currentFrame).attr('src'))
    }
  }

  async function openExam() {
    if (self != top) {
      return
    }

    const ids = GM_getValue(EXAM_IDS_KEY) || []

    console.log('4ark ids -->', ids)

    const count = GM_getValue('autoGetExamCount') || DEFAULT_AUTO_GET_EXAM_COUNT

    console.log('4ark count -->', count)

    if (ids.length >= count) {
      initToolbar()

      setUtilType(UTILS_TYPE.GET_EXAM)

      setMessage('正在下载题库...')

      return downloadExam(ids)
    }

    await delay(500)

    console.log(`4ark $('#viewRecordBtn').length`, $('#viewRecordBtn').length)

    if ($('#viewRecordBtn').length) {
      GM_setValue(EXAM_IDS_KEY, [
        ...ids,
        $('#viewRecordBtn').attr('href').split('=').pop()
      ])
    }
    ;``

    await delay(500)

    $('#goBtn').click()

    await delay(500)

    $('.TB_command_btn ').eq(1).click()
  }

  async function sureExam() {
    const isExercise = $('.exam-primTit').text().includes('在线练习')

    if (!isExercise) return

    await delay(500)

    console.log('4ark', $('.submit_solid'))

    $('.submit_solid').click()

    await delay(500)

    $('.TB_command_btn ').eq(1).click()
  }

  async function submitExam() {
    const isExercise = $('.paper_name').text().includes('在线练习')

    if (!isExercise) return

    await delay(500)

    $('.paper_submit').click()

    await delay(500)

    $('.win_btn1').eq(1).click()

    await delay(500)

    $('.TB_command_btn').click()
  }

  async function downloadExam(ids) {
    const tasks = ids.map((id) => requestExam(id))

    const result = await Promise.all(tasks)

    const html = getHTML(result)

    const frag = document.createDocumentFragment()

    const div = $(`<div id="huashi-exam-download-div">${html}</div>`)

    div.css({
      display: 'none'
    })

    frag.appendChild(div[0])

    $('body').append(frag)

    const download = function (content, filename) {
      var eleLink = document.createElement('a')
      eleLink.download = filename
      eleLink.style.display = 'none'
      // 字符内容转变成blob地址
      var blob = new Blob([content])
      eleLink.href = URL.createObjectURL(blob)
      // 触发点击
      document.body.appendChild(eleLink)
      eleLink.click()
      // 然后移除
      document.body.removeChild(eleLink)
    }

    const downloadHTML = function (questions) {
      const html = questions
        .map((question, index) => {
          return `<body style="padding: 32px;"><div class="question" style="margin-bottom: 20px;">
                      <div class="question-content" style="display: flex;">${
                        index + 1
                      }、${
            question.content?.src
              ? `<img src="${question.content.src}" style="margin-bottom: 20px;" />`
              : question.content
          }</div>
                      <div class="question-options" style="padding-left: 20px;">${question.options
                        .map((option) => `<li>${option}</li>`)
                        .join('')}</div>
                      <div class="question-answer" style="padding-left: 20px; margin-top: 10px;">参考答案：${
                        question.answer?.src
                          ? `<img src="${question.answer.src}" style="margin-bottom: 20px;" />`
                          : question.answer
                      }</div>
                      </div></body>`
        })
        .join('')

      download(html, $('.mod_tit h2').text().trim() + '题库.html')

      GM_setValue(EXAM_IDS_KEY, [])

      setMessage('下载完成')
    }

    const getQuestions = function () {
      let questions = $('.q_content')
        .map((_, el) => {
          let content = $(el)
            .find('.divQuestionTitle')
            .text()
            .replace(/\d+、/, '')

          const img = $(el).find('.divQuestionTitle img').attr('src')

          if (img) {
            content = {
              src: img.startsWith('https')
                ? img
                : `https://scnu-exam.webtrn.cn${img}`
            }
          }

          const options = $(el)
            .find('.q_option_readonly')
            .map(function () {
              return $(this).text()
            })
            .get()
          let answer =
            $(el).find('.exam_rightAnswer span[name=rightAnswer]').text() ||
            $(el).find('.exam_rightAnswer .has_standard_answer').text()

          const answerImg = $(el)
            .find('.exam_rightAnswer .has_standard_answer img')
            .attr('src')

          if (answerImg) {
            answer = {
              src: answerImg.startsWith('https')
                ? answerImg
                : `https://scnu-exam.webtrn.cn${answerImg}`
            }
          }

          return {
            content,
            options,
            answer
          }
        })
        .get()

      const arrayUniqueByKey = (array, key) => {
        return [...new Map(array.map((item) => [item[key], item])).values()]
      }

      questions = arrayUniqueByKey(questions, 'content')

      downloadHTML(questions)
    }

    getQuestions()
  }

  function requestExam(id) {
    return new Promise((resolve) => {
      $.ajax({
        url: 'https://scnu-exam.webtrn.cn/student/exam/examrecord_getRecordPaperStructure.action',
        type: 'POST',
        headers: {
          Authority: 'scnu-exam.webtrn.cn',
          Pragma: 'no-cache',
          'Cache-Control': 'no-cache',
          Accept: '*/*',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36 Edg/93.0.961.47',
          Origin: 'https://scnu-exam.webtrn.cn',
          'Sec-Fetch-Site': 'same-origin',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Dest': 'empty',
          Referer: `https://scnu-exam.webtrn.cn/student/exam/examrecord_recordDetail.action?recordId=${id}`,
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
          Cookie: document.cookie,
          'Accept-Encoding': 'gzip'
        },
        contentType: 'application/x-www-form-urlencoded',
        data: {
          recordId: id
        }
      }).done(function (data) {
        data = JSON.parse(data)

        const { contentList, examBatchId } = data.data

        const contentIds = contentList.map(({ id }) => id).join()

        return $.ajax({
          type: 'POST',
          url: 'https://scnu-exam.webtrn.cn/student/exam/examrecord_getRecordContent.action',
          headers: {
            Authority: 'scnu-exam.webtrn.cn',
            Pragma: 'no-cache',
            'Cache-Control': 'no-cache',
            Accept: '*/*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36 Edg/93.0.961.47',
            Origin: 'https://scnu-exam.webtrn.cn',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            Referer: `https://scnu-exam.webtrn.cn/student/exam/examrecord_recordDetail.action?recordId=${id}`,
            'Accept-Language':
              'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
            Cookie: document.cookie,
            'Accept-Encoding': 'gzip'
          },
          contentType: 'application/x-www-form-urlencoded',
          data: {
            recordId: id,
            examBatchId: examBatchId,
            contentIds: contentIds,
            'params.monitor': '',
            'params.isRandomQuestion': '0'
          }
        }).then((data) => {
          data = JSON.parse(data)

          contentList.forEach((item) => {
            if (data?.data?.[item.id]) {
              data.data[item.id].type = item.name
            }
          })

          if (data.data) {
            resolve(data.data)
          } else {
            resolve({})
          }
        })
      })
    })
  }

  function getHTML(data) {
    return data
      .map((item) => {
        return Object.values(item)
          .map((val) => {
            if (val.contentHtml) return val
          })
          .filter((s) => s)
      })
      .flat()
      .sort((a, b) =>
        QUESTION_TYPE_SORT[a.type] > QUESTION_TYPE_SORT[b.type] ? 1 : -1
      )
      .map((val) => val.contentHtml)
      .join('')
  }

  main()
})()
