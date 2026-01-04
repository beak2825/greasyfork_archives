// ==UserScript==
// @name         JoyReactor Download Button
// @version      1.2.0
// @description  Adds download buttton to images
// @namespace    https://github.com/nikolay-borzov
// @author       nikolay-borzov
// @license      MIT
// @icon         http://joyreactor.cc/favicon.ico
// @homepageURL  https://github.com/nikolay-borzov/user-scripts
// @homepage     https://github.com/nikolay-borzov/user-scripts
// @supportURL   https://github.com/nikolay-borzov/user-scripts/issues
// @match        http://joyreactor.cc/*
// @match        http://joyreactor.com/*
// @noframes
// @run-at       document-end
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/443465/JoyReactor%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/443465/JoyReactor%20Download%20Button.meta.js
// ==/UserScript==

;(function () {
  let addStyle = (css) => {
    addStyle =
      'GM_addStyle' in window
        ? GM_addStyle // eslint-disable-line camelcase
        : (css) => {
            const head = document.querySelectorAll('head')[0]
            const style = document.createElement('style')

            style.innerHTML = css
            head.append(style)

            return style
          }

    return addStyle(css)
  }

  const dom = {
    on(parent, eventName, selector, callback) {
      parent.addEventListener(eventName, function (event) {
        const matchingChild = event.target.closest(selector)

        if (matchingChild) {
          callback(matchingChild)
        }
      })
    },
  }

  const css_248z =
    "@keyframes ripple{0%{opacity:1;transform:scale(0)}20%{opacity:1;transform:scale(25)}to{opacity:0;transform:scale(40)}}.image{display:inline-block;position:relative}.download-link{background:url(\"data:image/svg+xml;charset=utf-8,%3Csvg height='24' width='24' xmlns='http://www.w3.org/2000/svg' fill='%23fff'%3E%3Cpath d='M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z'/%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3C/svg%3E\") #333;background-size:contain;border-radius:0 0 7px 7px;box-shadow:0 1px 3px #0000001f,0 1px 2px #0000003d;height:35px;opacity:0;overflow:hidden;position:absolute;right:60px;top:10px;transition:all .3s cubic-bezier(.25,.8,.25,1);width:35px}.download-link:hover{box-shadow:0 14px 28px #00000040,0 10px 10px #00000038}.download-link:after{background:#ffffff4d;border-radius:100%;content:\"\";height:5px;left:0;opacity:0;position:absolute;top:0;transform:scale(1) translate(-50%);transform-origin:50% 50%;width:100%}.download-link:focus:not(:active):after{animation:ripple 1s ease-out}.image:hover .download-link{opacity:1}"

  addStyle(css_248z)

  const CLASSES = {
    processed: 'js-has-download-button',
  }

  function createDownloadLink(imgContainer) {
    imgContainer.classList.add(CLASSES.processed)

    const gifLink = imgContainer.querySelector('a.video_gif_source')

    if (gifLink) {
      gifLink.setAttribute('download', '')

      return
    }

    let imgURL = ''
    const imgLink = imgContainer.querySelector('a')

    if (imgLink) {
      imgURL = imgLink.href
    } else {
      const img = imgContainer.querySelector('img')

      if (img) {
        imgURL = img.src
      }
    }

    if (!imgURL) {
      return
    }

    const link = document.createElement('a')

    link.classList.add('download-link')
    link.setAttribute('href', imgURL)
    link.setAttribute('download', '')

    imgContainer.append(link)
  }

  dom.on(
    document.body,
    'mouseover',
    `.image:not(.${CLASSES.processed})`,
    createDownloadLink
  )
})()
