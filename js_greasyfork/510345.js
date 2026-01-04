// ==UserScript==
// @name        Freelancer
// @namespace   Marascripts
// @description Picks the best freelance job.
// @author      marascript
// @version     1.1.0
// @grant       none
// @match       https://www.marapets.com/agency.php*
// @homepageURL https://github.com/marascript/userscripts
// @supportURL	https://github.com/marascript/userscripts/issues
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/510345/Freelancer.user.js
// @updateURL https://update.greasyfork.org/scripts/510345/Freelancer.meta.js
// ==/UserScript==

;(async () => {
  'use strict'

  /**
   * true - Highest paying
   * false - Best MP/Time ratio (default)
   * TODO: Add fastest
   */
  const IGNORE_RATIO = false

  const allJobs = [...document.querySelectorAll('.itemwidth.fixborders')]
  const unqualified = [...document.querySelectorAll('.fadeit3')]
  const availableJobs = allJobs.filter((job) => !unqualified.includes(job))

  const bestJob = availableJobs.reduce(
    (best, job) => {
      let pay = parseInt(job.innerText.split(' ')[0].split('MP')[0])

      if (!IGNORE_RATIO) {
        const timeNumber = parseInt(job.innerText.split(' ')[1])
        const time = timeNumber < 5 ? timeNumber * 60 : timeNumber
        pay = pay / time
      }

      return pay > best.pay ? { id: job.id, pay } : best
    },
    { id: '', pay: 0 }
  )

  if (bestJob.id) {
    document.querySelector(`#${bestJob.id} a`).click()
  }

  const captchaInput = document.querySelector('input[type="number"]')
  if (captchaInput) {
    captchaInput.focus()
    let timeout
    captchaInput.oninput = () => {
      clearTimeout(timeout)

      timeout = setTimeout(() => {
        if (captchaInput.value.length === 6) {
          document.querySelector("[value='Apply for Job']").click()
        }
      }, 300)
    }
  }
})()
