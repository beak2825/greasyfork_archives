// ==UserScript==
// @name         BIT-选课
// @namespace    http://tampermonkey.net/
// @version      0.3.5
// @description  计算饱和度
// @license      GPL-3.0-or-later
// @supportURL   https://github.com/YDX-2147483647/BIT-enhanced/issues
// @author       Y.D.X.
// @match        http://xk.bit.edu.cn/xsxkapp/sys/xsxkapp/*default/curriculavariable.do*
// @match        https://xk.bit.edu.cn/xsxkapp/sys/xsxkapp/*default/curriculavariable.do*
// @match        https://webvpn.bit.edu.cn/http/77726476706e69737468656265737421e8fc0f9e2e2426557a1dc7af96/xsxkapp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473244/BIT-%E9%80%89%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/473244/BIT-%E9%80%89%E8%AF%BE.meta.js
// ==/UserScript==

// 虽然已经0.3了，但还只能计算并显示，不能适时刷新。先手动单击上边栏来刷新吧……

(function () {
  'use strict'

  function wait_until_presence (selector, interval) {
    return new Promise((resolve, reject) => {
      const check = setInterval(function () {
        if (document.querySelector(selector)) {
          clearInterval(check)
          resolve(document.querySelector(selector))
        }
      }, interval)
    })
  }

  // 公选课
  const pattern = /(\d+)/u
  // 系统推荐课程、体育课
  const pattern1 = /课容量：(?<capacity>\d+)人?/u
  const pattern2 = /^已报第一志愿：(?<applicant>\d+)人?，已选中?(人数)?：(?<accepted>\d+)$/u

  function calculate_rate (course_info) {
    return course_info.applicant / (course_info.capacity - (course_info.accepted ? course_info.accepted : 0))
  }

  function add_rate (course_card) {
    let info = {}
    let rate_span

    if (document.querySelector('.cv-active > #aPublicCourse')) { // 公选课
      // Get info.
      const cv_row = course_card
      info = {
        capacity: cv_row.querySelector('.cv-capacity-col').textContent.match(pattern)[1],
        applicant: cv_row.querySelector('.cv-firstVolunteer-col').textContent.match(pattern)[1]
      }

      // Record the rate.
      if (cv_row.querySelector('.cv-firstVolunteer-col').textContent.includes('饱和度')) {
        rate_span = cv_row.querySelector('.cv-firstVolunteer-col > span:nth-child(3)')
      } else {
        const rate_row = cv_row.querySelector('.cv-firstVolunteer-col')

        rate_row.innerHTML += '<br/>'

        const title_span = document.createElement('span')
        title_span.textContent = '饱和度：'
        rate_row.appendChild(title_span)

        rate_span = document.createElement('span')
        rate_row.appendChild(rate_span)
      }
    } else { // 系统推荐课程、体育课
      // Get info.
      const rows = course_card.querySelector('.cv-info').children

      Object.assign(info, rows[3].textContent.match(pattern1).groups)
      Object.assign(info, rows[4].textContent.match(pattern2).groups)

      // Record the rate.
      if (rows[5].textContent.includes('饱和度')) {
        rate_span = rows[5].children[1]
      } else {
        const rate_row = rows[4].cloneNode()
        rows[5].parentNode.insertBefore(rate_row, rows[5])

        const title_span = document.createElement('span')
        title_span.textContent = '饱和度：'
        rate_row.appendChild(title_span)

        rate_span = document.createElement('span')
        rate_row.appendChild(rate_span)
      }
    }

    const rate = calculate_rate(info)

    rate_span.textContent = rate.toFixed(3)
    if (rate >= 10 || isNaN(rate)) {
      rate_span.style.color = 'Red'
    } else if (rate >= 3.162) {
      rate_span.style.color = 'OrangeRed'
    } else if (rate >= 1) {
      rate_span.style.color = 'Darkorange'
    } else if (rate >= 0.9) {
      rate_span.style.color = 'Black'
    }
  }

  function add_listeners_for_rate () {
    if (document.querySelector('.cv-active > #aPublicCourse')) { // 公选课
      document.querySelectorAll('#publicBody > .cv-row').forEach(add_rate)
    } else { // 系统推荐课程、体育课
      document.querySelectorAll('.cv-row').forEach(row => {
        // 当场更新
        row.querySelectorAll('.cv-course-card').forEach(add_rate)

        // 展开细节后也更新
        row.addEventListener('click', () => {
          wait_until_presence('.cv-course-card > .cv-info > .cv-caption-text').then(() => {
            row.querySelectorAll('.cv-course-card').forEach(add_rate)
          })
        }, { once: true })
      })
    }
  }

  add_listeners_for_rate()

  // 虽然不可行，但多点一下那里即可。
  document.querySelector('header.cv-page-header').addEventListener('click', add_listeners_for_rate)
  // document.querySelector("header.cv-page-header").addEventListener("click", () => {
  //     document.querySelectorAll(".cv-foot").forEach(
  //         e => {e.addEventListener("click", add_listeners_for_rate);}
  //     );
  // });
})()
