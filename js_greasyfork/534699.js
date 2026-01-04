// ==UserScript==
// @name        MAM: Apply Seedtime Fix Button
// @description Adds an apply seedtime fix button (🧹 icon/link) on the User Snatch Summary page, right by the download button of unsatisfied sections of the user snatch summary page.
// @namespace   Violentmonkey Scripts
// @homepage    https://github.com/k0r302/mam-apply-seedtime-fix-button
// @homepageURL https://github.com/k0r302/mam-apply-seedtime-fix-button
// @match       https://www.myanonamouse.net/snatch_summary.php*
// @grant       none
// @version     1.0.0
// @author      k0r302
// @license      MIT
// @description 5/2/2025, 12:02:40 AM
// @downloadURL https://update.greasyfork.org/scripts/534699/MAM%3A%20Apply%20Seedtime%20Fix%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/534699/MAM%3A%20Apply%20Seedtime%20Fix%20Button.meta.js
// ==/UserScript==

let loaded = [];

function loadScript(tableId) {
  if (loaded.indexOf(tableId) > -1) {
    return;
  }
  loaded.push(tableId);

  $(`#${tableId} .torTitle`).each((l, elm) => {
    let torId = elm.href.match(/\/t\/([0-9]+)/g).toString().replace('/t/', '');
    let torTitle = elm.innerText;
    let torFullname = `${torTitle} (id: ${torId})`
    let cleanButton = $('<a href="#" title="Apply Seedtime Fix for 1000 bonus points">🧹</a>');
    cleanButton.on('click', async function (e) {
      e.preventDefault();

      if (confirm(`Are you sure you want to apply seedtime fix for 1000 bonus points for the torrent: ${torFullname}`)) {
        let url = `https://www.myanonamouse.net/json/bonusBuy.php/?spendtype=seedtime&tid=${torId}&_=${Date.now()}`;
        console.log(url)
        const response = await fetch(url, {
          "credentials": "include",
          "referrer": "https://www.myanonamouse.net/store.php",
          "method": "GET",
          "mode": "cors"
        });

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();

        if (json.error) {
          alert(`Error: ${json.error}`);
        } else {
          alert(`Success! Seedtime fix applied for: ${torFullname}`);
          window.location.reload();
        }
      }
    });
    $(elm).closest('tr').find('.directDownload').closest('td').append(cleanButton);
  })
}

window.setInterval(() => {
  if ($('#kaseedUnsat .torTitle').length > 0) {
    loadScript('kaseedUnsat');
  }

  if ($('#kaunsat .torTitle').length > 0) {
    loadScript('kaunsat');
  }

  if ($('#kainactUnsat .torTitle').length > 0) {
    loadScript('kainactUnsat');
  }
}, 500)