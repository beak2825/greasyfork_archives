// ==UserScript==
// @name         Add CircleCI Workflows Link
// @namespace    https://github.com/matzkoh
// @version      1.0.2
// @description  現在のブランチにおける CircleCI Workflows ページへのリンクを追加する
// @author       matzkoh
// @match        https://github.com/*/*/pull/*
// @downloadURL https://update.greasyfork.org/scripts/377209/Add%20CircleCI%20Workflows%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/377209/Add%20CircleCI%20Workflows%20Link.meta.js
// ==/UserScript==

function $b64d7b61b1022cc4$export$f22da7240b7add18(path, rule) {
  const matches = path.match(rule.match)
  const userName = rule.getUserName(matches)
  const repoName = rule.getRepoName(matches)
  const branchName = rule.getBranchName(matches)
  const btn = document.createElement('a')
  btn.textContent = 'CircleCI Workflows'
  btn.href = `https://app.circleci.com/pipelines/github/${userName}/${repoName}?branch=${encodeURIComponent(
    branchName,
  )}`
  btn.target = '_blank'
  btn.style.display = 'inline-block'
  btn.style.height = '20px'
  btn.style.lineHeight = '20px'
  btn.style.paddingLeft = '20px'
  btn.style.background = 'url("https://avatars0.githubusercontent.com/ml/7?s=16") left center no-repeat'
  rule.insertButton(btn)
}

const $ac3fdcd981491f74$var$rules = [
  {
    // プルリク
    match: /([^/]+)\/(([^/]+))\/pull\//,
    getUserName(matches) {
      return matches[1]
    },
    getRepoName(matches) {
      return matches[2]
    },
    getBranchName() {
      return document.querySelector('clipboard-copy[value]').value
    },
    insertButton(btn) {
      const sidebar = document.getElementById('partial-discussion-sidebar')
      const sidebarItem = document.createElement('div')
      sidebarItem.className = 'discussion-sidebar-item'
      const header = document.createElement('div')
      header.className = 'discussion-sidebar-heading text-bold'
      header.textContent = 'CircleCI'
      sidebarItem.appendChild(header)
      btn.classList.add('text-inherit')
      btn.classList.add('text-bold')
      btn.textContent = 'Workflows'
      sidebarItem.appendChild(btn)
      sidebar.insertBefore(sidebarItem, sidebar.firstChild)
    },
  },
]
const { pathname: $ac3fdcd981491f74$var$path } = location
const $ac3fdcd981491f74$var$rule = $ac3fdcd981491f74$var$rules.find(({ match: match }) =>
  match.test($ac3fdcd981491f74$var$path),
)
if ($ac3fdcd981491f74$var$rule)
  (0, $b64d7b61b1022cc4$export$f22da7240b7add18)($ac3fdcd981491f74$var$path, $ac3fdcd981491f74$var$rule)
