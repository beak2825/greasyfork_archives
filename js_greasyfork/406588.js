// ==UserScript==
// @name        Cook'd and Bomb'd Ignore Topics
// @description Ignore topics and forums, and other topic list tweaks
// @namespace   https://github.com/insin/greasemonkey/
// @version     11
// @match       https://www.cookdandbombd.co.uk/forums/index.php?board*
// @match       https://www.cookdandbombd.co.uk/forums/index.php?action=unread*
// @grant       GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/406588/Cook%27d%20and%20Bomb%27d%20Ignore%20Topics.user.js
// @updateURL https://update.greasyfork.org/scripts/406588/Cook%27d%20and%20Bomb%27d%20Ignore%20Topics.meta.js
// ==/UserScript==

const IGNORED_TOPICS_STORAGE = 'cab_ignoredTopics'
const IGNORED_FORUMS_STORAGE = 'cab_ignoredForums'

const TOPIC_ID_RE = /index\.php\?topic=(\d+)/
const FORUM_ID_RE = /index\.php\?board=(\d+)/

let topics = []

let ignoredTopicIds
let ignoredForumIds

let config = {
  hideRecentUnreadTopicsPageNumbers: true,
  // Set this to false if you're done hiding forums in Recent Unread Topics
  showIgnoreForumControl: true,
  showIgnoredTopics: false,
  topicLinksNewPost: true,
}

function loadIgnoreConfig() {
  let ignoredTopicsJson = localStorage[IGNORED_TOPICS_STORAGE]
  let ignoredForumsJson = localStorage[IGNORED_FORUMS_STORAGE]
  ignoredTopicIds = ignoredTopicsJson ? JSON.parse(ignoredTopicsJson) : []
  ignoredForumIds = ignoredForumsJson ? JSON.parse(ignoredForumsJson) : []
}

function toggleIgnoreTopic(id, topic) {
  if (!ignoredTopicIds.includes(id)) {
    ignoredTopicIds.unshift(id)
  }
  else {
    let index = ignoredTopicIds.indexOf(id)
    ignoredTopicIds.splice(index, 1)
  }
  localStorage[IGNORED_TOPICS_STORAGE] = JSON.stringify(ignoredTopicIds)
  topic.updateClassNames()
}

function toggleIgnoreForum(id) {
  if (!ignoredForumIds.includes(id)) {
    ignoredForumIds.unshift(id)
  }
  else {
    let index = ignoredForumIds.indexOf(id)
    ignoredForumIds.splice(index, 1)
  }
  localStorage[IGNORED_FORUMS_STORAGE] = JSON.stringify(ignoredForumIds)
  topics.forEach(topic => topic.updateClassNames())
}

function toggleShowIgnoredTopics(showIgnoredTopics) {
  config.showIgnoredTopics = showIgnoredTopics
  topics.forEach(topic => topic.updateClassNames())
}

function addStyle(css) {
  let $style = document.createElement('style')
  $style.appendChild(document.createTextNode(css))
  document.querySelector('head').appendChild($style)
}

function ForumPage() {
  function Topic($topicRow) {
    let $topicLink = $topicRow.querySelector('.info :is(.recent_title, .message_index_title) .preview a')
    // Only in Recent Unread Topics
    let $forumLink = $topicRow.querySelector('.floatleft em a')
    let $lastPostLink = $topicRow.querySelector('.lastpost a')

    let topicIdMatch = TOPIC_ID_RE.exec($lastPostLink.href)
    if (!topicIdMatch) {
      return null
    }
    let topicId = topicIdMatch[1]

    let forumId = null
    if ($forumLink) {
      let forumIdMatch = FORUM_ID_RE.exec($forumLink.href)
      if (forumIdMatch) {
        forumId = forumIdMatch[1]
      }
    }

    let api = {
      $el: $topicRow,
      isIgnored() {
        return ignoredTopicIds.includes(topicId) || (forumId ? ignoredForumIds.includes(forumId) : false)
      },
      updateClassNames() {
        let isTopicIgnored = ignoredTopicIds.includes(topicId)
        let isForumIgnored = forumId ? ignoredForumIds.includes(forumId) : false
        $topicRow.classList.toggle('cab_ignoredTopic', isTopicIgnored)
        $topicRow.classList.toggle('cab_ignoredForum', isForumIgnored)
        $topicRow.classList.toggle('cab_ignored', isTopicIgnored || isForumIgnored)
        $topicRow.classList.toggle('cab_show', config.showIgnoredTopics && (isTopicIgnored || isForumIgnored))
      }
    }

    $lastPostLink.insertAdjacentHTML('afterend', `
      <a href="#" class="cab_ignoreControl cab_ignoreTopic" title="Ignore topic">
        <span class="main_icons ignore"></span>
      </a>
    `)

    $topicRow.querySelector('a.cab_ignoreTopic').addEventListener('click', (e) => {
      e.preventDefault()
      toggleIgnoreTopic(topicId, api)
      reStripeTopics()
    })

    if (config.showIgnoreForumControl && forumId) {
      $forumLink.parentElement.insertAdjacentHTML('afterend', `
        <a href="#" class="cab_ignoreControl cab_ignoreForum" title="Ignore forum">
          <span class="main_icons ignore"></span>
        </a>
      `)
      $topicRow.querySelector('a.cab_ignoreForum').addEventListener('click', (e) => {
        e.preventDefault()
        toggleIgnoreForum(forumId)
        reStripeTopics()
      })
    }

    if (config.topicLinksNewPost) {
      let $newPostLink = $topicRow.querySelector('a[id^=newicon]')
      if ($newPostLink) {
        $topicLink.href = $newPostLink.href
      }
    }

    return api
  }

  /**
   * Add ignore controls to a topic and hide it if it's being ignored.
   */
  function processTopicRow($topicRow) {
    let topic = Topic($topicRow)
    if (topic == null) {
      return
    }
    topics.push(topic)
    topic.updateClassNames()
  }

  /**
   * Topics being hidden breaks the CSS nth-of-type striping.
   */
  function reStripeTopics() {
    let odd = true
    topics.forEach(topic => {
      if (!topic.isIgnored()) {
        topic.$el.classList.toggle('odd', odd)
        topic.$el.classList.toggle('even', !odd)
        odd = !odd
      } else {
        topic.$el.classList.remove('odd')
        topic.$el.classList.remove('even')
      }
    })
  }

  let topicElements = Array.from(document.querySelectorAll('#topic_container > div'))
  let oddBg = topicElements[0] ? getComputedStyle(topicElements[0]).backgroundColor : null
  let evenBg = topicElements[1] ? getComputedStyle(topicElements[1]).backgroundColor : null
  let isRecentUnreadTopicsPage = location.search.includes('action=unread')

  addStyle(`
    .cab_ignoreControl {
      visibility: hidden;
    }
    #topic_container .windowbg.cab_ignored {
      display: none;
    }
    #topic_container .windowbg.cab_ignored.cab_show {
      display: flex;
    }
    ${oddBg ? `#topic_container .windowbg.odd {
      background-color: ${oddBg};
    }` : ''}
    ${evenBg ? `#topic_container .windowbg.even {
      background-color: ${evenBg};
    }` : ''}
    #topic_container .windowbg.cab_ignored.cab_show {
      background-color: #ddd !important;
    }
    #topic_container > div:hover .cab_ignoreControl {
      visibility: visible;
    }
    .cab_ignoredForum .cab_ignoreTopic {
      display: none;
    }
    .cab_ignoredTopic .cab_ignoreForum {
      display: none;
    }
    .cab_ignoredTopic.cab_ignoredForum .cab_ignoreForum {
      display: inline;
    }
    ${isRecentUnreadTopicsPage && config.hideRecentUnreadTopicsPageNumbers ? '.topic_pages { display: none; }' : ''}
  `)

  topicElements.forEach(processTopicRow)
  reStripeTopics()
}

// Already-processed pages seem to be getting cached on back navigation... sometimes
if (!document.querySelector('a.cab_ignoreTopic')) {
  if (typeof GM != 'undefined') {
    loadIgnoreConfig()
    ForumPage()
    GM.registerMenuCommand('Toggle ignored topic display', () => {
      toggleShowIgnoredTopics(!config.showIgnoredTopics)
    })
  }
  else {
    chrome.storage.local.get((storedConfig) => {
      Object.assign(config, storedConfig)
      loadIgnoreConfig()
      ForumPage()
    })
    chrome.storage.onChanged.addListener((changes) => {
      if ('showIgnoredTopics' in changes) {
        toggleShowIgnoredTopics(changes['showIgnoredTopics'].newValue)
      }
    })
  }
}