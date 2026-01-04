// ==UserScript==
// @name        Highlight Top 3 Torrents and Hide Lossy Torrents on RED and OPS.
// @namespace   userscript1
// @match       http*://*redacted.ch/torrents.php*id=*
// @match       http*://*orpheus.network/torrents.php*id=*
// @version     0.1
// @description Colors of Top 3 are green, blue, orange.
// @downloadURL https://update.greasyfork.org/scripts/440100/Highlight%20Top%203%20Torrents%20and%20Hide%20Lossy%20Torrents%20on%20RED%20and%20OPS.user.js
// @updateURL https://update.greasyfork.org/scripts/440100/Highlight%20Top%203%20Torrents%20and%20Hide%20Lossy%20Torrents%20on%20RED%20and%20OPS.meta.js
// ==/UserScript==

(function () {
  document
    .querySelectorAll("tr.torrent_row, tr.group_torrent")
    .forEach((a) => check(a));

  function check(a) {
    if (a.querySelector(".edition_info") || a.textContent.includes("Lossless"))
      return;

    a.parentNode.removeChild(a);
  }

  let alltorrents = [];

  let torrentlist = document.querySelectorAll(
    "tr.torrent_row, tr.group_torrent"
  );

  for (let [_, val] of torrentlist.entries()) {

    let selector = val.querySelector("td:nth-child(4)");

    if (selector != null) {
      // console.log(val.querySelector("td:nth-child(4)").innerText)
      alltorrents.push({
        seed_count: selector.innerText,
        parent_id: selector.parentElement.id,
      });
    }
  }

  let [first, second, third] = alltorrents.sort(
    (a, b) => b.seed_count - a.seed_count
  );

  function setColor(id, color, index) {
    let ele = document.getElementById(id);
    ele.style.backgroundColor = color;

    // console.log(`%c${ele.previousElementSibling.innerText}`, `color:${color}; font-size: ${20 - index * 2}px;`)
  }

  setColor(first.parent_id, "rgb(22 101 52 / 25%)", 1)
  setColor(second.parent_id, "rgb(29 78 216 / 16%)", 2)
  setColor(third.parent_id, "rgb(180 83 9 / 18%)", 3)

})();
