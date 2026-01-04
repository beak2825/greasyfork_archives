// ==UserScript==
// @name         GitLab Extension
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Allows to fold any board in GitLab boards, shows estimate and last modified in issue card
// @author       Himalay
// @include		 https://gitlab.*
// @downloadURL https://update.greasyfork.org/scripts/383021/GitLab%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/383021/GitLab%20Extension.meta.js
// ==/UserScript==

// estimate and modified time in card

// Board fold
let foldableGitLabBoardsIntervalCount = 0
const foldableGitLabBoardsInterval = setInterval(() => {
  const boards = [...document.querySelectorAll('.board.is-draggable')]

  if (foldableGitLabBoardsIntervalCount > 100)
    clearInterval(foldableGitLabBoardsInterval)
  if (boards.length) {
    clearInterval(foldableGitLabBoardsInterval)

    document.body.appendChild(
      Object.assign(document.createElement('style'), {
        textContent: `.board.is-collapsed .board-title>span {
                      width: auto;
                      margin-top: 24px;
                      }`,
      }),
    )

    boards.forEach((board) => {
      const boardTitle = board.querySelector('.board-title')
      const toggleIcon = Object.assign(document.createElement('i'), {
        classList: 'fa fa-fw board-title-expandable-toggle fa-caret-down',
        style: 'cursor: pointer',
      })

      toggleIcon.addEventListener('click', (e) => {
        board.classList.toggle('is-collapsed')
        e.target.classList.toggle('fa-caret-down')
        e.target.classList.toggle('fa-caret-right')
      })

      boardTitle.prepend(toggleIcon)
    })
  }

  foldableGitLabBoardsIntervalCount++
}, 100)

var TimeAgo = (function() {
  var self = {}
  // Public Methods
  self.locales = {
    prefix: `It's been`,
    sufix: '',

    seconds: 'less than a minute.',
    minute: 'about a minute.',
    minutes: '%d minutes.',
    hour: 'about an hour.',
    hours: 'about %d hours.',
    day: 'a day.',
    days: '%d days.',
    month: 'about a month.',
    months: '%d months.',
    year: 'about a year.',
    years: '%d years.',
  }

  self.inWords = function(timeAgo) {
    var seconds = Math.floor((new Date() - parseInt(timeAgo)) / 1000),
      separator = this.locales.separator || ' ',
      words = this.locales.prefix + separator,
      interval = 0,
      intervals = {
        year: seconds / 31536000,
        month: seconds / 2592000,
        day: seconds / 86400,
        hour: seconds / 3600,
        minute: seconds / 60,
      }

    var distance = this.locales.seconds

    for (var key in intervals) {
      interval = Math.floor(intervals[key])

      if (interval > 1) {
        distance = this.locales[key + 's']
        break
      } else if (interval === 1) {
        distance = this.locales[key]
        break
      }
    }

    distance = distance.replace(/%d/i, interval)
    words += distance + separator + this.locales.sufix

    return words.trim()
  }

  return self
})()

const shouldFetch = document.querySelector('.board-card,.issue')
const fetchThemAll = async (url) => {
  let nextPage = 1
  let data = []
  while (true) {
    const res = await fetch(url.replace('{{page}}', nextPage), {
      method: 'GET',
      credentials: 'include',
      headers: {
        accept: 'application/json, text/plain, */*',
        'x-requested-with': 'XMLHttpRequest',
      },
      mode: 'cors',
    })
    data.push(...(await res.json()))
    const previousPage = nextPage
    nextPage = res.headers.get('x-next-page')
    console.log({ previousPage, nextPage })
    if (!nextPage || nextPage === previousPage) break
  }
  return data
}

const isLessThanAgo = (hour = 1, date) => date > Date.now() - hour * 3600000
const setLabels = () =>
  [...document.querySelectorAll('.board-card,.issue')].forEach((card) => {
    const { issueId, id } = card.dataset
    const onlyCard = id
    const issue = issues[issueId || id]
    if (issue) {
      const {
        assignee,
        state,
        updated_at,
        time_stats: { time_estimate, total_time_spent },
      } = issue
      const isOpen = state === 'opened'
      const updatedDate = new Date(updated_at)
      const lastUpdate = TimeAgo.inWords(updatedDate.getTime())
      let emoji = isLessThanAgo(4, updatedDate)
        ? '👍'
        : isLessThanAgo(24, updatedDate)
        ? '👎'
        : '🙏'
      emoji = assignee && isOpen ? emoji : ''
      const cardStyle = `
      height: 1.5em;
      width: 1em;
      padding: 1px;
      border-radius: 3px;
      text-align: center;
      font-size: small;
      margin-left: 0.5em;
      background: #5cb85b;
      color: white;
      position: absolute;
      top: 0.5em;
      right: 0.5em;
      ${total_time_spent ? 'text-decoration: line-through;' : ''}
    `
      const sp = time_estimate
        ? `<span style="${cardStyle}">${time_estimate / 60 / 60}</span>`
        : ''
      const assignie = card.querySelector('.board-card-assignee,.controls')
      const pointAndTime = card.querySelector('.point-and-time')
      const content = onlyCard ? sp : emoji + lastUpdate + sp
      if (pointAndTime) {
        pointAndTime.innerHTML = content
      } else {
        let assignieHtml = assignie.innerHTML
        assignieHtml += `<span class="point-and-time" style="margin-left: 0.5em">${content}</span>`
        assignie.innerHTML = assignieHtml
      }
    }
  })

const cachedIssues = localStorage.getItem('issues')
let issues = JSON.parse(cachedIssues || '{}')
setLabels()

if (shouldFetch || !cachedIssues) {
  ;(async function iife() {
    issues = (await fetchThemAll(
      'https://gitlab.innovatetech.io/api/v4/groups/ap/issues?page={{page}}&per_page=100',
    )).reduce((acc, { id, ...issue }) => {
      acc[id] = issue
      return acc
    }, {})
    localStorage.setItem('issues', JSON.stringify(issues))
    setLabels()
  })()
}
