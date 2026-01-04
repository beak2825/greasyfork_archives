// ==UserScript==
// @name        Cook'd and Bomb'd Really Ignore Users
// @description Really ignores ignored users
// @namespace   https://github.com/insin/greasemonkey/
// @version     3
// @match       https://www.cookdandbombd.co.uk/forums/index.php?board*
// @match       https://www.cookdandbombd.co.uk/forums/index.php?topic*
// @match       https://www.cookdandbombd.co.uk/forums/index.php?action=post*
// @match       https://www.cookdandbombd.co.uk/forums/index.php?action=profile;area=lists;sa=ignore*
// @match       https://www.cookdandbombd.co.uk/forums/index.php?action=unread*
// @grant       GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/426666/Cook%27d%20and%20Bomb%27d%20Really%20Ignore%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/426666/Cook%27d%20and%20Bomb%27d%20Really%20Ignore%20Users.meta.js
// ==/UserScript==

const IGNORED_USERS_STORAGE = 'cab_ignoredUsers'

let config = {
  addIgnoreUserControlToPosts: true,
  hidePostsQuotingIgnoredUsers: true,
  hideTopicsCreatedByIgnoredUsers: true,
  showIgnoredPosts: false,
}

let posts = []

function addStyle(css) {
  let $style = document.createElement('style')
  $style.appendChild(document.createTextNode(css))
  document.head.appendChild($style)
}

function addIgnoredPostsStyle() {
  addStyle(`
    .cab_ignoredPost {
      display: none;
    }
    .cab_ignoredPost.cab_show {
      display: block;
      background-color: #ddd !important;
    }
  `)
}

function getIgnoredUsers() {
  return JSON.parse(localStorage[IGNORED_USERS_STORAGE] || '[]')
}

function storeIgnoredUsers(ignoredUsers) {
  localStorage[IGNORED_USERS_STORAGE] = JSON.stringify(ignoredUsers)
}

function toggleShowIgnoredPosts(showIgnoredPosts) {
  config.showIgnoredPosts = showIgnoredPosts
  posts.forEach(post => post.updateClassNames())
}

/**
 * Topics being hidden breaks the CSS nth-of-type striping.
 */
function reStripePosts() {
  let odd = true
  posts.forEach(post => {
    if (!post.isIgnored()) {
      post.$el.classList.toggle('odd', odd)
      post.$el.classList.toggle('even', !odd)
      odd = !odd
    } else {
      post.$el.classList.remove('odd')
      post.$el.classList.remove('even')
    }
  })
}

function TopicPage() {
  addIgnoredPostsStyle()

  let isLoggedIn = document.querySelector('#profile_menu_top') != null

  let ignoredUsers
  let ignoredUserIds
  let ignoredUserNames

  function setIgnoredUsers(ignoreList) {
    ignoredUsers = ignoreList
    ignoredUserIds = ignoredUsers.map(user => user.id)
    ignoredUserNames = ignoredUsers.map(user => user.name)
  }

  function configureIgnoreControl({$a, $span, userId, userName}) {
    let isUserIgnored = ignoredUserIds.includes(userId)
    $a.href = `https://www.cookdandbombd.co.uk/forums/index.php?action=profile;area=lists;sa=ignore&${isUserIgnored ? `unignore=${userId}` : `ignore=${userName}`}`
    $a.title = `${isUserIgnored ? 'Remove from' : 'Add to'} ignore list`
    $span.classList.toggle('delete', isUserIgnored)
    $span.classList.toggle('ignore', !isUserIgnored)
  }

  function Post($wrapper) {
    let $userLink = $wrapper.querySelector('div.poster h4 a')

    let userId = $userLink.href.match(/;u=(\d+)/)[1]
    let userName = $userLink.textContent
    let quotedUserNames = Array.from($wrapper.querySelectorAll('.post blockquote cite a')).map(
      $a => $a.textContent.match(/Quote from: (.+) on /)?.[1] || $a.textContent.match(/Quote from: (.+)/)?.[1]
    ).filter(Boolean)

    let api = {
      $el: $wrapper,
      isIgnored() {
        let isUserIgnored = ignoredUserIds.includes(userId)
        let quotesIgnoredUser = config.hidePostsQuotingIgnoredUsers && quotedUserNames.some(userName => ignoredUserNames.includes(userName))
        return isUserIgnored || quotesIgnoredUser
      },
      updateClassNames() {
        let isPostIgnored = api.isIgnored()
        $wrapper.classList.toggle('cab_ignoredPost', isPostIgnored)
        $wrapper.classList.toggle('cab_show', config.showIgnoredPosts && isPostIgnored)
      }
    }

    // Add an ignore/unignore link to user profiles in posts
    if (config.addIgnoreUserControlToPosts) {
      let $a = document.createElement('a')
      let $span = document.createElement('span')
      $span.className = 'main_icons centericon'
      $a.appendChild($span)
      let $li = document.createElement('li')
      $li.appendChild($a)
      configureIgnoreControl({$a, $span, userId, userName})
      let $profileIcons = $wrapper.querySelector('div.poster ol.profile_icons')

      // Logged-out users don't get a profile list item, so we'll add our own
      if (!$profileIcons) {
        let $insertProfileAfter =
          $wrapper.querySelector('div.poster .im_icons') ||
          $wrapper.querySelector('div.poster .blurb') ||
          $wrapper.querySelector('div.poster .icons')
        let $profile = document.createElement('li')
        $profile.className = 'profile'
        $profileIcons = document.createElement('ol')
        $profileIcons.className = 'profile'
        $profile.appendChild($profileIcons)
        $insertProfileAfter.insertAdjacentElement('afterend', $profile)
      }

      $profileIcons.appendChild($li)

      // For logged-out users, manage the ignore list independently
      if (!isLoggedIn) {
        $a.addEventListener('click', (e) => {
          e.preventDefault()
          // Get a fresh copy in case it's been changed in another tab
          let ignoredUsers = getIgnoredUsers()
          let index = ignoredUsers.findIndex(user => user.id === userId)
          if (index != -1) {
            ignoredUsers.splice(index, 1)
          }
          else {
            ignoredUsers.push({id: userId, name: userName})
          }
          setIgnoredUsers(ignoredUsers)
          storeIgnoredUsers(ignoredUsers)
          configureIgnoreControl({$a, $span, userId, userName})
          posts.forEach(post => post.updateClassNames())
          reStripePosts()
        })
      }
    }

    api.updateClassNames()
    return api
  }

  let postElements = Array.from(document.querySelectorAll('#forumposts > form > div.windowbg'))
  let oddBg = postElements[0] ? getComputedStyle(postElements[0]).backgroundColor : null
  let evenBg = postElements[1] ? getComputedStyle(postElements[1]).backgroundColor : null

  addStyle(`
    .cab_ignoredPost {
      display: none;
    }
    .cab_ignoredPost.cab_show {
      display: block;
      background-color: #ddd !important;
    }
    ${oddBg ? `#forumposts .windowbg.odd {
      background-color: ${oddBg};
    }` : ''}
    ${evenBg ? `#forumposts .windowbg.even {
      background-color: ${evenBg};
    }` : ''}
  `)

  setIgnoredUsers(getIgnoredUsers())
  posts = postElements.map(Post)
  reStripePosts()
  document.body.classList.add('cab_reallyIgnoreUsers')
}

function PostReplyPage() {
  let ignoredUserNames = getIgnoredUsers().map(user => user.name)

  function Post($wrapper) {
    let $userHeader = $wrapper.querySelector('h5')

    let userName = $userHeader?.textContent.match(/Posted by (.+)/)?.[1]
    let quotedUserNames = Array.from($wrapper.querySelectorAll('blockquote cite a')).map(
      $a => $a.textContent.match(/Quote from: (.+) on /)?.[1] || $a.textContent.match(/Quote from: (.+)/)?.[1]
    ).filter(Boolean)

    let api = {
      $el: $wrapper,
      isIgnored() {
        let isUserIgnored = ignoredUserNames.includes(userName)
        let quotesIgnoredUser = config.hidePostsQuotingIgnoredUsers && quotedUserNames.some(userName => ignoredUserNames.includes(userName))
        return isUserIgnored || quotesIgnoredUser
      },
      updateClassNames() {
        let isPostIgnored = api.isIgnored()
        $wrapper.classList.toggle('cab_ignoredPost', isPostIgnored)
        $wrapper.classList.toggle('cab_show', config.showIgnoredPosts && isPostIgnored)
      }
    }

    api.updateClassNames()
    return api
  }

  let postElements = Array.from(document.querySelectorAll('#recent div.windowbg'))
  let oddBg = postElements[0] ? getComputedStyle(postElements[0]).backgroundColor : null
  let evenBg = postElements[1] ? getComputedStyle(postElements[1]).backgroundColor : null

  addStyle(`
    .cab_ignoredPost {
      display: none;
    }
    .cab_ignoredPost.cab_show {
      display: block;
      background-color: #ddd !important;
    }
    ${oddBg ? `#recent .windowbg.odd {
      background-color: ${oddBg};
    }` : ''}
    ${evenBg ? `#recent .windowbg.even {
      background-color: ${evenBg};
    }` : ''}
  `)

  posts = postElements.map(Post)
  reStripePosts()
  document.body.classList.add('cab_reallyIgnoreUsers')
}

function IgnoreListPage() {
  let params = new URLSearchParams(location.search)

  // Automatically ignore a user if ignore=name is provided in the URL
  if (params.has('ignore')) {
    let $newIgnoreInput = document.querySelector('#new_ignore')
    $newIgnoreInput.value = params.get('ignore')
    $newIgnoreInput.form.submit()
    return
  }

  // Automatically unignore a user if unignore=id is provided in the URL
  if (params.has('unignore')) {
    let $removeLink = Array.from(document.querySelectorAll('.table_grid tr td:last-child a')).find(
      $a => $a.href.includes(`remove=${params.get('unignore')}`)
    )
    if ($removeLink) {
      $removeLink.click()
      return
    }
  }

  // Otherwise sync with the ignore list
  let ignoredUsers = Array.from(document.querySelectorAll('.table_grid tr td:first-child a')).map($a => ({
    id: $a.href.match(/;u=(\d+)/)[1],
    name: $a.textContent,
  }))
  storeIgnoredUsers(ignoredUsers)
}

function ForumPage() {
  addStyle(`
    #topic_container .windowbg.cab_ignoredUser {
      display: none;
    }
  `)

  let ignoredUserIds = getIgnoredUsers().map(user => user.id)

  for (let $topicRow of document.querySelectorAll('#topic_container > div')) {
    let $userLink = $topicRow.querySelector('.info .floatleft a')
    let userId = $userLink?.href.match(/;u=(\d+)/)?.[1]
    if (ignoredUserIds.includes(userId)) {
      $topicRow.classList.add('cab_ignoredUser')
    }
  }
}

if (location.search.includes('?action=profile;area=lists;sa=ignore')) {
  IgnoreListPage()
}
else if (location.search.includes('?action=unread') || location.search.includes('?board')) {
  if (config.hideTopicsCreatedByIgnoredUsers) {
    ForumPage()
  }
}
else if (!document.body.classList.contains('cab_reallyIgnoreUsers')) {
  let page = location.search.includes('?action=post') ? PostReplyPage : TopicPage
  if (typeof GM != 'undefined') {
    page()
    GM.registerMenuCommand('Toggle ignored post display', () => {
      toggleShowIgnoredPosts(!config.showIgnoredPosts)
    })
  }
  else {
    chrome.storage.local.get((storedConfig) => {
      Object.assign(config, storedConfig)
      page()
    })
    chrome.storage.onChanged.addListener((changes) => {
      if ('showIgnoredPosts' in changes) {
        toggleShowIgnoredPosts(changes['showIgnoredPosts'].newValue)
      }
    })
  }
}