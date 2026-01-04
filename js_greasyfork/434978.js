// ==UserScript==
// @name         block user in e-hentai forum
// @version      0.0.1
// @description  e站论坛屏蔽指定用户
// @author       ayase
// @match        https://forums.e-hentai.org/*
// @require https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.js
// @run-at document-end
// @namespace https://greasyfork.org/users/298898
// @downloadURL https://update.greasyfork.org/scripts/434978/block%20user%20in%20e-hentai%20forum.user.js
// @updateURL https://update.greasyfork.org/scripts/434978/block%20user%20in%20e-hentai%20forum.meta.js
// ==/UserScript==

(() => {
  const blockList = ['shellgot']
  const main = async () => {

    const blockedUsers = new Map()
    for (const name of blockList) {
      blockedUsers.set(name, true)
    }

    for (const node of Array.from(document.querySelectorAll('.borderwrap table'))) {
      const username = node.querySelector('.bigusername')?.textContent
      if (blockedUsers.get(username)){
        node.innerHTML = `<div class="post1">user ${username} has been blocked</div>`
      }
      
    }
  };

  main();
})();
