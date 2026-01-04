// ==UserScript==
// @name    Add Sourcegraph Button to GitHub
// @description Add a 'Sourcrgraph' Button on GitHub repository & file page.
// @version 5
// @grant   none
// @inject-into auto
// @supportURL https://github.com/whtsky/userscripts/issues
// @match   https://github.com/*
// @namespace https://greasyfork.org/users/164794
// @downloadURL https://update.greasyfork.org/scripts/392250/Add%20Sourcegraph%20Button%20to%20GitHub.user.js
// @updateURL https://update.greasyfork.org/scripts/392250/Add%20Sourcegraph%20Button%20to%20GitHub.meta.js
// ==/UserScript==

const pats = [
  ['^/([^/]+)/([^/]+)/tree/([^/]+)$', '/github.com/$1/$2@$3'],
  ['^/([^/]+)/([^/]+)/tree/([^/]+)/(.+)$', '/github.com/$1/$2@$3/-/tree/$4'],
  ['^/([^/]+)/([^/]+)/blob/([^/]+)/(.+)$', '/github.com/$1/$2@$3/-/blob/$4'],
  ['^/([^/]+)/([^/]+)/?$', '/github.com/$1/$2'],
  ['^/([^/]+)/?$', '/$1'],
].map(([reg, replaceValue]) => ({
  regexp: new RegExp(reg),
  replaceValue,
}))

const buttonID = 'userscript__sourcegraph'

function getSourceGraphUrl() {
  var pathname = window.location.pathname
  for (const { regexp, replaceValue } of pats) {
    if (pathname.match(regexp)) {
      const pathname2 = pathname.replace(regexp, replaceValue)
      return 'https://sourcegraph.com' + pathname2
    }
  }
}

/**
 * @returns {HTMLAnchorElement | null}
 */
function getCreatedButton() {
  return document.querySelector(`#${buttonID}`)
}

function createButton() {
  if (getCreatedButton()) {
    return
  }

  const targetBtn =
    document.querySelector('#raw-url') ||
    document.querySelector('.file-navigation a.BtnGroup-item') ||
    document.querySelector('.file-navigation a.d-md-block')
  if (targetBtn) {
    /**
     * @type {HTMLAnchorElement}
     */
    const newBtn = targetBtn.cloneNode(false)
    newBtn.setAttribute('id', buttonID)
    newBtn.textContent = 'Sourcegraph'
    newBtn.href = getSourceGraphUrl()
    targetBtn.parentNode.insertBefore(newBtn, targetBtn)
  }
}

window.addEventListener('popstate', function() {
  const button = getCreatedButton()
  if (button) {
    button.href = getSourceGraphUrl()
  }
})

const observer = new MutationObserver(function() {
  observer.disconnect()
  createButton()
  observer.observe(document.body, { childList: true, subtree: true })
})
observer.observe(document.body, { childList: true, subtree: true })

createButton()
