// ==UserScript==
// @name        Display PR author email
// @namespace   tw.neocloud.pr-email
// @match       https://github.com/NeoCloud/NeoNetwork/pull/*
// @grant       none
// @version     1.0
// @author      Outvi V <oss@outv.im>
// @description 8/8/2021, 2:45:11 PM
// @downloadURL https://update.greasyfork.org/scripts/430484/Display%20PR%20author%20email.user.js
// @updateURL https://update.greasyfork.org/scripts/430484/Display%20PR%20author%20email.meta.js
// ==/UserScript==

"use strict";

(async () => {
  const url = new URL(window.location).pathname
  const matches = url.match(/\/(.+)\/(.+)\/pull\/([0-9]+)/)
  const owner = matches[1]
  const repo = matches[2]
  const pr = matches[3]
  const commits = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pr}/commits`)
    .then(x => x.json())
  const emails = commits.map(x => x.commit.author.email)
  
  document.querySelectorAll(".js-commit-group-commits .d-flex.flex-auto .text-right.pr-1").forEach(
    (item, index) => {
      const v = document.createElement("span")
      v.innerHTML = emails[index]
      item.parentNode.insertBefore(v, item)
    }
  )
})()