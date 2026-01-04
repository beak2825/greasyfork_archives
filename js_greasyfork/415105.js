// ==UserScript==
// @name         OPS :: Send FL tokens from forum post or torrent comment
// @description  Send FL tokens to others directly from their forum post or torrent comment.
// @version      0.17
// @author       illmatic
// @match        https://orpheus.network/forums.php?*action=viewthread&threadid=*
// @match        https://orpheus.network/torrents.php?id=*
// @run-at       document-end
// @namespace https://greasyfork.org/users/699830
// @downloadURL https://update.greasyfork.org/scripts/415105/OPS%20%3A%3A%20Send%20FL%20tokens%20from%20forum%20post%20or%20torrent%20comment.user.js
// @updateURL https://update.greasyfork.org/scripts/415105/OPS%20%3A%3A%20Send%20FL%20tokens%20from%20forum%20post%20or%20torrent%20comment.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(() => {
  'use strict';

  const postIds = document.querySelectorAll('.post_id');
  const myName = document.querySelector('#nav_userinfo > a.username').textContent;
  const myAuth = document.querySelector('link[href*="feeds"]').href.split('authkey=')[1].split("&auth=")[0]

  const sendToken = async (e) => {
    if (!confirm("Are you sure you want to send your token(s)?")) return;
    e.target.removeEventListener("click", sendToken)
    let fltype = 'fl-other-1';
    if (e.target.textContent == '5 Tokens') {
      fltype = 'fl-other-4';
    } else if (e.target.textContent == '10 Tokens') {
      fltype = 'fl-other-2';
    }
    e.target.textContent = 'SENDING ...'
    const data = new FormData();
    data.append('fltype', fltype)
    data.append('flsubmit', 'Send')
    data.append('action', 'fltoken')
    data.append('auth', myAuth)
    fetch(`/user.php?id=${e.target.id}`, {
      method: 'POST',
      body: data
    })
    .then(response => {
      if (!response.ok) {
        const errorText = response.status == 500 ? "User does not accept FL Tokens." : response.statusText;
        e.target.textContent = 'FAILED'
        throw Error(errorText);
      }
      return response;
    })
    .then(response => {
      e.target.textContent = 'SENT'
      e.target.removeAttribute('href')
      e.target.style.pointerEvents = 'none'
      e.target.style.cursor = 'default'
    })
    .catch(error => alert(error));
  };

  postIds.forEach(post => {
    const user = post.parentNode.querySelector('a[href*="user.php?id="]');
    if (user.textContent == myName) return;
    const userId = user.href.split('?id=')[1];
    const quote = post.closest('td').querySelector('a.brackets');
    const token1 = `<a href="#noop" id="${userId}" class="brackets send-token">1 Token</a>`
    const token5 = `<a href="#noop" id="${userId}" class="brackets send-token">5 Tokens</a>`
    const token10 = `<a href="#noop" id="${userId}" class="brackets send-token">10 Tokens</a>`
    quote.insertAdjacentHTML("afterend", ` - ${token1} - ${token5} - ${token10}`);
  });

  [...document.getElementsByClassName('send-token')].forEach(elem => {
    elem.addEventListener('click', sendToken)
  });
})();
