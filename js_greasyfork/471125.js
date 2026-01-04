// ==UserScript==
// @name         BIT-乐学-折叠每节的公告等重复内容
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  在单独页面显示小节的课程，每个页面开头都会有基本无用的重复内容。这个脚本可以折叠它并提供展开按钮。
// @license      GPL-3.0-or-later
// @supportURL   https://github.com/YDX-2147483647/BIT-enhanced/issues
// @author       Y.D.X.
// @match        https://lexue.bit.edu.cn/course/view.php?id=*&section=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471125/BIT-%E4%B9%90%E5%AD%A6-%E6%8A%98%E5%8F%A0%E6%AF%8F%E8%8A%82%E7%9A%84%E5%85%AC%E5%91%8A%E7%AD%89%E9%87%8D%E5%A4%8D%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/471125/BIT-%E4%B9%90%E5%AD%A6-%E6%8A%98%E5%8F%A0%E6%AF%8F%E8%8A%82%E7%9A%84%E5%85%AC%E5%91%8A%E7%AD%89%E9%87%8D%E5%A4%8D%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function () {
  'use strict'

  function add_style_sheet () {
    const sheet = document.createElement('style')
    sheet.innerHTML = `
        [role=main] > .course-content > .collapse-content {
            height: 15em;
            overflow: auto;
        }

        .hider {
            margin-top: -4em;
            background: linear-gradient(#0000, lightgray);
            height: 4em;

            display: grid;
            place-content: center;
        }
        #show-all {
            z-index: 2;
        }
        `
    document.head.appendChild(sheet)
  }

  const course_content = document.querySelector('[role=main] > .course-content')
  const front_content = course_content.querySelector('.course-content > ul:first-child')
  const single_section = course_content.querySelector('.single-section')
  const collapse = 'collapse-content' // moodle 已经占用了 .collapse:not(.show)

  function trim_headings () {
    front_content.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
      h.textContent = h.textContent.trim()
    })
  }

  function add_show_all_button () {
    const div = document.createElement('div')
    div.classList.add('hider')
    div.innerHTML = '<button id="show-all">▼展开</button>'
    course_content.insertBefore(div, single_section)

    div.querySelector('#show-all').addEventListener('click', () => {
      front_content.classList.remove(collapse)
      div.hidden = true
    })
  }

  function initiate_collapse () {
    front_content.classList.add(collapse)
  }

  if (front_content.clientHeight > 1 / 3 * window.innerHeight) {
    add_style_sheet()

    trim_headings()
    initiate_collapse()
    add_show_all_button()
  }
})()
