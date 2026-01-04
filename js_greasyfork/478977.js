// ==UserScript==
// @name         华水成人联大脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  刷题
// @author       You
// @match        *://*.jxjypt.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478977/%E5%8D%8E%E6%B0%B4%E6%88%90%E4%BA%BA%E8%81%94%E5%A4%A7%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/478977/%E5%8D%8E%E6%B0%B4%E6%88%90%E4%BA%BA%E8%81%94%E5%A4%A7%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const div = document.createElement('div');
  div.innerHTML = `<ul>
  <li><p style='color: red'>自动学习(根据类型选择答题)</p></li>
  <li data-watch>看视频(如果需要停止，刷新页面即可)</li>
  <li data-select>选择题(执行会有两秒延迟)</li>
  <li data-group>综合题(执行会有两秒延迟)</li>
  </ul>`;

  div.style.position = 'fixed';
  div.style.top = '0';
  div.style.right = '0';
  div.style.zIndex = '9999';

  document.body.appendChild(div);

  div.addEventListener('click', (e) => {
    if (getAttributes(e, 'data-select')) {
      selectStart()
    }

    if (getAttributes(e, 'data-watch')) {
      watchStart()
    }

    if (getAttributes(e, 'data-group')) {
      groupStart()
    }
  })

  function getAttributes(e, attr) {
    if (e.target.hasAttribute(attr)) {
      return true
    }
    return false
  }

  function selectStart() {
    //  选择题
    const doms2 = Array.from(document.querySelectorAll('.zkjx'))
    doms2.forEach(item => {
      item.click()
    })

    setTimeout(() => {
      const cAnswers = Array.from(document.querySelectorAll('.subject-con .sub-answer'))

      const keys = Array.from(document.querySelectorAll('.solution')).map(item => item.innerText)

      keys.forEach((item, index) => {
        const options = Array.from(cAnswers[index].children)
        const res = options.filter(o => item.includes(o.dataset.value))
        if (res && res.length > 0) {
          res.forEach(option => {
            option.click()
          })
        }
      })
    }, 2000);

  }

  function watchStart() {
    const catalog = Array.from(document.querySelectorAll('.fa-youtube-play'))
    let catalogItem = catalog.shift()
    // 点击展示右边课程视频
    catalogItem.click()
    setTimeout(() => {
      // 点击播放学习视频
      document.querySelector('.outter').click()
      // 点击选择题木
      const selects = Array.from(document.querySelectorAll('.m-question-option'))

      function answer() {
        const item = selects.shift()
        item.click()

        setTimeout(() => {
          const result = document.getElementById('tips').innerText

          if (item && result.includes('误')) {
            answer()

          } else {
            setTimeout(() => {
              watchStart()
            }, (Math.floor(Math.random() * (4 - 1)) + 1) * 6000)
          }
        }, 3000)
      }

      answer()

    }, 3000)
  }

  function groupStart() {
    const judge = () => {
      const doms2 = Array.from($('.zkjx'))
      doms2.forEach(item => {
        item.click()
      })

      const cAnswers = $('.subject-con .sub-answer')

      const keys = Array.from($('.subject-con .solution em')).map(item => {
        return $(item).text()
      })

      keys.forEach((item, index) => {
        const options = Array.from(cAnswers[index].children)
        const option = options.find(
          optionsItem => optionsItem.dataset.value === item
        )
        if (option) {
          option.click()
        }
      })
    }

    // judge();



    const showAnswer = () => {
      const doms2 = Array.from($('.zkjx'))
      doms2.forEach(item => {
        item.click()
      })
    }

    showAnswer()

    /**
     * @description:收集答案
     * @param {*}
     * @return {*}
     */
    const collectAnswer = () => {

      const arr = []

      const parent = Array.from($('.jiandati  .solution'))
      // debugger

      console.log(parent)
      parent.forEach((item, index) => {
        arr.push($(item).html())
      })

      return arr
    }
    // .children('wenzi')

    const collectInput = () => {
      return Array.from($('.subject-con .e__textarea'))
    }

    const execute2 = () => {
      const answers = collectAnswer()
      const inputs = collectInput()
      answers.forEach((item, index) => {
        $(inputs[index]).focus()
        // debugger
        item = item.replace(/答案解析\：暂无/g, '')

        $(inputs[index]).val(item.replace(/参考答案\：/g, ''))
        $(inputs[index]).change()
      })
    }

    setTimeout(() => {
      execute2()
    }, 2000);
  }


})();