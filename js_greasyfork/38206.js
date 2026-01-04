// ==UserScript==
// @name         HIT Scraper to MTurk Suite
// @namespace    https://github.com/Kadauchi
// @version      1.0.0
// @description  Does things...
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      https://www.mturk.com/hitscraper-to-mturk-suite
// @include      https://worker.mturk.com/hitscraper-to-mturk-suite
// @downloadURL https://update.greasyfork.org/scripts/38206/HIT%20Scraper%20to%20MTurk%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/38206/HIT%20Scraper%20to%20MTurk%20Suite.meta.js
// ==/UserScript==

(function () {
  const bl = window.localStorage.getItem(`scraper_ignore_list`)
  const il = window.localStorage.getItem(`scraper_include_list`)

  if (bl || il) {
    document.body.innerHTML = ``

    if (bl) {
      const blockList = convertBlockList(bl)
      saveToFileJSON(`block-list`, blockList)
    }
    if (il) {
      const includeList = convertIncludeList(il)
      saveToFileJSON(`include-list`, includeList)
    }
  } else {
    document.body.innerHTML = `No HIT Scraper Block or Include Lists found`
  }
})()

function convertBlockList () {
  const [list] = arguments

  const mturkSuite = {}
  const hitScraper = list.split(`^`)

  for (const value of hitScraper) {
    mturkSuite[value] = {
      name: value,
      match: value,
      strict: true
    }
  }

  return mturkSuite
}

function convertIncludeList () {
  const [list] = arguments

  const mturkSuite = {}
  const hitScraper = list.split(`^`)

  for (const value of hitScraper) {
    mturkSuite[value] = {
      name: value,
      match: value,
      strict: true,
      sound: true,
      alarm: false,
      pushbullet: false,
      notification: true
    }
  }

  return mturkSuite
}

function saveToFileJSON () {
  const [name, json] = arguments

  const today = new Date()
  const month = today.getMonth() + 1
  const day = today.getDate()
  const year = today.getFullYear()
  const date = `${year}${month < 10 ? `0` : ``}${month}${day < 10 ? `0` : ``}${day}`

  const data = JSON.stringify(json)

  const exportFile = document.createElement(`a`)
  exportFile.href = window.URL.createObjectURL(new window.Blob([data], { type: `application/json` }))
  exportFile.download = `scraper-to-mts-backup-${date}-${name}.json`
  exportFile.textContent = `scraper-to-mts-backup-${date}-${name}.json`

  document.body.appendChild(exportFile)
  document.body.appendChild(document.createElement(`br`))
}