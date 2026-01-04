// ==UserScript==
// @name         亿赛通oa工时自动计算
// @namespace    http://tampermonkey.net/
// @version      0.6.0
// @description  亿赛通oa工时自动计算脚本 http://jsrun.net/2wsKp.js
// @author       hangj
// @match        https://oa.esafenet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=0.26
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/dayjs/1.11.9/dayjs.min.js
// @downloadURL https://update.greasyfork.org/scripts/453811/%E4%BA%BF%E8%B5%9B%E9%80%9Aoa%E5%B7%A5%E6%97%B6%E8%87%AA%E5%8A%A8%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/453811/%E4%BA%BF%E8%B5%9B%E9%80%9Aoa%E5%B7%A5%E6%97%B6%E8%87%AA%E5%8A%A8%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==
;(function () {
  'use strict'
  let dataArray = [], dataArrayIds = new Set();
  // 主入口，监听主页面加载
  let timerId, isSelfChange = false
  ;(function mainFunc() {
    let main = document.querySelector('#themeLayoutRoute')
    if (main == null) {
      setTimeout(mainFunc, 500)
    } else {
      new MutationObserver((mutationsList, observer) => {
        if (isSelfChange == false) {
          isSelfChange = true
          clearTimeout(timerId)
          timerId = setTimeout(() => {
            new Promise((resolve, reject) => {
              const title = document.querySelector('.wea-new-top-title-breadcrumb')
              if (title.innerText.startsWith('个人考勤查询')) {
                title.innerText = '个人考勤查询^_^ by jackkke'
                Array.from(document.querySelectorAll('table > tbody > tr'))
                  .map((tr) => spansToData(tr))
                  .filter((data) => data != null)
                  .forEach((data) => dataArray.push(data))
                resolve(dataArray)
              } else {
                reject('非考勤页面，结束')
              }
            }).then(result).catch((error) => console.error(error)).finally(() => (isSelfChange = false))
          }, 2000)
        }
      }).observe(main, { childList: true, subtree: true })
    }
  })()
  // 页面元素转对象
  function spansToData(tr) {
    const spans = tr.querySelectorAll('span.wea-url')
    const date = spans[2].innerText
    let data = {
      date: date,
      week: spans[3].innerText,
      dept: spans[0].innerText,
      name: spans[1].innerText,
      er: spans[6].innerText,
      startTime: new Date(date + ' ' + spans[4].innerText),
      endTime: new Date(date + ' ' + spans[5].innerText)
    }
    data = Object.assign({}, data, {
      hour: dayjs(data.endTime).diff(dayjs(data.startTime), 'hour', true),
      month: dayjs(data.startTime).format('YYYY-MM'),
      isHolidayFlag: isHoliday(data.startTime),
      endTime: data.er !== '' ? dayjs(data.endTime).day(1).toDate() : data.endTime,
      shouldEndTimeDayjs: dayjs(data.startTime).add(data.isHolidayFlag ? 8 : 9.5, 'hour')
    })
    tr.style['background-color'] = ''
    spans[6].innerText = ''
    spans[6].style['font-weight'] = 'bold'
    if (dayjs(data.endTime) > data.shouldEndTimeDayjs.valueOf()) {
      if (!data.isHolidayFlag && data.hour < 9.5) {
        spans[6].innerText = spans[6].innerText + '（' + data.hour.toFixed(2) + 'h）'
        tr.style['background-color'] = 'red'
      }
    } else {
      spans[6].innerText = spans[6].innerText + data.shouldEndTimeDayjs.format('（HH:mm:ss）')
    }
    if (!dataArrayIds.has(data.date)) {
      dataArrayIds.add(data.date)
      return data
    }
  }
  // 数据渲染到标题
  function result(result) {
    const title = document.querySelector('.wea-new-top-title-breadcrumb')
    const groupedData2 = groupByKey(result, 'month', 'isHolidayFlag')
    let titleStr = ''
    for (const month in groupedData2) {
      const jiaqi = groupedData2[month][true] || []
      const work = (groupedData2[month][false] || []).filter(o => dayjs(o.startTime) < dayjs().startOf('day') || o.hour >= 9.5)
      const total = [...jiaqi, ...work]
      if (total.length > 0 && work.length > 0) {
        var pjz = average(work.map(o => o.hour - 1.5))
        var jqzz = sum(jiaqi.map(o => o.hour - 1.5))
        var cqts = calculateWorkingDays(month)
        titleStr += month
          + "，总时长：" + sum(work.map(o => o.hour - 1.5))
          + "，天数：" + work.length
          + "，平均：" + pjz
          + "，强度，" + percentage(pjz, 8) + '%'
          + "，加班总计" + jqzz
          + "，应出勤天数：" + cqts
          + "，加班强度：" + percentage(jqzz, cqts * 8) + "%"
          + "\n"
      }
    }
    title.title = titleStr
  }
})();