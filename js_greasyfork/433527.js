// ==UserScript==
// @name        Expand comments at webinar.ru
// @namespace   Webinar Scripts
// @match       https://events.webinar.ru/course-info/*
// @grant       none
// @version     1.3
// @author      in_vite
// @description Добавляет кнопки, раскрывающие ветки с обсуждениями на сайте webinar.ru
// @downloadURL https://update.greasyfork.org/scripts/433527/Expand%20comments%20at%20webinarru.user.js
// @updateURL https://update.greasyfork.org/scripts/433527/Expand%20comments%20at%20webinarru.meta.js
// ==/UserScript==

const waitForElement = async selector => {
  while (document.getElementsByClassName(selector).length == 0) {
    await new Promise(resolve => requestAnimationFrame(resolve))
  }

  return document.getElementsByClassName(selector)
}

const waitAndClickElement = async (where, selector, selector2, minimumExpectedLength=1) => {
  while ((where.getElementsByClassName(selector).length == 0) &&
         (where.getElementsByClassName(selector2).length < minimumExpectedLength)) {
    await new Promise(resolve => requestAnimationFrame(resolve))
  }

  if (where.getElementsByClassName(selector).length > 0) {
    where.getElementsByClassName(selector)[0].click()
  }

  return where.getElementsByClassName(selector2).length
}

function main() {
  'use strict'

  const nameCommentsCount = 'PostNewsComments__commentsCount____zB8X'
  const nameFetchMoreComments = 'PostNewsComments__fetchMoreCommentsBtn___tyN_f'
  const nameNewsItem = 'NewsFeed__newsItem___VAlN_'
  const nameCommentRoot = 'Comment__root___sd3C5'
  const nameButton = 'ExpandingButton'
  
  // wait till the page is loaded and add two kinds of buttons with different behavior
  waitForElement(nameCommentsCount).then((selector) => {
    // check there are no buttons yet
    if (document.getElementsByClassName(nameButton).length == 0) {
      addButtons('Развернуть комментарии', '10px', openComments, false)
      addButtons('Развернуть и прокрутить', '20px', openComments, true)
    }
  })

  function addButtons(text, leftPosition, onClick, withScroll) {
    // find all elements with information about total number of comments
    let elementCommentsCounts = document.getElementsByClassName(nameCommentsCount)

    // default button style and position
    let cssObj = {
      position: 'relative',
      left: leftPosition,
      //'-webkit-appearance': 'none',
      //'-moz-appearance': 'none',
      //'appearance': 'none',   
      background: 'white',
      color: 'black',
      'border-radius': '3px',
      'border-color': 'lightgray'
    }

    // for every such element create a button with specified style, position and behavior
    for (let i = elementCommentsCounts.length; i--;) {
      let button = document.createElement('button'), btnStyle = button.style
      elementCommentsCounts[i].appendChild(button)
      button.className = nameButton
      button.innerHTML = text
      button.onclick = onClick.bind(button, withScroll)
      Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key])
    }
  }

  async function openComments(withScroll) {
    // find an element with the whole discussion
    let post = this.parentElement.parentElement
    // retrieve total number of comments
    let totalCommentsNumber = parseInt(post.getElementsByClassName(nameCommentsCount)[0].innerText, 10)
    let done = false
    let currentCommentsNumber = 0
    const whileGenerator = function* () {
      while (!done) {
        yield currentCommentsNumber
      }
    }

    for (let i of whileGenerator()) {
      // find the link for expansion while it exists and click it
      currentCommentsNumber = await waitAndClickElement(post, nameFetchMoreComments, nameCommentRoot, totalCommentsNumber)

      // stop when we got all possible comments
      if (currentCommentsNumber >= totalCommentsNumber) {
        done = true;
      }
    }

    // change button style when it expanded everything
    this.style.background = '#f6f6f6'
    this.style.color = 'black'

    if (withScroll && (totalCommentsNumber > 0)) {
      // get element with the last comment
      let lastComment = post.getElementsByClassName(nameCommentRoot)[totalCommentsNumber - 1]
      let yOffset = -90
      // get element position and correct it
      let y = lastComment.getBoundingClientRect().top + window.pageYOffset + yOffset

      // scroll to the corrected position
      window.scrollTo({top: y, behavior: 'smooth'});
    }
  }
}

let oldHref = ''

// check url is changed to add buttons again
window.onload = function() {
    let bodyList = document.querySelector('body')
    let observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (oldHref != document.location.href) {
          oldHref = document.location.href
          main()
        }
      })
    })

    let config = {
      childList: true,
      subtree: true
    }

    observer.observe(bodyList, config)
}