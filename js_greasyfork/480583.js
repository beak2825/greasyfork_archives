// ==UserScript==
// @name         BIT-本硕博一体化-考试安排-下载日历
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  生成未完成考试的 iCalendar 文件并下载
// @license      GPL-3.0-or-later
// @supportURL   https://github.com/YDX-2147483647/BIT-enhanced/issues
// @author       Y.D.X.
// @match        http://jxzxehallapp.bit.edu.cn/jwapp/sys/studentWdksapApp/*default/index.do
// @match        http://jxzxehallapp.bit.edu.cn/jwapp/sys/studentWdksapApp/*default/index.do*
// @match        https://jxzxehallapp.bit.edu.cn/jwapp/sys/studentWdksapApp/*default/index.do
// @match        https://jxzxehallapp.bit.edu.cn/jwapp/sys/studentWdksapApp/*default/index.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480583/BIT-%E6%9C%AC%E7%A1%95%E5%8D%9A%E4%B8%80%E4%BD%93%E5%8C%96-%E8%80%83%E8%AF%95%E5%AE%89%E6%8E%92-%E4%B8%8B%E8%BD%BD%E6%97%A5%E5%8E%86.user.js
// @updateURL https://update.greasyfork.org/scripts/480583/BIT-%E6%9C%AC%E7%A1%95%E5%8D%9A%E4%B8%80%E4%BD%93%E5%8C%96-%E8%80%83%E8%AF%95%E5%AE%89%E6%8E%92-%E4%B8%8B%E8%BD%BD%E6%97%A5%E5%8E%86.meta.js
// ==/UserScript==

(function () {
  'use strict'

  /**
   * 等待元素出现
   * @param {string} selector 元素的 CSS 选择器
   * @param {number} interval 单位为 ms
   * @returns {Promise<HTMLElement>}
   */
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

  /**
   * 左补零，最多补一位
   * @param {number} number
   * @returns {string}
   */
  function pad (number) {
    if (number < 10) {
      return '0' + number.toString()
    }
    return number.toString()
  }
  function iCal_time_format (date) {
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString#description
    return date.getFullYear() +
            pad(date.getMonth() + 1) +
            pad(date.getDate()) +
            'T' + pad(date.getHours()) +
            pad(date.getMinutes()) +
            pad(date.getSeconds())
  }
  function iCal_UTC_time_format (date) {
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString#description
    return date.getUTCFullYear() +
            pad(date.getUTCMonth() + 1) +
            pad(date.getUTCDate()) +
            'T' + pad(date.getUTCHours()) +
            pad(date.getUTCMinutes()) +
            pad(date.getUTCSeconds()) +
            'Z'
  }
  function filename_date_format (date) {
    return [date.getFullYear(),
      pad(date.getMonth() + 1),
      pad(date.getDate())].join('')
  }

  function trim_course_name (name) {
    // 这是从 python 改过来的
    name = name.replace(/^\d{9}\[(.+)\]$/, '$1') // 去除课程编号
    name = name.replace(/\s/g, '')
    name = name.replace(/.+\//, '') // "体育/"
    name = name.replace(/[A-E]/, '')
    name = name.replace(/[Ⅰ-Ⅻ]/, match => match.codePointAt() - 'Ⅰ'.codePointAt() + 1)
    name = name.replace(/I{1,3}/, match => match.length)
    name = name.replace(/[(（].+[)）]/, '')
    return name
  }
  function trim_place_name (name) {
    // 这是从 python 改过来的
    if (name === '良乡工程训练中心') {
      return '工训楼'
    }

    name = name.replace(/^([综理])教楼/, '$1教')
    name = name.replace('良乡', '')
    name = name.replace(/^(文[一二三四])楼/, '$1')
    name = name.replace(/^文教([南北])楼/, '文$1')
    name = name.replace(/[一二三四五六七]层([0-9])/, '$1')
    name = name.replace(/教?室$/, '')
    return name
  }

  function get_detail (card_view) {
    const select = selector => card_view.querySelector(selector).textContent

    const event = {}
    event.summary = '期末考试：' + trim_course_name(select('h3'))
    event.location = trim_place_name(select('.bh-mt-16 >  div:nth-child(2) span'))

    const time_range_str = card_view.querySelector(
      '.bh-mt-16 >  div:nth-child(1) > div:first-child > span'
    ).childNodes[1].textContent
    const time_range_groups = time_range_str.match(
      /^(?<date>\d{4}-\d{2}-\d{2}) (?<start_time>\d{2}:\d{2})-(?<end_time>\d{2}:\d{2})\(星期.\)$/
    ).groups

    event.start = new Date(time_range_groups.date + ' ' + time_range_groups.start_time)
    event.end = new Date(time_range_groups.date + ' ' + time_range_groups.end_time)

    return event
  }

  let _count_iCal = 0
  function detail_to_iCal_event (detail) {
    const uid = `${(new Date()).toISOString()}-${pad(_count_iCal)}@ydx`
    _count_iCal++

    return `BEGIN:VEVENT
            SUMMARY:${detail.summary}
            DTSTART;VALUE=DATE-TIME:${iCal_time_format(detail.start)}
            DTEND;VALUE=DATE-TIME:${iCal_time_format(detail.end)}
            DTSTAMP;VALUE=DATE-TIME:${iCal_UTC_time_format(new Date())}
            UID:${uid}
            LOCATION:${detail.location}
            END:VEVENT
            `.replace(/\s{4,}/gm, '\n')
  }

  function generate_iCal () {
    let cal = `BEGIN:VCALENDAR
            VERSION:2.0
            PRODID:-//YDX//BIT iCalendar//
            `.replace(/\s{4,}/gm, '\n')
    document.querySelectorAll(tests_to_take).forEach(c => {
      cal += detail_to_iCal_event(get_detail(c))
    })
    cal += 'END:VCALENDAR\n'

    return cal
  }

  function create_download_btn () {
    const btn = document.createElement('a')
    btn.innerText = '🡇下载'
    btn.download = `考试安排-${filename_date_format(new Date())}.ics`
    document.querySelector(tests_to_take_btn).children[1].children[0].appendChild(btn)

    btn.addEventListener('click', () => {
      const blob = new Blob([generate_iCal()], { type: 'text/calendar' })
      btn.href = URL.createObjectURL(blob)
    })
  }

  const tests_to_take_btn = '#wdksap-wkks-btn' // 我的考试安排-未考考试-button
  const tests_to_take = tests_to_take_btn + ' ~ .wdksap-wkks-content .scenes-cbrt-card-view'

  wait_until_presence(tests_to_take_btn, 1000).then(create_download_btn)
})()
