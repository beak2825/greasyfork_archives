// ==UserScript==
// https://github.com/hannsen/userscripts
// @name        Rutorrent GetMulitpleTorrents
// @namespace   rutorrent
// @description gets multiple torrents which you select in rutorrent
// @include     http://*ruTorrent*
// @include     https://*ruTorrent*
// @version     3.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29658/Rutorrent%20GetMulitpleTorrents.user.js
// @updateURL https://update.greasyfork.org/scripts/29658/Rutorrent%20GetMulitpleTorrents.meta.js
// ==/UserScript==

const nav_bar = document.getElementById("t");

const unfoldLink = document.createElement('a');
const newHTML = document.createElement('div');
newHTML.id = 'moved';
unfoldLink.appendChild(newHTML);
unfoldLink.id = 'grab';
unfoldLink.title = 'Download selected torrent files';
unfoldLink.href = 'javascript:void(0)';

if (nav_bar) {
  nav_bar.appendChild(unfoldLink);
  document.getElementById('grab').addEventListener('click', getTorrents, false);
}

function getTorrents() {
  const selected = document.getElementsByClassName("selected");
  let dl_link = 'plugins/source/action.php';

  if ('/' != window.location.toString().slice(-1)) {
    dl_link = '/' + dl_link;
  }

  function downloadTorrent(hash) {
    const form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", dl_link);
    form.setAttribute("target", "_blank");

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "hash";
    input.value = hash;
    form.appendChild(input);

    document.body.appendChild(form);

    form.submit();

    document.body.removeChild(form);
  }

  for (let i = 0; i < (selected.length - 1); i++) {
    let hash = selected[i].id;
    if (hash && hash.match(/[A-F0-9]{40}/i)) {
      downloadTorrent(hash);
    }
  }
}
