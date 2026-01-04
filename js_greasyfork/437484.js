// ==UserScript==
// @name         高校邦一键完成，自动答题静音播放
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  高校邦自动静音播放，自动答题，一键完成视频
// @author       Xisney
// @match        https://*.class.gaoxiaobang.com/class/*/unit/*/chapter/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437484/%E9%AB%98%E6%A0%A1%E9%82%A6%E4%B8%80%E9%94%AE%E5%AE%8C%E6%88%90%EF%BC%8C%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E9%9D%99%E9%9F%B3%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/437484/%E9%AB%98%E6%A0%A1%E9%82%A6%E4%B8%80%E9%94%AE%E5%AE%8C%E6%88%90%EF%BC%8C%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E9%9D%99%E9%9F%B3%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  const executeUntilSuccess = (target, span = 500, count = 0) => {
    if (typeof target !== 'function' || count > 9) return

    try {
      target()
    } catch (e) {
      setTimeout(() => {
        executeUntilSuccess(target, span, count + 1)
      }, span)
    }
  }

  const listen = window.addEventListener
  window.addEventListener = (name, callback, options) => {
    if (name === 'blur') return
    listen(name, callback, options)
  }

  const finishByClick = () => {
    if (typeof jQuery !== 'funtion') {
      console.error('no jquery')
    }
    const video = $('#video_player_html5_api')[0]
    const duration = parseInt(video.duration)

    const pathArr = location.pathname.split('/')
    const classId = pathArr[2]
    const chapterId = pathArr[6]

    const ct = new Date().getTime()
    const infoUrl = `https://cqupt.class.gaoxiaobang.com/class/${classId}/chapter/${chapterId}/api?${ct}`

    $.post(infoUrl, res => {
      const mh = res.userRecord.maxViewTime ? res.userRecord.maxViewTime : 0
      const logUrl = `https://cqupt.class.gaoxiaobang.com/log/video/${chapterId}/${classId}/api?${new Date().getTime()}`
      $.post(
        logUrl,
        {
          rl: location.href,
          data: JSON.stringify([
            {
              state: 'listening',
              level: 2,
              ch: duration,
              mh,
              ct,
            },
          ]),
        },
        res => {
          if (res === 'success') {
            location.reload()
          }
        }
      )
    })
  }

  const inVideoPage = () => {
    if (location.host.startsWith('imooc')) return

    if (typeof jQuery !== 'function') {
      console.error('no jquery')
    }

    const video = $('#video_player_html5_api')[0]
    video.volume = 0
    video.play()

    answerQuestions()

    const btn = document.createElement('button')
    $(btn).css({
      position: 'fixed',
      right: '50px',
      top: '200px',
      transform: 'translateY(-50%)',
      'z-index': '10',
    })
    btn.innerHTML = '一键完成'
    btn.addEventListener('click', finishByClick)
    $('body').append(btn)
  }

  const answerQuestions = () => {
    const observer = new MutationObserver(records => {
      for (let r of records) {
        if (r.type === 'childList') {
          const quizItems = $('.gxb-video-quiz-body .question-item')

          if (quizItems.length === 0) return

          quizItems.each(function (i) {
            const res = $(this)
              .children('.correctAnswer')[0]
              .getAttribute('data')
              .split('')
              .map(char => {
                switch (char) {
                  case '对':
                    return 0
                  case '错':
                    return 1
                  default:
                    return char.codePointAt(0) - 'A'.codePointAt(0)
                }
              })

            const answers = $(this)
              .find('.answer-wap .answer')
              .children('i[answer_id]')
            res.forEach(value => {
              answers[value].click()
            })

            if (i !== quizItems.length - 1) {
              $('.gxb-video-quiz .gxb-icon-next').click()
              console.log('cccsfa')
            }
          })

          $('.gxb-video-quiz-footer .gxb-btn_.submit').click()
          setTimeout(() => {
            // 使得用户可感知答题结果，也确保dom更新完成
            $('.gxb-video-quiz-footer .gxb-btn_.player').click()
          }, 1000)
        }
      }
    })

    const target = $('.player-video')[0]
    observer.observe(target, {
      childList: true,
    })
  }

  executeUntilSuccess(() => {
    inVideoPage()
  })
})()