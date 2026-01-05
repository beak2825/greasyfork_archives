// ==UserScript==
// @name        Comments Owl for Hacker News
// @description Highlight new comments, mute users, and other tweaks for Hacker News
// @namespace   https://github.com/insin/comments-owl-for-hacker-news/
// @match       https://news.ycombinator.com/*
// @version     48
// @downloadURL https://update.greasyfork.org/scripts/18066/Comments%20Owl%20for%20Hacker%20News.user.js
// @updateURL https://update.greasyfork.org/scripts/18066/Comments%20Owl%20for%20Hacker%20News.meta.js
// ==/UserScript==
let debug = false
let isSafari = navigator.userAgent.includes('Safari/') && !/Chrom(e|ium)\//.test(navigator.userAgent)

const HIGHLIGHT_COLOR = '#ffffde'
const TOGGLE_HIDE = '[–]'
const TOGGLE_SHOW = '[+]'
const MUTED_USERS_KEY = 'mutedUsers'
const USER_NOTES_KEY = 'userNotes'
const LOGGED_OUT_USER_PAGE = `<head>
  <meta name="referrer" content="origin">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" type="text/css" href="news.css">
  <link rel="shortcut icon" href="favicon.ico">
  <title>Muted | Comments Owl for Hacker News</title>
</head>
<body>
  <center>
    <table id="hnmain" width="85%" cellspacing="0" cellpadding="0" border="0" bgcolor="#f6f6ef">
      <tbody>
        <tr>
          <td bgcolor="#ff6600">
            <table style="padding: 2px" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tbody>
                <tr>
                  <td style="width: 18px; padding-right: 4px">
                    <a href="https://news.ycombinator.com">
                      <img src="y18.svg" style="border: 1px white solid; display: block" width="18" height="18">
                    </a>
                  </td>
                  <td style="line-height: 12pt; height: 10px">
                    <span class="pagetop"><b class="hnname"><a href="news">Hacker News</a></b>
                      <a href="newest">new</a> | <a href="front">past</a> | <a href="newcomments">comments</a> | <a href="ask">ask</a> | <a href="show">show</a> | <a href="jobs">jobs</a>
                    </span>
                  </td>
                  <td style="text-align: right; padding-right: 4px">
                    <span class="pagetop">
                      <a href="login?goto=news">login</a>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr id="pagespace" title="Muted" style="height: 10px"></tr>
        <tr>
          <td>
            <table border="0">
              <tbody>
                <tr class="athing">
                  <td valign="top">user:</td>
                  <td>
                    <a class="hnuser">anonymous comments owl user</a>
                  </td>
                </tr>
              </tbody>
            </table>
            <br><br>
          </td>
        </tr>
      </tbody>
    </table>
  </center>
</body>`

//#region Config
/** @type {import("./types").Config} */
let config = {
  addUpvotedToHeader: true,
  autoCollapseNotNew: true,
  autoHighlightNew: true,
  hideCommentsNav: false,
  hideJobsNav: false,
  hidePastNav: false,
  hideReplyLinks: false,
  hideSubmitNav: false,
  listPageFlagging: 'enabled',
  listPageHiding: 'enabled',
  makeSubmissionTextReadable: true,
}
//#endregion

//#region Storage
class Visit {
  constructor({commentCount, maxCommentId, time}) {
    /** @type {number} */
    this.commentCount = commentCount
    /** @type {number} */
    this.maxCommentId = maxCommentId
    /** @type {Date} */
    this.time = time
  }

  toJSON() {
    return {
      c: this.commentCount,
      m: this.maxCommentId,
      t: this.time.getTime(),
    }
  }
}

Visit.fromJSON = function(obj) {
  return new Visit({
    commentCount: obj.c,
    maxCommentId: obj.m,
    time: new Date(obj.t),
  })
}

function getLastVisit(itemId) {
  let json = localStorage.getItem(itemId)
  if (json == null) return null
  return Visit.fromJSON(JSON.parse(json))
}

function storeVisit(itemId, visit) {
  log('storing visit', visit)
  localStorage.setItem(itemId, JSON.stringify(visit))
}

/** @returns {Set<string>} */
function getMutedUsers(json = localStorage[MUTED_USERS_KEY]) {
  return new Set(JSON.parse(json || '[]'))
}

/** @returns {Record<string, string>} */
function getUserNotes(json = localStorage[USER_NOTES_KEY]) {
  return JSON.parse(json || '{}')
}

function storeMutedUsers(mutedUsers) {
  localStorage[MUTED_USERS_KEY] = JSON.stringify(Array.from(mutedUsers))
}

function storeUserNotes(userNotes) {
  localStorage[USER_NOTES_KEY] = JSON.stringify(userNotes)
}
//#endregion

//#region Utility functions
/**
 * @param {string} role
 * @param {...string} css
 */
function addStyle(role, ...css) {
  let $style = document.createElement('style')
  $style.dataset.insertedBy = 'comments-owl'
  $style.dataset.role = role
  if (css.length > 0) {
    $style.textContent = css.filter(Boolean).map(dedent).join('\n')
  }
  document.querySelector('head').appendChild($style)
  return $style
}

const autosizeTextArea = (() => {
  /** @type {Number} */
  let textAreaPadding

  return function autosizeTextarea($textArea) {
    if (textAreaPadding == null) {
      textAreaPadding = Number(getComputedStyle($textArea).paddingTop.replace('px', '')) * 2
    }
    $textArea.style.height = '0px'
    $textArea.style.height = $textArea.scrollHeight + textAreaPadding + 'px'
  }
})()

function checkbox(attributes, label) {
  return h('label', null,
    h('input', {
      style: {verticalAlign: 'middle'},
      type: 'checkbox',
      ...attributes,
    }),
    ' ',
    label,
  )
}

/**
 * @param {string} str
 * @return {string}
 */
function dedent(str) {
  str = str.replace(/^[ \t]*\r?\n/, '')
  let indent = /^[ \t]+/m.exec(str)
  if (indent) str = str.replace(new RegExp('^' + indent[0], 'gm'), '')
  return str.replace(/(\r?\n)[ \t]+$/, '$1')
}

/**
 * Create an element.
 * @param {string} tagName
 * @param {{[key: string]: any}} [attributes]
 * @param {...any} children
 * @returns {HTMLElement}
 */
function h(tagName, attributes, ...children) {
  let $el = document.createElement(tagName)

  if (attributes) {
    for (let [prop, value] of Object.entries(attributes)) {
      if (prop.indexOf('on') === 0) {
        $el.addEventListener(prop.slice(2).toLowerCase(), value)
      }
      else if (prop.toLowerCase() == 'style') {
        for (let [styleProp, styleValue] of Object.entries(value)) {
          $el.style[styleProp] = styleValue
        }
      }
      else {
        $el[prop] = value
      }
    }
  }

  for (let child of children) {
    if (child == null || child === false) {
      continue
    }
    if (child instanceof Node) {
      $el.appendChild(child)
    }
    else {
      $el.insertAdjacentText('beforeend', String(child))
    }
  }

  return $el
}

function log(...args) {
  if (debug) {
    console.log('🦉', ...args)
  }
}

function warn(...args) {
  if (debug) {
    console.log('❗', ...args)
  }
}

/**
 * @param {number} count
 * @param {string} suffixes
 * @returns {string}
 */
function s(count, suffixes = ',s') {
  if (!suffixes.includes(',')) {
    suffixes = `,${suffixes}`
  }
  return suffixes.split(',')[count === 1 ? 0 : 1]
}

/**
 * @param {HTMLElement} $el
 * @param {boolean} hidden
 */
function toggleDisplay($el, hidden) {
  $el.classList.toggle('noshow', hidden)
  // We need to enforce display setting as the page's own script expands all
  // comments on page load.
  $el.style.display = hidden ? 'none' : ''
}

/**
 * @param {HTMLElement} $el
 * @param {boolean} hidden
 */
function toggleVisibility($el, hidden) {
  $el.classList.toggle('nosee', hidden)
  // We need to enforce visibility setting as the page's own script expands
  // all comments on page load.
  $el.style.visibility = hidden ? 'hidden' : 'visible'
}
//#endregion

//#region Navigation
function tweakNav() {
  let $pageTop = document.querySelector('span.pagetop')
  if (!$pageTop) {
    warn('pagetop not found')
    return
  }

  //#region CSS
  addStyle('nav-static', `
    .desktopnav {
      display: inline;
    }
    .mobilenav {
      display: none;
    }
    @media only screen and (min-width : 300px) and (max-width : 750px) {
      .desktopnav {
        display: none;
      }
      .mobilenav {
        display: revert;
      }
    }
  `)

  let $style = addStyle('nav-dynamic')

  function configureCss() {
    let hideNavSelectors = [
      config.hidePastNav && 'span.past-sep, span.past-sep + a',
      config.hideCommentsNav && 'span.comments-sep, span.comments-sep + a',
      config.hideJobsNav && 'span.jobs-sep, span.jobs-sep + a',
      config.hideSubmitNav && 'span.submit-sep, span.submit-sep + a',
      !config.addUpvotedToHeader && 'span.upvoted-sep, span.upvoted-sep + a',
    ].filter(Boolean)
    $style.textContent = hideNavSelectors.length == 0 ? '' : dedent(`
      ${hideNavSelectors.join(',\n')} {
        display: none;
      }
    `)
  }
  //#endregion

  //#region Main
  // Add a 'muted' link next to 'login' for logged-out users
  let $loginLink = document.querySelector('span.pagetop a[href^="login"]')
  if ($loginLink) {
    $loginLink.parentElement.append(
      h('a', {href: `muted`}, 'muted'),
      ' | ',
      $loginLink,
    )
  }

  // Add /upvoted if we're not on it and the user is logged in
  if (!location.pathname.startsWith('/upvoted')) {
    let $userLink = document.querySelector('span.pagetop a[href^="user?id"]')
    if ($userLink) {
      let $submit = $pageTop.querySelector('a[href="submit"]')
      $submit.insertAdjacentElement('afterend', h('a', {href: `upvoted?id=${$userLink.textContent}`}, 'upvoted'))
      $submit.insertAdjacentElement('afterend', h('span', {className: 'upvoted-sep'}, ' | '))
    }
  }

  // Wrap separators in elements so they can be used to hide items
  Array.from($pageTop.childNodes)
       .filter(n => n.nodeType == Node.TEXT_NODE && n.nodeValue == ' | ')
       .forEach(n => n.replaceWith(h('span', {className: `${n.nextSibling?.textContent}-sep`}, ' | ')))

  // Create a new row for mobile nav
  let $mobileNav = /** @type {HTMLTableCellElement} */ ($pageTop.parentElement.cloneNode(true))
  $mobileNav.querySelector('b')?.remove()
  $mobileNav.colSpan = 3
  $pageTop.closest('tbody').append(h('tr', {className: 'mobilenav'}, $mobileNav))

  // Move everything after b.hnname into a desktop nav wrapper
  $pageTop.appendChild(h('span', {className: 'desktopnav'}, ...Array.from($pageTop.childNodes).slice(1)))

  configureCss()

  chrome.storage.local.onChanged.addListener((changes) => {
    for (let [configProp, change] of Object.entries(changes)) {
      if (['hidePastNav', 'hideCommentsNav', 'hideJobsNav', 'hideSubmitNav', 'addUpvotedToHeader'].includes(configProp)) {
        config[configProp] = change.newValue
        configureCss()
      }
    }
  })
  //#endregion
}
//#endregion

//#region Comment page
/**
 * Each comment on a comment page has the following structure:
 *
 * ```html
 * <tr class="athing"> (wrapper)
 *   <td>
 *     <table>
 *       <tr>
 *         <td class="ind">
 *           <img src="s.gif" height="1" width="123"> (indentation)
 *         </td>
 *         <td class="votelinks">…</td> (vote up/down controls)
 *         <td class="default">
 *           <div style="margin-top:2px; margin-bottom:-10px;">
 *             <div class="comhead"> (meta bar: user, age and folding control)
 *             …
 *             <div class="comment">
 *             <span class="comtext"> (text and reply link)
 * ```
 *
 * We want to be able to collapse comment trees which don't contain new comments
 * and highlight new comments, so for each wrapper we'll create a `HNComment`
 * object to manage this.
 *
 * Comments are rendered as a flat list of table rows, so we'll use the width of
 * the indentation spacer to determine which comments are descendants of a given
 * comment.
 *
 * Since we have to reimplement our own comment folding, we'll hide the built-in
 * folding controls and create new ones in a better position (on the left), with
 * a larger hitbox (larger font and an en dash [–] instead of a hyphen [-]).
 *
 * On each comment page view, we store the current comment count, the max
 * comment id on the page and the current time as the last visit time.
 */
function commentPage() {
  log('comment page')

  //#region CSS
  addStyle('comments-static', `
    /* Hide default toggle and nav links */
    a.togg {
      display: none;
    }
    .toggle {
      cursor: pointer;
      margin-right: 3px;
      background: transparent;
      border: 0;
      padding: 0;
      color: inherit;
      font-family: inherit;
    }
    /* Display the mute control on hover, unless the comment is collapsed */
    .mute {
      display: none;
    }
    /* Prevent :hover causing double-tap on comment functionality in iOS Safari */
    @media(hover: hover) and (pointer: fine) {
      tr.comtr:hover td.votelinks:not(.nosee) + td .mute {
        display: inline;
      }
    }
    /* Don't show notes on collapsed comments */
    td.votelinks.nosee + td .note {
      display: none;
    }
    #timeTravel {
      margin-top: 1em;
      vertical-align: middle;
    }
    #timeTravelRange {
      width: 100%;
    }
    #timeTravelButton {
      margin-right: 1em;
    }

    @media only screen and (min-width: 300px) and (max-width: 750px) {
      td.votelinks:not(.nosee) + td .mute {
        display: inline;
      }
      /* Allow comments to go full-width */
      .comment {
        max-width: unset;
      }
      /* Increase distance between upvote and downvote */
      a[id^="down_"] {
        margin-top: 16px;
      }
      /* Increase hit-target */
      .toggle {
        font-size: 14px;
      }
      #highlightControls label {
        display: block;
      }
      #highlightControls label + label {
        margin-top: .5rem;
      }
      #timeTravelRange {
        width: calc(100% - 32px);
      }
    }
  `)

  let $style = addStyle('comments-dynamic')

  function configureCss() {
    $style.textContent = [
      config.hideReplyLinks && `
        div.reply {
          margin-top: 8px;
        }
        div.reply p {
          display: none;
        }
      `,
      config.makeSubmissionTextReadable && `
        div.toptext {
          color: #000;
        }
      `,
    ].filter(Boolean).map(dedent).join('\n')
  }
  //#endregion

  //#region Variables
  /** @type {boolean} */
  let autoCollapseNotNew = config.autoCollapseNotNew || location.search.includes('?shownew')

  /** @type {boolean} */
  let autoHighlightNew = config.autoHighlightNew || location.search.includes('?shownew')

  /** @type {HNComment[]} */
  let comments = []

  /** @type {Record<string, HNComment>} */
  let commentsById = {}

  /** @type {boolean} */
  let hasNewComments = false

  /** @type {string} */
  let itemId = /id=(\d+)/.exec(location.search)[1]

  /** @type {Visit} */
  let lastVisit

  /** @type {number} */
  let maxCommentId

  /** @type {Set<string>} */
  let mutedUsers = getMutedUsers()

  /** @type {Record<string, string>} */
  let userNotes = getUserNotes()

  // Comment counts
  let commentCount = 0
  let mutedCommentCount = 0
  let newCommentCount = 0
  let replyToMutedCommentCount = 0
  //#endregion

  class HNComment {
    /**
     * returns {boolean}
     */
    get isMuted() {
      return mutedUsers.has(this.user)
    }

    /**
     * @returns {HNComment[]}
     */
    get childComments() {
      if (this._childComments == null) {
        this._childComments = []
        for (let i = this.index + 1; i < comments.length; i++) {
          if (comments[i].indent <= this.indent) {
            break
          }
          this._childComments.push(comments[i])
        }
      }
      return this._childComments
    }

    get collapsedChildrenText() {
      return this.childCommentCount == 0 ? '' : [
        this.isDeleted ? '(' : ' | (',
        this.childCommentCount,
        ` child${s(this.childCommentCount, 'ren')})`,
      ].join('')
    }

    /**
     * @returns {HNComment[]}
     */
    get nonMutedChildComments() {
      if (this._nonMutedChildComments == null) {
        let muteIndent = null
        this._nonMutedChildComments = this.childComments.filter(comment => {
          if (muteIndent != null) {
            if (comment.indent > muteIndent) {
              return false
            }
            muteIndent = null
          }

          if (comment.isMuted) {
            muteIndent = comment.indent
            return false
          }

          return true
        })
      }
      return this._nonMutedChildComments
    }

    /**
     * returns {number}
     */
    get childCommentCount() {
      return this.nonMutedChildComments.length
    }

    /**
     * @param {HTMLElement} $wrapper
     * @param {number} index
     */
    constructor($wrapper, index) {
      /** @type {number} */
      this.indent = Number( /** @type {HTMLImageElement} */ ($wrapper.querySelector('img[src="s.gif"]')).width)

      /** @type {number} */
      this.index = index

      let $user = /** @type {HTMLElement} */ ($wrapper.querySelector('a.hnuser'))
      /** @type {string} */
      this.user = $user?.innerText

      /** @type {HTMLElement} */
      this.$comment = $wrapper.querySelector('div.comment')

      /** @type {HTMLElement} */
      this.$topBar = $wrapper.querySelector('td.default > div')

      /** @type {HTMLElement} */
      this.$voteLinks = $wrapper.querySelector('td.votelinks')

      /** @type {HTMLElement} */
      this.$wrapper = $wrapper

      /** @private @type {HNComment[]} */
      this._childComments = null

      /** @private @type {HNComment[]} */
      this._nonMutedChildComments = null

      /**
       * The comment's id.
       * Will be `-1` for deleted comments.
       * @type {number}
       */
      this.id = -1

      /**
       * Some flagged comments are collapsed by default.
       * @type {boolean}
       */
      this.isCollapsed = $wrapper.classList.contains('coll')

      /**
       * Comments whose text has been removed but are still displayed may have
       * their text replaced with [flagged], [dead] or similar - we'll take any
       * word in square brackets as indication of this.
       * @type {boolean}
       */
      this.isDeleted = /^\s*\[\w+]\s*$/.test(this.$comment.firstChild.nodeValue)

      /**
       * The displayed age of the comment; `${n} minutes/hours/days ago`, or
       * `on ${date}` for older comments.
       * Will be blank for deleted comments.
       * @type {string}
       */
      this.when = ''

      /** @type {HTMLElement} */
      this.$childCount = null

      /** @type {HTMLElement} */
      this.$comhead = this.$topBar.querySelector('span.comhead')

      /** @type {HTMLElement} */
      this.$toggleControl = h('button', {
        className: 'toggle',
        onclick: () => this.toggleCollapsed(),
      }, this.isCollapsed ? TOGGLE_SHOW : TOGGLE_HIDE)

      if (!this.isDeleted) {
        let $permalink = /** @type {HTMLAnchorElement} */ (this.$topBar.querySelector('a[href^=item]'))
        this.id = Number($permalink.href.split('=').pop())
        this.when = $permalink?.textContent.replace('minute', 'min')
      }
    }

    addControls() {
      // We want to use the comment meta bar for the folding control, so put
      // it back above the deleted comment placeholder.
      if (this.isDeleted) {
        this.$topBar.style.marginBottom = '4px'
      }
      this.$topBar.insertAdjacentText('afterbegin', ' ')
      this.$topBar.insertAdjacentElement('afterbegin', this.$toggleControl)
      this.$comhead.append(...[
        // User note
        userNotes[this.user] && h('span', {className: 'note'},
          ` | nb: ${userNotes[this.user].split(/\r?\n/)[0]}`,
        ),
        // Mute control
        this.user && h('span', {className: 'mute'}, ' | ', h('a', {
          href: `mute?id=${this.user}`,
          onclick: (e) => {
            e.preventDefault()
            this.mute()
          }
        }, 'mute'))
      ].filter(Boolean))
    }

    mute() {
      mutedUsers = getMutedUsers()
      mutedUsers.add(this.user)
      storeMutedUsers(mutedUsers)

      // Invalidate non-muted child caches and update child counts on any
      // comments which have been collapsed.
      for (let i = 0; i < comments.length; i++) {
        let comment = comments[i]

        if (comment.isMuted) {
          i += comment.childComments.length
          continue
        }

        comment._nonMutedChildComments = null
        if (comment.$childCount) {
          comment.$childCount.textContent = comment.collapsedChildrenText
        }
      }

      hideMutedUsers()
    }

    /**
     * @param {boolean} updateChildren
     */
    updateDisplay(updateChildren = true) {
      // Show/hide this comment, preserving display of the meta bar
      toggleDisplay(this.$comment, this.isCollapsed)
      if (this.$voteLinks) {
        toggleVisibility(this.$voteLinks, this.isCollapsed)
      }
      this.$toggleControl.textContent = this.isCollapsed ? TOGGLE_SHOW : TOGGLE_HIDE

      // Show/hide the number of child comments when collapsed
      if (this.childCommentCount > 0) {
        if (this.isCollapsed && this.$childCount == null) {
          this.$childCount = h('span', null, this.collapsedChildrenText)
          this.$comhead.appendChild(this.$childCount)
        }
        toggleDisplay(this.$childCount, !this.isCollapsed)
      }

      if (updateChildren) {
        for (let i = 0; i < this.nonMutedChildComments.length; i++) {
          let child = this.nonMutedChildComments[i]
          toggleDisplay(child.$wrapper, this.isCollapsed)
          if (child.isCollapsed) {
            i += child.childComments.length
          }
        }
      }
    }

    /**
     * Completely hides this comment and its replies.
     */
    hide() {
      toggleDisplay(this.$wrapper, true)
      this.childComments.forEach((child) => toggleDisplay(child.$wrapper, true))
    }

    /**
     * @param {number} commentId
     * @returns {boolean}
     */
    hasChildCommentsNewerThan(commentId) {
      return this.nonMutedChildComments.some((comment) => comment.isNewerThan(commentId))
    }

    /**
     * @param {number} commentId
     * @returns {boolean}
     */
    isNewerThan(commentId) {
      return this.id > commentId
    }

    /**
     * @param {boolean} isCollapsed
     */
    toggleCollapsed(isCollapsed = !this.isCollapsed) {
      this.isCollapsed = isCollapsed
      this.updateDisplay()
    }

    /**
     * @param {boolean} highlight
     */
    toggleHighlighted(highlight) {
      this.$wrapper.style.backgroundColor = highlight ? HIGHLIGHT_COLOR : 'transparent'
    }
  }

  //#region Functions
  function addHighlightCommentsControl($container) {
    let $highlightComments = h('span', null, ' | ', h('a', {
      href: '#',
      onClick(e) {
        e.preventDefault()
        addTimeTravelCommentControls($container)
        $highlightComments.remove()
      },
    }, 'highlight comments'))

    $container.querySelector('.subline')?.append($highlightComments)
  }

  /**
   * Adds checkboxes to toggle folding and highlighting when there are new
   * comments on a comment page.
   * @param {HTMLElement} $container
   */
  function addNewCommentControls($container) {
    $container.appendChild(
      h('div', null,
        h('p', null,
          `${newCommentCount} new comment${s(newCommentCount)} since ${lastVisit.time.toLocaleString()}`
        ),
        h('div', {id: 'highlightControls'},
          checkbox({
            checked: autoHighlightNew,
            onclick: (e) => {
              highlightNewComments(e.target.checked, lastVisit.maxCommentId)
            },
          }, 'highlight new comments'),
          ' ',
          checkbox({
            checked: autoCollapseNotNew,
            onclick: (e) => {
              collapseThreadsWithoutNewComments(e.target.checked, lastVisit.maxCommentId)
            },
          }, 'collapse threads without new comments'),
        ),
      )
    )
  }

  /**
   * Adds the appropriate page controls depending on whether or not there are
   * new comments or any comments at all.
   */
  function addPageControls() {
    let $container = /** @type {HTMLElement} */ (document.querySelector('td.subtext'))
    if (!$container) {
      warn('no container found for page controls')
      return
    }

    if (hasNewComments) {
      addNewCommentControls($container)
    }
    else if (commentCount > 1) {
      addHighlightCommentsControl($container)
    }
  }

  /**
   * Adds a range control and button to show the last X new comments.
   */
  function addTimeTravelCommentControls($container) {
    let sortedCommentIds = []
    for (let i = 0; i < comments.length; i++) {
      let comment = comments[i]
      if (comment.isMuted) {
        // Skip muted comments and their replies as they're always hidden
        i += comment.childComments.length
        continue
      }
      sortedCommentIds.push(comment.id)
    }
    sortedCommentIds.sort()

    let showNewCommentsAfter = Math.max(0, sortedCommentIds.length - 1)
    let howMany = sortedCommentIds.length - showNewCommentsAfter

    function getRangeDescription() {
      let fromWhen = commentsById[sortedCommentIds[showNewCommentsAfter]].when
      // Older comments display `on ${date}` instead of a relative time
      if (fromWhen.startsWith(' on')) {
        fromWhen = fromWhen.replace(' on', 'since')
      }
      else {
        fromWhen = `from ${fromWhen}`
      }
      return `${howMany} ${fromWhen}`
    }

    let $description = h('span', null, getRangeDescription())

    let $range = h('input', {
      id: 'timeTravelRange',
      max: sortedCommentIds.length - 1,
      min: 1,
      oninput(e) {
        showNewCommentsAfter = Number(e.target.value)
        howMany = sortedCommentIds.length - showNewCommentsAfter
        $description.textContent = getRangeDescription()
      },
      type: 'range',
      value: sortedCommentIds.length - 1,
    })

    let $button = /** @type {HTMLInputElement} */ (h('input', {
      id: 'timeTravelButton',
      onclick() {
        let referenceCommentId = sortedCommentIds[showNewCommentsAfter - 1]
        log(`manually highlighting ${howMany} comments since ${referenceCommentId}`)
        highlightNewComments(true, referenceCommentId)
        collapseThreadsWithoutNewComments(true, referenceCommentId)
        $timeTravelControl.remove()
      },
      type: 'button',
      value: 'highlight comments',
    }))

    let $timeTravelControl = h('div', {
      id: 'timeTravel',
    }, h('div', null, $range), $button, $description)

    $container.appendChild($timeTravelControl)
  }

  /**
   * Collapses threads which don't have any comments newer than the given
   * comment id.
   * @param {boolean} collapse
   * @param {number} referenceCommentId
   */
  function collapseThreadsWithoutNewComments(collapse, referenceCommentId) {
    for (let i = 0; i < comments.length; i++) {
      let comment = comments[i]
      if (comment.isMuted) {
        // Skip muted comments and their replies as they're always hidden
        i += comment.childComments.length
        continue
      }
      if (!comment.isNewerThan(referenceCommentId) &&
          !comment.hasChildCommentsNewerThan(referenceCommentId)) {
        comment.toggleCollapsed(collapse)
        // Skip replies as we've already checked them
        i += comment.childComments.length
      }
    }
  }

  function hideMutedUsers() {
    for (let i = 0; i < comments.length; i++) {
      let comment = comments[i]
      if (comment.isMuted) {
        comment.hide()
        // Skip replies as hide() already hid them
        i += comment.childComments.length
      }
    }
  }

  /**
   * Highlights comments newer than the given comment id.
   * @param {boolean} highlight
   * @param {number} referenceCommentId
   */
  function highlightNewComments(highlight, referenceCommentId) {
    comments.forEach((comment) => {
      if (!comment.isMuted && comment.isNewerThan(referenceCommentId)) {
        comment.toggleHighlighted(highlight)
      }
    })
  }

  function initComments() {
    let commentWrappers = /** @type {NodeListOf<HTMLTableRowElement>} */ (document.querySelectorAll('table.comment-tree tr.athing'))
    log('number of comment wrappers', commentWrappers.length)

    let commentIndex = 0
    for (let $wrapper of commentWrappers) {
      let comment = new HNComment($wrapper, commentIndex++)
      comments.push(comment)
      if (!comment.isMuted && !comment.isDeleted) {
        commentsById[comment.id] = comment
      }
    }

    let lastVisitMaxCommentId = lastVisit?.maxCommentId ?? -1
    for (let i = 0; i < comments.length; i++) {
      let comment = comments[i]

      if (comment.isMuted) {
        mutedCommentCount++
        for (let j = i + 1; j <= i + comment.childComments.length; j++) {
          if (comments[j].isMuted) {
            mutedCommentCount++
          } else {
            replyToMutedCommentCount++
          }
        }
        // Skip child comments as we've already accounted for them
        i += comment.childComments.length
        // Don't consider muted comments or their replies when counting new
        // comments, or add controls to them, as they'll all be hidden.
        continue
      }

      if (!comment.isDeleted && comment.isNewerThan(lastVisitMaxCommentId)) {
        newCommentCount++
      }

      comment.addControls()
    }

    maxCommentId = comments.map(comment => comment.id).sort().pop()
    hasNewComments = lastVisit != null && newCommentCount > 0
  }

  // TODO Only store visit data when the item header is present (i.e. not a comment permalink)
  // TODO Only store visit data for commentable items (a reply box / reply links are visible)
  // TODO Clear any existing stored visit if the item is no longer commentable
  function storePageViewData() {
    storeVisit(itemId, new Visit({
      commentCount,
      maxCommentId,
      time: new Date(),
    }))
  }
  //#endregion

  //#region Main
  lastVisit = getLastVisit(itemId)

  let $commentsLink = document.querySelector('span.subline > a[href^=item]')
  if ($commentsLink && /^\d+/.test($commentsLink.textContent)) {
    commentCount = Number($commentsLink.textContent.split(/\s/).shift())
  } else {
    warn('number of comments link not found')
  }

  configureCss()
  initComments()
  // Update display of any comments which were already collapsed by HN's own
  // functionality, e.g. deleted comments
  comments.filter(comment => comment.isCollapsed).forEach(comment => comment.updateDisplay(false))
  hideMutedUsers()
  if (hasNewComments && (autoHighlightNew || autoCollapseNotNew)) {
    if (autoHighlightNew) {
      highlightNewComments(true, lastVisit.maxCommentId)
    }
    if (autoCollapseNotNew) {
      collapseThreadsWithoutNewComments(true, lastVisit.maxCommentId)
    }
  }
  addPageControls()
  storePageViewData()

  log('page view data', {
    autoHighlightNew,
    commentCount,
    mutedCommentCount,
    replyToMutedCommentCount,
    hasNewComments,
    itemId,
    lastVisit,
    maxCommentId,
    newCommentCount,
  })

  chrome.storage.local.onChanged.addListener((changes) => {
    if ('hideReplyLinks' in changes) {
      config.hideReplyLinks = changes['hideReplyLinks'].newValue
      configureCss()
    }
    if ('makeSubmissionTextReadable' in changes) {
      config.makeSubmissionTextReadable = changes['makeSubmissionTextReadable'].newValue
      configureCss()
    }
  })
  //#endregion
}
//#endregion

//#region Item list page
/**
 * Each item on an item list page has the following structure:
 *
 * ```html
 * <tr class="athing">…</td> (rank, upvote control, title/link and domain)
 * <tr>
 *   <td>…</td> (spacer)
 *   <td class="subtext">
 *     <span class="subline">…</span> (item meta info)
 *   </td>
 * </tr>
 * <tr class="spacer">…</tr>
 * ```
 *
 * Using the comment count stored when you visit a comment page, we'll display
 * the number of new comments in the subtext section and provide a link which
 * will automatically highlight new comments and collapse comment trees without
 * new comments.
 *
 * For regular stories, the subtext element contains points, user, age (in
 * a link to the comments page), flag/hide controls and finally the number of
 * comments (in another link to the comments page). We'll look for the latter
 * to detemine the current number of comments and the item id.
 *
 * For job postings, the subtext element only contains age (in
 * a link to the comments page) and a hide control, so we'll try to ignore
 * those.
 */
function itemListPage() {
  log('item list page')

  //#region CSS
  let $style = addStyle('list-dynamic')

  function configureCss() {
    $style.textContent = [
      // Hide flag links
      config.listPageFlagging == 'disabled' && `
        .flag-sep, .flag-sep + a {
          display: none;
        }
      `,
      // Hide hide links
      config.listPageHiding == 'disabled' && `
        .hide-sep, .hide-sep + a {
          display: none;
        }
      `
    ].filter(Boolean).map(dedent).join('\n')
  }
  //#endregion

  //#region Functions
  function confirmFlag(e) {
    if (config.listPageFlagging != 'confirm') return
    let title = e.target.closest('tr').previousElementSibling.querySelector('.titleline a')?.textContent || 'this item'
    if (!confirm(`Are you sure you want to flag "${title}"?`)) {
      e.stopPropagation()
      e.stopImmediatePropagation()
      e.preventDefault()
      return false
    }
  }

  function confirmHide(e) {
    if (config.listPageHiding != 'confirm') return
    let title = e.target.closest('tr').previousElementSibling.querySelector('.titleline a')?.textContent || 'this item'
    if (!confirm(`Are you sure you want to hide "${title}"?`)) {
      e.stopPropagation()
      e.stopImmediatePropagation()
      e.preventDefault()
      return false
    }
  }
  //#endregion

  //#region Main
  if (location.pathname != '/flagged') {
    for (let $flagLink of document.querySelectorAll('span.subline > a[href^="flag"]')) {
      // Wrap the '|' before flag links in an element so they can be hidden
      $flagLink.previousSibling.replaceWith(h('span', {className: 'flag-sep'}, ' | '))
      $flagLink.addEventListener('click', confirmFlag, true)
    }
  }

  if (location.pathname != '/hidden') {
    for (let $hideLink of document.querySelectorAll('span.subline > a[href^="hide"]')) {
      // Wrap the '|' before hide links in an element so they can be hidden
      $hideLink.previousSibling.replaceWith(h('span', {className: 'hide-sep'}, ' | '))
      $hideLink.addEventListener('click', confirmHide, true)
    }
  }

  let commentLinks = /** @type {NodeListOf<HTMLAnchorElement>} */ (document.querySelectorAll('span.subline > a[href^="item?id="]:last-child'))
  log('number of comments/discuss links', commentLinks.length)

  let noCommentsCount = 0
  let noLastVisitCount = 0

  for (let $commentLink of commentLinks) {
    let id = $commentLink.href.split('=').pop()

    let commentCountMatch = /^(\d+)/.exec($commentLink.textContent)
    if (commentCountMatch == null) {
      noCommentsCount++
      continue
    }

    let lastVisit = getLastVisit(id)
    if (lastVisit == null) {
      noLastVisitCount++
      continue
    }

    let commentCount = Number(commentCountMatch[1])
    if (commentCount <= lastVisit.commentCount) {
      log(`${id} doesn't have any new comments`, lastVisit)
      continue
    }

    $commentLink.insertAdjacentElement('afterend',
      h('span', null,
        ' (',
        h('a', {
            href: `item?shownew&id=${id}`,
            style: {fontWeight: 'bold'},
          },
          commentCount - lastVisit.commentCount,
          ' new'
        ),
        ')',
      )
    )
  }

  if (noCommentsCount > 0) {
    log(`${noCommentsCount} item${s(noCommentsCount, " doesn't,s don't")} have any comments`)
  }
  if (noLastVisitCount > 0) {
    log(`${noLastVisitCount} item${s(noLastVisitCount, " doesn't,s don't")} have a last visit stored`)
  }

  configureCss()

  chrome.storage.local.onChanged.addListener((changes) => {
    if ('listPageFlagging' in changes) {
      config.listPageFlagging = changes['listPageFlagging'].newValue
      configureCss()
    }
    if ('listPageHiding' in changes) {
      config.listPageHiding = changes['listPageHiding'].newValue
      configureCss()
    }
  })
  //#endregion
}
//#endregion

//#region Profile page
function userProfilePage() {
  log('user profile page')

  let $userLink = /** @type {HTMLAnchorElement} */ (document.querySelector('a.hnuser'))
  if ($userLink == null) {
    warn('not a valid user')
    return
  }

  let userId = $userLink.innerText
  let $currentUserLink = /** @type {HTMLAnchorElement} */ (document.querySelector('a#me'))
  let currentUser = $currentUserLink?.innerText ?? ''
  let mutedUsers = getMutedUsers()
  let userNotes = getUserNotes()
  let $table = $userLink.closest('table')

  if (userId == currentUser || location.pathname.startsWith('/muted')) {
    //#region Logged-in user's profile
    let $mutedUsers = createMutedUsers()

    function createMutedUsers() {
      if (mutedUsers.size == 0) {
        return h('tbody', null,
          h('tr', null,
            h('td', {valign: 'top'}, 'muted:'),
            h('td', null, 'No muted users.')
          )
        )
      }

      let first = 0
      return h('tbody', null,
        ...Array.from(mutedUsers).map((mutedUserId) => h('tr', null,
          h('td', {valign: 'top'}, first++ == 0 ? 'muted:' : ''),
          h('td', null,
            h('a', {href: `user?id=${mutedUserId}`}, mutedUserId),
            h('a', {
                href: '#',
                onClick: function(e) {
                  e.preventDefault()
                  mutedUsers = getMutedUsers()
                  mutedUsers.delete(mutedUserId)
                  storeMutedUsers(mutedUsers)
                  replaceMutedUsers()
                }
              },
              ' (', h('u', null, 'unmute'), ')'
            ),
            userNotes[mutedUserId] ? ` - ${userNotes[mutedUserId].split(/\r?\n/)[0]}` : null,
          ),
        ))
      )
    }

    function replaceMutedUsers() {
      let $newMutedUsers = createMutedUsers()
      $mutedUsers.replaceWith($newMutedUsers)
      $mutedUsers = $newMutedUsers
    }

    $table.append($mutedUsers)

    window.addEventListener('storage', (e) => {
      if (e.storageArea !== localStorage ||
          e.newValue == null ||
          e.key != MUTED_USERS_KEY && e.key != USER_NOTES_KEY) {
        return
      }

      if (e.key == MUTED_USERS_KEY) {
        mutedUsers = getMutedUsers(e.newValue)
      }
      else if (e.key == USER_NOTES_KEY) {
        userNotes = getUserNotes(e.newValue)
      }

      replaceMutedUsers()
    })
    //#endregion
  }
  else {
    //#region Other user profile
    addStyle('profile-static', `
      .saved {
        color: #000;
        opacity: 0;
      }
      .saved.show {
        animation: flash 2s forwards;
      }
      @keyframes flash {
        from {
          opacity: 0;
        }
        15% {
          opacity: 1;
          animation-timing-function: ease-in;
        }
        75% {
          opacity: 1;
        }
        to {
          opacity: 0;
          animation-timing-function: ease-out;
        }
      }
      .notes {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 3px;
      }
    `)

    function getMutedStatusText() {
      return mutedUsers.has(userId) ? 'unmute' : 'mute'
    }

    function getUserNote() {
      return userNotes[userId] || ''
    }

    function userHasNote() {
      return userNotes.hasOwnProperty(userId)
    }

    function saveNotes() {
      userNotes = getUserNotes()
      let note = $textArea.value.trim()

      // Don't save initial blanks or duplicates
      if (userNotes[userId] == note || note == '' && !userHasNote()) return

      userNotes[userId] = $textArea.value.trim()
      storeUserNotes(userNotes)

      if ($saved.classList.contains('show')) {
        $saved.classList.remove('show')
        $saved.offsetHeight
      }
      $saved.classList.add('show')
    }

    let $textArea = /** @type {HTMLTextAreaElement} */ (h('textarea', {
      cols: 60,
      value: userNotes[userId] || '',
      className: 'notes',
      style: {resize: 'none'},
      onInput() {
        autosizeTextArea(this)
      },
      onKeydown(e) {
        // Save on Use Ctrl+Enter / Cmd+Return
        if (e.key == 'Enter' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault()
          saveNotes()
        }
      },
      onBlur() {
        saveNotes()
      }
    }))

    let $muted = h('u', null, getMutedStatusText())
    let $saved = h('span', {className: 'saved'}, 'saved')

    $table.querySelector('tbody').append(
      h('tr', null,
        h('td'),
        h('td', null,
          h('a', {
              href: '#',
              onClick: function(e) {
                e.preventDefault()
                if (mutedUsers.has(userId)) {
                  mutedUsers = getMutedUsers()
                  mutedUsers.delete(userId)
                  this.firstElementChild.innerText = 'mute'
                }
                else {
                  mutedUsers = getMutedUsers()
                  mutedUsers.add(userId)
                  this.firstElementChild.innerText = 'unmute'
                }
                storeMutedUsers(mutedUsers)
              }
            },
            $muted
          )
        )
      ),
      h('tr', null,
        h('td', {vAlign: 'top'}, 'notes:'),
        h('td', {className: 'notes'}, $textArea, $saved),
      ),
    )

    autosizeTextArea($textArea)

    window.addEventListener('storage', (e) => {
      if (e.storageArea !== localStorage || e.newValue == null) return

      if (e.key == MUTED_USERS_KEY) {
        mutedUsers = getMutedUsers(e.newValue)
        if ($muted.textContent != getMutedStatusText()) {
          $muted.textContent = getMutedStatusText()
        }
      }
      else if (e.key == USER_NOTES_KEY) {
        userNotes = getUserNotes(e.newValue)
        if (userHasNote() && $textArea.value.trim() != getUserNote()) {
          $textArea.value = getUserNote()
        }
      }
    })
    //#endregion
  }
}
//#endregion

//#region Main
function main() {
  log('config', config)

  if (location.pathname.startsWith('/login')) {
    log('login screen')
    if (isSafari) {
      log('trying to prevent Safari zooming in on the autofocused input')
      addStyle('login-safari', `input[type="text"], input[type="password"] { font-size: 16px; }`)
      setTimeout(() => {
        document.querySelector('input[type="password"]').focus()
        document.querySelector('input[type="text"]').focus()
      })
    }
    return
  }

  if (location.pathname.startsWith('/muted')) {
    document.documentElement.innerHTML = LOGGED_OUT_USER_PAGE
    // Safari on macOS has a default dark background in dark mode
    if (isSafari) {
      addStyle('muted-safari', 'html { background-color: #fff; }')
    }
  }

  tweakNav()

  let path = location.pathname.slice(1)

  if (/^($|active|ask|best($|\?)|flagged|front|hidden|invited|launches|news|newest|noobstories|pool|show|submitted|upvoted)/.test(path) ||
      /^favorites/.test(path) && !location.search.includes('&comments=t')) {
    itemListPage()
  }
  else if (/^item/.test(path)) {
    commentPage()
  }
  else if (/^(user|muted)/.test(path)) {
    userProfilePage()
  }
}

if (
  typeof GM == 'undefined' &&
  typeof chrome != 'undefined' &&
  typeof chrome.storage != 'undefined'
) {
  chrome.storage.local.get((storedConfig) => {
    Object.assign(config, storedConfig)
    main()
  })
}
else {
  main()
}
//#endregion