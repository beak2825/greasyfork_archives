// ==UserScript==
// @name              Youtube Live Clock
// @name:zh-TW        Youtube Live Clock
// @namespace         https://greasyfork.org/scripts/453367
// @version           1.8.1
// @description       show duration for livestreams and present time for archives
// @description:zh-TW 顯示直播及直播存檔當下的時間
// @author            Derek
// @match             *://www.youtube.com/*
// @run-at            document-start
// @grant             GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/453367/Youtube%20Live%20Clock.user.js
// @updateURL https://update.greasyfork.org/scripts/453367/Youtube%20Live%20Clock.meta.js
// ==/UserScript==

(() => {
  //you can choose your ideal date format by changing the FORMAT's value below
  const FORMAT = 1
  /*
    1: 2022/10/31 06:37:10 (default)
    2: 10/31/2022 06:37:10
    3: 31/10/2022 06:37:10
    4: Mon 31/10/2022 06:37:10
    5: Monday 31/10/2022 06:37:10
    6: Monday 31 October 2022 06:37:10
  */

  GM_addStyle(`
    .ytp-chrome-bottom .ytp-time-display,
    .ytp-chrome-bottom .ytp-right-controls {
      display: flex !important;
    }
    #present-time {
      margin: 0 10px 0 5px !important;
    }
  `)

  const $ = (element) => document.querySelector(element)

  const abbr = {
    week: { Sun: 'Sunday', Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday' },
    monthFull: { Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April', May: 'May', Jun: 'June', Jul: 'July', Aug: 'August', Sep: 'September', Oct: 'October', Nov: 'November', Dec: 'December' },
    month: { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' }
  }

  const twoDigit = (num) => num.toString().padStart(2, '0')

  const timeFormat = (time) => {
    const second = time % 60
    const minute = Math.floor((time / 60) % 60)
    const hour = Math.floor(time / 3600)
    return hour > 0 ? `${hour}:${twoDigit(minute)}:${twoDigit(second)}` : `${minute}:${twoDigit(second)}`
  }

  const dateFormat = (presentTime) => {
    const [week, month, day, year, time] = presentTime.toString().split(' ')
    return {
      1: ` (${year}/${abbr.month[month]}/${day} ${time})`,
      2: ` (${abbr.month[month]}/${day}/${year} ${time})`,
      3: ` (${day}/${abbr.month[month]}/${year} ${time})`,
      4: ` (${week} ${day}/${abbr.month[month]}/${year} ${time})`,
      5: ` (${abbr.week[week]} ${day}/${abbr.month[month]}/${year} ${time})`,
      6: ` (${abbr.week[week]} ${day} ${abbr.monthFull[month]} ${year} ${time})`
    }[FORMAT]
  }

  let videoId, timeDisplay, progressBar, liveData, publication, observer
  let videoData = null

  const waitElements = () => {
    return new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        timeDisplay = $('.ytp-chrome-bottom .ytp-time-display')
        progressBar = $('.ytp-chrome-bottom .ytp-progress-bar')

        if (timeDisplay && progressBar) {
          if (videoData !== $('#microformat script')) {
            videoData = $('#microformat script')
            observer.disconnect()
            resolve()
          }
        }
      })
      observer.observe(document.body, { attributes: false, childList: true, subtree: true })
    })
  }

  const getLiveClock = () => {
    let clockElement = $('#present-time')
    if (!clockElement) {
      clockElement = document.createElement('span')
      clockElement.id = 'present-time'
      timeDisplay.insertBefore(clockElement, timeDisplay.childNodes[1])
    }
    return clockElement
  }

  const updateLiveTime = () => {
    const progressTime = progressBar.getAttribute('aria-valuenow')
    return publication.endDate ? dateFormat(new Date(Date.parse(publication.startDate) + progressTime * 1000)) : timeFormat(progressTime)
  }

  const main = async (vid) => {
    if (videoId === vid) return
    videoId = vid

    if (observer) observer.disconnect()
    await waitElements()

    liveData = JSON.parse(videoData.textContent)
    if (!liveData.publication) {
      if ($('#present-time')) $('#present-time').remove()
      return
    }
    publication = liveData.publication[0]

    let liveClock = getLiveClock()
    liveClock.textContent = updateLiveTime()

    observer = new MutationObserver(() => { liveClock.textContent = updateLiveTime() })
    observer.observe(progressBar, { characterData: true, attributeFilter: ['aria-valuenow'] })
  }

  document.addEventListener('yt-navigate-finish', (event) => {
    const url = event.detail.endpoint.commandMetadata.webCommandMetadata.url
    if (url.startsWith('/watch?v=') || url.startsWith('/live/')) main(url.match(/[A-z0-9_-]{11}/)[0])
  })
})()
