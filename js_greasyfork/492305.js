// ==UserScript==
// @name         115一键选择相同
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  115文件去重助手
// @author       f5f5
// @match        https://115.com/?ct=file*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=115.com
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/492305/115%E4%B8%80%E9%94%AE%E9%80%89%E6%8B%A9%E7%9B%B8%E5%90%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/492305/115%E4%B8%80%E9%94%AE%E9%80%89%E6%8B%A9%E7%9B%B8%E5%90%8C.meta.js
// ==/UserScript==

;(function () {
  'use strict'
    // 高性能DOM排序函数
  function optimizeDOMSort(container, sortFn) {
    // 1. 获取所有子节点
    const children = Array.from(container.children)

    // 2. 从DOM中移除所有元素
    const fragment = document.createDocumentFragment()
    children.forEach((child) => fragment.appendChild(child))

    // 3. 内存中排序
    const sorted = children.sort(sortFn)

    // 4. 批量重新插入
    sorted.forEach((child) => fragment.appendChild(child))
    container.appendChild(fragment)
  }
  function timeToSeconds(timeStr) {
    const parts = timeStr.split(':');
    let seconds = 0;

    // 处理只有分钟和秒的情况 (MM:SS)
    if(parts.length === 2) {
        seconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    // 处理小时、分钟和秒的情况 (HH:MM:SS)
    else if(parts.length === 3) {
        seconds = parseInt(parts[0]) * 3600 +
                 parseInt(parts[1]) * 60 +
                 parseInt(parts[2]);
    }

    return seconds;
  }

  function showWarn() {
    const $toast = $(
      '<div id="repeatToast">没有找到重复文件，请检查是否已经按照大小或文件名排序？</div>'
    )
    const styleEl = $(`<style id="repeatToastStyle">#repeatToast {
            z-index: 9999;
            position: fixed;
            left: 50%;
            transform: translateX(-50%);
            top: 140px;
            background: rgba(0,0,0, .7);
            padding: 15px;
            font-size: 16px;
            color: #fff;
            border-radius: 20px;
        }</style>`)
    $(document.body).append(styleEl)
    $(document.body).append($toast)
    setTimeout(() => {
      $('#repeatToast').remove()
      $('#repeatToastStyle').remove()
    }, 3000)
  }
  setTimeout(function () {
    const el = jQuery('#js-panel_model_switch').next()
    const styleEl = document.createElement('style')
    styleEl.innerHTML = `
        .check-btn{
          border: 1px solid #f60;
          border-radius: 5px;
          padding: 0 8px;
          margin-right: 8px;
          cursor: pointer;
          color: #f60;
          line-height: 30px;
          display: inline-block;
          float: left;
        }`
    console.warn(el)
    if (el[0]) {
      document.head.appendChild(styleEl)
      var btnSize = $('<span class="check-btn check-btn-size">大小</span>')
      var btnTitle = $('<span class="check-btn check-btn-title">名字</span>')
      var btnTime = $('<span class="check-btn check-btn-title">时长</span>')
      var btnOne = $('<span class="check-btn check-btn-one">(1)</span>')
      var btnStart = $('<span class="check-btn check-btn-start">正则</span>')
      var btnReg = $('<span class="check-btn check-btn-start">正则单</span>')
      var btnTimeSort = $('<span class="check-btn check-btn-time-sort">时长排序</span>')

      el.after(btnTimeSort)
      el.after(btnReg)
      el.after(btnStart)
      el.after(btnOne)
      el.after(btnTime)
      el.after(btnTitle)
      el.after(btnSize)
      let getRes = false;
      btnSize.on('click', function () {
        getRes = false;
        Array.from(jQuery('.list-contents li')).forEach((el) => {
          let thisStr = $(el).attr('file_size')
          let thisType = $(el).attr('file_type')
          let $prev = $(el).prev()
          if ($prev[0]) {
            let prevStr = $prev.attr('file_size')
            if (thisType == '0' || !thisStr) return
            if (thisStr === prevStr) {
              $prev.find('.checkbox').click()
              getRes = true
            }
          }
        })
        if(!getRes) {
            showWarn()
        }
      })
      btnTitle.on('click', function () {
        getRes = false;
        Array.from(jQuery('.list-contents li')).forEach((el) => {
          let thisStr = $(el).attr('title').toUpperCase()
          let thisType = $(el).attr('file_type')
          let $prev = $(el).prev()
          if ($prev[0]) {
            let prevStr = $prev.attr('title').toUpperCase()
            if (thisType == '0' || !thisStr) return
            if (thisStr === prevStr) {
              $prev.find('.checkbox').click()
              getRes = true
            }
          }
        })
        if(!getRes) {
            showWarn()
        }
      })
      btnTime.on('click', function () {
        getRes = false;
        Array.from(jQuery('.list-contents li')).forEach((el) => {
          let thisStr = $(el).find('.duration').attr('duration')
          let thisType = $(el).attr('file_type')
          let $prev = $(el).prev()
          if ($prev[0]) {
            let prevStr = $prev.find('.duration').attr('duration')
            if (thisType == '0' || !thisStr) return
            if (thisStr === prevStr) {
              $prev.find('.checkbox').click()
              getRes = true
            }
          }
        })
        if(!getRes) {
            showWarn()
        }
      })
      btnOne.on('click', function () {
        getRes = false;
        Array.from(jQuery('.list-contents li')).forEach((el) => {
          let thisStr = $(el).attr('title')
          let thisType = $(el).attr('file_type')
          let str = ''
          if (thisType === '0') {
            str = thisStr.slice(thisStr.length - 3, thisStr.length)
          } else {
            let index = thisStr.lastIndexOf('.')
            str = thisStr.slice(index - 3, index)
          }
          // if(thisType == '0' || !thisStr) return
          if (!thisStr) return
          if (str === '(1)') {
            $(el).find('.checkbox').click()
            getRes = true
          }
        })
        if(!getRes) {
            showWarn()
        }
      })
      btnStart.on('click', function () {
        getRes = false;
        var str = window.prompt(
          '请输入正则，大括号【】内的内容为示例，两端的空格请用\\s ：\n【^.{8}】代表前8位相同 \n【^\\w+-\\d+】代表匹配开头的 300maan-456 此类番号'
        )
        str = str.trim()
        if (!str) return alert('输入不合法')
        var reg = new RegExp(str, 'i')
        Array.from(jQuery('.list-contents li')).forEach((el) => {
          let thisStr = $(el).attr('title')
          let thisTarget = thisStr.match(reg)
          if (thisTarget && thisTarget[0]) {
            thisTarget = thisTarget[0].toLowerCase()
          }
          let $prev = $(el).prev()
          if ($prev[0]) {
            let prevStr = $prev.attr('title')
            if (!thisTarget) return
            try {
              var prevTarget = prevStr.match(reg)
              if (prevTarget && prevTarget[0]) {
                prevTarget = prevTarget[0].toLowerCase()
              }
              if (prevTarget && prevTarget === thisTarget) {
                $prev.find('.checkbox').click()
                getRes = true
              }
            } catch (error) {
              console.error(error)
            }
          }
        })
        if(!getRes) {
            showWarn()
        }
      })

      btnReg.on('click', function () {
        getRes = false;
        var str = window.prompt(
          '请输入正则，大括号【】内的内容为示例，两端的空格请用\\s ：\n【^.{8}】代表前8位相同 \n【^\\w+-\\d+】代表匹配开头的 300maan-456 此类番号'
        )
        str = str.trim()
        if (!str) return alert('输入不合法')
        var reg = new RegExp(str, 'i')
        Array.from(jQuery('.list-contents li')).forEach((el) => {
          let thisStr = $(el).attr('title')
          let thisTarget = thisStr.match(reg)
          if (thisTarget && thisTarget[0]) {
            getRes = true;
            thisTarget = thisTarget[0].toLowerCase()
            $(el).find('.checkbox').click()
          }
        })
        if(!getRes) {
            showWarn()
        }
      })
      btnTimeSort.on('click', () => {
        optimizeDOMSort(
          $('.list-contents>ul')[0],
            (a, b) => {
              let atime = $(a).find('.duration').attr('duration')
              let btime = $(b).find('.duration').attr('duration')
              if (atime) {
                atime = timeToSeconds(atime)
              }
              if (btime) {
                btime = timeToSeconds(btime)
              }
              if(!atime || !btime) {
                  return -1
              }
              return btime - atime
            }
        );
      })
    }
    document.addEventListener('keydown', (e) => {
      console.error(e.keyCode)
      if (e.keyCode === 46 || e.keyCode === 8) {
        try {
          var el = document.querySelector('[menu="delete"]')
              el.offsetParent && el.click()
        } catch (e) {
          console.log(e)
        }
      }
    })
  }, 2000)
})()
