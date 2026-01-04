// ==UserScript==
// @name         YouTube動画上に現在時刻表示
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  時間管理 YouTube何時間も見ちゃう人向け 時刻をダブルクリックでデジタル時計・アナログ時計切り替え
// @author       匿名Cat
// @match        https://www.youtube.com/*
// @require      https://code.jquery.com/jquery-4.0.0-beta.2.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.7/dayjs.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant GM_setValue
// @grant GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458612/YouTube%E5%8B%95%E7%94%BB%E4%B8%8A%E3%81%AB%E7%8F%BE%E5%9C%A8%E6%99%82%E5%88%BB%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/458612/YouTube%E5%8B%95%E7%94%BB%E4%B8%8A%E3%81%AB%E7%8F%BE%E5%9C%A8%E6%99%82%E5%88%BB%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const $timeBox = $("<div>", {id: 'timeBox'})
  $timeBox[0].style.cssText = `
    position: absolute;
    top: 0;
    left: calc(50% - 5rem);
    color: rgb(238,238,238);
    font-size: 3rem;
    z-index: 1;
    background-color: rgb(0, 0, 0, .5);
    border-radius: 0 0 .5rem .5rem;
  `
  const $digitalClock = $("<span>", {id: 'digitalClock'})
  $digitalClock[0].style.cssText = `vertical-align: middle;`
  $timeBox.append($digitalClock)

  const $analogClock = $("<div>", {id: 'analogClock'})
  $analogClock[0].style.cssText = `
    position: relative;
    margin: 0 .1em;
    display: inline-block;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    border: solid .05em currentColor;
    vertical-align: middle;
  `
  $timeBox.append($analogClock)

  const $minNeedle = $("<div>", {id: 'minNeedle'})
  $minNeedle[0].style.cssText = `
    position: absolute;
    width: .05em;
    left: calc(50% - .025em);
    height: .5em;
    background-color: currentColor;
    transform-origin: bottom;
  `
  $analogClock.append($minNeedle)

  const $hourNeedle = $minNeedle.clone()
  $hourNeedle[0].style.cssText = $hourNeedle[0].style.cssText + `
    width: .08em;
    left: calc(50% - .04em);
    height: .3em;
    top: .2em;
  `
  $analogClock.append($hourNeedle)

  $(document.body).arrive('#ytd-player', player => {
    $(player).append($timeBox)
  })

  // 表示スタイル切りかえ
  const shows = "both digital analog".split(' ')
  const widthRems = {both: 12, digital: 10, analog: 1}
  const reflectShow = curShow => {
    const isDigital = "both digital".split(' ').some(v => v == curShow)
    const isAnalog = "both analog".split(' ').some(v => v == curShow)
    $timeBox.css({left: `calc(50% - ${widthRems[curShow]/2}rem)`})
    $digitalClock.css({display: isDigital ? 'inline' : 'none'})
    $analogClock.css({display: isAnalog ? 'inline-block' : 'none'})
  }
  const getShow = async () => {
    const curShow = await GM_getValue("showStyle", "both")
    let curShowIdx = shows.findIndex(show => show == curShow)
    curShowIdx = Math.max(0, curShowIdx)
    return [curShowIdx, curShow]
  }
  getShow().then(([_, curShow]) => reflectShow(curShow))
  $timeBox.on('dblclick', () => {
    getShow().then(([curShowIdx, curShow]) => {
      const nextShowIdx = (curShowIdx+1) % shows.length
      const nextShow = shows[nextShowIdx]
      reflectShow(nextShow)
      GM_setValue("showStyle", nextShow)
    })
  })

  // 更新
  const offsetFromUnix = dayjs('1970-01-01 00:00:00.000').unix()
  const update = () => {
    const now = dayjs()
    const nowUnix = now.unix() - offsetFromUnix
    $digitalClock.text(now.format('HH:mm:ss'))
    $minNeedle.css('transform', `rotate(${(nowUnix/60%60)*6}deg)`)
    $hourNeedle.css('transform', `rotate(${((nowUnix/3600)%12)*30}deg)`)
  }
  setInterval(update, 1000)
})();