// ==UserScript==
// @name         职业技能提升倍速
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  try to take over the world!
// @author       xlslucky
// @match        https://www.bjjnts.cn/*/*
// @match        https://www.bjjnts.cn/demo
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416761/%E8%81%8C%E4%B8%9A%E6%8A%80%E8%83%BD%E6%8F%90%E5%8D%87%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/416761/%E8%81%8C%E4%B8%9A%E6%8A%80%E8%83%BD%E6%8F%90%E5%8D%87%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 静音
  var muted = true
  // 当前速度
  var speedIndex = 0
  // 非特殊时刻不要修改2倍以上
  var speedList = [1, 1.5, 2]
  var activeSpeedStyle = { background: '#22b8ff', color: '#fff', borderColor: '#22b8ff' }
  var speedStyle = { background: '#fff', color: '#333', borderColor: '#ccc' }

  function leftPad(num) {
    return Number(num) > 9 ? num : `0${num}`
  }

  function parseTime(timeStr) {
    var arr = timeStr.replace(/\(|\)/g, '').split(':').map(Number)
    return arr[0] * 60 * 60 + arr[1] * 60 + arr[2]
  }

  function secondToHour(timeNum) {
    if (!timeNum) {
      return `00:00:00`
    }
    var hour = Math.floor(timeNum / 60 / 60)
    var minute = Math.floor((timeNum - hour * 60 * 60) / 60)
    var second = timeNum - hour * 60 * 60 - minute * 60
    return `${leftPad(hour)}:${leftPad(minute)}:${leftPad(second)}`
  }

  function calcMenuTime() {
    var completeTime = 0
    var unfinishedTime = 0
    $('.change_chapter').each(function () {
      var lock = Number(this.dataset.lock)
      if (lock) {
        // 未看
        unfinishedTime += parseTime($(this).find('.course_study_menudate').text())
      } else {
        if (/100/.test($(this).find('.course_study_menuschedule').text())) {
          // 已看
          completeTime += parseTime($(this).find('.course_study_menudate').text())
        } else {
          // 正在看
        }
      }
    })
    return { completeTime, unfinishedTime }
  }

  function renderSpeedListDom() {
    var $speedListDom = $('<div></div>').css({
      padding: '0 22px'
    })
    for (let i = 0; i < speedList.length; i++) {
      var speed = speedList[i]
      var $speedDom = $(
        `<span class="speed-span">${speed}</span>`
      ).css({
        padding: '2px 10px',
        border: '1px solid #ccc',
        marginRight: i === speedList.length - 1 ? 0 : '10px',
        cursor: 'pointer'
      })
      if (i === speedIndex) {
        $speedDom.css(activeSpeedStyle)
      }
      $speedListDom.append($speedDom)
    }

    return $speedListDom
  }

  function renderOptItemDom(label, children) {
    var $itemDom = $('<div class="opt"></div>').css({
      display: 'flex',
      alignItems: 'center',
    })
    var $labelDom = $(`<span class="label">${label}：</span>`).css({
      width: '4em',
      textAlign: 'right',
      whiteSpace: 'nowrap',
    })
    $itemDom.append($labelDom)
    $itemDom.append(children)
    return $itemDom
  }

  function renderOptDom() {
    var $curSpeedDom = renderOptItemDom(
      '速度',
      $(`<span><span class="current-speed">${speedList[speedIndex]}</span> 倍</span>`)
    )
    var $curMutedDom = renderOptItemDom(
      '静音',
      $(`<input type="checkbox" class="current-muted" />`).css({
        appearance: 'auto'
      })
    )
    var $completeDom = renderOptItemDom(
      '已看',
      $('<span class="complete-time">00:00:00</span>')
    )
    var $unfinishedDom = renderOptItemDom(
      '未看',
      $('<span class="unfinished-time">00:00:00</span>')
    )
    var $underwayDom = renderOptItemDom(
      '进行中',
      $('<span class="underway-time">00:00:00</span>')
    )
    var $optDom = $('<div></div>').css({
      marginTop: '10px',
      padding: '0 22px'
    })
    $optDom.append($curSpeedDom)
    $optDom.append($curMutedDom)
    $optDom.append($completeDom)
    $optDom.append($unfinishedDom)
    $optDom.append($underwayDom)
    return $optDom
  }

  function recordVideoTime() {
    var { completeTime, unfinishedTime } = calcMenuTime()
    $('.complete-time').text(secondToHour(completeTime))
    $('.unfinished-time').text(secondToHour(unfinishedTime))
  }

  function recordFaceSection() {
    $('.change_chapter').each(function () {
      if (Number(this.dataset.isface) === 1) {
        var item = $(this).find('.course_study_menutitle')
        item.html(`
          ${item.html()}
          <span style="color: yellow;font-weight: 500;">【人脸识别】</span>
        `)
      }
    })
  }

  $(function () {
    function toggleSpeed(index = 0) {
      var speed = speedList[index]
      console.log(`视频 ${speed} 倍播放`)
      $('.speed-span').eq(index).css(activeSpeedStyle)
      $('.speed-span').eq(index).siblings().css(speedStyle)
      $('.current-speed').html(speed)
      $('#studymovie')[0].playbackRate = speed
      speedIndex = index
    }

    function init() {
      var $speedListDom = renderSpeedListDom()
      var $optDom = renderOptDom()

      var $speedDom = $('<div></div>').css({
        position: 'fixed',
        right: 0,
        top: 0,
        background: '#fff',
        padding: '15px 0'
      })

      $speedDom.append($speedListDom)
      $speedDom.append($optDom)

      $('body').append($speedDom)

      $('.current-muted').prop('checked', muted)

      setInterval(() => {
        var btnList = document.querySelectorAll('.layui-layer-btn0')
        if (btnList.length) {
          console.log('阻拦视频播放弹窗已关闭')
          btnList.forEach(item => {
            item.click()
          })
        }
      }, 1000)

      // 菜单点击
      $('.change_chapter').on('click', function () {
        if (Number(this.dataset.lock) === 1) {
          console.log('这个视频未解锁')
        } else {
          setTimeout(() => {
            // 兼容视频播放结束点击下一个
            toggleSpeed(speedIndex)
          }, 500)
        }
      })

      recordVideoTime()
      recordFaceSection()

      // 点击速度列表
      $('.speed-span').on('click', function () {
        toggleSpeed($(this).index())
      })

      $('.current-muted').on('change', function () {
        video.muted = $(this).prop('checked')
        muted = $(this).prop('checked')
      })

      // 视频点击开始
      video.addEventListener('play', function (e) {
        video.muted = muted
      })

      video.addEventListener('timeupdate', function (e) {
        var currentTime = parseInt(video.currentTime)
        $('.underway-time').text(secondToHour(currentTime))
      })

      // 视频播放结束
      video.addEventListener('ended', function () {
        console.log('当前视频播放结束')
        var activeItem = $('.course_study_sonmenu.on')
        if (activeItem.length) {
          var nextItem = activeItem.parent().next()
          if (nextItem.length) {
            console.log('两秒后播放下一视频')
            setTimeout(() => {
              nextItem.find('.change_chapter').click()
              recordVideoTime()
            }, 2000)
          }
        }
      })
    }

    init()
  })

})();