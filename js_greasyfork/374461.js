// ==UserScript==
// @name         github_copy
// @version      0.0.2
// @include      http*://github.com/*
// @description  copy button
// @namespace    https://greasyfork.org/users/164996a
// @downloadURL https://update.greasyfork.org/scripts/374461/github_copy.user.js
// @updateURL https://update.greasyfork.org/scripts/374461/github_copy.meta.js
// ==/UserScript==
const init = () => {
  const a = document.querySelector('.repository-content  .BtnGroup + div')
  const b = document.querySelectorAll(
    'table.js-file-line-container td.js-file-line'
  )
  if (!a || !b || b.length === 0) return
  a.insertAdjacentHTML(
    'beforeend',
    `<button class="btn-octicon" aria-label="copy">
    <svg class="octicon octicon-clippy" viewBox="0 0 14 17" version="1.1" width="14" height="17" aria-hidden="true">
      <path fill-rule="evenodd" d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"></path>
    </svg>
  </button>`
  )
  const c = a.lastElementChild
  let d
  c.addEventListener('click', () => {
    d =
      d ||
      [...b].reduce(
        (a, c) => a + c.innerText + (c.innerText[0] === '\n' ? '' : '\n'),
        ''
      )
    navigator.clipboard.writeText(d)
  })
}

init()
document.addEventListener('pjax:success', () => init())
