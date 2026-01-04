// ==UserScript==
// @name         Sort courses on CLE Home
// @namespace    https://ciffelia.com/
// @version      1.0.0
// @description  CLEホーム画面で授業を時間割順に並べ替え
// @author       Ciffelia <mc.prince.0203@gmail.com> (https://ciffelia.com/)
// @include      https://www.cle.osaka-u.ac.jp/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_22_1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426161/Sort%20courses%20on%20CLE%20Home.user.js
// @updateURL https://update.greasyfork.org/scripts/426161/Sort%20courses%20on%20CLE%20Home.meta.js
// ==/UserScript==

(() => {
  const periodRegex = /([月火水木金土])(\d)/
  const days = ['月', '火', '水', '木', '金', '土']

  const getPositionInTimetable = courseTitle => {
    const match = periodRegex.exec(courseTitle)

    if (match == null) {
      // Not in timetable
      return 999
    } else {
      const day = match[1]
      const period = parseInt(match[2])
      return days.indexOf(day) * 10 + period
    }
  }

  const sortCourses = () => {
    const courseListContainer = document.querySelector('#_3_1termCourses_noterm > ul')
    const courseListItems = courseListContainer.querySelectorAll(':scope > li')

    const sortedCourseListItems = Array.from(courseListItems).sort((a, b) => {
      return getPositionInTimetable(a.innerText) - getPositionInTimetable(b.innerText)
    })

    for (const item of sortedCourseListItems) {
      courseListContainer.removeChild(item)
      courseListContainer.appendChild(item)
    }
  }

  const div_3_1 = document.getElementById('div_3_1')
  if (div_3_1.innerText.includes('現在のコース')) {
    // Course list already exists
    sortCourses()
  } else {
    // Wait until cource list exists
    const observer = new MutationObserver(() => {
      observer.disconnect()
      sortCourses()
    })
    observer.observe(div_3_1, { childList: true })
  }
})()
