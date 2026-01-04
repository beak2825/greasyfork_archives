// ==UserScript==
// @name    Add Sourcegraph Button to GitHub (updated)
// @description Add a 'Sourcrgraph' Button on GitHub repository & file page.
// @version 5
// @grant   none
// @inject-into auto
// @supportURL https://github.com/whtsky/userscripts/issues
// @match   https://github.com/*
// @namespace https://greasyfork.org/users/164794
// @downloadURL https://update.greasyfork.org/scripts/543304/Add%20Sourcegraph%20Button%20to%20GitHub%20%28updated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543304/Add%20Sourcegraph%20Button%20to%20GitHub%20%28updated%29.meta.js
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
    document.querySelector('#repository-details-container')
  if (targetBtn) {
    /**
     * @type {HTMLAnchorElement}
     */
    const newBtn = document.createElement('a')
    newBtn.id = buttonID
    newBtn.href = getSourceGraphUrl()
    // rounded Square border, line height 28px, svg is centered
    newBtn.style="display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border:1px solid #ccc; border-radius:4px;"
    // blocked: csp (Content Security Policy), github has banned cross-site request for img src url, use svg or base64, <svg> elements may not be displayed, width should be specified explicitly.
    newBtn.innerHTML = `
      <svg
          xmlns="http://www.w3.org/2000/svg" fill="#FF5543" viewBox="0 0 24 24" width="80%" height="80%">
          <path d="m9.663 6.991 3.238.862L10.8 0 7.065 1.005l1.227 4.611c.178.67.704 1.197 1.371 1.375M10.894 15.852l.1-.099.037.135L13.2 24l3.735-1.005-.914-3.434-2.443-9.15L.993 7.058 0 10.81l8.103 2.165.134.037-.097.099-5.94 5.944 2.729 2.752zM16.131 11.086l.867 3.25c.18.67.705 1.197 1.374 1.375l4.637 1.233.992-3.753-7.868-2.105zM15.464 8.522l1.824.067h.07c.515 0 1-.201 1.363-.567l3.077-3.08-2.728-2.751-2.987 2.982a1.94 1.94 0 0 0-.57 1.329l-.05 2.02"/>
      </svg>
    `
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
