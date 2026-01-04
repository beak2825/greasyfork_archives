// ==UserScript==
// @name         知乎答案格式化
// @namespace    zhihu_helper_tool
// @version      1.0.5
// @description  答案格式化
// @author       浮游
// @match        *://www.zhihu.com/question/*
// @connect      zhihu.com
// @connect      vzuu.com
// @require      https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.20/lodash.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.min.js
// @run-at       document-start
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_info
// @grant        GM_download
// @charset		 UTF-8
// @downloadURL https://update.greasyfork.org/scripts/414197/%E7%9F%A5%E4%B9%8E%E7%AD%94%E6%A1%88%E6%A0%BC%E5%BC%8F%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/414197/%E7%9F%A5%E4%B9%8E%E7%AD%94%E6%A1%88%E6%A0%BC%E5%BC%8F%E5%8C%96.meta.js
// ==/UserScript==

;(function() {
  'use strict'
  document.addEventListener('DOMContentLoaded', () => {
    addButtonStyle()
    // addFormatStyle()
  })

  const controllerClass = 'showNew'
  const newClass = '_new'
  const storageKey = 'SHOW_NEW'

  const showNew = () => {
    $('body').addClass(controllerClass)
  }

  const read = () => {
    const t = +localStorage.getItem(storageKey)
    log(t)
    if (t) {
      showNew()
    }
  }

  const log = console.log.bind(console)

  const innerSplit = (str, symbol) => {
    return str.split(symbol)
  }

  const splitStrings = (arr, symbol) => {
    let output = []
    for (let i = 0; i < arr.length; ++i) {
      let s = arr[i].trim()
      let temp = innerSplit(s, symbol)
      output = output.concat(temp)
    }
    return output
  }

  const smashString = (str, symbols) => {
    let output = innerSplit(str, '，')
    symbols.forEach(s => {
      output = splitStrings(output, s)
    })
    return output.filter(s => s.length)
  }

  const parse = (ss, symbol) => {
    let result = ''
    let line = ''
    for (let i = 0; i < ss.length; ++i) {
      let s = ss[i].trim()
      line += s + ' '
      if (line.length > 20) {
        result += line + symbol
        line = ''
      }
    }
    // bug
    if (line.length) {
      result += line
    }
    return result
  }

  // 思路：run只重新生成一个dom。。然后点击的时候切换dom即可

  const run = () => {
    let answer = $('.RichContent-inner').eq(0)
    let copy = answer.clone()
    answer.addClass('_origin')

    // copy.addClass(newClass).css('color', 'red');
    copy.addClass(newClass)
    answer.after(copy)

    let ps = copy.find('p')
    ps.each(function() {
      let arr = smashString($(this).html(), [',', ' ', '。'])
      let temp = parse(arr, '<br>')
      $(this).html(temp)
    })
  }

  // const showOrigin = () => {
  // toggleClass
  //   $('body')
  //     .removeClass(controllerClass)
  // }
  // const showNew = () => {
  //   $('body')
  //     .addClass(controllerClass)
  // }

  const addButtonStyle = () => {
    var x = `
    body ._origin {
      display: block!important;
    }

    body .${newClass} {
      display: none!important;
    }

    body.showNew ._origin {
      display: none!important;
    }

    body.showNew .${newClass} {
      display: block!important;
    }

    .formatButton {
      margin: 10px;
      position: fixed;
      top: 0;
      right: 0;
      z-index: 9999;
      border-radius: 56px;
      padding: 6px 36px;
      background: #eee;
      color: #737070;
      transition: all 1s;
      font-size: 12px;

      box-shadow: 1px 1px 20px #e1e1e1;
    }

    body.showNew .formatButton {
      background: #e1e1e1;
      background: linear-gradient(0deg, #0384ff, #5a9cda);
      color: #fff;
    }
    `
    var y = document.createElement('style')
    y.innerHTML = x
    document.getElementsByTagName('head')[0].appendChild(y)
  }

  const addFormatStyle = () => {
    var x = `
    .formatButton {
      margin: 10px;
      position: fixed;
      top: 0;
      right: 0;
      z-index: 9999;
      border: 2px solid #67cdef;
      border-radius: 6px;
      padding: 10px;
      background-color: #0084ff;
      color: white;
    }

    .VoteButton {
    color: #be1480;
    background: #43ad7f7f;
    }

    div.Question-mainColumn {
    margin: auto !important;
    width: 100% !important;
    }

  //   div.Question-sideColumn,.Kanshan-container {
  //   display: none !important;
    }

    .Profile-mainColumn {
    margin: auto !important;
    width: 100% !important;
    }

  //   .AuthorInfo-content, .AppHeader {
  //   display: none !important;
  //   }

  //   .ProfileHeader-content, .Profile-sideColumn{
  //   display: none !important;
  //   }

    figure {
    max-width: 70% !important;
    }

    .RichContent-inner {
    line-height: 30px !important;
    margin: 40px 60px !important;
    padding: 40px 50px !important;
    border: 6px dashed rgba(133,144,166,0.2) !important;
    border-radius: 6px !important;
    }

    .Comments {
    padding: 12px !important;
    margin: 60px !important;
    }

    `
    var y = document.createElement('style')
    y.innerHTML = x
    document.getElementsByTagName('head')[0].appendChild(y)
  }

  const shiftDom = newDom => {}

  const _main = () => {
    let root = document.getElementById('root')
    let button = document.createElement('button')
    let formatted = false

    button.innerHTML =
      '<button class="formatButton" type="button">格式化</button>'
    root.appendChild(button)

    // const [formattedDom, dom] = run()
    read()
    run()
    button.onclick = () => {
      const hasClass = $('body')
        .toggleClass(controllerClass)
        .hasClass(controllerClass)
      localStorage.setItem(storageKey, +hasClass)
    }
  }
  document.onreadystatechange = function() {
    if (document.readyState == 'complete') {
      log('执行页面加载结束')
      _main()
    }
  }
})()
