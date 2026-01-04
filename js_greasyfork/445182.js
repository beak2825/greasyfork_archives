// ==UserScript==
// @name        Delete all reddit comments
// @namespace   Violentmonkey Scripts
// @match       https://www.reddit.com/user/*/comments
// @match       https://old.reddit.com/user/*/comments
// @grant       none
// @version     1.1
// @author      -
// @license     MIT
// @description Delete all your comments in reddit, navigate to https://www.reddit.com/user/{YOUR USERNAME}/comments, and reload. Only compatible with old reddit interface. Switch to old interface before using.
// @downloadURL https://update.greasyfork.org/scripts/445182/Delete%20all%20reddit%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/445182/Delete%20all%20reddit%20comments.meta.js
// ==/UserScript==

async function del_comments_curr_page() {
  let tab = document.getElementById('siteTable');
  let top_list = tab.getElementsByClassName('thing');

  // Add random interval to avoid bot detection.
  function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function remove() {
      for (let i = 0;i < top_list.length;i++){
          let del_form = top_list[i].getElementsByClassName('toggle del-button')[0];
          let del_but = del_form.getElementsByClassName('togglebutton')[0];
          console.log(i)
          console.log(del_but)
          del_but.click();
          await sleep(Math.floor(Math.random()*300 + 300));
          let yes_but = del_form.getElementsByClassName('yes')[0];
          console.log(yes_but);
          yes_but.click()
          await sleep(Math.floor(Math.random()*300 + 300));
      }
  }

  await remove();
  //reload page to load new comments to delete
  window.location.reload();
}

window.addEventListener('load', function () {
  del_comments_curr_page();
}, false)