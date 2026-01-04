// ==UserScript==
// @name        Rllmuk Topic Ignore List (Invision 4)
// @description Hide topics you're not interested in
// @namespace   https://github.com/insin/greasemonkey/
// @version     13
// @match       https://rllmukforum.com/index.php*
// @match       https://www.rllmukforum.com/index.php*
// @grant       GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/38321/Rllmuk%20Topic%20Ignore%20List%20%28Invision%204%29.user.js
// @updateURL https://update.greasyfork.org/scripts/38321/Rllmuk%20Topic%20Ignore%20List%20%28Invision%204%29.meta.js
// ==/UserScript==

/**
 * @typedef {{updateClassNames(): void}} Topic
 */

/**
 * @typedef {{id: string}} IgnoredItem
 */

const IGNORED_TOPICS_STORAGE = 'rit_ignoredTopics'
const IGNORED_FORUMS_STORAGE = 'rit_ignoredForums'

/** @type {Topic[]} */
let topics = []
/** @type {IgnoredItem[]} */
let ignoredTopics
/** @type {string[]} */
let ignoredTopicIds
/** @type {IgnoredItem[]} */
let ignoredForums
/** @type {string[]} */
let ignoredForumIds

/** @type {import("./types").Config} */
let config = {
  hideFluidSidebar: false,
  showIgnoredTopics: false,
}

function isFluidForumPage() {
  return (
    location.href.includes('index.php?forumId=') ||
    (location.href.endsWith('index.php') && document.querySelector('a.ipsButton_primary[href*="setMethod&method=fluid"]') != null)
  )
}

function loadIgnoreConfig() {
  ignoredTopics = JSON.parse(localStorage[IGNORED_TOPICS_STORAGE] || '[]')
  ignoredTopicIds = ignoredTopics.map(topic => topic.id)
  ignoredForums = JSON.parse(localStorage[IGNORED_FORUMS_STORAGE] || '[]')
  ignoredForumIds = ignoredForums.map(forum => forum.id)
}

/**
 * @param {string} id
 * @param {Topic} topic
 */
function toggleIgnoreTopic(id, topic) {
  if (!ignoredTopicIds.includes(id)) {
    ignoredTopicIds.unshift(id)
    ignoredTopics.unshift({id})
  }
  else {
    let index = ignoredTopicIds.indexOf(id)
    ignoredTopicIds.splice(index, 1)
    ignoredTopics.splice(index, 1)
  }
  localStorage[IGNORED_TOPICS_STORAGE] = JSON.stringify(ignoredTopics)
  topic.updateClassNames()
}

/**
 * @param {string} id
 */
function toggleIgnoreForum(id) {
  if (!ignoredForumIds.includes(id)) {
    ignoredForumIds.unshift(id)
    ignoredForums.unshift({id})
  }
  else {
    let index = ignoredForumIds.indexOf(id)
    ignoredForumIds.splice(index, 1)
    ignoredForums.splice(index, 1)
  }
  localStorage[IGNORED_FORUMS_STORAGE] = JSON.stringify(ignoredForums)
  topics.forEach(topic => topic.updateClassNames())
}

/**
 * @param {boolean} showIgnoredTopics
 */
function toggleShowIgnoredTopics(showIgnoredTopics) {
  config.showIgnoredTopics = showIgnoredTopics
  topics.forEach(topic => topic.updateClassNames())
}

/**
 * @param {string} css
 */
function addStyle(css) {
  let $style = document.createElement('style')
  $style.appendChild(document.createTextNode(css))
  document.querySelector('head').appendChild($style)
}

function UnreadContentPage() {
  const TOPIC_LINK_ID_RE = /index\.php\?\/topic\/(\d+)/
  const FORUM_LINK_ID_RE = /index\.php\?(?:\/forum\/|forumId=)(\d+)/

  /** @type {string} */
  let view

  addStyle(`
    .rit_ignoreControl {
      visibility: hidden;
    }
    .rit_ignored {
      display: none;
    }
    .rit_ignored.rit_show {
      display: block;
      background-color: #fee;
    }
    .rit_ignored.rit_show::after {
      border-color: transparent #fee transparent transparent !important;
    }
    li.ipsStreamItem:hover .rit_ignoreControl {
      visibility: visible;
    }
    .rit_ignoreForumControl {
      opacity: 0.5;
    }
    .rit_ignoreForumControl:hover {
      opacity: 1;
    }
    .rit_ignoredForum .rit_ignoreTopicControl {
      display: none;
    }
    .rit_ignoredTopic .rit_ignoreForumControl {
      display: none;
    }
    .rit_ignoredTopic.rit_ignoredForum .rit_ignoreForumControl {
      display: inline;
    }
  `)

  function getView() {
    let $activeViewButton = document.querySelector('a.ipsButton_primary[data-action="switchView"]')
    return $activeViewButton ? $activeViewButton.textContent.trim() : null
  }

  /**
   * @param {HTMLElement} $topic
   * @returns {Topic}
   */
  function Topic($topic) {
    let $topicLink = /** @type {HTMLAnchorElement} */ ($topic.querySelector('a[href*="index.php?/topic/"][data-linktype="link"]'))
    let $forumLink = /** @type {HTMLAnchorElement} */ ($topic.querySelector('a[href*="index.php?/forum/"], a[href*="index.php?forumId"]'))
    if (!$topicLink) {
      return null
    }

    let topicId = TOPIC_LINK_ID_RE.exec($topicLink.href)[1]
    let forumId = FORUM_LINK_ID_RE.exec($forumLink.href)[1]

    let api = {
      updateClassNames() {
        let isTopicIgnored = ignoredTopicIds.includes(topicId)
        let isForumIgnored = ignoredForumIds.includes(forumId)
        $topic.classList.toggle('rit_ignoredTopic', isTopicIgnored)
        $topic.classList.toggle('rit_ignoredForum', isForumIgnored)
        $topic.classList.toggle('rit_ignored', isTopicIgnored || isForumIgnored)
        $topic.classList.toggle('rit_show', config.showIgnoredTopics && (isTopicIgnored || isForumIgnored))
      }
    }

    let $ignoreTopicContainer
    if (view == 'Condensed') {
      $ignoreTopicContainer = $topic.querySelector('ul.ipsStreamItem_stats')
      $ignoreTopicContainer.insertAdjacentHTML('beforeend', `
        <li class="rit_ignoreControl rit_ignoreTopicControl">
          <a style="cursor: pointer"><i class="fa fa-trash"></i></a>
        </li>
      `)
    }
    else {
      $ignoreTopicContainer = $topicLink.parentElement
      $ignoreTopicContainer.insertAdjacentHTML('beforeend', `
        <a style="cursor: pointer"class="rit_ignoreControl rit_ignoreTopicControl">
          <i class="fa fa-trash"></i>
        </a>
      `)
    }
    $ignoreTopicContainer.querySelector('i.fa-trash').addEventListener('click', () => {
      toggleIgnoreTopic(topicId, api)
    })

    $forumLink.parentElement.insertAdjacentHTML('beforeend', `
      <a style="cursor: pointer" class="rit_ignoreControl rit_ignoreForumControl"><i class="fa fa-trash"></i></a>
    `)
    $forumLink.parentElement.querySelector('i.fa-trash').addEventListener('click', () => {
      toggleIgnoreForum(forumId)
    })

    if (config.topicLinksLatestPost && !$topicLink.href.endsWith('&do=getNewComment')) {
      $topicLink.href += '&do=getNewComment'
    }

    return api
  }

  /**
   * Add ignore controls to a topic and hide it if it's in the ignored list.
   * @param {HTMLElement} $topic
   */
  function processTopic($topic) {
    let topic = Topic($topic)
    if (topic == null) {
      return
    }
    topics.push(topic)
    topic.updateClassNames()
  }

  /**
   * Process topics within a topic container and watch for a new topic container being added.
   * When you click "Load more activity", a new <div> is added to the end of the topic container.
   * @param {HTMLElement} $el
   */
  function processTopicContainer($el) {
    Array.from($el.querySelectorAll(':scope > li.ipsStreamItem'), processTopic)

    new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (view != getView()) {
          processView()
        }
        else if (mutation.addedNodes[0] instanceof HTMLElement &&
                 mutation.addedNodes[0].tagName === 'DIV') {
          processTopicContainer(mutation.addedNodes[0])
        }
      })
    }).observe($el, {childList: true})
  }

  /**
   * Reset handling of topics when the view changes between Condensed and Expanded.
   */
  function processView() {
    topics = []
    view = getView()
    processTopicContainer(document.querySelector('ol.ipsStream'))
  }

  processView()
}

function ForumPage() {
  let isFluid = isFluidForumPage()

  addStyle(`
    .rit_ignoreControl {
      display: table-cell;
      min-width: 24px;
      vertical-align: middle;
      visibility: hidden;
    }
    .rit_ignored {
      display: none;
    }
    body.rit_hideFluidSidebar #ipsLayout_sidebar {
      display: none;
    }
    .rit_ignored.rit_show {
      display: block;
      background-color: #fee !important;
    }
    @media screen and (max-width:979px) {
      .rit_ignoreControl {
        position: absolute;
        ${isFluid ? 'right' : 'left'}: 12px;
        ${isFluid ? 'top: 50%;' : 'bottom: 16px;'}
      }
      .rit_toggleFluidToolItem {
        display: none;
      }
    }
    li.ipsDataItem:hover .rit_ignoreControl {
      visibility: visible;
    }
  `)

  /**
   * @param {HTMLElement} $topic
   * @returns {Topic}
   */
  function Topic($topic) {
    let topicId = $topic.dataset.rowid
    if (!topicId) {
      return null
    }

    let api = {
      updateClassNames() {
        let isTopicIgnored = ignoredTopicIds.includes(topicId)
        $topic.classList.toggle('rit_ignored', isTopicIgnored)
        $topic.classList.toggle('rit_show', config.showIgnoredTopics && isTopicIgnored)
      }
    }

    $topic.insertAdjacentHTML('beforeend', `
      <div class="rit_ignoreControl ipsType_light ipsType_blendLinks">
        <a style="cursor: pointer"><i class="fa fa-trash"></i></a>
      <div>
    `)

    $topic.querySelector('i.fa-trash').addEventListener('click', () => {
      toggleIgnoreTopic(topicId, api)
    })

    return api
  }

  /**
   * Add ignore controls to a topic and hide it if it's in the ignored list.
   * @param {HTMLElement} $topic
   */
  function processTopic($topic) {
    let topic = Topic($topic)
    if (topic == null) {
      return
    }
    topics.push(topic)
    topic.updateClassNames()
  }

  if (isFluid) {
    let $toolList = document.querySelector('.ipsPageHeader .ipsToolList')
    $toolList.insertAdjacentHTML('afterbegin', `
      <li class="rit_toggleFluidToolItem">
        <ul class="ipsButton_split">
          <li>
            <a class="rit_toggleFluidButton ipsButton ipsButton_narrow ipsButton_medium" href="#toggleFluidSidebar">
              <i class="fa fa-chevron-down"></i>
            </a>
          </li>
        </ul>
      </li>
    `)

    let $toggleFluidControl = /** @type {HTMLAnchorElement} */ ($toolList.querySelector('.rit_toggleFluidButton'))
    let $toggleFluidIcon = $toggleFluidControl.firstElementChild

    function applyHideFluidSidebarConfig() {
      document.body.classList.toggle('rit_hideFluidSidebar', config.hideFluidSidebar)
      $toggleFluidIcon.classList.toggle('fa-chevron-down', !config.hideFluidSidebar)
      $toggleFluidIcon.classList.toggle('fa-chevron-left', config.hideFluidSidebar)
      $toggleFluidControl.title = `${config.hideFluidSidebar ? 'Show' : 'Hide'} sidebar`
    }

    $toggleFluidControl.addEventListener('click', (e) => {
      e.preventDefault()
      config.hideFluidSidebar = !config.hideFluidSidebar
      applyHideFluidSidebarConfig()
      if (typeof GM != 'undefined') {
        localStorage.rit_config = JSON.stringify(config)
      }
      else {
        chrome.storage.local.set({hideFluidSidebar: config.hideFluidSidebar})
      }
    })

    applyHideFluidSidebarConfig()
  }

  // Initial list of topics
  Array.from(document.querySelectorAll('ol.cTopicList > li.ipsDataItem[data-rowid]'), processTopic)

  // Watch for topics being replaced when paging
  new MutationObserver(mutations =>
    mutations.forEach(mutation =>
      Array.from(mutation.addedNodes).filter(node => node.nodeType === Node.ELEMENT_NODE).map(processTopic)
    )
  ).observe(document.querySelector('ol.cTopicList'), {childList: true})
}

let page
if (location.href.includes('index.php?/discover/unread')) {
  page = UnreadContentPage
}
else if (location.href.includes('index.php?/forum/') || isFluidForumPage()) {
  page = ForumPage
}

if (page) {
  if (typeof GM != 'undefined') {
    Object.assign(config, JSON.parse(localStorage.rit_config || '{}'))
    loadIgnoreConfig()
    page()
    GM.registerMenuCommand('Toggle Ignored Topic Display', () => {
      toggleShowIgnoredTopics(!config.showIgnoredTopics)
      localStorage.rit_config = JSON.stringify(config)
    })
  }
  else {
    chrome.storage.local.get((storedConfig) => {
      Object.assign(config, storedConfig)
      loadIgnoreConfig()
      page()
    })

    chrome.storage.onChanged.addListener((changes) => {
      if ('showIgnoredTopics' in changes) {
        toggleShowIgnoredTopics(changes['showIgnoredTopics'].newValue)
      }
    })
  }
}
