// ==UserScript==
// @name        网大（自动挂课+考试解除限制）
// @namespace   Violentmonkey Scripts
// @match       https://kc.zhixueyun.com/
// @match       https://cms.myctu.cn/*
// @grant       unsafeWindow
// @grant       window.addEventListener
// @grant       window.close
// @grant       window.alert
// @require     https://cdn.bootcss.com/jquery/3.6.1/jquery.min.js
// @version     0.0.5
// @author      zzz
// @description 知学云助手拷贝留存，原作者：sharonlee
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472209/%E7%BD%91%E5%A4%A7%EF%BC%88%E8%87%AA%E5%8A%A8%E6%8C%82%E8%AF%BE%2B%E8%80%83%E8%AF%95%E8%A7%A3%E9%99%A4%E9%99%90%E5%88%B6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/472209/%E7%BD%91%E5%A4%A7%EF%BC%88%E8%87%AA%E5%8A%A8%E6%8C%82%E8%AF%BE%2B%E8%80%83%E8%AF%95%E8%A7%A3%E9%99%A4%E9%99%90%E5%88%B6%EF%BC%89.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  let $ = window.jQuery

  /**
   * 添加自动播放按钮
   */
  function addAutoPlayButton(callback) {
    // 自动播放按钮
    let autoPlayButton = `<div class="item">
      <div id="autoPlay" class="view">
        <i class="iconfont icon-play"></i>
        <div class="text">自动播放</div>
      </div>
    </div>`

    // 等待其他按钮加载完成之后，添加自动播放按钮
    let timer = setInterval(function () {
      if ($('#D60toolbarTab .item').length != 0 && $('#D60toolbarTab .item #autoPlay').length == 0) {
        console.log('🔄添加自动播放按钮')
        $('#D60toolbarTab').append(autoPlayButton)
        // 监听开始按钮点击事件
        $('#D60toolbarTab #autoPlay').click(callback)
        clearInterval(timer)
      }
    }, 200)
  }

  /**
   * 专题页面功能
   */
  function subjectHelper() {
    // 专题页面
    if (location.hash.match('#/study/subject/detail/')) {
      // 课程列表
      let items = null
      // 当前课程索引
      let currentIdx = -1
      let timer = null
      let opener = unsafeWindow.opener
      // 添加自动播放按钮
      addAutoPlayButton(autoPlay)

      // 如果是自动打开的，直接自动播放
      if (opener && opener.isAutoPlay) {
        autoPlay()
      }

      /**
       * 自动播放
       */
      function autoPlay() {
        console.log('🔵开始自动播放')
        unsafeWindow.document.title = '🔵开始自动播放'
        unsafeWindow.isAutoPlay = true
        items = $('.subject-catalog .item')
        currentIdx = -1
        playNextCourse()
        checkCurrentCourse()
        // 定时检查当前课程状态
        if (timer) {
          clearInterval(timer)
        }
        timer = setInterval(checkCurrentCourse, 5000)
      }

      /**
       * 播放下一个课程
       */
      function playNextCourse() {
        currentIdx++
        items = $('.subject-catalog .item')

        let item = items.eq(currentIdx)
        if (item.length < 1) {
          return
        }
        let name = item.find('.name-des').text()
        let status = item.find('.operation').text().trim()
        // 已完成当前课程
        if (status == '重新学习' || status.includes("考试")) {
          // 全部课程完成
          if (currentIdx == items.length - 1) {
            console.log('✅已完成当前专题下的所有课程')
            unsafeWindow.document.title = '✅已完成当前专题下的所有课程'
            alert('✅已完成当前专题下的所有课程')
            // 通知打开的页面
            if (opener) {
              opener.postMessage('autoPlayComplete')
            }
          }
          // 播放下一个课程
          else {
            playNextCourse()
          }
        }
        // 未完成当前课程
        else {
          console.log(`▶️[${currentIdx + 1}/${items.length}]开始播放【${name}】`)
          item.click()
        }
      }

      // 监听事件
      unsafeWindow.addEventListener('message', function (e) {
        if (e.data == 'autoPlayComplete') {
          console.log('📢接收到课程完成通知，开始播放下一个课程')
          playNextCourse()
        }
      })

      // 检查当前课程状态
      function checkCurrentCourse() {
        items = $('.subject-catalog .item')
        // 课程可能未加载完毕
        if (items.length < currentIdx + 1) {
          return
        }
        let item = items.eq(currentIdx)
        let name = item.find('.name-des').text()
        let status = item.find('.operation').text().trim()

        // 已经完成自动播放下一个课程
        if (status == '重新学习' || status.includes("考试")) {
          playNextCourse()
        } else {
          unsafeWindow.document.title = `🟢[${currentIdx + 1}/${items.length}]正在播放【${name}】`
          console.log(`🟢[${currentIdx + 1}/${items.length}]正在播放【${name}】`)
        }
      }
    }
  }

  /**
   * 课程页面功能
   */
  function courseHelper() {
    if (location.hash.match('#/study/course/detail/')) {
      let opener = unsafeWindow.opener
      let timer = null
      // 添加自动播放按钮
      addAutoPlayButton(autoPlay)
      // 专题自动播放进入，直接开始自动播放
      console.log(opener.isAutoPlay)
      if (opener && opener.isAutoPlay) {
        autoPlay()
      }

      /**
       * 自动播放
       */
      function autoPlay() {
        if (unsafeWindow.isAutoPlay) {
          return
        }
        console.log('🔵开始自动播放')
        unsafeWindow.document.title = '🔵开始自动播放'
        unsafeWindow.isAutoPlay = true
        playSection()
        if (timer) {
          clearInterval(timer)
        }
        timer = setInterval(playSection, 5000)
      }

      /**
       * 播放章节
       */
      function playSection() {
        let items = $('.section-arrow .chapter-list-box')

        for (let idx = 0; idx < items.length; idx++) {
          let item = items.eq(idx)
          let name = item.find('.chapter-item').children().eq(1).text().trim()
          let status = item.find('.section-item .pointer').text().trim()
          let type = item.find('.section-item .sub-text').text().trim()
          // 已完成
          if ('重新学习' == status || status.includes('考试') || type.includes('考试')) {
            // 全部完成，通知父页面并关闭当前页面
            if (idx == items.length - 1) {
              if (opener) {
                opener.postMessage('autoPlayComplete')
              }
              unsafeWindow.close()
            }
          }
          // 未完成
          else {
            // 未播放则点击播放
            let isFocus = item.hasClass('focus')
            if (!isFocus) {
              console.log(`▶️[${idx + 1}/${items.length}]开始播放【${name}】`)
              item.click()
            } else {
              unsafeWindow.document.title = `🟢[${idx + 1}/${items.length}]正在播放【${name}】`
              console.log(`🟢[${idx + 1}/${items.length}]正在播放【${name}】`)
            }
            break
          }
        }

        // 自动禁音播放视频
        let video = document.querySelector('video')
        if (video && !video.muted) {
            video.muted = true
        }
        if (video && video.paused) {
          console.log('⏸视频被暂停，自动恢复播放')
          video.muted = true
          video.play()
        }
      }
    }
  }

  /**
   * 活动页面功能
   */
  function trainHelper() {
    if (location.hash.match('#/train-new/class-detail')) {
      // 添加自动播放按钮
      addAutoPlayButton(playNextSection)

      let sectionIdx = -1
      let courseIdx = -1

      function playNextSection() {
        unsafeWindow.isAutoPlay = true
        sectionIdx++
        courseIdx = -1
        let timerId = setInterval(function() {
          let pointer = $('.course-box .section-title .right-area > .pointer').eq(sectionIdx)
          if (pointer.hasClass('icon-triangle-down')) {
            pointer.click()
          } else {
            if ($('.course-box .btn.load-more').length > 0) {
              $('.course-box .btn.load-more').click()
            } else {
              clearInterval(timerId)
              playNextCourse()
            }
          }
        }, 200)
      }

      function playNextCourse() {
        courseIdx++
        if ($('.course-box .train-citem .row-title-a').length <= courseIdx) {
          playNextSection()
        } else {
          if ($('.course-box .train-citem .ms-train-state').eq(courseIdx).text().trim()=='已完成') {
            playNextCourse()
          } else {
            $('.course-box .train-citem .row-title-a').eq(courseIdx).click()
          }
        }
      }

      // 监听事件
      unsafeWindow.addEventListener('message', function (e) {
        if (e.data == 'autoPlayComplete') {
          console.log('📢接收到课程完成通知，开始播放下一个课程')
          playNextCourse()
        }
      })
    }
  }

  /**
   * 外部链接页面功能
   */
  function externalUrlHelper() {
    // 10 秒后自动关闭外部链接
    if (location.href.match('https://cms.myctu.cn/safe/topic')) {
      let opener = unsafeWindow.opener
      unsafeWindow.document.title = '10秒后关闭此页面'
      setTimeout(function () {
        if (opener) {
          opener.postMessage('autoPlayComplete')
          unsafeWindow.close()
        }
      }, 10000)
    }
  }

  /**
   * 考试页面功能
   */
  function examHelper() {
    if (location.hash.match('#/exam/exam/answer-paper')) {
      let allowSwitchAndCopyButton = `<a id="allowSwitchAndCopy" class="btn block w-half m-top">允许切屏/复制</a>`

      // 添加允许切屏/复制按钮
      let timer = setInterval(function () {
        if ($('.side-main #D165submit').length > 0) {
          $('.side-main #D165submit').parent().prepend(allowSwitchAndCopyButton)
          $('.side-main #allowSwitchAndCopy').click(allowSwitchAndCopy)
          clearInterval(timer)
        }
      }, 200)

      let interval = null
      /**
       * 允许切屏和复制
       */
      function allowSwitchAndCopy() {
        // 允许切屏
        allowSwitch()
        if (interval) {
          clearInterval(interval)
        }
        // 每 500 毫秒监控一次
        interval = setInterval(function () {
          // 允许复制
          allowCopy()
        }, 500)
        alert('允许切屏和复制成功')
      }

      /**
       * 允许切屏
       */
      function allowSwitch() {
        unsafeWindow.onblur = null
        Object.defineProperty(unsafeWindow, 'onblur', {
          set: function (xx) {
            /* 忽略 */
          }
        })
      }

      /**
       * 允许复制
       */
      function allowCopy() {
        let previewContent = document.querySelector('.preview-content')
        previewContent.oncontextmenu = null
        previewContent.oncopy = null
        previewContent.oncut = null
        previewContent.onpaste = null
      }
    }
  }

  // 统一调用助手功能
  subjectHelper()
  trainHelper()
  courseHelper()
  externalUrlHelper()
  examHelper()
})()
