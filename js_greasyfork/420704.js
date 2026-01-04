// ==UserScript==
// @name        RPS Hide Read Posts
// @description Hides posts on the RPS homepage when they're clicked & adds a "Mark all as read" button
// @version     5
// @namespace   https://github.com/insin/greasemonkey
// @grant       none
// @match       https://www.rockpapershotgun.com/
// @downloadURL https://update.greasyfork.org/scripts/420704/RPS%20Hide%20Read%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/420704/RPS%20Hide%20Read%20Posts.meta.js
// ==/UserScript==

// @ts-ignore
let debug = false

/**
 * @param {HTMLElement} section
 * @returns {boolean}
 */
function areAllPostsHidden(section) {
  return Array.from(section.querySelectorAll('article.summary')).every(
    (article) => article.parentElement.style.display === 'none'
  )
}

/**
 * @param {HTMLElement} target
 * @returns {string}
 */
function getPostClickHref(target) {
  if (target.tagName === 'A' && target.closest('article.summary')) {
    return /** @type {HTMLAnchorElement} */ (target).pathname
  }
  return ''
}

function postsPage() {
  let $style = document.createElement('style')
  $style.innerText = `
  /* Prevent the top section taking up space when posts are removed */
  #content_above {
    min-height: unset !important;
  }
  `
  document.head.appendChild($style)

  /** @type {string[]} */
  let clickedPosts = JSON.parse(localStorage.getItem('clickedPosts') || '[]')

  function hideEmptySections() {
    for (let section of /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll(
      '#content_above, section.featured_tag_shelf, section.latest_shelf, section.shelf, section.supporters_shelf'
    ))) {
      if (section.style.display === 'none') continue
      if (areAllPostsHidden(section)) {
        section.style.display = 'none'
      }
    }
  }

  function hideClickedPosts() {
    for (let link of /** @type {NodeListOf<HTMLAnchorElement>} */ (document.querySelectorAll(
      'a.link_overlay'
    ))) {
      if (clickedPosts.includes(link.pathname)) {
        let nodeToHide = link.closest('li')
        if (nodeToHide && nodeToHide.style.display !== 'none') {
          nodeToHide.style.display = 'none'
        }
      }
    }
    hideEmptySections()
  }

  function markAllAsRead(e) {
    e.preventDefault()
    for (let link of /** @type {NodeListOf<HTMLAnchorElement>} */ (document.querySelectorAll(
      'a.link_overlay'
    ))) {
      if (!clickedPosts.includes(link.pathname)) {
        clickedPosts.unshift(link.pathname)
      }
    }
    localStorage.setItem('clickedPosts', JSON.stringify(clickedPosts))
    hideClickedPosts()
  }

  document.addEventListener('click', (e) => {
    let target = /** @type {HTMLElement} */ (e.target)
    if (e.button === 0 && getPostClickHref(target)) {
      // Hold ctrl + shift when clicking a post to hide it without opening it
      if (debug || (e.shiftKey && e.ctrlKey)) e.preventDefault()
      clickedPosts.unshift(getPostClickHref(target))
      localStorage.setItem('clickedPosts', JSON.stringify(clickedPosts))
      hideClickedPosts()
    }
  })

  document.addEventListener('auxclick', (e) => {
    let target = /** @type {HTMLElement} */ (e.target)
    if (e.button === 1 && getPostClickHref(target)) {
      // Hold ctrl when middle-clicking a post to hide it without opening it
      if (debug || e.ctrlKey) e.preventDefault()
      clickedPosts.unshift(getPostClickHref(target))
      localStorage.setItem('clickedPosts', JSON.stringify(clickedPosts))
      hideClickedPosts()
    }
  })

  let topButtons = document.querySelector('div.commercial.button_group')
  if (topButtons != null) {
    let button = document.createElement('a')
    button.className = 'button supporter'
    button.innerText = 'Mark all as read'
    button.href = '#'
    button.addEventListener('click', markAllAsRead)
    button.id = 'mark-all-as-read'
    topButtons.appendChild(button)
  }

  hideClickedPosts()
}

if (location.pathname === '/' && !document.querySelector('#mark-all-as-read')) {
  postsPage()
}
