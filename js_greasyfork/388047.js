// ==UserScript==
// @name improved GitLab blame
// @namespace https://franklinyu.gitlab.io
// @description add link to skip a certain commit
// @version 0.1
// @match https://gitlab.com/*/blame/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/388047/improved%20GitLab%20blame.user.js
// @updateURL https://update.greasyfork.org/scripts/388047/improved%20GitLab%20blame.meta.js
// ==/UserScript==

if (!Array.prototype.last){
  Array.prototype.last = function() {
    return this[this.length - 1]
  }
}

const projectName = encodeURIComponent(location.pathname.split('/blame')[0].slice(1))
const commits = document.getElementsByClassName('commit-sha')

;(async () => {
  for (const commit of commits) {
    const sha1 = commit.href.split('/').last()
    const resp = await fetch(`https://gitlab.com/api/v4/projects/${projectName}/repository/commits/${sha1}`)
    const jsonResp = await resp.json()
    if (jsonResp.parent_ids.length === 1) {
      const anchor = document.createElement('a')
      anchor.href = location.href.replace(/\/blame\/[\w-]+\//, `/blame/${jsonResp.parent_ids[0]}/`)
      anchor.innerText = 'prev'
      const floatRight = document.createElement('div')
      floatRight.classList.add('float-right')
      floatRight.append(anchor, '\u00A0')
      commit.parentElement.parentElement.nextElementSibling.append(floatRight)
    }
  }
})()
