// ==UserScript==
// @name        Masiro Block User
// @namespace   Violentmonkey Scripts
// @license     GPL
// @match       *://masiro.me/*
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM.getValue
// @grant       GM.setValue
// @version     1.0
// @author      Hou Rui
// @description 31/03/2023, 5:40:10 am
// @downloadURL https://update.greasyfork.org/scripts/485409/Masiro%20Block%20User.user.js
// @updateURL https://update.greasyfork.org/scripts/485409/Masiro%20Block%20User.meta.js
// ==/UserScript==

let config = new GM_config({
  'id': 'MisiroBlockUserConfig',
  'title': 'Masiro Block User',
  'fields': {
    'blockedUsers': {
      'label': '每行输入一个用户名',
      'section': ['屏蔽用户列表'],
      'type': 'textarea',
    }
  },
  'events': {
    'init': loadConfig,
    'save': loadConfig,
  },
  'css': '#MisiroBlockUserConfig textarea { width: 100%; height: 70%; }'
})

function loadConfig() {
  let blockNames = config.get('blockedUsers').split('\n').map(line => line.trim())
  console.log(`Blocked users: ${blockNames}`)

  let contentBlocks = document.querySelectorAll('span.reply_content, div.comment-content')
  for (let block of contentBlocks) {
    let attrs = block.attributes['data-name']
    if (attrs === undefined) {
      return;
    }
    let userName = attrs.value
    if (blockNames.includes(userName)) {
      block.innerHTML = '[已屏蔽]'
      let sibling = block.parentElement.nextElementSibling
      if (sibling === null) {
        return;
      }
      if (sibling.className === 'reply_list') {
        sibling.innerHTML = ''
      }
    }
  }
}

let commentButton = document.getElementById('comment-btn')
let configButton = document.createElement('button')

configButton.classList.add('btn', 'btn-primary')
configButton.textContent = '屏蔽设置'
configButton.style.float = 'right'
configButton.style.padding = commentButton.style.padding;
configButton.style.marginRight = commentButton.style.marginRight;
configButton.style.fontSize = commentButton.style.fontSize;
configButton.onclick = () => config.open()

commentButton.parentNode.appendChild(configButton)
