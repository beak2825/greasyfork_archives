// ==UserScript==
// @name         BIT-乐学-修改侧边栏课程
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  在侧边栏添加并重新排列课程
// @license      GPL-3.0-or-later
// @supportURL   https://github.com/YDX-2147483647/BIT-enhanced/issues
// @author       Y.D.X.
// @match        https://lexue.bit.edu.cn/*
// @match        https://webvpn.bit.edu.cn/https/77726476706e69737468656265737421fcf25989227e6a596a468ca88d1b203b/*
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/470832/BIT-%E4%B9%90%E5%AD%A6-%E4%BF%AE%E6%94%B9%E4%BE%A7%E8%BE%B9%E6%A0%8F%E8%AF%BE%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/470832/BIT-%E4%B9%90%E5%AD%A6-%E4%BF%AE%E6%94%B9%E4%BE%A7%E8%BE%B9%E6%A0%8F%E8%AF%BE%E7%A8%8B.meta.js
// ==/UserScript==

// 使用方法请移步 https://ydx-2147483647.github.io/BIT-enhanced/ 。

(async function () {
  'use strict'
  /* global GM */

  /**
   * 课程描述
   * @typedef {Object} CourseDescription
   * @property {string} name - 想显示的课程名
   * @property {string} id - 课程链接最后的id，例如`https://lexue.bit.edu.cn/course/view.php?id=8819`就是`'8819'`
   * @property {?string} icon - FontAwesome v4 的图标名称，默认为`'graduation-cap'`。
   * @property {?string} comment - 给自己看的注释，比如为什么要屏蔽这门课
   */

  /**
   * GM 存储的配置
   * @typedef {Object} Config
   * @property {CourseDescription[]} show - 想添加的课程，有序，显示时前面的在上
   * @property {(string | CourseDescription)[]} hide - 想隐藏的课程
   */

  /**
   * 加载 GM 存储的配置
   * @returns {Promise<Config>}
   */
  async function load_config () {
    return {
      show: await GM.getValue('show', []),
      hide: await GM.getValue('hide', [])
    }
  }

  const config = await load_config()

  /**
   * `test`是否与`ref`是同一课程
   * @param {CourseDescription|string} ref
   * @param {CourseDescription} test
   */
  function course_match (ref, test) {
    if (typeof ref !== 'string') {
      return test.id === ref.id
    } else {
      return test.name.includes(ref)
    }
  }

  /**
   * 隐藏`config.hide`和`config.show`
   */
  function hide_courses () {
    document.querySelectorAll("a.list-group-item[href*='course/view.php'][data-indent='1'], a.list-group-item[href*='my'][data-indent='1']")
      .forEach(course_el => {
        const course = {
          name: course_el.querySelector('.media > span.media-body').textContent,
          id: course_el.dataset.key
        }

        if ([].concat(config.hide, config.show)
          .some(ref => course_match(ref, course))) {
          course_el.hidden = true
        }
      })
  }

  /**
   * 当前页面是否是是这个课程的页面
   * @param {CourseDescription} course
   * @todo 打开文件夹时，`id`不是课程id
   */
  function is_current_page (course) {
    /** @type {HTMLAnchorElement} */
    const course_home = document.querySelector("[data-key='coursehome']")
    if (!course_home) {
      // 未打开课程
      return false
    }

    const url = new URL(course_home.href)
    const params = url.searchParams
    return params.get('id') === course.id
  }

  /**
   * 添加课程
   * @param {CourseDescription} course
   */
  function append_course (course) {
    const anchor = document.createElement('a')
    anchor.dataset.key = course.id
    anchor.href = `https://lexue.bit.edu.cn/course/view.php?id=${course.id}`
    if (is_current_page(course)) {
      anchor.classList.add('active')
    }
    anchor.classList.add('list-group-item', 'list-group-item-action')

    anchor.innerHTML =
            `<div class="ml-1">
                <div class="media">
                    <span class="media-left">
                        <i class="icon fa fa-${course.icon || 'graduation-cap'} fa-fw " aria-hidden="true"></i>
                    </span>
                    <span class="media-body">${course.name}</span>
                </div>
            </div>`

    const li = document.createElement('li')
    li.appendChild(anchor)
    document.querySelector('#nav-drawer > nav.list-group:last-child > ul')
      .appendChild(li)
  }

  hide_courses()
  config.show.forEach(append_course)
})()
